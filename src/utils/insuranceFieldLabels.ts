/**
 * 28개 전체 보험 카테고리 필드 라벨 및 값 한글 번역 사전
 * 고객 입력 화면과 100% 일치하도록 관리자 결과지에 매핑
 */

export const FIELD_LABELS: Record<string, string> = {
  // 공통
  gender: '성별',
  age: '연령',
  jobClass: '직업 급수',
  currentAmount: '가입 금액',
  targetAmount: '목표 보장금액',
  monthlyPremium: '월 납입 보험료',
  paymentType: '납입/갱신 유형',
  paymentPeriod: '납입 기간',
  coveragePeriod: '보장 기간',
  selectedType: '선택 유형',
  subType: '상세 유형',
  isRenewable: '갱신 여부',
  refundType: '환급 유형',
  healthStatus: '건강 상태',
  paymentExemption: '납입 면제',

  // 1. 운전자보험
  drivingPurpose: '운전 목적',
  planType: '플랜 유형',

  // 2. 자동차보험
  brand: '차량 브랜드',
  model: '차량 모델',
  year: '차량 연식',
  engine: '배기량/엔진',
  trim: '트림 정보',
  driverLimit: '운전자 범위',
  currentInjuryType: '자손/자상 유형',
  currentPropertyLimit: '대물 배상 한도',
  annualMileage: '연간 주행거리',
  safeDrivingScore: '안전운전 점수',
  hasConnectedCar: '커넥티드카 할인',
  hasBlackbox: '블랙박스 할인',
  hasChildRider: '자녀 할인 특약',
  hasLaneSafety: '차선이탈 방지 특약',
  hasForwardCollision: '전방충돌 방지 특약',
  ownDamage: '자기차량손해(자차)',
  noAccidentYears: '무사고 기간',

  // 3. 암보험
  treatmentCost2025: '2025 암주요치료비',
  targetedTherapy: '표적항암/원인자',
  recurrentCancer: '재발/전이암 보장',
  familyHistory: '암 가족력',
  cancerLimit: '암 진단비 한도',
  similarCancerLimit: '유사암 진단비 한도',

  // 4. 뇌혈관질환
  brainSurgeryBenefit: '뇌혈관 수술비',
  brainLimit: '뇌혈관 진단비 한도',

  // 5. 심장질환
  heartHealthType: '심사 유형',
  heartCoverageLevel: '보장 범위',
  heartLimit: '허혈성심장 진단비 한도',
  cardioLimit: '심장질환 진단비 한도',

  // 6. 수술/입원
  surgeryFocus: '수술비 보장 범위',
  hospitalDailyAmt: '입원 일당',
  hospitalAmount: '입원 일당',
  surgeryLimit: '수술비 한도',
  has1to5Surgery: '1~5종 수술비 특약',

  // 7. 치아보험
  dentalFocus: '중점 보장',
  focus: '중점 보장',
  diagnosticType: '진단형 여부',
  implantLimit: '임플란트 한도',
  crownAmount: '크라운 금액',
  dentures: '틀니 착용 여부',
  lastYear: '1년 이내 치료력',
  last5Years: '5년 이내 잇몸질환',

  // 8. 의료실비
  hasCurrentSilson: '기존 실손 가입 여부',
  threeMonthTreatment: '3개월 이내 치료력',
  oneYearExam: '1년 이내 추가 검사',
  fiveYearTreatment: '5년 이내 치료력',
  nonReimbursableUsage: '비급여 이용량',
  pregnancyCover: '임신/출산 보장',
  frequentNonSevere: '다빈도 경증 질환',

  // 9. 간병보험
  careSvcType: '간병 서비스 방식',
  type: '지원 방식',
  caregiverOption: '간병인 옵션',
  isNursingHospital: '요양병원 포함',

  // 10. 치매 간병보험
  dementiaServiceType: '치매 보장 단계',
  dementiaDiagnosis: '치매 진단비',
  monthlyAllowance: '치매 생활자금',
  hasDementiaHistory: '치매 이력',

  // 11. 재가/시설
  nursingPreferredService: '선호 서비스',
  preferredService: '선호 서비스',
  homeAmount: '재가 치료비',
  facilityAmount: '시설 치료비',
  hasProxyClaim: '대리 청구인 지정',
  hasBrainHistory: '뇌질환 이력',
  hasLtcHistory: '장기요양 이력',
  hasLtcGrade: '장기요양 등급',

  // 12. 어린이/신생아
  childAgeGroup: '대상 연령층',
  targetAgeGroup: '대상 연령층',
  childMaturity: '만기 설정',
  maturity: '만기 설정',
  hasPrenatalRider: '태아 특약 여부',
  weeksPregnancy: '임신 주수',
  childBirthDate: '자녀 생년월일',

  // 13. 유병력자 전용
  isPreFamily: '유병력 가입 여부',
  illnessType: '보유 질환 종류',

  // 14. 펫보험
  petType: '반려동물 종류',
  petName: '반려동물 이름',
  breed: '품종',
  birthYearMonth: '출생 년월',
  selfPayRatio: '자기부담 비율',
  deductible: '공제금액',
  isRegistered: '동물등록 여부',
  patellaRider: '슬개골 탈구 특약',
  skinRider: '피부 질환 특약',
  dentalRider: '치과 질환 특약',

  // 15. 골프/레저
  gameType: '경기/가입 방식',
  durationDays: '보장 일수',
  isGroup: '단체 가입 여부',
  companionNames: '동반자 명단',
  hasHoleInOneRider: '홀인원 비용 특약',
  hasEquipmentRider: '골프용품 손해 특약',
  hasLeisureRider: '레저활동 특약',

  // 16. 주택화재
  residenceType: '주거 형태',
  occupancyType: '소유 형태',
  buildingArea: '건물 면적',
  structureGrade: '건물 구조 등급',
  householdGoodsLimit: '가재도구 가입금액',
  buildingLimit: '건물 가입금액',
  hasLiabilityRider: '가족일상생활배상책임',
  hasWaterLeakRider: '누수 피해 특약',
  hasTemporaryHousingRider: '임시 거주비 특약',

  // 17. 재물종합
  businessType: '업종 구분',
  buildingGrade: '건물 구조/방화 등급',
  interiorLimit: '시설/인테리어 가입금액',
  equipmentLimit: '집기비품 가입금액',
  inventoryLimit: '재고자산 가입금액',
  hasWaterLeak: '급배수시설 누출 손해',
  hasPremisesLiability: '영업배상책임',
  hasBusinessInterruption: '휴업 손해 지원',
  hasFoodLiability: '음식물 배상책임',
  hasMachineryBreakdown: '기계 손해 특약',

  // 18. 연금저축
  annuityType: '연금 유형',
  commencementAge: '연금 개시 나이',
  hasIrp: 'IRP 계좌 보유 여부',
  receivingPeriod: '연금 수령 기간',

  // 19. 종신보험
  deathBenefit: '사망 보험금',
  objective: '가입 목적',
  isStepUp: '체증형 여부',
  refundTypeLabel: '해약환급금 유형',

  // 20. 변액/정기
  variableSubType: '상세 유형',
  investmentStyle: '투자 성향',
  equityRatio: '주식형 편입 비중',
  isAnnuityConversion: '연금 전환 가능 여부',
  isHealthyDiscount: '건강체 할인 여부',

  // 21. 상해보험
  accidentDeathLimit: '상해사망 가입금액',
  accidentDisabilityLimit: '상해후유장해 가입금액',
  fractureLimit: '골절 진단비 한도',
  castLimit: '깁스 치료비 한도',
  hospitalDailyLimit: '상해 입원일당 한도',
  drivingType: '운전 여부',

  // 22. 일반저축
  savingType: '저축 유형',
  maintenancePeriod: '거치/유지 기간',
  savingsObjective: '저축 목적',
  hasUniversal: '유니버셜 기능',
  annualIncome: '연간 소득',

  // 23. 신용보험
  loanType: '대출 종류',
  loanAmount: '대출 잔액',
  loanPeriod: '대출 잔여기간',
  creditBureau: '신용등급 기관',

  // 24. 법률비용
  legalType: '법률 비용 유형'
};

