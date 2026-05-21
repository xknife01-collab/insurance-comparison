import React from 'react';

interface Props {
  selectedCancer: number;
  setSelectedCancer: (v: number) => void;
  selectedBrain: number;
  setSelectedBrain: (v: number) => void;
  selectedHeart: number;
  setSelectedHeart: (v: number) => void;
  selectedSurgery: number;
  setSelectedSurgery: (v: number) => void;
  selectedDisability: number;
  setSelectedDisability: (v: number) => void;
  selectedExemption: 'standard' | 'premium';
  setSelectedExemption: (v: 'standard' | 'premium') => void;
}

export const HealthFields: React.FC<Props> = ({
  selectedCancer, setSelectedCancer,
  selectedBrain, setSelectedBrain,
  selectedHeart, setSelectedHeart,
  selectedSurgery, setSelectedSurgery,
  selectedDisability, setSelectedDisability,
  selectedExemption, setSelectedExemption
}) => {
  const fields = [
    { label: '일반암 진단비', state: selectedCancer, setter: setSelectedCancer, options: [{l:'3,000만',v:30000000}, {l:'5,000만',v:50000000}, {l:'10,000만',v:100000000}] },
    { label: '뇌혈관 질환', state: selectedBrain, setter: setSelectedBrain, options: [{l:'1,000만',v:10000000}, {l:'3,000만',v:30000000}] },
    { label: '심혈관 질환', state: selectedHeart, setter: setSelectedHeart, options: [{l:'1,000만',v:10000000}, {l:'3,000만',v:30000000}] },
    { label: '수술비(질병/상해)', state: selectedSurgery, setter: setSelectedSurgery, options: [{l:'30만',v:300000}, {l:'100만',v:1000000}] },
    { label: '질병후유장해(3%~)', state: selectedDisability, setter: setSelectedDisability, options: [{l:'1,000만',v:10000000}, {l:'3,000만',v:30000000}] },
    { label: '납입면제 범위', state: selectedExemption, setter: setSelectedExemption, options: [{l:'표준형',v:'standard'}, {l:'고급형',v:'premium'}] },
  ];

  return (
    <div className="bg-orange-50/30 rounded-[3rem] p-10 mb-12 border border-orange-100/50">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-800">상세 보장 한도 설정</h3>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[0.6rem] font-black text-orange-400 border border-orange-200 px-3 py-1 rounded-full uppercase tracking-widest">Disease Protection</span>
            <span className="text-[0.7rem] font-black text-slate-500 bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">
               💡 이 한도는 진단 시 지급되는 목돈 보장액입니다
            </span>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fields.map((item, i) => (
          <div key={i} className="space-y-3">
             <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest">{item.label}</p>
             <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100">
               {item.options.map((opt, oi) => (
                 <button
                   key={oi}
                   onClick={() => item.setter(opt.v as any)}
                   className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${item.state === opt.v ? 'bg-slate-900 text-white shadow-lg scale-102' : 'text-slate-300 hover:text-slate-500'}`}
                 >
                   {opt.l}
                 </button>
               ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
