/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CoverageItem {
  currentAmount: number; // 현재 가입 금액 (원)
  targetAmount: number;  // 권장 가입 금액 (원, 연령/성별 기반)
}

export interface InsuranceAnalysis {
  age: number;               // 연령
  gender: 'M' | 'F';        // 성별
  jobClass?: number;         // 직업급수 (1~3)
  selectedCategory?: string; // 선택된 보험 카테고리
  cancer: CoverageItem;      // 일반암
  cerebrovascular: CoverageItem; // 뇌혈관
  cardiovascular: CoverageItem;  // 심혈관
  surgery: CoverageItem;         // 수술비
  postDisability: CoverageItem;  // 질병후유장해
  paymentExemption: 'standard' | 'premium'; // 납입면제
  healthStatus: 'standard' | 'simple'; // 건강상태 (표준체/유병자)
  preExistingType?: '3.0.5' | '3.2.5' | '3.3.5' | '3.5.5'; // 유병자 상세 유형 (3.0.5 ~ 3.5.5)
  monthlyPremium: number;       // 현재 월 보험료
  dental?: {                    // 치아보험 전용 필드
    lastYear: 'yes' | 'no';
    last5Years: 'yes' | 'no';
    dentures: 'yes' | 'no';
    implantLimit: '3' | 'unlimited';
    crownAmount: number;
    focus: 'conservative' | 'prosthetic';
  };
  caregiving?: {                // 간병 서비스 보험 전용 필드
    type: 'support' | 'expense';
    isStepUp: boolean;
  };
  silson?: {                    // 실손의료보험 전용 필드
    hasCurrentSilson: 'yes' | 'no';    // 기존 실손 가입 여부 (중복방지)
    threeMonthTreatment: 'yes' | 'no'; // 3개월 내 의료행위
    oneYearExam: 'yes' | 'no';         // 1년 내 추가검사
    fiveYearTreatment: 'yes' | 'no';   // 5년 내 입원/수술/계속치료
  };
  child?: {                     // 어린이/태아보험 전용 필드
    targetAgeGroup: 'prenatal' | 'child' | 'youth';
    maturity: 30 | 100;
    focusArea: 'hospitalization' | 'majorDisease';
    hasPrenatalRider: boolean;
    weeksPregnancy?: number;    // 임신 주수 (태아일 때)
    isPreFamily?: boolean;      // 유병자 어린이보험 여부
    illnessType?: string;       // 유병력 유형 (발달지연/ADHD 등)
    noAccidentYears?: '0' | '2' | '3' | '5'; // 무사고 기간 (3.N.5)
  };
  car?: {                     // 자동차보험 전용 필드
    annualMileage: 'under_3k' | 'under_5k' | 'under_10k' | 'over_15k';
    safeDrivingScore: 'none' | 'under_70' | 'under_80' | 'over_80';
    hasConnectedCar: boolean;
    hasBlackbox: boolean;
    hasChildRider: boolean;
    currentPropertyLimit: number;
    currentInjuryType: 'jason' | 'jasang';
    brand?: string;           // 차량 브랜드 (hyundai/kia/genesis/kg_renault_gm/imported)
    model?: string;           // 세부 차종 ID (avante/grandeur/sorento 등)
    year?: number;            // 제조 연식 (2018~2026)
    driverLimit?: 'single' | 'couple' | 'family' | 'anyone'; // 운전자 범위 특약
    ownDamage?: 'join' | 'exclude_single' | 'none'; // 자기차량손해 가입 방식
    hasLaneSafety?: boolean;
    hasForwardCollision?: boolean;
    engine?: string;
    trim?: string;
  };
  driver?: {                  // 운전자보험 전용 필드
    drivingPurpose: 'private' | 'commercial'; // 운전 목적 (자가용/영업용)
    jobClass: 1 | 2 | 3;                      // 직업급수 (1~3급)
    planType: 'saving' | 'standard' | 'premium'; // 희망 플랜 (가성비/표준형/최고급)
  };
  pet?: {                     // 펫보험 전용 필드
    petType: 'dog' | 'cat';
    petName: string;
    breed: string;
    birthYearMonth: string;   // YYYYMM
    selfPayRatio: 50 | 70 | 80 | 90; // 보장 비율
    deductible: 10000 | 20000 | 30000 | 50000 | 100000;
    isRegistered: boolean;
    patellaRider: boolean;    // 슬개골/고관절 특약
    skinRider: boolean;       // 피부질환 특약
    dentalRider: boolean;      // 치과질환 특약
  };
}

export interface AnalysisResult {
  analysis: InsuranceAnalysis; // 원본 분석 요청 데이터
  scores: {
    cancerScore: number;
    cerebrovascularScore: number;
    cardiovascularScore: number;
    totalScore: number;
  };
  efficiency: number; // 보장 점수 합계 / 월 보험료
  deficiencies: string[]; // 부족한 보장 항목 리스트
  recommendations: {
    diet: RecommendationPlan;
    upgrade: RecommendationPlan;
    hybrid: RecommendationPlan;
  };
}

export interface RecommendationPlan {
  title: string;
  description: string;
  estimatedPremium: number;
  coverageChanges: string[];
  switchingLossNotice: string;
  companyName?: string;
  productName?: string;
}
