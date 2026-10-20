import { RecommendationPlan } from '../../../types/insurance/common';

/**
 * 재가/시설 요양보험 분석 엔진
 */
export const analyzeHomeFacility = (analysis: any): any => {
  const currentPremium = analysis.monthlyPremium || 80000;
  const config = analysis.nursing || {
    preferredService: 'both',
    homeAmount: 500000,
    facilityAmount: 500000,
    hasProxyClaim: true,
    hasBrainHistory: false,
    hasLtcHistory: false
  };

  const prefService = config.preferredService || 'both';
  const homeAmount = config.homeAmount || 500000;
  const facilityAmount = config.facilityAmount || 500000;
  const hasProxy = !!config.hasProxyClaim;
  const hasHistory = !!config.hasBrainHistory;
  const hasLtc = !!config.hasLtcHistory;

  // 1. Calculate Score based on inputs
  let homeScore = homeAmount >= 700000 ? 95 : (homeAmount >= 500000 ? 80 : 70);
  let facilityScore = facilityAmount >= 700000 ? 95 : (facilityAmount >= 500000 ? 80 : 70);

  // 선택되지 않은 항목은 UI 표출을 위해 60점을 주되, 총점 계산에서는 완전히 제외합니다.
  if (prefService === 'facility') homeScore = 60;
  if (prefService === 'home') facilityScore = 60;

  const ltcScore = hasLtc ? 50 : 90; // 등급 판정이력이 이미 있으면 패널티(심사까다로움)
  const proxyScore = hasProxy ? 95 : 60;

  let totalScore = 0;
  if (prefService === 'home') {
    totalScore = Math.round((homeScore + ltcScore + proxyScore) / 3);
  } else if (prefService === 'facility') {
    totalScore = Math.round((facilityScore + ltcScore + proxyScore) / 3);
  } else {
    totalScore = Math.round((homeScore + facilityScore + ltcScore + proxyScore) / 4);
  }

  // 2. Deficiencies & Recommendations Tips
  // 2. Deficiencies & Recommendations Tips (고객 선택 미단정 원칙)
  const deficiencies: string[] = [];
  const recommendationsTips: string[] = [];

  // 3. Recommended plans selection
  const allOptions = (analysis as any)._allOptions || [];
  const dietOption = allOptions[0];
  const hybridOption = allOptions.length > 2 
    ? allOptions[Math.floor(allOptions.length * 0.4)] 
    : (allOptions[1] || dietOption);
  const upgradeOption = allOptions.length > 2 
    ? allOptions[Math.floor(allOptions.length * 0.8)] 
    : (allOptions[2] || allOptions[1] || dietOption);

  const diet: RecommendationPlan = {
    title: '실속 방문요양형 (재가 집중)',
    description: '방문 요양보호사(재가급여) 중심으로 20년납 구성하여 월 보험료를 아끼는 경제형 플랜입니다.',
    estimatedPremium: dietOption ? dietOption.premium : Math.floor(currentPremium * 0.45),
    periodBadge: '20년납 · 90세만기',
    companyName: dietOption?.companyName || '추천 보험사',
    productName: dietOption?.productName || '재가케어 실속 플랜',
    coverageChanges: ['방문요양/주야간보호 집중', '시설입소 특약 최소화'],
    switchingLossNotice: '재가급여 외 시설 입소 시 지원 한도가 다소 낮아집니다.'
  };

  const upgrade: RecommendationPlan = {
    title: '체증형 든든 전체보장 플랜',
    description: '재가 및 시설 구분 없이 등급 판정 시 20년납으로 매월 생활자금을 보장받고, 물가 변동을 고려해 지급액이 점진적으로 상승하는 플랜입니다.',
    estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 1.5) : upgradeOption.premium) : Math.floor(currentPremium * 1.4),
    periodBadge: '20년납 · 90세만기',
    companyName: upgradeOption?.companyName || '추천 보험사',
    productName: upgradeOption?.productName || '재가/시설 체증형 플랜',
    coverageChanges: ['연차별 체증형 보장 상향', '1-5등급 통합 케어 보장'],
    switchingLossNotice: '보장이 큰 대신 초기 보험료 수준이 높습니다.'
  };

  const hybrid: RecommendationPlan = {
    title: '재가/시설 복합 실속형',
    description: '본인부담금 매칭(재가 15% / 시설 20%)에 딱 맞춰 20년납 합리적인 보험료로 불균형을 해결한 가성비 복합형입니다.',
    estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.1) : hybridOption.premium) : Math.floor(currentPremium * 0.85),
    periodBadge: '20년납 · 90세만기',
    companyName: hybridOption?.companyName || '추천 보험사',
    productName: hybridOption?.productName || '재가/시설 복합 플랜',
    coverageChanges: ['재가 월 50만 + 시설 월 50만 균형 설계', '간호간병 서비스 지원 추가'],
    switchingLossNotice: '특정 한 분야 집중 케어 시 한도가 다소 줄어듭니다.'
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
      homeScore,
      facilityScore,
      ltcScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
