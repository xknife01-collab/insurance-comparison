import React from 'react';
import { PiggyBank, CirclePercent, Coins, Clock, Calendar, ArrowRightLeft } from 'lucide-react';

interface Props {
  annuityType: 'savings' | 'insurance';
  setAnnuityType: (v: 'savings' | 'insurance') => void;
  monthlyPremium: number;
  setMonthlyPremium: (v: number) => void;
  paymentPeriod: number;
  setPaymentPeriod: (v: number) => void;
  commencementAge: number;
  setCommencementAge: (v: number) => void;
  annualIncome: number;
  setAnnualIncome: (v: number) => void;
  hasIrp: boolean;
  setHasIrp: (v: boolean) => void;
  receivingPeriod: number;
  setReceivingPeriod: (v: number) => void;
}

export const AnnuityFields: React.FC<Props> = ({
  annuityType,
  setAnnuityType,
  monthlyPremium,
  setMonthlyPremium,
  paymentPeriod,
  setPaymentPeriod,
  commencementAge,
  setCommencementAge,
  annualIncome,
  setAnnualIncome,
  hasIrp,
  setHasIrp,
  receivingPeriod,
  setReceivingPeriod,
}) => {
  return (
    <div id="input-annuity-fields" className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── SECTION 1: 연금저축 vs 일반연금 선택 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <PiggyBank className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-blue-500/25 text-blue-300 px-3 py-1.5 rounded-full border border-blue-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              가입하고자 하는 연금의 종류를 골라주세요
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setAnnuityType('savings')}
              type="button"
              className={`flex flex-col items-start p-8 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                annuityType === 'savings'
                  ? 'bg-blue-500/10 border-blue-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <CirclePercent className={`w-10 h-10 mb-4 ${annuityType === 'savings' ? 'text-blue-400' : 'text-slate-400'}`} />
              <span className="font-black text-lg text-white mb-2">세액공제형 연금저축보험</span>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                직장인 연말정산 필수템! 납입 기간 중 **매년 최대 600만 원 한도로 13.2%~16.5% 세액공제** 환급 혜택을 집중하여 받습니다. (수령 시 연금소득세 부과)
              </p>
            </button>
            <button
              onClick={() => setAnnuityType('insurance')}
              type="button"
              className={`flex flex-col items-start p-8 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                annuityType === 'insurance'
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <ArrowRightLeft className={`w-10 h-10 mb-4 ${annuityType === 'insurance' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="font-black text-lg text-white mb-2">비과세형 일반 연금보험</span>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                미래의 안정성에 투자! 납입 시 세액공제 혜택은 없으나, **10년 이상 유지 후 연금 수령 시 이자소득세(15.4%)가 전액 면제**됩니다.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 소득 및 월 납입금액 설정 ── */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full border border-blue-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            소득 수준과 월 희망 저축액을 정해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 연소득 구간 선택 */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 block">연간 총 급여액 (환급 요율 계산용)</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '5,500만원 이하 (16.5% 공제)', val: 50000000 },
                { label: '5,500만원 초과 (13.2% 공제)', val: 70000000 }
              ].map((inc) => (
                <button
                  key={inc.val}
                  type="button"
                  onClick={() => setAnnualIncome(inc.val)}
                  className={`py-4 px-3 rounded-2xl font-bold border transition-all text-xs text-center flex items-center justify-center ${
                    (inc.val === 50000000 && annualIncome <= 55000000) || (inc.val === 70000000 && annualIncome > 55000000)
                      ? 'border-blue-500 bg-blue-50/50 text-blue-600 font-black'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {inc.label}
                </button>
              ))}
            </div>
          </div>

          {/* 월 저축액 선택 */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 block">월 저축 희망 보험료</label>
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
              {[100000, 200000, 300000, 500000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMonthlyPremium(val)}
                  className="bg-white border border-slate-100 hover:border-slate-200 text-slate-500 font-semibold text-xs px-4 py-2 rounded-lg transition-all"
                >
                  {val >= 10000 ? `${(val / 10000).toLocaleString()}만원` : val.toLocaleString()}
                </button>
              ))}
              <span className="text-[10px] text-slate-400 font-bold self-center ml-auto">
                * 세액공제 최적 설정은 연 600만원(월 50만원)입니다.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: 연금 적립 및 수령 계획 ── */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full border border-blue-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            연금의 적립 기간과 수령 계획을 설정해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 납입 기간 */}
          <div className="space-y-4 text-left">
            <label className="text-xs font-black text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> 납입 기간 (보험료 내는 기간)
            </label>
            <div className="flex flex-col gap-2">
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

          {/* 개시 나이 */}
          <div className="space-y-4 text-left">
            <label className="text-xs font-black text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" /> 연금 수령 개시 나이
            </label>
            <div className="flex flex-col gap-2">
              {[55, 60, 65, 70].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setCommencementAge(age)}
                  className={`py-3.5 rounded-xl font-bold border transition-all text-sm ${
                    commencementAge === age
                      ? 'border-blue-500 bg-blue-50 text-blue-600 font-black shadow-sm'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  만 {age}세부터 수령
                </button>
              ))}
            </div>
          </div>

          {/* 수령 기간 */}
          <div className="space-y-4 text-left">
            <label className="text-xs font-black text-slate-400 flex items-center gap-2">
              <Coins className="w-4 h-4 text-blue-500" /> 연금 수령 방식 / 기간
            </label>
            <div className="flex flex-col gap-2">
              {[
                { label: '10년 동안 확정 수령', val: 10 },
                { label: '20년 동안 확정 수령', val: 20 },
                { label: '종신형 (사망 시까지 평생)', val: 999 }
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setReceivingPeriod(item.val)}
                  className={`py-3.5 rounded-xl font-bold border transition-all text-sm ${
                    receivingPeriod === item.val
                      ? 'border-blue-500 bg-blue-50 text-blue-600 font-black shadow-sm'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* IRP 연동 여부 (추가 할인 및 한도 증액 옵션) */}
        <div className="p-6 rounded-[2rem] bg-blue-50/30 border border-blue-100/50 mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h5 className="text-sm font-black text-slate-800">혹시 개인형 퇴직연금(IRP)도 고려 중이신가요?</h5>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
              IRP를 같이 가입하면 세액공제 통합 한도가 **최대 900만 원**으로 늘어나며, 연간 절세 혜택을 추가로 받을 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setHasIrp(!hasIrp)}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs transition-all border shrink-0 ${
              hasIrp
                ? 'bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/25'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {hasIrp ? 'IRP 결합 절세 가이드 적용 중' : 'IRP 결합 절세 가이드 켜기'}
          </button>
        </div>
      </div>

    </div>
  );
};
export default AnnuityFields;
