import { RecommendationPlan } from '../../../types/insurance/common';

/**
 * 어린이/태아/청년 및 유병자 어린이 보험 분석 엔진
 */
export const analyzeChild = (analysis: any): any => {
  const currentPremium = analysis.monthlyPremium || 60000;
  const config = analysis.child || {
    targetAgeGroup: 'child',
    maturity: 30,
    focusArea: 'majorDisease',
    hasPrenatalRider: false
  };

  const ageGroup = config.targetAgeGroup || 'child';
  const maturity = config.maturity || 30;
  const focusArea = config.focusArea || 'majorDisease';
  const hasPrenatal = !!config.hasPrenatalRider;
  const weeksPregnancy = config.weeksPregnancy || 12;
  
  const isPreFamily = !!config.isPreFamily;
  const illnessType = config.illnessType || 'development';
  const noAccidentYears = config.noAccidentYears || '5';

  const deficiencies: string[] = [];
  const recommendationsTips: string[] = [];

  // 1. Calculate Scores (0~100)
  let prenatalScore = 90;
  let hospitalScore = 80;
  let surgeryScore = 85;
  let majorScore = 80;
  let maturityScore = 90;

  if (isPreFamily) {
    // 유병력자 어린이의 경우 가입 인수 기준과 보험료 합리성에 집중
    prenatalScore = 95; // 태아 보장 보다는 현재 심사 우대
    hospitalScore = 85;
    surgeryScore = 88;
    majorScore = 92; // 3대 진단비가 일반 간편고지로 프리패스되므로 고평가
    
    // N년 무사고에 따른 만기/할인 점수
    const nVal = parseInt(noAccidentYears);
    if (nVal === 5) maturityScore = 96; // 3.5.5 최우량 등급
    else if (nVal === 3) maturityScore = 88;
    else if (nVal === 2) maturityScore = 82;
    else maturityScore = 70; // 3.0.5 초간편은 가입은 쉽지만 할증이 붙음
  } else {
    // Prenatal/Congenital coverage scoring
    if (ageGroup === 'prenatal') {
      if (!hasPrenatal) {
        prenatalScore = 30;
      } else if (weeksPregnancy > 22) {
        prenatalScore = 40;
      } else {
        prenatalScore = 95;
      }
    } else {
      prenatalScore = 85;
    }

    // Focus area scoring
    if (focusArea === 'hospitalization') {
      hospitalScore = 95;
      surgeryScore = 90;
      majorScore = 75;
    } else {
      majorScore = 95;
      hospitalScore = 75;
      surgeryScore = 80;
    }

    // Maturity fit score
    if (maturity === 30) {
      maturityScore = ageGroup === 'youth' ? 65 : 85;
    } else {
      maturityScore = currentPremium >= 70000 ? 95 : 70; 
    }
  }

  // Calculate total score
  let totalScore = 0;
  if (ageGroup === 'prenatal' && !isPreFamily) {
    totalScore = Math.round((prenatalScore + hospitalScore + surgeryScore + majorScore + maturityScore) / 5);
  } else  if (isPreFamily) {
    // 유병력아 타겟별 특수 결손 진단 및 팁
    if (illnessType === 'development') {
      deficiencies.push('발달지연 놀이/언어치료 이력 관련 심사 요건 확인 필요');
      recommendationsTips.push('발달지연 치료 이력이 있는 경우 간편심사 고지 요건을 확인하여 주요 3대 진단비를 세팅할 수 있는지 점검하는 것이 유리합니다.');
    } else if (illnessType === 'adhd') {
      deficiencies.push('ADHD 치료 이력 관련 심사 요건 확인 필요');
      recommendationsTips.push('ADHD 치료제를 복용 중이더라도 일정 기간 입원/수술/추가 소견이 없었다면 유병력자 진단비 한도를 적정 수준으로 보강할 수 있는지 비교 검토를 추천합니다.');
    } else if (illnessType === 'puberty') {
      deficiencies.push('성조숙증 치료 관련 인수 조건 점검 필요');
      recommendationsTips.push('호르몬 치료 중이라 하더라도 유병자 종합 플랜을 비교 검토하여 부담보 조건 여부를 꼼꼼히 확인하는 것이 좋습니다.');
    } else if (illnessType === 'asthma') {
      deficiencies.push('천식 및 아토피 치료 이력에 따른 인수 조건 점검 필요');
      recommendationsTips.push('입원/수술 이력 여부에 따라 간편심사 유형을 적절히 선택하여 보장 공백을 최소화하는 전략을 추천합니다.');
    } else if (illnessType === 'fracture') {
      deficiencies.push('최근 상해/수술 이력에 따른 심사 서류 점검 필요');
      recommendationsTips.push('골절 및 수술 치료 종결 여부를 확인하여 간소화된 심사 플랜을 활용 가능한지 검토할 수 있습니다.');
    } else {
      deficiencies.push('만성 질환 또는 지속 복약 시 간편고지 심사 확인 필요');
      recommendationsTips.push('간편심사 질문지를 충족할 경우 지속적인 약 복용 중에도 적정 보장을 준비할 수 있습니다.');
    }

    if (noAccidentYears === '0') {
      deficiencies.push('최근 치료 이력으로 인한 간편심사 요율 적용');
      recommendationsTips.push('최근 치료 이력에 따라 간편심사 유형이 적용될 수 있으며, 향후 무사고 기간 경과 시 보험료를 재산정받을 수 있는 무사고 전환 제도를 확인해 두시면 좋습니다.');
    } else if (noAccidentYears === '5') {
      recommendationsTips.push('무사고 기간 요건을 충족하여 우대 요율 적용 가능 여부를 확인해 보실 수 있습니다.');
    }
  } else {
    if (ageGroup === 'prenatal') {
      if (!hasPrenatal) {
        deficiencies.push('태아 핵심 특약 누락 (선천성 이상 및 저체중 인큐베이터 보장 없음)');
        recommendationsTips.push('태아보험의 핵심은 출생 직후 발생할 수 있는 이상 징후 대비입니다. 태아 특약을 필히 구성해 주십시오.');
      }
      if (hasPrenatal && weeksPregnancy > 22) {
        deficiencies.push('임신 22주 경과로 태아특약 가입 제한');
        recommendationsTips.push('현재 임신 22주 6일이 지나 태아특약 추가가 거절될 수 있습니다. 이 경우 출생 후에 가입하는 신생아 보험으로 설계를 변경해야 합니다.');
      }
    }

    if (maturity === 30) {
      recommendationsTips.push('30세 만기는 저렴하지만 자녀가 독립하는 시점에 새로 성인보험에 가입해야 합니다. 계약전환제도(무심사로 100세 연장 가능)가 있는 상품을 고르시는 것이 필수적입니다.');
    } else {
      if (currentPremium < 60000) {
        deficiencies.push('100세 만기 플랜 대비 월 납입 여력 및 보장 한도 균형 점검 권장');
        recommendationsTips.push('100세 만기형은 장기 계약이므로 월 납입 여력에 맞추어 암/뇌/심 핵심 진단비 한도를 적정하게 배분하는 설계가 필요합니다.');
      }
    }
  }

  // 3. Recommended plans selection
  const allOptions = (analysis as any)._allOptions || [];
  const dietOption = allOptions[0];
  const hybridOption = allOptions.length > 2 
    ? allOptions[Math.floor(allOptions.length * 0.4)] 
    : (allOptions[1] || dietOption);
  const upgradeOption = allOptions.length > 2 
    ? allOptions[Math.floor(allOptions.length * 0.8)] 
    : (allOptions[2] || allOptions[1] || dietOption);

  let diet: RecommendationPlan;
  let upgrade: RecommendationPlan;
  let hybrid: RecommendationPlan;

  if (isPreFamily) {
    const illnessLabel = 
      illnessType === 'development' ? '발달지연 언어치료' :
      illnessType === 'adhd' ? 'ADHD 약물복용' :
      illnessType === 'puberty' ? '성조숙증 케어' :
      illnessType === 'asthma' ? '소아 천식/아토피' :
      illnessType === 'fracture' ? '골절 단순수술' : '기타 유병'

    diet = {
      title: '간편 실속 다이어트 플랜',
      description: `${illnessLabel} 이력이 있어도 3대 핵심 진단비(암·뇌·심) 위주로 슬림하게 구성하여 월 보험료 부담을 낮춘 실속형 설계입니다.`,
      estimatedPremium: dietOption ? dietOption.premium : 45000,
      periodBadge: '20년납 · 90세만기 (간편심사형)',
      companyName: dietOption?.companyName || '추천 보험사',
      productName: dietOption?.productName || `간편 어린이 3대 진단 플랜`,
      coverageChanges: ['필수 진단비 중심 구성', '3대 중대 진단비 핵심 한도 집중'],
      switchingLossNotice: '보장이 축소되거나 일부 특약이 빠져 있으므로 주요 진단비 외의 혜택은 제한적입니다.'
    };

    upgrade = {
      title: '무사고 할인 계약전환형 플랜',
      description: `가입 후 무사고 기간 경과 시 심사를 거쳐 보험료 할인을 적용받을 수 있는 무사고 계약전환 연동형 플랜입니다.`,
      estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 1.8) : upgradeOption.premium) : 85000,
      periodBadge: '20년납 · 100세만기 (비갱신형)',
      companyName: upgradeOption?.companyName || '추천 보험사',
      productName: upgradeOption?.productName || `무사고 할인 간편 어린이종합 플랜`,
      coverageChanges: ['무사고 기간에 따른 자동 보험료 인하권 확보', '종합 비갱신 100세 만기 고정'],
      switchingLossNotice: '가입 초기 보험료가 다이어트 플랜 대비 높게 형성됩니다.'
    };

    hybrid = {
      title: '질병수술비 보강 안심형',
      description: `소아 빈번 질환에 대해 부담보 조건을 점검하고, 질병 및 상해 수술비를 안정적으로 보강하는 종합 절충형 설계입니다.`,
      estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.3) : hybridOption.premium) : 68000,
      periodBadge: '20년납 · 90세만기 (간편심사형)',
      companyName: hybridOption?.companyName || '추천 보험사',
      productName: hybridOption?.productName || `간편 어린이 수술종합 플랜`,
      coverageChanges: ['호르몬/피부/상해 수술비 부담보 조건 확인', '질병/상해 1-5종 수술비 반복 지급 특약 추가'],
      switchingLossNotice: '유병력 특성상 해지 시 동일 조건 재가입이 어려울 수 있으니 신중히 결정하세요.'
    };
  } else {
    diet = {
      title: '30세 만기 가성비 플랜',
      description: '자녀 성장기(0~30세) 동안 소아암, 선천성 장애, 잦은 입원비 등을 저렴한 비용으로 촘촘하게 채워주는 실속 구조입니다.',
      estimatedPremium: dietOption ? dietOption.premium : 32000,
      periodBadge: '30세만기 · 20년납 (실속형)',
      companyName: dietOption?.companyName || '추천 보험사',
      productName: dietOption?.productName || '어린이 성장기 집중 플랜',
      coverageChanges: ['30세 만기 설정으로 보험료 부담 절감', '성장기 입원일당 및 수술비 보강'],
      switchingLossNotice: '30세 이후에는 보장이 종료되므로 만기 시 반드시 계약전환 권리를 행사해 연장해야 합니다.'
    };

    upgrade = {
      title: '100세 만기 비갱신 안심 플랜',
      description: '어릴 때 저렴한 보험료로 가입하여 20년 납입 완료 후 암/뇌/심장 3대 진단비를 100세 만기까지 비갱신형으로 안정적으로 가져가는 플랜입니다.',
      estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 2.2) : upgradeOption.premium) : 78000,
      periodBadge: '100세만기 · 20년납 (비갱신형)',
      companyName: upgradeOption?.companyName || '추천 보험사',
      productName: upgradeOption?.productName || '어린이 100세 종합 플랜',
      coverageChanges: ['100세 만기 비갱신형 설계', '암/뇌/심 주요 진단비 장기 보장 설계'],
      switchingLossNotice: '보장 기간이 긴 만큼 매월 납입하는 초기 보험료 부담이 상대적으로 큽니다.'
    };

    hybrid = {
      title: '복합 절충형 스마트 플랜',
      description: '치료비 부담이 큰 3대 진단비는 100세 만기로 길게 보장받고, 성장기에만 일시적으로 필요한 입원/수술 특약은 30세 만기로 믹스한 스마트 설계입니다.',
      estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.5) : hybridOption.premium) : 55000,
      periodBadge: '복합설계 (진단비 100세 · 수술입원 30세)',
      companyName: hybridOption?.companyName || '추천 보험사',
      productName: hybridOption?.productName || '어린이 하이브리드 맞춤 플랜',
      coverageChanges: ['진단비(100세) + 입원수술(30세) 복합 구성', '효율적인 다이렉트 설계 매칭'],
      switchingLossNotice: '특약별로 만기가 상이하여 관리가 다소 복잡할 수 있습니다.'
    };
  }

  const premiumRatio = diet.estimatedPremium / 30000;
  const efficiencyScore = Math.round(Math.min(99, Math.max(45, totalScore * (1 / Math.sqrt(premiumRatio)))));

  return {
    estimatedPremium: diet.estimatedPremium,
    efficiency: efficiencyScore,
    deficiencies,
    recommendationsTips,
    scores: {
      totalScore,
      cancerScore: majorScore,
      cerebrovascularScore: surgeryScore,
      cardiovascularScore: hospitalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
