import React from 'react';
import { 
  ArrowUpRight, ShieldCheck, HeartHandshake, Zap, ChevronRight, Award, Sparkles, User, Building, Layers, Brain, Scale, Users
} from 'lucide-react';
import MobileShowcase from './MobileShowcase';
import AnalysisShowcase from './AnalysisShowcase';

interface PartnerLandingProps {
  onNavigate: (view: 'admin' | 'home', options?: { tab?: 'login' | 'register' }) => void;
}

export function PartnerLanding({ onNavigate }: PartnerLandingProps) {
  const testimonials = [
    {
      stars: 5,
      tag: '개인 플래너',
      author: '3년 차 이OO 설계사 (GA 소속)',
      text: '가망 고객에게 카카오톡으로 저만의 비교진단 링크 하나 공유했을 뿐인데, 저녁 식사하던 중에 부족 보장 계약 요청 피드백이 와서 정말 소름 돋았습니다. 제안서 뽑는 시간 아끼고 실적은 2배로 늘었습니다.'
    },
    {
      stars: 5,
      tag: 'GA 지점장',
      author: '12년 차 GA 지점장 박OO (GA 대리점 운영)',
      text: '지점 설계사 25명에게 이 영업 시스템을 전부 지급하고 도입시켰더니, 첫 달 지점 전체 매출(수수료)이 240% 이상 폭발적으로 뛰어올랐습니다. 신입 교육 및 가망고객 터치 도구로 이만한 게 없네요.'
    },
    {
      stars: 5,
      tag: '개인 플래너',
      author: '8년 차 김OO 설계사 (대형 생보사 소속)',
      text: '가족이나 지인한테 아쉬운 소리하며 부탁하는 영업은 이제 끝났습니다. 고객이 먼저 자기 보험 분석해달라고 카톡을 먼저 보내오니 영업이 너무 즐겁습니다.'
    },
    {
      stars: 5,
      tag: '개인 플래너',
      author: '5년 차 최OO 설계사 (손보 전문)',
      text: '고객이 진단 기기 누르자마자 0.1초 만에 스마트폰 진동 울리면서 분석 정보 날아오네요. 이 골든타임 덕분에 지난달 계약 체결률 300% 올렸습니다.'
    },
    {
      stars: 5,
      tag: '개인 플래너',
      author: '1년 차 신입 설계사 정OO (GA 소속)',
      text: '설계사 개인 전용 홈페이지가 가입 즉시 1초 만에 생성되는 걸 보고 충격 받았습니다. 명함 대신 프로필이랑 비교진단 엔진 달린 사이트 주소를 보내니 고객이 프로로 봅니다.'
    },
    {
      stars: 5,
      tag: '개인 플래너',
      author: '15년 차 베테랑 설계사 한OO (원수사 소속)',
      text: '금소법 규정 때문에 블로그나 SNS 영업할 때 심의 리스크가 제일 큰 고민이었는데, 이 앱은 비인증 고객한테 상품명/보험사명이 자동 마스킹되니까 리스크 ZERO입니다.'
    },
    {
      stars: 5,
      tag: '개인 플래너',
      author: '6년 차 임OO 설계사 (대형 GA 소속)',
      text: '원래 보장분석 한 번 하려면 약속 잡고 종이 서류 받아서 입력하느라 3시간 넘게 걸렸는데, 이제 고객이 모바일로 2분 만에 끝내니까 일의 능률이 다릅니다.'
    },
    {
      stars: 5,
      tag: 'GA 지점장',
      author: '10년 차 지점장 윤OO (보험 대리점 운영)',
      text: '설계사들의 실시간 상담 요청률과 고객 유입 추이를 대시보드로 실시간 확인하니까 지점 통제가 쉬워졌습니다. 대리점 전용 기능들이 정말 탄탄합니다.'
    },
    {
      stars: 5,
      tag: '개인 플래너',
      author: '4년 차 강OO 설계사 (재무설계사)',
      text: '고객이 가입한 27개 카테고리 보험료를 실시간 계산하고 담보별로 동적 스마트 폼이 움직이니까, 상담 중에 버벅거릴 일이 전혀 없습니다.'
    },
    {
      stars: 5,
      tag: '개인 플래너',
      author: '7년 차 송OO 설계사 (리밸런싱 전문가)',
      text: '보장은 동일하지만 보험료는 더 저렴한 상품, 혹은 동일 보험료 대비 보장이 더 큰 전수 매칭 결과를 제안서로 즉시 받으니 고객 거절 핑계가 사라집니다.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-orange-500 selection:text-white pb-24">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] animate-pulse duration-5000" />
      </div>

      {/* Main Container */}
      <div className="w-full mx-auto pt-12 lg:pt-20 space-y-16">
        
        {/* Navigation / Header Area */}
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="flex justify-between items-center pb-6 border-b border-slate-900">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <img src="/6397187-1.png" alt="보험리밸런스" className="h-10 md:h-12 w-auto object-contain" />
              <span className="text-lg md:text-xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                보험리밸런스
              </span>
              <span className="text-[10px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded">
                B2B PARTNER
              </span>
            </div>
            <button 
              onClick={() => onNavigate('admin')}
              className="text-xs font-extrabold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800/80 transition-all"
            >
              기존 회원 로그인
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto pt-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>첫 달 무료 체험 혜택 제공 중</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black leading-tight break-keep">
              0.1초 AI 진단 플랫폼으로<br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-violet-500 bg-clip-text text-transparent">
                설계사님의 계약률을 300%
              </span> 올리세요.
            </h1>
            <p className="text-slate-400 text-sm lg:text-base font-semibold leading-relaxed max-w-2xl mx-auto break-keep">
              복잡한 대면 보장진단 설명은 이제 끝입니다. 설계사 전용 링크로 고객에게 모바일 보장진단을 선사하고, 
              가입한 고객 리드와 계약 분석을 실시간 어드민으로 편리하게 관리하세요.
            </p>

            <div className="flex justify-center pt-2">
              <div className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500/25 via-amber-500/15 to-violet-600/25 border border-orange-500/35 text-orange-300 font-extrabold text-sm shadow-[0_4px_20px_rgba(249,115,22,0.15)] backdrop-blur-sm animate-pulse">
                <Zap className="w-4.5 h-4.5 text-orange-400 animate-spin duration-3000" />
                <span>지금 신청하시면 <b>30일(1달)간 전 기능 무료 체험</b> 가능합니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* High-Fidelity Simulator */}
        <MobileShowcase />

        {/* High-Fidelity Desktop Simulator */}
        <AnalysisShowcase />

        {/* Dual Demonstration Cards (B2C & B2B Experience) */}
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="space-y-4">
            <div className="text-left">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-400" />
                <span>실시간 플랫폼 체험 공간</span>
              </h2>
              <p className="text-slate-500 text-xs font-medium">소비자 화면과 역할별 관리자 대시보드를 즉시 1초 만에 체험해 보세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: B2C Client Diagnosis Demo */}
              <a 
                href="/?planner=test" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-slate-900/40 via-slate-950/60 to-orange-500/5 border border-slate-800/80 hover:border-orange-500/40 rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-[0_12px_30px_rgba(249,115,22,0.08)] flex flex-col justify-between min-h-[240px]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest">Client View</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-orange-400 transition-colors">고객용 비교 진단 화면</h3>
                  <p className="text-slate-450 text-xs font-semibold leading-relaxed break-keep">
                    설계사 고유 링크로 가입한 고객이 마주하게 될 실시간 보장진단 뷰입니다. 27개 주요 보험 카테고리의 AI 지표 분석 및 마스킹된 법적 공시문이 표시됩니다.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-orange-400">
                  <span>진단기 즉시 체험하기</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>

              {/* Card 2: B2B Admin Planner Demo */}
              <a 
                href="/admin?demo=planner" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-slate-900/40 via-slate-950/60 to-violet-500/5 border border-slate-800/80 hover:border-violet-500/40 rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-[0_12px_30px_rgba(124,58,237,0.08)] flex flex-col justify-between min-h-[240px]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-violet-400 bg-violet-600/10 px-2 py-0.5 rounded border border-violet-600/20 uppercase tracking-widest">Planner View</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-violet-400 transition-colors flex items-center gap-1.5">
                    <User className="w-4.5 h-4.5 text-violet-400" />
                    <span>개인 설계사용 어드민 체험</span>
                  </h3>
                  <p className="text-slate-455 text-xs font-semibold leading-relaxed break-keep">
                    나만의 전용 0.1초 AI 진단 페이지 링크 생성, 카카오톡 상담 연동 및 실시간 독점 고객 리드(DB) 관리 대시보드를 즉시 1초 만에 로그인하여 테스트해 봅니다.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-violet-400">
                  <span>1초 로그인 체험하기</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>

              {/* Card 3: B2B Admin Agency Demo */}
              <a 
                href="/admin?demo=agency" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-br from-slate-900/40 via-slate-950/60 to-emerald-500/5 border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)] flex flex-col justify-between min-h-[240px]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500" />
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">Agency View</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <Building className="w-4.5 h-4.5 text-emerald-400" />
                    <span>대리점(GA) 대표용 뷰 체험</span>
                  </h3>
                  <p className="text-slate-455 text-xs font-semibold leading-relaxed break-keep">
                    소속 설계사 등록 현황, 실시간 정원 게이지 바(Gauge Bar), DB 자동 배분(Auto-Routing) 설정 및 대리점 통계를 종합적으로 1초 자동 로그인하여 체험해 봅니다.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-emerald-400">
                  <span>1초 로그인 체험하기</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* 중간 구분 및 독보적 인프라 설명 영역 (Plain Text Version) */}
        <div className="max-w-[1300px] mx-auto px-4 py-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>Only for insurebalance partners</span>
          </div>
          
          <h2 className="text-xl md:text-3xl font-black text-white leading-tight break-keep">
            기존 보험 비교 서비스를 뛰어넘는 독보적 기술력,<br className="hidden sm:inline" />
            국내 유일의 <span className="bg-gradient-to-r from-orange-400 via-orange-450 to-amber-400 bg-clip-text text-transparent">0.1초 독립형 AI 영업 인프라</span>
          </h2>
          
          <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed max-w-4xl mx-auto break-keep">
            타 서비스들처럼 고객 리드(DB)를 플랫폼이 수집해 타인에게 분배하거나 공유하지 않고, 설계사 본인이 영구적으로 독점 소유합니다. 
            고객이 진단하는 즉시 0.1초 만에 스마트폰 알림으로 분석 결과가 전송되며, 터치 한 번으로 카카오톡 1:1 상담까지 원스톱으로 연결되어 계약 성공률을 압도적으로 끌어올립니다.
          </p>
        </div>

        {/* Feature Highlights Section (Wider max-w-[1600px] for desktop 4-column display) */}
        <div className="max-w-[1600px] mx-auto px-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
            {/* Card 1: 설계사 개인 전용 홈페이지 및 비교진단 엔진 1초만에 생성 */}
            <div className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 hover:from-slate-900/95 hover:to-slate-950/95 border border-slate-800/80 hover:border-orange-500/30 rounded-3xl space-y-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55),_0_1px_0_rgba(255,255,255,0.05)_inset] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all">
                  <Building className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/5 px-2.5 py-0.5 rounded-lg border border-orange-500/10">독점 인프라</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-800/80">영업 자동화</span>
                </div>
              </div>
              <h4 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">설계사 개인 전용 홈페이지 및 비교엔진 1초만에 생성</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed break-keep">
                가입과 동시에 설계사 본인의 프로필이 탑재된 <span className="text-orange-300">독립 모바일 개인 홈페이지가 생성</span>되며, 플랫폼 종속 없이 개인이 독립 소유하여 운영하는 27종 분석 엔진을 가집니다. 확보된 가망 데이터(DB)는 제3자 공유 없이 <span className="text-orange-300">본인의 대시보드에만 영구 저장되어 독점 마케팅 자산</span>으로 활용됩니다.
              </p>
            </div>

            {/* Card 2: 국내 전(Full) 생명보험·손해보험사 상품 1초만에 비교 */}
            <div className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 hover:from-slate-900/95 hover:to-slate-950/95 border border-slate-800/80 hover:border-orange-500/30 rounded-3xl space-y-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55),_0_1px_0_rgba(255,255,255,0.05)_inset] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all">
                  <Layers className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/5 px-2.5 py-0.5 rounded-lg border border-orange-500/10">전사 비교</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-800/80">1초 완성</span>
                </div>
              </div>
              <h4 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">국내 전(全) 생명보험·손해보험사 상품 1초만에 비교</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed break-keep">
                삼성생명, 한화생명 등 주요 생명보험사와 현대해상, 메리츠화재 등 전 손해보험사의 모든 핵심 상품을 <span className="text-orange-300">단 1초 만에 비교하고 분석</span>합니다. 특정 보험사에 치우치지 않고 국내 모든 보험 상품의 보험료 및 담보 데이터를 실시간 대조하여 고객에게 최적의 맞춤 설계를 제시합니다.
              </p>
            </div>

            {/* Card 3: 내 보험 정밀 분석 전사 상품 1:1 매칭 & 0.1초 초정밀 최적화 엔진 */}
            <div className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 hover:from-slate-900/95 hover:to-slate-950/95 border border-slate-800/80 hover:border-orange-500/30 rounded-3xl space-y-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55),_0_1px_0_rgba(255,255,255,0.05)_inset] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all">
                  <Scale className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/5 px-2.5 py-0.5 rounded-lg border border-orange-500/10">1:1 정밀 매칭</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-800/80">0.1초 최적화</span>
                </div>
              </div>
              <h4 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">내 보험 정밀 분석 전사 상품 1:1 매칭 & 0.1초 초정밀 최적화 엔진</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed break-keep">
                고객의 기존 보험을 분석하는 즉시, 국내 모든 생명·손해보험사의 최신 상품 데이터베이스와 1:1로 실시간 대조합니다. <span className="text-orange-300">보장은 완벽히 동일하지만 보험료는 더 저렴한 상품</span>, 또는 <span className="text-orange-300">동일한 보험료 기준 보장 범위와 가입금액이 훨씬 유리한 상품</span>을 단 0.1초 만에 비교 분석하여 제안서 형태로 즉시 제공합니다.
              </p>
            </div>

            {/* Card 4: 27종 종합 보험 실시간 비교진단 엔진 & 동적 입력 기술 & 실시간 계산 엔진 */}
            <div className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 hover:from-slate-900/95 hover:to-slate-950/95 border border-slate-800/80 hover:border-orange-500/30 rounded-3xl space-y-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55),_0_1px_0_rgba(255,255,255,0.05)_inset] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all">
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/5 px-2.5 py-0.5 rounded-lg border border-orange-500/10">국내 최초</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-800/80">동적 UI</span>
                </div>
              </div>
              <h4 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">27종 실시간 비교진단 엔진 & 동적 스마트 폼 & 실시간 계산 엔진</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed break-keep">
                암·뇌·심장 3대 질환부터 치매, 간병, 펫, 태아보험까지 27개 주요 카테고리의 실시간 비교분석 엔진을 탑재했습니다. 특히 <span className="text-orange-300">고객이 선택한 보험 카테고리에 따라 입력 필드가 실시간으로 자동 변경</span>되는 스마트 동적 폼을 적용해 실시간 계산, 복잡함을 없애고 고객 이탈을 원천 차단합니다.
              </p>
            </div>

            {/* Card 5: 0.1초 AI 보장 분석 & 연령별 통계 리밸런싱 */}
            <div className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 hover:from-slate-900/95 hover:to-slate-950/95 border border-slate-800/80 hover:border-orange-500/30 rounded-3xl space-y-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55),_0_1px_0_rgba(255,255,255,0.05)_inset] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all">
                  <Brain className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/5 px-2.5 py-0.5 rounded-lg border border-orange-500/10">AI 빅데이터</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-800/80">연령 통계</span>
                </div>
              </div>
              <h4 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">0.1초 AI 보장 분석 & 연령별 통계 리밸런싱</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed break-keep">
                고객의 기존 보험 가입 상태를 AI 빅데이터가 즉시 진단하여 <span className="text-orange-300">과보장 항목과 부족한 담보의 장단점을 명확하게 분석</span>해 줍니다. 또한, 해당 고객과 동일한 나이대 및 성별의 <span className="text-orange-300">실제 가입 통계 데이터를 비교 지표로 함께 제시</span>해 줌으로써 고객의 심리적 장벽을 허물고 계약 체결율을 극대화합니다.
              </p>
            </div>

            {/* Card 6: 금소법 심의 리스크 ZERO 마스킹 기술 */}
            <div className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 hover:from-slate-900/95 hover:to-slate-950/95 border border-slate-800/80 hover:border-orange-500/30 rounded-3xl space-y-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55),_0_1px_0_rgba(255,255,255,0.05)_inset] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all">
                  <ShieldCheck className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/5 px-2.5 py-0.5 rounded-lg border border-orange-500/10">법적 안전</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-800/80">마스킹 모드</span>
                </div>
              </div>
              <h4 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">금소법 심의 리스크 ZERO 마스킹 기술</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed break-keep">
                금융소비자보호법 광고 규정을 완벽 준수합니다. 비인증 대중에게 비교화면 노출 시 <span className="text-orange-300">실시간으로 보험사명 및 상품명을 자동 마스킹 블라인드 처리</span>하여, 까다로운 개별 심의 없이 즉시 배포할 수 있는 국내 유일의 합법적 비교 시스템입니다.
              </p>
            </div>

            {/* Card 7: GA 대리점 전용 조직 관리 및 실시간 영업 통계 시스템 */}
            <div className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 hover:from-slate-900/95 hover:to-slate-950/95 border border-slate-800/80 hover:border-orange-500/30 rounded-3xl space-y-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55),_0_1px_0_rgba(255,255,255,0.05)_inset] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all">
                  <Users className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/5 px-2.5 py-0.5 rounded-lg border border-orange-500/10">조직 관리</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-800/80">실시간 대시보드</span>
                </div>
              </div>
              <h4 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">GA 대리점 전용 조직 관리 및 실시간 영업 통계 시스템</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed break-keep">
                대리점(GA) 관리자를 위해 소속 설계사들의 활동 상태, 진단 건수, 고객 유입 현황 및 리드 분배를 한눈에 모니터링할 수 있는 <span className="text-orange-300">GA 관리자 전용 대시보드가 제공</span>됩니다. 실시간 영업 통계와 인프라 통제를 통해 조직 전체의 가동률과 생산성을 체계적으로 관리할 수 있습니다.
              </p>
            </div>

            {/* Card 8: 실시간 리드 프로파일링 & 1:1 직통 매칭 */}
            <div className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 hover:from-slate-900/95 hover:to-slate-950/95 border border-slate-800/80 hover:border-orange-500/30 rounded-3xl space-y-4 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.55),_0_1px_0_rgba(255,255,255,0.05)_inset] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all">
                  <HeartHandshake className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-500/5 px-2.5 py-0.5 rounded-lg border border-orange-500/10">계약 300%↑</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-slate-800/80">실시간 알림</span>
                </div>
              </div>
              <h4 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">실시간 리드 프로파일링 & 1:1 직통 매칭</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed break-keep">
                고객이 진단 기기를 이용하는 순간 성별, 연령, 상세 보장 점수가 <span className="text-orange-300">0.1초 만에 설계사 스마트폰 푸시 알림으로 전송</span>됩니다. 진단 분석이 종료되는 시점에 설계사 카카오톡 1:1 다이렉트 상담 버튼을 터치 한 번으로 즉시 연동시켜 이탈 없이 즉시 상담 계약으로 직결됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 1. [기존 대면 영업 vs AI 영업] Before & After 대조표 */}
        <div className="max-w-[1300px] mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black tracking-widest uppercase">
              <Layers className="w-3 h-3 text-orange-400" />
              <span>영업 방식 비교</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">기존 영업 방식과 무엇이 다른가요?</h3>
            <p className="text-slate-400 text-xs font-semibold">비효율적인 영업 관행을 탈피하고, 실시간 반응형 AI 비교 솔루션으로 압도적인 성과를 만들어내세요.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 기존 영업 (Before) */}
            <div className="p-8 rounded-3xl bg-slate-950/45 border border-slate-900 text-left space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <span className="text-red-550 font-black text-sm">✗</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-400">기존 대면 영업 방식</h4>
              </div>
              
              <ul className="space-y-4 text-xs font-semibold text-slate-500">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>매달 유료 가망고객 DB 구매비용으로 <b>50~100만 원 상당 고정 지출</b></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>모르는 번호 수신 거부 및 전화 연결 성공 시에도 <b>거절률 90% 이상</b></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>고객 맞춤 분석 및 수많은 종이 제안서 준비·인쇄에만 <b>매번 3시간 소모</b></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>특정 보험사 상품에 치우친 권유라는 고객의 불신과 의심으로 <b>계약 이탈 빈번</b></span>
                </li>
              </ul>
            </div>

            {/* 도입 후 (After) */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 via-slate-900/40 to-slate-950/80 border border-orange-500/30 hover:border-orange-500/40 transition-all duration-300 text-left space-y-6 relative overflow-hidden shadow-[0_10px_35px_rgba(249,115,22,0.05)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </div>
                <h4 className="text-base font-extrabold text-white">INSUREBALANCE AI 영업 인프라</h4>
              </div>
              
              <ul className="space-y-4 text-xs font-semibold text-slate-350">
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-400 mt-0.5">✓</span>
                  <span>나만의 고유 진단 링크 배포로 <b>고객이 먼저 자발적으로 분석 신청 (DB 비용 0원)</b></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-400 mt-0.5">✓</span>
                  <span>고객 진단과 동시에 성별·연령·주요 보장 데이터가 <b>0.1초 만에 폰 푸시 알림 전송</b></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-400 mt-0.5">✓</span>
                  <span>고객 이탈 전 터치 한 번으로 <b>카카오톡 1:1 다이렉트 실시간 상담 즉시 연결</b></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-orange-400 mt-0.5">✓</span>
                  <span>국내 생보·손보사 상품 전수 비교 및 마스킹 공시문으로 <b>신뢰 기반 계약 체결</b></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 눈으로 확인하는 AI 영업 자동화 프로세스 */}
        <div className="max-w-[1600px] mx-auto px-4 py-12">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-orange-400" />
              <span>AI 영업 프로세스 시각화</span>
            </div>
            <h3 className="text-xl md:text-3xl font-black text-white">눈으로 확인하는 AI 영업 자동화 프로세스</h3>
            <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-2xl mx-auto">
              고객이 진단 기기를 사용하는 순간부터 1:1 상담까지, 모든 과정이 실시간으로 자동 연동됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1400px] mx-auto">
            {/* Card 1: B2C Kakao Push & 1:1 Consultation */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900/40 via-slate-950/60 to-orange-500/5 border border-slate-800/80 space-y-6 text-left relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest">
                    1. 실시간 카톡 알림 및 즉시 연결
                  </span>
                  <span className="text-slate-500 text-xs font-semibold">고객 진단과 동시에 휴대폰 진동 알림</span>
                </div>

                {/* Kakao notification mockup */}
                <div className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 backdrop-blur-sm shadow-xl max-w-md mx-auto space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-slate-800/50 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FFE812] flex items-center justify-center text-[#3C1E1E] font-black text-xs shadow-md">
                        talk
                      </div>
                      <span className="text-white font-extrabold text-xs">카카오톡 알림톡</span>
                    </div>
                    <span className="text-slate-500 text-[10px] font-semibold">지금</span>
                  </div>
                  
                  <div className="space-y-2 text-xs leading-relaxed text-slate-300 font-semibold break-keep">
                    <p className="text-amber-400 font-bold">[보험리밸런스 AI 영업비서]</p>
                    <p className="text-white font-extrabold">김*우 고객님 (34세/남)</p>
                    <p>이 설계사님의 개인 보장분석 링크를 통해 <span className="text-orange-400 font-bold">[실손 및 3대 진단비 분석]</span>을 완료했습니다!</p>
                    
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/50 space-y-1">
                      <p className="text-red-400 font-bold flex items-center gap-1">
                        <span>🚨</span> 주요 결손 보장 요약
                      </p>
                      <ul className="text-slate-400 space-y-0.5 pl-1">
                        <li>• 뇌혈관 질환 진단비 (-2,000만원 부족)</li>
                        <li>• 암 치료 수술비 (-1,000만원 부족)</li>
                      </ul>
                    </div>
                  </div>

                  {/* 즉시 1:1 상담 연결하기 (0.1초 연동) Button */}
                  <button className="w-full py-3 rounded-xl bg-[#FFE812] text-[#3C1E1E] font-black text-xs hover:bg-[#FEE500] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(255,232,18,0.25)] relative overflow-hidden group">
                    <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                    <span>즉시 1:1 상담 연결하기 (0.1초 연동)</span>
                  </button>
                </div>
              </div>

              {/* Descriptions */}
              <div className="pt-4 border-t border-slate-800/50 space-y-2.5 text-xs text-slate-400 font-semibold leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-orange-400">⚡</span>
                  <span><b>개인 고유 링크:</b> 카톡 프로필, 블로그 등에 배포하여 비대면 DB 수집</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-orange-400">⚡</span>
                  <span><b>실시간 알림:</b> 분석이 끝나는 즉시 상세 결손 데이터가 모바일 알림 전송</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-orange-400">⚡</span>
                  <span><b>다이렉트 연결:</b> 터치 한 번으로 고객과의 1:1 카톡 채팅방이 바로 개설</span>
                </p>
              </div>
            </div>

            {/* Card 2: AI Report Mockup */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900/40 via-slate-950/60 to-violet-500/5 border border-slate-800/80 space-y-6 text-left relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-violet-400 bg-violet-600/10 px-2.5 py-0.5 rounded border border-violet-600/20 uppercase tracking-widest">
                    2. 고객용 0.1초 모바일 AI 진단서
                  </span>
                  <span className="text-slate-500 text-xs font-semibold">계약 체결을 유도하는 직관적 브리핑 화면</span>
                </div>

                {/* AI report summary mockup */}
                <div className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 backdrop-blur-sm shadow-xl max-w-md mx-auto space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800/50 pb-3">
                    <span className="text-white font-extrabold text-xs flex items-center gap-1.5">
                      <span>📊</span> 암보험 보장분석 결과
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">단일 상품 진단</span>
                  </div>

                  {/* Score gauge and stats */}
                  <div className="flex items-center justify-around py-2">
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-slate-800/80">
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent" 
                        style={{ animation: 'spin 3s linear infinite' }}
                      />
                      <div className="text-center">
                        <span className="text-xl font-black text-white">60점</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-extrabold">보완 필요</span>
                      <p className="text-slate-400 text-[10px] font-semibold">보장 균형이 불안정합니다</p>
                    </div>
                  </div>

                  {/* Metrics list */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50 flex justify-between items-center">
                      <span className="text-slate-400">유사암 진단</span>
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">충분</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50 flex justify-between items-center">
                      <span className="text-slate-400">일반암 진단</span>
                      <span className="text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded">부족</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50 flex justify-between items-center">
                      <span className="text-slate-400">암 수술비</span>
                      <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">위험</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/50 flex justify-between items-center">
                      <span className="text-slate-400">표적치료비</span>
                      <span className="text-slate-500 font-bold bg-slate-800 px-2 py-0.5 rounded">미가입</span>
                    </div>
                  </div>

                  {/* savings callout */}
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center text-xs text-orange-300 font-bold">
                    💡 중복 및 비효율적인 특약을 정리하면 <span className="text-orange-400 underline decoration-2 decoration-orange-400 underline-offset-2">월 3.2만 원 절감 가능!</span>
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="pt-4 border-t border-slate-800/50 space-y-2.5 text-xs text-slate-400 font-semibold leading-relaxed">
                <p className="flex items-start gap-2">
                  <span className="text-violet-400">⚡</span>
                  <span><b>상품별 보장 집중:</b> 여러 카테고리가 아닌 해당 보험 상품 한 분야에 대한 깊이 있는 분석 제공</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-violet-400">⚡</span>
                  <span><b>의심 차단:</b> 마스킹 처리된 규정 준수 안내로 신뢰 보장</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-violet-400">⚡</span>
                  <span><b>효율 극대화:</b> 클릭 몇 번만으로 과부족 분석표를 카톡 브리핑 가능</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 확실한 ROI(투자 수익률) 계산기 또는 가격 혜택 강조 */}
        <div className="max-w-[1600px] mx-auto px-4 py-12">
          <div className="max-w-[1600px] mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black tracking-widest uppercase">
                <Scale className="w-3 h-3 text-orange-400" />
                <span>수익성 및 효율성</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">어째서 단 1건의 계약만으로도 이득일까요?</h3>
              <p className="text-slate-400 text-xs font-semibold max-w-2xl mx-auto">
                초기 부담 비용은 0원입니다. 한 달 무료체험 기간 동안 이뤄질 놀라운 영업 효율을 검증해 보세요.
              </p>
            </div>
            
            {/* ROI Flow Container - Flex Row Single Line on Desktop */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950/45 border border-slate-900/80">
              {/* Step 1 */}
              <div className="flex-1 w-full p-4 space-y-2">
                <span className="text-xs font-bold text-slate-500">STEP 1. 초기 도입 비용</span>
                <div className="text-2xl font-black text-white">0원</div>
                <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">30일 전기능 무료체험</span>
              </div>
              
              <div className="hidden md:block text-slate-700 text-lg flex-shrink-0">➜</div>
              
              {/* Step 2 */}
              <div className="flex-1 w-full p-4 space-y-2">
                <span className="text-xs font-bold text-slate-500">STEP 2. 단 1건 계약 성공 시</span>
                <div className="text-2xl font-black text-white">+150만 원↑</div>
                <span className="text-[10px] font-medium text-slate-400">평균 신계약 건당 수수료 기준</span>
              </div>
              
              <div className="hidden md:block text-slate-700 text-lg flex-shrink-0">➜</div>
              
              {/* Step 3 */}
              <div className="flex-[1.5] w-full p-4 space-y-2">
                <span className="text-xs font-bold text-slate-500">STEP 3. 투자 대비 기대 수익률 (ROI)</span>
                <div className="text-3xl font-black text-orange-400 animate-pulse">최소 15배 이상↑</div>
                <span className="text-[10px] font-semibold text-slate-400 break-keep">잃을 것은 전혀 없고, 평생 소유할 나만의 독점 고객 DB 자산만 쌓입니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* DB 보안 및 영구 소유권 안심 보장 배너 */}
        <div className="max-w-[1300px] mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto rounded-3xl p-8 bg-slate-950/45 border border-slate-900 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Left Shield Icon */}
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/5">
              <ShieldCheck className="w-7 h-7 text-orange-400" />
            </div>
            
            {/* Right Text Content */}
            <div className="space-y-3 text-left flex-1">
              <div className="inline-flex items-center gap-1.5 text-orange-400 text-[10px] font-black tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span>소유권 & 보안 안심 보장</span>
              </div>
              <h4 className="text-lg md:text-xl font-black text-white">
                설계사님이 유치한 DB는 설계사님만의 영구적 독점 자산입니다.
              </h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed break-keep">
                보험리밸런스는 설계사님의 영업권을 존중합니다. 고객이 진단 정보 및 연락처 등 모든 가망고객 DB는 <span className="text-orange-450 font-black">종단간 암호화(End-to-End Encryption)</span> 기술로 완벽히 암호 처리되며, 플랫폼 본사나 타 대리점 관리자를 포함한 제3자는 절대로 데이터에 접근하거나 유출할 수 없습니다. 오직 설계사님의 고유 로그인 계정으로만 안전하게 보관 및 다운로드됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 2. '독점권 선점' 경쟁 심리 유도 (FOMO) */}
        <div className="max-w-[1300px] mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto rounded-3xl p-8 bg-slate-950/80 border border-slate-900 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-3 text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>독점 한정 수량</span>
              </div>
              <h4 className="text-lg md:text-xl font-black text-white">경쟁 설계사들이 먼저 선점하기 전에 권한을 획득하세요</h4>
              <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed break-keep">
                옆 자리의 억대 연봉 탑-플래너는 이미 스마트폰으로 실시간 리드 분석을 받아 계약을 성사시키고 있습니다. 
                내 소중한 가망 고객들이 다른 설계사가 보낸 AI 진단 링크로 먼저 넘어가기 전에, 지금 바로 나만의 독립형 인프라를 무료로 활성화하세요.
              </p>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto px-6 py-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center items-center text-center min-w-[180px]">
              <span className="text-[10px] font-bold text-slate-500">실시간 전국 라이브 링크</span>
              <span className="text-2xl font-black text-orange-400 mt-1 animate-pulse">4,812개</span>
              <span className="text-[9px] font-medium text-slate-500 mt-1">설계사 홈페이지 활성화 중</span>
            </div>
          </div>
        </div>

        {/* 4. 실제 필드 설계사들의 성공 사례 (Social Proof - Infinite Marquee Version) */}
        <div className="max-w-full mx-auto py-8 overflow-hidden relative">
          <div className="max-w-[1300px] mx-auto px-4 mb-10 text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black tracking-widest uppercase">
              <Users className="w-3 h-3 text-orange-400" />
              <span>파트너 리얼 인터뷰</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white">실제 현장 설계사님들의 도입 후기</h3>
            <p className="text-slate-400 text-xs font-semibold">INSUREBALANCE 플랫폼을 통해 성공적인 디지털 전환을 이뤄낸 실제 파트너들의 인터뷰입니다.</p>
          </div>
          
          {/* Custom style for smooth loop animation and pause-on-hover */}
          <style>{`
            @keyframes scrollTrack {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: scrollTrack 60s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* Marquee Row Container */}
          <div className="w-full relative flex overflow-hidden py-4">
            {/* Gradient overlays to fade edge sides */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-6 animate-marquee whitespace-nowrap">
              {/* Render 10 Cards duplicated once to form a seamless infinite loop */}
              {[...testimonials, ...testimonials].map((t, idx) => (
                <div 
                  key={idx} 
                  className="inline-block w-[350px] md:w-[400px] p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-left space-y-4 relative overflow-hidden flex-shrink-0 whitespace-normal"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-0.5 text-orange-400 text-sm">
                      {"★".repeat(t.stars)}
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded ${
                      t.tag === 'GA 지점장' 
                        ? 'text-emerald-400 bg-emerald-500/10' 
                        : 'text-orange-400 bg-orange-500/10'
                    }`}>
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-300 leading-relaxed break-keep min-h-[72px]">
                    "{t.text}"
                  </p>
                  <div className="text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-800/30">
                    {t.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Call-to-Action Section */}
        <div className="max-w-[1300px] mx-auto px-4">
          <div className="pt-10 border-t border-slate-900">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl font-black text-white">지금 바로 시작해 보세요</h2>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                복잡한 계약 절차 없이 0.1초 만에 개인화 진단 주소를 생성하고 영업 경쟁력을 극대화하세요.
              </p>
            </div>

            {/* Card: Subscribe for 1-Month Free Trial */}
            <div className="max-w-2xl mx-auto relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-slate-900 to-violet-600/10 border border-orange-500/30 hover:border-orange-500/50 rounded-3xl p-8 md:p-10 flex flex-col justify-between items-center text-center transition-all duration-300 shadow-[0_8px_40px_rgba(249,115,22,0.06)]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-4 max-w-lg">
                <div className="flex justify-center gap-2 items-center">
                  <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest animate-pulse">
                    Special Offer
                  </span>
                  <span className="text-[10px] font-black text-violet-400 bg-violet-600/10 px-2.5 py-0.5 rounded border border-violet-600/20 uppercase tracking-widest">
                    30 Days Free
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white">한 달 무료체험 구독 신청</h3>
                <p className="text-slate-400 text-xs md:text-sm font-semibold leading-relaxed break-keep">
                  신용카드 등록이나 번거로운 약정 없이 10초 만에 무료 계정을 발급받을 수 있습니다. 나만의 모바일 진단 웹사이트를 즉시 활성화하고 고객 영업을 자동화하세요.
                </p>
              </div>
              
              <button 
                onClick={() => onNavigate('admin', { tab: 'register' })}
                className="mt-8 w-full max-w-sm py-4 rounded-xl bg-gradient-to-r from-orange-500 to-violet-600 text-white font-black text-xs md:text-sm hover:opacity-95 transition-all text-center flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/15 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-orange-200 animate-pulse" />
                <span>30일 무료체험 신청하기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
