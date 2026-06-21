import { RecommendationPlan } from '../../../types/insurance';

/**
 * 종신보험(Whole Life) 분석 엔진
 * 가입 목적, 납입 기간, 사망 보장 금액, 환급형 종류, 체증형 여부를 기반으로
 * 진단 점수(보장 적절성, 납입 효율성, 구조 최적성), 보장 공백 및 세 가지 추천안을 도출합니다.
 */
export const analyzeWholeLife = (analysis: any): any => {
  const options = (analysis._allOptions || []).map((o: any) => ({
    ...o,
    riskPremium: o.riskPremium || 45000,
    savingsPremium: o.savingsPremium || 55000,
    estimatedPremium: o.premium || 100000
  })) || [];

  const defaultOption = {
    premium: analysis._realDbPremium || 250000,
    riskPremium: 80000,
    savingsPremium: 170000,
    productName: analysis._productName || '단기납 저해지 종신보험 (무배당)',
    companyName: analysis._companyName || '동양생명'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const wholeOpts = analysis.wholeLife || {
    objective: 'family',
    paymentPeriod: 10,
    deathBenefit: 100000000,
    refundType: 'low',
    isStepUp: false
  };

  const objective = wholeOpts.objective || 'family';
  const paymentPeriod = wholeOpts.paymentPeriod || 10;
  const deathBenefit = wholeOpts.deathBenefit || 100000000;
  const refundType = wholeOpts.refundType || 'low';
  const isStepUp = wholeOpts.isStepUp || false;

  // 1. 사망 보장 금액 적절성 점수 (Death Benefit Score)
  // 가장의 경우 1억 원 이상 권장, 상속세의 경우 2억 원 이상 권장, 목적자금은 납입 유지성
  let deathBenefitScore = 100;
  if (objective === 'family') {
    if (deathBenefit < 50000000) {
      deathBenefitScore = 50; // 너무 낮음
    } else if (deathBenefit < 100000000) {
      deathBenefitScore = 75; // 보통
    } else {
      deathBenefitScore = 95; // 든든함
    }
  } else if (objective === 'inheritance') {
    if (deathBenefit < 100000000) {
      deathBenefitScore = 40;
    } else if (deathBenefit < 200000000) {
      deathBenefitScore = 75;
    } else {
      deathBenefitScore = 98;
    }
  } else {
    // 목적자금(재테크)인 경우 사망보장보다는 환급효율 중심
    deathBenefitScore = 80;
  }

  // 2. 납입 및 환급형 설계 효율성 점수 (Payment & Refund Score)
  // 단기납(5~10년) + 저해지환급형 조합 시 고점 (빠른 완납 및 10년 시점 비과세 환급 극대화)
  // 20년 이상 장기납이거나 일반환급형 선택 시 상대적 저점 (인플레이션으로 인한 화폐 가치 하락 우려)
  let refundScore = 70;
  if (refundType === 'low') {
    if (paymentPeriod <= 10) {
      refundScore = 95; // 단기납 저해지 (시장 베스트셀러)
    } else {
      refundScore = 85; // 장기납 저해지
    }
  } else {
    if (paymentPeriod <= 10) {
      refundScore = 75;
    } else {
      refundScore = 65; // 일반 20~30년납 (가장 효율성이 떨어지는 구구조)
    }
  }

  // 3. 보장 구조 적정성 점수 (Structure Adequacy Score)
  // 물가상승률(인플레이션) 대비 사망보장 가치를 지키기 위해 체증형(Step-Up) 설계를 했는지 평가
  let structureScore = 70;
  if (isStepUp) {
    structureScore = 96; // 체증형을 가입하여 시간이 흘러도 가치 보존
  } else {
    if (objective === 'family' || objective === 'inheritance') {
      structureScore = 65; // 기본형 선택 시 20년 뒤 사망보험금 실질 가치가 절반으로 하락 리스크 존재
    } else {
      structureScore = 80;
    }
  }

  const totalScore = Math.round((deathBenefitScore + refundScore + structureScore) / 3);

  // 가성비 지표 (납입 보험료 대비 실질 사망 보장/환급가치 배분 효율)
  const monthlyPremium = analysis.monthlyPremium || opt1.premium || 250000;
  const efficiency = Math.round(Math.min(99.9, Math.max(30, (totalScore / 100) * 80 + (refundType === 'low' ? 15 : 5))));

  // 5. 보장 공백(Deficiencies) 도출
  const deficiencies: string[] = [];
  if (objective === 'family' && deathBenefit < 100000000) {
    deficiencies.push(`가족생활비 대비 사망보장 미달 (최소 1억 원 수준의 사망보장 확보 권장)`);
  }
  if (objective === 'inheritance' && deathBenefit < 200000000) {
    deficiencies.push(`상속세 재원 부족 우려 (부동산 자산 상속 시 현금 유동성 확보를 위해 사망금 2억 이상 권장)`);
  }
  if (refundType === 'standard') {
    deficiencies.push(`일반 환급형 선택 상태 (동일 보장 대비 보험료가 15~20% 더 비싸며, 완납 후 환급률이 낮음)`);
  }
  if (!isStepUp && (objective === 'family' || objective === 'inheritance')) {
    deficiencies.push(`기본형 사망보장 리스크 (매년 3%대 물가상승 시 20년 뒤 사망보험금 실질 구매력이 반토막남)`);
  }
  if (paymentPeriod >= 20) {
    deficiencies.push(`장기 납입 부담 (20~30년 납입은 은퇴 시점까지 지속 납입해야 하므로 실직/휴직 시 실효 우려 높음)`);
  }

  // 6. 세 가지 추천 시나리오 설계
  // Diet: 실속형 사망보장 (사망 5천만 원 고정, 20년납, 저해지형으로 월 납입 부담 최소화)
  const dietPremium = opt1.premium;
  const diet: RecommendationPlan = {
    title: `[${opt1.companyName}] 실속형 사망보장 다이어트 플랜`,
    description: `불필요한 사업비를 덜어내고 핵심 사망보험금 5,000만 원만 집중하여 고정 지출을 절반으로 다이어트하는 플랜입니다.`,
    estimatedPremium: dietPremium,
    companyName: opt1.companyName,
    productName: opt1.productName,
    coverageChanges: [
      `월 보험료 ${(dietPremium).toLocaleString()}원으로 맞춤 설계`,
      `사망 보장금 5,000만 원 (기본형 고정)`,
      `저해지 환급형 적용으로 일반 상품 대비 15% 추가 할인`
    ],
    switchingLossNotice: '보장액이 축소되어 유가족의 장기적인 생활비 보장에는 다소 미흡할 수 있습니다.',
    isFire: false
  } as any;

  // Upgrade: 7년 단기납 체증형 플랜 (사망 1억 원, 60세부터 매년 5% 체증, 7년납, 저해지형)
  const upgradePremium = opt2.premium;
  const upgrade: RecommendationPlan = {
    title: `[${opt2.companyName}] 7년완납 체증형 자산보존 플랜`,
    description: `7년 단기완납으로 은퇴 전 보험료 납입을 종료하고, 물가상승에 비례해 사망보험금이 매년 5%씩 불어나는 프리미엄 설계입니다.`,
    estimatedPremium: upgradePremium,
    companyName: opt2.companyName,
    productName: opt2.productName,
    coverageChanges: [
      `월 보험료 ${(upgradePremium).toLocaleString()}원으로 맞춤 설계`,
      `사망 보장 기본 1억 원 ➡️ 매년 5%씩 체증식 증액`,
      `7년 단기납 적용으로 조기 완납 및 연간 복리 환급률 극대화`,
      `저해지 환급형 설계로 납입 완료 시점 환급률 120% 돌파`
    ],
    switchingLossNotice: '7년 이내 중도 해지 시 해약환급금이 납입원금의 10% 미만으로 매우 적어 반드시 유지가 필수적입니다.',
    isFire: false
  } as any;

  // Hybrid: 10년납 목적자금 하이브리드 플랜 (사망 7천만 원, 10년납, 저해지형, 완납 후 비과세 저축 연계)
  const hybridPremium = opt3.premium;
  const hybrid: RecommendationPlan = {
    title: `[${opt3.companyName}] 10년납 목돈마련 하이브리드 플랜`,
    description: `사망 보장과 목돈 저축 기능을 최적으로 배분하여, 10년 완납 후 해약하여 연금으로 전환하거나 목적자금으로 쓸 수 있는 실용형 모델입니다.`,
    estimatedPremium: hybridPremium,
    companyName: opt3.companyName,
    productName: opt3.productName,
    coverageChanges: [
      `월 보험료 ${(hybridPremium).toLocaleString()}원으로 맞춤 설계`,
      `사망 보장 기본 7,000만 원 안심 설계`,
      `10년납으로 월 부담 완화 및 10년 시점 비과세 혜택 완벽 매칭`,
      `완납 후 연금 전환 특약 또는 적립금 중도인출 기능 무료 탑재`
    ],
    switchingLossNotice: '사망 보장과 저축 기능이 결합된 상품이므로, 순수 저축성 보험보다 초기 사업비 차감이 다소 큽니다.',
    isFire: false
  } as any;

  return {
    estimatedPremium: upgradePremium,
    efficiency,
    deficiencies,
    scores: {
      cancerScore: deathBenefitScore,       // radar 1 매핑 (사망보장액)
      cerebrovascularScore: refundScore,     // radar 2 매핑 (납입/환급형)
      cardiovascularScore: structureScore,  // radar 3 매핑 (구조 최적성)
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
