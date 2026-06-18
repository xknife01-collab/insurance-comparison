import { RecommendationPlan } from '../../../types/insurance';

/**
 * 법률비용보전 보험 분석 엔진
 * 입력 정보(소송종류, 변호사비용한도, 인지대/송달료한도, 자기부담금방식, 특약)를 기반으로
 * 보장 점수, 효율성 및 가이드를 생성합니다.
 */
export const analyzeLegal = (analysis: any): any => {
  const options = analysis._allOptions || [];
  
  // 기본 추천 플랜 매핑용 값
  const defaultOption = { 
    premium: analysis._realDbPremium || 18500, 
    productName: analysis._productName || '법률비용보전보험',
    companyName: analysis._companyName || '현대해상'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const legalOpts = analysis.legal || {
    subType: 'lawyer',
    litigationType: 'civil',
    lawyerLimit: 10000000,
    courtFeeLimit: 5000000,
    deductibleType: 'fixed',
    suddenAccelerationRider: false,
    consultationRider: false,
    isElectronicLitigation: false,
  };

  // 1. 세부 항목별 평가 점수
  // 변호사선임비용 한도 점수 (최대 3,000만원 한도 대비 비율)
  const lawyerScore = legalOpts.lawyerLimit >= 30000000 
    ? 98 
    : legalOpts.lawyerLimit >= 20000000 
    ? 90 
    : legalOpts.lawyerLimit >= 15000000 
    ? 80 
    : legalOpts.lawyerLimit >= 10000000 
    ? 70 
    : 50;

  // 인지대/송달료 한도 점수 (최대 1,000만원 대비 비율)
  const courtFeeScore = legalOpts.courtFeeLimit >= 10000000 
    ? 95 
    : legalOpts.courtFeeLimit >= 5000000 
    ? 85 
    : 60;

  // 특약 및 할인 가입도 점수
  let riderScore = 50;
  if (legalOpts.suddenAccelerationRider) riderScore += 15;
  if (legalOpts.consultationRider) riderScore += 15;
  if (legalOpts.isElectronicLitigation) riderScore += 20;
  riderScore = Math.min(100, riderScore);

  // 종합 점수 계산 (선택한 상세 타입에 따라 가중치 차등 적용)
  const totalScore = Math.round(
    legalOpts.subType === 'lawyer'
      ? (lawyerScore * 0.65) + (courtFeeScore * 0.15) + (riderScore * 0.20)
      : (lawyerScore * 0.20) + (courtFeeScore * 0.60) + (riderScore * 0.20)
  );

  // 2. 가성비 지표 (보험료 대비 점수)
  const premium = analysis.monthlyPremium || opt1.premium || 18500;
  const efficiency = Math.min(99.9, Math.max(20, (totalScore / (premium / 1000)) * 12));

  // 3. 보장 부족 항목 도출 (Deficiencies)
  const deficiencies: string[] = [];
  
  if (legalOpts.subType === 'lawyer') {
    if (legalOpts.lawyerLimit < 20000000) {
      deficiencies.push('변호사 선임 집중형을 선택하셨으나 변호사 선임 비용 한도가 협소합니다. (최소 2,000만 원 권장)');
    }
  } else {
    if (legalOpts.courtFeeLimit < 5000000) {
      deficiencies.push('소송 비용 집중형을 선택하셨으나 인지대/송달료 보장 한도가 협소합니다. (최소 500만 원 권장)');
    }
  }

  if (legalOpts.lawyerLimit < 10000000) {
    deficiencies.push('변호사 선임 비용 절대 한도 부족 (최소 1,000만 원 기본 확보 필요)');
  }
  if (!legalOpts.suddenAccelerationRider) {
    deficiencies.push('급발진 사고 소송 대응 특약 미가입 (EDR 입증 분쟁 방어 필요)');
  }
  if (!legalOpts.consultationRider) {
    deficiencies.push('소송 전 변호사 1:1 상담 비용 보장 공백');
  }
  if (!legalOpts.isElectronicLitigation) {
    deficiencies.push('전자소송 할인 요건 미확인 (5% 월 보험료 추가 절감 가능)');
  }

  // 4. 세 가지 시나리오별 추천안 설계 (선택한 상세 타입에 따른 동적 맞춤 설명 적용)
  const isLawyerFocus = legalOpts.subType === 'lawyer';

  const diet: RecommendationPlan = {
    title: opt1.productName,
    companyName: opt1.companyName,
    productName: opt1.productName,
    description: isLawyerFocus
      ? `변호사 선임비용을 중점적으로 보장하며 불필요한 소송 행정 비용을 축소한 ${opt1.companyName}의 알뜰 실속형 변호사 플랜입니다.`
      : `인지대와 송달료 등 법원 행정 소송 실비를 가성비 있게 설계한 ${opt1.companyName}의 소송비용 집중 다이어트 플랜입니다.`,
    estimatedPremium: opt1.premium,
    coverageChanges: [
      isLawyerFocus ? '변호사 선임 비용 집중 확보' : '소송 실비(인지대/송달료) 최적화 세팅',
      '불필요한 고액 소송비용 한도 축소',
      '전자소송 할인 요건 즉시 반영 가능'
    ],
    switchingLossNotice: '보장 상세 내역 및 가입 금액은 가입 시 선택한 소송 형태에 따라 상이할 수 있습니다.'
  };

  const upgrade: RecommendationPlan = {
    title: opt2.productName,
    companyName: opt2.companyName,
    productName: opt2.productName,
    description: isLawyerFocus
      ? `충분한 변호사 선임비용 한도(2,000만 원)와 전문 상담 조력을 균형 있게 배치한 ${opt2.companyName}의 대표 안심 변호사 플랜입니다.`
      : `소송 행정 비용 보장을 강화하여 장기 송사전 발생 시 자부담 공백을 해결하는 ${opt2.companyName}의 안심 소송비용 밸런스 플랜입니다.`,
    estimatedPremium: opt2.premium,
    coverageChanges: [
      isLawyerFocus ? '변호사 선임 한도 2,000만 원 확보' : '소송 행정 실비 한도 500만 원 이상 증액',
      '급발진 및 핵심 법률 대응 분쟁 지원',
      '대면 및 서면 상담 지원 특약 기본 설계'
    ],
    switchingLossNotice: '보장 상세 내역 및 가입 금액은 가입 시 선택한 소송 형태에 따라 상이할 수 있습니다.'
  };

  const hybrid: RecommendationPlan = {
    title: opt3.productName,
    companyName: opt3.companyName,
    productName: opt3.productName,
    description: isLawyerFocus
      ? `변호사 선임비용 업계 최대 한도(3,000만 원)를 설정하고 민/형사 방어력을 극대화한 ${opt3.companyName}의 프리미엄 마스터 변호사 플랜입니다.`
      : `심급별 인지대/송달료 최대 한도 지원과 급발진 EDR 소송 대응력까지 완비한 ${opt3.companyName}의 하이엔드 소송비용 마스터플랜입니다.`,
    estimatedPremium: opt3.premium,
    coverageChanges: [
      isLawyerFocus ? '변호사 선임 한도 심급별 최대 3,000만 원' : '인지대/송달료 우수한 수준(1,000만 원) 보장',
      '소송 전 대면 변호사 상담 및 급발진 특약 풀패키지 탑재',
      '민사, 형사, 행정 소송 전방위 가드 탑재'
    ],
    switchingLossNotice: '보장 상세 내역 및 가입 금액은 가입 시 선택한 소송 형태에 따라 상이할 수 있습니다.'
  };

  return {
    estimatedPremium: upgrade.estimatedPremium,
    efficiency,
    deficiencies,
    scores: {
      lawyerScore,
      courtFeeScore,
      riderScore,
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
