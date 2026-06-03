import React from 'react';
import { TrendingUp, ShieldAlert, Coins, Clock, UserCheck, Flame, Scale, Landmark, ShieldCheck } from 'lucide-react';

interface Props {
  subType: 'term_pure' | 'term_ceo' | 'variable_term' | 'variable_saving' | 'investment' | 'term';
  setSubType: (v: 'term_pure' | 'term_ceo' | 'variable_term' | 'variable_saving') => void;
  // Investment Subtype Props
  monthlyPremium: number;
  setMonthlyPremium: (v: number) => void;
  paymentPeriod: number;
  setPaymentPeriod: (v: number) => void;
  investmentStyle: 'conservative' | 'balanced' | 'aggressive';
  setInvestmentStyle: (v: 'conservative' | 'balanced' | 'aggressive') => void;
  equityRatio: number;
  setEquityRatio: (v: number) => void;
  isAnnuityConversion: boolean;
  setIsAnnuityConversion: (v: boolean) => void;
  // Term Subtype Props
  deathBenefit: number;
  setDeathBenefit: (v: number) => void;
  coveragePeriod: number;
  setCoveragePeriod: (v: number) => void;
  isHealthyDiscount: boolean;
  setIsHealthyDiscount: (v: boolean) => void;
}

export const VariableFields: React.FC<Props> = ({
  subType,
  setSubType,
  monthlyPremium,
  setMonthlyPremium,
  paymentPeriod,
  setPaymentPeriod,
  investmentStyle,
  setInvestmentStyle,
  equityRatio,
  setEquityRatio,
  isAnnuityConversion,
  setIsAnnuityConversion,
  deathBenefit,
  setDeathBenefit,
  coveragePeriod,
  setCoveragePeriod,
  isHealthyDiscount,
  setIsHealthyDiscount,
}) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── SECTION 1: 4대 상품 타입 정밀 선택 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <TrendingUp className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-blue-500/25 text-blue-300 px-3 py-1.5 rounded-full border border-blue-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              가입 목적에 따른 변액 및 정기보험 상품군을 선택해 주세요
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. 실속 순수보장형 정기보험 */}
            <button
              onClick={() => setSubType('term_pure')}
              type="button"
              className={`flex flex-col items-start p-7 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                subType === 'term_pure' || subType === 'term'
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-xl shadow-emerald-500/5'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl">
                  <Scale className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md">실속형</span>
              </div>
              <span className="font-black text-lg text-white mb-2">🛡️ 실속 순수보장형 정기보험</span>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                종신보험 대비 월 90% 저렴한 비용! 만기 시 소멸하지만, 가족의 경제적 자립이 필요한 시기만 골라 저렴하게 사망보금 1억원을 세팅합니다. (예: 흥국생명 온라인정기보험 등)
              </p>
            </button>

            {/* 2. CEO 경영인 절세형 정기보험 */}
            <button
              onClick={() => setSubType('term_ceo')}
              type="button"
              className={`flex flex-col items-start p-7 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                subType === 'term_ceo'
                  ? 'bg-indigo-500/10 border-indigo-500 shadow-xl shadow-indigo-500/5'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl">
                  <Landmark className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md">법인용</span>
              </div>
              <span className="font-black text-lg text-white mb-2">🏢 CEO 경영인 절세형 정기보험</span>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                사망보장이 매년 증가하는 체증형 구조! 납입액 비용 처리를 통한 법인세 절세 및 은퇴 시 높은 해약환급금으로 CEO 퇴직금을 합법적으로 준비합니다. (예: 메트라이프 Classic 달러경영인 등)
              </p>
            </button>

            {/* 3. 변액 정기보험 */}
            <button
              onClick={() => setSubType('variable_term')}
              type="button"
              className={`flex flex-col items-start p-7 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                subType === 'variable_term'
                  ? 'bg-blue-500/10 border-blue-500 shadow-xl shadow-blue-500/5'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2.5 bg-blue-500/20 text-blue-400 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md">투자보장형</span>
              </div>
              <span className="font-black text-lg text-white mb-2">📈 변액 정기보험</span>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                가성비 정기보험에 펀드 투자 기능을 탑재! 펀드 성과에 따라 사망보장금이 증액될 수 있으며, 투자와 합리적인 보장을 동시에 설계합니다. (예: AIA생명 변액정기 등)
              </p>
            </button>

            {/* 4. 변액 적립/저축보험 */}
            <button
              onClick={() => setSubType('variable_saving')}
              type="button"
              className={`flex flex-col items-start p-7 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                subType === 'variable_saving' || subType === 'investment'
                  ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/5'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md">수익형</span>
              </div>
              <span className="font-black text-lg text-white mb-2">💰 변액 적립/저축보험</span>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                사망 보장 목적이 아닌 펀드 수익 극대화 목적! 글로벌 자산배분 펀드로 물가상승률을 초과하는 성과를 내며, 10년 시점 비과세 혜택을 챙깁니다. (예: 미래에셋생명 변액저축 등)
              </p>
            </button>
          </div>
        </div>
      </div>

      {subType === 'variable_saving' || subType === 'investment' ? (
        // =========================================================================
        // ── INVESTMENT SUBTYPE FIELDS (적립식 투자) ──
        // =========================================================================
        <>
          {/* SECTION 2: 월 납입액 및 투자 성향 설정 */}
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full border border-blue-200 uppercase tracking-widest">Step 02</span>
              <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                월 납입액과 본인의 투자 성향을 설정해 주세요
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 월 납입액 */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 block">월 희망 납입액</label>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                  <Coins className="text-blue-500" size={20} />
                  <input
                    type="number"
                    value={monthlyPremium}
                    onChange={(e) => setMonthlyPremium(Number(e.target.value))}
                    placeholder="금액을 입력하세요"
                    className="w-full bg-transparent font-black text-slate-800 focus:outline-none text-base"
                  />
                  <span className="font-bold text-slate-500 text-sm">원</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[100000, 200000, 300000, 500000, 1000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMonthlyPremium(val)}
                      className="bg-white border border-slate-100 hover:border-slate-200 text-slate-500 font-semibold text-xs px-4 py-2 rounded-lg transition-all"
                    >
                      {val >= 10000 ? `${(val / 10000).toLocaleString()}만원` : val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 투자 성향 */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 block">원하는 투자 스타일</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '안정형 (연 3.0%)', val: 'conservative' as const },
                    { label: '중립형 (연 5.0%)', val: 'balanced' as const },
                    { label: '공격형 (연 7.0%)', val: 'aggressive' as const }
                  ].map((style) => (
                    <button
                      key={style.val}
                      type="button"
                      onClick={() => setInvestmentStyle(style.val)}
                      className={`py-4 px-2 rounded-2xl font-bold border transition-all text-xs text-center flex items-center justify-center ${
                        investmentStyle === style.val
                          ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-black'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: 납입 기간, 주식 투입 비중 및 연금 옵션 */}
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full border border-blue-200 uppercase tracking-widest">Step 03</span>
              <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                펀드 자산 배분 구조 및 납입 기간을 설계해 주세요
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 납입 기간 */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> 납입 기간 (원리금 적립 기간)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[5, 10, 20].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setPaymentPeriod(period)}
                      className={`py-3.5 rounded-xl font-bold border transition-all text-sm ${
                        paymentPeriod === period
                          ? 'border-blue-500 bg-blue-50 text-blue-600 font-black shadow-sm'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {period}년납
                    </button>
                  ))}
                </div>
              </div>

              {/* 주식형 펀드 투입 비중 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-400 block">주식형 펀드 투입 비중 (Equity Ratio)</label>
                  <span className="text-sm font-black text-blue-600">{equityRatio}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={equityRatio}
                  onChange={(e) => setEquityRatio(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>보수적 (10%)</span>
                  <span>적정 균형 (50%)</span>
                  <span>적극 수익 (100%)</span>
                </div>
              </div>
            </div>

            {/* 연금 전환 옵션 */}
            <div className="p-6 rounded-[2rem] bg-blue-50/30 border border-blue-100/50 mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <h5 className="text-sm font-black text-slate-800">목돈 마련 후 평생 노후 연금으로 전환하시겠습니까?</h5>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
                  연금전환 옵션을 켜두면 만기 시점에 100% 비과세 연금으로 자동 수령이 연결되어 은퇴 연금으로 활용이 원활해집니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnnuityConversion(!isAnnuityConversion)}
                className={`px-8 py-3.5 rounded-2xl font-black text-xs transition-all border shrink-0 ${
                  isAnnuityConversion
                    ? 'bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {isAnnuityConversion ? '연금전환 기능 활성화' : '연금전환 기능 비활성화'}
              </button>
            </div>
          </div>
        </>
      ) : (
        // =========================================================================
        // ── TERM LIFE SUBTYPE FIELDS (정기적 보호) ──
        // =========================================================================
        <>
          {/* SECTION 2: 사망 보장 한도 및 보장 만기 */}
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-orange-100 text-[#FF6B00] px-3 py-1.5 rounded-full border border-orange-200 uppercase tracking-widest">Step 02</span>
              <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                사망 보장금과 보장 기간을 정해 주세요
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 사망 보장 한도 */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 block">사망 시 지급 보장금액</label>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                  <Coins className="text-orange-500" size={20} />
                  <span className="font-black text-slate-800 text-base">
                    {(deathBenefit / 100000000).toFixed(1)} 억원
                  </span>
                  <input
                    type="range"
                    min="50000000"
                    max="1000000000"
                    step="50000000"
                    value={deathBenefit}
                    onChange={(e) => setDeathBenefit(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500 ml-4"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[50000000, 100000000, 300000000, 500000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDeathBenefit(val)}
                      className="bg-white border border-slate-100 hover:border-slate-200 text-slate-500 font-semibold text-xs px-4 py-2 rounded-lg transition-all"
                    >
                      {val >= 100000000 ? `${(val / 100000000).toFixed(0)}억원` : '5천만원'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 보장 만기 */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 block">보장 만기 연령 (정기보험 종료)</label>
                <div className="grid grid-cols-4 gap-3">
                  {[60, 65, 70, 80].map((age) => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => setCoveragePeriod(age)}
                      className={`py-4 px-2 rounded-2xl font-bold border transition-all text-sm text-center flex items-center justify-center ${
                        coveragePeriod === age
                          ? 'border-[#FF6B00] bg-orange-50/50 text-[#FF6B00] font-black'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      만 {age}세 만기
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-bold">
                  * 자녀가 경제적으로 자립하는 평균 나이인 만 60~65세에 만기를 맞추면 보험료가 가장 합리적입니다.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: 납입 기간 및 우량체 할인 */}
          <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-orange-100 text-[#FF6B00] px-3 py-1.5 rounded-full border border-orange-200 uppercase tracking-widest">Step 03</span>
              <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                보험료 납입 구조와 할인 혜택을 챙기세요
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 납입 기간 */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" /> 보험료 납입 기간
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 999].map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setPaymentPeriod(period === 999 ? 20 : period)} // Use 전기납 or 20
                      className={`py-3.5 rounded-xl font-bold border transition-all text-sm ${
                        paymentPeriod === (period === 999 ? 20 : period)
                          ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00] font-black shadow-sm'
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {period === 999 ? '전기납(만기납)' : `${period}년납`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 우량체 할인 여부 */}
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-orange-500" /> 우량체 특별 할인 조건
                </label>
                <button
                  type="button"
                  onClick={() => setIsHealthyDiscount(!isHealthyDiscount)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border text-left transition-all ${
                    isHealthyDiscount
                      ? 'border-[#FF6B00] bg-orange-50/50'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div>
                    <span className={`text-xs font-black block ${isHealthyDiscount ? 'text-[#FF6B00]' : 'text-slate-800'}`}>
                      우량체 할인 대상 (비흡연 + 혈압/BMI 정상)
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      1년간 비흡연 & 수축기 혈압 110~139mmHg & BMI 18.5~25.0 충족 시 보험료 즉시 15% 할인!
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isHealthyDiscount ? 'border-[#FF6B00] bg-[#FF6B00] text-white' : 'border-slate-200'
                  }`}>
                    {isHealthyDiscount && '✓'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
    </div>
  );
};
export default VariableFields;
