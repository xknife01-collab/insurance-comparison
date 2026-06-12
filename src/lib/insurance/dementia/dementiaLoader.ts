import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

function parseAmount(amtStr: string | null): number {
  if (!amtStr) return 0;
  const clean = amtStr.replace(/,/g, '').trim();

  // Percentage match (e.g. 보험가입금액의 300%)
  const percentMatch = clean.match(/(\d+)\s*%/);
  if (percentMatch) {
    const pct = parseInt(percentMatch[1], 10);
    if (clean.includes('보험가입금액')) {
      return pct * 100000; // assume base is 1,000만원 (10,000,000 KRW)
    }
  }

  // Match: X억
  const okMatch = clean.match(/(\d+)\s*억/);
  if (okMatch) return parseInt(okMatch[1], 10) * 100000000;

  // Match: X천만 / X천만원
  const cheonMatch = clean.match(/(\d+)\s*(?:천만원|천만)/);
  if (cheonMatch) return parseInt(cheonMatch[1], 10) * 10000000;

  // Match: X백만 / X백만원
  const baekMatch = clean.match(/(\d+)\s*(?:백만원|백만)/);
  if (baekMatch) return parseInt(baekMatch[1], 10) * 1000000;

  // Match: X십만 / X십만원
  const sipMatch = clean.match(/(\d+)\s*(?:십만원|십만)/);
  if (sipMatch) return parseInt(sipMatch[1], 10) * 100000;

  // Match: X만 / X만원
  const manMatch = clean.match(/(\d+)\s*(?:만원|만)/);
  if (manMatch) return parseInt(manMatch[1], 10) * 10000;

  // Fallback to first digit in the string
  const fallbackMatch = clean.match(/(\d+)/);
  if (fallbackMatch) {
    return parseInt(fallbackMatch[1], 10);
  }

  return 0;
}

/**
 * 치매 간병보험 전용 실시간 요율 계산 로더
 * 데이터베이스의 개별 특약 요율을 가져와 가입 금액(진단비, 생활비) 및 선호 서비스 형태(재가/시설)에 따라
 * 실시간 시뮬레이션하여 최적의 추천 결과를 반환합니다.
 */
