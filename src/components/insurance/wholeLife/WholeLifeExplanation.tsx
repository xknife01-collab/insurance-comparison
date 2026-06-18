import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Heart, ShieldCheck, Activity, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle,
  TrendingUp, Coins, PiggyBank, Scale
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const WholeLifeExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-indigo-50/10 px-2 sm:px-4 relative overflow-hidden animate-in fade-in duration-500" id="wholelife-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-indigo-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            유가족 안심 보장부터 상속세 절세 재원 마련까지
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            가족을 위한 마지막 안전망인 종신보험,<br />
            <span className="text-indigo-600">올바른 설계 기준과 세무 구조</span>를 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            단기납 종신을 통한 비과세 장기 자산 가치 극대화와<br />
            체증형 보장 옵션을 이용한 물가상승(인플레이션) 대응 최적 가이드.
          </p>
        </div>
      </div>

      {/* ── 핵심 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '단기 완납 트렌드', label: '5년/7년/10년 단기 납입', sub: '경제 활동기 집중 불입 완료 구조' },
          { num: '저해지 18% 즉시할인', label: '일반형 대비 보험료 절감', sub: '중도 해지 금지 및 완납 보너스 매칭' },
          { num: '체증형 물가방어', label: '사망금 연 5% 복리 증액', sub: '인플레이션 화폐가치 하락 위험 방어' },
          { num: '상속세 절세 세팅', label: '계약자(자녀) 피보험자(부모)', sub: '상속재산 배제로 상속세 100% 비과세' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-indigo-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
            <p className="text-2xl font-black text-indigo-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 필수 핵심 3대 체크 포인트 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-indigo-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-indigo-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">필수 체크 3대 핵심 보장</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            사랑하는 가족을 위해 사망 보장 금액을 든든하게 확보함과 동시에,{' '}
            <span className="text-indigo-600 font-black">중장기 복리 비과세 혜택을 온전히 누리기 위한 핵심 설계 조건</span>
            입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '단기납 설계', label: '소득 전성기에 빠르게 납입을 마치는 구조', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '5년납, 7년납, 10년납 단기완납형으로 매년 갱신되는 불입 의무를 제거하고 중장기 이자 비과세 효과를 노립니다.' },
              { title: '체증형 옵션', label: '물가상승 시 보장 실질 가치를 늘려 지킴', color: 'bg-emerald-50/50 border-emerald-100', badge: 'text-emerald-700 bg-emerald-100', desc: '일반 정액형은 20년 뒤 가치가 반토막 납니다. 만 60세부터 연 5%씩 20년간 사망금이 체증하는 상품을 우대합니다.' },
              { title: '상속세 재원', label: '부동산/비유동 자산 보유 시 유가족 세금 방어', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '상속세는 9개월 이내 현금 납부 의무가 있어, 사망보험금을 즉각적인 세금 세원 및 유가족 안심 생활비로 활용합니다.' },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-5 rounded-3xl border ${item.color}`}>
                <div className={`text-[11px] font-black px-3 py-1.5 rounded-xl shrink-0 w-full sm:w-24 text-center ${item.badge}`}>{item.title}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm break-keep">{item.label}</p>
                  <p className="text-[11px] text-slate-400 font-bold break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-rose-50 rounded-3xl border border-rose-100">
            <p className="text-rose-700 font-black text-xs mb-1">⚠️ 저해지 환급형 가입 시 주의사항</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              저해지/무해지 환급형은 동일 사망보장 대비 월 납입 보험료가 약 15~18% 저렴하지만, **납입 기한 도중 해약할 경우 해약환급금이 0원이거나 납입원금의 10% 미만**에 불과합니다. 반드시 무리하지 않는 여유자금 한도에서 완납을 전제로 가입해야 합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 상속세 절세 계약 구조 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Heart className="w-56 h-56 text-indigo-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-indigo-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">상속세 과세 제외를 위한 3중 설계 구조</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-indigo-300 mb-2 flex items-center gap-2">
                  🚫 잘못된 계약 구조 (부모가 계약 및 납입)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  부모님이 계약자이자 납입자가 되어 종신보험에 가입하고 사후에 자녀가 사망보험금을 받으면, 국세청은 이를 **‘간주상속재산’**으로 보아 상속세를 고율 과세하게 됩니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-indigo-600/20 rounded-2xl md:rounded-[2.5rem] border border-indigo-400/30 hover:bg-indigo-500/30 transition-colors">
                <p className="font-black text-indigo-300 mb-2 flex items-center gap-2">
                  🛡️ 합법적 절세 구조 (계약자/수익자 = 자녀)
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  **‘계약자: 자녀’**, **‘피보험자: 부모’**, **‘수익자: 자녀’**로 설정하고, 자녀가 독립된 소득 증빙을 통하여 직접 월 보험료를 실 납입한 기록이 입증될 경우, 지급되는 사망보험금은 상속세 비과세 대상이 됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-indigo-400 font-black text-xs mb-1 uppercase tracking-widest">💡 자금 출처 조사의 핵심 팁</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "자녀가 미성년자이거나 무자력자일 경우, 납입된 보험료가 부모의 간접 증여로 간주될 위험이 큽니다. 따라서 사전에 합법적인 연간 5천만 원(성인 자녀 기준) 증여공제 한도 내에서 현금 증여 신고 후 자녀 명의 계좌에서 계좌 이체 납입하는 방식의 고도화 세무 처리가 필수적입니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 연금 전환 및 건강 특약 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-indigo-400/30">
              <Sparkles className="w-3 h-3" /> 최신 종신보험 가치 동향
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">연금 전환 특약 및 건강인 우대 제도</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              최신 종신보험은 가장의 경제적 책임 기간(활동기)에는 사망 보장 자산으로 든든하게 지켜주며, 자녀 독립 후 노후 자금이 필요할 때 해약환급금 전액 혹은 일부를 연금 자산으로 즉시 전환하는 옵션(경험생명표 연동)과 비흡연/정상혈압 우량체 대상의 대규모 할인 특약을 적극 도입하고 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '건강인 할인제도', product: '비흡연/혈압/BMI 조건 만족 시', limit: '보험료 5% ~ 10% 추가 할인', note: '가입 전 건강검진 결과를 제출하여 승인 시 매달 보험료 우량체 감면 적용' },
              { company: '연금 전환 연동형', product: '해약환급금 기반 연금 수령 전환', limit: '노후 평생 연금액 분할 환산', note: '자녀 독립 등으로 사망보장 필요성 상실 시 노후 연금 재원으로 일괄 피팅' },
              { company: '완납 보너스 적립형', product: '납입 기간 완료 시 가산 보너스', limit: '원금 대비 120%대 환급률 형성', note: '해약 보장과 장기 고복리 저축의 장점을 조화시킨 1석 2조 하이브리드' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-indigo-300 text-xs font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-indigo-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-indigo-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-indigo-500" /> 종신보험 리모델링 스마트 가입 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 납기 기간 적절성', desc: '은퇴 시점 이전에 납입이 든든하게 종료될 수 있도록 20년납보다는 5~10년 이내의 단기완납 플랜 설정' },
              { step: '02. 실질 가치 평가', desc: '정액 종신보험의 경우, 인플레이션에 따른 20~30년 후 화폐 가치 폭락을 상쇄할 체증형 특약 가입 검토' },
              { step: '03. 세무 리스크 크로스체크', desc: '상속세 비과세 요건을 채우기 위한 자녀 계좌 실 납입 소득출처와 증여 자진신고 상태 사전 대조' },
              { step: '04. 연금 전환 조건 비교', desc: '전환 시점에 적용되는 경험생명표가 가입 시점 기준인지, 아니면 전환 시점 기준인지 세밀히 체크' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-indigo-50/30 rounded-3xl border border-indigo-100/50 hover:border-indigo-200 transition-colors">
                <div className="shrink-0 font-black text-indigo-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-indigo-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">종신보험 리모델링 핵심 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 소득 전성기에 빠르게 마치는 5/7/10년납 권장<br />
              ② 저해지/무해지 선택으로 보험료 18% 즉시할인<br />
              ③ 상속세 비과세는 [계약자 자녀, 피보험자 부모] 매칭<br />
              ④ 만 60세부터 연 5% 복리 증가하는 체증형 고려<br />
              ⑤ 완납 후 10년 시점의 비과세 환급률 한도 비교
            </p>
          </div>
          <div className="bg-white border border-indigo-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-indigo-500 w-5 h-5" /> 가입 최적 시기
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              사망 위험률 책정 기준상 연령이 낮을수록 납입 원금이 크게 내려가므로, 가장의 책임 개시 연령대인 30대 중반~40대 초반이 가입의 골든타임입니다. 고령 가입 시에는 무심사 간편 종신을 대조 활용해야 합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-indigo-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 Top 6 보험사 단기납/체증형 종신보험 상품 경쟁력 전수 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '신한라이프', product: '신한더아름다운종신보험', highlight: '단기납 환급 보너스 적립률 업계 상위권 설계 가능, 5년/7년 단기 구조에 우수한 환급 테이블 강점', badges: ['단기납 특화', '환급 효율성 우수'] },
            { company: '삼성생명', product: '삼성든든종신보험', highlight: '압도적인 자산 운용 규모와 재무 안정성으로 평생 사망 보험 상속 신뢰도 1위, 헬스케어 인프라 완비', badges: ['안정성 1위', '자산상속 특화'] },
            { company: '한화생명', product: '한화시그니처종신보험', highlight: '체증형 개시 나이를 가입자 성향에 맞추어 자유로운 맞춤 포지셔닝 가능, 납입면제 특약 범위 폭넓음', badges: ['체증형 강점', '납입면제 우대'] },
            { company: '교보생명', product: '교보더든든종신보험', highlight: '가입금액별 대규모 우량체 할인 및 1대1 주치의 메디컬 케어 서비스 연계 지원 등 풍부한 서비스 패키지', badges: ['우량체 우대', '헬스케어 결합'] },
            { company: '동양생명', product: '수호천사종신보험', highlight: '저해지 환급 조건 설계 시 최저 가성비 요율 테이블 구현, 일반 종합 건강 특약 동시 조립 조화', badges: ['가성비 강점', '특약 조립 유연'] },
            { company: 'KDB생명', product: 'KDB든든단기납종신', highlight: '납입 기간 완료 시점의 책임준비금 및 계약 유지 가산율을 극대화하여 10년 비과세 환급 가치 최적화', badges: ['유지보너스 최상', '환급 가치 우대'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-indigo-50/20 rounded-2xl md:rounded-[2.5rem] border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-indigo-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200"
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
      <div className="border-t border-indigo-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "가족의 사랑을 가장 가치 있고 확실하게 남기는 방법,<br />
            <span className="text-indigo-600">철저한 비교 분석과 절세 법률 구조 설계를 통해 종신보험을 리모델링하세요.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-indigo-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-indigo-700 transition-all hover:scale-105 shadow-2xl shadow-indigo-400/30 shrink-0"
          >
            종신 보장 자산 무료 진단하기
          </button>
        )}
      </div>

    </div>
  </section>
);
