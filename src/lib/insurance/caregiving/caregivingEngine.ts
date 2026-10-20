import { RecommendationPlan } from '../../../types/insurance/common';

/**
 * 간병 보험 분석 엔진
 * 간병 방식(지원/사용), 체증형 여부, 요양병원 특화 등을 분석하여
 * 사용자 맞춤형 추천 플랜을 생성합니다.
 */
export const analyzeCaregiving = (analysis: any): any => {
  const careTypeScore = analysis.careType === 'support' ? 95 : 85;
  const stepUpScore = analysis.isStepUp ? 98 : 60;
  const totalScore = (careTypeScore + stepUpScore) / 2;
  
  // 부족 보장 항목 도출 (고객 선택 미단정 원칙)
  const deficiencies: string[] = [];

  const allOptions = (analysis as any)._allOptions || [];
  const dietOption = allOptions[0];

  let upgradeOption = allOptions.find((opt: any) => opt.isStepUp && opt.companyName !== dietOption?.companyName);
  if (!upgradeOption) upgradeOption = allOptions.find((opt: any) => opt.isStepUp);
  if (!upgradeOption) upgradeOption = allOptions.find((opt: any) => opt.companyName !== dietOption?.companyName) || dietOption;

  let hybridOption = allOptions.find((opt: any) => 
    (opt.careType === '지원일당' || opt.careType?.includes('지원')) && 
    opt.companyName !== dietOption?.companyName && 
    opt.companyName !== upgradeOption?.companyName
  );
  if (!hybridOption) hybridOption = allOptions.find((opt: any) => opt.careType === '지원일당' || opt.careType?.includes('지원'));
  if (!hybridOption) hybridOption = allOptions.find((opt: any) => 
    opt.companyName !== dietOption?.companyName && 
    opt.companyName !== upgradeOption?.companyName
  );
  if (!hybridOption) hybridOption = allOptions[1] || dietOption;

  const diet: RecommendationPlan = {
    title: '동일 보장 실속형',
    description: '현재 설정을 20년납 비갱신형으로 유지하면서 필수 간병 특약 위주로 맞춘 실속형 플랜입니다.',
    estimatedPremium: dietOption ? dietOption.premium : Math.round(analysis.monthlyPremium * 0.8 / 100) * 100,
    periodBadge: '20년납 · 90세만기 (비갱신형)',
    companyName: dietOption?.companyName || '추천 보험사',
    productName: dietOption?.productName || '간병인 실속형 플랜',
    coverageChanges: ['연계 담보 최소화', '실속 요율 적용'],
    switchingLossNotice: '가입 기간에 따라 해약 환급금이 적을 수 있습니다.'
  };

  const refPremium = diet.estimatedPremium || analysis.monthlyPremium || 50000;
  const premiumRatio = refPremium / 50000;
  const efficiencyScore = Math.round(Math.min(99, Math.max(40, totalScore * (1 / Math.sqrt(premiumRatio)))));

  return {
    estimatedPremium: diet.estimatedPremium,
    efficiency: efficiencyScore,
    deficiencies,
    scores: {
      totalScore,
      careTypeScore,
      stepUpScore
    },
    recommendations: {
      diet,
      upgrade: {
        title: '체증형 든든 안심 플랜',
        description: '매년 보장 금액이 늘어나는 체증형으로 20년납 비갱신형 설계하여 미래 간병 비용에 든든하게 대비합니다.',
        estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 1.25) : upgradeOption.premium) : Math.round(analysis.monthlyPremium * 1.2 / 100) * 100,
        periodBadge: '20년납 · 90세만기 (비갱신형)',
        companyName: upgradeOption?.companyName || '추천 보험사',
        productName: upgradeOption?.productName || '체증형 간병비 플랜',
        coverageChanges: ['체증형(연차별 증액) 적용', '간병인 일당 한도 상향'],
        switchingLossNotice: '변경 시 보험료가 상승할 수 있습니다.'
      },
      hybrid: {
        title: '지원+일당 복합형',
        description: '보험사 지원과 현금 일당의 장점을 20년납 비갱신형으로 합친 하이브리드 구성입니다.',
        estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.1) : hybridOption.premium) : analysis.monthlyPremium,
        periodBadge: '20년납 · 90세만기 (비갱신형)',
        companyName: hybridOption?.companyName || '추천 보험사',
        productName: hybridOption?.productName || '간병 지원·일당 복합 플랜',
        coverageChanges: ['간병인 지원 특약', '요양병원 일당 보강'],
        switchingLossNotice: '상세 설계에 따라 보장 내용이 달라질 수 있습니다.'
      }
    }
  };
};
