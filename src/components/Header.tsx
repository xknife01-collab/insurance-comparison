/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, ReactNode } from 'react';
import { B2BBranding, useB2BBranding } from '../hooks/useB2BBranding';
import {
  Search, Phone, X, ChevronRight,
  Shield, Activity, Baby, Car, Wallet, HeartPulse,
  ChevronDown
} from 'lucide-react';

type ViewType =
  | 'admin' | 'home' | 'indemnity' | 'preexisting' | 'dental' | 'surgery'
  | 'cancer' | 'caregiving' | 'dementia' | 'cerebrovascular' | 'heart'
  | 'nursing' | 'child' | 'child_sick' | 'car' | 'driver' | 'pet' | 'golf' | 'fire_real' | 'property' | 'annuity' | 'whole' | 'variable' | 'legal' | 'credit' | 'health_general' | 'accident' | 'savings_general' | 'support';

interface NavItem { label: string; view: ViewType; desc?: string; }
interface NavGroup {
  groupLabel: string;
  icon: ReactNode;
  headerBg: string;
  textColor: string;
  itemHover: string;
  items: NavItem[];
}

const ALL_GROUPS: NavGroup[] = [
  {
    groupLabel: '인기 보험 전수 조사',
    icon: <HeartPulse className="w-4 h-4" />,
    headerBg: 'bg-rose-50',
    textColor: 'text-rose-600',
    itemHover: 'hover:text-rose-600',
    items: [
      { label: '의료실비', view: 'indemnity', desc: '기본적인 의료비 보장 (자기부담금 제외)' },
      { label: '치아보험', view: 'dental', desc: '임플란트/크라운' },
      { label: '유병자', view: 'preexisting', desc: '아픈 분도 가입' },
      { label: '수술/입원', view: 'surgery', desc: '수술비 반복 지급' },
      { label: '암보험', view: 'cancer', desc: '진단비 최대 1억' },
      { label: '종합건강', view: 'health_general', desc: '하나의 보험으로 빈틈없이 조립' },
    ],
  },
  {
    groupLabel: '기타 보장 자산',
    icon: <Activity className="w-4 h-4" />,
    headerBg: 'bg-blue-50',
    textColor: 'text-blue-600',
    itemHover: 'hover:text-blue-600',
    items: [
      { label: '뇌혈관', view: 'cerebrovascular', desc: '뇌질환 무제한 보장' },
      { label: '심장질환', view: 'heart', desc: '허혈성 심장 집중' },
      { label: '상해보험', view: 'accident', desc: '사고 장해 및 골절 치료 자산' },
    ],
  },
  {
    groupLabel: '간병 / 노후 케어',
    icon: <Shield className="w-4 h-4" />,
    headerBg: 'bg-purple-50',
    textColor: 'text-purple-600',
    itemHover: 'hover:text-purple-600',
    items: [
      { label: '간병 보험', view: 'caregiving', desc: '간병인 지원 및 사용일당 집중' },
      { label: '치매 간병보험', view: 'dementia', desc: '치매 진단비 및 생활자금' },
      { label: '재가/시설', view: 'nursing', desc: '국가 공인 방문 요양' },
    ],
  },
  {
    groupLabel: '태아 / 어린이 / 청소년',
    icon: <Baby className="w-4 h-4" />,
    headerBg: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    itemHover: 'hover:text-yellow-600',
    items: [
      { label: '어린이/신생아', view: 'child', desc: '태아부터 성인까지' },
      { label: '유병력자 전용', view: 'child_sick', desc: '간편 고지 가입' },
    ],
  },
  {
    groupLabel: '생활 / 운행 / 레저',
    icon: <Car className="w-4 h-4" />,
    headerBg: 'bg-orange-50',
    textColor: 'text-orange-600',
    itemHover: 'hover:text-orange-600',
    items: [
      { label: '자동차 보험', view: 'car', desc: '전사 가격 자동 비교' },
      { label: '운전자 보험', view: 'driver', desc: '벌금 및 민사 보장' },
      { label: '펫 보험', view: 'pet', desc: '우리 아이 병원비' },
      { label: '골프 / 레저', view: 'golf', desc: '취미 생활 보호' },
      { label: '주택화재', view: 'fire_real', desc: '재산 피해 보호' },
      { label: '재물종합', view: 'property', desc: '상가 화재 및 소상공인 자산 보호' },
    ],
  },
  {
    groupLabel: '저축 / 미래 / 법률',
    icon: <Wallet className="w-4 h-4" />,
    headerBg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    itemHover: 'hover:text-emerald-600',
    items: [
      { label: '연금저축', view: 'annuity', desc: '노후 자금 준비' },
      { label: '종신', view: 'whole', desc: '가격대비 최다보장' },
      { label: '변액, 정기', view: 'variable', desc: '수익형 자산 관리' },
      { label: '민사/형사', view: 'legal', desc: '법률 비용 보전' },
      { label: '일반 저축', view: 'savings_general', desc: '비과세 목돈 마련 재테크' },
      { label: '신용보험', view: 'credit', desc: '대출금 상환 안심 보장' },
    ],
  },
];

