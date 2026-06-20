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
