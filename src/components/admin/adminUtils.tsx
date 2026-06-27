import React from 'react';
import { Lead } from '../AdminDashboard';

export const DEFAULT_PROFILE_IMG = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80";
export const DEFAULT_LOGO_IMG = "https://images.unsplash.com/photo-1599305445671-ac291c95aba9?w=120&h=40&fit=crop&q=80";

export const isLeadConsult = (type?: string | null): boolean => {
  if (!type) return false;
  return type.endsWith('_consult') || type === 'remodeling_consult' || type.endsWith('_sms');
};

export const maskPhoneNumber = (phone?: string) => {
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

export const isInKstDateRange = (dateStr: string, rangeType: 'today' | '7days' | 'all'): boolean => {
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

export const handleDownloadCSV = (leadsToExport: Lead[], filename: string) => {
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

export const renderPagination = (
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
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              currentPage === page
                ? 'bg-orange-500 text-white shadow shadow-orange-500/10'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
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
