import { InsuranceAnalysis, AnalysisResult } from '../../../types/insurance';

export const analyzeDriver = (analysis: InsuranceAnalysis): AnalysisResult => {
  const driverOpts = analysis.driver || {
    drivingPurpose: 'private',
    jobClass: 1,
    planType: 'standard'
  };

  const { drivingPurpose, jobClass, planType } = driverOpts;
  const age = analysis.age || 40;

  // 1. 기본 플랜별 기준 월 보험료
  let basePremium = 24000; // standard
  if (planType === 'saving') basePremium = 12000;
  if (planType === 'premium') basePremium = 35000;

  // 2. 운전 목적(용도) 할증율
  const purposeMultiplier = drivingPurpose === 'commercial' ? 1.85 : 1.0;

  // 3. 직업 등급(상해위험도) 할증율
  let jobMultiplier = 1.0;
  if (jobClass === 2) jobMultiplier = 1.35;
  if (jobClass === 3) jobMultiplier = 1.65;

  // 4. 연령 조정 (U자형 요율 곡선 반영)
  let ageMultiplier = 1.0;
  if (age < 21) {
    ageMultiplier = 1.55;
  } else if (age < 26) {
    ageMultiplier = 1.35;
  } else if (age < 30) {
    ageMultiplier = 1.20;
  } else if (age < 50) {
    ageMultiplier = 0.90;
  } else if (age < 60) {
    ageMultiplier = 1.00;
  } else if (age < 70) {
    ageMultiplier = 1.10;
  } else {
    ageMultiplier = 1.25;
  }

  // 5. 최종 월 보험료 계산
  const calculatedPremium = Math.round(basePremium * purposeMultiplier * jobMultiplier * ageMultiplier);

  // 6. 보장 상태 분석 점수 산출
  let cancerScore = 80;
  let cerebrovascularScore = 85;
  let cardiovascularScore = 85;
  
  if (planType === 'saving') {
    cancerScore = 65;
    cerebrovascularScore = 70;
    cardiovascularScore = 70;
  } else if (planType === 'premium') {
    cancerScore = 95;
    cerebrovascularScore = 98;
    cardiovascularScore = 98;
  }

  // 7. 부족한 보장 분석
  const deficiencies: string[] = [];
  if (planType === 'saving') {
    deficiencies.push('교통사고처리지원금(형사합의금) 한도에 대해 피해자 중상해 등 중대 사고 대비 적정성 점검 권장');
    deficiencies.push('변호사 선임비용의 경찰조사 단계 포함 여부 및 보장 한도 점검 권장');
  } else if (planType === 'standard') {
    deficiencies.push('변호사 선임비용이 경찰조사 불기소 단계까지 지원되는지 약관 점검 권장');
  }
  
  if (drivingPurpose === 'commercial' && jobClass < 3) {
    deficiencies.push('영업용 차량 운전 고지가 실제 직업 급수(1~2급)와 불일치하여, 고지 및 통지의무 위반 위험성 존재');
  }

  const allOptions = (analysis as any)._allOptions || [];
  
  const dietOption = allOptions.find((o: any) => o.planLevel === '실속형') || {
    premium: Math.round(calculatedPremium * 0.6),
    companyName: '한화손보',
    productName: '캐롯 운전자보험 (무) 1종(자가용, 실속형)'
  };
  
  const hybridOption = allOptions.find((o: any) => o.planLevel === '표준형') || {
    premium: calculatedPremium,
    companyName: 'KB손보',
    productName: 'KB 다이렉트 플러스 운전자보험(무배당)'
  };

  const upgradeOption = allOptions.find((o: any) => o.planLevel === 'VIP안심') || {
    premium: Math.round(calculatedPremium * 1.35),
    companyName: '현대해상',
    productName: '현대해상 마음안심 운전자보험'
  };

  const finalScore = Math.round((cancerScore + cerebrovascularScore + cardiovascularScore) / 3);
  const premiumRatio = calculatedPremium / 20000;
  const efficiencyScore = Math.round(Math.min(99, Math.max(40, finalScore * (1 / Math.sqrt(premiumRatio)))));

  const cleanName = (name: string) => {
    if (!name) return '';
    return name.replace(/^\(무\)\s*/, '').split(')')[0] + ')';
  };

  return {
    analysis: {
      ...analysis,
      monthlyPremium: calculatedPremium
    },
    scores: {
      cancerScore,
      cerebrovascularScore,
      cardiovascularScore,
      totalScore: finalScore
    },
    efficiency: efficiencyScore,
    deficiencies,
    recommendations: {
      diet: {
        title: '실속 알뜰 플랜 (가성비 최우선)',
        companyName: dietOption.companyName,
        productName: cleanName(dietOption.productName),
        description: '사고 처리 벌금 3천만 원 및 필수 합의금 보장 위주로 가볍게 리모델링하여 납입 부담을 낮추는 실속형 플랜',
        estimatedPremium: dietOption.premium,
        coverageChanges: [
          '교통사고처리지원금(형사합의금) 1억 원 실속 세팅',
          '변호사 선임비용 3,000만 원 보장 유지',
          '대인벌금 2,000만 원 / 대물벌금 500만 원 최적 한도'
        ],
        switchingLossNotice: '가성비 위주의 실속 세팅이므로, 타인 중상해 시 고액 형사합의 부담은 일부 발생할 수 있습니다.'
      },
      upgrade: {
        title: 'VIP 안심 든든 플랜 (보장 강화)',
        companyName: upgradeOption.companyName,
        productName: cleanName(upgradeOption.productName),
        description: '경찰조사 단계 변호사 동행 지원과 부상치료 지원을 고르게 강화한 프리미엄 안심 플랜',
        estimatedPremium: upgradeOption.premium,
        coverageChanges: [
          '교통사고처리지원금(형사합의금) 2억 원 상향',
          '경찰조사단계 변호사선임비용 5,000만 원 선지원 탑재',
          '자동차사고부상치료비(자부상) 14급 단순 염좌 시에도 30만 원 정액 보장 확대'
        ],
        switchingLossNotice: '보장이 확대되는 만큼 매월 납입 보험료가 다소 인상될 수 있습니다.'
      },
      hybrid: {
        title: '가족안심 스마트 하이브리드 플랜',
        companyName: hybridOption.companyName,
        productName: cleanName(hybridOption.productName),
        description: '안전 운행 법률 비용은 물론 가족들의 일상 배상책임 및 누수 사고까지 결합하여 구성한 스마트 통합 플랜',
        estimatedPremium: hybridOption.premium,
        coverageChanges: [
          '교사처 1.5억 + 변호사비 5천 + 대인벌금 3천 기본 보장',
          '가족 일상생활배상책임(누수 및 생활 대인/대물 과실) 1억 원 특별 특약 탑재',
          '가족 동반 가입 시 할인 요율 혜택 가능 여부 확인'
        ],
        switchingLossNotice: '일배책 특약은 타 보험사 상품에 이미 중복 가입되어 있는지 반드시 기존 증권을 확인해야 합니다.'
      }
    }
  };
};
