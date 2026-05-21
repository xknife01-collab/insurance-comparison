import { RecommendationPlan } from '../../../types/insurance/common';

/**
 * 의료실비(실손) 분석 엔진
 * 사용자의 현재 실손 세대와 비급여 이용량을 분석하여 
 * 4세대 실손으로의 전환 시뮬레이션 및 추천 플랜을 생성합니다.
 */
export const analyzeSilson = (analysis: any): any => {
  const options = analysis._allOptions || [];
  
  // DB 데이터 부재 시 기본값
  const defaultOption = { 
    premium: analysis._realDbPremium || 15000, 
    productName: analysis._productName || '실손의료보험',
    companyName: analysis._companyName || '추천 보험사'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  // 4세대 실손 비급여 차등제 할인/할증 로직
  let multiplier = 1.0;
  const usage = analysis.silson?.nonReimbursableUsage || 'under100';
  switch (usage) {
    case 'none': multiplier = 0.95; break; 
    case 'under100': multiplier = 1.0; break;
    case '100to150': multiplier = 2.0; break;
    case '150to300': multiplier = 3.0; break;
    case 'over300': multiplier = 4.0; break;
  }

  const diet: RecommendationPlan = {
    title: `[${opt1.companyName}] 가성비 최우선 플랜`,
    description: `${opt1.productName}을 활용한 시장 최저가 수준의 실손 전환 프로젝트입니다.`,
    estimatedPremium: Math.round((opt1.premium * multiplier) / 10) * 10,
    coverageChanges: [
      '업계 최저 수준 보험료',
      '자기부담금 상향(20~30%)', 
      '비급여 차등제 적용'
    ],
    switchingLossNotice: '보장 범위가 좁아질 수 있으니 신중히 결정하세요.'
  };

  return {
    estimatedPremium: diet.estimatedPremium,
    efficiency: multiplier <= 1 ? 95 : 40,
    deficiencies: [],
    scores: { totalScore: multiplier <= 1 ? 90 : 50 },
    recommendations: {
      diet,
      upgrade: {
        title: `[${opt2.companyName}] 가장 많이 추천하는 플랜`,
        description: `많은 고객들이 선택하는 ${opt2.companyName}의 표준 실손 결합형 업그레이드입니다.`,
        estimatedPremium: Math.round((opt2.premium * multiplier) / 10) * 10,
        coverageChanges: ['가장 높은 가입 만족도', '4세대 전환으로 비용 절약', '3대 진단비 보완'],
        switchingLossNotice: '기존 실손의 가입 시기에 따라 혜택이 다릅니다.'
      },
      hybrid: {
        title: `[${opt3.companyName}] 보장 강화형 플랜`,
        description: `보험료보다는 탄탄한 보장과 브랜드 신뢰도를 중시하는 프리미엄 선택지입니다.`,
        estimatedPremium: Math.round((opt3.premium * multiplier) / 10) * 10,
        coverageChanges: ['브랜드 인지도 1위 기업', '부수 특약 선택 가용성', '신속한 보상 프로세스'],
        switchingLossNotice: '단독 가입이 어려운 회사가 있을 수 있습니다.'
      }
    }
  };
};
