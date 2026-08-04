import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '../utils/supabase/client';
import { MarketingPlaybookTab } from './MarketingPlaybookTab';
import { AdCampaignTab } from './AdCampaignTab';
import { CustomerChatTab } from './CustomerChatTab';
import { InternalChatTab } from './InternalChatTab';
import { ComplianceGuideTab } from './ComplianceGuideTab';
import { LeadDistributionSimulator } from './LeadDistributionSimulator';
import { triggerWelcomeChat } from '../utils/chatHelper';
import PWAInstallCard from './PWAInstallCard';
import { registerPushSubscription, triggerTestPushNotification } from '../utils/pushNotification';
import { useB2BBranding } from '../hooks/useB2BBranding';
import { HyphenAuthModal } from './insurance/remodeling/HyphenAuthModal';
import { StandardizedCoverage } from '../types/remodeling';
import { LeadsTab } from './admin/LeadsTab';
import { PlannersTab } from './admin/PlannersTab';
import { AgenciesTab } from './admin/AgenciesTab';
import { SettingsTab } from './admin/SettingsTab';
import { BillingTab } from './admin/BillingTab';
import { MarketingTab } from './admin/MarketingTab';
import { ProfileTab } from './admin/ProfileTab';
import { useAdminState } from '../hooks/useAdminState';
import type { Agency, Planner, Lead, CreditTransaction } from '../hooks/useAdminState';
export type { Agency, Planner, Lead, CreditTransaction };

