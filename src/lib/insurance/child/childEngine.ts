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
  } else {
    totalScore = Math.round((hospitalScore + surgeryScore + majorScore + maturityScore) / 4);
  }

  // 2. Deficiencies & Recommendations Tips
  const deficiencies: string[] = [];
  const recommendationsTips: string[] = [];

  if (isPreFamily) {
    // 유병력아 타겟별 특수 결손 진단 및 팁
    if (illnessType === 'development') {
      deficiencies.push('발달지연 놀이/언어치료 이력으로 표준체 일반 어린이보험 거절 상태');
      recommendationsTips.push('발달지연 이력은 일반보험에서 거절 1순위이지만, 간편 어린이보험의 3개월 고지만 패스하면 현대해상/KB에서 일반 아이들과 완벽하게 동일한 3대 진단비를 세팅할 수 있습니다.');
    } else if (illnessType === 'adhd') {
      deficiencies.push('ADHD 장기 약물 처방으로 인한 정신과 진료 거절 위험');
      recommendationsTips.push('ADHD 치료제를 매일 복용 중이더라도, 3개월 이내에 입원/수술/추가 소견이 없었다면 유병력자 3대 진단비 한도를 최고 한도(암 5천, 뇌/심 각 3천)로 안정적으로 보강할 수 있습니다.');
    } else if (illnessType === 'puberty') {
      deficiencies.push('성조숙증 호르몬 억제 주사 투여로 인한 인과 부위 부담보 우려');
      recommendationsTips.push('호르몬 치료 중이라 하더라도 메리츠화재 등 유병자 종합 플랜을 적용하면, 자궁/난소 부위에 부담보(치료 기간 보장 제외) 조건 없이 깨끗하게 승인받는 것이 유리합니다.');
    } else if (illnessType === 'asthma') {
      deficiencies.push('천식 및 급성 아토피 치료로 호흡기/피부 부담보 적용 위험');
      recommendationsTips.push('최근 3개월 내 입원만 없으셨다면, 호흡기 및 피부 전신 보장을 확보하기 위해 간편 3.5.5 등급으로 진행해 할증 부담을 최소화하는 전략을 추천합니다.');
    } else if (illnessType === 'fracture') {
      deficiencies.push('최근 깁스/수술 이력으로 상해/질병 심사 보류 우려');
      recommendationsTips.push('깁스나 골절 수술 후 3개월 소견이 종결되었다면 심사 서류 제출이 전부 면제되는 모바일 프리패스 플랜을 활용해 당일 즉시 승인이 가능합니다.');
    } else {
      deficiencies.push('만성 질환 또는 지속 복약으로 가입 문턱 높음');
      recommendationsTips.push('간단한 3.5.5 질문지만 패스하면 만성 질환 약을 먹고 있더라도 보험료 할증폭을 10% 이내로 막으며 표준 수준의 보장을 유지할 수 있습니다.');
    }

    if (noAccidentYears === '0') {
      deficiencies.push('무사고 0년(최근 입원/수술)으로 인한 높은 간편 요율 할증 (3.0.5)');
      recommendationsTips.push('최근 입원/수술 이력이 있으셔 가입 심사 기준이 3.0.5 초간편으로 자동 적용되었습니다. 향후 치료 후 2~3년 무사고 기간을 채우면 보험료를 대폭 할인받는 "할인계약 전환권"이 있는 상품을 택하셔야 합니다.');
    } else if (noAccidentYears === '5') {
      recommendationsTips.push('🥇 축하합니다! 5년 무사고 우량 등급이 적용되어 일반 건강체(표준형) 대비 단 8~10% 수준의 초저할증 특약 혜택을 누릴 수 있습니다.');
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
        deficiencies.push('100세 만기 플랜 대비 예산 부족 (보장 한도 축소 위험)');
        recommendationsTips.push('100세 만기형은 장기 계약이므로 월 7~8만 원 이상의 예산이 잡혀있지 않으면 핵심 진단비(암/뇌/심) 한도가 너무 낮게 설계될 수 있습니다.');
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
      description: `${illnessLabel} 이력이 있어도 3대 핵심 진단비(암·뇌·심) 위주로만 슬림하게 묶어 할증료 거품을 빼고 보험료를 4만 원 선으로 조율한 가성비 특화 안심 설계입니다.`,
      estimatedPremium: dietOption ? dietOption.premium : 45000,
      companyName: dietOption?.companyName || '현대해상',
      productName: dietOption?.productName || `간편한 3.${noAccidentYears}.5 건강보험`,
      coverageChanges: ['불필요한 사망/상해 담보 제외', '3대 중대 진단비 핵심 한도 집중'],
      switchingLossNotice: '보장이 축소되거나 일부 특약이 빠져 있으므로 주요 진단비 외의 혜택은 제한적입니다.'
    };

    upgrade = {
      title: '무사고 할인 계약전환형 플랜',
      description: `가입 당시에는 간편 심사로 승인받고, 가입 후 무사고 기간을 채울 때마다 최대 5회에 걸쳐 표준체(일반 건강한 아이) 수준까지 보험료를 계속 깎아주는 스마트 무사고 연동형 플랜입니다.`,
      estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 1.8) : upgradeOption.premium) : 85000,
      companyName: upgradeOption?.companyName || 'KB손해보험',
      productName: upgradeOption?.productName || `KB 슬기로운 간편어린이보험(3.${noAccidentYears}.5)`,
      coverageChanges: ['무사고 기간에 따른 자동 보험료 인하권 확보', '종합 비갱신 100세 만기 고정'],
      switchingLossNotice: '가입 초기 보험료가 다이어트 플랜 대비 높게 형성됩니다.'
    };

    hybrid = {
      title: '질병수술비 보강 부담보 제로형',
      description: `소아 빈번 통원 질환에 대해 가입 제한이나 특정 신체부위 부담보(보장 제외) 조건 없이 완벽하게 전신 인수를 승인받고, 질병 수술 시 반복해서 수술비를 돌려받는 최고급 종합 절충형입니다.`,
      estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.3) : hybridOption.premium) : 68000,
      companyName: hybridOption?.companyName || '메리츠화재',
      productName: hybridOption?.productName || `간편한 3.${noAccidentYears}.5 어른이종합보험`,
      coverageChanges: ['호르몬/피부/상해 수술비 전액 부담보 해제', '질병/상해 1-5종 수술비 반복 지급 특약 추가'],
      switchingLossNotice: '유병력 특성상 특약이 가입에 연동되어 해지 시 동일 조건 재가입이 절대 불가능합니다.'
    };
  } else {
    diet = {
      title: '30세 만기 가성비 플랜',
      description: '자녀 성장기(0~30세) 동안 소아암, 선천성 장애, 잦은 입원비 등을 저렴한 비용으로 촘꼼하게 채워주는 실속 구조입니다.',
      estimatedPremium: dietOption ? dietOption.premium : 32000,
      companyName: dietOption?.companyName || '현대해상',
      productName: dietOption?.productName || '굿앤굿어린이종합보험(무)',
      coverageChanges: ['30세 만기 설정으로 보험료 50% 이상 절감', '성장기 입원일당 및 수술비 최대 보강'],
      switchingLossNotice: '30세 이후에는 보장이 종료되므로 만기 시 반드시 계약전환 권리를 행사해 연장해야 합니다.'
    };

    upgrade = {
      title: '100세 만기 든든 평생 플랜',
      description: '어릴 때 저렴한 보험료로 가입하여 암/뇌/심장 3대 진단비를 평생 동안 비갱신형으로 든든하게 가져가는 프리미엄 플랜입니다.',
      estimatedPremium: upgradeOption ? (upgradeOption === dietOption ? Math.round(upgradeOption.premium * 2.2) : upgradeOption.premium) : 78000,
      companyName: upgradeOption?.companyName || 'KB손해보험',
      productName: upgradeOption?.productName || 'KB희망플러스어린이보험(무)',
      coverageChanges: ['100세 만기 비갱신형 완료', '암 5천만 + 뇌혈관 2천만 평생 보장 확정'],
      switchingLossNotice: '보장 기간이 긴 만큼 매월 납입하는 초기 보험료 부담이 상대적으로 큽니다.'
    };

    hybrid = {
      title: '복합 절충형 스마트 플랜',
      description: '치료비 부담이 큰 3대 진단비는 100세 만기로 평생 보장받고, 성장기에만 일시적으로 필요한 입원/수술 특약은 30세 만기로 믹스해 가성비를 극대화한 스마트 설계입니다.',
      estimatedPremium: hybridOption ? (hybridOption === dietOption || hybridOption === upgradeOption ? Math.round(hybridOption.premium * 1.5) : hybridOption.premium) : 55000,
      companyName: hybridOption?.companyName || 'DB손해보험',
      productName: hybridOption?.productName || '아이러브건강보험(무)',
      coverageChanges: ['진단비(100세) + 입원수술(30세) 복합 구성', '가장 효율적인 다이렉트 설계 매칭'],
      switchingLossNotice: '특약별로 만기가 상이하여 관리가 조금 복잡할 수 있습니다.'
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