const Header = ({ setView }: { setView: (view: ViewType) => void }) => {
  const { branding, deferredPrompt, onInstallClick, isInAppBrowser, setShowInAppGuide, isIOS, isStandalone } = useB2BBranding();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchResults = searchQuery
    ? ALL_GROUPS.flatMap(g => g.items).filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const navigate = (view: ViewType) => {
    setView(view);
    setMobileOpen(false);
    setMegaOpen(false);
  };

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── 상단 바 ── */}
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0"
              onClick={() => navigate('home')}
            >
              {(branding?.type === 'organic' && (!branding?.logoUrl || branding.logoUrl === '/6397187.png')) ? (
                <>
                  <img src="/원금융.png" alt="Incar" className="h-12 w-auto object-contain" />
                  <div className="h-6 w-[1px] bg-gray-200" />
                </>
              ) : (
                branding?.logoUrl && branding.logoUrl !== "/6397187.png" && (
                  <>
                    <img src={branding.logoUrl} alt={branding.name} className="h-12 w-auto object-contain" />
                    <div className="h-6 w-[1px] bg-gray-200" />
                  </>
                )
              )}
              <img src="/6397187.png" alt="보험리밸런스" className="h-12 w-auto object-contain" />
            </div>

            <div className="hidden md:flex flex-1 max-w-sm mx-6 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchResults.length > 0) {
                      navigate(searchResults[0].view);
                      setSearchQuery('');
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm text-sm"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <button
                        key={item.view}
                        onClick={() => {
                          navigate(item.view);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-orange-50/50 active:bg-orange-50 transition-colors border-b border-gray-50 last:border-0 flex justify-between items-center group"
                      >
                        <div>
                          <span className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{item.label}</span>
                          {item.desc && <span className="text-xs text-gray-400 ml-2 font-medium">{item.desc}</span>}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors" />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-400 font-medium">
                      검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a 
                href={`tel:${branding?.customPhone || "080.808.1088"}`} 
                className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span className="font-bold text-sm">{branding?.customPhone || "080.808.1088"}</span>
              </a>
            </div>

            {/* 모바일 햄버거 */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-50"
              onClick={() => setMobileOpen(true)}
            >
              <span className="w-6 h-0.5 bg-gray-700 rounded-full" />
              <span className="w-6 h-0.5 bg-gray-700 rounded-full" />
              <span className="w-4 h-0.5 bg-gray-700 rounded-full" />
            </button>
          </div>

          {/* ── 데스크탑 Slim 네비 바 (hover → mega menu) ── */}
          <div
            className="hidden lg:flex items-center gap-1 h-11 border-t border-gray-100"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {ALL_GROUPS.map((group) => (
              <button
                key={group.groupLabel}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                  ${megaOpen
                    ? `${group.headerBg} ${group.textColor}`
                    : `text-gray-600 hover:${group.headerBg} hover:${group.textColor}`
                  }`}
              >
                <span className={megaOpen ? group.textColor : 'text-gray-400'}>{group.icon}</span>
                {group.groupLabel}
                <ChevronDown className={`w-3 h-3 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
            ))}
            <div className="flex-1" />
            <button 
              onClick={() => navigate('support')}
              className="text-xs font-bold text-gray-500 hover:text-orange-500 px-3 cursor-pointer"
            >
              고객센터
            </button>
          </div>
        </div>

        {/* ── 메가 메뉴 드롭다운 ── */}
        {megaOpen && (
          <div
            className="hidden lg:block absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-2xl z-40"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-6 gap-6">
                {ALL_GROUPS.map((group) => (
                  <div key={group.groupLabel} className="flex flex-col">
                    {/* 그룹 헤더 — 모바일과 동일한 스타일 */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3 ${group.headerBg}`}>
                      <span className={group.textColor}>{group.icon}</span>
                      <span className={`text-[11px] font-black uppercase tracking-wide ${group.textColor}`}>
                        {group.groupLabel}
                      </span>
                    </div>
                    {/* 항목 세로 1열 */}
                    <div className="flex flex-col gap-0.5">
                      {group.items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => navigate(item.view)}
                          className={`text-left px-2 py-1.5 rounded-lg group transition-all ${group.itemHover} hover:bg-gray-50`}
                        >
                          <p className={`text-sm font-bold text-gray-700 group-hover:${group.textColor.replace('text-', 'text-')} transition-colors`}>
                            {item.label}
                          </p>
                          {item.desc && (
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">{item.desc}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 메가 메뉴 하단 배너 */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400 font-bold">
                  💡 보험 전문가가 직접 분석한 <span className="text-orange-500">실시간 맞춤 비교</span>를 무료로 받아보세요.
                </p>
                <button
                  onClick={() => navigate('home')}
                  className="bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-black hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  무료 보험료 비교하기 →
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── 모바일 드로어 ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl flex flex-col overflow-y-auto">

            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                {(branding?.type === 'organic' && (!branding?.logoUrl || branding.logoUrl === '/6397187.png')) ? (
                  <>
                    <img src="/원금융.png" alt="Incar" className="h-8 w-auto object-contain" />
                    <div className="h-4 w-[1px] bg-gray-200" />
                  </>
                ) : (
                  branding?.logoUrl && branding.logoUrl !== "/6397187.png" && (
                    <>
                      <img src={branding.logoUrl} alt={branding.name} className="h-8 w-auto object-contain" />
                      <div className="h-4 w-[1px] bg-gray-200" />
                    </>
                  )
                )}
                <img src="/6397187.png" alt="보험리밸런스" className="h-8 w-auto object-contain" />
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-50 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="보험 종류를 검색하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchResults.length > 0) {
                      navigate(searchResults[0].view);
                      setSearchQuery('');
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>

              {/* Mobile Search Results */}
              {searchQuery && (
                <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <button
                        key={item.view}
                        onClick={() => {
                          navigate(item.view);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-orange-50/50 active:bg-orange-50 transition-colors border-b border-gray-50 last:border-0 flex justify-between items-center group"
                      >
                        <div>
                          <span className="text-xs font-bold text-gray-800">{item.label}</span>
                          {item.desc && <span className="text-[10px] text-gray-400 ml-2 font-medium">{item.desc}</span>}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-[10px] text-gray-400 font-bold">
                      검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 p-4 space-y-3">
              {ALL_GROUPS.map((group) => (
                <div key={group.groupLabel} className="rounded-2xl overflow-hidden border border-gray-100">
                  <div className={`flex items-center gap-2 px-4 py-3 ${group.headerBg}`}>
                    <span className={group.textColor}>{group.icon}</span>
                    <span className={`text-xs font-black uppercase tracking-wider ${group.textColor}`}>{group.groupLabel}</span>
                  </div>
                  <div className="bg-white">
                    {group.items.map((item, idx) => (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.view)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors
                          ${idx < group.items.length - 1 ? 'border-b border-gray-50' : ''}`}
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-700">{item.label}</p>
                          {item.desc && <p className="text-[10px] text-gray-400 font-bold mt-0.5">{item.desc}</p>}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
              <a 
                href={`tel:${branding?.customPhone || "080.808.1088"}`} 
                className="flex items-center gap-2 text-gray-600 justify-center hover:text-orange-500 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span className="font-bold">{branding?.customPhone || "080.808.1088"}</span>
              </a>
              {!isStandalone && (deferredPrompt || isInAppBrowser || isIOS) && (
                <button 
                  onClick={onInstallClick}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(249,115,22,0.2)]"
                >
                  📱 1초 만에 앱 설치하기
                </button>
              )}
              <button 
                onClick={() => navigate('support')}
                className="w-full bg-white border border-gray-250 text-gray-700 py-3 rounded-2xl font-black text-sm hover:bg-gray-150 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                📞 고객센터 (1:1 문의)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
