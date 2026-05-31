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
  const deficiencies: string[] = [];
  const recommendationsTips: string[] = [];

  if (prefService === 'home' && homeAmount < 500000) {
    deficiencies.push('방문요양(재가) 보장 한도 부족 (최소 50만 원 권장)');
  }
  if (prefService === 'facility' && facilityAmount < 500000) {
    deficiencies.push('시설 입소 요양원 보장 금액 부족 (식재료비 고려 최소 50만 원 권장)');
  }
  if (prefService === 'both' && (homeAmount < 500000 || facilityAmount < 500000)) {
    deficiencies.push('재가 및 시설 양대 보장 균형 미달');
  }
  if (!hasProxy) {
    deficiencies.push('대리청구인 지정 미선택 (지급 차질 가능성)');
    recommendationsTips.push('장기요양등급 수급 시 본인이 직접 청구하기 어려운 상태를 대비해 지정대리청구인을 지정하는 것이 안전합니다.');
  }
  if (hasHistory || hasLtc) {
    deficiencies.push('가입 심사 제한 대상 (간편심사 전용 가입 필요)');
    recommendationsTips.push('치매/뇌질환 병력 또는 요양등급 이력이 있으시므로 일반 심사형이 아닌 간편고지(초간편) 플랜이 권장됩니다.');
  }

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
    description: '최근 인기가 높은 방문 요양보호사(재가급여) 중심으로 구성하여 월 보험료를 아끼는 경제형 플랜입니다.',
    estimatedPremium: dietOption ? dietOption.premium : Math.floor(currentPremium * 0.45),
    companyName: dietOption?.companyName || '흥국화재',
    productName: dietOption?.productName || '(무)흥국재가케어간병보험',
    coverageChanges: ['방문요양/주야간보호 집중', '시설입소 특약 최소화'],
    switchingLossNotice: '재가급여 외 시설 입소 시 지원 한도가 다소 낮아집니다.'
  };

  const upgrade: RecommendationPlan = {
    title: '체증형 무제한 전체보장 플랜',
    description: '재가 및 시설 구분 없이 등급 판정 시 매월 최대 100만 원까지 보장받고, 인플레이션을 대비해 매년 지급액이 상승하는 프리미엄 플랜입니다.',
    estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 1.5) : upgradeOption.premium) : Math.floor(currentPremium * 1.4),
    companyName: upgradeOption?.companyName || '라이나생명',
    productName: upgradeOption?.productName || '(무)라이나방문요양시설종합보험',
    coverageChanges: ['매년 5% 체증형 보장 상향', '1-5등급 전부 무제한 보장'],
    switchingLossNotice: '보장이 큰 대신 초기 보험료 수준이 높습니다.'
  };

  const hybrid: RecommendationPlan = {
    title: '재가/시설 복합 실속형',
    description: '본인부담금 매칭(재가 15% / 시설 20%)에 딱 맞춰 합리적인 보험료로 전체적인 불균형을 해결한 가성비 복합형입니다.',
    estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.1) : hybridOption.premium) : Math.floor(currentPremium * 0.85),
    companyName: hybridOption?.companyName || 'DB손해보험',
    productName: hybridOption?.productName || '(무)참좋은재가시설요양케어보험',
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
