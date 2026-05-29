import React from 'react';
import { Brain, Home, Building2, HelpCircle, BadgeCheck, ShieldAlert, UserCheck, AlertTriangle } from 'lucide-react';

interface Props {
  diagnosisAmount: number;
  setDiagnosisAmount: (v: number) => void;
  monthlyAllowance: number;
  setMonthlyAllowance: (v: number) => void;
  serviceType: 'home' | 'facility' | 'both';
  setServiceType: (v: 'home' | 'facility' | 'both') => void;
  
  // New dementia-specific underwriting and claim fields
  hasProxyClaim: boolean;
  setHasProxyClaim: (v: boolean) => void;
  hasDementiaHistory: boolean | null;
  setHasDementiaHistory: (v: boolean | null) => void;
  hasLtcGrade: boolean | null;
  setHasLtcGrade: (v: boolean | null) => void;
  
  subType?: 'mild' | 'severe';
}

export const CaregivingOldFields: React.FC<Props> = ({
  diagnosisAmount, setDiagnosisAmount,
  monthlyAllowance, setMonthlyAllowance,
  serviceType, setServiceType,
  hasProxyClaim, setHasProxyClaim,
  hasDementiaHistory, setHasDementiaHistory,
  hasLtcGrade, setHasLtcGrade,
  subType = 'mild'
}) => {
  const isMild = subType === 'mild';
  const isSevere = subType === 'severe';

  return (
    <div className="bg-amber-50/30 rounded-[3rem] p-8 md:p-10 mb-12 border border-amber-100/50 space-y-12">
      
      {/* ── Section 1: 보장금액 및 선호 서비스 설정 ── */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
            <Brain size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">치매·간병 자산 상세 설정</h3>
            <p className="text-[0.65rem] font-black text-amber-500 uppercase tracking-widest mt-0.5">Dementia Asset Optimization</p>
          </div>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            {/* 치매 진단비 설정 */}
            <div className={`space-y-4 transition-all duration-300 ${isSevere ? 'opacity-30 pointer-events-none' : ''}`}>
              <div className="flex justify-between items-end px-1">
                <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">
                  치매 진단비 {isSevere && '(중증 간병 집중 - 미선택)'}
                </label>
                <span className="text-xl font-black text-amber-600">
                  {isSevere ? '기본형' : `${(diagnosisAmount / 10000).toLocaleString()}만원`}
                </span>
              </div>
              <input 
                type="range" min="10000000" max="50000000" step="10000000"
                disabled={isSevere}
                value={diagnosisAmount} onChange={(e) => setDiagnosisAmount(Number(e.target.value))}
                className="w-full h-3 bg-white rounded-lg appearance-none cursor-pointer accent-amber-500 border border-amber-100 shadow-inner"
              />
            </div>
 
            {/* 간병 생활자금 설정 */}
            <div className={`space-y-4 transition-all duration-300 ${isMild ? 'opacity-30 pointer-events-none' : ''}`}>
              <div className="flex justify-between items-end px-1">
                <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">
                  매월 간병 생활비 {isMild && '(경증 치매 집중 - 미선택)'}
                </label>
                <span className="text-xl font-black text-amber-600">
                  {isMild ? '기본형' : `${(monthlyAllowance / 10000).toLocaleString()}만원`}
                </span>
              </div>
              <input 
                type="range" min="300000" max="1000000" step="100000"
                disabled={isMild}
                value={monthlyAllowance} onChange={(e) => setMonthlyAllowance(Number(e.target.value))}
                className="w-full h-3 bg-white rounded-lg appearance-none cursor-pointer accent-amber-500 border border-amber-100 shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* 서비스 선호도 */}
            <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest pl-1">선호 돌봄 서비스</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'home', label: '재가급여', icon: <Home size={18} />, desc: '집에서 케어' },
                { id: 'facility', label: '시설급여', icon: <Building2 size={18} />, desc: '요양원 등' },
                { id: 'both', label: '전체보장', icon: <BadgeCheck size={18} />, desc: '빈틈없는 케어' }
              ].map((type) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setServiceType(type.id as any)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] border-2 transition-all ${
                    serviceType === type.id 
                      ? 'bg-white border-amber-500 shadow-xl scale-105 text-slate-900' 
                      : 'bg-white/50 border-transparent text-slate-300 grayscale'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${serviceType === type.id ? 'bg-amber-50 text-amber-500' : 'bg-slate-50'}`}>
                    {type.icon}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black">{type.label}</p>
                    <p className="text-[0.6rem] font-bold opacity-60">{type.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 p-5 bg-white/60 rounded-3xl border border-amber-100 flex gap-4">
              <HelpCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-[0.7rem] text-slate-500 font-bold leading-relaxed">
                최근에는 <span className="text-amber-600 font-black">재가급여</span>를 선호하는 비중이 80% 이상입니다. 익숙한 집에서 요양보호사의 도움을 받는 플랜이 가장 인기가 높습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: 치매 가입 심사 및 청구 편의 설정 ── */}
      <div className="border-t border-amber-100/50 pt-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
            <UserCheck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">치매 심사 및 청구 편의 설정</h3>
            <p className="text-[0.65rem] font-black text-amber-500 uppercase tracking-widest mt-0.5">Dementia Claim & Screening</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* 1. 지정대리청구인 지정 설정 */}
          <div className="bg-white/40 p-6 rounded-[2rem] border border-amber-100/50 space-y-4 flex flex-col justify-between h-full min-h-[300px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <label className="text-sm font-black text-slate-800 tracking-tight">지정대리청구인 사전 지정</label>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">치매 발병 시 본인 대신 보험금을 청구할 대리인 지정 여부</p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setHasProxyClaim(true)}
                  className={`w-full py-4 px-4 rounded-2xl border-2 font-black text-xs transition-all duration-300 ${
                    hasProxyClaim 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  예, 지정하겠습니다 (권장)
                </button>
                <button
                  type="button"
                  onClick={() => setHasProxyClaim(false)}
                  className={`w-full py-4 px-4 rounded-2xl border-2 font-black text-xs transition-all duration-300 ${
                    !hasProxyClaim 
                      ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-[1.02]' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  아니오, 나중에 하겠습니다
                </button>
              </div>
              {!hasProxyClaim && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-2.5 animate-in fade-in duration-300">
                  <ShieldAlert className="text-red-500 shrink-0" size={16} />
                  <p className="text-[0.65rem] text-red-700 font-bold leading-normal">
                    본인 청구가 어려우므로 미지정 시 보험금 수령에 큰 불이익이 발생할 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. 치매/뇌질환 병력 여부 */}
          <div className="bg-white/40 p-6 rounded-[2rem] border border-amber-100/50 space-y-4 flex flex-col justify-between h-full min-h-[300px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <label className="text-sm font-black text-slate-800 tracking-tight">치매/뇌질환 진단·치료</label>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">최근 1~5년 내 치매, 경도인지장애(MCI), 알츠하이머, 파킨슨병, 뇌졸중 이력</p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setHasDementiaHistory(true)}
                  className={`w-full py-4 px-4 rounded-2xl border-2 font-black text-xs transition-all duration-300 ${
                    hasDementiaHistory === true 
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-[1.02]' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  네, 있습니다
                </button>
                <button
                  type="button"
                  onClick={() => setHasDementiaHistory(false)}
                  className={`w-full py-4 px-4 rounded-2xl border-2 font-black text-xs transition-all duration-300 ${
                    hasDementiaHistory === false 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  아니오, 없습니다
                </button>
              </div>
              {hasDementiaHistory === true && (
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-2.5 animate-in fade-in duration-300">
                  <AlertTriangle className="text-orange-600 shrink-0" size={16} />
                  <p className="text-[0.65rem] text-orange-800 font-bold leading-normal">
                    병력이 있으실 경우 '초간편 심사형 치매보험'으로 가입이 제한적으로 비교 가능합니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. 노인장기요양 등급 신청/판정 이력 */}
          <div className="bg-white/40 p-6 rounded-[2rem] border border-amber-100/50 space-y-4 flex flex-col justify-between h-full min-h-[300px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <label className="text-sm font-black text-slate-800 tracking-tight">장기요양등급 신청/판정</label>
              </div>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">노인장기요양보험 1~5등급, 인지원등급 보유 또는 신청 중인지 여부</p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  type="button"
                  onClick={() => setHasLtcGrade(true)}
                  className={`w-full py-4 px-4 rounded-2xl border-2 font-black text-xs transition-all duration-300 ${
                    hasLtcGrade === true 
                      ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-[1.02]' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  네, 그렇습니다
                </button>
                <button
                  type="button"
                  onClick={() => setHasLtcGrade(false)}
                  className={`w-full py-4 px-4 rounded-2xl border-2 font-black text-xs transition-all duration-300 ${
                    hasLtcGrade === false 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  아니오, 아닙니다
                </button>
              </div>
              {hasLtcGrade === true && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3">
                  <ShieldAlert className="text-red-500 shrink-0" size={18} />
                  <p className="text-[0.7rem] text-red-700 font-bold leading-relaxed">
                    장기요양등급을 이미 판정받았거나 신청 중이신 경우, **민간 치매간병보험의 가입이 전면 제한**될 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
