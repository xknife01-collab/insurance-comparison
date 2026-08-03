import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '../utils/supabase/client';
import { setMockAuthUser } from '../utils/supabase/mockClient';
import { triggerWelcomeChat } from '../utils/chatHelper';
import { registerPushSubscription, triggerTestPushNotification } from '../utils/pushNotification';
import { useB2BBranding } from './useB2BBranding';
import { StandardizedCoverage } from '../types/remodeling';
import { runAnalysis } from '../lib/analysisEngine';

export interface Agency {
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

export interface Planner {
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
  monthly_credit_used?: number;
}

export interface Lead {
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
  pos_score?: number;    // 고객 긍정 누적 점수 (0~N, 대화마다 합산)
  neg_score?: number;    // 고객 부정 누적 점수 (0~N, 대화마다 합산)
  action_score?: number; // 상담 행동 달성도 점수 (0~10, 최고 단계 갱신)
}

export interface CreditTransaction {
  id: string;
  agency_id: string;
  planner_id?: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
  planner_name?: string;
}

export const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80";
export const DEFAULT_LOGO_IMG = "https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=120&h=40&fit=crop&q=80";

export const compressImage = (file: File, maxWidth: number = 300, maxHeight: number = 300, quality: number = 0.7): Promise<string> => {
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

export const getInsuranceTypeName = (type: string) => {
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
    'remodeling_consult': { label: '내보험 정밀분석 카톡정밀설계요청 💬', bgClass: 'bg-amber-500/10 border-amber-500/25', textClass: 'text-amber-400' },
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

export const isLeadConsult = (type?: string | null): boolean => {
  if (!type) return false;
  return type.endsWith('_consult') || type === 'remodeling_consult' || type.endsWith('_sms');
};

export const getUtmSourceBadge = (utmSource?: string) => {
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

export function useAdminState(initialTab?: 'login' | 'register') {
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
    isDemo?: boolean;
  }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('insurance_admin_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved user session:", e);
        }
      }
    }
    return { role: 'guest' };
  });

  // Synchronize mock auth context with currentUser for local database RLS simulation and localStorage persistence
  useEffect(() => {
    try {
      setMockAuthUser(currentUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('insurance_admin_user', JSON.stringify(currentUser));
        if (currentUser.role === 'guest') {
          localStorage.removeItem('insurance_admin_active_tab');
        }
      }
    } catch (err) {
      console.warn('[Mock Auth Sync] Failed to sync auth context:', err);
    }
  }, [currentUser]);

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
  const [regCertificationMessage, setRegCertificationMessage] = useState('');
  const [codeCheckStatus, setCodeCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Agency Specific Inputs
  const [regAgencyName, setRegAgencyName] = useState('');
  const [regAgencyCode, setRegAgencyCode] = useState('');
  const [agencyCodeCheckStatus, setAgencyCodeCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
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
  const [activeTab, setActiveTab] = useState<'leads' | 'settings' | 'billing' | 'planners' | 'profile' | 'marketing' | 'playbook' | 'ad_campaign' | 'chat' | 'compliance' | 'customer_chat'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('insurance_admin_active_tab');
      if (saved) return saved as any;
    }
    return 'leads';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('insurance_admin_active_tab', activeTab);
    }
  }, [activeTab]);

  const [unreadTotal, setUnreadTotal] = useState(0);
  const [unreadCustomerTotal, setUnreadCustomerTotal] = useState(0);

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

  // profile editing states
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
  const [editAgencyCode, setEditAgencyCode] = useState('');
  const [editRegistrationNumber, setEditRegistrationNumber] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCertificationMessage, setEditCertificationMessage] = useState('');
  const [editPlannerName, setEditPlannerName] = useState('');

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

  // Fetch unread messages total
  const fetchUnreadTotal = useCallback(async () => {
    try {
      const currentUserId = currentUser.plannerId || currentUser.agencyId || '00000000-0000-4000-a000-000000000000';
      if (!currentUserId || currentUser.role === 'guest') return;

      const { data: memberData } = await supabase
        .from('chat_room_members')
        .select('room_id')
        .eq('user_id', currentUserId);

      if (!memberData || memberData.length === 0) {
        setUnreadTotal(0);
        setUnreadCustomerTotal(0);
        return;
      }

      const roomIds = memberData.map(m => m.room_id);

      // Fetch room details to identify customer rooms
      const { data: rooms } = await supabase
        .from('chat_rooms')
        .select('id, name')
        .in('id', roomIds);

      const customerRoomIds = (rooms || [])
        .filter(r => r.name?.startsWith('실시간 고객 상담'))
        .map(r => r.id);

      const internalRoomIds = roomIds.filter(id => !customerRoomIds.includes(id));

      const { data: unreadMsgs } = await supabase
        .from('chat_messages')
        .select('room_id')
        .in('room_id', roomIds)
        .eq('is_read', false)
        .neq('sender_id', currentUserId);

      const unreadList = unreadMsgs || [];
      const internalCount = unreadList.filter(m => internalRoomIds.includes(m.room_id)).length;
      const customerCount = unreadList.filter(m => customerRoomIds.includes(m.room_id)).length;

      setUnreadTotal(internalCount);
      setUnreadCustomerTotal(customerCount);
    } catch (err) {
      console.warn("Failed to fetch unread total:", err);
    }
  }, [currentUser.plannerId, currentUser.agencyId, currentUser.role]);

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
  }, [currentUser.plannerId, currentUser.agencyId, currentUser.role, fetchUnreadTotal]);

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

  // 어드민 하이픈 성공 핸들러 — coverage 저장 + status verified 설정
  const handleAdminHyphenSuccess = async (coverage: StandardizedCoverage, customerInfo?: { name: string; phone: string }) => {
    if (!adminHyphenLead) return;
    try {
      const supabase = createClient();
      
      const analysisInput = {
        name: customerInfo?.name || adminHyphenLead.name || '고객',
        mobile: customerInfo?.phone || adminHyphenLead.phone || '010-0000-0000',
        age: coverage.age,
        gender: coverage.gender,
        jobClass: 1,
        selectedCategory: 'remodeling',
        cancer: { currentAmount: coverage.cancer_diagnosis, targetAmount: 50000000 },
        cerebrovascular: { currentAmount: coverage.brain_vascular, targetAmount: 30000000 },
        cardiovascular: { currentAmount: coverage.ischemic_heart, targetAmount: 30000000 },
        surgery: { currentAmount: (coverage as any).surgery_amount ?? 0, targetAmount: 10000000 },
        postDisability: { currentAmount: (coverage as any).post_disability_amount ?? 0, targetAmount: 30000000 },
        paymentExemption: 'standard' as const,
        healthStatus: 'standard' as const,
        monthlyPremium: coverage.current_total_premium,
        _remodelingCoverage: coverage
      };

      const result = await runAnalysis(analysisInput);
      result.simulation_code = adminHyphenLead.raw_payload?.simulation_code || '';

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

      const updateData: any = {
        status: 'verified',
        raw_payload: updatedPayload,
        analysis_result: result,
        monthly_premium: coverage.current_total_premium || 0
      };
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

  const roiStats = useMemo(() => {
    const spentTxs = transactions.filter(t => t.amount < 0 && (t.type === 'remodeling' || t.type === 'car'));
    const totalSpentCredits = spentTxs.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalCostKRW = totalSpentCredits; // 1 credit = 1 KRW

    const totalLeads = leads.length;
    const completedLeads = leads.filter(l => l.status === '완료' || l.status === 'success' || l.status === 'completed').length;
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
      
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedSmsCode(randomCode);
      setSmsTimer(180); // 3 minutes
      setSmsStep('verify');
      
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
          subscriptionStatus: 'active',
          isDemo: false
        });
      } else if (role === 'agency') {
        let agency = null;
        let repPlanner = null;
        try {
          if (currentUser.agencyId) {
            const { data } = await supabase.from('agencies').select().eq('id', currentUser.agencyId).maybeSingle();
            agency = data;
          }
          if (!agency) {
            const { data: testAgencies } = await supabase.from('agencies').select().limit(1);
            agency = testAgencies?.[0];
          }
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
            expiresAt: agency.subscription_expires_at || new Date(Date.now() + 30 * 86400000).toISOString(),
            isDemo: false
          });
        } else {
          setCurrentUser({
            role: 'agency',
            plannerId: '11111111-1111-4111-a111-111111111111',
            agencyId: '88888888-8888-4888-a888-888888888888',
            agencyCode: 'demo-agency',
            name: '대리점 체험대표',
            plannerCode: 'test',
            subscriptionStatus: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isDemo: true
          });
        }
      } else if (role === 'planner') {
        let testPlanner = null;
        try {
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
          if (!testPlanner) {
            const { data } = await supabase.from('planners').select().eq('planner_code', 'test_planner').maybeSingle();
            testPlanner = data;
          }
          if (!testPlanner) {
            const { data: anyPlanners } = await supabase.from('planners').select().limit(1);
            testPlanner = anyPlanners?.[0];
          }
        } catch (e) {
          console.warn("Supabase fetch failed for planner simulation:", e);
        }

        if (testPlanner) {
          let testAgency = null;
          if (testPlanner.agency_id) {
            try {
              const { data: tag } = await supabase.from('agencies').select('*').eq('id', testPlanner.agency_id).maybeSingle();
              testAgency = tag;
            } catch (e) {
              console.warn("Failed to fetch agency for testPlanner:", e);
            }
          }
          setCurrentUser({
            role: 'planner',
            plannerId: testPlanner.id,
            agencyId: testPlanner.agency_id,
            agencyCode: testAgency?.code || testAgency?.id || undefined,
            name: testPlanner.name,
            plannerCode: testPlanner.planner_code,
            subscriptionStatus: testPlanner.subscription_status,
            expiresAt: testPlanner.subscription_expires_at || new Date(Date.now() + 30 * 86400000).toISOString(),
            isDemo: false
          });
        } else {
          setCurrentUser({
            role: 'planner',
            plannerId: '22222222-2222-4222-a222-222222222222',
            agencyId: null,
            name: '설계사 체험설계',
            plannerCode: 'test_planner',
            subscriptionStatus: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isDemo: true
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


  const checkCodeAvailability = async () => {
    if (!regCode.trim()) return;
    setCodeCheckStatus('checking');
    try {
      const { data, error } = await supabase
        .from('planners')
        .select('planner_code')
        .eq('planner_code', regCode.trim());
      
      if (error) {
        console.warn("Assuming available due to RLS/Network error:", error);
        setCodeCheckStatus('available');
        return;
      }
      
      if (data && data.length > 0) {
        setCodeCheckStatus('taken');
      } else {
        setCodeCheckStatus('available');
      }
    } catch (err) {
      console.warn("Catch block error on checkCodeAvailability:", err);
      setCodeCheckStatus('available');
    }
  };

  const checkAgencyCodeAvailability = async () => {
    if (!regAgencyCode.trim()) return;
    setAgencyCodeCheckStatus('checking');
    try {
      const SYSTEM_PATHS = ['admin', 'partner', 'verify', 'remodeling', 'demo'];
      if (SYSTEM_PATHS.includes(regAgencyCode.trim().toLowerCase())) {
        setAgencyCodeCheckStatus('taken');
        return;
      }
      
      const { data, error } = await supabase
        .from('agencies')
        .select('code')
        .eq('code', regAgencyCode.trim().toLowerCase());
      
      if (error) {
        console.warn("Assuming available due to RLS/Network error:", error);
        setAgencyCodeCheckStatus('available');
        return;
      }
      
      if (data && data.length > 0) {
        setAgencyCodeCheckStatus('taken');
      } else {
        setAgencyCodeCheckStatus('available');
      }
    } catch (err) {
      console.warn("Catch block error on checkAgencyCodeAvailability:", err);
      setAgencyCodeCheckStatus('available');
    }
  };

  const handleLogin = async (e?: React.FormEvent, codeOverride?: string, passwordOverride?: string) => {
    if (e) e.preventDefault();
    setLoginError('');
    const targetCode = (codeOverride || loginCode).trim();
    const targetPassword = (passwordOverride || loginPassword).trim();
    if (!targetCode) return;
    setLoading(true);

    if (targetCode === 'test' && targetPassword === '1234') {
      setCurrentUser({
        role: 'agency',
        plannerId: '11111111-1111-4111-a111-111111111111',
        agencyId: '88888888-8888-4888-a888-888888888888',
        agencyCode: 'demo-agency',
        name: '대리점 체험대표',
        plannerCode: 'test',
        subscriptionStatus: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isDemo: true
      });
      
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
            max_planner_limit: 50,
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
          status: 'calling',
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
          status: 'calling',
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
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isDemo: true
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
          status: 'calling',
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
      const { data: planner, error } = await supabase
        .from('planners')
        .select('*')
        .eq('planner_code', targetCode)
        .maybeSingle();

      let agency = null;
      if (!error && planner && planner.agency_id) {
        try {
          const { data: agencyData } = await supabase
            .from('agencies')
            .select('*')
            .eq('id', planner.agency_id)
            .maybeSingle();
          agency = agencyData;
        } catch (ae) {
          console.warn("Failed to fetch agency details on login:", ae);
        }
      }
      if (planner) {
        (planner as any).agencies = agency;
      }

      if (error || !planner) {
        setLoginError('등록되지 않은 설계사 고유코드입니다. 파트너 가입을 먼저 진행해 주세요.');
        setLoading(false);
        return;
      }

      if (planner.password && planner.password.trim() !== targetPassword) {
        setLoginError('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
        setLoading(false);
        return;
      }

      let userRole: 'super' | 'agency' | 'planner' = 'planner';
      if (planner.planner_code === 'admin') {
        userRole = 'super';
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('is_super_admin_authenticated', 'true');
        }
      } else if (planner.is_admin) {
        userRole = 'agency';
      }

      setCurrentUser({
        role: userRole,
        plannerId: planner.id,
        agencyId: planner.agency_id,
        agencyCode: (planner as any).agencies?.code || (planner as any).agencies?.id || undefined,
        name: planner.name,
        plannerCode: planner.planner_code,
        subscriptionStatus: planner.subscription_status,
        expiresAt: planner.subscription_expires_at,
        isDemo: false
      });

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demoType = params.get('demo');
    if (demoType && currentUser.role === 'guest') {
      if (demoType === 'super' || demoType === 'agency' || demoType === 'planner') {
        handleSimulateLogin(demoType as 'super' | 'agency' | 'planner');
      }
    }
    
    if (params.get('register') === 'true') {
      setSignupTab('register');
    }
  }, [currentUser.role]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regCode.trim()) {
      alert("필수 입력 항목을 입력해 주세요.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/register-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signupType,
          regName,
          regPhone,
          regCode,
          regPassword,
          regGreetingTitle,
          regGreetingContent,
          regProfileImg,
          regKakao,
          regCertificationMessage,
          invitedAgencyId,
          regAgencyName,
          regAgencyPhone,
          regAgencyAddress,
          regLogoUrl,
          regRoutingType,
          regAgencyTier,
          regAgencyCode
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.error || '회원가입에 실패했습니다.');
        setLoading(false);
        return;
      }

      const plannerData = result.planner;

      await triggerWelcomeChat(plannerData.id, plannerData.name);

      const personalLink = `${window.location.origin}/${plannerData.planner_code}`;
      setGeneratedLink(personalLink);
      setShowWelcomeModal(true);

      setCurrentUser({
        role: plannerData.is_admin ? 'agency' : 'planner',
        plannerId: plannerData.id,
        agencyId: plannerData.agency_id,
        agencyCode: plannerData.is_admin ? regAgencyCode : undefined,
        name: plannerData.name,
        plannerCode: plannerData.planner_code,
        subscriptionStatus: plannerData.subscription_status,
        expiresAt: plannerData.subscription_expires_at,
        isDemo: false
      });
      setActiveTab('leads');
    } catch (err: any) {
      alert("회원가입 실패: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (currentUser.role === 'guest') return;
    setLoading(true);

    try {
      let plannerQuery = supabase.from('planners').select();
      if (currentUser.role === 'agency' || currentUser.role === 'planner') {
        if (currentUser.agencyId) {
          plannerQuery = plannerQuery.eq('agency_id', currentUser.agencyId);
        } else {
          plannerQuery = plannerQuery.eq('id', currentUser.plannerId);
        }
      }
      const { data: plannerList } = await plannerQuery;

      let agencyQuery = supabase.from('agencies').select();
      if (currentUser.role === 'agency' || currentUser.role === 'planner') {
        if (currentUser.agencyId) {
          agencyQuery = agencyQuery.eq('id', currentUser.agencyId);
        } else {
          agencyQuery = agencyQuery.limit(0);
        }
      }
      const { data: agencyList } = await agencyQuery;
      
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

      if (currentUser.role === 'agency' && currentUser.agencyId) {
        const myAgency = currentAgencies.find(a => a.id === currentUser.agencyId);
        if (myAgency) {
          setAlertThreshold((myAgency as any).low_credit_alert_threshold ?? 2000);
          setAlertPhone((myAgency as any).low_credit_alert_phone ?? '');
        }
      }

      let query = supabase.from('customer_leads').select().order('created_at', { ascending: false });

      const isUserDemo = currentUser.plannerCode === 'test_planner' || currentUser.plannerCode === 'test' || currentUser.agencyId === '88888888-8888-4888-a888-888888888888' || currentUser.isDemo;
      query = query.eq('is_demo', !!isUserDemo);

      if (currentUser.role === 'planner') {
        query = query.eq('planner_id', currentUser.plannerId);
      } else if (currentUser.role === 'agency') {
        query = query.eq('agency_id', currentUser.agencyId);
      }

      const { data: leadList } = await query;
      
      if (leadList && leadList.length > 0) {
        const mappedLeads = leadList.map(lead => {
          const matchedPlanner = currentPlanners.find(p => p.id === lead.planner_id);
          return {
            ...lead,
            planner_name: matchedPlanner ? matchedPlanner.name : '미배정'
          };
        });

        setLeads(mappedLeads);
      } else {
        setLeads([]);
      }

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

          if (currentUser.agencyId) {
            const myAgency = currentAgencies.find(a => a.id === currentUser.agencyId);
            if (myAgency) {
              setEditAgencyCode(myAgency.code || myAgency.id || '');
            }
          }
        }
      }
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const getLeadTimeline = (lead: Lead) => {
    const timeline: any[] = [];

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

    return timeline.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

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

    const plannerName = currentUser.name || '인카금융서비스';
    const myProfile = planners.find(p => p.id === currentUser.plannerId);
    const kakaoUrl = myProfile?.kakao_link || '';

    const insuranceLabel = lead.insurance_type || '보험';
    let body = `안녕하세요, ${lead.name} 고객님! 인카금융서비스 소속 ${plannerName} 설계사입니다. 신청하신 ${insuranceLabel} 비교 분석 리포트가 준비되어 안내차 연락드렸습니다.`;
    
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
          const isVerified = l.status === 'verified' || !!l.raw_payload?.verified_at || (l.phone && l.phone !== '010-0000-0000' && l.phone !== '0');
          return (isConsult || isUnderwriting || isVerified) ? (l.phone || '미기입') : maskPhoneNumber(l.phone);
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
          status: 'calling',
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

  const handleApprovePlanner = async (plannerId: string) => {
    try {
      if (!currentUser.agencyId) return;

      const { count } = await supabase
        .from('planners')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', currentUser.agencyId)
        .eq('subscription_status', 'active');

      const { data: agencyData, error: agencyErr } = await supabase
        .from('agencies')
        .select('max_planner_limit, subscription_tier')
        .eq('id', currentUser.agencyId)
        .single();

      if (!agencyErr && agencyData) {
        const activeCount = count || 0;
        if (activeCount >= (agencyData.max_planner_limit || 30)) {
          alert(`[승인 실패] 대리점의 요금제(${agencyData.subscription_tier?.toUpperCase() || 'BASIC'}) 설계사 등록 한도(${agencyData.max_planner_limit || 30}명)를 초과하였습니다. 설계사를 추가하려면 대리점 요금제를 업그레이드해 주세요.`);
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

    if (currentUser.role === 'agency' && currentUser.agencyId) {
      if (!editAgencyCode || !editAgencyCode.trim()) {
        alert("대리점 고유 코드는 필수 입력 항목입니다.");
        return;
      }
      
      const cleanAgencyCode = editAgencyCode.trim().toLowerCase();
      const SYSTEM_PATHS = ['admin', 'partner', 'verify', 'remodeling', 'demo'];
      if (SYSTEM_PATHS.includes(cleanAgencyCode)) {
        alert("사용할 수 없는 대리점 코드입니다. 다른 코드를 사용해 주세요.");
        return;
      }
      
      const isDemo = currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner' || currentUser.agencyId === '88888888-8888-4888-a888-888888888888' || currentUser.isDemo;
      if (!isDemo) {
        const { data: duplicateAgencies } = await supabase
          .from('agencies')
          .select('id')
          .eq('code', cleanAgencyCode)
          .neq('id', currentUser.agencyId);
          
        if (duplicateAgencies && duplicateAgencies.length > 0) {
          alert("이미 사용 중인 대리점 코드입니다. 다른 코드를 입력해 주세요.");
          return;
        }
      }
    }

    setLoading(true);
    try {
      const updatedBranding = {
        type: currentUser.plannerCode === 'admin' 
          ? 'organic' as const 
          : (currentUser.role === 'agency' ? 'agency' as const : 'planner' as const),
        plannerId: currentUser.plannerId || null,
        agencyId: currentUser.agencyId || null,
        name: editPlannerName || currentUser.name || '',
        profileImageUrl: editProfileImg || null,
        logoUrl: editLogoUrl || null,
        greetingTitle: editGreetingTitle || null,
        greetingContent: editGreetingContent || null,
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
            name: editCompanyName,
            phone: editCustomPhone,
            address: editCustomAddress,
            logo_url: editLogoUrl,
            email: editEmail,
            code: editAgencyCode.trim().toLowerCase(),
            greeting_title: editGreetingTitle,
            greeting_content: editGreetingContent
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
        name: editCompanyName,
        phone: editCustomPhone,
        address: editCustomAddress,
        logo_url: editLogoUrl,
        email: editEmail,
        code: editAgencyCode.trim().toLowerCase(),
        greeting_title: editGreetingTitle,
        greeting_content: editGreetingContent
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
      if (resData.warning === 'missing_columns' || resData.warning === 'certification_message_missing') {
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

  const handleUpdateRouting = async (newType: string) => {
    if (!currentUser.agencyId) return;
    try {
      const isDemo = currentUser.plannerCode === 'test' || currentUser.plannerCode === 'test_planner' || currentUser.agencyId === '88888888-8888-4888-a888-888888888888' || currentUser.isDemo;
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

  const handleRenewSubscription = async () => {
    setPaymentProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

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

  const getDaysRemaining = () => {
    if (!currentUser.expiresAt) return 0;
    const diff = new Date(currentUser.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

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
    const plannerMap: Record<string, { name: string; total: number; calling: number; completed: number; revenue: number }> = {};
    
    planners.forEach(p => {
      plannerMap[p.id] = { name: p.name, total: 0, calling: 0, completed: 0, revenue: 0 };
    });
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

  return {
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
    editAgencyCode, setEditAgencyCode,
    editRegistrationNumber, setEditRegistrationNumber,
    editEmail, setEditEmail,
    editCertificationMessage, setEditCertificationMessage,
    editPlannerName, setEditPlannerName,
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
  };
}
