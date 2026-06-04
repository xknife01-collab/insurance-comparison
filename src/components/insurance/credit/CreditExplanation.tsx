import React from 'react';
import {
  Coins, ShieldCheck, Activity, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle, Scale
} from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const CreditExplanation: React.FC<Props> = ({ onAction }) => (
  <section className="py-24 bg-blue-50/10 px-4 relative overflow-hidden" id="credit-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            유고 시 대출금이 가족에게 빚 대물림되지 않도록 지키는 신용 자산 안전장치
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            소득 상실 및 투병 중 대출 연체 걱정 끝,<br />
            <span className="text-blue-600">안심 대출상환 보장보험의 정석</span>을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            사망, 3대 중대 질병 진단 시 대출금 전액 대위변제!<br />
            NICE/KCB 우량 신용 점수에 따라 최대 10% 주계약 보험료 추가 할인 혜택 매칭.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '신용점수 연계 할인', label: 'NICE/KCB 등급별 자동 감면', sub: '3% ~ 최대 10% 보험료 영구 할인' },
          { num: '대출금 한도 일치', label: '실제 잔액 한도 매칭 가입', sub: '부정 수급 목적의 초과 가입 원천 차단' },
          { num: '대위변제 프로세스', label: '지급처가 가입자 아닌 은행', sub: '중도 횡령 불가, 빚 전액 소거 집중' },
          { num: '연체 리스크 방어', label: '신용도 폭락 예방 안전판', sub: '사망/장해/3대 질병 시 채무 완납' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-blue-100 rounded-[3rem] p-8 text-center shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
            <p className="text-2xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 도덕적 해이 및 부정 가입 원천 방어막 */}
        <div className="bg-white rounded-[4rem] p-12 border border-blue-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">도덕적 해이와 악용 방지 장치</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            "가입자가 빚을 갚기 싫어서 일부러 악용하거나 부정 수급을 시도하는 시나리오는{' '}
            <span className="text-blue-600 font-black">금융 시스템 및 보험 약관상 엄격하게 차단</span>되어 있습니다."
          </p>

          <div className="space-y-3">
            {[
              { title: '은행 직접 대위변제', label: '보험금 수령인은 가입자가 아닌 은행(채권자)', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '유고 발생 시 가입자나 유족의 손을 거치지 않고, 보험사가 채권 기관인 은행으로 직접 대출금을 송금하여 빚을 청산합니다. 사적으로 횡령하거나 다른 데로 유용할 여지가 전혀 없습니다.' },
              { title: '고의 자살 면책 (2년)', label: '가입 후 2년 이내의 자살 및 고의 사고 면책', color: 'bg-amber-50/50 border-amber-100', badge: 'text-amber-700 bg-amber-100', desc: '생명보험 표준약관에 따라 가입일로부터 2년 이내에 스스로 목숨을 끊거나 고의로 발생시킨 상해는 보험금이 단 1원도 지급되지 않으며 즉각 면책 및 계약 무효 처리됩니다.' },
              { title: '가입 한도 잔액 연동', label: '본인이 보유한 실제 대출 잔액 범위 내 가입', color: 'bg-yellow-50 border-yellow-100', badge: 'text-yellow-700 bg-yellow-100', desc: '대출금 한도를 초과하는 과잉 보장 설계가 원천 금지됩니다. 대출이 중도 상환되어 잔액이 낮아지면 보장 한도 역시 비례하여 낮아지기 때문에, 보험을 통한 현금성 초과 이득이 불가능합니다.' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 mt-0.5 ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm mb-1">{item.label}</p>
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-blue-700 font-black text-xs mb-1">⚠️ 가입 심사 및 대기기간 (Underwriting)</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              이미 걸린 질병이 있는 상태에서 거액의 대출을 일으킨 뒤 가입하는 악용을 방지하기 위해 중대 질병(암 등) 보장 특약은 **가입 후 90일 동안 면책 대기기간**이 적용되며, 심각한 유병 상태의 경우에는 언더라이팅에서 승인이 거절됩니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 신용보험이 작동하는 3단계 안심 구조 */}
        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Coins className="w-56 h-56 text-blue-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-blue-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">신용대출 상환보험의 3대 안전망</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  🏦 대위변제를 통한 유가족 빚 대물림 방지
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  갑작스러운 사고로 가장이 유고 상태가 되었을 때, 담보로 잡은 소중한 내 집이 경매에 넘어가거나 가족들이 수억 원의 빚더미를 고스란히 양도받아 신용 불량 상태에 빠지는 비극을 미연에 방지합니다.
                </p>
              </div>

              <div className="p-6 bg-blue-600/20 rounded-[2.5rem] border border-blue-400/30 hover:bg-blue-600/30 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  🏥 중대 질병 및 고도후유장해 시 채무 상환 대행
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  가장에게 암, 뇌출혈, 급성심근경색증 등 3대 질병이 발생하거나 50% 이상의 고도후유장해 상태가 될 경우, 소득 단절로 인한 대출 연체를 예방하기 위해 보험회사가 남은 채무액을 완납 대행합니다.
                </p>
              </div>

              <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  📉 신용생명지수 우량 시 최대 10% 보험료 할인
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  NICE평가정보 및 KCB 등의 데이터를 연동하여 우량 등급인 고객들에게 주계약 보험료를 매년 지속적으로 할인해 주며, 신용 관리를 통해 등급이 상승하면 추가 할인율이 매칭 적용됩니다. (신용 하락 시 보험료 할증 없음)
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-blue-400 font-black text-xs mb-1 uppercase tracking-widest">💡 대출자 맞춤 설계 요령</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "주택담보대출처럼 원리금 규모가 크고 상환 기간이 긴 대출을 실행할 때는 단순히 사망 보장뿐만 아니라 **3대 질병 진단 상환 특약**과 **고도장해 보장 특약**을 함께 조립하여 빈틈없는 재무 리스크 방어벽을 세우시는 것이 정석입니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 핀테크 플랫폼 제어 및 갱신 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[4rem] p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-400/30">
              <Sparkles className="w-3 h-3" /> 최신 핀테크 연계 동향
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">대출 비교 플랫폼과 실시간 보험가입 연계 트렌드</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              정부의 서민금융 안정화 기조에 맞춰, 최근 토스·핀다·카카오페이 등 대출 비교 앱에서 대출을 승인받은 즉시 해당 대출 정보가 보험사에 자동 송신되어 복잡한 확인 서류 입력 없이 **0.1초 만에 개인 맞춤 신용보험 가입**이 가능해졌습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '실시간 신용 점수 조회', product: 'NICE / KCB 등급 연동', limit: '3% ~ 10% 보험료 추가 할인', note: '가입 시 인증 한 번으로 실시간 개인 신용 구간을 판정하여 자동 혜택 연동' },
              { company: '무이자 분할 청약제도', product: '대출 분납 주기 매칭 청구', limit: '보험료 대출금에 일시 가산/분납', note: '가입 시 월납 방식 외에 대출 이자와 함께 납부하도록 설정 가능' },
              { company: '비대면 다이렉트 가입', product: '복잡한 건강 진단 전면 생략', limit: '대출 계약번호 확인 시 즉시 승인', note: '대출이 이미 승인된 고객의 경우 가입 문턱을 대폭 완화하여 신속 보장' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {item.company}{' '}
                    <span className="text-blue-300 text-xs font-bold ml-1">{item.product}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{item.note}</p>
                </div>
                <p className="font-black text-blue-400 text-sm shrink-0 ml-4">{item.limit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-blue-100 rounded-[4rem] p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600" /> 합리적 신용보험 스마트 설계 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 대출 원리금 일치', desc: '현재 본인의 잔여 대출 원금과 상환 기간을 정확히 대조하여 중복/초과 보험료 방지' },
              { step: '02. 자살 면책 조항 인지', desc: '생명보험 특성상 계약 후 2년 이내의 고의 자해 및 극단 선택은 전액 면책됨을 확인' },
              { step: '03. 중대질병 보장 추가', desc: '단순 사망 외에 암/뇌/심장 투병으로 발생할 수 있는 대출 상환 마비 사태 방지 특약 검토' },
              { step: '04. 신용생명지수 재확인', desc: '매년 신용 점수를 갱신하여 점수가 상승했을 때 보험사에 할인율 재지정 신청' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50 hover:border-blue-200 transition-colors">
                <div className="shrink-0 font-black text-blue-700 text-sm w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-blue-600 text-white rounded-[3.5rem] p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">신용보험 가입 핵심 가이드</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 대출 승인 즉시 가입 시 요율 우대<br />
              ② 주계약 보험금은 항상 은행으로 자동 배정<br />
              ③ NICE/KCB 등급에 맞추어 연계 할인 획득<br />
              ④ 사망에 고도장해 상환 특약 세트로 조립<br />
              ⑤ 중도 대출 전액 상환 시 해약 및 즉시 환급
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-[3.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-blue-500 w-5 h-5" /> 가입 최적 시점
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              주택담보대출 또는 고액 신용대출을 새로 실행하는 즉시가 가입 최적기입니다. 시간이 흐른 뒤 건강 악화나 신용 불량 연체가 발생한 상태에서는 가입 승인이 심사 거절되므로 대출금 수령 당일 함께 가입하는 것이 원칙입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-[4rem] p-12 border border-blue-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 주요 대출안심 신용보험(대출상환보장) 상품 핵심 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: 'BNP파리바 카디프생명', product: '대출안심 신용생명보험', highlight: '국내 대표 1위 신용보험 상품, 신용생명지수 할인 특약 탑재로 최저 3%~최대 10% 보험료 감면 제공', badges: ['시장 선두 대표상품', '신용지수 할인'] },
            { company: '메트라이프생명', product: '신용대출 상환 정기보험', highlight: '사망 보장에 고도후유장해 상환 특약 집중 결합 가능, 연령층 대비 실속 있는 주계약 사망 설계 지원', badges: ['정기 보장 강점', '고도장해 보장'] },
            { company: 'BNP파리바 카디프생명', product: '대출안심 보장보험 (다이렉트)', highlight: '핀테크 채널(토스 등) 전용 간편 다이렉트 가입 플랜, 0.1초 신용 데이터 연동 및 초간편 즉시 청약 승인', badges: ['모바일 특화', '0.1초 즉시 승인'] },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-blue-50/20 rounded-[2.5rem] border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-blue-600 mb-1">{item.company}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{item.product}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{item.highlight}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-blue-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "가장 힘든 순간, 남겨진 가족에게 빚이 아닌 일상을 돌려주는 약속.<br />
            <span className="text-blue-600">안전한 자산 보호와 투명하고 깨끗한 상환 솔루션을 위해 신용보험 비교 분석을 지금 체험해 보세요.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-blue-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-2xl shadow-blue-400/30 shrink-0"
          >
            내 대출 맞춤 신용보험 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
