import { RecommendationPlan } from '../../../types/insurance/common';

/**
 * 치매 간병보험 분석 엔진
 * 중증 치매 진단비, 매월 생활자금 규모, 지정대리인 지정 여부 등을 평가하여
 * 실시간 맞춤 분석 점수와 3가지 시나리오 추천 플랜을 생성합니다.
 */
export const analyzeDementia = (analysis: any): any => {
  const config = analysis.caregiving || {
    dementiaDiagnosis: 30000000,
    monthlyAllowance: 500000,
    preferredService: 'home',
    hasProxyClaim: true,
    hasDementiaHistory: false,
    hasLtcGrade: false
  };

  const diag = config.dementiaDiagnosis || 0;
  const allowance = config.monthlyAllowance || 0;
  const hasProxy = !!config.hasProxyClaim;
  const hasHistory = !!config.hasDementiaHistory;
  const hasLtc = !!config.hasLtcGrade;

  let diagScore = diag >= 30000000 ? 100 : diag >= 20000000 ? 80 : 50;
  let allowanceScore = allowance >= 500000 ? 100 : allowance >= 300000 ? 80 : 50;
  let proxyScore = hasProxy ? 100 : 40;
  const totalScore = Math.round((diagScore + allowanceScore + proxyScore) / 3);

  // 부족 보장 항목 도출 (고객 선택 미단정 원칙)
  const deficiencies: string[] = [];
  const recommendationsTips: string[] = [];

  const allOptions = (analysis as any)._allOptions || [];
  const dietOption = allOptions[0];
  const hybridOption = allOptions.length > 2 
    ? allOptions[Math.floor(allOptions.length * 0.4)] 
    : (allOptions[1] || dietOption);
  const upgradeOption = allOptions.length > 2 
    ? allOptions[Math.floor(allOptions.length * 0.8)] 
    : (allOptions[2] || allOptions[1] || dietOption);

  const diet: RecommendationPlan = {
    title: '동일 보장 실속형 (알뜰 플랜)',
    description: '현재 설정을 유지하면서 불필요한 연계 특약만 제외한 실속형 플랜입니다.',
    estimatedPremium: dietOption ? dietOption.premium : Math.floor((analysis.monthlyPremium || 65000) * 0.4),
    periodBadge: '20년납 · 90세만기',
    companyName: dietOption?.companyName || '추천 보험사',
    productName: dietOption?.productName || '실속 치매간병 플랜',
    coverageChanges: ['연계 담보 최소화', '실속 요율 적용'],
    switchingLossNotice: '가입 기간에 따라 해약 환급금이 적을 수 있습니다.'
  };

  const upgrade: RecommendationPlan = {
    title: '균형 잡힌 밸런스 안심 플랜',
    description: '진단비와 매월 간병생활자금 보장 기간을 약정 만기(90/100세)까지 확대 보장하는 프리미엄 안심 설계입니다.',
    estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 1.5) : upgradeOption.premium) : Math.floor((analysis.monthlyPremium || 65000) * 1.5),
    periodBadge: '20년납 · 90세/100세만기',
    companyName: upgradeOption?.companyName || '추천 보험사',
    productName: upgradeOption?.productName || '치매간병 집중케어 플랜',
    coverageChanges: ['중증치매 보장 기간 연장', '재가/시설 동시 보장'],
    switchingLossNotice: '변경 시 보험료가 상승할 수 있습니다.'
  };

  const hybrid: RecommendationPlan = {
    title: '가성비 실속형 복합 플랜',
    description: '기본적인 치매 진단비와 재가케어를 결합하여 보험료 부담은 줄이고 실속은 높였습니다.',
    estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.1) : hybridOption.premium) : Math.floor((analysis.monthlyPremium || 65000) * 0.8),
    periodBadge: '20년납 · 90세만기',
    companyName: hybridOption?.companyName || '추천 보험사',
    productName: hybridOption?.productName || '치매 재가간병 복합 플랜',
    coverageChanges: ['재가 중심 케어 설계', '가성비 위주 구성'],
    switchingLossNotice: '상세 설계에 따라 보장 내용이 달라질 수 있습니다.'
  };

  const premiumRatio = diet.estimatedPremium / 45000;
  const efficiencyScore = Math.round(Math.min(99, Math.max(40, totalScore * (1 / Math.sqrt(premiumRatio)))));

  return {
    estimatedPremium: diet.estimatedPremium,
    efficiency: efficiencyScore,
    deficiencies,
    recommendationsTips,
    scores: {
      totalScore,
      diagScore,
      allowanceScore,
      proxyScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
