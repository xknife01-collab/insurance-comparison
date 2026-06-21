import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Activity, Clock, Baby, Smile, 
  Stethoscope, Calendar, PiggyBank, 
  Car, Home, Brain, TrendingUp, Navigation,
  Heart, Hospital, Users, Wallet, Flame, Dog, Plane, Target, Scale, Hotel, Sparkles, Plus, Zap, ChevronRight, HelpCircle, HeartHandshake, AlertCircle
} from 'lucide-react';
import { HealthFields } from './insurance/health/HealthFields';
import { HealthGeneralFields } from './insurance/healthGeneral/HealthGeneralFields';
import { SilsonFields } from './insurance/silson/SilsonFields';
import { CaregivingFields } from './insurance/caregiving/CaregivingFields';
import { CaregivingOldFields } from './insurance/caregiving/CaregivingOldFields';
import { NursingFields } from './insurance/nursing/NursingFields';
import { DentalFields } from './insurance/dental/DentalFields';
import { PreExistingFields } from './insurance/preExisting/PreExistingFields';
import { SurgeryFields as SurgeryHospitalFields } from './insurance/surgery/SurgeryFields';
import { CancerFields } from './insurance/cancer/CancerFields';
import { BrainFields } from './insurance/brain/BrainFields';
import { HeartFields } from './insurance/heart/HeartFields';
import { ChildFields } from './insurance/child/ChildFields';
import { PreFamilyFields } from './insurance/child/PreFamilyFields';
import { CarFields } from './insurance/car/CarFields';
import { DriverFields } from './insurance/driver/DriverFields';
import { PetFields } from './insurance/pet/PetFields';
import { GolfFields } from './insurance/golf/GolfFields';
import { FireFields } from './insurance/fire/FireFields';
import { PropertyFields } from './insurance/property/PropertyFields';
import { AnnuityFields } from './insurance/annuity/AnnuityFields';
import { WholeLifeFields } from './insurance/wholeLife/WholeLifeFields';
import { VariableFields } from './insurance/variable/VariableFields';
import { AccidentFields } from './insurance/accident/AccidentFields';
import { SavingsFields } from './insurance/savings/SavingsFields';
import { CreditFields } from './insurance/credit/CreditFields';
import { LegalFields } from './insurance/legal/LegalFields';
import MobileShowcase from './MobileShowcase';




interface SubCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  subTypes: string[];
}

interface MajorCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  accentColor: string;
  items: SubCategory[];
}

const ALL_CATEGORIES: MajorCategory[] = [
  {
    id: 'medical',
    label: '인기 보험 전수 조사',
    icon: Hospital,
    accentColor: '#FF6B00',
    items: [
      { id: 'silson', label: '의료실비', description: '병원비 90% 보장', icon: Shield, color: '#00D7C4', bgColor: '#F0FDFA', subTypes: ['4세대 실손', '5세대 실손', '노후 실손'] },
      { id: 'dental', label: '치아보험', description: '임플란트/크라운', icon: Smile, color: '#10B981', bgColor: '#F0FDF4', subTypes: ['진단형', '무진단형'] },
      { id: 'pre', label: '유병자', description: '아픈 분도 가입', icon: Stethoscope, color: '#2563EB', bgColor: '#EFF6FF', subTypes: ['간편 고지형', '무심사형'] },
      { id: 'surgery', label: '수술/입원', description: '수술비 반복 지급', icon: Activity, color: '#F59E0B', bgColor: '#FFFBEB', subTypes: ['1-5종 수술비', 'N대 수술비', '상해 수술비'] },
      { id: 'cancer', label: '암보험', description: '진단비 최대 1억', icon: Shield, color: '#F43F5E', bgColor: '#FFF1F2', subTypes: ['비갱신형', '갱신형', '표적항암형'] },
      { id: 'health_general', label: '종합건강', description: '하나의 보험으로 빈틈없이 조립', icon: Shield, color: '#FF6B00', bgColor: '#FFF0E5', subTypes: ['기본형', '종합형'] },
    ]
  },
  {
    id: 'disease',
    label: '기타 보장 자산',
    icon: Activity,
    accentColor: '#64748B',
    items: [
      { id: 'brain', label: '뇌혈관', description: '뇌질환 무제한 보장', icon: Brain, color: '#8B5CF6', bgColor: '#F5F3FF', subTypes: ['뇌혈관질환', '뇌출혈'] },
      { id: 'heart', label: '심장질환', description: '허혈성 심장 집중', icon: Heart, color: '#FB7185', bgColor: '#FFF1F2', subTypes: ['급성 심근경색', '통합(급성+허혈성)'] },
      { id: 'accident', label: '상해보험', description: '사고 장해 및 골절 치료 자산', icon: Activity, color: '#8B5CF6', bgColor: '#F5F3FF', subTypes: ['상해장해형', '골절/치료형'] },
    ]
  },

  {
    id: 'care_major',
    label: '간병 / 노후 케어',
    icon: Hotel,
    accentColor: '#7C3AED',
    items: [
      { id: 'care_svc', label: '간병 보험', description: '간병인 지원 및 사용일당 집중', icon: Hotel, color: '#7C3AED', bgColor: '#F5F3FF', subTypes: ['지원(파견)', '사용(일당)'] },
      { id: 'care_old', label: '치매 간병보험', description: '치매 진단비 및 생활자금', icon: Brain, color: '#B45309', bgColor: '#FFFBEB', subTypes: ['경증 치매', '중증 간병'] },
      { id: 'nursing', label: '재가/시설', description: '국가 공인 방문 요양', icon: HeartHandshake, color: '#EC4899', bgColor: '#FDF2F8', subTypes: ['방문 재가', '시설 입소', '전체보장'] },
    ]
  },
  {
    id: 'family',
    label: '태아 / 어린이 / 청소년',
    icon: Users,
    accentColor: '#FACC15',
    items: [
      { id: 'child', label: '어린이/신생아', description: '태아부터 성인까지', icon: Baby, color: '#FACC15', bgColor: '#FEFCE8', subTypes: ['태아 보장', '성인 전환'] },
      { id: 'pre_family', label: '유병력자 전용', description: '간편 고지 가입', icon: Stethoscope, color: '#3B82F6', bgColor: '#EFF6FF', subTypes: ['초간편 고지', '중증 유병자'] },
    ]
  },
  {
    id: 'operating',
    label: '생활 / 운행 / 레저',
    icon: Car,
    accentColor: '#334155',
    items: [
      { id: 'car', label: '자동차 보험', description: '전사 가격 자동 비교', icon: Car, color: '#334155', bgColor: '#F8FAFC', subTypes: ['개인용 차', '업무용 차'] },
      { id: 'driver', label: '운전자 보험', description: '벌금 및 민사 보장', icon: Navigation, color: '#4F46E5', bgColor: '#EEF2FF', subTypes: ['교통 사고 처리', '변호사 비용'] },
      { id: 'pet', label: '펫 보험', description: '우리 아이 병원비', icon: Dog, color: '#D97706', bgColor: '#FEF3C7', subTypes: ['슬개골 탈구', '피부 질환'] },
      { id: 'golf', label: '골프 / 레저', description: '취미 생활 보호', icon: Target, color: '#16A34A', bgColor: '#F0FDF4', subTypes: ['홀인원 축하', '필드 사고'] },
      { id: 'fire_real', label: '주택화재', description: '재산 피해 보호', icon: Home, color: '#EF4444', bgColor: '#FEF2F2', subTypes: ['건물 소실', '가재 도구'] },
      { id: 'property', label: '재물종합', description: '상가 화재 및 소상공인 자산 보호', icon: Home, color: '#3B82F6', bgColor: '#EFF6FF', subTypes: ['상가 화재형', '화재배상책임형'] },
    ]
  },
  {
    id: 'future',
    label: '저축 / 미래 / 법률',
    icon: Wallet,
    accentColor: '#10B981',
    items: [
      { id: 'pension', label: '연금저축', description: '노후 자금 준비', icon: PiggyBank, color: '#10B981', bgColor: '#ECFDF5', subTypes: ['세액 공제형', '비과세형'] },
      { id: 'whole', label: '종신', description: '가격대비 최다보장', icon: Clock, color: '#6366F1', bgColor: '#EEF2FF', subTypes: ['납입 면제', '연말 정산'] },
      { id: 'variable', label: '변액, 정기', description: '수익형 자산 관리', icon: TrendingUp, color: '#3B82F6', bgColor: '#EFF6FF', subTypes: ['적립식 투자', '정기적 보호'] },
      { id: 'legal', label: '민사/형사', description: '법률 비용 보전', icon: Scale, color: '#64748B', bgColor: '#F1F5F9', subTypes: ['변호사 선임', '소송 비용'] },
      { id: 'savings_general', label: '일반 저축', description: '비과세 목돈 마련 재테크', icon: PiggyBank, color: '#10B981', bgColor: '#ECFDF5', subTypes: ['적립식 저축', '일시납 저축'] },
      { id: 'credit', label: '신용보험', description: '대출금 상환 안심 보장', icon: Scale, color: '#6366F1', bgColor: '#EEF2FF', subTypes: ['대출안심형', '정기보장형'] },
    ]
  }
];

interface InsuranceCalculatorProps {
  onCalculate?: (analysis: any) => void;
  initialTarget?: string | null;
  isUnlocked?: boolean;
}

