import React from 'react';
import { 
  ArrowUpRight, ShieldCheck, HeartHandshake, Zap, ChevronRight, Award, Sparkles, User, Building, Layers, Brain, Scale, Users
} from 'lucide-react';

interface PartnerLandingProps {
  onNavigate: (view: 'admin' | 'home', options?: { tab?: 'login' | 'register' }) => void;
}

export function PartnerLanding({ onNavigate }: PartnerLandingProps) {
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
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="text-xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent tracking-tight">
                INSUREBALANCE
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
                <span>지금 신청하시면 <b>30일(1달)간 전 기능 100% 무료 체험</b> 가능합니다.</span>
              </div>
            </div>
          </div>
        </div>

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
                className="group relative overflow-hidden bg-slate-900/60 border border-slate-800 hover:border-orange-500/40 rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-[0_12px_30px_rgba(249,115,22,0.08)] flex flex-col justify-between min-h-[240px]"
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
                className="group relative overflow-hidden bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-[0_12px_30px_rgba(124,58,237,0.08)] flex flex-col justify-between min-h-[240px]"
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
                className="group relative overflow-hidden bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 text-left transition-all duration-300 hover:shadow-[0_12px_30px_rgba(16,185,129,0.08)] flex flex-col justify-between min-h-[240px]"
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
            타 서비스들처럼 고객 리드(DB)를 플랫폼이 수집해 타인에게 분배하거나 공유하지 않고, 설계사 본인이 100% 영구적으로 독점 소유합니다. 
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
                가입과 동시에 설계사 본인의 프로필이 탑재된 <span className="text-orange-300">독립 모바일 개인 홈페이지가 생성</span>되며, 플랫폼 종속 없이 개인이 독립 소유하여 운영하는 27종 분석 엔진을 가집니다. 확보된 가망 데이터(DB)는 제3자 공유 없이 <span className="text-orange-300">본인의 대시보드에만 100% 영구 저장되어 독점 마케팅 자산</span>으로 활용됩니다.
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
                  <span>국내 생보·손보사 상품 전수 비교 및 마스킹 공시문으로 <b>100% 신뢰 기반 계약 체결</b></span>
                </li>
              </ul>
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

        {/* 3. 확실한 ROI(투자 수익률) 계산기 또는 가격 혜택 강조 */}
        <div className="max-w-[1300px] mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto text-center space-y-8">
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
            
            {/* ROI Flow Container */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center justify-center p-6 rounded-3xl bg-slate-950/45 border border-slate-900/80">
              {/* Step 1 */}
              <div className="p-4 space-y-2">
                <span className="text-xs font-bold text-slate-500">STEP 1. 초기 도입 비용</span>
                <div className="text-2xl font-black text-white">0원</div>
                <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">30일 전기능 무료체험</span>
              </div>
              
              <div className="hidden md:block text-slate-700 text-lg">➜</div>
              
              {/* Step 2 */}
              <div className="p-4 space-y-2">
                <span className="text-xs font-bold text-slate-500">STEP 2. 단 1건 계약 성공 시</span>
                <div className="text-2xl font-black text-white">+150만 원↑</div>
                <span className="text-[10px] font-medium text-slate-400">평균 신계약 건당 수수료 기준</span>
              </div>
              
              <div className="hidden md:block text-slate-700 text-lg">➜</div>
              
              {/* Step 3 */}
              <div className="p-4 space-y-2 md:col-span-2">
                <span className="text-xs font-bold text-slate-500">STEP 3. 투자 대비 기대 수익률 (ROI)</span>
                <div className="text-3xl font-black text-orange-400 animate-pulse">최소 15배 이상↑</div>
                <span className="text-[9px] font-semibold text-slate-400 break-keep">잃을 것은 전혀 없고, 평생 소유할 나만의 독점 고객 DB 자산만 쌓입니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. 실제 필드 설계사들의 성공 사례 (Social Proof) */}
        <div className="max-w-[1300px] mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black tracking-widest uppercase">
                <Users className="w-3 h-3 text-orange-400" />
                <span>파트너 리얼 인터뷰</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">실제 현장 설계사님들의 도입 후기</h3>
              <p className="text-slate-400 text-xs font-semibold">INSUREBALANCE 플랫폼을 통해 성공적인 디지털 전환을 이뤄낸 실제 파트너들의 인터뷰입니다.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 후기 1 */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-left space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 text-orange-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded">개인 플래너</span>
                </div>
                <p className="text-xs md:text-sm font-semibold text-slate-300 leading-relaxed break-keep italic">
                  "가망 고객에게 카카오톡으로 저만의 비교진단 링크 하나 공유했을 뿐인데, 저녁 식사하던 중에 부족 보장 계약 요청 피드백이 와서 정말 소름 돋았습니다. 제안서 뽑는 시간 아끼고 실적은 2배로 늘었습니다."
                </p>
                <div className="text-[10px] font-bold text-slate-500">
                  3년 차 이OO 설계사 (GA 소속)
                </div>
              </div>

              {/* 후기 2 */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-left space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 text-orange-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">GA 지점장</span>
                </div>
                <p className="text-xs md:text-sm font-semibold text-slate-300 leading-relaxed break-keep italic">
                  "지점 설계사 25명에게 이 영업 시스템을 전부 지급하고 도입시켰더니, 첫 달 지점 전체 매출(수수료)이 240% 이상 폭발적으로 뛰어올랐습니다. 신입 교육 및 가망고객 터치 도구로 이만한 게 없네요."
                </p>
                <div className="text-[10px] font-bold text-slate-500">
                  12년 차 GA 지점장 박OO (GA 대리점 운영)
                </div>
              </div>
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
