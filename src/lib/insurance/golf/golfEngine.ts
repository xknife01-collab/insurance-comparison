import { RecommendationPlan } from '../../../types/insurance';

export const analyzeGolf = (analysis: any): any => {
  const options = analysis._allOptions || [];
  
  // 기본값 설정
  const defaultOption = { 
    premium: analysis._realDbPremium || 9900, 
    productName: analysis._productName || '골프안심보험',
    companyName: analysis._companyName || '추천 골프보험사'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const golfOpts = analysis.golf || {
    gameType: 'amateur',
    planType: 'annual',
    durationDays: 365,
    isGroup: false,
    companionNames: [],
    hasHoleInOneRider: true,
    hasLiabilityRider: true,
    hasEquipmentRider: true,
  };

  // 1. 세부 보장 영역별 점수 환산
  const holeInOneScore = golfOpts.gameType === 'professional' ? 20 : (golfOpts.hasHoleInOneRider ? 95 : 30);
  const liabilityScore = golfOpts.hasLiabilityRider ? 95 : 35;
  const equipmentScore = golfOpts.gameType === 'professional' ? 20 : (golfOpts.hasEquipmentRider ? 90 : 30);
  const groupScore = golfOpts.isGroup ? 95 : 50;

  // 전체 종합 점수
  const totalScore = Math.round(
    (holeInOneScore + liabilityScore + equipmentScore + groupScore) / 4
  );

  // 2. 가성비 지표 (10만 원당 보장 가치 계산)
  const premium = analysis.monthlyPremium || opt1.premium || 9900;
  // 골프보험은 보험료가 매우 낮아 점수가 크게 튈 수 있으므로 적절하게 스케일링
  const efficiency = Math.min(99.9, Math.max(30, (totalScore / (premium / 100)) * 8));

  // 3. 부족한 보장 항목 도출
  const deficiencies: string[] = [];
  
  if (golfOpts.gameType === 'professional') {
    deficiencies.push('프로 선수 홀인원/용품 보장 제외 제약');
  } else {
    if (!golfOpts.hasHoleInOneRider) {
      deficiencies.push('홀인원 축하 비용 보장 공백');
    }
    if (!golfOpts.hasEquipmentRider) {
      deficiencies.push('골프용품 도난/파손 보장 공백');
    }
  }

  if (!golfOpts.hasLiabilityRider) {
    deficiencies.push('골프 경기 중 배상책임 보장 공백');
  }

  if (!golfOpts.isGroup) {
    deficiencies.push('동반 4인 단체 할인 미적용 (5% 즉시 절감 가능)');
  }

  // 4. 세 가지 시나리오별 추천안 설계
  // Diet: 가성비 실속형, 배상책임 위주
  const dietPremium = Math.round((opt1.premium * 0.7) / 100) * 100;
  const diet: RecommendationPlan = {
    title: `[${opt1.companyName}] 실속 원데이/연간 플랜`,
    description: `골프 라운딩 중 타인에게 입힌 상해 배상책임과 기본 상해 사망 위주로 설계하여 보험료를 극한으로 다이어트한 실속 플랜입니다.`,
    estimatedPremium: dietPremium,
    coverageChanges: [
      '골프 배상책임 1,000만 원 보장',
      '홀인원 및 골프용품 특약 제외',
      '4인 단체 가입 시 5% 추가 할인 적용'
    ],
    switchingLossNotice: '홀인원 축하비용 및 골프용품 분실/도난 비용은 보장 대상에서 제외됩니다.'
  };

  // Upgrade: 안심 밸런스형, 홀인원 100만, 배상 2000만, 용품 100만
  const upgradePremium = Math.round(opt2.premium / 100) * 100;
  const upgrade: RecommendationPlan = {
    title: `[${opt2.companyName}] 골퍼 안심 밸런스 플랜`,
    description: `아마추어 골퍼들의 필수 특약인 홀인원 축하금(100만)과 골프용품 분실, 경기 중 배상책임(2,000만)을 고르게 갖춘 표준 추천 플랜입니다.`,
    estimatedPremium: upgradePremium,
    coverageChanges: [
      '홀인원 비용 100만 원 실손 보장',
      '골프 배상책임 2,000만 원 한도',
      '골프용품 도난/파손 100만 원 보장'
    ],
    switchingLossNotice: '정규 18홀 라운딩에서 달성한 홀인원만 인정되며, 스크린골프는 보장되지 않습니다.'
  };

  // Hybrid: 프리미엄 마스터 플랜, 홀인원 200만, 배상 3000만, 용품 200만
  const hybridPremium = Math.round((opt3.premium * 1.35) / 100) * 100;
  const hybrid: RecommendationPlan = {
    title: `[${opt3.companyName}] VIP 프리미엄 플랜`,
    description: `홀인원 축하비용을 최고 한도(200만)로 증액하고 골프용품 손해 및 골프 카트 탑승 중 상해까지 폭넓게 케어하는 최고급 안심 보장 패키지입니다.`,
    estimatedPremium: hybridPremium,
    coverageChanges: [
      '홀인원 비용 200만 원 업계 최고 보장',
      '골프 배상책임 3,000만 원 확장',
      '골프용품 손해 200만 원 및 카트 사고 상해 탑재'
    ],
    switchingLossNotice: '보장 한도가 극대화된 프리미엄 플랜으로, 다른 골프보험과 중복 가입 시 비례 보상됩니다.'
  };

  return {
    estimatedPremium: upgradePremium,
    efficiency,
    deficiencies,
    scores: {
      holeInOneScore,
      liabilityScore,
      equipmentScore,
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
