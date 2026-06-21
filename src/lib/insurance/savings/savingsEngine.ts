import { RecommendationPlan } from '../../../types/insurance';

/**
 * 일반 저축보험 분석 엔진
 * 저축 형태(적립식/일시납), 납입/유지 기간, 유니버셜 기능 여부 등을 기반으로
 * 비과세 혜택 점수, 이율 안정성 점수, 수수료 효율 점수 및 3대 맞춤형 추천 플랜을 생성합니다.
 */
export const analyzeSavings = (analysis: any): any => {
  const options = (analysis._allOptions || []).map((o: any) => ({
    ...o,
    riskPremium: o.riskPremium || 5000,
    savingsPremium: o.savingsPremium || 95000,
    estimatedPremium: o.premium || 300000
  })) || [];

  const defaultOption = {
    premium: analysis._realDbPremium || 300000,
    riskPremium: 10000,
    savingsPremium: 290000,
    productName: analysis._productName || '(무)라이프플래닛b저축보험 (유니버셜)',
    companyName: analysis._companyName || '교보라이프플래닛',
    declaredRate: 3.15,
    guaranteedRate: 1.25,
    businessFee: 3.2,
    hasUniversal: true
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const savingsOpts = analysis.savingsGeneral || {
    savingType: 'installment',
    monthlyPremium: 300000,
    paymentPeriod: 5,
    maintenancePeriod: 10,
    savingsObjective: 'wealth',
    hasUniversal: true
  };

  const savingType = savingsOpts.savingType || 'installment';
  const premium = savingsOpts.monthlyPremium || 300000;
  const payYears = savingsOpts.paymentPeriod || 5;
  const keepYears = savingsOpts.maintenancePeriod || 10;
  const savingsObjective = savingsOpts.savingsObjective || 'wealth';
  const hasUniversal = savingsOpts.hasUniversal !== undefined ? savingsOpts.hasUniversal : true;

  // 1. 비과세 혜택 점수 (Tax Benefit Score) -> scores.cancerScore 매핑
  // - 적립식: 5년납 이상, 10년 유지, 월 150만 원 이하
  // - 일시납: 10년 유지, 총 납입 1억 이하
  let taxBenefitScore = 100;
  if (keepYears < 5) {
    taxBenefitScore = 30; // 5년 미만은 과세 확정 및 효율 매우 낮음
  } else if (keepYears < 10) {
    taxBenefitScore = 55; // 5년 이상 10년 미만은 과세 대상
  } else {
    // 10년 이상 유지 만족
    if (savingType === 'installment') {
      if (payYears < 5) {
        taxBenefitScore = 70; // 10년 유지는 되나, 5년납 미만으로 적립식 비과세 대상 아님
      } else if (premium > 1500000) {
        taxBenefitScore = 80; // 한도 초과 (월 150만 원 초과분은 과세)
      } else {
        taxBenefitScore = 100; // 완전 비과세 충족
      }
    } else {
      // 일시납
      if (premium > 100000000) {
        taxBenefitScore = 75; // 1억 초과분 과세
      } else {
        taxBenefitScore = 100; // 일시납 비과세 충족
      }
    }
  }

  // 장기 저축 목적(재테크, 교육/증여) 시 비과세 미충족 상태에 대한 패널티 가중
  if (savingsObjective === 'education' || savingsObjective === 'wealth') {
    if (taxBenefitScore !== 100) {
      taxBenefitScore = Math.max(30, taxBenefitScore - 5);
    }
  }

  // 2. 금리 안정성 점수 (Rate Stability Score) -> scores.cerebrovascularScore 매핑
  // - 공시이율 수준 및 최저보증이율 확보 여부
  const declaredRate = opt1.declaredRate || 2.95;
  const guaranteedRate = opt1.guaranteedRate || 1.00;
  
  let rateStabilityScore = 80;
  if (declaredRate >= 3.1) {
    rateStabilityScore = 95;
  } else if (declaredRate >= 2.9) {
    rateStabilityScore = 88;
  } else {
    rateStabilityScore = 75;
  }

  // 최저보증이율 가산점
  if (guaranteedRate >= 1.2) {
    rateStabilityScore = Math.min(100, rateStabilityScore + 5);
  } else if (guaranteedRate < 0.8) {
    rateStabilityScore = Math.max(50, rateStabilityScore - 10);
  }

  // 노후 은퇴 대비 목적 시 장기 이율 보증 안정성 가중치 가산
  if (savingsObjective === 'retirement') {
    rateStabilityScore = Math.min(100, rateStabilityScore + 5);
  }

  // 3. 사업비 효율 점수 (Fee Efficiency Score) -> scores.cardiovascularScore 매핑
  // - 사업비(수수료) 요율 평가 (낮을수록 고득점)
  const businessFee = opt1.businessFee || 3.5;
  let feeEfficiencyScore = 80;
  if (businessFee <= 3.3) {
    feeEfficiencyScore = 98; // 초저가 CM 전용
  } else if (businessFee <= 3.9) {
    feeEfficiencyScore = 90; // 평균 CM 수준
  } else if (businessFee <= 4.5) {
    feeEfficiencyScore = 80; // 약간 높은 온라인 또는 하이브리드
  } else {
    feeEfficiencyScore = 60; // 오프라인 채널 (사업비 5% 초과)
  }

  // 결혼 자금/주택 자금 목적 등 중기 필요 자금은 중도 해약/인출 리스크가 크므로 유니버셜 기능 부재 시 패널티 부과
  if ((savingsObjective === 'marriage' || savingsObjective === 'housing') && !hasUniversal) {
    feeEfficiencyScore = Math.max(40, feeEfficiencyScore - 15);
  }

  const totalScore = Math.round((taxBenefitScore + rateStabilityScore + feeEfficiencyScore) / 3);

  // 4. 가성비 지표 (환급률 효율)
  const mainRefundRatio = opt1.refundRatio || 112.5;
  const efficiency = Math.round(Math.min(99.9, Math.max(30, (totalScore / 100) * 75 + (mainRefundRatio - 100) * 1.5)));

  // 5. 보장 공백 및 개선점(Deficiencies) 도출
  const deficiencies: string[] = [];
  if (keepYears < 10) {
    deficiencies.push(`유지 기간 10년 미만 (비과세 혜택 대상 제외, 이자소득세 15.4% 부과)`);
  }
  if (savingType === 'installment' && payYears < 5) {
    deficiencies.push(`적립식 납입 기간 5년 미만 (비과세 요건 미충족)`);
  }
  if (savingType === 'installment' && premium > 1500000) {
    deficiencies.push(`적립식 납입 한도 초과 (월 150만 원 초과분은 15.4% 소득세 부과)`);
  }
  if (savingType === 'lumpSum' && premium > 100000000) {
    deficiencies.push(`일시납 납입 한도 초과 (총 1억 원 초과분은 15.4% 소득세 부과)`);
  }
  if (businessFee > 4.2) {
    deficiencies.push(`높은 수수료 설계 (사업비 요율 ${businessFee}%로 초반 적립률 저해, 다이렉트 CM 전환 권장)`);
  }
  if (!hasUniversal) {
    deficiencies.push(`유니버셜 기능 부재 (급전 필요 시 중도인출 및 여유자금 추가납입 기능 제한)`);
  }

  // 6. 목적별 맞춤 설명문구 및 제목 접두사 매핑
  let objectiveTitle = '목돈 마련';
  let dietDesc = '수수료(사업비)를 최소화한 다이렉트 CM 전용 상품을 활용하여, 월 10만 원대의 부담 없는 예산으로 저축 효율을 챙기는 실속 복리 플랜입니다.';
  let upgradeDesc = '비과세 혜택 요건(5년납, 10년 유지)을 정확히 조준하여, 매월 50만 원 규모로 복리 수익과 절세 효과를 극대화하는 가장 균형 잡힌 저축 플랜입니다.';
  let hybridDesc = '비과세 혜택의 법정 최대 한도를 가득 채우고, 추가 납입 기능을 동원해 사업비 차감 비율을 최저로 떨어트리는 프리미엄 자산가형 세팅입니다.';

  if (savingsObjective === 'marriage') {
    objectiveTitle = '결혼 자금';
    dietDesc = '결혼 준비를 위해 3~5년 내 필요한 실속형 자금을 저축하는 다이렉트 플랜입니다. 유니버셜 중도인출 기능을 통해 필요할 때 예산을 유연하게 꺼내 쓸 수 있도록 돕습니다.';
    upgradeDesc = '안정적인 신혼집 입주 자금 및 혼수 비용 마련을 위해 50만 원 대의 최적 밸런스로 설계된 비과세 복리 저축 플랜입니다.';
    hybridDesc = '결혼 최대 목표 자금 형성을 위해 세법 최대 한도를 채우며 추가 납입 기능(사업비 면제)을 극대화하여 조기 적립 속도를 올리는 프리미엄 결혼 자산 플랜입니다.';
  } else if (savingsObjective === 'housing') {
    objectiveTitle = '주택 자금';
    dietDesc = '내집마련 및 전월세 보증금 마련의 디딤돌이 될 종잣돈을 다이렉트 최저 수수료로 부담 없이 쌓아올리는 실속형 플랜입니다.';
    upgradeDesc = '주택 청약이나 분양 대금 납입 시점에 맞춰 비과세(15.4% 면제)를 든든하게 확보하고 연금형 복리로 자산을 팽창시키는 밸런스형 플랜입니다.';
    hybridDesc = '대형 주택 계약금 또는 중도금 마련을 위해 최대 한도 세팅 및 추가 적립 효율을 최대로 활용하는 고액 자산 형성 부스터 플랜입니다.';
  } else if (savingsObjective === 'retirement') {
    objectiveTitle = '노후 대비';
    dietDesc = '국민연금 외에 소액의 개인 은퇴 보조 자금을 준비하기 위한 알짜배기 다이렉트 복리 은퇴 준비 플랜입니다.';
    upgradeDesc = '은퇴 시점의 생활 안정을 타깃하여 비과세 조건을 충족하고, 향후 안정적인 연금 전환 옵션(남녀 수명 반영)을 고려한 고효율 은퇴 밸런스 플랜입니다.';
    hybridDesc = '노후 은퇴 자산의 최대 효율 극대화를 겨냥하여 최대 한도액을 거치 또는 적립하고 대기업의 최저보증이율 안전망을 활용하는 은퇴 마스터 플랜입니다.';
  } else if (savingsObjective === 'education') {
    objectiveTitle = '장기 증여/교육';
    dietDesc = '자녀의 미래 대학교 등록금 및 유학 자금을 대비해 적은 금액부터 복리로 굴리는 장기 다이렉트 학자금 플랜입니다.';
    upgradeDesc = '자녀 증여 한도 비과세(10년간 5천만 원 면제) 및 이자소득세 비과세의 이중 세제 혜택을 겨냥해 장기 복리 효율을 극대화한 교육 설계 플랜입니다.';
    hybridDesc = '자녀에게 풍요로운 미래 자산을 안전하게 양도하기 위해 최대 한도 세팅 및 유니버셜 추가납입을 결합해 증여 가치를 극대화한 프리미엄 패밀리 플랜입니다.';
  }

  // Diet Plan: 실속형 다이렉트 소액 플랜
  const dietPremium = savingType === 'lumpSum' ? Math.min(premium, 10000000) : 100000;
  const diet: RecommendationPlan = {
    title: `[${opt1.companyName}] 실속 CM ${objectiveTitle} 플랜`,
    description: dietDesc,
    estimatedPremium: dietPremium,
    companyName: opt1.companyName,
    productName: opt1.productName,
    coverageChanges: [
      savingType === 'lumpSum' 
        ? `일시납 ${dietPremium.toLocaleString()}원 실속 거치` 
        : `월 납입료 ${dietPremium.toLocaleString()}원으로 가볍게 시작`,
      `다이렉트 CM 최저 수수료 (${opt1.businessFee || 3.2}% 수준) 적용`,
      `유니버셜 기능 기본 탑재로 수수료 없는 추가 납입 한도 활용 가능`
    ],
    switchingLossNotice: `10년 유지 기간을 채우지 못할 시 비과세 혜택이 상실되어 일반 예적금과 동일하게 이자소득세가 과세됩니다.`,
    isFire: false
  } as any;

  // Upgrade Plan: 비과세 올인 밸런스형 플랜
  const upgradePremium = savingType === 'lumpSum' ? Math.min(premium, 50000000) : 500000;
  const upgrade: RecommendationPlan = {
    title: `[${opt2.companyName}] 비과세 복리 ${objectiveTitle} 플랜`,
    description: upgradeDesc,
    estimatedPremium: upgradePremium,
    companyName: opt2.companyName,
    productName: opt2.productName,
    coverageChanges: [
      savingType === 'lumpSum'
        ? `일시납 ${upgradePremium.toLocaleString()}원 비과세 한도 내 거치`
        : `월 납입액 ${upgradePremium.toLocaleString()}원 최적 설계`,
      `이자소득세 15.4% 비과세 혜택 전액 매칭 충족`,
      `은행 적금 단리 대비 높은 월 복리(공시이율 적용) 자산 증식 효과`
    ],
    switchingLossNotice: `가입 초기 1~2년 이내 해지 시에는 누적된 사업비 비중으로 인해 해약환급금이 원금 이하일 수 있어 10년 유지가 가능한 예산이어야 합니다.`,
    isFire: false
  } as any;

  // Hybrid Plan: 프리미엄 유니버셜 부스터 플랜
  const hybridPremium = savingType === 'lumpSum' ? 100000000 : 1500000;
  const hybridPriceDesc = savingType === 'lumpSum' ? `1억 원` : `150만 원`;
  const hybridCustomChanges = savingType === 'lumpSum'
    ? [
        `일시납 비과세 최대 한도 1억 원 풀 세팅 거치`,
        `이자소득세 면제 효과 극대화 (평균 절세액 최대화)`,
        `대기업 브랜드 자산운용사의 안정적인 공시이율 및 최저보증이율 안전망 확보`
      ]
    : [
        `적립식 비과세 월 최대 한도 150만 원 풀 세팅`,
        `사업비가 면제되는 추가 납입(기본 한도의 200%) 기능 연동 가능`,
        `복리 이자 적산 속도 부스팅으로 원금 도달 시점 가속화`
      ];

  const hybrid: RecommendationPlan = {
    title: `[${opt3.companyName}] 유니버셜 ${objectiveTitle} 부스터 플랜`,
    description: hybridDesc,
    estimatedPremium: hybridPremium,
    companyName: opt3.companyName,
    productName: opt3.productName,
    coverageChanges: hybridCustomChanges,
    switchingLossNotice: `최대 한도를 초과하여 납입된 금액은 일반 과세(15.4% 세율)로 분류되므로 추가 저축 시 금융종합과세 한도 등을 고려하여 계좌를 분할해야 합니다.`,
    isFire: false
  } as any;

  return {
    estimatedPremium: upgradePremium,
    efficiency,
    deficiencies,
    scores: {
      cancerScore: taxBenefitScore,                // 비과세 혜택 점수 (레이더 차트 매핑)
      cerebrovascularScore: rateStabilityScore,    // 금리 안정성 점수
      cardiovascularScore: feeEfficiencyScore,     // 사업비 효율 점수
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
