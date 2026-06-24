import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '../utils/supabase/client';
import { MarketingPlaybookTab } from './MarketingPlaybookTab';
import { AdCampaignTab } from './AdCampaignTab';
import { ChatTab } from './ChatTab';
import { ComplianceGuideTab } from './ComplianceGuideTab';
import { LeadDistributionSimulator } from './LeadDistributionSimulator';
import { triggerWelcomeChat } from '../utils/chatHelper';
import PWAInstallCard from './PWAInstallCard';
import { registerPushSubscription, triggerTestPushNotification } from '../utils/pushNotification';
import { useB2BBranding } from '../hooks/useB2BBranding';
import { HyphenAuthModal } from './insurance/remodeling/HyphenAuthModal';
import { StandardizedCoverage } from '../types/remodeling';

import { 
  Users, Settings, CreditCard, FileText, Plus, LogOut, CheckCircle, 
  ExternalLink, Clock, Coins, Briefcase, ShieldAlert, ChevronRight, 
  User, Check, AlertCircle, Sparkles, Building, Phone, MapPin, Copy,
  BarChart2, ShieldCheck, Download, BookOpen, MessageSquare
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
  subscription_tier?: string;
  max_planner_limit?: number;
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
  certification_message?: string;
  kakao_link?: string;
  subscription_status: string;
  subscription_expires_at?: string;
  company_name?: string;
  registration_number?: string;
  email?: string;
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
  creditBureau: '신용등급 기관',

  // Cancer options
  treatmentCost2025: '2025 암주요치료비',
  targetedTherapy: '표적항암/원인자',
  recurrentCancer: '재발/전이암 보장',
  familyHistory: '암 가족력'
};

