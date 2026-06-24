/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ChevronRight, 
  Shield, 
  Sparkles,
  Smile,
  Stethoscope,
  Activity,
  Brain,
  Heart,
  Hotel,
  HeartHandshake,
  Baby,
  Car,
  Navigation,
  Dog,
  Target,
  Home,
  Wallet,
  PiggyBank,
  Clock,
  TrendingUp,
  Scale,
  Plus,
  Minus
} from 'lucide-react';
import { InsuranceAnalysis } from '../types/insurance';
import { HyphenAuthModal } from './insurance/remodeling/HyphenAuthModal';
import { StandardizedCoverage } from '../types/remodeling';
import AnalysisShowcase from './AnalysisShowcase';
import { generateCustomMockData } from '../utils/mockGenerator';
import { MOCK_REMODELING_DATA } from '../lib/insurance/remodeling/hyphenRemodelingService';

// Import all 27 insurance field components
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

interface AnalysisSectionProps {
  onAnalyze: (analysis: InsuranceAnalysis) => void;
}

// 26개 보험 카테고리 그룹 정의 (아이콘 및 타이틀 이모지 추가)
const categoryGroups = [
  {
    title: "인기 보험 전수 조사",
    emoji: "✨",
    items: [
      { id: "silson", name: "의료실비", desc: "필수적인 의료비 보장 (자기부담금 제외)" },
      { id: "dental", name: "치아보험", desc: "임플란트/크라운" },
      { id: "pre_existing", name: "유병자", desc: "아픈 분도 가입" },
      { id: "surgery_hospital", name: "수술/입원", desc: "수술비 반복 지급" },
      { id: "cancer", name: "암보험", desc: "진단비 최대 1억" },
      { id: "health_general", name: "종합건강", desc: "하나의 보험으로 빈틈없이 조립" },
    ]
  },
  {
    title: "기타 보장 자산",
    emoji: "💎",
    items: [
      { id: "brain", name: "뇌혈관", desc: "뇌질환 무제한 보장" },
      { id: "heart", name: "심장질환", desc: "허혈성 심장 집중" },
      { id: "accident", name: "상해보험", desc: "사고 장해 및 골절 치료 자산" },
    ]
  },
  {
    title: "간병 / 노후 케어",
    emoji: "👵",
    items: [
      { id: "caregiving", name: "간병 보험", desc: "간병인 지원 및 사용일당 집중" },
      { id: "dementia", name: "치매 간병보험", desc: "치매 진단비 및 생활자금" },
      { id: "nursing", name: "재가/시설", desc: "국가 공인 방문 요양" },
    ]
  },
  {
    title: "태아 / 어린이 / 청소년",
    emoji: "👶",
    items: [
      { id: "child", name: "어린이/신생아", desc: "태아부터 성인까지" },
      { id: "child_sick", name: "유병력자 전용", desc: "간편 고지 가입" },
    ]
  },
  {
    title: "생활 / 운행 / 레저",
    emoji: "🚗",
    items: [
      { id: "car", name: "자동차 보험", desc: "전사 가격 자동 비교" },
      { id: "driver", name: "운전자 보험", desc: "벌금 및 민사 보장" },
      { id: "pet", name: "펫 보험", desc: "우리 아이 병원비" },
      { id: "golf", name: "골프 / 레저", desc: "취미 생활 보호" },
      { id: "fire", name: "주택화재", desc: "재산 피해 보호" },
      { id: "property", name: "재물종합", desc: "상가 화재 및 소상공인 자산 보호" },
    ]
  },
  {
    title: "저축 / 미래 / 법률",
    emoji: "💰",
    items: [
      { id: "annuity", name: "연금저축", desc: "노후 자금 준비" },
      { id: "whole_life", name: "종신", desc: "가격대비 최다보장" },
      { id: "variable", name: "변액, 정기", desc: "수익형 자산 관리" },
      { id: "legal", name: "민사/형사", desc: "법률 비용 보전" },
      { id: "savings", name: "일반 저축", desc: "비과세 목돈 마련 재테크" },
      { id: "credit", name: "신용보험", desc: "대출금 상환 안심 보장" },
    ]
  }
];