const VALUE_TRANSLATION: Record<string, string> = {
  // 직업 급수
  '1': '1급 (사무직/비위험)',
  '2': '2급 (외근/서비스직)',
  '3': '3급 (현장/운전직)',

  // 플랜 유형
  'standard': '표준형',
  'essential': '실속형 (기본)',
  'premium': '고급형 (풀보장)',

  // 운전 목적
  'private': '자가용 (출퇴근/가정용)',
  'commercial': '영업용 (화물/배달)',

  // 납입/갱신 유형
  'non-renewable': '비갱신형 (추천)',
  'renewable': '갱신형',
  'targeted': '표적항암집중형',

  // 자동차
  'all': '누구나 운전',
  'family': '가족 한정',
  'couple': '부부 한정',
  'single': '1인 한정 (본인만)',
  'self_injury': '자기신체사고 (자손)',
  'car_injury': '자동차상해 (자상)',
  'low': '적음 (할인 혜택)',
  'normal': '보통',
  'high': '많음',

  // 심사 유형
  'simple': '간편심사 (유병자)',
  'general': '일반심사 (표준체)',

  // 수술비
  'wide': '1~5종 포괄보장',
  'named': '특정 다빈도 질환',
  'major': '3대 주요질환 집중',

  // 치아
  'conservative': '보존치료 (레진/인레이)',
  'prosthetic': '보철치료 (임플란트/틀니)',
  'non-diagnostic': '무진단형 (간편가입)',
  'diagnostic': '진단형',

  // 간병 / 치매 / 재가
  'support': '간병인 지원형 (보험사 파견)',
  'use': '간병인 사용일당 (실비 지급)',
  'mild': '경증(CDR 1점)부터 보장',
  'severe': '중증 치매 집중',
  'home': '방문 재가요양 집중',
  'facility': '시설급여(요양원) 집중',
  'both': '재가 + 시설 전체보장',

  // 어린이
  'prenatal': '태아 (출생 전)',
  'infant': '영유아 (0~7세)',
  'child': '어린이 (출생 후)',
  'youth': '청소년/성인',
  '30': '30세 만기 (가성비)',
  '100': '100세 만기 (평생보장)',

  // 유병자 질환
  'hypertension': '고혈압',
  'diabetes': '당뇨',
  'hyperlipidemia': '고지혈증',
  'etc': '기타 만성질환',

  // 펫
  'dog': '반려견 (강아지)',
  'cat': '반려묘 (고양이)',

  // 골프
  'one_day': '1일 라운딩 전용',
  'annual': '1년 정기형',

  // 주택 / 재물
  'apartment': '아파트',
  'villa': '빌라/연립/다세대',
  'house': '단독주택',
  'commercial_bldg': '상가/오피스',
  'owner': '자가 (소유)',
  'tenant': '임차 (전/월세)',
  'restaurant': '일반음식점/카페',
  'retail': '소매/판매시설',
  'office': '사무실/오피스',
  'factory': '공장/창고',
  'grade1': '1급 (내화구조)',
  'grade2': '2급 (철골구조)',
  'grade3': '3급 (목조/기타)',

  // 연금 / 저축 / 종신
  'tax_deductible': '세액공제형 (연금저축)',
  'non_tax': '비과세형 (일반연금)',
  '10': '10년 확정/납입',
  '20': '20년 확정/납입',
  'whole_life': '종신 수령/평생보장',
  'inheritance': '상속세 절세 플랜',
  'low_surrender': '무해약환급형/미지급형',
  'variable_saving': '변액저축형',
  'investment': '투자수익형',
  'term_ceo': 'CEO 정기플랜',
  'fixed': '확정금리형',
  'floating': '변동금리형',
  'indexed': '지수연계형',
  'lump_sum': '목돈 만들기',
  'emergency': '비상자금 확보',
  'tax_saving': '비과세 절세',

  // 신용 / 법률
  'mortgage': '주택담보대출',
  'credit': '신용대출',
  'business': '사업자대출',
  'civil': '민사소송 중심',
  'criminal': '형사/행정소송 포함',
  'all_round': '종합 법률비용',

  // 성별 / 운전자 여부
  'M': '남성',
  'F': '여성',
  'driver': '운전자',
  'non_driver': '비운전자'
};

export const formatInsuranceValue = (key: string, val: any): string => {
  if (val === true) return '포함 (가입)';
  if (val === false) return '미포함 (미가입)';
  
  if (Array.isArray(val)) {
    return val.map(item => {
      if (typeof item === 'object' && item !== null) {
        return item.rider_name || item.name || JSON.stringify(item);
      }
      return VALUE_TRANSLATION[String(item)] || String(item);
    }).join(', ');
  }

  if (typeof val === 'object' && val !== null) {
    return JSON.stringify(val);
  }

  if (typeof val === 'number') {
    // 직업 급수 등 단일 숫자 코드가 매핑 사전에 있는 경우
    if (key === 'jobClass' && VALUE_TRANSLATION[String(val)]) {
      return VALUE_TRANSLATION[String(val)];
    }
    if (val >= 100000000) {
      return `${(val / 100000000).toLocaleString()}억 원`;
    }
    if (val >= 10000) {
      return `${(val / 10000).toLocaleString()}만 원`;
    }
    return val.toLocaleString();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (VALUE_TRANSLATION[trimmed]) {
      return VALUE_TRANSLATION[trimmed];
    }
    return trimmed;
  }

  return String(val);
};