const formatValue = (key: string, val: any) => {
  if (val === true) return '포함';
  if (val === false) return '미포함';
  if (Array.isArray(val)) {
    return val.map(item => {
      if (typeof item === 'object' && item !== null) {
        return item.rider_name || item.name || JSON.stringify(item);
      }
      return String(item);
    }).join(', ');
  }
  if (typeof val === 'object' && val !== null) {
    return JSON.stringify(val);
  }
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
    'support': { label: '고객센터 문의 📞', bgClass: 'bg-indigo-500/10 border-indigo-500/25', textClass: 'text-indigo-400' },
    'support_consult': { label: '고객센터 문의 📞', bgClass: 'bg-indigo-500/10 border-indigo-500/25', textClass: 'text-indigo-400' },
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

const isLeadConsult = (type?: string | null): boolean => {
  if (!type) return false;
  return type.endsWith('_consult') || type === 'remodeling_consult' || type.endsWith('_sms');
};

const getUtmSourceBadge = (utmSource?: string) => {
  if (!utmSource) return { label: '오가닉/기타', bgClass: 'bg-slate-800/40 text-slate-400 border-slate-700/50' };
  
  const cleanSource = utmSource.toLowerCase().trim();
  const map: Record<string, { label: string; bgClass: string }> = {
    'instagram': { label: '인스타그램 📸', bgClass: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
    'facebook': { label: '페이스북 👥', bgClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    'kakaotalk': { label: '카카오톡 💬', bgClass: 'bg-amber-500/15 text-amber-500 border-amber-500/20' },
    'kakao': { label: '카카오톡 💬', bgClass: 'bg-amber-500/15 text-amber-500 border-amber-500/20' },
    'naver': { label: '네이버 검색 💚', bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    'naver_gfa': { label: '네이버 GFA 💚', bgClass: 'bg-emerald-600/10 text-emerald-400 border-emerald-600/20' },
    'google_ads': { label: '구글 광고 💙', bgClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'google': { label: '구글 검색 💙', bgClass: 'bg-blue-650/10 text-blue-400 border-blue-600/20' },
    'tiktok': { label: '틱톡 🎵', bgClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    'organic': { label: '오가닉/직접 🌐', bgClass: 'bg-slate-800/40 text-slate-400 border-slate-700/50' }
  };
  
  return map[cleanSource] || { label: `${utmSource} 🔗`, bgClass: 'bg-slate-800/40 text-slate-300 border-slate-700/50' };
};

export default function AdminDashboard({ initialTab }: { initialTab?: 'login' | 'register' }) {
  const supabase = createClient();
  const { updateBranding } = useB2BBranding();
  
  // Auth state simulation
  const [currentUser, setCurrentUser] = useState<{
    role: 'super' | 'agency' | 'planner' | 'guest';
    plannerId?: string;
    agencyId?: string;
    agencyCode?: string;
    name?: string;
    plannerCode?: string;
    expiresAt?: string;
    subscriptionStatus?: string;
  }>({ role: 'guest' });

  const [pushStatus, setPushStatus] = useState<'unsupported' | 'loading' | 'default' | 'granted' | 'denied' | 'registered'>('loading');
  const [isTestPushSending, setIsTestPushSending] = useState(false);

  // DB Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [expandedLeadId, setExpandedLeadId] = useState<number | null>(null);
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const activeBillingAgencyId = currentUser.agencyId || '88888888-8888-4888-a888-888888888888';
  const isIndependentPlanner = currentUser.role === 'planner' && (!currentUser.agencyId || currentUser.agencyId === '88888888-8888-4888-a888-888888888888');

  // Form states (Signup)
  const [signupTab, setSignupTab] = useState<'login' | 'register'>('login');
  const [signupType, setSignupType] = useState<'planner' | 'agency'>('planner');
  const [loginCode, setLoginCode] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sync signupTab with initialTab changes
  useEffect(() => {
    if (initialTab) {
      setSignupTab(initialTab);
    }
  }, [initialTab]);
  
  // Registration Inputs
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGreetingTitle, setRegGreetingTitle] = useState('');
  const [regGreetingContent, setRegGreetingContent] = useState('');
  const [regProfileImg, setRegProfileImg] = useState(DEFAULT_PROFILE_IMG);
  const [regKakao, setRegKakao] = useState('');
  const [showKakaoHelp, setShowKakaoHelp] = useState(false);
  const [codeCheckStatus, setCodeCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Agency Specific Inputs
  const [regAgencyName, setRegAgencyName] = useState('');
  const [regAgencyPhone, setRegAgencyPhone] = useState('');
  const [regAgencyAddress, setRegAgencyAddress] = useState('');
  const [regLogoUrl, setRegLogoUrl] = useState(DEFAULT_LOGO_IMG);
  const [regRoutingType, setRegRoutingType] = useState<'direct' | 'distribute'>('direct');
  const [regAgencyTier, setRegAgencyTier] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  
  // Onboarding generated links
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  // Invited Agency parameters
  const [invitedAgencyId, setInvitedAgencyId] = useState<string | null>(null);
  const [invitedAgencyName, setInvitedAgencyName] = useState<string | null>(null);

  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<'leads' | 'settings' | 'billing' | 'planners' | 'profile' | 'marketing' | 'playbook' | 'ad_campaign' | 'chat' | 'compliance'>('leads');
  const [unreadTotal, setUnreadTotal] = useState(0);

  // 도움말 가이드 상태 및 로컬 스토리지 연동 (기본값 ON)
  const [showHelpGuide, setShowHelpGuide] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hide_help_guide') !== 'true';
    }
    return true;
  });

  const handleToggleHelpGuide = () => {
    const nextVal = !showHelpGuide;
    setShowHelpGuide(nextVal);
    if (nextVal) {
      localStorage.removeItem('hide_help_guide');
    } else {
      localStorage.setItem('hide_help_guide', 'true');
    }
  };

  // FAQ 접기/펼치기 상태 및 로컬 스토리지 연동 (기본값 ON)
  const [showFaq, setShowFaq] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hide_faq') !== 'true';
    }
    return true;
  });

  const handleToggleFaq = () => {
    const nextVal = !showFaq;
    setShowFaq(nextVal);
    if (nextVal) {
      localStorage.removeItem('hide_faq');
    } else {
      localStorage.setItem('hide_faq', 'true');
    }
  };

  // B2B Billing Capacity Calculations
  const billingAgency = agencies.find(a => a.id === currentUser.agencyId);
  const billingTier = billingAgency?.subscription_tier || 'pro';
  const billingMaxLimit = billingAgency?.max_planner_limit || 28;
  const billingActivePlanners = planners.filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active').length;
  const billingCapacityPercent = Math.min(100, Math.round((billingActivePlanners / billingMaxLimit) * 100));

  let billingGaugeColor = 'from-emerald-500 to-teal-500';
  let billingTextColor = 'text-emerald-400';
  let billingBorderColor = 'border-emerald-500/20';
  let billingBgColor = 'bg-emerald-500/5';
  if (billingCapacityPercent >= 90) {
    billingGaugeColor = 'from-red-500 to-rose-600';
    billingTextColor = 'text-red-400';
    billingBorderColor = 'border-red-500/20';
    billingBgColor = 'bg-red-500/5';
  } else if (billingCapacityPercent >= 70) {
    billingGaugeColor = 'from-orange-500 to-amber-500';
    billingTextColor = 'text-orange-400';
    billingBorderColor = 'border-orange-500/20';
    billingBgColor = 'bg-orange-500/5';
  }

  const renderHelpGuideToggle = () => (
    <button
      type="button"
      onClick={handleToggleHelpGuide}
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-[11px] font-black transition-all relative overflow-hidden shadow-md cursor-pointer shrink-0 ${
        showHelpGuide 
          ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 hover:bg-orange-500/20 shadow-lg shadow-orange-500/5' 
          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 ${showHelpGuide ? '' : 'hidden'}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${showHelpGuide ? 'bg-orange-500' : 'bg-slate-600'}`}></span>
      </span>
      <span>💡 도움말 가이드 {showHelpGuide ? 'ON' : 'OFF'}</span>
    </button>
  );

  // Fetch unread messages total
  const fetchUnreadTotal = async () => {
    try {
      const currentUserId = currentUser.plannerId || currentUser.agencyId || '00000000-0000-4000-a000-000000000000';
      if (!currentUserId || currentUser.role === 'guest') return;

      const { data: memberData } = await supabase
        .from('chat_room_members')
        .select('room_id')
        .eq('user_id', currentUserId);

      if (!memberData || memberData.length === 0) {
        setUnreadTotal(0);
        return;
      }

      const roomIds = memberData.map(m => m.room_id);

      const { count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .in('room_id', roomIds)
        .eq('is_read', false)
        .neq('sender_id', currentUserId);

      setUnreadTotal(count || 0);
    } catch (err) {
      console.warn("Failed to fetch unread total:", err);
    }
  };

  // Subscribe to global messages to update unread badge
  useEffect(() => {
    const currentUserId = currentUser.plannerId || currentUser.agencyId || '00000000-0000-4000-a000-000000000000';
    if (!currentUserId || currentUser.role === 'guest') return;

    fetchUnreadTotal();

    const channel = supabase
      .channel('unread_count_sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        () => {
          fetchUnreadTotal();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.plannerId, currentUser.agencyId, currentUser.role]);

  // Synchronize push notification subscription and permission status
  useEffect(() => {
    const checkPushStatus = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setPushStatus('unsupported');
        return;
      }
      
      const permission = Notification.permission;
      if (permission === 'default') {
        setPushStatus('default');
      } else if (permission === 'denied') {
        setPushStatus('denied');
      } else if (permission === 'granted') {
        try {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            setPushStatus('registered');
          } else {
            setPushStatus('granted');
          }
        } catch (e) {
          setPushStatus('granted');
        }
      }
    };

    if (currentUser.plannerId) {
      checkPushStatus();
    }
  }, [currentUser.plannerId, activeTab]);

  const handleSubscribePush = async () => {
    if (!currentUser.plannerId) return;
    setPushStatus('loading');
    try {
      const sub = await registerPushSubscription(currentUser.plannerId);
      if (sub) {
        setPushStatus('registered');
        alert('🔔 실시간 푸시 알림 수신이 성공적으로 설정되었습니다!');
      } else {
        const permission = Notification.permission;
        if (permission === 'denied') {
          setPushStatus('denied');
          alert('❌ 알림 권한이 거부되었습니다. 브라우저 주소창 설정 아이콘을 눌러 알림 권한을 [허용]으로 변경해 주세요.');
        } else {
          setPushStatus('default');
          alert('❌ 알림 수신 설정에 실패했습니다. 다시 시도해 주세요.');
        }
      }
    } catch (e: any) {
      setPushStatus('default');
      alert('오류가 발생했습니다: ' + e.message);
    }
  };

  const handleSendTestPush = async () => {
    if (!currentUser.plannerId) return;
    setIsTestPushSending(true);
    try {
      const res = await triggerTestPushNotification(currentUser.plannerId);
      if (res.success) {
        alert('🚀 테스트 알림이 발송되었습니다! 기기를 확인해 보세요.');
      } else {
        alert('❌ 테스트 알림 발송 실패: ' + (res.error || '알 수 없는 오류'));
      }
    } catch (e: any) {
      alert('오류가 발생했습니다: ' + e.message);
    } finally {
      setIsTestPushSending(false);
    }
  };

  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [marketingPeriod, setMarketingPeriod] = useState<'today' | '7days' | 'all'>('all');
  const [statsSubTab, setStatsSubTab] = useState<'marketing' | 'sales'>('marketing');
  const [leadsPeriod, setLeadsPeriod] = useState<'today' | '7days' | 'all'>('all');
  const [leadsCategoryFilter, setLeadsCategoryFilter] = useState<'all' | 'remodeling' | 'compare' | 'underwriting'>('all');
  const [consultCategoryFilter, setConsultCategoryFilter] = useState<'all' | 'remodeling' | 'compare' | 'support'>('all');
  const [analysisPage, setAnalysisPage] = useState(1);
  const [consultPage, setConsultPage] = useState(1);

  
  // Credit Billing Ecosystem states
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<'all' | 'remodeling' | 'car' | 'topup' | 'adjust'>('all');
  
  // Alert Config State
  const [alertThreshold, setAlertThreshold] = useState<number>(2000);
  const [alertPhone, setAlertPhone] = useState('');
  const [savingAlert, setSavingAlert] = useState(false);
  const [quotaSaving, setQuotaSaving] = useState(false);

  const [topupLoading, setTopupLoading] = useState(false);
  const [isKakaoGuideOpen, setIsKakaoGuideOpen] = useState(false);
  // 어드민 하이픈 연동 모달 상태
  const [adminHyphenLead, setAdminHyphenLead] = useState<Lead | null>(null);
  const [showAdminHyphen, setShowAdminHyphen] = useState(false);

  // 어드민 하이픈 성공 핸들러 — coverage 저장 + status verified 설정
  const handleAdminHyphenSuccess = async (coverage: StandardizedCoverage, customerInfo?: { name: string; phone: string }) => {
    if (!adminHyphenLead) return;
    try {
      const supabase = createClient();
      const updatedPayload = {
        ...(adminHyphenLead.raw_payload || {}),
        hyphen_coverage: coverage,
        timeline: [
          {
            id: `hyphen-${Date.now()}`,
            type: 'system_log',
            author: '설계사',
            detail: '설계사가 하이픈 연동을 완료하여 실제 보험 데이터를 가져왔습니다.',
            created_at: new Date().toISOString()
          },
          ...(adminHyphenLead.raw_payload?.timeline || [])
        ]
      };

      const updateData: any = { status: 'verified', raw_payload: updatedPayload };
      // 하이픈 인증에서 입력된 실명/전화 저장
      if (customerInfo?.name && customerInfo.name !== '고객') {
        updateData.name = customerInfo.name;
      }
      if (customerInfo?.phone && customerInfo.phone !== '010-0000-0000') {
        updateData.phone = customerInfo.phone;
      }

      await supabase
        .from('customer_leads')
        .update(updateData)
        .eq('id', adminHyphenLead.id);

      setLeads(prev => prev.map(l =>
        l.id === adminHyphenLead.id
          ? { ...l, ...updateData }
          : l
      ));
      setToastMessage('✅ 하이픈 연동 완료! 실명·보험 데이터가 저장되었습니다.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      alert('하이픈 데이터 저장 실패: ' + err);
    } finally {
      setShowAdminHyphen(false);
      setAdminHyphenLead(null);
    }
  };

  const handleUpdatePlannerQuota = async (plannerId: string, quota: number) => {
    try {
      setQuotaSaving(true);
      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        setPlanners(prev => prev.map(p => p.id === plannerId ? { ...p, monthly_credit_quota: quota } : p));
        alert('설계사 월간 한도가 정상적으로 업데이트되었습니다. (데모 모드)');
        return;
      }
      const { error } = await supabase
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

  const handleUpdatePlannerWeight = async (plannerId: string, weight: number) => {
    try {
      const weightVal = Math.max(1, Math.min(100, weight));
      const planner = planners.find(p => p.id === plannerId);
      const rawRegNum = planner?.registration_number || '';
      const delibPart = rawRegNum.includes('|') ? rawRegNum.split('|')[0] : (rawRegNum.startsWith('dist_') ? '' : rawRegNum);
      const combinedVal = delibPart ? `${delibPart}|dist_weight:${weightVal}` : `dist_weight:${weightVal}`;

      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        setPlanners(prev => prev.map(p => p.id === plannerId ? { ...p, registration_number: combinedVal } : p));
        alert("설계사 배정 가중치가 변경되었습니다. (데모 모드)");
        return;
      }

      const res = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plannerId,
          plannerData: { registration_number: combinedVal }
        })
      });
      const resData = await res.json();
      if (!resData.success) throw new Error(resData.error || '가중치 업데이트 실패');

      alert("설계사 배정 가중치가 변경되었습니다.");
      await fetchData();
    } catch (err: any) {
      alert("가중치 변경 실패: " + err.message);
    }
  };

  const handleTogglePlannerDistribution = async (plannerId: string, currentRegNum: string | null) => {
    try {
      const rawRegNum = currentRegNum || '';
      const delibPart = rawRegNum.includes('|') ? rawRegNum.split('|')[0] : (rawRegNum.startsWith('dist_') ? '' : rawRegNum);
      const distPart = rawRegNum.includes('|') ? rawRegNum.split('|')[1] : (rawRegNum.startsWith('dist_') ? rawRegNum : '');
      
      const isDisabled = distPart === 'dist_disabled';
      const newDistPart = isDisabled ? 'dist_weight:5' : 'dist_disabled';
      const combinedVal = delibPart ? `${delibPart}|${newDistPart}` : newDistPart;

      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        setPlanners(prev => prev.map(p => p.id === plannerId ? { ...p, registration_number: combinedVal } : p));
        alert(isDisabled ? "자동 분배 대상에 포함되었습니다. (데모 모드)" : "자동 분배 대상에서 제외되었습니다. (데모 모드)");
        return;
      }

      const res = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plannerId,
          plannerData: { registration_number: combinedVal }
        })
      });
      const resData = await res.json();
      if (!resData.success) throw new Error(resData.error || '분배 상태 변경 실패');

      alert(isDisabled ? "자동 분배 대상에 포함되었습니다." : "자동 분배 대상에서 제외되었습니다.");
      await fetchData();
    } catch (err: any) {
      alert("분배 상태 변경 실패: " + err.message);
    }
  };

  const getPlannerAssignmentStats = (plannerId: string) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentLeads = leads.filter(l => 
      l.planner_id && 
      l.created_at && 
      new Date(l.created_at).getTime() >= thirtyDaysAgo
    );
    const totalCount = recentLeads.length;
    const plannerCount = recentLeads.filter(l => l.planner_id === plannerId).length;
    return {
      count: plannerCount,
      ratio: totalCount > 0 ? ((plannerCount / totalCount) * 100).toFixed(1) : '0.0'
    };
  };

  const handleSaveAlertSettings = async () => {
    if (!currentUser.agencyId) return;
    try {
      setSavingAlert(true);
      const { error } = await supabase
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
      if (amount > 0) {
        const vatAmount = Math.round(amount * 0.1);
        const totalPayment = amount + vatAmount;
        const confirmMsg = `⚡ [실시간 API 크레딧 충전 결제 승인]\n\n` +
          `• 충전 크레딧: ${amount.toLocaleString()} 크레딧\n` +
          `• 결제 요청액: ${amount.toLocaleString()} 원\n` +
          `• 부가세 (10%): ${vatAmount.toLocaleString()} 원\n` +
          `• 최종 카드 결제액: ${totalPayment.toLocaleString()} 원 (부가세 포함)\n\n` +
          `모의 카드 결제를 진행하고 즉시 크레딧을 충전하시겠습니까?`;
        
        if (!window.confirm(confirmMsg)) {
          return;
        }
      }

      setTopupLoading(true);
      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        setAgencies(prev => prev.map(a => {
          if (a.id === agencyId) {
            const newCredits = (a.current_credits || 0) + amount;
            return { ...a, current_credits: newCredits };
          }
          return a;
        }));
        
        const txType = amount > 0 ? 'topup' : 'adjust';
        const txDesc = amount > 0 
          ? `대시보드 크레딧 충전 (${amount.toLocaleString()} 크레딧, 실결제액: ${(amount * 1.1).toLocaleString()}원 부가세 포함)`
          : `관리자 크레딧 조정 수동 차감 (${Math.abs(amount).toLocaleString()})`;
        
        setTransactions(prev => [
          {
            id: `tx-${Date.now()}`,
            agency_id: agencyId,
            amount: amount,
            type: txType,
            description: txDesc,
            created_at: new Date().toISOString(),
            planner_name: currentUser.name || '체험대표'
          },
          ...prev
        ]);
        
        alert(amount > 0 
          ? `성공적으로 ${(amount * 1.1).toLocaleString()}원이 가상 승인 결제되었으며, ${amount.toLocaleString()} 크레딧이 충전되었습니다. (데모 모드)`
          : `성공적으로 ${Math.abs(amount).toLocaleString()} 크레딧이 조정(차감)되었습니다.`
        );
        return;
      }

      const { data: agencyData, error: fetchErr } = await supabase
        .from('agencies')
        .select('current_credits')
        .eq('id', agencyId)
        .single();
        
      if (fetchErr || !agencyData) {
        alert('대리점 정보를 가져올 수 없습니다: ' + (fetchErr?.message || ''));
        return;
      }
      
      const newCredits = (agencyData.current_credits || 0) + amount;
      
      const { error: updateErr } = await supabase
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
        ? `대시보드 크레딧 충전 (${amount.toLocaleString()} 크레딧, 실결제액: ${(amount * 1.1).toLocaleString()}원 부가세 포함)`
        : `관리자 크레딧 조정 수동 차감 (${Math.abs(amount).toLocaleString()})`;
      await supabase.from('credit_transactions').insert({
        agency_id: agencyId,
        amount: amount,
        type: txType,
        description: txDesc
      });
      
      alert(amount > 0 
        ? `성공적으로 ${(amount * 1.1).toLocaleString()}원이 승인 결제되었으며, ${amount.toLocaleString()} 크레딧이 충전되었습니다.`
        : `성공적으로 ${Math.abs(amount).toLocaleString()} 크레딧이 조정(차감)되었습니다.`
      );
      await fetchData();
    } catch (err: any) {
      alert('오류가 발생했습니다: ' + err.message);
    } finally {
      setTopupLoading(false);
    }
  };

  const [editKakao, setEditKakao] = useState('');
  const [showKakaoHelpEdit, setShowKakaoHelpEdit] = useState(false);
  const [editGreetingTitle, setEditGreetingTitle] = useState('');
  const [editGreetingContent, setEditGreetingContent] = useState('');
  const [editProfileImg, setEditProfileImg] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editCustomPhone, setEditCustomPhone] = useState('');
  const [editCustomAddress, setEditCustomAddress] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editRegistrationNumber, setEditRegistrationNumber] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCertificationMessage, setEditCertificationMessage] = useState('');
  const [editPlannerName, setEditPlannerName] = useState('');

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

  // Reset pages when filters change
  useEffect(() => {
    setAnalysisPage(1);
  }, [leadsPeriod, leadsCategoryFilter, leadSearchTerm]);

  useEffect(() => {
    setConsultPage(1);
  }, [leadsPeriod, consultCategoryFilter, leadSearchTerm]);
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
        let { data: adminPlanner } = await supabase
          .from('planners')
          .select()
          .eq('planner_code', 'admin')
          .maybeSingle();

        if (!adminPlanner) {
          const newAdmin = {
            id: '00000000-0000-4000-a000-000000000000',
            planner_code: 'admin',
            name: '플랫폼 총관리자',
            phone: '080-808-1088',
            custom_phone: '080-808-1088',
            custom_address: '보험대리점 : 더윤컴퍼니 (등록번호 : 제2006038313호) 본 광고는 광고심의기준을 준수하였으며, 유효기간은 심의일로부터 1년입니다.',
            greeting_title: '나만을 위한 맞춤형 보험 비교 서비스',
            greeting_content: '대한민국 모든 보험사의 상품을 0.1초 만에 비교 분석하여 불필요한 고정 지출을 성공적으로 줄여 드립니다.',
            company_name: '더윤컴퍼니',
            subscription_status: 'active',
            is_admin: true
          };
          const { data: inserted, error: insertErr } = await supabase
            .from('planners')
            .insert(newAdmin)
            .select()
            .single();
          if (insertErr) {
            console.error("Failed to insert default admin planner:", insertErr);
          }
          adminPlanner = inserted || newAdmin as any;
        }

        setCurrentUser({
          role: 'super',
          plannerId: adminPlanner?.id,
          name: '플랫폼 총관리자',
          plannerCode: 'admin',
          subscriptionStatus: 'active'
        });
      } else if (role === 'agency') {
        let agency = null;
        let repPlanner = null;
        try {
          // 1. If currently in an agency context, prioritize that
          if (currentUser.agencyId) {
            const { data } = await supabase.from('agencies').select().eq('id', currentUser.agencyId).maybeSingle();
            agency = data;
          }
          // 2. Otherwise get the first agency in the database
          if (!agency) {
            const { data: testAgencies } = await supabase.from('agencies').select().limit(1);
            agency = testAgencies?.[0];
          }
          // 3. Find representative planner under this agency
          if (agency) {
            const { data: representative } = await supabase
              .from('planners')
              .select()
              .eq('agency_id', agency.id)
              .eq('is_admin', true)
              .limit(1);
            repPlanner = representative?.[0];
            
            if (!repPlanner) {
              const { data: anyPlanner } = await supabase
                .from('planners')
                .select()
                .eq('agency_id', agency.id)
                .limit(1);
              repPlanner = anyPlanner?.[0];
            }
          }
        } catch (e) {
          console.warn("Supabase fetch failed for agency simulation:", e);
        }

        if (agency) {
          setCurrentUser({
            role: 'agency',
            agencyId: agency.id,
            agencyCode: agency.code,
            plannerId: repPlanner?.id || '11111111-1111-4111-a111-111111111111',
            name: `${agency.name} 대표자`,
            subscriptionStatus: agency.subscription_status,
            expiresAt: agency.subscription_expires_at || new Date(Date.now() + 30 * 86400000).toISOString()
          });
        } else {
          // Fallback to local demo agency state
          setCurrentUser({
            role: 'agency',
            plannerId: '11111111-1111-4111-a111-111111111111',
            agencyId: '88888888-8888-4888-a888-888888888888',
            agencyCode: 'demo-agency',
            name: '대리점 체험대표',
            plannerCode: 'test',
            subscriptionStatus: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
        }
      } else if (role === 'planner') {
        let testPlanner = null;
        try {
          // 1. If currently in an agency context, look up a planner under this agency
          if (currentUser.agencyId) {
            const { data } = await supabase
              .from('planners')
              .select()
              .eq('agency_id', currentUser.agencyId)
              .eq('is_admin', false)
              .limit(1);
            testPlanner = data?.[0];
            
            if (!testPlanner) {
              const { data: anyPlanner } = await supabase
                .from('planners')
                .select()
                .eq('agency_id', currentUser.agencyId)
                .limit(1);
              testPlanner = anyPlanner?.[0];
            }
          }
          // 2. Otherwise try to query test_planner
          if (!testPlanner) {
            const { data } = await supabase.from('planners').select().eq('planner_code', 'test_planner').maybeSingle();
            testPlanner = data;
          }
          // 3. Otherwise get any planner in the database
          if (!testPlanner) {
            const { data: anyPlanners } = await supabase.from('planners').select().limit(1);
            testPlanner = anyPlanners?.[0];
          }
        } catch (e) {
          console.warn("Supabase fetch failed for planner simulation:", e);
        }

        if (testPlanner) {
          setCurrentUser({
            role: 'planner',
            plannerId: testPlanner.id,
            agencyId: testPlanner.agency_id,
            name: testPlanner.name,
            plannerCode: testPlanner.planner_code,
            subscriptionStatus: testPlanner.subscription_status,
            expiresAt: testPlanner.subscription_expires_at || new Date(Date.now() + 30 * 86400000).toISOString()
          });
        } else {
          // Fallback to local demo planner state
          setCurrentUser({
            role: 'planner',
            plannerId: '22222222-2222-4222-a222-222222222222',
            agencyId: null,
            name: '설계사 체험설계',
            plannerCode: 'test_planner',
            subscriptionStatus: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
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
  // Perform Login
  const handleLogin = async (e?: React.FormEvent, codeOverride?: string, passwordOverride?: string) => {
    if (e) e.preventDefault();
    setLoginError('');
    const targetCode = (codeOverride || loginCode).trim();
    const targetPassword = (passwordOverride || loginPassword).trim();
    if (!targetCode) return;
    setLoading(true);

    // Intercept Demo accounts
    if (targetCode === 'test' && targetPassword === '1234') {
      setCurrentUser({
        role: 'agency',
        plannerId: '11111111-1111-4111-a111-111111111111',
        agencyId: '88888888-8888-4888-a888-888888888888',
        agencyCode: 'demo-agency',
        name: '대리점 체험대표',
        plannerCode: 'test',
        subscriptionStatus: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      // Auto-register push subscription for demo after login succeeds
      setTimeout(async () => {
        try {
          await registerPushSubscription('11111111-1111-4111-a111-111111111111');
        } catch (e) {
          console.warn('Auto-registering push subscription failed for demo:', e);
        }
      }, 1000);
      
      setAgencies(prev => {
        if (!prev.some(a => a.id === '88888888-8888-4888-a888-888888888888')) {
          return [...prev, {
            id: '88888888-8888-4888-a888-888888888888',
            name: '스마트보험파트너스 데모 대리점',
            code: 'demo-agency',
            subscription_status: 'active',
            subscription_tier: 'pro',
            subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            max_planner_limit: 28,
            current_credits: 153000,
            lead_routing_type: 'distribute_auto_round_robin',
            logo_url: '/logo.png',
            email: 'demo@insurance-partner.com'
          }];
        }
        return prev;
      });
      
      setPlanners(prev => {
        const nonDemo = prev.filter(p => p.agency_id !== '88888888-8888-4888-a888-888888888888');
        return [
          ...nonDemo,
          { 
            id: '11111111-1111-4111-a111-111111111111', 
            agency_id: '88888888-8888-4888-a888-888888888888', 
            name: '대리점 체험대표', 
            planner_code: 'test', 
            active: true, 
            phone: '010-0000-0000', 
            is_admin: true, 
            subscription_status: 'active', 
            registration_number: 'dist_weight:10', 
            monthly_credit_used: 50, 
            monthly_credit_quota: 200,
            company_name: '스마트보험파트너스 데모 대리점',
            custom_phone: '010-0000-0000',
            custom_address: '서울시 강남구 테헤란로 123'
          },
          { 
            id: '33333333-3333-4333-a333-333333333333', 
            agency_id: '88888888-8888-4888-a888-888888888888', 
            name: '김설계', 
            planner_code: 'p1', 
            active: true, 
            phone: '010-1111-2222', 
            is_admin: false, 
            subscription_status: 'active', 
            registration_number: 'dist_weight:8', 
            monthly_credit_used: 120, 
            monthly_credit_quota: 300 
          },
          { 
            id: '44444444-4444-4444-a444-444444444444', 
            agency_id: '88888888-8888-4888-a888-888888888888', 
            name: '이보장', 
            planner_code: 'p2', 
            active: true, 
            phone: '010-2222-3333', 
            is_admin: false, 
            subscription_status: 'active', 
            registration_number: 'dist_weight:5', 
            monthly_credit_used: 85, 
            monthly_credit_quota: 250 
          },
          { 
            id: '55555555-5555-4555-a555-555555555555', 
            agency_id: '88888888-8888-4888-a888-888888888888', 
            name: '박보험', 
            planner_code: 'p3', 
            active: true, 
            phone: '010-3333-4444', 
            is_admin: false, 
            subscription_status: 'active', 
            registration_number: 'dist_disabled', 
            monthly_credit_used: 0, 
            monthly_credit_quota: 100 
          },
          { 
            id: '66666666-6666-4666-a666-666666666666', 
            agency_id: '88888888-8888-4888-a888-888888888888', 
            name: '최분석', 
            planner_code: 'p4', 
            active: true, 
            phone: '010-4444-5555', 
            is_admin: false, 
            subscription_status: 'active', 
            registration_number: 'dist_weight:10', 
            monthly_credit_used: 150, 
            monthly_credit_quota: 500 
          },
        ];
      });

      const remodelingPoliciesHong = {
        current_total_premium: 280000,
        policies: [
          {
            insurance_company: "삼성생명",
            product_name: "무배당 삼성종신보험",
            monthly_premium: 150000,
            riders: [
              { rider_name: "일반사망보장", coverage_amount: 100000000 },
              { rider_name: "암진단특약", coverage_amount: 30000000 },
              { rider_name: "뇌출혈진단특약", coverage_amount: 20000000 },
              { rider_name: "급성심근경색특약", coverage_amount: 20000000 }
            ]
          },
          {
            insurance_company: "메리츠화재",
            product_name: "무배당 메리츠알파건강보험",
            monthly_premium: 130000,
            riders: [
              { rider_name: "암진단비(유사암제외)", coverage_amount: 50000000 },
              { rider_name: "유사암진단비", coverage_amount: 10000000 },
              { rider_name: "뇌혈관질환진단비", coverage_amount: 20000000 },
              { rider_name: "허혈성심장질환진단비", coverage_amount: 20000000 },
              { rider_name: "질병수술비", coverage_amount: 5000000 }
            ]
          }
        ]
      };

      const remodelingPoliciesSim = {
        current_total_premium: 195000,
        policies: [
          {
            insurance_company: "교보생명",
            product_name: "무배당 교보실손종합보장보험",
            monthly_premium: 95000,
            riders: [
              { rider_name: "상해사망", coverage_amount: 50000000 },
              { rider_name: "질병사망", coverage_amount: 30000000 },
              { rider_name: "상해입원일당", coverage_amount: 30000 }
            ]
          },
          {
            insurance_company: "현대해상",
            product_name: "무배당 현대태아안심보험",
            monthly_premium: 100000,
            riders: [
              { rider_name: "암진단비", coverage_amount: 30000000 },
              { rider_name: "뇌혈관진단비", coverage_amount: 20000000 },
              { rider_name: "허혈성심장진단비", coverage_amount: 20000000 }
            ]
          }
        ]
      };

      setLeads([
        {
          id: 9901,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: '33333333-3333-4333-a333-333333333333',
          name: '홍길동',
          phone: '010-9999-8888',
          age: 45,
          insurance_type: 'remodeling',
          monthly_premium: 280000,
          status: 'consulting',
          lead_source: 'remodeling',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          planner_name: '김설계',
          raw_payload: {
            gender: 'M',
            utm_source: 'instagram',
            simulation_code: 'SIM-REMOD-01',
            company: '삼성생명',
            email: 'gildong@naver.com',
            analysisInputs: {
              _remodelingCoverage: remodelingPoliciesHong
            },
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '고객 분석 보고서 작성 시도', created_at: new Date(Date.now() - 3600000).toISOString() }
            ]
          }
        },
        {
          id: 9902,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: '44444444-4444-4444-a444-444444444444',
          name: '성춘향',
          phone: '010-8888-7777',
          age: 32,
          insurance_type: 'cancer',
          monthly_premium: 85000,
          status: 'new',
          lead_source: 'compare',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          planner_name: '이보장',
          raw_payload: {
            gender: 'F',
            utm_source: 'naver',
            simulation_code: 'SIM-CANCER-02',
            company: '메리츠화재',
            email: 'chunhyang@daum.net',
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '암보험 신규 분석 완료', created_at: new Date(Date.now() - 7200000).toISOString() }
            ]
          }
        },
        {
          id: 9903,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: '66666666-6666-4666-a666-666666666666',
          name: '이몽룡',
          phone: '010-7777-6666',
          age: 28,
          insurance_type: 'driver',
          monthly_premium: 32000,
          status: 'completed',
          lead_source: 'compare',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          planner_name: '최분석',
          raw_payload: {
            gender: 'M',
            utm_source: 'facebook',
            simulation_code: 'SIM-DRIVER-03',
            company: 'DB손해보험',
            email: 'mongryong@gmail.com',
            timeline: [
              { id: '1', type: 'status_change', author: '최분석', detail: '운전자보험 상담 완료 및 청약 가입', created_at: new Date(Date.now() - 40000000).toISOString() }
            ]
          }
        },
        {
          id: 9904,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: '33333333-3333-4333-a333-333333333333',
          name: '심청',
          phone: '010-5555-4444',
          age: 24,
          insurance_type: 'remodeling_consult',
          monthly_premium: 195000,
          status: 'new',
          lead_source: 'kakaotalk',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          planner_name: '김설계',
          raw_payload: {
            gender: 'F',
            utm_source: 'kakaotalk',
            simulation_code: 'SIM-REMOD-04',
            company: '교보생명',
            email: 'cheong@naver.com',
            analysisInputs: {
              _remodelingCoverage: remodelingPoliciesSim
            },
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '카카오톡 정밀 리모델링 상담 요청 접수', created_at: new Date(Date.now() - 1800000).toISOString() }
            ]
          }
        },
        {
          id: 9905,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: '44444444-4444-4444-a444-444444444444',
          name: '임꺽정',
          phone: '010-6666-5555',
          age: 50,
          insurance_type: 'cancer_consult',
          monthly_premium: 145000,
          status: 'consulting',
          lead_source: 'compare',
          created_at: new Date(Date.now() - 43200000).toISOString(),
          planner_name: '이보장',
          raw_payload: {
            gender: 'M',
            utm_source: 'google_ads',
            simulation_code: 'SIM-CANCER-05',
            company: '한화손해보험',
            email: 'kkukjung@daum.net',
            timeline: [
              { id: '1', type: 'status_change', author: '이보장', detail: '상담전화 연결 및 통화 진행 중', created_at: new Date(Date.now() - 20000000).toISOString() }
            ]
          }
        },
        {
          id: 9906,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: '66666666-6666-4666-a666-666666666666',
          name: '장보고',
          phone: '010-4444-3333',
          age: 38,
          insurance_type: 'support_consult',
          status: 'new',
          lead_source: 'support',
          created_at: new Date(Date.now() - 10800000).toISOString(),
          planner_name: '최분석',
          raw_payload: {
            gender: 'M',
            utm_source: 'organic',
            company: '해상무역진흥',
            email: 'bogo@trade.com',
            subject: '대리점 단체 구독 크레딧 자동 배분 문의',
            message: '대리점 Pro 등급 가입 시 소속 설계사들에게 크레딧이 자동으로 매달 분배되는 방식과 가중치 분배 방식 차이를 더 자세히 설명해 주세요.',
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '1:1 고객센터 상담 문의가 성공적으로 접수되었습니다.', created_at: new Date(Date.now() - 10800000).toISOString() }
            ]
          }
        },
        {
          id: 9907,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: undefined,
          name: '놀부',
          phone: '010-3333-2222',
          age: 55,
          insurance_type: 'cancer_consult',
          monthly_premium: 190000,
          status: 'new',
          lead_source: 'compare',
          created_at: new Date(Date.now() - 1200000).toISOString(),
          planner_name: '미배정',
          raw_payload: {
            gender: 'M',
            utm_source: 'naver',
            simulation_code: 'SIM-CANCER-07',
            company: '삼성화재',
            email: 'nolbu@greedy.com',
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '공용 유입 DB 수동 배정 풀(Manual Pool) 대기 중', created_at: new Date(Date.now() - 1200000).toISOString() }
            ]
          }
        },
        {
          id: 9908,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: '44444444-4444-4444-a444-444444444444',
          name: '흥부',
          phone: '010-2222-1111',
          age: 52,
          insurance_type: 'cancer_underwriting',
          monthly_premium: 98000,
          status: 'new',
          lead_source: 'underwriting',
          created_at: new Date(Date.now() - 5000000).toISOString(),
          planner_name: '이보장',
          raw_payload: {
            gender: 'M',
            utm_source: 'instagram',
            simulation_code: 'SIM-CANCER-08',
            company: 'KB손해보험',
            email: 'heungbu@good.com',
            underwriting: {
              disease_history: '고혈압 약 복용 중 (3년)',
              additional_notes: '현재 약 복용 외에 다른 합병증이나 수술 이력은 전혀 없습니다.'
            },
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '가입 사전심사 신청 접수 완료', created_at: new Date(Date.now() - 5000000).toISOString() }
            ]
          }
        },
        {
          id: 9909,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: '33333333-3333-4333-a333-333333333333',
          name: '김종신',
          phone: '010-1234-5678',
          age: 40,
          insurance_type: 'whole',
          monthly_premium: 180000,
          status: 'new',
          lead_source: 'compare',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          planner_name: '김설계',
          raw_payload: {
            gender: 'M',
            utm_source: 'naver',
            simulation_code: 'SIM-WHOLE-09',
            email: 'jongshin@gmail.com',
            analysisInputs: {
              wholeLife: {
                isStepUp: false,
                objective: 'savings',
                refundType: 'low',
                deathBenefit: 200000000
              }
            },
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '종신보험 상세 설계 비교분석 완료', created_at: new Date(Date.now() - 7200000).toISOString() }
            ]
          }
        },
        {
          id: 9910,
          agency_id: '88888888-8888-4888-a888-888888888888',
          planner_id: '44444444-4444-4444-a444-444444444444',
          name: '박종신',
          phone: '010-8765-4321',
          age: 35,
          insurance_type: 'whole_consult',
          monthly_premium: 220000,
          status: 'new',
          lead_source: 'kakaotalk',
          planner_name: '이보장',
          raw_payload: {
            gender: 'F',
            utm_source: 'google_ads',
            simulation_code: 'SIM-WHOLE-10',
            email: 'parkjs@naver.com',
            analysisInputs: {
              wholeLife: {
                isStepUp: true,
                objective: 'family',
                refundType: 'standard',
                deathBenefit: 150000000
              }
            },
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '종신보험 카카오톡 상담 요청 접수 완료', created_at: new Date(Date.now() - 14400000).toISOString() }
            ]
          }
        }
      ]);
      
      setActiveTab('leads');
      setLoading(false);
      return;
    }

    if (targetCode === 'test_planner' && targetPassword === '1234') {
      setCurrentUser({
        role: 'planner',
        plannerId: '22222222-2222-4222-a222-222222222222',
        agencyId: null,
        name: '설계사 체험설계',
        plannerCode: 'test_planner',
        subscriptionStatus: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      setPlanners([
        {
          id: '22222222-2222-4222-a222-222222222222',
          agency_id: null,
          name: '설계사 체험설계',
          planner_code: 'test_planner',
          active: true,
          phone: '010-5555-6666',
          is_admin: false,
          subscription_status: 'active',
          monthly_credit_used: 40,
          monthly_credit_quota: 200,
          company_name: '개인 스마트 설계사',
          custom_phone: '010-5555-6666',
          custom_address: '서울시 서초구 서초대로 456'
        }
      ]);

      setAgencies([]);
      
      const remodelingPoliciesLim = {
        current_total_premium: 450000,
        policies: [
          {
            insurance_company: "한화생명",
            product_name: "무배당 한화종신보장보험",
            monthly_premium: 250000,
            riders: [
              { rider_name: "일반사망", coverage_amount: 200000000 },
              { rider_name: "암수술비", coverage_amount: 5000000 }
            ]
          },
          {
            insurance_company: "DB손해보험",
            product_name: "무배당 DB참좋은훼밀리건강보험",
            monthly_premium: 200000,
            riders: [
              { rider_name: "암진단비", coverage_amount: 50000000 },
              { rider_name: "뇌혈관진단비", coverage_amount: 30000000 },
              { rider_name: "허혈성심장진단비", coverage_amount: 30000000 },
              { rider_name: "상해후유장해", coverage_amount: 100000000 }
            ]
          }
        ]
      };

      const remodelingPoliciesHeung = {
        current_total_premium: 128000,
        policies: [
          {
            insurance_company: "KB손해보험",
            product_name: "무배당 KB간편건강보험",
            monthly_premium: 128000,
            riders: [
              { rider_name: "암진단비", coverage_amount: 20000000 },
              { rider_name: "뇌출혈진단비", coverage_amount: 10000000 },
              { rider_name: "급성심근경색진단비", coverage_amount: 10000000 }
            ]
          }
        ]
      };

      setLeads([
        {
          id: 9911,
          planner_id: '22222222-2222-4222-a222-222222222222',
          name: '임꺽정',
          phone: '010-6666-5555',
          age: 50,
          insurance_type: 'remodeling',
          monthly_premium: 450000,
          status: 'new',
          lead_source: 'remodeling',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          planner_name: '설계사 체험설계',
          raw_payload: {
            gender: 'M',
            utm_source: 'instagram',
            simulation_code: 'SIM-REMOD-11',
            company: '삼성생명',
            email: 'kkukjung@daum.net',
            analysisInputs: {
              _remodelingCoverage: remodelingPoliciesLim
            },
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '보험료 다이어트 분석 시도', created_at: new Date(Date.now() - 1800000).toISOString() }
            ]
          }
        },
        {
          id: 9912,
          planner_id: '22222222-2222-4222-a222-222222222222',
          name: '심청',
          phone: '010-5555-4444',
          age: 24,
          insurance_type: 'driver',
          monthly_premium: 25000,
          status: 'consulting',
          lead_source: 'compare',
          created_at: new Date(Date.now() - 43200000).toISOString(),
          planner_name: '설계사 체험설계',
          raw_payload: {
            gender: 'F',
            utm_source: 'naver',
            simulation_code: 'SIM-DRIVER-12',
            company: 'KB손해보험',
            email: 'cheong@naver.com',
            timeline: [
              { id: '1', type: 'status_change', author: '설계사 체험설계', detail: '전화 상담 시작', created_at: new Date(Date.now() - 20000000).toISOString() }
            ]
          }
        },
        {
          id: 9913,
          planner_id: '22222222-2222-4222-a222-222222222222',
          name: '흥부',
          phone: '010-2222-1111',
          age: 48,
          insurance_type: 'remodeling_consult',
          monthly_premium: 128000,
          status: 'new',
          lead_source: 'remodeling',
          created_at: new Date(Date.now() - 600000).toISOString(),
          planner_name: '설계사 체험설계',
          raw_payload: {
            gender: 'M',
            utm_source: 'kakaotalk',
            simulation_code: 'SIM-REMOD-13',
            company: '메리츠화재',
            email: 'heungbu@gmail.com',
            analysisInputs: {
              _remodelingCoverage: remodelingPoliciesHeung
            },
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '카톡 정밀 상담 요청 접수', created_at: new Date(Date.now() - 600000).toISOString() }
            ]
          }
        },
        {
          id: 9914,
          planner_id: '22222222-2222-4222-a222-222222222222',
          name: '김종신',
          phone: '010-1234-5678',
          age: 40,
          insurance_type: 'whole',
          monthly_premium: 180000,
          status: 'new',
          lead_source: 'compare',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          planner_name: '설계사 체험설계',
          raw_payload: {
            gender: 'M',
            utm_source: 'naver',
            simulation_code: 'SIM-WHOLE-14',
            email: 'jongshin@gmail.com',
            analysisInputs: {
              wholeLife: {
                isStepUp: false,
                objective: 'savings',
                refundType: 'low',
                deathBenefit: 200000000
              }
            },
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '종신보험 상세 설계 비교분석 완료', created_at: new Date(Date.now() - 7200000).toISOString() }
            ]
          }
        },
        {
          id: 9915,
          planner_id: '22222222-2222-4222-a222-222222222222',
          name: '박종신',
          phone: '010-8765-4321',
          age: 35,
          insurance_type: 'whole_consult',
          monthly_premium: 220000,
          status: 'new',
          lead_source: 'kakaotalk',
          planner_name: '설계사 체험설계',
          raw_payload: {
            gender: 'F',
            utm_source: 'google_ads',
            simulation_code: 'SIM-WHOLE-15',
            email: 'parkjs@naver.com',
            analysisInputs: {
              wholeLife: {
                isStepUp: true,
                objective: 'family',
                refundType: 'standard',
                deathBenefit: 150000000
              }
            },
            timeline: [
              { id: '1', type: 'status_change', author: '시스템', detail: '종신보험 카카오톡 상담 요청 접수 완료', created_at: new Date(Date.now() - 14400000).toISOString() }
            ]
          }
        }
      ]);
      
      setActiveTab('leads');
      setLoading(false);
      return;
    }

    try {
      // Find planner by code
      const { data: planner, error } = await supabase
        .from('planners')
        .select('*, agencies(code)')
        .eq('planner_code', targetCode)
        .single();

      if (error || !planner) {
        setLoginError('등록되지 않은 설계사 고유코드입니다. 파트너 가입을 먼저 진행해 주세요.');
        setLoading(false);
        return;
      }

      // Validate password if set
      if (planner.password && planner.password.trim() !== targetPassword) {
        setLoginError('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
        setLoading(false);
        return;
      }

      let userRole: 'super' | 'agency' | 'planner' = 'planner';
      if (planner.planner_code === 'admin') {
        userRole = 'super';
      } else if (planner.is_admin) {
        userRole = 'agency';
      }

      setCurrentUser({
        role: userRole,
        plannerId: planner.id,
        agencyId: planner.agency_id,
        agencyCode: (planner as any).agencies?.code || undefined,
        name: planner.name,
        plannerCode: planner.planner_code,
        subscriptionStatus: planner.subscription_status,
        expiresAt: planner.subscription_expires_at
      });

      // Auto-register push subscription after login succeeds
      if (planner.id) {
        setTimeout(async () => {
          try {
            await registerPushSubscription(planner.id);
          } catch (e) {
            console.warn('Auto-registering push subscription failed:', e);
          }
        }, 1000);
      }
      
      setActiveTab('leads');
    } catch (err) {
      setLoginError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-login for demo parameters from B2B Hub
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demoType = params.get('demo');
    if (demoType && currentUser.role === 'guest') {
      if (demoType === 'agency') {
        handleLogin(undefined, 'test', '1234');
      } else if (demoType === 'planner') {
        handleLogin(undefined, 'test_planner', '1234');
      }
    }
    
    // Auto-select registration tab if navigated with register=true
    if (params.get('register') === 'true') {
      setSignupTab('register');
    }
  }, [currentUser.role]);

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

      if (invitedAgencyId) {
        // Check agency planner capacity limit
        const { count, error: countErr } = await supabase
          .from('planners')
          .select('*', { count: 'exact', head: true })
          .eq('agency_id', invitedAgencyId)
          .eq('subscription_status', 'active');

        const { data: agencyData, error: agencyErr } = await supabase
          .from('agencies')
          .select('max_planner_limit, subscription_tier')
          .eq('id', invitedAgencyId)
          .single();

        if (!agencyErr && agencyData) {
          const currentCount = count || 0;
          if (currentCount >= (agencyData.max_planner_limit || 13)) {
            alert(`[가입 제한] 해당 대리점의 요금제(${agencyData.subscription_tier?.toUpperCase() || 'BASIC'}) 설계사 등록 한도(${agencyData.max_planner_limit || 13}명)를 초과하였습니다. 대리점 관리자에게 요금제 업그레이드를 요청해 주세요.`);
            setLoading(false);
            return;
          }
        }
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
          lead_routing_type: regRoutingType,
          subscription_tier: regAgencyTier,
          max_planner_limit: regAgencyTier === 'basic' ? 13 : regAgencyTier === 'pro' ? 28 : 150
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

      // 2.5. Trigger onboarding welcome chat (runs asynchronously, caught internally)
      await triggerWelcomeChat(plannerData.id, plannerData.name);

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
      
      const currentPlanners = plannerList && plannerList.length > 0 ? plannerList : planners;
      const currentAgencies = agencyList && agencyList.length > 0 ? agencyList : agencies;

      if (plannerList && plannerList.length > 0) {
        setPlanners(plannerList);
      }
      if (agencyList && agencyList.length > 0) {
        const mappedAgencies = agencyList.map(a => {
          if (a.id === '88888888-8888-4888-a888-888888888888') {
            const override = sessionStorage.getItem('demo_lead_routing_type');
            if (override) {
              return { ...a, lead_routing_type: override };
            }
          }
          return a;
        });
        setAgencies(mappedAgencies);
      }

      // 4. Fetch Credit Transactions
      let txQuery = supabase.from('credit_transactions').select().order('created_at', { ascending: false });
      if (currentUser.role === 'agency' || currentUser.role === 'planner') {
        txQuery = txQuery.eq('agency_id', activeBillingAgencyId);
      }
      const { data: txList } = await txQuery;
      
      if (txList && txList.length > 0) {
        const mappedTx = txList.map(tx => {
          const matchedPlanner = currentPlanners.find(p => p.id === tx.planner_id);
          return {
            ...tx,
            planner_name: matchedPlanner ? matchedPlanner.name : '시스템/관리자'
          };
        });
        setTransactions(mappedTx as CreditTransaction[]);
      }

      // 5. Pre-populate alert configs
      if (currentUser.role === 'agency' && currentUser.agencyId) {
        const myAgency = currentAgencies.find(a => a.id === currentUser.agencyId);
        if (myAgency) {
          setAlertThreshold((myAgency as any).low_credit_alert_threshold ?? 2000);
          setAlertPhone((myAgency as any).low_credit_alert_phone ?? '');
        }
      }

      // 2. Fetch Leads based on permission boundaries
      let query = supabase.from('customer_leads').select().order('created_at', { ascending: false });

      // Filter by is_demo status to keep demo and production leads fully segregated
      const isUserDemo = currentUser.plannerCode === 'test_planner' || currentUser.plannerCode === 'test' || currentUser.agencyId === '88888888-8888-4888-a888-888888888888' || (currentUser as any).isDemo;
      query = query.eq('is_demo', !!isUserDemo);

      if (currentUser.role === 'planner') {
        // Planner can see their own assigned leads OR unassigned leads from their agency
        if (currentUser.agencyId) {
          query = query.or(`planner_id.eq.${currentUser.plannerId},and(planner_id.is.null,agency_id.eq.${currentUser.agencyId})`);
        } else {
          // Freelance planner can see their own assigned leads OR unassigned leads with no agency
          query = query.or(`planner_id.eq.${currentUser.plannerId},and(planner_id.is.null,agency_id.is.null)`);
        }
      } else if (currentUser.role === 'agency') {
        // Agency Admin can see all leads under their agency
        query = query.eq('agency_id', currentUser.agencyId);
      }

      const { data: leadList } = await query;
      
      if (leadList && leadList.length > 0) {
        // Map planner names locally for display
        const mappedLeads = leadList
          .filter(lead => {
            if (currentUser.role === 'planner') {
              // Planner can only see their assigned leads OR unassigned CARD 1 leads
              if (lead.planner_id === currentUser.plannerId) return true;
              const isHighIntent = isLeadConsult(lead.insurance_type) || lead.insurance_type?.includes('_underwriting');
              if (lead.planner_id === null && !isHighIntent) return true;
              return false;
            }
            return true;
          })
          .map(lead => {
            const matchedPlanner = currentPlanners.find(p => p.id === lead.planner_id);
            return {
              ...lead,
              planner_name: matchedPlanner ? matchedPlanner.name : '미배정'
            };
          });

        setLeads(mappedLeads);
      }

      // 3. Fetch Visitor Logs based on permission boundaries
      let visitorQuery = supabase.from('visitor_logs').select().order('created_at', { ascending: false });

      if (currentUser.role === 'planner') {
        visitorQuery = visitorQuery.eq('planner_code', currentUser.plannerCode);
      } else if (currentUser.role === 'agency') {
        const plannerCodes = currentPlanners
          .filter(p => p.agency_id === currentUser.agencyId)
          .map(p => p.planner_code);
        visitorQuery = visitorQuery.in('planner_code', plannerCodes);
      }

      const { data: visitorList } = await visitorQuery;
      if (visitorList && visitorList.length > 0) {
        setVisitorLogs(visitorList);
      }

      // Pre-populate profile editing states
      if (currentUser.plannerId) {
        const myProfile = currentPlanners.find(p => p.id === currentUser.plannerId);
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
          const rawRegNum = myProfile.registration_number || '';
          const delibPart = rawRegNum.includes('|') ? rawRegNum.split('|')[0] : (rawRegNum.startsWith('dist_') ? '' : rawRegNum);
          setEditRegistrationNumber(delibPart);
          setEditEmail(myProfile.email || '');
          setEditCertificationMessage(myProfile.certification_message || '');
          setEditPlannerName(myProfile.name || '');
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
      const isSupport = lead.insurance_type === 'support_consult';
      const isConsult = isLeadConsult(lead.insurance_type);
      
      let detail = '무료 보장 진단 및 상담 신청이 접수되었습니다.';
      if (isSupport) {
        detail = '고객센터 1:1 문의글이 성공적으로 접수되었습니다.';
      } else if (isConsult) {
        detail = '카카오톡 1:1 최저가 설계서 상담 신청이 접수되었습니다.';
      }

      timeline.push({
        id: 'created',
        type: 'created',
        author: '시스템',
        detail,
        created_at: lead.created_at
      });
    }

    // 2. Add stored timeline events
    if (lead.raw_payload?.timeline && Array.isArray(lead.raw_payload.timeline)) {
      const mappedTimeline = lead.raw_payload.timeline.map((event: any) => {
        if (lead.insurance_type === 'support_consult' && event.type === 'kakao_click') {
          return {
            ...event,
            type: 'support_submit',
            detail: '고객이 1:1 문의 폼을 작성하고 [전송하기]를 눌러 문의를 남겼습니다.'
          };
        }
        return event;
      });
      timeline.push(...mappedTimeline);
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

      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        const updatedLeads = leads.map(l => l.id === leadId ? { ...l, status: newStatus, raw_payload: updatedPayload } : l);
        setLeads(updatedLeads);

        const nextSelectedLead = updatedLeads.find(l => l.id === leadId);
        if (nextSelectedLead) {
          setSelectedLead(nextSelectedLead);
        }
        return;
      }

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

      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        const updatedLeads = leads.map(l => l.id === leadId ? { ...l, raw_payload: updatedPayload } : l);
        setLeads(updatedLeads);
        
        const nextSelectedLead = updatedLeads.find(l => l.id === leadId);
        if (nextSelectedLead) {
          setSelectedLead(nextSelectedLead);
        }
        setNewMemoText('');
        return;
      }

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
      return `${clean.slice(0, 3)}-${clean.slice(3, 5)}XX-${clean.slice(7)}`;
    } else if (clean.length === 10) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 4)}XX-${clean.slice(6)}`;
    }
    return phone;
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSendSmsTemplate = (lead: Lead) => {
    const isConsult = isLeadConsult(lead.insurance_type);
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
          const isConsult = isLeadConsult(l.insurance_type);
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

      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
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
        alert(`[${plannerName}] 설계사에게 성공적으로 수동 배정되었습니다. (데모 모드)`);
        return;
      }

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
      if (!currentUser.agencyId) return;

      // 1. Get current count of active planners in the agency
      const { count, error: countErr } = await supabase
        .from('planners')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', currentUser.agencyId)
        .eq('subscription_status', 'active');

      // 2. Get the agency's limit
      const { data: agencyData, error: agencyErr } = await supabase
        .from('agencies')
        .select('max_planner_limit, subscription_tier')
        .eq('id', currentUser.agencyId)
        .single();

      if (!agencyErr && agencyData) {
        const activeCount = count || 0;
        if (activeCount >= (agencyData.max_planner_limit || 13)) {
          alert(`[승인 실패] 대리점의 요금제(${agencyData.subscription_tier?.toUpperCase() || 'BASIC'}) 설계사 등록 한도(${agencyData.max_planner_limit || 13}명)를 초과하였습니다. 설계사를 추가하려면 대리점 요금제를 업그레이드해 주세요.`);
          return;
        }
      }

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
      alert("지점(소속) 이름은 필수 입력 항목입니다. (예: 더윤컴퍼니 강남지점)");
      return;
    }
    if (!editPlannerName || editPlannerName.trim() === '') {
      alert("설계사 이름은 필수 입력 항목입니다.");
      return;
    }
    if (!editCustomAddress || editCustomAddress.trim() === '') {
      alert("지점 주소는 필수 입력 항목입니다. (예: 서울시 강남구 테헤란로 123)");
      return;
    }
    setLoading(true);
    try {
      const updatedBranding = {
        type: currentUser.role === 'agency' ? 'agency' as const : 'planner' as const,
        plannerId: currentUser.plannerId || null,
        agencyId: currentUser.agencyId || null,
        name: editPlannerName || currentUser.name || '',
        profileImageUrl: editProfileImg || null,
        logoUrl: editLogoUrl || null,
        greetingTitle: editGreetingTitle || '',
        greetingContent: editGreetingContent || '',
        customPhone: editCustomPhone || '',
        customAddress: editCustomAddress || '',
        certificationMessage: editCertificationMessage || null,
        kakaoLink: editKakao || null,
        agencyName: editCompanyName || '',
        agencyAddress: editCustomAddress || '',
        registrationNumber: editRegistrationNumber || null,
        customEmail: editEmail || '',
        leadRoutingType: sessionStorage.getItem('demo_lead_routing_type') || null
      };

      const currentPlanner = planners.find(p => p.id === currentUser.plannerId);
      const rawRegNum_save = currentPlanner?.registration_number || '';
      const existingDistSetting = rawRegNum_save.includes('|') ? rawRegNum_save.split('|')[1] : (rawRegNum_save.startsWith('dist_') ? rawRegNum_save : '');
      const combinedRegistrationNumber = editRegistrationNumber ? (existingDistSetting ? `${editRegistrationNumber}|${existingDistSetting}` : editRegistrationNumber) : (existingDistSetting || '');

      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        setCurrentUser(prev => ({
          ...prev,
          name: editGreetingTitle ? `${editGreetingTitle} (${editCompanyName})` : prev.name
        }));
        setPlanners(prev => prev.map(p => p.id === currentUser.plannerId ? {
          ...p,
          name: editPlannerName,
          kakao_link: editKakao,
          greeting_title: editGreetingTitle,
          greeting_content: editGreetingContent,
          profile_image_url: editProfileImg,
          logo_url: editLogoUrl,
          custom_phone: editCustomPhone,
          custom_address: editCustomAddress,
          certification_message: editCertificationMessage,
          password: editPassword,
          company_name: editCompanyName,
          registration_number: editRegistrationNumber,
          email: editEmail
        } : p));
        if (currentUser.role === 'agency' && currentUser.agencyId) {
          setAgencies(prev => prev.map(a => a.id === currentUser.agencyId ? {
            ...a,
            logo_url: editLogoUrl,
            email: editEmail
          } : a));
        }
        updateBranding(updatedBranding);
        setToastMessage("✨ 프로필 및 랜딩페이지 설정이 실시간 저장되었습니다! (데모)");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      const plannerData = {
        name: editPlannerName,
        kakao_link: editKakao,
        greeting_title: editGreetingTitle,
        greeting_content: editGreetingContent,
        profile_image_url: editProfileImg,
        logo_url: editLogoUrl,
        custom_phone: editCustomPhone,
        custom_address: editCustomAddress,
        certification_message: editCertificationMessage,
        password: editPassword,
        company_name: editCompanyName,
        registration_number: combinedRegistrationNumber,
        email: editEmail
      };

      const agencyData = (currentUser.role === 'agency' && currentUser.agencyId) ? {
        logo_url: editLogoUrl,
        email: editEmail
      } : null;

      const res = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plannerId: currentUser.plannerId,
          plannerData,
          agencyId: currentUser.agencyId || null,
          agencyData
        })
      });

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || '프로필 저장 실패');
      }

      updateBranding(updatedBranding);
      if (resData.warning === 'certification_message_missing') {
        alert(resData.message);
        setToastMessage("⚠️ 일부 항목 제외 저장됨");
      } else {
        setToastMessage("저장되었습니다.");
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
      const isDemo = currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner' || currentUser.agencyId === '88888888-8888-4888-a888-888888888888';
      if (isDemo) {
        sessionStorage.setItem('demo_lead_routing_type', newType);
        setAgencies(prev => prev.map(a => a.id === currentUser.agencyId ? { ...a, lead_routing_type: newType } : a));
        alert("DB 분배 설정이 변경되었습니다. (데모 모드 - 세션에 임시 저장됨)");
        return;
      }
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

      if (currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') {
        setCurrentUser(prev => ({
          ...prev,
          subscriptionStatus: 'active',
          expiresAt: newExpiryStr
        }));
        setAgencies(prev => prev.map(a => a.id === currentUser.agencyId ? { ...a, subscription_status: 'active', subscription_expires_at: newExpiryStr } : a));
        setPaymentSuccess(true);
        return;
      }

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
    if (!ag) return 'direct';
    if (ag.lead_routing_type && ag.lead_routing_type.startsWith('distribute_auto_')) {
      return 'distribute_auto';
    }
    return ag.lead_routing_type || 'direct';
  };

  const getCurrentRoutingAlgo = () => {
    if (!currentUser.agencyId) return 'round_robin';
    const ag = agencies.find(a => a.id === currentUser.agencyId);
    if (!ag) return 'round_robin';
    if (ag.lead_routing_type === 'distribute_auto_weighted') return 'weighted';
    if (ag.lead_routing_type === 'distribute_auto_activity') return 'activity';
    return 'round_robin';
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

      const isConsult = isLeadConsult(lead.insurance_type) || lead.insurance_type?.includes('_underwriting');
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
      return true;
    });
  };

  const getFilteredConsultLeads = () => {
    return leads.filter(lead => {
      const dateMatch = isInKstDateRange(lead.created_at, leadsPeriod);
      if (!dateMatch) return false;

      const isConsult = isLeadConsult(lead.insurance_type) || lead.insurance_type?.includes('_underwriting');
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
        return lead.insurance_type?.includes('remodeling') || false;
      }
      if (consultCategoryFilter === 'compare') {
        return !lead.insurance_type?.includes('remodeling') && lead.insurance_type !== 'support_consult' && !lead.insurance_type?.includes('_underwriting');
      }
      if (consultCategoryFilter === 'support') {
        return lead.insurance_type === 'support_consult';
      }
      if (consultCategoryFilter === 'underwriting') {
        return lead.insurance_type?.includes('_underwriting');
      }
      return true;
    });
  };

  const renderPagination = (
    currentPage: number, 
    totalItems: number, 
    itemsPerPage: number, 
    onPageChange: (page: number) => void
  ) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/40 px-2 text-slate-400">
        <div className="text-[11px] font-bold">
          총 <span className="text-orange-400 font-extrabold">{totalItems}</span>건 중{' '}
          <span className="text-white font-extrabold">{startItem}</span> -{' '}
          <span className="text-white font-extrabold">{endItem}</span> 표시 중
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-all cursor-pointer"
          >
            이전
          </button>
          {pageNumbers.map(page => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                currentPage === page 
                  ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20' 
                  : 'bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-all cursor-pointer"
          >
            다음
          </button>
        </div>
      </div>
    );
  };

  const renderLeadsTable = (leadsList: Lead[]) => {
    return (
      <div className="space-y-4 pr-1">
        {/* PC (Desktop) View: Table Layout */}
        <div className="hidden md:block overflow-x-auto max-h-[450px] overflow-y-auto pr-1">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">고객 정보</th>
                <th className="py-3 px-4">비교 상품</th>
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
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-black uppercase tracking-wider">
                            {lead.raw_payload.simulation_code}
                          </span>
                          {lead.raw_payload?.consult_type === 'anonymous' && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const simCode = lead.raw_payload?.simulation_code || '';
                                const origin = window.location.origin;
                                const msg = `안녕하세요! 보험리밸런스 대리점입니다. 고객님의 설계서 잠금 해제를 위한 본인인증 전용 링크입니다. 아래 링크를 눌러 간편인증을 완료하시면 0.1초 만에 마스킹이 해제됩니다.\n▶ 인증 링크: ${origin}/verify?code=${simCode}`;
                                navigator.clipboard.writeText(msg);
                                setToastMessage("✨ 카톡 인증 문구가 복사되었습니다! 카톡창에 붙여넣기(Ctrl+V) 하세요.");
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 3000);

                                // Stop flashing via DB update
                                try {
                                  const supabase = createClient();
                                  const updatedPayload = {
                                    ...(lead.raw_payload || {}),
                                    copied_by_planner: true,
                                    timeline: [
                                      {
                                        id: `copy-${Date.now()}`,
                                        type: 'system_log',
                                        author: '설계사',
                                        detail: '설계사가 카톡 인증 안내 문구를 복사하여 전달했습니다.',
                                        created_at: new Date().toISOString()
                                      },
                                      ...(lead.raw_payload?.timeline || [])
                                    ]
                                  };
                                  await supabase
                                    .from('customer_leads')
                                    .update({ raw_payload: updatedPayload })
                                    .eq('id', lead.id);
                                } catch (err) {
                                  console.error(err);
                                }

                                // Update local state for immediate 0.1s responsiveness
                                setLeads(prev => prev.map(l => {
                                  if (l.id === lead.id) {
                                    return {
                                      ...l,
                                      raw_payload: {
                                        ...(l.raw_payload || {}),
                                        copied_by_planner: true
                                      }
                                    };
                                  }
                                  return l;
                                }));

                                setSelectedLead(prev => prev && prev.id === lead.id ? {
                                  ...prev,
                                  raw_payload: {
                                    ...(prev.raw_payload || {}),
                                    copied_by_planner: true
                                  }
                                } : prev);
                              }}
                              className="px-2.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-lg text-[10px] font-black cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-md shadow-yellow-500/15"
                              title="카톡 인증문구 복사"
                            >
                              문구복사 📋
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {(() => {
                        const isConsult = isLeadConsult(lead.insurance_type);
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
                      {(() => {
                        const isUnderwriting = lead.insurance_type?.includes('_underwriting');
                        if ((!isLeadConsult(lead.insurance_type) && !isUnderwriting) || lead.insurance_type === 'support_consult') return null;
                        
                        const isAnonymous = lead.raw_payload?.consult_type === 'anonymous' || (isUnderwriting && lead.status !== 'verified');
                        if (isAnonymous) {
                          const isCopied = lead.raw_payload?.copied_by_planner === true;
                          return (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1 select-none border transition-all ${
                              isCopied
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/25'
                                : 'bg-yellow-500 text-slate-900 border-yellow-400 animate-pulse shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                            }`}>
                              카톡채팅요청 💬
                            </span>
                          );
                        }
                        return (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase flex items-center gap-1 select-none">
                            {isUnderwriting ? '인증완료 ✅' : '정식상담요청 🔑'}
                          </span>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="py-4.5 px-4 font-black text-orange-400">
                    {lead.insurance_type === 'support_consult' ? '-' : `${lead.monthly_premium?.toLocaleString() || 0} 원`}
                  </td>
                  <td className="py-4.5 px-4 space-y-1.5">
                    <div className="text-slate-400 font-bold text-[10px] uppercase">
                      {lead.lead_source === 'direct' && '개인직송 (Direct)'}
                      {lead.lead_source === 'distribute' && '본사분배 (Central)'}
                      {lead.lead_source === 'organic' && '오가닉 유입'}
                    </div>
                    {(() => {
                      const utmSource = lead.raw_payload?.utm_source;
                      const badge = getUtmSourceBadge(utmSource);
                      return (
                        <span className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-black tracking-tight ${badge.bgClass}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
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
                    <div className="flex items-center justify-end gap-2">
                      {lead.insurance_type?.includes('remodeling') && !lead.raw_payload?.hyphen_coverage && (
                        <button
                          onClick={() => { setAdminHyphenLead(lead); setShowAdminHyphen(true); }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white border border-purple-500/20 hover:border-transparent rounded-lg font-black transition-all cursor-pointer text-[10px]"
                        >
                          🔍 하이픈 연동
                        </button>
                      )}
                      {lead.raw_payload?.hyphen_coverage && (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-black">
                          실데이터 완료 ✅
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/20 hover:border-transparent rounded-lg font-black transition-all cursor-pointer text-[10px]"
                      >
                        {lead.insurance_type === 'support_consult' ? '문의 내용' : '결과지 열람'}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Accordion Card Layout */}
        <div className="md:hidden space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {leadsList.map((lead) => {
            const isExpanded = expandedLeadId === lead.id;
            const isPrecision = lead.insurance_type?.includes('remodeling');
            const badge = getInsuranceTypeName(lead.insurance_type || '');
            const utmSource = lead.raw_payload?.utm_source;
            const utmBadge = getUtmSourceBadge(utmSource);
            const isConsult = isLeadConsult(lead.insurance_type);
            const isUnderwriting = lead.insurance_type?.includes('_underwriting');
            const phone = (isConsult || isUnderwriting) ? lead.phone : maskPhoneNumber(lead.phone);

            return (
              <div 
                key={lead.id} 
                className={`bg-slate-900/60 border rounded-2xl p-4 space-y-3 transition-all cursor-pointer ${
                  isExpanded ? 'border-orange-500/45 bg-slate-900/90 shadow-md shadow-orange-500/5' : 'border-slate-800/80 hover:border-slate-700'
                }`}
                onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
              >
                {/* Header: Name, Badge, Status Select */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-extrabold text-sm text-white">{lead.name}</p>
                      {lead.raw_payload?.simulation_code && (
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-black uppercase tracking-wider">
                            {lead.raw_payload.simulation_code}
                          </span>
                          {lead.raw_payload?.consult_type === 'anonymous' && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const simCode = lead.raw_payload?.simulation_code || '';
                                const origin = window.location.origin;
                                const msg = `안녕하세요! 보험리밸런스 대리점입니다. 고객님의 설계서 잠금 해제를 위한 본인인증 전용 링크입니다. 아래 링크를 눌러 간편인증을 완료하시면 0.1초 만에 마스킹이 해제됩니다.\n▶ 인증 링크: ${origin}/verify?code=${simCode}`;
                                navigator.clipboard.writeText(msg);
                                setToastMessage("✨ 카톡 인증 문구가 복사되었습니다! 카톡창에 붙여넣기(Ctrl+V) 하세요.");
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 3000);

                                // Stop flashing via DB update
                                try {
                                  const supabase = createClient();
                                  const updatedPayload = {
                                    ...(lead.raw_payload || {}),
                                    copied_by_planner: true,
                                    timeline: [
                                      {
                                        id: `copy-${Date.now()}`,
                                        type: 'system_log',
                                        author: '설계사',
                                        detail: '설계사가 카톡 인증 안내 문구를 복사하여 전달했습니다.',
                                        created_at: new Date().toISOString()
                                      },
                                      ...(lead.raw_payload?.timeline || [])
                                    ]
                                  };
                                  await supabase
                                    .from('customer_leads')
                                    .update({ raw_payload: updatedPayload })
                                    .eq('id', lead.id);
                                } catch (err) {
                                  console.error(err);
                                }

                                // Update local state for immediate 0.1s responsiveness
                                setLeads(prev => prev.map(l => {
                                  if (l.id === lead.id) {
                                    return {
                                      ...l,
                                      raw_payload: {
                                        ...(l.raw_payload || {}),
                                        copied_by_planner: true
                                      }
                                    };
                                  }
                                  return l;
                                }));

                                setSelectedLead(prev => prev && prev.id === lead.id ? {
                                  ...prev,
                                  raw_payload: {
                                    ...(prev.raw_payload || {}),
                                    copied_by_planner: true
                                  }
                                } : prev);
                              }}
                              className="px-2.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-lg text-[10px] font-black cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-md shadow-yellow-500/15"
                              title="카톡 인증문구 복사"
                            >
                              문구복사 📋
                            </button>
                          )}
                        </div>
                      )}
                      {(() => {
                        const isUnderwriting = lead.insurance_type?.includes('_underwriting');
                        if ((!isLeadConsult(lead.insurance_type) && !isUnderwriting) || lead.insurance_type === 'support_consult') return null;
                        
                        const isAnonymous = lead.raw_payload?.consult_type === 'anonymous' || (isUnderwriting && lead.status !== 'verified');
                        const isCopied = lead.raw_payload?.copied_by_planner === true;
                        return (
                          <span className={`px-1 py-0.5 rounded text-[8px] font-black uppercase border transition-all ${
                            isAnonymous
                              ? isCopied
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/25'
                                : 'bg-yellow-500 text-slate-900 border-yellow-400 animate-pulse shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {isAnonymous ? '카톡채팅요청 💬' : isUnderwriting ? '인증완료 ✅' : '정식상담요청 🔑'}
                          </span>
                        );
                      })()}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-1 pt-0.5">
                      <span className={`px-1 py-0.5 rounded text-[8px] font-black uppercase border ${
                        isPrecision ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {isPrecision ? '정밀분석' : '가격비교'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] border font-black ${badge.bgClass} ${badge.textClass}`}>
                        {badge.label.replace(' 비교분석', '').replace(' 다이어트', '')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-[10px] py-1.5 px-2 text-white font-bold outline-none cursor-pointer focus:border-orange-500/40"
                    >
                      <option value="new">신규 (New)</option>
                      <option value="calling">상담중 (Calling)</option>
                      <option value="completed">계약완료 (Completed)</option>
                      <option value="canceled">취소/부재 (Canceled)</option>
                    </select>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${isExpanded ? 'rotate-90 text-orange-400' : ''}`} />
                  </div>
                </div>

                {/* Sub-Header: Contact & Date */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-800/40 pt-2.5">
                  <p>{phone} • {lead.age}세</p>
                  <p className="text-slate-500 text-[9px] font-medium">{new Date(lead.created_at).toLocaleString('ko-KR')}</p>
                </div>

                {/* Collapsible content (0.1s responsive animation) */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800/60 space-y-3.5 text-[11px] text-slate-300" onClick={(e) => e.stopPropagation()}>
                    {lead.insurance_type === 'support_consult' ? (
                      /* 1:1 고객센터 문의: display subject and message directly on card */
                      <div className="space-y-3.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/30">
                        <div>
                          <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">문의 제목</span>
                          <span className="font-extrabold text-white text-xs">
                            [{lead.analysis_result?.subject || lead.raw_payload?.subject || '일반 문의'}]
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">문의 내용</span>
                          <p className="font-semibold text-slate-300 whitespace-pre-wrap break-all mt-0.5 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-850/40">
                            {lead.analysis_result?.message || lead.raw_payload?.message || '문의 내용이 존재하지 않습니다.'}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/20">
                          <div>
                            <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">담당 설계사</span>
                            <span className="font-extrabold text-white text-[11px] flex items-center gap-1.5 flex-wrap">
                              {lead.planner_name}
                              {currentUser.role === 'agency' && (
                                <button 
                                  onClick={() => setAssigningLead(lead)}
                                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-[8px] font-black rounded text-slate-300 cursor-pointer"
                                >
                                  재지정
                                </button>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">UTM 소스</span>
                            <div className="mt-0.5">
                              <span className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-black tracking-tight ${utmBadge.bgClass}`}>
                                {utmBadge.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* standard simulation leads */
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/30">
                        <div>
                          <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">월 보험료</span>
                          <span className="font-extrabold text-orange-400 text-xs">{lead.monthly_premium?.toLocaleString() || 0} 원</span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">담당 설계사</span>
                          <span className="font-extrabold text-white text-xs flex items-center gap-1.5 flex-wrap">
                            {lead.planner_name}
                            {currentUser.role === 'agency' && (
                              <button 
                                onClick={() => setAssigningLead(lead)}
                                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-[8px] font-black rounded text-slate-300 cursor-pointer"
                              >
                                재지정
                              </button>
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">유입 방식</span>
                          <span className="font-extrabold text-white">
                            {lead.lead_source === 'direct' && '개인직송 (Direct)'}
                            {lead.lead_source === 'distribute' && '본사분배 (Central)'}
                            {lead.lead_source === 'organic' && '오가닉 유입'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">UTM 소스</span>
                          <div className="mt-0.5">
                            <span className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-black tracking-tight ${utmBadge.bgClass}`}>
                              {utmBadge.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-1 space-y-2">
                      {lead.insurance_type?.includes('remodeling') && !lead.raw_payload?.hyphen_coverage && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setAdminHyphenLead(lead); setShowAdminHyphen(true); }}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white border border-purple-500/20 rounded-xl font-black transition-all cursor-pointer text-xs"
                        >
                          🔍 하이픈 연동 실행
                        </button>
                      )}
                      {lead.raw_payload?.hyphen_coverage && (
                        <div className="text-center py-1.5 text-[10px] font-black text-emerald-400">
                          실데이터 연동 완료 ✅
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border border-transparent rounded-xl font-black transition-all cursor-pointer text-xs shadow-md shadow-orange-500/10"
                      >
                        {lead.insurance_type === 'support_consult' ? '상세 문의 확인' : '결과지 열람'}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

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
      { key: 'kakaotalk', name: '카카오톡 공유/광고', iconColor: 'bg-amber-400' },
      { key: 'tiktok', name: '틱톡 동영상 광고', iconColor: 'bg-cyan-400' },
      { key: 'google', name: '구글 일반/검색', iconColor: 'bg-red-500' },
      { key: 'organic', name: '일반/자연 유입 (Direct)', iconColor: 'bg-slate-600' },
    ];

    const filteredLogs = getFilteredVisitorLogs();
    const filteredLeads = getFilteredLeads();

    const stats = channels.map(ch => {
      const visits = filteredLogs.filter(log => {
        let logSrc = log.utm_source || 'organic';
        if (logSrc === 'kakao') logSrc = 'kakaotalk';
        return logSrc === ch.key;
      }).length;
      const conversions = filteredLeads.filter(lead => {
        let leadSrc = lead.raw_payload?.utm_source || 'organic';
        if (leadSrc === 'kakao') leadSrc = 'kakaotalk';
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
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 flex flex-col items-center gap-12">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs font-black uppercase tracking-widest">
              B2B SaaS Partners
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              나만의 독점 핀테크 플랫폼을 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 font-black">즉시 구축</span>하세요
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-bold break-keep">
              대리점과 설계사의 이름으로 즉시 생성되는 최첨단 초고속 보험 비교 엔진. 상담 현장에서 태블릿으로 0.1초 만에 보장을 진단해 신뢰를 얻고, 내 브랜드 플랫폼으로 직접 마케팅하여 자발적인 상담 신청 리드를 수집하세요. 신규 가입 시 첫 30일간 기능 제약 없이 무료 체험
            </p>
          </div>

          {/* 💡 [업데이트된 저품질 DB vs 내 플랫폼 수집 DB 비교표] */}
          <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-[2rem] p-6 md:p-8 space-y-6 backdrop-blur-xl">
            <div className="text-center space-y-2">
              <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                실시간 비교 분석
              </span>
              <h2 className="text-lg md:text-xl font-black text-white">
                💸 아직도 제3자 단순 동의 방식으로 수집된 단순 연락처 기반 DB에 의존하고 계십니까?
              </h2>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-1/4">구분</th>
                    <th className="py-3 px-4 w-3/8 text-red-400 bg-red-500/5">❌ 일반 마케팅 단순 수집 DB</th>
                    <th className="py-3 px-4 w-3/8 text-emerald-400 bg-emerald-500/5">✨ 내 플랫폼으로 접수되는 자발적 상담 신청</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-300">
                  <tr className="hover:bg-slate-800/10">
                    <td className="py-4 px-4 font-bold text-white">유입 경로</td>
                    <td className="py-4 px-4 bg-red-500/5 text-slate-400">경품 응모 및 제3자 마케팅 제공 단순 동의로 수집됨</td>
                    <td className="py-4 px-4 bg-emerald-500/5">고객이 본인의 이름과 번호를 넣고 비교 결과를 직접 확인</td>
                  </tr>
                  <tr className="hover:bg-slate-800/10">
                    <td className="py-4 px-4 font-bold text-white">신뢰 관계</td>
                    <td className="py-4 px-4 bg-red-500/5 text-slate-400">사전 인지가 부족한 상태에서 전화를 받으므로 상담 진행이 어려움</td>
                    <td className="py-4 px-4 bg-emerald-500/5">이미 내 이름과 프로필이 박힌 진단 화면을 본 상태에서 상담 신청</td>
                  </tr>
                  <tr className="hover:bg-slate-800/10">
                    <td className="py-4 px-4 font-bold text-white">DB 퀄리티</td>
                    <td className="py-4 px-4 bg-red-500/5 text-slate-400">기본적인 인적 사항 위주의 한정적인 정보</td>
                    <td className="py-4 px-4 bg-emerald-500/5 space-y-3">
                      <p className="font-extrabold text-white">이름/연락처는 기본, 고객의 상세 보장 분석 데이터 완벽 탑재!</p>
                      <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3.5 space-y-1.5 font-mono text-[10px] text-slate-400">
                        <p className="text-orange-400 font-extrabold border-b border-slate-900 pb-1.5 mb-1.5">[예: 암보험 상담 신청 시 어드민 자동 연동 정보]</p>
                        <p>• 일반암 진단비: <span className="text-emerald-400 font-bold">정상 (5,000만 원)</span></p>
                        <p>• 표적항암 치료비: <span className="text-emerald-400 font-bold">우수 (포함)</span></p>
                        <p>• 재발/전이암 보장: <span className="text-orange-400 font-bold">권장 (미포함)</span></p>
                        <p>• 납입/갱신 유형: <span className="text-emerald-400 font-bold">정상 (비갱신형)</span></p>
                        <p className="text-[9px] text-slate-500 pt-1 border-t border-slate-900 mt-1">※ 고객의 보장 부족분을 사전에 객관적으로 확인하여 진정성 있는 상담 지원</p>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/10">
                    <td className="py-4 px-4 font-bold text-white">비용 한계</td>
                    <td className="py-4 px-4 bg-red-500/5 text-slate-400">건당 구매 비용 소모 및 지속적인 누적 지출 부담</td>
                    <td className="py-4 px-4 bg-emerald-500/5">자사 단독 플랫폼 운영으로 추가 건당 구매 비용 없음</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Card-based Comparison View */}
            <div className="block md:hidden space-y-6">
              {/* Card 1: 시중 DB */}
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-red-400 flex items-center gap-1.5 pb-2 border-b border-red-500/15">
                  <span>❌</span> 일반 마케팅 단순 수집 DB
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">유입 경로</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">경품 응모 및 제3자 마케팅 제공 단순 동의로 수집됨</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">신뢰 관계</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">사전 인지가 부족한 상태에서 전화를 받으므로 상담 진행이 어려움</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">DB 퀄리티</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">기본적인 인적 사항 위주의 한정적인 정보</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">비용 한계</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">건당 구매 비용 소모 및 지속적인 누적 지출 부담</p>
                  </div>
                </div>
              </div>

              {/* Card 2: 내 플랫폼 DB */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-emerald-400 flex items-center gap-1.5 pb-2 border-b border-emerald-500/15">
                  <span>✨</span> 내 플랫폼으로 접수되는 자발적 상담 신청
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">유입 경로</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">고객이 본인의 이름과 번호를 넣고 비교 결과를 직접 확인</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">신뢰 관계</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">이미 내 이름과 프로필이 박힌 진단 화면을 본 상태에서 상담 신청</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">DB 퀄리티</span>
                    <div className="space-y-2">
                      <p className="text-xs font-extrabold text-white leading-relaxed">이름/연락처는 기본, 고객의 상세 보장 분석 데이터 완벽 탑재!</p>
                      <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3.5 space-y-1.5 font-mono text-[10px] text-slate-400">
                        <p className="text-orange-400 font-extrabold border-b border-slate-900 pb-1.5 mb-1.5">[예: 암보험 상담 신청 시 어드민 자동 연동 정보]</p>
                        <p>• 일반암 진단비: <span className="text-emerald-400 font-bold">정상 (5,000만 원)</span></p>
                        <p>• 표적항암 치료비: <span className="text-emerald-400 font-bold">우수 (포함)</span></p>
                        <p>• 재발/전이암 보장: <span className="text-orange-400 font-bold">권장 (미포함)</span></p>
                        <p>• 납입/갱신 유형: <span className="text-emerald-400 font-bold">정상 (비갱신형)</span></p>
                        <p className="text-[9px] text-slate-500 pt-1 border-t border-slate-900 mt-1">※ 고객의 보장 부족분을 사전에 객관적으로 확인하여 진정성 있는 상담 지원</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">비용 한계</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">자사 단독 플랫폼 운영으로 추가 건당 구매 비용 없음</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-center text-xs font-black">
              "고객이 직접 내 브랜드 비교 사이트에서 분석을 마치고 자발적으로 신청한 상담은 신뢰도가 높아 더욱 성공적인 계약 체결로 이어집니다."
            </div>
          </div>

          {/* ── 4-TIER PREMIUM PRICING PLANS ── */}
          <div className="w-full space-y-8 mt-4">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                Choose Your Plan
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                💰 대표님과 대리점에 맞춤형 4단계 요금제
              </h2>
              <p className="text-xs text-slate-400 font-bold max-w-xl mx-auto break-keep">
                개인 영업 활성화부터 대리점 통합 분배 및 대형 GA 맞춤형 도메인 연동까지, 성장에 필요한 최고의 마케팅 무기를 장착하세요.
              </p>
              
              {/* 🎁 Glowing/Pulsing 30-Day Free Trial Badge */}
              <div className="inline-flex items-center gap-2.5 px-6 py-3 bg-emerald-500/10 border border-emerald-500/25 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.15)] mt-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs sm:text-sm md:text-base font-black text-emerald-400 tracking-tight">
                  🎁 신규 가입 시 첫 30일간 전 기능 무료 체험 지원 (자동 결제 없음)
                </span>
              </div>
            </div>

            {/* 리크루팅 치트키 안내 배너 */}
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-orange-500/10 border border-orange-500/25 rounded-2xl p-4 md:p-5 text-center backdrop-blur-sm space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-md text-[9px] font-black uppercase tracking-wider">
                💡 대리점 대표님을 위한 리크루팅 경쟁력 강화
              </div>
              <p className="text-[11px] md:text-xs text-slate-200 font-bold leading-relaxed break-keep">
                "신입 설계사 도입 시 <span className="text-orange-400 font-extrabold">'우리 대리점은 개별 온라인 상담 페이지와 AI 분석 시스템을 기본 지급해, 상담 효율을 한층 끌어올리는 환경을 지원한다'</span>는 차별화된 파트너십을 어필하여 대리점 영업 경쟁력을 극대화하세요!"
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: 개인 설계사 */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300 group">
                <div className="space-y-5">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">B2C 1인 전용</span>
                    <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors">개인 설계사 플랜</h3>
                  </div>
                  <div className="border-b border-slate-800/80 pb-4 text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">월 5만 원</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">설계사 1인 전용 독립 브랜딩 제공</p>
                  </div>
                  <ul className="space-y-3.5 text-[11px] text-slate-400 font-bold text-left">
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>개인 홈페이지 제공 (Personal URL) 🔗</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">설계사 이름, 프로필 사진, 연락처, 개인 인사말이 적용된 단독 주소(.../?planner=코드) 제공.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>0.1초 AI 실시간 보장 진단 무제한 ⚡</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">고객이 접속하여 스스로 보험료를 시뮬레이션하고 비교 진단받을 수 있는 AI 엔진 전체 개방.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>실시간 고객 리드(DB) 대시보드 📋</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">고객이 진단을 마치거나 상담을 신청하면 성별, 나이, 입력값, 점수 등을 0.1초 만에 전용 관리자 화면에서 즉시 확인.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>1:1 카톡 및 전화 상담 다이렉트 연동 💬</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">고객용 결과 화면 하단에 설계사 개인 카톡(오픈채팅 등) 및 전화 연결 버튼 상시 노출.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>PWA 홈화면 바로가기 앱 설치 지원 📱</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">설계사 및 고객의 스마트폰 홈화면에 앱 아이콘(바로가기)을 설치하여 모바일 앱처럼 즉시 실행 가능.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>고객 안심 상담 시스템 (익명 상담 지원) 🔒</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">고객이 개인정보 유출 걱정 없이 안심하고 첫 문의를 남길 수 있도록 돕는 3대 안심 배너 및 시스템 기본 탑재.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>설계 코드(Simulation Code) 연동 🔑</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">고객이 직접 만져본 보장 리모델링 설계안을 고유 코드로 복사하여 설계사와 즉시 공유하는 연동 기능.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>내 보험 정밀 분석 데이터 & 업데이트 📊</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">내보험 정밀 분석 데이터 제공 및 매월 업데이트 되는 보험 분석 비교 엔진 제공.</p>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => { 
                    setSignupTab('register'); 
                    setSignupType('planner');
                    setTimeout(() => {
                      document.getElementById('auth-card-container')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }} 
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-black py-3 rounded-xl mt-6 transition-all cursor-pointer"
                >
                  개인 플랜 신청하기
                </button>
              </div>

              {/* Card 2: 대리점 Basic */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300 group">
                <div className="space-y-5">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">B2B 소규모</span>
                    <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors">대리점 Basic</h3>
                  </div>
                  <div className="border-b border-slate-800/80 pb-4 text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">월 50만 원</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">등록 가능 인원: 최대 13명</p>
                  </div>
                  <ul className="space-y-3.5 text-[11px] text-slate-400 font-bold text-left">
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>개인 설계사 핵심 기능 8가지 전체 제공 ✨</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">소속 설계사 전원에게 개별 전용 홈페이지 및 AI 엔진 전체 개방.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>소속 설계사 최대 13명 등록 관리 👥</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">대리점 규모에 최적화된 소속 설계사 등록 및 관리자 승인 시스템.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>개인 홍보 직접배정형 (Direct) 지원 🔗</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">소속 설계사가 개별적으로 유치한 고객 DB를 대리점 개입 없이 즉시 본인에게 단독 노출.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>대리점 수동 분배형 (Manual Pool) 지원 📢</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">공용 유입 DB를 대표 대기 풀에 두고 검토 후 적합한 설계사에게 수동 지정 배정.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>지점 통합 브랜딩 & 로고 커스텀 🏢</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">지점 단독 로고 및 메인 슬로건 설정으로 자사 고유의 브랜드 정체성 표출.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>실시간 리드 지점장 통합 관리 📊</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">소속 설계사들의 상담 리드 수집 현황 및 상세 보장 데이터를 실시간 통합 조회.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5 text-amber-400"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> <span>설계사 채용 무기화 (Recruiting Advantage) 💎</span></div>
                      <p className="pl-5 text-[10px] text-amber-500/80 leading-normal">소속 설계사 전원에게 "고객 DB 평생 무료 수집 환경"을 지급하여 리크루팅 매력도 극대화.</p>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => { 
                    setSignupTab('register'); 
                    setSignupType('agency');
                    setRegAgencyTier('basic');
                    setTimeout(() => {
                      document.getElementById('auth-card-container')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }} 
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-black py-3 rounded-xl mt-6 transition-all cursor-pointer"
                >
                  Basic 신청하기
                </button>
              </div>

              {/* Card 3: 대리점 Pro (Most Popular) */}
              <div className="bg-slate-900/60 border-2 border-orange-500/40 rounded-3xl p-6 flex flex-col justify-between hover:border-orange-500 transition-all duration-300 group relative shadow-2xl shadow-orange-500/5">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-lg">
                  ★ 가장 인기
                </div>
                <div className="space-y-5">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">B2B 중대형</span>
                    <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors">대리점 Pro</h3>
                  </div>
                  <div className="border-b border-slate-800/80 pb-4 text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-orange-400">월 100만 원</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">등록 가능 인원: 최대 28명</p>
                  </div>
                  <ul className="space-y-3.5 text-[11px] text-slate-300 font-bold text-left">
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>Basic 요금제 기능 전체 포함 ✨</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">개인 기능 8가지 및 지점 통합 관리 기능을 기본으로 탑재.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>소속 설계사 최대 28명 등록 관리 👥</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">중대형 지사를 여유 있게 지원하는 넉넉한 설계사 등록 한도 제공.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>실시간 자동 분배형 (Auto-Routing) 지원 ⚡</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">통합 광고 유입 DB를 대리점 개입 없이 0.1초 만에 최적의 설계사에게 자동 분배.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>균등 순차 분배 (Round Robin) 🔄</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">소속 설계사 전원에게 순서대로 기회를 균등하게 배정하는 표준 알고리즘.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>가중치 비율 분배 (Weighted) ⚖️</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">설계사 개인별 기여도나 레벨에 맞추어 맞춤 비율로 DB를 차등 자동 분배.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>미계약 리드 자동 회수 및 재분배 ⏱️</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">분배된 고객 리드가 일정 시간 상담 진행이 안 될 경우, 회수 후 타 설계사에게 즉시 재지정.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5 text-amber-400"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> <span>설계사 채용 무기화 (Recruiting Advantage) 💎</span></div>
                      <p className="pl-5 text-[10px] text-amber-400/80 leading-normal">소속 설계사 전원에게 "고객 DB 평생 무료 수집 환경"을 지급하여 리크루팅 매력도 극대화.</p>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => { 
                    setSignupTab('register'); 
                    setSignupType('agency');
                    setRegAgencyTier('pro');
                    setTimeout(() => {
                      document.getElementById('auth-card-container')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }} 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-black py-3 rounded-xl mt-6 transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  Pro 요금제로 신청하기 🚀
                </button>
              </div>

              {/* Card 4: 대리점 Enterprise */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300 group">
                <div className="space-y-5">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">B2B 대형 GA</span>
                    <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors">대리점 Enterprise</h3>
                  </div>
                  <div className="border-b border-slate-800/80 pb-4 text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">월 500만 원</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">등록 가능 인원: 최대 150명</p>
                  </div>
                  <ul className="space-y-3.5 text-[11px] text-slate-400 font-bold text-left">
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>Pro 요금제 기능 전체 포함 ✨</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">자동 분배, 가중치 배정 및 리드 회수 등 최상위 라우팅 엔진 탑재.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>소속 설계사 최대 150명 등록 관리 👥</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">대형 GA 지사 및 전체 본부 수용을 위한 메머드급 인원 관리 용량 제공.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>실적/활동량 기반 배정 (Performance) 📈</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">실제 실적이 우수하거나 실시간 온라인 상담 대기 중인 설계사에게 가중 가점 자동 지정.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>독립 브랜드 도메인 연동 (White-Label) 🌐</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">자사 단독 도메인을 연동하여 완벽한 자체 개발 핀테크 플랫폼처럼 독점 브랜딩.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>1:1 전담 마케팅 기술 컨설팅 🤝</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">대리점 전용 광고 효율화, 서버 관리 및 커스텀 개발을 위한 전문 파트너십 구축.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5 text-amber-400"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> <span>설계사 채용 무기화 (Recruiting Advantage) 💎</span></div>
                      <p className="pl-5 text-[10px] text-amber-400/80 leading-normal">소속 설계사 전원에게 "고객 DB 평생 무료 수집 환경"을 지급하여 리크루팅 매력도 극대화.</p>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={() => { 
                    setSignupTab('register'); 
                    setSignupType('agency');
                    setRegAgencyTier('enterprise');
                    setTimeout(() => {
                      document.getElementById('auth-card-container')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }} 
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-black py-3 rounded-xl mt-6 transition-all cursor-pointer"
                >
                  Enterprise 신청하기
                </button>
              </div>

            </div>
          </div>

          {/* 1-Second Demo Experience Zone (심의 기간 임시 숨김) */}
          {false && (
            <div className="w-full bg-gradient-to-r from-violet-950/20 via-slate-900 to-violet-950/20 border border-orange-500/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6 text-center backdrop-blur-xl relative overflow-hidden my-10 animate-in fade-in duration-500">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl -z-10" />
              
              <div className="space-y-2 max-w-2xl mx-auto">
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider inline-block shadow-md">
                  ⚡ 1초 간편 데모 체험
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white leading-normal break-keep">
                  가입 전, 관리자 대시보드를 먼저 확인해 보세요!
                </h3>
                <p className="text-xs md:text-sm text-slate-400 font-bold leading-relaxed break-keep">
                  가입이나 신용카드 등록 없이 실제 가상 데이터가 주입된 대리점 관리자 뷰와 개인 설계사 대시보드 뷰를 즉시 체험해 보실 수 있습니다.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-2">
                
                {/* Agency View Demo Button */}
                <button 
                  type="button"
                  onClick={() => handleLogin(undefined, 'test', '1234')}
                  className="group p-6 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800 hover:border-orange-500/50 rounded-2xl text-left transition-all duration-300 shadow-lg cursor-pointer flex gap-4 items-start relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-bl-xl text-[9px] font-black tracking-wide group-hover:bg-orange-500 group-hover:text-white transition-all">
                    추천체험
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      대리점(GA) 대표용 뷰 체험하기
                    </h4>
                    <p className="text-[11px] text-slate-450 font-bold leading-normal break-keep">
                      소속 설계사 등록 현황, 실시간 정원 게이지 바(Gauge Bar), DB 자동 배분(Auto-Routing) 설정 및 대리점 분배 통계를 확인해 볼 수 있습니다.
                    </p>
                  </div>
                </button>

                {/* Planner View Demo Button */}
                <button 
                  type="button"
                  onClick={() => handleLogin(undefined, 'test_planner', '1234')}
                  className="group p-6 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800 hover:border-orange-500/50 rounded-2xl text-left transition-all duration-300 shadow-lg cursor-pointer flex gap-4 items-start relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      개인 설계사용 뷰 체험하기
                    </h4>
                    <p className="text-[11px] text-slate-450 font-bold leading-normal break-keep">
                      나만의 전용 0.1초 AI 진단 페이지 링크 생성, 카카오톡 상담 연동 및 실시간 독점 고객 리드(DB) 관리 대시보드를 확인해 볼 수 있습니다.
                    </p>
                  </div>
                </button>

              </div>
            </div>
          )}

          <div id="auth-card-container" className="w-full bg-slate-900/80 border border-slate-800/80 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-xl">
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
                      placeholder="가입 시 입력한 고유코드를 입력하세요 (예: test_planner)" 
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 rounded-xl py-3 px-4 outline-none transition-all text-sm text-white font-bold"
                    />
                    <p className="text-[10px] text-slate-500 leading-normal font-medium">
                      💡 데모 가입된 기본 테스트 설계사 코드는 <strong>test_planner</strong> 입니다.
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
                          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[12.5rem] ${signupType === 'planner' ? 'bg-slate-950/40 border-orange-500 shadow-lg' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
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
                          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[12.5rem] ${signupType === 'agency' ? 'bg-slate-950/40 border-orange-500 shadow-lg' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                        >
                          {signupType === 'agency' && (
                            <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase">
                              선택됨
                            </div>
                          )}
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                                  <Building className="w-4 h-4" />
                                </div>
                                <h3 className="font-extrabold text-base text-white">대리점(GA) 단체 플랜</h3>
                              </div>
                              
                              {/* inline tier selector */}
                              <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-800" onClick={(e) => e.stopPropagation()}>
                                {(['basic', 'pro', 'enterprise'] as const).map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => {
                                      setSignupType('agency');
                                      setRegAgencyTier(t);
                                    }}
                                    className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase transition-all ${
                                      regAgencyTier === t && signupType === 'agency'
                                        ? 'bg-orange-500 text-white shadow'
                                        : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                  >
                                    {t === 'basic' ? 'Basic' : t === 'pro' ? 'Pro' : 'Ent'}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <p className="text-[11px] text-slate-400 font-bold leading-normal break-keep">
                              {regAgencyTier === 'basic' 
                                ? '소규모 대리점용. 설계사 최대 13명 등록 가능.' 
                                : regAgencyTier === 'pro' 
                                ? '중소형 대리점용 (추천). 설계사 최대 28명. 실시간 자동 분배 지원.' 
                                : '대형 GA 아웃소싱용. 설계사 최대 150명. 전담 기술 지원.'}
                            </p>
                          </div>
                          
                          <div className="border-t border-slate-800 pt-3 mt-4 flex items-end justify-between">
                            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md font-bold">첫 달 무료 혜택</span>
                            <span className="text-sm font-black text-white">
                              {regAgencyTier === 'basic' ? '월 500,000 원' : regAgencyTier === 'pro' ? '월 1,000,000 원' : '월 5,000,000 원'}
                            </span>
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
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-400 block">카카오톡 상담 연결 링크 (오픈채팅/채널 주소)</label>
                          <button
                            type="button"
                            onClick={() => setShowKakaoHelp(!showKakaoHelp)}
                            className="text-[10px] text-orange-400 hover:text-orange-300 font-bold transition-all flex items-center gap-1 cursor-pointer bg-slate-800/40 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
                          >
                            오픈채팅 링크 확인 방법 ❓
                          </button>
                        </div>
                        <input 
                          type="url" 
                          placeholder="예: https://open.kakao.com/o/..." 
                          value={regKakao}
                          onChange={(e) => setRegKakao(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                        />
                        {showKakaoHelp && (
                          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-[11px] text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                            <p className="font-extrabold text-white flex items-center gap-1">
                              <span>💬</span> 카카오톡 1:1 오픈채팅방 생성 및 링크 확인 방법
                            </p>
                            <ol className="list-decimal pl-4 space-y-1.5 font-medium text-slate-300">
                              <li>스마트폰에서 <strong className="text-white">카카오톡</strong> 앱을 실행합니다.</li>
                              <li>하단 <strong className="text-white">채팅 탭</strong>으로 이동 후, 우측 상단의 <strong className="text-white">말풍선+ (새로운 채팅)</strong> 아이콘을 누릅니다.</li>
                              <li><strong className="text-white">오픈채팅</strong> ➜ <strong className="text-white">내 오픈링크</strong> ➜ <strong className="text-white">만들기</strong> 버튼을 선택합니다.</li>
                              <li><strong className="text-white">1:1 채팅방</strong>을 선택한 후, 이름과 프로필을 설정하여 방을 만듭니다.</li>
                              <li>방이 생성되면 우측 상단 메뉴(혹은 중간)의 <strong className="text-white">링크 공유</strong> ➜ <strong className="text-white">링크 복사</strong>를 누릅니다.</li>
                              <li>복사된 주소(예: <code className="text-orange-400 font-bold">https://open.kakao.com/o/...</code>)를 위 입력창에 붙여넣어 주세요.</li>
                            </ol>
                            <p className="text-[10px] text-slate-500 font-bold border-t border-slate-850 pt-1.5 leading-normal">
                              ⚠️ <strong className="text-amber-400">필수 체크 설정</strong>: 오픈채팅방 생성 시 <strong className="text-white">"카카오프렌즈 프로필만 허용" 옵션은 반드시 해제(OFF)</strong>로 설정해 주세요. 그래야 익명 고객(카카오프렌즈 프로필)과 일반 실명 프로필 고객 모두 오류 없이 상담방에 입장할 수 있습니다.
                              <br />
                              ※ 일반 개인 카톡 아이디는 인터넷 브라우저 바로가기 연결을 지원하지 않아, 반드시 오픈채팅방 주소로 등록하셔야 고객이 실시간으로 상담을 신청할 수 있습니다.
                            </p>
                          </div>
                        )}
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
                    {loading ? '신청 처리 중...' : '첫 달 무료 체험 신청 완료 🚀'}
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
        <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-10">
          
          {(currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner') && (
            <div className="bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 border border-orange-500/30 rounded-2xl p-4 mb-8 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <div className="space-y-1 pl-2">
                <h4 className="font-extrabold text-sm text-orange-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  💡 현재는 대시보드 데모 체험 모드입니다
                </h4>
                <p className="text-xs text-slate-350 font-bold leading-normal break-keep">
                  이 화면은 {currentUser.role === 'agency' ? '대리점 대표용 관리자' : '개인 설계사용'} 가상의 데모 페이지입니다. 대표님/설계사님만의 전용 도메인 및 0.1초 AI 진단 툴을 활성화하여 사용하시려면 정식 회원 가입 및 구독을 진행해 주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentUser({ role: 'guest' });
                  setTimeout(() => {
                    document.getElementById('auth-card-container')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl cursor-pointer shrink-0 transition-all shadow-md text-center hover:scale-105 active:scale-95"
              >
                👉 체험 종료 및 정식 구독하기
              </button>
            </div>
          )}
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
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black text-white">{currentUser.name} 관리자 콘솔</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${currentUser.subscriptionStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'}`}>
                  {currentUser.subscriptionStatus === 'active' ? '구독 활성화' : '구독 만료'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400">
                {currentUser.role === 'super' ? '시스템 내 모든 데이터를 통제 및 모니터링합니다.' : '수집된 리드를 0.1초 만에 확인하고 설계안을 지원합니다.'}
              </p>
              <p className="text-[10px] text-amber-400/95 font-black flex items-center gap-1.5 mt-1.5">
                <span>📢</span>
                <span>보험료 비교 데이터는 생명보험협회 및 손해보험협회 공시자료를 토대로 한달에 한번 업데이트 됩니다.</span>
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

               {(currentUser.role === 'agency' || currentUser.role === 'planner' || currentUser.role === 'super') && (
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <User className="w-4 h-4" />
                  {currentUser.role === 'super' ? '대표 랜딩페이지 설정' : '개인 프로필/랜딩 설정'}
                </button>
              )}

               {(currentUser.role === 'agency' || currentUser.role === 'planner' || currentUser.role === 'super') && (
                <button 
                  onClick={() => setActiveTab('compliance')}
                  className={`w-auto lg:w-full text-left rounded-2xl transition-all duration-300 relative overflow-hidden group cursor-pointer border ${
                    activeTab === 'compliance' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 border-orange-400 text-white shadow-[0_8px_24px_rgba(249,115,22,0.25)]' 
                      : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800 hover:border-amber-500/30 text-slate-400 hover:text-slate-200'
                  } p-4 mt-2 mb-2 space-y-1.5`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-500" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-400 group-hover:text-amber-300">
                      <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
                      <span>준법 지원</span>
                    </div>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-wide ${
                      activeTab === 'compliance' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      필독
                    </span>
                  </div>

                  <div className="font-extrabold text-xs lg:text-[13px] leading-tight text-white flex items-center gap-1.5 pt-0.5">
                    <span>광고 심의 매뉴얼 📜</span>
                  </div>

                  <p className={`text-[10px] leading-normal font-semibold ${
                    activeTab === 'compliance' ? 'text-orange-100' : 'text-slate-500'
                  }`}>
                    동일물 신고 양식 & 정보 기재 안내
                  </p>
                </button>
              )}

               {(currentUser.role === 'agency' || currentUser.role === 'planner' || currentUser.role === 'super') && (
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'chat' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>실시간 소통 센터 💬</span>
                  </div>
                  {unreadTotal > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                      {unreadTotal}
                    </span>
                  )}
                </button>
              )}

              {/* PWA Install Guide Card (Sidebar Bottom empty space - Desktop only) */}
              <div className="hidden lg:block">
                <PWAInstallCard />
              </div>
            </div>

            {/* Right main panel */}
            <div className="lg:col-span-4 min-w-0 bg-slate-900/60 border border-slate-800/80 rounded-2xl sm:rounded-3xl p-3 sm:p-6 min-h-[500px]">
              {/* PWA Install Guide Card (Mobile only) */}
              <div className="block lg:hidden mb-6">
                <PWAInstallCard />
              </div>
              
              {/* Tab 1: Leads view */}
              {activeTab === 'leads' && (
                <div key="leads" className="active-tab-fade-slide space-y-8">
                  
                  {/* Header Row 1: Title and Toggle */}
                  <div className="flex flex-row justify-between items-center gap-4 pb-2">
                    <div className="space-y-1 text-left">
                      <h2 className="text-lg font-black text-white">상담 리드 수집 목록</h2>
                      <p className="text-[10px] text-slate-400 font-bold">
                        💡 상태 선택 시 즉시 변경 사항이 DB에 동기화되며, 대한민국 표준시(KST)를 기준으로 필터링됩니다.
                      </p>
                    </div>

                    {renderHelpGuideToggle()}
                  </div>

                  {/* Header Row 2: Search and Leads Period Filter Tabs */}
                  <div className="flex flex-wrap items-center justify-end gap-3 border-b border-slate-800/80 pb-4">
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

                  {/* 카카오톡 설계코드 상담 매칭 기능 안내 배너 */}
                  <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 p-4.5 rounded-2xl flex items-start gap-3 relative overflow-hidden text-left">
                    <span className="text-xl shrink-0">🔑</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-orange-400">카카오톡 설계코드 상담 매칭 기능 안내</h4>
                      <p className="text-[11px] text-slate-300 font-bold leading-relaxed break-keep">
                        고객이 카카오톡으로 상담을 신청하면 메시지에 포함된 설계 코드 <code className="text-orange-300 font-black bg-orange-500/5 px-1 py-0.5 rounded border border-orange-500/15 font-mono uppercase tracking-wider text-[10px]">RPT-xxxxxx</code>를 복사하여 오른쪽 검색창에 입력하세요. 0.1초 만에 해당 고객의 가입 내역, 진단 결과 및 세부 타임라인을 파악하여 신속하고 정확한 맞춤형 보험 상담을 진행할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  {/* ── CARD 1: 실시간 보험 분석 & 다이어트 시도 목록 (잠재고객 DB) ── */}
                  <div className={`p-3 sm:p-6 rounded-2xl sm:rounded-[2rem] space-y-6 relative overflow-hidden transition-all duration-300 ${
                    showHelpGuide 
                      ? 'help-guide-glow bg-slate-900/20 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.25)]' 
                      : 'bg-slate-900/40 border border-slate-800/80 shadow-none'
                  }`}>
                    {showHelpGuide && (
                      <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                        <div className="pl-2 space-y-1">
                          <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 실시간 자가진단 분석 리드 목록</span>
                          <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                            "📊 홈페이지에 들어와서 자가보장비교 및 보험 다이어트를 완료한 잠재고객 DB입니다. 연락처와 상세 보장 분석 내역이 자동으로 수집되어 즉각 상담이 가능합니다."
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-1 text-left">
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
                            전체보기 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && !isLeadConsult(l.insurance_type) && !l.insurance_type?.includes('_underwriting')).length}건)
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
                            📊 보험 비교분석 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && !isLeadConsult(l.insurance_type) && l.insurance_type !== 'remodeling' && !l.insurance_type?.includes('_underwriting')).length}건)
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
                      <div className="space-y-4">
                        {renderLeadsTable(getFilteredAnalysisLeads().slice((analysisPage - 1) * 10, analysisPage * 10))}
                        {renderPagination(analysisPage, getFilteredAnalysisLeads().length, 10, setAnalysisPage)}
                      </div>
                    )}
                  </div>

                  {/* ── CARD 2: 🔥 카카오톡 정밀설계 신청 목록 (초고관여 상담 DB) ── */}
                  <div className={`p-3 sm:p-6 rounded-2xl sm:rounded-[2rem] space-y-6 relative overflow-hidden transition-all duration-300 ${
                    showHelpGuide 
                      ? 'help-guide-glow bg-slate-950/90 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.25)]' 
                      : 'bg-slate-950 border-2 border-orange-500/30 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.15)]'
                  }`}>
                    {showHelpGuide && (
                      <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                        <div className="pl-2 space-y-1">
                          <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 실시간 고객 상담 신청 현황 (리드 목록)</span>
                          <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                            "📋 진단을 마친 고객이 상담 신청 시 실시간으로 DB가 쌓이는 곳입니다. 상세 보기 버튼을 눌러 고객의 성별, 연령, 매칭률 및 상세 설문 결과를 확인하고 상담을 진행하세요."
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                      <ShieldCheck className="w-48 h-48 text-orange-500" />
                    </div>
                    
                    <div className="space-y-1 relative z-10 text-left">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        💬 카톡 상담 신청 및 1:1 고객센터 문의 목록
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold">고객이 분석 결과를 확인한 후 카톡 상담을 요청했거나, 고객센터를 통해 1:1 문의를 남긴 초고관여 리드 목록입니다.</p>
                      <div className="mt-3 overflow-hidden rounded-xl border border-yellow-500/30 bg-yellow-500/5 transition-all">
                        {/* Accordion Header */}
                        <button
                          type="button"
                          onClick={() => setIsKakaoGuideOpen(!isKakaoGuideOpen)}
                          className="w-full flex items-center justify-between p-3.5 text-left text-[11px] font-black text-yellow-400 hover:bg-yellow-500/10 transition-all cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                            💡 [필독] 카톡 신청 시 고객 정보 잠금 해제하는 방법 (클릭해서 보기)
                          </span>
                          <span className="text-yellow-500 text-xs font-bold transition-transform duration-200">
                            {isKakaoGuideOpen ? '▲ 닫기' : '▼ 열기'}
                          </span>
                        </button>

                        {/* Accordion Content */}
                        {isKakaoGuideOpen && (
                          <div className="p-4 border-t border-yellow-500/20 bg-slate-950/40 text-[10.5px] text-slate-300 space-y-3 font-bold leading-relaxed break-keep">
                            <p className="text-xs font-black text-yellow-300">🔓 [필독] 0.1초 카카오톡 실시간 상담 연동 가이드</p>
                            
                            <div className="space-y-2.5 pl-1">
                              <div>
                                <span className="text-white font-black block">1단계. 실시간 알림 확인</span>
                                <span className="text-slate-400">고객이 카톡 상담을 신청하면, 대시보드에 노란색 <span className="text-yellow-400">카톡채팅요청 💬</span> 배지가 번쩍이며 실시간으로 뜹니다.</span>
                              </div>
                              <div>
                                <span className="text-white font-black block">2단계. 카톡방에서 코드 확인</span>
                                <span className="text-slate-400">고객이 오픈채팅방에 입장하여 자신의 <span className="text-orange-400 font-extrabold bg-orange-500/10 px-1 py-0.5 rounded border border-orange-500/20 uppercase text-[9px] tracking-wider">고유 코드 (예: REX-DA4JGR)</span>를 보낼 것입니다.</span>
                              </div>
                              <div>
                                <span className="text-white font-black block">3단계. 인증 문구 복사 및 전달</span>
                                <span className="text-slate-400">어드민에서 해당 고객을 찾아 <span className="text-yellow-400 bg-yellow-500/10 px-1 py-0.5 rounded border border-yellow-500/20">[문구복사 📋]</span> 버튼을 누릅니다. 자동으로 복사된 인증 안내 문구를 카카오톡 오픈채팅방에 붙여넣기(Ctrl+V) 하여 고객에게 전송합니다.</span>
                              </div>
                              <div>
                                <span className="text-white font-black block">4단계. 마스킹 자동 해제 및 상담</span>
                                <span className="text-slate-400">고객이 링크를 눌러 본인인증을 마치는 순간, 설계사님 어드민 화면의 숨겨진 실명과 연락처가 <span className="text-yellow-400 font-extrabold underline">0.1초 만에 자동으로 잠금 해제</span>됩니다. 이제 확보된 정보로 상담을 진행하세요!</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
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
                            전체보기 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting'))).length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setConsultCategoryFilter('remodeling')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'remodeling' ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            💸 내 보험 다이어트 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting')) && l.insurance_type?.includes('remodeling')).length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setConsultCategoryFilter('compare')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'compare' ? 'bg-sky-500 text-white shadow shadow-sky-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            📊 보험 비교분석 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && isLeadConsult(l.insurance_type) && !l.insurance_type?.includes('remodeling') && l.insurance_type !== 'support_consult').length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setConsultCategoryFilter('underwriting')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'underwriting' ? 'bg-amber-500 text-white shadow shadow-amber-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            🔍 사전심사 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && l.insurance_type?.includes('_underwriting')).length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setConsultCategoryFilter('support')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'support' ? 'bg-indigo-500 text-white shadow shadow-indigo-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            📞 고객센터 문의 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && l.insurance_type === 'support_consult').length}건)
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
                        <p className="text-xs font-bold">수집된 카카오톡 상담 요청 또는 고객센터 문의 리드가 없습니다.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {renderLeadsTable(getFilteredConsultLeads().slice((consultPage - 1) * 10, consultPage * 10))}
                        {renderPagination(consultPage, getFilteredConsultLeads().length, 10, setConsultPage)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Planners panel */}
              {activeTab === 'planners' && (
                <div key="planners" className="active-tab-fade-slide space-y-6">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 소속 설계사 관리</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "👥 대리점에 소속되어 활동 중인 보험 설계사(플래너) 목록입니다. 신규 플래너의 가입 승인, 승인 대기 해제, 활동 상태(활성/정지)를 한눈에 관리하세요."
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-white">
                      {currentUser.role === 'super' ? '전체 가입 설계사 현황' : '대리점 소속 설계사 관리'}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black">
                        {currentUser.role === 'super' 
                          ? `전체 설계사: ${planners.length}명`
                          : `대리점 소속원: ${planners.filter(p => p.agency_id === currentUser.agencyId).length}명`}
                      </span>
                      {renderHelpGuideToggle()}
                    </div>
                  </div>

                  {/* 초대 코드 및 링크 섹션 */}
                  {currentUser.role === 'agency' && (
                    <div className={`bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-950 rounded-2xl p-6 text-left space-y-4 transition-all duration-300 relative overflow-hidden ${
                      showHelpGuide 
                        ? 'border-2 border-dashed border-orange-500/80 animate-pulse bg-slate-900/10' 
                        : 'border border-blue-500/20'
                    }`}>
                      {showHelpGuide && (
                        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                          <div className="pl-2 space-y-1">
                            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 소속 설계사 가입 초대 링크</span>
                            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                              "🔗 대리점에 소속되어 활동할 설계사분들에게 전달할 초대 링크입니다. 이 링크로 가입한 플래너는 대리점 승인 대기 목록에 자동으로 등록됩니다."
                            </p>
                          </div>
                        </div>
                      )}
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

                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] mb-4">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 소속 설계사 목록 및 승인</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "👥 등록된 설계사의 코드를 확인하고 홍보 링크를 복사할 수 있으며, 신규 가입한 대기 설계사의 가입 승인 및 해지가 가능합니다."
                        </p>
                      </div>
                    </div>
                  )}

                  <div className={`grid md:grid-cols-2 gap-4 transition-all duration-300 ${
                    showHelpGuide ? 'help-guide-glow p-4 rounded-[2rem] bg-slate-900/10' : ''
                  }`}>
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
                <div key="agencies" className="active-tab-fade-slide space-y-6">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 전체 대리점 관리 (총관리자 전용)</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "🏢 시스템 내에 등록된 모든 보험대리점(GA)의 결제 상태, 보유 크레딧 잔액, 소속 설계사 수 및 분배 방식을 통합 관제하고 크레딧 조정을 수행합니다."
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-white">전체 등록 대리점 관리</h2>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black">
                        등록 대리점: {agencies.length}개
                      </span>
                      {renderHelpGuideToggle()}
                    </div>
                  </div>

                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] mb-4">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 대리점 정보 및 크레딧 실시간 충전</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "🏢 등록 대리점들의 정보를 수정하거나, 선불 API 조회 크레딧을 추가/차감 충전하여 강제 할당 상태를 0.1초 만에 즉각 제어하는 관제 카드입니다."
                        </p>
                      </div>
                    </div>
                  )}

                  <div className={`grid md:grid-cols-2 gap-4 transition-all duration-300 ${
                    showHelpGuide ? 'help-guide-glow p-4 rounded-[2rem] bg-slate-900/10' : ''
                  }`}>
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
                <div key="settings" className="active-tab-fade-slide space-y-6">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 대리점 분배 정책 설정</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "⚙️ 소속 설계사들에게 신규 유입 고객 DB를 분배하는 알고리즘 규칙(자동 즉시 분배 vs 대리점주 수동 재할당) 및 상세 시스템 정책을 실시간으로 제어합니다."
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-black text-white">대리점 DB 분배 방식 변경 설정</h2>
                    {renderHelpGuideToggle()}
                  </div>
                  <p className="text-xs text-slate-400 font-bold leading-normal break-keep">
                    대표 광고 또는 소속 플래너들이 수집한 고객 상담 데이터(리드)를 대리점 내부에서 어떻게 흐르게 할 것인지 결정합니다. 설정 변경 시 즉시 Supabase DB에 반영되어 다음 리드부터 적용됩니다.
                  </p>
                  {showHelpGuide && (
                    <div className="p-6 bg-slate-950 border border-orange-500/30 rounded-[2rem] text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.08)] mb-6">
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-amber-500" />
                      <div className="pl-4 space-y-3">
                        <span className="text-[11px] font-black text-orange-400 block uppercase tracking-wider">💡 분배 정책 도움말 가이드 및 매뉴얼</span>
                        <h4 className="text-sm font-extrabold text-white">대리점 운영 환경에 맞는 최적의 라우팅 모드를 선택하세요</h4>
                        <div className="grid md:grid-cols-3 gap-4 text-xs font-bold text-slate-350 pt-2">
                          <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                            <span className="text-white font-extrabold block">1. 개인 홍보 직접배정형 (Direct)</span>
                            <p className="text-[11px] text-slate-450 leading-relaxed break-keep">각 플래너 개인 링크로 유치된 리드를 0.1초 만에 설계사 본인에게 즉시 단독 노출 및 배정합니다. 대리점 광고를 진행하지 않을 때 추천합니다.</p>
                          </div>
                          <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                            <span className="text-white font-extrabold block">2. 대리점 수동 분배형 (Manual Pool)</span>
                            <p className="text-[11px] text-slate-450 leading-relaxed break-keep">유입된 모든 공동 리드가 미배정 상태(대기 풀)로 안전하게 쌓입니다. 대리점주가 설문이나 분석 상세를 검토 후 수동으로 알맞은 설계사에게 배정합니다.</p>
                          </div>
                          <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                            <span className="text-white font-extrabold block">3. 실시간 자동 분배형 (Auto-Routing)</span>
                            <p className="text-[11px] text-slate-450 leading-relaxed break-keep">다량의 공동 광고 리드를 0.1초 안에 자동으로 매칭합니다. 세부 알고리즘(순차/가중치/실적)에 따라 대기 없이 설계사들에게 공평하게 즉시 할당합니다.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={`grid lg:grid-cols-3 gap-6 pt-4 transition-all duration-300 ${
                    showHelpGuide ? 'help-guide-glow p-4 rounded-[2rem] bg-slate-900/10' : ''
                  }`}>
                    {/* 카드 1. 개인 홍보 직접배정형 */}
                    <div
                      onClick={() => handleUpdateRouting('direct')}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left min-h-[17.5rem] relative ${getCurrentRoutingType() === 'direct' ? 'bg-slate-950/40 border-orange-500 shadow-md shadow-orange-500/5' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                    >
                      {getCurrentRoutingType() === 'direct' && (
                        <div className="absolute top-4 right-4 text-orange-500">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-sm text-white">개인 홍보 직접배정형 (Direct)</h4>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                          소속 설계사들이 각자 링크(<code className="text-orange-300 font-black bg-orange-500/5 px-1 py-0.5 rounded border border-orange-500/15 font-mono text-[10px]">?planner=코드</code>)로 직접 유치한 고객 DB를 대리점 개입 없이 설계사 본인에게 즉시 즉각 단독 노출 및 자동 지정하는 개인형 구조입니다.
                        </p>
                        <div className="border-t border-slate-900/60 pt-2.5">
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed break-keep">
                            💡 대리점 차원의 통합 광고를 집행하지 않고, 소속 설계사들이 각자 개별 영업 및 홍보를 진행할 때 적합합니다.
                          </p>
                        </div>
                      </div>
                      <div className={`text-[9px] font-black tracking-widest uppercase mt-3 ${getCurrentRoutingType() === 'direct' ? 'text-orange-400' : 'text-slate-500'}`}>
                        {getCurrentRoutingType() === 'direct' ? '현재 활성화 상태' : '선택하기'}
                      </div>
                    </div>

                    {/* 카드 2. 대리점 수동 분배형 */}
                    <div
                      onClick={() => handleUpdateRouting('distribute')}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left min-h-[17.5rem] relative ${getCurrentRoutingType() === 'distribute' ? 'bg-slate-950/40 border-orange-500 shadow-md shadow-orange-500/5' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                    >
                      {getCurrentRoutingType() === 'distribute' && (
                        <div className="absolute top-4 right-4 text-orange-500">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-sm text-white">대리점 수동 분배형 (Manual Pool)</h4>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                          대리점 대표 광고로 들어온 공용 DB를 미배정(대기 풀) 상태로 쌓아두고, 대리점주가 직접 고객 정보나 설문을 검토한 후 적합한 설계사를 수동 지정하는 통제형 구조입니다.
                        </p>
                        <div className="border-t border-slate-900/60 pt-2.5">
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed break-keep">
                            📢 대리점 통합 광고를 집행하여 유입된 공용 DB를 대표자가 직접 검증 후 전략적으로 직접 배정하고자 할 때 적합합니다.
                          </p>
                        </div>
                      </div>
                      <div className={`text-[9px] font-black tracking-widest uppercase mt-3 ${getCurrentRoutingType() === 'distribute' ? 'text-orange-400' : 'text-slate-500'}`}>
                        {getCurrentRoutingType() === 'distribute' ? '현재 활성화 상태' : '선택하기'}
                      </div>
                    </div>

                    {/* 카드 3. 실시간 자동 분배형 */}
                    <div
                      onClick={() => handleUpdateRouting('distribute_auto_round_robin')}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left min-h-[17.5rem] relative ${getCurrentRoutingType() === 'distribute_auto' ? 'bg-slate-950/40 border-orange-500 shadow-md shadow-orange-500/5' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                    >
                      {getCurrentRoutingType() === 'distribute_auto' && (
                        <div className="absolute top-4 right-4 text-orange-500">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <div className="space-y-3">
                        <h4 className="font-extrabold text-sm text-amber-400 flex items-center gap-1">
                          실시간 자동 분배형 (Auto-Routing) <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 px-1 py-0.5 rounded text-amber-500 font-black">★추천</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                          대리점 광고로 들어온 공용 DB를 시스템이 0.1초 만에 최적의 설계사를 골라 즉시 분배하는 고속 자동화 구조입니다. (하단에서 균등/가중치/실적 세부 알고리즘 선택 가능)
                        </p>
                        <div className="border-t border-slate-900/60 pt-2.5">
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed break-keep">
                            ⚡ 대리점 통합 광고를 통해 유입되는 다량의 공용 DB를 대기 시간 없이 실시간으로 즉시 배정 분배하고자 할 때 최적입니다.
                          </p>
                        </div>
                      </div>
                      <div className={`text-[9px] font-black tracking-widest uppercase mt-3 ${getCurrentRoutingType() === 'distribute_auto' ? 'text-orange-400' : 'text-slate-500'}`}>
                        {getCurrentRoutingType() === 'distribute_auto' ? '현재 활성화 상태' : '선택하기'}
                      </div>
                    </div>
                  </div>

                  {/* 분배형 분기 화면 */}
                  {getCurrentRoutingType() === 'direct' && (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 text-left mt-6">
                      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
                        <span className="text-2xl">👤</span>
                        <div>
                          <h3 className="text-base font-extrabold text-white">개인 홍보 직접배정형 전용 관리</h3>
                          <p className="text-xs text-slate-400 font-semibold mt-1">
                            대리점 개입 없이 설계사 개별 유치 리드만 즉각 할당되는 상태입니다.
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-350 font-bold leading-relaxed break-keep">
                        현재 대리점의 분배 방식이 <span className="text-white font-extrabold font-mono">"개인 홍보 직접배정형"</span>으로 설정되어 있습니다. 이 모드에서는 대리점 통합 광고(공용 DB) 분배 기능이 동작하지 않으며, 각 설계사의 고유 링크(<code className="text-orange-400 bg-orange-500/5 px-1 py-0.5 rounded border border-orange-500/15 font-mono">?planner=코드</code>)를 통해 접수된 건만 해당 설계사에게 즉시 배정됩니다.
                      </p>
                      
                      {/* 설계사 개인 링크 목록 */}
                      <div className="space-y-4 pt-2">
                        <div className="space-y-1">
                          <h4 className="text-xs font-extrabold text-white">🔗 소속 설계사 개인 홍보 링크 현황</h4>
                          <p className="text-[10px] text-slate-400 font-bold">소속 설계사들의 홍보용 URL입니다. 해당 주소로 유치 시 대리점을 안 거치고 다이렉트로 설계사에게 배정됩니다.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {planners
                            .filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active')
                            .map(p => (
                              <div key={p.id} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 flex items-center justify-between text-xs font-bold text-slate-300">
                                <div className="space-y-1 text-left">
                                  <span className="text-white font-extrabold block">{p.name} ({p.planner_code})</span>
                                  <span className="text-[10px] text-slate-500 font-mono select-all">/?planner={p.planner_code}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/?planner=${p.planner_code}`);
                                    alert(`[${p.name}] 설계사의 개인 홍보 링크가 복사되었습니다!`);
                                  }}
                                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-orange-400 hover:text-orange-300 font-black rounded-lg text-[10px] cursor-pointer"
                                >
                                  링크 복사
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {getCurrentRoutingType() === 'distribute' && (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 text-left mt-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
                        <div>
                          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                            📥 수동 분배 대기 풀 관리 (Manual Pool Control)
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold mt-1">
                            대리점 공용 채널을 통해 유입되었으나 아직 담당자가 배정되지 않은 미배정 리드 목록입니다.
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-[10px] font-black">
                          대기 DB: {leads.filter(l => !l.planner_id && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting'))).length}건
                        </span>
                      </div>

                      {leads.filter(l => !l.planner_id && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting'))).length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-850 rounded-2xl bg-slate-950/20">
                          🎉 대기 풀에 미배정된 고관여 공용 DB가 없습니다. 모든 리드가 배정되었습니다.
                        </div>
                      ) : (
                        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                          <table className="w-full min-w-[700px] text-xs font-bold text-slate-350">
                            <thead>
                              <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450 text-left">
                                <th className="py-3 px-4">고객명</th>
                                <th className="py-3 px-4">연락처</th>
                                <th className="py-3 px-4">신청 유형</th>
                                <th className="py-3 px-4">유입 일시</th>
                                <th className="py-3 px-4 text-center">설계사 지정 배정</th>
                              </tr>
                            </thead>
                            <tbody>
                              {leads
                                .filter(l => !l.planner_id && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting')))
                                .map(lead => (
                                  <tr key={lead.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                                    <td className="py-3 px-4 text-slate-200">{lead.name}</td>
                                    <td className="py-3 px-4 text-slate-400">{lead.phone}</td>
                                    <td className="py-3 px-4">
                                      <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 rounded text-[9px] font-black">
                                        {getInsuranceTypeName(lead.insurance_type || '').label}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-450">
                                      {new Date(lead.created_at).toLocaleString('ko-KR')}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <select
                                        onChange={(e) => {
                                          if (e.target.value) {
                                            handleAssignPlanner(lead.id, e.target.value);
                                            e.target.value = '';
                                          }
                                        }}
                                        className="bg-slate-900 border border-slate-800 rounded-lg py-1 px-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-orange-500"
                                      >
                                        <option value="">설계사 지정...</option>
                                        {planners
                                          .filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active')
                                          .map(p => (
                                            <option key={p.id} value={p.id}>{p.name} ({p.planner_code})</option>
                                          ))}
                                      </select>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {getCurrentRoutingType() === 'distribute_auto' && (
                    <div className="space-y-6 mt-6">
                      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-8 text-left">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
                          <div>
                            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                              ⚡ 실시간 자동 분배 엔진 세부 설정 (Auto-Routing Settings)
                            </h3>
                            <p className="text-xs text-slate-450 font-semibold mt-1">
                              대리점 대표 광고로 들어온 공용 DB를 배정할 때 적용할 알고리즘 및 설계사별 정책을 제어합니다.
                            </p>
                          </div>
                          <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-[10px] font-black uppercase">
                            엔진 상태: 가동 중
                          </span>
                        </div>

                        {/* 알고리즘 선택 버튼 */}
                        <div className="space-y-3">
                          <label className="text-xs font-extrabold text-slate-300 block">활성화 알고리즘 선택</label>
                          <div className="grid md:grid-cols-3 gap-4">
                            {[
                              { 
                                type: 'distribute_auto_round_robin', 
                                label: '균등 순차 분배 (Round-Robin)', 
                                desc: '최근 30일 배정 건수가 가장 적은 설계사에게 순서대로 리드를 균등 분배합니다.' 
                              },
                              { 
                                type: 'distribute_auto_weighted', 
                                label: '가중치 기반 비율 분배 (Weighted)', 
                                desc: '설계사별 설정된 영업 가중치(비율)에 비례하여 높은 확률로 자동 분배합니다.' 
                              },
                              { 
                                type: 'distribute_auto_activity', 
                                label: '응대 실적 기반 분배 (Activity-Based)', 
                                desc: '이번 달 크레딧 사용량(활동 실적)이 높은 최우수 설계사에게 가중 우선 분배합니다.' 
                              }
                            ].map((algo) => {
                              const isSelected = agencies.find(a => a.id === currentUser.agencyId)?.lead_routing_type === algo.type;
                              return (
                                <button
                                  key={algo.type}
                                  onClick={() => handleUpdateRouting(algo.type)}
                                  className={`p-4.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${isSelected ? 'border-orange-500 bg-orange-500/5 text-white' : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'}`}
                                >
                                  <div className="font-extrabold text-sm flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-orange-500' : 'bg-slate-750'}`} />
                                    {algo.label}
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-semibold mt-2 leading-relaxed break-keep">
                                    {algo.desc}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 설계사별 배정 상태 및 가중치 관리 테이블 */}
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-extrabold text-white">👥 플래너별 자동 분배 정책 설정</h4>
                            <p className="text-[11px] text-slate-450 font-bold">각 설계사의 자동 분배 배제 여부(Disabled) 및 가중치(Weight)를 실시간으로 제어합니다.</p>
                          </div>

                          {/* PC View: Table */}
                          <div className="hidden md:block overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                            <table className="w-full min-w-[800px] text-xs font-bold text-slate-350">
                              <thead>
                                <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450 text-left">
                                  <th className="py-3 px-4">설계사명</th>
                                  <th className="py-3 px-4">연락처</th>
                                  <th className="py-3 px-4 text-center">최근 30일 배정 상태</th>
                                  <th className="py-3 px-4 text-center">이번 달 실적 점수</th>
                                  <th className="py-3 px-4 text-center w-36">영업 가중치 (Weight)</th>
                                  <th className="py-3 px-4 text-center w-32">분배 수신 상태</th>
                                </tr>
                              </thead>
                              <tbody>
                                {planners
                                  .filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active')
                                  .map(planner => {
                                    const stats = getPlannerAssignmentStats(planner.id);
                                    const regNum = planner.registration_number || '';
const distPart = regNum.includes('|') ? regNum.split('|')[1] : regNum;
const isDisabled = distPart === 'dist_disabled';

// Parse weight
let weight = 5;
if (distPart.startsWith('dist_weight:')) {
  const w = parseInt(distPart.split(':')[1]);
  weight = isNaN(w) ? 5 : w;
}

                                    return (
                                      <tr key={planner.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                                        <td className="py-3 px-4 text-slate-200">{planner.name} ({planner.planner_code})</td>
                                        <td className="py-3 px-4 text-slate-455">{planner.phone}</td>
                                        <td className="py-3 px-4 text-center text-slate-450">
                                          {stats.count}건 <span className="text-[10px] text-slate-500">({stats.ratio}%)</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                          <span className="text-emerald-400 font-extrabold">{planner.monthly_credit_used || 0}점</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                          <input
                                            type="number"
                                            disabled={isDisabled}
                                            defaultValue={isDisabled ? '' : weight}
                                            onBlur={(e) => handleUpdatePlannerWeight(planner.id, Number(e.target.value))}
                                            placeholder="5"
                                            min="1"
                                            max="100"
                                            className="w-20 bg-slate-900 border border-slate-800 disabled:opacity-30 rounded-lg py-1 px-2 text-center text-xs font-black text-white focus:outline-none focus:border-orange-500"
                                          />
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                          <button
                                            onClick={() => handleTogglePlannerDistribution(planner.id, regNum)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${isDisabled ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'}`}
                                          >
                                            {isDisabled ? '❌ 제외됨 (Disabled)' : '🟢 배정중 (Active)'}
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile View: Card List */}
                          <div className="md:hidden space-y-3">
                            {planners
                              .filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active')
                              .map(planner => {
                                const stats = getPlannerAssignmentStats(planner.id);
                                const regNum = planner.registration_number || '';
const distPart = regNum.includes('|') ? regNum.split('|')[1] : regNum;
const isDisabled = distPart === 'dist_disabled';

// Parse weight
let weight = 5;
if (distPart.startsWith('dist_weight:')) {
  const w = parseInt(distPart.split(':')[1]);
  weight = isNaN(w) ? 5 : w;
}

                                return (
                                  <div 
                                    key={planner.id}
                                    className={`bg-slate-900/60 border rounded-2xl p-4 space-y-3.5 transition-all ${
                                      isDisabled ? 'border-rose-500/20 opacity-80' : 'border-slate-800/80 hover:border-slate-700'
                                    }`}
                                  >
                                    {/* Planner Profile Header */}
                                    <div className="flex items-center justify-between gap-3">
                                      <div>
                                        <h4 className="font-extrabold text-sm text-white">{planner.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                                          코드: {planner.planner_code} • {planner.phone}
                                        </p>
                                      </div>
                                      
                                      {/* Status Button */}
                                      <button
                                        onClick={() => handleTogglePlannerDistribution(planner.id, regNum)}
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer shrink-0 ${
                                          isDisabled 
                                            ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20' 
                                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                        }`}
                                      >
                                        {isDisabled ? '❌ 제외됨' : '🟢 배정중'}
                                      </button>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-slate-800/40" />

                                    {/* Info and weight input */}
                                    <div className="grid grid-cols-2 gap-3 items-center">
                                      <div className="space-y-1">
                                        <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">배정 및 실적</span>
                                        <p className="text-[11px] font-semibold text-slate-350">
                                          {stats.count}건 ({stats.ratio}%) • <span className="text-emerald-400 font-extrabold">{planner.monthly_credit_used || 0}점</span>
                                        </p>
                                      </div>
                                      
                                      <div className="flex flex-col items-end gap-1">
                                        <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">영업 가중치 (Weight)</span>
                                        <input
                                          type="number"
                                          disabled={isDisabled}
                                          defaultValue={isDisabled ? '' : weight}
                                          onBlur={(e) => handleUpdatePlannerWeight(planner.id, Number(e.target.value))}
                                          placeholder="5"
                                          min="1"
                                          max="100"
                                          className="w-16 bg-slate-950 border border-slate-800 disabled:opacity-30 rounded-lg py-1 px-2 text-center text-xs font-black text-white focus:outline-none focus:border-orange-500/40"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>

                      {/* DB 분배 시뮬레이터 (Lead Distribution Visualizer) */}
                      <LeadDistributionSimulator 
                        planners={planners} 
                        agencies={agencies} 
                        currentUser={currentUser} 
                        showHelpGuide={showHelpGuide} 
                        activeStrategy={getCurrentRoutingAlgo()}
                      />
                    </div>
                  )}

                  {/* 자주 묻는 질문 (FAQ) 섹션 */}
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 text-left mt-8">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">❓</span>
                        <div>
                          <h3 className="text-base font-extrabold text-white">⚙️ 분배 시스템 자주 묻는 질문 (FAQ)</h3>
                          <p className="text-xs text-slate-450 font-semibold mt-1">대리점 대표자들이 가장 자주 문의하는 분배 정책 핵심 매뉴얼입니다.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleFaq}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-black transition-all cursor-pointer ${
                          showFaq 
                            ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 hover:bg-orange-500/20 shadow-lg shadow-orange-500/5' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {showFaq ? '📖 FAQ 접기' : '📘 FAQ 펼치기'}
                      </button>
                    </div>

                    {showFaq && (
                      <div className="space-y-4 active-tab-fade-slide">
                        {[
                          {
                            q: "Q1. 3가지 분배 방식(Direct, Manual, Auto-Routing)은 각각 언제 선택하나요?",
                            a: "• 개인 홍보 직접배정형 (Direct)은 대리점 차원 광고가 없고 설계사 개별 영업에 의존할 때 적합합니다.\n• 대리점 수동 분배형 (Manual Pool)은 공동 광고로 유입된 고관여 리드를 관리자가 면밀히 검토 후 수동 매칭하고자 할 때 최적입니다.\n• 실시간 자동 분배형 (Auto-Routing)은 대량의 공동 리드가 쏟아질 때 실시간(0.1초 이내)으로 공평 또는 성과 비례로 자동 즉시 분배하고자 할 때 최적입니다."
                          },
                          {
                            q: "Q2. 실시간 자동 분배의 3가지 알고리즘(순차, 가중치, 실적)은 어떻게 작동하나요?",
                            a: "• 균등 순차 분배 (Round-Robin): 최근 30일 배정 비율을 분석해 배정 건수가 가장 적은 플래너에게 순환하여 1건씩 똑같이 배정합니다.\n• 가중치 기반 비율 분배 (Weighted): 설정된 영업 가중치(Weight) 값에 비례하여 더 높은 확률로 분배받습니다. (예: 가중치 10은 가중치 5보다 2배 더 자주 배정됨)\n• 응대 실적 기반 분배 (Activity-Based): 이번 달 활동 실적 점수(크레딧 사용량 등)가 높은 열정적인 플래너에게 우선 할당됩니다."
                          },
                          {
                            q: "Q3. 특정 설계사를 자동 배정 대상에서 완전히 제외하려면 어떻게 합니까?",
                            a: "• 실시간 자동 분배형 하단 테이블의 '분배 수신 상태'에서 플래너 우측의 녹색 버튼(배정중)을 클릭하여 빨간색 '❌ 제외됨 (Disabled)' 상태로 변경하시면, 어떠한 분배 알고리즘에서도 0.1초 만에 즉각 제외 처리가 동기화됩니다."
                          },
                          {
                            q: "Q4. 수동 분배 대기 풀에 누적된 리드는 플래너에게 보이나요?",
                            a: "• 아니오. 수동 분배 대기 풀에 머물고 있는 공용 리드는 담당 플래너가 지정되지 않은 상태이므로 일반 소속 설계사의 대시보드에는 전혀 보이지 않으며, 오직 대리점 대표 관리자의 화면에서만 관리 및 배정이 가능합니다."
                          }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 hover:border-slate-800 transition-all">
                            <span className="text-xs font-black text-orange-400 block mb-2 font-mono">{item.q}</span>
                            <p className="text-xs font-bold text-slate-350 leading-relaxed whitespace-pre-line break-keep font-sans">
                              {item.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Billing panel */}
              {activeTab === 'billing' && (
                <div key="billing" className="active-tab-fade-slide space-y-8">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 구독 결제 관리</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "🎫 대시보드 라이선스를 유지하는 정기 구독권(월단위 연장) 및 실시간 가격비교 API 연동에 사용되는 건별 선불 크레딧 충전 상태를 투명하게 모니터링합니다."
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-black text-white">구독 계약 및 결제 시뮬레이션</h2>
                    {renderHelpGuideToggle()}
                  </div>

                  {/* 1. Subscription card */}
                  <div className={`p-4 sm:p-8 space-y-6 text-left relative overflow-hidden transition-all duration-300 ${
                    showHelpGuide 
                      ? 'help-guide-glow bg-slate-900/90 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.25)] rounded-2xl sm:rounded-[2rem]' 
                      : 'bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-orange-500/20 rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(255,107,0,0.08)]'
                  }`}>
                    {showHelpGuide && (
                      <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                        <div className="pl-2 space-y-1">
                          <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 월 정기 라이선스 결제 및 연장</span>
                          <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                            "🎫 플랫폼 대시보드와 개인/대리점 홍보용 홈페이지를 활성화 상태로 유지하기 위한 월 정기 라이선스 계약 영역입니다. 시뮬레이터를 통해 1개월 연장이 가능합니다."
                          </p>
                        </div>
                      </div>
                    )}
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
                        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                          <span>{currentUser.role === 'agency' ? '대리점 통합 단체 구독 플랜' : '개인 설계사 독립형 구독 플랜'}</span>
                          {currentUser.role === 'agency' && (
                            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 border border-orange-500/20 rounded font-black uppercase tracking-wider">
                              {billingTier}
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-slate-450 font-bold leading-relaxed">
                          대리점 플랫폼 이용 권한 및 소속 설계사들의 마케팅 랜딩페이지 활성화 상태를 유지하는 월 정기 구독 계약 정보입니다.
                        </p>
                      </div>
                      
                      <div className="bg-slate-950 border border-slate-900/60 px-6 py-3.5 rounded-2xl flex items-center gap-6 shrink-0 self-start md:self-auto shadow-inner">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 block uppercase">정상 요금</span>
                          <span className="text-base font-black text-white">
                            {currentUser.role === 'agency' 
                              ? (billingTier === 'basic' 
                                  ? '월 500,000 원' 
                                  : billingTier === 'pro' 
                                    ? '월 1,000,000 원' 
                                    : '월 5,000,000 원')
                              : '월 50,000 원'}
                          </span>
                          <span className="text-[9px] text-slate-500 font-bold block">(부가세 10% 별도)</span>
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

                      {/* B2B Agency Capacity Gauge Bar */}
                      {currentUser.role === 'agency' && (
                        <div className={`mt-6 p-5 border rounded-2xl ${billingBorderColor} ${billingBgColor} space-y-4`}>
                          <div className="flex justify-between items-center text-xs font-bold">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">소속 설계사 등록 한도 (Capacity Status)</span>
                              <h4 className="text-sm font-extrabold text-white">
                                현재 요금제 등급: <span className="text-orange-400 font-black uppercase">{billingTier} 플랜</span>
                              </h4>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 font-bold block">활성 인원수</span>
                              <span className={`text-base font-black ${billingTextColor}`}>{billingActivePlanners}</span>
                              <span className="text-slate-500 text-xs font-bold"> / {billingMaxLimit} 명 ({billingCapacityPercent}%)</span>
                            </div>
                          </div>

                          {/* Visual Gauge Bar */}
                          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-900">
                            <div 
                              className={`h-full bg-gradient-to-r ${billingGaugeColor} transition-all duration-500 rounded-full`}
                              style={{ width: `${billingCapacityPercent}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                            <span>0%</span>
                            <span>70% (경고)</span>
                            <span>90% (정원 임박)</span>
                            <span>100% (정원 초과)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
 
                  {/* 2. Prepaid Credits Card */}
                  {(currentUser.role === 'agency' || currentUser.role === 'super' || currentUser.role === 'planner') && (
                    <div className={`p-4 sm:p-8 space-y-6 text-left relative overflow-hidden transition-all duration-300 ${
                      showHelpGuide 
                        ? 'help-guide-glow bg-slate-900/90 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.25)] rounded-2xl sm:rounded-[2rem]' 
                        : 'bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/20 rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(245,158,11,0.08)]'
                    }`}>
                      {showHelpGuide && (
                        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                          <div className="pl-2 space-y-1">
                            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 실시간 API 크레딧 충전 및 잔액 관리</span>
                            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                              "⚡ 보험 보장 분석(300크레딧) 및 자동차 보험료 계산(100크레딧)을 수행할 때 API 서버 통신 원가로 실시간 차감되는 선불제 크레딧입니다. 버튼을 클릭해 충전이 가능합니다."
                            </p>
                          </div>
                        </div>
                      )}
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
                            (내 보험 분석 300크레딧, 실시간 자동차 비교 100크레딧) API 연동 시 실시간 차감되는 선불금 잔액입니다.
                            <br />
                            <span className="text-orange-400 font-extrabold">※ 모든 크레딧 결제금액은 부가세(10%) 별도입니다. (예: 10만 크레딧 충전 시 110,000원 결제)</span>
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
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {[
                              { label: '+3,000 크레딧', amount: 3000 },
                              { label: '+10,000 크레딧', amount: 10000 },
                              { label: '+30,000 크레딧', amount: 30000 },
                              { label: '+100,000 크레딧', amount: 100000 },
                              { label: '+300,000 크레딧', amount: 300000 },
                              { label: '+1,000,000 크레딧', amount: 1000000 },
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
                                          onClick={() => handleTopupCredits(agency.id, 100000)}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          +10만
                                        </button>
                                        <button
                                          disabled={topupLoading}
                                          onClick={() => handleTopupCredits(agency.id, 1000000)}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          +100만
                                        </button>
                                        <button
                                          disabled={topupLoading}
                                          onClick={() => handleTopupCredits(agency.id, -10000)}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          -1만
                                        </button>
                                        <button
                                          disabled={topupLoading}
                                          onClick={() => handleTopupCredits(agency.id, -100000)}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          -10만
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
                    <div className="space-y-4">
                      {showHelpGuide && (
                        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                          <div className="pl-2 space-y-1">
                            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 마케팅 투자 대비 효율 (ROI) 분석</span>
                            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                              "📊 총 비용(API 사용 원가), 수집 리드 수, 고객 획득 비용(CAC) 및 최종 상담 완료율을 종합하여 0.1초 만에 마케팅 생산성 지표를 제공합니다."
                            </p>
                          </div>
                        </div>
                      )}
                      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 text-left transition-all duration-300 ${
                        showHelpGuide ? 'help-guide-glow p-4 rounded-[2rem] bg-slate-900/10' : ''
                      }`}>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">총 투입 비용 (API 원가)</span>
                          <span className="text-lg font-black text-white">{roiStats.totalCostKRW.toLocaleString()}원</span>
                          <span className="text-[9px] text-slate-400 block font-semibold">사용된 {roiStats.totalSpentCredits.toLocaleString()} 크레딧</span>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase">수집 고객 리드</span>
                          <span className="text-lg font-black text-white">{roiStats.totalLeads.toLocaleString()}건</span>
                          <span className="text-[9px] text-slate-450 block font-semibold">설계사 링크 총 유입</span>
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
                    </div>
                  )}

                  {/* 4. Low Credit Alerts Config Card */}
                  {currentUser.role === 'agency' && (
                    <div className={`rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 text-left space-y-6 transition-all duration-300 ${
                      showHelpGuide 
                        ? 'help-guide-glow bg-slate-900/90' 
                        : 'bg-slate-900 border border-slate-800'
                    }`}>
                      {showHelpGuide && (
                        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                          <div className="pl-2 space-y-1">
                            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 대리점 전용 크레딧 및 알림 설정</span>
                            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                              "💳 소속 설계사들의 보장 분석 건당 차감되는 크레딧 잔액을 확인하고 충전할 수 있습니다. 크레딧 소진 경보 번호를 등록하면 한도 소진 전 문자로 즉시 알림이 발송됩니다."
                            </p>
                          </div>
                        </div>
                      )}
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
                    <div className={`p-4 sm:p-8 text-left space-y-6 transition-all duration-300 ${
                      showHelpGuide 
                        ? 'help-guide-glow bg-slate-900/90 rounded-2xl sm:rounded-[2rem]' 
                        : 'bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[2rem]'
                    }`}>
                      {showHelpGuide && (
                        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                          <div className="pl-2 space-y-1">
                            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 설계사 월간 크레딧 제한 설정</span>
                            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                              "🛡️ 소속 설계사가 단기간에 대량의 API를 호출하여 크레딧을 무단 소진하지 못하도록 월간 사용 한도를 강제 지정할 수 있는 차단기 설정판입니다."
                            </p>
                          </div>
                        </div>
                      )}
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
                    <div className={`p-4 sm:p-8 text-left space-y-6 transition-all duration-300 ${
                      showHelpGuide 
                        ? 'help-guide-glow bg-slate-900/90 rounded-2xl sm:rounded-[2rem]' 
                        : 'bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[2rem]'
                    }`}>
                      {showHelpGuide && (
                        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                          <div className="pl-2 space-y-1">
                            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 크레딧 사용 및 충전 입출금 장부</span>
                            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                              "📝 대리점 크레딧이 어떠한 경위로 충전/조정되었고, 어떤 설계사가 몇 시 몇 분에 어떠한 유형(내보험 분석/자동차)으로 소진했는지 보여주는 회계 이력입니다."
                            </p>
                          </div>
                        </div>
                      )}
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
                <div key="marketing" className="active-tab-fade-slide space-y-8 text-left">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 광고 / 유입 분석</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "📈 오늘 및 누적 접속자 수, 카톡 상담 요청 전환율, 유입 경로(인스타, 네이버, 카톡, 구글 광고) 성과 지표를 실시간으로 모니터링하여 광고 효율을 극대화합니다."
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Tab Header Row 1: Title and Toggle */}
                  <div className="flex flex-row justify-between items-center gap-4 pb-2">
                    <div className="space-y-1">
                      <h2 className="text-lg font-black text-white flex items-center gap-2">
                        📈 실시간 마케팅 & 광고 유입 통계
                      </h2>
                      <p className="text-xs font-bold text-slate-400">
                        내 브랜드 홍보 링크로 접속한 경로별 광고 성과와 고객 전환율을 0.1초 만에 실시간 모니터링합니다.
                      </p>
                    </div>

                    {renderHelpGuideToggle()}
                  </div>

                  {/* Tab Header Row 2: Time Period Filter Tabs */}
                  <div className="flex flex-wrap items-center justify-end gap-3 border-b border-slate-800/80 pb-4">
                    <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 flex items-center gap-1">
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
                      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300 ${
                        showHelpGuide ? 'border-2 border-dashed border-orange-500/80 animate-pulse p-4 rounded-[2rem] bg-slate-900/10' : ''
                      }`}>
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
                  <div className={`p-4 sm:p-8 space-y-6 transition-all duration-300 ${
                    showHelpGuide 
                      ? 'border-2 border-dashed border-orange-500/80 animate-pulse bg-slate-900/90 rounded-2xl sm:rounded-[2rem]' 
                      : 'bg-slate-950/40 border border-slate-850 rounded-2xl sm:rounded-[2rem]'
                  }`}>
                    {showHelpGuide && (
                      <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                        <div className="pl-2 space-y-1">
                          <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 유입 경로별 효율 상세 분석</span>
                          <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                            "📍 인스타그램, 네이버 블로그, 카카오톡 채널, 구글 검색광고 등 마케팅 매체별 방문 횟수 대비 실제 내보험 분석 신청 전환 건수를 0.1초 단위로 대조 정산합니다."
                          </p>
                        </div>
                      </div>
                    )}
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
                    <div className={`lg:col-span-2 p-4 sm:p-8 space-y-6 transition-all duration-300 ${
                      showHelpGuide 
                        ? 'border-2 border-dashed border-orange-500/80 animate-pulse bg-slate-900/90 rounded-2xl sm:rounded-[2rem]' 
                        : 'bg-slate-950/40 border border-slate-850 rounded-2xl sm:rounded-[2rem]'
                    }`}>
                      {showHelpGuide && (
                        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                          <div className="pl-2 space-y-1">
                            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 설계사별 리드 배정 및 계약 실적 현황</span>
                            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                              "👤 소속 설계사 개개인에게 배정된 총 상담 리드 대비 최종 계약 완료를 지은 실적과 그에 따른 영업 전환율(%)을 일목요연하게 표시합니다."
                            </p>
                          </div>
                        </div>
                      )}
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
                    <div className={`space-y-6 p-4 transition-all duration-300 ${
                      showHelpGuide ? 'border-2 border-dashed border-orange-500/80 animate-pulse rounded-[2rem] bg-slate-900/10' : ''
                    }`}>
                      {showHelpGuide && (
                        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                          <div className="pl-2 space-y-1">
                            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 가입 분석 상품 점유율 및 성별/연령대</span>
                            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                              "📦 고객들이 신청한 보험군(실손, 암, 뇌/심장, 연금 등) 분포와 신청자들의 성별 및 연령대 통계 비율을 시각적으로 0.1초 만에 집계 제공합니다."
                            </p>
                          </div>
                        </div>
                      )}
                      
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
                <form key="profile" onSubmit={handleSaveProfile} className="active-tab-fade-slide space-y-8 text-left">
                  <div className="flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h2 className="text-lg font-black text-white">
                        {currentUser.role === 'super' ? '대표 랜딩페이지 설정' : '개인 프로필 및 랜딩페이지 설정'}
                      </h2>
                      <p className="text-xs font-bold text-slate-400">
                        {currentUser.role === 'super'
                          ? '기본 주소(설계사 파라미터가 없을 때)로 접속하는 고객에게 보여줄 랜딩페이지 인사말, 링크, 연락처를 실시간으로 설정하세요.'
                          : '고객에게 보여줄 내 프로필 사진, 인사말 문구, 카카오톡 상담 링크 및 대표번호를 실시간으로 커스텀하세요.'
                        }
                      </p>
                    </div>
                    {renderHelpGuideToggle()}
                  </div>

                  {/* Promo URL Banner */}
                  {(() => {
                    const myHomepageUrl = currentUser.role === 'super'
                      ? `${window.location.origin}/`
                      : currentUser.role === 'planner'
                        ? `${window.location.origin}/?planner=${currentUser.plannerCode || ''}`
                        : `${window.location.origin}/?agency=${currentUser.agencyCode || currentUser.agencyId || ''}`;
                    return (
                      <div className="space-y-6">
                        <div className={`bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-950 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-4 transition-all duration-300 ${
                          showHelpGuide 
                            ? 'border-2 border-dashed border-orange-500/80 animate-pulse' 
                            : 'border border-orange-500/20'
                        }`}>
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

                        {showHelpGuide && (
                          <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                            <div className="pl-2 space-y-1">
                              <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 나의 랜딩페이지 링크 복사</span>
                              <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                                "🔗 이 링크를 복사하여 고객에게 전달하거나 카카오톡 프로필에 등록하면, 대표님 전용 맞춤 보험 진단 페이지로 연결됩니다!"
                              </p>
                            </div>
                          </div>
                        )}

                        {/* 광고심의 안내 배너 */}
                        <div className="bg-slate-950 border border-orange-500/20 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-3 relative overflow-hidden">
                          <div className="flex items-center gap-2 text-orange-400 font-extrabold text-xs">
                            <AlertCircle className="w-4 h-4" />
                            <span>[필독] 링크 배포 및 외부 광고 시 광고 심의 준수 안내</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                            회원(설계사)님의 안전한 영업을 위해 외부 광고 집행 시 아래 심의 규정을 반드시 확인해 주시기 바랍니다.
                          </p>
                          <div className="text-[10px] text-slate-400 space-y-2.5 border-t border-slate-900 pt-3">
                            <div>
                              <p className="font-extrabold text-slate-300">📌 대리점(GA)별 개별 심의 원칙</p>
                              <p className="pl-3 leading-relaxed text-slate-400 mt-1">
                                보험협회 광고 심의는 법인(GA)별로 개별 적용됩니다. 타 대리점(예: 더윤컴퍼니 vs 에이원자산관리)의 심의필 번호를 도용하거나, 심의 없이 블로그·카페·SNS 등에 링크를 무단 배포할 경우 <strong className="text-red-400 font-bold">금융소비자보호법(금소법) 위반으로 고액의 과태료 및 자격 정지 처분</strong>을 받을 수 있습니다.
                              </p>
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-300">💡 안전한 활용 가이드라인</p>
                              <ul className="list-disc pl-7 space-y-1.5 leading-relaxed text-slate-400 mt-1">
                                <li><strong>1:1 상담용 (심의 불필요)</strong>: 이미 상담 중인 고객에게 카카오톡 1:1 메시지로 분석 리포트 링크를 보내는 것은 '영업 지원 도구'에 해당하여 심의 없이 즉시 가능합니다.</li>
                                <li><strong>불특정 다수 대상 홍보 (심의 필수)</strong>: 블로그, 유튜브, 키워드 광고 등에 링크를 공개적으로 게시할 경우, 소속 대리점(GA) 준법감시실을 통해 본 플랫폼의 화면 심의를 먼저 통과한 후 <strong>부여받은 심의번호를 하단에 기재</strong>하고 광고를 집행해야 합니다.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className={`bg-slate-950/40 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 transition-all duration-300 ${
                    showHelpGuide 
                      ? 'border-2 border-dashed border-orange-500/80 animate-pulse' 
                      : 'border border-slate-850'
                  }`}>
                    {showHelpGuide && (
                      <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                        <div className="pl-2 space-y-1">
                          <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 프로필 및 랜딩 브랜딩 설정</span>
                          <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                            "🎨 이곳에 등록한 사진, 로고, 대표 번호, 소속 지점 주소 및 진심 어린 인사말이 고객의 보장 분석 결과 하단 카드와 푸터에 0.1초 만에 즉시 동적 반영됩니다."
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      {/* 로그인 ID */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          로그인 ID
                        </label>
                        <input 
                          type="text"
                          value={currentUser.plannerCode || ''}
                          readOnly
                          className="w-full bg-slate-950/40 border border-slate-900 rounded-xl py-2.5 px-4 outline-none text-xs text-slate-500 font-bold cursor-not-allowed select-all"
                        />
                        <p className="text-[10px] text-slate-500 font-medium">
                          💡 해당 대시보드 로그인 시 사용하는 고유 식별 코드입니다. (수정 불가)
                        </p>
                      </div>

                      {/* 설계사 이름 */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          설계사 이름 (필수)
                        </label>
                        <input 
                          type="text"
                          value={editPlannerName}
                          onChange={(e) => setEditPlannerName(e.target.value)}
                          placeholder="예: 홍길동"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>

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
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                            카카오톡 상담 연결 링크 (오픈채팅/채널 주소)
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowKakaoHelpEdit(!showKakaoHelpEdit)}
                            className="text-[10px] text-orange-400 hover:text-orange-300 font-bold transition-all flex items-center gap-1 cursor-pointer bg-slate-800/40 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
                          >
                            오픈채팅 링크 확인 방법 ❓
                          </button>
                        </div>
                        <input 
                          type="url"
                          value={editKakao}
                          onChange={(e) => setEditKakao(e.target.value)}
                          placeholder="예: https://open.kakao.com/o/..."
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        />
                        {showKakaoHelpEdit && (
                          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-[11px] text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200 text-left normal-case">
                            <p className="font-extrabold text-white flex items-center gap-1">
                              <span>💬</span> 카카오톡 1:1 오픈채팅방 생성 및 링크 확인 방법
                            </p>
                            <ol className="list-decimal pl-4 space-y-1.5 font-medium text-slate-300">
                              <li>스마트폰에서 <strong className="text-white">카카오톡</strong> 앱을 실행합니다.</li>
                              <li>하단 <strong className="text-white">채팅 탭</strong>으로 이동 후, 우측 상단의 <strong className="text-white">말풍선+ (새로운 채팅)</strong> 아이콘을 누릅니다.</li>
                              <li><strong className="text-white">오픈채팅</strong> ➜ <strong className="text-white">내 오픈링크</strong> ➜ <strong className="text-white">만들기</strong> 버튼을 선택합니다.</li>
                              <li><strong className="text-white">1:1 채팅방</strong>을 선택한 후, 이름과 프로필을 설정하여 방을 만듭니다.</li>
                              <li>방이 생성되면 우측 상단 메뉴(혹은 중간)의 <strong className="text-white">링크 공유</strong> ➜ <strong className="text-white">링크 복사</strong>를 누릅니다.</li>
                              <li>복사된 주소(예: <code className="text-orange-400 font-bold">https://open.kakao.com/o/...</code>)를 위 입력창에 붙여넣어 주세요.</li>
                            </ol>
                            <p className="text-[10px] text-slate-500 font-bold border-t border-slate-850 pt-1.5 leading-normal">
                              ⚠️ <strong className="text-amber-400">필수 체크 설정</strong>: 오픈채팅방 생성 시 <strong className="text-white">"카카오프렌즈 프로필만 허용" 옵션은 반드시 해제(OFF)</strong>로 설정해 주세요. 그래야 익명 고객(카카오프렌즈 프로필)과 일반 실명 프로필 고객 모두 오류 없이 상담방에 입장할 수 있습니다.
                              <br />
                              ※ 일반 개인 카톡 아이디는 인터넷 브라우저 바로가기 연결을 지원하지 않아, 반드시 오픈채팅방 주소로 등록하셔야 고객이 실시간으로 상담을 신청할 수 있습니다.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          대표 상담 이메일 (선택)
                        </label>
                        <input 
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="예: support@rebalance.com"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        />
                      </div>

                      {/* 광고심의필 번호 */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          보험대리점 광고심의필 번호 (선택 - 등록 시 하단 푸터 및 랜딩페이지에 상시 노출)
                        </label>
                        <input 
                          type="text"
                          value={editRegistrationNumber}
                          onChange={(e) => setEditRegistrationNumber(e.target.value)}
                          placeholder="예: 손해보험협회 심의필 제2026-1234호 또는 생명보험협회 심의필 제2026-5678호"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          autoComplete="off"
                        />
                      </div>

                      {/* Password */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          로그인 비밀번호 변경 *
                        </label>
                        {/* Dummy inputs to prevent Chrome autofill */}
                        <input type="text" name="chrome_autofill_prevent_un" style={{ display: 'none' }} />
                        <input type="password" name="chrome_autofill_prevent_pw" style={{ display: 'none' }} />
                        <input 
                          type="password"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          placeholder="대시보드 로그인 시 사용할 비밀번호를 입력하세요"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          autoComplete="new-password"
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
                          placeholder="예: 더윤컴퍼니 강남지점"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>

                      {/* 지점 주소 */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          지점 주소 (필수)
                        </label>
                        <input 
                          type="text"
                          value={editCustomAddress}
                          onChange={(e) => setEditCustomAddress(e.target.value)}
                          placeholder="예: 서울시 강남구 테헤란로 123"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                          required
                        />
                      </div>

                      {/* 인증 문구 */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                          인증 문구 (선택 - 기입 시 하단 푸터 및 랜딩페이지에 상시 노출)
                        </label>
                        <input 
                          type="text"
                          value={editCertificationMessage}
                          onChange={(e) => setEditCertificationMessage(e.target.value)}
                          placeholder="예: 더윤컴퍼니 공식 인증 설계사"
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-xs text-white font-bold"
                        />
                      </div>

                    </div>
                  </div>

                  {/* 실시간 푸시 알림 설정 카드 */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-amber-500" />
                    <div className="pl-4 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded text-[9px] font-black uppercase">
                          PUSH NOTIFICATION
                        </span>
                        <h4 className="font-extrabold text-sm text-white">신규 고객(리드) 실시간 푸시 알림 설정</h4>
                      </div>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed break-keep">
                        고객이 대표님 전용 랜딩페이지에서 진단 신청을 완료하면, **0.1초 만에 스마트폰 및 브라우저 백그라운드로 즉시 푸시 알림이 발송**됩니다. PC 브라우저와 PWA가 지원되는 모바일 환경에서 모두 실시간 수신이 가능합니다.
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-850">
                        <div className="flex items-center gap-3">
                          {pushStatus === 'registered' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
                              <div>
                                <span className="text-xs font-black text-white block">실시간 알림 수신 상태: ON</span>
                                <span className="text-[10px] text-slate-500 font-bold block">이 기기로 신규 리드 실시간 팝업 및 진동 알림이 도착합니다.</span>
                              </div>
                            </>
                          )}
                          {pushStatus === 'granted' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-pulse" />
                              <div>
                                <span className="text-xs font-black text-white block">알림 권한은 허용되었으나 수신 미설정 상태</span>
                                <span className="text-[10px] text-slate-500 font-bold block">아래 [활성화] 버튼을 클릭하면 수신이 완료됩니다.</span>
                              </div>
                            </>
                          )}
                          {(pushStatus === 'default' || pushStatus === 'loading') && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-slate-600 animate-pulse" />
                              <div>
                                <span className="text-xs font-black text-slate-350 block">알림 수신 비활성화 상태</span>
                                <span className="text-[10px] text-slate-500 font-bold block">신규 리드를 놓치지 않으려면 실시간 푸시 알림을 활성화하세요.</span>
                              </div>
                            </>
                          )}
                          {pushStatus === 'denied' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
                              <div>
                                <span className="text-xs font-black text-red-400 block">알림 권한 차단됨</span>
                                <span className="text-[10px] text-slate-500 font-bold block">브라우저의 사이트 설정에서 알림 권한을 [허용]으로 재설정해야 합니다.</span>
                              </div>
                            </>
                          )}
                          {pushStatus === 'unsupported' && (
                            <>
                              <span className="w-3.5 h-3.5 rounded-full bg-red-650" />
                              <div>
                                <span className="text-xs font-black text-slate-400 block">미지원 환경</span>
                                <span className="text-[10px] text-slate-500 font-bold block">이 브라우저 혹은 앱에서는 웹 푸시 알림 기능이 작동하지 않습니다.</span>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {(pushStatus === 'default' || pushStatus === 'granted') && (
                            <button
                              type="button"
                              onClick={handleSubscribePush}
                              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl cursor-pointer transition-all shadow-md active:scale-95"
                            >
                              🔔 실시간 알림 활성화
                            </button>
                          )}
                          {pushStatus === 'registered' && (
                            <>
                              <button
                                type="button"
                                onClick={handleSendTestPush}
                                disabled={isTestPushSending}
                                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-black text-xs rounded-xl cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                              >
                                🚀 {isTestPushSending ? '전송 중...' : '알림 수신 테스트 전송'}
                              </button>
                              <button
                                type="button"
                                onClick={handleSubscribePush}
                                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 font-black text-xs rounded-xl cursor-pointer transition-all border border-slate-800 active:scale-95"
                              >
                                기기 갱신
                              </button>
                            </>
                          )}
                        </div>
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
                <div key="playbook" className="active-tab-fade-slide space-y-6">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 실전 마케팅 비법서</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "📚 설계사분들의 온라인 비대면 영업 성과를 높이기 위한 실전 DB 추출 노하우, 네이버 블로그 마케팅 세팅 가이드, 카톡 상담 템플릿 등 실무 교육 자료를 제공합니다."
                        </p>
                      </div>
                    </div>
                  )}
                  <div className={`transition-all duration-300 ${
                    showHelpGuide ? 'help-guide-glow p-4 rounded-[2rem] bg-slate-900/10' : ''
                  }`}>
                    <MarketingPlaybookTab 
                      isSuperAdmin={currentUser.role === 'super'} 
                      showHelpGuide={showHelpGuide} 
                      onToggleHelpGuide={handleToggleHelpGuide}
                    />
                  </div>
                </div>
              )}

              {/* Tab 8: Ad Campaign Agency Request */}
              {activeTab === 'ad_campaign' && (
                <div key="ad_campaign" className="active-tab-fade-slide space-y-6">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 광고 대행 요청</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "📢 매달 적은 예산으로도 타겟팅 광고를 집행해 실시간 유입 리드를 확보할 수 있도록, 본사 마케팅 전문가가 직접 세팅하는 네이버/인스타그램 광고 대행 서비스 신청 영역입니다."
                        </p>
                      </div>
                    </div>
                  )}
                  <div className={`transition-all duration-300 ${
                    showHelpGuide ? 'help-guide-glow p-4 rounded-[2rem] bg-slate-900/10' : ''
                  }`}>
                    <AdCampaignTab 
                      currentUser={currentUser as any} 
                      isSuperAdmin={currentUser.role === 'super'} 
                      showHelpGuide={showHelpGuide}
                      onToggleHelpGuide={handleToggleHelpGuide}
                    />
                  </div>
                </div>
              )}

              {/* Tab 9: Real-time Communication Hub */}
              {activeTab === 'chat' && (
                <div key="chat" className="active-tab-fade-slide space-y-6">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 실시간 헬프데스크</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "💬 플랫폼 이용 방법, 보험료 비교 업데이트 문의, 또는 대리점 개별 맞춤 기능 건의 등 본사 관리자 및 지원팀과 1:1로 실시간 소통하는 창구입니다."
                        </p>
                      </div>
                    </div>
                  )}
                  <div className={`transition-all duration-300 ${
                    showHelpGuide ? 'help-guide-glow p-4 rounded-[2rem] bg-slate-900/10' : ''
                  }`}>
                    <ChatTab 
                      currentUser={currentUser} 
                      showHelpGuide={showHelpGuide} 
                      onToggleHelpGuide={handleToggleHelpGuide}
                    />
                  </div>
                </div>
              )}

              {/* Tab 10: Compliance/Deliberation Guide */}
              {activeTab === 'compliance' && (
                <div key="compliance" className="active-tab-fade-slide space-y-6">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 광고 심의 가이드</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "📜 설계사가 개별적으로 준법 감시 및 광고 심의필 번호를 신속하게 등록하고 안전하게 홍보할 수 있는 단계별 인포그래픽 매뉴얼입니다."
                        </p>
                      </div>
                    </div>
                  )}
                  <ComplianceGuideTab 
                    plannerCode={currentUser.plannerCode || 'test'} 
                    onGoToProfile={() => setActiveTab('profile')}
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
                    const isSupport = selectedLead.insurance_type === 'support_consult';
                    const isPrecision = selectedLead.insurance_type?.includes('remodeling');
                    const badge = getInsuranceTypeName(selectedLead.insurance_type || '');
                    return (
                      <>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                          isSupport
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : isPrecision 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {isSupport ? '고객센터 문의 📞' : isPrecision ? '내보험 정밀분석 🔍' : '실시간 가격비교 📊'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${badge.bgClass} ${badge.textClass}`}>
                          {badge.label}
                        </span>
                      </>
                    );
                  })()}
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {selectedLead.insurance_type === 'support_consult'
                    ? `${selectedLead.name} 고객 1:1 고객센터 문의 내역`
                    : `${selectedLead.name} 고객 진단 결과 리포트`
                  }
                </h3>
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
                  <p className="font-extrabold text-slate-300">
                    이름: {selectedLead.status === 'verified' || (selectedLead.name && selectedLead.name !== '익명고객' && selectedLead.name !== '무명고객' && selectedLead.name !== '고객')
                      ? selectedLead.name 
                      : '🔒 미인증 고객'}
                  </p>
                  <p className="font-extrabold text-slate-300">연령: {selectedLead.age || '미기입'}세</p>
                  <p className="font-extrabold text-slate-300">
                    연락처: {selectedLead.status === 'verified' || (selectedLead.phone && selectedLead.phone !== '010-0000-0000' && selectedLead.phone !== '')
                      ? selectedLead.phone 
                      : '🔒 미인증 번호'}
                  </p>
                  <p className="font-extrabold text-slate-300">성별: {selectedLead.raw_payload?.gender === 'M' ? '남성' : selectedLead.raw_payload?.gender === 'F' ? '여성' : '미확인'}</p>
                  {(() => {
                    const utmSource = selectedLead.raw_payload?.utm_source;
                    const badge = getUtmSourceBadge(utmSource);
                    return (
                      <p className="font-extrabold text-slate-300 flex items-center gap-1.5 mt-1">
                        유입 경로: <span className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-black tracking-tight ${badge.bgClass}`}>{badge.label}</span>
                      </p>
                    );
                  })()}
                  <p className="font-extrabold text-slate-355 mt-1.5 pt-1.5 border-t border-slate-900/50 flex items-center gap-1">
                    ⏱️ 비교 분석: <span className="text-orange-400">{new Date(selectedLead.created_at).toLocaleString('ko-KR')}</span>
                  </p>
                  {selectedLead.raw_payload?.simulation_code && (
                    <p className="font-extrabold text-slate-300 mt-1.5 pt-1.5 border-t border-slate-900/50 flex items-center gap-1.5">
                      🔑 설계 코드: <span className="text-orange-400 select-all font-black bg-orange-500/5 px-1.5 py-0.5 rounded border border-orange-500/10 uppercase tracking-wider">{selectedLead.raw_payload.simulation_code}</span>
                    </p>
                  )}
                  {selectedLead.raw_payload?.simulation_code && selectedLead.status !== 'verified' && (
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/verify?code=${selectedLead.raw_payload?.simulation_code}`;
                        navigator.clipboard.writeText(shareUrl);
                        alert("🔑 고객 안심인증 링크가 클립보드에 복사되었습니다!\n카카오톡 1:1 상담방에 붙여넣어 고객에게 전송해 주세요.\n\n링크: " + shareUrl);
                      }}
                      className="mt-3 w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-[10.5px] rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-orange-500/20"
                    >
                      🔑 안심인증 링크 복사
                    </button>
                  )}
                  {(() => {
                    const isConsult = isLeadConsult(selectedLead.insurance_type);
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
                        const isCopied = selectedLead.raw_payload?.copied_by_planner === true;
                        return (
                          <div className={`mt-2.5 p-3 rounded-xl text-[9.5px] font-extrabold leading-relaxed break-keep border transition-all ${
                            isCopied
                              ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                              : 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.15)]'
                          }`}>
                            ⚠️ [카톡채팅요청 안내 가이드] 본 고객은 <span className="text-white bg-yellow-600 px-1 py-0.5 rounded">카톡 익명 상담</span> 조건으로 신청하신 고객입니다. 무단으로 먼저 유선 전화를 거는 행위는 금지되어 있으니, <span className="text-yellow-300 underline font-black">반드시 오픈채팅방에서 코드를 수신한 후 아래 인증 링크를 전달</span>하여 본인인증을 진행하도록 유도해 주세요.
                          </div>
                        );
                      }
                      return (
                        <div className="mt-2.5 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[9.5px] text-emerald-400 font-extrabold leading-normal break-keep">
                          ⚠️ [정식상담요청 안내 가이드] 본 고객은 본인인증을 완료하고 정식 상담을 요청한 상태입니다. 확보된 연락처를 통해 신속하게 상담을 진행해 주세요.
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-900">
                  {(() => {
                    const isConsult = isLeadConsult(selectedLead.insurance_type);
                    const isUnderwriting = selectedLead.insurance_type?.includes('_underwriting');
                    if (isConsult || isUnderwriting) {
                      const consultType = selectedLead.raw_payload?.consult_type;
                      if (consultType === 'anonymous') {
                        return (
                          <button
                            onClick={async () => {
                              const simCode = selectedLead.raw_payload?.simulation_code || '';
                              const origin = window.location.origin;
                              const msg = `안녕하세요! 보험리밸런스 대리점입니다. 고객님의 설계서 잠금 해제를 위한 본인인증 전용 링크입니다. 아래 링크를 눌러 간편인증을 완료하시면 0.1초 만에 마스킹이 해제됩니다.\n▶ 인증 링크: ${origin}/verify?code=${simCode}`;
                              navigator.clipboard.writeText(msg);
                              setToastMessage("✨ 카톡 인증 문구가 복사되었습니다! 카톡창에 붙여넣기(Ctrl+V) 하세요.");
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 3000);

                              // Stop flashing via DB update
                              try {
                                const supabase = createClient();
                                const updatedPayload = {
                                  ...(selectedLead.raw_payload || {}),
                                  copied_by_planner: true,
                                  timeline: [
                                    {
                                      id: `copy-${Date.now()}`,
                                      type: 'system_log',
                                      author: '설계사',
                                      detail: '설계사가 카톡 인증 안내 문구를 복사하여 전달했습니다.',
                                      created_at: new Date().toISOString()
                                    },
                                    ...(selectedLead.raw_payload?.timeline || [])
                                  ]
                                };
                                await supabase
                                  .from('customer_leads')
                                  .update({ raw_payload: updatedPayload })
                                  .eq('id', selectedLead.id);
                              } catch (err) {
                                console.error(err);
                              }

                              // Update local state for immediate 0.1s responsiveness
                              setLeads(prev => prev.map(l => {
                                if (l.id === selectedLead.id) {
                                  return {
                                    ...l,
                                    raw_payload: {
                                      ...(l.raw_payload || {}),
                                      copied_by_planner: true
                                    }
                                  };
                                }
                                return l;
                              }));

                              setSelectedLead(prev => prev ? {
                                ...prev,
                                raw_payload: {
                                  ...(prev.raw_payload || {}),
                                  copied_by_planner: true
                                }
                              } : null);
                            }}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-slate-950 text-[12px] font-extrabold py-3.5 px-5 rounded-2xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/35 border border-yellow-300 active:scale-98"
                          >
                            💬 카톡 인증문구 복사
                          </button>
                        );
                      }
                      const isVerified = selectedLead.status === 'verified' || (selectedLead.phone && selectedLead.phone !== '010-0000-0000');
                      if (!isVerified) {
                        return (
                          <div className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-center text-[10.5px] font-bold text-slate-400">
                            🔒 미인증 고객입니다. 먼저 카톡 상담방에 안심인증 링크를 전송해 주세요.
                          </div>
                        );
                      }
                      
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
              {selectedLead.insurance_type === 'support_consult' ? (
                <>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <span className="text-slate-500 block font-bold mb-1">소속 / 회사명</span>
                    <p className="font-black text-lg text-emerald-400 truncate">
                      {selectedLead.analysis_result?.company || selectedLead.raw_payload?.company || '개인'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">
                      작성자가 입력한 소속 정보
                    </p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <span className="text-slate-500 block font-bold mb-1">회신 이메일</span>
                    <p className="font-black text-sm text-orange-400 truncate select-all mt-1">
                      {selectedLead.analysis_result?.email || selectedLead.raw_payload?.email || '미입력'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">
                      답변을 보낼 회신 주소
                    </p>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* 고객센터 문의 본문 내용 표시 */}
            {selectedLead.insurance_type === 'support_consult' && (
              <div className="space-y-4 bg-slate-950 p-6 rounded-[1.5rem] border border-slate-850 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">문의 유형 / 제목</span>
                  <h4 className="font-extrabold text-sm text-white">
                    [{selectedLead.analysis_result?.subject || selectedLead.raw_payload?.subject || '일반 문의'}]
                  </h4>
                </div>
                <div className="w-full h-px bg-slate-900" />
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">상세 문의 내용</span>
                  <div className="text-xs text-slate-350 font-semibold leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-850/60 whitespace-pre-wrap break-all min-h-[120px]">
                    {selectedLead.analysis_result?.message || selectedLead.raw_payload?.message || '문의 내용이 존재하지 않습니다.'}
                  </div>
                </div>
              </div>
            )}

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
            {(selectedLead.insurance_type?.endsWith('_underwriting') || 
              selectedLead.raw_payload?.underwriting || 
              selectedLead.analysis_result?.underwriting || 
              selectedLead.analysis_result?.underwriting_questions) && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-white border-l-3 border-orange-500 pl-2">🔍 과거 병력 사전 심사 고지 내역</h4>
                <div className="bg-slate-950/80 border border-slate-850 rounded-2xl p-5 text-xs font-semibold text-slate-300 space-y-4">
                  {(() => {
                    const underwriting = selectedLead.raw_payload?.underwriting || 
                                         selectedLead.analysis_result?.underwriting || 
                                         selectedLead.analysis_result?.underwriting_questions;
                                         
                    const questions = Array.isArray(underwriting) ? underwriting : (
                      (underwriting?.uwQ1 !== undefined || underwriting?.uwQ2 !== undefined || underwriting?.uwQ3 !== undefined || underwriting?.uwQ4 !== undefined || underwriting?.uwQ5 !== undefined || underwriting?.uwNone !== undefined) 
                      ? [
                        { question: "최근 3개월 이내 추가 검사(재검사) 필요 소견", answer: underwriting?.uwQ1 ? "있음 ⚠️" : "없음 ✓" },
                        { question: "최근 3개월 이내 질병의심소견, 치료, 입원, 수술 처방", answer: underwriting?.uwQ2 ? "있음 ⚠️" : "없음 ✓" },
                        { question: "최근 5년 이내 계속하여 7일 이상 치료 이력", answer: underwriting?.uwQ3 ? "있음 ⚠️" : "없음 ✓" },
                        { question: "최근 5년 이내 계속하여 30일 이상 약 복용(투약) 이력", answer: underwriting?.uwQ4 ? "있음 ⚠️" : "없음 ✓" },
                        { question: "최근 5년 이내 8대 중대질병 진단/치료/입원/수술 이력", answer: underwriting?.uwQ5 ? "있음 ⚠️" : "없음 ✓" },
                        { question: "해당 사항 없음 (건강함)", answer: underwriting?.uwNone ? "해당됨 ✓" : "해당없음" }
                      ]
                      : [
                        { question: "최근 5년 이내 수술 이력", answer: underwriting?.hasSurgery ? "있음 ⚠️" : "없음 ✓" },
                        { question: "최근 5년 이내 입원 이력", answer: underwriting?.hasHospitalization ? "있음 ⚠️" : "없음 ✓" },
                        { question: "최근 3개월 이내 의사 처방 및 약 복용 이력", answer: underwriting?.hasMedication ? "있음 ⚠️" : "없음 ✓" }
                      ]
                    );
                    
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

              const reservedKeys = ['gender', 'jobClass', 'age', 'name', 'phone', 'birthDate', 'selectedCategory', 'isDirect', 'plannerId', '_remodelingCoverage', 'policies', 'timeline', 'memos', 'underwriting'];
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
                    <span className="text-white">
                      {currentUser.role === 'agency' 
                        ? `대리점 단체 플랜 (${billingTier === 'basic' ? 'Basic' : billingTier === 'pro' ? 'Pro' : 'Enterprise'})` 
                        : '개인 설계사 독립 플랜'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">연장 기간</span>
                    <span className="text-white">+ 30 일</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-2">
                    <span className="text-slate-500">공급가액</span>
                    <span className="text-slate-300 font-extrabold">
                      {currentUser.role === 'agency' 
                        ? (billingTier === 'basic' 
                            ? '500,000 원' 
                            : billingTier === 'pro' 
                              ? '1,000,000 원' 
                              : '5,000,000 원')
                        : '50,000 원'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">부가세 (10%)</span>
                    <span className="text-slate-300 font-extrabold">
                      {currentUser.role === 'agency' 
                        ? (billingTier === 'basic' 
                            ? '50,000 원' 
                            : billingTier === 'pro' 
                              ? '100,000 원' 
                              : '500,000 원')
                        : '5,000 원'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-2 text-sm">
                    <span className="text-slate-500">총 결제금액 (부가세 포함)</span>
                    <span className="text-orange-400 font-black">
                      {currentUser.role === 'agency' 
                        ? (billingTier === 'basic' 
                            ? '550,000 원' 
                            : billingTier === 'pro' 
                              ? '1,100,000 원' 
                              : '5,500,000 원')
                        : '55,000 원'}
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
                    총 결제금액 **{currentUser.role === 'agency' ? (billingTier === 'basic' ? '550,000원' : billingTier === 'pro' ? '1,100,000원' : '5,500,000원') : '55,000원'} (부가세 10% 포함)**의 가상 카드 승인이 완료되었으며, 구독 기간이 **성공적으로 30일 연장**되었습니다. <br />
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

      {showToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* 하이픈 연동 모달 — 리모델링 리드 열람 시 설계사가 실행 */}
      <HyphenAuthModal
        isOpen={showAdminHyphen}
        onClose={() => { setShowAdminHyphen(false); setAdminHyphenLead(null); }}
        onSuccess={handleAdminHyphenSuccess}
        initialData={{
          userName: adminHyphenLead?.name || '고객',
          gender: (adminHyphenLead?.raw_payload?.analysisInputs?.gender as 'M' | 'F') || 'M',
          birth: adminHyphenLead?.raw_payload?.analysisInputs?.birth || '',
          mobileNo: adminHyphenLead?.phone || '',
          age: adminHyphenLead?.age || 40,
        }}
      />

    </div>
  );
}
