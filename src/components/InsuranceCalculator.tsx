import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Activity, Clock, Baby, Smile, 
  Stethoscope, Calendar, PiggyBank, 
  Car, Home, Brain, TrendingUp, MessageCircle, Navigation,
  Heart, Hospital, Users, Wallet, Flame, Dog, Plane, Target, Scale, Hotel, Sparkles, Plus, Zap, ChevronRight, HelpCircle, HeartHandshake, AlertCircle
} from 'lucide-react';
import { HealthFields } from './insurance/health/HealthFields';
import { SilsonFields } from './insurance/silson/SilsonFields';
import { CaregivingFields } from './insurance/caregiving/CaregivingFields';
import { CaregivingOldFields } from './insurance/caregiving/CaregivingOldFields';
import { DentalFields } from './insurance/dental/DentalFields';
import { PreExistingFields } from './insurance/preExisting/PreExistingFields';
import { SurgeryFields as SurgeryHospitalFields } from './insurance/surgery/SurgeryFields';
import { CancerFields } from './insurance/cancer/CancerFields';
import { BrainFields } from './insurance/brain/BrainFields';
import { HeartFields } from './insurance/heart/HeartFields';


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
      { id: 'silson', label: '의료실비', description: '병원비 90% 보장', icon: Shield, color: '#00D7C4', bgColor: '#F0FDFA', subTypes: ['4세대 실손', '노후 실손'] },
      { id: 'dental', label: '치아보험', description: '임플란트/크라운', icon: Smile, color: '#10B981', bgColor: '#F0FDF4', subTypes: ['진단형', '무진단형'] },
      { id: 'pre', label: '유병자', description: '아픈 분도 가입', icon: Stethoscope, color: '#2563EB', bgColor: '#EFF6FF', subTypes: ['간편 고지형', '무심사형'] },
      { id: 'surgery', label: '수술/입원', description: '수술비 반복 지급', icon: Activity, color: '#F59E0B', bgColor: '#FFFBEB', subTypes: ['1-5종 수술비', 'N대 수술비', '상해 수술비'] },
      { id: 'cancer', label: '암보험', description: '진단비 최대 1억', icon: Shield, color: '#F43F5E', bgColor: '#FFF1F2', subTypes: ['비갱신형', '갱신형', '표적항암형'] },
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
      { id: 'nursing', label: '재가/시설', description: '국가 공인 방문 요양', icon: HeartHandshake, color: '#EC4899', bgColor: '#FDF2F8', subTypes: ['방문 재가', '시설 입소'] },
    ]
  },
  {
    id: 'family',
    label: '가족 / 어린이',
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
      { id: 'travel', label: '여행자 보험', description: '상해 및 보장', icon: Plane, color: '#0EA5E9', bgColor: '#F0F9FF', subTypes: ['해외 여행', '국내 여행'] },
      { id: 'golf', label: '골프 / 레저', description: '취미 생활 보호', icon: Target, color: '#16A34A', bgColor: '#F0FDF4', subTypes: ['홀인원 축합', '필드 사고'] },
      { id: 'fire_real', label: '주택화재', description: '재산 피해 보호', icon: Home, color: '#EF4444', bgColor: '#FEF2F2', subTypes: ['건물 소실', '가재 도구'] },
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
    ]
  }
];

interface InsuranceCalculatorProps {
  onCalculate?: (analysis: any) => void;
}

