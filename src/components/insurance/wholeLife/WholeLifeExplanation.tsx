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
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
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
            경제 활동기 내 납입을 조기 완료하는 단기납 종신보험과<br />
            체증형 보장 옵션을 이용한 물가상승(인플레이션) 대응 최적 가이드.
          </p>
        </div>
      </div>

      {/* ── 보장성 보험 명확화 (금감원 소비자경보) 및 표준 산출 기준 고지 ── */}
      <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 mb-12 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1 text-xs text-slate-600 font-bold leading-relaxed">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-100 text-rose-800 text-[11px] font-black px-2.5 py-1 rounded-md">
                금융감독원 소비자경보
              </span>
              <span className="text-slate-800 font-black text-sm">
                종신보험 가입 시 핵심 법적 유의사항 (저축성 오인 방지)
              </span>
            </div>
            <p className="text-slate-700">
              * <strong>종신보험은 피보험자의 사망을 보장하는 순수 보장성 보험이며, 은행 저축이나 재테크 목적의 상품이 아닙니다.</strong> 본 화면의 보장 및 해약환급금 예시는 <strong>[가입기준: 40세 남성 / 주계약 사망보험금 1억 원 / 20년 납입(또는 10년 납입) / 해약환급금 일부지급형(저해지) / 표준체 가정]</strong>을 기준으로 산출된 단순 참고용 예시입니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
              <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                <span className="text-rose-700 font-black">⚠️ 무·저해지환급형 해약 리스크:</span> 저해지/무해지 환급형 상품은 동일 사망보장 대비 보험료가 저렴한 대신, <strong>납입기간 중 해지할 경우 해약환급금이 전혀 없거나(0원) 표준형 대비 현저히 적어 큰 원금 손실</strong>이 발생합니다.
              </div>
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
                <span className="text-indigo-700 font-black">⚖️ 사망보험금 면책 사유 고지:</span> 피보험자가 <strong>보험계약일(또는 부활일)로부터 2년 이내에 고의로 자신을 해친 경우(자살 등)</strong> 또는 계약자/수익자가 고의로 피보험자를 해친 경우에는 약관상 사망보험금이 지급되지 않습니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 핵심 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '단기 완납 플랜', label: '5년/7년/10년 단기 납입', sub: '경제 활동기 내 불입 완료로 은퇴 후 부담 완화' },
          { num: '저해지형 요율', label: '일반형 대비 보험료 절감', sub: '완납 유지 전제 시 합리적 사망보험료 설계' },
          { num: '체증형 물가방어', label: '사망금 연 5% 점진적 체증', sub: '인플레이션에 따른 실질 보장 가치 방어' },
          { num: '상속세 재원 활용', label: '계약자(자녀) 피보험자(부모)', sub: '유가족 상속세 납부 재원 확보 목적 매칭' },
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
            <span className="text-indigo-600 font-black">은퇴 이후 경제적 공백 없이 유가족의 안정적 생계를 지키기 위한 핵심 설계 조건</span>
            입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '단기납 설계', label: '소득 전성기에 빠르게 납입을 마치는 구조', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '5년납, 7년납, 10년납 단기완납형으로 은퇴 후 보험료 불입 부담을 없애고 계약 유지를 용이하게 합니다.' },
              { title: '체증형 옵션', label: '물가상승 시 보장 실질 가치를 늘려 지킴', color: 'bg-emerald-50/50 border-emerald-100', badge: 'text-emerald-700 bg-emerald-100', desc: '일반 정액형은 20년 뒤 가치가 하락할 수 있어, 만 60세부터 연 5%씩 20년간 사망금이 체증하는 상품을 고려합니다.' },
              { title: '상속세 재원', label: '부동산/비유동 자산 보유 시 유가족 세금 방어', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '상속세는 6개월 이내 현금 납부 의무가 있어, 사망보험금을 즉각적인 세금 납부 재원 및 유가족 안심 생활비로 활용합니다.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-5 rounded-3xl border ${item.color}">
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
              저해지/무해지 환급형은 동일 사망보장 대비 월 납입 보험료가 약 15~18% 저렴하지만, **납입 기한 도중 해약할 경우 해약환급금이 0원이거나 납입원금 대비 현저히 적어 막대한 원금 손실**이 발생합니다. 반드시 중도 해지 없이 만기 유지가 가능한 여유자금 범위에서 가입해야 합니다.
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
                <h3 className="text-3xl font-black tracking-tight">상속세 과세 제외를 위한 계약 구조</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-indigo-300 mb-2 flex items-center gap-2">
                  🚫 부모가 계약 및 납입한 경우
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  부모님이 계약자이자 납입자가 되어 종신보험에 가입하고 사후에 자녀가 사망보험금을 받으면, 세법상 이를 **‘간주상속재산’**으로 보아 상속세 과세 대상에 포함됩니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-indigo-600/20 rounded-2xl md:rounded-[2.5rem] border border-indigo-400/30 hover:bg-indigo-500/30 transition-colors">
                <p className="font-black text-indigo-300 mb-2 flex items-center gap-2">
                  🛡️ 자녀가 계약자이자 실납입자인 구조
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  **‘계약자: 자녀’**, **‘피보험자: 부모’**, **‘수익자: 자녀’**로 설정하고, 자녀가 독립된 소득 증빙을 통하여 직접 월 보험료를 실 납입한 사실이 객관적으로 입증될 경우, 수령하는 사망보험금은 상속세 과세 대상에서 제외될 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-indigo-400 font-black text-xs mb-1 uppercase tracking-widest">💡 자금 출처 조사의 핵심 체크포인트</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "자녀가 미성년자이거나 독립 소득이 없는 무자력자일 경우, 납입된 보험료가 부모의 간접 증여로 추정될 수 있습니다. 세법상 성인 자녀 10년 합산 증여공제(5천만 원) 한도를 사전 확인하고 객관적 자금 출처를 확보하는 것이 매우 중요합니다."
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
              <Sparkles className="w-3 h-3" /> 최신 종신보험 부가 옵션 안내
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">연금 전환 특약 및 건강인 우대 제도</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              최신 종신보험은 피보험자의 평생 사망 보장이라는 본질적 기능에 더해, 자녀 독립 후 노후 자금이 필요할 때 해약환급금을 연금 재원으로 전환할 수 있는 옵션(전환 시점 약관 적용)과 비흡연/정상혈압/정상 체질량지수(BMI) 우량체 대상의 보험료 할인 제도를 운영하고 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '건강인 할인제도', product: '비흡연/혈압/BMI 조건 충족 시', limit: '월 보험료 약 5% ~ 10% 할인', note: '가입 전 건강검진 결과를 제출하여 심사 통과 시 매월 보험료 우량체 감면 적용' },
              { company: '연금 전환 특약', product: '해약환급금 기반 연금 수령 전환', limit: '노후 연금 분할 수령 옵션', note: '사망보장 필요성이 낮아진 은퇴기에 해약환급금을 연금 형태로 분할 수령 가능' },
              { company: '계약유지 보너스', product: '납입 완료 및 장기 유지 시 가산', limit: '유지 보너스 가산 적립', note: '중도 해약 없이 성실히 완납 유지한 계약자에게 환급률 보완 혜택 제공' },
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
              { step: '01. 납기 기간 적절성', desc: '은퇴 시점 이전에 납입이 안전하게 종료될 수 있도록 소득 활동 기간에 맞춘 단기납(5~10년) 또는 적정 납기 설정' },
              { step: '02. 실질 가치 평가', desc: '정액 종신보험의 경우, 장기 인플레이션에 따른 화폐 가치 하락을 방어할 수 있는 체증형 옵션 검토' },
              { step: '03. 세무 구조 확인', desc: '상속세 비과세 목적일 경우 자녀의 실질 소득 증빙과 자녀 명의 계좌를 통한 보험료 납입 요건 사전 확인' },
              { step: '04. 연금 전환 조건 비교', desc: '전환 시 적용되는 경험생명표와 이율 조건이 가입 시점 기준인지, 전환 시점 기준인지 약관 세부 검토' },
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
            <h4 className="text-xl font-black mb-4">종신보험 설계 핵심 체크</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 소득 활동기에 마치는 5/7/10년 등 단기납 구조 검토<br />
              ② 저해지 환급형 선택 시 납기 내 해지 손실 위험 필독<br />
              ③ 상속세 절세 목적 시 [계약자·수익자: 자녀, 피보험자: 부모]<br />
              ④ 물가상승에 따른 사망금 가치 보존을 위한 체증형 고려<br />
              ⑤ 종신보험은 저축 상품이 아니므로 순수 보장 목적으로만 가입
            </p>
          </div>
          <div className="bg-white border border-indigo-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-indigo-500 w-5 h-5" /> 가입 최적 시기
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              사망 위험률 책정 기준상 연령이 낮을수록 기본 보험료가 낮아지므로, 가장의 가족 부양 책임이 시작되는 30~40대가 가입의 적기입니다. 병력이 있거나 고령인 경우 간편심사 종신보험을 대조 활용할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-indigo-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          주요 생명보험사 종신보험 대표 상품 특징 안내 (생명보험협회 공시 기준)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '신한라이프', product: '신한더아름다운종신보험', highlight: '단기납 및 장기유지보너스 옵션 제공, 5년/7년 등 다양한 납입주기 선택 가능', badges: ['단기납 선택형', '유지보너스 부가'] },
            { company: '삼성생명', product: '삼성든든종신보험', highlight: '국내 최대 자산운용 규모와 탄탄한 재무건전성, 헬스케어 멤버십 인프라 완비', badges: ['높은 안정성', '헬스케어 연계'] },
            { company: '한화생명', product: '한화시그니처종신보험', highlight: '체증형 개시 나이를 고객 라이프사이클에 맞춤 설정 가능, 납입면제 범위 우대', badges: ['체증형 선택', '납입면제 특약'] },
            { company: '교보생명', product: '교보더든든종신보험', highlight: '가입금액별 우량체 건강할인 및 시니어 케어서비스 등 폭넓은 부가 서비스 제공', badges: ['건강체 할인', '시니어 케어'] },
            { company: '동양생명', product: '수호천사종신보험', highlight: '저해지 구조 설계를 통한 합리적 보험료 테이블 및 다양한 건강보장 특약 조립 가능', badges: ['합리적 보험료', '특약 조립 유연'] },
            { company: 'KDB생명', product: 'KDB든든단기납종신', highlight: '단기 완납 시점의 유지관리 및 계약유지 보너스 체계를 통한 계약 지속성 지원', badges: ['단기 완납형', '계약관리 편의'] },
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

        {/* ── 금소법 제19조 및 표준 소비자 보호 법적 안내 ── */}
        <div className="mt-10 p-6 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
          <p className="font-black text-slate-800 flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> 종신보험 계약 체결 전 금융소비자 필수 안내사항 (금융소비자보호법 제19조 준수)
          </p>
          <ul className="list-disc pl-5 space-y-1 font-medium text-[11px] text-slate-500">
            <li><strong>본 상품은 피보험자의 사망을 보장하는 보장성 보험이며 은행의 저축이나 적금 상품이 아닙니다.</strong></li>
            <li>보험계약 체결 전 반드시 해당 상품의 약관 및 상품설명서를 확인하시기 바랍니다.</li>
            <li>보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결하는 경우, 질병 이력이나 연령 증가 등으로 인하여 가입이 거절되거나 보험료가 인상될 수 있으며, 보장 내용이 달라질 수 있습니다.</li>
            <li>무·저해지환급형 상품은 납입기간 중 해약 시 해약환급금이 전혀 없거나 일반 표준형 상품 대비 적어 원금 손실이 발생할 수 있습니다.</li>
            <li>피보험자가 계약일(부활일)로부터 2년 이내에 고의로 자신을 해친 경우(자살 등) 약관상 사망보험금 지급이 제한됩니다.</li>
            <li>보험계약자는 보험증권을 받은 날로부터 15일(단, 청약일로부터 30일 한도, 만 65세 이상 고령자는 45일) 이내에 청약 철회가 가능합니다.</li>
            <li>본 보험계약은 예금자보호법에 따라 해약환급금(또는 만기 시 보험금이나 사고보험금)에 기타지급금을 합하여 1인당 최고 5천만 원까지 보호되며, 5천만 원을 초과하는 나머지 금액은 보호하지 않습니다. (단, 보험계약자 및 보험료 납부자가 법인인 경우 보호 대상에서 제외됩니다.)</li>
          </ul>
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
            종신보험 실시간 비교 상담하기
          </button>
        )}
      </div>

    </div>
  </section>
);
