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

  const deficiencies: string[] = [];
  const recommendationsTips: string[] = [];

  // 1. 진단비 점검
  if (diag < 20000000) {
    deficiencies.push('중증 치매 진단비 심각 부족 (2천만원 미만)');
    recommendationsTips.push('중증 치매 진단 시 발생하는 초기 시설 입소 및 주택 개조 비용을 충당하기 위해 진단비를 최소 3천만원 수준으로 인상하는 것을 추천합니다.');
  } else if (diag < 30000000) {
    deficiencies.push('중증 치매 진단비 소폭 부족 (3천만원 권장)');
    recommendationsTips.push('물가 상승률을 고려하여 진단비를 3천만원 이상으로 든든하게 설정하는 것이 유리합니다.');
  }

  // 2. 생활비 점검
  if (allowance < 500000) {
    deficiencies.push('매월 간병 생활비 부족 (50만원 미만)');
    recommendationsTips.push('치매 장기 투병 시 고정 요양비 지출에 대비하여 생활자금을 월 50만원 이상으로 조율하시는 것을 권장합니다.');
  }

  // 3. 지정대리청구인 지정 점검
  if (!hasProxy) {
    deficiencies.push('지정대리청구인 미지정 (청구 불가 위험)');
    recommendationsTips.push('치매 발병 시 본인의 인지 능력 상실로 보험금 직접 청구가 매우 어렵습니다. 반드시 배우자나 자녀를 대리청구인으로 지정하여 가입하십시오.');
  }

  // 4. 유병자 심사 상태 체크
  if (hasHistory || hasLtc) {
    deficiencies.push('가입 심사 제한 대상 (유병자/등급 보유)');
    recommendationsTips.push('최근 병력 또는 장기요양등급 이력이 있으므로 일반 상품보다 심사 기준이 완화된 간편고지 전용 상품 비교 결과를 확인해 보시기 바랍니다.');
  }

  const allOptions = (analysis as any)._allOptions || [];
  const dietOption = allOptions[0];
  const hybridOption = allOptions.length > 2 
    ? allOptions[Math.floor(allOptions.length * 0.4)] 
    : (allOptions[1] || dietOption);
  const upgradeOption = allOptions.length > 2 
    ? allOptions[Math.floor(allOptions.length * 0.8)] 
    : (allOptions[2] || allOptions[1] || dietOption);

  const diet: RecommendationPlan = {
    title: '동일 보장 실속형 (최저가)',
    description: '현재 설정을 유지하면서 불필요한 연계 특약만 제외한 최적가 플랜입니다.',
    estimatedPremium: dietOption ? dietOption.premium : Math.floor((analysis.monthlyPremium || 65000) * 0.4),
    companyName: dietOption?.companyName || '교보생명',
    productName: dietOption?.productName || '교보더안심치매간병보험',
    coverageChanges: ['연계 담보 최소화', '업계 최저가 요율 적용'],
    switchingLossNotice: '가입 기간에 따라 해약 환급금이 적을 수 있습니다.'
  };

  const upgrade: RecommendationPlan = {
    title: '가장 많이 추천하는 플랜',
    description: '진단비와 매월 간병생활자금 보장 기간을 평생 100세까지 확대 보장하는 프리미엄 안심 설계입니다.',
    estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 1.5) : upgradeOption.premium) : Math.floor((analysis.monthlyPremium || 65000) * 1.5),
    companyName: upgradeOption?.companyName || '라이나생명',
    productName: upgradeOption?.productName || '라이나전에없던실속치매보험',
    coverageChanges: ['중증치매 보장 기간 연장', '재가/시설 동시 보장'],
    switchingLossNotice: '변경 시 보험료가 상승할 수 있습니다.'
  };

  const hybrid: RecommendationPlan = {
    title: '가성비 실속형 복합 플랜',
    description: '기본적인 치매 진단비와 재가케어를 결합하여 보험료 부담은 줄이고 실속은 높였습니다.',
    estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.1) : hybridOption.premium) : Math.floor((analysis.monthlyPremium || 65000) * 0.8),
    companyName: hybridOption?.companyName || 'DB생명',
    productName: hybridOption?.productName || 'DB생명당신곁에치매간병보험',
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
