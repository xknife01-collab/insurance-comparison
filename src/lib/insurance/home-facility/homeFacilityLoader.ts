import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

function parseAmount(amtStr: string | null): number {
  if (!amtStr) return 0;
  const clean = amtStr.replace(/,/g, '').trim();

  // Percentage match
  const percentMatch = clean.match(/(\d+)\s*%/);
  if (percentMatch) {
    const pct = parseInt(percentMatch[1], 10);
    if (clean.includes('보험가입금액')) {
      return pct * 100000;
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

  const fallbackMatch = clean.match(/(\d+)/);
  if (fallbackMatch) {
    return parseInt(fallbackMatch[1], 10);
  }

  return 0;
}

/**
 * 재가/시설 간병보험 전용 실시간 요율 계산 로더
 */
export async function fetchHomeFacilityPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;

    const config = (analysis as any).nursing || {
      preferredService: 'both',
      homeAmount: 500000,
      facilityAmount: 500000,
      hasProxyClaim: true,
      hasBrainHistory: false,
      hasLtcHistory: false
    };

    const prefService = config.preferredService || 'both'; // 'home' | 'facility' | 'both'
    const homeAmount = config.homeAmount || 500000;
    const facilityAmount = config.facilityAmount || 500000;
    const hasHistory = !!config.hasBrainHistory;
    const hasLtc = !!config.hasLtcHistory;

    // Fetch rates from the DB
    const { data: rates, error } = await supabase
      .from('insurance_home_facility_rates')
      .select('*');

    if (error || !rates || rates.length === 0) {
      console.error('[HomeFacility Loader] Error fetching rates:', error);
      return null;
    }

    // Group rates by company and product
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

    const results: any[] = [];

    // Age multiplier helper
    const getAgeMultiplier = (age: number): number => {
      if (age <= 30) {
        // 20대 (20~30세): 0.65 ~ 0.80 보간
        const pct = Math.max(0, (age - 20) / 10);
        return 0.65 + 0.15 * pct;
      }
      if (age <= 40) {
        // 30대 (30~40세): 0.80 ~ 1.00 보간 (40세에 정확히 1.00 적용)
        const pct = (age - 30) / 10;
        return 0.80 + 0.20 * pct;
      }
      if (age <= 50) {
        // 40대 (40~50세): 1.00 ~ 1.50 보간
        const pct = (age - 40) / 10;
        return 1.00 + 0.50 * pct;
      }
      if (age <= 60) {
        // 50대 (50~60세): 1.50 ~ 3.00 보간
        const pct = (age - 50) / 10;
        return 1.50 + 1.50 * pct;
      }
      if (age <= 70) {
        // 60대 (60~70세): 3.00 ~ 4.50 보간
        const pct = (age - 60) / 10;
        return 3.00 + 1.50 * pct;
      }
      if (age <= 80) {
        // 70대 (70~80세): 4.50 ~ 6.00 보간
        const pct = (age - 70) / 10;
        return 4.50 + 1.50 * pct;
      }
      return 6.0;
    };
    const ageRatio = getAgeMultiplier(targetAge);

    let underwritingMultiplier = 1.0;
    if (hasHistory) underwritingMultiplier *= 1.35; // 뇌질환/치매 이력 시 35% 할증
    if (hasLtc) underwritingMultiplier *= 1.50; // 장기요양 등급 보유 시 50% 할증

    productGroups.forEach((group) => {
      let totalPremium = 0;
      const includedRiders: string[] = [];

      // Group riders by package to avoid double counting main contracts
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

      packagesMap.forEach((pkg) => {
        pkg.riders.push(...zeroPremiumRiders);
      });

      packagesMap.forEach((pkg) => {
        const basePremium = dbGender === 'M' ? pkg.premiumMale : pkg.premiumFemale;
        if (basePremium === 0) return;

        // Filter riders based on preferred service type (At-home vs Facility)
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

        let hasHomeRider = false;
        let hasFacilityRider = false;
        let baseHomePayout = 500000;
        let baseFacilityPayout = 500000;

        activeRiders.forEach(r => {
          const name = r.benefit_name || '';
          const amtStr = r.benefit_amount || r.insured_amount || '';
          const amtVal = parseAmount(amtStr);

          if (name.includes('재가')) {
            hasHomeRider = true;
            if (amtVal > 50000) baseHomePayout = amtVal;
          }
          if (name.includes('시설')) {
            hasFacilityRider = true;
            if (amtVal > 50000) baseFacilityPayout = amtVal;
          }
          includedRiders.push(name);
        });

        let scale = 1.0;
        if (hasHomeRider && hasFacilityRider) {
          scale = Math.max(homeAmount / baseHomePayout, facilityAmount / baseFacilityPayout);
        } else if (hasHomeRider) {
          scale = homeAmount / baseHomePayout;
        } else if (hasFacilityRider) {
          scale = facilityAmount / baseFacilityPayout;
        }

        // Bound scaling
        scale = Math.max(0.5, Math.min(3.0, scale));

        let riderPremium = Math.round(basePremium * scale * ageRatio * underwritingMultiplier);
        totalPremium += riderPremium;
      });

      if (totalPremium > 0) {
        results.push({
          premium: totalPremium,
          productName: group.productName,
          companyName: group.companyName,
          appliedRate: group.appliedRate,
          ridersCount: includedRiders.length
        });
      }
    });

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
    console.error('[HomeFacility Loader Critical Error]:', e);
    return null;
  }
}
