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
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-xs font-black mb-6 border border-indigo-200 shadow-sm">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            자산 증식을 위한 변액 투자 및 지출 다이어트를 위한 정기보험 정밀 분석
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            고비용 종신에서 실속형 정기로 다이어트,<br />
            <span className="text-indigo-600">남은 기회비용은 변액 투자자산</span>으로 굴리세요.
          </h2>
        </div>
        <div className="max-w-md text-right hidden lg:block opacity-60">
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            비싼 종신보험 대신 합리적인 정기보험으로 보장 구조를 최적화하고,<br />
            매달 세이브된 여유 자금은 복리 성격의 변액 자산으로 적립하는 스마트 머니 포트폴리오.
          </p>
        </div>
      </div>

      {/* ── 핵심 통계 배너 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { num: '평균 85% 절감', label: '종신보험 대비 보험료 절감율', sub: '사망보장은 동일 설계하고 월간 고정 지출 대폭 단축' },
          { num: '최대 18% 할인', label: '정기보험 우량체 특별 요율', sub: '비흡연, 정상혈압, 정상 BMI 만족 시 즉시 혜택' },
          { num: '연 5%~7% 기대', label: '변액 펀드 자산 운용 수익률', sub: '글로벌 ETF 및 미국 우량 주식형 투입 비율 연계' },
          { num: '10년 이상 비과세', label: '변액 적립 수익금 절세 효과', sub: '금융소득 종합과세 대상 제외 및 이자 전액 면제' },
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
            <span className="text-indigo-600 font-black">글로벌 펀드 및 우량 주식에 실적 배당</span>하여 장기 인플레이션을 극복하는 금융 솔루션입니다.
          </p>

          <div className="space-y-3">
            {[
              { title: '글로벌 자산배분 펀드', label: '해외 우량 주식 및 ETF 포트폴리오 다양성', color: 'bg-blue-50/50 border-blue-100', badge: 'text-blue-700 bg-blue-100', desc: '국내 시장에 편중되지 않고 전 세계 미국 테크 주식, 글로벌 리츠, 채권 ETF 등으로 자동 연계 운용하여 안정성과 성장성을 동시에 높입니다.' },
              { title: '중도인출 & 추가납입', label: '자유로운 유니버셜 기능 적용', color: 'bg-indigo-50/50 border-indigo-100', badge: 'text-indigo-700 bg-indigo-100', desc: '자금이 갑자기 필요할 때 해약할 필요 없이 해약환급금 범위 내에서 수수료 없이 인출하고, 여유 자산은 추가 납입하여 운용 복리 효율을 극대화합니다.' },
              { title: '수익금 전액 비과세', label: '10년 이상 유지 요건 충족 시 면제', color: 'bg-sky-50 border-sky-100', badge: 'text-sky-700 bg-sky-100', desc: '수익금 한도 제한 없이 금융소득종합과세나 이자소득세(15.4%)가 부과되지 않아 거액의 은퇴 자산 축적에 최적화되어 있습니다.' },
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
              변액보험은 예금자보호법이 적용되지 않는 실적배당형 상품이며, 가입 초기 3~5년 이내 해지할 경우 해약환급금이 원금에 미달할 수 있으므로 최소 10년 이상의 장기 유지 목적에 적합합니다.
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
                  🛡️ 종신의 본질은 평생 사망보장이 아닙니다
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  자녀가 성장하고 독립하는 경제적 은퇴 시점(만 60~70세)이 지나면, 사망 시 가족들이 겪는 경제적 위기는 극적으로 감소합니다. 따라서 굳이 월 수십만 원의 고비용 종신을 평생 가져갈 이유가 전혀 없습니다.
                </p>
              </div>

              <div className="p-5 md:p-6 bg-emerald-950/40 rounded-2xl md:rounded-[2.5rem] border border-emerald-500/20 hover:bg-emerald-950/60 transition-colors">
                <p className="font-black text-emerald-300 mb-2 flex items-center gap-2">
                  🏃 건강할수록 강해지는 우량체 할인 제도
                </p>
                <p className="text-xs opacity-75 font-bold leading-relaxed">
                  비흡연 기간 1년 이상 충족, 수축기 혈압 120mmHg 미만, 체질량지수(BMI) 18.5~25.0 구간에 해당할 경우, standard 요율에서 즉각적으로 15% 가량 할인되는 **우량체 특약**을 반드시 함께 확인 및 적용하여 가입해야 합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 p-5 md:p-6 bg-white/5 rounded-3xl border border-white/10">
            <p className="text-orange-400 font-black text-xs mb-1 uppercase tracking-widest">💡 금융전문가의 포트폴리오 제언</p>
            <p className="text-white font-bold text-xs leading-relaxed opacity-80">
              "사망 보장은 가성비 정기보험으로 단돈 2~3만원대에 묶어두고, 남은 차액 15만원을 연 복리 효과가 강한 펀드 상품이나 세액공제형 적립식 금융 상품에 돌려 스스로 연금과 목돈 자산을 주도적으로 쌓아 올리는 것이 100배 똑똑한 자산 관리법입니다."
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
            <h3 className="text-3xl font-black mb-4 tracking-tight">수익률이 폭락해도 안심, 최저 보증(GMAB/GMDB) 제도</h3>
            <p className="text-sm opacity-70 font-bold leading-relaxed">
              주식시장이 아무리 나빠져 가치 평가가 하락해도, 보험을 중도 해지하지 않고 연금 수령 개시 시점까지 유지할 경우 고객이 납입한 **보험료 수준을 확정 보증(GMAB)**하는 특별 옵션들이 출시되었습니다. 또한 사망 시에도 지급받을 최소 사망보험금 원금을 보증(GMDB)하여 안전판을 공고히 하고 있습니다.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: '납입원금 최저 보증(GMAB)', val: '연금 개시 시 납입 보험료 보증', note: '투자 실적이 마이너스가 나더라도 은퇴 시점 원금 완전 보존 장치' },
              { title: '사망보험금 최저 보증(GMDB)', val: '사망 시 기납입 보험료 최저 한도', note: '가입 기간 중 예기치 못한 사망 사고 시 최소 원금 이상의 지급 보장' },
              { title: '연금저축 이전 및 관리 스마트폰 앱', val: '언제든 실시간 펀드 비중 조절', note: '시장 주기에 맞추어 채권형과 주식형 비중을 스마트폰으로 자유 변경 가능' },
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
        <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">
          국내 대표 생명보험사 온라인 변액적립 및 가성비 정기보험 대표 상품 대조
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { company: '메트라이프생명', product: '(무)메트라이프 e-변액적립보험', highlight: '다이렉트 전용 보험사로 수수료가 업계 최저 수준이며, 다양한 글로벌 주식형 펀드로 공격적인 복리 적립에 최적', badges: ['글로벌 투자 특화', '다이렉트 최저수수료'] },
            { company: '미래에셋생명', product: '(무)미래에셋 변액저축보험 글로벌형', highlight: '미국 테크, 글로벌 자산배분 펀드 라인업의 절대 강자이며 장기 운용 수익률 지표 업계 최상위권 달성', badges: ['미국 주식형', '자산배분 우수'] },
            { company: '신한라이프', product: '(무)신한 e-변액연금보험', highlight: '원금 최저연금보증 기능 제공하여 안정 지향의 투자 성향을 지닌 고객에게 균형 잡힌 대안 제시', badges: ['납입 보험료 보증', '안심 운용'] },
            { company: '교보라이프플래닛', product: '(무)라이프플래닛 e정기보험', highlight: '순수보장형 초가성비 정기보험의 원조 격. 비흡연/우량체 할인률이 최대 18%에 달해 가성비 우수함', badges: ['우량체 우수할인', '다이렉트 원조'] },
            { company: '한화생명', product: '(무)한화생명 e다이렉트 정기보험', highlight: '다이렉트 전용 스마트 시스템 탑재, 사망보장 한도를 최대 5억원까지 간편 모바일 심사로 보장 설계', badges: ['사망 5억 간편심사', '모바일 청약'] },
            { company: '삼성생명', product: '(무)삼성생명 다이렉트 정기보험', highlight: '대한민국 최대 자본 규모의 안정성, 전국 단위 청구 지원 및 비우량체 판정 시에도 합리적인 표준 요율 제공', badges: ['신속 청구 지원', '우수한 자본력'] },
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
      </div>

      {/* ── CTA ── */}
      <div className="border-t border-indigo-100 pt-20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400">
            <Quote className="w-8 h-8 opacity-60 rotate-180" />
          </div>
          <p className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            "불필요한 지출은 덜어내고 자산 축적 효율은 높이는 것,<br />
            <span className="text-indigo-600 font-black">현명한 소비자를 위한 가장 정밀한 변액/정기 포트폴리오를 제안합니다.</span>"
          </p>
        </div>
        {onAction && (
          <button
            onClick={onAction}
            className="bg-indigo-600 text-white px-14 py-7 rounded-full font-black text-xl hover:bg-indigo-700 transition-all hover:scale-105 shadow-2xl shadow-indigo-400/30 shrink-0"
          >
            내 보장 다이어트 진단 시작하기
          </button>
        )}
      </div>

    </div>
  </section>
);
export default VariableExplanation;