import { 
  Users, Settings, CreditCard, FileText, Plus, LogOut, CheckCircle, 
  ExternalLink, Clock, Coins, Briefcase, ShieldAlert, ChevronRight, 
  User, Check, AlertCircle, Sparkles, Building, Phone, MapPin, Copy,
  BarChart2, ShieldCheck, Download, BookOpen, MessageSquare
} from 'lucide-react';

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
        const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
        const dataUrl = isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', quality);
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
    'remodeling_consult': { label: '내보험 정밀분석 실시간 고객 상담요청 💬', bgClass: 'bg-amber-500/10 border-amber-500/25', textClass: 'text-amber-400' },
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
  const {
    currentUser, setCurrentUser,
    pushStatus, setPushStatus,
    isTestPushSending, setIsTestPushSending,
    leads, setLeads,
    expandedLeadId, setExpandedLeadId,
    planners, setPlanners,
    agencies, setAgencies,
    loading, setLoading,
    showToast, setShowToast,
    toastMessage, setToastMessage,
    activeBillingAgencyId,
    isIndependentPlanner,
    signupTab, setSignupTab,
    signupType, setSignupType,
    loginCode, setLoginCode,
    loginPassword, setLoginPassword,
    loginError, setLoginError,
    regName, setRegName,
    regPhone, setRegPhone,
    regCode, setRegCode,
    regPassword, setRegPassword,
    regGreetingTitle, setRegGreetingTitle,
    regGreetingContent, setRegGreetingContent,
    regProfileImg, setRegProfileImg,
    regKakao, setRegKakao,
    showKakaoHelp, setShowKakaoHelp,
    regCertificationMessage, setRegCertificationMessage,
    codeCheckStatus, setCodeCheckStatus,
    regAgencyName, setRegAgencyName,
    regAgencyCode, setRegAgencyCode,
    agencyCodeCheckStatus, setAgencyCodeCheckStatus,
    checkAgencyCodeAvailability,
    regAgencyPhone, setRegAgencyPhone,
    regAgencyAddress, setRegAgencyAddress,
    regLogoUrl, setRegLogoUrl,
    regRoutingType, setRegRoutingType,
    regAgencyTier, setRegAgencyTier,
    showWelcomeModal, setShowWelcomeModal,
    generatedLink, setGeneratedLink,
    invitedAgencyId, setInvitedAgencyId,
    invitedAgencyName, setInvitedAgencyName,
    activeTab, setActiveTab,
    unreadTotal, setUnreadTotal,
    unreadCustomerTotal, setUnreadCustomerTotal,
    showHelpGuide, handleToggleHelpGuide,
    showFaq, handleToggleFaq,
    visitorLogs, setVisitorLogs,
    marketingPeriod, setMarketingPeriod,
    statsSubTab, setStatsSubTab,
    leadsPeriod, setLeadsPeriod,
    leadsCategoryFilter, setLeadsCategoryFilter,
    consultCategoryFilter, setConsultCategoryFilter,
    analysisPage, setAnalysisPage,
    consultPage, setConsultPage,
    transactions, setTransactions,
    txSearch, setTxSearch,
    txTypeFilter, setTxTypeFilter,
    alertThreshold, setAlertThreshold,
    alertPhone, setAlertPhone,
    savingAlert, setSavingAlert,
    quotaSaving, setQuotaSaving,
    topupLoading, setTopupLoading,
    isKakaoGuideOpen, setIsKakaoGuideOpen,
    adminHyphenLead, setAdminHyphenLead,
    showAdminHyphen, setShowAdminHyphen,
    editKakao, setEditKakao,
    showKakaoHelpEdit, setShowKakaoHelpEdit,
    editGreetingTitle, setEditGreetingTitle,
    editGreetingContent, setEditGreetingContent,
    editProfileImg, setEditProfileImg,
    editLogoUrl, setEditLogoUrl,
    editCustomPhone, setEditCustomPhone,
    editCustomAddress, setEditCustomAddress,
    editPassword, setEditPassword,
    editCompanyName, setEditCompanyName,
    editRegistrationNumber, setEditRegistrationNumber,
    editEmail, setEditEmail,
    editCertificationMessage, setEditCertificationMessage,
    editPlannerName, setEditPlannerName,
    editAgencyCode, setEditAgencyCode,
    selectedLead, setSelectedLead,
    leadSearchTerm, setLeadSearchTerm,
    newMemoText, setNewMemoText,
    copySuccess, setCopySuccess,
    assigningLead, setAssigningLead,
    showPaymentModal, setShowPaymentModal,
    paymentProcessing, setPaymentProcessing,
    paymentSuccess, setPaymentSuccess,
    showForgotModal, setShowForgotModal,
    forgotTab, setForgotTab,
    forgotName, setForgotName,
    forgotPhone, setForgotPhone,
    forgotCode, setForgotCode,
    forgotResultCode, setForgotResultCode,
    forgotError, setForgotError,
    forgotSuccessMessage, setForgotSuccessMessage,
    smsStep, setSmsStep,
    generatedSmsCode, setGeneratedSmsCode,
    enteredSmsCode, setEnteredSmsCode,
    smsTimer, setSmsTimer,
    newPassword, setNewPassword,
    newPasswordConfirm, setNewPasswordConfirm,
    
    // Functions
    fetchUnreadTotal,
    handleSubscribePush,
    handleSendTestPush,
    handleAdminHyphenSuccess,
    handleUpdatePlannerQuota,
    handleUpdatePlannerWeight,
    handleTogglePlannerDistribution,
    getPlannerAssignmentStats,
    handleSaveAlertSettings,
    handleDownloadTxCsv,
    roiStats,
    filteredTransactions,
    handleTopupCredits,
    handleLogoUpload,
    handleProfileUpload,
    handleFindCode,
    handleSendSmsCode,
    handleVerifySmsCode,
    handleResetPassword,
    fetchData,
    getLeadTimeline,
    handleUpdateStatus,
    handleSaveMemo,
    maskPhoneNumber,
    handleCopyPhone,
    handleSendSmsTemplate,
    handleDownloadCSV,
    handleAssignPlanner,
    handleApprovePlanner,
    handleRejectPlanner,
    handleSaveProfile,
    handleUpdateRouting,
    handleRenewSubscription,
    getDaysRemaining,
    getCurrentRoutingType,
    getCurrentRoutingAlgo,
    getFilteredVisitorLogs,
    getFilteredLeads,
    getFilteredAnalysisLeads,
    getFilteredConsultLeads,
    getTodayVisitors,
    getChannelStats,
    getSalesStats,
    handleLogin,
    handleRegister,
    handleSimulateLogin,
    checkCodeAvailability
  } = useAdminState(initialTab);

  const [chatRoomIdToOpen, setChatRoomIdToOpen] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser.role === 'guest') {
      sessionStorage.removeItem('is_super_admin_authenticated');
    }
  }, [currentUser.role]);

  // 데모 쿼리 스트링 감지 및 자동 로그인/리다이렉션 연동
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demoParam = params.get('demo');
    if (demoParam) {
      const triggerAutoDemo = async () => {
        setLoading(true);
        try {
          if (demoParam === 'agency') {
            await handleLogin(undefined, 'test', '1234');
            setActiveTab('leads');
          } else if (demoParam === 'planner') {
            await handleLogin(undefined, 'test_planner', '1234');
            // 설계사 데모 접속 시 고객 실시간 상담 모니터링 탭으로 즉시 이동
            setActiveTab('customer_chat');
          }
        } catch (err) {
          console.error('[Demo Auto-Login Failed]', err);
        } finally {
          setLoading(false);
          // 주소창에서 demo 파라미터를 제거하여 뒤로가기/새로고침 시 중복 로깅 방지
          const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({ path: newUrl }, '', newUrl);
        }
      };
      triggerAutoDemo();
    }
  }, []);

  // 시뮬레이터 보안 인증 모달 관련 상태 및 로직
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simRole, setSimRole] = useState<'super' | 'agency' | 'planner' | null>(null);
  const [simPassword, setSimPassword] = useState('');
  const [simError, setSimError] = useState('');

  const handleSimulatorClick = async (role: 'super' | 'agency' | 'planner') => {
    const isSuperAuth = sessionStorage.getItem('is_super_admin_authenticated') === 'true';
    if (isSuperAuth) {
      setLoading(true);
      try {
        if (role === 'super') {
          await handleLogin(undefined, 'admin', 'rlaghddlf0411*');
        } else if (role === 'agency') {
          await handleLogin(undefined, 'test', '1234');
        } else if (role === 'planner') {
          await handleLogin(undefined, 'test_planner', '1234');
        }
      } catch (err) {
        console.error('Failed to switch roles:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    setSimRole(role);
    setSimPassword('');
    setSimError('');
    setSimModalOpen(true);
  };

  const handleVerifySimulator = async (e: React.FormEvent) => {
    e.preventDefault();
    setSimError('');

    if (simRole === 'super') {
      if (simPassword.trim() === 'rlaghddlf0411*') {
        setSimModalOpen(false);
        try {
          await handleLogin(undefined, 'admin', 'rlaghddlf0411*');
          sessionStorage.setItem('is_super_admin_authenticated', 'true');
        } catch (err: any) {
          setSimError('로그인 처리 중 오류가 발생했습니다.');
        }
      } else {
        setSimError('총관리자 비밀번호가 일치하지 않습니다.');
      }
    }
  };

  const handleDemoAccess = async () => {
    setSimModalOpen(false);
    if (simRole === 'agency') {
      await handleLogin(undefined, 'test', '1234');
    } else if (simRole === 'planner') {
      await handleLogin(undefined, 'test_planner', '1234');
    }
  };

  const handleRealLoginGuide = () => {
    setSimModalOpen(false);
    setSignupTab('login');
    setLoginCode('');
    setLoginPassword('');
    setLoginError('');
    
    setTimeout(() => {
      const container = document.getElementById('auth-card-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
        const input = container.querySelector('input');
        if (input) input.focus();
      }
    }, 100);
  };

  // B2B Billing Capacity Calculations
  const billingAgency = agencies.find(a => a.id === currentUser.agencyId);
  const billingTier = billingAgency?.subscription_tier || 'pro';
  const billingMaxLimit = billingAgency?.max_planner_limit || 50;
  const billingActivePlanners = planners.filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active').length;
  const billingCapacityPercent = Math.min(100, Math.round((billingActivePlanners / billingMaxLimit) * 100));

  let billingGaugeColor = 'from-emerald-500 to-teal-500';
  let billingTextColor = 'text-emerald-400';
  let billingBorderColor = 'border-emerald-500/20';
  let billingBgColor = 'bg-emerald-500/5';
  if (billingCapacityPercent >= 90) {
    billingGaugeColor = 'from-red-500 to-rose-600';
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
      <span>도움말 가이드 {showHelpGuide ? 'ON' : 'OFF'}</span>
    </button>
  );

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
            onClick={() => handleSimulatorClick('super')}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${currentUser.role === 'super' ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            총관리자 뷰
          </button>
          <button 
            onClick={() => handleSimulatorClick('agency')}
            className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${currentUser.role === 'agency' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            대리점주 뷰
          </button>
          <button 
            onClick={() => handleSimulatorClick('planner')}
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
              대리점과 설계사의 이름으로 즉시 생성되는 최첨단 초고속 보험 비교 엔진. 상담 현장에서 태블릿으로 0.1초 만에 보장을 진단해 신뢰를 얻고, 내 브랜드 플랫폼으로 직접 마케팅하여 자발적인 상담 신청 리드를 수집하세요. 신규 가입 시 첫 14일간 기능 제약 없이 무료 체험
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
                  🎁 신규 가입 시 첫 14일간 전 기능 무료 체험 지원 (자동 결제 없음)
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
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">설계사 이름, 프로필 사진, 연락처, 개인 인사말이 적용된 단독 주소(.../코드) 제공.</p>
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
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>초고도화 AI 세일즈 비서 & 행동 스캔 🤖</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">AI 비서가 24시간 실시간 대화, 자율 RAG 상담, 본인인증 유도 및 긍정/부정 감정·행동 점수를 실시간 자동 판독.</p>
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
                      <span className="text-2xl font-black text-white">별도 문의</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">등록 가능 인원: 최대 30명</p>
                  </div>
                  <ul className="space-y-3.5 text-[11px] text-slate-400 font-bold text-left">
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>개인 설계사 핵심 기능 8가지 전체 제공 ✨</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">소속 설계사 전원에게 개별 전용 홈페이지 및 AI 엔진 전체 개방.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>소속 설계사 최대 30명 등록 관리 👥</span></div>
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
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>소속 설계사 30명 AI 비서 라이선스 제공 🤖</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">소속 설계사 전원에게 개별 AI 세일즈 비서 및 실시간 1:1 대화방 심리 스캔 라이선스 일괄 부여.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5 text-amber-400"><Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" /> <span>설계사 채용 무기화 (Recruiting Advantage) 💎</span></div>
                      <p className="pl-5 text-[10px] text-amber-500/80 leading-normal">소속 설계사 전원에게 "고객 DB 평생 무료 수집 환경"을 지급하여 리크루팅 매력도 극대화.</p>
                    </li>
                  </ul>
                </div>

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
                      <span className="text-2xl font-black text-orange-400">월 250만 원</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-1">등록 가능 인원: 최대 50명</p>
                  </div>
                  <ul className="space-y-3.5 text-[11px] text-slate-300 font-bold text-left">
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>Basic 요금제 기능 전체 포함 ✨</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">개인 기능 8가지 및 지점 통합 관리 기능을 기본으로 탑재.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>소속 설계사 최대 50명 등록 관리 👥</span></div>
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
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>AI 골든타임 자동 판독 및 리드 회수 ⏱️</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">AI 비서가 감지한 대화 점수가 7점 진입 시 설계사 전용 알림을 전송하며, 미대응 시 리드를 타 설계사에게 즉시 자동 재배정.</p>
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
                    <p className="text-[10px] text-slate-500 font-bold mt-1">등록 가능 인원: 최대 110명</p>
                  </div>
                  <ul className="space-y-3.5 text-[11px] text-slate-400 font-bold text-left">
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>Pro 요금제 기능 전체 포함 ✨</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">자동 분배, 가중치 배정 및 리드 회수 등 최상위 라우팅 엔진 탑재.</p>
                    </li>
                    <li className="space-y-0.5">
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>소속 설계사 최대 110명 등록 관리 👥</span></div>
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
                      <div className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" /> <span>AI 대화지표 결합형 최상위 라우팅 (Performance AI) 📈</span></div>
                      <p className="pl-5 text-[10px] text-slate-500 leading-normal">AI가 학습한 대화 성공률과 설계사의 실제 실적을 종합적으로 결합하여 가장 우수한 설계사에게 고가치 리드를 최우선 자동 배정.</p>
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
                파트너 가입 / 14일 무료 신청
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
                            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md font-bold">14일 무료 혜택</span>
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
                                ? '소규모 대리점용. 설계사 최대 30명 등록 가능.' 
                                : regAgencyTier === 'pro' 
                                ? '중소형 대리점용 (추천). 설계사 최대 50명. 실시간 자동 분배 지원.' 
                                : '대형 GA 아웃소싱용. 설계사 최대 110명. 전담 기술 지원.'}
                            </p>
                          </div>
                          
                          <div className="border-t border-slate-800 pt-3 mt-4 flex items-end justify-between">
                            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md font-bold">14일 무료 혜택</span>
                            <span className="text-sm font-black text-white">
                              {regAgencyTier === 'basic' ? '별도 문의' : regAgencyTier === 'pro' ? '월 2,500,000 원' : '월 5,000,000 원'}
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

                      <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs font-bold text-slate-400 block">
                          지점 / 소속 회사 이름*
                        </label>
                        <input 
                          type="text" 
                          placeholder="예: 더윤컴퍼니 강남지점" 
                          value={regAgencyName}
                          onChange={(e) => setRegAgencyName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs font-bold text-slate-400 block">
                          대리점 고유 코드* (단축 주소용, 영문/숫자만 가능)
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="예: won-novel" 
                            value={regAgencyCode}
                            onChange={(e) => {
                              setRegAgencyCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                              setAgencyCodeCheckStatus('idle');
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                            required
                          />
                          <button 
                            type="button"
                            onClick={checkAgencyCodeAvailability}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 rounded-xl text-xs transition-all cursor-pointer shrink-0"
                          >
                            중복 검사
                          </button>
                        </div>
                        {agencyCodeCheckStatus === 'checking' && <p className="text-[10px] text-blue-400 font-bold">코드 검사 중...</p>}
                        {agencyCodeCheckStatus === 'available' && <p className="text-[10px] text-emerald-400 font-bold">✓ 사용 가능한 대리점 고유코드입니다.</p>}
                        {agencyCodeCheckStatus === 'taken' && <p className="text-[10px] text-red-400 font-bold">✗ 이미 사용 중인 대리점 코드입니다. 다른 코드를 사용해 주세요.</p>}
                      </div>
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs font-bold text-slate-400 block">
                          지점 주소*
                        </label>
                        <input 
                          type="text" 
                          placeholder="예: 서울시 서초구 서초대로 456 (인카금융서비스 소속 설계사)" 
                          value={regAgencyAddress}
                          onChange={(e) => setRegAgencyAddress(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs font-bold text-slate-400 block">
                          인증 문구 (선택 - 기입 시 하단 푸터 및 랜딩페이지에 상시 노출)
                        </label>
                        <input 
                          type="text" 
                          placeholder="예: 더윤컴퍼니 공식 인증 설계사 또는 생명/손해보험협회 심의필 번호" 
                          value={regCertificationMessage}
                          onChange={(e) => setRegCertificationMessage(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 rounded-xl py-2.5 px-4 outline-none text-sm text-white font-bold"
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

                      <div className="grid md:grid-cols-1 gap-6">
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
                                소속 설계사들이 각자의 홍보 주소(`/코드`)로 다이렉트 마케팅 광고를 진행합니다. 고객 상담 신청(DB)이 접수되면, 본사가 개입하지 않고 **해당 설계사에게 0.1초 만에 즉시 단독 배정**되어 설계 업무를 보게 됩니다.
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
                                대리점 통합 대표 링크(`/대리점ID`) 혹은 공용 광고로 고객 DB를 집중 모집합니다. 수집된 모든 리드는 **대리점 공용 대기 풀(Pool)**로 들어가며, 대리점주(관리자)가 어드민에서 특정 설계사에게 **수동 지정**하여 권한을 배분합니다.
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
                    disabled={loading || (signupTab === 'register' && codeCheckStatus === 'taken')}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center block"
                  >
                    {loading ? '신청 처리 중...' : '14일 무료 체험 신청 완료 🚀'}
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
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/Partner';
                  }}
                  className="px-5 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-slate-100 font-extrabold text-xs rounded-xl cursor-pointer transition-all text-center hover:scale-105 active:scale-95 shadow-sm"
                >
                  🏠 소개 페이지로 돌아가기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentUser({ role: 'guest' });
                    setTimeout(() => {
                      document.getElementById('auth-card-container')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl cursor-pointer transition-all shadow-md text-center hover:scale-105 active:scale-95"
                >
                  👉 체험 종료 및 정식 구독하기
                </button>
              </div>
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
                <div className="flex flex-col gap-2 w-full shrink-0">
                  {/* 고객 상담 (위젯 연동) */}
                  <button 
                    onClick={() => setActiveTab('customer_chat')}
                    className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'customer_chat' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4" />
                      <span>고객 상담 💬</span>
                    </div>
                    {unreadCustomerTotal > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                        {unreadCustomerTotal}
                      </span>
                    )}
                  </button>

                  {/* 실시간 소통 센터 (사내) */}
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className={`w-auto lg:w-full whitespace-nowrap flex-shrink-0 flex items-center justify-between px-4 py-3 rounded-xl text-left font-bold text-xs transition-all cursor-pointer ${activeTab === 'chat' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-slate-500" />
                      <span>실시간 소통 센터 💬</span>
                    </div>
                    {unreadTotal > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                        {unreadTotal}
                      </span>
                    )}
                  </button>
                </div>
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
                <LeadsTab
                  currentUser={currentUser}
                  leads={leads}
                  planners={planners}
                  agencies={agencies}
                  leadsPeriod={leadsPeriod}
                  setLeadsPeriod={setLeadsPeriod}
                  leadsCategoryFilter={leadsCategoryFilter as any}
                  setLeadsCategoryFilter={setLeadsCategoryFilter as any}
                  consultCategoryFilter={consultCategoryFilter as any}
                  setConsultCategoryFilter={setConsultCategoryFilter as any}
                  leadSearchTerm={leadSearchTerm}
                  setLeadSearchTerm={setLeadSearchTerm}
                  showHelpGuide={showHelpGuide}
                  onToggleHelpGuide={handleToggleHelpGuide}
                  analysisPage={analysisPage}
                  setAnalysisPage={setAnalysisPage}
                  consultPage={consultPage}
                  setConsultPage={setConsultPage}
                  isKakaoGuideOpen={isKakaoGuideOpen}
                  setIsKakaoGuideOpen={setIsKakaoGuideOpen}
                  expandedLeadId={expandedLeadId}
                  setExpandedLeadId={setExpandedLeadId}
                  setToastMessage={setToastMessage}
                  setShowToast={setShowToast}
                  setLeads={setLeads}
                  setSelectedLead={setSelectedLead}
                  setAssigningLead={setAssigningLead}
                  handleUpdateStatus={handleUpdateStatus}
                  setAdminHyphenLead={setAdminHyphenLead}
                  setShowAdminHyphen={setShowAdminHyphen}
                  renderHelpGuideToggle={renderHelpGuideToggle}
                  onOpenChatRoom={(roomId) => {
                    setChatRoomIdToOpen(roomId);
                    setActiveTab('customer_chat');
                  }}
                />
              )}

              {/* Tab: Planners panel */}
              {activeTab === 'planners' && (currentUser.role === 'agency' || currentUser.role === 'super') && (
                <PlannersTab
                  currentUser={currentUser}
                  planners={planners}
                  agencies={agencies}
                  showHelpGuide={showHelpGuide}
                  onToggleHelpGuide={handleToggleHelpGuide}
                  setPlanners={setPlanners}
                  renderHelpGuideToggle={renderHelpGuideToggle}
                />
              )}

              {/* Tab: Agencies panel (Super Admin only) */}
              {activeTab === 'agencies' && currentUser.role === 'super' && (
                <AgenciesTab
                  currentUser={currentUser}
                  agencies={agencies}
                  planners={planners}
                  showHelpGuide={showHelpGuide}
                  onToggleHelpGuide={handleToggleHelpGuide}
                  topupLoading={topupLoading}
                  handleTopupCredits={handleTopupCredits}
                  renderHelpGuideToggle={renderHelpGuideToggle}
                />
              )}

              {/* Tab 3: Settings panel */}
              {activeTab === 'settings' && (
                <SettingsTab
                  currentUser={currentUser}
                  agencies={agencies}
                  planners={planners}
                  leads={leads}
                  showHelpGuide={showHelpGuide}
                  onToggleHelpGuide={handleToggleHelpGuide}
                  getCurrentRoutingType={getCurrentRoutingType}
                  getCurrentRoutingAlgo={getCurrentRoutingAlgo}
                  handleUpdateRouting={handleUpdateRouting}
                  handleAssignPlanner={handleAssignPlanner}
                  getPlannerAssignmentStats={getPlannerAssignmentStats}
                  handleUpdatePlannerWeight={handleUpdatePlannerWeight}
                  handleTogglePlannerDistribution={handleTogglePlannerDistribution}
                  showFaq={showFaq}
                  setShowFaq={handleToggleFaq}
                  renderHelpGuideToggle={renderHelpGuideToggle}
                />
              )}

              {/* Tab 4: Billing panel */}
              {activeTab === 'billing' && (
                <BillingTab
                  currentUser={currentUser}
                  agencies={agencies}
                  planners={planners}
                  transactions={transactions}
                  showHelpGuide={showHelpGuide}
                  onToggleHelpGuide={handleToggleHelpGuide}
                  topupLoading={topupLoading}
                  alertThreshold={alertThreshold}
                  setAlertThreshold={setAlertThreshold}
                  alertPhone={alertPhone}
                  setAlertPhone={setAlertPhone}
                  savingAlert={savingAlert}
                  handleSaveAlertSettings={handleSaveAlertSettings}
                  handleTopupCredits={handleTopupCredits}
                  handleUpdatePlannerQuota={handleUpdatePlannerQuota}
                  handleDownloadTxCsv={handleDownloadTxCsv}
                  txSearch={txSearch}
                  setTxSearch={setTxSearch}
                  txTypeFilter={txTypeFilter}
                  setTxTypeFilter={setTxTypeFilter}
                  filteredTransactions={filteredTransactions}
                  roiStats={roiStats}
                  setShowPaymentModal={setShowPaymentModal}
                  setPaymentSuccess={setPaymentSuccess}
                  renderHelpGuideToggle={renderHelpGuideToggle}
                />
              )}

              {/* Tab 5: Marketing panel */}
              {activeTab === 'marketing' && (
                <MarketingTab
                  visitorLogs={visitorLogs}
                  leads={leads}
                  planners={planners}
                  showHelpGuide={showHelpGuide}
                  marketingPeriod={marketingPeriod}
                  setMarketingPeriod={setMarketingPeriod}
                  statsSubTab={statsSubTab}
                  setStatsSubTab={setStatsSubTab}
                  renderHelpGuideToggle={renderHelpGuideToggle}
                />
              )}

              {/* Tab 6: Profile/Landing settings */}
              {activeTab === 'profile' && (
                <ProfileTab
                  currentUser={currentUser}
                  editPlannerName={editPlannerName}
                  setEditPlannerName={setEditPlannerName}
                  editCustomPhone={editCustomPhone}
                  setEditCustomPhone={setEditCustomPhone}
                  editKakao={editKakao}
                  setEditKakao={setEditKakao}
                  showKakaoHelpEdit={showKakaoHelpEdit}
                  setShowKakaoHelpEdit={setShowKakaoHelpEdit}
                  editEmail={editEmail}
                  setEditEmail={setEditEmail}
                  editRegistrationNumber={editRegistrationNumber}
                  setEditRegistrationNumber={setEditRegistrationNumber}
                  editPassword={editPassword}
                  setEditPassword={setEditPassword}
                  editProfileImg={editProfileImg}
                  setEditProfileImg={setEditProfileImg}
                  editLogoUrl={editLogoUrl}
                  setEditLogoUrl={setEditLogoUrl}
                  editGreetingTitle={editGreetingTitle}
                  setEditGreetingTitle={setEditGreetingTitle}
                  editGreetingContent={editGreetingContent}
                  setEditGreetingContent={setEditGreetingContent}
                  editCompanyName={editCompanyName}
                  setEditCompanyName={setEditCompanyName}
                  editAgencyCode={editAgencyCode}
                  setEditAgencyCode={setEditAgencyCode}
                  agencyCodeCheckStatus={agencyCodeCheckStatus}
                  setAgencyCodeCheckStatus={setAgencyCodeCheckStatus}
                  checkAgencyCodeAvailability={checkAgencyCodeAvailability}
                  editCustomAddress={editCustomAddress}
                  setEditCustomAddress={setEditCustomAddress}
                  editCertificationMessage={editCertificationMessage}
                  setEditCertificationMessage={setEditCertificationMessage}
                  pushStatus={pushStatus}
                  isTestPushSending={isTestPushSending}
                  loading={loading}
                  handleSaveProfile={handleSaveProfile}
                  handleProfileUpload={handleProfileUpload}
                  handleLogoUpload={handleLogoUpload}
                  handleSubscribePush={handleSubscribePush}
                  handleSendTestPush={handleSendTestPush}
                  showHelpGuide={showHelpGuide}
                  renderHelpGuideToggle={renderHelpGuideToggle}
                />
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
                    <InternalChatTab 
                      currentUser={currentUser} 
                      showHelpGuide={showHelpGuide} 
                      onToggleHelpGuide={handleToggleHelpGuide}
                    />
                  </div>
                </div>
              )}

              {/* Tab 9-1: Customer Consultation */}
              {activeTab === 'customer_chat' && (
                <div key="customer_chat" className="active-tab-fade-slide space-y-6">
                  {showHelpGuide && (
                    <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                      <div className="pl-2 space-y-1">
                        <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 실시간 고객 상담</span>
                        <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                          "🤖 홈페이지에 방문한 고객들이 AI 비서와 나눈 대화를 실시간으로 모니터링하고, 언제든지 설계사가 직접 개입하여 1:1 라이브로 상담할 수 있는 창구입니다."
                        </p>
                      </div>
                    </div>
                  )}
                  <div className={`transition-all duration-300 ${
                    showHelpGuide ? 'help-guide-glow p-4 rounded-[2rem] bg-slate-900/10' : ''
                  }`}>
                    <CustomerChatTab 
                      currentUser={currentUser} 
                      showHelpGuide={showHelpGuide} 
                      onToggleHelpGuide={handleToggleHelpGuide}
                      initialRoomId={chatRoomIdToOpen}
                      onClearInitialRoomId={() => setChatRoomIdToOpen(null)}
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

            {/* Warning / Instruction Notice for Profile Setup */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs font-semibold text-amber-400 leading-relaxed break-keep text-left space-y-1">
              <p className="font-extrabold flex items-center gap-1.5">
                <span>⚠️</span> 필수: 설계사 프로필 설정 안내
              </p>
              <p className="text-[11px] text-slate-300 font-medium">
                본인의 전용 홈페이지 하단에 **올바른 대리점 정보 및 광고 심의필 번호**가 노출되고, 본인의 카카오톡/연락처로 정상 상담 연결이 진행되도록 대시보드 진입 후 **[프로필 설정]** 메뉴에서 필수 항목들을 모두 기입해 주시기 바랍니다.
              </p>
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
                            ⚠️ [실시간 고객상담요청 안내 가이드] 본 고객은 <span className="text-white bg-yellow-600 px-1 py-0.5 rounded">카톡 익명 상담</span> 조건으로 신청하신 고객입니다. 무단으로 먼저 유선 전화를 거는 행위는 금지되어 있으니, <span className="text-yellow-300 underline font-black">반드시 오픈채팅방에서 코드를 수신한 후 아래 인증 링크를 전달</span>하여 본인인증을 진행하도록 유도해 주세요.
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
                              const isRemodeling = selectedLead.insurance_type?.includes('remodeling');
                              const link = isRemodeling 
                                ? `${origin}/remodeling?code=${simCode}`
                                : `${origin}/verify?code=${simCode}`;
                              const msg = isRemodeling
                                ? `안녕하세요! 인카금융서비스 소속 설계사입니다. 고객님의 내보험 정밀분석을 위한 하이픈 연동 링크입니다. 아래 링크를 눌러 한국신용정보원 인증을 완료하시면 0.1초 만에 실제 보험 내역이 자동으로 조회됩니다.\n▶ 하이픈 연동 링크: ${link}`
                                : `안녕하세요! 인카금융서비스 소속 설계사입니다. 고객님의 설계서 잠금 해제를 위한 본인인증 전용 링크입니다. 아래 링크를 눌러 간편인증을 완료하시면 0.1초 만에 마스킹이 해제됩니다.\n▶ 인증 링크: ${link}`;
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

      {/* ── B2B SaaS 시뮬레이터 보안 인증 모달 ── */}
      {simModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 md:p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-orange-400">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-white">
                  {simRole === 'super' ? '총관리자(Super Admin) 보안 인증' : 
                   simRole === 'agency' ? '대리점주 뷰(Agency) 입장 선택' : 
                   '설계사 뷰(Planner) 입장 선택'}
                </h3>
                <p className="text-xs text-slate-400 font-bold leading-relaxed break-keep">
                  {simRole === 'super' 
                    ? '총관리자 권한의 실제 데이터 대시보드에 접근하기 위해 비밀번호를 입력해주세요.' 
                    : '가상의 체험용 데모 버전에 입장하시거나, 실제 가입한 본인의 정보로 로그인할 수 있습니다.'}
                </p>
              </div>

              {/* Form/Actions */}
              {simRole === 'super' ? (
                <form onSubmit={handleVerifySimulator} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">총관리자 비밀번호</label>
                    <input 
                      type="password" 
                      placeholder="비밀번호를 입력하세요" 
                      value={simPassword}
                      onChange={(e) => setSimPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 rounded-xl py-3 px-4 outline-none transition-all text-sm text-white font-bold text-center"
                      autoFocus
                    />
                  </div>

                  {simError && (
                    <div className="flex items-center gap-2 p-3 bg-red-950/30 border border-red-900/30 text-red-400 rounded-lg text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{simError}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setSimModalOpen(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-black py-3 rounded-xl transition-all cursor-pointer"
                    >
                      취소
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-black py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                    >
                      인증 및 로그인
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={handleDemoAccess}
                    className="w-full p-4 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/30 hover:border-orange-500/50 rounded-2xl transition-all text-left flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 font-bold text-sm">
                      ✨
                    </div>
                    <div>
                      <div className="text-xs font-black text-white group-hover:text-orange-400 transition-colors">
                        {simRole === 'agency' ? '데모 대리점주로 입장 (무료)' : '데모 설계사로 입장 (무료)'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                        가상의 테스트 데이터가 채워진 어드민 화면을 바로 둘러봅니다.
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={handleRealLoginGuide}
                    className="w-full p-4 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-2xl transition-all text-left flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0 font-bold text-sm">
                      🔒
                    </div>
                    <div>
                      <div className="text-xs font-black text-white group-hover:text-orange-400 transition-colors">
                        실제 가입한 본인 계정으로 로그인
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                        직접 가입하여 생성한 아이디와 비밀번호로 안전하게 로그인합니다.
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setSimModalOpen(false)}
                    className="w-full bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-300 text-[11px] font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
