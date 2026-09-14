import React from 'react';
import { maskCompany, maskProductName, maskText } from '../../../utils/compliance';
import {
  TrendingUp, ShieldCheck, Scale, Award, Sparkles,
  CheckCircle, Clock, Quote, Compass, AlertTriangle
} from 'lucide-react';

interface Props {
  isUnlocked?: boolean;
  onAction?: () => void;
}

export const VariableExplanation: React.FC<Props> = ({ onAction, isUnlocked }) => (
  <section className="py-24 bg-indigo-50/10 px-2 sm:px-4 relative overflow-hidden text-left" id="variable-detail">
    <div className="max-w-7xl mx-auto">

      {/* ── 헤더 ── */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-indigo-200 shadow-sm">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            자산 증식을 위한 변액 투자 및 경제적 책임 기간 보장을 위한 정기보험 정밀 분석
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            필요 기간 집중 사망보장과 함께,<br />
            <span className="text-indigo-600">변액 투자자산 포트폴리오</span>를 구성하세요.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            활동기 집중 사망보장으로 가족 안전망을 합리적으로 마련하고,<br />
            여유 자금은 펀드 연동 실적배당형 변액 자산으로 적립하는 포트폴리오 가이드.
          </p>
        </div>
      </div>

      {/* ── 투자성 상품 필수 경고 및 예금자보호법 적용 구분 사전 고지 ── */}
      <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 md:p-8 mb-12 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-3 flex-1 text-xs text-slate-600 font-bold leading-relaxed">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-[11px] font-black px-2.5 py-1 rounded-md">
                필수 안내사항
              </span>
              <span className="text-slate-800 font-black text-sm">
                변액보험 및 정기보험 가입 시 핵심 법적 유의사항
              </span>
            </div>
            <p className="text-slate-700">
              * 본 비교 안내 화면의 보험료 및 해약환급금 예시는 <strong>[가입기준: 40세 남성 / 월 납입액 15만 원 / 10년 납입 / 특별계정 펀드 운용 / 표준 예시수익률 가정]</strong>을 기준으로 산출된 단순 참고용 예시이며, 실제 투자 수익률 및 해약환급금은 펀드 운용 실적과 시장 상황에 따라 매일 변동됩니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
              <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                <span className="text-rose-700 font-black">⚠️ 투자원금 손실 위험 및 계약자 귀속:</span> 변액보험은 실적배당형 상품으로 특별계정의 운용실적에 따라 <strong>투자원금의 손실이 발생할 수 있으며, 그 손실은 계약자에게 귀속</strong>됩니다. 과거의 운용실적이 미래의 수익을 보장하지 않습니다.
              </div>
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
                <span className="text-indigo-700 font-black">🛡️ 예금자보호법 적용 범위 구분:</span> 변액보험의 <strong>특별계정(투자 자산)은 예금자보호법에 따라 보호되지 않습니다</strong>. (단, 최저사망보험금 및 최저연금적립금 등 일반계정에서 최저 보증하는 부분 및 선택특약은 1인당 최고 5천만 원 한도 내에서 보호됩니다.)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 핵심 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '보험료 경감 효과', label: '정기보험 기간 설정 시', sub: '필요 기간(자녀 독립기 등) 집중 설계로 납입료 최적화' },
          { num: '최대 18% 할인', label: '정기보험 우량체 특별 요율', sub: '비흡연, 정상혈압, 정상 BMI 만족 시 즉시 혜택' },
          { num: '실적배당형 운용', label: '변액 펀드 자산 운용', sub: '글로벌 ETF 및 채권/주식형 펀드 포트폴리오 연계' },
          { num: '10년 유지 비과세', label: '변액 적립 수익금 절세 효과', sub: '소득세법 시행령 요건 충족 시 이자소득세 면제' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-indigo-100 rounded-3xl md:rounded-[3rem] p-5 md:p-8 text-center shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
            <p className="text-2xl font-black text-indigo-600 mb-2 group-hover:scale-105 transition-transform inline-block">{s.num}</p>
            <p className="font-black text-slate-800 text-sm leading-tight mb-1">{s.label}</p>
            <p className="text-[11px] text-slate-400 font-bold">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── 가이드 1 (변액 적립식 투자) & 가이드 2 (정기보험의 기회비용) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* GUIDE 01: 변액보험 핵심 체크리스트 */}
        <div className="bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-indigo-100 shadow-lg hover:shadow-2xl transition-all group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-indigo-500 font-black">GUIDE 01</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">변액 투자보험 핵심 요약</h3>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
            납입 보험료에서 위험 보험료와 사업비를 공제한 후,{' '}
            <span className="text-indigo-600 font-black">글로벌 펀드 및 채권/주식형 자산에 실적 배당</span>하여 장기 인플레이션 대응을 목표로 하는 실적배당형 금융 상품입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '글로벌 자산배분 펀드', label: '해외 우량 주식 및 ETF 포트폴리오 연계', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '국내 시장에 편중되지 않고 전 세계 미국 테크 주식, 글로벌 리츠, 채권 ETF 등으로 자동 연계 운용하여 안정성과 성장성을 동시에 도모합니다.' },
              { title: '중도인출 & 추가납입', label: '유연한 자금 운용을 위한 유니버셜 기능', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '긴급 자금 필요 시 약관상 해약환급금 범위 내에서 중도인출이 가능하며, 여유 자금 발생 시 추가납입 기능을 활용할 수 있습니다.' },
              { title: '수익금 비과세 혜택', label: '소득세법 시행령 요건 충족 시 비과세', color: 'bg-sky-50 border-sky-100', badge: 'text-sky-700 bg-sky-100', desc: '월납 150만 원 한도 및 10년 이상 유지 등 세법상 비과세 요건을 충족할 경우 이자소득세(15.4%)가 면제됩니다.' },
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

          <div className="mt-8 p-5 md:p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <p className="text-indigo-700 font-black text-xs mb-1">⚠️ 초기 해약 원금 손실 및 투자 위험성</p>
            <p className="text-slate-700 font-bold text-xs leading-relaxed">
              변액보험은 예금자보호법이 적용되지 않는 실적배당형 상품이며, 가입 초기 3~5년 이내 해지할 경우 계약체결비용 등 사업비 차감으로 해약환급금이 원금에 미달할 수 있으므로 10년 이상의 장기 유지 목적에 적합합니다.
            </p>
          </div>
        </div>

        {/* GUIDE 02: 정기보험을 통한 지출 리모델링 */}
        <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-5 md:p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <Scale className="w-56 h-56 text-orange-500" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl md:rounded-[2.2rem] flex items-center justify-center text-white shadow-xl">
                <Scale className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-orange-400 font-black">GUIDE 02</p>
                <h3 className="text-3xl font-black tracking-tight">정기보험 리모델링 전략</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 md:p-6 bg-white/10 rounded-2xl md:rounded-[2.5rem] border border-white/10 hover:bg-white/15 transition-colors">
                <p className="font-black text-orange-300 mb-2 flex items-center gap-2">
                  🛡️ 경제적 활동기 중심의 집중 보장 설계
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  자녀의 양육 및 학업 기간 등 가장의 경제적 책임이 큰 시점(만 60~70세)에 한정하여 사망보장을 집중 설계할 경우, 종신보험 대비 동일 보장금액을 훨씬 합리적인 보험료로 준비할 수 있습니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-emerald-950/40 rounded-2xl md:rounded-[2.5rem] border border-emerald-500/20 hover:bg-emerald-950/60 transition-colors">
                <p className="font-black text-emerald-300 mb-2 flex items-center gap-2">
                  🏃 건강할수록 유리한 우량체 할인 제도
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  비흡연 기간 1년 이상 충족, 정상 혈압(수축기 120mmHg 미만), 정상 체질량지수(BMI 18.5~25.0) 조건을 만족할 경우, 표준 요율 대비 할인되는 **우량체 특약**을 반드시 대조하여 가입하는 것이 유리합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-orange-400 font-black text-xs mb-1 uppercase tracking-widest">💡 금융전문가의 포트폴리오 제언</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "사망 보장은 경제 활동기에 맞춰 실속형 정기보험으로 설계하고, 절감된 여유 자금은 투자 성향에 맞는 적립식 금융 상품이나 연금 자산에 배분하는 포트폴리오 전략을 권장합니다."
            </p>
          </div>
        </div>
      </div>

      {/* ── 트렌드: 변액 연금 보증 제도 및 최근 동향 ── */}
      <div className="mb-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl md:rounded-[4rem] p-5 md:p-12 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-xs font-black mb-6 border border-indigo-400/30">
              <Sparkles className="w-3 h-3" /> 변액보험 안정성 트렌드
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">하락장 리스크를 완화하는 최저 보증(GMAB/GMDB) 제도</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              시장 상황 악화로 펀드 수익률이 하락하더라도, 보험을 중도 해지하지 않고 연금 수령 개시 시점까지 정상 유지할 경우 **기납입 보험료 수준을 최저 보증(GMAB)**하는 옵션이 운영됩니다. 또한 사망 시에도 지급받을 최소 사망보험금 원금을 보증(GMDB)하여 안전판을 제공합니다. (단, 약관에 따른 최저보증비용이 적립금에서 차감됩니다.)
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: '연금개시 시점 최저 보증(GMAB)', val: '연금 개시 시 기납입 보험료 보증', note: '투자 실적이 부진하더라도 은퇴 시점 납입원금 수준 보증 (단, 중도 해지 시 미보증 및 보증비용 부과)' },
              { title: '사망보험금 최저 보증(GMDB)', val: '사망 시 기납입 보험료 최저 한도', note: '가입 기간 중 예기치 못한 사망 사고 시 최소 기납입 보험료 이상 지급 보장' },
              { title: '모바일 펀드 변경 및 사후 관리', val: '주기적인 포트폴리오 리밸런싱', note: '시장 주기에 맞추어 채권형과 주식형 비중을 모바일로 변경하여 리스크 관리' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-5 bg-white/10 rounded-3xl border border-white/10 hover:bg-white/15 transition-colors">
                <div>
                  <p className="font-black text-sm text-left">{item.title}</p>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5 text-left">{maskText(item.note, isUnlocked)}</p>
                </div>
                <p className="font-black text-indigo-400 text-sm shrink-0 sm:ml-4 text-left sm:text-right">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 체크리스트 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="md:col-span-2 bg-white border border-indigo-100 rounded-3xl md:rounded-[4rem] p-5 md:p-12 shadow-sm hover:shadow-xl transition-all">
          <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-indigo-500" /> 합리적 변액·정기보험 스마트 가입 체크리스트
          </h3>
          <div className="space-y-3">
            {[
              { step: '01. 펀드변경 조건 확인', desc: '시장 국면 전환 시 자유로운 펀드 비중 변경을 위해 연 12회 내외의 펀드변경 수수료가 무상 지원되는지 확인' },
              { step: '02. 비과세 감면 요건', desc: '월 보험료 합산 150만 원 이하, 10년 이상 계약 유지 및 5년 이상 납입 조건을 만족하여 이자소득세 15.4% 비과세 혜택 검증' },
              { step: '03. 정기보험 우량체 할인', desc: '비흡연, 정상 BMI(18.5~25.0), 혈압(수축기 120mmHg 미만) 만족 시 보험사에서 제공하는 12~18% 수준의 우량체 특별 요율 적용' },
              { step: '04. 최저보증제도 탑재', desc: '장기 하락장 및 원금 손실 리스크 방지를 위해 연금 개시 시점 기납입 보험료의 원금 이상을 확정 보증(GMAB)하는 옵션 체크' },
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
            <h4 className="text-xl font-black mb-4">변액·정기 리모델링 핵심 TOP 5</h4>
            <p className="text-xs font-bold opacity-90 leading-relaxed">
              ① 종신보험 해약환급금 기회비용 재투자<br />
              ② 우량체 할인(비흡연/체형) 적용으로 최대 18% 절감<br />
              ③ 변액 펀드 비중 설정 시 글로벌 주식 비중 확대<br />
              ④ 사업비 공제 비율이 적은 다이렉트 전용 상품 선택<br />
              ⑤ 최저 보증(GMAB) 장치로 원금 보호 확보
            </p>
          </div>
          <div className="bg-white border border-indigo-100 rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all">
            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
              <Clock className="text-indigo-500 w-5 h-5" /> 가입 및 전환 최적 연령대
            </h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              자녀의 성장 및 학업 기간 등 가장 경제적 책임 자산이 커지는 만 30세~45세 사이가 고비용 종신을 가성비 정기보험으로 리모델링하고, 절감액을 변액 복리 상품에 투자하는 최적의 리포지셔닝 골든타임입니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 주요 상품 종합 비교표 ── */}
      <div className="mb-20 bg-white rounded-3xl md:rounded-[4rem] p-5 md:p-12 border border-indigo-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              주요 생명보험사 온라인 변액적립 및 정기보험 대표 상품 특징 안내 (생명보험협회 공시 기준)
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              * 각 보험사별 대표 상품의 공시 정보이며, 가입자의 연령, 성별, 선택 펀드 구성 및 운용 실적에 따라 실제 적립금 및 보장 조건은 달라집니다.
            </p>
          </div>
          <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full shrink-0">
            생명보험협회 심의 기준 준수
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '메트라이프생명', product: '(무)메트라이프 e-변액적립보험', highlight: '다이렉트 전용 사업비 구조 운영, 다양한 글로벌 주식형/채권형 펀드 라인업을 통한 분산 투자 설계', badges: ['글로벌 펀드 라인업', '다이렉트 전용'] },
            { company: '미래에셋생명', product: '(무)미래에셋 변액저축보험 글로벌형', highlight: '미국 및 글로벌 자산배분 펀드 라인업 연계, 생애주기에 맞춘 포트폴리오 변경 및 리밸런싱 지원', badges: ['미국/글로벌 펀드', '자산배분 플랜'] },
            { company: '신한라이프', product: '(무)신한 e-변액연금보험', highlight: '약관상 정한 연금개시 시점 최저연금적립금(GMAB) 보증 옵션 지원으로 하락장 위험 완화 설계', badges: ['최저연금보증 옵션', '안정형 포트폴리오'] },
            { company: '교보라이프플래닛', product: '(무)라이프플래닛 e정기보험', highlight: '순수보장형 다이렉트 정기보험, 비흡연 및 혈압/체형 기준 충족 시 우량체 할인 요율 제공', badges: ['우량체 할인 요율', '다이렉트 정기'] },
            { company: '한화생명', product: '(무)한화생명 e다이렉트 정기보험', highlight: '다이렉트 간편 심사 프로세스 지원, 고객의 경제 활동기에 맞춘 맞춤형 사망보장 기간 설정', badges: ['간편 심사 프로세스', '모바일 청약 지원'] },
            { company: '삼성생명', product: '(무)삼성생명 다이렉트 정기보험', highlight: '대형 생보사의 안정적인 보장 지급 체계, 표준체 및 건강상태별 맞춤 심사 요율 안내 지원', badges: ['신속 청구 지원', '체계적 보장 체계'] },
          ].map((item, i) => (
            <div key={i} className="p-5 md:p-8 bg-indigo-50/20 rounded-2xl md:rounded-[2.5rem] border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all text-left">
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

        {/* ── 법적 고지 및 소비자 유의사항 (금소법 제19조 및 투자위험 준수) ── */}
        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-2">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
            금융소비자보호법 제19조에 따른 법적 고지 및 유의사항
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-600 font-medium">
            <li>본 비교 안내는 특정 금융상품의 청약을 권유하거나 확정하는 것이 아니며, 생명보험협회 공시자료를 기초로 한 단순 비교 정보입니다.</li>
            <li>보험계약 체결 전 반드시 해당 상품의 약관 및 상품설명서를 면밀히 확인하시기 바랍니다.</li>
            <li>보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결할 경우, 인수가 거절되거나 보험료가 인상될 수 있으며 보장 내용이 달라질 수 있습니다.</li>
            <li><strong>변액보험 투자위험 안내:</strong> 변액보험은 실적배당형 상품으로 특별계정의 운용실적에 따라 투자원금의 손실이 발생할 수 있으며, 그 손실은 계약자에게 귀속됩니다. 과거의 운용실적이 미래의 수익을 보장하지 않습니다.</li>
            <li><strong>예금자보호법 적용 구분:</strong> 변액보험의 특별계정(투자자산)은 예금자보호법에 따라 보호되지 않습니다. 단, 최저보증(최저사망보험금, 최저연금적립금) 및 일반계정에서 운용되는 선택특약은 예금자보호법에 따라 1인당 "최고 5천만 원" 한도 내에서 보호됩니다.</li>
            <li>변액보험은 납입보험료에서 계약체결비용, 계약관리비용, 위험보험료 및 최저보증비용, 펀드운용보수가 차감된 후 특별계정에 투입되므로, <strong>중도 해지 시 지급되는 해약환급금은 납입원금에 미달</strong>할 수 있습니다.</li>
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
            "가족의 안전망은 튼튼하게, 자산 축적 효율은 현명하게,<br />
            <span className="text-indigo-600 font-black">소비자 상황에 부합하는 균형 잡힌 변액/정기 포트폴리오를 제안합니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-indigo-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-indigo-700 transition-all hover:scale-105 shadow-2xl shadow-indigo-400/30 shrink-0"
          >
            변액/정기보험 실시간 비교 상담하기
          </button>
        )}
      </div>

    </div>
  </section>
);
export default VariableExplanation;
