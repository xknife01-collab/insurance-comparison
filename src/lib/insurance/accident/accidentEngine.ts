import { RecommendationPlan } from '../../../types/insurance';

export const analyzeAccident = (analysis: any): any => {
  const options = analysis._allOptions || [];
  
  const defaultOption = { 
    premium: analysis._realDbPremium || 15000, 
    productName: analysis._productName || '종합 일상 상해보험',
    companyName: analysis._companyName || '추천 상해보험사'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const opts = analysis.accident || {
    accidentDeathLimit: 50000000,
    accidentDisabilityLimit: 50000000,
    fractureLimit: 300000,
    castLimit: 100000,
    surgeryLimit: 500000,
    hospitalDailyLimit: 20000,
    jobClass: 1,
    drivingType: 'private',
    hasLeisureRider: false
  };

  // 1. 점수 환산
  // 사망보장 점수 (최대 2억 기준)
  const deathScore = Math.min(100, Math.round((opts.accidentDeathLimit / 200000000) * 100));
  // 후유장해 점수 (최대 1.5억 기준)
  const disabilityScore = Math.min(100, Math.round((opts.accidentDisabilityLimit / 150000000) * 100));
  // 치료/수술/골절 일상 특약 점수
  const dailyTotal = opts.fractureLimit + opts.castLimit + opts.surgeryLimit;
  const treatmentScore = Math.min(100, Math.round((dailyTotal / 3300000) * 100)); // 최대 330만 기준

  const totalScore = Math.round((deathScore + disabilityScore + treatmentScore) / 3);

  // 2. 가성비 지수
  const premium = analysis.monthlyPremium || opt1.premium || 15000;
  const efficiency = Math.min(99.9, Math.max(20, (totalScore / (premium / 1000)) * 12));

  // 3. 부족 보장 항목 도출
  const deficiencies: string[] = [];
  if (opts.accidentDeathLimit < 100000000) {
    deficiencies.push('상해사망 보장액 부족 (최소 1억 권장)');
  }
  if (opts.accidentDisabilityLimit < 100000000) {
    deficiencies.push('상해후유장해 보장액 부족 (최소 1억 권장)');
  }
  if (opts.fractureLimit < 500000) {
    deficiencies.push('골절진단비 한도 확대 권장 (치아파절 대비)');
  }
  if (opts.surgeryLimit < 1000000) {
    deficiencies.push('상해수술비 보장 보완 권장');
  }
  if (opts.jobClass >= 2 && !opts.hasLeisureRider) {
    deficiencies.push('레저스포츠/야외 활동 재해를 위한 전용 특약 추가 권장');
  }

  // 4. 추천 시나리오 플랜 설계 (브랜드 중복 회피)
  const dietPlan = {
    premium: opt1.premium,
    companyName: opt1.companyName,
    productName: opt1.productName
  };

  const usedCompanies = new Set<string>();
  usedCompanies.add(dietPlan.companyName);

  // Upgrade 브랜드 선택
  const upgradeOptions = analysis._upgradePlans || [];
  const uniqueUpgrade = upgradeOptions.find((o: any) => !usedCompanies.has(o.companyName)) || analysis._upgradePlan || opt2;
  usedCompanies.add(uniqueUpgrade.companyName);

  const upgradePlan = {
    premium: Math.max(uniqueUpgrade.premium, dietPlan.premium + 3000),
    companyName: uniqueUpgrade.companyName,
    productName: uniqueUpgrade.productName
  };

  // Hybrid 브랜드 선택
  const hybridOptions = analysis._hybridPlans || [];
  const uniqueHybrid = hybridOptions.find((o: any) => !usedCompanies.has(o.companyName)) || 
                       hybridOptions.find((o: any) => o.companyName !== upgradePlan.companyName) || 
                       analysis._hybridPlan || opt3;

  const hybridPlan = {
    premium: Math.max(uniqueHybrid.premium, upgradePlan.premium + 5000),
    companyName: uniqueHybrid.companyName,
    productName: uniqueHybrid.productName
  };

  const isDisability = opts.subType === '상해장해형';

  const diet: RecommendationPlan = {
    title: isDisability 
      ? `[${dietPlan.companyName}] 장해 실속 가성비 플랜` 
      : `[${dietPlan.companyName}] 치료 실속 가성비 플랜`,
    description: isDisability
      ? '사망/장해 보장금액 중심의 미니멀 설계로 불필요한 일상 특약을 걷어내고 큰 재해에 대비한 고효율 가성비 플랜입니다.'
      : '일상적인 골절 및 수술비 중심으로 최소 세팅하여 다치기 쉬운 생활 상해의 본인부담 치료비를 덜어주는 가성비 플랜입니다.',
    estimatedPremium: dietPlan.premium,
    companyName: dietPlan.companyName,
    productName: dietPlan.productName,
    coverageChanges: isDisability
      ? [
          '상해사망 5,000만 원 축소 조정',
          '상해후유장해 3,000만 원 축소 조정',
          '깁스/수술비 및 치료비 특약 전면 제외'
        ]
      : [
          '상해사망 및 장해한도를 최소화하여 보험료 절감',
          '골절진단비 20만 원 및 깁스치료비 미가입 구성',
          '상해수술비 30만 원 한도의 미니멀 가입'
        ],
    switchingLossNotice: '사고 규모가 큰 대형 재해나 장기 입원 시 본인 부담 비용이 크게 늘어날 수 있습니다.'
  };

  const upgrade: RecommendationPlan = {
    title: isDisability
      ? `[${upgradePlan.companyName}] 장해 안심 밸런스 플랜`
      : `[${upgradePlan.companyName}] 골절/치료 안심 밸런스 플랜`,
    description: isDisability
      ? '상해사망 1억, 상해후유장해 1억 원을 균형 있게 확보하여 불의의 중대 재해 발생 시 가족의 생활 자산을 보호하는 추천 플랜입니다.'
      : '일상 속 빈번한 골절(치아파절 포함)과 깁스치료, 상해수술비 및 입원일당을 가장 빈틈없이 조화롭게 구성한 치료 강화 추천 플랜입니다.',
    estimatedPremium: upgradePlan.premium,
    companyName: upgradePlan.companyName,
    productName: upgradePlan.productName,
    coverageChanges: isDisability
      ? [
          '상해사망 및 후유장해 각 1억 원 든든하게 확보',
          '대형 사고 및 재해 장해 보장에 집중',
          '일상 수술비/깁스는 기본 한도로 보완'
        ]
      : [
          '골절진단비 50만 원 및 깁스치료비 20만 원 확보',
          '상해수술비 100만 원 + 입원일당 2만 원 균형 구성',
          '사망/장해 한도는 실속형 수준으로 낮춤'
        ],
    switchingLossNotice: '위험직군(3급)의 경우 직업 위험률에 의해 요율 할증이 발생할 수 있습니다.'
  };

  const hybrid: RecommendationPlan = {
    title: isDisability
      ? `[${hybridPlan.companyName}] 장해 프리미엄 마스터 플랜`
      : `[${hybridPlan.companyName}] 치료 프리미엄 마스터 플랜`,
    description: isDisability
      ? '상해사망 2억, 후유장해 1.5억의 업계 최대 한도를 구성하고 주말/레저 재해 장해까지 빈틈없이 커버하는 프리미엄 보장 자산 플랜입니다.'
      : '치아파절 포함 골절 진단 100만 원, 상해수술 200만 원, 깁스 50만 원 등 일상 치료비 한도를 한계까지 극대화한 치료 집중 프리미엄 플랜입니다.',
    estimatedPremium: hybridPlan.premium,
    companyName: hybridPlan.companyName,
    productName: hybridPlan.productName,
    coverageChanges: isDisability
      ? [
          '상해사망 2억 / 후유장해 1.5억 우수한 수준 보장',
          '중대 장해 진단 시 거액의 대체 소득 확보 가능',
          '안정적인 자산 보존을 위한 하이엔드 솔루션'
        ]
      : [
          '골절진단비 100만 원 및 상해수술비 200만 원 확보',
          '깁스치료비 50만 원 및 입원일당 3만 원 최대화',
          '레저스포츠 상해 특약(주말/야외 상해 추가 보장) 탑재'
        ],
    switchingLossNotice: '보험료 납입에 무리가 없는지 월 소득 대비 상해보험 지출 비율을 꼭 확인하세요.'
  };

  return {
    estimatedPremium: upgradePlan.premium,
    efficiency,
    deficiencies,
    scores: {
      deathScore,
      disabilityScore,
      treatmentScore,
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
