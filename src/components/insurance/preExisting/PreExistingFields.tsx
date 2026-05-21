import React from 'react';
import { AlertCircle, ShieldCheck, Clock, Activity } from 'lucide-react';

interface Props {
  threeMonth: 'yes' | 'no';
  setThreeMonth: (v: 'yes' | 'no') => void;
  noAccidentYears: string; // '0' | '1' | '2' | '3' | '5'
  setNoAccidentYears: (v: string) => void;
  fiveYearMajor: 'yes' | 'no';
  setFiveYearMajor: (v: 'yes' | 'no') => void;
}

export const PreExistingFields: React.FC<Props> = ({
  threeMonth, setThreeMonth,
  noAccidentYears, setNoAccidentYears,
  fiveYearMajor, setFiveYearMajor
}) => {
  return (
    <div className="bg-indigo-50/30 rounded-[3rem] p-10 mb-12 border border-indigo-100/50">
      <div className="flex items-center gap-3 mb-8">
         <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
         <h3 className="text-xl font-bold text-slate-800 tracking-tight">유병자 전용 '3.X.5' 간편고지 질문</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: 3 Months */}
        <div className="bg-white p-6 rounded-[2rem] border border-indigo-50 shadow-sm space-y-4">
           <div className="flex items-center gap-2 text-indigo-400 mb-2">
             <Activity size={18} />
             <span className="text-[0.65rem] font-black uppercase tracking-widest">Step 01. (3개월)</span>
           </div>
           <p className="text-sm font-black text-slate-700 leading-tight">최근 3개월 내 입원/수술/추가검사 소견이 있습니까?</p>
           <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
             <button 
               onClick={() => setThreeMonth('yes')}
               className={`flex-1 py-3 rounded-lg text-xs font-black transition-all ${threeMonth === 'yes' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
             >예</button>
             <button 
               onClick={() => setThreeMonth('no')}
               className={`flex-1 py-3 rounded-lg text-xs font-black transition-all ${threeMonth === 'no' ? 'bg-indigo-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
             >아니오</button>
           </div>
        </div>

        {/* Step 2: X Years (Intermediary) */}
        <div className="bg-white p-6 rounded-[2rem] border border-indigo-50 shadow-sm space-y-4">
           <div className="flex items-center gap-2 text-indigo-400 mb-2">
             <Clock size={18} />
             <span className="text-[0.65rem] font-black uppercase tracking-widest">Step 02. (무사고 기간)</span>
           </div>
           <p className="text-sm font-black text-slate-700 leading-tight">몇 년 이내에 입원 또는 수술을 받은 적이 없습니까?</p>
           <div className="grid grid-cols-5 gap-1.5 bg-slate-50 p-1 rounded-xl">
             {['0', '1', '2', '3', '5'].map((yr) => (
               <button 
                 key={yr}
                 onClick={() => setNoAccidentYears(yr)}
                 className={`py-3 rounded-lg text-[0.65rem] font-black transition-all ${noAccidentYears === yr ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-300 hover:bg-white'}`}
               >
                 {yr === '0' ? '없음' : `${yr}년`}
               </button>
             ))}
           </div>
        </div>

        {/* Step 3: 5 Years Disease */}
        <div className="bg-white p-6 rounded-[2rem] border border-indigo-50 shadow-sm space-y-4">
           <div className="flex items-center gap-2 text-indigo-400 mb-2">
             <ShieldCheck size={18} />
             <span className="text-[0.65rem] font-black uppercase tracking-widest">Step 03. (5년 중대질환)</span>
           </div>
           <p className="text-sm font-black text-slate-700 leading-tight">5년 이내 암, 뇌졸중, 심근경색 진단/치료 이력이 있습니까?</p>
           <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
             <button 
               onClick={() => setFiveYearMajor('yes')}
               className={`flex-1 py-3 rounded-lg text-xs font-black transition-all ${fiveYearMajor === 'yes' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
             >예</button>
             <button 
               onClick={() => setFiveYearMajor('no')}
               className={`flex-1 py-3 rounded-lg text-xs font-black transition-all ${fiveYearMajor === 'no' ? 'bg-indigo-900 text-white shadow-lg' : 'text-slate-300 hover:text-slate-500'}`}
             >아니오</button>
           </div>
        </div>
      </div>

      <div className={`mt-8 p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl overflow-hidden relative transition-all duration-500 ${
        (threeMonth === 'yes' || fiveYearMajor === 'yes') 
          ? 'bg-slate-800' 
          : 'bg-indigo-900'
      }`}>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl font-black"></div>
         <div className="flex flex-col gap-1.5 z-10">
            <div className="flex items-center gap-2">
              <span className="text-[0.6rem] font-black text-indigo-300 uppercase tracking-[0.2em]">현재 건강 등급 분석 결과</span>
              {(threeMonth === 'yes' || fiveYearMajor === 'yes') && (
                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">심사 필요</span>
              )}
            </div>
            <div className="flex items-baseline gap-3">
                <h4 className="text-4xl font-black text-white tracking-tighter">
                  {threeMonth === 'yes' || fiveYearMajor === 'yes' ? '심사 관리형' : `간편고지 3.${noAccidentYears === '0' ? '0' : noAccidentYears}.5`}
                </h4>
                <div className="flex flex-col">
                  <span className="text-indigo-300 text-[11px] font-black">
                    {threeMonth === 'yes' || fiveYearMajor === 'yes' 
                      ? '정밀 심사 대상' 
                      : noAccidentYears === '5' ? '초경증 유병자' 
                      : noAccidentYears === '3' ? '실속형 유병자'
                      : noAccidentYears === '0' ? '간편 가입 대상' : '일반 유병자'}
                  </span>
                </div>
            </div>
         </div>
         <div className="text-right z-10">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-[1.8rem] border border-white/10">
              <p className="text-[0.65rem] text-indigo-200 font-black mb-1">예상 보험료 할인율</p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-3xl font-black text-orange-400">
                  {threeMonth === 'yes' || fiveYearMajor === 'yes' ? '0' : 
                   noAccidentYears === '5' ? '40' : 
                   noAccidentYears === '3' ? '25' : 
                   noAccidentYears === '2' ? '15' : 
                   noAccidentYears === '1' ? '8' : '0'}%
                </span>
                <span className="text-white font-black text-sm">SAVE</span>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};