export async function fetchDementiaPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;

    const dementiaConfig = (analysis as any).caregiving || {
      dementiaDiagnosis: 30000000,
      monthlyAllowance: 500000,
      preferredService: 'home',
      hasProxyClaim: true,
      hasDementiaHistory: false,
      hasLtcGrade: false
    };

    const diagAmount = dementiaConfig.dementiaDiagnosis || 30000000;
    const allowanceAmount = dementiaConfig.monthlyAllowance || 500000;
    const prefService = dementiaConfig.preferredService || 'home';
    const hasHistory = !!dementiaConfig.hasDementiaHistory;
    const hasLtc = !!dementiaConfig.hasLtcGrade;

    // 1. Fetch all detailed rates from Supabase
    const { data: rates, error } = await supabase
      .from('insurance_dementia_rates')
      .select('*');

    if (error || !rates || rates.length === 0) {
      console.error('[Dementia Loader] Error fetching rates:', error);
      return null;
    }

    // 2. Group rates by company and product
    const productGroups = new Map<string, {
      companyName: string;
      productName: string;
      appliedRate: string;
      riders: any[];
    }>();

    rates.forEach(r => {
      const key = `${r.company_name}__${r.product_name}`;
      if (!productGroups.has(key)) {
        productGroups.set(key, {
          companyName: r.company_name,
          productName: r.product_name,
          appliedRate: r.applied_rate,
          riders: []
        });
      }
      productGroups.get(key)!.riders.push(r);
    });

    // 3. Calculate premium for each product based on sliders and underwriting
    const results: any[] = [];

    // ★ 공시 보험료는 40세 기준으로 산출됨. 다른 나이대는 ageRatio로 보정 필수.
    const getAgeMultiplier = (age: number): number => {
      if (age <= 20) return 0.3;
      if (age <= 30) {
        const pct = (age - 20) / 10;
        return 0.3 + 0.3 * pct; // 20세: 0.3 → 30세: 0.6
      }
      if (age <= 40) {
        const pct = (age - 30) / 10;
        return 0.6 + 0.4 * pct; // 30세: 0.6 → 40세: 1.0
      }
      if (age <= 50) {
        const pct = (age - 40) / 10;
        return 1.0 + 0.6 * pct; // 40세: 1.0 → 50세: 1.6
      }
      if (age <= 60) {
        const pct = (age - 50) / 10;
        return 1.6 + 1.2 * pct; // 50세: 1.6 → 60세: 2.8
      }
      if (age <= 70) {
        const pct = (age - 60) / 10;
        return 2.8 + 2.0 * pct; // 60세: 2.8 → 70세: 4.8
      }
      if (age <= 80) {
        const pct = (age - 70) / 10;
        return 4.8 + 1.7 * pct; // 70세: 4.8 → 80세: 6.5
      }
      return 6.5;
    };
    const ageRatio = getAgeMultiplier(targetAge);

    // 유연사 할증 보정 (치매 병력/LTC등급 보유 시)
    let underwritingMultiplier = 1.0;
    if (hasHistory) underwritingMultiplier *= 1.35;
    if (hasLtc) underwritingMultiplier *= 1.50;

    productGroups.forEach((group) => {
      let totalPremium = 0;
      const includedRiders: string[] = [];

      // Resolve product-level diagnosis base payout first
      // ★ 업로드 시 모든 프리미엄이 1,000만원 기준으로 정규화됐으므로 기본값을 10,000,000으로 고정
      let productDiagPayout = 10_000_000; // 1,000만원 기준 고정
      let hasSevereDiag = false;
      let groupHasDiagnosis = false;

      group.riders.forEach(r => {
        const name = r.benefit_name || '';
        const amtStr = r.benefit_amount || r.insured_amount || '';
        let amtVal = parseAmount(amtStr);
        
        if (group.companyName === '메리츠화재' && amtVal === 110000000) {
          amtVal = 10000000;
        }

        const isDeath = name.includes('사망') || name.includes('재해사망') || name.includes('질병사망');
        if (isDeath) return;

        const isMonthly = name.includes('매월') || amtStr.includes('매월') || name.includes('매월지급') || name.includes('월지급형') || name.includes('월지급');
        const isLowAmtCaregiving = (name.includes('간병비') || name.includes('간병생활') || name.includes('생활자금')) && amtVal <= 2000000;

        const isAllowance = isMonthly || isLowAmtCaregiving || (
          !name.includes('진단') && 
          !name.includes('간병비') && 
          (name.includes('재가') || name.includes('시설') || name.includes('생활비') || name.includes('생활자금') || name.includes('생활') || name.includes('간병') || name.includes('요양'))
        );
        const isDiagnosis = !isAllowance && (name.includes('진단') || name.includes('경도') || name.includes('중증') || name.includes('치매'));

        if (isDiagnosis) {
          groupHasDiagnosis = true;
          // ★ 이미 1,000만원 기준 정규화됐으므로 10,000,000 고정값 사용
        }
      });

      // Group riders in the product that belong to the same package (same premium and division)
      // to avoid double-counting sub-benefits of the same main contract/rider.
      const packagesMap = new Map<string, {
        division: string;
        premiumMale: number;
        premiumFemale: number;
        appliedRate: string;
        riders: any[];
      }>();

      const zeroPremiumRiders: any[] = [];

      group.riders.forEach(r => {
        const pm = r.premium_male || 0;
        const pf = r.premium_female || 0;
        const div = r.division || '';
        const rate = r.applied_rate || '';
        
        if (pm === 0 && pf === 0) {
          zeroPremiumRiders.push(r);
        } else {
          const pkgKey = `${div}__${pm}__${pf}__${rate}`;
          if (!packagesMap.has(pkgKey)) {
            packagesMap.set(pkgKey, {
              division: div,
              premiumMale: pm,
              premiumFemale: pf,
              appliedRate: rate,
              riders: []
            });
          }
          packagesMap.get(pkgKey)!.riders.push(r);
        }
      });

      // Add zero-premium riders to each active package group
      packagesMap.forEach((pkg) => {
        pkg.riders.push(...zeroPremiumRiders);
      });

      packagesMap.forEach((pkg) => {
        const basePremium = dbGender === 'M' ? pkg.premiumMale : pkg.premiumFemale;
        if (basePremium === 0) return;

        // Filter riders in the package by user service preference (재가/시설)
        let activeRiders = pkg.riders;
        if (pkg.division === '특약') {
          activeRiders = pkg.riders.filter(r => {
            const name = r.benefit_name || '';
            if (name.includes('재가') && prefService === 'facility') return false;
            if (name.includes('시설') && prefService === 'home') return false;
            return true;
          });
        }

        if (activeRiders.length === 0) return;

        // Determine scaling factor based on the benefits included in this active package.
        let hasDiagnosis = false;
        let hasAllowance = false;

        let baseAllowancePayout = 1000000; // default 100만원

        activeRiders.forEach(r => {
          const name = r.benefit_name || '';
          const amtStr = r.benefit_amount || r.insured_amount || '';
          
          let amtVal = parseAmount(amtStr);
          if (group.companyName === '메리츠화재' && amtVal === 110000000) {
            amtVal = 10000000;
          }

          const isDeath = name.includes('사망') || name.includes('재해사망') || name.includes('질병사망');
          if (isDeath) return;

          const isMonthly = name.includes('매월') || amtStr.includes('매월') || name.includes('매월지급') || name.includes('월지급형') || name.includes('월지급');
          const isLowAmtCaregiving = (name.includes('간병비') || name.includes('간병생활') || name.includes('생활자금')) && amtVal <= 2000000;

          const isAllowance = isMonthly || isLowAmtCaregiving || (
            !name.includes('진단') && 
            !name.includes('간병비') && 
            (name.includes('재가') || name.includes('시설') || name.includes('생활비') || name.includes('생활자금') || name.includes('생활') || name.includes('간병') || name.includes('요양'))
          );
          const isDiagnosis = !isAllowance && (name.includes('진단') || name.includes('경도') || name.includes('중증') || name.includes('치매') || pkg.division === '주계약');
          
          if (isAllowance) {
            hasAllowance = true;
            if (amtVal >= 50000) baseAllowancePayout = amtVal;
          }
          if (isDiagnosis) {
            hasDiagnosis = true;
          }
          
          includedRiders.push(name);
        });

        // Fallback for products with no diagnosis riders at all: treat 주계약 as diagnosis-capable
        if (!groupHasDiagnosis && pkg.division === '주계약') {
          hasDiagnosis = true;
        }

        let diagScale = 1.0;
        let allowanceScale = 1.0;

        if (hasDiagnosis) {
          diagScale = Math.max(1.0, diagAmount / productDiagPayout);
        }
        if (hasAllowance) {
          allowanceScale = Math.max(1.0, allowanceAmount / baseAllowancePayout);
        }

        let maxScale = 1.0;
        if (hasDiagnosis && hasAllowance) {
          maxScale = Math.max(diagScale, allowanceScale);
        } else if (hasDiagnosis) {
          maxScale = diagScale;
        } else if (hasAllowance) {
          maxScale = allowanceScale;
        }

        // ★ 공시 보험료(40세 기준) × 보장금액 스케일 × 나이 보정 × 유연사 할증
        let riderPremium = Math.round(basePremium * maxScale * ageRatio * underwritingMultiplier);

        totalPremium += riderPremium;
      });

      // ★ 치매 진단비 담보가 전혀 없는 상품은 결과 제외
      // (납입면제/만기연장불가/체증불가 전용 종은 비교 대상 아님)
      const hasMeaningfulDiag = groupHasDiagnosis || 
        group.riders.some(r => {
          const n = (r.benefit_name || '').toLowerCase();
          return n.includes('치매') || n.includes('진단') || n.includes('경도') || n.includes('중증') || n.includes('간병');
        });
      
      if (totalPremium > 0 && hasMeaningfulDiag) {
        // ★ 최소 보험료 필터: 시장 기준 4만원대 미만 부분 라이더 제외
        const MIN_PREMIUM = 35_000;
        if (totalPremium >= MIN_PREMIUM) {
          results.push({
            premium: totalPremium,
            productName: group.productName,
            companyName: group.companyName,
            appliedRate: group.appliedRate,
            ridersCount: includedRiders.length
          });
        }
      }
    });

    // Sort by premium ascending
    results.sort((a, b) => a.premium - b.premium);

    if (results.length > 0) {
      return {
        premium: results[0].premium,
        productName: results[0].productName,
        companyName: results[0].companyName,
        _allOptions: results
      };
    }
    return null;
  } catch (e) {
    console.error('[Dementia Loader Critical Error]:', e);
    return null;
  }
}
