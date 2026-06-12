import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '../utils/supabase/client';
import { supabaseService } from '../utils/supabase/service';
import { MarketingPlaybookTab } from './MarketingPlaybookTab';
import { AdCampaignTab } from './AdCampaignTab';


import { 
  Users, Settings, CreditCard, FileText, Plus, LogOut, CheckCircle, 
  ExternalLink, Clock, Coins, Briefcase, ShieldAlert, ChevronRight, 
  User, Check, AlertCircle, Sparkles, Building, Phone, MapPin, Copy,
  BarChart2, ShieldCheck, Download, BookOpen
} from 'lucide-react';

interface Agency {
  id: string;
  name: string;
  subscription_status: string;
  lead_routing_type: string;
  logo_url?: string;
  phone?: string;
  address?: string;
  current_credits?: number;
}

interface Planner {
  id: string;
  agency_id?: string;
  planner_code: string;
  name: string;
  phone: string;
  is_admin: boolean;
  logo_url?: string;
  profile_image_url?: string;
  greeting_title?: string;
  greeting_content?: string;
  custom_phone?: string;
  custom_address?: string;
  kakao_link?: string;
  subscription_status: string;
  subscription_expires_at?: string;
  company_name?: string;
  registration_number?: string;
}

interface Lead {
  id: number;
  agency_id?: string;
  planner_id?: string;
  name: string;
  phone: string;
  age?: number;
  insurance_type?: string;
  analysis_result?: any;
  monthly_premium?: number;
  raw_payload?: any;
  status: string;
  lead_source: string;
  created_at: string;
  planner_name?: string; // mapped locally
}

interface CreditTransaction {
  id: string;
  agency_id: string;
  planner_id?: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
  planner_name?: string;
}

const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80";
const DEFAULT_LOGO_IMG = "https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=120&h=40&fit=crop&q=80";

