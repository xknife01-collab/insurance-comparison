import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import { 
  Stethoscope, Search, ShieldCheck, Activity, ChevronRight, 
  HelpCircle, AlertCircle, RefreshCw, Award, CheckCircle2, HeartPulse, Sparkles
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const PreExistingExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => {
  return (
    <div className="mt-16 space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* ── 1. 프리미엄 HERO 헤더 섹션 ── */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl md:rounded-[3rem] p-5 md:p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60"></div>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-black uppercase tracking-[0.25em] border border-indigo-500/30">
            <HeartPulse size={14} className="text-indigo-400" /> Pre-Existing Condition Guide
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.15]">
            질병 이력이 있어도, 나이가 많아도<br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              유병자 보험, 간편고지의 모든 비밀
            </span>
          </h2>
          <p className="text-indigo-200/80 font-semibold text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            고혈압·당뇨 약 복용부터 최근 수술 이력까지. 복잡한 3.X.5 숫자의 원리를 파악하면, 일반 표준체 보험 대비 불필요하게 비싼 보험료 부담을 든든하게 덜어내실 수 있습니다.
          </p>
        </div>
      </div>

      {/* ── 2. 핵심 4대 지표 배너 (Summary Cards) ── */}
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: '3.5.5 간편심사형',
              desc: '5년 내 입원·수술 이력이 없는 경우, 간편고지 상품 중 상대적으로 저렴한 보험료로 설계 가능.',
              tag: '합리적 설계',
              tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              icon: <Award className="w-5 h-5 text-emerald-600" />
            },
            {
              title: '3.2.5 표준 간편형',
              desc: '최근 2년 내 입원·수술 이력을 확인하며, 만성질환(고혈압, 당뇨 등) 투약자도 고지 기준 충족 시 심사 가능.',
              tag: '만성질환 심사',
              tagBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              icon: <Stethoscope className="w-5 h-5 text-indigo-600" />
            },
            {
              title: '무사고 계약전환',
              desc: '가입 후 일정 기간 입원·수술 등 치료 이력이 없는 경우, 계약전환 신청을 통해 보험료 인하 가능 (해당 상품 限).',
              tag: '계약전환 혜택',
              tagBg: 'bg-sky-50 text-sky-700 border-sky-200',
              icon: <RefreshCw className="w-5 h-5 text-sky-600" />
            },
            {
              title: '3대 핵심 질문 심사',
              desc: '3개월 내 의사소견, X년 내 입원·수술, 5년 내 중대질병 등 3가지 핵심 질문 중심의 간편 고지 심사 진행.',
              tag: '간편고지 기준',
              tagBg: 'bg-purple-50 text-purple-700 border-purple-200',
              icon: <CheckCircle2 className="w-5 h-5 text-purple-600" />
            }
          ].map((card, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_50px_-10px_rgba(99,102,241,0.08)] transition-all hover:-translate-y-1 duration-300 flex flex-col justify-between space-y-6"
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

        {/* ── 간편심사(유병자)보험 법적 필수 안내사항 (금융소비자보호법 및 협회 광고심의 기준) ── */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl md:rounded-3xl p-5 md:p-6 text-center space-y-2">
          <p className="text-xs font-black text-indigo-950 flex items-center justify-center gap-2">
            <span>⚠️</span> 유병자(간편심사) 보험 가입 시 필수 확인 사항
          </p>
          <div className="text-xs font-bold text-slate-700 leading-relaxed space-y-1 break-keep">
            <p>• <b>보험료 할증 안내:</b> 간편심사보험은 일반 표준체 보험에 비해 가입 심사가 간소화된 반면, 위험률이 반영되어 보험료가 다소 높을 수 있습니다.</p>
            <p>• <b>건강체 가입 권장:</b> 건강 상태가 양호한 고객의 경우 일반 심사 보험에 가입하는 것이 보험료 측면에서 훨씬 유리하므로, 일반 보험 가입 가능 여부를 먼저 확인하시기 바랍니다.</p>
            <p>• <b>보장 범위 제한:</b> 일반 보험에 비해 선택 가능한 특약의 종류나 가입 한도가 일부 제한될 수 있습니다.</p>
          </div>
          <p className="text-[10.5px] font-semibold text-slate-400 pt-1">
            ※ 상기 내용은 상품별 약관 및 인수 기준에 따라 상이할 수 있으므로, 청약 전 반드시 상품설명서와 해당 약관을 확인하시기 바랍니다.
          </p>
        </div>
      </div>

      {/* ── 3. GUIDE 01: 3.X.5 간편고지의 세부 조건 마스터 ── */}
      <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-gray-100 shadow-xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Search size={28} />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-black tracking-widest uppercase">Guide 01</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">간편고지 3.X.5 상세 가이드</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-bold max-w-md">
            유병자 보험은 일반 심사에 비해 고지 항목이 대폭 축소된 대신, 본인의 과거 이력에 맞추어 최적의 슬롯(3.5.5 ~ 3.0.5)을 지정해 가입해야 불필요한 할증을 피할 수 있습니다.
          </p>
        </div>

        {/* 3.X.5 기호 해석 그리드 */}
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            {
              number: '3',
              period: '3개월 이내',
              title: '의사의 필요 소견',
              desc: '최근 3개월 이내 의사로부터 입원 필요 소견, 수술 필요 소견, 또는 추가 검사(재검사) 필요 소견을 받았는지 확인합니다.',
              warn: '정기적인 만성질환 약 처방 및 투약은 3개월 고지 대상이 아니나, 의사의 입원·수술·추가검사 필요 소견 여부는 상품별 질문표를 반드시 확인해야 합니다.'
            },
            {
              number: 'X',
              period: 'X년 이내 (0 ~ 5년)',
              title: '질병/상해 입원·수술',
              desc: '선택한 플랜(3.2.5 ~ 3.5.5)에 해당하는 최근 X년 이내에 질병이나 사고로 인해 입원하거나 수술을 받은 사실이 있는지 확인합니다.',
              warn: '단순 감기 등 경미한 통원은 무관하나, 당일 입원을 포함한 모든 입원·수술은 고지 대상이 될 수 있으므로 정확한 진료 일자 확인이 필요합니다.'
            },
            {
              number: '5',
              period: '5년 이내',
              title: '중대 질병 진단·치료',
              desc: '최근 5년 이내에 암, 백혈병, 협심증, 심근경색, 심장판막증, 뇌졸중(뇌출혈/뇌경색), 간경화증으로 진단, 입원, 수술을 받았는지 확인합니다.',
              warn: '여기에 해당하지 않고 단순 고혈압·당뇨·이상지질혈증만 있으신 분들은 5년 조건 통과가 가능합니다.'
            }
          ].map((item, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-5 md:p-8 text-indigo-500/5 font-black text-9xl pointer-events-none group-hover:scale-110 group-hover:text-indigo-500/10 transition-all duration-500">
                {item.number}
              </div>
              <div className="space-y-4 relative z-10">
                <div className="inline-block px-3.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-black rounded-xl">
                  {item.period}
                </div>
                <h4 className="text-lg font-black text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">{maskText(item.desc, isUnlocked)}</p>
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 relative z-10">
                <p className="text-[10px] text-indigo-700 font-black leading-relaxed">
                  💡 팩트체크: {item.warn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 등급별 보험료 차이 분석 요약 */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-3xl md:rounded-[3rem] p-5 md:p-8 md:p-12 border border-indigo-100">
          <h4 className="text-lg font-black text-indigo-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> 어떤 간편 플랜을 선택해야 할까요?
          </h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '3.5.5 플랜', label: '상대적 경제성', desc: '5년간 입원/수술 無', rate: '일반 대비 약 1.1배*' },
              { name: '3.3.5 플랜', label: '실속 가성비', desc: '3년간 입원/수술 無', rate: '일반 대비 약 1.25배*' },
              { name: '3.2.5 플랜', label: '표준 유병자', desc: '2년간 입원/수술 無', rate: '일반 대비 약 1.35배*' },
              { name: '3.0.5 플랜', label: '초간편 가입', desc: '최근 입원/수술력 有', rate: '일반 대비 약 1.5배 이상*' }
            ].map((plan, i) => (
              <div key={i} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-indigo-100 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-indigo-600 font-black uppercase tracking-wider">{plan.label}</p>
                  <p className="text-base font-black text-gray-900 mt-1">{plan.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">{plan.desc}</p>
                </div>
                <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-[10px] text-gray-400 font-bold">월 보험료 수준</span>
                  <span className="text-xs text-indigo-600 font-black">{plan.rate}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-5 text-center leading-relaxed">
            * 상기 배율은 40세 남성, 상해 1급, 표준 플랜 기준의 예시적 비교치이며, 가입자의 연령, 성별, 직업, 선택 담보 및 각 보험사 인수 기준에 따라 실제 보험료와 배율은 상이할 수 있습니다.
          </p>
        </div>
      </div>

      {/* ── 4. GUIDE 02: 가입 승인 확률을 높이는 만성질환 고지 기준 & 체크리스트 ── */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* 만성질환 안심 가이드 */}
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
                <h3 className="text-xl font-black text-white">만성질환 가입 고지 기준</h3>
              </div>
            </div>
            
            <p className="text-sm text-slate-300 font-semibold leading-relaxed">
              고혈압, 당뇨, 고지혈증 약을 매일 복용 중이신가요? 많은 분들이 약 복용 사실만으로 보험에 가입할 수 없다고 오해하지만, 간편 고지에서는 아무런 문제가 되지 않습니다.
            </p>
            
            <div className="space-y-4 pt-4">
              {[
                { title: '단순 약 복용은 패스', desc: '의사의 "입원/수술 소견"이나 "추가 정밀검사 처방"이 없는 정기적인 약 처방 및 복용은 3개월 고지 조항에 전혀 해당하지 않습니다.' },
                { title: '건강검진 추적 관찰 주의', desc: '최근 3개월 내 받은 건강검진 결과표 상 "추가 검사 필요" 혹은 "3~6개월 후 재검사 요망" 소견을 받았다면 이는 고지 대상이 됩니다.' },
                { title: '감기, 장염 등 경미 질환 예외', desc: '감기약 처방, 가벼운 장염 통원 치료 등은 보험사가 사전에 정해둔 "인수 예외 질환"이므로, 기간 내 수술/입원이 없다면 무사히 통과됩니다.' }
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

        {/* 무사고 계약 전환 할인 소개 */}
        <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 md:p-14 border border-gray-100 shadow-xl flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                <RefreshCw size={24} />
              </div>
              <div>
                <p className="text-xs text-sky-600 font-black tracking-widest">Remodeling Tip</p>
                <h3 className="text-xl font-black text-gray-900">무사고 계약 전환 할인 제도</h3>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              유병자 보험은 한 번 가입하면 비싼 보험료를 평생 내야 할까요? 절대 아닙니다. 최근 출시되는 프리미엄 유병자 보험은 **'무사고 계약 전환권'**을 탑재하여 가입자의 사후 건강 상태 회복을 보상합니다.
            </p>

            <div className="bg-sky-50/50 p-5 md:p-6 rounded-2xl border border-sky-100 space-y-4">
              <p className="text-sm font-black text-sky-950">💡 계약 전환 제도의 핵심 원리</p>
              <div className="flex items-center justify-center gap-4 text-center py-2">
                <div className="bg-white px-3 py-2 rounded-xl border border-sky-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-500">3.2.5 가입</p>
                  <p className="text-[10px] text-red-500 font-black mt-0.5">최초 보험료</p>
                </div>
                <ChevronRight className="text-sky-400" size={16} />
                <div className="bg-white px-3 py-2 rounded-xl border border-sky-100 shadow-sm relative">
                  <div className="absolute -top-2.5 -right-2 px-1.5 py-0.5 bg-sky-500 text-white rounded text-[7px] font-black">1년 무사고</div>
                  <p className="text-xs font-bold text-gray-500">3.3.5 전환</p>
                  <p className="text-[10px] text-sky-600 font-black mt-0.5">할인 적용 예시</p>
                </div>
                <ChevronRight className="text-sky-400" size={16} />
                <div className="bg-white px-3 py-2 rounded-xl border border-sky-100 shadow-sm relative">
                  <div className="absolute -top-2.5 -right-2 px-1.5 py-0.5 bg-emerald-500 text-white rounded text-[7px] font-black">3년 무사고</div>
                  <p className="text-xs font-bold text-gray-500">3.5.5 전환</p>
                  <p className="text-[10px] text-emerald-600 font-black mt-0.5">추가 할인 예시</p>
                </div>
              </div>
              <p className="text-[10px] text-sky-800 font-bold leading-relaxed">
                * 가입 후 매년 입원/수술 이력 및 중대질병 진단이 없을 경우, 계약전환 신청을 통해 동일 보장에 대해 보험료 할인 혜택을 적용받을 수 있습니다. (회사별 적용 조건 및 할인율 상이)
              </p>
            </div>
          </div>

          <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs text-indigo-600 font-black mb-1">📢 가입 꿀팁</p>
            <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
              "당장 2~3년 내 수술력 때문에 3.2.5 플랜으로 가입했더라도, 계약 전환권이 적용되는 상품인지 확인하고 가입하세요. 시간이 지나 무사고 기간을 채우면 전환 신청을 통해 보험료를 절약할 수 있습니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. 국내 6대 대표 손해사 유병자 상품 비교 그리드 ── */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest">
            Brand Analytics
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            국내 대형 6개 손해사 유병자 혜택 비교
          </h3>
          <p className="text-xs text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
            유병자 간편 고지 플랜은 회사마다 인수 심사 기준과 예외 질환 범주가 현저하게 다릅니다. 주요 6개사의 강점을 철저히 비교해 드립니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              company: '삼성화재',
              badge: '우수한 안정성',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              highlight: '브랜드 가치 & 무사고 안정망',
              desc: '가장 폭넓은 담보 구성과 우수한 계약 안정성을 자랑하며, 무사고 시 3.5.5 등급으로 신속하게 갈아탈 수 있는 계약 전환 할인 인프라가 뛰어납니다.',
              strength: '계약 안정성 & 높은 보험금 청구 편의성'
            },
            {
              company: 'DB손해보험',
              badge: '합리적 가격대',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              highlight: '3.10.5(10년 고지) 초가성비 플랜',
              desc: '10년 무사고 기준을 적용하는 초간편 상품을 통해, 과거 큰 수술 후 장기간 재발 없이 건강하게 관리해 온 고객에게 경쟁력 있는 보험료 플랜을 제공합니다.',
              strength: '장기 무사고 유병자 대상 합리적 설계'
            },
            {
              company: '현대해상',
              badge: '폭넓은 인수 기준',
              badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
              highlight: '다양한 인수 예외 질환 기준 운영',
              desc: '가벼운 만성질환이나 최근 외래 치료 이력에 대해 폭넓은 예외 질환 인수 기준을 적용하여 가입 편의성을 높였습니다.',
              strength: '다양한 병력 고객을 위한 유연한 인수'
            },
            {
              company: '메리츠화재',
              badge: '초고속 심사',
              badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
              highlight: '3.0.5 초간편부터 3.5.5 간편 특화',
              desc: '구비 서류 제출과 병력 소명 단계가 매우 심플하여 당일 모바일 승인 완료율이 높습니다. 경증 고혈압/고지혈증 환자의 간편 심사 조건 완화가 특징입니다.',
              strength: '빠르고 명쾌한 가입 완료 및 간편 서류 심사'
            },
            {
              company: 'KB손해보험',
              badge: '뛰어난 전환 유연성',
              badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
              highlight: '유연하고 빠른 무사고 할인권',
              desc: '가입 기간 중 사고 여부를 체크하여 자동으로 할인 등급 적용을 권장하는 유연한 상품 구조를 자랑합니다. 전환 시 차액 감면 혜택 체계가 가장 정교합니다.',
              strength: '초기 3.2.5 가입 후 3.5.5 자동 안착 최적화'
            },
            {
              company: '한화손해보험',
              badge: '실속 가성비',
              badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
              highlight: '3.5.5 가성비 라인업 집중 설계',
              desc: '5년 무사고 간편 고지 플랜 선택 시, 월 납입 요금을 콤팩트하게 구성하여 유병자의 매월 고정비 지출을 덜어줍니다.',
              strength: '3.5.5 가성비 중심 진단비 특약 구성'
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-gray-100 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_45px_-10px_rgba(0,0,0,0.06)] hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between space-y-6"
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

      {/* ── 6. 전문가 실전 가입 가이드 & 체크리스트 ── */}
      <div className="bg-slate-50 rounded-3xl md:rounded-[4rem] p-5 md:p-8 md:p-16 border border-slate-100">
        <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-indigo-600" /> 유병자 보험 리모델링 실전 4단계 체크리스트
        </h4>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              step: '01',
              title: '과거 치료 이력 정확히 메모하기',
              desc: '최근 3개월 내 추가 검사 소견, 5년 내 수술 및 입원 여부와 정확한 병원 퇴원 날짜를 메모해 두면 불필요하게 엄격한 요금제로 가입하는 실수를 막을 수 있습니다.'
            },
            {
              step: '02',
              title: '가장 까다로운 3.5.5부터 우선 심사 넣기',
              desc: '지레 겁먹고 비싼 3.2.5 요금제에 덜컥 가입하지 마세요. 가장 저렴한 3.5.5부터 심사를 넣고, 거절될 경우 한 단계씩 낮춰 심사를 넣는 역순 공략이 보험료를 30% 절감할 수 있는 합리적인 방법이 될 수 있습니다.'
            },
            {
              step: '03',
              title: '단순 고혈압·당뇨 약 복용은 표준 심사도 검토',
              desc: '수술이나 입원 이력이 전혀 없고 오직 만성질환 약 복용만 있다면, 간편 고지 외에 일반 건강보험에 "할증"을 붙여 가입하는 것이 보장 한도가 더 넓고 유리할 수 있으므로 1:1 대조 분석이 필요합니다.'
            },
            {
              step: '04',
              title: '가입 후 반드시 "무사고 계약 전환" 권리 챙기기',
              desc: '가입 이후 병력이 생기지 않고 일정 기간이 경과하면 더 저렴한 건강 요금제로 변경해 주는 권리를 직접 행사해야 합니다. 보험사가 알아서 내려주지 않는 권리이니 반드시 달력에 표기하세요.'
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
            아파서 비싸게 가입하셨나요?<br />
            <span className="text-indigo-300">지금 유병자 맞춤 리모델링 지수를 무료 진단하세요!</span>
          </h3>
          <p className="text-xs text-indigo-200/70 font-semibold leading-relaxed">
            질문 3가지만 체크해 보세요. 6대 손해사의 병력 인수 조건과 우대 혜택을 분석하여 본인에게 최적화된 저렴하고 든든한 간편 요금을 산출해 드립니다.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={onAction}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 rounded-full font-black text-sm transition-all hover:bg-indigo-50 active:scale-95 shadow-2xl hover:shadow-indigo-500/20 group"
            >
              유병자 맞춤 보험 무료 진단하기
              <ChevronRight className="group-hover:translate-x-1.5 transition-transform text-indigo-900" size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
