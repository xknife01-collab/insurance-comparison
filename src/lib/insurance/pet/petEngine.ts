import { RecommendationPlan } from '../../../types/insurance';
import { getBreedMultiplier } from './petLoader';

/**
 * 펫보험 분석 엔진
 * 입력 정보(축종, 품종, 연령, 자기부담금, 특약 가입 상태)를 기반으로
 * 보장 점수, 효율성 및 가이드라인을 생성합니다.
 */
export const analyzePet = (analysis: any): any => {
  const options = analysis._allOptions || [];
  
  // 기본값 설정
  const defaultOption = { 
    premium: analysis._realDbPremium || 35000, 
    productName: analysis._productName || '펫 실손의료보험',
    companyName: analysis._companyName || '추천 펫보험사'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const petOpts = analysis.pet || {
    petType: 'dog',
    petName: '우리애기',
    breed: '말티즈',
    birthYearMonth: '202305',
    selfPayRatio: 70,
    deductible: 30000,
    isRegistered: false,
    patellaRider: true,
    skinRider: true,
    dentalRider: false
  };

  // 1. 세부 보장 영역별 점수 환산
  const patellaScore = petOpts.patellaRider ? 95 : 30;
  const skinScore = petOpts.skinRider ? 90 : 40;
  const dentalScore = petOpts.dentalRider ? 95 : 30;
  const registrationScore = petOpts.isRegistered ? 95 : 50;
  
  // 자기부담금 및 보장비율 평점
  const ratioScore = petOpts.selfPayRatio >= 80 ? 95 : petOpts.selfPayRatio >= 70 ? 80 : 60;
  const dedScore = petOpts.deductible <= 20000 ? 95 : petOpts.deductible <= 30000 ? 85 : 65;

  // 전체 종합 점수
  const totalScore = Math.round(
    (patellaScore + skinScore + dentalScore + registrationScore + ratioScore + dedScore) / 6
  );

  // 2. 가성비 지표 (10만 원당 보장 가치 계산)
  const premium = analysis.monthlyPremium || opt1.premium || 35000;
  const efficiency = Math.min(99.9, Math.max(20, (totalScore / (premium / 1000)) * 15));

  // 3. 부족한 보장 항목 도출
  const deficiencies: string[] = [];
  
  // 품종별 취약점을 찾아서 매핑
  const { vulnerability } = getBreedMultiplier(petOpts.breed, petOpts.petType);

  if (!petOpts.patellaRider && petOpts.petType === 'dog') {
    deficiencies.push('슬개골/고관절 탈구 보장 공백');
  }
  if (!petOpts.skinRider) {
    deficiencies.push('피부 질환/외이염 보장 공백');
  }
  if (!petOpts.dentalRider) {
    deficiencies.push('치과 스케일링/구내염 보장 공백');
  }
  if (!petOpts.isRegistered) {
    deficiencies.push('동물등록 할인 미적용 (5% 할인 가능)');
  }
  if (petOpts.selfPayRatio < 70) {
    deficiencies.push('낮은 보장 비율 (치료비의 50%만 보장됨)');
  }

  // 4. 세 가지 시나리오별 추천안 설계
  // Diet: 50% 보장비율, 자기부담금 5만 원, 핵심 특약 1~2개 제외하여 보험료 절약
  const dietPremium = Math.round((opt1.premium * 0.6) / 100) * 100;
  const diet: RecommendationPlan = {
    title: `[${opt1.companyName}] 실속 가성비 플랜`,
    description: `${petOpts.petName}의 필수 일상 의료비(통원/입원)만 최저 비용으로 지켜주는 다이어트 플랜입니다.`,
    estimatedPremium: dietPremium,
    coverageChanges: [
      '자기부담금 상향 (5만 원 설정)',
      '보장비율 50% 실속 세팅',
      '동물등록 5% 즉시 할인 적용'
    ],
    switchingLossNotice: '보장비율이 낮아 수술 등 고액 진료비 발생 시 보호자 자부담이 커집니다.'
  };

  // Upgrade: 80% 보장비율, 자기부담금 3만 원, 필수 슬개골/피부 특약 탑재
  const upgradePremium = Math.round((opt2.premium * 1.1) / 100) * 100;
  const upgrade: RecommendationPlan = {
    title: `[${opt2.companyName}] 안심 밸런스 플랜`,
    description: `보장 비율을 80%로 확대하고, ${petOpts.breed} 취약 질환인 '${vulnerability.split(',')[0]}' 보장을 추가한 추천 밸런스 상품입니다.`,
    estimatedPremium: upgradePremium,
    coverageChanges: [
      '보장 비율 80%로 확대',
      '슬개골/피부질환 주요 특약 탑재',
      '자기부담금 3만 원 최적화'
    ],
    switchingLossNotice: '가입 후 1년간은 슬개골 탈구 등 일부 유전 질환의 면책 기간이 적용됩니다.'
  };

  // Hybrid: 90% 보장비율, 자기부담금 1만 원, 치과/슬개골/피부 풀패키지 특약 탑재
  const hybridPremium = Math.round((opt3.premium * 1.35) / 100) * 100;
  const hybrid: RecommendationPlan = {
    title: `[${opt3.companyName}] 프리미엄 마스터 플랜`,
    description: `자기부담금을 1만 원으로 최소화하고, 수술비 한도 증액 및 구강/스케일링 특약까지 모두 포함한 최고급 케어 플랜입니다.`,
    estimatedPremium: hybridPremium,
    coverageChanges: [
      '자기부담금 최소화 (1만 원 설정)',
      '수술 회당 한도 250만 원 업계 최고 수준',
      '슬개골 + 피부 + 치과 전담 특약 풀패키지'
    ],
    switchingLossNotice: '보장이 큰 만큼 월 보험료가 높게 책정되므로 납입 여력을 확인하세요.'
  };

  return {
    estimatedPremium: upgradePremium,
    efficiency,
    deficiencies,
    scores: {
      patellaScore,
      skinScore,
      dentalScore,
      totalScore
    },
    recommendations: {
      diet,
      upgrade,
      hybrid
    }
  };
};
