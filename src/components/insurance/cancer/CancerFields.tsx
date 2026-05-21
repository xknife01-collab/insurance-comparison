import React from 'react';
import { Target, Shield, Zap, Heart, Activity, Clock } from 'lucide-react';

interface Props {
  diagnosisAmount: number;
  setDiagnosisAmount: (v: number) => void;
  targetedTherapy: boolean;
  setTargetedTherapy: (v: boolean) => void;
  treatmentCost2025: boolean;
  setTreatmentCost2025: (v: boolean) => void;
  paymentType: 'non-renewable' | 'renewable' | 'targeted';
  setPaymentType: (v: 'non-renewable' | 'renewable' | 'targeted') => void;
  recurrentCancer: boolean;
  setRecurrentCancer: (v: boolean) => void;
  familyHistory: boolean;
  setFamilyHistory: (v: boolean) => void;
}

export const CancerFields: React.FC<Props> = ({
  diagnosisAmount, setDiagnosisAmount,
  targetedTherapy, setTargetedTherapy,
  treatmentCost2025, setTreatmentCost2025,
  paymentType, setPaymentType,
  recurrentCancer, setRecurrentCancer,
  familyHistory, setFamilyHistory
}) => {
  return (
    <div className="bg-rose-50/30 rounded-[3rem] p-10 mb-12 border border-rose-100/50">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-800">암보험 정밀 설계 설정</h3>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[0.6rem] font-black text-rose-400 border border-rose-200 px-3 py-1 rounded-full uppercase tracking-widest">Cancer Specialization</span>
            <span className="text-[0.7rem] font-black text-slate-500 bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">
               💡 2025년 최신 암주요치료비 담보를 포함해 보세요
            </span>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 일반암 진단비 */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <Shield size={12} /> 일반암 진단비
           </p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
             {[30000000, 50000000, 100000000].map((v) => (
               <button
                 key={v}
                 onClick={() => setDiagnosisAmount(v)}
                 className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${diagnosisAmount === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
               >
                 {(v/10000).toLocaleString()}만
               </button>
             ))}
           </div>
        </div>

        {/* 최신 암주요치료비 (2025 트렌드) */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <Zap size={12} className="text-orange-500" /> 2025 암주요치료비
           </p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
             {[true, false].map((v) => (
               <button
                 key={v ? 'y' : 'n'}
                 onClick={() => setTreatmentCost2025(v)}
                 className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${treatmentCost2025 === v ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
               >
                 {v ? '포함(추천)' : '미포함'}
               </button>
             ))}
           </div>
        </div>

        {/* 표적항암/방사선 */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <Target size={12} /> 표적항암/중입자
           </p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
             {[true, false].map((v) => (
               <button
                 key={v ? 'y' : 'n'}
                 onClick={() => setTargetedTherapy(v)}
                 className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${targetedTherapy === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
               >
                 {v ? '풀보장' : '진단비만'}
               </button>
             ))}
           </div>
        </div>

        {/* 납입 유형 */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <Clock size={12} /> 납입/갱신 유형
           </p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
             {['non-renewable', 'renewable', 'targeted'].map((v) => (
               <button
                 key={v}
                 onClick={() => setPaymentType(v as any)}
                 className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${paymentType === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
               >
                 {v === 'non-renewable' ? '비갱신형' : v === 'renewable' ? '갱신형' : '표적항암형'}
               </button>
             ))}
           </div>
        </div>

        {/* 재발/전이암 보장 */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <Activity size={12} /> 재발/전이암
           </p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
             {[true, false].map((v) => (
               <button
                 key={v ? 'y' : 'n'}
                 onClick={() => setRecurrentCancer(v)}
                 className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${recurrentCancer === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
               >
                 {v ? '반복지급' : '1회지급'}
               </button>
             ))}
           </div>
        </div>

        {/* 가족력 고지 */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <Heart size={12} /> 암 가족력
           </p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
             {[true, false].map((v) => (
               <button
                 key={v ? 'y' : 'n'}
                 onClick={() => setFamilyHistory(v)}
                 className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${familyHistory === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
               >
                 {v ? '있음' : '없음'}
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
