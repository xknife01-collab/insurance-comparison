import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  Coins, ShieldCheck, Activity, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle, Scale
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const CreditExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-blue-50/10 px-2 sm:px-4 relative overflow-hidden" id="credit-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-200 shadow-sm animate-pulse">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            유고 시 대출금이 가족에게 빚 대물림되지 않도록 지키는 신용 자산 안전장치
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            예기치 못한 유고 시 대출 상환 부담 완화,<br />
            <span className="text-blue-600">신용생명보험의 올바른 설계 기준</span>을 제시합니다.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            사망 및 약관상 정해진 중대 질병 진단 시 가입금액 한도 내 대출금 상환 지원.<br />
            NICE/KCB 우량 신용 점수에 따라 최대 10% 주계약 보험료 할인 혜택 매칭.
          </p>
        </div>
      </div>

      {/* ── 신용생명보험 핵심 법적 유의사항 및 표준 산출 기준 사전 고지 ── */}
      <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 md:p-8 mb-12 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1 text-xs text-slate-600 font-bold leading-relaxed">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-2.5 py-1 rounded-md">
                금융소비자 안내사항
              </span>
              <span className="text-slate-800 font-black text-sm">
                신용생명보험 가입 전 필수 확인 사항 (보장 범위 및 면책 사유)
              </span>
            </div>
            <p className="text-slate-700">
              * <strong>신용생명보험은 피보험자가 사망하거나 80% 이상 고도후유장해, 중대 질병 진단 등 약관상 규정된 보험사고 발생 시 가입금액 한도 내에서 대출금을 대신 상환해 주는 순수 보장성 보험입니다.</strong> 본 화면의 보장 및 예시 보험료는 <strong>[가입기준: 40세 남성 / 주택담보대출 1억 원 잔액 연동 / 10년 만기 / 표준체 / NICE 신용 1~2등급 가정]</strong>을 기준으로 산출된 단순 참고용 예시입니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                <span className="text-amber-700 font-black">⚠️ 단순 연체/채무불이행 면책:</span> 대출 이자 연체나 개인회생/파산 등 채무불이행 자체가 보험금 지급 사유가 되는 것이 아니며, 반드시 <strong>피보험자의 사망, 약관상 규정된 질병·상해 등 보험사고가 발생해야만 지급</strong>됩니다.
              </div>
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                <span className="text-blue-700 font-black">⚖️ 2년 내 자살 면책 및 대환대출 주의:</span> 보험계약일(부활일)로부터 <strong>2년 이내 고의로 자신을 해친 경우(자살 등)는 사망보험금이 지급되지 않으며</strong>, 대출을 중도 상환하거나 타 금융기관으로 대환대출 시 본 보험이 자동 해지되지 않으므로 별도 해지 신청이 필요합니다.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '신용점수 연계 할인', label: 'NICE/KCB 등급별 감면', sub: '3% ~ 최대 10% 주계약 보험료 할인' },
          { num: '대출금 한도 연동', label: '실제 대출 잔액 한도 매칭', sub: '초과 가입 방지 및 합리적 보험료 설계' },
          { num: '채권기관 직접 상환', label: '대출 실행 은행으로 상환금 지급', sub: '유가족 빚 상속 방지 및 채무 소거' },
          { num: '가계 안정 안전판', label: '사망/장해/3대 질병 시 지원', sub: '소득 중단 시 주거환경 및 가족 보호' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-blue-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
            <p className="text-2xl font-black text-blue-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 & 가이드 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 도덕적 해이 및 부정 가입 원천 방어막 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
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
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 md:p-6 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-blue-700 font-black text-xs mb-1">⚠️ 가입 심사 및 대기기간 (Underwriting)</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              이미 걸린 질병이 있는 상태에서 거액의 대출을 일으킨 뒤 가입하는 악용을 방지하기 위해 중대 질병(암 등) 보장 특약은 **가입 후 90일 동안 면책 대기기간**이 적용되며, 심각한 유병 상태의 경우에는 언더라이팅에서 승인이 거절됩니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 신용보험이 작동하는 3단계 안심 구조 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Coins className="w-56 h-56 text-blue-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-blue-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">신용대출 상환보험의 3대 안전망</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  🏦 대위변제를 통한 유가족 빚 대물림 방지
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  갑작스러운 사고로 가장이 유고 상태가 되었을 때, 담보로 잡은 소중한 내 집이 경매에 넘어가거나 가족들이 수억 원의 빚더미를 고스란히 양도받아 신용 불량 상태에 빠지는 비극을 미연에 방지합니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-blue-600/20 rounded-2xl md:rounded-[2.5rem] border border-blue-400/30 hover:bg-blue-600/30 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  🏥 중대 질병 및 고도후유장해 시 채무 상환 지원
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  가장에게 암, 뇌출혈, 급성심근경색증 등 약관상 규정된 3대 질병이 발생하거나 80% 이상의 고도후유장해 상태가 될 경우, 소득 단절로 인한 대출 연체를 예방하기 위해 보험회사가 가입금액 한도 내 채무액을 상환 지원합니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-blue-300 mb-2 flex items-center gap-2">
                  📉 신용생명지수 우량 시 최대 10% 보험료 할인
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  NICE평가정보 및 KCB 등의 데이터를 연동하여 우량 등급인 고객들에게 주계약 보험료를 할인해 주며, 신용 관리를 통해 등급이 상승하면 추가 할인율이 매칭 적용될 수 있습니다. (신용 하락 시 보험료 할증 없음)
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-blue-400 font-black text-xs mb-1 uppercase tracking-widest">💡 대출자 맞춤 설계 요령</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "주택담보대출처럼 원리금 규모가 크고 상환 기간이 긴 대출을 실행할 때는 단순히 사망 보장뿐만 아니라 **3대 질병 진단 상환 특약**과 **고도장해 보장 특약**을 함께 조립하여 빈틈없는 재무 리스크 방어벽을 세우시는 것이 정석입니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 핀테크 플랫폼 연계 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-blue-400/30">
              <Sparkles className="w-3 h-3" /> 최신 핀테크 연계 동향
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">대출 비교 플랫폼과 실시간 보험가입 연계 트렌드</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              정부의 서민금융 안정화 기조에 맞춰, 최근 핀테크 대출 비교 플랫폼에서 대출을 실행한 차주를 대상으로 대출 정보와 연동하여 복잡한 서류 제출 없이 **간편한 다이렉트 신용보험 가입**을 지원하는 서비스가 확대되고 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { company: '실시간 신용 점수 조회', product: 'NICE / KCB 등급 연동', limit: '3% ~ 10% 보험료 추가 할인', note: '가입 시 간편 인증으로 실시간 개인 신용 구간을 판정하여 자동 우대 혜택 연동' },
              { company: '분할 납부 청약제도', product: '대출 분납 주기 매칭 청구', limit: '보험료 대출금과 분납 연계', note: '가입 시 월납 방식 외에 대출 이자와 함께 납부할 수 있는 편의 옵션 제공' },
              { company: '비대면 다이렉트 가입', product: '간편 심사형 청약 절차', limit: '대출 계약 확인 시 신속 심사', note: '대출 실행 고객의 경우 심사 절차를 간소화하여 모바일로 신속 가입 지원' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm">
                    {maskCompany(item.company, isUnlocked)}{' '}
                    <span className="text-blue-300 text-xs font-bold ml-1">{maskProductName(item.product, isUnlocked)}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-blue-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{maskText(item.limit, isUnlocked)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-blue-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600" /> 합리적 신용보험 스마트 설계 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 대출 원리금 일치', desc: '현재 본인의 잔여 대출 원금과 상환 기간을 정확히 대조하여 중복/초과 보험료 방지' },
              { step: '02. 자살 면책 조항 인지', desc: '생명보험 특성상 계약 후 2년 이내의 고의 자해 및 극단 선택은 전액 면책됨을 확인' },
              { step: '03. 중대질병 보장 추가', desc: '단순 사망 외에 암/뇌/심장 투병으로 발생할 수 있는 대출 상환 마비 사태 방지 특약 검토' },
              { step: '04. 신용생명지수 재확인', desc: '매년 신용 점수를 갱신하여 점수가 상승했을 때 보험사에 할인율 재지정 신청 가능 여부 확인' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 p-5 bg-blue-50/30 rounded-3xl border border-blue-100/50 hover:border-blue-200 transition-colors">
                <div className="shrink-0 font-black text-blue-700 text-sm w-full sm:w-32">{item.step}</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-xs leading-relaxed break-keep">{maskText(item.desc, isUnlocked)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-blue-600 text-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-xl">
            <h4 className="text-xl font-black mb-4">신용보험 가입 핵심 가이드</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 대출 실행 시점 잔액과 만기 기간 매칭<br />
              ② 주계약 보험금은 채권 은행으로 직접 상환<br />
              ③ NICE/KCB 등급에 맞추어 연계 할인 획득<br />
              ④ 사망에 고도장해 및 질병 상환 특약 연계<br />
              ⑤ 중도 대출 전액 상환 시 해약 신청 필수
            </p>
          </div>
          <div className="bg-white border border-blue-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-blue-500 w-5 h-5" /> 가입 최적 시점
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              주택담보대출 또는 신용대출을 새로 실행하는 시점이 가장 적기입니다. 대출 실행 후 건강 상태가 악화되거나 신용등급에 변동이 생기면 가입 심사에서 승인이 제한될 수 있으므로 대출 개시 시점에 맞추어 설계하는 것이 안전합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-blue-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 주요 대출안심 신용생명보험 대표 상품 특징 안내 (생명보험협회 공시 기준)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: 'BNP파리바 카디프생명', product: '대출안심 신용생명보험', highlight: '국내 대표 신용생명보험 상품, 신용생명지수 할인 특약 탑재로 최저 3%~최대 10% 보험료 감면 제공', badges: ['시장 선두 대표상품', '신용지수 할인'] },
            { company: '메트라이프생명', product: '신용대출 상환 정기보험', highlight: '사망 보장에 고도후유장해 상환 특약 결합 가능, 연령층 대비 실속 있는 주계약 사망 설계 지원', badges: ['정기 보장 강점', '고도장해 보장'] },
            { company: 'BNP파리바 카디프생명', product: '대출안심 보장보험 (다이렉트)', highlight: '핀테크 채널 전용 간편 다이렉트 가입 플랜, 신용 데이터 연동 및 모바일 간편 청약 지원', badges: ['모바일 특화', '모바일 간편 승인'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-blue-50/20 rounded-2xl md:rounded-[2.5rem] border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
              <p className="text-xs font-black text-blue-600 mb-1">{maskCompany(item.company, isUnlocked)}</p>
              <p className="font-black text-slate-800 text-sm mb-2 leading-tight">{maskProductName(item.product, isUnlocked)}</p>
              <p className="text-xs text-slate-500 font-bold mb-4 leading-relaxed">{maskText(item.highlight, isUnlocked)}</p>
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

        {/* ── 금소법 제19조 및 표준 소비자 보호 법적 안내 ── */}
        <div className="mt-10 p-6 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
          <p className="font-black text-slate-800 flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> 신용보험 계약 체결 전 금융소비자 필수 안내사항 (금융소비자보호법 제19조 준수)
          </p>
          <ul className="list-disc pl-5 space-y-1 font-medium text-[11px] text-slate-500">
            <li><strong>본 상품은 차주의 사망, 장해, 질병 등 보험사고 발생 시 가입금액 한도 내에서 대출금을 대신 상환하는 순수 보장성 보험이며 은행의 예·적금 상품이 아닙니다.</strong></li>
            <li>대출 연체나 채무불이행 자체가 보험금 지급 사유가 되는 것이 아니며, 약관상 규정된 보험사고가 발생해야만 지급됩니다.</li>
            <li>보험계약 체결 전 반드시 해당 상품의 약관 및 상품설명서를 확인하시기 바랍니다.</li>
            <li>보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결하는 경우, 질병 이력이나 연령 증가 등으로 인하여 가입이 거절되거나 보험료가 인상될 수 있으며, 보장 내용이 달라질 수 있습니다.</li>
            <li>피보험자가 계약일(부활일)로부터 2년 이내에 고의로 자신을 해친 경우(자살 등) 약관상 사망보험금 지급이 제한됩니다.</li>
            <li>기존 대출을 중도 완납하거나 다른 금융기관으로 대환대출하는 경우 본 보험계약이 자동으로 해지되지 않으므로, 계약자가 별도로 보험사에 해약환급금 청구 및 계약 해지 신청을 해야 합니다.</li>
            <li>보험계약자는 보험증권을 받은 날로부터 15일(단, 청약일로부터 30일 한도, 만 65세 이상 고령자는 45일) 이내에 청약 철회가 가능합니다.</li>
            <li>본 보험계약은 예금자보호법에 따라 해약환급금(또는 만기 시 보험금이나 사고보험금)에 기타지급금을 합하여 1인당 최고 5천만 원까지 보호되며, 5천만 원을 초과하는 나머지 금액은 보호하지 않습니다. (단, 보험계약자 및 보험료 납부자가 법인인 경우 보호 대상에서 제외됩니다.)</li>
          </ul>
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
            신용보험 실시간 비교 상담하기
          </button>
        )}
      </div>

    </div>
  </section>
);
