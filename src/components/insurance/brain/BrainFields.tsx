import React from 'react';
import { Brain, Shield, Clock, Activity, Zap, HeartPulse } from 'lucide-react';

interface Props {
  diagnosisAmount: number;
  setDiagnosisAmount: (v: number) => void;
  paymentType: 'non-renewable' | 'renewable';
  setPaymentType: (v: 'non-renewable' | 'renewable') => void;
  surgeryBenefit: boolean;
  setSurgeryBenefit: (v: boolean) => void;
  coveragePeriod: number;
  setCoveragePeriod: (v: number) => void;
}

export const BrainFields: React.FC<Props> = ({
  diagnosisAmount, setDiagnosisAmount,
  paymentType, setPaymentType,
  surgeryBenefit, setSurgeryBenefit,
  coveragePeriod, setCoveragePeriod
}) => {
  return (
    <div className="bg-indigo-50/30 rounded-[3rem] p-10 mb-12 border border-indigo-100/50">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-800">뇌혈관 보험 정밀 설계</h3>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[0.6rem] font-black text-indigo-400 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-widest">Brain Specialization</span>
            <span className="text-[0.7rem] font-black text-slate-500 bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">
               💡 뇌혈관 진단비 1,000만원 기준 최적화 설계 중
            </span>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 뇌혈관질환 진단비 */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <Shield size={12} /> 뇌혈관질환 진단비
           </p>
            <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
              {[10000000, 20000000, 30000000].map((v) => (
                <button
                  key={v}
                  onClick={() => setDiagnosisAmount(v)}
                  className={`flex-1 py-3 rounded-xl transition-all flex flex-col items-center gap-0.5 ${diagnosisAmount === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
                >
                  <span className="text-xs font-black">{(v/10000).toLocaleString()}만</span>
                  <span className={`text-[0.55rem] font-bold opacity-70 ${diagnosisAmount === v ? 'text-indigo-100' : 'text-slate-300'}`}>
                    {v === 10000000 ? '병원비 보전' : v === 20000000 ? '인기 표준형' : '생활비/재활'}
                  </span>
                </button>
              ))}
            </div>
        </div>

        {/* 유병자 보험 안내 배너 */}
        <div className="col-span-1">
           <div className="h-full bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex flex-col justify-center gap-2 group hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-2 text-blue-600 font-black text-[0.6rem] uppercase tracking-widest">
                 <Activity size={14} /> 유병자 보험 안내
              </div>
              <p className="text-[0.65rem] font-bold text-slate-600 leading-tight">
                최근 5년 내 <span className="text-blue-600">수술/입원 이력</span>이 있으신가요?<br/>
                <span className="underline font-black text-slate-900">유병자 보험 비교</span>에서 더 저렴한 전용 플랜을 확인해 보세요.
              </p>
           </div>
        </div>

        {/* 뇌혈관질환 수술비 */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <HeartPulse size={12} /> 뇌혈관질환 수술비
           </p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
             {[false, true].map((v) => (
               <button
                 key={v ? 'y' : 'n'}
                 onClick={() => setSurgeryBenefit(v)}
                 className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${surgeryBenefit === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
               >
                 {v ? '포함' : '미포함'}
               </button>
             ))}
           </div>
        </div>

        {/* 납입/갱신 유형 */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <Clock size={12} /> 납입/갱신 유형
           </p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
             {['renewable', 'non-renewable'].map((v) => (
               <button
                 key={v}
                 onClick={() => setPaymentType(v as any)}
                 className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${paymentType === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
               >
                 {v === 'renewable' ? '갱신형' : '비갱신형'}
               </button>
             ))}
           </div>
        </div>

        {/* 보장 만기 */}
        <div className="space-y-3">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest flex items-center gap-1">
             <Zap size={12} /> 보장 만기
           </p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
             {[80, 90, 100].map((v) => (
               <button
                 key={v}
                 onClick={() => setCoveragePeriod(v)}
                 className={`flex-1 py-3 rounded-xl transition-all flex flex-col items-center gap-0.5 ${coveragePeriod === v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
               >
                 <span className="text-xs font-black">{v}세</span>
                 <span className={`text-[0.55rem] font-bold opacity-70 ${coveragePeriod === v ? 'text-slate-300' : 'text-slate-300'}`}>
                   {v === 80 ? '가성비' : v === 90 ? '전문가 추천' : '든든보장'}
                 </span>
               </button>
             ))}
           </div>
        </div>

        {/* 뇌 관련 아이콘 장식 */}
        <div className="flex items-center justify-center opacity-10">
           <Brain size={64} className="text-indigo-600" />
        </div>
      </div>
    </div>
  );
};
