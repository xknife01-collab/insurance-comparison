import { RecommendationPlan } from '../../../types/insurance';

/**
 * 재물종합보험 분석 엔진
 * 입력 정보(업종 유형, 건물 등급, 가입 금액, 선택 특약, 상세 타입)를 기반으로
 * 보장 점수, 효율성 및 추천 플랜을 생성합니다.
 */
export const analyzeProperty = (analysis: any): any => {
  const options = analysis._allOptions || [];
  
  // 기본 보험사 정보 매핑
  const defaultOption = { 
    premium: analysis._realDbPremium || 45000, 
    productName: analysis._productName || '재물종합 자산보호보험',
    companyName: analysis._companyName || '추천 재물보험사'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const propOpts = analysis.property || {
    businessType: 'restaurant',
    buildingGrade: 'grade_1',
    buildingLimit: 200000000, // 2억
    interiorLimit: 50000000,  // 5천
    equipmentLimit: 30000000, // 3천
    inventoryLimit: 20000000, // 2천
    hasWaterLeak: true,
    hasPremisesLiability: true,
    hasBusinessInterruption: false,
    hasFoodLiability: true,
    hasMachineryBreakdown: false,
    subType: '상가 화재형'
  };

  const subType = propOpts.subType || '상가 화재형';

  // 1. 세부 보장 점수 계산
  // 화재재산 점수: 건물 및 시설 가입금액 충분성
  const totalAssets = propOpts.buildingLimit + propOpts.interiorLimit + propOpts.equipmentLimit + propOpts.inventoryLimit;
  let propertyScore = 50;
  if (totalAssets >= 500000000) propertyScore = 95;
  else if (totalAssets >= 200000000) propertyScore = 85;
  else if (totalAssets >= 100000000) propertyScore = 70;

  // 배상책임 점수: 업종별 필수 배상 특약 매핑
  let liabilityScore = 30;
  let hasNecessaryLiability = false;
  if (propOpts.businessType === 'restaurant') {
    hasNecessaryLiability = propOpts.hasFoodLiability && propOpts.hasPremisesLiability;
  } else {
    hasNecessaryLiability = propOpts.hasPremisesLiability;
  }
  if (hasNecessaryLiability) {
    liabilityScore = 95;
  } else if (propOpts.hasPremisesLiability || propOpts.hasFoodLiability) {
    liabilityScore = 70;
  }

  // 비즈니스 연속성 점수: 휴업손해 및 누수, 기계고장 (업종 매핑)
  let continuityScore = 40;
  const needMachinery = propOpts.businessType === 'factory' || propOpts.businessType === 'warehouse';
  const hasMachineryOk = !needMachinery || propOpts.hasMachineryBreakdown;
  const hasLeakOk = propOpts.hasWaterLeak;
  const hasInterruptionOk = propOpts.hasBusinessInterruption;

  let continuityMatchCount = 0;
  if (hasMachineryOk) continuityMatchCount++;
  if (hasLeakOk) continuityMatchCount++;
  if (hasInterruptionOk) continuityMatchCount++;

  if (continuityMatchCount === 3) continuityScore = 95;
  else if (continuityMatchCount === 2) continuityScore = 75;
  else if (continuityMatchCount === 1) continuityScore = 55;

  // 건물 급수 보너스/패널티
  const gradeScore = propOpts.buildingGrade === 'grade_1' ? 95 : propOpts.buildingGrade === 'grade_2' ? 80 : 50;

  // 종합 점수 계산 (상세 타입별 가중치 조절)
  let totalScore = 0;
  if (subType === '화재배상책임형') {
    // 배상책임 집중형: 배상책임 45%, 재산 20%, 연속성 15%, 등급 20%
    totalScore = Math.round((propertyScore * 0.20) + (liabilityScore * 0.45) + (continuityScore * 0.15) + (gradeScore * 0.20));
  } else {
    // 상가 화재형 (재산 집중형): 재산 40%, 배상책임 20%, 연속성 20%, 등급 20%
    totalScore = Math.round((propertyScore * 0.40) + (liabilityScore * 0.20) + (continuityScore * 0.20) + (gradeScore * 0.20));
  }

  // 2. 가성비 및 실제 월보험료 추정 (업종 요율 x 건물등급 x 자산금액)
  let baseRate = 0.0005; // 사무실 기본
  if (propOpts.businessType === 'retail') baseRate = 0.0008;
  else if (propOpts.businessType === 'academy') baseRate = 0.0006;
  else if (propOpts.businessType === 'restaurant') baseRate = 0.0015;
  else if (propOpts.businessType === 'warehouse') baseRate = 0.0022;
  else if (propOpts.businessType === 'factory') baseRate = 0.0035;

  // 건물 급수에 따른 보정 계수
  let gradeMultiplier = 1.0;
  if (propOpts.buildingGrade === 'grade_1') gradeMultiplier = 0.8;
  else if (propOpts.buildingGrade === 'grade_3') gradeMultiplier = 1.4;

  // 기본 재산 보험료 계산 (연간 요율 기반의 대략적인 월할 계산)
  const annualPremium = totalAssets * baseRate * gradeMultiplier;
  let monthlyBase = Math.round((annualPremium / 12) / 100) * 100;
  if (monthlyBase < 10000) monthlyBase = 10000; // 최저보험료 1만원 적용

  // 특약 추가 보험료
  let riderPremium = 0;
  if (propOpts.hasWaterLeak) riderPremium += 3500;
  if (propOpts.hasPremisesLiability) riderPremium += 5000;
  if (propOpts.hasBusinessInterruption) riderPremium += 8000;
  if (propOpts.hasFoodLiability) riderPremium += 4000;
  if (propOpts.hasMachineryBreakdown) riderPremium += 15000;

  const estimatedBasePremium = monthlyBase + riderPremium;

  // 가성비 지표 (10만 원당 보장 가치 계산)
  const efficiency = Math.min(99.9, Math.max(20, (totalScore / (estimatedBasePremium / 1000)) * 18));

  // 3. 부족한 보장 항목 도출 (상세 타입에 맞추어 우선순위 변경)
  const deficiencies: string[] = [];

  if (subType === '화재배상책임형') {
    if (!propOpts.hasPremisesLiability) {
      deficiencies.push('⚠️ 핵심 배상책임 공백: 화재배상책임 및 시설소유자배상책임이 미가입 상태입니다.');
    }
    if (propOpts.businessType === 'restaurant' && !propOpts.hasFoodLiability) {
      deficiencies.push('⚠️ 음식물배상책임 누락: 식중독 및 매장 내 이물 사고 대비 필수 특약이 누락되었습니다.');
    }
    if (totalAssets < 100000000) {
      deficiencies.push('화재 복구 자산 한도 협소 (최소한의 가재도구 및 시설물 복구비 부족)');
    }
  } else {
    // 상가 화재형
    if (totalAssets < 200000000) {
      deficiencies.push('⚠️ 건물/인테리어 화재실손 보장한도 부족 (실손 화재 복구비 대비 과소가입 상태)');
    }
    if (!propOpts.hasWaterLeak) {
      deficiencies.push('급배수시설누출손해(누수) 보장 공백 (매장 인테리어 침수 피해 우려)');
    }
    if (!propOpts.hasBusinessInterruption) {
      deficiencies.push('점포 휴업손해 특약 누락 (화재 복구 기간 중 고정 비용 미지원)');
    }
  }

  if (propOpts.buildingGrade === 'grade_3') {
    deficiencies.push('건물 구조 취약 (조립식 판넬/목조 등 화재에 취약하며 요율 할증 상태)');
  }

  // 4. 세 가지 시나리오별 추천안 설계
  // 4. 세 가지 시나리오별 추천안 설계 (브랜드 중복 회피)
  // 가장 저렴한 Card 1(실속형)은 하단 리스트의 최저가 상품(opt1)과 가격 및 브랜드를 100% 매칭시킵니다.
  const dietPlan = {
    premium: opt1.premium,
    companyName: opt1.companyName,
    productName: opt1.productName,
    riskPremium: opt1.riskPremium,
    savingsPremium: opt1.savingsPremium
  };

  const usedCompanies = new Set<string>();
  usedCompanies.add(dietPlan.companyName);

  // Upgrade 브랜드 선택 (중복 제거)
  const upgradeOptions = analysis._upgradePlans || [];
  const uniqueUpgrade = upgradeOptions.find((o: any) => !usedCompanies.has(o.companyName)) || analysis._upgradePlan || opt2;
  usedCompanies.add(uniqueUpgrade.companyName);

  const upgradePlan = {
    premium: uniqueUpgrade.premium,
    companyName: uniqueUpgrade.companyName,
    productName: uniqueUpgrade.productName,
    riskPremium: uniqueUpgrade.riskPremium,
    savingsPremium: uniqueUpgrade.savingsPremium
  };

  // Hybrid 브랜드 선택 (중복 제거)
  const hybridOptions = analysis._hybridPlans || [];
  const uniqueHybrid = hybridOptions.find((o: any) => !usedCompanies.has(o.companyName)) || 
                        hybridOptions.find((o: any) => o.companyName !== upgradePlan.companyName) || 
                        analysis._hybridPlan || opt3;

  const hybridPlan = {
    premium: uniqueHybrid.premium,
    companyName: uniqueHybrid.companyName,
    productName: uniqueHybrid.productName,
    riskPremium: uniqueHybrid.riskPremium,
    savingsPremium: uniqueHybrid.savingsPremium
  };

  const dietPremium = dietPlan.premium;
  const dietRisk = dietPlan.riskPremium;
  const dietSavings = dietPlan.savingsPremium;

  const diet: any = {
    title: subType === '화재배상책임형' 
      ? `[${dietPlan.companyName}] 실속 배상책임 방어 플랜`
      : `[${dietPlan.companyName}] 실속 화재재산 안심 플랜`,
    description: subType === '화재배상책임형'
      ? `최소 비용으로 타인에 대한 화재 배상 및 대인/대물 시설소유자 책임만 핵심적으로 방어하는 소상공인 알뜰 플랜입니다.`
      : `자산 한도를 필수 수준으로 맞추고 최소 비용으로 화재 재산 손해만 깔끔하게 보장하는 실속 재물 플랜입니다.`,
    estimatedPremium: dietPlan.premium,
    riskPremium: dietPlan.riskPremium,
    savingsPremium: dietPlan.savingsPremium,
    companyName: dietPlan.companyName,
    productName: dietPlan.productName,
    isProperty: true,
    coverageChanges: subType === '화재배상책임형'
      ? [
          '건물/시설 가입금액 최소 설계 (건물 1억, 시설 3천만)',
          '의무 배상책임 및 시설배상 한도 유지',
          '누수 및 휴업손해 등 부가 특약 제외',
          `최저보험료 차액 ${(dietPlan.savingsPremium || 0).toLocaleString()}원 적립금으로 자동 전환`
        ]
      : [
          '건물 및 시설 가입금액 20% 축소 조정',
          '누수 보장 및 휴업손해 특약 제외',
          `최저보험료 차액 ${(dietPlan.savingsPremium || 0).toLocaleString()}원 적립금으로 자동 전환`
        ],
    switchingLossNotice: '화재로 인한 영업 중단 시 임차료나 직원 인건비 등 간접 피해는 보상되지 않습니다.'
  };

  const upgradePremium = upgradePlan.premium;
  const upgradeRisk = upgradePlan.riskPremium;
  const upgradeSavings = upgradePlan.savingsPremium;

  const upgrade: any = {
    title: subType === '화재배상책임형'
      ? `[${upgradePlan.companyName}] 배상 든든 밸런스 플랜`
      : `[${upgradePlan.companyName}] 자산 실손 밸런스 플랜`,
    description: subType === '화재배상책임형'
      ? `대인/대물 시설배상 한도를 극대화하고 음식물 배상까지 탑재하여 소상공인의 법적 리스크를 완벽하게 방어하는 맞춤형 플랜입니다.`
      : `설정한 매장 자산 가치를 100% 실손 보상하며, 누수로 인한 건물 침수 피해까지 완벽하게 커버하는 가장 권장해 드리는 설계안입니다.`,
    estimatedPremium: upgradePlan.premium,
    riskPremium: upgradePlan.riskPremium,
    savingsPremium: upgradePlan.savingsPremium,
    companyName: upgradePlan.companyName,
    productName: upgradePlan.productName,
    isProperty: true,
    coverageChanges: subType === '화재배상책임형'
      ? [
          '이웃 건물 번짐 대물배상책임 한도 상향',
          '시설소유자배상 및 업종 맞춤 배상책임 필수 탑재',
          '급배수시설누출손해(누수) 특약 기본 탑재',
          `최저보험료 차액 ${(upgradePlan.savingsPremium || 0).toLocaleString()}원 적립금으로 자동 전환`
        ]
      : [
          '건물 및 시설 인테리어 실손보상 가액 100% 적용',
          '급배수시설누출(누수) 손해 보장 기본 탑재',
          '기본 시설소유자 및 화재 대물배상 탑재',
          `최저보험료 차액 ${(upgradePlan.savingsPremium || 0).toLocaleString()}원 적립금으로 자동 전환`
        ],
    switchingLossNotice: '보장 한도액 내에서 발생한 실제 손해액만 실손 비례 보상됩니다.'
  };

  const hybridPremium = hybridPlan.premium;
  const hybridRisk = hybridPlan.riskPremium;
  const hybridSavings = hybridPlan.savingsPremium;

  const hybrid: any = {
    title: `[${hybridPlan.companyName}] 프리미엄 사업장 마스터 플랜`,
    description: `화재 재산 손해 100% 보장은 물론 주변 상가 피해 배상 한도 최대(10억) 설정, 영업 중단 시 임차료/인건비를 지원하는 최고급 소상공인 올케어 플랜입니다.`,
    estimatedPremium: hybridPlan.premium,
    riskPremium: hybridPlan.riskPremium,
    savingsPremium: hybridPlan.savingsPremium,
    companyName: hybridPlan.companyName,
    productName: hybridPlan.productName,
    isProperty: true,
    coverageChanges: [
      '대물 배상책임 한도 최대 10억 원 상향',
      '점포휴업손해 특약 추가 (1일당 최대 10만 원 지원)',
      '급배수시설누출 및 기계/전기 고장 보장 종합 탑재',
      `최저보험료 차액 ${(hybridPlan.savingsPremium || 0).toLocaleString()}원 적립금으로 자동 전환`
    ],
    switchingLossNotice: '월 고정 납입 비용이 상승하므로 사업장 매출 및 자산 규모에 맞추어 가입 한도를 조율하십시오.'
  };

  return {
    estimatedPremium: upgradePremium,
    efficiency,
    deficiencies,
    scores: {
      propertyScore,
      liabilityScore,
      continuityScore,
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
