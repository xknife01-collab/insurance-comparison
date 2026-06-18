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

export const HeartExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => {
  return (
    <div className="mt-16 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* ── 1. 프리미엄 HERO 헤더 섹션 ── */}
      <div className="bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 rounded-3xl md:rounded-[3rem] p-5 md:p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl border border-red-500/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-60"></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-500/20 text-red-300 rounded-full text-xs font-black uppercase tracking-[0.25em] border border-red-500/30">
            <Heart size={14} className="text-red-400 animate-pulse" /> Cardiovascular Insurance Guide
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.15]">
            평생 뛰는 심장을 지키는 단 하나의 방어선<br />
            <span className="bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              심장질환 진단비와 최신 시술비
            </span>
          </h2>
          <p className="text-red-200/80 font-semibold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            급성심근경색(9%)과 허혈성(60~70%)만 보장받고 계셨나요? 직장인 건강검진 시 흔히 진단 소견을 받는 심장 부정맥(I49), 심방세동(I48) 및 심부전(I50)까지 포함해 심장 질환을 100% 든든하게 보장하는 프리미엄 설계 가이드입니다.
          </p>
        </div>
      </div>

      {/* ── 2. 핵심 4대 지표 배너 (Summary Cards) ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: '심장질환 100% 보장',
            desc: '급성심근경색증과 협심증은 물론, 부정맥(I49), 심방세동(I48), 심부전(I50)까지 심장 전체 이상 보장.',
            tag: '넓은 보장 범위',
            tagBg: 'bg-red-50 text-red-700 border-red-200',
            icon: <Award className="w-5 h-5 text-red-600" />
          },
          {
            title: '관혈 / 비관혈 매회 수술비',
            desc: '가슴을 여는 개흉 수술뿐 아니라 허벅지 동맥 카테터 스텐트 삽입, 풍선 확장 등 비관혈 수술 매회 반복 지급.',
            tag: '수술비 반복 보장',
            tagBg: 'bg-rose-50 text-rose-700 border-rose-200',
            icon: <Activity className="w-5 h-5 text-rose-600" />
          },
          {
            title: '산정특례 반복 진단비',
            desc: '중증 심장 질환으로 국가 중증 산정특례 환자 등록 시, 진단비와 별도로 매년 고액의 치료비 반복 리필 지급.',
            tag: '중증 재발 대비',
            tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
            icon: <RefreshCw className="w-5 h-5 text-amber-600" />
          },
          {
            title: '부정맥 & 협심증 대비',
            desc: '직장인 다빈도 협심증(I20)과 피로/스트레스로 급증하는 심장 부정맥(I49) 진단 코드 집중 보완 설계.',
            tag: '다빈도 질환 대비',
            tagBg: 'bg-slate-50 text-slate-700 border-slate-200',
            icon: <CheckCircle2 className="w-5 h-5 text-slate-600" />
          }
        ].map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-10px_rgba(239,68,68,0.08)] transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
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

      {/* ── 3. GUIDE 01: 보장 범위의 치명적인 차이 (급성심근경색 vs 허혈성 vs 심장질환 전체) ── */}
      <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-gray-100 shadow-xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20">
              <Search size={28} />
            </div>
            <div>
              <p className="text-xs text-red-600 font-black tracking-widest uppercase">Guide 01</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">심장질환 보장 범위 함정 피하기</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-bold max-w-md">
            과거 가입한 대부분의 심장 보험은 '급성심근경색증'에 국한되어 정작 가장 빈번하게 발생하는 협심증이나 부정맥 소견 시 혜택이 단 1원도 지급되지 않는 심각한 사각지대가 있습니다.
          </p>
        </div>

        {/* 보장 범위 테이블 비교 그리드 */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* 1. 급성심근경색 */}
          <div className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6 opacity-60">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-black text-gray-500 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span> 급성심근경색증
                </h4>
                <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">전체 질환의 9%</span>
              </div>
              <p className="text-xs text-gray-400 font-bold leading-relaxed">
                심장에 피를 공급하는 관상동맥이 갑작스럽게 완전히 막혀 심장 근육 세포가 영구 괴사하는 매우 위급하고 제한적인 상황만 보장합니다.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-gray-400">보장 코드</p>
                <p className="text-xs font-black text-gray-500">I21, I22, I23</p>
              </div>
            </div>
            <div className="p-3 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg text-center">
              ⚠️ 가장 빈번한 협심증(I20), 부정맥(I49) 보장 안 됨!
            </div>
          </div>

          {/* 2. 허혈성 심장질환 */}
          <div className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6 opacity-80">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span> 허혈성 심장질환
                </h4>
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">전체 질환의 60%</span>
              </div>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                급성심근경색증에 더해 심장 혈관이 좁아져 통증을 일으키는 가장 대중적인 질환인 **협심증(I20)** 및 만성 허혈 질환까지 포함하여 보장합니다.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-slate-500">보장 코드</p>
                <p className="text-xs font-black text-slate-800">I20, I21, I22, I23, I24, I25</p>
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg text-center">
              ⚠️ 최근 급증하는 부정맥(I49) 및 심부전(I50) 보장 안 됨!
            </div>
          </div>

          {/* 3. 심장질환 (전체 보장) */}
          <div className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-red-100 flex flex-col justify-between space-y-6 shadow-[0_10px_30px_-5px_rgba(239,68,68,0.05)]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-black text-red-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></span> 심장질환 (특정/확대)
                </h4>
                <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">전체 질환 100% 보장</span>
              </div>
              <p className="text-xs text-red-950 font-bold leading-relaxed">
                급성심근경색 및 협심증은 기본이고, 심장이 불규칙하게 뛰는 부정맥(I49), 빈맥(I47), 심방세동(I48) 및 판막 이상, 심부전(I50)까지 전부 보장합니다.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-red-500">보장 코드</p>
                <p className="text-xs font-black text-red-600">I20~I25 + I47~I50 (회사별 약관 참조)</p>
              </div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg text-center">
              🛡️ 부정맥, 심부전까지 안정적 방어막 구축 개시!
            </div>
          </div>

        </div>

        {/* 부정맥(I49) 설명 스포트라이트 */}
        <div className="bg-gradient-to-br from-red-50 to-rose-100/50 rounded-3xl md:rounded-[3rem] p-5 md:p-8 md:p-12 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-black text-red-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-600" /> 스트레스와 과로로 급증하는 '기타 심장 부정맥(I49)'
            </h4>
            <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-2xl">
              부정맥은 심장의 전기 신호 이상으로 맥박이 빠르거나 느리게 뛰는 상태입니다. 피로와 스트레스로 가슴이 쿵쾅거리는 가벼운 증상부터 실신, 뇌졸중을 유발하는 심방세동까지 발병률이 가파르게 상승하고 있습니다. 직장인 건강검진 심전도 검사 시 자주 진단 소견이 나오는 이 부정맥은 **오직 보장 범위가 확대된 '심장질환' 특약에서만 진단비 지급이 가능합니다.**
            </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-red-100 text-center shrink-0">
            <span className="text-[10px] text-gray-400 font-bold block">부정맥(I49) 보장 여부</span>
            <span className="text-sm font-black text-red-600 block mt-1">🛡️ 가입 설계 시 약관 필수 확인!</span>
          </div>
        </div>
      </div>

      {/* ── 4. GUIDE 02: 최신 스텐트 삽입술 및 심장 판막 시술 등 신의료 비침습 치료 ── */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* 비관혈 카테터 수술 기술 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-10 border border-slate-800">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 rotate-12 pointer-events-none">
            <ShieldCheck size={260} className="text-white" />
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-red-400 border border-white/10 shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs text-red-400 font-black tracking-widest">Guide 02</p>
                <h3 className="text-xl font-black text-white">최신 비침습 심장 치료</h3>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 font-semibold leading-relaxed">
              최근 심장 혈관 및 판막 수술은 가슴뼈를 절개하고 인공심폐기를 연결하는 위험하고 무거운 대수술 대신, 혈관 내로 카테터를 삽입하여 정밀 시술하는 비관혈 방식이 80% 이상을 차지합니다.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                { title: '경피적 관상동맥 중재술 (스텐트)', desc: '좁아지거나 막힌 관상동맥(심장 밥줄 혈관) 내로 금속 그물망(스텐트)을 진입시켜 혈관 통로를 강제로 유지/개통하는 핵심 시술입니다.' },
                { title: '심장 판막 풍선 성형술', desc: '혈류 조절 판막이 좁아졌을 때 풍선 카테터를 밀어 넣어 풍선을 불어 판막을 넓혀주며, 개흉 수술이 어려운 고령층에게 높은 빈도로 시행됩니다.' },
                { title: '인공심박동기(Pacemaker) 이식', desc: '맥박이 극도로 느려져 실신하는 서맥성 부정맥 환자의 몸속에 인공 심박 조율 장치를 이식하여 규칙적인 전기 자극을 보내 심장을 뛰게 하는 시술입니다.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 text-xs font-black">{i + 1}</div>
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
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                <RefreshCw size={24} />
              </div>
              <div>
                <p className="text-xs text-red-600 font-black tracking-widest">Crucial Option</p>
                <h3 className="text-xl font-black text-gray-900">중증 심장질환 산정특례 위로금</h3>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              심근경색으로 관상동맥 우회술을 받거나 약물 치료로 입원하는 중증 환자는 국가 중증질환 '산정특례' 대상으로 분류되어 건강보험 혜택을 크게 누립니다. 민간 보험사는 이에 연동하여 **'심장질환 산정특례 진단비'** 특약을 지원하며, 심장질환은 고혈압 등 만성 상태로 재발이 잦아 매년 조건 충족 시마다 리필되는 반복 지급형 담보를 추천합니다.
            </p>

            <div className="bg-red-50/50 p-5 md:p-6 rounded-2xl border border-red-100 space-y-4">
              <p className="text-sm font-black text-red-950">💡 산정특례 진단비의 강점</p>
              <div className="space-y-2 text-[10px] text-gray-600 font-bold">
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-red-100/50">
                  <span>일반 허혈성 진단비 특약</span>
                  <span className="text-red-500 font-black">평생 최초 1회 진단 확정 시 지급 후 특약 자동 소멸</span>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-red-100/50">
                  <span>산정특례 진단비 특약</span>
                  <span className="text-emerald-600 font-black">매년 산정특례 상태 등록 조건 만족 시 매년 반복 지급</span>
                </div>
              </div>
              <p className="text-[10px] text-red-800 font-bold leading-relaxed">
                * 심장 혈관은 한 번 좁아진 곳을 시술하더라도 시간이 지나면 다른 관상동맥 부위에 재협착이 일어날 확률이 약 15~20%에 육박합니다. 진단비 1회 소멸 대신 매년 반복 위로금을 결합하는 설계의 가성비가 돋보입니다.
              </p>
            </div>
          </div>

          <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-red-600 font-black mb-1">📢 전문가 분석 조언</p>
            <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
              "스텐트 시술 후 혈소판 응집 억제제(아스피린 등)를 장복하며 평생 관리해야 하는 환자들은 진단금 1회 일시금보다, 매회 수술 시마다 삭감 없이 반복 지급해 주는 '심장질환 수술비' 특약의 만족도가 장기적으로 월등히 높습니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. 국내 6대 대표 손해사 심장질환보험 혜택 비교 ── */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-black uppercase tracking-widest">
            Brand Analytics
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            국내 대형 6개 손해사 심장질환보험 혜택 비교
          </h3>
          <p className="text-xs text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
            보험사별로 부정맥 진단 한도 설정 한계, 혈관 시술비 누적 합산 필터, 중증 질환 납입면제 범위 등을 정밀 대조한 결과입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              company: '삼성화재',
              badge: '다회 지급 설계',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              highlight: '협심증/심근경색 부위별 쪼개어 다회 지급',
              desc: '한 번 진단비를 수령하면 소멸하는 일반 담보의 한계를 뛰어넘어, 협심증(I20) 및 급성심근경색(I21) 등의 질병 영역을 각각 개별 담보로 쪼개어 두 번 이상 진단금을 챙겨 줍니다.',
              strength: '재발 위험 대비 다회 영역별 진단비 설계 강자'
            },
            {
              company: 'DB손해보험',
              badge: '반복 수술비 1위',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              highlight: '매 시술 수술비 감액 삭감 없이 100% 보장',
              desc: '스텐트 삽입술 등 관상동맥 협착 시술 청구 횟수에 제약이 없고 연간 1회 한도 차감 규정이 존재하지 않아, 주기적 혈관 리모델링 시술을 받는 장기 입원 고객에게 유리합니다.',
              strength: '혈관 확장 및 반복 수술 특약 최적화 선호 상품'
            },
            {
              company: '현대해상',
              badge: '신의료 판막 우수',
              badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
              highlight: '경피적 심장판막/인공심박동기 한도 업계 최다',
              desc: '부정맥 환자의 필수 시술인 인공심박동기(Pacemaker) 이식 한도를 업계 우수치로 보강 설계할 수 있어 고령 환자들의 실버 플랜 연계 계약에서 두각을 나타냅니다.',
              strength: '고액의 심장 판막 및 심박 조율 장치 특약 최다 확보'
            },
            {
              company: '메리츠화재',
              badge: '부정맥 한도 특화',
              badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
              highlight: '기타 심장 부정맥(I49) 진단비 최대 한도 세팅',
              desc: '타 손해사가 가입 나이 제한을 걸어 부정맥 진단금을 축소 설계하는 반면, 메리츠는 다이렉트 간편 심사를 통해 부정맥 보장 한도를 상대적으로 가장 두껍게 보완하도록 지원합니다.',
              strength: '기타 심장 부정맥(I49) 집중형 고액 설계 최적'
            },
            {
              company: 'KB손해보험',
              badge: '산정특례 한도 1위',
              badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
              highlight: '중증 산정특례 진단금 매년 최대 한도 리필',
              desc: '심장 질환으로 중증 환자 등록 및 산정특례 상태를 유지할 경우, 매년 특례 조건 갱신 시마다 연간 반복 지급하는 위로금 가입 한도를 업계 우수 금액으로 세팅해 줍니다.',
              strength: '재발이 잦은 환자를 위한 매년 산정특례 위로금 우세'
            },
            {
              company: '한화손해보험',
              badge: '초가성비 요율',
              badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
              highlight: '허혈성 심장질환 진단 특약 최저가 요율',
              desc: '30대 및 40대 경제 활동 연령층의 허혈성 심장질환 진단비 특약 당 보험료 단가를 국내 대표 6대사 중 가장 낮게 산정하여, 기존 가입된 좁은 급성심근경색 보장을 보완하기에 적격입니다.',
              strength: '기본 보장 보완용 초가성비 리모델링 요율 매치'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-10px_rgba(239,68,68,0.06)] hover:border-red-100 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-gray-900">{maskCompany(item.company, isUnlocked)}</span>
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-[11px] text-red-600 font-black">{maskText(item.highlight, isUnlocked)}</p>
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

      {/* ── 6. 전문가 실전 심장질환 리모델링 체크리스트 ── */}
      <div className="bg-slate-50 rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-slate-100">
        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-red-600" /> 심장질환 보험 리모델링 실전 4단계 체크리스트
        </h4>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              step: '01',
              title: '가입된 기존 보험 증권의 "진단명" 확인',
              desc: '보장 특약명이 "급성심근경색증"에 국한되어 있는 경우, 전체 심장 질환의 90% 이상을 차지하는 협심증이나 부정맥 진단 시 보험금을 단 1원도 받을 수 없으므로 속히 "허혈성" 및 "심장질환" 담보로 보완 리모델링하셔야 합니다.'
            },
            {
              step: '02',
              title: '건강검진 심전도 검사 전 가입 설계하기',
              desc: '가슴 답답함, 숨 가쁨 증상이 있어 병원 방문을 예정하고 있거나 직장인 건강검진(심전도)을 앞두고 있다면 무조건 검사 전에 심장 가이드를 설계하여 가입을 끝내야 소견 발생에 따른 부담보를 방어할 수 있습니다.'
            },
            {
              step: '03',
              title: '매회 반복되는 스텐트 시술 수술비 추가',
              desc: '스텐트 삽입술은 좁아진 부위 외에 관상동맥의 노화가 가속되며 수년 내 재협착이 일어나는 성질을 띱니다. 1회성 진단비의 한계를 메우기 위해 매회 삭감 없이 지급되는 "심장 수술비" 담보 유무를 반드시 비교 대조하세요.'
            },
            {
              step: '04',
              title: '뇌혈관과 심혈관의 1:1 균형 비율 설계',
              desc: '뇌와 심장은 우리 몸의 2대 혈관 시스템으로 밀접하게 연결되어 있습니다. 어느 한쪽 보장 진단비 규모가 쏠리지 않도록 뇌혈관 진단비와 심장질환 진단비 한도를 동일하게 1:1 비율로 맞추어 설계하는 것이 정석입니다.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 md:p-8 rounded-3xl border border-slate-100 flex gap-6">
              <span className="text-3xl font-black text-red-100 leading-none">{item.step}</span>
              <div className="space-y-2">
                <h5 className="text-base font-black text-slate-900">{item.title}</h5>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">{maskText(item.desc, isUnlocked)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. 하단 CALL TO ACTION (CTA) 연동 블록 ── */}
      <div className="bg-gradient-to-br from-red-900 to-red-950 rounded-3xl md:rounded-[3rem] p-5 md:p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl border border-red-500/20">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 pointer-events-none">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-xl md:text-2xl font-black">
            급성심근경색 보장만으로 안심하고 계셨나요?<br />
            <span className="text-red-300">지금 실시간 심장질환 리모델링 지수를 무료 진단하세요!</span>
          </h3>
          <p className="text-xs text-red-200/70 font-semibold leading-relaxed">
            나이와 성별, 간단한 지병 약물 정보만 입력해 보세요. 6대 손해사의 전체 심장질환 보장 요율과 매회 반복 시술되는 스텐트 수술비 혜택을 정교하게 비교하여 가장 경제적이고 든든한 저렴한 포트폴리오를 만들어 드립니다.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={onAction}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-red-900 rounded-full font-black text-sm transition-all hover:bg-rose-50 active:scale-95 shadow-2xl hover:shadow-red-500/20 group"
            >
              심장질환 맞춤 보험 무료 진단하기
              <ChevronRight className="group-hover:translate-x-1.5 transition-transform text-red-900" size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
