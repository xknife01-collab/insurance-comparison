import React from 'react';
import { Syringe, Bed, Users, ShieldCheck, ChevronRight, Activity } from 'lucide-react';

interface Props {
  surgeryFocus: 'wide' | 'named' | 'major';
  setSurgeryFocus: (v: 'wide' | 'named' | 'major') => void;
  hospitalAmount: number;
  setHospitalAmount: (v: number) => void;
  caregiverOption: 'none' | 'use' | 'support';
  setCaregiverOption: (v: 'none' | 'use' | 'support') => void;
  tertiaryHospital: boolean;
  setTertiaryHospital: (v: boolean) => void;
}

export const SurgeryFields: React.FC<Props> = ({
  surgeryFocus, setSurgeryFocus,
  hospitalAmount, setHospitalAmount,
  caregiverOption, setCaregiverOption,
  tertiaryHospital, setTertiaryHospital
}) => {
  return (
    <div className="bg-orange-50/30 rounded-[4rem] p-10 md:p-14 mb-16 border border-orange-100/40 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Activity size={120} className="text-orange-500" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500 rounded-[1.4rem] flex items-center justify-center text-white shadow-xl shadow-orange-200/50">
               <Activity size={28} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1.5">수술·입원 보장 설계</h3>
               <p className="text-[0.65rem] font-black text-orange-600 uppercase tracking-[0.2em] opacity-70">Surgery & Hospitalization Advanced</p>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        <div className="space-y-4">
           <p className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest pl-2 mb-4">수술비 보장 스타일 (택 1)</p>
           {[
             { id: 'wide', title: '광범위 질병/상해형', desc: '모든 수술을 폭넓게 보장', icon: ShieldCheck },
             { id: 'named', title: '1-5종 정밀 요율형', desc: '수술 난이도별 차등 고액 보장', icon: Activity },
             { id: 'major', title: '중증 집중 보장형', desc: '암·뇌·심 등 주요 수술 집중', icon: Syringe },
           ].map((opt) => (
             <button
               key={opt.id}
               onClick={() => setSurgeryFocus(opt.id as any)}
               className={`w-full flex items-center justify-between p-6 rounded-[2.2rem] border transition-all duration-300 ${surgeryFocus === opt.id ? 'bg-white border-orange-200 shadow-xl scale-[1.02]' : 'bg-white/50 border-slate-50 text-slate-400'}`}
             >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${surgeryFocus === opt.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                    <opt.icon size={24} />
                  </div>
                  <div className="text-left">
                    <p className={`text-[1.05rem] font-black ${surgeryFocus === opt.id ? 'text-slate-800' : 'text-slate-400'}`}>{opt.title}</p>
                    <p className="text-[0.75rem] font-medium opacity-70">{opt.desc}</p>
                  </div>
                </div>
                <ChevronRight size={20} className={surgeryFocus === opt.id ? 'text-orange-500' : 'text-slate-200'} />
             </button>
           ))}
        </div>
        
        <div className="space-y-8">
           <div className="p-8 bg-white rounded-[3rem] border border-orange-50 shadow-sm space-y-10">
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                   <p className="text-[0.9rem] font-black text-slate-800 flex items-center gap-2">
                     <Bed size={18} className="text-orange-500" /> 1일당 입원비 목표액
                   </p>
                   <span className="text-orange-600 font-black text-lg">{hospitalAmount.toLocaleString()}원</span>
                 </div>
                 <input 
                   type="range" min="0" max="150000" step="10000"
                   value={hospitalAmount}
                   onChange={(e) => setHospitalAmount(Number(e.target.value))}
                   className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-600"
                 />
              </div>

              <div className="space-y-4">
                 <p className="text-[0.9rem] font-black text-slate-800 flex items-center gap-2 px-1">
                   <Users size={18} className="text-orange-500" /> 간병인 서비스 옵션
                 </p>
                 <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                   {[
                     { l: '선택 안함', v: 'none' },
                     { l: '사용 일당', v: 'use' },
                     { l: '간병인 지원', v: 'support' }
                   ].map((opt) => (
                     <button
                       key={opt.v}
                       onClick={() => setCaregiverOption(opt.v as any)}
                       className={`flex-1 py-4 rounded-xl text-[0.8rem] font-black transition-all ${caregiverOption === opt.v ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-300'}`}
                     >
                       {opt.l}
                     </button>
                   ))}
                 </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100/50 transition-all hover:bg-white hover:shadow-md cursor-pointer"
                   onClick={() => setTertiaryHospital(!tertiaryHospital)}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${tertiaryHospital ? 'bg-orange-600 text-white' : 'bg-white text-slate-300'}`}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <p className="text-[0.9rem] font-black text-slate-800">상급종합병원 집중 보장</p>
                    <p className="text-[0.65rem] font-bold text-slate-400">대학병원 입원 시 보장 강화</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${tertiaryHospital ? 'bg-orange-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${tertiaryHospital ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
