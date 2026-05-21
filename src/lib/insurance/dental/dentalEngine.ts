import { RecommendationPlan } from '../../../types/insurance/common';

/**
 * 치아 보험 분석 엔진
 * 임플란트 개수 제한, 크라운 보장 금액, 보존/보철 치료 집중도를 분석하여 
 * 사용자 맞춤형 추천 플랜을 생성합니다.
 */
export const analyzeDental = (analysis: any): any => {
  const implantScore = analysis.implantLimit === 'unlimited' ? 95 : 70;
  const crownScore = analysis.crownAmount >= 400000 ? 90 : (analysis.crownAmount >= 200000 ? 70 : 50);
  const conservativeScore = analysis.focus === 'conservative' ? 95 : 75;
  
  const total = (implantScore + crownScore + conservativeScore) / 3;

  const deficiencies: string[] = [];
  if (analysis.implantLimit !== 'unlimited') deficiencies.push('임플란트 개수 제한 (무제한 추천)');
  if (analysis.crownAmount < 400000) deficiencies.push('크라운 보장 금액 40만 원 이상 권장');

  const allOptions = (analysis as any)._allOptions || [];
  
  const cleanName = (name: string) => {
    if (!name) return '';
    const cleaned = name.split(')')[0] + ')';
    return cleaned.replace(/치석제거.*/, '').replace(/치료.*/, '').trim();
  };

  const bestPlan = allOptions[0] || { premium: 38500, companyName: '라이나생명', productName: '(무)THE건강한치아보험V' };
  const upgradePlan = allOptions[1] || { premium: 48900, companyName: '삼성화재', productName: '치아보험 덴탈파트너' };

  return {
    estimatedPremium: bestPlan.premium,
    scores: {
      implant: implantScore,
      crown: crownScore,
      conservative: conservativeScore,
      totalScore: total
    },
    efficiency: (total / (analysis.monthlyPremium / 1000)) * 1.2,
    deficiencies,
    recommendations: {
      diet: {
        title: '다이어트 최적가 플랜',
        companyName: bestPlan.companyName,
        productName: cleanName(bestPlan.productName),
        description: '보장은 그대로 유지하면서 40대 평균 보험료 대비 약 20%를 절감합니다.',
        estimatedPremium: bestPlan.premium,
        coverageChanges: [
          '40대 치아보험 평균가 대비 저렴한 보험사 선정',
          '불필요한 소액 특약 다이어트'
        ],
        switchingLossNotice: '감액 기간(1~2년)이 초기화되므로 치료 계획을 확인하세요.'
      },
      upgrade: {
        title: '임플란트 무제한 플랜',
        companyName: upgradePlan.companyName,
        productName: cleanName(upgradePlan.productName),
        description: '개수 제한 없는 임플란트 보장과 높은 크라운 한도를 확보합니다.',
        estimatedPremium: upgradePlan.premium,
        coverageChanges: [
          '임플란트 보장 한도 무제한 상향',
          '크라운 치료비 50만 원으로 증액'
        ],
        switchingLossNotice: '90일 면책 기간 동안은 질병 보장이 제한됩니다.'
      },
      hybrid: {
        title: '보존치료 강화형',
        companyName: 'DB손해보험',
        productName: '참좋은치아보험',
        description: '레진, 인레이 등 잦은 보존 치료에 특화된 가성비 플랜입니다.',
        estimatedPremium: Math.round(bestPlan.premium * 1.1),
        coverageChanges: [
          '보존 치료 한도 업계 최고 수준 증액',
          '치석 제거 등 정기 관리 혜택 포함'
        ],
        switchingLossNotice: '보철 치료 한도가 소폭 조정될 수 있습니다.'
      }
    }
  };
};
