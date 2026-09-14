import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  PiggyBank, ShieldCheck, TrendingUp, Sparkles,
  CheckCircle, Clock, Quote, Compass, Gift
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const SavingsExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-emerald-50/10 px-2 sm:px-4 relative overflow-hidden text-left" id="savings-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-emerald-200 shadow-sm">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            10년 유지 시 비과세 혜택과 중장기 목돈 마련 플랜
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            세법상 비과세 요건 충족 시 소득세 면제,<br />
            <span className="text-emerald-600">공시이율 연동 복리 자산</span>을 형성하세요.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            비과세를 활용한 합법적 절세와<br />
            공시이율 복리 부리 및 유니버셜 기능을 통한 안정적 목돈 마련 가이드.
          </p>
        </div>
      </div>

      {/* ── 표준 산출 기준 및 은행 예·적금과의 차이점 사전 고지 ── */}
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 md:p-8 mb-12 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1 text-xs text-slate-600 font-bold leading-relaxed">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-md">
                필수 안내사항
              </span>
              <span className="text-slate-800 font-black text-sm">
                저축보험 가입 시 핵심 법적 유의사항 (은행 예·적금과의 차이)
              </span>
            </div>
            <p className="text-slate-700">
              * 본 비교 안내 화면의 보험료 및 예상 해약환급금 예시는 <strong>[가입기준: 40세 남성 / 월 납입액 30만 원 / 5년 납입 10년 만기 / 공시이율(매월 변동 가능) 가정]</strong>을 기준으로 산출된 단순 참고용 예시이며, 실제 적립액은 보험사별 공시이율 변동 및 계약체결비용(사업비) 차감 수준에 따라 달라집니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
              <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                <span className="text-rose-700 font-black">⚠️ 은행 예·적금과의 차이 및 원금 손실 위험:</span> 저축보험은 은행의 예금·적금과 다른 보험 상품입니다. 납입 보험료에서 <strong>계약체결비용(사업비) 및 위험보험료가 차감된 후 적립</strong>되므로, 가입 초기 중도 해약 시 <strong>해약환급금이 납입원금에 미달하여 원금 손실</strong>이 발생할 수 있습니다.
              </div>
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                <span className="text-emerald-700 font-black">⚖️ 10년 비과세 요건 (소득세법 시행령 제25조):</span> 적립식 저축보험의 경우 <strong>5년 이상 납입하고 10년 이상 유지하며, 1인당 월 납입액 합계 150만 원 이하</strong>(일시납은 1억 원 이하) 요건을 충족해야만 이자소득세(15.4%)가 전액 비과세 처리됩니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '이자소득세 0%', label: '10년 유지 시 비과세 혜택', sub: '소득세법 요건 충족 시 이자소득세 15.4% 면제' },
          { num: '공시이율 복리', label: '공시이율 연동 복리 적립', sub: '사업비 공제 후 적립금에 월 복리 부리 운용' },
          { num: '추가납입 기능', label: '약관에 따른 유니버셜 기능', sub: '기본 납입액 외 추가납입으로 사업비 절감 효과' },
          { num: '예금자보호 5천만', label: '예금자보호법 적용 상품', sub: '보험사별 1인당 최고 5,000만 원 원리금 보호' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-emerald-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group">
            <p className="text-2xl font-black text-emerald-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 비과세 요건 핵심 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-emerald-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-emerald-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">저축보험 10년 비과세 세법 기준</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            세금을 아끼는 것이 재테크의 출발입니다.{' '}
            <span className="text-emerald-600 font-black">세법상 정해진 10년 이상 비과세 핵심 요건</span>을 정리해 드립니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '적립식 납입 요건', label: '5년 이상 매달 납입 + 10년 이상 계좌 유지', color: 'bg-emerald-50/50 border-emerald-100', badge: 'text-emerald-700 bg-emerald-100', desc: '매월 정기적으로 불입하는 저축의 경우, 최소 5년 이상 꾸준히 납입하고 총 계약 기간을 10년 이상 유지하면 발생한 이자에 세금이 전혀 없습니다.' },
              { title: '적립식 납입 한도', label: '1인당 월 최대 150만 원 한도 제한', color: 'bg-teal-50/50 border-teal-100', badge: 'text-teal-700 bg-teal-100', desc: '모든 생명보험사에 가입한 적립식 저축보험의 총 월 불입금 합계가 150만 원 이하여야 비과세 요건을 채울 수 있습니다.' },
              { title: '일시납 거치 요건', label: '10년 이상 유지 + 총 납입액 1억 원 이하', color: 'bg-cyan-50 border-cyan-100', badge: 'text-cyan-700 bg-cyan-100', desc: '목돈을 한 번에 거치해 놓는 일시납의 경우, 10년 이상 유지하면 총 원금 1억 원 이하 한도 내에서 이자소득세가 전액 비과세 처리됩니다.' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 w-full sm:w-24 text-center ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm break-keep">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
            <p className="text-emerald-700 font-black text-xs mb-1">⚠️ 초기 사업비 차감으로 인한 해지 리스크</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              저축보험은 가입 초기 약 3% ~ 5%의 수수료(사업비)가 먼저 차감된 후 나머지 금액에 대해 복리가 굴러갑니다. 따라서 **가입 후 1~2년 이내 단기 해지 시 원금 손실**이 날 수 있으므로 반드시 중장기 자산 증식 목적으로 운용하셔야 합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 사업비 절감 및 추가납입 꿀팁 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <PiggyBank className="w-56 h-56 text-emerald-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-emerald-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">추가납입 기능으로 사업비 절감 효과</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-emerald-300 mb-2 flex items-center gap-2">
                  💡 기본납입 1 : 추가납입 2 규칙
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  저축보험의 추가 납입은 기본 보험료의 최대 200%까지 활용 가능하며, 기본 보험료 대비 수수료(사업비) 부과율이 낮아 전체적인 실질 사업비 절감에 도움이 됩니다.
                  예를 들어, 기본 계약을 적정선으로 가입하고 추가납입을 병행하면 동일한 총 저축액 대비 환급률 도달 시점을 단축하는 데 유리합니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-teal-950/40 rounded-2xl md:rounded-[2.5rem] border border-teal-500/20 hover:bg-teal-950/60 transition-colors">
                <p className="font-black text-teal-300 mb-2 flex items-center gap-2">
                  📲 대면 창구 대신 다이렉트 CM 채널
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed mb-2">
                  인터넷으로 직접 가입하는 다이렉트(CM) 저축보험은 오프라인 채널 대비 사업비 차감율이 낮아 초기 해약환급금의 원금 도달 시점을 앞당기는 데 유리합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-emerald-400 font-black text-xs mb-1 uppercase tracking-widest">💡 플랫폼 자산운용 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "저축보험은 시중금리가 하락하더라도 경과기간별 약관에 명시된 최저보증이율(예: 5년 이하 1.25%, 10년 이하 1.0% 등) 안전망이 적용되므로, 장기 목돈 마련 플랜 시 안정적인 최저 한도를 점검하시는 것이 좋습니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-emerald-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-500" /> 성공적인 저축보험 재테크 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 납입과 유지 기간 조율', desc: '10년 비과세를 채우기 위해 무리하게 납입 기간을 잡기보다는 납입은 5년으로 짧게 하고 거치를 5년 하여 10년을 채우는 방식 권장' },
              { step: '02. 추가납입 여유 자금 확보', desc: '수수료를 아끼기 위해 기본 계약은 예산에 맞춰 설정하고 매달 추가납입 제도를 적극 활용 세팅' },
              { step: '03. 중도인출 및 납입 유예 확인', desc: '유동성 위기가 올 때 해지 대신 중도인출이나 일시 납입 유예(Universal) 기능이 포함된 상품인지 점검' },
              { step: '04. 최저보증이율 구간 확인', desc: '장기 유지 상품이므로 금리가 하락했을 때 보험사가 보증해 주는 기간별 최저이율이 얼마인지 비교 검토' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-emerald-50/30 rounded-3xl border border-emerald-100/50 hover:border-emerald-200 transition-colors">
                <div className="shrink-0 font-black text-emerald-700 text-sm w-32 text-left">{item.step}</div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-emerald-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl text-left">
            <h4 className="text-xl font-black mb-4">비과세 극대화 핵심 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 월 적립 한도 150만 원 비과세 설계<br />
              ② 유지 기간 10년 기준 안정적으로 매칭<br />
              ③ 추가납입 제도를 활용한 실질 수수료 인하<br />
              ④ 다이렉트(CM) 상품 선택을 통한 초기 원금 회복 가속<br />
              ⑤ 시중금리 급락에 대비한 최저보증이율 안전망 확보
            </p>
          </div>
          <div className="bg-white border border-emerald-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all text-left">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-emerald-500 w-5 h-5" /> 장기 자산의 마법
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              이자에 이자가 붙는 복리는 장기 유지가 핵심입니다. 복리 부리 효과는 5년차 이후부터 점진적으로 확대되며, 10년 이상 유지 시 비과세 혜택까지 적용되어 실질 수령액 측면에서 장기 자산 형성에 유리합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 법적 고지 및 소비자 유의사항 (금소법 제19조 준수) ── */}
      <div className="mb-20 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-2">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          금융소비자보호법 제19조에 따른 법적 고지 및 유의사항
        </p>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-600 font-medium">
          <li>본 안내는 특정 금융상품의 청약을 권유하거나 확정하는 것이 아니며, 생명보험협회 공시자료를 기초로 한 단순 비교 정보입니다.</li>
          <li>보험계약 체결 전 반드시 해당 상품의 약관 및 상품설명서를 면밀히 확인하시기 바랍니다.</li>
          <li>보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결할 경우, 인수가 거절되거나 보험료가 인상될 수 있으며 보장 내용이 달라질 수 있습니다.</li>
          <li>저축보험은 은행의 예·적금과 달리 납입보험료에서 계약체결비용(사업비) 및 위험보험료를 차감한 잔액이 적립되므로, <strong>중도 해지 시 지급되는 해약환급금은 납입원금에 미달</strong>할 수 있습니다.</li>
          <li>적용 공시이율은 매월 변동될 수 있으며, 시중금리가 하락하더라도 약관상 규정된 경과기간별 최저보증이율이 적용됩니다.</li>
          <li>비과세 혜택은 소득세법 시행령 제25조에 규정된 요건(10년 이상 유지, 월납 150만 원 이하 등) 충족 시 적용되며, 세법 개정에 따라 기준이 변동될 수 있습니다.</li>
          <li>본 금융상품은 예금자보호법에 따라 예금보험공사가 보호하되, 보호한도는 본 보험회사에 있는 귀하의 모든 예금보호 대상 금융상품의 해약환급금(또는 만기 시 보험금이나 사고보험금)에 기타지급금을 합하여 1인당 "최고 5천만 원"이며, 5천만 원을 초과하는 나머지 금액은 보호하지 않습니다.</li>
        </ul>
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
            저축보험 실시간 비교 상담하기
          </button>
        )}
      </div>

    </div>
  </section>
);

export default SavingsExplanation;
