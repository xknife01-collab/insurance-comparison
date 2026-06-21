import { RecommendationPlan } from '../../../types/insurance';

/**
 * 주택화재보험 분석 엔진
 * 입력 정보(주거형태, 거주구분, 건물 면적, 가재도구 한도, 특약 상태 등)를 바탕으로
 * 보장 등급 평점, 가성비 지표 및 추천 플랜을 도출합니다.
 */
export const analyzeFire = (analysis: any): any => {
  const options = analysis._allOptions || [];

  const defaultOption = {
    premium: analysis._realDbPremium || 10000,
    riskPremium: analysis._realDbPremium || 8000,
    savingsPremium: 2000,
    productName: analysis._productName || '주택화재보험',
    companyName: analysis._companyName || '추천 화재보험사'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const fireOpts = analysis.fire || {
    residenceType: 'apartment',
    occupancyType: 'owner',
    buildingArea: 84,
    structureGrade: 1,
    hasWaterLeakRider: true,
    hasLiabilityRider: true,
    hasTemporaryHousingRider: true,
    householdGoodsLimit: 30000000,
    buildingLimit: 100000000,
  };

  // 1. 세부 보장 점수 매칭
  // 건물 구조 등급 점수 (structureScore)
  let structureScore = 95;
  if (Number(fireOpts.structureGrade) === 2) structureScore = 75;
  else if (Number(fireOpts.structureGrade) === 3) structureScore = 55;

  // 급배수 누수 점수
  const waterLeakScore = fireOpts.hasWaterLeakRider ? 95 : (fireOpts.residenceType === 'apartment' ? 20 : 40);
  
  // 화재배상/일배책 배상 책임 점수
  const liabilityScore = fireOpts.hasLiabilityRider ? 95 : 30;

  // 임시거주비 가입 점수 (housingScore)
  const housingScore = fireOpts.hasTemporaryHousingRider ? 95 : 40;

  // 건물 소실 한도 점수 (limitScore)
  const pyeong = fireOpts.buildingArea * 0.3025;
  const costPerPyeong = fireOpts.residenceType === 'apartment' ? 5500000 : fireOpts.residenceType === 'villa' ? 5000000 : 6500000;
  const recommendedLimit = Math.round((pyeong * costPerPyeong) / 10000000) * 10000000;
  
  let limitScore = 55;
  if (fireOpts.occupancyType === 'tenant') {
    limitScore = 95; // 세입자는 자가 건물이 없으므로 건물가입제외에 대해 감점 없이 최적화 처리
  } else {
    if (fireOpts.buildingLimit >= recommendedLimit * 0.9) {
      limitScore = 95;
    } else if (fireOpts.buildingLimit >= recommendedLimit * 0.6) {
      limitScore = 80;
    } else {
      limitScore = 55;
    }
  }

  // 가재도구 한도 점수
  const recommendedGoodsLimit = pyeong < 15 ? 15000000 : pyeong < 25 ? 20000000 : pyeong < 35 ? 30000000 : 50000000;
  const goodsScore = fireOpts.householdGoodsLimit >= recommendedGoodsLimit * 0.9 ? 95 : (fireOpts.householdGoodsLimit >= recommendedGoodsLimit * 0.6 ? 80 : 50);

  // 특약 완비 점수 (riderScore)
  let riderCount = 0;
  if (fireOpts.hasWaterLeakRider) riderCount++;
  if (fireOpts.hasLiabilityRider) riderCount++;
  if (fireOpts.hasTemporaryHousingRider) riderCount++;
  const riderScore = riderCount === 3 ? 95 : riderCount === 2 ? 75 : riderCount === 1 ? 55 : 30;

  // 전체 종합 점수 (6개 부문 균등 평균)
  const totalScore = Math.round(
    (structureScore + riderScore + limitScore + waterLeakScore + liabilityScore + goodsScore) / 6
  );

  // 2. 가성비 지표 (1만 원당 보장 가치 계산)
  const premium = analysis.monthlyPremium || opt1.premium || 10000;
  const efficiency = Math.min(99.9, Math.max(25, (totalScore / (premium / 100)) * 9));

  // 3. 부족한 보장 항목 (Deficiencies) 및 팁 도출
  const deficiencies: string[] = [];
  const recommendationsTips: string[] = [];

  if (!fireOpts.hasWaterLeakRider) {
    deficiencies.push('급배수시설누출손해(누수 피해) 보장 공백');
    recommendationsTips.push('아파트나 연립주택의 경우 배관 노후로 인한 누수 발생률이 높으므로 급배수 특약을 필수 탑재하는 것이 좋습니다.');
  }
  if (!fireOpts.hasLiabilityRider) {
    deficiencies.push('화재배상책임(이웃집 대물/대인 피해보상) 공백');
    recommendationsTips.push('내 집 화재가 이웃집으로 번질 경우 실화책임법에 의해 고액의 손해배상 청구가 들어올 수 있어 화재배상은 최대로 설계해야 합니다.');
  }
  if (!fireOpts.hasTemporaryHousingRider) {
    deficiencies.push('화재 복구기간 중 임시 거주비(숙식/일당) 공백');
  }
  if (fireOpts.occupancyType !== 'tenant' && fireOpts.buildingLimit < 80000000) {
    deficiencies.push('건물 가입금액 과소 설정 (실제 재건축/복구 단가 미달 우려)');
  }
  if (fireOpts.householdGoodsLimit < 20000000) {
    deficiencies.push('가재도구 한도 부족 (고급 가전/가구 재구입 비용 대비 부족)');
  }

  // 4. 추천 플랜 3가지 설계
  // Diet: 실속형 가성비 플랜 (가재도구/건물 최소, 누수 제외, 화재배상 포함하여 최저보험료 수준)
  const baseDietPremium = opt1.riskPremium ? Math.round((opt1.riskPremium * 0.65) / 100) * 100 : Math.round((opt1.premium * 0.65) / 100) * 100;
  const dietRisk = baseDietPremium;
  const dietSavings = Math.max(0, 10000 - dietRisk);
  const dietPremium = Math.max(10000, baseDietPremium);
  
  const diet: any = {
    title: `[${opt1.companyName}] 실속 세입자 가성비 플랜`,
    description: `세입자(임차인) 필수인 임차자배상책임과 내 가재도구 유실만 딱 집중하여 월 납입금을 아끼는 알짜배기 플랜입니다.`,
    estimatedPremium: dietPremium,
    riskPremium: dietRisk,
    savingsPremium: dietSavings,
    companyName: opt1.companyName,
    productName: opt1.productName,
    isFire: true,
    coverageChanges: [
      '건물 가입금액 최소 설계',
      '화재배상책임 10억 최적화',
      '임시거주비 및 급배수 누수 특약 제외',
      `최저보험료 차액 ${dietSavings.toLocaleString()}원 적립금으로 자동 전환`
    ],
    switchingLossNotice: '누수로 인한 자택 및 아랫집 복구 비용 보장이 제외되어 배수 배관 파손 시 전액 자부담해야 합니다.'
  };

  // Upgrade: 안심 밸런스 플랜 (건물 1억~1.5억, 가재도구 3000만, 누수 탑재, 화재배상 20억)
  const baseUpgradePremium = opt2.riskPremium ? Math.round((opt2.riskPremium * 1.0) / 100) * 100 : Math.round((opt2.premium * 1.0) / 100) * 100;
  const upgradeRisk = baseUpgradePremium;
  const upgradeSavings = Math.max(0, 10000 - upgradeRisk);
  const upgradePremium = Math.max(10000, baseUpgradePremium);
  
  const upgrade: any = {
    title: `[${opt2.companyName}] 올인원 안심 밸런스 플랜`,
    description: `소유주와 임차인 모두 만족하는 최적 설계로, 급배수 누수 보장과 화재배상 한도를 넉넉히 탑재한 대표 추천 플랜입니다.`,
    estimatedPremium: upgradePremium,
    riskPremium: upgradeRisk,
    savingsPremium: upgradeSavings,
    companyName: opt2.companyName,
    productName: opt2.productName,
    isFire: true,
    coverageChanges: [
      '건물/가재도구 실손 보상 기준 설정',
      '급배수시설누출손해 특약 기본 탑재',
      '화재배상책임 대물 20억 최대한도 업그레이드',
      `최저보험료 차액 ${upgradeSavings.toLocaleString()}원 적립금으로 자동 전환`
    ],
    switchingLossNotice: '일반 콘크리트조(1급) 구조가 아닌 목조주택 등의 경우 인수 심사 과정에서 추가 할증이 발생할 수 있습니다.'
  };

  // Hybrid: 프리미엄 마스터 플랜 (건물 2.5억, 가재도구 5000만, 누수 최고액, 화재배상 20억, 임시거주비 최대, 가족 일배책)
  const baseHybridPremium = opt3.riskPremium ? Math.round((opt3.riskPremium * 1.35) / 100) * 100 : Math.round((opt3.premium * 1.35) / 100) * 100;
  const hybridRisk = baseHybridPremium;
  const hybridSavings = Math.max(0, 10000 - hybridRisk);
  const hybridPremium = Math.max(10000, baseHybridPremium);
  
  const hybrid: any = {
    title: `[${opt3.companyName}] 프리미엄 토탈 마스터 플랜`,
    description: `건물 및 가재도구 복구 한도를 극대화하고, 임시 거주비 일당 상향 및 6대 가전제품 고장 수리비 특약까지 풀패키지로 탑재한 프리미엄 설계입니다.`,
    estimatedPremium: hybridPremium,
    riskPremium: hybridRisk,
    savingsPremium: hybridSavings,
    companyName: opt3.companyName,
    productName: opt3.productName,
    isFire: true,
    coverageChanges: [
      '건물 복구 가입금액 최대 한도 증액',
      '임시 거주비(숙식비용) 90일 무상 매칭',
      '가전제품 고장수리비 특약 및 가족 일상생활 배상책임 탑재',
      `최저보험료 차액 ${hybridSavings.toLocaleString()}원 적립금으로 자동 전환`
    ],
    switchingLossNotice: '가전제품 수리비 특약은 구매 후 일정 연식 이내인 정품 가전제품에만 수리 비용 청구가 가능합니다.'
  };

  return {
    estimatedPremium: upgradePremium,
    efficiency,
    deficiencies,
    recommendationsTips,
    scores: {
      waterLeakScore,
      liabilityScore,
      buildingScore: limitScore,
      limitScore,
      goodsScore,
      structureScore,
      riderScore,
      housingScore,
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};


