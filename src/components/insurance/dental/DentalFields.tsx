import React, { useState } from 'react';
import { Sparkles, AlertCircle, Info, Cigarette, Activity, CheckCircle2 } from 'lucide-react';

interface Props {
  lastYear: 'yes' | 'no';
  setLastYear: (v: 'yes' | 'no') => void;
  last5Years: 'yes' | 'no';
  setLast5Years: (v: 'yes' | 'no') => void;
  dentures: 'yes' | 'no';
  setDentures: (v: 'yes' | 'no') => void;
  implantLimit: '3' | 'unlimited';
  setImplantLimit: (v: '3' | 'unlimited') => void;
  crownAmount: number;
  setCrownAmount: (v: number) => void;
  focus: 'conservative' | 'prosthetic';
  setFocus: (v: 'conservative' | 'prosthetic') => void;
  diagnosticType: 'diagnostic' | 'non-diagnostic';
  setDiagnosticType: (v: 'diagnostic' | 'non-diagnostic') => void;
}

export const DentalFields: React.FC<Props> = (props) => {
  const {
    lastYear, setLastYear,
    last5Years, setLast5Years,
    dentures, setDentures,
    implantLimit, setImplantLimit,
    crownAmount, setCrownAmount,
    focus, setFocus,
    diagnosticType, setDiagnosticType
  } = props;
  const [extractionCandidate, setExtractionCandidate] = useState<'yes' | 'no'>('no');
  const [isSmoker, setIsSmoker] = useState<'yes' | 'no'>('no');
  const [scalingInterval, setScalingInterval] = useState<'6m' | '1y' | 'none'>('1y');

  return (
    <div className="bg-emerald-50/20 rounded-[4rem] p-10 md:p-14 mb-16 border border-emerald-100/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Activity size={120} className="text-emerald-500" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-500 rounded-[1.4rem] flex items-center justify-center text-white shadow-xl shadow-emerald-200/50">
               <Info size={28} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1.5">치과 정밀 건강 문진표</h3>
               <p className="text-[0.65rem] font-black text-emerald-600 uppercase tracking-[0.2em] opacity-70">Dental Advanced Diagnostic</p>
            </div>
         </div>
         <div className="bg-white px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <p className="text-[0.8rem] font-black text-slate-500">정확할수록 보험료가 할인됩니다</p>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <div className="space-y-4">
           <p className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest pl-2 mb-4">현재 및 과거 병력 (필수)</p>
           {[
             { title: '현재 발치 예정 치아 유무', subtitle: '의사 소견 또는 본인 인지', state: extractionCandidate, setter: setExtractionCandidate, icon: AlertCircle },
             { title: '1년 내 충치 치료 이력', subtitle: '보존/보충 치료 포함', state: lastYear, setter: setLastYear, icon: Activity },
             { title: '5년 내 잇몸 질환 상실', subtitle: '풍치/치주염으로 인한 발치', state: last5Years, setter: setLast5Years, icon: AlertCircle },
             { title: '현재 틀니(가철성) 사용', subtitle: '부분 틀니 포함', state: dentures, setter: setDentures, icon: Info },
           ].map((q, i) => (
             <div key={i} className={`flex items-center justify-between p-5 bg-white rounded-[2rem] border transition-all duration-300 ${q.state === 'yes' ? 'border-orange-200 shadow-lg shadow-orange-50' : 'border-slate-50 shadow-sm'}`}>
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${q.state === 'yes' ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-300'}`}>
                      <q.icon size={20} />
                   </div>
                   <div className="flex flex-col">
                      <p className="text-[0.95rem] font-black text-slate-800 tracking-tight leading-tight">{q.title}</p>
                      <p className="text-[0.65rem] font-bold text-slate-400 mt-0.5">{q.subtitle}</p>
                   </div>
                </div>
                <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shrink-0 ml-4">
                  <button onClick={() => q.setter('yes')} className={`px-6 py-2 rounded-xl text-[0.75rem] font-black transition-all ${q.state === 'yes' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300 hover:text-slate-500'}`}>예</button>
                  <button onClick={() => q.setter('no')} className={`px-6 py-2 rounded-xl text-[0.75rem] font-black transition-all ${q.state === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300 hover:text-slate-500'}`}>아니오</button>
                </div>
             </div>
           ))}
        </div>
        
        <div className="space-y-8">
           <div className="p-8 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm space-y-8">
              <p className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest mb-4 italic">생활 습관 및 보장 니즈</p>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                    <Cigarette size={18} className="text-slate-400" />
                    <p className="text-[0.85rem] font-black text-slate-600 pl-1">흡연 여부 <span className="text-[0.6rem] font-bold text-slate-300 ml-2">치주질환 위험도 반영</span></p>
                 </div>
                 <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                   {[
                     { l: '비흡연 (청정)', v: 'no' },
                     { l: '흡연 중 (위험)', v: 'yes' }
                   ].map((opt, i) => (
                     <button
                       key={i}
                       onClick={() => setIsSmoker(opt.v as any)}
                       className={`flex-1 py-3 rounded-xl text-[0.75rem] font-black transition-all ${isSmoker === opt.v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300'}`}
                     >
                       {opt.l}
                     </button>
                   ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <p className="text-[0.85rem] font-black text-slate-600 pl-1">스케일링(치석 제거) 주기</p>
                 <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                   {[
                     { l: '6개월 미만', v: '6m' },
                     { l: '1년 단위', v: '1y' },
                     { l: '거의 안 함', v: 'none' }
                   ].map((opt, i) => (
                     <button
                       key={i}
                       onClick={() => setScalingInterval(opt.v as any)}
                       className={`flex-1 py-3 rounded-xl text-[0.75rem] font-black transition-all ${scalingInterval === opt.v ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-300'}`}
                     >
                       {opt.l}
                     </button>
                   ))}
                 </div>
              </div>

               <div className="space-y-4">
                  <p className="text-[0.85rem] font-black text-slate-600 pl-1">가입 상세 유형 (심사 방식)</p>
                  <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                    {[
                      { l: '무진단형 (간편)', v: 'non-diagnostic' },
                      { l: '진단형 (검진)', v: 'diagnostic' }
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => (props as any).setDiagnosticType?.(opt.v)}
                        className={`flex-1 py-3 rounded-xl text-[0.75rem] font-black transition-all ${(props as any).diagnosticType === opt.v ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-300'}`}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                  <p className="text-[0.6rem] font-bold text-slate-400 pl-1 leading-relaxed">
                    * 진단형: 치과 검진 후 가입. 보험료 약 20% 할인 + 면책/감액기간 없음 (즉시 100% 보장)<br/>
                    * 무진단형: 검진 없이 바로 가입. 가입 절차가 간편하지만 1~2년의 감액기간 존재
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                   <p className="text-[0.85rem] font-black text-slate-600 pl-1">임플란트 한도</p>
                   <select 
                      value={implantLimit} 
                      onChange={(e) => setImplantLimit(e.target.value as any)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[0.85rem] font-black text-slate-800 outline-none focus:border-emerald-200 transition-all"
                   >
                      <option value="3">연간 3개 한도 (절약)</option>
                      <option value="unlimited">무제한 (강력추천)</option>
                   </select>
                </div>
                <div className="space-y-3">
                   <p className="text-[0.85rem] font-black text-slate-600 pl-1">크라운 보장액</p>
                   <select 
                      value={crownAmount} 
                      onChange={(e) => setCrownAmount(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[0.85rem] font-black text-slate-800 outline-none focus:border-emerald-200 transition-all"
                   >
                      <option value={200000}>개당 20만원</option>
                      <option value={300000}>개당 30만원</option>
                      <option value={500000}>개당 50만원</option>
                   </select>
                </div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-14 p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-emerald-100 flex flex-col md:flex-row items-center gap-6 relative z-10 transition-all hover:bg-white hover:shadow-2xl hover:shadow-emerald-100/50 group">
         <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-all duration-500">
            <Sparkles size={32} />
         </div>
         <div className="flex flex-col text-center md:text-left">
            <p className="text-[0.95rem] text-slate-700 font-extrabold leading-relaxed mb-1">
               최근 2년간 치과 검진 이력이 깨끗하시다면 <span className="text-emerald-600 underline underline-offset-4 decoration-2">"진단형"</span> 가입을 강력 추천합니다.
            </p>
            <p className="text-[0.7rem] text-slate-400 font-bold">
               감액기간(50% 지급) 없이 가입 즉시 100% 보장을 받을 수 있는 유일한 방법입니다.
            </p>
         </div>
         <button className="md:ml-auto px-10 py-5 bg-slate-900 text-white rounded-[1.8rem] text-[0.85rem] font-black hover:bg-black shadow-xl active:scale-95 transition-all">
            진단형 상담하기
         </button>
      </div>
    </div>
  );
};
