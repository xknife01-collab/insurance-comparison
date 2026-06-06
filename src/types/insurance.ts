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
  subType?: string;          // 상세 타입 (예: 대출안심형, 정기보장형 등)
  _realDbPremium?: number;
  _productName?: string;
  _companyName?: string;
  _allOptions?: any[];
  _remodelingCoverage?: any;
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
  car?: {                     // 자동차 보험 필드
    annualMileage: 'under_3k' | 'under_5k' | 'under_10k' | 'over_15k';
    safeDrivingScore: 'none' | 'under_70' | 'under_80' | 'over_80';
    hasConnectedCar: boolean;
    hasBlackbox: boolean;
    hasChildRider: boolean;
    currentPropertyLimit: number;
    currentInjuryType: 'jason' | 'jasang';
    brand?: string;           // 차량 브랜드 (hyundai/kia/genesis/kg_renault_gm/imported)
    model?: string;           // 차량 모델 ID (avante/grandeur/sorento 등)
    year?: number;            // 차량 연식 (2018~2026)
    driverLimit?: 'single' | 'couple' | 'family' | 'anyone'; // 운전자 범위 특약
    ownDamage?: 'join' | 'exclude_single' | 'none'; // 자기차량손해 가입여부
    hasLaneSafety?: boolean;
    hasForwardCollision?: boolean;
    engine?: string;
    trim?: string;
    subType?: 'personal' | 'business'; // 개인용 차 vs 업무용 차
    noAccidentYears?: 'none' | '1year' | '3years' | '5years'; // 무사고 기간
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
  golf?: {                     // 골프·레저보험 전용 필드
    gameType: 'amateur' | 'professional'; // 경기 유형 (아마추어 vs 프로/지도자)
    planType: 'one_day' | 'annual';        // 플랜 유형 (원데이 1일형 vs 1년형)
    durationDays: number;                  // 가입 기간 (1일 ~ 365일)
    isGroup: boolean;                      // 4인 동반 가입 여부
    companionNames?: string[];             // 동반 가입자 명단 (최대 3인)
    hasHoleInOneRider: boolean;            // 홀인원 축하 비용 특약
    hasLiabilityRider: boolean;            // 골프 배상책임 특약
    hasEquipmentRider: boolean;            // 골프용품 손해 특약
  };
  fire?: {                     // 주택화재보험 전용 필드
    residenceType: 'apartment' | 'villa' | 'house'; // 주거 유형 (아파트 / 빌라·연립 / 단독주택)
    occupancyType: 'owner' | 'tenant';              // 거주 유형 (소유자/집주인 / 임차인/세입자)
    buildingArea: number;                           // 건물 전용면적 (㎡)
    structureGrade: 1 | 2 | 3;                      // 건물 구조 등급 (1급: 콘크리트 / 2급: 벽돌 / 3급: 목조 등)
    hasWaterLeakRider: boolean;                     // 급배수시설누출손해 특약 여부 (누수 보장)
    hasLiabilityRider: boolean;                     // 화재배상책임 / 일상생활배상책임 특약 여부 (옆집 배상)
    hasTemporaryHousingRider: boolean;              // 임시거주비 특약 여부
    householdGoodsLimit: number;                    // 가재도구 가입금액 (원)
    buildingLimit: number;                          // 건물 가입금액 (원)
  };
  annuity?: {                     // 연금저축보험 전용 필드
    annuityType: 'savings' | 'insurance'; // 세액공제형 연금저축 vs 비과세형 일반연금
    monthlyPremium: number;       // 희망 월 납입 보험료 (원)
    paymentPeriod: number;        // 납입 기간 (5, 10, 20년 등)
    commencementAge: number;     // 연금 개시 나이 (55세 ~ 70세)
    annualIncome: number;         // 연간 총 급여액 (원)
    hasIrp: boolean;              // IRP 가입 여부
    receivingPeriod: number;      // 연금 수령 기간 (년, 10, 20년 또는 종신/999)
  };
  wholeLife?: {                   // 종신보험 전용 필드
    objective: 'family' | 'inheritance' | 'savings'; // 가입 목적 (가족생활비 / 상속세 재원 / 목적자금 마련)
    paymentPeriod: number;        // 납입 기간 (5, 7, 10, 20년 등)
    deathBenefit: number;         // 사망 보장금액 (원)
    refundType: 'standard' | 'low'; // 환급형태 (일반 환급형 / 저해지 환급형)
    isStepUp: boolean;            // 체증형 여부 (매년 5%씩 사망보험금 증가)
  };
  variable?: {                   // 변액/정기보험 전용 필드
    subType: 'investment' | 'term';
    monthlyPremium: number;
    paymentPeriod: number;
    investmentStyle: 'conservative' | 'balanced' | 'aggressive';
    equityRatio: number;
    isAnnuityConversion: boolean;
    deathBenefit: number;
    coveragePeriod: number;
    isHealthyDiscount: boolean;
  };
  legal?: {                      // 민사/형사 법률비용보전보험 전용 필드
    subType?: 'lawyer' | 'court_fee'; // 상세 타입 (변호사 선임 / 소송 비용)
    litigationType: 'civil' | 'criminal' | 'administrative'; // 소송 구분 (민사소송 / 형사사건 / 행정소송)
    lawyerLimit: number;      // 변호사선임비용 한도 (원, 500만 ~ 3,000만)
    courtFeeLimit: number;    // 인지대/송달료 한도 (원, 200만 ~ 1,000만)
    deductibleType: 'fixed' | 'ratio'; // 자기부담금 방식 (10만원 정액 / 10% 비례)
    suddenAccelerationRider: boolean; // 급발진 분쟁 특약 여부
    consultationRider: boolean;       // 변호사 1:1 상담 지원 특약 여부
    isElectronicLitigation: boolean;  // 전자소송 이용 여부 (5% 할인)
  };
  savingsGeneral?: {
    savingType: 'installment' | 'lumpSum'; // 적립식 vs 일시납
    monthlyPremium: number;               // 월 납입액 (적립식) 또는 납입 총액 (일시납)
    paymentPeriod: number;                // 납입 기간 (3년, 5년, 7년, 10년, 20년 등)
    maintenancePeriod: number;            // 유지 기간 (5년, 10년, 12년 등)
    savingsObjective: 'marriage' | 'housing' | 'retirement' | 'wealth' | 'education'; // 저축 목적
    hasUniversal: boolean;                // 유니버셜 기능 (추가납입 / 중도인출) 여부
  };
  credit?: {
    loanType: 'mortgage' | 'jeonse' | 'credit' | 'business'; // 대출 종류
    loanAmount: number;             // 대출 잔액 (원)
    loanPeriod: number;             // 남은 대출 기간 (년, 1~30)
    creditBureau: 'nice' | 'kcb';   // 신용 평가사
    creditScore: number;            // 신용 점수 (0~1000)
    hasIllnessRider: boolean;       // 3대 중대질병(암/뇌/심장) 진단 시 상환 특약
    hasDisabilityRider: boolean;    // 50% 이상 장해 시 상환 특약
    subType?: string;               // 상세 타입 (대출안심형 / 정기보장형)
  };
  healthGeneral?: {
    cancerLimit: number;          // 일반암 진단비 한도 (원)
    similarCancerLimit: number;   // 유사암 진단비 한도 (원)
    brainLimit: number;           // 뇌혈관 진단비 한도 (원)
    heartLimit: number;           // 허혈성 심장 진단비 한도 (원)
    cardioLimit: number;          // 심혈관 진단비 한도 (원)
    has1to5Surgery: boolean;      // 1-5종 수술비 특약
    hasTargetedTherapy: boolean;  // 표적항암 치료비 특약
    hasThrombolysis: boolean;     // 혈전용해 치료비 특약
    hasLiability: boolean;        // 가족일상생활배상책임 특약
    paymentPeriod: number;        // 납입기간 (10, 20, 30)
    coveragePeriod: number;       // 만기 (80, 90, 100)
    isRenewable: boolean;         // 갱신 여부
    refundType: 'standard' | 'low'; // 표준형 vs 무해지(저해지) 환급형
  };
  accident?: {                  // 상해보험 전용 필드
    accidentDeathLimit: number; // 상해사망 한도 (원)
    accidentDisabilityLimit: number; // 상해후유장해 한도 (원)
    fractureLimit: number;      // 골절진단비 한도 (원)
    castLimit: number;          // 깁스치료비 한도 (원)
    surgeryLimit: number;       // 상해수술비 한도 (원)
    hospitalDailyLimit: number; // 상해입원일당 한도 (원)
    jobClass: 1 | 2 | 3;        // 직업급수 (1~3급)
    drivingType: 'none' | 'private' | 'commercial'; // 운전형태 (비운전 / 자가용 / 영업용)
    hasLeisureRider: boolean;   // 레저스포츠/취미 상해 특약
    subType?: string;           // 상세타입 (상해장해형 / 골절치료형)
  };
  property?: {
    businessType: 'office' | 'retail' | 'restaurant' | 'academy' | 'factory' | 'warehouse'; // 업종 유형
    buildingGrade: 'grade_1' | 'grade_2' | 'grade_3'; // 건물 구조 등급 (1급: 콘크리트 / 2급: 벽돌 / 3급: 판넬)
    buildingLimit: number; // 건물 가입금액 (원)
    interiorLimit: number; // 시설/인테리어 가입금액 (원)
    equipmentLimit: number; // 집기비품 가입금액 (원)
    inventoryLimit: number; // 재고자산 가입금액 (원)
    hasWaterLeak: boolean; // 급배수시설누출손해 특약 여부 (누수)
    hasPremisesLiability: boolean; // 시설소유자배상책임 특약 여부
    hasBusinessInterruption: boolean; // 점포휴업손해 특약 여부
    hasFoodLiability: boolean; // 음식물배상책임 특약 여부 (식중독/이물 등)
    hasMachineryBreakdown: boolean; // 기계고장/전기적손해 특약 여부
    subType?: string; // 상세 타입 ('상가 화재형' | '화재배상책임형')
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
  undiscountedPremiums?: {
    diet: number;
    hybrid: number;
    upgrade: number;
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
