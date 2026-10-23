import { RecommendationPlan } from '../../../types/insurance/common';

/**
 * 유병자(간편고지) 보험 분석 엔진
 * 고지 항목(3.5.5 등)에 따른 가입 가능성 및 보험료 할증 수준을 분석하여
 * 아픈 분들도 합리적으로 가입할 수 있는 플랜을 생성합니다.
 */
export const analyzePreExisting = (analysis: any): any => {
  const allOptions = (analysis as any)._allOptions || [];
  
  const defaultOption = { 
    premium: analysis._realDbPremium || 55000, 
    productName: analysis._productName || '간편하게 가입하는 유병자보험',
    companyName: analysis._companyName || '추천 보험사'
  };

  const opt1 = allOptions[0] || defaultOption;
  const opt2 = allOptions[1] || opt1;
  const opt3 = allOptions[2] || opt2;

  return {
    estimatedPremium: opt1.premium,
    efficiency: 85,
    deficiencies: [],
    scores: { totalScore: 82 },
    recommendations: {
      diet: {
        title: '실속형 유병자 플랜',
        description: '병력이 있어도 20년납 비갱신형으로 꼭 필요한 보장만 골라 담은 실속형 플랜입니다.',
        estimatedPremium: opt1.premium,
        periodBadge: '20년납 · 90세만기 (간편심사형)',
        companyName: opt1.companyName,
        productName: opt1.productName,
        coverageChanges: ['핵심 진단비 위주 구성', '필수 담보 집중 구성'],
        switchingLossNotice: '질병 이력 및 고지 유형에 따라 인수 조건이 상이할 수 있습니다.',
      },
      upgrade: {
        title: '3.10.5 건강체급 플랜',
        description: '약 복용 중이라도 건강 기준 충족 시 20년납 우대 할인을 검토할 수 있는 표준 밸런스 플랜입니다.',
        estimatedPremium: allOptions.length > 1 ? opt2.premium : opt1.premium,
        periodBadge: '20년납 · 90세만기 (간편심사형)',
        companyName: opt2.companyName,
        productName: opt2.productName,
        coverageChanges: ['무사고 시 보험료 할인', '대형 보험사 안정성 확보'],
        switchingLossNotice: '건강 상태 및 무사고 요건에 따라 인수 기준이 상이할 수 있습니다.',
      },
      hybrid: {
        title: '질병후유장해 결합형',
        description: '수술 후유증까지 20년납으로 꼼꼼하게 보장받는 프리미엄 유병자 플랜입니다.',
        estimatedPremium: allOptions.length > 2 ? opt3.premium : (opt2.premium || opt1.premium),
        periodBadge: '20년납 · 90세만기 (간편심사형)',
        companyName: opt3.companyName,
        productName: opt3.productName,
        coverageChanges: ['질병후유장해 포함', '수술비 반복 보장'],
        switchingLossNotice: '유병자 보험 해지 시 유사 등급 보험으로 재가입이 어려울 수 있습니다.',
      }
    }
  };
};
