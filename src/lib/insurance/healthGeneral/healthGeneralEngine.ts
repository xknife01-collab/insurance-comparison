import { RecommendationPlan } from '../../../types/insurance';

/**
 * 종합건강보험 분석 엔진
 * 입력 정보(진단비 한도, 핵심 특약 가입 상태, 계약 조건)를 기반으로
 * 보장 영역별 점수, 가성비 효율 및 3대 추천 시나리오 플랜을 산출합니다.
 */
export const analyzeHealthGeneral = (analysis: any): any => {
  const options = analysis._allOptions || [];
  
  // 기본 fallback 상품 매핑
  const defaultOption = { 
    premium: analysis._realDbPremium || 65000, 
    productName: analysis._productName || '메이저 종합건강보험',
    companyName: analysis._companyName || '추천 보험사'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const opts = analysis.healthGeneral || {
    cancerLimit: 50000000,
    similarCancerLimit: 10000000,
    brainLimit: 20000000,
    heartLimit: 20000000,
    cardioLimit: 10000000,
    has1to5Surgery: true,
    hasTargetedTherapy: true,
    hasThrombolysis: false,
    hasLiability: true,
    paymentPeriod: 20,
    coveragePeriod: 90,
    isRenewable: false,
    refundType: 'low'
  };

  // 1. 보장 점수 산출 (각 보장 한도를 권장 가이드라인 기준으로 평가)
  const cancerScore = Math.min(100, Math.round(((opts.cancerLimit + opts.similarCancerLimit) / 60000000) * 100));
  const cerebrovascularScore = Math.min(100, Math.round((opts.brainLimit / 30000000) * 100));
  const cardiovascularScore = Math.min(100, Math.round(((opts.heartLimit + opts.cardioLimit) / 30000000) * 100));
  
  // 특약 가입 상태 점수화
  let riderPoints = 30;
  if (opts.has1to5Surgery) riderPoints += 25;
  if (opts.hasTargetedTherapy) riderPoints += 25;
  if (opts.hasLiability) riderPoints += 20;
  const riderScore = Math.min(100, riderPoints);

  // 전체 종합 보장 점수
  const totalScore = Math.round((cancerScore * 0.35) + (cerebrovascularScore * 0.25) + (cardiovascularScore * 0.25) + (riderScore * 0.15));

  // 2. 가성비 지표 (10만 원당 보장 가치 환산)
  const premium = analysis.monthlyPremium || opt1.premium || 65000;
  const efficiency = Math.min(99.9, Math.max(20, (totalScore / (premium / 1000)) * 25));

  // 3. 보장 공백 및 부족 항목 분석
  const deficiencies: string[] = [];
  if (opts.cancerLimit < 30000000) {
    deficiencies.push('일반암 진단비 한도 부족 (권장 5,000만 원)');
  }
  if (opts.similarCancerLimit < 6000000) {
    deficiencies.push('유사암 진단비 한도 부족 (일반암의 20% 수준 권장)');
  }
  if (opts.brainLimit < 20000000) {
    deficiencies.push('뇌혈관질환 진단비 한도 부족 (권장 3,000만 원)');
  }
  if (opts.heartLimit < 20000000) {
    deficiencies.push('허혈성 심장질환 진단비 한도 부족 (권장 2,000만 원)');
  }
  if (opts.cardioLimit < 10000000) {
    deficiencies.push('심혈관질환(부정맥, 심부전 등) 보장 공백');
  }
  if (!opts.has1to5Surgery) {
    deficiencies.push('질병/상해 1-5종 수술비 특약 미가입');
  }
  if (!opts.hasTargetedTherapy) {
    deficiencies.push('고액 치료비 대비 표적항암 치료비 특약 누락');
  }
  if (!opts.hasLiability) {
    deficiencies.push('일상생활배상책임 특약 누락 (타인 피해 대비 필수)');
  }

  // 4. 3가지 최적 추천 시나리오 플랜 설계
  // 첫 번째 실속 다이어트 카드는 하단 가격 비교 테이블의 1순위(최저가) 상품과 가격/정보를 100% 동기화
  const dietPlan = {
    premium: opt1.premium,
    companyName: opt1.companyName,
    productName: opt1.productName
  };

  // 중복 회사 방지를 위한 Set 관리
  const usedCompanies = new Set<string>();
  usedCompanies.add(dietPlan.companyName);

  // 두 번째 업그레이드 카드는 동적으로 계산된 업그레이드 플랜 상품과 가격 매칭 (회사 중복 회피 및 보험료 역전 방지 장치 유지)
  const upgradeOptions = analysis._upgradePlans || [];
  const uniqueUpgrade = upgradeOptions.find((o: any) => !usedCompanies.has(o.companyName)) || analysis._upgradePlan || opt2;
  usedCompanies.add(uniqueUpgrade.companyName);

  const rawUpgradePremium = uniqueUpgrade.premium || Math.round((opt2.premium * 1.12) / 100) * 100;
  const upgradePlan = {
    premium: Math.max(rawUpgradePremium, dietPlan.premium + 5000),
    companyName: uniqueUpgrade.companyName,
    productName: uniqueUpgrade.productName
  };

  // 세 번째 프리미엄 카드는 동적으로 계산된 하이브리드 플랜 상품과 가격 매칭 (회사 중복 회피)
  const hybridOptions = analysis._hybridPlans || [];
  const uniqueHybrid = hybridOptions.find((o: any) => !usedCompanies.has(o.companyName)) || 
                       hybridOptions.find((o: any) => o.companyName !== upgradePlan.companyName) || 
                       analysis._hybridPlan || opt3;

  const rawHybridPremium = uniqueHybrid.premium || Math.round((opt3.premium * 1.45) / 100) * 100;
  const hybridPlan = {
    premium: Math.max(rawHybridPremium, upgradePlan.premium + 10000),
    companyName: uniqueHybrid.companyName,
    productName: uniqueHybrid.productName
  };

  // Diet: 선택한 보장(진단비 및 특약)을 그대로 유지하면서 업계 최저 요율 매칭
  const diet: RecommendationPlan = {
    title: `[${dietPlan.companyName}] 실속 다이어트 플랜`,
    description: '선택하신 보장 조건(진단비 및 특약)을 그대로 유지하면서, 시중 종합건강보험 중 가장 저렴한 최저가 요율을 매칭한 실속 플랜입니다.',
    estimatedPremium: dietPlan.premium,
    companyName: dietPlan.companyName,
    productName: dietPlan.productName,
    coverageChanges: [
      '선택하신 진단비 및 특약 한도 100% 유지',
      '해당 가입 조건 기준 업계 최저 요율 상품 매칭',
      '무해지환급형(저해약환급금형) 최적 세팅 적용'
    ],
    switchingLossNotice: '무해지환급형(저해약환급금형) 상품으로 납입 기간 중 해지 시 해지환급금이 없을 수 있으므로 신중히 검토하세요.'
  };

  const upgradeCancer = Math.max(50000000, opts.cancerLimit + 20000000);
  const upgradeSimilar = Math.max(10000000, upgradeCancer * 0.2);
  const upgradeBrain = Math.max(30000000, opts.brainLimit + 10000000);
  const upgradeHeart = Math.max(20000000, opts.heartLimit + 10000000);

  // Upgrade: 3대 진단비 강화, 1-5종 수술비 및 표적항암 탑재, 비갱신 무해지형
  const upgrade: RecommendationPlan = {
    title: `[${upgradePlan.companyName}] 안심 밸런스 플랜`,
    description: '대한민국 평균 권장 한도에 맞춰 3대 진단비를 든든히 보강하고, 수술비와 최신 표적항암 특약까지 골고루 갖춘 강력 추천 플랜입니다.',
    estimatedPremium: upgradePlan.premium,
    companyName: upgradePlan.companyName,
    productName: upgradePlan.productName,
    coverageChanges: [
      `일반암 ${(upgradeCancer / 10000).toLocaleString()}만 원 및 유사암 ${(upgradeSimilar / 10000).toLocaleString()}만 원 든든 보장`,
      `뇌혈관 ${(upgradeBrain / 10000).toLocaleString()}만 원 / 허혈성 심장 ${(upgradeHeart / 10000).toLocaleString()}만 원 확장`,
      '질병/상해 1-5종 수술비 및 표적항암약물치료비 탑재'
    ],
    switchingLossNotice: '비갱신 무해지환급형 상품으로, 납입 기간(20년) 중도 해지 시 해지환급금이 전혀 발생하지 않습니다.'
  };

  const hybridCancer = Math.max(100000000, opts.cancerLimit + 50000000);
  const hybridSimilar = Math.max(20000000, hybridCancer * 0.2);
  const hybridBrain = Math.max(50000000, opts.brainLimit + 30000000);
  const hybridHeart = Math.max(30000000, opts.heartLimit + 20000000);
  const hybridCardio = Math.max(20000000, opts.cardioLimit + 10000000);

  // Hybrid: 최대 진단비 한도, 전체 특약 풀패키지 탑재
  const hybrid: RecommendationPlan = {
    title: `[${hybridPlan.companyName}] 프리미엄 마스터 플랜`,
    description: '암·뇌·심장 우수한 수준 한도는 물론이고 부정맥 진단비, 혈전용해, 가족일상배책까지 빈틈없이 꽉 채운 든든한 보장형 플랜입니다.',
    estimatedPremium: hybridPlan.premium,
    companyName: hybridPlan.companyName,
    productName: hybridPlan.productName,
    coverageChanges: [
      `일반암 최고 ${(hybridCancer / 10000).toLocaleString()}만 원 및 유사암 ${(hybridSimilar / 10000).toLocaleString()}만 원 최대 한도 확보`,
      `뇌혈관 ${(hybridBrain / 10000).toLocaleString()}만 원 / 허혈성 심장 ${(hybridHeart / 10000).toLocaleString()}만 원 / 심혈관 ${(hybridCardio / 10000).toLocaleString()}만 원 풀 케어`,
      '1-5종 수술비 + 표적항암 + 혈전용해 + 가족일상배상책임 풀 패키지'
    ],
    switchingLossNotice: '가장 폭넓은 보장을 제공하나 매월 납입하는 고정 보험료 지출이 크므로 납입 여력을 철저히 확인하세요.'
  };

  return {
    estimatedPremium: upgrade.estimatedPremium,
    efficiency,
    deficiencies,
    scores: {
      cancerScore,
      cerebrovascularScore,
      cardiovascularScore,
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
