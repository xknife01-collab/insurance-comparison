import { RecommendationPlan } from '../../../types/insurance/common';

/**
 * 뇌혈관 보험 분석 엔진
 * 로더에서 가져온 데이터를 바탕으로 3가지 추천 플랜을 생성합니다.
 */
export const analyzeBrain = (analysis: any): any => {
  const currentPremium = analysis.monthlyPremium;
  const dbPremium = analysis._realDbPremium || 0;
  const allOptions = analysis._allOptions || [];
  
  // 기본 예상 보험료 (DB 값 우선)
  const estimatedPremium = dbPremium > 0 ? dbPremium : 45000;
  const score = currentPremium > estimatedPremium ? 65 : 95;

  const opt1 = allOptions[0] || { premium: estimatedPremium, productName: '뇌혈관 집중 보험', companyName: '추천 보험사' };
  const opt2 = allOptions[1] || opt1;

  const opt3 = allOptions[2] || opt2;

  const diet: RecommendationPlan = {
    title: `[${opt1.companyName}] 실속 뇌혈관 플랜`,
    description: `핵심적인 뇌혈관/허혈성 진단비만 골라 담은 가성비 플랜입니다.`,
    productName: opt1.productName,
    companyName: opt1.companyName,
    estimatedPremium: opt1.premium,
    coverageChanges: ['뇌혈관 진단비 1천만', '허혈성 진단비 1천만', '불필요한 연계담보 삭제'],
    switchingLossNotice: '해지 시 이미 발생한 뇌혈관 질환은 보장이 제외될 수 있습니다.',
  };

  return {
    estimatedPremium,
    efficiency: score > 80 ? 95 : 70,
    deficiencies: currentPremium > estimatedPremium ? ['보험료 과다 지출', '뇌혈관 보장 범위 협소'] : [],
    scores: {
      totalScore: score,
      cerebrovascularScore: score,
      cardiovascularScore: 70,
      cancerScore: 75
    },
    recommendations: {
      diet,
      upgrade: {
        title: `[${opt2.companyName}] 뇌/심 수술비 강화 플랜`,
        description: `진단비는 물론 수술 시마다 반복 지급되는 수술비까지 포함된 든든한 플랜입니다.`,
        productName: opt2.productName,
        companyName: opt2.companyName,
        estimatedPremium: opt2.premium,
        coverageChanges: ['뇌/심장 수술비 1천만 추가', '혈전용해치료비 포함', '비갱신형 구성'],
        switchingLossNotice: '전환 시 기존 보험의 수술비 갱신 보험료를 조심하세요.',
      },
      hybrid: {
        title: `[${opt3.companyName}] 뇌심 종합 집중 플랜`,
        description: `뇌혈관 및 허혈성 심장질환 진단비를 폭넓고 든든하게 보장하는 종합 플랜입니다.`,
        productName: opt3.productName,
        companyName: opt3.companyName,
        estimatedPremium: opt3.premium,
        coverageChanges: ['뇌혈관 진단비 1천만', '허혈성 진단비 1천만', '급성심근경색증 추가'],
        switchingLossNotice: '뇌혈관질환 보험은 가입 후 1년 이내 발생 시 보장이 제한될 수 있습니다.',
      }
    }
  };
};
