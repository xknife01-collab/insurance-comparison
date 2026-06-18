import React from 'react';
import { Users, Scale, PiggyBank, ShieldCheck, Clock, ShieldAlert, Award } from 'lucide-react';

interface Props {
  objective: 'family' | 'inheritance' | 'savings';
  setObjective: (v: 'family' | 'inheritance' | 'savings') => void;
  paymentPeriod: number;
  setPaymentPeriod: (v: number) => void;
  deathBenefit: number;
  setDeathBenefit: (v: number) => void;
  refundType: 'standard' | 'low';
  setRefundType: (v: 'standard' | 'low') => void;
  isStepUp: boolean;
  setIsStepUp: (v: boolean) => void;
}

export const WholeLifeFields: React.FC<Props> = ({
  objective,
  setObjective,
  paymentPeriod,
  setPaymentPeriod,
  deathBenefit,
  setDeathBenefit,
  refundType,
  setRefundType,
  isStepUp,
  setIsStepUp
}) => {
  const formatAmt = (amt: number) => {
    if (amt >= 100000000) return `${(amt / 100000000).toFixed(0)}억`;
    return `${(amt / 10000).toLocaleString()}만`;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* ── SECTION 1: 가입 목적 및 사망보험금 ── */}
      <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Users className="w-40 h-40" />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-indigo-500/25 text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-400/30 uppercase tracking-widest">Step 01</span>
            <h4 className="text-xl md:text-2xl font-black tracking-tight text-white">
              보장 자산을 설계하려는 주요 목적과 사망보험금을 설정해 주세요
            </h4>
          </div>

          {/* 가입 목적 토글 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => {
                setObjective('family');
                if (deathBenefit < 100000000) setDeathBenefit(100000000);
              }}
              type="button"
              className={`flex flex-col items-start p-6 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                objective === 'family'
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Users className={`w-8 h-8 mb-4 ${objective === 'family' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="font-black text-base text-white">유가족 생활비 보장</span>
              <span className="text-[10px] text-slate-400 font-bold mt-1">사망 시 남겨진 가족들의 안정적 생활자금 확보</span>
            </button>

            <button
              onClick={() => {
                setObjective('inheritance');
                if (deathBenefit < 200000000) setDeathBenefit(200000000);
              }}
              type="button"
              className={`flex flex-col items-start p-6 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                objective === 'inheritance'
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Scale className={`w-8 h-8 mb-4 ${objective === 'inheritance' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="font-black text-base text-white">상속세 재원 마련</span>
              <span className="text-[10px] text-slate-400 font-bold mt-1">부동산/자산 상속 시 급격한 현금 세금 납부 대비</span>
            </button>

            <button
              onClick={() => {
                setObjective('savings');
              }}
              type="button"
              className={`flex flex-col items-start p-6 rounded-[2.5rem] border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                objective === 'savings'
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-xl'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <PiggyBank className={`w-8 h-8 mb-4 ${objective === 'savings' ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="font-black text-base text-white">목돈 마련 (연금 연계)</span>
              <span className="text-[10px] text-slate-400 font-bold mt-1">완납 후 비과세 저축/연금으로 전환 및 목적자금</span>
            </button>
          </div>

          {/* 사망보험금 설정 슬라이더 */}
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">설정 사망보험금</label>
              <span className="text-3xl font-black text-indigo-400">{formatAmt(deathBenefit)}원</span>
            </div>
            <input
              type="range"
              min={30000000}
              max={500000000}
              step={10000000}
              value={deathBenefit}
              onChange={(e) => setDeathBenefit(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex gap-2">
              {[50000000, 100000000, 200000000, 300000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDeathBenefit(val)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    deathBenefit === val 
                      ? 'bg-indigo-500 text-white shadow-md' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {formatAmt(val)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 납입 기간 및 환급형 선택 ── */}
      <div className="bg-white border border-indigo-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full border border-indigo-200 uppercase tracking-widest">Step 02</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            납입 기간과 해약환급금의 형태를 선택해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 납입 기간 */}
          <div className="space-y-4 text-left">
            <label className="text-xs font-black text-slate-400 block">납입 기간 (보험료 납부 완료 기한)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[5, 7, 10, 20].map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setPaymentPeriod(period)}
                  className={`py-3.5 rounded-xl font-bold border transition-all text-sm ${
                    paymentPeriod === period
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-black shadow-sm'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {period}년납 {period <= 10 && '🔥 단기'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-2">
              * 최근 트렌드는 조기 완납 후 장기 복리 혜택을 누리는 5년납/7년납 단기납의 선택 비중이 75% 이상입니다.
            </p>
          </div>

          {/* 환급형 구조 */}
          <div className="space-y-4 text-left">
            <label className="text-xs font-black text-slate-400 block">해약환급금 구조 (저해지 vs 일반)</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRefundType('low')}
                className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all border ${
                  refundType === 'low'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                }`}
              >
                저해지/무해지 환급형
              </button>
              <button
                type="button"
                onClick={() => setRefundType('standard')}
                className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all border ${
                  refundType === 'standard'
                    ? 'bg-slate-900 text-white border-slate-800'
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                }`}
              >
                일반 환급형
              </button>
            </div>
            
            {/* 해지 위험 안내 경고/정보 */}
            {refundType === 'low' ? (
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100/70 flex items-start gap-3">
                <ShieldCheck size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-900 font-bold leading-relaxed">
                  <span className="font-black text-indigo-700 block mb-0.5">💰 저해지형의 장점 & 주의점</span>
                  납입 중 해지 시에는 원금 회복률이 매우 낮으나, 대신 동일 보장 대비 월 보험료가 <span className="text-rose-600 font-black">15~20% 저렴</span>하며 완납 후 환급률은 일반형 대비 훨씬 월등합니다. (장기 유지 최적화)
                </p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-900 font-bold leading-relaxed">
                  <span className="font-black text-amber-700 block mb-0.5">⚠️ 일반환급형의 특징</span>
                  납입 중간에 해약하더라도 법정 해약환급금이 일부 확보되어 안전하지만, 동일 보장을 위해 내야 하는 월 보험료가 가장 비쌉니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: 보장 구조 (기본형 vs 체증형) ── */}
      <div className="bg-white border border-indigo-100 rounded-[3.5rem] p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full border border-indigo-200 uppercase tracking-widest">Step 03</span>
          <h4 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            사망 보장 구조를 설계해 주세요
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
          <div className="space-y-4">
            <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              물가상승 대비 사망금 증가 여부
            </h5>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsStepUp(false)}
                className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all border ${
                  !isStepUp
                    ? 'bg-slate-900 text-white border-slate-800'
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                }`}
              >
                기본형 (보장 고정)
              </button>
              <button
                type="button"
                onClick={() => setIsStepUp(true)}
                className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all border ${
                  isStepUp
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                }`}
              >
                체증형 (사망금 매년 증가)
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100">
            {isStepUp ? (
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                💡 <span className="font-black text-indigo-600">체증형(Step-up) 설계 완료</span><br />
                가입 후 특정 시점(예: 만 60세)부터 사망보험금이 <span className="text-indigo-600 font-black">매년 5%씩 20년간 단계적으로 체증(증액)</span>하여, 미래의 심각한 화폐 가치 하락과 물가상승으로부터 보장 자산의 실질적 가치를 든든하게 지켜냅니다.
              </p>
            ) : (
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                💡 <span className="font-black text-slate-700">기본형(Fixed) 설계 완료</span><br />
                시간이 흘러도 가입 시점의 사망보험금({formatAmt(deathBenefit)}원)이 평생 일정하게 유지되며, 월 보험료는 체증형에 비해 다소 저렴합니다. 단, 먼 미래에는 물가로 인한 실질 보장가치 하락이 발생할 수 있습니다.
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
