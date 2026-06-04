import React from 'react';
import { PiggyBank, Coins, Clock, Calendar, ArrowRightLeft, ShieldCheck, Wallet, Flame, GraduationCap, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  savingType: 'installment' | 'lumpSum';
  setSavingType: (v: 'installment' | 'lumpSum') => void;
  monthlyPremium: number;
  setMonthlyPremium: (v: number) => void;
  paymentPeriod: number;
  setPaymentPeriod: (v: number) => void;
  maintenancePeriod: number;
  setMaintenancePeriod: (v: number) => void;
  savingsObjective: 'marriage' | 'housing' | 'retirement' | 'wealth' | 'education';
  setSavingsObjective: (v: 'marriage' | 'housing' | 'retirement' | 'wealth' | 'education') => void;
  hasUniversal: boolean;
  setHasUniversal: (v: boolean) => void;
}

export const SavingsFields: React.FC<Props> = ({
  savingType,
  setSavingType,
  monthlyPremium,
  setMonthlyPremium,
  paymentPeriod,
  setPaymentPeriod,
  maintenancePeriod,
  setMaintenancePeriod,
  savingsObjective,
  setSavingsObjective,
  hasUniversal,
  setHasUniversal,
}) => {
  // 비과세 충족 실시간 판정
  const isTaxExempt = savingType === 'installment'
    ? (paymentPeriod >= 5 && maintenancePeriod >= 10 && monthlyPremium <= 1500000)
    : (maintenancePeriod >= 10 && monthlyPremium <= 100000000);

  const objectives = [
    { id: 'wealth', label: '목돈 마련 / 재테크', desc: '복리 수익 극대화', icon: Sparkles, color: 'text-amber-500' },
    { id: 'marriage', label: '결혼 자금', desc: '3~5년 내 주력 목돈', icon: Heart, color: 'text-rose-500' },
    { id: 'housing', label: '주택 자금 마련', desc: '내집마련 디딤돌 자산', icon: Wallet, color: 'text-blue-500' },
    { id: 'retirement', label: '노후 은퇴 대비', desc: '은퇴 보조 연금 전환', icon: Flame, color: 'text-orange-500' },
    { id: 'education', label: '자녀 교육 / 증여', desc: '장기 학자금 및 증여 설계', icon: GraduationCap, color: 'text-indigo-500' },
  ] as const;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-left">
      
      {/* ── STEP 01: 납입 방식 선택 (적립식 vs 일시납) ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <PiggyBank className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-emerald-500/25 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              저축 방식을 선택해 주세요
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => {
                setSavingType('installment');
                setPaymentPeriod(5);
                setMonthlyPremium(300000);
              }}
              type="button"
              className={`flex flex-col items-start p-8 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                savingType === 'installment'
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Coins className={`w-10 h-10 mb-4 ${savingType === 'installment' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="font-black text-lg text-white mb-2">매월 정기 적립식 저축</span>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                매달 일정 금액을 꾸준히 납입합니다. **5년 이상 납입하고 10년 이상 유지** 시 월 150만 원 한도로 이자소득세가 비과세(0%) 적용됩니다.
              </p>
            </button>
            <button
              onClick={() => {
                setSavingType('lumpSum');
                setPaymentPeriod(1);
                setMonthlyPremium(10000000);
              }}
              type="button"
              className={`flex flex-col items-start p-8 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                savingType === 'lumpSum'
                  ? 'bg-blue-500/10 border-blue-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <ArrowRightLeft className={`w-10 h-10 mb-4 ${savingType === 'lumpSum' ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="font-black text-lg text-white mb-2">일시 목돈 거치식 (일시납)</span>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                목돈을 한 번에 예치하고 굴립니다. **10년 이상 유지** 시 총 납입액 1억 원 이하 한도까지 이자소득세(15.4%)가 전액 비과세 처리됩니다.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* ── STEP 02: 저축 목적 선택 ── */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            가장 주된 저축의 목적은 무엇인가요?
          </h4>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {objectives.map((obj) => {
            const isSelected = savingsObjective === obj.id;
            const Icon = obj.icon;
            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => setSavingsObjective(obj.id)}
                className={`p-6 rounded-3xl border-2 text-center transition-all flex flex-col items-center gap-3 justify-center ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-md scale-105'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:scale-[1.01]'
                }`}
              >
                <Icon className={`w-8 h-8 ${obj.color} ${isSelected ? 'animate-pulse' : ''}`} />
                <div className="text-center">
                  <p className="text-xs font-black text-slate-800">{obj.label}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1">{obj.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STEP 03: 저축 금액 설정 ── */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            {savingType === 'installment' ? '월 얼마씩 저축할 계획이신가요?' : '거치할 목돈 규모를 입력해 주세요'}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 block">
              {savingType === 'installment' ? '월 희망 보험료' : '일시납 예치 원금'}
            </label>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
              <Coins className="text-emerald-500" size={20} />
              <input
                type="number"
                value={monthlyPremium}
                onChange={(e) => setMonthlyPremium(Number(e.target.value))}
                placeholder="금액을 입력하세요"
                className="w-full bg-transparent font-black text-slate-800 focus:outline-none text-base"
              />
              <span className="font-bold text-slate-500 text-sm">원</span>
            </div>
            
            {/* 단축 버튼 */}
            <div className="flex flex-wrap gap-2">
              {savingType === 'installment'
                ? [100000, 300000, 500000, 1000000, 1500000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMonthlyPremium(val)}
                      className="bg-white border border-slate-100 hover:border-slate-200 text-slate-500 font-semibold text-xs px-4 py-2 rounded-lg transition-all"
                    >
                      {val >= 10000 ? `${(val / 10000).toLocaleString()}만원` : val.toLocaleString()}
                    </button>
                  ))
                : [10000000, 30000000, 50000000, 100000000, 150000000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMonthlyPremium(val)}
                      className="bg-white border border-slate-100 hover:border-slate-200 text-slate-500 font-semibold text-xs px-4 py-2 rounded-lg transition-all"
                    >
                      {val >= 100000000 ? `${(val / 100000000).toLocaleString()}억원` : `${(val / 10000).toLocaleString()}만원`}
                    </button>
                  ))}
            </div>
          </div>

          {/* 실시간 비과세 자격 판정 카드 */}
          <div className="flex flex-col justify-center">
            <div className={`p-6 rounded-[2rem] border transition-all ${
              isTaxExempt
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : 'bg-amber-50 border-amber-100 text-amber-800'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className={`w-5 h-5 ${isTaxExempt ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className="text-sm font-black">실시간 비과세 혜택 가능 여부</span>
              </div>
              <p className="text-xs font-bold leading-relaxed">
                {isTaxExempt ? (
                  <>
                    현재 설정은 **비과세 혜택 충족 조건**을 완벽하게 만족합니다! 만기 인출 또는 해약 시 발생하는 이자소득에 대해 <span className="text-emerald-600 font-black">이자소득세 15.4%가 전액 비과세(0%)</span> 처리됩니다.
                  </>
                ) : (
                  <>
                    현재 설정은 비과세 혜택 기준에 미달하거나 초과하여 <span className="text-amber-600 font-black">이자소득세 15.4%가 부과</span>됩니다. 
                    {savingType === 'installment' ? (
                      <span className="block mt-1.5 text-[10px] opacity-80">
                        * 비과세 충족 요건: 5년 이상 납입, 10년 이상 유지, 월 150만원 이하
                      </span>
                    ) : (
                      <span className="block mt-1.5 text-[10px] opacity-80">
                        * 비과세 충족 요건: 10년 이상 유지, 총 납입액 1억 원 이하
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STEP 04: 납입 기간 및 유지 기간 설정 ── */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 uppercase tracking-widest">Step 04</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            납입 기간과 유지 기간을 설정해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 납입 기간 (적립식일 때만 선택 가능) */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" /> 납입 기간 (저축 보험료를 내는 기간)
            </label>
            {savingType === 'installment' ? (
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 7, 10].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setPaymentPeriod(period)}
                    className={`py-3.5 rounded-xl font-bold border transition-all text-sm ${
                      paymentPeriod === period
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-black shadow-sm'
                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {period}년납
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-xs font-black text-slate-400">일시납은 가입 시 전액 1회 납부로 고정됩니다.</span>
              </div>
            )}
          </div>

          {/* 유지 기간 (비과세 충족의 핵심) */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" /> 유지 기간 (계약을 유지하여 굴리는 기간)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 10, 15].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setMaintenancePeriod(period)}
                  className={`py-3.5 rounded-xl font-bold border transition-all text-sm relative ${
                    maintenancePeriod === period
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-black shadow-sm'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {period}년 유지
                  {period >= 10 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                      비과세
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── STEP 05: 유니버셜 기능 유무 ── */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 uppercase tracking-widest">Step 05</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            유니버셜 기능(추가납입 / 중도인출)을 희망하시나요?
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setHasUniversal(true)}
            type="button"
            className={`flex flex-col items-start p-6 rounded-3xl border text-left transition-all ${
              hasUniversal
                ? 'bg-emerald-50/50 border-emerald-500 shadow-md'
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="font-black text-sm text-slate-800 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 유니버셜 기능 적용 (추천)
            </span>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
              사업비가 추가로 떼이지 않는 **추가납입(한도의 200%)**을 적극 활용해 사업비 부담을 극대화하여 줄이고, 급전이 필요할 땐 해지하지 않고 **중도인출**할 수 있습니다.
            </p>
          </button>
          
          <button
            onClick={() => setHasUniversal(false)}
            type="button"
            className={`flex flex-col items-start p-6 rounded-3xl border text-left transition-all ${
              !hasUniversal
                ? 'bg-amber-50/50 border-amber-500 shadow-md'
                : 'bg-white border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="font-black text-sm text-slate-800 mb-1">
              미적용 (순수 저축 적립 위주)
            </span>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
              추가 납입이나 중도 인출 없이 만기까지 설정 금액을 단일 불입합니다. 유연성이 낮아 급전 필요 시 해약해야 할 리스크가 있습니다.
            </p>
          </button>
        </div>
      </div>

    </div>
  );
};

export default SavingsFields;
