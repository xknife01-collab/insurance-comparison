import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Activity, Clock, Baby, Smile, 
  Stethoscope, Calendar, PiggyBank, 
  Car, Home, Brain, TrendingUp, MessageCircle, Navigation,
  Heart, Hospital, Users, Wallet, Flame, Dog, Plane, Target, Scale, Hotel, Sparkles, Plus, Zap, ChevronRight, HelpCircle, HeartHandshake, AlertCircle
} from 'lucide-react';

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
    label: '실손 / 상해 / 입원',
    icon: Hospital,
    accentColor: '#00D7C4',
    items: [
      { id: 'silson', label: '의료실비', description: '병원비 90% 보장', icon: Shield, color: '#00D7C4', bgColor: '#F0FDFA', subTypes: ['4세대 실손', '노후 실손'] },
      { id: 'pre', label: '유병자', description: '아픈 분도 가입', icon: Stethoscope, color: '#2563EB', bgColor: '#EFF6FF', subTypes: ['간편 고지형', '무심사형'] },
      { id: 'surgery', label: '수술/입원', description: '수술비 반복 지급', icon: Activity, color: '#F59E0B', bgColor: '#FFFBEB', subTypes: ['N대 수술비', '상해 수술비'] },
      { id: 'fire_simple', label: '화재', description: '우리집 화재 대비', icon: Flame, color: '#EF4444', bgColor: '#FEF2F2', subTypes: ['주택 화재', '도난 보장'] },
    ]
  },
  {
    id: 'disease',
    label: '3대 질병 (핵심)',
    icon: Activity,
    accentColor: '#F43F5E',
    items: [
      { id: 'cancer', label: '암 (Cancer)', description: '진단비 최대 1억', icon: Shield, color: '#F43F5E', bgColor: '#FFF1F2', subTypes: ['비갱신형', '갱신형'] },
      { id: 'brain', label: '뇌혈관', description: '뇌질환 무제한 보장', icon: Brain, color: '#8B5CF6', bgColor: '#F5F3FF', subTypes: ['뇌출혈', '뇌경색'] },
      { id: 'heart', label: '심장질환', description: '허혈성 심장 집중', icon: Heart, color: '#FB7185', bgColor: '#FFF1F2', subTypes: ['급성 심근경색', '허혈성 심장'] },
    ]
  },
  {
    id: 'care_major',
    label: '간병 / 노후 케어',
    icon: Hotel,
    accentColor: '#7C3AED',
    items: [
      { id: 'care_svc', label: '간병인 보험', description: '24시간 케어 서비스', icon: Hotel, color: '#7C3AED', bgColor: '#F5F3FF', subTypes: ['지원(파견)', '사용(일당)'] },
      { id: 'care_old', label: '치매/간병', description: '부모님 치매 간병', icon: Brain, color: '#B45309', bgColor: '#FFFBEB', subTypes: ['경증 치매', '중증 간병'] },
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
  
  const [careSvcType, setCareSvcType] = useState<'support' | 'expense'>('support');
  const [careStepUp, setCareStepUp] = useState(true);
  
  // Silson specific states
  const [silsonHasCurrent, setSilsonHasCurrent] = useState<'yes' | 'no'>('no');
  const [silson3Month, setSilson3Month] = useState<'yes' | 'no'>('no');
  const [silson1Year, setSilson1Year] = useState<'yes' | 'no'>('no');
  const [silson5Year, setSilson5Year] = useState<'yes' | 'no'>('no');
  
  const [activeTab, setActiveTab] = useState<'standard' | 'simple'>('standard');
  
  // Detailed Coverage States
  const [selectedCancer, setSelectedCancer] = useState(30000000);
  const [selectedBrain, setSelectedBrain] = useState(10000000);
  const [selectedHeart, setSelectedHeart] = useState(10000000);
  const [selectedSurgery, setSelectedSurgery] = useState(300000);
  const [selectedDisability, setSelectedDisability] = useState(10000000);
  const [selectedExemption, setSelectedExemption] = useState<'standard' | 'premium'>('standard');
  
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
    } else if (selectedId === 'dental' || majorId === 'operating' || selectedId === 'silson' || majorId === 'future') {
      // 치아, 실치, 자동차 등은 일반적인 3.X.5 심사 유형을 사용하지 않으므로 standard로 초기화
      setHealthStatus('standard');
    }
  }, [selectedId, majorId]);

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
        cancer: { currentAmount: selectedCancer, targetAmount: 50000000 },
        cerebrovascular: { currentAmount: selectedBrain, targetAmount: 30000000 },
        cardiovascular: { currentAmount: selectedHeart, targetAmount: 30000000 },
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
          focus: dentalFocus
        } : undefined,
        caregiving: selectedId === 'care_svc' ? {
          type: careSvcType,
          isStepUp: careStepUp
        } : undefined,
        silson: selectedId === 'silson' ? {
          hasCurrentSilson: silsonHasCurrent,
          threeMonthTreatment: silson3Month,
          oneYearExam: silson1Year,
          fiveYearTreatment: silson5Year
        } : undefined
      });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4 font-sans">
      <div className="bg-white rounded-[4.5rem] shadow-[0_60px_180px_-40px_rgba(20,40,80,0.12)] p-8 md:p-16 flex flex-col overflow-hidden border border-gray-50">
        
        <div className="flex flex-col gap-20 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex flex-col items-center gap-6 mb-12">
               <div className="text-[0.7rem] font-black text-slate-400 uppercase tracking-[0.3em] opacity-70">
                 국내 35개 전 보험사 실시간 통합 비교
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
                    onClick={() => setSelectedDetail(idx)}
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

              {selectedId === 'care_svc' ? (
                <div className="bg-purple-50/30 rounded-[3rem] p-10 mb-12 border border-purple-100/50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-slate-800">간병 서비스 맞춤 설정</h3>
                     </div>
                     <div className="flex bg-white p-1.5 rounded-2xl border border-purple-100 shadow-sm self-start lg:self-auto">
                        <button 
                          onClick={() => setCareSvcType('support')}
                          className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${careSvcType === 'support' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          간병인 지원 (파견)
                        </button>
                        <button 
                          onClick={() => setCareSvcType('expense')}
                          className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${careSvcType === 'expense' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          간병비 사용 (현금)
                        </button>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="bg-white p-8 rounded-[2.5rem] border border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                           <p className="font-black text-slate-900">체증형 특약 가입</p>
                           <button 
                             onClick={() => setCareStepUp(!careStepUp)}
                             className={`w-14 h-8 rounded-full transition-all relative ${careStepUp ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-200'}`}
                           >
                              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${careStepUp ? 'left-7' : 'left-1'}`}></div>
                           </button>
                        </div>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed mb-4">
                           {careStepUp ? '5년/10년마다 보장 금액이 늘어나 인건비 상승에 대비합니다.' : '물가가 올라도 보장 금액은 고정되며 보험료는 저렴합니다.'}
                        </p>
                     </div>
                  </div>
                </div>
              ) : selectedId === 'dental' ? (
                <div className="bg-emerald-50/30 rounded-[3rem] p-10 mb-12 border border-emerald-100/50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-slate-800">치아 전용 정밀 설계</h3>
                     </div>
                     <div className="flex bg-white p-1.5 rounded-2xl border border-emerald-100 shadow-sm self-start lg:self-auto">
                        <button 
                          onClick={() => setDentalFocus('conservative')}
                          className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${dentalFocus === 'conservative' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          보존 치료 중심 (크라운/레진)
                        </button>
                        <button 
                          onClick={() => setDentalFocus('prosthetic')}
                          className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${dentalFocus === 'prosthetic' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          보철 치료 중심 (임플란트/브릿지)
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left: Notifications */}
                    <div className="space-y-6">
                      <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-4">가입 전 필수 고지 사항</p>
                      
                      {[
                        { label: '1년 내 충치 치료/진단 이력', state: dentalLastYear, setter: setDentalLastYear },
                        { label: '5년 내 잇몸질환으로 발치/수술', state: dentalLast5Years, setter: setDentalLast5Years },
                        { label: '현재 틀니(가철성 의치) 사용 중', state: dentalDentures, setter: setDentalDentures },
                      ].map((q, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                           <span className="text-sm font-black text-slate-700">{q.label}</span>
                           <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                             <button 
                               onClick={() => q.setter('yes')}
                               className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${q.state === 'yes' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300'}`}
                             >
                               예
                             </button>
                             <button 
                               onClick={() => q.setter('no')}
                               className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${q.state === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300'}`}
                             >
                               아니오
                             </button>
                           </div>
                        </div>
                      ))}
                    </div>

                    {/* Right: Coverage Options */}
                    <div className="space-y-8">
                       <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-4">원하는 보장 한도</p>
                       
                       <div className="space-y-3">
                          <p className="text-xs font-black text-slate-500 pl-1">임플란트 보장 횟수</p>
                          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-emerald-50">
                            {[
                              { l: '연간 3개 한도', v: '3' },
                              { l: '연간 무제한', v: 'unlimited' }
                            ].map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => setDentalImplantLimit(opt.v as any)}
                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${dentalImplantLimit === opt.v ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-300'}`}
                              >
                                {opt.l}
                              </button>
                            ))}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <p className="text-xs font-black text-slate-500 pl-1">크라운 치료 보장 (개당)</p>
                          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-emerald-50">
                            {[
                              { l: '20만', v: 200000 },
                              { l: '30만', v: 300000 },
                              { l: '50만', v: 500000 }
                            ].map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => setDentalCrownAmount(opt.v as any)}
                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${dentalCrownAmount === opt.v ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-300'}`}
                              >
                                {opt.l}
                              </button>
                            ))}
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-white/60 rounded-3xl border border-emerald-100 flex items-center gap-4">
                     <Sparkles className="text-emerald-500 shrink-0" size={24} />
                     <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        최근 치료 이력이 없으시다면 <span className="text-emerald-600 font-black">"진단형"</span> 가입을 통해 면책기간 없이 즉시 보장을 받을 수 있는 플랜을 추천해 드립니다.
                     </p>
                  </div>
                </div>
              ) : selectedId === 'silson' ? (
                <div className="bg-blue-50/30 rounded-[3rem] p-10 mb-12 border border-blue-100/50">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                     <h3 className="text-xl font-bold text-slate-800">4세대 실손의료비 가입 전 고지사항</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Policy Checks */}
                    <div className="space-y-4">
                       <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-2">필수 확인 사항</p>
                       <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-700">기존 실손보험 가입 이력</span>
                            <span className="text-[0.65rem] text-slate-400 font-bold">실비는 비례보상으로 중복 가입이 불가능합니다.</span>
                          </div>
                          <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 ml-4">
                            <button onClick={() => setSilsonHasCurrent('yes')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${silsonHasCurrent === 'yes' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300'}`}>가입중</button>
                            <button onClick={() => setSilsonHasCurrent('no')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${silsonHasCurrent === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300'}`}>없음</button>
                          </div>
                       </div>
                    </div>
                    
                    {/* Health Questions */}
                    <div className="space-y-4">
                       <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-2">최근 병력 고지 (필수)</p>
                       {[
                         { title: '최근 3개월 내', desc: '질병 의심 소견, 치료, 입원, 수술, 투약 이력', state: silson3Month, setter: setSilson3Month },
                         { title: '최근 1년 내', desc: '의사로부터 추가 검사(재검사) 이력', state: silson1Year, setter: setSilson1Year },
                         { title: '최근 5년 내', desc: '입원, 수술, 7일 이상 치료, 30일 이상 투약', state: silson5Year, setter: setSilson5Year },
                       ].map((q, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-700">{q.title}</span>
                              <span className="text-[0.65rem] text-slate-400 font-bold">{q.desc}</span>
                            </div>
                            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 ml-4">
                              <button onClick={() => q.setter('yes')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${q.state === 'yes' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300'}`}>예</button>
                              <button onClick={() => q.setter('no')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${q.state === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300'}`}>아니오</button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 p-5 bg-white/60 rounded-2xl border border-blue-100 flex items-start gap-4">
                     <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                     <p className="text-xs text-slate-500 font-bold leading-relaxed">
                        4세대 실손의료비는 비급여 도수치료, 주사료, MRI 등이 <span className="text-blue-600 font-black">특약으로 분리</span>되어 있으며, 비급여금 청구 액수에 따라 매년 보험료가 <span className="text-red-500 font-black">할증 또는 할인(차등제)</span>될 수 있습니다. 고지의무 위반 시 보장이 제한될 수 있습니다.
                     </p>
                  </div>
                </div>
              ) : (majorId === 'disease' || majorId === 'medical' || majorId === 'family') && selectedId !== 'silson' && selectedId !== 'fire_simple' && (
                <div className="bg-orange-50/30 rounded-[3rem] p-10 mb-12 border border-orange-100/50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                        <h3 className="text-xl font-bold text-slate-800">상세 보장 한도 설정</h3>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[0.6rem] font-black text-orange-400 border border-orange-200 px-3 py-1 rounded-full uppercase tracking-widest">Disease Protection</span>
                        <span className="text-[0.7rem] font-black text-slate-500 bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">
                           💡 이 한도는 진단 시 지급되는 목돈 보장액입니다
                        </span>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      { label: '일반암 진단비', state: selectedCancer, setter: setSelectedCancer, options: [{l:'3,000만',v:30000000}, {l:'5,000만',v:50000000}] },
                      { label: '뇌혈관 질환', state: selectedBrain, setter: setSelectedBrain, options: [{l:'1,000만',v:10000000}, {l:'3,000만',v:30000000}] },
                      { label: '심혈관 질환', state: selectedHeart, setter: setSelectedHeart, options: [{l:'1,000만',v:10000000}, {l:'3,000만',v:30000000}] },
                      { label: '수술비(질병/상해)', state: selectedSurgery, setter: setSelectedSurgery, options: [{l:'30만',v:300000}, {l:'100만',v:1000000}] },
                      { label: '질병후유장해(3%~)', state: selectedDisability, setter: setSelectedDisability, options: [{l:'1,000만',v:10000000}, {l:'3,000만',v:30000000}] },
                      { label: '납입면제 범위', state: selectedExemption, setter: setSelectedExemption, options: [{l:'표준형',v:'standard'}, {l:'고급형',v:'premium'}] },
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                         <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest">{item.label}</p>
                         <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
                           {item.options.map((opt, oi) => (
                             <button
                               key={oi}
                               onClick={() => item.setter(opt.v as any)}
                               className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${item.state === opt.v ? 'bg-slate-900 text-white shadow-lg scale-102' : 'text-slate-300 hover:text-slate-500'}`}
                             >
                               {opt.l}
                             </button>
                           ))}
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                   무료 보험료 계산하기
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