export const InsuranceCalculator: React.FC<InsuranceCalculatorProps> = ({ onCalculate, initialTarget, isUnlocked }) => {
  const [selectedId, setSelectedId] = useState(initialTarget || 'cancer');
  const formSectionRef = React.useRef<HTMLDivElement>(null);

  const handleCategorySelect = (id: string) => {
    setSelectedId(id);
    setSelectedDetail(0);
    setTimeout(() => {
      if (formSectionRef.current) {
        const elementRect = formSectionRef.current.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.scrollY;
        // 120px offset to account for the sticky header
        const scrollPosition = absoluteElementTop - 120;
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  React.useEffect(() => {
    if (initialTarget) {
      setSelectedId(initialTarget);
    }
  }, [initialTarget]);
  const [selectedDetail, setSelectedDetail] = useState(0);
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [socialLoading, setSocialLoading] = useState<'naver' | 'kakao' | null>(null);
  const [authModal, setAuthModal] = useState<'naver' | 'kakao' | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Input states
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [mobile, setMobile] = useState('');

  // SMS Verification States
  const [isSmsVerified, setIsSmsVerified] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [smsTimer, setSmsTimer] = useState(180);
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsError, setSmsError] = useState<string | null>(null);

  // Reset SMS verification status if mobile number changes
  React.useEffect(() => {
    setIsSmsVerified(false);
  }, [mobile]);

  // SMS Timer Effect
  React.useEffect(() => {
    let interval: any = null;
    if (showSmsModal && smsTimer > 0) {
      interval = setInterval(() => {
        setSmsTimer((prev) => prev - 1);
      }, 1000);
    } else if (smsTimer === 0) {
      setSmsError("인증 시간이 초과되었습니다. 재발송을 눌러주세요.");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showSmsModal, smsTimer]);

  const [triggerHyphenModal, setTriggerHyphenModal] = useState(false);
  const [jobClass, setJobClass] = useState(1); // 1: Office, 2: Driver/Field, 3: High Risk
  const [healthStatus, setHealthStatus] = useState<'standard' | 'simple'>('standard');
  const [preExistingType, setPreExistingType] = useState<'3.0.5' | '3.2.5' | '3.3.5' | '3.5.5'>('3.2.5');
  const [currentPremium, setCurrentPremium] = useState('');
  const [showAuditInfo, setShowAuditInfo] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [dentalLastYear, setDentalLastYear] = useState<'yes' | 'no'>('no');
  const [dentalLast5Years, setDentalLast5Years] = useState<'yes' | 'no'>('no');
  const [dentalDentures, setDentalDentures] = useState<'yes' | 'no'>('no');
  const [dentalImplantLimit, setDentalImplantLimit] = useState<'3' | 'unlimited'>('3');
  const [dentalCrownAmount, setDentalCrownAmount] = useState(200000);
  const [dentalFocus, setDentalFocus] = useState<'conservative' | 'prosthetic'>('conservative');
  const [dentalDiagnosticType, setDentalDiagnosticType] = useState<'diagnostic' | 'non-diagnostic'>('non-diagnostic');
  
  const [careSvcType, setCareSvcType] = useState<'support' | 'expense'>('expense');
  const [careStepUp, setCareStepUp] = useState(true);
  const [careNursingHospital, setCareNursingHospital] = useState(false);
  const [careGeriatric, setCareGeriatric] = useState(false);
  const [careIntegrated, setCareIntegrated] = useState(false);
  
  // Silson specific states
  const [silsonHasCurrent, setSilsonHasCurrent] = useState<'yes' | 'no'>('no');
  const [silson3Month, setSilson3Month] = useState<'yes' | 'no'>('no');
  const [silson1Year, setSilson1Year] = useState<'yes' | 'no'>('no');
  const [silson5Year, setSilson5Year] = useState<'yes' | 'no'>('no');
  const [silsonNonReimbursable, setSilsonNonReimbursable] = useState('under100'); // 기본값: 100만원 미만 (유지)
  const [silsonPregnancyCover, setSilsonPregnancyCover] = useState<'yes' | 'no'>('no');
  const [silsonFrequentNonSevere, setSilsonFrequentNonSevere] = useState<'yes' | 'no'>('no');
  
  // Surgery & Hospitalization specific states
  const [surgeryFocus, setSurgeryFocus] = useState<'wide' | 'named' | 'major'>('wide');
  const [hospitalAmount, setHospitalAmount] = useState(30000);
  const [caregiverOption, setCaregiverOption] = useState<'none' | 'use' | 'support'>('none');
  const [tertiaryHospital, setTertiaryHospital] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'standard' | 'simple'>('standard');
  
  // Detailed Coverage States
  const [selectedCancer, setSelectedCancer] = useState(30000000);
  const [selectedBrain, setSelectedBrain] = useState(10000000);
  const [selectedHeart, setSelectedHeart] = useState(10000000);
  const [selectedSurgery, setSelectedSurgery] = useState(300000);
  const [selectedDisability, setSelectedDisability] = useState(10000000);
  const [selectedExemption, setSelectedExemption] = useState<'standard' | 'premium'>('standard');
  const [redirectToast, setRedirectToast] = useState(false);
  
  // Cancer specific granular states
  const [cancerDiagnosisAmount, setCancerDiagnosisAmount] = useState(50000000);
  const [cancerTargetedTherapy, setCancerTargetedTherapy] = useState(true);
  const [cancerTreatmentCost2025, setCancerTreatmentCost2025] = useState(true);
  const [cancerPaymentType, setCancerPaymentType] = useState<'non-renewable' | 'renewable' | 'targeted'>('non-renewable');
  const [cancerRecurrentCancer, setCancerRecurrentCancer] = useState(false);
  const [cancerFamilyHistory, setCancerFamilyHistory] = useState(false);
  
  // Heart specific states
  const [heartHealthType, setHeartHealthType] = useState<'normal' | 'simple'>('normal');
  const [heartCoverageLevel, setHeartCoverageLevel] = useState<'basic' | 'standard' | 'premium'>('standard');
  
  // Dementia & Caregiving specific states
  const [dementiaDiagnosisAmount, setDementiaDiagnosisAmount] = useState(30000000);
  const [dementiaMonthlyAllowance, setDementiaMonthlyAllowance] = useState(500000);
  const [dementiaServiceType, setDementiaServiceType] = useState<'home' | 'facility' | 'both'>('home');
  const [dementiaHasProxyClaim, setDementiaHasProxyClaim] = useState(true);
  const [dementiaHasHistory, setDementiaHasHistory] = useState<boolean | null>(null);
  const [dementiaHasLtcGrade, setDementiaHasLtcGrade] = useState<boolean | null>(null);
  
  // At-home & Facility Care (Nursing) specific states
  const [nursingPreferredService, setNursingPreferredService] = useState<'home' | 'facility' | 'both'>('both');
  const [nursingHomeAmount, setNursingHomeAmount] = useState(500000);
  const [nursingFacilityAmount, setNursingFacilityAmount] = useState(500000);
  const [nursingHasProxyClaim, setNursingHasProxyClaim] = useState(true);
  const [nursingHasBrainHistory, setNursingHasBrainHistory] = useState(false);
  const [nursingHasLtcHistory, setNursingHasLtcHistory] = useState(false);
  
  // Brain specific states for refined component
  const [brainPaymentType, setBrainPaymentType] = useState<'non-renewable' | 'renewable'>('non-renewable');
  const [brainScreeningType, setBrainScreeningType] = useState<'standard' | '3.5.5' | '3.10.5'>('standard');
  const [brainSurgeryBenefit, setBrainSurgeryBenefit] = useState(false);
  const [brainCoveragePeriod, setBrainCoveragePeriod] = useState(80);

  // Child / Prenatal specific states
  const [childAgeGroup, setChildAgeGroup] = useState<'prenatal' | 'child' | 'youth'>('child');
  const [childMaturity, setChildMaturity] = useState<30 | 100>(30);
  const [childFocusArea, setChildFocusArea] = useState<'majorDisease' | 'hospitalization'>('majorDisease');
  const [childHasPrenatalRider, setChildHasPrenatalRider] = useState(false);
  const [childWeeksPregnancy, setChildWeeksPregnancy] = useState(12);

  // Pre-Family (Sick Child / Youth) specific states
  const [preFamilyIllnessType, setPreFamilyIllnessType] = useState<string>('development');
  const [preFamilyNoAccidentYears, setPreFamilyNoAccidentYears] = useState<'0' | '2' | '3' | '5'>('5');
  const [preFamilyMaturity, setPreFamilyMaturity] = useState<30 | 100>(30);

  // Child birth date states
  const [childBirthDate, setChildBirthDate] = useState('');
  const [preFamilyBirthDate, setPreFamilyBirthDate] = useState('');

  // Car specific states
  const [carMileage, setCarMileage] = useState<'under_3k' | 'under_5k' | 'under_10k' | 'over_15k'>('under_5k');
  const [carSafetyScore, setCarSafetyScore] = useState<'none' | 'under_70' | 'under_80' | 'over_80'>('under_80');
  const [carConnected, setCarConnected] = useState(true);
  const [carBlackbox, setCarBlackbox] = useState(true);
  const [carChildRider, setCarChildRider] = useState(false);
  const [carPropertyLimit, setCarPropertyLimit] = useState(2); // 2억
  const [carInjuryType, setCarInjuryType] = useState<'jason' | 'jasang'>('jason');
  const [carBrand, setCarBrand] = useState<string>('hyundai');
  const [carModel, setCarModel] = useState<string>('grandeur');
  const [carYear, setCarYear] = useState<number>(2024);
  const [carDriverLimit, setCarDriverLimit] = useState<'single' | 'couple' | 'family' | 'anyone'>('single');
  const [carOwnDamage, setCarOwnDamage] = useState<'join' | 'exclude_single' | 'none'>('join');
  const [carLaneSafety, setCarLaneSafety] = useState(true);
  const [carForwardCollision, setCarForwardCollision] = useState(true);
  const [carEngine, setCarEngine] = useState<string>('g2_5');
  const [carTrim, setCarTrim] = useState<string>('premium');
  const [carNoAccidentYears, setCarNoAccidentYears] = useState<'none' | '1year' | '3years' | '5years'>('3years');

  // 운전자보험 states
  const [driverDrivingPurpose, setDriverDrivingPurpose] = useState<'private' | 'commercial'>('private');
  const [driverJobClass, setDriverJobClass] = useState<1 | 2 | 3>(1);
  const [driverPlanType, setDriverPlanType] = useState<'saving' | 'standard' | 'premium'>('standard');

  // 펫보험 states
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [petName, setPetName] = useState('우리애기');
  const [petBreed, setPetBreed] = useState('말티즈');
  const [petBirthYearMonth, setPetBirthYearMonth] = useState('202305');
  const [petSelfPayRatio, setPetSelfPayRatio] = useState<50 | 70 | 80 | 90>(70);
  const [petDeductible, setPetDeductible] = useState<10000 | 20000 | 30000 | 50000 | 100000>(30000);
  const [petIsRegistered, setPetIsRegistered] = useState(false);
  const [petPatellaRider, setPetPatellaRider] = useState(true);
  const [petSkinRider, setPetSkinRider] = useState(true);
  const [petDentalRider, setPetDentalRider] = useState(false);

  // 골프보험 states
  const [golfGameType, setGolfGameType] = useState<'amateur' | 'professional'>('amateur');
  const [golfPlanType, setGolfPlanType] = useState<'one_day' | 'annual'>('annual');
  const [golfDurationDays, setGolfDurationDays] = useState(365);
  const [golfIsGroup, setGolfIsGroup] = useState(false);
  const [golfCompanionNames, setGolfCompanionNames] = useState<string[]>([]);
  const [golfHasHoleInOneRider, setGolfHasHoleInOneRider] = useState(true);
  const [golfHasLiabilityRider, setGolfHasLiabilityRider] = useState(true);
  const [golfHasEquipmentRider, setGolfHasEquipmentRider] = useState(true);

  // 주택화재보험 states
  const [fireResidenceType, setFireResidenceType] = useState<'apartment' | 'villa' | 'house'>('apartment');
  const [fireOccupancyType, setFireOccupancyType] = useState<'owner' | 'tenant'>('owner');
  const [fireBuildingArea, setFireBuildingArea] = useState<number>(84);
  const [fireStructureGrade, setFireStructureGrade] = useState<1 | 2 | 3>(1);
  const [fireHasWaterLeakRider, setFireHasWaterLeakRider] = useState<boolean>(true);
  const [fireHasLiabilityRider, setFireHasLiabilityRider] = useState<boolean>(true);
  const [fireHasTemporaryHousingRider, setFireHasTemporaryHousingRider] = useState<boolean>(true);
  const [fireHouseholdGoodsLimit, setFireHouseholdGoodsLimit] = useState<number>(30000000);
  const [fireBuildingLimit, setFireBuildingLimit] = useState<number>(100000000);

  // 연금저축보험 states
  const [annuityType, setAnnuityType] = useState<'savings' | 'insurance'>('savings');
  const [annuityMonthlyPremium, setAnnuityMonthlyPremium] = useState<number>(300000);
  const [annuityPaymentPeriod, setAnnuityPaymentPeriod] = useState<number>(10);
  const [annuityCommencementAge, setAnnuityCommencementAge] = useState<number>(60);
  const [annuityAnnualIncome, setAnnuityAnnualIncome] = useState<number>(50000000);
  const [annuityHasIrp, setAnnuityHasIrp] = useState<boolean>(false);
  const [annuityReceivingPeriod, setAnnuityReceivingPeriod] = useState<number>(20);

  // 종합건강보험 states
  const [healthGeneralCancerLimit, setHealthGeneralCancerLimit] = useState<number>(50000000);
  const [healthGeneralSimilarCancerLimit, setHealthGeneralSimilarCancerLimit] = useState<number>(10000000);
  const [healthGeneralBrainLimit, setHealthGeneralBrainLimit] = useState<number>(20000000);
  const [healthGeneralHeartLimit, setHealthGeneralHeartLimit] = useState<number>(20000000);
  const [healthGeneralCardioLimit, setHealthGeneralCardioLimit] = useState<number>(10000000);
  const [healthGeneralHas1to5Surgery, setHealthGeneralHas1to5Surgery] = useState<boolean>(true);
  const [healthGeneralHasTargetedTherapy, setHealthGeneralHasTargetedTherapy] = useState<boolean>(true);
  const [healthGeneralHasThrombolysis, setHealthGeneralHasThrombolysis] = useState<boolean>(false);
  const [healthGeneralHasLiability, setHealthGeneralHasLiability] = useState<boolean>(true);
  const [healthGeneralPaymentPeriod, setHealthGeneralPaymentPeriod] = useState<number>(20);
  const [healthGeneralCoveragePeriod, setHealthGeneralCoveragePeriod] = useState<number>(90);
  const [healthGeneralIsRenewable, setHealthGeneralIsRenewable] = useState<boolean>(false);
  const [healthGeneralRefundType, setHealthGeneralRefundType] = useState<'standard' | 'low'>('low');

  // 상해보험 states
  const [accidentDeathLimit, setAccidentDeathLimit] = useState<number>(50000000);
  const [accidentDisabilityLimit, setAccidentDisabilityLimit] = useState<number>(50000000);
  const [accidentFractureLimit, setAccidentFractureLimit] = useState<number>(300000);
  const [accidentCastLimit, setAccidentCastLimit] = useState<number>(100000);
  const [accidentSurgeryLimit, setAccidentSurgeryLimit] = useState<number>(500000);
  const [accidentHospitalDailyLimit, setAccidentHospitalDailyLimit] = useState<number>(20000);
  const [accidentJobClass, setAccidentJobClass] = useState<1 | 2 | 3>(1);
  const [accidentDrivingType, setAccidentDrivingType] = useState<'none' | 'private' | 'commercial'>('private');
  const [accidentHasLeisureRider, setAccidentHasLeisureRider] = useState<boolean>(false);

  // 종신보험 states
  const [wholeLifeObjective, setWholeLifeObjective] = useState<'family' | 'inheritance' | 'savings'>('family');
  const [wholeLifePaymentPeriod, setWholeLifePaymentPeriod] = useState<number>(10);
  const [wholeLifeDeathBenefit, setWholeLifeDeathBenefit] = useState<number>(100000000);
  const [wholeLifeRefundType, setWholeLifeRefundType] = useState<'standard' | 'low'>('low');
  const [wholeLifeIsStepUp, setWholeLifeIsStepUp] = useState<boolean>(false);

  // 변액/정기보험 states
  const [variableSubType, setVariableSubType] = useState<'term_pure' | 'term_ceo' | 'variable_term' | 'variable_saving' | 'investment' | 'term'>('variable_saving');
  const [variableMonthlyPremium, setVariableMonthlyPremium] = useState<number>(150000);
  const [variablePaymentPeriod, setVariablePaymentPeriod] = useState<number>(10);
  const [variableInvestmentStyle, setVariableInvestmentStyle] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [variableEquityRatio, setVariableEquityRatio] = useState<number>(50);
  const [variableIsAnnuityConversion, setVariableIsAnnuityConversion] = useState<boolean>(false);
  const [variableDeathBenefit, setVariableDeathBenefit] = useState<number>(100000000);
  const [variableCoveragePeriod, setVariableCoveragePeriod] = useState<number>(70);
  const [variableIsHealthyDiscount, setVariableIsHealthyDiscount] = useState<boolean>(false);

  // 일반저축보험 states
  const [savingsSavingType, setSavingsSavingType] = useState<'installment' | 'lumpSum'>('installment');
  const [savingsMonthlyPremium, setSavingsMonthlyPremium] = useState<number>(300000);
  const [savingsPaymentPeriod, setSavingsPaymentPeriod] = useState<number>(5);
  const [savingsMaintenancePeriod, setSavingsMaintenancePeriod] = useState<number>(10);
  const [savingsObjective, setSavingsObjective] = useState<'marriage' | 'housing' | 'retirement' | 'wealth' | 'education'>('wealth');
  const [savingsHasUniversal, setSavingsHasUniversal] = useState<boolean>(true);

  // 재물종합보험 states
  const [propertyBusinessType, setPropertyBusinessType] = useState<'office' | 'retail' | 'restaurant' | 'academy' | 'factory' | 'warehouse'>('restaurant');
  const [propertyBuildingGrade, setPropertyBuildingGrade] = useState<'grade_1' | 'grade_2' | 'grade_3'>('grade_1');
  const [propertyBuildingLimit, setPropertyBuildingLimit] = useState<number>(200000000);
  const [propertyInteriorLimit, setPropertyInteriorLimit] = useState<number>(50000000);
  const [propertyEquipmentLimit, setPropertyEquipmentLimit] = useState<number>(30000000);
  const [propertyInventoryLimit, setPropertyInventoryLimit] = useState<number>(20000000);
  const [propertyHasWaterLeak, setPropertyHasWaterLeak] = useState<boolean>(true);
  const [propertyHasPremisesLiability, setPropertyHasPremisesLiability] = useState<boolean>(true);
  const [propertyHasBusinessInterruption, setPropertyHasBusinessInterruption] = useState<boolean>(false);
  const [propertyHasFoodLiability, setPropertyHasFoodLiability] = useState<boolean>(true);
  const [propertyHasMachineryBreakdown, setPropertyHasMachineryBreakdown] = useState<boolean>(false);

  // 신용보험 states
  const [creditLoanType, setCreditLoanType] = useState<'mortgage' | 'jeonse' | 'credit' | 'business'>('mortgage');
  const [creditLoanAmount, setCreditLoanAmount] = useState<number>(100000000);
  const [creditLoanPeriod, setCreditLoanPeriod] = useState<number>(10);
  const [creditBureau, setCreditBureau] = useState<'nice' | 'kcb'>('nice');
  const [creditScore, setCreditScore] = useState<number>(850);
  const [creditHasIllnessRider, setCreditHasIllnessRider] = useState<boolean>(true);
  const [creditHasDisabilityRider, setCreditHasDisabilityRider] = useState<boolean>(true);

  // 법률보험 states
  const [legalLitigationType, setLegalLitigationType] = useState<'civil' | 'criminal' | 'administrative'>('civil');
  const [legalLawyerLimit, setLegalLawyerLimit] = useState<number>(10000000);
  const [legalCourtFeeLimit, setLegalCourtFeeLimit] = useState<number>(5000000);
  const [legalDeductibleType, setLegalDeductibleType] = useState<'fixed' | 'ratio'>('fixed');
  const [legalSuddenAccelerationRider, setLegalSuddenAccelerationRider] = useState<boolean>(true);
  const [legalConsultationRider, setLegalConsultationRider] = useState<boolean>(true);
  const [legalIsElectronicLitigation, setLegalIsElectronicLitigation] = useState<boolean>(true);






  
  const calculatedAge = useMemo(() => {
    if (birthDate && birthDate.length === 8) {
      const year = parseInt(birthDate.substring(0, 4));
      const currentYear = new Date().getFullYear();
      const age = currentYear - year; 
      return age > 0 && age < 120 ? age : null;
    }
    return null;
  }, [birthDate]);

  const calculatedChildAge = useMemo(() => {
    const targetBirth = selectedId === 'child' ? childBirthDate : preFamilyBirthDate;
    if (targetBirth && targetBirth.length === 8) {
      const year = parseInt(targetBirth.substring(0, 4));
      const currentYear = new Date().getFullYear();
      const age = currentYear - year;
      return age >= 0 && age < 35 ? age : 5;
    }
    return 5;
  }, [selectedId, childBirthDate, preFamilyBirthDate]);

  const { activeItem, majorId } = useMemo(() => {
    for (const group of ALL_CATEGORIES) {
      const item = group.items.find(i => i.id === selectedId);
      if (item) return { activeItem: item, majorId: group.id };
    }
    return { activeItem: ALL_CATEGORIES[0].items[0], majorId: ALL_CATEGORIES[0].id };
  }, [selectedId]);

  // 유병자 전용 카테고리 선택 시 건강 상태 자동 고정 및 특수 처리
  React.useEffect(() => {
    if (selectedId === 'pre' || selectedId === 'pre_family') {
      setHealthStatus('simple');
    } else if (selectedId === 'silson') {
      // 실손보험인 경우 고지사항(3개월/1년/5년) 중 하나라도 '예'면 유병자로 간주
      if (silson3Month === 'yes' || silson1Year === 'yes' || silson5Year === 'yes') {
        setHealthStatus('simple');
      } else {
        setHealthStatus('standard');
      }
    } else if (selectedId === 'dental' || majorId === 'operating' || majorId === 'future') {
      setHealthStatus('standard');
    }
  }, [selectedId, majorId, silson3Month, silson1Year, silson5Year]);

  // 실손보험 연령별 자동 추천 로직
  React.useEffect(() => {
    if (selectedId === 'silson' && calculatedAge) {
      if (calculatedAge < 50) {
        setSelectedDetail(1); // 5세대 실손 추천
      } else if (calculatedAge >= 60) {
        setSelectedDetail(2); // 노후 실손 추천
      }
    }
  }, [selectedId, calculatedAge]);

  // 재가/시설 보험 선호 돌봄 서비스 선택에 따른 상세 탭 동기화
  React.useEffect(() => {
    if (selectedId === 'nursing') {
      if (nursingPreferredService === 'home') {
        setSelectedDetail(0);
      } else if (nursingPreferredService === 'facility') {
        setSelectedDetail(1);
      } else if (nursingPreferredService === 'both') {
        setSelectedDetail(2);
      }
    }
  }, [nursingPreferredService, selectedId]);

  // 어린이/태아보험 선택 타입에 따른 상세 상태 동기화
  React.useEffect(() => {
    if (selectedId === 'child') {
      if (selectedDetail === 0) {
        setChildAgeGroup('prenatal');
        setChildHasPrenatalRider(true);
      } else {
        setChildAgeGroup('youth');
        setChildMaturity(100);
      }
    }
  }, [selectedDetail, selectedId]);

  // 변액/정기보험 선택 타입에 따른 상세 상태 동기화
  React.useEffect(() => {
    if (selectedId === 'variable') {
      if (selectedDetail === 0) {
        setVariableSubType('variable_saving');
      } else {
        if (variableSubType === 'variable_saving' || variableSubType === 'investment') {
          setVariableSubType('term_pure');
        }
      }
    }
  }, [selectedDetail, selectedId, variableSubType]);


  // 종합건강보험 기본형/종합형 선택 타입에 따른 상세 조건 동기화
  React.useEffect(() => {
    if (selectedId === 'health_general') {
      if (selectedDetail === 0) {
        // 기본형 세팅 (3대 진단비 위주, 특약 없음, 실속 설계)
        setHealthGeneralCancerLimit(30000000);
        setHealthGeneralSimilarCancerLimit(6000000);
        setHealthGeneralBrainLimit(20000000);
        setHealthGeneralHeartLimit(20000000);
        setHealthGeneralCardioLimit(0);
        setHealthGeneralHas1to5Surgery(false);
        setHealthGeneralHasTargetedTherapy(false);
        setHealthGeneralHasThrombolysis(false);
        setHealthGeneralHasLiability(false);
      } else {
        // 종합형 세팅 (진단비 증액 + 수술비/표적항암 등 풀 패키지)
        setHealthGeneralCancerLimit(50000000);
        setHealthGeneralSimilarCancerLimit(10000000);
        setHealthGeneralBrainLimit(30000000);
        setHealthGeneralHeartLimit(30000000);
        setHealthGeneralCardioLimit(10000000);
        setHealthGeneralHas1to5Surgery(true);
        setHealthGeneralHasTargetedTherapy(true);
        setHealthGeneralHasThrombolysis(true);
        setHealthGeneralHasLiability(true);
      }
    }
  }, [selectedDetail, selectedId]);

  // 상해보험 상세 타입(상해장해형/골절치료형) 선택에 따른 상세 조건 동기화
  React.useEffect(() => {
    if (selectedId === 'accident') {
      if (selectedDetail === 0) {
        // 상해장해형: 사망/장해 극대화, 치료비 미비
        setAccidentDeathLimit(150000000);
        setAccidentDisabilityLimit(150000000);
        setAccidentFractureLimit(100000);
        setAccidentCastLimit(0);
        setAccidentSurgeryLimit(100000);
        setAccidentHospitalDailyLimit(0);
        setAccidentHasLeisureRider(false);
      } else {
        // 골절/치료형: 일상 치료비 극대화, 사망 최소화
        setAccidentDeathLimit(10000000);
        setAccidentDisabilityLimit(10000000);
        setAccidentFractureLimit(1000000);
        setAccidentCastLimit(500000);
        setAccidentSurgeryLimit(1500000);
        setAccidentHospitalDailyLimit(30000);
        setAccidentHasLeisureRider(true);
      }
    }
  }, [selectedDetail, selectedId]);

  // 주택화재보험 거주 유형 변경 시 상세 탭 및 한도 일괄 동기화 (루프 방지를 위해 occupancyType과 selectedId만 감시)
  React.useEffect(() => {
    if (selectedId === 'fire_real') {
      if (fireOccupancyType === 'owner') {
        if (selectedDetail !== 0) setSelectedDetail(0);
        if (fireBuildingLimit === 0) setFireBuildingLimit(100000000);
      } else if (fireOccupancyType === 'tenant') {
        if (selectedDetail !== 1) setSelectedDetail(1);
        if (fireBuildingLimit !== 0) setFireBuildingLimit(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fireOccupancyType, selectedId]);

  // 재물종합보험 선택 타입에 따른 상세 조건 동기화
  React.useEffect(() => {
    if (selectedId === 'property') {
      if (selectedDetail === 0) {
        // 상가 화재형: 건물/시설 한도 높게, 기본 배상책임
        setPropertyBuildingLimit(200000000);
        setPropertyInteriorLimit(50000000);
        setPropertyHasPremisesLiability(true);
      } else {
        // 화재배상책임형: 배상한도 극대화, 건물 한도 낮춤
        setPropertyBuildingLimit(100000000);
        setPropertyInteriorLimit(30000000);
        setPropertyHasPremisesLiability(true);
      }
    }
  }, [selectedDetail, selectedId]);

  const handleRequestSms = async (targetMobile: string) => {
    const cleanPhone = targetMobile.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setSmsError("올바른 휴대폰 번호를 입력해 주세요.");
      alert("올바른 휴대폰 번호를 입력해 주세요.");
      return;
    }

    setSmsLoading(true);
    setSmsError(null);
    setSmsCode('');
    setSmsTimer(180);
    
    try {
      const response = await fetch('/api/send-sms-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'send',
          phone: cleanPhone
        })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data?.success) {
        setSmsError(data?.error || "인증번호 발송에 실패했습니다.");
        alert(data?.error || "인증번호 발송에 실패했습니다.");
      } else {
        if (data?.simulated && data?.code) {
          alert(`[테스트 안내]\n알리고 API IP 제한 우회 모드로 동작합니다.\n\n인증번호: [ ${data.code} ]`);
        }
        setShowSmsModal(true);
      }
    } catch (err: any) {
      console.error(err);
      setSmsError("인증 요청 중 연결 오류가 발생했습니다.");
    } finally {
      setSmsLoading(false);
    }
  };

  const handleVerifySmsCode = async () => {
    if (!smsCode.trim() || smsCode.length < 6) {
      setSmsError("6자리 인증번호를 정확히 입력해 주세요.");
      return;
    }
    
    if (smsTimer === 0) {
      setSmsError("인증 시간이 만료되었습니다. 인증번호를 다시 받아주세요.");
      return;
    }
    
    setSmsLoading(true);
    setSmsError(null);
    
    try {
      const response = await fetch('/api/send-sms-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'verify',
          phone: mobile,
          code: smsCode
        })
      });
      
      const data = await response.json();
      
      if (!response.ok || !data?.success) {
        setSmsError(data?.error || "인증번호가 일치하지 않습니다.");
      } else {
        setIsSmsVerified(true);
        setShowSmsModal(false);
        // Automatically run calculation upon successful verification
        setTimeout(() => {
          handleCalculate();
        }, 100);
      }
    } catch (err: any) {
      console.error(err);
      setSmsError("인증 확인 중 연결 오류가 발생했습니다.");
    } finally {
      setSmsLoading(false);
    }
  };

  const handleCalculate = (overrides?: { name?: string; age?: number; gender?: 'M' | 'F'; mobile?: string }) => {
    const finalName = (overrides?.name !== undefined ? overrides.name : name) || '';
    const finalGender = overrides?.gender !== undefined ? overrides.gender : gender;
    const finalMobile = (overrides?.mobile !== undefined ? overrides.mobile : mobile) || '';
    const finalBirth = birthDate || '';

    if (!finalName.trim() || !finalGender || finalBirth.length < 8) {
      const msg = "정확한 보험 비교를 위해 성함, 성별, 생년월일을 모두 입력해 주세요.";
      setValidationError(msg);
      alert(msg);
      return;
    }

    if (!agreedTerms) {
      const msg = "개인정보수집 및 활용동의에 체크해 주세요.";
      setValidationError(msg);
      alert(msg);
      return;
    }

    setValidationError(null);
    const isChildProduct = selectedId === 'child' || selectedId === 'pre_family';
    let finalAge = overrides?.age !== undefined ? overrides.age : (calculatedAge || 40);
    if (isChildProduct) {
      if (selectedId === 'child' && childAgeGroup === 'prenatal') {
        finalAge = 0;
      } else {
        finalAge = calculatedChildAge;
      }
    }

    const isHealthCategory = ['cancer', 'brain', 'heart', 'surgery', 'health_general', 'pre', 'pre_family', 'silson', 'care_svc', 'care_old', 'nursing', 'dental', 'accident'].includes(selectedId);

    if (onCalculate) {
      onCalculate({
        name: finalName,
        age: finalAge,
        gender: finalGender,
        mobile: overrides?.mobile !== undefined ? overrides.mobile : mobile,
        jobClass,
        healthStatus,
        preExistingType: healthStatus === 'simple' ? preExistingType : undefined,
        monthlyPremium: parseInt(currentPremium) || (
          selectedId === 'silson' ? 25000 : 
          selectedId === 'dental' ? 45000 :
          selectedId === 'nursing' ? 70000 :
          selectedId === 'pet' ? 35000 : 
          selectedId === 'fire_real' ? 12000 :
          selectedId === 'property' ? 45000 :
          selectedId === 'pension' ? annuityMonthlyPremium :
          selectedId === 'savings_general' ? savingsMonthlyPremium :
          selectedId === 'credit' ? 35000 :
          selectedId === 'legal' ? 29000 :
          selectedId === 'variable' ? (
            (variableSubType === 'variable_saving' || variableSubType === 'investment') ? variableMonthlyPremium :
            variableSubType === 'term_ceo' ? 450000 :
            (variableIsHealthyDiscount ? 12000 : 16000)
          ) :

          selectedId === 'golf' ? (golfPlanType === 'one_day' ? 2500 : 9900) :
          selectedId === 'child' ? (childMaturity === 30 ? 32000 : 78000) :
          (selectedId === 'pre' || selectedId === 'pre_family' || healthStatus === 'simple') ? 150000 : 
          120000
        ),
        selectedCategory: activeItem.label,
        // Treat selected options as "Current Coverage" being analyzed
        cancer: isHealthCategory ? { 
          currentAmount: selectedId === 'cancer' ? cancerDiagnosisAmount : selectedCancer, 
          targetAmount: 50000000,
          targetedTherapy: cancerTargetedTherapy,
          treatmentCost2025: cancerTreatmentCost2025,
          paymentType: cancerPaymentType,
          recurrentCancer: cancerRecurrentCancer,
          familyHistory: cancerFamilyHistory
        } : undefined,
        cerebrovascular: isHealthCategory ? { 
          currentAmount: selectedBrain, 
          targetAmount: 30000000,
          selectedType: selectedId === 'brain' ? activeItem.subTypes[selectedDetail] : undefined,
          surgeryBenefit: brainSurgeryBenefit,
          paymentType: brainPaymentType,
          coveragePeriod: brainCoveragePeriod
        } : undefined,
        cardiovascular: isHealthCategory && selectedId === 'heart' ? {
          currentAmount: selectedHeart,
          targetAmount: 30000000,
          selectedType: selectedDetail === 0 ? '급성 심근경색' : '통합(급성+허혈성)',
        } : undefined,
        surgery: isHealthCategory ? { currentAmount: selectedSurgery, targetAmount: 1000000 } : undefined,
        postDisability: isHealthCategory ? { currentAmount: selectedDisability, targetAmount: 30000000 } : undefined,
        paymentExemption: isHealthCategory ? selectedExemption : undefined,

        // Dental specific fields
        dental: selectedId === 'dental' ? {
          lastYear: dentalLastYear,
          last5Years: dentalLast5Years,
          dentures: dentalDentures,
          implantLimit: dentalImplantLimit,
          crownAmount: dentalCrownAmount,
          focus: dentalFocus,
          diagnosticType: dentalDiagnosticType
        } : undefined,
        nursing: selectedId === 'nursing' ? {
          preferredService: nursingPreferredService,
          homeAmount: nursingHomeAmount,
          facilityAmount: nursingFacilityAmount,
          hasProxyClaim: nursingHasProxyClaim,
          hasBrainHistory: nursingHasBrainHistory,
          hasLtcHistory: nursingHasLtcHistory
        } : undefined,
        caregiving: selectedId === 'care_svc' ? {
          type: careSvcType,
          isStepUp: careStepUp,
          isNursingHospital: careNursingHospital,
          focusGeriatric: careGeriatric,
          focusIntegrated: careIntegrated
        } : selectedId === 'care_old' ? {
          dementiaDiagnosis: dementiaDiagnosisAmount,
          monthlyAllowance: dementiaMonthlyAllowance,
          preferredService: dementiaServiceType,
          hasProxyClaim: dementiaHasProxyClaim,
          hasDementiaHistory: dementiaHasHistory,
          hasLtcGrade: dementiaHasLtcGrade,
          subType: selectedDetail === 0 ? 'mild' : 'severe'
        } : undefined,
        silson: selectedId === 'silson' ? {
          hasCurrentSilson: silsonHasCurrent,
          threeMonthTreatment: silson3Month,
          oneYearExam: silson1Year,
          fiveYearTreatment: silson5Year,
          subType: activeItem.subTypes[selectedDetail],
          nonReimbursableUsage: silsonNonReimbursable, // 비급여 이용량 추가
          pregnancyCover: silsonPregnancyCover,
          frequentNonSevere: silsonFrequentNonSevere
        } : undefined,
        surgery_hospital: selectedId === 'surgery' ? {
          focus: surgeryFocus,
          hospitalAmount,
          caregiverOption,
          tertiaryHospital
        } : undefined,
        pre_existing_sub_type: (selectedId === 'pre' || selectedId === 'pre_family') ? activeItem.subTypes[selectedDetail] : undefined,
        child: selectedId === 'child' ? {
          targetAgeGroup: childAgeGroup,
          maturity: childMaturity,
          focusArea: childFocusArea,
          hasPrenatalRider: childHasPrenatalRider,
          weeksPregnancy: childWeeksPregnancy,
          childBirthDate: childBirthDate
        } : selectedId === 'pre_family' ? {
          targetAgeGroup: 'child',
          maturity: preFamilyMaturity,
          focusArea: 'majorDisease',
          hasPrenatalRider: false,
          weeksPregnancy: 12,
          isPreFamily: true,
          illnessType: preFamilyIllnessType,
          noAccidentYears: preFamilyNoAccidentYears,
          childBirthDate: preFamilyBirthDate
        } : undefined,
        car: selectedId === 'car' ? {
          annualMileage: carMileage,
          safeDrivingScore: carSafetyScore,
          hasConnectedCar: carConnected,
          hasBlackbox: carBlackbox,
          hasChildRider: carChildRider,
          currentPropertyLimit: carPropertyLimit,
          currentInjuryType: carInjuryType,
          brand: carBrand,
          model: carModel,
          year: carYear,
          driverLimit: carDriverLimit,
          ownDamage: carOwnDamage,
          hasLaneSafety: carLaneSafety,
          hasForwardCollision: carForwardCollision,
          engine: carEngine,
          trim: carTrim,
          subType: selectedDetail === 0 ? 'personal' : 'business',
          noAccidentYears: carNoAccidentYears
        } : undefined,
        driver: selectedId === 'driver' ? {
          drivingPurpose: driverDrivingPurpose,
          jobClass: driverJobClass,
          planType: driverPlanType
        } : undefined,
        pet: selectedId === 'pet' ? {
          petType,
          petName,
          breed: petBreed,
          birthYearMonth: petBirthYearMonth,
          selfPayRatio: petSelfPayRatio,
          deductible: petDeductible,
          isRegistered: petIsRegistered,
          patellaRider: petPatellaRider,
          skinRider: petSkinRider,
          dentalRider: petDentalRider
        } : undefined,
        golf: selectedId === 'golf' ? {
          gameType: golfGameType,
          planType: golfPlanType,
          durationDays: golfDurationDays,
          isGroup: golfIsGroup,
          companionNames: golfCompanionNames,
          hasHoleInOneRider: golfHasHoleInOneRider,
          hasLiabilityRider: golfHasLiabilityRider,
          hasEquipmentRider: golfHasEquipmentRider
        } : undefined,
        fire: selectedId === 'fire_real' ? {
          residenceType: fireResidenceType,
          occupancyType: fireOccupancyType,
          buildingArea: fireBuildingArea,
          structureGrade: fireStructureGrade,
          hasWaterLeakRider: fireHasWaterLeakRider,
          hasLiabilityRider: fireHasLiabilityRider,
          hasTemporaryHousingRider: fireHasTemporaryHousingRider,
          householdGoodsLimit: fireHouseholdGoodsLimit,
          buildingLimit: fireBuildingLimit
        } : undefined,
        annuity: selectedId === 'pension' ? {
          annuityType: annuityType,
          monthlyPremium: annuityMonthlyPremium,
          paymentPeriod: annuityPaymentPeriod,
          commencementAge: annuityCommencementAge,
          annualIncome: annuityAnnualIncome,
          hasIrp: annuityHasIrp,
          receivingPeriod: annuityReceivingPeriod
        } : undefined,
        wholeLife: selectedId === 'whole' ? {
          objective: wholeLifeObjective,
          paymentPeriod: wholeLifePaymentPeriod,
          deathBenefit: wholeLifeDeathBenefit,
          refundType: wholeLifeRefundType,
          isStepUp: wholeLifeIsStepUp
        } : undefined,
        variable: selectedId === 'variable' ? {
          subType: variableSubType,
          monthlyPremium: variableMonthlyPremium,
          paymentPeriod: variablePaymentPeriod,
          investmentStyle: variableInvestmentStyle,
          equityRatio: variableEquityRatio,
          isAnnuityConversion: variableIsAnnuityConversion,
          deathBenefit: variableDeathBenefit,
          coveragePeriod: variableCoveragePeriod,
          isHealthyDiscount: variableIsHealthyDiscount
        } : undefined,
        healthGeneral: selectedId === 'health_general' ? {
          cancerLimit: healthGeneralCancerLimit,
          similarCancerLimit: healthGeneralSimilarCancerLimit,
          brainLimit: healthGeneralBrainLimit,
          heartLimit: healthGeneralHeartLimit,
          cardioLimit: healthGeneralCardioLimit,
          has1to5Surgery: healthGeneralHas1to5Surgery,
          hasTargetedTherapy: healthGeneralHasTargetedTherapy,
          hasThrombolysis: healthGeneralHasThrombolysis,
          hasLiability: healthGeneralHasLiability,
          paymentPeriod: healthGeneralPaymentPeriod,
          coveragePeriod: healthGeneralCoveragePeriod,
          isRenewable: healthGeneralIsRenewable,
          refundType: healthGeneralRefundType
        } : undefined,
        accident: selectedId === 'accident' ? {
          accidentDeathLimit,
          accidentDisabilityLimit,
          fractureLimit: accidentFractureLimit,
          castLimit: accidentCastLimit,
          surgeryLimit: accidentSurgeryLimit,
          hospitalDailyLimit: accidentHospitalDailyLimit,
          jobClass: accidentJobClass,
          drivingType: accidentDrivingType,
          hasLeisureRider: accidentHasLeisureRider,
          subType: activeItem.subTypes[selectedDetail]
        } : undefined,
        property: selectedId === 'property' ? {
          businessType: propertyBusinessType,
          buildingGrade: propertyBuildingGrade,
          buildingLimit: propertyBuildingLimit,
          interiorLimit: propertyInteriorLimit,
          equipmentLimit: propertyEquipmentLimit,
          inventoryLimit: propertyInventoryLimit,
          hasWaterLeak: propertyHasWaterLeak,
          hasPremisesLiability: propertyHasPremisesLiability,
          hasBusinessInterruption: propertyHasBusinessInterruption,
          hasFoodLiability: propertyHasFoodLiability,
          hasMachineryBreakdown: propertyHasMachineryBreakdown,
          subType: activeItem.subTypes[selectedDetail]
        } : undefined,
        savingsGeneral: selectedId === 'savings_general' ? {
          savingType: savingsSavingType,
          monthlyPremium: savingsMonthlyPremium,
          paymentPeriod: savingsPaymentPeriod,
          maintenancePeriod: savingsMaintenancePeriod,
          savingsObjective: savingsObjective,
          hasUniversal: savingsHasUniversal
        } : undefined,
        credit: selectedId === 'credit' ? {
          loanType: creditLoanType,
          loanAmount: creditLoanAmount,
          loanPeriod: creditLoanPeriod,
          creditBureau: creditBureau,
          creditScore: creditScore,
          hasIllnessRider: creditHasIllnessRider,
          hasDisabilityRider: creditHasDisabilityRider,
          subType: activeItem.subTypes[selectedDetail]
        } : undefined,
        legal: selectedId === 'legal' ? {
          litigationType: legalLitigationType,
          lawyerLimit: legalLawyerLimit,
          courtFeeLimit: legalCourtFeeLimit,
          deductibleType: legalDeductibleType,
          suddenAccelerationRider: legalSuddenAccelerationRider,
          consultationRider: legalConsultationRider,
          isElectronicLitigation: legalIsElectronicLitigation,
          subType: activeItem.subTypes[selectedDetail]
        } : undefined
      });
    }
  };

  const handleSocialCalculate = (provider: 'naver' | 'kakao') => {
    setAuthModal(null);
    setSocialLoading(provider);
    setAgreedTerms(true);
    
    const socialName = provider === 'naver' ? '김네이버' : '김카카오';
    const socialBirth = provider === 'naver' ? '19880808' : '19900909';
    const socialMobile = provider === 'naver' ? '01088888888' : '01099999999';
    const socialGender: 'M' | 'F' = provider === 'naver' ? 'M' : 'F';
    const socialAge = provider === 'naver' ? 38 : 36;

    // Set the inputs visually
    setName(socialName);
    setBirthDate(socialBirth);
    setMobile(socialMobile);
    setGender(socialGender);

    setTimeout(() => {
      setSocialLoading(null);
      handleCalculate({
        name: socialName,
        age: socialAge,
        gender: socialGender,
        mobile: socialMobile
      });
    }, 1200);
  };

  return (
    <section id="calculator-section" className="w-full max-w-[1600px] mx-auto py-12 px-4 font-sans">
      {/* 가입 권유 전화 Zero 안심 배너 (카드 디자인 제외) */}
      <div className="max-w-4xl mx-auto w-full text-center mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500/10 text-orange-600 rounded-full text-[11px] md:text-xs font-black uppercase tracking-wider mb-4">
          ✨ 100% 안심 자율 비교 서비스
        </div>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
          "가입 권유 전화 <span className="text-orange-500">Zero</span>" — 100% 완전 비대면 자율 분석
        </h3>
        <p className="text-sm md:text-base lg:text-lg text-slate-600 font-bold leading-relaxed max-w-2xl mx-auto break-keep">
          상담원 전화 유도 없이, 오직 AI 빅데이터 엔진을 통해 고객 스스로 100% 자율 비교 및 진단을 완료할 수 있습니다.<br />
          <span className="text-slate-400 text-xs font-semibold mt-2 block">(전화는 고객이 원할 때만 1:1 신청 가능)</span>
        </p>
      </div>

      {/* 3대 핵심 차별점 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1600px] mx-auto mb-20 px-4">
        {/* 카드 1 */}
        <div className="bg-gradient-to-br from-white via-slate-50/50 to-orange-500/[0.04] border border-slate-200/80 hover:border-orange-500/30 hover:from-white hover:to-orange-500/[0.08] hover:-translate-y-1.5 active:-translate-y-3.5 active:scale-[1.01] hover:shadow-[0_25px_50px_-15px_rgba(255,107,0,0.08)] active:shadow-[0_35px_60px_-10px_rgba(255,107,0,0.15)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),_0_10px_30px_-10px_rgba(0,0,0,0.03)] transition-all duration-300 rounded-[2rem] p-8 flex flex-col gap-4 text-left group cursor-pointer select-none">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-115 group-hover:rotate-[15deg] transition-all duration-300">
            <Shield className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">Differentiator 01</span>
            <h4 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
              국내 전(全) 생명·손해보험사<br />
              <span className="text-orange-500">상품 1초 만에 비교</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed break-keep">
            국내 전 생명·손해보험사에서 판매 중인 수만 개의 보험 상품 데이터를 실시간으로 비교 분석합니다. 복잡하게 얽혀 있는 특약 조건과 보장 금액을 1원 단위까지 꼼꼼히 비교하여, 불필요한 지출은 걷어내고 오직 고객님께 꼭 필요한 알짜배기 담보 정보만 한눈에 확인해 드립니다.
          </p>
        </div>

        {/* 카드 2 */}
        <div className="bg-gradient-to-br from-white via-slate-50/50 to-orange-500/[0.04] border border-slate-200/80 hover:border-orange-500/30 hover:from-white hover:to-orange-500/[0.08] hover:-translate-y-1.5 active:-translate-y-3.5 active:scale-[1.01] hover:shadow-[0_25px_50px_-15px_rgba(255,107,0,0.08)] active:shadow-[0_35px_60px_-10px_rgba(255,107,0,0.15)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),_0_10px_30px_-10px_rgba(0,0,0,0.03)] transition-all duration-300 rounded-[2rem] p-8 flex flex-col gap-4 text-left group cursor-pointer select-none">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-115 group-hover:-translate-y-1.5 transition-all duration-300">
            <Zap className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">Differentiator 02</span>
            <h4 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
              암부터 펫보험까지,<br />
              <span className="text-orange-500">27종 맞춤 보험 실시간 계산</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed break-keep">
            암·뇌·심장 3대 질환부터 치매, 간병, 태아, 펫보험까지 27종의 다양한 보험 카테고리를 지원합니다. 내가 선택한 상품에 맞춰 꼭 필요한 핵심 질문만 알아서 자동으로 나타나는 스마트 입력 방식을 적용하여, 복잡한 서류 준비나 어려운 용어 이해 없이도 단 0.1초 만에 나만의 실시간 보험료 계산 결과를 도출합니다.
          </p>
        </div>

        {/* 카드 3 */}
        <div className="bg-gradient-to-br from-white via-slate-50/50 to-orange-500/[0.04] border border-slate-200/80 hover:border-orange-500/30 hover:from-white hover:to-orange-500/[0.08] hover:-translate-y-1.5 active:-translate-y-3.5 active:scale-[1.01] hover:shadow-[0_25px_50px_-15px_rgba(255,107,0,0.08)] active:shadow-[0_35px_60px_-10px_rgba(255,107,0,0.15)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),_0_10px_30px_-10px_rgba(0,0,0,0.03)] transition-all duration-300 rounded-[2rem] p-8 flex flex-col gap-4 text-left group cursor-pointer select-none">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-115 group-hover:rotate-[360deg] transition-all duration-700">
            <Sparkles className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">Differentiator 03</span>
            <h4 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
              0.1초 AI 내 보험 분석 &<br />
              <span className="text-orange-500">또래 평균 보장 비교</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed break-keep">
            내가 설정한 보험 설계가 안전한지 AI가 즉시 검증합니다. 신뢰할 수 있는 국가 통계 데이터를 바탕으로 동일 조건에서 꼭 필요한 적정 보장 수준을 대조하고, 사용자가 선택한 입력 필드의 내용 중 잘못 설계되었거나 부족한 부분을 꼼꼼하게 짚어주어 빈틈없는 보장 완성을 지원합니다.
          </p>
        </div>
      </div>

      <MobileShowcase />

      <div className="flex flex-col items-center gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.3em] opacity-70 mb-4">
          국내 35개 전 보험사 실시간 통합 비교
        </div>

        {/* Static Full-width Partner Logos (Top/Bottom) */}
        <div className="w-full space-y-6 flex flex-col items-center">
          <img 
            src="/insurance_logos_1.png" 
            alt="Partner Logos 1" 
            className="w-full max-w-6xl h-auto object-contain opacity-90" 
          />
          <img 
            src="/insurance_logos_2.png" 
            alt="Partner Logos 2" 
            className="w-full max-w-6xl h-auto object-contain opacity-90" 
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full bg-white rounded-[4.5rem] shadow-[0_60px_180px_-40px_rgba(20,40,80,0.12)] p-8 md:p-16 flex flex-col overflow-hidden border border-gray-50">
        <div className="flex flex-col gap-20 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">

          <div className="flex flex-col items-center">
               <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black mb-4 uppercase tracking-[0.25em] shadow-xl">
                 <Zap size={14} fill="white" /> Insurance Discovery Engine
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter text-center leading-[1.1]">
                 어떤 보험이 <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">궁금하세요?</span>
               </h2>
          </div>

          <div className="space-y-16">
            {ALL_CATEGORIES.map((major) => (
              <div key={major.id} className="group transition-all">
                <div className="flex items-center gap-4 mb-10 px-2">
                  <div 
                    className="w-12 h-12 rounded-[1.4rem] flex items-center justify-center text-white shadow-xl transition-all duration-700 group-hover:rotate-[360deg]"
                    style={{ backgroundColor: major.accentColor }}
                  >
                    <major.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">{major.label}</h3>
                    <div className="h-1.5 w-10 rounded-full mt-1.5 transition-all group-hover:w-full opacity-20" style={{ backgroundColor: major.accentColor }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-2">
                  {major.items.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleCategorySelect(item.id)}
                        whileHover={{ y: -5, shadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center gap-2 sm:gap-4 p-3.5 sm:p-5 rounded-[1.5rem] sm:rounded-[2.2rem] transition-all duration-500
                          ${isSelected 
                            ? 'bg-white shadow-[0_20px_60px_-15px_rgba(255,107,0,0.3)] border-2 border-[#FF6B00]' 
                            : 'bg-white border-2 border-slate-50 shadow-sm hover:border-slate-200'}
                        `}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-[0.7rem] sm:rounded-[1rem] flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-[#FFF0E5]' : 'bg-slate-50 text-slate-300'}`}>
                          <item.icon className="w-4 h-4 sm:w-6 sm:h-6" color={isSelected ? '#FF6B00' : 'currentColor'} strokeWidth={2} />
                        </div>

                        <div className="flex flex-col items-start text-left overflow-hidden">
                          <span className={`text-[0.85rem] sm:text-[1.05rem] font-black tracking-tight leading-none mb-1 sm:mb-1.5 ${isSelected ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'}`}>
                            {item.label}
                          </span>
                          <p className={`text-[0.5rem] sm:text-[0.6rem] font-black uppercase tracking-widest truncate w-full ${isSelected ? 'text-orange-500 opacity-70' : 'text-slate-200'}`}>
                            {item.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div ref={formSectionRef} className="bg-slate-50/50 rounded-[3.5rem] p-12 text-center border-2 border-dashed border-slate-100 scroll-mt-32">
             <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 tracking-tight">상세타입을 선택해 보세요</h3>
             <div className="flex flex-wrap justify-center gap-4">
                {activeItem?.subTypes?.map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDetail(idx);
                      if (selectedId === 'care_svc') {
                        setCareSvcType(idx === 0 ? 'expense' : 'support');
                      }
                      if (selectedId === 'nursing') {
                        setNursingPreferredService(idx === 0 ? 'home' : idx === 1 ? 'facility' : 'both');
                      }
                      if (selectedId === 'child') {
                        if (idx === 0) {
                          setChildAgeGroup('prenatal');
                          setChildHasPrenatalRider(true);
                        } else {
                          setChildAgeGroup('youth');
                          setChildMaturity(100);
                        }
                      }
                      // Sync specialized states with sub-tabs
                      if (selectedId === 'cancer') {
                        if (idx === 0) setCancerPaymentType('non-renewable');
                        else if (idx === 1) setCancerPaymentType('renewable');
                        else if (idx === 2) {
                          setCancerPaymentType('targeted');
                          setCancerTargetedTherapy(true);
                        }
                      }
                      if (selectedId === 'dental') {
                        setDentalDiagnosticType(idx === 0 ? 'diagnostic' : 'non-diagnostic');
                      }
                      if (selectedId === 'fire_real') {
                        if (idx === 0) {
                          setFireOccupancyType('owner');
                          if (fireBuildingLimit === 0) setFireBuildingLimit(100000000);
                        } else {
                          setFireOccupancyType('tenant');
                          setFireBuildingLimit(0);
                        }
                      }
                      if (selectedId === 'golf') {
                        if (idx === 0) {
                          setGolfHasHoleInOneRider(true);
                          setGolfHasLiabilityRider(true);
                          setGolfHasEquipmentRider(true);
                        } else {
                          setGolfHasHoleInOneRider(false);
                          setGolfHasLiabilityRider(true);
                          setGolfHasEquipmentRider(false);
                        }
                      }
                    }}
                    className={`px-12 py-5 rounded-[2.2rem] text-xl font-black transition-all duration-300 border-2
                      ${selectedDetail === idx 
                        ? 'border-[#FF6B00] text-[#FF6B00] bg-white shadow-[0_20px_50px_-10px_rgba(255,107,0,0.25)] scale-105' 
                        : 'border-transparent text-slate-400 bg-white hover:bg-slate-50 hover:border-slate-200 shadow-sm'}
                    `}
                  >
                    {sub}
                  </button>
                ))}
             </div>
             {selectedId === 'brain' && selectedDetail === 1 && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 justify-center max-w-2xl mx-auto"
               >
                 <AlertCircle className="text-red-500" size={18} />
                 <p className="text-sm font-bold text-red-600">
                   "뇌출혈"은 보장 범위가 매우 좁아 전체 뇌질환의 약 90%를 차지하는 뇌경색을 보장하지 못합니다. 
                   <span className="ml-1 underline font-black text-xs">뇌혈관질환 타입을 권장합니다.</span>
                 </p>
               </motion.div>
             )}
          </div>
        </div>

        <div className="pt-20 border-t-[3px] border-dotted border-slate-100">
           <div className="max-w-5xl mx-auto text-center">
              {/* 고객과의 안심 3대 약속 배너 */}
              <div className="max-w-4xl mx-auto mb-10 bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/50 border-2 border-orange-200/80 rounded-[2.5rem] p-8 text-left shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="text-2xl">🛡️</span>
                  <h4 className="text-base font-black text-slate-800 tracking-tight">고객과의 안심 3대 약속</h4>
                  <span className="px-2.5 py-0.5 bg-orange-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider">Verified Promise</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-3xl border border-orange-100 flex flex-col gap-1.5 shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Promise 1</span>
                    <span className="text-sm font-black text-slate-800 leading-tight">동의 없는 전화 금지</span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-keep">상담 동의가 없는 한, 광고성 무단 전화를 일절 유도하지 않습니다.</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-orange-100 flex flex-col gap-1.5 shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Promise 2</span>
                    <span className="text-sm font-black text-slate-800 leading-tight">개인정보 암호화</span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-keep">자가진단 단계에서는 연락처가 든든하게 마스킹 보호 처리됩니다.</p>
                  </div>
                  <div className="bg-white p-5 rounded-3xl border border-orange-100 flex flex-col gap-1.5 shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Promise 3</span>
                    <span className="text-sm font-black text-slate-800 leading-tight">카톡 1:1 익명 상담</span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-keep">고객이 원할 때만 코드를 활용한 익명 상담으로 매칭됩니다.</p>
                  </div>
                </div>
              </div>

              {/* 고객 안심 보장 배너 */}
              <div className="max-w-xl mx-auto mb-10 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-3xl p-5 flex items-center gap-3.5 text-left shadow-sm animate-in fade-in duration-500">
                <span className="text-xl text-orange-500 flex-shrink-0 animate-pulse">🛡️</span>
                <p className="text-xs sm:text-sm font-black text-slate-800 leading-relaxed break-keep">
                  저희는 고객님의 연락처를 묻지 않습니다. 안심하시고 비교 분석하시고 필요하실 때에만 카카오톡 요청해 주세요.
                </p>
              </div>

              {selectedId === 'car' ? (
                <>
                  {/* 자동차 전용 고객 정보 입력 폼 (인증 버튼 없음) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                     <div className="bg-slate-50/40 rounded-[2.2rem] p-7 flex flex-col gap-1 relative overflow-hidden focus-within:bg-white focus-within:shadow-2xl transition-all border-2 border-transparent focus-within:border-orange-100/50">
                          <label className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1 text-left pl-1">성함</label>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" className="bg-transparent border-none outline-none text-xl font-black text-slate-800 placeholder:text-slate-200" />
                          <div className="absolute top-[8px] right-[8px] bottom-[8px] w-24 bg-slate-100 rounded-[1.8rem] flex p-1 shadow-inner border border-slate-200/50">
                            <button onClick={() => setGender('M')} className={`flex-1 rounded-[1.5rem] font-black text-xs transition-all ${gender === 'M' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400'}`}>남</button>
                            <button onClick={() => setGender('F')} className={`flex-1 rounded-[1.5rem] font-black text-xs transition-all ${gender === 'F' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400'}`}>여</button>
                          </div>
                     </div>

                     <div className="bg-slate-50/40 rounded-[2.2rem] p-7 flex flex-col gap-1 relative focus-within:bg-white focus-within:shadow-2xl transition-all border-2 border-transparent focus-within:border-orange-100/50">
                          <label className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1 text-left pl-1">생년월일</label>
                          <div className="flex justify-between items-center text-left">
                             <input type="text" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} maxLength={8} placeholder="예)19770101" className="bg-transparent border-none outline-none text-xl font-black text-slate-800 placeholder:text-slate-200 w-full" />
                             <div className={`flex-shrink-0 px-4 py-2 rounded-[1rem] font-black text-[0.65rem] transition-all whitespace-nowrap shadow-sm border
                               ${calculatedAge 
                                 ? 'bg-orange-500 text-white border-orange-400 animate-in zoom-in-50' 
                                 : 'bg-white text-slate-200 border-slate-100'}`}>
                               나이 {calculatedAge || '**'}세
                             </div>
                          </div>
                     </div>

                     <div className="bg-slate-50/40 rounded-[2.2rem] p-7 flex flex-col gap-1 relative focus-within:bg-white focus-within:shadow-2xl transition-all border-2 border-transparent focus-within:border-orange-100/50">
                          <label className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1 text-left pl-1">연락처 (Mobile)</label>
                          <div className="flex justify-between items-center text-left">
                             <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="01012345678" className="bg-transparent border-none outline-none text-xl font-black text-slate-800 placeholder:text-slate-200 w-full" />
                             <div className="flex-shrink-0 px-4 py-2 rounded-[1rem] font-black text-[0.65rem] transition-all whitespace-nowrap shadow-sm border bg-[#FFF0E5] text-[#FF6B00] border-orange-200">
                               선택사항
                             </div>
                          </div>
                     </div>
                  </div>

                  {/* 자동차 전용 내차정보 조회하기 큰 버튼 */}
                  <div className="w-full flex justify-center mb-12 animate-in fade-in slide-in-from-top-2 duration-500">
                    <button
                      onClick={() => setTriggerHyphenModal(true)}
                      className="w-full max-w-xl py-5 bg-gradient-to-r from-orange-600 via-pink-600 to-indigo-600 text-white rounded-[2.2rem] font-black text-lg shadow-[0_12px_35px_rgba(239,68,68,0.25)] hover:shadow-[0_18px_45px_rgba(239,68,68,0.45)] hover:scale-[1.01] transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                      내 차량정보 입력으로 실시간 조회하기 (car365 실시간 연동)
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                   <div className="bg-slate-50/40 rounded-[2.2rem] p-7 flex flex-col gap-1 relative overflow-hidden focus-within:bg-white focus-within:shadow-2xl transition-all border-2 border-transparent focus-within:border-orange-100/50">
                        <label className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1 text-left pl-1">성함</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" className="bg-transparent border-none outline-none text-xl font-black text-slate-800 placeholder:text-slate-200" />
                        <div className="absolute top-[8px] right-[8px] bottom-[8px] w-24 bg-slate-100 rounded-[1.8rem] flex p-1 shadow-inner border border-slate-200/50">
                          <button onClick={() => setGender('M')} className={`flex-1 rounded-[1.5rem] font-black text-xs transition-all ${gender === 'M' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400'}`}>남</button>
                          <button onClick={() => setGender('F')} className={`flex-1 rounded-[1.5rem] font-black text-xs transition-all ${gender === 'F' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400'}`}>여</button>
                        </div>
                   </div>

                   <div className="bg-slate-50/40 rounded-[2.2rem] p-7 flex flex-col gap-1 relative focus-within:bg-white focus-within:shadow-2xl transition-all border-2 border-transparent focus-within:border-orange-100/50">
                        <label className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1 text-left pl-1">생년월일</label>
                        <div className="flex justify-between items-center text-left">
                           <input type="text" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} maxLength={8} placeholder="예)19770101" className="bg-transparent border-none outline-none text-xl font-black text-slate-800 placeholder:text-slate-200 w-full" />
                           <div className={`flex-shrink-0 px-4 py-2 rounded-[1rem] font-black text-[0.65rem] transition-all whitespace-nowrap shadow-sm border
                             ${calculatedAge 
                               ? 'bg-orange-500 text-white border-orange-400 animate-in zoom-in-50' 
                               : 'bg-white text-slate-200 border-slate-100'}`}>
                              나이 {calculatedAge || '**'}세
                           </div>
                        </div>
                   </div>

                   <div className="bg-slate-50/40 rounded-[2.2rem] p-7 flex flex-col gap-1 relative focus-within:bg-white focus-within:shadow-2xl transition-all border-2 border-transparent focus-within:border-orange-100/50">
                        <label className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1 text-left pl-1">연락처 (Mobile)</label>
                        <div className="flex justify-between items-center text-left">
                           <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="01012345678" className="bg-transparent border-none outline-none text-xl font-black text-slate-800 placeholder:text-slate-200 w-full" />
                           <div className="flex-shrink-0 px-4 py-2 rounded-[1rem] font-black text-[0.65rem] transition-all whitespace-nowrap shadow-sm border bg-[#FFF0E5] text-[#FF6B00] border-orange-200">
                             선택사항
                           </div>
                        </div>
                   </div>
                </div>
              )}

              {/* Modular Specialized Field Components */}
              {selectedId === 'care_svc' ? (
                <CaregivingFields
                  careType={careSvcType} setCareType={setCareSvcType}
                  isStepUp={careStepUp} setIsStepUp={setCareStepUp}
                  isNursingHospital={careNursingHospital} setNursingHospital={setCareNursingHospital}
                  focusGeriatric={careGeriatric} setFocusGeriatric={setCareGeriatric}
                  focusIntegrated={careIntegrated} setFocusIntegrated={setCareIntegrated}
                />
              ) : selectedId === 'care_old' ? (
                <div className="space-y-12">
                  <CaregivingOldFields
                    diagnosisAmount={dementiaDiagnosisAmount} setDiagnosisAmount={setDementiaDiagnosisAmount}
                    monthlyAllowance={dementiaMonthlyAllowance} setMonthlyAllowance={setDementiaMonthlyAllowance}
                    serviceType={dementiaServiceType} setServiceType={setDementiaServiceType}
                    hasProxyClaim={dementiaHasProxyClaim} setHasProxyClaim={setDementiaHasProxyClaim}
                    hasDementiaHistory={dementiaHasHistory} setHasDementiaHistory={setDementiaHasHistory}
                    hasLtcGrade={dementiaHasLtcGrade} setHasLtcGrade={setDementiaHasLtcGrade}
                    subType={selectedDetail === 0 ? 'mild' : 'severe'}
                  />
                </div>
              ) : selectedId === 'nursing' ? (
                <NursingFields
                  preferredService={nursingPreferredService} setPreferredService={setNursingPreferredService}
                  homeAmount={nursingHomeAmount} setHomeAmount={setNursingHomeAmount}
                  facilityAmount={nursingFacilityAmount} setFacilityAmount={setNursingFacilityAmount}
                  hasProxyClaim={nursingHasProxyClaim} setHasProxyClaim={setNursingHasProxyClaim}
                  hasBrainHistory={nursingHasBrainHistory} setHasBrainHistory={setNursingHasBrainHistory}
                  hasLtcHistory={nursingHasLtcHistory} setHasLtcHistory={setNursingHasLtcHistory}
                />
              ) : selectedId === 'dental' ? (
                <DentalFields
                  lastYear={dentalLastYear} setLastYear={setDentalLastYear}
                  last5Years={dentalLast5Years} setLast5Years={setDentalLast5Years}
                  dentures={dentalDentures} setDentures={setDentalDentures}
                  implantLimit={dentalImplantLimit} setImplantLimit={setDentalImplantLimit}
                  crownAmount={dentalCrownAmount} setCrownAmount={setDentalCrownAmount}
                  focus={dentalFocus} setFocus={setDentalFocus}
                  diagnosticType={dentalDiagnosticType} setDiagnosticType={setDentalDiagnosticType}
                />
              ) : selectedId === 'silson' ? (
                <SilsonFields
                  hasCurrent={silsonHasCurrent} setHasCurrent={setSilsonHasCurrent}
                  threeMonth={silson3Month} setThreeMonth={setSilson3Month}
                  oneYear={silson1Year} setOneYear={setSilson1Year}
                  fiveYear={silson5Year} setFiveYear={setSilson5Year}
                  nonReimbursableUsage={silsonNonReimbursable} setNonReimbursableUsage={setSilsonNonReimbursable}
                  subType={activeItem.subTypes[selectedDetail]}
                  pregnancyCover={silsonPregnancyCover} setPregnancyCover={setSilsonPregnancyCover}
                  frequentNonSevere={silsonFrequentNonSevere} setFrequentNonSevere={setSilsonFrequentNonSevere}
                />
              ) : selectedId === 'surgery' ? (
                <SurgeryHospitalFields
                  surgeryFocus={surgeryFocus} setSurgeryFocus={setSurgeryFocus}
                  hospitalAmount={hospitalAmount} setHospitalAmount={setHospitalAmount}
                  caregiverOption={caregiverOption} setCaregiverOption={setCaregiverOption}
                  tertiaryHospital={tertiaryHospital} setTertiaryHospital={setTertiaryHospital}
                />
              ) : selectedId === 'cancer' ? (
                <CancerFields
                  diagnosisAmount={cancerDiagnosisAmount} setDiagnosisAmount={setCancerDiagnosisAmount}
                  targetedTherapy={cancerTargetedTherapy} setTargetedTherapy={setCancerTargetedTherapy}
                  treatmentCost2025={cancerTreatmentCost2025} setTreatmentCost2025={setCancerTreatmentCost2025}
                  paymentType={cancerPaymentType} setPaymentType={setCancerPaymentType}
                  recurrentCancer={cancerRecurrentCancer} setRecurrentCancer={setCancerRecurrentCancer}
                  familyHistory={cancerFamilyHistory} setFamilyHistory={setCancerFamilyHistory}
                />
              ) : selectedId === 'child' ? (
                <ChildFields
                  targetAgeGroup={childAgeGroup} setTargetAgeGroup={setChildAgeGroup}
                  maturity={childMaturity} setMaturity={setChildMaturity}
                  focusArea={childFocusArea} setFocusArea={setChildFocusArea}
                  hasPrenatalRider={childHasPrenatalRider} setHasPrenatalRider={setChildHasPrenatalRider}
                  weeksPregnancy={childWeeksPregnancy} setWeeksPregnancy={setChildWeeksPregnancy}
                  childBirthDate={childBirthDate}
                  setChildBirthDate={setChildBirthDate}
                />
              ) : selectedId === 'pre_family' ? (
                <PreFamilyFields
                  illnessType={preFamilyIllnessType} setIllnessType={setPreFamilyIllnessType}
                  noAccidentYears={preFamilyNoAccidentYears} setNoAccidentYears={setPreFamilyNoAccidentYears}
                  maturity={preFamilyMaturity} setMaturity={setPreFamilyMaturity}
                  childBirthDate={preFamilyBirthDate}
                  setChildBirthDate={setPreFamilyBirthDate}
                />
              ) : selectedId === 'car' ? (
                <CarFields
                  annualMileage={carMileage} setAnnualMileage={setCarMileage}
                  safeDrivingScore={carSafetyScore} setSafeDrivingScore={setCarSafetyScore}
                  hasConnectedCar={carConnected} setHasConnectedCar={setCarConnected}
                  hasBlackbox={carBlackbox} setHasBlackbox={setCarBlackbox}
                  hasChildRider={carChildRider} setHasChildRider={setCarChildRider}
                  currentPropertyLimit={carPropertyLimit} setCurrentPropertyLimit={setCarPropertyLimit}
                  currentInjuryType={carInjuryType} setCurrentInjuryType={setCarInjuryType}
                  carBrand={carBrand} setCarBrand={setCarBrand}
                  carModel={carModel} setCarModel={setCarModel}
                  carYear={carYear} setCarYear={setCarYear}
                  carDriverLimit={carDriverLimit} setCarDriverLimit={setCarDriverLimit}
                  carOwnDamage={carOwnDamage} setCarOwnDamage={setCarOwnDamage}
                  hasLaneSafety={carLaneSafety} setHasLaneSafety={setCarLaneSafety}
                  hasForwardCollision={carForwardCollision} setHasForwardCollision={setCarForwardCollision}
                  selectedEngine={carEngine} setSelectedEngine={setCarEngine}
                  selectedTrim={carTrim} setSelectedTrim={setCarTrim}
                  noAccidentYears={carNoAccidentYears} setNoAccidentYears={setCarNoAccidentYears}
                  prefilledName={name}
                  prefilledBirth={birthDate}
                  prefilledMobile={mobile}
                  initialUserName={name}
                  initialBirthDate={birthDate}
                  initialMobileNo={mobile}
                  triggerHyphenModal={triggerHyphenModal}
                  setTriggerHyphenModal={setTriggerHyphenModal}
                />
              ) : selectedId === 'driver' ? (
                <DriverFields
                  drivingPurpose={driverDrivingPurpose}
                  setDrivingPurpose={setDriverDrivingPurpose}
                  jobClass={driverJobClass}
                  setJobClass={setDriverJobClass}
                  planType={driverPlanType}
                  setPlanType={setDriverPlanType}
                />
              ) : selectedId === 'pet' ? (
                <PetFields
                  petType={petType}
                  setPetType={setPetType}
                  petName={petName}
                  setPetName={setPetName}
                  breed={petBreed}
                  setBreed={setPetBreed}
                  birthYearMonth={petBirthYearMonth}
                  setBirthYearMonth={setPetBirthYearMonth}
                  selfPayRatio={petSelfPayRatio}
                  setSelfPayRatio={setPetSelfPayRatio}
                  deductible={petDeductible}
                  setDeductible={setPetDeductible}
                  isRegistered={petIsRegistered}
                  setIsRegistered={setPetIsRegistered}
                  patellaRider={petPatellaRider}
                  setPatellaRider={setPetPatellaRider}
                  skinRider={petSkinRider}
                  setSkinRider={setPetSkinRider}
                  dentalRider={petDentalRider}
                  setDentalRider={setPetDentalRider}
                />
              ) : selectedId === 'golf' ? (
                <GolfFields
                  gameType={golfGameType}
                  setGameType={setGolfGameType}
                  planType={golfPlanType}
                  setPlanType={setGolfPlanType}
                  durationDays={golfDurationDays}
                  setDurationDays={setGolfDurationDays}
                  isGroup={golfIsGroup}
                  setIsGroup={setGolfIsGroup}
                  companionNames={golfCompanionNames}
                  setCompanionNames={setGolfCompanionNames}
                  hasHoleInOneRider={golfHasHoleInOneRider}
                  setHasHoleInOneRider={setGolfHasHoleInOneRider}
                  hasLiabilityRider={golfHasLiabilityRider}
                  setHasLiabilityRider={setGolfHasLiabilityRider}
                  hasEquipmentRider={golfHasEquipmentRider}
                  setHasEquipmentRider={setGolfHasEquipmentRider}
                />
              ) : selectedId === 'fire_real' ? (
                <FireFields
                  selectedDetail={selectedDetail}
                  residenceType={fireResidenceType}
                  setResidenceType={setFireResidenceType}
                  occupancyType={fireOccupancyType}
                  setOccupancyType={setFireOccupancyType}
                  buildingArea={fireBuildingArea}
                  setBuildingArea={setFireBuildingArea}
                  structureGrade={fireStructureGrade}
                  setStructureGrade={setFireStructureGrade}
                  hasWaterLeakRider={fireHasWaterLeakRider}
                  setWaterLeakRider={setFireHasWaterLeakRider}
                  hasLiabilityRider={fireHasLiabilityRider}
                  setLiabilityRider={setFireHasLiabilityRider}
                  hasTemporaryHousingRider={fireHasTemporaryHousingRider}
                  setTemporaryHousingRider={setFireHasTemporaryHousingRider}
                  householdGoodsLimit={fireHouseholdGoodsLimit}
                  setHouseholdGoodsLimit={setFireHouseholdGoodsLimit}
                  buildingLimit={fireBuildingLimit}
                  setBuildingLimit={setFireBuildingLimit}
                />
              ) : selectedId === 'property' ? (
                <PropertyFields
                  businessType={propertyBusinessType}
                  setBusinessType={setPropertyBusinessType}
                  buildingGrade={propertyBuildingGrade}
                  setBuildingGrade={setPropertyBuildingGrade}
                  buildingLimit={propertyBuildingLimit}
                  setBuildingLimit={setPropertyBuildingLimit}
                  interiorLimit={propertyInteriorLimit}
                  setInteriorLimit={setPropertyInteriorLimit}
                  equipmentLimit={propertyEquipmentLimit}
                  setEquipmentLimit={setPropertyEquipmentLimit}
                  inventoryLimit={propertyInventoryLimit}
                  setInventoryLimit={setPropertyInventoryLimit}
                  hasWaterLeak={propertyHasWaterLeak}
                  setHasWaterLeak={setPropertyHasWaterLeak}
                  hasPremisesLiability={propertyHasPremisesLiability}
                  setHasPremisesLiability={setPropertyHasPremisesLiability}
                  hasBusinessInterruption={propertyHasBusinessInterruption}
                  setHasBusinessInterruption={setPropertyHasBusinessInterruption}
                  hasFoodLiability={propertyHasFoodLiability}
                  setHasFoodLiability={setPropertyHasFoodLiability}
                  hasMachineryBreakdown={propertyHasMachineryBreakdown}
                  setHasMachineryBreakdown={setPropertyHasMachineryBreakdown}
                />
              ) : selectedId === 'savings_general' ? (
                <SavingsFields
                  savingType={savingsSavingType}
                  setSavingType={setSavingsSavingType}
                  monthlyPremium={savingsMonthlyPremium}
                  setMonthlyPremium={setSavingsMonthlyPremium}
                  paymentPeriod={savingsPaymentPeriod}
                  setPaymentPeriod={setSavingsPaymentPeriod}
                  maintenancePeriod={savingsMaintenancePeriod}
                  setMaintenancePeriod={setSavingsMaintenancePeriod}
                  savingsObjective={savingsObjective}
                  setSavingsObjective={setSavingsObjective}
                  hasUniversal={savingsHasUniversal}
                  setHasUniversal={setSavingsHasUniversal}
                />
              ) : selectedId === 'credit' ? (
                <CreditFields
                  loanType={creditLoanType}
                  setLoanType={setCreditLoanType}
                  loanAmount={creditLoanAmount}
                  setLoanAmount={setCreditLoanAmount}
                  loanPeriod={creditLoanPeriod}
                  setLoanPeriod={setCreditLoanPeriod}
                  creditBureau={creditBureau}
                  setCreditBureau={setCreditBureau}
                  creditScore={creditScore}
                  setCreditScore={setCreditScore}
                  hasIllnessRider={creditHasIllnessRider}
                  setHasIllnessRider={setCreditHasIllnessRider}
                  hasDisabilityRider={creditHasDisabilityRider}
                  setHasDisabilityRider={setCreditHasDisabilityRider}
                />
              ) : selectedId === 'legal' ? (
                <LegalFields
                  litigationType={legalLitigationType}
                  setLitigationType={setLegalLitigationType}
                  lawyerLimit={legalLawyerLimit}
                  setLawyerLimit={setLegalLawyerLimit}
                  courtFeeLimit={legalCourtFeeLimit}
                  setCourtFeeLimit={setLegalCourtFeeLimit}
                  deductibleType={legalDeductibleType}
                  setDeductibleType={setLegalDeductibleType}
                  suddenAccelerationRider={legalSuddenAccelerationRider}
                  setSuddenAccelerationRider={setLegalSuddenAccelerationRider}
                  consultationRider={legalConsultationRider}
                  setConsultationRider={setLegalConsultationRider}
                  isElectronicLitigation={legalIsElectronicLitigation}
                  setIsElectronicLitigation={setLegalIsElectronicLitigation}
                />
              ) : selectedId === 'pension' ? (
                <AnnuityFields
                  annuityType={annuityType}
                  setAnnuityType={setAnnuityType}
                  monthlyPremium={annuityMonthlyPremium}
                  setMonthlyPremium={setAnnuityMonthlyPremium}
                  paymentPeriod={annuityPaymentPeriod}
                  setPaymentPeriod={setAnnuityPaymentPeriod}
                  commencementAge={annuityCommencementAge}
                  setCommencementAge={setAnnuityCommencementAge}
                  annualIncome={annuityAnnualIncome}
                  setAnnualIncome={setAnnuityAnnualIncome}
                  hasIrp={annuityHasIrp}
                  setHasIrp={setAnnuityHasIrp}
                  receivingPeriod={annuityReceivingPeriod}
                  setReceivingPeriod={setAnnuityReceivingPeriod}
                />
              ) : selectedId === 'whole' ? (
                <WholeLifeFields
                  objective={wholeLifeObjective}
                  setObjective={setWholeLifeObjective}
                  paymentPeriod={wholeLifePaymentPeriod}
                  setPaymentPeriod={setWholeLifePaymentPeriod}
                  deathBenefit={wholeLifeDeathBenefit}
                  setDeathBenefit={setWholeLifeDeathBenefit}
                  refundType={wholeLifeRefundType}
                  setRefundType={setWholeLifeRefundType}
                  isStepUp={wholeLifeIsStepUp}
                  setIsStepUp={setWholeLifeIsStepUp}
                />
              ) : selectedId === 'variable' ? (
                <VariableFields
                  isUnlocked={isUnlocked}
                  subType={variableSubType}
                  setSubType={(v) => {
                    setVariableSubType(v);
                    setSelectedDetail(v === 'variable_saving' ? 0 : 1);
                  }}
                  monthlyPremium={variableMonthlyPremium}
                  setMonthlyPremium={setVariableMonthlyPremium}
                  paymentPeriod={variablePaymentPeriod}
                  setPaymentPeriod={setVariablePaymentPeriod}
                  investmentStyle={variableInvestmentStyle}
                  setInvestmentStyle={setVariableInvestmentStyle}
                  equityRatio={variableEquityRatio}
                  setEquityRatio={setVariableEquityRatio}
                  isAnnuityConversion={variableIsAnnuityConversion}
                  setIsAnnuityConversion={setVariableIsAnnuityConversion}
                  deathBenefit={variableDeathBenefit}
                  setDeathBenefit={setVariableDeathBenefit}
                  coveragePeriod={variableCoveragePeriod}
                  setCoveragePeriod={setVariableCoveragePeriod}
                  isHealthyDiscount={variableIsHealthyDiscount}
                  setIsHealthyDiscount={setVariableIsHealthyDiscount}
                />
              ) : selectedId === 'pre' ? (
                <PreExistingFields
                  threeMonth={silson3Month} setThreeMonth={setSilson3Month}
                  noAccidentYears={preExistingType.split('.')[1]}
                  setNoAccidentYears={(v: string) => setPreExistingType(`3.${v}.5` as any)}
                  fiveYearMajor={silson5Year} setFiveYearMajor={setSilson5Year}
                />
              ) : selectedId === 'brain' ? (
                <BrainFields
                  diagnosisAmount={selectedBrain} setDiagnosisAmount={setSelectedBrain}
                  paymentType={brainPaymentType} setPaymentType={setBrainPaymentType}
                  surgeryBenefit={brainSurgeryBenefit} setSurgeryBenefit={setBrainSurgeryBenefit}
                  coveragePeriod={brainCoveragePeriod} setCoveragePeriod={setBrainCoveragePeriod}
                />
              ) : selectedId === 'heart' ? (
                <HeartFields
                  gender={gender === 'M' ? 'male' : 'female'}
                  setGender={(g) => setGender(g === 'male' ? 'M' : 'F')}
                  age={calculatedAge || 40}
                  setAge={() => {}} // Controlled by birthDate
                  healthType={heartHealthType}
                  setHealthType={setHeartHealthType}
                  coverageLevel={heartCoverageLevel}
                  setCoverageLevel={setHeartCoverageLevel}
                  currentAmount={selectedHeart}
                  setCurrentAmount={setSelectedHeart}
                  selectedSurgery={selectedSurgery}
                  setSelectedSurgery={setSelectedSurgery}
                  selectedDisability={selectedDisability}
                  setSelectedDisability={setSelectedDisability}
                  selectedExemption={selectedExemption}
                  setSelectedExemption={setSelectedExemption}
                />
              ) : selectedId === 'health_general' ? (
                <HealthGeneralFields
                  cancerLimit={healthGeneralCancerLimit} setCancerLimit={setHealthGeneralCancerLimit}
                  similarCancerLimit={healthGeneralSimilarCancerLimit} setSimilarCancerLimit={setHealthGeneralSimilarCancerLimit}
                  brainLimit={healthGeneralBrainLimit} setBrainLimit={setHealthGeneralBrainLimit}
                  heartLimit={healthGeneralHeartLimit} setHeartLimit={setHealthGeneralHeartLimit}
                  cardioLimit={healthGeneralCardioLimit} setCardioLimit={setHealthGeneralCardioLimit}
                  has1to5Surgery={healthGeneralHas1to5Surgery} setHas1to5Surgery={setHealthGeneralHas1to5Surgery}
                  hasTargetedTherapy={healthGeneralHasTargetedTherapy} setHasTargetedTherapy={setHealthGeneralHasTargetedTherapy}
                  hasThrombolysis={healthGeneralHasThrombolysis} setHasThrombolysis={setHealthGeneralHasThrombolysis}
                  hasLiability={healthGeneralHasLiability} setHasLiability={setHealthGeneralHasLiability}
                  paymentPeriod={healthGeneralPaymentPeriod} setPaymentPeriod={setHealthGeneralPaymentPeriod}
                  coveragePeriod={healthGeneralCoveragePeriod} setCoveragePeriod={setHealthGeneralCoveragePeriod}
                  isRenewable={healthGeneralIsRenewable} setIsRenewable={setHealthGeneralIsRenewable}
                  refundType={healthGeneralRefundType} setRefundType={setHealthGeneralRefundType}
                />
              ) : selectedId === 'accident' ? (
                <AccidentFields
                  accidentDeathLimit={accidentDeathLimit} setAccidentDeathLimit={setAccidentDeathLimit}
                  accidentDisabilityLimit={accidentDisabilityLimit} setAccidentDisabilityLimit={setAccidentDisabilityLimit}
                  fractureLimit={accidentFractureLimit} setFractureLimit={setAccidentFractureLimit}
                  castLimit={accidentCastLimit} setCastLimit={setAccidentCastLimit}
                  surgeryLimit={accidentSurgeryLimit} setSurgeryLimit={setAccidentSurgeryLimit}
                  hospitalDailyLimit={accidentHospitalDailyLimit} setHospitalDailyLimit={setAccidentHospitalDailyLimit}
                  jobClass={accidentJobClass} setJobClass={setAccidentJobClass}
                  drivingType={accidentDrivingType} setDrivingType={setAccidentDrivingType}
                  hasLeisureRider={accidentHasLeisureRider} setHasLeisureRider={setAccidentHasLeisureRider}
                />
              ) : (majorId === 'disease' || majorId === 'medical' || majorId === 'family') && 
                  selectedId !== 'silson' && selectedId !== 'fire_simple' && selectedId !== 'brain' && selectedId !== 'health_general' && selectedId !== 'accident' && (
                <HealthFields
                  selectedCancer={selectedCancer} setSelectedCancer={setSelectedCancer}
                  selectedBrain={selectedBrain} setSelectedBrain={setSelectedBrain}
                  selectedHeart={selectedHeart} setSelectedHeart={setSelectedHeart}
                  selectedSurgery={selectedSurgery} setSelectedSurgery={setSelectedSurgery}
                  selectedDisability={selectedDisability} setSelectedDisability={setSelectedDisability}
                  selectedExemption={selectedExemption} setSelectedExemption={setSelectedExemption}
                />
              )}

              <div className="flex items-center justify-center gap-4 mb-10">
                 <input 
                   type="checkbox" 
                   id="terms" 
                   checked={agreedTerms}
                   onChange={(e) => setAgreedTerms(e.target.checked)}
                   className="w-5 h-5 rounded-lg accent-orange-500" 
                 />
                 <label htmlFor="terms" className="text-[0.7rem] font-bold text-slate-400 cursor-pointer select-none">
                    개인정보수집 및 활용동의 
                    <span 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowTermsModal(true);
                      }}
                      className="underline ml-1 font-black opacity-60 hover:opacity-100 transition-opacity"
                    >
                      자세히 보기
                    </span>
                 </label>
              </div>

              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-rose-500 text-base font-black text-center mb-6 bg-rose-50 border border-rose-100 py-3.5 px-6 rounded-2xl shadow-sm max-w-2xl mx-auto flex items-center justify-center gap-2"
                >
                  <span>⚠️</span> {validationError}
                </motion.div>
              )}

              <div className="max-w-2xl mx-auto space-y-6">
                <motion.button 
                   onClick={() => handleCalculate()}
                   whileHover={{ scale: 1.02, y: -5 }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full py-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded-[2.5rem] text-white text-3xl font-black shadow-[0_30px_70px_-20px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-4 group animate-in fade-in zoom-in-95 duration-300"
                >
                   무료로 비교 분석하기
                   <ChevronRight size={28} />
                </motion.button>


              </div>
           </div>
        </div>
      </div>
      {/* Audit Type Explanation Modal */}
      <AnimatePresence>
        {showAuditInfo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowAuditInfo(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{scale:0.9, opacity:0, y:20}} 
              animate={{scale:1, opacity:1, y:0}} 
              exit={{scale:0.9, opacity:0, y:20}} 
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                   <HelpCircle size={28} />
                 </div>
                 <div className="text-left">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">유병자 '3.X.5' 정복하기</h3>
                    <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mt-1">Audit Criteria Master Guide</p>
                 </div>
              </div>
              
              <div className="space-y-4 mb-10">
                 <div className="p-5 bg-orange-50 rounded-3xl border border-orange-100">
                   <p className="text-[0.65rem] font-black text-orange-600 mb-1.5 uppercase tracking-wider">What does it mean?</p>
                   <p className="text-[0.75rem] text-slate-700 font-bold leading-relaxed">숫자는 보험사가 묻는 <span className="text-orange-600">'무사고 기간'</span>을 의미하며, <br/>중간의 숫자가 클수록 건강한 것으로 간주되어 보험료가 저렴해집니다.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-3">
                   <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl font-black text-slate-800 shadow-sm">3</div>
                      <div className="flex-1 text-left">
                         <p className="text-[0.85rem] font-black text-slate-800 mb-1">3개월 내 의사 소견</p>
                         <p className="text-[0.65rem] text-slate-400 font-bold">최근 입원/수술/추가검사 소견 여부</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-5 p-5 rounded-3xl bg-white border-2 border-orange-200 shadow-xl shadow-orange-100/50">
                      <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg">X</div>
                      <div className="flex-1 text-left">
                         <p className="text-[0.85rem] font-black text-orange-600 mb-1">X년 내 입원/수술 여부 (0~5년)</p>
                         <p className="text-[0.65rem] text-slate-500 font-bold leading-tight">선택하신 중간의 숫자가 유병자 보험료의 핵심!<br/>숫자가 클수록 보험료가 매우 저렴해집니다.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl font-black text-slate-800 shadow-sm">5</div>
                      <div className="flex-1 text-left">
                         <p className="text-[0.85rem] font-black text-slate-800 mb-1">5년 내 6대 질병 여부</p>
                         <p className="text-[0.65rem] text-slate-400 font-bold">암, 뇌졸중, 심근경색 등 중대 병력 체크</p>
                      </div>
                   </div>
                 </div>
              </div>

              <button 
                onClick={()=>setShowAuditInfo(false)} 
                className="w-full py-6 bg-slate-900 text-white rounded-[1.8rem] font-black text-base hover:bg-black transition-all shadow-2xl active:scale-95"
              >
                가입 기준을 확인했습니다
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Social Auth Consent Popup Modal */}
      <AnimatePresence>
        {authModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setAuthModal(null)} 
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
            />

            {/* Modal Dialog */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 15 }} 
              className="relative w-full max-w-[420px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 text-slate-800 flex flex-col font-sans"
            >
              {/* Fake Window Header bar */}
              <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-bold">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${authModal === 'naver' ? 'bg-[#03C75A]' : 'bg-[#FEE500]'}`} />
                  {authModal === 'naver' ? '네이버 로그인 연동' : '카카오 로그인 연동'}
                </span>
                <button 
                  onClick={() => setAuthModal(null)}
                  className="w-5 h-5 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {authModal === 'kakao' ? (
                // --- KAKAO CONSENT VIEW ---
                <div className="p-8 flex flex-col">
                  {/* Brand Logo */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FEE500] flex items-center justify-center text-black shadow-md">
                      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                        <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.553 1.706 4.8 4.315 6.065l-1.096 4.025c-.078.286.088.58.37.66.082.023.167.03.25.022.186-.017.35-.11.44-.275l2.67-4.437c.338.03.682.046 1.05.046 4.97 0 9-3.186 9-7.116C21 6.185 16.97 3 12 3z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-black text-slate-900 leading-tight">카카오 간편 로그인</h4>
                      <p className="text-xs font-bold text-slate-400">보험리밸런스 연동</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left mb-6 space-y-1">
                    <p className="text-xs font-bold text-slate-500">연동 요청 앱</p>
                    <p className="text-sm font-black text-slate-800">보험리밸런스 (InsurRebalance)</p>
                    <div className="h-px bg-slate-200/60 my-2" />
                    <p className="text-xs font-bold text-slate-500">로그인 계정</p>
                    <p className="text-sm font-black text-slate-800">rich_kim@kakao.com</p>
                  </div>

                  {/* Consents List */}
                  <div className="space-y-4 mb-8 text-left">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">제공 항목 및 동의사항</p>
                    
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 cursor-pointer">
                        <input type="checkbox" checked readOnly className="w-4 h-4 mt-0.5 accent-yellow-600 rounded" />
                        <span className="text-xs text-slate-700 leading-relaxed font-bold">
                          <span className="text-amber-600 font-extrabold mr-1">[필수]</span>
                          사용자 프로필 정보 (이름, 닉네임, 프로필 사진)
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 cursor-pointer">
                        <input type="checkbox" checked readOnly className="w-4 h-4 mt-0.5 accent-yellow-600 rounded" />
                        <span className="text-xs text-slate-700 leading-relaxed font-bold">
                          <span className="text-amber-600 font-extrabold mr-1">[필수]</span>
                          개인 식별 정보 (생년월일, 성별, 휴대전화번호)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2.5">
                    <button 
                      onClick={() => handleSocialCalculate('kakao')}
                      className="w-full py-4.5 bg-[#FEE500] hover:bg-[#FAD600] text-black font-black rounded-2xl shadow-lg shadow-yellow-100/50 transition-all text-sm active:scale-[0.98]"
                    >
                      동의하고 계속하기
                    </button>
                    <button 
                      onClick={() => setAuthModal(null)}
                      className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all text-xs active:scale-[0.98]"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                // --- NAVER CONSENT VIEW ---
                <div className="p-8 flex flex-col">
                  {/* Brand Logo */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#03C75A] flex items-center justify-center text-white shadow-md font-black text-xl">
                      N
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-black text-slate-900 leading-tight">네이버 아이디 로그인</h4>
                      <p className="text-xs font-bold text-slate-400">보험리밸런스 연동</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left mb-6 space-y-1">
                    <p className="text-xs font-bold text-slate-500">연동 요청 앱</p>
                    <p className="text-sm font-black text-slate-800">보험리밸런스 (InsurRebalance)</p>
                    <div className="h-px bg-slate-200/60 my-2" />
                    <p className="text-xs font-bold text-slate-500">로그인 계정</p>
                    <p className="text-sm font-black text-slate-800">naver_user@naver.com</p>
                  </div>

                  {/* Consents List */}
                  <div className="space-y-4 mb-8 text-left">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-wider">제공 항목 및 동의사항</p>
                    
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 cursor-pointer">
                        <input type="checkbox" checked readOnly className="w-4 h-4 mt-0.5 accent-emerald-600 rounded" />
                        <span className="text-xs text-slate-700 leading-relaxed font-bold">
                          <span className="text-emerald-600 font-extrabold mr-1">[필수]</span>
                          사용자 정보 제공 동의 (이름, 이메일 주소)
                        </span>
                      </label>

                      <label className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 cursor-pointer">
                        <input type="checkbox" checked readOnly className="w-4 h-4 mt-0.5 accent-emerald-600 rounded" />
                        <span className="text-xs text-slate-700 leading-relaxed font-bold">
                          <span className="text-emerald-600 font-extrabold mr-1">[필수]</span>
                          상세 개인 정보 제공 동의 (생년월일, 성별, 휴대전화번호)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2.5">
                    <button 
                      onClick={() => handleSocialCalculate('naver')}
                      className="w-full py-4.5 bg-[#03C75A] hover:bg-[#02b34f] text-white font-black rounded-2xl shadow-lg shadow-emerald-100/50 transition-all text-sm active:scale-[0.98]"
                    >
                      동의하고 계속하기
                    </button>
                    <button 
                      onClick={() => setAuthModal(null)}
                      className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all text-xs active:scale-[0.98]"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Social Loading Overlay */}
      <AnimatePresence>
        {socialLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 text-center flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl animate-pulse
                  ${socialLoading === 'naver' ? 'bg-[#03C75A]' : 'bg-[#FEE500] text-black'}
                `}>
                  {socialLoading === 'naver' ? 'N' : (
                    <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
                      <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.553 1.706 4.8 4.315 6.065l-1.096 4.025c-.078.286.088.58.37.66.082.023.167.03.25.022.186-.017.35-.11.44-.275l2.67-4.437c.338.03.682.046 1.05.046 4.97 0 9-3.186 9-7.116C21 6.185 16.97 3 12 3z"/>
                    </svg>
                  )}
                </div>
                <div className="absolute -inset-2 rounded-full border-4 border-dashed border-orange-500 animate-spin duration-[4000ms] opacity-50" />
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                  0.1초 만에 {socialLoading === 'naver' ? '네이버' : '카카오'} 연동 완료!
                </h4>
                <p className="text-sm font-bold text-slate-500 leading-relaxed">
                  대한민국 35개 전 보험사의 방대한 DB를<br/>
                  <span className="text-orange-500 font-extrabold">웅장하게 전수 조사</span>하는 중입니다...
                </p>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTermsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] relative text-left"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h3 className="text-lg font-black text-slate-950">
                  개인정보 수집 및 이용 동의 (표준약관)
                </h3>
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto my-6 space-y-4 pr-1 text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium">
                <div>
                  <h4 className="font-extrabold text-slate-950 mb-1">1. 개인정보 수집 및 이용 목적</h4>
                  <p>
                    보험리밸런스는 고객님께 실시간 보험 비교 분석 서비스 및 맞춤형 리밸런싱 포트폴리오를 제공하고, 관련 1:1 상담(전화, 문자, 카카오톡 상담 포함)을 진행하기 위해 개인정보를 수집 및 이용합니다.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-950 mb-1">2. 수집하는 개인정보 항목</h4>
                  <p>
                    - 필수항목: 성명, 생년월일, 성별, 휴대전화번호, 직업급수<br />
                    - 선택항목: 기존 보유 보험 내역 및 납입 보험료 정보
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-950 mb-1">3. 개인정보의 보유 및 이용 기간</h4>
                  <p>
                    수집된 개인정보는 **이용 목적 달성 후 즉시 파기**하는 것을 원칙으로 합니다. 단, 고객 동의 하에 상담 관리를 위해 최대 **1년간 보관** 후 안전한 방법으로 영구 파기합니다.
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-950 mb-1">4. 동의를 거부할 권리 및 불이익</h4>
                  <p>
                    고객님은 본 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다. 단, 필수 정보 수집에 동의하지 않으시는 경우 0.1초 실시간 보험 비교 분석 및 맞춤 포트폴리오 분석 결과 제공 서비스의 이용이 제한될 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => {
                    setAgreedTerms(false);
                    setShowTermsModal(false);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all text-center"
                >
                  동의 안함
                </button>
                <button
                  onClick={() => {
                    setAgreedTerms(true);
                    setShowTermsModal(false);
                  }}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-orange-500/10 text-center"
                >
                  동의하고 확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSmsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col relative text-center gap-6"
            >
              <button 
                onClick={() => setShowSmsModal(false)}
                className="absolute top-6 right-6 p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-950">
                  휴대폰 번호 인증
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {mobile.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3')} 번호로 인증문자가 발송되었습니다.<br/>
                  수신된 6자리 인증번호를 3분 내에 입력해 주세요.
                </p>
              </div>

              <div className="relative w-full max-w-xs mx-auto">
                <input 
                  type="text" 
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  placeholder="인증번호 6자리"
                  className="w-full text-center py-4 text-2xl font-black tracking-[0.5em] bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:border-orange-300 focus:bg-white transition-all text-slate-800 placeholder:text-slate-300 placeholder:tracking-normal"
                />
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg">
                  {Math.floor(smsTimer / 60)}:{String(smsTimer % 60).padStart(2, '0')}
                </div>
              </div>

              {smsError && (
                <div className="text-rose-500 text-xs font-bold bg-rose-50/60 border border-rose-100 py-2.5 px-4 rounded-xl">
                  ⚠️ {smsError}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleRequestSms(mobile)}
                  disabled={smsLoading}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-sm font-extrabold rounded-xl transition-all text-center"
                >
                  재발송
                </button>
                <button
                  onClick={handleVerifySmsCode}
                  disabled={smsLoading}
                  className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-black rounded-xl transition-all shadow-md shadow-orange-500/10 text-center flex items-center justify-center gap-2"
                >
                  {smsLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "인증 완료"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
