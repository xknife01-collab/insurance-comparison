import { RecommendationPlan } from '../../../types/insurance';

/**
 * 연금저축보험 분석 엔진
 * 소득 수준, 저축 희망 금액, 납입 기간 등을 기반으로
 * 세액공제 최적화 점수, 노후 수령 적정성 및 다이어트/업그레이드 플랜을 생성합니다.
 */
export const analyzeAnnuity = (analysis: any): any => {
  const options = (analysis._allOptions || []).map((o: any) => ({
    ...o,
    riskPremium: o.riskPremium || 5000,
    savingsPremium: o.savingsPremium || 95000,
    estimatedPremium: o.premium || 100000
  })) || [];

  const defaultOption = {
    premium: analysis._realDbPremium || 300000,
    riskPremium: 15000,
    savingsPremium: 285000,
    productName: analysis._productName || '인터넷 연금저축보험 (무배당)',
    companyName: analysis._companyName || '교보라이프플래닛'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const annuityOpts = analysis.annuity || {
    annuityType: 'savings',
    monthlyPremium: 300000,
    paymentPeriod: 10,
    commencementAge: 60,
    annualIncome: 50000000,
    hasIrp: false,
    receivingPeriod: 20
  };

  const monthlyPremium = annuityOpts.monthlyPremium || 300000;
  const annualIncome = annuityOpts.annualIncome || 50000000;
  const annuityType = annuityOpts.annuityType || 'savings';

  // 1. 세액공제 최적화 점수 (Tax Score) - 만점 기준은 600만 원 (월 50만 원)
  const annualPremium = monthlyPremium * 12;
  const isHighIncome = annualIncome > 55000000;
  const taxCreditRate = isHighIncome ? 13.2 : 16.5;

  let taxScore = 100;
  if (annuityType === 'savings') {
    if (annualPremium < 6000000) {
      taxScore = Math.round((annualPremium / 6000000) * 100);
    } else if (annualPremium > 6000000) {
      // 600만 원 초과 시 초과분에 대해 세액공제가 안 되므로 가점 없음 (초과 알림)
      taxScore = 95; // 패널티 (초과 납입 자산 배분 비효율)
    }
  } else {
    // 비과세형인 경우 세액공제는 없으므로 세액공제 관점에서는 0점 처리하되 비과세 혜택으로 대체 분석
    taxScore = 70; 
  }

  // 2. 소득 대비 저축 비중 점수 (Savings Score)
  // 권장 연금저축 비중: 세후/세전 소득의 약 10~15%
  const incomeRatio = annualIncome > 0 ? (annualPremium / annualIncome) * 100 : 0;
  let savingsScore = 100;
  if (incomeRatio < 5) {
    savingsScore = 60; // 너무 낮음
  } else if (incomeRatio > 25) {
    savingsScore = 70; // 과도함 (유동성 위기 우려)
  } else {
    savingsScore = 95; // 적정
  }

  // 3. 노후 자산 대체도 점수 (Adequacy Score)
  // 은퇴 시 수령액이 평균 최소 생활비(부부 기준 약 월 150만 원) 대비 어느 정도 채워지는지
  // (임의 계산: 월 연금수령액이 50만 원 이상이면 양호)
  const monthlyPension = opt1.monthlyPension || (monthlyPremium * 1.35); // 임시 대체
  const adequacyScore = Math.min(100, Math.round((monthlyPension / 1000000) * 100));

  const totalScore = Math.round((taxScore + savingsScore + adequacyScore) / 3);

  // 4. 가성비 지표 (환급률과 세액공제율 결합 효율성)
  const efficiency = Math.round(Math.min(99.9, Math.max(30, (totalScore / 100) * 85 + (annuityType === 'savings' ? taxCreditRate : 10))));

  // 5. 보장 공백(Deficiencies) 도출
  const deficiencies: string[] = [];
  if (annuityType === 'savings') {
    if (annualPremium < 6000000) {
      deficiencies.push(`세액공제 한도 미달 (연간 ${Math.round((6000000 - annualPremium)/10000)}만원 한도 추가 공제 가능)`);
    } else if (annualPremium > 6000000 && !annuityOpts.hasIrp) {
      deficiencies.push('세액공제 한도 초과 (초과액은 IRP로 전환하여 최대 900만원까지 세액공제 권장)');
    }
  } else {
    deficiencies.push('연말정산 세액공제 혜택 제외 (비과세 저축 보험으로 연말 환급 없음)');
  }

  if (annuityOpts.paymentPeriod < 10) {
    deficiencies.push('짧은 납입 기간 (연금저축은 장기 적립식 복리 효과 극대화를 위해 10년 이상 권장)');
  }
  if (annuityOpts.commencementAge < 60) {
    deficiencies.push('이른 연금 개시 설정 (55~59세 개시 시 연금소득세 5.5% 최고세율 적용, 70세 이후 개시 시 3.3% 절세 가능)');
  }

  // 6. 세 가지 추천 시나리오 설계
  // Diet: 실속 세액공제형 (월 10~20만 원 세팅, 순수 공제 중심)
  const dietPremium = Math.min(monthlyPremium, 150000);
  const dietRisk = Math.round(dietPremium * (opt1.businessFee ? opt1.businessFee / 100 : 0.04));
  const dietSavings = dietPremium - dietRisk;
  const dietRefund = dietPremium * 12 * (taxCreditRate / 100);

  const diet: RecommendationPlan = {
    title: `[${opt1.companyName}] 실속 세액공제 플랜`,
    description: `연말정산 환급 혜택을 챙기면서 월 납입 부담을 10~15만 원 수준으로 대폭 낮춘 저예산 실속 플랜입니다.`,
    estimatedPremium: dietPremium,
    companyName: opt1.companyName,
    productName: opt1.productName,
    coverageChanges: [
      `월 납입료 ${dietPremium.toLocaleString()}원으로 다이어트`,
      `매년 약 ${Math.round(dietRefund).toLocaleString()}원 연말정산 환급`,
      `낮은 사업비 (${opt1.businessFee || 3.5}%) 인터넷 채널 적용`
    ],
    switchingLossNotice: '납입 원금이 적어 은퇴 후 매월 수령하는 실제 연금액은 생활비 보조 수준에 그칩니다.',
    isFire: false // generic
  } as any;

  // Upgrade: 안심 세액공제 최적형 (월 50만 원 세팅, 세액공제 600만 원 한도 100% 채움)
  const upgradePremium = 500000;
  const upgradeRisk = Math.round(upgradePremium * (opt2.businessFee ? opt2.businessFee / 100 : 0.05));
  const upgradeSavings = upgradePremium - upgradeRisk;
  const upgradeRefund = upgradePremium * 12 * (taxCreditRate / 100);

  const upgrade: RecommendationPlan = {
    title: `[${opt2.companyName}] 세액공제 풀 최적화 플랜`,
    description: `연금저축 단독 한도인 연 600만 원(월 50만 원)을 100% 채워 매년 최대 환급금을 확보하고 노후 자금을 채우는 베스트 플랜입니다.`,
    estimatedPremium: upgradePremium,
    companyName: opt2.companyName,
    productName: opt2.productName,
    coverageChanges: [
      `연 한도 600만 원 최적화 세팅 (월 50만 원)`,
      `매년 최대 ${Math.round(upgradeRefund).toLocaleString()}원 연말정산 환급`,
      `공시이율 복리 적립을 통한 원금 복구 가속화`
    ],
    switchingLossNotice: '중도 해지 시 기타소득세 16.5%가 부과되므로 반드시 납입 유지 가능한 예산 범위여야 합니다.',
    isFire: false
  } as any;

  // Hybrid: 프리미엄 하이브리드 결합형 (월 50만 원 연금저축 + 25만 원 IRP 추가 세팅 = 연 900만 원 한도 달성)
  const hybridPremium = 750000;
  const hybridRisk = Math.round(hybridPremium * 0.045);
  const hybridSavings = hybridPremium - hybridRisk;
  const hybridRefund = hybridPremium * 12 * (taxCreditRate / 100);

  const hybrid: RecommendationPlan = {
    title: `[${opt3.companyName}] 1:1 하이브리드 연금 자산 플랜`,
    description: `연금저축(월 50만)과 IRP 퇴직연금(월 25만)을 매칭하여 세액공제 통합 한도 연 900만 원을 든든하게 소화하는 상위 5% 프리미엄 은퇴 세팅입니다.`,
    estimatedPremium: hybridPremium,
    companyName: opt3.companyName,
    productName: opt3.productName,
    coverageChanges: [
      `연금저축 연 600만 원 + IRP 연 300만 원 복합 구성`,
      `매년 최대 한도 ${Math.round(hybridRefund).toLocaleString()}원 환급 세이브`,
      `수령 개시 시 70세 이후 설정으로 연금소득세 3.3% 절세 극대화`
    ],
    switchingLossNotice: 'IRP는 퇴직연금 특성상 법에서 정한 일부 조건 외에는 중도 인출이 전면 불가능하여 계좌가 폐쇄될 수 있습니다.',
    isFire: false
  } as any;

  return {
    estimatedPremium: upgradePremium,
    efficiency,
    deficiencies,
    scores: {
      cancerScore: taxScore,          // radar 1 매핑용 호환명
      cerebrovascularScore: savingsScore, // radar 2 매핑용 호환명
      cardiovascularScore: adequacyScore,  // radar 3 매핑용 호환명
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
