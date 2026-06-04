import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

export interface SavingsProduct {
  company: string;
  productName: string;
  savingType: 'installment' | 'lumpSum';
  declaredRate: number;      // 공시이율 (%)
  guaranteedRate: number;    // 최저보증이율 (%)
  businessFee: number;       // 사업비 (%)
  features?: string;         // 주요 특징
  hasUniversal: boolean;     // 유니버셜 기능 (추가납입 / 중도인출) 여부
}

export const fetchSavingsPremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const opts = analysis.savingsGeneral || {
    savingType: 'installment',
    monthlyPremium: 300000,
    paymentPeriod: 5,
    maintenancePeriod: 10,
    savingsObjective: 'wealth',
    hasUniversal: true
  };

  const selectedType = opts.savingType || 'installment';
  const premium = opts.monthlyPremium || 300000;
  const payYears = opts.paymentPeriod || 5;
  const keepYears = opts.maintenancePeriod || 10;

  // 비과세 충족 여부 체크
  // - 월 적립식: 5년 이상 납입 + 10년 이상 유지 + 월 150만 원 이하
  // - 일시납: 10년 이상 유지 + 총액 1억 원 이하
  // - 고령자 특례 (만 65세 이상, 총액 5,000만 원 이하 납입 시 비과세 종합저축 자동 적용)
  const isSenior = analysis.age >= 65;
  const payMonths = payYears * 12;
  const totalPrincipal = selectedType === 'installment' ? premium * payMonths : premium;

  let isTaxExempt = false;
  let isSeniorTaxExempt = false;

  if (selectedType === 'installment') {
    const regularExempt = payYears >= 5 && keepYears >= 10 && premium <= 1500000;
    const seniorExempt = isSenior && totalPrincipal <= 50000000;
    isTaxExempt = regularExempt || seniorExempt;
    isSeniorTaxExempt = !regularExempt && seniorExempt;
  } else {
    const regularExempt = keepYears >= 10 && premium <= 100000000;
    const seniorExempt = isSenior && premium <= 50000000;
    isTaxExempt = regularExempt || seniorExempt;
    isSeniorTaxExempt = !regularExempt && seniorExempt;
  }

  // 저축보험 상품 풀 (오프라인/CM 결합)
  let productsList: SavingsProduct[] = [
    {
      company: '교보라이프플래닛',
      productName: '(무)라이프플래닛b저축보험 (유니버셜)',
      savingType: 'installment',
      declaredRate: 3.15,
      guaranteedRate: 1.25,
      businessFee: 3.2,
      features: "인터넷 CM 전용 최저 수수료(사업비 3.2%) | 업계 최우수 공시이율 (3.15%) | 자유로운 추가납입(2배수) 및 중도인출",
      hasUniversal: true
    },
    {
      company: '삼성생명',
      productName: '인터넷 저축보험2.2 (무배당)',
      savingType: 'installment',
      declaredRate: 2.95,
      guaranteedRate: 1.00,
      businessFee: 3.8,
      features: "삼성생명 다이렉트 베스트셀러 | 높은 브랜드 안정성 | 모바일 전용 수수료(사업비 3.8%)",
      hasUniversal: true
    },
    {
      company: '한화생명',
      productName: '한화 e저축보험 (무배당)',
      savingType: 'installment',
      declaredRate: 2.90,
      guaranteedRate: 1.00,
      businessFee: 3.9,
      features: "한화생명 다이렉트 대표 저축상품 | 추가납입 한도 200% 활용가능 | 가입 1년 후부터 중도인출 수수료 면제",
      hasUniversal: true
    },
    {
      company: '동양생명',
      productName: '(무)수호천사온라인더좋은저축보험',
      savingType: 'installment',
      declaredRate: 2.85,
      guaranteedRate: 0.75,
      businessFee: 4.2,
      features: "예금자보호법 적용 저축보험 | 기본 계약 안전성 집중형 | 유니버셜 유연성 완비",
      hasUniversal: true
    },
    // 일시납 상품 목록
    {
      company: '교보라이프플래닛',
      productName: '(무)라플 일시납 저축보험 (비과세)',
      savingType: 'lumpSum',
      declaredRate: 2.90,
      guaranteedRate: 0.85,
      businessFee: 3.0,
      features: "일시납 거치식 자산 형성 집중 모델 | CM 전용 최저 수수료 (사업비 3.0%)",
      hasUniversal: false
    },
    {
      company: '삼성생명',
      productName: '인터넷 일시납 저축보험 (무배당)',
      savingType: 'lumpSum',
      declaredRate: 2.80,
      guaranteedRate: 0.75,
      businessFee: 3.5,
      features: "여유 자금 거치에 특화된 안정 추구형 일시납 모델 | 대기업 자산운용 시너지",
      hasUniversal: false
    },
    {
      company: '한화생명',
      productName: '한화 e일시납 저축보험 (무배당)',
      savingType: 'lumpSum',
      declaredRate: 2.75,
      guaranteedRate: 0.75,
      businessFee: 3.6,
      features: "목돈 거치를 통한 복리 극대화 | 10년 유지 시 비과세 혜택 자동 적용",
      hasUniversal: false
    }
  ];

  // Supabase DB 연동 체크 (유동적인 DB 연동을 위한 try-catch)
  try {
    const supabase = createClient();
    const { data: dbProducts, error } = await supabase
      .from('savings_products') // 일반 저축 전용 테이블 활용
      .select('company, product_name, interest_rate, features, saving_type');

    if (!error && dbProducts && dbProducts.length > 0) {
      const dbSavingsProducts: SavingsProduct[] = [];
      const seenProducts = new Set<string>();
      dbProducts.forEach(row => {
        const uniqueKey = `${row.company}_${row.product_name}`;
        if (seenProducts.has(uniqueKey)) return;
        seenProducts.add(uniqueKey);

        let rate = 2.80;
        if (row.interest_rate) {
          const parsed = parseFloat(row.interest_rate.replace(/%/g, '').trim());
          if (!isNaN(parsed)) rate = parsed;
        }
        
        const isCM = row.product_name.includes('다이렉트') || 
                     row.product_name.includes('인터넷') || 
                     row.product_name.includes('e-') || 
                     row.product_name.includes('온라인') || 
                     row.product_name.includes('b');
        
        const isLump = row.saving_type === 'lumpSum';
        const businessFee = isCM ? (isLump ? 3.0 : 3.5) : (isLump ? 4.0 : 5.0);

        dbSavingsProducts.push({
          company: row.company,
          productName: row.product_name,
          savingType: row.saving_type as 'lumpSum' | 'installment',
          declaredRate: rate,
          guaranteedRate: rate * 0.35,
          businessFee: businessFee,
          features: row.features || "가입 즉시 복리 부리 및 추가 납입 지원",
          hasUniversal: !isLump
        });
      });

      if (dbSavingsProducts.length > 0) {
        productsList = dbSavingsProducts;
      }
    }
  } catch (err) {
    console.warn('[Savings Loader DB Connect Fail] Using default savings products.', err);
  }

  // 선택된 가입 형태(적립식 / 일시납)에 따른 상품 필터링
  const filteredProducts = productsList.filter(p => p.savingType === selectedType);

  const results = filteredProducts.map(p => {
    // 시뮬레이션 복리 계산
    // 1. 사업비 차감 후 매월 순적립금 산출
    const monthlyNetPremium = selectedType === 'installment' 
      ? premium * (1 - p.businessFee / 100)
      : 0; // 일시납은 초기에 한번만 사업비 뗌

    const lumpSumPrincipal = selectedType === 'lumpSum' ? premium : 0;
    const lumpSumNet = selectedType === 'lumpSum' ? premium * (1 - p.businessFee / 100) : 0;

    const monthlyDeclaredRate = (p.declaredRate / 100) / 12;
    const monthlyGuaranteedRate = (p.guaranteedRate / 100) / 12;

    // 연령대별 위험보험료 가중치 산출
    // - 20대 (나이 < 30): ageFactor = 0.5
    // - 30대 (30 <= 나이 < 40): ageFactor = 1.0
    // - 40대 (40 <= 나이 < 50): ageFactor = 1.5
    // - 50대 (50 <= 나이 < 60): ageFactor = 2.5
    // - 60대 이상 (나이 >= 60): ageFactor = 4.0
    let ageFactor = 1.0;
    const age = analysis.age || 35;
    if (age < 30) {
      ageFactor = 0.5;
    } else if (age < 40) {
      ageFactor = 1.0;
    } else if (age < 50) {
      ageFactor = 1.5;
    } else if (age < 60) {
      ageFactor = 2.5;
    } else {
      ageFactor = 4.0;
    }

    // 성별 위험보험료 가중치 산출 (남성이 예정사망률이 높아 위험보험료 공제가 많음)
    const gender = analysis.gender || 'M';
    const genderFactor = gender === 'M' ? 1.2 : 0.9;

    // 기본 월 위험보험료율 (0.05%)
    const baseRiskRate = 0.0005;
    const riskPremiumRate = baseRiskRate * ageFactor * genderFactor;

    // 만기 시점(유지기간 keepYears) 자산 복리 적산
    let accumulatedDeclared = lumpSumNet;
    let accumulatedGuaranteed = lumpSumNet;
    const totalMonths = keepYears * 12;

    for (let m = 0; m < totalMonths; m++) {
      if (selectedType === 'installment') {
        const isPaying = m < payMonths;
        // 매월 위험보험료 차감 (위험보험료 = 기본 premium * 위험률)
        const monthlyRisk = isPaying ? premium * riskPremiumRate : 0;
        const addAmount = isPaying ? Math.max(0, monthlyNetPremium - monthlyRisk) : 0;
        accumulatedDeclared = (accumulatedDeclared + addAmount) * (1 + monthlyDeclaredRate);
        accumulatedGuaranteed = (accumulatedGuaranteed + addAmount) * (1 + monthlyGuaranteedRate);
      } else {
        // 일시납 거치형 복리
        // 매월 거치금액에서 위험보험료 분할 차감
        const monthlyRisk = (lumpSumPrincipal * riskPremiumRate) / 12;
        accumulatedDeclared = Math.max(0, accumulatedDeclared - monthlyRisk) * (1 + monthlyDeclaredRate);
        accumulatedGuaranteed = Math.max(0, accumulatedGuaranteed - monthlyRisk) * (1 + monthlyGuaranteedRate);
      }
    }

    // 환급률 (%)
    const refundRatio = totalPrincipal > 0 ? (accumulatedDeclared / totalPrincipal) * 100 : 0;
    const guaranteedRatio = totalPrincipal > 0 ? (accumulatedGuaranteed / totalPrincipal) * 100 : 0;

    // 일반 은행 적금/예금(단리 적용, 이자소득세 15.4% 부과) 대비 자산 형성 비교 계산
    // - 적금 금리 평균 3.5% 단리 가정
    let bankAccumulated = 0;
    if (selectedType === 'installment') {
      let bankPrincipal = 0;
      let totalBankInterest = 0;
      for (let m = 0; m < totalMonths; m++) {
        const isPaying = m < payMonths;
        if (isPaying) {
          bankPrincipal += premium;
          // 월별 이자 적산 (단리 3.5% = 연이율 3.5%)
          const monthsLeft = totalMonths - m;
          totalBankInterest += premium * (0.035 / 12) * monthsLeft;
        }
      }
      // 이자소득세 15.4% 차감
      const tax = totalBankInterest * 0.154;
      bankAccumulated = bankPrincipal + totalBankInterest - tax;
    } else {
      // 일반 은행 예금 일시 거치식 (연 3.2% 단리 가정)
      const totalInterest = premium * 0.032 * keepYears;
      const tax = totalInterest * 0.154;
      bankAccumulated = premium + totalInterest - tax;
    }

    // 절세 혜택 계산 (비과세 요건 달성 시 이자소득세 15.4%를 아끼는 부분 시각화)
    const insuranceInterest = Math.max(0, accumulatedDeclared - totalPrincipal);
    const savedTax = isTaxExempt ? insuranceInterest * 0.154 : 0;

    const detailDetails: Record<string, string> = {
      '가입 방식': selectedType === 'installment' ? '월 적립식 저축' : '거치식 일시납 저축',
      '총 납입 원금': `${Math.round(totalPrincipal / 10000).toLocaleString()}만원`,
      '공시이율 만기 환급금': `${Math.round(accumulatedDeclared / 10000).toLocaleString()}만원`,
      '예상 만기 환급률': `${refundRatio.toFixed(1)}%`,
      '비과세 혜택 여부': isTaxExempt 
        ? (isSeniorTaxExempt ? '고령자 특례 대상 (이자소득세 0%)' : '비과세 대상 (이자소득세 0%)')
        : '대상 제외 (일반과세)',
      '예상 절세 혜택 규모': `${Math.round(savedTax).toLocaleString()}원`,
    };

    return {
      premium: selectedType === 'installment' ? premium : 0,
      lumpSumPremium: selectedType === 'lumpSum' ? premium : 0,
      riskPremium: Math.round(totalPrincipal * (p.businessFee / 100) / totalMonths), // 월 환산 사업비
      savingsPremium: selectedType === 'installment' ? Math.round(premium * (1 - p.businessFee / 100)) : 0,
      productName: p.productName,
      companyName: p.company,
      planLevel: isTaxExempt 
        ? (isSeniorTaxExempt ? '만 65세 이상 고령자 비과세 종합저축 플랜' : '10년 비과세 혜택 플랜')
        : '단기 과세 목적 저축 플랜',
      details: detailDetails,
      accumulatedDeclared: Math.round(accumulatedDeclared),
      accumulatedGuaranteed: Math.round(accumulatedGuaranteed),
      bankAccumulated: Math.round(bankAccumulated),
      refundRatio: refundRatio,
      guaranteedRatio: guaranteedRatio,
      totalPrincipal: totalPrincipal,
      savedTax: savedTax,
      isTaxExempt: isTaxExempt,
      features: p.features || "",
      declaredRate: p.declaredRate,
      guaranteedRate: p.guaranteedRate,
      businessFee: p.businessFee,
      hasUniversal: p.hasUniversal
    };
  });

  // 환급률(또는 최종 적립액) 기준으로 내림차순 정렬
  results.sort((a, b) => b.accumulatedDeclared - a.accumulatedDeclared);
  const mainOption = results[0] || {
    premium: selectedType === 'installment' ? premium : 0,
    riskPremium: Math.round(premium * 0.04),
    savingsPremium: selectedType === 'installment' ? Math.round(premium * 0.96) : 0,
    productName: '비과세 저축보험',
    companyName: '라이프플래닛',
    _allOptions: []
  };

  return {
    premium: mainOption.premium,
    riskPremium: mainOption.riskPremium,
    savingsPremium: mainOption.savingsPremium,
    productName: mainOption.productName,
    companyName: mainOption.companyName,
    _allOptions: results.slice(0, 7)
  };
};
