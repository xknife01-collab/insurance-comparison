import React from 'react';
import { 
  Stethoscope, Search, ShieldCheck, HeartPulse, ChevronRight, 
  HelpCircle, AlertCircle, RefreshCw, Award, CheckCircle2, Heart, Sparkles, Activity
} from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const CancerExplanation: React.FC<Props> = ({ onAction }) => {
  return (
    <div className="mt-16 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* ── 1. 프리미엄 HERO 헤더 섹션 ── */}
      <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 rounded-3xl md:rounded-[3rem] p-5 md:p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl border border-rose-500/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent opacity-60"></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-rose-500/20 text-rose-300 rounded-full text-xs font-black uppercase tracking-[0.25em] border border-rose-500/30">
            <Heart size={14} className="text-rose-400 animate-pulse" /> Cancer Insurance Guide
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.15]">
            치료에만 집중할 수 있는 든든한 방어막<br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-orange-300 bg-clip-text text-transparent">
              암 진단비와 신의료 치료의 비밀
            </span>
          </h2>
          <p className="text-rose-200/80 font-semibold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            암 발병률 38% 시대. 일반암과 유사암의 지급 비율 규정부터 고액의 치료비가 드는 중입자, 표적항암 및 카티(CAR-T) 치료에 특화된 스마트 암보장 설계 가이드입니다.
          </p>
        </div>
      </div>

      {/* ── 2. 핵심 4대 지표 배너 (Summary Cards) ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: '일반암 진단비',
            desc: '위, 대장, 폐, 유방암 등 진단 확정 시 최초 1회에 한해 최대 1억 원의 일시금을 즉시 지급.',
            tag: '생활자금 확보',
            tagBg: 'bg-rose-50 text-rose-700 border-rose-200',
            icon: <Award className="w-5 h-5 text-rose-600" />
          },
          {
            title: '유사암 20% 한도',
            desc: '갑상선암, 제자리암, 경계성 종양 등 발병률은 높고 생존율이 뛰어난 소액암에 대해 일반암의 20% 한도로 차등 보장.',
            tag: '금감원 기준 준수',
            tagBg: 'bg-pink-50 text-pink-700 border-pink-200',
            icon: <Stethoscope className="w-5 h-5 text-pink-600" />
          },
          {
            title: '비급여 암 주요치료비',
            desc: '연간 본인이 부담한 비급여 암 치료 총액이 일정 한도를 초과할 경우, 매년 최대 1억원씩 10년간 총 10억원을 지급.',
            tag: '최신 트렌드 특약',
            tagBg: 'bg-orange-50 text-orange-700 border-orange-200',
            icon: <RefreshCw className="w-5 h-5 text-orange-600" />
          },
          {
            title: '면책 90일 / 감액 1년',
            desc: '가입 후 90일 동안은 진단 시 계약 무효 및 미지급, 1~2년 이내에는 가입 금액의 50%만 지급하는 안전 장치.',
            tag: '사전 준비 필수',
            tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
            icon: <CheckCircle2 className="w-5 h-5 text-amber-600" />
          }
        ].map((card, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-10px_rgba(244,63,94,0.08)] transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
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

      {/* ── 3. GUIDE 01: 일반암 vs 유사암(소액암) 분류 기준 ── */}
      <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-gray-100 shadow-xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
              <Search size={28} />
            </div>
            <div>
              <p className="text-xs text-rose-600 font-black tracking-widest uppercase">Guide 01</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">일반암 vs 유사암 분류 마스터</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-bold max-w-md">
            보험금 분쟁의 가장 큰 원인은 일반암과 유사암의 판정 차이입니다. 금융감독원 기준에 부합하는 암 분류 기준과 정액 보장 팩트를 확인하세요.
          </p>
        </div>

        {/* 일반암 vs 유사암 대조 그리드 */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* 일반암 */}
          <div className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-600 rounded-full"></span> 일반암 (悪性新生物)
                </h4>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">가입 금액 100% 지급</span>
              </div>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                침윤과 전이 성질을 띠며 인체 장기 조직에 영구적인 손상을 입히는 악성 악성 종양입니다. 위암, 폐암, 간암, 대장암, 췌장암, 유방암 등이 대표적입니다.
              </p>
              <div className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3">
                <p className="text-xs font-black text-slate-800">💡 대표 치료 대상 및 범위</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-bold">
                  <div>• 위암 (C16)</div>
                  <div>• 폐암 (C34)</div>
                  <div>• 대장암 (C18~C20)</div>
                  <div>• 췌장암 (C25)</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
              <p className="text-[10px] text-rose-900 font-bold leading-relaxed">
                ※ 일부 보험사에서 대장점막내암, 전립선암, 자궁암을 소액암으로 따로 분류해 한도를 줄이는 경우가 있으므로, 해당 암들이 **'일반암'에 온전히 포함**되어 있는지 확인이 필요합니다.
              </p>
            </div>
          </div>

          {/* 유사암 */}
          <div className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-pink-500 rounded-full"></span> 유사암 (소액암)
                </h4>
                <span className="text-xs font-black text-pink-600 bg-pink-50 px-3 py-1 rounded-lg border border-pink-100">일반암의 20%만 지급</span>
              </div>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                암과 조직학적 유사성은 있으나 병변 부위의 전이 위험이 현저히 낮고 치료가 간단한 암입니다. 갑상선암, 제자리암, 경계성 종양, 기타피부암이 고정 포함됩니다.
              </p>
              <div className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3">
                <p className="text-xs font-black text-slate-800">💡 유사암의 4가지 고정 정의</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 font-bold">
                  <div>• 갑상선암 (C73)</div>
                  <div>• 제자리암 (상피내암, D00~D09)</div>
                  <div>• 경계성 종양 (D37~D48)</div>
                  <div>• 기타피부암 (C44)</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100">
              <p className="text-[10px] text-pink-900 font-bold leading-relaxed">
                ※ 금융감독원 규정상 유사암 가입 한도는 일반암 진단비의 **최대 20%를 초과할 수 없습니다.** (예: 일반암 5,000만원 가입 시 유사암은 최대 1,000만원 한도 고정)
              </p>
            </div>
          </div>

        </div>

        {/* 유사암 납입면제 핵심 팁 */}
        <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-3xl md:rounded-[3rem] p-5 md:p-8 md:p-12 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h4 className="text-lg font-black text-rose-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600" /> 유사암 진단 시 '납입면제 / 납입지원' 혜택을 챙기세요!
            </h4>
            <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-2xl">
              일반암 진단 시에는 차후 보험료가 전액 면제(납입면제)되는 제도가 기본 탑재되어 있으나, 유사암(갑상선암 등)은 제외인 경우가 많습니다. 일부 프리미엄 상품은 유사암 진단 시에도 보험료의 50% 이상을 지원(납입지원)해 주므로 설계안 확인 시 강력 추천합니다.
            </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-2xl border border-rose-100 text-center shrink-0">
            <span className="text-[10px] text-gray-400 font-bold block">유사암 납입지원 여부</span>
            <span className="text-sm font-black text-rose-600 block mt-1">💡 가입 설계 필수 대조군</span>
          </div>
        </div>
      </div>

      {/* ── 4. GUIDE 02: 최신 신의료 암치료 특약 완전 분석 ── */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* 표적항암 및 양성자/중입자 치료 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-10 border border-slate-800">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 rotate-12 pointer-events-none">
            <ShieldCheck size={260} className="text-white" />
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400 border border-white/10 shadow-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs text-rose-400 font-black tracking-widest">Guide 02</p>
                <h3 className="text-xl font-black text-white">최신 신의료 암치료 특약</h3>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 font-semibold leading-relaxed">
              암에 걸렸을 때 가장 무서운 것은 치료 중 발생하는 엄청난 약제비와 고가의 첨단 장비 시술 비용입니다. 최근 개발되어 건강보험이 미적용되는 비급여 신의료 항목의 보장 여부가 암보험의 승부처입니다.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                { title: '표적항암 약물 허가 치료비', desc: '암세포의 특정 단백질만 저격하여 치료 효율을 높이고 구토, 탈모 등 항암 부작용을 극대화하여 줄여주는 표적 항암제 처방 비용을 정액(최대 5,000만~1억) 지원합니다.' },
                { title: '양성자 / 중입자 치료비', desc: '무통증, 무부작용으로 암세포를 정밀 살상하는 "꿈의 치료기"입니다. 1회 치료당 5,000만원 이상의 비급여 치료비가 발생하므로 특약 한도 확보가 필수입니다.' },
                { title: '카티(CAR-T) 항암면역치료비', desc: '환자 본인의 면역세포를 추출/유전자 조작 후 배양하여 투여하는 초고가 1대1 개인 맞춤형 백신 치료비 보장 특약입니다.' }
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 text-xs font-black">{i + 1}</div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white">{tip.title}</p>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 비급여 암 주요치료비 트렌드 */}
        <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 md:p-14 border border-gray-100 shadow-xl flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-xs text-rose-600 font-black tracking-widest">New Trend</p>
                <h3 className="text-xl font-black text-gray-900">비급여 암 주요치료비 (최대 10억)</h3>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              최근 암보험 시장의 패러다임이 진단비 일시금 중심에서 **'실제 쓴 치료비 연간 정산형'**으로 완전히 이동하고 있습니다. 매년 환자가 암 치료에 쓴 연간 비급여 치료비 구간에 따라 매년 최대 1억원씩 10년간 총 10억원을 지급하는 획기적인 담보입니다.
            </p>

            <div className="bg-rose-50/50 p-5 md:p-6 rounded-2xl border border-rose-100 space-y-4">
              <p className="text-sm font-black text-rose-950">💡 연간 비급여 암 치료비 지급 구간 예시</p>
              <div className="space-y-2 text-[10px] text-gray-600 font-bold">
                <div className="flex justify-between p-2 bg-white rounded-lg border border-rose-100/50">
                  <span>연간 암 치료비 300만원 이상 ~ 1,000만원 미만 시</span>
                  <span className="text-rose-600 font-black">매년 300만원 지급</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-rose-100/50">
                  <span>연간 암 치료비 1,000만원 이상 ~ 5,000만원 미만 시</span>
                  <span className="text-rose-600 font-black">매년 1,000만원 지급</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-rose-100/50">
                  <span>연간 암 치료비 5,000만원 이상 ~ 1억원 미만 시</span>
                  <span className="text-rose-600 font-black">매년 5,000만원 지급</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-rose-100/50">
                  <span>연간 암 치료비 1억원 이상 돌파 시 (최대)</span>
                  <span className="text-rose-600 font-black">매년 1억원 지급 (10년간 최대 10억)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-rose-600 font-black mb-1">📢 암보험 핵심 조언</p>
            <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
              "진단비 5,000만 원은 가입 후 1번 받으면 소멸하지만, 비급여 암 주요치료비는 10년 동안 생존하여 치료를 받는 내내 매년 구간별로 리필 지급되므로 장기 투병 시 고정비 리스크 방어에 가장 유리합니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. 국내 6대 대표 손해사 암보험 혜택 비교 ── */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 bg-rose-50 text-rose-700 rounded-full text-xs font-black uppercase tracking-widest">
            Brand Analytics
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            국내 대형 6개 손해사 암보험 혜택 비교
          </h3>
          <p className="text-xs text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
            암보험 상품은 회사별로 부위별 지급 횟수, 신의료 기술 치료비 특약 한도, 유사암 납입 지원 여부에 따라 강점이 뚜렷하게 나뉩니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              company: '삼성화재',
              badge: '통합암 진단비',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              highlight: '부위별 최대 5회 이상 각각 지급',
              desc: '한 번 암 진단비를 받으면 보장이 소멸하는 일반 암보험과 달리, 위/폐/간 등 발병 부위를 5개 영역으로 쪼개어 첫 번째 암 진단 후 다른 부위에 암 발생 시 각각 진단비를 다시 지급합니다.',
              strength: '전이암 위험 차단 및 통합 부위별 다회 지급'
            },
            {
              company: 'DB손해보험',
              badge: '재진단암 우위',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              highlight: '2년마다 반복 지급되는 계속받는 암',
              desc: '최초 암 진단 2년 후에도 암세포가 남아있거나, 전이/재발한 경우 2년 주기로 진단비를 계속 리필해 주는 특약이 매우 저렴하게 구성되어 재발이 잦은 환자에게 유리합니다.',
              strength: '잔존암 및 계속받는 재진단암 한도 우수'
            },
            {
              company: '현대해상',
              badge: '신의료 한도 최다',
              badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
              highlight: '양성자·중입자치료 한도 업계 최고',
              desc: '고액의 첨단 비급여 방사선 치료인 중입자치료와 양성자치료비 한도를 업계에서 가장 높게 설정할 수 있으며, 다빈치 로봇 수술 지원 특약의 적용 범위가 가장 정교합니다.',
              strength: '신의료 기술 방사선/약물 치료비 집중 설계'
            },
            {
              company: '메리츠화재',
              badge: '감액 기간 없음',
              badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
              highlight: '가입 90일 직후 100% 전액 지급',
              desc: '통상 가입 후 1~2년 이내에는 진단비의 50%만 지급하는 감액 규정이 있으나, 메리츠는 특판 플랜을 통해 가입 90일 면책만 넘어가면 즉시 100%를 보장하는 즉시 지급형을 지원합니다.',
              strength: '빠른 보장 개시 및 즉시 지급 한도 설계 선호'
            },
            {
              company: 'KB손해보험',
              badge: '납입면제 우수',
              badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
              highlight: '암 진단 후 보험료 납입 의무 전액 면제',
              desc: '암 진단 시 남은 가입 기간 동안 내야 할 보험료를 전액 회사가 대신 납부해 주는 납입면제 트리거의 범위가 가장 넓고 유연하여, 소비자 분쟁 발생률이 낮은 것이 장점입니다.',
              strength: '가장 안정적인 납입면제 범위 확보 상품'
            },
            {
              company: '한화손해보험',
              badge: '여성 특화/가성비',
              badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
              highlight: '여성 전용 시그니처 암보험 할인',
              desc: '유방암, 자궁암, 난소암 등 여성 관련 암 발생 시 가입 한도와 진단비를 특화하고, 무사고 전환 할인 시 보험료 감면율이 매우 높아 2030 여성층 가성비 1위를 고수합니다.',
              strength: '여성 다빈도 암 보장 특화 및 업계 최저 요율'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.06)] hover:border-rose-100 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-gray-900">{item.company}</span>
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-[11px] text-rose-600 font-black">{item.highlight}</p>
                  <p className="text-xs text-gray-500 font-bold mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">강력 추천 매칭</p>
                <p className="text-xs text-gray-700 font-black mt-1 flex items-center gap-1.5">
                  🛡️ {item.strength}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. 전문가 실전 가입 가이드 & 체크리스트 ── */}
      <div className="bg-slate-50 rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-slate-100">
        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-rose-600" /> 암보험 리모델링 실전 4단계 체크리스트
        </h4>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              step: '01',
              title: '진단비 규모는 본인 연봉 수준으로 설정하기',
              desc: '실손이 치료비를 보완하더라도 암 투병 기간(평균 1~2년) 동안의 경제 활동 중단은 막을 수 없습니다. 진단비 일시금은 최소 본인 세후 연봉의 1~1.5배로 확보해야 가정이 안정적으로 유지됩니다.'
            },
            {
              step: '02',
              title: '90일 면책기간과 1년 감액 기간 확인',
              desc: '암보험은 가입 즉시 효력이 발생하지 않고 90일의 면책기간이 지난 다음 날부터 비로소 보장이 개시됩니다. 감액 기간(1년 내 50% 지급)도 있으므로 건강할 때 미리 준비하는 것이 지혜입니다.'
            },
            {
              step: '03',
              title: '나이에 맞춰 비갱신형과 갱신형 선택하기',
              desc: '20~40대 젊은 층은 평생 보험료가 오르지 않는 "비갱신형(20년납 90세만기 등)"이 무조건 유리합니다. 반면, 50대 이후 노령층은 초기 납입비가 저렴한 "갱신형"을 활용해 보장을 보완하는 것이 효율적입니다.'
            },
            {
              step: '04',
              title: '유사암 진단 시 납입지원 제도 탑재 대조',
              desc: '유사암(갑상선암, 제자리암 등)으로 아프더라도 차후 보험료 걱정 없이 계약을 유지할 수 있도록 유사암 납입지원 특약의 한도와 범위가 정교하게 포함되어 있는지 최종 설계서를 비교하세요.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 md:p-8 rounded-3xl border border-slate-100 flex gap-6">
              <span className="text-3xl font-black text-rose-100 leading-none">{item.step}</span>
              <div className="space-y-2">
                <h5 className="text-base font-black text-slate-900">{item.title}</h5>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. 하단 CALL TO ACTION (CTA) 연동 블록 ── */}
      <div className="bg-gradient-to-br from-rose-900 to-rose-950 rounded-3xl md:rounded-[3rem] p-5 md:p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl border border-rose-500/20">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 pointer-events-none">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h3 className="text-xl md:text-2xl font-black">
            진단비만 믿고 치료비 부담을 남겨두셨나요?<br />
            <span className="text-rose-300">지금 실시간 암 리모델링 지수를 무료 진단하세요!</span>
          </h3>
          <p className="text-xs text-rose-200/70 font-semibold leading-relaxed">
            나이와 과거 병력만 간단히 입력해 보세요. 6대 손해사의 암 진단비 요율과 표적항암 및 비급여 암 주요치료비(최대 10억) 특약을 실시간 분석하여 최적의 저렴한 포트폴리오를 만들어 드립니다.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={onAction}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-rose-900 rounded-full font-black text-sm transition-all hover:bg-rose-50 active:scale-95 shadow-2xl hover:shadow-rose-500/20 group"
            >
              암 맞춤 보험 무료 진단하기
              <ChevronRight className="group-hover:translate-x-1.5 transition-transform text-rose-900" size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