// 카테고리별 매핑 아이콘 정의 (내보험 비교 분석과 100% 동일하게 매치)
const categoryIcons: Record<string, React.ElementType> = {
  silson: Shield,
  dental: Smile,
  pre_existing: Stethoscope,
  surgery_hospital: Activity,
  cancer: Shield,
  health_general: Shield,
  brain: Brain,
  heart: Heart,
  accident: Activity,
  caregiving: Hotel,
  dementia: Brain,
  nursing: HeartHandshake,
  child: Baby,
  child_sick: Stethoscope,
  car: Car,
  driver: Navigation,
  pet: Dog,
  golf: Target,
  fire: Home,
  property: Home,
  annuity: PiggyBank,
  whole_life: Clock,
  variable: TrendingUp,
  legal: Scale,
  savings: PiggyBank,
  credit: Scale
};

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ onAnalyze }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');

  // Form states (PII-free)
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birth, setBirth] = useState('');
  const [age, setAge] = useState('');

  // Default placeholders for compliance
  const userName = '고객';
  const mobileNo = '010-0000-0000';

  // Multi-select category states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryPremiums, setCategoryPremiums] = useState<Record<string, number>>({});
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [savedCategories, setSavedCategories] = useState<string[]>([]);

  // Detailed Coverage States (Shared)
  const [selectedCancer, setSelectedCancer] = useState(30000000);
  const [selectedBrain, setSelectedBrain] = useState(10000000);
  const [selectedHeart, setSelectedHeart] = useState(10000000);
  const [selectedSurgery, setSelectedSurgery] = useState(300000);
  const [selectedDisability, setSelectedDisability] = useState(10000000);
  const [selectedExemption, setSelectedExemption] = useState<'standard' | 'premium'>('standard');

  // 1. Dental
  const [dentalLastYear, setDentalLastYear] = useState<'yes' | 'no'>('no');
  const [dentalLast5Years, setDentalLast5Years] = useState<'yes' | 'no'>('no');
  const [dentalDentures, setDentalDentures] = useState<'yes' | 'no'>('no');
  const [dentalImplantLimit, setDentalImplantLimit] = useState<'3' | 'unlimited'>('3');
  const [dentalCrownAmount, setDentalCrownAmount] = useState(200000);
  const [dentalFocus, setDentalFocus] = useState<'conservative' | 'prosthetic'>('conservative');
  const [dentalDiagnosticType, setDentalDiagnosticType] = useState<'diagnostic' | 'non-diagnostic'>('non-diagnostic');

  // 2. Silson
  const [silsonHasCurrent, setSilsonHasCurrent] = useState<'yes' | 'no'>('no');
  const [silson3Month, setSilson3Month] = useState<'yes' | 'no'>('no');
  const [silson1Year, setSilson1Year] = useState<'yes' | 'no'>('no');
  const [silson5Year, setSilson5Year] = useState<'yes' | 'no'>('no');
  const [silsonNonReimbursable, setSilsonNonReimbursable] = useState('under100');
  const [silsonPregnancyCover, setSilsonPregnancyCover] = useState<'yes' | 'no'>('no');
  const [silsonFrequentNonSevere, setSilsonFrequentNonSevere] = useState<'yes' | 'no'>('no');

  // 3. Surgery & Hospitalization
  const [surgeryFocus, setSurgeryFocus] = useState<'wide' | 'named' | 'major'>('wide');
  const [hospitalAmount, setHospitalAmount] = useState(30000);
  const [caregiverOption, setCaregiverOption] = useState<'none' | 'use' | 'support'>('none');
  const [tertiaryHospital, setTertiaryHospital] = useState(false);

  // 4. Cancer
  const [cancerDiagnosisAmount, setCancerDiagnosisAmount] = useState(50000000);
  const [cancerTargetedTherapy, setCancerTargetedTherapy] = useState(true);
  const [cancerTreatmentCost2025, setCancerTreatmentCost2025] = useState(true);
  const [cancerPaymentType, setCancerPaymentType] = useState<'non-renewable' | 'renewable' | 'targeted'>('non-renewable');
  const [cancerRecurrentCancer, setCancerRecurrentCancer] = useState(false);
  const [cancerFamilyHistory, setCancerFamilyHistory] = useState(false);

  // 5. Child / Prenatal
  const [childAgeGroup, setChildAgeGroup] = useState<'prenatal' | 'child' | 'youth'>('child');
  const [childMaturity, setChildMaturity] = useState<30 | 100>(30);
  const [childFocusArea, setChildFocusArea] = useState<'majorDisease' | 'hospitalization'>('majorDisease');
  const [childHasPrenatalRider, setChildHasPrenatalRider] = useState(false);
  const [childWeeksPregnancy, setChildWeeksPregnancy] = useState(12);
  const [childBirthDate, setChildBirthDate] = useState('');

  // 6. Pre-Family (child_sick)
  const [preFamilyIllnessType, setPreFamilyIllnessType] = useState<string>('development');
  const [preFamilyNoAccidentYears, setPreFamilyNoAccidentYears] = useState<'0' | '2' | '3' | '5'>('5');
  const [preFamilyMaturity, setPreFamilyMaturity] = useState<30 | 100>(30);
  const [preFamilyBirthDate, setPreFamilyBirthDate] = useState('');

  // 7. Car
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
  const [triggerHyphenModal, setTriggerHyphenModal] = useState(false);

  // 8. Driver
  const [driverDrivingPurpose, setDriverDrivingPurpose] = useState<'private' | 'commercial'>('private');
  const [driverJobClass, setDriverJobClass] = useState<1 | 2 | 3>(1);
  const [driverPlanType, setDriverPlanType] = useState<'saving' | 'standard' | 'premium'>('standard');

  // 9. Pet
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

  // 10. Golf
  const [golfGameType, setGolfGameType] = useState<'amateur' | 'professional'>('amateur');
  const [golfPlanType, setGolfPlanType] = useState<'one_day' | 'annual'>('annual');
  const [golfDurationDays, setGolfDurationDays] = useState(365);
  const [golfIsGroup, setGolfIsGroup] = useState(false);
  const [golfCompanionNames, setGolfCompanionNames] = useState<string[]>([]);
  const [golfHasHoleInOneRider, setGolfHasHoleInOneRider] = useState(true);
  const [golfHasLiabilityRider, setGolfHasLiabilityRider] = useState(true);
  const [golfHasEquipmentRider, setGolfHasEquipmentRider] = useState(true);

  // 11. Caregiving
  const [careSvcType, setCareSvcType] = useState<'support' | 'expense'>('expense');
  const [careStepUp, setCareStepUp] = useState(true);
  const [careNursingHospital, setCareNursingHospital] = useState(false);
  const [careGeriatric, setCareGeriatric] = useState(false);
  const [careIntegrated, setCareIntegrated] = useState(false);

  // 12. Dementia (CaregivingOld)
  const [dementiaDiagnosisAmount, setDementiaDiagnosisAmount] = useState(30000000);
  const [dementiaMonthlyAllowance, setDementiaMonthlyAllowance] = useState(500000);
  const [dementiaServiceType, setDementiaServiceType] = useState<'home' | 'facility' | 'both'>('home');
  const [dementiaHasProxyClaim, setDementiaHasProxyClaim] = useState(true);
  const [dementiaHasHistory, setDementiaHasHistory] = useState<boolean | null>(null);
  const [dementiaHasLtcGrade, setDementiaHasLtcGrade] = useState<boolean | null>(null);

  // 13. Nursing (At-home/facility)
  const [nursingPreferredService, setNursingPreferredService] = useState<'home' | 'facility' | 'both'>('both');
  const [nursingHomeAmount, setNursingHomeAmount] = useState(500000);
  const [nursingFacilityAmount, setNursingFacilityAmount] = useState(500000);
  const [nursingHasProxyClaim, setNursingHasProxyClaim] = useState(true);
  const [nursingHasBrainHistory, setNursingHasBrainHistory] = useState(false);
  const [nursingHasLtcHistory, setNursingHasLtcHistory] = useState(false);

  // 14. Brain
  const [brainPaymentType, setBrainPaymentType] = useState<'non-renewable' | 'renewable'>('non-renewable');
  const [brainScreeningType, setBrainScreeningType] = useState<'standard' | '3.5.5' | '3.10.5'>('standard');
  const [brainSurgeryBenefit, setBrainSurgeryBenefit] = useState(false);
  const [brainCoveragePeriod, setBrainCoveragePeriod] = useState(80);

  // 15. Heart
  const [heartHealthType, setHeartHealthType] = useState<'normal' | 'simple'>('normal');
  const [heartCoverageLevel, setHeartCoverageLevel] = useState<'basic' | 'standard' | 'premium'>('standard');

  // 16. Pre-Existing (유병자)
  const [preExistingType, setPreExistingType] = useState<'3.0.5' | '3.2.5' | '3.3.5' | '3.5.5'>('3.2.5');

  // 17. Health General (종합건강)
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

  // 18. Accident (상해)
  const [accidentDeathLimit, setAccidentDeathLimit] = useState<number>(50000000);
  const [accidentDisabilityLimit, setAccidentDisabilityLimit] = useState<number>(50000000);
  const [accidentFractureLimit, setAccidentFractureLimit] = useState<number>(300000);
  const [accidentCastLimit, setAccidentCastLimit] = useState<number>(100000);
  const [accidentSurgeryLimit, setAccidentSurgeryLimit] = useState<number>(500000);
  const [accidentHospitalDailyLimit, setAccidentHospitalDailyLimit] = useState<number>(20000);
  const [accidentJobClass, setAccidentJobClass] = useState<1 | 2 | 3>(1);
  const [accidentDrivingType, setAccidentDrivingType] = useState<'none' | 'private' | 'commercial'>('private');
  const [accidentHasLeisureRider, setAccidentHasLeisureRider] = useState<boolean>(false);

  // 19. Fire (주택화재)
  const [fireResidenceType, setFireResidenceType] = useState<'apartment' | 'villa' | 'house'>('apartment');
  const [fireOccupancyType, setFireOccupancyType] = useState<'owner' | 'tenant'>('owner');
  const [fireBuildingArea, setFireBuildingArea] = useState<number>(84);
  const [fireStructureGrade, setFireStructureGrade] = useState<1 | 2 | 3>(1);
  const [fireHasWaterLeakRider, setFireHasWaterLeakRider] = useState<boolean>(true);
  const [fireHasLiabilityRider, setFireHasLiabilityRider] = useState<boolean>(true);
  const [fireHasTemporaryHousingRider, setFireHasTemporaryHousingRider] = useState<boolean>(true);
  const [fireHouseholdGoodsLimit, setFireHouseholdGoodsLimit] = useState<number>(30000000);
  const [fireBuildingLimit, setFireBuildingLimit] = useState<number>(100000000);

  // 20. Property (재물종합)
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

  // 21. Annuity (연금저축)
  const [annuityType, setAnnuityType] = useState<'savings' | 'insurance'>('savings');
  const [annuityMonthlyPremium, setAnnuityMonthlyPremium] = useState<number>(300000);
  const [annuityPaymentPeriod, setAnnuityPaymentPeriod] = useState<number>(10);
  const [annuityCommencementAge, setAnnuityCommencementAge] = useState<number>(60);
  const [annuityAnnualIncome, setAnnuityAnnualIncome] = useState<number>(50000000);
  const [annuityHasIrp, setAnnuityHasIrp] = useState<boolean>(false);
  const [annuityReceivingPeriod, setAnnuityReceivingPeriod] = useState<number>(20);

  // 22. Whole Life (종신)
  const [wholeLifeObjective, setWholeLifeObjective] = useState<'family' | 'inheritance' | 'savings'>('family');
  const [wholeLifePaymentPeriod, setWholeLifePaymentPeriod] = useState<number>(10);
  const [wholeLifeDeathBenefit, setWholeLifeDeathBenefit] = useState<number>(100000000);
  const [wholeLifeRefundType, setWholeLifeRefundType] = useState<'standard' | 'low'>('low');
  const [wholeLifeIsStepUp, setWholeLifeIsStepUp] = useState<boolean>(false);

  // 23. Variable (변액, 정기)
  const [variableSubType, setVariableSubType] = useState<'term_pure' | 'term_ceo' | 'variable_term' | 'variable_saving' | 'investment' | 'term'>('variable_saving');
  const [variableMonthlyPremium, setVariableMonthlyPremium] = useState<number>(150000);
  const [variablePaymentPeriod, setVariablePaymentPeriod] = useState<number>(10);
  const [variableInvestmentStyle, setVariableInvestmentStyle] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [variableEquityRatio, setVariableEquityRatio] = useState<number>(50);
  const [variableIsAnnuityConversion, setVariableIsAnnuityConversion] = useState<boolean>(false);
  const [variableDeathBenefit, setVariableDeathBenefit] = useState<number>(100000000);
  const [variableCoveragePeriod, setVariableCoveragePeriod] = useState<number>(70);
  const [variableIsHealthyDiscount, setVariableIsHealthyDiscount] = useState<boolean>(false);

  // 24. Legal (민사/형사)
  const [legalLitigationType, setLegalLitigationType] = useState<'civil' | 'criminal' | 'administrative'>('civil');
  const [legalLawyerLimit, setLegalLawyerLimit] = useState<number>(10000000);
  const [legalCourtFeeLimit, setLegalCourtFeeLimit] = useState<number>(10000000);
  const [legalDeductibleType, setLegalDeductibleType] = useState<'none' | '10' | '20'>('none');
  const [legalSuddenAccelerationRider, setLegalSuddenAccelerationRider] = useState<boolean>(false);
  const [legalConsultationRider, setLegalConsultationRider] = useState<boolean>(true);
  const [legalIsElectronicLitigation, setLegalIsElectronicLitigation] = useState<boolean>(true);

  // 25. Savings (일반 저축)
  const [savingsSavingType, setSavingsSavingType] = useState<'installment' | 'lumpSum'>('installment');
  const [savingsMonthlyPremium, setSavingsMonthlyPremium] = useState<number>(300000);
  const [savingsPaymentPeriod, setSavingsPaymentPeriod] = useState<number>(5);
  const [savingsMaintenancePeriod, setSavingsMaintenancePeriod] = useState<number>(10);
  const [savingsObjective, setSavingsObjective] = useState<'marriage' | 'housing' | 'retirement' | 'wealth' | 'education'>('wealth');
  const [savingsHasUniversal, setSavingsHasUniversal] = useState<boolean>(true);

  // 26. Credit (신용보험)
  const [creditLoanType, setCreditLoanType] = useState<'mortgage' | 'jeonse' | 'credit' | 'business'>('mortgage');
  const [creditLoanAmount, setCreditLoanAmount] = useState<number>(100000000);
  const [creditLoanPeriod, setCreditLoanPeriod] = useState<number>(10);
  const [creditBureau, setCreditBureau] = useState<'nice' | 'kcb'>('nice');
  const [creditScore, setCreditScore] = useState<number>(850);
  const [creditHasIllnessRider, setCreditHasIllnessRider] = useState<boolean>(true);
  const [creditHasDisabilityRider, setCreditHasDisabilityRider] = useState<boolean>(true);

  const renderGranularFields = (catName: string) => {
    switch (catName) {
      case '의료실비':
        return (
          <SilsonFields
            hasCurrent={silsonHasCurrent} setHasCurrent={setSilsonHasCurrent}
            threeMonth={silson3Month} setThreeMonth={setSilson3Month}
            oneYear={silson1Year} setOneYear={setSilson1Year}
            fiveYear={silson5Year} setFiveYear={setSilson5Year}
            nonReimbursableUsage={silsonNonReimbursable} setNonReimbursableUsage={setSilsonNonReimbursable}
            subType="4세대 실손"
            pregnancyCover={silsonPregnancyCover} setPregnancyCover={setSilsonPregnancyCover}
            frequentNonSevere={silsonFrequentNonSevere} setFrequentNonSevere={setSilsonFrequentNonSevere}
          />
        );
      case '치아보험':
        return (
          <DentalFields
            lastYear={dentalLastYear} setLastYear={setDentalLastYear}
            last5Years={dentalLast5Years} setLast5Years={setDentalLast5Years}
            dentures={dentalDentures} setDentures={setDentalDentures}
            implantLimit={dentalImplantLimit} setImplantLimit={setDentalImplantLimit}
            crownAmount={dentalCrownAmount} setCrownAmount={setDentalCrownAmount}
            focus={dentalFocus} setFocus={setDentalFocus}
            diagnosticType={dentalDiagnosticType} setDiagnosticType={setDentalDiagnosticType}
          />
        );
      case '유병자':
        return (
          <PreExistingFields
            threeMonth={silson3Month} setThreeMonth={setSilson3Month}
            noAccidentYears={preExistingType.split('.')[1]}
            setNoAccidentYears={(v: string) => setPreExistingType(`3.${v}.5` as any)}
            fiveYearMajor={silson5Year} setFiveYearMajor={setSilson5Year}
          />
        );
      case '수술/입원':
        return (
          <SurgeryHospitalFields
            surgeryFocus={surgeryFocus} setSurgeryFocus={setSurgeryFocus}
            hospitalAmount={hospitalAmount} setHospitalAmount={setHospitalAmount}
            caregiverOption={caregiverOption} setCaregiverOption={setCaregiverOption}
            tertiaryHospital={tertiaryHospital} setTertiaryHospital={setTertiaryHospital}
          />
        );
      case '암보험':
        return (
          <CancerFields
            diagnosisAmount={cancerDiagnosisAmount} setDiagnosisAmount={setCancerDiagnosisAmount}
            targetedTherapy={cancerTargetedTherapy} setTargetedTherapy={setCancerTargetedTherapy}
            treatmentCost2025={cancerTreatmentCost2025} setTreatmentCost2025={setCancerTreatmentCost2025}
            paymentType={cancerPaymentType} setPaymentType={setCancerPaymentType}
            recurrentCancer={cancerRecurrentCancer} setRecurrentCancer={setCancerRecurrentCancer}
            familyHistory={cancerFamilyHistory} setFamilyHistory={setCancerFamilyHistory}
          />
        );
      case '종합건강':
        return (
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
        );
      case '뇌혈관':
        return (
          <BrainFields
            diagnosisAmount={selectedBrain} setDiagnosisAmount={setSelectedBrain}
            paymentType={brainPaymentType} setPaymentType={setBrainPaymentType}
            surgeryBenefit={brainSurgeryBenefit} setSurgeryBenefit={setBrainSurgeryBenefit}
            coveragePeriod={brainCoveragePeriod} setCoveragePeriod={setBrainCoveragePeriod}
          />
        );
      case '심장질환':
        return (
          <HeartFields
            gender={gender === 'M' ? 'male' : 'female'}
            setGender={() => {}}
            age={Number(age) || 40}
            setAge={() => {}}
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
        );
      case '상해보험':
        return (
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
        );
      case '간병 보험':
        return (
          <CaregivingFields
            svcType={careSvcType} setSvcType={setCareSvcType}
            stepUp={careStepUp} setStepUp={setCareStepUp}
            nursingHospital={careNursingHospital} setNursingHospital={setCareNursingHospital}
            geriatric={careGeriatric} setGeriatric={setCareGeriatric}
            integrated={careIntegrated} setIntegrated={setCareIntegrated}
          />
        );
      case '치매 간병보험':
        return (
          <CaregivingOldFields
            diagnosisAmount={dementiaDiagnosisAmount} setDiagnosisAmount={setDementiaDiagnosisAmount}
            monthlyAllowance={dementiaMonthlyAllowance} setMonthlyAllowance={setDementiaMonthlyAllowance}
            serviceType={dementiaServiceType} setServiceType={setDementiaServiceType}
            hasProxyClaim={dementiaHasProxyClaim} setHasProxyClaim={setDementiaHasProxyClaim}
            hasHistory={dementiaHasHistory} setHasHistory={setDementiaHasHistory}
            hasLtcGrade={dementiaHasLtcGrade} setHasLtcGrade={setDementiaHasLtcGrade}
          />
        );
      case '재가/시설':
        return (
          <NursingFields
            preferredService={nursingPreferredService} setPreferredService={setNursingPreferredService}
            homeAmount={nursingHomeAmount} setHomeAmount={setNursingHomeAmount}
            facilityAmount={nursingFacilityAmount} setFacilityAmount={setNursingFacilityAmount}
            hasProxyClaim={nursingHasProxyClaim} setHasProxyClaim={setNursingHasProxyClaim}
            hasBrainHistory={nursingHasBrainHistory} setHasBrainHistory={setNursingHasBrainHistory}
            hasLtcHistory={nursingHasLtcHistory} setHasLtcHistory={setNursingHasLtcHistory}
          />
        );
      case '어린이/신생아':
        return (
          <ChildFields
            targetAgeGroup={childAgeGroup} setTargetAgeGroup={setChildAgeGroup}
            maturity={childMaturity} setMaturity={setChildMaturity}
            focusArea={childFocusArea} setFocusArea={setChildFocusArea}
            hasPrenatalRider={childHasPrenatalRider} setHasPrenatalRider={setChildHasPrenatalRider}
            weeksPregnancy={childWeeksPregnancy} setWeeksPregnancy={setChildWeeksPregnancy}
            childBirthDate={childBirthDate}
            setChildBirthDate={setChildBirthDate}
          />
        );
      case '유병력자 전용':
        return (
          <PreFamilyFields
            illnessType={preFamilyIllnessType} setIllnessType={setPreFamilyIllnessType}
            noAccidentYears={preFamilyNoAccidentYears} setNoAccidentYears={setPreFamilyNoAccidentYears}
            maturity={preFamilyMaturity} setMaturity={setPreFamilyMaturity}
            childBirthDate={preFamilyBirthDate}
            setChildBirthDate={setPreFamilyBirthDate}
          />
        );
      case '자동차 보험':
        return (
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
            prefilledName={userName}
            prefilledBirth={birth}
            prefilledMobile={mobileNo}
            initialUserName={userName}
            initialBirthDate={birth}
            initialMobileNo={mobileNo}
            triggerHyphenModal={triggerHyphenModal}
            setTriggerHyphenModal={setTriggerHyphenModal}
          />
        );
      case '운전자 보험':
        return (
          <DriverFields
            drivingPurpose={driverDrivingPurpose}
            setDrivingPurpose={setDriverDrivingPurpose}
            jobClass={driverJobClass}
            setJobClass={setDriverJobClass}
            planType={driverPlanType}
            setPlanType={setDriverPlanType}
          />
        );
      case '펫 보험':
        return (
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
        );
      case '골프 / 레저':
        return (
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
        );
      case '주택화재':
        return (
          <FireFields
            selectedDetail={0}
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
        );
      case '재물종합':
        return (
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
        );
      case '연금저축':
        return (
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
        );
      case '종신':
        return (
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
        );
      case '변액, 정기':
        return (
          <VariableFields
            isUnlocked={true}
            subType={variableSubType}
            setSubType={setVariableSubType}
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
        );
      case '민사/형사':
        return (
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
        );
      case '일반 저축':
        return (
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
        );
      case '신용보험':
        return (
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
        );
      default:
        return (
          <HealthFields
            selectedCancer={selectedCancer} setSelectedCancer={setSelectedCancer}
            selectedBrain={selectedBrain} setSelectedBrain={setSelectedBrain}
            selectedHeart={selectedHeart} setSelectedHeart={setSelectedHeart}
            selectedSurgery={selectedSurgery} setSelectedSurgery={setSelectedSurgery}
            selectedDisability={selectedDisability} setSelectedDisability={setSelectedDisability}
            selectedExemption={selectedExemption} setSelectedExemption={setSelectedExemption}
          />
        );
    }
  };

  // Handle category toggle
  const toggleCategory = (catName: string) => {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catName));
      const newPremiums = { ...categoryPremiums };
      delete newPremiums[catName];
      setCategoryPremiums(newPremiums);
      setSavedCategories(prev => prev.filter(c => c !== catName));
      setExpandedCategories(prev => prev.filter(c => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
      setCategoryPremiums({
        ...categoryPremiums,
        [catName]: 50000 // 기본 가입 금액 설정 (5만원)
      });
    }
  };

  // 상세 설정 임시 저장 처리
  const handleSaveCategoryDetails = (catName: string) => {
    if (!savedCategories.includes(catName)) {
      setSavedCategories(prev => [...prev, catName]);
    }
    
    // Smooth scroll to card header before collapse
    const cardEl = document.getElementById(`custom-policy-card-${catName}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 0.6초 후 깔끔하게 아코디언 닫기
    setTimeout(() => {
      setExpandedCategories(prev => prev.filter(c => c !== catName));
    }, 600);
  };

  // Handle auto-calculating age based on birth date (8 digits)
  const handleBirthChange = (val: string) => {
    const numericVal = val.replace(/[^0-9]/g, '');
    setBirth(numericVal);
    
    if (numericVal.length === 8) {
      const birthYear = parseInt(numericVal.substring(0, 4));
      if (!isNaN(birthYear)) {
        const currentYear = new Date().getFullYear(); // 2026
        setAge(String(currentYear - birthYear + 1));
      }
    } else {
      setAge('');
    }
  };

  const getEnglishIdFromName = (name: string): string => {
    for (const group of categoryGroups) {
      const found = group.items.find(item => item.name === name);
      if (found) return found.id;
    }
    return name;
  };

  const getMappedCategoryId = (cat: string) => {
    const mapping: Record<string, string> = {
      silson: 'indemnity',
      pre_existing: 'preexisting',
      surgery_hospital: 'surgery',
      brain: 'cerebrovascular',
      whole_life: 'whole',
      fire: 'fire_real',
      savings: 'savings_general'
    };
    return mapping[cat] || cat;
  };

  const getCustomPoliciesList = () => {
    return selectedCategories.map((origCatName) => {
      const origCat = getEnglishIdFromName(origCatName);
      const cat = getMappedCategoryId(origCat);
      const premium = categoryPremiums[origCatName] || 0;
      const isCustom = savedCategories.includes(origCatName);
      const riders: { rider_name: string; coverage_amount: number }[] = [];

      if (isCustom) {
        if (origCat === 'cancer') {
          riders.push({ rider_name: '일반암진단비', coverage_amount: cancerDiagnosisAmount });
          if (cancerTargetedTherapy) {
            riders.push({ rider_name: '표적항암약물치료비', coverage_amount: 50000000 });
          }
          if (cancerTreatmentCost2025) {
            riders.push({ rider_name: '특정방사선약물치료비', coverage_amount: 30000000 });
          }
          if (cancerRecurrentCancer) {
            riders.push({ rider_name: '재진단암진단비', coverage_amount: 20000000 });
          }
        } else if (origCat === 'silson') {
          riders.push({ rider_name: '상해입원의료비', coverage_amount: 50000000 });
          riders.push({ rider_name: '질병입원의료비', coverage_amount: 50000000 });
          riders.push({ rider_name: '상해외래의료비', coverage_amount: 250000 });
          riders.push({ rider_name: '질병외래의료비', coverage_amount: 250000 });
          riders.push({ rider_name: '비급여 3대 특약', coverage_amount: silsonNonReimbursable === 'under100' ? 3000000 : 1500000 });
        } else if (origCat === 'dental') {
          riders.push({ rider_name: '임플란트치료비', coverage_amount: dentalImplantLimit === 'unlimited' ? 1500000 : 1000000 });
          riders.push({ rider_name: '크라운치료비', coverage_amount: dentalCrownAmount });
          riders.push({ rider_name: '보존치료비(인레이/온레이)', coverage_amount: dentalFocus === 'conservative' ? 300000 : 150000 });
        } else if (origCat === 'surgery_hospital') {
          riders.push({ rider_name: '질병수술비', coverage_amount: surgeryFocus === 'wide' ? 1000000 : 500000 });
          riders.push({ rider_name: '상해수술비', coverage_amount: 1000000 });
          riders.push({ rider_name: '질병입원일당', coverage_amount: hospitalAmount });
          if (caregiverOption === 'use') {
            riders.push({ rider_name: '간병인사용일당', coverage_amount: 150000 });
          }
        } else if (origCat === 'brain') {
          riders.push({ rider_name: '뇌혈관질환진단비', coverage_amount: selectedBrain });
        } else if (origCat === 'heart') {
          riders.push({ rider_name: '허혈성심장질환진단비', coverage_amount: selectedHeart });
        } else if (origCat === 'accident') {
          riders.push({ rider_name: '상해후유장해', coverage_amount: selectedDisability });
        } else if (origCat === 'caregiving') {
          riders.push({ rider_name: '간병인사용일당', coverage_amount: careSvcType === 'expense' ? 150000 : 100000 });
        } else if (origCat === 'dementia') {
          riders.push({ rider_name: '중증치매진단비', coverage_amount: dementiaDiagnosisAmount });
          riders.push({ rider_name: '치매생활자금(월)', coverage_amount: dementiaMonthlyAllowance });
          riders.push({ rider_name: '대물배상한도', coverage_amount: carPropertyLimit * 100000000 });
          riders.push({ rider_name: '대물배상한도', coverage_amount: carPropertyLimit * 100000000 });
          riders.push({ rider_name: '자기신체사고/자동차상해', coverage_amount: carInjuryType === 'jasang' ? 200000000 : 100000000 });
        } else if (origCat === 'driver') {
          riders.push({ rider_name: '교통사고처리지원금', coverage_amount: 200000000 });
          riders.push({ rider_name: '운전자벌금한도', coverage_amount: 30000000 });
          riders.push({ rider_name: '변호사선임비용', coverage_amount: 50000000 });
        }
      }

      return {
        categoryId: cat,
        premium,
        riders,
        isCustom
      };
    });
  };

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    const statuses = [
      '🔒 보안 통신망을 안전하게 개설하는 중...',
      '📡 한국신용정보원(내보험다보여) 서버 연결 중...',
      '📝 상품명, 납입료, 연령, 성별 정보 수집 완료...',
      '🤖 제미나이 AI가 0.1초 만에 최적의 보장 금액을 정교하게 추정하는 중...',
      '💎 Supabase 표준 설계 요율 테이블 실시간 매칭 연산 완료!',
      '✨ 웅장한 AI 분석 포트폴리오 및 리모델링 대시보드 산출 완료!'
    ];

    for (let i = 0; i < statuses.length; i++) {
      setAnalysisStatus(statuses[i]);
      await new Promise((resolve) => setTimeout(resolve, i === statuses.length - 1 ? 400 : 300));
    }

    setIsAnalyzing(false);

    // Generate StandardizedCoverage using entered inputs + default mock
    const custom = getCustomPoliciesList();
    const finalAge = (Number(age) && Number(age) > 0) ? Number(age) : 35;
    const finalGender = gender;
    
    const standardized = generateCustomMockData(finalAge, finalGender, custom);
    handleAuthSuccess(standardized);
  };

  const handleAuthSuccess = (coverage: StandardizedCoverage) => {
    onAnalyze({
      name: userName,
      mobile: mobileNo,
      age: coverage.age,
      gender: coverage.gender,
      jobClass: 1,
      selectedCategory: 'remodeling',
      cancer: { currentAmount: coverage.cancer_diagnosis, targetAmount: 50000000 },
      cerebrovascular: { currentAmount: coverage.brain_vascular, targetAmount: 30000000 },
      cardiovascular: { currentAmount: coverage.ischemic_heart, targetAmount: 30000000 },
      surgery: { currentAmount: coverage.surgery_amount ?? 0, targetAmount: 10000000 },
      postDisability: { currentAmount: coverage.post_disability_amount ?? 0, targetAmount: 30000000 },
      paymentExemption: 'standard',
      healthStatus: 'standard',
      monthlyPremium: coverage.current_total_premium,
      _remodelingCoverage: coverage
    });
  };

  return (
    <section className="w-full py-40 space-y-24">
      {/* 안심 자율 비교 서비스 배너 (텍스트만) */}
      <div className="max-w-4xl mx-auto w-full text-center px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-500/10 text-orange-600 rounded-full text-[11px] md:text-xs font-black uppercase tracking-wider mb-4">
          ✨ 안심 자율 비교 서비스
        </div>
        
        {/* Title */}
        <h3 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-4 leading-tight">
          "가입 권유 전화 <span className="text-orange-500">Zero</span>" — 완전 비대면 자율 분석
        </h3>
        
        {/* Description */}
        <p className="text-sm md:text-base lg:text-lg text-slate-600 font-bold leading-relaxed max-w-2xl mx-auto break-keep mb-3">
          상담원 전화 유도 없이, 오직 AI 빅데이터 엔진을 통해 고객 스스로 자율 비교 및 진단을 완료할 수 있습니다.
        </p>
        
        {/* Subtext */}
        <div className="text-xs md:text-sm text-slate-400 font-semibold">
          (전화는 고객이 원할 때만 1:1 신청 가능)
        </div>
      </div>

      {/* 3대 핵심 차별점 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1600px] mx-auto mb-20 px-4">
        {/* 카드 1 */}
        <div className="bg-gradient-to-br from-white via-slate-50/50 to-orange-500/[0.04] border border-slate-200/80 hover:border-orange-500/30 hover:from-white hover:to-orange-500/[0.08] hover:-translate-y-1.5 active:-translate-y-3.5 active:scale-[1.01] hover:shadow-[0_25px_50px_-15px_rgba(255,107,0,0.08)] active:shadow-[0_35px_60px_-10px_rgba(255,107,0,0.15)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),_0_10px_30px_-10px_rgba(0,0,0,0.03)] transition-all duration-300 rounded-[2rem] p-8 flex flex-col gap-4 text-left group cursor-pointer select-none">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-115 group-hover:rotate-[15deg] transition-all duration-300">
            <Sparkles className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">Differentiator 01</span>
            <h4 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
              한국신용정보원 실시간 연동<br />
              <span className="text-orange-500">& 0.1초 AI 정밀 진단</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed break-keep">
            번거로운 서류 제출 없이 간편 인증 한 번으로, 한국신용정보원에 등록된 내가 가입한 전 보험사의 상세 계약 내역을 실시간 API로 안전하게 불러옵니다. 내 실제 보험 상품 정보와 세부 보장 내역을 AI 엔진이 0.1초 만에 완벽하게 진단하여 보장 과부족 점수를 투명하게 제공합니다.
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
              0.1초 AI 중복 보장 진단<br />
              <span className="text-orange-500">& 또래 평균 통계 리밸런싱</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed break-keep">
            나도 모르게 이중으로 납부하고 있던 중복 가입 항목과 불필요한 과납 보장을 AI가 즉시 진단하여 매달 새어나가는 보험료 거품을 완벽하게 짚어냅니다. 또한, 나와 동일한 연령대 및 성별의 실제 가입 통계 데이터를 바탕으로 과하거나 부족한 담보 수준을 정밀 대조하여 가장 합리적인 보장 포트폴리오를 제안합니다.
          </p>
        </div>

        {/* 카드 3 */}
        <div className="bg-gradient-to-br from-white via-slate-50/50 to-orange-500/[0.04] border border-slate-200/80 hover:border-orange-500/30 hover:from-white hover:to-orange-500/[0.08] hover:-translate-y-1.5 active:-translate-y-3.5 active:scale-[1.01] hover:shadow-[0_25px_50px_-15px_rgba(255,107,0,0.08)] active:shadow-[0_35px_60px_-10px_rgba(255,107,0,0.15)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),_0_10px_30px_-10px_rgba(0,0,0,0.03)] transition-all duration-300 rounded-[2rem] p-8 flex flex-col gap-4 text-left group cursor-pointer select-none">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-115 group-hover:rotate-[360deg] transition-all duration-700">
            <Shield className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">Differentiator 03</span>
            <h4 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
              내 보험 정밀 분석<br />
              <span className="text-orange-500">전사 상품 1:1 매칭 & 0.1초 초정밀 최적화 엔진</span>
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed break-keep">
            고객의 기존 보험을 분석하는 즉시, 국내 모든 생명·손해보험사의 최신 상품 데이터베이스와 1:1로 실시간 대조합니다. 보장은 완벽히 동일하지만 보험료는 더 저렴한 상품, 또는 동일한 보험료 기준 보장 범위와 가입금액이 훨씬 유리한 상품을 단 0.1초 만에 비교 분석하여 제안서 형태로 즉시 제공합니다.
          </p>
        </div>
      </div>

      {/* High-Fidelity Simulator Showcase */}
      <AnalysisShowcase />

      <div className="flex flex-col items-center text-center space-y-6 w-full max-w-7xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
           <Zap size={14} className="fill-current text-orange-500" /> Professional Deep Analysis
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-tight">내보험 정밀 분석</h2>
        <p className="text-xl text-gray-500 font-bold italic">"내가 진짜 가입한 보험, 무엇무엇이 맞을까요?"</p>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="bg-slate-900 rounded-[4rem] p-8 md:p-16 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-24 opacity-5 scale-150 transform group-hover:scale-125 transition-transform duration-1000 rotate-12">
             <Zap className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 space-y-12">
            <div className="space-y-4 text-center">
               <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                 원클릭 내 보험 분석
               </h3>
               <p className="text-sm md:text-base text-slate-400 font-bold leading-relaxed">
                 따로 입력할 필요 없이 본인 인증 정보 입력 후 실시간으로 정보를 조회합니다.
               </p>
            </div>

            {/* 고객과의 안심 3대 약속 배너 */}
            <div className="max-w-xl mx-auto bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/50 border-2 border-orange-200/80 rounded-[2.5rem] p-6 text-left shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🛡️</span>
                <h4 className="text-sm font-black text-slate-800 tracking-tight">고객과의 안심 3대 약속</h4>
                <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-[8px] font-black uppercase tracking-wider">Verified</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                <div className="bg-white p-3.5 rounded-2xl border border-orange-100 flex flex-col gap-0.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Promise 1</span>
                    <span className="text-xs font-black text-slate-800 leading-tight">개인정보 없는 익명 진단</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-keep">이름과 휴대폰 번호 등 개인 정보를 입력하지 않고 즉시 비교 분석 결과를 확인합니다.</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-orange-100 flex flex-col gap-0.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Promise 2</span>
                    <span className="text-xs font-black text-slate-800 leading-tight">고유 보관 코드 발급</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-keep">분석 화면 분실 방지를 위해 나만 알 수 있는 안전한 임시 보관 코드가 발급됩니다.</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-orange-100 flex flex-col gap-0.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Promise 3</span>
                    <span className="text-xs font-black text-slate-800 leading-tight">상담원 없는 자율 진단</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-keep">상담원 전화 유도 없이, 오직 AI 빅데이터 엔진을 통해 고객 스스로 자율 비교 및 진단을 완료할 수 있습니다.</p>
                </div>
              </div>
            </div>

            {/* 고객 안심 보장 배너 */}
            <div className="max-w-xl mx-auto bg-[#FFF8F0] border-2 border-amber-200/80 rounded-3xl p-5 flex items-center gap-3.5 text-left shadow-xl animate-in fade-in duration-500">
              <span className="text-xl text-orange-500 flex-shrink-0 animate-pulse">🛡️</span>
              <p className="text-xs sm:text-sm font-black text-slate-800 leading-relaxed break-keep">
                저희는 고객님의 연락처를 묻지 않습니다. 안심하시고 비교 분석하시고 필요하실 때에만 카카오톡 요청해 주세요.
              </p>
            </div>

            <div className="space-y-12 max-w-7xl mx-auto w-full">
              
              {/* 1. Basic Info Section (PII-free) */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 max-w-xl mx-auto space-y-6">
                <div className="text-left border-b border-white/10 pb-3">
                  <h4 className="text-sm font-black text-white tracking-tight">기본 정보 입력</h4>
                </div>

                <div className="space-y-4">
                  {/* Gender Choice */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">성별</label>
                    <div className="flex bg-white/5 p-1 rounded-2xl h-[54px] gap-1 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setGender('M')}
                        className={`flex-1 rounded-xl font-black text-xs transition-all ${gender === 'M' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        남성
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('F')}
                        className={`flex-1 rounded-xl font-black text-xs transition-all ${gender === 'F' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        여성
                      </button>
                    </div>
                  </div>

                  {/* Birthdate & Age */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">생년월일 (8자리)</label>
                      <input
                        type="text"
                        placeholder="예) 19770101"
                        maxLength={8}
                        value={birth}
                        onChange={(e) => handleBirthChange(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white focus:outline-none focus:bg-white/10 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">나이</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="자동 계산"
                          value={age}
                          readOnly
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white/50 focus:outline-none transition-all cursor-not-allowed"
                          required
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">세</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Category Selection Section */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="text-left border-b border-white/10 pb-3">
                  <h4 className="text-sm font-black text-white tracking-tight">상세 타입을 선택해 보세요 (중복 선택 가능)</h4>
                </div>

                <div className="space-y-8">
                  {categoryGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-4 text-left">
                      {/* 그룹 타이틀 */}
                      <div className="flex items-center gap-1.5 pl-1">
                        <span className="text-sm">{group.emoji}</span>
                        <h5 className="text-[11px] font-black text-orange-500 tracking-wider uppercase">{group.title}</h5>
                      </div>
                      
                      {/* 데스크탑 한 줄에 4개씩 나오는 그리드 */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {group.items.map((item) => {
                          const isSelected = selectedCategories.includes(item.name);
                          const IconComponent = categoryIcons[item.id] || Shield;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleCategory(item.name)}
                              className={`flex items-center gap-3.5 p-4 rounded-[2.2rem] text-left transition-all duration-300 select-none cursor-pointer group/btn active:translate-y-0.5 active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] ${
                                isSelected 
                                  ? 'bg-gradient-to-b from-orange-400 via-orange-500 to-amber-500 border-t-2 border-t-white/30 border-x border-x-orange-500 border-b-2 border-b-orange-700/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),_inset_0_-2px_4px_rgba(0,0,0,0.2),_0_15px_30px_-5px_rgba(249,115,22,0.4)] -translate-y-0.5' 
                                  : 'bg-gradient-to-b from-white/[0.07] to-white/[0.02] border-t border-t-white/15 border-x border-x-white/5 border-b-2 border-b-black/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_4px_8px_-2px_rgba(0,0,0,0.3)] hover:from-white/[0.12] hover:to-white/[0.05] hover:border-t-white/25 hover:border-b-black/60 hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] hover:-translate-y-0.5'
                              }`}
                            >
                              {/* Left Icon Container - Tactile 3D design */}
                              <div className={`flex-shrink-0 w-11 h-11 rounded-[1.1rem] flex items-center justify-center transition-all duration-300 ${
                                isSelected 
                                  ? 'bg-white/20 text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_0_2px_4px_rgba(0,0,0,0.15)] scale-110' 
                                  : 'bg-black/20 text-slate-400 border border-white/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] group-hover/btn:bg-white/10 group-hover/btn:text-white'
                              }`}>
                                <IconComponent className="w-5 h-5" strokeWidth={2.5} />
                              </div>

                              {/* Text content */}
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between w-full">
                                  <span className={`text-[13px] font-black tracking-tight leading-none mb-1 transition-colors ${
                                    isSelected 
                                      ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]' 
                                      : 'text-slate-300 group-hover/btn:text-white'
                                  }`}>
                                    {item.name}
                                  </span>
                                  {/* Checkbox indicator with Inset Shadow for Depth */}
                                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all shrink-0 ml-1.5 ${
                                    isSelected 
                                      ? 'bg-white border-white text-orange-600 shadow-[0_2px_4px_rgba(0,0,0,0.15),_inset_0_1px_1px_rgba(0,0,0,0.2)]' 
                                      : 'border-slate-500 bg-black/25 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] group-hover/btn:border-slate-400'
                                  }`}>
                                    {isSelected && <span className="text-[9px] font-black">✓</span>}
                                  </div>
                                </div>
                                <span className={`text-[10px] font-semibold truncate leading-none transition-colors ${
                                  isSelected ? 'text-white/85 font-black' : 'text-slate-400'
                                }`}>
                                  {item.desc}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Selected Categories Detail Cards List */}
              {selectedCategories.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
                  <div className="text-left border-b border-white/10 pb-3">
                    <h4 className="text-sm font-black text-white tracking-tight">선택한 보험별 가입 금액(보험료) 설정</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {selectedCategories.map((catName) => {
                      const premiumVal = categoryPremiums[catName];
                      const displayVal = premiumVal === undefined ? '50,000' : (premiumVal === 0 ? '' : premiumVal.toLocaleString());
                      
                      // Find category item to get its icon ID
                      const categoryItem = categoryGroups
                        .flatMap(g => g.items)
                        .find(i => i.name === catName);
                      const iconId = categoryItem ? categoryItem.id : '';
                      const IconComponent = categoryIcons[iconId] || Shield;

                      const isExpanded = expandedCategories.includes(catName);

                      return (
                        <div id={`custom-policy-card-${catName}`} key={catName} className="bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_8px_16px_rgba(0,0,0,0.2)]">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              {/* Icon Indicator */}
                              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-orange-500 shadow-[inset_0_1px_2.5px_rgba(255,255,255,0.15)]">
                                <IconComponent className="w-5 h-5" strokeWidth={2.5} />
                              </div>
                              
                              <div className="space-y-1">
                                <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block">SELECTED POLICY</span>
                                <h5 className="text-base font-black text-white leading-tight">{catName}</h5>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-slate-400">매월 가입 금액(보험료)</span>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={displayVal}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                                    setCategoryPremiums({
                                      ...categoryPremiums,
                                      [catName]: val
                                    });
                                  }}
                                  className="w-44 text-right bg-black/30 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm font-black text-white focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">원</span>
                              </div>
                            </div>
                          </div>

                          {/* Accordion / Toggle for detailed input fields */}
                          <div className="w-full pt-4 border-t border-white/5 flex flex-col">
                            <button
                              type="button"
                              onClick={() => {
                                setExpandedCategories(prev =>
                                  prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
                                );
                              }}
                              className={`text-xs font-black transition-all duration-300 flex items-center gap-1.5 self-start cursor-pointer px-4 py-2.5 rounded-xl border ${
                                isExpanded
                                  ? 'bg-white/10 border-white/20 text-white shadow-inner'
                                  : 'text-orange-500 animate-blink-card hover:scale-[1.02] active:scale-95'
                              }`}
                            >
                              {isExpanded ? (
                                <>
                                  <Minus size={14} strokeWidth={3} />
                                  <span>내 보험 보장내역 상세 입력 닫기</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={14} strokeWidth={3} />
                                  <span>내 보험 정밀입력하기 (선택)</span>
                                  {savedCategories.includes(catName) && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/25">
                                      입력 완료 ✅
                                    </span>
                                  )}
                                </>
                              )}
                            </button>

                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-4 p-6 rounded-[2.5rem] bg-white border border-slate-200 text-slate-800 flex flex-col gap-4 shadow-xl">
                                    <div className="text-left mb-1">
                                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">DETAILED RIDER OPTIONS</span>
                                      <h6 className="text-xs font-black text-orange-600">"{catName}"에 대한 상세 가입 및 보장 내역을 직접 입력할 수 있습니다.</h6>
                                    </div>
                                    
                                    {renderGranularFields(catName)}
                                    
                                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <span className="text-[11px] font-bold text-slate-500">
                                        설정이 완료되었으면 저장 버튼을 눌러 확정해 주세요.
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleSaveCategoryDetails(catName)}
                                        className={`px-6 py-2.5 rounded-xl text-xs font-black text-white transition-all duration-300 flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 active:scale-95 ${
                                          savedCategories.includes(catName)
                                            ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-t-2 border-t-white/30 border-b-2 border-b-emerald-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),_0_4px_12px_rgba(16,185,129,0.3)]'
                                            : 'bg-gradient-to-b from-orange-400 to-orange-600 border-t-2 border-t-white/30 border-b-2 border-b-orange-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),_0_4px_12px_rgba(249,115,22,0.3)] hover:from-orange-500 hover:to-orange-700'
                                        }`}
                                      >
                                        {savedCategories.includes(catName) ? (
                                          <>
                                            <span>저장 완료 ✅</span>
                                          </>
                                        ) : (
                                          <>
                                            <span>상세 설정 저장</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="button"
                onClick={(e: any) => handleStartAnalysis(e)}
                className="w-full max-w-xl mx-auto bg-gradient-to-b from-orange-400 via-orange-500 to-amber-500 text-white font-black py-5 rounded-2xl text-base border-t-2 border-t-white/30 border-x border-x-orange-500 border-b-2 border-b-orange-700/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),_inset_0_-2px_4px_rgba(0,0,0,0.2),_0_20px_40px_-10px_rgba(249,115,22,0.4)] transition-all duration-300 flex items-center justify-center gap-3 mt-6 cursor-pointer active:translate-y-0.5 active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] hover:from-orange-350 hover:to-amber-450 hover:shadow-[0_25px_50px_-8px_rgba(249,115,22,0.5)]"
              >
                내 보험 정밀 분석 시작하기
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <HyphenAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialData={{
          userName,
          gender,
          birth,
          mobileNo,
          age: Number(age),
          customPolicies: getCustomPoliciesList()
        }}
      />

      {isAnalyzing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-lg p-12 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col items-center justify-center text-center space-y-6 min-h-[350px]">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 animate-spin" />
            </div>
            <p className="text-lg font-black text-slate-800 tracking-tight transition-all duration-300">
              {analysisStatus}
            </p>
            <div className="text-xs font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">
              보안 모듈이 안전하게 동작하고 있습니다. 잠시만 기다려 주세요.
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AnalysisSection;
