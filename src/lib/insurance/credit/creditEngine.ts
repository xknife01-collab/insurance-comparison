import { RecommendationPlan } from '../../../types/insurance';

/**
 * 신용보장보험(대출상환보장보험) 분석 엔진
 * 대출 종류, 대출 금액, 대출 남은 기간, 신용 등급 및 특약 가입 여부를 기반으로
 * 대출상환 안전성, 신용케어 할인율, 특약 구성 지표 및 3대 맞춤형 추천 플랜을 생성합니다.
 */
export const analyzeCredit = (analysis: any): any => {
  const options = (analysis._allOptions || []).map((o: any) => ({
    ...o,
    riskPremium: o.riskPremium || 5000,
    savingsPremium: o.savingsPremium || 0,
    estimatedPremium: o.premium || 30000
  })) || [];

  const creditOpts = analysis.credit || {
    loanType: 'mortgage',
    loanAmount: 100000000,
    loanPeriod: 10,
    creditBureau: 'nice',
    creditScore: 850,
    hasIllnessRider: true,
    hasDisabilityRider: true
  };

  const loanType = creditOpts.loanType || 'mortgage';
  const loanAmount = creditOpts.loanAmount || 100000000;
  const loanPeriod = creditOpts.loanPeriod || 10;
  const creditBureau = creditOpts.creditBureau || 'nice';
  const creditScore = creditOpts.creditScore || 850;
  const hasIllnessRider = creditOpts.hasIllnessRider !== false;
  const hasDisabilityRider = creditOpts.hasDisabilityRider !== false;

  // 1. 신용점수 기반 할인율 산출
  let discountRate = 0;
  let grade = 5;
  if (creditScore >= 900) {
    discountRate = 0.10;
    grade = 1;
  } else if (creditScore >= 800) {
    discountRate = 0.08;
    grade = 3;
  } else if (creditScore >= 700) {
    discountRate = 0.05;
    grade = 5;
  } else if (creditScore >= 600) {
    discountRate = 0.03;
    grade = 7;
  } else {
    discountRate = 0;
    grade = 9;
  }

  // 2. Find matching DB options for the three recommendations
  // Diet: Cheapest '사망단독형'
  // Upgrade: Cheapest '종합안심형'
  // Hybrid: Premium '종합안심형' (or second cheapest / highest premium)
  
  const deathOnlyPlans = options.filter((o: any) => o.coverageType === '사망단독형');
  const comprehensivePlans = options.filter((o: any) => o.coverageType === '종합안심형');

  // Fallback values if DB didn't return any plans
  const age = analysis.age || 35;
  const gender = analysis.gender || 'M';
  const ageFactor = 1.0 + Math.max(-0.5, Math.min(2.0, (age - 35) * 0.04));
  const genderFactor = gender === 'M' ? 1.15 : 0.85;
  const basePremiumPer10M = 1200;
  const coverageUnits = loanAmount / 10000000;
  const baseMonthlyPremium = Math.max(5000, Math.round(coverageUnits * basePremiumPer10M * ageFactor * genderFactor));

  // Determine Diet Plan
  const dietPlanDb = deathOnlyPlans[0] || options.find((o: any) => o.coverageType === '사망단독형') || options[0];
  const dietPremium = dietPlanDb ? dietPlanDb.premium : Math.round(baseMonthlyPremium * (1 - discountRate));
  const dietProdName = dietPlanDb ? dietPlanDb.productName : '대출안심 신용생명보험(무) (실속형)';
  const dietCompName = dietPlanDb ? dietPlanDb.company : 'BNP파리바 카디프생명';

  // Determine Upgrade Plan
  const upgradePlanDb = comprehensivePlans[0] || options.find((o: any) => o.coverageType === '종합안심형') || options[1] || options[0];
  const upgradePremium = upgradePlanDb ? upgradePlanDb.premium : Math.round(baseMonthlyPremium * 1.45 * (1 - discountRate));
  const upgradeProdName = upgradePlanDb ? upgradePlanDb.productName : '대출안심 신용생명보험(무) (3대질병 보장형)';
  const upgradeCompName = upgradePlanDb ? upgradePlanDb.company : 'BNP파리바 카디프생명';

  // Determine Hybrid Plan
  // Highest premium plan in comprehensive, or the last option
  const hybridPlanDb = comprehensivePlans[comprehensivePlans.length - 1] || options[options.length - 1] || options[0];
  const hybridPremium = hybridPlanDb ? hybridPlanDb.premium : Math.round(baseMonthlyPremium * 1.60 * (1 - discountRate));
  const hybridProdName = hybridPlanDb ? hybridPlanDb.productName : '대출안심 신용생명보험(무) (신용 헬스케어 통합형)';
  const hybridCompName = hybridPlanDb ? hybridPlanDb.company : 'BNP파리바 카디프생명';

  // 3. 점수 평가지표 산출 (NICE/KCB 매핑 구조 활용)
  let coverageScore = 80;
  if (loanAmount <= 100000000) coverageScore = 95;
  else if (loanAmount <= 300000000) coverageScore = 88;
  else coverageScore = 80;

  if (hasIllnessRider) coverageScore = Math.min(100, coverageScore + 5);

  const discountScore = Math.round(50 + discountRate * 500); // 10%할인이면 100점, 0%면 50점

  let riderScore = 50;
  if (hasIllnessRider) riderScore += 25;
  if (hasDisabilityRider) riderScore += 25;

  const totalScore = Math.round((coverageScore + discountScore + riderScore) / 3);

  // 4. 부족한 보장 진단 (Deficiencies)
  const deficiencies: string[] = [];
  if (creditScore < 700) {
    deficiencies.push(`신용점수 관리 필요 (${creditBureau.toUpperCase()} ${creditScore}점 기준, 신용 등급 개선 시 최대 10% 보험료 할인 획득 가능)`);
  }
  if (!hasIllnessRider) {
    deficiencies.push('중대질병(암/뇌/심장) 진단 상환 특약 부재 (사망 외 질병으로 인한 대출 연체 위협 노출)');
  }
  if (!hasDisabilityRider) {
    deficiencies.push('고도후유장해 상환 보장 누락 (장해율 50% 이상 시 대출 대위변제 지원 불가)');
  }
  if (loanPeriod < 5) {
    deficiencies.push('단기 만기 설정 (대출 잔여 상환 기간보다 보험 보장 기간이 짧을 시 만기 전 리스크 노출)');
  }

  // 5. 맞춤형 추천 3대 플랜 타이틀/설명 생성
  const loanLabel = loanType === 'mortgage' ? '주택담보' : loanType === 'jeonse' ? '전세자금' : loanType === 'business' ? '사업자' : '개인신용';

  const recommendations = {
    diet: {
      title: `[${dietCompName}] 실속 ${loanLabel} 대출안심 플랜`,
      description: `특약을 최소화하여 오직 사망에 따른 대출금 상환에 집중한 초실속형 플랜입니다. 현재 ${creditBureau.toUpperCase()} ${creditScore}점 기준으로 적용 가능한 ${Math.round(discountRate * 100)}% 할인이 선반영되어 월 ${dietPremium.toLocaleString()}원에 채무 변제 위험을 완전히 제거합니다.`,
      estimatedPremium: dietPremium,
      coverageChanges: [
        `사망 시 대출 잔액 최대 ${Math.round(loanAmount / 10000).toLocaleString()}만 원 전액 상환`,
        '순수 사망 보장 단독 세팅',
        '만기 시 환급금이 없는 순수 소멸 실속형'
      ],
      switchingLossNotice: '특약 미가입으로 대출 차주 본인이 중대 질병 진단 시에는 대출 상환 지원 혜택을 제공받을 수 없습니다.',
      companyName: dietCompName,
      productName: dietProdName
    },
    upgrade: {
      title: `[${upgradeCompName}] 3대 질병 연계 ${loanLabel} 대출안심 든든 플랜`,
      description: `사망 보장은 물론, 차주가 암/뇌출혈/급성심근경색 등 3대 중대질병으로 진단받았을 때도 보험사가 남은 대출금을 즉시 완납해 줍니다. 질병으로 일하지 못해 이자가 연체되고 담보 주택이 경매에 넘어가는 비극을 방어하는 가장 선호도 높은 플랜입니다.`,
      estimatedPremium: upgradePremium,
      coverageChanges: [
        `사망 시 대출 잔액 최대 ${Math.round(loanAmount / 10000).toLocaleString()}만 원 전액 상환`,
        '암 / 뇌출혈 / 급성심근경색 최초 1회 진단 시 대출금 전액 상환',
        '대출 잔액 상환 후 남는 잉여금은 유가족에게 현금 지급'
      ],
      switchingLossNotice: '가입 후 90일 이내에 암 진단 시에는 암 관련 대출상환 보장 혜택을 제한받게 됩니다.',
      companyName: upgradeCompName,
      productName: upgradeProdName
    },
    hybrid: {
      title: `[${hybridCompName}] 신용 헬스케어 ${loanLabel} 대출안심 마스터 플랜`,
      description: `사망 + 3대 질병 + 50% 이상 고도후유장해까지 모든 신용 위험 요소를 안정적으로 커버하고, 개인 신용등급 변동 추이에 맞춘 '신용 관리 헬스케어 서비스'를 매달 모바일로 지원하는 프리미엄 통합 보장 안심 플랜입니다.`,
      estimatedPremium: hybridPremium,
      coverageChanges: [
        `사망 및 50% 이상 장해 시 대출 잔액 최대 ${Math.round(loanAmount / 10000).toLocaleString()}만 원 완납`,
        '3대 질병(암/뇌/심장) 진단 확정 즉시 대출 대위변제',
        '매년 신용 점수 상승 시 추가 요율 할인을 제공하는 신용케어 연계'
      ],
      switchingLossNotice: '보장 범위가 넓은 만큼 월 납입 보험료가 실속형 대비 가산되지만, 통합 위험 관리 차원에서 가장 안전합니다.',
      companyName: hybridCompName,
      productName: hybridProdName
    }
  };

  const results: any = {
    analysis,
    scores: {
      cancerScore: coverageScore,
      cerebrovascularScore: discountScore,
      cardiovascularScore: riderScore,
      totalScore: totalScore
    },
    efficiency: totalScore > 0 ? Math.min(98, Math.max(60, Math.round(totalScore - (dietPremium - 25000) / 1000))) : 80,
    deficiencies,
    recommendations
  };

  return results;
};
