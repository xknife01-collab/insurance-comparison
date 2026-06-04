import React from 'react';
import {
  PiggyBank, ShieldCheck, TrendingUp, Sparkles,
  CheckCircle, Clock, Quote, Compass, Gift
} from 'lucide-react';

interface Props {
  onAction?: () => void;
}

export const SavingsExplanation: React.FC<Props> = ({ onAction }) => (
  <section className="py-24 bg-emerald-50/10 px-4 relative overflow-hidden text-left" id="savings-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-emerald-200 shadow-sm">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            현명한 자산가를 위한 합법적 10년 비과세 복리 무기
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            소득세 15.4% 전액 면제받고,<br />
            <span className="text-emerald-600">월 복리로 굴러가는 복리 자산</span>을 축적하세요.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            비과세를 활용한 매년 합법적 절세와<br />
            원리금 보장 공시이율 및 유니버셜 기능을 통한 안정적 목돈 마련 가이드.
          </p>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '이자소득세 0%', label: '10년 유지 시 소득세 면제', sub: '일반 은행 이자소득세 15.4% 전액 비과세' },
          { num: '월 복리 부리', label: '단리 예적금 대비 자산 가속화', sub: '원금과 이자 전체에 다시 복리 이자 누적' },
          { num: '추가납입 200%', label: '수수료 없는 유니버셜 혜택', sub: '기본 납입액 외 추가 금액은 수수료 면제 적산' },
          { num: '예금자보호 5천만', label: '안전한 제도권 금융 자산', sub: '보험사별 1인당 최고 5,000만 원 원리금 보호' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-emerald-100 rounded-[3rem] p-8 text-center shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group">
            <p className="text-2xl font-black text-emerald-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 비과세 요건 핵심 */}
        <div className="bg-white rounded-[4rem] p-12 border border-emerald-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-emerald-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">저축보험 10년 비과세 세법 기준</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            세금을 아끼는 것이 재테크의 출발입니다.{' '}
            <span className="text-emerald-600 font-black">이자소득세를 단 1원도 내지 않는 비과세 요건</span>을 정리해 드립니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '적립식 납입 요건', label: '5년 이상 매달 납입 + 10년 이상 계좌 유지', color: 'bg-emerald-50/50 border-emerald-100', badge: 'text-emerald-700 bg-emerald-100', desc: '매월 정기적으로 불입하는 저축의 경우, 최소 5년 이상 꾸준히 납입하고 총 계약 기간을 10년 이상 유지하면 발생한 이자에 세금이 전혀 없습니다.' },
              { title: '적립식 납입 한도', label: '1인당 월 최대 150만 원 한도 제한', color: 'bg-teal-50/50 border-teal-100', badge: 'text-teal-700 bg-teal-100', desc: '모든 생명보험사에 가입한 적립식 저축보험의 총 월 불입금 합계가 150만 원 이하여야 비과세 요건을 채울 수 있습니다.' },
              { title: '일시납 거치 요건', label: '10년 이상 유지 + 총 납입액 1억 원 이하', color: 'bg-cyan-50 border-cyan-100', badge: 'text-cyan-700 bg-cyan-100', desc: '목돈을 한 번에 거치해 놓는 일시납의 경우, 10년 이상 유지하면 총 원금 1억 원 이하 한도 내에서 이자소득세가 전액 비과세 처리됩니다.' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
            <p className="text-emerald-700 font-black text-xs mb-1">⚠️ 초기 사업비 차감으로 인한 해지 리스크</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              저축보험은 가입 초기 약 3% ~ 5%의 수수료(사업비)가 먼저 차감된 후 나머지 금액에 대해 복리가 굴러갑니다. 따라서 **가입 후 1~2년 이내 단기 해지 시 원금 손실**이 날 수 있으므로 반드시 중장기 자산 증식 목적으로 운용하셔야 합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 사업비 절감 및 추가납입 꿀팁 */}
        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <PiggyBank className="w-56 h-56 text-emerald-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-emerald-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-emerald-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">추가납입 기능으로 사업비 절반 줄이기</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/10 rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-emerald-300 mb-2 flex items-center gap-2">
                  💡 기본납입 1 : 추가납입 2 규칙
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  저축보험의 추가 납입은 기본 보험료의 최대 200%까지 수수료(사업비) 차감 없이 월 복리로 즉시 굴러갑니다. 
                  예를 들어, **기본보험료를 10만 원만 가입하고 매월 20만 원을 추가납입**하면, 총 30만 원을 저축하면서 사업비는 10만 원 기준만 떼이므로 실질 수수료가 1/3로 극적으로 감소합니다.
                </p>
              </div>

              <div className="p-6 bg-teal-950/40 rounded-[2.5rem] border border-teal-500/20 hover:bg-teal-950/60 transition-colors">
                <p className="font-black text-teal-300 mb-2 flex items-center gap-2">
                  📲 대면 창구 대신 다이렉트 CM 채널
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  설계사 채널을 통해 가입하는 오프라인 저축보험은 사업비 비율이 5.5%~6.5%에 육박합니다. 반면, 인터넷으로 가입하는 **다이렉트(CM) 저축보험은 3.0%~3.9%대로 사업비 수수료가 최소화**되어 원금 복구 시점이 2배 이상 빨라집니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-emerald-400 font-black text-xs mb-1 uppercase tracking-widest">💡 플랫폼 자산운용 수석 연구원의 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "기준금리가 동결되거나 하락하더라도, 저축보험은 **'최저보증이율'**이라는 안전망이 있어 시중금리가 아무리 하락하더라도 평생 최소 0.75%~1.25% 이상의 이율을 보장하므로 장기 목돈 예치용으로도 훌륭한 대안입니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-emerald-100 rounded-[4rem] p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-500" /> 성공적인 저축보험 재테크 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 납입과 유지 기간 조율', desc: '10년 비과세를 채우기 위해 무리하게 납입 기간을 잡기보다는 납입은 5년으로 짧게 하고 거치를 5년 하여 10년을 채우는 방식 권장' },
              { step: '02. 추가납입 여유 자금 확보', desc: '수수료를 아끼기 위해 기본 계약은 예산의 1/3로 축소 설정하고 매달 추가납입 2배수를 자동이체 세팅' },
              { step: '03. 중도인출 및 납입 유예 확인', desc: '유동성 위기가 올 때 해지 대신 중도인출이나 일시 납입 유예(Universal) 기능이 포함된 상품인지 점검' },
              { step: '04. 최저보증이율 구간 확인', desc: '장기 유지 상품이므로 금리가 0%대로 폭락했을 때 보험사가 보증해 주는 최저이율이 얼마인지 비교 검토' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-emerald-50/30 rounded-3xl border border-emerald-100/50 hover:border-emerald-200 transition-colors">
                <div className="shrink-0 font-black text-emerald-700 text-sm w-32 text-left">{item.step}</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-emerald-600 text-white rounded-[3.5rem] p-10 shadow-xl text-left">
            <h4 className="text-xl font-black mb-4">비과세 극대화 핵심 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 월 적립 한도 150만 원 비과세 설계<br />
              ② 유지 기간 10년 기준 완벽하게 매칭<br />
              ③ 추가납입 제도를 활용한 실질 수수료 인하<br />
              ④ 다이렉트(CM) 상품 선택을 통한 초기 원금 회복 가속<br />
              ⑤ 시중금리 급락에 대비한 최저보증이율 안전망 확보
            </p>
          </div>
          <div className="bg-white border border-emerald-100 rounded-[3.5rem] p-10 shadow-sm hover:shadow-xl transition-all text-left">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-emerald-500 w-5 h-5" /> 장기 자산의 마법
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              이자에 이자가 붙는 복리는 시간이 무기입니다. 복리의 마법은 5년차 이후부터 기하급수적인 성장을 보이며, 10년 시점에 비과세 혜택까지 맞물릴 경우 은행 단리 대비 15%~20% 이상의 실수령 자산 차이를 만듭니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-emerald-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "불필요한 세금을 차단하고 자산 가치를 올리는 비과세의 힘,<br />
            <span className="text-emerald-600 font-black">체계적인 분석과 비과세 복리 설계를 통해 소중한 목돈 형성의 디딤돌을 놓아드립니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-emerald-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-emerald-700 transition-all hover:scale-105 shadow-2xl shadow-emerald-400/30 shrink-0"
          >
            내 비과세 저축 맞춤형 최적 절세 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);

export default SavingsExplanation;
