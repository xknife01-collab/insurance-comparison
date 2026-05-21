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
  
  const deficiencies: string[] = [];
  if (!analysis.isStepUp) deficiencies.push('인건비 상승 대비(체증형)');
  if (analysis.careType === 'expense') deficiencies.push('간병인 직접 매칭 부담');

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
    description: '현재 설정을 유지하면서 불필요한 연계 특약만 제외한 최적가 플랜입니다.',
    estimatedPremium: dietOption ? dietOption.premium : Math.round(analysis.monthlyPremium * 0.8 / 100) * 100,
    companyName: dietOption?.companyName || 'AIG손보',
    productName: dietOption?.productName || 'AIG 더 든든한 간병보험',
    coverageChanges: ['연계 담보 최소화', '업계 최저가 요율 적용'],
    switchingLossNotice: '가입 기간에 따라 해약 환급금이 적을 수 있습니다.'
  };

  return {
    estimatedPremium: diet.estimatedPremium,
    efficiency: totalScore / (analysis.monthlyPremium / 1000),
    deficiencies,
    scores: {
      totalScore,
      careTypeScore,
      stepUpScore
    },
    recommendations: {
      diet,
      upgrade: {
        title: '가장 많이 추천하는 플랜',
        description: '매년 보장 금액이 늘어나는 체증형으로 변경하여 미래 간병 비용에 완벽 대비합니다.',
        estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 1.25) : upgradeOption.premium) : Math.round(analysis.monthlyPremium * 1.2 / 100) * 100,
        companyName: upgradeOption?.companyName || 'DB손보',
        productName: upgradeOption?.productName || 'NH올원더풀백년동행간병보험',
        coverageChanges: ['체증형(5% 복리) 적용', '간병인 일당 한도 상향'],
        switchingLossNotice: '변경 시 보험료가 상승할 수 있습니다.'
      },
      hybrid: {
        title: '지원+일당 복합형',
        description: '보험사 지원과 현금 일당의 장점을 합친 하이브리드 구성입니다.',
        estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.1) : hybridOption.premium) : analysis.monthlyPremium,
        companyName: hybridOption?.companyName || '삼성화재',
        productName: hybridOption?.productName || '삼성화재 간병보험',
        coverageChanges: ['간병인 지원 특약', '요양병원 일당 보강'],
        switchingLossNotice: '상세 설계에 따라 보장 내용이 달라질 수 있습니다.'
      }
    }
  };
};