export const InsuranceCalculator: React.FC<InsuranceCalculatorProps> = ({ onCalculate }) => {
  const [selectedId, setSelectedId] = useState('cancer');
  const [selectedDetail, setSelectedDetail] = useState(0);
  const [gender, setGender] = useState<'M' | 'F'>('M');
  
  // Input states
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [mobile, setMobile] = useState('');
  const [jobClass, setJobClass] = useState(1); // 1: Office, 2: Driver/Field, 3: High Risk
  const [healthStatus, setHealthStatus] = useState<'standard' | 'simple'>('standard');
  const [preExistingType, setPreExistingType] = useState<'3.0.5' | '3.2.5' | '3.3.5' | '3.5.5'>('3.2.5');
  const [currentPremium, setCurrentPremium] = useState('');
  const [showAuditInfo, setShowAuditInfo] = useState(false);
  
  const [dentalLastYear, setDentalLastYear] = useState<'yes' | 'no'>('no');
  const [dentalLast5Years, setDentalLast5Years] = useState<'yes' | 'no'>('no');
  const [dentalDentures, setDentalDentures] = useState<'yes' | 'no'>('no');
  const [dentalImplantLimit, setDentalImplantLimit] = useState<'3' | 'unlimited'>('3');
  const [dentalCrownAmount, setDentalCrownAmount] = useState(200000);
  const [dentalFocus, setDentalFocus] = useState<'conservative' | 'prosthetic'>('conservative');
  const [dentalDiagnosticType, setDentalDiagnosticType] = useState<'diagnostic' | 'non-diagnostic'>('non-diagnostic');
  
  const [careSvcType, setCareSvcType] = useState<'support' | 'expense'>('support');
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
  
  // Brain specific states for refined component
  const [brainPaymentType, setBrainPaymentType] = useState<'non-renewable' | 'renewable'>('non-renewable');
  const [brainScreeningType, setBrainScreeningType] = useState<'standard' | '3.5.5' | '3.10.5'>('standard');
  const [brainSurgeryBenefit, setBrainSurgeryBenefit] = useState(true);
  const [brainCoveragePeriod, setBrainCoveragePeriod] = useState(90);

  
  const calculatedAge = useMemo(() => {
    if (birthDate && birthDate.length === 8) {
      const year = parseInt(birthDate.substring(0, 4));
      const currentYear = new Date().getFullYear();
      const age = currentYear - year; 
      return age > 0 && age < 120 ? age : null;
    }
    return null;
  }, [birthDate]);

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
        setSelectedDetail(0); // 4세대 실손 고정
      } else if (calculatedAge >= 60) {
        setSelectedDetail(1); // 노후 실손 추천
      }
    }
  }, [selectedId, calculatedAge]);

  const handleCalculate = () => {
    const effectiveAge = calculatedAge || 40;

    if (onCalculate) {
      onCalculate({
        name,
        age: effectiveAge, 
        gender,
        jobClass,
        healthStatus,
        preExistingType: healthStatus === 'simple' ? preExistingType : undefined,
        monthlyPremium: parseInt(currentPremium) || (
          selectedId === 'silson' ? 25000 : 
          selectedId === 'dental' ? 45000 :
          (selectedId === 'pre' || selectedId === 'pre_family' || healthStatus === 'simple') ? 150000 : 
          120000
        ),
        selectedCategory: activeItem.label,
        // Treat selected options as "Current Coverage" being analyzed
        cancer: { 
          currentAmount: selectedId === 'cancer' ? cancerDiagnosisAmount : selectedCancer, 
          targetAmount: 50000000,
          targetedTherapy: cancerTargetedTherapy,
          treatmentCost2025: cancerTreatmentCost2025,
          paymentType: cancerPaymentType,
          recurrentCancer: cancerRecurrentCancer,
          familyHistory: cancerFamilyHistory
        },
        cerebrovascular: { 
          currentAmount: selectedBrain, 
          targetAmount: 30000000,
          selectedType: selectedId === 'brain' ? activeItem.subTypes[selectedDetail] : undefined,
          surgeryBenefit: brainSurgeryBenefit,
          paymentType: brainPaymentType,
          coveragePeriod: brainCoveragePeriod
        },
        cardiovascular: selectedId === 'heart' ? {
          currentAmount: 0,
          targetAmount: selectedHeart || 30000000,
          selectedType: selectedDetail === 0 ? '급성 심근경색' : '통합(급성+허혈성)',
        } : undefined,
        surgery: { currentAmount: selectedSurgery, targetAmount: 1000000 },
        postDisability: { currentAmount: selectedDisability, targetAmount: 30000000 },
        paymentExemption: selectedExemption,

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
        caregiving: selectedId === 'care_svc' ? {
          type: careSvcType,
          isStepUp: careStepUp,
          isNursingHospital: careNursingHospital,
          focusGeriatric: careGeriatric,
          focusIntegrated: careIntegrated
        } : selectedId === 'care_old' ? {
          dementiaDiagnosis: dementiaDiagnosisAmount,
          monthlyAllowance: dementiaMonthlyAllowance,
          preferredService: dementiaServiceType
        } : undefined,
        silson: selectedId === 'silson' ? {
          hasCurrentSilson: silsonHasCurrent,
          threeMonthTreatment: silson3Month,
          oneYearExam: silson1Year,
          fiveYearTreatment: silson5Year,
          subType: activeItem.subTypes[selectedDetail],
          nonReimbursableUsage: silsonNonReimbursable // 비급여 이용량 추가
        } : undefined,
        surgery_hospital: selectedId === 'surgery' ? {
          focus: surgeryFocus,
          hospitalAmount,
          caregiverOption,
          tertiaryHospital
        } : undefined,
        pre_existing_sub_type: (selectedId === 'pre' || selectedId === 'pre_family') ? activeItem.subTypes[selectedDetail] : undefined
      });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4 font-sans">
      <div className="bg-white rounded-[4.5rem] shadow-[0_60px_180px_-40px_rgba(20,40,80,0.12)] p-8 md:p-16 flex flex-col overflow-hidden border border-gray-50">
        
        <div className="flex flex-col gap-20 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex flex-col items-center gap-6 mb-12">
               <div className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.3em] opacity-70 mb-10">
                 국내 35개 전 보험사 실시간 통합 비교
               </div>

               {/* Static Full-width Partner Logos (Top/Bottom) */}
               <div className="w-full -mx-8 md:-mx-16 px-8 md:px-16 space-y-6 flex flex-col items-center">
                 <img 
                   src="/insurance_logos_1.png" 
                   alt="Partner Logos 1" 
                   className="w-full max-w-5xl h-auto object-contain opacity-90" 
                 />
                 <img 
                   src="/insurance_logos_2.png" 
                   alt="Partner Logos 2" 
                   className="w-full max-w-5xl h-auto object-contain opacity-90" 
                 />
               </div>
          </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                  {major.items.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          setSelectedId(item.id);
                          setSelectedDetail(0);
                        }}
                        whileHover={{ y: -5, shadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center gap-4 p-5 rounded-[2.2rem] transition-all duration-500
                          ${isSelected 
                            ? 'bg-white shadow-[0_20px_60px_-15px_rgba(255,107,0,0.3)] border-2 border-[#FF6B00]' 
                            : 'bg-white border-2 border-slate-50 shadow-sm hover:border-slate-200'}
                        `}
                      >
                        <div className={`flex-shrink-0 w-12 h-12 rounded-[1rem] flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-[#FFF0E5]' : 'bg-slate-50 text-slate-300'}`}>
                          <item.icon size={26} color={isSelected ? '#FF6B00' : 'currentColor'} strokeWidth={2} />
                        </div>

                        <div className="flex flex-col items-start text-left overflow-hidden">
                          <span className={`text-[1.05rem] font-black tracking-tight leading-none mb-1.5 ${isSelected ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'}`}>
                            {item.label}
                          </span>
                          <p className={`text-[0.6rem] font-black uppercase tracking-widest truncate w-full ${isSelected ? 'text-orange-500 opacity-70' : 'text-slate-200'}`}>
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

          <div className="bg-slate-50/50 rounded-[3.5rem] p-12 text-center border-2 border-dashed border-slate-100">
             <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 tracking-tight">상세타입을 선택해 보세요</h3>
             <div className="flex flex-wrap justify-center gap-4">
                {activeItem?.subTypes?.map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDetail(idx);
                      if (selectedId === 'care_svc') {
                        setCareSvcType(idx === 0 ? 'support' : 'expense');
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                 <div className="bg-slate-50/40 rounded-[2.2rem] p-7 flex flex-col gap-1 relative overflow-hidden focus-within:bg-white focus-within:shadow-2xl transition-all border-2 border-transparent focus-within:border-orange-100/50">
                      <label className="text-[0.55rem] font-black text-slate-400 uppercase tracking-widest mb-1 text-left pl-1">성함</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="김리치" className="bg-transparent border-none outline-none text-xl font-black text-slate-800 placeholder:text-slate-200" />
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
                      <div className="flex justify-between items-center pr-2">
                        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="01012345678" className="bg-transparent border-none outline-none text-xl font-black text-slate-800 placeholder:text-slate-200 w-full" />
                        <button className="flex-shrink-0 px-5 py-2.5 bg-slate-900 rounded-[1rem] text-white font-black text-[0.6rem] hover:bg-black transition-all shadow-lg active:scale-95 group flex items-center gap-1">
                           인증
                        </button>
                      </div>
                 </div>
              </div>

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
                  />
                </div>
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
              ) : (selectedId === 'pre' || selectedId === 'pre_family' || healthStatus === 'simple') && selectedId !== 'silson' ? (
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
                />
              ) : (majorId === 'disease' || majorId === 'medical' || majorId === 'family') && 
                  selectedId !== 'silson' && selectedId !== 'fire_simple' && selectedId !== 'brain' && (
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
                 <input type="checkbox" id="terms" className="w-5 h-5 rounded-lg accent-orange-500" />
                 <label htmlFor="terms" className="text-[0.7rem] font-bold text-slate-400 cursor-pointer">
                    개인정보수집 및 활용동의 <span className="underline ml-1 font-black opacity-40">자세히 보기</span>
                 </label>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <motion.button 
                   onClick={handleCalculate}
                   whileHover={{ scale: 1.02, y: -5 }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full py-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded-[2.5rem] text-white text-3xl font-black shadow-[0_30px_70px_-20px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-4 group"
                >
                   무료로 비교 분석하기
                   <ChevronRight size={28} />
                </motion.button>

                <div className="flex flex-col sm:flex-row gap-4">
                   <button className="flex-1 py-5 bg-white rounded-[1.8rem] border border-slate-100 flex items-center justify-center gap-3 font-black text-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                      <MessageCircle size={20} fill="#FEE500" strokeWidth={0} /> 
                      <span className="text-sm">카카오 간편 계산</span>
                   </button>
                   <button className="flex-1 py-5 bg-white rounded-[1.8rem] border border-slate-100 flex items-center justify-center gap-3 font-black text-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                      <Navigation size={20} fill="#03C75A" strokeWidth={0} className="rotate-[225deg]" /> 
                      <span className="text-sm">네이버 간편 계산</span>
                   </button>
                </div>
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
    </section>
  );
};
