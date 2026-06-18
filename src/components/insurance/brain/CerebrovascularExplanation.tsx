import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import { 
  Activity, Search, ShieldCheck, HeartPulse, ChevronRight, 
  HelpCircle, AlertCircle, RefreshCw, Award, CheckCircle2, Heart, Sparkles
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const CerebrovascularExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => {
  return (
    <div className="mt-16 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* ── 1. 프리미엄 HERO 헤더 섹션 ── */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl md:rounded-[3rem] p-5 md:p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60"></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-black uppercase tracking-[0.25em] border border-indigo-500/30">
            <HeartPulse size={14} className="text-indigo-400" /> Cerebrovascular Insurance Guide
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.15]">
            뇌혈관 골든타임을 지키는 균형 잡힌 설계<br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-300 bg-clip-text text-transparent">
              뇌혈관질환 진단비와 최신 시술비
            </span>
          </h2>
          <p className="text-indigo-200/80 font-semibold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            뇌출혈(9%)과 뇌졸중(60%)만 보장받고 계셨나요? 건강검진 뇌 MRA 촬영 시 발견 빈도가 매우 높은 뇌동맥류(I67)와 뇌경색(I63)을 포함해 전체 뇌혈관 질환(I60~I69)을 100% 빈틈없이 커버하는 가이드입니다.
          </p>
        </div>
      </div>

      {/* ── 2. 핵심 4대 지표 배너 (Summary Cards) ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: '뇌혈관질환 100% 보장',
            desc: '지주막하출혈(I60)부터 뇌경색(I63), 뇌동맥류(I67) 및 후유증(I69)까지 전체 뇌혈관 질환을 든든하게 보장.',
            tag: '넓은 보장 범위',
            tagBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            icon: <Award className="w-5 h-5 text-indigo-600" />
          },
          {
            title: '관혈 / 비관혈 매회 수술비',
            desc: '두개골 절제 개두술뿐 아니라 카테터 코일색전술, 혈전용해술 등 미세 비관혈 시술 수술비 매회 반복 지급.',
            tag: '수술비 반복 보장',
            tagBg: 'bg-sky-50 text-sky-700 border-sky-200',
            icon: <Activity className="w-5 h-5 text-sky-600" />
          },
          {
            title: '산정특례 위로 진단비',
            desc: '뇌혈관 질환으로 건강보험공단 중증질환 산정특례 대상 등록 시, 진단비 외 추가 일시금/매년 위로금 보장.',
            tag: '중증 위험 보완',
            tagBg: 'bg-purple-50 text-purple-700 border-purple-200',
            icon: <RefreshCw className="w-5 h-5 text-purple-600" />
          },
          {
            title: '뇌경색(I63) 집중 설계',
            desc: '전체 뇌혈관 질환 중 70%에 달하는 가장 빈발하는 뇌경색 진단 시 고액의 보험금 확보 필수.',
            tag: '다빈도 질환 대비',
            tagBg: 'bg-slate-50 text-slate-700 border-slate-200',
            icon: <CheckCircle2 className="w-5 h-5 text-slate-600" />
          }
        ].map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-10px_rgba(79,70,229,0.08)] transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  {card.icon}
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${card.tagBg}`}>
                  {card.tag}
                </span>
              </div>
              <h4 className="text-lg font-black text-gray-900 tracking-tight">{card.title}</h4>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. GUIDE 01: 보장 범위의 치명적인 차이 (뇌출혈 vs 뇌졸중 vs 뇌혈관질환) ── */}
      <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-gray-100 shadow-xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Search size={28} />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-black tracking-widest uppercase">Guide 01</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">뇌혈관 보장 범위 함정 피하기</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-bold max-w-md">
            과거 가입한 보험의 대부분은 뇌출혈이나 뇌졸중만 보장하여 정작 가장 빈번한 뇌경색이나 뇌동맥류 진단 시 보험금을 한 푼도 받지 못하는 공백이 존재합니다.
          </p>
        </div>

        {/* 보장 범위 테이블 비교 그리드 */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 1. 뇌출혈 */}
          <div className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6 opacity-60">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-black text-gray-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span> 뇌출혈 진단비
                </h4>
                <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">전체 질환의 9%</span>
              </div>
              <p className="text-xs text-gray-400 font-bold leading-relaxed">
                혈관이 압력을 이기지 못해 뇌 속에서 직접 터지는 경우(지주막하출혈 등)만 보장하며, 막히거나 기형으로 생긴 혈관은 제외됩니다.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-gray-400">보장 코드</p>
                <p className="text-xs font-black text-gray-500">I60, I61, I62</p>
              </div>
            </div>
            <div className="p-3 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg text-center">
              ⚠️ 뇌경색(I63), 뇌동맥류(I67) 보장 안 됨!
            </div>
          </div>

          {/* 2. 뇌졸중 */}
          <div className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6 opacity-80">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-sky-500 rounded-full"></span> 뇌졸중 진단비
                </h4>
                <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">전체 질환의 60%</span>
              </div>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                뇌출혈에 더해 혈관이 막혀 뇌 손상을 일으키는 뇌경색증(I63)까지 포괄적으로 지원하지만, 기형 혈관이나 협착증 일부는 보장하지 않습니다.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-slate-500">보장 코드</p>
                <p className="text-xs font-black text-slate-800">I60, I61, I62, I63, I65, I66</p>
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg text-center">
              ⚠️ 건강검진 단골 항목인 뇌동맥류(I67) 보장 안 됨!
            </div>
          </div>

          {/* 3. 뇌혈관질환 */}
          <div className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-indigo-100 flex flex-col justify-between space-y-6 shadow-[0_10px_30px_-5px_rgba(79,70,229,0.05)]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-black text-indigo-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-ping"></span> 뇌혈관질환 진단비
                </h4>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">전체 질환 100% 보장</span>
              </div>
              <p className="text-xs text-indigo-950 font-bold leading-relaxed">
                뇌출혈, 뇌졸중은 기본이고 건강검진에서 조기 발견되는 뇌동맥류(I67), 협착, 기타 뇌혈관 질환 및 후유증(I69)까지 든든하게 보장합니다.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-indigo-500">보장 코드</p>
                <p className="text-xs font-black text-indigo-600">I60 ~ I69 (전부 포함)</p>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg text-center">
              🛡️ 모든 뇌혈관 질환 완벽 지원 보장 개시!
            </div>
          </div>

        </div>

        {/* 뇌동맥류(I67.1) 설명 스포트라이트 */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-3xl md:rounded-[3rem] p-5 md:p-8 md:p-12 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-black text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> 건강검진 MRI 단골 진단인 '뇌동맥류(I67)'의 중요성
            </h4>
            <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-2xl">
              뇌동맥류는 뇌혈관 벽이 약해져 꽈리 모양으로 부풀어 오르는 질환입니다. 터지기 전 건강검진 MRA 촬영을 통해 발견되는 사례가 매우 많습니다. 터지기 전에는 자각 증상이 거의 없는 중증 질환이지만, **뇌혈관질환 특약이 없다면 보장 및 진단비를 전혀 받을 수 없습니다.**
            </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-indigo-100 text-center shrink-0">
            <span className="text-[10px] text-gray-400 font-bold block">뇌동맥류(I67) 보장</span>
            <span className="text-sm font-black text-indigo-600 block mt-1">🛡️ 오직 뇌혈관질환 진단비만!</span>
          </div>
        </div>
      </div>

      {/* ── 4. GUIDE 02: 최신 코일색전술 및 스텐트 삽입술 등 신의료 비침습 치료 ── */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* 비관혈 카테터 수술 기술 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-10 border border-slate-800">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 rotate-12 pointer-events-none">
            <ShieldCheck size={260} className="text-white" />
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs text-indigo-400 font-black tracking-widest">Guide 02</p>
                <h3 className="text-xl font-black text-white">최신 비침습 뇌혈관 치료</h3>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 font-semibold leading-relaxed">
              의학의 발전으로 최근에는 두개골을 직접 열어 수술하는 위험한 개두술 대신, 사타구니 혈관을 통해 뇌혈관까지 튜브를 넣어 병변을 시술하는 '비관혈식 미세 시술'이 주류를 이룹니다. 이에 발맞춰 최신 수술비 특약 설계가 필요합니다.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                { title: '뇌동맥류 코일 색전술', desc: '허벅지 대퇴동맥을 통해 미세 카테터를 뇌동맥류 꽈리 내에 삽입한 후, 백금으로 만든 얇은 코일을 채워 넣어 혈관 파열을 미연에 방지하는 시술입니다.' },
                { title: '뇌혈관 스텐트 삽입술', desc: '혈전 등으로 좁아진 뇌혈관에 그물망(스텐트)을 밀어 넣은 뒤 넓혀서 뇌경색 위험을 줄이고 정상적인 혈액 공급을 원활하게 재개시키는 시술입니다.' },
                { title: '급성 뇌경색 혈전 용해 치료비', desc: '골든타임(4.5시간) 내에 내원하여 막힌 뇌혈관을 녹이기 위해 혈전 용해 약물(t-PA 등)을 투여받을 시 정액 보조금을 즉시 지급합니다.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 text-xs font-black">{i + 1}</div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white">{tip.title}</p>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 중증 질환 산정특례 반복 보장 */}
        <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 md:p-14 border border-gray-100 shadow-xl flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <RefreshCw size={24} />
              </div>
              <div>
                <p className="text-xs text-indigo-600 font-black tracking-widest">Crucial Option</p>
                <h3 className="text-xl font-black text-gray-900">중증 뇌혈관 산정특례 위로금</h3>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              뇌졸중으로 수술을 받거나 중환자실 치료를 받게 되면 국가 건강보험에서 중증 질환 '산정특례' 환자로 등록하여 본인부담금을 5% 수준으로 경감해 줍니다. 보험사에서는 이와 연동하여 **'뇌혈관 산정특례 진단비'** 특약을 별도 제공하며, 이는 재발률이 극도로 높은 뇌질환에 대처하기 위해 매년 일정 조건 충족 시마다 계속 지급하는 고효율 담보입니다.
            </p>

            <div className="bg-indigo-50/50 p-5 md:p-6 rounded-2xl border border-indigo-100 space-y-4">
              <p className="text-sm font-black text-indigo-950">💡 산정특례 진단비의 매력</p>
              <div className="space-y-2 text-[10px] text-gray-600 font-bold">
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-indigo-100/50">
                  <span>일반 뇌혈관 진단비 특약</span>
                  <span className="text-red-500 font-black">평생 최초 1회 진단 시 지급 후 즉시 소멸</span>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-indigo-100/50">
                  <span>산정특례 진단비 특약</span>
                  <span className="text-emerald-600 font-black">매년 산정특례 등록 조건 충족 시 반복 지급 가능</span>
                </div>
              </div>
              <p className="text-[10px] text-indigo-800 font-bold leading-relaxed">
                * 뇌동맥류나 뇌경색은 한 번 치료한 이후 재발하거나 다른 부위의 혈관이 또 터지는 재발률이 약 20%로 높아, 매년 조건 충족 시 반복 리필 수령할 수 있는 보장 장치 설계가 매우 유리합니다.
              </p>
            </div>
          </div>

          <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-indigo-600 font-black mb-1">📢 전문가 분석 조언</p>
            <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
              "뇌경색 환자가 퇴원 후 2차 재발을 막기 위해 장기 뇌혈관 약제 복용을 하거나 코일 시술 후 보강 시술을 하게 될 때 진단비 1회 수령만으로는 부족합니다. 반복 지급되는 '산정특례 진단비'와 '뇌혈관 수술비(매회)' 특약의 조화를 최우선 시 하세요."
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. 국내 6대 대표 손해사 뇌혈관보험 혜택 비교 ── */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest">
            Brand Analytics
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            국내 대형 6개 손해사 뇌혈관보험 혜택 비교
          </h3>
          <p className="text-xs text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
            보험사별로 뇌혈관 협착증 인수 범위와 카테터 비관혈 수술 시 지급률 차이를 정교하게 분석한 6대사 혜택 정보입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              company: '삼성화재',
              badge: '통합 뇌질환 진단',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              highlight: '출혈/폐쇄/협착 다회별 분할 보장',
              desc: '한 번 지급받으면 소멸하는 일반 뇌혈관 특약의 한계를 넘기 위해, 출혈(I60~62), 뇌경색(I63), 협착증(I65~66), 기타(I67) 등으로 구역을 나누어 첫 진단 후 다른 뇌질환 발생 시 여러 번 진단비를 줍니다.',
              strength: '통합형 뇌혈관 부위별 다회 보장 설계 강점'
            },
            {
              company: 'DB손해보험',
              badge: '매회 수술비 1위',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              highlight: '코일색전술/스텐트 매회 삭감 없음',
              desc: '뇌혈관 수술비 반복 지급 한도 내에서 스텐트 삽입 및 뇌압 경감 관련 비관혈 시술 청구 횟수를 타사 대비 연간 1회 제한 없이 매 수술 시마다 100% 한도를 고수합니다.',
              strength: '다회 시술에 절대적으로 유리한 반복 수술비'
            },
            {
              company: '현대해상',
              badge: '혈전용해제 최다',
              badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
              highlight: '골든타임 혈전용해 약물 가입 한도 우수',
              desc: '급성 뇌경색 내원 환자에게 투여하는 비급여 혈전용해제 투여 지원금 한도가 가입 나이 대비 업계 우수치로 보완 설정 가능하여 응급실 내원 치료에 유리합니다.',
              strength: '응급 혈전 용해 치료 및 비관혈 약제 한도 우위'
            },
            {
              company: '메리츠화재',
              badge: '종수술비 연계',
              badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
              highlight: '1-5종 질병 수술비 내 5종 대수술 강화',
              desc: '개두술 등 고위험의 뇌혈관 5종 수술 시 기본 종수술비 외에 다이렉트 뇌 수술 지원금의 연계 요율을 매끄럽고 신속하게 결합하여 심사 승인 장벽을 낮췄습니다.',
              strength: '개두술 및 중증 뇌혈관 대수술비 한도 극대화'
            },
            {
              company: 'KB손해보험',
              badge: '산정특례 최대 한도',
              badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
              highlight: '중증 산정특례 진단금 매년 최대 한도 리필',
              desc: '뇌혈관 질환 국가 산정특례 대상자로 분류되어 장기 입원 또는 치료받을 경우, 매년 특례 조건 갱신 시마다 연간 반복 지급하는 위로금 가입 금액을 가장 크게 확보할 수 있습니다.',
              strength: '재발이 무서운 환자를 위한 반복 산정특례 특화'
            },
            {
              company: '한화손해보험',
              badge: '최고 가성비 요율',
              badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
              highlight: '무해지 환급형 뇌혈관 특약 최저가 가입',
              desc: '20대부터 40대까지 뇌혈관질환 진단비 특약의 보험료 단가를 국내 대표 손해사 중 가장 낮게 산정하여, 보장 범위를 뇌출혈에서 뇌혈관으로 넓히는 보강 설계에 최적입니다.',
              strength: '기존 보험 보강 리모델링용 초가성비 요율 매칭'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-10px_rgba(79,70,229,0.06)] hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-gray-900">{maskCompany(item.company, isUnlocked)}</span>
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-[11px] text-indigo-600 font-black">{maskText(item.highlight, isUnlocked)}</p>
                  <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
                    {maskText(item.desc, isUnlocked)}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">강력 추천 매칭</p>
                <p className="text-xs text-gray-700 font-black mt-1 flex items-center gap-1.5">
                  🛡️ {maskText(item.strength, isUnlocked)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. 전문가 실전 뇌혈관 리모델링 체크리스트 ── */}
      <div className="bg-slate-50 rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-slate-100">
        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-indigo-600" /> 뇌혈관 보험 리모델링 실전 4단계 체크리스트
        </h4>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              step: '01',
              title: '가입된 기존 보험 증권의 "진단명" 확인',
              desc: '보장 특약명이 "뇌출혈"이나 "뇌졸중"에 국한되어 있는 경우, 전체 뇌혈관 질환의 40~90%를 보장받지 못하고 있으므로 속히 넓은 보장 범위의 "뇌혈관질환 진단비"로 전환/추가 설계하는 것이 시급합니다.'
            },
            {
              step: '02',
              title: '뇌동맥류(I67) 발견 시 즉각 치료 혜택 여부 체크',
              desc: '최근 종합검진을 계획 중이라면 무조건 검진 뇌 MRA 촬영 전에 보장 설계를 마쳐야 합니다. 검사 결과에서 뇌동맥류나 미세 협착 소견을 받아버리는 순간, 해당 부위는 즉각 부담보 처리가 되거나 일정 기간 가입이 제한됩니다.'
            },
            {
              step: '03',
              title: '뇌혈관 질환의 골든타임 시술 특약 추가',
              desc: '막힌 뇌혈관을 응급으로 뚫기 위한 혈전 용해 치료비 및 카테터 시술 관련 보장이 최신 요율로 정밀 탑재되어 있는지, 매회 반복 수령이 가능한 약관인지 설계안을 꼭 확인하세요.'
            },
            {
              step: '04',
              title: '반복 리필되는 산정특례 및 수술비 비중 검토',
              desc: '뇌혈관 질환은 영구 후유증이 남거나 주기적 경과 관찰과 보강 시술이 필요한 중증 재발 위험이 높습니다. 1회성 진단비의 소멸 한계를 극복하기 위해 매년 반복되는 산정특례와 매회 수술비의 비중을 강화하세요.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 md:p-8 rounded-3xl border border-slate-100 flex gap-6">
              <span className="text-3xl font-black text-indigo-100 leading-none">{item.step}</span>
              <div className="space-y-2">
                <h5 className="text-base font-black text-slate-900">{item.title}</h5>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">{maskText(item.desc, isUnlocked)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. 하단 CALL TO ACTION (CTA) 연동 블록 ── */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl md:rounded-[3rem] p-5 md:p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 pointer-events-none">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-xl md:text-2xl font-black">
            뇌출혈 진단비만으로 안심하고 계셨나요?<br />
            <span className="text-indigo-300">지금 실시간 뇌혈관 리모델링 지수를 무료 진단하세요!</span>
          </h3>
          <p className="text-xs text-indigo-200/70 font-semibold leading-relaxed">
            가입 연령과 성별만 입력해 보세요. 6대 손해사의 전체 뇌혈관 질환 특약 요율과 비관혈 스텐트 시술비 혜택을 실시간 정밀 비교하여 가장 가성비 높고 든든한 맞춤 설계를 추천해 드립니다.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={onAction}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 rounded-full font-black text-sm transition-all hover:bg-orange-50 active:scale-95 shadow-2xl hover:shadow-indigo-500/20 group"
            >
              뇌혈관 맞춤 보험 무료 진단하기
              <ChevronRight className="group-hover:translate-x-1.5 transition-transform text-indigo-900" size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