const compressImage = (file: File, maxWidth: number = 300, maxHeight: number = 300, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const FIELD_LABELS: Record<string, string> = {
  childBirthDate: '자녀 생년월일',
  currentAmount: '가입 금액',
  targetAmount: '목표 금액',
  paymentType: '납입/갱신 유형',
  paymentPeriod: '납입 기간',
  coveragePeriod: '보장 기간',
  selectedType: '선택 유형',
  subType: '상세 유형',
  isRenewable: '갱신 여부',
  refundType: '환급 유형',
  isStepUp: '체증형 여부',
  objective: '가입 목적',
  monthlyPremium: '월 납입 보험료',
  annualIncome: '연간 소득',
  jobClass: '직업 급수',
  hasLiabilityRider: '일상생활 배상책임 특약',
  hasWaterLeakRider: '누수 피해 특약',
  hasTemporaryHousingRider: '임시 거주비 특약',

  lastYear: '1년 이내 치료력',
  last5Years: '5년 이내 잇몸질환',
  dentures: '틀니 착용 여부',
  implantLimit: '임플란트 한도',
  crownAmount: '크라운 금액',
  focus: '중점 보장',
  diagnosticType: '진단형 여부',

  preferredService: '선호 서비스',
  homeAmount: '재가 치료비',
  facilityAmount: '시설 치료비',
  hasProxyClaim: '대리 청구인 지정',
  hasBrainHistory: '뇌질환 이력',
  hasLtcHistory: '장기요양 이력',
  hasLtcGrade: '장기요양 등급',
  type: '지원 방식',
  isNursingHospital: '요양병원 포함',
  focusGeriatric: '노인성 질환 집중',
  focusIntegrated: '통합 보장 집중',
  dementiaDiagnosis: '치매 진단비',
  monthlyAllowance: '치매 생활자금',
  hasDementiaHistory: '치매 이력',

  hasCurrentSilson: '실손 가입 여부',
  threeMonthTreatment: '3개월 이내 치료력',
  oneYearExam: '1년 이내 추가 검사',
  fiveYearTreatment: '5년 이내 치료력',
  nonReimbursableUsage: '비급여 이용량',
  pregnancyCover: '임신/출산 보장',
  frequentNonSevere: '다빈도 경증 질환',

  hospitalAmount: '입원 일당',
  caregiverOption: '간병인 옵션',
  tertiaryHospital: '상급종합병원 입원비',

  targetAgeGroup: '대상 연령층',
  maturity: '만기 설정',
  focusArea: '집중 보장 영역',
  hasPrenatalRider: '태아 특약 여부',
  weeksPregnancy: '임신 주수',
  isPreFamily: '유병력 가족력',
  illnessType: '보유 질환 종류',
  noAccidentYears: '무사고 기간',

  annualMileage: '연간 주행거리',
  safeDrivingScore: '안전운전 점수',
  hasConnectedCar: '커넥티드카 할인',
  hasBlackbox: '블랙박스 할인',
  hasChildRider: '자녀 할인 특약',
  currentPropertyLimit: '대물 배상 한도',
  currentInjuryType: '자손/자상 유형',
  brand: '차량 브랜드',
  model: '차량 모델',
  year: '차량 연식',
  driverLimit: '운전자 범위',
  ownDamage: '자기차량손해(자차)',
  hasLaneSafety: '차선이탈 방지',
  hasForwardCollision: '전방충돌 방지',
  engine: '배기량/엔진',
  trim: '트림 정보',

  drivingPurpose: '운전 목적',
  planType: '플랜 유형',

  petType: '반려동물 종류',
  petName: '반려동물 이름',
  breed: '품종',
  birthYearMonth: '출생 년월',
  selfPayRatio: '자기부담 비율',
  deductible: '공제금액',
  isRegistered: '등록 여부',
  patellaRider: '슬개골 탈구 특약',
  skinRider: '피부 질환 특약',
  dentalRider: '치과 질환 특약',

  gameType: '경기 방식',
  durationDays: '보장 일수',
  isGroup: '단체 가입 여부',
  companionNames: '동반자 명단',
  hasHoleInOneRider: '홀인원 비용 특약',
  hasEquipmentRider: '골프용품 손해 특약',

  residenceType: '주거 형태',
  occupancyType: '소유 형태',
  buildingArea: '건물 면적',
  structureGrade: '건물 구조 등급',
  householdGoodsLimit: '가재도구 가입금액',
  buildingLimit: '건물 가입금액',
  businessType: '업종 구분',
  buildingGrade: '소방/방화 등급',
  interiorLimit: '시설/인테리어 가입금액',
  equipmentLimit: '집기비품 가입금액',
  inventoryLimit: '재고자산 가입금액',
  hasWaterLeak: '급배수시설 누출 손해',
  hasPremisesLiability: '영업배상책임',
  hasBusinessInterruption: '휴업 손해 지원',
  hasFoodLiability: '음식물 배상책임',
  hasMachineryBreakdown: '기계 손해 특약',

  annuityType: '연금 유형',
  commencementAge: '연금 개시 나이',
  hasIrp: 'IRP 계좌 보유 여부',
  receivingPeriod: '연금 수령 기간',
  savingType: '저축 유형',
  maintenancePeriod: '거치/유지 기간',
  savingsObjective: '저축 목적',
  hasUniversal: '유니버셜 기능',

  deathBenefit: '사망 보험금',
  refundTypeLabel: '해약환급금 유형',
  investmentStyle: '투자 성향',
  equityRatio: '주식형 펀드 편입 비중',
  isAnnuityConversion: '연금 전환 가능 여부',
  isHealthyDiscount: '건강체 할인 여부',
  cancerLimit: '암 진단비 한도',
  similarCancerLimit: '유사암 진단비 한도',
  brainLimit: '뇌혈관 진단비 한도',
  heartLimit: '허혈성심장 진단비 한도',
  cardioLimit: '심장질환 진단비 한도',
  has1to5Surgery: '1-5종 수술비 특약',
  hasTargetedTherapy: '표적항암 약물 치료비',
  hasThrombolysis: '혈전용해 치료비',
  hasLiability: '가족일상생활 배상책임',

  accidentDeathLimit: '상해사망 가입금액',
  accidentDisabilityLimit: '상해후유장해 가입금액',
  fractureLimit: '골절 진단비 한도',
  castLimit: '깁스 치료비 한도',
  surgeryLimit: '상해 수술비 한도',
  hospitalDailyLimit: '상해 입원일당 한도',
  drivingType: '운전 여부',
  hasLeisureRider: '레저활동 특약',

  loanType: '대출 종류',
  loanAmount: '대출 잔액',
  loanPeriod: '대출 잔여기간',
  creditBureau: '신용등급 기관'
};

const formatValue = (key: string, val: any) => {
  if (val === true) return '포함';
  if (val === false) return '미포함';
  if (typeof val === 'number') {
    if (val >= 100000000) {
      return `${(val / 100000000).toLocaleString()}억 원`;
    }
    if (val >= 10000) {
      return `${(val / 10000).toLocaleString()}만 원`;
    }
    return val.toLocaleString();
  }
  if (typeof val === 'string') {
    if (val === 'non-renewable') return '비갱신형';
    if (val === 'renewable') return '갱신형';
    if (val === 'targeted') return '표적항암형';
    if (val === 'personal') return '개인용';
    if (val === 'business') return '업무용';
    if (val === 'mild') return '경증 치매';
    if (val === 'severe') return '중증 간병';
    return val;
  }
  return String(val);
};

const getInsuranceTypeName = (type: string) => {
  const isUnderwriting = type.endsWith('_underwriting');
  const cleanType = type.endsWith('_consult') 
    ? type.slice(0, -8) 
    : type.endsWith('_underwriting')
    ? type.slice(0, -13)
    : type;

  const map: Record<string, { label: string; bgClass: string; textClass: string }> = {
    'remodeling': { label: '내 보험 다이어트 💸', bgClass: 'bg-emerald-500/10 border-emerald-500/25', textClass: 'text-emerald-400' },
    'remodeling_consult': { label: '카톡 정밀설계 요청 💬', bgClass: 'bg-amber-500/10 border-amber-500/25', textClass: 'text-amber-400' },
    'cancer': { label: '암보험 비교분석 🎗️', bgClass: 'bg-red-500/10 border-red-500/25', textClass: 'text-red-400' },
    '암보험': { label: '암보험 비교분석 🎗️', bgClass: 'bg-red-500/10 border-red-500/25', textClass: 'text-red-400' },
    'dementia': { label: '치매간병보험 비교분석 🧠', bgClass: 'bg-indigo-500/10 border-indigo-500/25', textClass: 'text-indigo-400' },
    '치매 간병보험': { label: '치매간병보험 비교분석 🧠', bgClass: 'bg-indigo-500/10 border-indigo-500/25', textClass: 'text-indigo-400' },
    'heart': { label: '심장질환보험 비교분석 ❤️', bgClass: 'bg-pink-500/10 border-pink-500/25', textClass: 'text-pink-400' },
    '심장질환': { label: '심장질환보험 비교분석 ❤️', bgClass: 'bg-pink-500/10 border-pink-500/25', textClass: 'text-pink-400' },
    'cerebrovascular': { label: '뇌혈관질환보험 비교분석 🧠', bgClass: 'bg-purple-500/10 border-purple-500/25', textClass: 'text-purple-400' },
    '뇌혈관': { label: '뇌혈관질환보험 비교분석 🧠', bgClass: 'bg-purple-500/10 border-purple-500/25', textClass: 'text-purple-400' },
    'dental': { label: '치아보험 비교분석 🦷', bgClass: 'bg-sky-500/10 border-sky-500/25', textClass: 'text-sky-400' },
    '치아보험': { label: '치아보험 비교분석 🦷', bgClass: 'bg-sky-500/10 border-sky-500/25', textClass: 'text-sky-400' },
    'driver': { label: '운전자보험 비교분석 🚗', bgClass: 'bg-blue-500/10 border-blue-500/25', textClass: 'text-blue-400' },
    '운전자 보험': { label: '운전자보험 비교분석 🚗', bgClass: 'bg-blue-500/10 border-blue-500/25', textClass: 'text-blue-400' },
    'pet': { label: '반려동물보험 비교분석 🐾', bgClass: 'bg-teal-500/10 border-teal-500/25', textClass: 'text-teal-400' },
    '펫 보험': { label: '반려동물보험 비교분석 🐾', bgClass: 'bg-teal-500/10 border-teal-500/25', textClass: 'text-teal-400' },
    'golf': { label: '골프보험 비교분석 ⛳', bgClass: 'bg-green-500/10 border-green-500/25', textClass: 'text-green-400' },
    '골프 / 레저': { label: '골프보험 비교분석 ⛳', bgClass: 'bg-green-500/10 border-green-500/25', textClass: 'text-green-400' },
    'child': { label: '태아/어린이보험 비교분석 👶', bgClass: 'bg-rose-500/10 border-rose-500/25', textClass: 'text-rose-400' },
    '어린이/신생아': { label: '태아/어린이보험 비교분석 👶', bgClass: 'bg-rose-500/10 border-rose-500/25', textClass: 'text-rose-400' },
  };

  if (type === 'remodeling_consult') return map['remodeling_consult'];

  if (map[cleanType]) {
    const badge = { ...map[cleanType] };
    if (type.endsWith('_consult')) {
      badge.label = `${badge.label.replace(' 비교분석', '')} 카톡요청 💬`;
      badge.bgClass = 'bg-amber-500/10 border-amber-500/25';
      badge.textClass = 'text-amber-400';
    } else if (isUnderwriting) {
      badge.label = `🔍 사전심사 [${badge.label.replace(' 비교분석', '').replace(' 다이어트', '')}]`;
      badge.bgClass = 'bg-orange-500/10 border-orange-500/25';
      badge.textClass = 'text-orange-400';
    }
    return badge;
  }
  
  // translate known types to Korean labels
  const translationMap: Record<string, string> = {
    'indemnity': '실손의료비',
    'preexisting': '간편유병자',
    'dental': '치아',
    'caregiving': '간병인',
    'dementia': '치매간병',
    'surgery': '수술비',
    'cancer': '암보험',
    'cerebrovascular': '뇌혈관질환',
    'heart': '허혈성심장',
    'nursing': '재가/시설간병',
    'child': '어린이',
    'child_sick': '어린이종합',
    'car': '자동차',
    'driver': '운전자',
    'pet': '반려동물',
    'golf': '골프',
    'fire_real': '주택화재',
    'property': '상가/공장화재',
    'annuity': '연금저축',
    'whole': '종신',
    'variable': '변액',
    'legal': '법률행정',
    'credit': '신용보장',
    'health_general': '종합건강',
    'accident': '상해',
    'savings_general': '일반저축'
  };

  const koreanName = translationMap[cleanType] || cleanType;
  if (type.endsWith('_consult')) {
    return {
      label: `${koreanName} 카톡요청 💬`,
      bgClass: 'bg-amber-500/10 border-amber-500/25',
      textClass: 'text-amber-400'
    };
  }
  if (isUnderwriting) {
    return {
      label: `🔍 사전심사 [${koreanName}]`,
      bgClass: 'bg-orange-500/10 border-orange-500/25',
      textClass: 'text-orange-400'
    };
  }

  return {
    label: `${koreanName} 비교분석 📊`,
    bgClass: 'bg-slate-950 border-slate-800',
    textClass: 'text-slate-300'
  };
};

export default function AdminDashboard() {
  const supabase = createClient();
  
  // Auth state simulation
  const [currentUser, setCurrentUser] = useState<{
    role: 'super' | 'agency' | 'planner' | 'guest';
    plannerId?: string;
    agencyId?: string;
    name?: string;
    plannerCode?: string;
    expiresAt?: string;
    subscriptionStatus?: string;
  }>({ role: 'guest' });

  // DB Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);

  const activeBillingAgencyId = currentUser.agencyId || '88888888-8888-4888-a888-888888888888';
  const isIndependentPlanner = currentUser.role === 'planner' && (!currentUser.agencyId || currentUser.agencyId === '88888888-8888-4888-a888-888888888888');

  // Form states (Signup)
  const [signupTab, setSignupTab] = useState<'login' | 'register'>('login');
  const [signupType, setSignupType] = useState<'planner' | 'agency'>('planner');
  const [loginCode, setLoginCode] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Registration Inputs
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGreetingTitle, setRegGreetingTitle] = useState('');
  const [regGreetingContent, setRegGreetingContent] = useState('');
  const [regProfileImg, setRegProfileImg] = useState(DEFAULT_PROFILE_IMG);
  const [regKakao, setRegKakao] = useState('');
  const [codeCheckStatus, setCodeCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Agency Specific Inputs
  const [regAgencyName, setRegAgencyName] = useState('');
  const [regAgencyPhone, setRegAgencyPhone] = useState('');
  const [regAgencyAddress, setRegAgencyAddress] = useState('');
  const [regLogoUrl, setRegLogoUrl] = useState(DEFAULT_LOGO_IMG);
  const [regRoutingType, setRegRoutingType] = useState<'direct' | 'distribute'>('direct');
  
  // Onboarding generated links
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  // Invited Agency parameters
  const [invitedAgencyId, setInvitedAgencyId] = useState<string | null>(null);
  const [invitedAgencyName, setInvitedAgencyName] = useState<string | null>(null);

  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<'leads' | 'settings' | 'billing' | 'planners' | 'profile' | 'marketing' | 'playbook' | 'ad_campaign'>('leads');
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [marketingPeriod, setMarketingPeriod] = useState<'today' | '7days' | 'all'>('all');
  const [statsSubTab, setStatsSubTab] = useState<'marketing' | 'sales'>('marketing');
  const [leadsPeriod, setLeadsPeriod] = useState<'today' | '7days' | 'all'>('all');
  const [leadsCategoryFilter, setLeadsCategoryFilter] = useState<'all' | 'remodeling' | 'compare' | 'underwriting'>('all');
  const [consultCategoryFilter, setConsultCategoryFilter] = useState<'all' | 'remodeling' | 'compare'>('all');
  
  // Credit Billing Ecosystem states
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | 'remodeling' | 'car' | 'topup' | 'adjust'>('all');
  
  // Alert Config State
  const [alertThreshold, setAlertThreshold] = useState<number>(2000);
  const [alertPhone, setAlertPhone] = useState('');
  const [savingAlert, setSavingAlert] = useState(false);
  const [quotaSaving, setQuotaSaving] = useState(false);

  // Edit Profile States
  const [topupLoading, setTopupLoading] = useState(false);

  const handleUpdatePlannerQuota = async (plannerId: string, quota: number) => {
    try {
      setQuotaSaving(true);
      const { error } = await supabaseService
        .from('planners')
        .update({ monthly_credit_quota: quota })
        .eq('id', plannerId);
        
      if (error) {
        alert('한도 설정 수정에 실패했습니다: ' + error.message);
        return;
      }
      
      alert('설계사 월간 한도가 정상적으로 업데이트되었습니다.');
      await fetchData();
    } catch (err: any) {
      alert('오류가 발생했습니다: ' + err.message);
    } finally {
      setQuotaSaving(false);
    }
  };

  const handleSaveAlertSettings = async () => {
    if (!currentUser.agencyId) return;
    try {
      setSavingAlert(true);
      const { error } = await supabaseService
        .from('agencies')
        .update({
          low_credit_alert_threshold: alertThreshold,
          low_credit_alert_phone: alertPhone
        })
        .eq('id', currentUser.agencyId);
        
      if (error) {
        alert('경고 설정 저장에 실패했습니다: ' + error.message);
        return;
      }
      
      alert('크레딧 소진 경보 설정이 정상적으로 저장되었습니다.');
      await fetchData();
    } catch (err: any) {
      alert('오류가 발생했습니다: ' + err.message);
    } finally {
      setSavingAlert(false);
    }
  };

  const handleDownloadTxCsv = () => {
    try {
      const headers = ['일시', '설계사', '유형', '상세 설명', '변동 크레딧'];
      const rows = filteredTransactions.map(tx => [
        new Date(tx.created_at).toLocaleString('ko-KR'),
        tx.planner_name || '시스템/관리자',
        tx.type === 'remodeling' ? '내보험 분석' : tx.type === 'car' ? '자동차 비교' : tx.type === 'topup' ? '충전' : '조정',
        tx.description || '',
        tx.amount
      ]);
      
      const csvContent = "\uFEFF" + [
        headers.join(','),
        ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `credit_transactions_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e: any) {
      alert('CSV 다운로드 중 오류가 발생했습니다: ' + e.message);
    }
  };

  const roiStats = useMemo(() => {
    const spentTxs = transactions.filter(t => t.amount < 0 && (t.type === 'remodeling' || t.type === 'car'));
    const totalSpentCredits = spentTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalCostKRW = totalSpentCredits; // 1 credit = 1 KRW

    const totalLeads = leads.length;
    const completedLeads = leads.filter(l => l.status === '완료' || l.status === 'success').length;
    const conversionRate = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0;
    const cac = totalLeads > 0 ? Math.round(totalCostKRW / totalLeads) : 0;

    return {
      totalSpentCredits,
      totalCostKRW,
      totalLeads,
      completedLeads,
      conversionRate,
      cac
    };
  }, [leads, transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = tx.description?.toLowerCase().includes(txSearch.toLowerCase()) ||
                          tx.planner_name?.toLowerCase().includes(txSearch.toLowerCase());
      const matchType = txTypeFilter === 'all' || tx.type === txTypeFilter;
      return matchSearch && matchType;
    });
  }, [transactions, txSearch, txTypeFilter]);

  const handleTopupCredits = async (agencyId: string, amount: number) => {
    try {
      setTopupLoading(true);
      const { data: agencyData, error: fetchErr } = await supabaseService
        .from('agencies')
        .select('current_credits')
        .eq('id', agencyId)
        .single();
        
      if (fetchErr || !agencyData) {
        alert('대리점 정보를 가져올 수 없습니다: ' + (fetchErr?.message || ''));
        return;
      }
      
      const newCredits = (agencyData.current_credits || 0) + amount;
      
      const { error: updateErr } = await supabaseService
        .from('agencies')
        .update({ current_credits: newCredits })
        .eq('id', agencyId);
        
      if (updateErr) {
        alert('크레딧 충전에 실패했습니다: ' + updateErr.message);
        return;
      }

      // Record transaction history log
      const txType = amount > 0 ? 'topup' : 'adjust';
      const txDesc = amount > 0 
        ? `대시보드 모의 크레딧 충전 (${amount.toLocaleString()})`
        : `관리자 크레딧 조정 수동 차감 (${Math.abs(amount).toLocaleString()})`;
      await supabaseService.from('credit_transactions').insert({
        agency_id: agencyId,
        amount: amount,
        type: txType,
        description: txDesc
      });
      
      alert(`성공적으로 ${amount.toLocaleString()} 크레딧이 조정되었습니다.`);
      await fetchData();
    } catch (err: any) {
      alert('오류가 발생했습니다: ' + err.message);
    } finally {
      setTopupLoading(false);
    }
  };

  const [editKakao, setEditKakao] = useState('');
  const [editGreetingTitle, setEditGreetingTitle] = useState('');
  const [editGreetingContent, setEditGreetingContent] = useState('');
  const [editProfileImg, setEditProfileImg] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editCustomPhone, setEditCustomPhone] = useState('');
  const [editCustomAddress, setEditCustomAddress] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isReg: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64Str = await compressImage(file, 300, 100, 0.7);
      if (isReg) {
        setRegLogoUrl(base64Str);
      } else {
        setEditLogoUrl(base64Str);
      }
    } catch (err) {
      alert("이미지 압축 및 업로드 실패: " + err);
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isReg: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64Str = await compressImage(file, 200, 200, 0.7);
      if (isReg) {
        setRegProfileImg(base64Str);
      } else {
        setEditProfileImg(base64Str);
      }
    } catch (err) {
      alert("이미지 압축 및 업로드 실패: " + err);
    }
  };
  
  // Modal states
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  const [newMemoText, setNewMemoText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [assigningLead, setAssigningLead] = useState<Lead | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Forgot Credentials States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotTab, setForgotTab] = useState<'code' | 'password'>('code');
  const [forgotName, setForgotName] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotResultCode, setForgotResultCode] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');
  
  // Password Reset SMS Simulation
  const [smsStep, setSmsStep] = useState<'input' | 'verify' | 'reset' | 'success'>('input');
  const [generatedSmsCode, setGeneratedSmsCode] = useState('');
  const [enteredSmsCode, setEnteredSmsCode] = useState('');
  const [smsTimer, setSmsTimer] = useState(180);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // Simulation Selector (For demo purposes)
  const handleSimulateLogin = async (role: 'super' | 'agency' | 'planner') => {
    setLoading(true);
    try {
      if (role === 'super') {
        setCurrentUser({
          role: 'super',
          name: '시스템 총관리자',
          subscriptionStatus: 'active'
        });
      } else if (role === 'agency') {
        // Fetch test agency
        const { data: testAgencies } = await supabase.from('agencies').select().limit(1);
        const agency = testAgencies?.[0];
        if (agency) {
          // Find representative planner
          const { data: representative } = await supabase
            .from('planners')
            .select()
            .eq('agency_id', agency.id)
            .eq('is_admin', true)
            .limit(1);
          const repPlanner = representative?.[0];

          setCurrentUser({
            role: 'agency',
            agencyId: agency.id,
            plannerId: repPlanner?.id,
            name: `${agency.name} 대표자`,
            subscriptionStatus: agency.subscription_status,
            expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() // Simulated
          });
        } else {
          alert("먼저 seed_db.py를 실행하거나 가입을 통해 대리점을 등록해주세요.");
        }
      } else if (role === 'planner') {
        // Fetch test planner
        const { data: testPlanners } = await supabase.from('planners').select().eq('planner_code', 'planner_test_1').single();
        if (testPlanners) {
          setCurrentUser({
            role: 'planner',
            plannerId: testPlanners.id,
            agencyId: testPlanners.agency_id,
            name: testPlanners.name,
            plannerCode: testPlanners.planner_code,
            subscriptionStatus: testPlanners.subscription_status,
            expiresAt: testPlanners.subscription_expires_at || new Date(Date.now() + 30 * 86400000).toISOString()
          });
        } else {
          alert("먼저 seed_db.py를 실행하거나 가입을 통해 설계사를 등록해주세요.");
        }
      }
      setActiveTab('leads');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check planner code availability
  const checkCodeAvailability = async () => {
    if (!regCode.trim()) return;
    setCodeCheckStatus('checking');
    try {
      const { data, error } = await supabase
        .from('planners')
        .select('planner_code')
        .eq('planner_code', regCode.trim());
      
      if (data && data.length > 0) {
        setCodeCheckStatus('taken');
      } else {
        setCodeCheckStatus('available');
      }
    } catch (err) {
      setCodeCheckStatus('idle');
    }
  };

  // Perform Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginCode.trim()) return;
    setLoading(true);

    try {
      // Find planner by code
      const { data: planner, error } = await supabase
        .from('planners')
        .select()
        .eq('planner_code', loginCode.trim())
        .single();

      if (error || !planner) {
        setLoginError('등록되지 않은 설계사 고유코드입니다. 파트너 가입을 먼저 진행해 주세요.');
        setLoading(false);
        return;
      }

      // Validate password if set
      if (planner.password && planner.password.trim() !== loginPassword.trim()) {
        setLoginError('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
        setLoading(false);
        return;
      }

      setCurrentUser({
        role: planner.is_admin ? 'agency' : 'planner',
        plannerId: planner.id,
        agencyId: planner.agency_id,
        name: planner.name,
        plannerCode: planner.planner_code,
        subscriptionStatus: planner.subscription_status,
        expiresAt: planner.subscription_expires_at
      });
      setActiveTab('leads');
    } catch (err) {
      setLoginError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Perform Registration (Self-serve)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regCode.trim()) {
      alert("필수 입력 항목을 입력해 주세요.");
      return;
    }
    setLoading(true);

    try {
      // Check code availability once more
      const { data: checkData } = await supabase
        .from('planners')
        .select('planner_code')
        .eq('planner_code', regCode.trim());
      
      if (checkData && checkData.length > 0) {
        alert("이미 사용 중인 설계사 코드입니다.");
        setLoading(false);
        return;
      }

      let agencyId: string | undefined = undefined;
      const trialExpiry = new Date();
      trialExpiry.setDate(trialExpiry.getDate() + 30); // 30 Days Free Trial

      if (signupType === 'agency') {
        if (!regAgencyName.trim()) {
          alert("대리점명을 입력해 주세요.");
          setLoading(false);
          return;
        }

        // 1. Create Agency
        const newAgency = {
          name: regAgencyName,
          phone: regAgencyPhone || regPhone,
          address: regAgencyAddress,
          logo_url: regLogoUrl,
          subscription_status: 'active', // Active during trial
          lead_routing_type: regRoutingType
        };

        const { data: agencyData, error: agencyError } = await supabase
          .from('agencies')
          .insert(newAgency)
          .select()
          .single();

        if (agencyError || !agencyData) {
          alert("대리점 등록에 실패했습니다: " + agencyError?.message);
          setLoading(false);
          return;
        }

        agencyId = agencyData.id;
      } else if (invitedAgencyId) {
        // Apply invited B2B Agency ID
        agencyId = invitedAgencyId;
      }

      // 2. Create Planner
      const newPlanner = {
        agency_id: agencyId,
        planner_code: regCode.trim(),
        password: regPassword.trim(),
        name: regName,
        phone: regPhone,
        is_admin: signupType === 'agency', // True if signing up as agency representative
        profile_image_url: regProfileImg,
        logo_url: regLogoUrl,
        greeting_title: regGreetingTitle || `${regName} 전문 자산관리사`,
        greeting_content: regGreetingContent || "정직하고 신뢰할 수 있는 무료 보장 진단 및 포트폴리오 리모델링을 지원합니다.",
        custom_phone: regPhone,
        custom_address: signupType === 'agency' ? regAgencyAddress : "보험리밸런스 공인설계사",
        kakao_link: regKakao,
        subscription_status: invitedAgencyId ? 'pending' : 'active',
        subscription_expires_at: trialExpiry.toISOString()
      };

      const { data: plannerData, error: plannerError } = await supabase
        .from('planners')
        .insert(newPlanner)
        .select()
        .single();

      if (plannerError || !plannerData) {
        alert("설계사 등록에 실패했습니다: " + plannerError?.message);
        setLoading(false);
        return;
      }

      // 3. Set logged in & Show Welcome
      const personalLink = `${window.location.origin}/?planner=${plannerData.planner_code}`;
      setGeneratedLink(personalLink);
      setShowWelcomeModal(true);

      setCurrentUser({
        role: plannerData.is_admin ? 'agency' : 'planner',
        plannerId: plannerData.id,
        agencyId: plannerData.agency_id,
        name: plannerData.name,
        plannerCode: plannerData.planner_code,
        subscriptionStatus: plannerData.subscription_status,
        expiresAt: plannerData.subscription_expires_at
      });
      setActiveTab('leads');
    } catch (err) {
      alert("회원가입 실패: " + err);
    } finally {
      setLoading(false);
    }
  };

  // Find My ID (Planner Code)
  const handleFindCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotResultCode('');
    
    if (!forgotName.trim() || !forgotPhone.trim()) {
      setForgotError('이름과 연락처를 모두 입력해 주세요.');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('planners')
        .select('planner_code')
        .eq('name', forgotName.trim())
        .eq('phone', forgotPhone.trim())
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        setForgotResultCode(data.planner_code);
      } else {
        setForgotError('일치하는 설계사 정보를 찾을 수 없습니다. 이름과 연락처를 다시 확인해 주세요.');
      }
    } catch (err: any) {
      setForgotError('조회 중 오류가 발생했습니다: ' + err.message);
    }
  };

  // Send SMS Code (Mock Aligo)
  const handleSendSmsCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    
    if (!forgotName.trim() || !forgotPhone.trim() || !forgotCode.trim()) {
      setForgotError('이름, 연락처, 고유코드를 모두 입력해 주세요.');
      return;
    }
    
    try {
      // Check if planner exists
      const { data, error } = await supabase
        .from('planners')
        .select('id')
        .eq('name', forgotName.trim())
        .eq('phone', forgotPhone.trim())
        .eq('planner_code', forgotCode.trim())
        .maybeSingle();
        
      if (error) throw error;
      
      if (!data) {
        setForgotError('일치하는 설계사 정보가 없습니다. 가입 정보를 다시 확인해 주세요.');
        return;
      }
      
      // Simulate sending SMS via Aligo
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedSmsCode(randomCode);
      setSmsTimer(180); // 3 minutes
      setSmsStep('verify');
      
      // Alert user with mock code for easy testing (will integrate Aligo later)
      alert(`[알리고 문자 발송 시뮬레이션]\n\n${forgotPhone} 번호로 인증번호가 발송되었습니다.\n테스트 인증번호: ${randomCode}`);
    } catch (err: any) {
      setForgotError('인증 요청 중 오류가 발생했습니다: ' + err.message);
    }
  };

  // Verify SMS Code
  const handleVerifySmsCode = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    
    if (smsTimer === 0) {
      setForgotError('인증 시간이 만료되었습니다. 다시 인증번호를 요청해 주세요.');
      return;
    }
    
    if (enteredSmsCode.trim() === generatedSmsCode) {
      setSmsStep('reset');
    } else {
      setForgotError('인증번호가 일치하지 않습니다. 다시 입력해 주세요.');
    }
  };

  // Reset Password in Supabase
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    
    if (!newPassword || !newPasswordConfirm) {
      setForgotError('새 비밀번호를 입력해 주세요.');
      return;
    }
    
    if (newPassword !== newPasswordConfirm) {
      setForgotError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    
    try {
      // Find and update planner
      const { error } = await supabase
        .from('planners')
        .update({ password: newPassword.trim() })
        .eq('planner_code', forgotCode.trim())
        .eq('phone', forgotPhone.trim());
        
      if (error) throw error;
      
      setSmsStep('success');
    } catch (err: any) {
      setForgotError('비밀번호 재설정 중 오류가 발생했습니다: ' + err.message);
    }
  };

  // Parse B2B Agency invite parameters on page mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteAgency = params.get('invite_agency');
    if (inviteAgency) {
      setSignupTab('register');
      setSignupType('planner');
      setInvitedAgencyId(inviteAgency);
      
      const fetchInvitedAgencyName = async () => {
        try {
          const { data, error } = await supabase
            .from('agencies')
            .select('name')
            .eq('id', inviteAgency)
            .single();
          if (!error && data) {
            setInvitedAgencyName(data.name);
          }
        } catch (e) {
          console.error("초대 대리점 조회 실패:", e);
        }
      };
      fetchInvitedAgencyName();
    }
  }, []);

  // SMS Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (smsStep === 'verify' && smsTimer > 0) {
      interval = setInterval(() => {
        setSmsTimer((prev) => prev - 1);
      }, 1000);
    } else if (smsTimer === 0) {
      setGeneratedSmsCode('');
    }
    return () => clearInterval(interval);
  }, [smsStep, smsTimer]);

  // Fetch data depending on user role
  const fetchData = async () => {
    if (currentUser.role === 'guest') return;
    setLoading(true);

    try {
      // 1. Fetch Planners & Agencies for mapping and management
      const { data: plannerList } = await supabase.from('planners').select();
      const { data: agencyList } = await supabase.from('agencies').select();
      
      setPlanners(plannerList || []);
      setAgencies(agencyList || []);

      // 4. Fetch Credit Transactions
      let txQuery = supabase.from('credit_transactions').select().order('created_at', { ascending: false });
      if (currentUser.role === 'agency' || currentUser.role === 'planner') {
        txQuery = txQuery.eq('agency_id', activeBillingAgencyId);
      }
      const { data: txList } = await txQuery;
      
      const mappedTx = (txList || []).map(tx => {
        const matchedPlanner = (plannerList || []).find(p => p.id === tx.planner_id);
        return {
          ...tx,
          planner_name: matchedPlanner ? matchedPlanner.name : '시스템/관리자'
        };
      });
      setTransactions(mappedTx as CreditTransaction[]);

      // 5. Pre-populate alert configs
      if (currentUser.role === 'agency' && currentUser.agencyId) {
        const myAgency = (agencyList || []).find(a => a.id === currentUser.agencyId);
        if (myAgency) {
          setAlertThreshold((myAgency as any).low_credit_alert_threshold ?? 2000);
          setAlertPhone((myAgency as any).low_credit_alert_phone ?? '');
        }
      }

      // 2. Fetch Leads based on permission boundaries
      let query = supabase.from('customer_leads').select().order('created_at', { ascending: false });

      if (currentUser.role === 'planner') {
        // Planner can only see their own assigned leads
        query = query.eq('planner_id', currentUser.plannerId);
      } else if (currentUser.role === 'agency') {
        // Agency Admin can see all leads under their agency
        query = query.eq('agency_id', currentUser.agencyId);
      }

      const { data: leadList } = await query;
      
      // Map planner names locally for display
      const mappedLeads = (leadList || []).map(lead => {
        const matchedPlanner = (plannerList || []).find(p => p.id === lead.planner_id);
        return {
          ...lead,
          planner_name: matchedPlanner ? matchedPlanner.name : '미배정'
        };
      });

      setLeads(mappedLeads);

      // 3. Fetch Visitor Logs based on permission boundaries
      let visitorQuery = supabase.from('visitor_logs').select().order('created_at', { ascending: false });

      if (currentUser.role === 'planner') {
        visitorQuery = visitorQuery.eq('planner_code', currentUser.plannerCode);
      } else if (currentUser.role === 'agency') {
        const plannerCodes = (plannerList || [])
          .filter(p => p.agency_id === currentUser.agencyId)
          .map(p => p.planner_code);
        visitorQuery = visitorQuery.in('planner_code', plannerCodes);
      }

      const { data: visitorList } = await visitorQuery;
      setVisitorLogs(visitorList || []);

      // Pre-populate profile editing states
      if (currentUser.plannerId) {
        const myProfile = (plannerList || []).find(p => p.id === currentUser.plannerId);
        if (myProfile) {
          setEditKakao(myProfile.kakao_link || '');
          setEditGreetingTitle(myProfile.greeting_title || '');
          setEditGreetingContent(myProfile.greeting_content || '');
          setEditProfileImg(myProfile.profile_image_url || DEFAULT_PROFILE_IMG);
          setEditLogoUrl(myProfile.logo_url || DEFAULT_LOGO_IMG);
          setEditCustomPhone(myProfile.custom_phone || myProfile.phone || '');
          setEditCustomAddress(myProfile.custom_address || '');
          setEditPassword(myProfile.password || '');
          setEditCompanyName(myProfile.company_name || '');
        }
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever user session shifts
  useEffect(() => {
    fetchData();
  }, [currentUser]);

  // Generate unified chronological timeline for a customer lead
  const getLeadTimeline = (lead: Lead) => {
    const timeline: any[] = [];

    // 1. Initial Creation Event
    if (lead.created_at) {
      const isConsult = lead.insurance_type?.endsWith('_consult') || lead.insurance_type === 'remodeling_consult';
      timeline.push({
        id: 'created',
        type: 'created',
        author: '시스템',
        detail: isConsult 
          ? '카카오톡 1:1 최저가 설계서 상담 신청이 접수되었습니다.' 
          : '무료 보장 진단 및 상담 신청이 접수되었습니다.',
        created_at: lead.created_at
      });
    }

    // 2. Add stored timeline events
    if (lead.raw_payload?.timeline && Array.isArray(lead.raw_payload.timeline)) {
      timeline.push(...lead.raw_payload.timeline);
    }

    // 3. Backward compatibility with memos
    if (lead.raw_payload?.memos && Array.isArray(lead.raw_payload.memos)) {
      lead.raw_payload.memos.forEach((memo: any) => {
        const exists = timeline.some(
          t => t.id === memo.id || 
               (t.type === 'memo' && t.detail === memo.content && t.created_at === memo.created_at)
        );
        if (!exists) {
          timeline.push({
            id: memo.id || `memo-${memo.created_at}`,
            type: 'memo',
            author: memo.author,
            detail: memo.content,
            created_at: memo.created_at
          });
        }
      });
    }

    // Sort: newest first
    return timeline.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // Update lead status
  const handleUpdateStatus = async (leadId: number, newStatus: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      const currentPayload = lead.raw_payload || {};
      const currentTimeline = Array.isArray(currentPayload.timeline) ? currentPayload.timeline : [];

      const statusMap: { [key: string]: string } = {
        'new': '신규 대기',
        'calling': '상담 진행 중',
        'success': '상담 완료(성공)',
        'fail': '상담 종결(실패)'
      };

      const oldStatusText = statusMap[lead.status] || lead.status;
      const newStatusText = statusMap[newStatus] || newStatus;

      const newEvent = {
        id: `status-${Date.now()}`,
        type: 'status_change',
        author: currentUser.role === 'super' ? '총관리자' : (currentUser.name || '관리자'),
        detail: `진행 상태가 [${oldStatusText}]에서 [${newStatusText}](으)로 변경되었습니다.`,
        created_at: new Date().toISOString()
      };

      const updatedPayload = {
        ...currentPayload,
        timeline: [newEvent, ...currentTimeline]
      };

      const { error } = await supabase
        .from('customer_leads')
        .update({ 
          status: newStatus,
          raw_payload: updatedPayload
        })
        .eq('id', leadId);

      if (error) throw error;
      
      const updatedLeads = leads.map(l => l.id === leadId ? { ...l, status: newStatus, raw_payload: updatedPayload } : l);
      setLeads(updatedLeads);

      const nextSelectedLead = updatedLeads.find(l => l.id === leadId);
      if (nextSelectedLead) {
        setSelectedLead(nextSelectedLead);
      }
    } catch (err) {
      alert("상태 수정 실패: " + err);
    }
  };

  // Save consultation memo history
  const handleSaveMemo = async (leadId: number) => {
    if (!newMemoText.trim()) return;

    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      const currentPayload = lead.raw_payload || {};
      const currentMemos = Array.isArray(currentPayload.memos) ? currentPayload.memos : [];
      const currentTimeline = Array.isArray(currentPayload.timeline) ? currentPayload.timeline : [];

      const memoId = Date.now().toString();
      const author = currentUser.role === 'super' || currentUser.role === 'admin' 
        ? '관리자' 
        : (currentUser.name || '설계사');

      const newMemo = {
        id: memoId,
        content: newMemoText.trim(),
        author: author,
        created_at: new Date().toISOString()
      };

      const newTimelineEvent = {
        id: `memo-${memoId}`,
        type: 'memo',
        author: author,
        detail: newMemoText.trim(),
        created_at: new Date().toISOString()
      };

      const updatedPayload = {
        ...currentPayload,
        memos: [newMemo, ...currentMemos],
        timeline: [newTimelineEvent, ...currentTimeline]
      };

      const { error } = await supabase
        .from('customer_leads')
        .update({ raw_payload: updatedPayload })
        .eq('id', leadId);

      if (error) throw error;

      // Update states
      const updatedLeads = leads.map(l => l.id === leadId ? { ...l, raw_payload: updatedPayload } : l);
      setLeads(updatedLeads);
      
      const nextSelectedLead = updatedLeads.find(l => l.id === leadId);
      if (nextSelectedLead) {
        setSelectedLead(nextSelectedLead);
      }
      setNewMemoText('');
    } catch (err) {
      alert("메모 저장 실패: " + err);
    }
  };

  const maskPhoneNumber = (phone?: string) => {
    if (!phone) return '미기입';
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 10) return phone;
    if (clean.length === 11) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 8)}XX${clean.slice(10)}`;
    } else if (clean.length === 10) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 7)}XX${clean.slice(9)}`;
    }
    return phone;
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSendSmsTemplate = (lead: Lead) => {
    const isConsult = lead.insurance_type?.endsWith('_consult') || lead.insurance_type === 'remodeling_consult';
    if (!isConsult) {
      alert("자가진단 리드는 무단 연락이 금지되어 있습니다.");
      return;
    }

    const plannerName = currentUser.name || '보험리밸런스';
    const myProfile = planners.find(p => p.id === currentUser.plannerId);
    const kakaoUrl = myProfile?.kakao_link || '';

    const insuranceLabel = lead.insurance_type || '보험';
    let body = `안녕하세요, ${lead.name} 고객님! 보험리밸런스 ${plannerName} 팀장입니다. 신청하신 ${insuranceLabel} 비교 분석 리포트가 준비되어 안내차 연락드렸습니다.`;
    
    if (kakaoUrl) {
      body += `\n\n아래 카카오톡 링크로 문의해 주시면 더 신속하게 1:1 전용 맞춤 분석 설계안을 확인해 보실 수 있습니다.\n▶ 카톡 상담하기: ${kakaoUrl}`;
    }

    const encodedBody = encodeURIComponent(body);
    window.open(`sms:${lead.phone}?body=${encodedBody}`, '_blank');
  };

  const handleDownloadCSV = (leadsToExport: Lead[], filename: string) => {
    if (leadsToExport.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const csvHeaders = [
      "No",
      "이름",
      "연락처",
      "나이",
      "보험유형",
      "월 보험료",
      "배정 설계사",
      "진행 상태",
      "유입 경로",
      "신청 일시"
    ];

    const rows = leadsToExport.map((l, index) => {
      const statusLabel = 
        l.status === 'new' ? '신규' :
        l.status === 'calling' ? '상담중' :
        l.status === 'completed' || l.status === 'done' ? '완료' : '대기중';

      return [
        index + 1,
        l.name || '미기입',
        (() => {
          const isConsult = l.insurance_type?.endsWith('_consult') || l.insurance_type === 'remodeling_consult';
          const isUnderwriting = l.insurance_type?.includes('_underwriting');
          return (isConsult || isUnderwriting) ? (l.phone || '미기입') : maskPhoneNumber(l.phone);
        })(),
        l.age ? `${l.age}세` : '미기입',
        (() => {
          const isPrecision = l.insurance_type?.includes('remodeling');
          const prefix = isPrecision ? '[정밀분석]' : '[가격비교]';
          const badge = getInsuranceTypeName(l.insurance_type || '');
          return `${prefix} ${badge.label}`;
        })(),
        l.monthly_premium ? `${l.monthly_premium.toLocaleString()}원` : '0원',
        l.planner_name || '미배정',
        statusLabel,
        l.lead_source || '직접 유입',
        new Date(l.created_at).toLocaleString('ko-KR')
      ];
    });

    const csvContent = [
      csvHeaders.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Assign lead to planner (Centralized distribution)
  const handleAssignPlanner = async (leadId: number, plannerId: string) => {
    try {
      const selectedPl = planners.find(p => p.id === plannerId);
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      const currentPayload = lead.raw_payload || {};
      const currentTimeline = Array.isArray(currentPayload.timeline) ? currentPayload.timeline : [];

      const plannerName = selectedPl ? selectedPl.name : '미배정';

      const newEvent = {
        id: `assign-${Date.now()}`,
        type: 'assign',
        author: currentUser.role === 'super' ? '총관리자' : (currentUser.name || '관리자'),
        detail: `[${plannerName}] 설계사에게 상담이 배정되었습니다.`,
        created_at: new Date().toISOString()
      };

      const updatedPayload = {
        ...currentPayload,
        timeline: [newEvent, ...currentTimeline]
      };

      const { error } = await supabase
        .from('customer_leads')
        .update({ 
          planner_id: plannerId,
          status: 'calling', // Mark status as calling when assigned
          raw_payload: updatedPayload
        })
        .eq('id', leadId);

      if (error) throw error;
      
      const updatedLeads = leads.map(l => l.id === leadId ? { 
        ...l, 
        planner_id: plannerId, 
        planner_name: plannerName,
        status: 'calling',
        raw_payload: updatedPayload
      } : l);
      setLeads(updatedLeads);

      const nextSelectedLead = updatedLeads.find(l => l.id === leadId);
      if (nextSelectedLead) {
        setSelectedLead(nextSelectedLead);
      }
      setAssigningLead(null);
    } catch (err) {
      alert("설계사 배정 실패: " + err);
    }
  };

  // Approve invited planner's registration
  const handleApprovePlanner = async (plannerId: string) => {
    try {
      const { error } = await supabase
        .from('planners')
        .update({ subscription_status: 'active' })
        .eq('id', plannerId);

      if (error) throw error;
      
      setPlanners(prev => prev.map(p => p.id === plannerId ? { ...p, subscription_status: 'active' } : p));
      alert("설계사 가입을 승인하였습니다!");
    } catch (err: any) {
      alert("승인 처리 실패: " + err?.message);
    }
  };

  // Reject and delete invited planner's registration
  const handleRejectPlanner = async (plannerId: string) => {
    if (!confirm("정말 이 설계사의 가입 요청을 거절하고 삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase
        .from('planners')
        .delete()
        .eq('id', plannerId);

      if (error) throw error;
      
      setPlanners(prev => prev.filter(p => p.id !== plannerId));
      alert("가입 요청이 거절 및 삭제되었습니다.");
    } catch (err: any) {
      alert("거절 처리 실패: " + err?.message);
    }
  };

  // Save profile and custom landing page elements
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.plannerId) {
      alert("로그인 정보가 없거나 프로필을 수정할 권한이 없습니다.");
      return;
    }
    if (!editCustomPhone || editCustomPhone.trim() === '') {
      alert("대표 상담 연락처는 필수 입력 항목입니다. (예: 010-1234-5678)");
      return;
    }
    if (!editCompanyName || editCompanyName.trim() === '') {
      alert("지점(소속) 이름은 필수 입력 항목입니다. (예: 인카금융서비스 강남지점)");
      return;
    }
    if (!editCustomAddress || editCustomAddress.trim() === '') {
      alert("지점 주소 및 인증 문구는 필수 입력 항목입니다. (예: 인카금융서비스 공식 인증 설계사 또는 서울시 강남구 테헤란로 123)");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('planners')
        .update({
          kakao_link: editKakao,
          greeting_title: editGreetingTitle,
          greeting_content: editGreetingContent,
          profile_image_url: editProfileImg,
          logo_url: editLogoUrl,
          custom_phone: editCustomPhone,
          custom_address: editCustomAddress,
          password: editPassword,
          company_name: editCompanyName
        })
        .eq('id', currentUser.plannerId);

      if (error) throw error;

      if (currentUser.role === 'agency' && currentUser.agencyId) {
        const { error: agencyLogoError } = await supabase
          .from('agencies')
          .update({ logo_url: editLogoUrl })
          .eq('id', currentUser.agencyId);
        if (agencyLogoError) {
          console.error("Failed to update agency logo:", agencyLogoError);
        }
      }
      alert("프로필 및 랜딩페이지 설정이 실시간으로 저장되었습니다. 즉시 내 홈페이지에 반영됩니다.");
      await fetchData();
    } catch (err) {
      alert("프로필 저장 중 오류가 발생했습니다: " + err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Agency DB Distribution Type in Settings
  const handleUpdateRouting = async (newType: string) => {
    if (!currentUser.agencyId) return;
    try {
      const { error } = await supabase
        .from('agencies')
        .update({ lead_routing_type: newType })
        .eq('id', currentUser.agencyId);

      if (error) throw error;
      setAgencies(prev => prev.map(a => a.id === currentUser.agencyId ? { ...a, lead_routing_type: newType } : a));
      alert("DB 분배 설정이 변경되었습니다.");
    } catch (err) {
      alert("설정 변경 실패: " + err);
    }
  };

  // Simulate billing payment extension (Extend subscription by 30 days)
  const handleRenewSubscription = async () => {
    setPaymentProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Network delay simulation

    try {
      const currentExpiry = currentUser.expiresAt ? new Date(currentUser.expiresAt) : new Date();
      currentExpiry.setDate(currentExpiry.getDate() + 30);
      const newExpiryStr = currentExpiry.toISOString();

      if (currentUser.role === 'planner' && currentUser.plannerId) {
        const { error } = await supabase
          .from('planners')
          .update({ 
            subscription_status: 'active',
            subscription_expires_at: newExpiryStr
          })
          .eq('id', currentUser.plannerId);

        if (error) throw error;
      } else if (currentUser.role === 'agency' && currentUser.agencyId) {
        const { error } = await supabase
          .from('agencies')
          .update({ subscription_status: 'active' })
          .eq('id', currentUser.agencyId);

        if (error) throw error;

        // Also update the representative planner's expires_at
        const { error: plError } = await supabase
          .from('planners')
          .update({ 
            subscription_status: 'active',
            subscription_expires_at: newExpiryStr
          })
          .eq('id', currentUser.plannerId || '');
      }

      setCurrentUser(prev => ({
        ...prev,
        subscriptionStatus: 'active',
        expiresAt: newExpiryStr
      }));

      setPaymentSuccess(true);
    } catch (err) {
      alert("결제 갱신 중 오류가 발생했습니다: " + err);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Calculate subscription remaining days
  const getDaysRemaining = () => {
    if (!currentUser.expiresAt) return 0;
    const diff = new Date(currentUser.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  // Get current active agency routing type
  const getCurrentRoutingType = () => {
    if (!currentUser.agencyId) return 'direct';
    const ag = agencies.find(a => a.id === currentUser.agencyId);
    return ag ? ag.lead_routing_type : 'direct';
  };

  const isInKstDateRange = (dateStr: string, rangeType: 'today' | '7days' | 'all') => {
    if (rangeType === 'all') return true;
    if (!dateStr) return false;

    const logEpoch = new Date(dateStr).getTime();
    if (isNaN(logEpoch)) return false;

    // Shift epoch to KST (UTC+9)
    const logKstEpoch = logEpoch + (9 * 60 * 60 * 1000);
    const logKstDate = new Date(logKstEpoch);

    const nowKstEpoch = Date.now() + (9 * 60 * 60 * 1000);
    const nowKstDate = new Date(nowKstEpoch);

    if (rangeType === 'today') {
      return logKstDate.getUTCFullYear() === nowKstDate.getUTCFullYear() &&
             logKstDate.getUTCMonth() === nowKstDate.getUTCMonth() &&
             logKstDate.getUTCDate() === nowKstDate.getUTCDate();
    }

    if (rangeType === '7days') {
      const todayKstStartEpoch = Date.UTC(
        nowKstDate.getUTCFullYear(),
        nowKstDate.getUTCMonth(),
        nowKstDate.getUTCDate(),
        0, 0, 0, 0
      );
      const sevenDaysAgoStartEpoch = todayKstStartEpoch - (6 * 24 * 60 * 60 * 1000);
      return logKstEpoch >= sevenDaysAgoStartEpoch;
    }

    return true;
  };

  const getFilteredVisitorLogs = () => {
    return visitorLogs.filter(log => isInKstDateRange(log.created_at, marketingPeriod));
  };

  const getFilteredLeads = () => {
    return leads.filter(lead => isInKstDateRange(lead.created_at, marketingPeriod));
  };

  const getFilteredAnalysisLeads = () => {
    return leads.filter(lead => {
      const dateMatch = isInKstDateRange(lead.created_at, leadsPeriod);
      if (!dateMatch) return false;

      const isConsult = lead.insurance_type?.endsWith('_consult') || lead.insurance_type === 'remodeling_consult';
      if (isConsult) return false;

      if (leadSearchTerm.trim() !== '') {
        const term = leadSearchTerm.toLowerCase().trim();
        const nameMatch = lead.name?.toLowerCase().includes(term);
        const phoneMatch = lead.phone?.includes(term);
        const codeMatch = lead.raw_payload?.simulation_code?.toLowerCase().includes(term);
        if (!nameMatch && !phoneMatch && !codeMatch) return false;
      }

      if (leadsCategoryFilter === 'all') return true;
      if (leadsCategoryFilter === 'remodeling') return lead.insurance_type === 'remodeling';
      if (leadsCategoryFilter === 'compare') {
        return lead.insurance_type !== 'remodeling' && !lead.insurance_type?.includes('_underwriting');
      }
      if (leadsCategoryFilter === 'underwriting') {
        return lead.insurance_type?.includes('_underwriting');
      }
      return true;
    });
  };

  const getFilteredConsultLeads = () => {
    return leads.filter(lead => {
      const dateMatch = isInKstDateRange(lead.created_at, leadsPeriod);
      if (!dateMatch) return false;

      const isConsult = lead.insurance_type?.endsWith('_consult') || lead.insurance_type === 'remodeling_consult';
      if (!isConsult) return false;

      if (leadSearchTerm.trim() !== '') {
        const term = leadSearchTerm.toLowerCase().trim();
        const nameMatch = lead.name?.toLowerCase().includes(term);
        const phoneMatch = lead.phone?.includes(term);
        const codeMatch = lead.raw_payload?.simulation_code?.toLowerCase().includes(term);
        if (!nameMatch && !phoneMatch && !codeMatch) return false;
      }

      if (consultCategoryFilter === 'all') return true;
      if (consultCategoryFilter === 'remodeling') {
        return lead.insurance_type.includes('remodeling');
      }
      if (consultCategoryFilter === 'compare') {
        return !lead.insurance_type.includes('remodeling');
      }
      return true;
    });
  };

  const renderLeadsTable = (leadsList: Lead[]) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-4">고객 정보</th>
              <th className="py-3 px-4">보험 종류</th>
              <th className="py-3 px-4">월 보험료</th>
              <th className="py-3 px-4">유입 소스</th>
              <th className="py-3 px-4">담당 설계사</th>
              <th className="py-3 px-4">처리 현황</th>
              <th className="py-3 px-4 text-right">상세진단</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-semibold">
            {leadsList.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-800/20 transition-all">
                <td className="py-4.5 px-4 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-extrabold text-sm text-white">{lead.name}</p>
                    {lead.raw_payload?.simulation_code && (
                      <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-black uppercase tracking-wider">
                        {lead.raw_payload.simulation_code}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {(() => {
                      const isConsult = lead.insurance_type?.endsWith('_consult') || lead.insurance_type === 'remodeling_consult';
                      const isUnderwriting = lead.insurance_type?.includes('_underwriting');
                      return (isConsult || isUnderwriting) ? lead.phone : maskPhoneNumber(lead.phone);
                    })()} • {lead.age}세
                  </p>
                  <p className="text-[9px] text-slate-500 font-black">
                    ⏱️ 비교: {new Date(lead.created_at).toLocaleString('ko-KR')}
                  </p>
                </td>
                <td className="py-4.5 px-4 font-bold text-slate-300">
                  <div className="flex flex-col gap-1.5 items-start">
                    {(() => {
                      const isPrecision = lead.insurance_type?.includes('remodeling');
                      return (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                          isPrecision 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {isPrecision ? '내보험 정밀분석 🔍' : '실시간 가격비교 📊'}
                        </span>
                      );
                    })()}
                    {(() => {
                      const badge = getInsuranceTypeName(lead.insurance_type || '');
                      return (
                        <span className={`px-2.5 py-1 rounded-md text-[10px] border font-black ${badge.bgClass} ${badge.textClass}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                  </div>
                </td>
                <td className="py-4.5 px-4 font-black text-orange-400">
                  {lead.monthly_premium?.toLocaleString() || 0} 원
                </td>
                <td className="py-4.5 px-4 text-slate-400 font-bold text-[10px] uppercase">
                  {lead.lead_source === 'direct' && '개인직송 (Direct)'}
                  {lead.lead_source === 'distribute' && '본사분배 (Central)'}
                  {lead.lead_source === 'organic' && '오가닉 유입'}
                </td>
                <td className="py-4.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-300">{lead.planner_name}</span>
                    {currentUser.role === 'agency' && (
                      <button 
                        onClick={() => setAssigningLead(lead)}
                        className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-[9px] font-black rounded-md text-slate-300 cursor-pointer"
                      >
                        재지정
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-4.5 px-4">
                  <select 
                    value={lead.status}
                    onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-1 px-2 text-white font-bold outline-none cursor-pointer focus:border-orange-500/40"
                  >
                    <option value="new">신규 (New)</option>
                    <option value="calling">상담중 (Calling)</option>
                    <option value="completed">계약완료 (Completed)</option>
                    <option value="canceled">취소/부재 (Canceled)</option>
                  </select>
                </td>
                <td className="py-4.5 px-4 text-right">
                  <button 
                    onClick={() => setSelectedLead(lead)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/20 hover:border-transparent rounded-lg font-black transition-all cursor-pointer text-[10px]"
                  >
                    결과지 열람
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getTodayVisitors = () => {
    return visitorLogs.filter(log => isInKstDateRange(log.created_at, 'today')).length;
  };

  const getChannelStats = () => {
    const channels = [
      { key: 'google_ads', name: '구글 키워드/디스플레이 광고', iconColor: 'bg-blue-500' },
      { key: 'naver_gfa', name: '네이버 디스플레이 광고 (GFA)', iconColor: 'bg-emerald-600' },
      { key: 'naver', name: '네이버 일반/검색', iconColor: 'bg-emerald-500' },
      { key: 'facebook', name: '페이스북 스폰서드 광고', iconColor: 'bg-indigo-600' },
      { key: 'instagram', name: '인스타그램 피드/스토리 광고', iconColor: 'bg-pink-500' },
      { key: 'tiktok', name: '틱톡 동영상 광고', iconColor: 'bg-cyan-400' },
      { key: 'google', name: '구글 일반/검색', iconColor: 'bg-red-500' },
      { key: 'organic', name: '일반/자연 유입 (Direct)', iconColor: 'bg-slate-600' },
    ];

    const filteredLogs = getFilteredVisitorLogs();
    const filteredLeads = getFilteredLeads();

    const stats = channels.map(ch => {
      const visits = filteredLogs.filter(log => log.utm_source === ch.key).length;
      const conversions = filteredLeads.filter(lead => {
        const leadSrc = lead.raw_payload?.utm_source || 'organic';
        return leadSrc === ch.key;
      }).length;
      const rate = visits > 0 ? ((conversions / visits) * 100) : 0;
      return {
        ...ch,
        visits,
        conversions,
        rate
      };
    });

    return stats.sort((a, b) => b.visits - a.visits);
  };

  const getSalesStats = () => {
    // 1. Planner stats
    const plannerMap: Record<string, { name: string; total: number; calling: number; completed: number; revenue: number }> = {};
    
    // Initialize planners
    planners.forEach(p => {
      plannerMap[p.id] = { name: p.name, total: 0, calling: 0, completed: 0, revenue: 0 };
    });
    // Add fallback for unassigned
    plannerMap['unassigned'] = { name: '미배정', total: 0, calling: 0, completed: 0, revenue: 0 };

    leads.forEach(l => {
      const pId = l.planner_id || 'unassigned';
      if (!plannerMap[pId]) {
        plannerMap[pId] = { name: l.planner_name || '외부 설계사', total: 0, calling: 0, completed: 0, revenue: 0 };
      }
      plannerMap[pId].total += 1;
      if (l.status === 'calling') {
        plannerMap[pId].calling += 1;
      } else if (l.status === 'completed' || l.status === 'done') {
        plannerMap[pId].completed += 1;
      }
      if (l.monthly_premium) {
        plannerMap[pId].revenue += l.monthly_premium;
      }
    });

    const plannerStats = Object.values(plannerMap).sort((a, b) => b.total - a.total);

    // 2. Product Category stats
    const categoryMap: Record<string, { count: number; totalPremium: number }> = {};
    leads.forEach(l => {
      const type = l.insurance_type || '기타';
      if (!categoryMap[type]) {
        categoryMap[type] = { count: 0, totalPremium: 0 };
      }
      categoryMap[type].count += 1;
      if (l.monthly_premium) {
        categoryMap[type].totalPremium += l.monthly_premium;
      }
    });
    const categoryStats = Object.entries(categoryMap).map(([name, val]) => ({
      name,
      count: val.count,
      avgPremium: val.count > 0 ? Math.round(val.totalPremium / val.count) : 0,
      share: leads.length > 0 ? (val.count / leads.length) * 100 : 0
    })).sort((a, b) => b.count - a.count);

    // 3. Demographic stats
    let maleCount = 0;
    let femaleCount = 0;
    const ageGroups = { '20s_under': 0, '30s': 0, '40s': 0, '50s_over': 0 };

    leads.forEach(l => {
      const gender = l.raw_payload?.gender;
      if (gender === 'M') maleCount++;
      else if (gender === 'F') femaleCount++;

      const age = l.age;
      if (age !== undefined) {
        if (age < 30) ageGroups['20s_under']++;
        else if (age < 40) ageGroups['30s']++;
        else if (age < 50) ageGroups['40s']++;
        else ageGroups['50s_over']++;
      }
    });

    const totalDemographics = leads.length || 1;
    const genderStats = {
      maleRate: (maleCount / totalDemographics) * 100,
      femaleRate: (femaleCount / totalDemographics) * 100
    };

    return {
      plannerStats,
      categoryStats,
      genderStats,
      ageGroups
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* ── 상단 시뮬레이터 퀵 토글 바 ── */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span>B2B SaaS 시뮬레이터 테스트 패널:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button 
            onClick={() => handleSimulateLogin('super')}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${currentUser.role === 'super' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            총관리자 뷰
          </button>
          <button 
            onClick={() => handleSimulateLogin('agency')}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${currentUser.role === 'agency' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            대리점주 뷰
          </button>
          <button 
            onClick={() => handleSimulateLogin('planner')}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${currentUser.role === 'planner' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            설계사 뷰
          </button>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          {currentUser.role !== 'guest' && (
            <button 
              onClick={() => setCurrentUser({ role: 'guest' })}
              className="px-2.5 py-1 bg-red-950/40 text-red-400 border border-red-900/30 rounded-md hover:bg-red-900/40 hover:text-white transition-all text-[11px] font-bold cursor-pointer"
            >
              로그아웃 (가입 폼 이동)
            </button>
          )}
        </div>
      </div>

      {/* ── GUEST / ONBOARDING SIGNUP VIEW ── */}
      {currentUser.role === 'guest' ? (
        <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center gap-12">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs font-black uppercase tracking-widest">
              B2B SaaS Partners
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              나만의 독점 핀테크 플랫폼을 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 font-black">즉시 구축</span>하세요
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-bold break-keep">
              대리점과 설계사의 이름으로 즉시 생성되는 국내 유일의 초고속 보험 비교 엔진. 상담 현장에서 태블릿으로 0.1초 만에 보장을 진단해 신뢰를 얻고, 내 브랜드 플랫폼으로 직접 마케팅하여 고품질 DB를 만드세요. 신규 가입 시 첫 30일간 기능 제약 없이 100% 무료 체험
            </p>
          </div>

          {/* 💡 [업데이트된 저품질 DB vs 내 플랫폼 수집 DB 비교표] */}
          <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 md:p-8 space-y-6 backdrop-blur-xl">
            <div className="text-center space-y-2">
              <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                실시간 비교 분석
              </span>
              <h2 className="text-lg md:text-xl font-black text-white">
                💸 아직도 비싼 돈을 주고 전화조차 안 받는 저품질 DB를 사고 계십니까?
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-1/4">구분</th>
                    <th className="py-3 px-4 w-3/8 text-red-400 bg-red-500/5">❌ 시중에서 비싸게 구매하는 DB</th>
                    <th className="py-3 px-4 w-3/8 text-emerald-400 bg-emerald-500/5">✨ 내 플랫폼으로 수집하는 자발적 DB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-300">
                  <tr className="hover:bg-slate-800/10">
                    <td className="py-4 px-4 font-bold text-white">유입 경로</td>
                    <td className="py-4 px-4 bg-red-500/5 text-slate-400">경품 응모, 단순 동의 등으로 영혼 없이 수집됨</td>
                    <td className="py-4 px-4 bg-emerald-500/5">고객이 본인의 이름과 번호를 넣고 비교 결과를 직접 확인</td>
                  </tr>
                  <tr className="hover:bg-slate-800/10">
                    <td className="py-4 px-4 font-bold text-white">신뢰 관계</td>
                    <td className="py-4 px-4 bg-red-500/5 text-slate-400">누군지도 모르고 전화가 오기 때문에 거절률 95%</td>
                    <td className="py-4 px-4 bg-emerald-500/5">이미 내 이름과 프로필이 박힌 진단 화면을 본 상태에서 상담 신청</td>
                  </tr>
                  <tr className="hover:bg-slate-800/10">
                    <td className="py-4 px-4 font-bold text-white">DB 퀄리티</td>
                    <td className="py-4 px-4 bg-red-500/5 text-slate-400">단순 이름, 연령, 연락처가 정보의 전부</td>
                    <td className="py-4 px-4 bg-emerald-500/5 space-y-3">
                      <p className="font-extrabold text-white">이름/연락처는 기본, 고객의 상세 보장 분석 데이터 완벽 탑재!</p>
                      <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3.5 space-y-1.5 font-mono text-[10px] text-slate-400">
                        <p className="text-orange-400 font-extrabold border-b border-slate-900 pb-1.5 mb-1.5">[예: 암보험 상담 신청 시 어드민 자동 연동 정보]</p>
                        <p>• 일반암 진단비: <span className="text-emerald-400 font-bold">정상 (5,000만 원)</span></p>
                        <p>• 표적항암 치료비: <span className="text-emerald-400 font-bold">우수 (포함)</span></p>
                        <p>• 재발/전이암 보장: <span className="text-orange-400 font-bold">권장 (미포함)</span></p>
                        <p>• 납입/갱신 유형: <span className="text-emerald-400 font-bold">정상 (비갱신형)</span></p>
                        <p className="text-[9px] text-slate-500 pt-1 border-t border-slate-900 mt-1">※ 0.1초 만에 고객의 보험 보장 구멍을 파악하고 시작하는 진짜 DB</p>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/10">
                    <td className="py-4 px-4 font-bold text-white">비용 한계</td>
                    <td className="py-4 px-4 bg-red-500/5 text-slate-400">한 건당 수만 원의 고비용 지출, 누적 구매 부담</td>
                    <td className="py-4 px-4 bg-emerald-500/5">내 플랫폼이므로 추가 비용 제로, 무제한 리드 수집 가능</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-center text-xs font-black">
              "고객이 직접 내 브랜드 비교 사이트에서 0.1초 분석을 마치고 자발적으로 요청한 상담은 성약률이 3배 이상 높습니다."
            </div>
          </div>

          <div className="w-full bg-slate-900/80 border border-slate-800/80 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Tabs */}
            <div className="flex border-b border-slate-800/80">
              <button 
                onClick={() => { setSignupTab('login'); setLoginError(''); }}
                className={`flex-1 py-5 text-center font-bold text-sm transition-all border-b-2 cursor-pointer ${signupTab === 'login' ? 'border-orange-500 text-white bg-slate-950/20' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                설계사 간편 로그인
              </button>
              <button 
                onClick={() => setSignupTab('register')}
                className={`flex-1 py-5 text-center font-bold text-sm transition-all border-b-2 cursor-pointer ${signupTab === 'register' ? 'border-orange-500 text-white bg-slate-950/20' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                파트너 가입 / 30일 무료 신청
              </button>
            </div>

            <div className="p-8 md:p-12">
              {signupTab === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">설계사 고유코드</label>
                    <input 
                      type="text" 
                      placeholder="가입 시 입력한 고유코드를 입력하세요 (예: planner_test_1)" 
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 rounded-xl py-3 px-4 outline-none transition-all text-sm text-white font-bold"
                    />
                    <p className="text-[10px] text-slate-500 leading-normal font-medium">
                      💡 데모 가입된 기본 테스트 설계사 코드는 <strong>planner_test_1</strong> 입니다.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">비밀번호</label>
                    <input 
                      type="password" 
                      placeholder="비밀번호를 입력하세요" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 rounded-xl py-3 px-4 outline-none transition-all text-sm text-white font-bold"
                    />
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/30 text-red-400 rounded-lg text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? '로그인 중...' : '파트너 대시보드 로그인'}
                  </button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setSmsStep('input');
                        setForgotError('');
                        setForgotResultCode('');
                        setForgotName('');
                        setForgotPhone('');
                        setForgotCode('');
                        setEnteredSmsCode('');
                        setNewPassword('');
                        setNewPasswordConfirm('');
                      }}
                      className="text-xs text-slate-500 hover:text-slate-300 font-bold transition-all underline cursor-pointer"
                    >
                      🔑 설계사 아이디(고유코드) / 비밀번호 찾기
                    </button>
                  </div>
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegister} className="space-y-10">
                  {/* Step 1: Type Selection / Invitation Header */}
                  {invitedAgencyId ? (
                    <div className="bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-950 border border-blue-500/20 rounded-2xl p-6 text-left space-y-2.5 animate-in slide-in-from-top-4 duration-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                          대리점 초대 가입 (Invited)
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-white">
                        소속 설계사 가입: <span className="text-blue-400 font-extrabold">{invitedAgencyName || '대리점 확인 중...'}</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-bold leading-normal break-keep">
                        해당 대리점의 소속 설계사 가입 링크를 통해 진입하셨습니다. 가입을 완료하시면 자동으로 소속 설계사로 신청되며, 대리점 관리자가 승인한 후 정상적인 대시보드 이용이 가능합니다.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">파트너십 가입 유형 선택</label>
                      <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* Individual Planner */}
                        <div 
                          onClick={() => setSignupType('planner')}
                          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-44 ${signupType === 'planner' ? 'bg-slate-950/40 border-orange-500 shadow-lg' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                        >
                          {signupType === 'planner' && (
                            <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase">
                              선택됨
                            </div>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                                <User className="w-4 h-4" />
                              </div>
                              <h3 className="font-extrabold text-base text-white">개인 설계사 독립 플랜</h3>
                            </div>
                            <p className="text-[11px] text-slate-400 font-bold leading-normal break-keep">
                              개인 고유 링크로 0.1초 무료 진단 렌딩을 배포하여 실시간 리드를 독점 수집합니다.
                            </p>
                          </div>
                          <div className="border-t border-slate-800 pt-3 mt-4 flex items-end justify-between">
                            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md font-bold">첫 달 무료 혜택</span>
                            <span className="text-sm font-black text-white">월 50,000 원</span>
                          </div>
                        </div>

                        {/* Agency Plan */}
                        <div 
                          onClick={() => setSignupType('agency')}
                          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-44 ${signupType === 'agency' ? 'bg-slate-950/40 border-orange-500 shadow-lg' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                        >
                          {signupType === 'agency' && (
                            <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase">
                              선택됨
                            </div>
                          )}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                                <Building className="w-4 h-4" />
                              </div>
                              <h3 className="font-extrabold text-base text-white">대리점(GA) 단체 플랜</h3>
                            </div>
                            <p className="text-[11px] text-slate-400 font-bold leading-normal break-keep">
                              대리점 단위 통합 관리자 콘솔을 운영하며, 소속 설계사들을 등록 및 DB 분배 정책을 관리합니다.
                            </p>
                          </div>
                          <div className="border-t border-slate-800 pt-3 mt-4 flex items-end justify-between">
                            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md font-bold">첫 달 무료 혜택</span>
                            <span className="text-sm font-black text-white">월 500,000 원</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Step 2: Information Input */}
                  <div className="space-y-6 border-t border-slate-800/80 pt-8">
                    <h3 className="font-extrabold text-lg text-white border-l-4 border-orange-500 pl-3">
                      기본 파트너 정보 입력
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">이름 (대표 설계사명)*</label>
                        <input 
                          type="text" 
                          placeholder="실명을 입력해 주세요" 
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">연락처*</label>
                        <input 
                          type="text" 
                          placeholder="예: 010-1234-5678" 
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">희망 설계사 고유코드* (영문/숫자 혼용 권장)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="예: mylink100" 
                            value={regCode}
                            onChange={(e) => {
                              setRegCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                              setCodeCheckStatus('idle');
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                            required
                          />
                          <button 
                            type="button"
                            onClick={checkCodeAvailability}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 rounded-xl text-xs transition-all cursor-pointer shrink-0"
                          >
                            중복 검사
                          </button>
                        </div>
                        {codeCheckStatus === 'checking' && <p className="text-[10px] text-blue-400 font-bold">코드 검사 중...</p>}
                        {codeCheckStatus === 'available' && <p className="text-[10px] text-emerald-400 font-bold">✓ 사용 가능한 고유코드입니다.</p>}
                        {codeCheckStatus === 'taken' && <p className="text-[10px] text-red-400 font-bold">✗ 이미 등록된 코드입니다. 다른 코드를 사용해 주세요.</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">로그인 비밀번호*</label>
                        <input 
                          type="password" 
                          placeholder="대시보드 로그인 시 사용할 비밀번호" 
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">카카오톡 상담 연결 링크 (오픈채팅/채널 주소)</label>
                        <input 
                          type="url" 
                          placeholder="예: https://open.kakao.com/o/..." 
                          value={regKakao}
                          onChange={(e) => setRegKakao(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">메인 랜딩페이지 한줄 인사말 제목</label>
                        <input 
                          type="text" 
                          placeholder="예: 보장 낭비를 해결하는 정직한 전문가" 
                          value={regGreetingTitle}
                          onChange={(e) => setRegGreetingTitle(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">메인 랜딩페이지 한줄 인사말 본문</label>
                        <input 
                          type="text" 
                          placeholder="예: 불필요한 과납 보장을 전부 다 아껴드리겠습니다." 
                          value={regGreetingContent}
                          onChange={(e) => setRegGreetingContent(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                        />
                      </div>

                      {/* Profile Image Upload */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">프로필 사진 등록</label>
                        <div className="flex items-center gap-4">
                          <img 
                            src={regProfileImg} 
                            alt="Profile Preview" 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-950 shrink-0"
                          />
                          <div className="flex-1">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleProfileUpload(e, true)}
                              className="hidden" 
                              id="reg-profile-upload"
                            />
                            <label 
                              htmlFor="reg-profile-upload"
                              className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer transition-all border border-slate-700"
                            >
                              사진 선택 (자동 압축)
                            </label>
                            <p className="text-[10px] text-slate-500 mt-1 font-medium">프로필 사진을 등록해 신뢰감을 주세요.</p>
                          </div>
                        </div>
                      </div>

                      {/* Company Logo Upload */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 block">회사 로고 등록</label>
                        <div className="flex items-center gap-4">
                          <img 
                            src={regLogoUrl} 
                            alt="Logo Preview" 
                            className="w-20 h-10 object-contain rounded-xl border border-slate-800 bg-slate-950 p-1 shrink-0"
                          />
                          <div className="flex-1">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleLogoUpload(e, true)}
                              className="hidden" 
                              id="reg-logo-upload"
                            />
                            <label 
                              htmlFor="reg-logo-upload"
                              className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 px-4 rounded-xl cursor-pointer transition-all border border-slate-700"
                            >
                              로고 선택 (자동 압축)
                            </label>
                            <p className="text-[10px] text-slate-500 mt-1 font-medium">랜딩페이지에 표시될 회사 로고입니다.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Agency Specific Onboarding */}
                  {signupType === 'agency' && (
                    <div className="space-y-8 border-t border-slate-800/80 pt-8 animate-in fade-in duration-300">
                      <h3 className="font-extrabold text-lg text-white border-l-4 border-orange-500 pl-3">
                        대리점 정보 및 DB 분배 정책 설정
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 block">대리점(GA) 공식 법인명*</label>
                          <input 
                            type="text" 
                            placeholder="예: 스마트금융파트너스" 
                            value={regAgencyName}
                            onChange={(e) => setRegAgencyName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                            required={signupType === 'agency'}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 block">대리점 대표 전화번호</label>
                          <input 
                            type="text" 
                            placeholder="예: 02-1234-5678" 
                            value={regAgencyPhone}
                            onChange={(e) => setRegAgencyPhone(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold text-slate-400 block">대리점 주소 (법무 공지사항용)</label>
                          <input 
                            type="text" 
                            placeholder="예: 서울특별시 강남구 역삼동 테헤란로 100 스마트타워 15층" 
                            value={regAgencyAddress}
                            onChange={(e) => setRegAgencyAddress(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                          />
                        </div>
                      </div>

                      {/* Distribution Routing Explanation Selection */}
                      <div className="space-y-4 pt-4">
                        <label className="text-xs font-bold text-slate-400 block text-center">대리점 소속 고객 DB 수집 및 분배 방식 선택 (언제든 변경 가능)</label>
                        <div className="grid md:grid-cols-2 gap-6">
                          
                          {/* Direct Mode Card */}
                          <div 
                            onClick={() => setRegRoutingType('direct')}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left h-52 relative ${regRoutingType === 'direct' ? 'bg-slate-950/40 border-orange-500 shadow-md' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                          >
                            <div className="space-y-2">
                              <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${regRoutingType === 'direct' ? 'bg-orange-500' : 'bg-slate-600'}`} />
                                개인 홍보 직접배정형 (Direct)
                              </h4>
                              <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                                소속 설계사들이 각자의 홍보 주소(`?planner=코드`)로 다이렉트 마케팅 광고를 진행합니다. 고객 상담 신청(DB)이 접수되면, 본사가 개입하지 않고 **해당 설계사에게 0.1초 만에 즉시 단독 배정**되어 설계 업무를 보게 됩니다.
                              </p>
                            </div>
                            <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 font-bold uppercase">
                              개별 영업/개인 광고 중심 GA 추천
                            </div>
                          </div>

                          {/* Distribute Mode Card */}
                          <div 
                            onClick={() => setRegRoutingType('distribute')}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left h-52 relative ${regRoutingType === 'distribute' ? 'bg-slate-950/40 border-orange-500 shadow-md' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                          >
                            <div className="space-y-2">
                              <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${regRoutingType === 'distribute' ? 'bg-orange-500' : 'bg-slate-600'}`} />
                                대리점 집중 분배형 (Distribute)
                              </h4>
                              <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                                대리점 통합 대표 링크(`?agency=대리점ID`) 혹은 공용 광고로 고객 DB를 집중 모집합니다. 수집된 모든 리드는 **대리점 공용 대기 풀(Pool)**로 들어가며, 대리점주(관리자)가 어드민에서 특정 설계사에게 **수동 지정**하여 권한을 배분합니다.
                              </p>
                            </div>
                            <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 font-bold uppercase">
                              본사 통합 마케팅 / 콜센터 집중형 GA 추천
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || (signupTab === 'register' && codeCheckStatus !== 'available')}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 cursor-pointer text-center block"
                  >
                    {loading ? '신청 처리 중...' : '첫 달 100% 무료 체험 신청 완료 🚀'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : currentUser.subscriptionStatus === 'pending' ? (
        /* ── AWAITING APPROVAL VIEW ── */
        <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-8 animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
            <Clock className="w-10 h-10" />
          </div>
          <div className="space-y-3 max-w-md mx-auto">
            <h1 className="text-2xl font-black text-white">가입 승인 대기 중</h1>
            <p className="text-xs font-bold text-slate-400 leading-relaxed break-keep text-center">
              회원가입이 정상적으로 완료되었습니다! 대리점 관리자(점주)가 소속 설계사 등록 가입을 최종 승인한 후에 대시보드를 사용할 수 있습니다.
            </p>
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed text-center">
              승인이 완료되면 자동으로 권한이 부여됩니다. 승인 완료 후 아래 새로고침 버튼을 누르거나 다시 로그인을 진행해 주세요.
            </p>
          </div>
          <div className="pt-4 max-w-xs mx-auto flex flex-col gap-2.5">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              새로고침 (상태 업데이트)
            </button>
            <button 
              onClick={() => setCurrentUser({ role: 'guest' })}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-black py-2.5 rounded-xl text-xs transition-all cursor-pointer border border-slate-800"
            >
              로그아웃 (메인 화면으로)
            </button>
          </div>
        </div>
      ) : (
        
        /* ── LOGGED IN DASHBOARD VIEW ── */
        <div className="w-full max-w-full xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {invitedAgencyId && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-8 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  ⚠️ 대리점 초대 링크 접속 안내
                </h4>
                <p className="text-[11px] text-slate-400 font-bold leading-normal break-keep">
                  현재 이미 파트너 계정으로 로그인되어 있습니다. 초대받은 대리점({invitedAgencyName || '확인 중...'}) 소속의 신규 설계사 가입 테스트를 진행하시려면, 먼저 현재 계정에서 로그아웃해 주셔야 합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('partner_session');
                  setCurrentUser({ role: 'guest' });
                  // Reload or just trigger the state reset
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-[10px] rounded-xl cursor-pointer shrink-0 transition-all shadow-md text-center"
              >
                로그아웃하고 가입 신청하기
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white">{currentUser.name} 관리자 콘솔</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${currentUser.subscriptionStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'}`}>
                  {currentUser.subscriptionStatus === 'active' ? '구독 활성화' : '구독 만료'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400">
                {currentUser.role === 'super' ? '시스템 내 모든 데이터를 통제 및 모니터링합니다.' : '수집된 리드를 0.1초 만에 확인하고 설계안을 지원합니다.'}
              </p>
            </div>
            
            {/* Quick stats overview */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 md:px-5 md:py-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-bold">분석 완료 DB</span>
                <span className="text-base md:text-lg font-black text-white">
                  {leads.filter(l => l.insurance_type !== 'remodeling_consult').length} 건
                </span>
              </div>
              <div className="bg-slate-950 border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 md:px-5 md:py-3 rounded-2xl flex items-center gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 block font-bold">카톡 상담 요청</span>
                  <span className="text-base md:text-lg font-black text-amber-300">
                    {leads.filter(l => l.insurance_type === 'remodeling_consult').length} 건
                  </span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 md:px-5 md:py-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-bold">대기중 리드</span>
                <span className="text-base md:text-lg font-black text-blue-400">
                  {leads.filter(l => l.status === 'new' || l.status === 'pending').length} 건
                </span>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-4 py-2.5 md:px-5 md:py-3 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-bold">구독 만료일까지</span>
                <span className="text-base md:text-lg font-black text-orange-500">{getDaysRemaining()} 일</span>
              </div>
            </div>
          </div>

          {/* Grid Layout (Nav & Main Content) */}
          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Left Nav Menu */}
            <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 gap-2 lg:gap-1 scrollbar-none shrink-0">
              <button 
                onClick={() => setActiveTab('leads')}
                className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'leads' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <FileText className="w-4 h-4" />
                고객 리드 수집 현황
              </button>

              <button 
                onClick={() => setActiveTab('marketing')}
                className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'marketing' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <BarChart2 className="w-4 h-4" />
                광고 / 유입 분석
              </button>

              <button 
                onClick={() => setActiveTab('playbook')}
                className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'playbook' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-orange-400 bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 hover:text-orange-300'}`}
              >
                <BookOpen className="w-4 h-4" />
                실전 마케팅 비법서
              </button>

              <button 
                onClick={() => setActiveTab('ad_campaign')}
                className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'ad_campaign' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-orange-400 bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 hover:text-orange-300'}`}
              >
                <Briefcase className="w-4 h-4" />
                광고 대행 요청
              </button>

              {/* Planners list for Agency Admin/Super Admin only */}
              {(currentUser.role === 'agency' || currentUser.role === 'super') && (
                <button 
                  onClick={() => setActiveTab('planners')}
                  className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'planners' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <Users className="w-4 h-4" />
                  {currentUser.role === 'super' ? '전체 설계사 관리' : '소속 설계사 관리'}
                </button>
              )}

              {/* Agencies list only for Super Admin */}
              {currentUser.role === 'super' && (
                <button 
                  onClick={() => setActiveTab('agencies')}
                  className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'agencies' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <Building className="w-4 h-4" />
                  전체 대리점 관리
                </button>
              )}

              {/* Agency Settings only for Agency Admin */}
              {currentUser.role === 'agency' && (
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <Settings className="w-4 h-4" />
                  대리점 분배 정책 설정
                </button>
              )}

              <button 
                onClick={() => setActiveTab('billing')}
                className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'billing' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <CreditCard className="w-4 h-4" />
                구독 결제 관리
              </button>

              {(currentUser.role === 'agency' || currentUser.role === 'planner') && (
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <User className="w-4 h-4" />
                  개인 프로필/랜딩 설정
                </button>
              )}
            </div>

            {/* Right main panel */}
            <div className="lg:col-span-4 min-w-0 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 min-h-[500px]">
              
              {/* Tab 1: Leads view */}
              {activeTab === 'leads' && (
                <div className="space-y-8">
                  
                  {/* Header with Period Filter Tabs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                    <div className="space-y-1 text-left">
                      <h2 className="text-lg font-black text-white">상담 리드 수집 목록</h2>
                      <p className="text-[10px] text-slate-400 font-bold">
                        💡 상태 선택 시 즉시 변경 사항이 DB에 동기화되며, 대한민국 표준시(KST)를 기준으로 필터링됩니다.
                      </p>
                    </div>

                    {/* Search and Leads Period Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="이름, 연락처, 설계코드 검색..."
                          value={leadSearchTerm}
                          onChange={(e) => setLeadSearchTerm(e.target.value)}
                          className="bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-orange-500/50 rounded-xl py-1.5 pl-3 pr-8 text-xs font-bold text-white outline-none w-52 transition-all placeholder:text-slate-600"
                        />
                        {leadSearchTerm && (
                          <button 
                            type="button"
                            onClick={() => setLeadSearchTerm('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-[10px] font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setLeadsPeriod('today')}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${leadsPeriod === 'today' ? 'bg-orange-500 text-white shadow shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          오늘
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadsPeriod('7days')}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${leadsPeriod === '7days' ? 'bg-orange-500 text-white shadow shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          최근 7일
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadsPeriod('all')}
                          className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${leadsPeriod === 'all' ? 'bg-orange-500 text-white shadow shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          전체 기간
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 카카오톡 설계코드 안내 배너 */}
                  <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 p-4.5 rounded-2xl flex items-start gap-3 relative overflow-hidden">
                    <span className="text-xl shrink-0">🔑</span>
                    <div className="space-y-1 text-left">
                      <h4 className="text-xs font-extrabold text-orange-400">카카오톡 설계코드 상담 매칭 기능 안내</h4>
                      <p className="text-[11px] text-slate-300 font-bold leading-relaxed break-keep">
                        고객이 카카오톡으로 상담을 신청하면 메시지에 포함된 설계 코드 <code className="text-orange-300 font-black bg-orange-500/5 px-1 py-0.5 rounded border border-orange-500/15 font-mono uppercase tracking-wider text-[10px]">RPT-xxxxxx</code>를 복사하여 오른쪽 검색창에 입력하세요. 0.1초 만에 해당 고객의 가입 내역, 진단 결과 및 세부 타임라인을 파악하여 신속하고 정확한 맞춤형 보험 상담을 진행할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  {/* ── CARD 1: 실시간 보험 분석 & 다이어트 시도 목록 (잠재고객 DB) ── */}
                  <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        실시간 보험 분석 & 다이어트 시도 목록
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">고객이 홈페이지에서 자가 보장 진단 및 보험 분석을 수행하여 이탈 방지용으로 자동 수집된 DB입니다.</p>
                    </div>

                    {/* Upper Category Filter Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-850">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-2 block">
                          구분 필터:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setLeadsCategoryFilter('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${leadsCategoryFilter === 'all' ? 'bg-orange-500 text-white shadow shadow-orange-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            전체보기 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && !l.insurance_type?.endsWith('_consult') && l.insurance_type !== 'remodeling_consult').length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setLeadsCategoryFilter('remodeling')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${leadsCategoryFilter === 'remodeling' ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            💸 내 보험 다이어트 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && l.insurance_type === 'remodeling').length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setLeadsCategoryFilter('compare')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${leadsCategoryFilter === 'compare' ? 'bg-sky-500 text-white shadow shadow-sky-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            📊 보험 비교분석 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && !l.insurance_type?.endsWith('_consult') && l.insurance_type !== 'remodeling_consult' && l.insurance_type !== 'remodeling' && !l.insurance_type?.includes('_underwriting')).length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setLeadsCategoryFilter('underwriting')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${leadsCategoryFilter === 'underwriting' ? 'bg-amber-500 text-white shadow shadow-amber-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            🔍 사전심사 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && !l.insurance_type?.endsWith('_consult') && l.insurance_type !== 'remodeling_consult' && l.insurance_type?.includes('_underwriting')).length}건)
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadCSV(getFilteredAnalysisLeads(), "보험분석_자가리드")}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Download className="w-3.5 h-3.5 text-orange-500" />
                        엑셀 다운로드 (CSV)
                      </button>
                    </div>

                    {getFilteredAnalysisLeads().length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2 bg-slate-950/20 rounded-2xl border border-slate-900/60">
                        <FileText className="w-10 h-10 text-slate-600" />
                        <p className="text-xs font-bold">수집된 자가 분석 리드가 없습니다.</p>
                      </div>
                    ) : (
                      renderLeadsTable(getFilteredAnalysisLeads())
                    )}
                  </div>

                  {/* ── CARD 2: 🔥 카카오톡 정밀설계 신청 목록 (초고관여 상담 DB) ── */}
                  <div className="bg-slate-950 border-2 border-orange-500/30 p-6 rounded-[2rem] space-y-6 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.15)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                      <ShieldCheck className="w-48 h-48 text-orange-500" />
                    </div>
                    
                    <div className="space-y-1 relative z-10">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        💬 카카오톡 정밀설계 신청 목록
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">고객이 분석 결과를 확인한 후 설계사에게 직접 카카오톡 맞춤 상담 및 최저가 제안서를 요청한 초고관여 DB입니다.</p>
                    </div>

                    {/* Lower Category Filter Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/85 relative z-10">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-2 block">
                          구분 필터:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setConsultCategoryFilter('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'all' ? 'bg-amber-500 text-white shadow shadow-amber-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            전체보기 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && (l.insurance_type?.endsWith('_consult') || l.insurance_type === 'remodeling_consult')).length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setConsultCategoryFilter('remodeling')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'remodeling' ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            💸 내 보험 다이어트 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && (l.insurance_type === 'remodeling_consult')).length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setConsultCategoryFilter('compare')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'compare' ? 'bg-sky-500 text-white shadow shadow-sky-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            📊 보험 비교분석 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && l.insurance_type?.endsWith('_consult') && l.insurance_type !== 'remodeling_consult').length}건)
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadCSV(getFilteredConsultLeads(), "카톡상담_요청리드")}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Download className="w-3.5 h-3.5 text-orange-500" />
                        엑셀 다운로드 (CSV)
                      </button>
                    </div>

                    {getFilteredConsultLeads().length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2 bg-slate-950/20 rounded-2xl border border-slate-900/60">
                        <FileText className="w-10 h-10 text-slate-600" />
                        <p className="text-xs font-bold">수집된 카카오톡 상담 요청 리드가 없습니다.</p>
                      </div>
                    ) : (
                      renderLeadsTable(getFilteredConsultLeads())
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Planners panel */}
              {activeTab === 'planners' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-white">
                      {currentUser.role === 'super' ? '전체 가입 설계사 현황' : '대리점 소속 설계사 관리'}
                    </h2>
                    <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black">
                      {currentUser.role === 'super' 
                        ? `전체 설계사: ${planners.length}명`
                        : `대리점 소속원: ${planners.filter(p => p.agency_id === currentUser.agencyId).length}명`}
                    </span>
                  </div>

                  {/* 초대 코드 및 링크 섹션 */}
                  {currentUser.role === 'agency' && (
                    <div className="bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-950 border border-blue-500/20 rounded-2xl p-6 text-left space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[9px] font-black uppercase">
                          INVITATION LINK
                        </span>
                        <h3 className="font-extrabold text-sm text-white">소속 설계사 가입 초대</h3>
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 leading-normal break-keep">
                        새로운 설계사를 대리점 소속원으로 등록하려면 아래의 초대 링크를 복사하여 전달해 주세요. 이 링크로 가입한 설계사는 자동으로 본 대리점에 소속 신청(승인 대기) 상태로 가입됩니다.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text" 
                          readOnly 
                          value={`${window.location.origin}/admin?invite_agency=${currentUser.agencyId || ''}`}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-slate-300 font-bold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/admin?invite_agency=${currentUser.agencyId || ''}`);
                            alert("설계사 초대 링크가 클립보드에 복사되었습니다!");
                          }}
                          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-black text-xs rounded-xl cursor-pointer shrink-0 transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" /> 초대 링크 복사
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {planners
                      .filter(p => currentUser.role === 'super' ? true : p.agency_id === currentUser.agencyId)
                      .map(p => (
                        <div key={p.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
                          <img
                            src={p.profile_image_url || DEFAULT_PROFILE_IMG}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-900 border border-slate-800"
                          />
                          <div className="flex-1 space-y-1 text-left min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-extrabold text-sm text-white truncate">{p.name}</h4>
                              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">
                                {p.planner_code}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold">{p.phone}</p>
                            <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                !p.agency_id || p.agency_id === '88888888-8888-4888-a888-888888888888'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              }`}>
                                {!p.agency_id || p.agency_id === '88888888-8888-4888-a888-888888888888'
                                  ? '개인설계사 (단독)'
                                  : `대리점 소속 (${agencies.find(a => a.id === p.agency_id)?.name || ''})`}
                              </span>
                              {p.subscription_status === 'pending' && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                                  승인 대기 중
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate italic">"{p.greeting_title || ''}"</p>
                            
                            {/* Approval and rejection controls */}
                            {p.subscription_status === 'pending' && (currentUser.role === 'agency' || currentUser.role === 'super') && (
                              <div className="pt-2.5 pb-1 flex items-center gap-2">
                                <button
                                  onClick={() => handleApprovePlanner(p.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[9px] cursor-pointer transition-all flex items-center gap-1"
                                >
                                  <Check className="w-2.5 h-2.5" /> 가입 승인
                                </button>
                                <button
                                  onClick={() => handleRejectPlanner(p.id)}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg text-[9px] cursor-pointer transition-all flex items-center gap-1"
                                >
                                  <Plus className="w-2.5 h-2.5 rotate-45" /> 거절 및 삭제
                                </button>
                              </div>
                            )}

                            <div className="pt-2 border-t border-slate-900 mt-2 flex items-center justify-between text-[9px] font-bold text-slate-400">
                              <span>개인주소: /?planner={p.planner_code}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/?planner=${p.planner_code}`);
                                  alert("개인 홍보 링크가 복사되었습니다!");
                                }}
                                className="text-orange-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                              >
                                <Copy className="w-2.5 h-2.5" /> 링크 복사
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tab: Agencies panel (Super Admin only) */}
              {activeTab === 'agencies' && currentUser.role === 'super' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-white">전체 등록 대리점 관리</h2>
                    <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black">
                      등록 대리점: {agencies.length}개
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {agencies.map((agency) => {
                      const affiliatedPlannersCount = planners.filter(p => p.agency_id === agency.id).length;
                      return (
                        <div key={agency.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                              {agency.logo_url ? (
                                <img src={agency.logo_url} alt={agency.name} className="w-full h-full rounded-xl object-cover" />
                              ) : (
                                <Building className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1.5 text-left min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-extrabold text-sm text-white truncate">{agency.name}</h4>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  agency.subscription_status === 'active' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  구독: {agency.subscription_status === 'active' ? 'Active' : 'Expired'}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold space-y-0.5">
                                {agency.phone && <p>📞 연락처: {agency.phone}</p>}
                                {agency.address && <p>📍 주소: {agency.address}</p>}
                                <p>⚙️ 분배 방식: {agency.lead_routing_type === 'direct' ? '개인 홍보 직접배정형' : '대리점 집중 분배형'}</p>
                                <p>👥 소속 설계사: <span className="text-blue-400 font-extrabold">{affiliatedPlannersCount}명</span></p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div>
                              <span className="text-[9px] font-bold text-slate-500 block uppercase">보유 잔액</span>
                              <span className="text-sm font-black text-amber-500">
                                {(agency.current_credits || 0).toLocaleString()} <span className="text-[10px] text-slate-400">크레딧</span>
                              </span>
                            </div>
                            <div className="inline-flex gap-1 shrink-0 self-stretch sm:self-auto justify-end">
                              <button
                                disabled={topupLoading}
                                onClick={() => handleTopupCredits(agency.id, 10000)}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-amber-500 border border-slate-800 rounded-lg font-black text-[10px] cursor-pointer"
                              >
                                +1만
                              </button>
                              <button
                                disabled={topupLoading}
                                onClick={() => handleTopupCredits(agency.id, 50000)}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-amber-500 border border-slate-800 rounded-lg font-black text-[10px] cursor-pointer"
                              >
                                +5만
                              </button>
                              <button
                                disabled={topupLoading}
                                onClick={() => handleTopupCredits(agency.id, -10000)}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-rose-500 border border-slate-800 rounded-lg font-black text-[10px] cursor-pointer"
                              >
                                -1만
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Settings panel */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-black text-white">대리점 DB 분배 방식 변경 설정</h2>
                  <p className="text-xs text-slate-400 font-bold leading-normal break-keep">
                    대표 광고 또는 소속 플래너들이 수집한 고객 상담 데이터(리드)를 대리점 내부에서 어떻게 흐르게 할 것인지 결정합니다. 설정 변경 시 즉시 Supabase DB에 반영되어 다음 리드부터 적용됩니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <div
                      onClick={() => handleUpdateRouting('direct')}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left h-52 relative ${getCurrentRoutingType() === 'direct' ? 'bg-slate-950/40 border-orange-500 shadow-md' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                    >
                      {getCurrentRoutingType() === 'direct' && (
                        <div className="absolute top-4 right-4 text-orange-500">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-sm text-white">개인 홍보 직접배정형 (Direct)</h4>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                          소속 설계사들의 개인화 링크(`?planner=코드`)로 접수된 모든 고객 리드가 대리점을 거치지 않고, 해당 설계사에게 즉시 단독 노출 및 배정됩니다.
                        </p>
                      </div>
                      <div className="text-[9px] text-orange-400 font-black tracking-widest uppercase">
                        현재 활성화 상태
                      </div>
                    </div>
                    <div
                      onClick={() => handleUpdateRouting('distribute')}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left h-52 relative ${getCurrentRoutingType() === 'distribute' ? 'bg-slate-950/40 border-orange-500 shadow-md' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                    >
                      {getCurrentRoutingType() === 'distribute' && (
                        <div className="absolute top-4 right-4 text-orange-500">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-sm text-white">대리점 집중 분배형 (Distribute)</h4>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                          대리점 전체 광고 등으로 들어온 모든 리드가 대기 풀(Pool)로 모이며, 대표 관리자(대리점주)가 '고객 리드 수집 현황' 탭에서 클릭 한 번으로 특정 플래너에게 담당을 재지정해 줍니다.
                        </p>
                      </div>
                      <div className="text-[9px] text-orange-400 font-black tracking-widest uppercase">
                        현재 활성화 상태
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Billing panel */}
              {activeTab === 'billing' && (
                <div className="space-y-8">
                  <h2 className="text-lg font-black text-white">구독 계약 및 결제 시뮬레이션</h2>

                  {/* 1. Subscription card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-orange-500/20 rounded-[2rem] p-8 space-y-6 text-left relative overflow-hidden shadow-[0_20px_50px_-12px_rgba(255,107,0,0.08)]">
                    <div className="absolute -top-10 -right-10 w-44 h-44 bg-orange-500/5 rounded-full blur-2xl" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md text-[10px] font-black uppercase tracking-wider inline-block">
                            🎫 월간 정기 구독권 라이선스 (Subscription)
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-black">
                            기간제 라이선스
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-white">
                          {currentUser.role === 'agency' ? '대리점 통합 단체 구독 플랜' : '개인 설계사 독립형 구독 플랜'}
                        </h3>
                        <p className="text-[11px] text-slate-450 font-bold leading-relaxed">
                          대리점 플랫폼 이용 권한 및 소속 설계사들의 마케팅 랜딩페이지 활성화 상태를 유지하는 월 정기 구독 계약 정보입니다.
                        </p>
                      </div>
                      
                      <div className="bg-slate-950 border border-slate-900/60 px-6 py-3.5 rounded-2xl flex items-center gap-6 shrink-0 self-start md:self-auto shadow-inner">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 block uppercase">정상 요금</span>
                          <span className="text-base font-black text-white">
                            {currentUser.role === 'agency' ? '월 500,000 원' : '월 50,000 원'}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-slate-800" />
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 block uppercase">남은 기간</span>
                          <span className="text-base font-black text-orange-500">{getDaysRemaining()} 일</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-bold">
                        <div className="space-y-1">
                          <p className="text-slate-300">구독 만료 예정일</p>
                          <p className="text-slate-500 text-[11px]">
                            {currentUser.expiresAt ? new Date(currentUser.expiresAt).toLocaleDateString('ko-KR', {
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            }) : '정보 없음'}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setPaymentSuccess(false);
                            setShowPaymentModal(true);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-xl text-xs shadow-lg shadow-orange-500/10 cursor-pointer text-center"
                        >
                          👉 1개월 구독 연장 결제하기 (시뮬레이터)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. Prepaid Credits Card */}
                  {(currentUser.role === 'agency' || currentUser.role === 'super' || currentUser.role === 'planner') && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/20 rounded-[2rem] p-8 space-y-6 text-left relative overflow-hidden shadow-[0_20px_50px_-12px_rgba(245,158,11,0.08)]">
                      <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl" />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-[10px] font-black uppercase tracking-wider inline-block">
                              ⚡ 종량제 실시간 API 크레딧 (Prepaid Credits)
                            </span>
                            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[9px] font-black">
                              건별 차감식 크레딧
                            </span>
                          </div>
                          <h3 className="text-xl font-extrabold text-white">
                            {(currentUser.role === 'agency' || currentUser.role === 'planner') 
                              ? `${agencies.find(a => a.id === activeBillingAgencyId)?.name || '대리점'} API 크레딧`
                              : '대리점별 선불 크레딧 관리'}
                          </h3>
                          <p className="text-[11px] text-slate-450 font-bold leading-relaxed">
                            고객이 내보험 분석을 하면 보험다모아에서 API를 통해 실시간으로 자료를 가져오는데 쓰이며, 자동차 보험의 내 차량정보 조회를 하면 car365에서 API를 통해 실시간 분석을 위해 쓰여 집니다.
                            <br />
                            (내 보험 분석 400크레딧, 실시간 자동차 비교 300크레딧) API 연동 시 실시간 차감되는 선불금 잔액입니다.
                          </p>
                        </div>

                        {(currentUser.role === 'agency' || currentUser.role === 'planner') && (
                          <div className="bg-slate-950 border border-slate-900/60 px-6 py-3.5 rounded-2xl flex items-center gap-6 shrink-0 self-start md:self-auto shadow-inner">
                            <div>
                              <span className="text-[9px] font-bold text-slate-500 block uppercase">보유 잔액</span>
                              <span className="text-xl font-black text-amber-500">
                                {(agencies.find(a => a.id === activeBillingAgencyId)?.current_credits || 0).toLocaleString()} <span className="text-xs text-slate-400">크레딧</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {(currentUser.role === 'agency' || isIndependentPlanner) && activeBillingAgencyId && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { label: '+3,000 크레딧', amount: 3000 },
                              { label: '+10,000 크레딧', amount: 10000 },
                              { label: '+30,000 크레딧', amount: 30000 },
                              { label: '+100,000 크레딧', amount: 100000 },
                            ].map((item, idx) => (
                              <button
                                key={idx}
                                disabled={topupLoading}
                                onClick={() => handleTopupCredits(activeBillingAgencyId, item.amount)}
                                className="px-4 py-3 bg-slate-900 hover:bg-slate-850 text-amber-500 border border-slate-800 rounded-xl font-bold text-xs cursor-pointer text-center transition-all hover:border-amber-500/40 disabled:opacity-50"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentUser.role === 'super' && (
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-slate-450">
                            총관리자 권한으로 대리점별 크레딧 잔액을 실시간으로 확인하고 충전/차감 조정을 수행합니다.
                          </p>
                          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                            <table className="w-full min-w-[800px] text-xs font-bold text-slate-350">
                              <thead>
                                <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450">
                                  <th className="py-3 px-4 text-left">대리점명</th>
                                  <th className="py-3 px-4 text-left">구독 상태</th>
                                  <th className="py-3 px-4 text-right">잔여 크레딧</th>
                                  <th className="py-3 px-4 text-center">크레딧 조정</th>
                                </tr>
                              </thead>
                              <tbody>
                                {agencies.map((agency) => (
                                  <tr key={agency.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                                    <td className="py-3 px-4">{agency.name}</td>
                                    <td className="py-3 px-4">
                                      <span className={`px-2 py-0.5 rounded text-[10px] ${agency.subscription_status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {agency.subscription_status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-right text-amber-500 font-extrabold">
                                      {(agency.current_credits || 0).toLocaleString()} 크레딧
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <div className="inline-flex gap-1 justify-center">
                                        <button
                                          disabled={topupLoading}
                                          onClick={() => handleTopupCredits(agency.id, 10000)}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          +1만
                                        </button>
                                        <button
                                          disabled={topupLoading}
                                          onClick={() => handleTopupCredits(agency.id, 50000)}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          +5만
                                        </button>
                                        <button
                                          disabled={topupLoading}
                                          onClick={() => handleTopupCredits(agency.id, -10000)}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          -1만
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. ROI Stats & Analytics Card */}
                  {(currentUser.role === 'agency' || currentUser.role === 'super') && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">총 투입 비용 (API 원가)</span>
                        <span className="text-lg font-black text-white">{roiStats.totalCostKRW.toLocaleString()}원</span>
                        <span className="text-[9px] text-slate-400 block font-semibold">사용된 {roiStats.totalSpentCredits.toLocaleString()} 크레딧</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">수집 고객 리드</span>
                        <span className="text-lg font-black text-white">{roiStats.totalLeads.toLocaleString()}건</span>
                        <span className="text-[9px] text-slate-400 block font-semibold">설계사 링크 총 유입</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">평균 리드 획득 단가 (CAC)</span>
                        <span className="text-lg font-black text-amber-500">{roiStats.cac.toLocaleString()}원</span>
                        <span className="text-[9px] text-slate-450 block font-semibold">리드 1건당 평균 분석 비용</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">영업 전환율 (ROI)</span>
                        <span className="text-lg font-black text-emerald-500">{roiStats.conversionRate}%</span>
                        <span className="text-[9px] text-slate-400 block font-semibold">전체 {roiStats.totalLeads}건 중 {roiStats.completedLeads}건 완료</span>
                      </div>
                    </div>
                  )}

                  {/* 4. Low Credit Alerts Config Card */}
                  {currentUser.role === 'agency' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-left space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-white">🚨 크레딧 소진 경보 및 알림 설정</h3>
                        <p className="text-xs text-slate-450 font-medium">크레딧이 부족할 경우 알림을 받을 경고 기준 액수와 휴대폰 번호를 구성합니다.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 block uppercase">경고 기준 잔액 (크레딧)</label>
                          <input
                            type="number"
                            value={alertThreshold}
                            onChange={(e) => setAlertThreshold(Number(e.target.value))}
                            placeholder="예: 2000"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 block uppercase">알림 수신 연락처</label>
                          <input
                            type="text"
                            value={alertPhone}
                            onChange={(e) => setAlertPhone(e.target.value)}
                            placeholder="예: 01012345678"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleSaveAlertSettings}
                        disabled={savingAlert}
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-all disabled:opacity-50"
                      >
                        {savingAlert ? '저장 중...' : '💾 경보 설정 저장'}
                      </button>
                    </div>
                  )}

                  {/* 5. Planner Quotas Card */}
                  {currentUser.role === 'agency' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-left space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-white">🛡️ 소속 설계사 월간 사용 한도 설정</h3>
                        <p className="text-xs text-slate-450 font-medium">소속 설계사의 무분별한 크레딧 남용을 방지하기 위해 개별 월간 할당량을 부여할 수 있습니다. (-1은 제한 없음)</p>
                      </div>
                      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                        <table className="w-full min-w-[800px] text-xs font-bold text-slate-300">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450">
                              <th className="py-3 px-4 text-left">설계사명</th>
                              <th className="py-3 px-4 text-left">연락처</th>
                              <th className="py-3 px-4 text-right">이번 달 실사용 크레딧</th>
                              <th className="py-3 px-4 text-center w-40">월간 이용 한도</th>
                            </tr>
                          </thead>
                          <tbody>
                            {planners
                              .filter(p => p.agency_id === currentUser.agencyId)
                              .map(planner => (
                                <tr key={planner.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                                  <td className="py-3 px-4">{planner.name}</td>
                                  <td className="py-3 px-4 text-slate-450">{planner.phone}</td>
                                  <td className="py-3 px-4 text-right">
                                    <span className="text-amber-500 font-extrabold">{(planner as any).monthly_credit_used || 0}</span> 크레딧
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <input
                                      type="number"
                                      defaultValue={(planner as any).monthly_credit_quota ?? -1}
                                      onBlur={(e) => handleUpdatePlannerQuota(planner.id, Number(e.target.value))}
                                      placeholder="-1"
                                      className="w-24 bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-center text-xs font-black text-white focus:outline-none focus:border-amber-500"
                                    />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 6. Transaction Log Table Card */}
                  {(currentUser.role === 'agency' || currentUser.role === 'super' || currentUser.role === 'planner') && (
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-left space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-extrabold text-white">📝 크레딧 충전 및 사용 이력</h3>
                          <p className="text-xs text-slate-450 font-medium">대리점 크레딧 잔액 변동 상세 내역을 실시간으로 확인하고 다운로드합니다.</p>
                        </div>
                        <button
                          onClick={handleDownloadTxCsv}
                          className="px-4 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> CSV 다운로드
                        </button>
                      </div>

                      {/* Filters */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={txSearch}
                          onChange={(e) => setTxSearch(e.target.value)}
                          placeholder="설명 또는 설계사명 검색..."
                          className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none"
                        />
                        <select
                          value={txTypeFilter}
                          onChange={(e) => setTxTypeFilter(e.target.value as any)}
                          className="bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs font-bold text-slate-300 focus:outline-none w-full sm:w-44"
                        >
                          <option value="all">모든 내역</option>
                          <option value="remodeling">내보험 분석</option>
                          <option value="car">자동차 비교</option>
                          <option value="topup">충전 내역</option>
                          <option value="adjust">관리자 조정</option>
                        </select>
                      </div>

                      {/* Log Table */}
                      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                        <table className="w-full min-w-[800px] text-xs font-bold text-slate-350">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450">
                              <th className="py-3 px-4 text-left">일시</th>
                              <th className="py-3 px-4 text-left">설계사</th>
                              <th className="py-3 px-4 text-left">유형</th>
                              <th className="py-3 px-4 text-left">상세 설명</th>
                              <th className="py-3 px-4 text-right">변동 크레딧</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTransactions.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-500">
                                  기록된 내역이 없습니다.
                                </td>
                              </tr>
                            ) : (
                              filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                                  <td className="py-3 px-4 text-[10px] text-slate-450">
                                    {new Date(tx.created_at).toLocaleString('ko-KR')}
                                  </td>
                                  <td className="py-3 px-4">{tx.planner_name || '시스템/관리자'}</td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                                      tx.type === 'remodeling' ? 'bg-orange-500/10 text-orange-400' :
                                      tx.type === 'car' ? 'bg-blue-500/10 text-blue-400' :
                                      tx.type === 'topup' ? 'bg-emerald-500/10 text-emerald-400' :
                                      'bg-purple-500/10 text-purple-400'
                                    }`}>
                                      {tx.type === 'remodeling' ? '내보험 분석' :
                                       tx.type === 'car' ? '자동차 비교' :
                                       tx.type === 'topup' ? '충전' : '조정'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-slate-300 font-semibold">{tx.description}</td>
                                  <td className={`py-3 px-4 text-right font-black ${tx.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 text-left text-xs text-slate-400 space-y-2">
                    <p className="font-extrabold text-slate-300">💡 B2B SaaS 구독 서비스 유의 사항 안내</p>
                    <p className="leading-relaxed font-semibold">
                      - 모든 가입 신청자는 기본적으로 가입 승인일로부터 **30일간 무료 체험(Trial)**이 제공됩니다.<br />
                      - 무료 체험 만료 전에 연장 결제를 진행할 경우 남은 무료 일수에 추가로 30일이 합산 연장됩니다.<br />
                      - 구독 기간이 만료되어도 어드민은 정지되지 않으나, 고객에게 노출되는 **개인화 분석 랜딩이 중지(기본 회사 정보로 대체)**되므로 만료 전 갱신을 권장합니다.
                    </p>
                  </div>
                </div>
              )}
              {/* Tab 6: Marketing & Campaign Analytics */}
              {activeTab === 'marketing' && (
                <div className="space-y-8 text-left animate-in fade-in duration-300">
                  
                  {/* Tab Header with Period Filter Tabs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                    <div className="space-y-1">
                      <h2 className="text-lg font-black text-white flex items-center gap-2">
                        📈 실시간 마케팅 & 광고 유입 통계
                      </h2>
                      <p className="text-xs font-bold text-slate-400">
                        내 브랜드 홍보 링크로 접속한 경로별 광고 성과와 고객 전환율을 0.1초 만에 실시간 모니터링합니다.
                      </p>
                    </div>

                    {/* Time Period Filter Tabs */}
                    <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 flex items-center gap-1 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setMarketingPeriod('today')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${marketingPeriod === 'today' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        오늘
                      </button>
                      <button
                        type="button"
                        onClick={() => setMarketingPeriod('7days')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${marketingPeriod === '7days' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        최근 7일
                      </button>
                      <button
                        type="button"
                        onClick={() => setMarketingPeriod('all')}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${marketingPeriod === 'all' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        전체 기간
                      </button>
                    </div>
                  </div>

                  {/* Sub-tab Navigation */}
                  <div className="flex gap-2 p-1 bg-slate-950/60 border border-slate-850 rounded-xl max-w-sm">
                    <button
                      type="button"
                      onClick={() => setStatsSubTab('marketing')}
                      className={`flex-1 px-4 py-2 rounded-lg text-[11px] font-black transition-all cursor-pointer text-center ${statsSubTab === 'marketing' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      📢 유입 경로별 분석
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatsSubTab('sales')}
                      className={`flex-1 px-4 py-2 rounded-lg text-[11px] font-black transition-all cursor-pointer text-center ${statsSubTab === 'sales' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      💼 설계사/상품별 실적
                    </button>
                  </div>

                  {/* 유입 매체 분석 서브탭 */}
                  {statsSubTab === 'marketing' && (
                    <>
                      {/* Summary Metric Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Today Visitors */}
                    <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">오늘 접속자 수</span>
                      <p className="text-2xl font-black text-orange-500">{getTodayVisitors().toLocaleString()} 명</p>
                      <p className="text-[9px] text-slate-500 font-bold">당일 KST 0시 기준 유니크 세션</p>
                    </div>

                    {/* Filtered Period Visitors */}
                    <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all relative overflow-hidden">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                        {marketingPeriod === 'today' ? '오늘' : marketingPeriod === '7days' ? '최근 7일' : '누적'} 접속자 수
                      </span>
                      <p className="text-2xl font-black text-white">{getFilteredVisitorLogs().length.toLocaleString()} 명</p>
                      <p className="text-[9px] text-slate-500 font-bold">선택한 기간 동안의 방문 세션</p>
                    </div>

                    {/* Filtered Period Converted Leads */}
                    <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                        {marketingPeriod === 'today' ? '오늘' : marketingPeriod === '7days' ? '최근 7일' : '누적'} 상담 신청 수
                      </span>
                      <p className="text-2xl font-black text-emerald-400">{getFilteredLeads().length.toLocaleString()} 명</p>
                      <p className="text-[9px] text-slate-500 font-bold">선택한 기간 내 보장분석 완료 건</p>
                    </div>

                    {/* Filtered Period Avg. Conversion Rate */}
                    <div className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">선택 기간 평균 전환율</span>
                      <p className="text-2xl font-black text-sky-400">
                        {getFilteredVisitorLogs().length > 0 ? ((getFilteredLeads().length / getFilteredVisitorLogs().length) * 100).toFixed(1) : '0.0'} %
                      </p>
                      <p className="text-[9px] text-slate-500 font-bold">방문 대비 상담 신청 성공 비율</p>
                    </div>
                  </div>

                  {/* KST Timezone Indicator */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-3 py-1 rounded-md border border-slate-900/60 inline-flex items-center gap-1">
                      ⏰ 모든 데이터는 대한민국 표준시(KST) 기준으로 0.1초 만에 실시간 집계됩니다.
                    </span>
                  </div>

                  {/* Best Performing Channel Highlight */}
                  {(() => {
                    const stats = getChannelStats();
                    const bestChannel = stats.filter(s => s.visits > 0).sort((a, b) => b.rate - a.rate)[0];
                    if (!bestChannel || bestChannel.rate === 0) return null;
                    return (
                      <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-5 flex items-center gap-4 text-xs animate-in fade-in duration-300">
                        <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/20 shrink-0">
                          👑
                        </div>
                        <div className="space-y-1">
                          <p className="font-extrabold text-white">
                            {marketingPeriod === 'today' ? '오늘' : marketingPeriod === '7days' ? '최근 7일간' : '현재'} 최고 전환 매체는 <span className="text-orange-400 font-black">{bestChannel.name}</span> 입니다!
                          </p>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            해당 채널의 전환율은 <span className="text-emerald-400 font-black">{bestChannel.rate.toFixed(1)}%</span>로 전체 평균을 웃돌고 있습니다. 이 매체에 광고 비중을 늘리는 것을 적극 권장합니다.
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Channel Breakdown Breakdown */}
                  <div className="bg-slate-950/40 border border-slate-850 rounded-[2rem] p-8 space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                        📍 유입 채널별 효율 상세 데이터
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({marketingPeriod === 'today' ? '오늘' : marketingPeriod === '7days' ? '최근 7일' : '전체'})
                        </span>
                      </h3>
                      <span className="text-[10px] text-slate-500 font-bold">
                        (유입량 순 정렬)
                      </span>
                    </div>

                    <div className="space-y-5">
                      {getChannelStats().map(ch => {
                        const filteredTotalVisits = getFilteredVisitorLogs().length || 1;
                        const visitPercent = Math.min(100, (ch.visits / filteredTotalVisits) * 100);
                        return (
                          <div key={ch.key} className="space-y-2 border-b border-slate-900/60 pb-4 last:border-0 last:pb-0">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                              {/* Label and Badge */}
                              <div className="flex items-center gap-2 font-extrabold">
                                <span className={`w-2.5 h-2.5 rounded-full ${ch.iconColor}`} />
                                <span className="text-slate-200">{ch.name}</span>
                                {ch.visits > 0 && ch.rate >= 10 && (
                                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded text-[9px] font-black">
                                    고효율
                                  </span>
                                )}
                              </div>

                              {/* Stat figures */}
                              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                                <div>
                                  <span className="text-slate-500">방문:</span>{' '}
                                  <span className="text-white font-extrabold">{ch.visits.toLocaleString()} 명</span>
                                </div>
                                <div className="w-px h-3 bg-slate-800" />
                                <div>
                                  <span className="text-slate-500">상담 신청:</span>{' '}
                                  <span className="text-emerald-400 font-black">{ch.conversions.toLocaleString()} 건</span>
                                </div>
                                <div className="w-px h-3 bg-slate-800" />
                                <div>
                                  <span className="text-slate-500">전환율:</span>{' '}
                                  <span className="text-orange-400 font-black">{ch.rate.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>

                            {/* Visited proportion progress bar */}
                            <div className="h-2 bg-slate-950 rounded-full overflow-hidden flex">
                              <div 
                                style={{ width: `${visitPercent}%` }} 
                                className={`h-full ${ch.iconColor} rounded-full transition-all duration-500`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* B2B 대리점/설계사 실적 통계 서브탭 */}
              {statsSubTab === 'sales' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Top stat overview cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">총 배정 설계사</span>
                      <p className="text-2xl font-black text-orange-500">{planners.length} 명</p>
                      <p className="text-[9px] text-slate-500 font-bold">소속 활성 설계사 수</p>
                    </div>
                    <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">총 설계 월 보험료</span>
                      <p className="text-2xl font-black text-emerald-400">
                        {leads.reduce((sum, l) => sum + (l.monthly_premium || 0), 0).toLocaleString()} 원
                      </p>
                      <p className="text-[9px] text-slate-500 font-bold">전체 수집 건의 누적 월 납입료</p>
                    </div>
                    <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">평균 월 납입료</span>
                      <p className="text-2xl font-black text-sky-400">
                        {Math.round(leads.reduce((sum, l) => sum + (l.monthly_premium || 0), 0) / (leads.filter(l => l.monthly_premium).length || 1)).toLocaleString()} 원
                      </p>
                      <p className="text-[9px] text-slate-500 font-bold">건당 평균 월 설계 비용</p>
                    </div>
                    <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">평균 연령대</span>
                      <p className="text-2xl font-black text-white">
                        {Math.round(leads.reduce((sum, l) => sum + (l.age || 0), 0) / (leads.filter(l => l.age).length || 1))} 세
                      </p>
                      <p className="text-[9px] text-slate-500 font-bold">수집된 가입 신청고객 평균 나이</p>
                    </div>
                  </div>

                  {/* Main grids */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    
                    {/* 1. Planner performance table */}
                    <div className="lg:col-span-2 bg-slate-950/40 border border-slate-850 rounded-[2rem] p-8 space-y-6">
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        👤 설계사별 리드 배정 및 계약 실적 현황
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-xs text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-500 font-black">
                              <th className="pb-3 pr-2">설계사명</th>
                              <th className="pb-3 px-2 text-center">배정 리드</th>
                              <th className="pb-3 px-2 text-center">상담 진행</th>
                              <th className="pb-3 px-2 text-center">계약 완료</th>
                              <th className="pb-3 px-2 text-center">전환율</th>
                              <th className="pb-3 pl-2 text-right">총 설계 금액</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getSalesStats().plannerStats.map((pl) => {
                              const total = pl.total || 1;
                              const conversionRate = ((pl.completed / total) * 100).toFixed(1);
                              return (
                                <tr key={pl.name} className="border-b border-slate-900/60 font-bold text-slate-350 hover:text-white transition-colors">
                                  <td className="py-3.5 pr-2 font-black text-slate-200">{pl.name}</td>
                                  <td className="py-3.5 px-2 text-center text-slate-400">{pl.total} 건</td>
                                  <td className="py-3.5 px-2 text-center text-amber-400">{pl.calling} 건</td>
                                  <td className="py-3.5 px-2 text-center text-emerald-400">{pl.completed} 건</td>
                                  <td className="py-3.5 px-2 text-center">
                                    <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded text-[10px]">
                                      {conversionRate}%
                                    </span>
                                  </td>
                                  <td className="py-3.5 pl-2 text-right font-black text-slate-100">{pl.revenue.toLocaleString()} 원</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right column: Category Share & Demographics */}
                    <div className="space-y-6">
                      
                      {/* 2. Product Category breakdown */}
                      <div className="bg-slate-950/40 border border-slate-850 rounded-[2rem] p-6 space-y-4">
                        <h3 className="text-xs font-extrabold text-white">
                          📦 상품 종류별 점유율 및 평균 납입료
                        </h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                          {getSalesStats().categoryStats.map((cat) => (
                            <div key={cat.name} className="space-y-1.5 text-[11px] font-bold">
                              <div className="flex justify-between items-center text-slate-300">
                                <span className="font-extrabold text-white">{cat.name}</span>
                                <span className="text-slate-500">
                                  {cat.count}건 ({cat.share.toFixed(1)}%)
                                </span>
                              </div>
                              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                  style={{ width: `${cat.share}%` }} 
                                  className="h-full bg-orange-500 rounded-full"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Customer Demographics */}
                      <div className="bg-slate-950/40 border border-slate-850 rounded-[2rem] p-6 space-y-4">
                        <h3 className="text-xs font-extrabold text-white">
                          👥 가입 신청고객 인구통계
                        </h3>
                        
                        {/* Gender split */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-500 font-bold block">성별 분포</span>
                          <div className="h-4 bg-slate-900 rounded-full overflow-hidden flex text-[9px] font-black text-white">
                            <div 
                              style={{ width: `${getSalesStats().genderStats.maleRate}%` }} 
                              className="h-full bg-sky-500 flex items-center justify-center transition-all"
                            >
                              {getSalesStats().genderStats.maleRate > 15 ? `남성 ${getSalesStats().genderStats.maleRate.toFixed(0)}%` : ''}
                            </div>
                            <div 
                              style={{ width: `${getSalesStats().genderStats.femaleRate}%` }} 
                              className="h-full bg-pink-500 flex items-center justify-center transition-all"
                            >
                              {getSalesStats().genderStats.femaleRate > 15 ? `여성 ${getSalesStats().genderStats.femaleRate.toFixed(0)}%` : ''}
                            </div>
                          </div>
                        </div>

                        {/* Age groups split */}
                        <div className="space-y-2 pt-2 border-t border-slate-900/60">
                          <span className="text-[10px] text-slate-500 font-bold block">연령별 분포</span>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black">
                            <div className="bg-slate-900 p-2 rounded-xl">
                              <span className="text-slate-500 block text-[9px]">20대 이하</span>
                              <span className="text-slate-200 block mt-0.5">{getSalesStats().ageGroups['20s_under']}명</span>
                            </div>
                            <div className="bg-slate-900 p-2 rounded-xl">
                              <span className="text-slate-500 block text-[9px]">30대</span>
                              <span className="text-slate-200 block mt-0.5">{getSalesStats().ageGroups['30s']}명</span>
                            </div>
                            <div className="bg-slate-900 p-2 rounded-xl">
                              <span className="text-slate-500 block text-[9px]">40대</span>
                              <span className="text-slate-200 block mt-0.5">{getSalesStats().ageGroups['40s']}명</span>
                            </div>
                            <div className="bg-slate-900 p-2 rounded-xl">
                              <span className="text-slate-500 block text-[9px]">50대 이상</span>
                              <span className="text-slate-200 block mt-0.5">{getSalesStats().ageGroups['50s_over']}명</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

              {/* Tab 5: Profile/Landing page settings */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-8 text-left">
                  <div className="space-y-1">
                    <h2 className="text-lg font-black text-white">개인 프로필 및 랜딩페이지 설정</h2>
                    <p className="text-xs font-bold text-slate-400">
                      고객에게 보여줄 내 프로필 사진, 인사말 문구, 카카오톡 상담 링크 및 대표번호를 실시간으로 커스텀하세요.
                    </p>
                  </div>

                  {/* Promo URL Banner */}
                  {(() => {
                    const myHomepageUrl = currentUser.role === 'planner'
                      ? `${window.location.origin}/?planner=${currentUser.plannerCode || ''}`
                      : `${window.location.origin}/?agency=${currentUser.agencyId || ''}`;
                    return (
                      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-950 border border-orange-500/20 rounded-[2rem] p-8 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded text-[9px] font-black uppercase">
                            PROMO LINK
                          </span>
                          <h4 className="font-extrabold text-sm text-white">내 영업 홍보 전용 홈페이지 주소</h4>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                          <input 
                            type="text" 
                            readOnly 
                            value={myHomepageUrl}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-slate-300 font-bold outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(myHomepageUrl);
                                alert("홍보용 홈페이지 주소가 클립보드에 복사되었습니다!");
                              }}
                              className="px-5 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-black text-xs rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5"
                            >
                              <Copy className="w-3.5 h-3.5" /> 주소 복사
                            </button>
                            <a
                              href={myHomepageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5 no-underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> 내 홈페이지 바로가기
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="bg-slate-950/40 border border-slate-850 rounded-[2rem] p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          대표 상담 연락처 (필수)
                        </label>
                        <input 
                          type="text"
                          value={editCustomPhone}
                          onChange={(e) => setEditCustomPhone(e.target.value)}
                          placeholder="예: 010-1234-5678"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>

                      {/* Kakao Talk Link */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          카카오톡 상담 연결 링크 (오픈채팅/채널 주소)
                        </label>
                        <input 
                          type="url"
                          value={editKakao}
                          onChange={(e) => setEditKakao(e.target.value)}
                          placeholder="예: https://open.kakao.com/o/..."
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        />
                      </div>

                      {/* Password */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          로그인 비밀번호 변경 *
                        </label>
                        <input 
                          type="password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="대시보드 로그인 시 사용할 비밀번호를 입력하세요"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>

                      {/* Profile Image Upload & URL */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          프로필 사진 이미지 등록
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                          <img 
                            src={editProfileImg || DEFAULT_PROFILE_IMG}
                            alt="프로필 미리보기"
                            className="w-16 h-16 rounded-2xl object-cover bg-slate-800 shrink-0 border border-slate-700 self-center sm:self-auto"
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleProfileUpload(e, false)}
                                className="hidden" 
                                id="edit-profile-upload"
                              />
                              <label 
                                htmlFor="edit-profile-upload"
                                className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all border border-slate-700 text-center"
                              >
                                사진 변경 (자동 압축)
                              </label>
                            </div>
                            <input 
                              type="text"
                              value={editProfileImg}
                              onChange={(e) => setEditProfileImg(e.target.value)}
                              placeholder="프로필 사진의 이미지 주소를 입력하거나 위 버튼으로 업로드하세요."
                              className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2 px-3 outline-none text-[11px] text-slate-300 font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Company Logo Upload & URL */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          회사 로고 이미지 등록
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                          <img 
                            src={editLogoUrl || DEFAULT_LOGO_IMG}
                            alt="로고 미리보기"
                            className="w-24 h-12 object-contain bg-slate-850 rounded-2xl shrink-0 border border-slate-700 p-1 self-center sm:self-auto"
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleLogoUpload(e, false)}
                                className="hidden" 
                                id="edit-logo-upload"
                              />
                              <label 
                                htmlFor="edit-logo-upload"
                                className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all border border-slate-700 text-center"
                              >
                                로고 변경 (자동 압축)
                              </label>
                            </div>
                            <input 
                              type="text"
                              value={editLogoUrl}
                              onChange={(e) => setEditLogoUrl(e.target.value)}
                              placeholder="회사 로고의 이미지 주소를 입력하거나 위 버튼으로 업로드하세요."
                              className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2 px-3 outline-none text-[11px] text-slate-300 font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Greeting Title */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          메인 랜딩페이지 한줄 인사말 제목
                        </label>
                        <input 
                          type="text"
                          value={editGreetingTitle}
                          onChange={(e) => setEditGreetingTitle(e.target.value)}
                          placeholder="예: 보장 낭비를 해결하는 정직한 전문가"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>

                      {/* Greeting Content */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          메인 랜딩페이지 상세 인사말 본문 (긴 인사말)
                        </label>
                        <textarea 
                          value={editGreetingContent}
                          onChange={(e) => setEditGreetingContent(e.target.value)}
                          placeholder="예: 불필요한 과납 보장을 전부 다 아껴드리겠습니다."
                          rows={2}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold resize-none"
                          required
                        />
                      </div>

                      {/* Company Name / Branch Name */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          지점/소속 회사 이름 (필수)
                        </label>
                        <input 
                          type="text"
                          value={editCompanyName}
                          onChange={(e) => setEditCompanyName(e.target.value)}
                          placeholder="예: 인카금융서비스 강남지점"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>

                      {/* Custom Address / Footer Description */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          지점 주소 및 인증 문구 (필수)
                        </label>
                        <input 
                          type="text"
                          value={editCustomAddress}
                          onChange={(e) => setEditCustomAddress(e.target.value)}
                          placeholder="예: 서울시 강남구 테헤란로 123 (인카금융서비스 공식 인증 설계사)"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>

                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-xl text-xs shadow-lg shadow-orange-500/10 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? '저장 중...' : '💾 프로필 설정 실시간 저장 및 동기화'}
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 7: B2B Marketing Playbook */}
              {activeTab === 'playbook' && (
                <div className="animate-in fade-in duration-350">
                  <MarketingPlaybookTab isSuperAdmin={currentUser.role === 'super'} />
                </div>
              )}

              {/* Tab 8: Ad Campaign Agency Request */}
              {activeTab === 'ad_campaign' && (
                <div className="animate-in fade-in duration-350">
                  <AdCampaignTab 
                    currentUser={currentUser as any} 
                    isSuperAdmin={currentUser.role === 'super'} 
                  />
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* ── MODALS ── */}

      {/* 1. Welcome Modal after Registration */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-xl w-full p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-500 text-white flex items-center justify-center rounded-3xl mx-auto shadow-lg shadow-emerald-500/20">
              <Sparkles size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">파트너 가입 완료 및 무료체험 시작!</h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed break-keep">
                고객님의 개인화 보험 진단 랜딩 페이지가 실시간 생성되었습니다. <br />
                아래 링크로 고객을 유입시키면 리드가 즉시 어드민으로 연동됩니다.
              </p>
            </div>

            {/* Generated Link Box */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs font-bold">
              <span className="text-orange-400 truncate max-w-[340px] select-all">{generatedLink}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  alert("링크가 클립보드에 복사되었습니다!");
                }}
                className="px-3 py-1.5 bg-orange-500 text-white font-black rounded-lg text-[10px] hover:bg-orange-600 transition-all cursor-pointer shrink-0"
              >
                주소 복사
              </button>
            </div>

            <button 
              onClick={() => setShowWelcomeModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl text-xs transition-all cursor-pointer"
            >
              어드민 대시보드 바로 진입
            </button>
          </div>
        </div>
      )}

      {/* 2. View Lead Details Modal (Full JSON Renderer) */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 text-left shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(() => {
                    const isPrecision = selectedLead.insurance_type?.includes('remodeling');
                    const badge = getInsuranceTypeName(selectedLead.insurance_type || '');
                    return (
                      <>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                          isPrecision 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {isPrecision ? '내보험 정밀분석 🔍' : '실시간 가격비교 📊'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${badge.bgClass} ${badge.textClass}`}>
                          {badge.label}
                        </span>
                      </>
                    );
                  })()}
                </div>
                <h3 className="text-xl font-extrabold text-white">{selectedLead.name} 고객 진단 결과 리포트</h3>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Details Grid */}
            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-slate-500 block font-bold mb-1.5">고객 기본 정보</span>
                  <p className="font-extrabold text-slate-300">이름: {selectedLead.name || '미기입'}</p>
                  <p className="font-extrabold text-slate-300">연령: {selectedLead.age || '미기입'}세</p>
                  <p className="font-extrabold text-slate-300">
                    연락처: {(() => {
                      const isConsult = selectedLead.insurance_type?.endsWith('_consult') || selectedLead.insurance_type === 'remodeling_consult';
                      const isUnderwriting = selectedLead.insurance_type?.includes('_underwriting');
                      return (isConsult || isUnderwriting) ? selectedLead.phone : maskPhoneNumber(selectedLead.phone);
                    })()}
                  </p>
                  <p className="font-extrabold text-slate-300">성별: {selectedLead.raw_payload?.gender === 'M' ? '남성' : selectedLead.raw_payload?.gender === 'F' ? '여성' : '미확인'}</p>
                  <p className="font-extrabold text-slate-350 mt-1.5 pt-1.5 border-t border-slate-900/50 flex items-center gap-1">
                    ⏱️ 비교 분석: <span className="text-orange-400">{new Date(selectedLead.created_at).toLocaleString('ko-KR')}</span>
                  </p>
                  {selectedLead.raw_payload?.simulation_code && (
                    <p className="font-extrabold text-slate-300 mt-1.5 pt-1.5 border-t border-slate-900/50 flex items-center gap-1.5">
                      🔑 설계 코드: <span className="text-orange-400 select-all font-black bg-orange-500/5 px-1.5 py-0.5 rounded border border-orange-500/10 uppercase tracking-wider">{selectedLead.raw_payload.simulation_code}</span>
                    </p>
                  )}
                  {(() => {
                    const isConsult = selectedLead.insurance_type?.endsWith('_consult') || selectedLead.insurance_type === 'remodeling_consult';
                    const isUnderwriting = selectedLead.insurance_type?.includes('_underwriting');
                    
                    if (isUnderwriting) {
                      return (
                        <div className="mt-2.5 p-3 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl text-[9.5px] text-emerald-400 font-extrabold leading-relaxed break-keep">
                          🟢 [사전 심사 요청 고객 대응 가이드] 본 고객은 과거 병력을 기반으로 가입 가능 여부를 심사받기 위해 사전 심사를 직접 신청한 고객입니다. 빠른 가입 여부 피드백 및 심사 진행을 위해 <span className="text-white bg-emerald-600 px-1 py-0.5 rounded mx-0.5">즉시 전화 통화 또는 카카오톡</span>으로 연락하여 병력 보완 사항을 확인하고 상담을 진행하시기 바랍니다.
                        </div>
                      );
                    }
                    
                    if (isConsult) {
                      const consultType = selectedLead.raw_payload?.consult_type;
                      if (consultType === 'anonymous') {
                        return (
                          <div className="mt-2.5 p-3 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-[9.5px] text-red-400 font-extrabold leading-relaxed break-keep">
                            ⚠️ [익명 안심 약속 준수 가이드] 본 고객은 <span className="text-white bg-red-600 px-1 py-0.5 rounded">익명 카톡 상담</span> 조건으로 신청하신 고객입니다. 무단으로 먼저 유선 전화를 거는 행위는 심각한 거부감과 민원을 발생시킬 수 있으니, <span className="text-red-300 underline font-black">반드시 오픈채팅방에서 코드로 먼저 상담을 나눈 뒤</span> 유선으로 유도하세요.
                          </div>
                        );
                      }
                      return (
                        <div className="mt-2.5 p-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[9.5px] text-orange-400 font-extrabold leading-normal break-keep">
                          ⚠️ [정식 상담 약속 준수 가이드] 본 고객은 정식 상담을 신청한 고객입니다. 무단 유선 전화를 피하고, 카톡으로 먼저 설계안을 전달한 뒤 전화 동의를 받아주세요.
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-900">
                  {(() => {
                    const isConsult = selectedLead.insurance_type?.endsWith('_consult') || selectedLead.insurance_type === 'remodeling_consult';
                    const isUnderwriting = selectedLead.insurance_type?.includes('_underwriting');
                    if (isConsult || isUnderwriting) {
                      return (
                        <>
                          <button
                            onClick={() => handleCopyPhone(selectedLead.phone)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center"
                          >
                            {copySuccess ? '✓ 복사완료' : '연락처 복사'}
                          </button>
                          <button
                            onClick={() => handleSendSmsTemplate(selectedLead)}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black py-1.5 px-2 rounded-lg transition-all cursor-pointer whitespace-nowrap text-center"
                          >
                            문자안내 발송
                          </button>
                        </>
                      );
                    } else {
                      return (
                        <div className="w-full bg-slate-900 border border-slate-850 p-2 rounded-xl text-center text-[10px] font-bold text-slate-500">
                          🔒 자가진단 리드는 무단 연락이 금지되어 있습니다.
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-slate-500 block font-bold mb-1">보험 등급 (종합)</span>
                <p className="font-black text-lg text-emerald-400">
                  {selectedLead.analysis_result?.scores?.total || 75} 점 / 100점
                </p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">
                  기본 분석 대비 절감 가능성 진단
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-slate-500 block font-bold mb-1">설계 월 납입료</span>
                <p className="font-black text-lg text-orange-400">
                  {selectedLead.monthly_premium?.toLocaleString() || 0} 원
                </p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">
                  리모델링 설계 적용 시 월 요금
                </p>
              </div>
            </div>

            {/* Real-time Remodeling Active Insurance Policy List */}
            {(() => {
              const coverage = selectedLead.analysis_result?.analysis?._remodelingCoverage || 
                               selectedLead.raw_payload?.analysisInputs?._remodelingCoverage;
              if (!coverage || !coverage.policies || coverage.policies.length === 0) return null;
              
              const totalPremium = coverage.current_total_premium ||
                coverage.policies.reduce((s: number, p: any) => s + (p.monthly_premium || 0), 0);
                
              return (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-3 border-orange-500 pl-2">
                    <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                      🛡️ 실시간 조회된 나의 가입 보험 내역
                    </h4>
                    <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850 self-start sm:self-auto text-[10px] font-bold">
                      <div>
                        <span className="text-slate-500 mr-1">총 가입 건수</span>
                        <span className="text-white font-extrabold">{coverage.policies.length}건</span>
                      </div>
                      <div className="w-px h-3 bg-slate-850" />
                      <div>
                        <span className="text-slate-500 mr-1">월 총 납입료</span>
                        <span className="text-orange-400 font-extrabold">{totalPremium.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>

                  {/* 설계사 안내 문구 배너 */}
                  <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-2xl text-left">
                    <p className="text-[10px] text-orange-400 font-extrabold flex items-center gap-1.5 mb-1.5">
                      <span>💡</span> 설계사 가이드 (데이터 출처 안내)
                    </p>
                    <p className="text-[10.5px] text-slate-400 font-bold leading-relaxed break-keep">
                      본 리스트의 <span className="text-white font-extrabold">보험회사, 상품명, 월 납입 보험료</span>는 한국신용정보원 본인정보 열람서비스(내보험다보여)를 통해 실시간으로 수집된 실제 가입 정보입니다. 다만, <span className="text-white font-extrabold">가입 특약 및 세부 보장 금액</span>은 AI 엔진이 표준 요율을 기반으로 역산하여 추정한 분석값이므로, 실제 가입 증권과 한도 차이가 있을 수 있습니다. 계약 체결 전 반드시 고객의 실제 증권을 다시 한번 확인하시기 바랍니다.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
                    {coverage.policies.map((policy: any, pIdx: number) => (
                      <div key={pIdx} className="bg-slate-950/80 border border-slate-850 rounded-2xl p-4.5 space-y-4 text-xs">
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-extrabold">
                              {policy.insurance_company}
                            </span>
                            <h5 className="font-extrabold text-white text-xs leading-normal">
                              {policy.product_name}
                            </h5>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-slate-500 text-[9px] block uppercase font-bold">월 보험료</span>
                            <span className="font-extrabold text-white text-xs">{policy.monthly_premium?.toLocaleString()}원</span>
                          </div>
                        </div>

                        {policy.riders?.length > 0 && (
                          <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-850/60 space-y-2">
                            <span className="text-slate-500 text-[9px] block uppercase font-bold">가입 특약 내역</span>
                            <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto pr-1">
                              {policy.riders.map((rider: any, rIdx: number) => (
                                <div key={rIdx} className="flex justify-between items-center text-[11px] font-bold text-slate-400 py-0.5 border-b border-dashed border-slate-900 last:border-0">
                                  <span className="truncate max-w-[180px]">{rider.rider_name}</span>
                                  <span className="text-slate-200 shrink-0 font-extrabold">
                                    {rider.coverage_amount >= 100000000
                                      ? `${(rider.coverage_amount / 100000000).toFixed(0)}억원`
                                      : `${(rider.coverage_amount / 10000).toLocaleString()}만원`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 과거 병력 사전 심사 고지 내역 */}
            {selectedLead.insurance_type?.endsWith('_underwriting') && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-white border-l-3 border-orange-500 pl-2">🔍 과거 병력 사전 심사 고지 내역</h4>
                <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 text-xs font-semibold text-slate-300 space-y-4">
                  {(() => {
                    const underwriting = selectedLead.raw_payload?.underwriting || 
                                         selectedLead.analysis_result?.underwriting || 
                                         selectedLead.analysis_result?.underwriting_questions;
                                         
                    const questions = Array.isArray(underwriting) ? underwriting : [
                      { question: "최근 5년 이내 수술 이력", answer: underwriting?.hasSurgery ? "있음 ⚠️" : "없음 ✓" },
                      { question: "최근 5년 이내 입원 이력", answer: underwriting?.hasHospitalization ? "있음 ⚠️" : "없음 ✓" },
                      { question: "최근 3개월 이내 의사 처방 및 약 복용 이력", answer: underwriting?.hasMedication ? "있음 ⚠️" : "없음 ✓" }
                    ];
                    
                    return (
                      <div className="grid gap-3">
                        {questions.map((q: any, idx: number) => {
                          const hasIssue = q.answer?.includes("있음") || q.answer?.includes("⚠️");
                          return (
                            <div key={idx} className="flex justify-between items-center py-2 px-3 bg-slate-900/40 rounded-xl border border-slate-850/50">
                              <span className="text-slate-400 font-bold">{q.question || q.name}</span>
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                                hasIssue 
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}>
                                {q.answer || "없음 ✓"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Coverage details */}
            {selectedLead.analysis_result?.deficiencies && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-white border-l-3 border-orange-500 pl-2">보장 분석상 과부족 진단 결과</h4>
                <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-4 text-xs font-semibold text-slate-300 space-y-2.5 max-h-60 overflow-y-auto">
                  {Array.isArray(selectedLead.analysis_result.deficiencies) && selectedLead.analysis_result.deficiencies.length > 0 ? (
                    selectedLead.analysis_result.deficiencies.map((def: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-900 last:border-0">
                        <span className="text-slate-400">{def.riderName || def.name}</span>
                        <span className={`font-black ${def.status === '정상' || def.status === '우수' ? 'text-emerald-400' : 'text-orange-400'}`}>
                          {def.status || '미달'} ({def.valueText || '확인필요'})
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500">
                      상세 진단 특약 내역이 비어있습니다. (종합 설계를 참고하세요)
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 암보험 상세 보장 현황 (동적 렌더링 - 고객 선택 단추 스타일) */}
            {(() => {
              const cancerInputs = selectedLead.raw_payload?.analysisInputs?.cancer || selectedLead.raw_payload?.cancer;
              const isCancer = selectedLead.insurance_type === 'cancer' || 
                               selectedLead.insurance_type === 'cancer_consult' ||
                               selectedLead.insurance_type === '암보험' ||
                               selectedLead.insurance_type === '암보험_consult';
              if (!isCancer) return null;
              return (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-white border-l-3 border-orange-500 pl-2">암보험 상세 설계 설정</h4>
                  <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 text-xs font-semibold text-slate-300 grid md:grid-cols-2 gap-4">
                    {/* 1. 일반암 진단비 */}
                    <div className="space-y-2">
                      <span className="text-slate-500 text-[10px] font-bold block">일반암 진단비</span>
                      <div className="flex gap-1.5">
                        {[30000000, 50000000, 100000000].map((val) => {
                          const isSelected = (cancerInputs?.currentAmount || 50000000) === val;
                          const label = val === 30000000 ? '3,000만' : val === 50000000 ? '5,000만' : '10,000만';
                          return (
                            <span
                              key={val}
                              className={isSelected 
                                ? "px-3 py-1.5 rounded-lg text-[10px] font-black bg-orange-500 text-white border border-orange-500" 
                                : "px-3 py-1.5 rounded-lg text-[10px] font-black bg-slate-900/40 text-slate-600 border border-slate-850/60"
                              }
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. 2025 암주요치료비 */}
                    <div className="space-y-2">
                      <span className="text-slate-500 text-[10px] font-bold block">2025 암주요치료비</span>
                      <div className="flex gap-1.5">
                        {[true, false].map((val) => {
                          const isSelected = (cancerInputs?.treatmentCost2025 === undefined ? true : cancerInputs.treatmentCost2025) === val;
                          const label = val ? '포함(추천)' : '미포함';
                          return (
                            <span
                              key={String(val)}
                              className={isSelected 
                                ? "px-3 py-1.5 rounded-lg text-[10px] font-black bg-orange-500 text-white border border-orange-500" 
                                : "px-3 py-1.5 rounded-lg text-[10px] font-black bg-slate-900/40 text-slate-600 border border-slate-850/60"
                              }
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. 표적항암/원인자 */}
                    <div className="space-y-2">
                      <span className="text-slate-500 text-[10px] font-bold block">표적항암/원인자</span>
                      <div className="flex gap-1.5">
                        {[true, false].map((val) => {
                          const isSelected = (cancerInputs?.targetedTherapy === undefined ? true : cancerInputs.targetedTherapy) === val;
                          const label = val ? '풀보장' : '진단비만';
                          return (
                            <span
                              key={String(val)}
                              className={isSelected 
                                ? "px-3 py-1.5 rounded-lg text-[10px] font-black bg-orange-500 text-white border border-orange-500" 
                                : "px-3 py-1.5 rounded-lg text-[10px] font-black bg-slate-900/40 text-slate-600 border border-slate-850/60"
                              }
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. 납입/갱신 유형 */}
                    <div className="space-y-2">
                      <span className="text-slate-500 text-[10px] font-bold block">납입/갱신 유형</span>
                      <div className="flex gap-1.5">
                        {['non-renewable', 'renewable', 'targeted'].map((val) => {
                          const isSelected = (cancerInputs?.paymentType || 'non-renewable') === val;
                          const label = val === 'non-renewable' ? '비갱신형' : val === 'renewable' ? '갱신형' : '표적항암형';
                          return (
                            <span
                              key={val}
                              className={isSelected 
                                ? "px-3 py-1.5 rounded-lg text-[10px] font-black bg-orange-500 text-white border border-orange-500" 
                                : "px-3 py-1.5 rounded-lg text-[10px] font-black bg-slate-900/40 text-slate-600 border border-slate-850/60"
                              }
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* 5. 재발/전이암 */}
                    <div className="space-y-2">
                      <span className="text-slate-500 text-[10px] font-bold block">재발/전이암</span>
                      <div className="flex gap-1.5">
                        {[true, false].map((val) => {
                          const isSelected = (cancerInputs?.recurrentCancer === undefined ? false : cancerInputs.recurrentCancer) === val;
                          const label = val ? '반복지급' : '1회지급';
                          return (
                            <span
                              key={String(val)}
                              className={isSelected 
                                ? "px-3 py-1.5 rounded-lg text-[10px] font-black bg-orange-500 text-white border border-orange-500" 
                                : "px-3 py-1.5 rounded-lg text-[10px] font-black bg-slate-900/40 text-slate-600 border border-slate-850/60"
                              }
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* 6. 암 가족력 */}
                    <div className="space-y-2">
                      <span className="text-slate-500 text-[10px] font-bold block">암 가족력</span>
                      <div className="flex gap-1.5">
                        {[true, false].map((val) => {
                          const isSelected = (cancerInputs?.familyHistory === undefined ? false : cancerInputs.familyHistory) === val;
                          const label = val ? '있음' : '없음';
                          return (
                            <span
                              key={String(val)}
                              className={isSelected 
                                ? "px-3 py-1.5 rounded-lg text-[10px] font-black bg-orange-500 text-white border border-orange-500" 
                                : "px-3 py-1.5 rounded-lg text-[10px] font-black bg-slate-900/40 text-slate-600 border border-slate-850/60"
                              }
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 타 보험 상세 보장 현황 (동적 버튼식/텍스트 카드 렌더링) */}
            {(() => {
              const isCancer = selectedLead.insurance_type === 'cancer' || 
                               selectedLead.insurance_type === 'cancer_consult' ||
                               selectedLead.insurance_type === '암보험' ||
                               selectedLead.insurance_type === '암보험_consult';
              if (isCancer) return null;

              const analysisInputs = selectedLead.raw_payload?.analysisInputs || selectedLead.raw_payload;
              if (!analysisInputs) return null;

              const reservedKeys = ['gender', 'jobClass', 'age', 'name', 'phone', 'birthDate', 'selectedCategory', 'isDirect', 'plannerId'];
              const categoryKey = Object.keys(analysisInputs).find(k => !reservedKeys.includes(k) && typeof analysisInputs[k] === 'object' && analysisInputs[k] !== null);
              if (!categoryKey) return null;

              const categoryInputs = analysisInputs[categoryKey];
              const keys = Object.keys(categoryInputs).filter(k => k !== 'targetAmount');

              if (keys.length === 0) return null;

              return (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-white border-l-3 border-orange-500 pl-2">
                    {getInsuranceTypeName(selectedLead.insurance_type || '').label.replace(' 비교분석', '').replace(' 다이어트', '')} 상세 설계 설정
                  </h4>
                  <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 text-xs font-semibold text-slate-300 grid md:grid-cols-2 gap-4">
                    {keys.map((key) => {
                      const rawValue = categoryInputs[key];
                      const label = FIELD_LABELS[key] || key;
                      const formattedValue = formatValue(key, rawValue);
                      const isNumericAmount = typeof rawValue === 'number' && rawValue >= 1000000;
                      
                      return (
                        <div key={key} className="space-y-2">
                          <span className="text-slate-500 text-[10px] font-bold block">{label}</span>
                          {isNumericAmount ? (
                            <div className="space-y-1.5 pr-2">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
                                <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 rounded">설정금액</span>
                                <span>{formattedValue}</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative border border-slate-850">
                                <div 
                                  className="h-full bg-orange-500 rounded-full"
                                  style={{ 
                                    width: rawValue >= 100000000 ? '100%' :
                                           rawValue >= 50000000 ? '75%' :
                                           rawValue >= 30000000 ? '50%' : '25%'
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-1.5">
                              {typeof rawValue === 'boolean' ? (
                                <>
                                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black ${rawValue ? "bg-orange-500 text-white border border-orange-500" : "bg-slate-900/40 text-slate-600 border border-slate-850/60"}`}>
                                    포함
                                  </span>
                                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black ${!rawValue ? "bg-orange-500 text-white border border-orange-500" : "bg-slate-900/40 text-slate-600 border border-slate-850/60"}`}>
                                    미포함
                                  </span>
                                </>
                              ) : (
                                <span className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-orange-500 text-white border border-orange-500">
                                  {formattedValue}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 상담 메모 & 이력 기록 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="font-extrabold text-sm text-white border-l-2 border-orange-500 pl-2">
                설계사 상담 메모 및 히스토리
              </h4>
              
              <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 space-y-4">
                {/* 메모 작성 폼 */}
                <div className="flex gap-3 items-stretch">
                  <textarea
                    rows={2}
                    value={newMemoText}
                    onChange={(e) => setNewMemoText(e.target.value)}
                    placeholder="상담 진행 상황이나 특이사항을 입력해 주세요... (예: 전화를 안 받으셔서 오후 4시에 재통화 예정)"
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-orange-500/50 rounded-xl p-3 outline-none text-xs text-slate-300 font-bold placeholder:text-slate-600 resize-none"
                  />
                  <button
                    onClick={() => handleSaveMemo(selectedLead.id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-black px-5 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap flex items-center justify-center"
                  >
                    메모 등록
                  </button>
                </div>

                {/* 타임라인 로그 리스트 */}
                <div className="space-y-5 max-h-60 overflow-y-auto pr-1 relative pl-6 border-l border-slate-800 ml-3">
                  {(() => {
                    const timelineEvents = getLeadTimeline(selectedLead);
                    if (timelineEvents.length === 0) {
                      return (
                        <div className="text-center py-6 text-slate-500 text-[11px] font-bold">
                          기록된 타임라인 이력이 없습니다.
                        </div>
                      );
                    }
                    return timelineEvents.map((event, idx) => {
                      let icon = '💡';
                      let iconBg = 'bg-slate-800 text-slate-400';
                      let textColor = 'text-slate-300';
                      
                      if (event.type === 'created') {
                        icon = '📝';
                        iconBg = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                      } else if (event.type === 'assign') {
                        icon = '👤';
                        iconBg = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
                      } else if (event.type === 'status_change') {
                        icon = '⚙️';
                        iconBg = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                        textColor = 'text-amber-200/90';
                      } else if (event.type === 'memo') {
                        icon = '💬';
                        iconBg = 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
                      } else if (event.type === 'kakao_click') {
                        icon = '💬';
                        iconBg = 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
                        textColor = 'text-yellow-100/90';
                      }

                      return (
                        <div key={event.id || idx} className="relative space-y-1 text-[11px] font-bold text-left">
                          {/* Timeline Circle Node */}
                          <div className={`absolute -left-[35px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${iconBg}`}>
                            {icon}
                          </div>
                          
                          <div className="flex justify-between items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-black text-slate-400 flex items-center gap-1.5">
                              {event.author}
                              {event.type === 'memo' && <span className="text-[8px] bg-orange-500/10 text-orange-400 px-1 py-0.2 rounded font-black">메모</span>}
                              {event.type === 'status_change' && <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1 py-0.2 rounded font-black">상태변경</span>}
                              {event.type === 'assign' && <span className="text-[8px] bg-purple-500/10 text-purple-400 px-1 py-0.2 rounded font-black">배정</span>}
                              {event.type === 'kakao_click' && <span className="text-[8px] bg-yellow-500/10 text-yellow-400 px-1 py-0.2 rounded font-black">카톡상담</span>}
                            </span>
                            <span className="text-[9px] text-slate-500">{new Date(event.created_at).toLocaleString('ko-KR')}</span>
                          </div>
                          <p className={`font-black leading-relaxed whitespace-pre-wrap ${textColor}`}>
                            {event.detail}
                          </p>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedLead(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl text-xs transition-all cursor-pointer text-center"
            >
              상세창 닫기
            </button>
          </div>
        </div>
      )}

      {/* 3. Assign Planner Modal (Agency Admin only) */}
      {assigningLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-md w-full p-8 space-y-6 text-left shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-extrabold text-white pb-3 border-b border-slate-800">
              고객 리드 담당 설계사 배정
            </h3>
            
            <p className="text-xs text-slate-400 font-bold">
              <strong>{assigningLead.name}</strong> 고객의 리드 상담을 전담할 대리점 소속 설계사를 배정해 주세요. 배정 시 고객 처리 현황이 자동으로 '상담중'으로 전환됩니다.
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {planners
                .filter(p => p.agency_id === currentUser.agencyId)
                .map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAssignPlanner(assigningLead.id, pl.id)}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 rounded-xl transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img src={pl.profile_image_url || DEFAULT_PROFILE_IMG} alt={pl.name} className="w-8 h-8 rounded-lg object-cover bg-slate-900 border border-slate-800" />
                      <div>
                        <p className="font-extrabold text-xs text-white">{pl.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{pl.phone}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                ))}
            </div>

            <button 
              onClick={() => setAssigningLead(null)}
              className="w-full bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-black py-3 rounded-xl text-xs transition-all cursor-pointer text-center"
            >
              배정 취소
            </button>
          </div>
        </div>
      )}

      {/* 4. Billing Extension Mock Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-md w-full p-8 text-left space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-extrabold text-white pb-3 border-b border-slate-800">
              구독 기간 연장 결제 시뮬레이션
            </h3>

            {!paymentSuccess ? (
              <div className="space-y-5">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs font-bold space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">결제 요금제</span>
                    <span className="text-white">{currentUser.role === 'agency' ? '대리점 단체 플랜' : '개인 설계사 독립 플랜'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">연장 기간</span>
                    <span className="text-white">+ 30 일</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-2 text-sm">
                    <span className="text-slate-500">총 결제금액</span>
                    <span className="text-orange-400 font-black">
                      {currentUser.role === 'agency' ? '500,000 원' : '50,000 원'}
                    </span>
                  </div>
                </div>

                {/* Mock Card Form */}
                <div className="space-y-3 text-xs">
                  <span className="text-slate-400 block font-bold">결제 수단 입력 (모의 테스트)</span>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="카드번호 (16자리)" 
                      value="4321 - 8765 - 1234 - 5678"
                      disabled
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-slate-400 font-bold"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value="12/30"
                        disabled
                        className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-slate-400 font-bold text-center"
                      />
                      <input 
                        type="password" 
                        placeholder="CVC" 
                        value="123"
                        disabled
                        className="bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 outline-none text-slate-400 font-bold text-center"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleRenewSubscription}
                  disabled={paymentProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 cursor-pointer text-center block"
                >
                  {paymentProcessing ? '모의 카드 위변조 체크 및 가상 결제 진행 중...' : '카드 가상 결제 승인'}
                </button>
              </div>
            ) : (
              /* Success view */
              <div className="text-center space-y-6 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-lg font-black">
                  ✓
                </div>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-base text-white">가상 카드 결제가 승인되었습니다!</h4>
                  <p className="text-[11px] text-slate-400 font-bold leading-normal break-keep">
                    Supabase 데이터베이스의 구독 기간이 **성공적으로 30일 연장**되었습니다. <br />
                    연장된 만료 날짜를 어드민 화면에서 확인하실 수 있습니다.
                  </p>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl text-xs transition-all cursor-pointer text-center"
                >
                  확인 완료
                </button>
              </div>
            )}
            
            {!paymentProcessing && !paymentSuccess && (
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-full bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-black py-3 rounded-xl text-xs transition-all cursor-pointer text-center"
              >
                닫기
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Forgot ID/Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-md w-full p-8 text-left space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white">
                🔑 설계사 정보 찾기
              </h3>
              <button 
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
              <button 
                type="button"
                onClick={() => { setForgotTab('code'); setForgotError(''); setForgotResultCode(''); }}
                className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${forgotTab === 'code' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                아이디(고유코드) 찾기
              </button>
              <button 
                type="button"
                onClick={() => { setForgotTab('password'); setForgotError(''); setSmsStep('input'); }}
                className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${forgotTab === 'password' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                비밀번호 찾기 (문자 인증)
              </button>
            </div>

            {forgotError && (
              <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/30 text-red-400 rounded-lg text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotTab === 'code' ? (
              /* FIND CODE */
              <form onSubmit={handleFindCode} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 block">이름 (실명)</label>
                  <input 
                    type="text" 
                    placeholder="가입 시 입력한 이름을 입력해 주세요" 
                    value={forgotName}
                    onChange={(e) => setForgotName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 block">연락처</label>
                  <input 
                    type="text" 
                    placeholder="예: 010-1234-5678" 
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                    required
                  />
                </div>

                {forgotResultCode && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center text-xs font-bold space-y-1">
                    <p className="text-[10px] text-slate-400">조회 완료된 설계사 고유코드(아이디)</p>
                    <p className="text-base font-black tracking-wider text-white select-all">{forgotResultCode}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-center"
                >
                  아이디(고유코드) 찾기
                </button>
              </form>
            ) : (
              /* FIND / RESET PASSWORD */
              <div className="space-y-4">
                {smsStep === 'input' && (
                  <form onSubmit={handleSendSmsCode} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 block">이름 (실명)</label>
                      <input 
                        type="text" 
                        placeholder="이름을 입력해 주세요" 
                        value={forgotName}
                        onChange={(e) => setForgotName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 block">연락처</label>
                      <input 
                        type="text" 
                        placeholder="예: 010-1234-5678" 
                        value={forgotPhone}
                        onChange={(e) => setForgotPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 block">설계사 고유코드(아이디)</label>
                      <input 
                        type="text" 
                        placeholder="고유코드를 입력해 주세요" 
                        value={forgotCode}
                        onChange={(e) => setForgotCode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-center"
                    >
                      알리고 SMS 인증번호 발송 (시뮬레이터)
                    </button>
                  </form>
                )}

                {smsStep === 'verify' && (
                  <form onSubmit={handleVerifySmsCode} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 block">문자 인증번호 입력</label>
                        <span className="text-[11px] text-orange-400 font-bold">
                          {Math.floor(smsTimer / 60)}분 {smsTimer % 60}초 남음
                        </span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="6자리 인증번호를 입력하세요" 
                        value={enteredSmsCode}
                        onChange={(e) => setEnteredSmsCode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold text-center tracking-widest text-lg"
                        required
                        maxLength={6}
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow-lg shadow-orange-500/20 cursor-pointer text-center"
                    >
                      인증번호 확인
                    </button>
                    <button 
                      type="button"
                      onClick={handleSendSmsCode}
                      className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2 rounded-xl text-[11px] transition-all cursor-pointer text-center mt-2"
                    >
                      인증번호 재전송
                    </button>
                  </form>
                )}

                {smsStep === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 block">새 비밀번호</label>
                      <input 
                        type="password" 
                        placeholder="새 비밀번호를 입력해 주세요" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 block">새 비밀번호 확인</label>
                      <input 
                        type="password" 
                        placeholder="새 비밀번호를 다시 입력해 주세요" 
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer text-center"
                    >
                      비밀번호 재설정 완료
                    </button>
                  </form>
                )}

                {smsStep === 'success' && (
                  <div className="text-center space-y-5 py-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-lg font-black animate-bounce">
                      ✓
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-base text-white">비밀번호가 정상 변경되었습니다!</h4>
                      <p className="text-[11px] text-slate-400 font-bold leading-normal break-keep">
                        이제 변경된 새 비밀번호로 파트너 대시보드에 로그인하실 수 있습니다.
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="w-full bg-slate-800 hover:bg-slate-750 text-white font-black py-3 rounded-xl text-xs transition-all cursor-pointer text-center"
                    >
                      로그인하러 가기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
