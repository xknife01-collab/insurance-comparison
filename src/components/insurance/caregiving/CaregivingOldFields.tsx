import React from 'react';
import { Brain, Home, Building2, HelpCircle, BadgeCheck } from 'lucide-react';

interface Props {
  diagnosisAmount: number;
  setDiagnosisAmount: (v: number) => void;
  monthlyAllowance: number;
  setMonthlyAllowance: (v: number) => void;
  serviceType: 'home' | 'facility' | 'both';
  setServiceType: (v: 'home' | 'facility' | 'both') => void;
}

export const CaregivingOldFields: React.FC<Props> = ({
  diagnosisAmount, setDiagnosisAmount,
  monthlyAllowance, setMonthlyAllowance,
  serviceType, setServiceType
}) => {
  return (
    <div className="bg-amber-50/30 rounded-[3rem] p-8 md:p-10 mb-12 border border-amber-100/50">
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
          <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
              <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">치매 진단비 (중증 기준)</label>
              <span className="text-xl font-black text-amber-600">{(diagnosisAmount / 10000).toLocaleString()}만원</span>
            </div>
            <input 
              type="range" min="10000000" max="50000000" step="10000000"
              value={diagnosisAmount} onChange={(e) => setDiagnosisAmount(Number(e.target.value))}
              className="w-full h-3 bg-white rounded-lg appearance-none cursor-pointer accent-amber-500 border border-amber-100 shadow-inner"
            />
          </div>

          {/* 간병 생활자금 설정 */}
          <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
              <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">매월 간병 생활비</label>
              <span className="text-xl font-black text-amber-600">{(monthlyAllowance / 10000).toLocaleString()}만원</span>
            </div>
            <input 
              type="range" min="300000" max="1000000" step="100000"
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
  );
};
