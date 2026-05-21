import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  hasCurrent: 'yes' | 'no';
  setHasCurrent: (v: 'yes' | 'no') => void;
  threeMonth: 'yes' | 'no';
  setThreeMonth: (v: 'yes' | 'no') => void;
  oneYear: 'yes' | 'no';
  setOneYear: (v: 'yes' | 'no') => void;
  fiveYearTreatment: 'yes' | 'no';
  setFiveYear: (v: 'yes' | 'no') => void;
  nonReimbursableUsage: string;
  setNonReimbursableUsage: (v: any) => void;
}

export const SilsonFields: React.FC<Props> = ({
  hasCurrent, setHasCurrent,
  threeMonth, setThreeMonth,
  oneYear, setOneYear,
  fiveYear, setFiveYear,
  nonReimbursableUsage, setNonReimbursableUsage
}) => {
  const healthQuestions = [
    { title: '최근 3개월 내', desc: '질병 의심 소견, 치료, 입원, 수술, 투약 이력', state: threeMonth, setter: setThreeMonth },
    { title: '최근 1년 내', desc: '의사로부터 추가 검사(재검사) 이력', state: oneYear, setter: setOneYear },
    { title: '최근 5년 내', desc: '입원, 수술, 7일 이상 치료, 30일 이상 투약', state: fiveYear, setter: setFiveYear },
  ];

  return (
    <div className="bg-blue-50/30 rounded-[3rem] p-10 mb-12 border border-blue-100/50">
      <div className="flex items-center gap-3 mb-8">
         <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
         <h3 className="text-xl font-bold text-slate-800">4세대 실손의료비 가입 전 고지사항</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-4">
            <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-2">필수 확인 사항</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">기존 실손보험 가입 이력</span>
                  <span className="text-[0.65rem] text-slate-400 font-bold">실비는 비례보상으로 중복 가입이 불가능합니다.</span>
                </div>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 ml-4">
                  <button onClick={() => setHasCurrent('yes')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${hasCurrent === 'yes' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300'}`}>가입중</button>
                  <button onClick={() => setHasCurrent('no')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${hasCurrent === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300'}`}>없음</button>
                </div>
              </div>

              {/* Dynamic Context Alert */}
              <div className={`p-4 rounded-2xl border transition-all duration-500 ${hasCurrent === 'yes' ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${hasCurrent === 'yes' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
                    <AlertCircle size={16} />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-[0.75rem] font-black mb-1 ${hasCurrent === 'yes' ? 'text-orange-700' : 'text-green-700'}`}>
                      {hasCurrent === 'yes' ? '4세대 실손 "전환" 대상입니다' : '4세대 실손 "신규" 가입 대상입니다'}
                    </p>
                    <p className={`text-[0.6rem] font-bold leading-relaxed ${hasCurrent === 'yes' ? 'text-orange-600/80' : 'text-green-600/80'}`}>
                      {hasCurrent === 'yes' 
                        ? '현재 보험을 4세대로 바꿀 때의 예상 가격입니다. 전환 시 기존의 보장 범위(자기부담금 등)가 변경되며 이전 상품으로 복구가 불가능하니 신중히 결정하세요.' 
                        : '처음 실손보험을 준비하시는 분들을 위한 신규 가입용 보험료입니다. 나이가 들거나 아프기 전에 가입하시는 것이 가장 유리합니다.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
         </div>
        
        <div className="space-y-4">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-2">최근 병력 고지 (필수)</p>
           {healthQuestions.map((q, i) => (
             <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">{q.title}</span>
                  <span className="text-[0.65rem] text-slate-400 font-bold">{q.desc}</span>
                </div>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 ml-4">
                  <button onClick={() => q.setter('yes')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${q.state === 'yes' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300'}`}>예</button>
                  <button onClick={() => q.setter('no')} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${q.state === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300'}`}>아니오</button>
                </div>
             </div>
           ))}
        </div>

        <div className="md:col-span-2 mt-8">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-4">비급여 의료 이용량 (직전 1년 기준)</p>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
             {[
               { id: 'none', label: '없음', desc: '5% 할인' },
               { id: 'under100', label: '100만원 미만', desc: '유지' },
               { id: '100to150', label: '100~150만원', desc: '100% 할증' },
               { id: '150to300', label: '150~300만원', desc: '200% 할증' },
               { id: 'over300', label: '300만원 이상', desc: '300% 할증' },
             ].map((opt) => (
               <button
                 key={opt.id}
                 onClick={() => setNonReimbursableUsage(opt.id)}
                 className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-1 ${
                   nonReimbursableUsage === opt.id 
                     ? 'border-blue-500 bg-blue-50/50 shadow-inner' 
                     : 'border-slate-100 bg-white hover:border-blue-200'
                 }`}
               >
                 <span className={`text-sm font-black ${nonReimbursableUsage === opt.id ? 'text-blue-600' : 'text-slate-600'}`}>{opt.label}</span>
                 <span className="text-[0.6rem] font-bold text-slate-400">{opt.desc}</span>
               </button>
             ))}
           </div>
        </div>
      </div>
      
      <div className="mt-6 p-5 bg-white/60 rounded-2xl border border-blue-100 flex items-start gap-4">
         <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
         <p className="text-xs text-slate-500 font-bold leading-relaxed">
            4세대 실손의료비는 비급여 도수치료, 주사료, MRI 등이 <span className="text-blue-600 font-black">특약으로 분리</span>되어 있으며, 비급여금 청구 액수에 따라 매년 보험료가 <span className="text-red-500 font-black">할증 또는 할인(차등제)</span>될 수 있습니다. 고지의무 위반 시 보장이 제한될 수 있습니다.
         </p>
      </div>
    </div>
  );
};
