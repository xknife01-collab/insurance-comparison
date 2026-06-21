import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  hasCurrent: 'yes' | 'no';
  setHasCurrent: (v: 'yes' | 'no') => void;
  threeMonth: 'yes' | 'no';
  setThreeMonth: (v: 'yes' | 'no') => void;
  oneYear: 'yes' | 'no';
  setOneYear: (v: 'yes' | 'no') => void;
  fiveYear: 'yes' | 'no';
  setFiveYear: (v: 'yes' | 'no') => void;
  nonReimbursableUsage: string;
  setNonReimbursableUsage: (v: any) => void;
  subType?: string;
  pregnancyCover?: 'yes' | 'no';
  setPregnancyCover?: (v: 'yes' | 'no') => void;
  frequentNonSevere?: 'yes' | 'no';
  setFrequentNonSevere?: (v: 'yes' | 'no') => void;
}

export const SilsonFields: React.FC<Props> = ({
  hasCurrent, setHasCurrent,
  threeMonth, setThreeMonth,
  oneYear, setOneYear,
  fiveYear, setFiveYear,
  nonReimbursableUsage, setNonReimbursableUsage,
  subType = '4세대 실손',
  pregnancyCover = 'no',
  setPregnancyCover,
  frequentNonSevere = 'no',
  setFrequentNonSevere
}) => {
  const healthQuestions = [
    { title: '최근 3개월 내', desc: '질병 의심 소견, 치료, 입원, 수술, 투약 이력', state: threeMonth, setter: setThreeMonth },
    { title: '최근 1년 내', desc: '의사로부터 추가 검사(재검사) 이력', state: oneYear, setter: setOneYear },
    { title: '최근 5년 내', desc: '입원, 수술, 7일 이상 치료, 30일 이상 투약', state: fiveYear, setter: setFiveYear },
  ];

  return (
    <div id="input-silson-fields" className="bg-blue-50/30 rounded-[3rem] p-10 mb-12 border border-blue-100/50">
      <div className="flex items-center gap-3 mb-8">
         <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
         <h3 className="text-xl font-bold text-slate-800">{subType} 가입 전 고지사항</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-4">
            <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-2">필수 확인 사항</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-blue-50 shadow-sm gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">기존 실손보험 가입 이력</span>
                  <span className="text-[0.65rem] text-slate-400 font-bold">실비는 비례보상으로 중복 가입이 불가능합니다.</span>
                </div>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                  <button onClick={() => setHasCurrent('yes')} className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all ${hasCurrent === 'yes' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300'}`}>가입중</button>
                  <button onClick={() => setHasCurrent('no')} className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all ${hasCurrent === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300'}`}>없음</button>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border transition-all duration-500 ${hasCurrent === 'yes' ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${hasCurrent === 'yes' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
                    <AlertCircle size={16} />
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-[0.75rem] font-black mb-1 ${hasCurrent === 'yes' ? 'text-orange-700' : 'text-green-700'}`}>
                      {hasCurrent === 'yes' ? `${subType} "전환" 대상입니다` : `${subType} "신규" 가입 대상입니다`}
                    </p>
                    <p className={`text-[0.6rem] font-bold leading-relaxed ${hasCurrent === 'yes' ? 'text-orange-600/80' : 'text-green-600/80'}`}>
                      {hasCurrent === 'yes' 
                        ? `현재 보험을 ${subType}로 바꿀 때의 예상 가격입니다. 전환 시 기존의 보장 범위(자기부담금 비율 등)가 변경되며 이전 상품으로 복구가 불가능하니 신중히 결정하세요.` 
                        : `처음 실손보험을 준비하시는 분들을 위한 신규 가입용 보험료입니다. 나이가 들거나 아프기 전에 가입하시는 것이 가장 유리합니다.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
         </div>
        
        <div className="space-y-4">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-2">최근 병력 고지 (필수)</p>
            {healthQuestions.map((q, i) => (
             <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-blue-50 shadow-sm gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">{q.title}</span>
                  <span className="text-[0.65rem] text-slate-400 font-bold">{q.desc}</span>
                </div>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                  <button onClick={() => q.setter('yes')} className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all ${q.state === 'yes' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300'}`}>예</button>
                  <button onClick={() => q.setter('no')} className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all ${q.state === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300'}`}>아니오</button>
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
               { id: '100to150', label: '100~150만원', desc: '보험료 2배' },
               { id: '150to300', label: '150~300만원', desc: '보험료 3배' },
               { id: 'over300', label: '300만원 이상', desc: '보험료 4배' },
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

        {subType === '5세대 실손' && (
          <div className="md:col-span-2 mt-8 p-6 bg-slate-900/5 backdrop-blur rounded-[2rem] border border-blue-200/50">
            <p className="text-[0.65rem] font-black text-blue-600 pl-1 uppercase tracking-widest mb-4">5세대 전용 추가 확인 사항</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-blue-50 shadow-sm gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">임신·출산·발달장애 보장 희망</span>
                  <span className="text-[0.65rem] text-slate-400 font-bold">5세대부터 급여 본인부담금 보장이 새로 지원됩니다.</span>
                </div>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                  <button type="button" onClick={() => setPregnancyCover?.('yes')} className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all ${pregnancyCover === 'yes' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300'}`}>예</button>
                  <button type="button" onClick={() => setPregnancyCover?.('no')} className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all ${pregnancyCover === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300'}`}>아니오</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-blue-50 shadow-sm gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700">도수치료/비급여 주사 등 잦은 이용</span>
                  <span className="text-[0.65rem] text-slate-400 font-bold">도수, 주사, MRI 등 비중증 비급여 이용 여부</span>
                </div>
                <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                  <button type="button" onClick={() => setFrequentNonSevere?.('yes')} className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all ${frequentNonSevere === 'yes' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-300'}`}>예</button>
                  <button type="button" onClick={() => setFrequentNonSevere?.('no')} className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-black transition-all ${frequentNonSevere === 'no' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-300'}`}>아니오</button>
                </div>
              </div>
            </div>
            
            {frequentNonSevere === 'yes' && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                <div className="flex flex-col">
                  <p className="text-[0.7rem] font-black text-orange-700">⚠️ 경고: 5세대 전환 시 불리할 수 있습니다</p>
                  <p className="text-[0.6rem] font-bold text-orange-600/90 leading-relaxed">
                    도수치료, 주사제 등 비급여 의료 이용이 빈번하신 경우, 5세대는 자기부담률이 50%로 상향되고 연간 한도가 1,000만 원으로 축소되기 때문에 기존 4세대나 기존 실비를 유지하는 것이 재정적으로 더 유리할 수 있습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 p-5 bg-white/60 rounded-2xl border border-blue-100 flex items-start gap-4">
         <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
         <p className="text-xs text-slate-500 font-bold leading-relaxed">
            {subType === '5세대 실손' ? (
              <>
                5세대 실손의료비는 비급여 항목이 특약으로 분리되어 있으며, 비급여 청구 액수에 따라 매년 보험료가 <span className="text-red-500 font-black">할증 또는 할인(차등제)</span>될 수 있습니다. 특히 비중증 비급여(도수치료, 주사제 등)의 경우 <span className="text-blue-600 font-black">자기부담률이 50%로 설정</span>되고 연간 1,000만 원 한도로 보장이 축소되었습니다.
              </>
            ) : subType === '노후 실손' ? (
              <>
                노후 실손의료비는 고연령층(일반적으로 50세~75세)을 대상으로 설계된 실손보험입니다. 합리적인 수준의 보험료로 고령기에 집중적으로 발생하는 질병이나 상해로 인한 입원 및 통원 치료비 위주로 보장받을 수 있습니다.
              </>
            ) : (
              <>
                4세대 실손의료비는 비급여 도수치료, 주사료, MRI 등이 <span className="text-blue-600 font-black">특약으로 분리</span>되어 있으며, 비급여 청구 액수에 따라 매년 보험료가 <span className="text-red-500 font-black">할증 또는 할인(차등제)</span>될 수 있습니다. 고지의무 위반 시 보장이 제한될 수 있습니다.
              </>
            )}
         </p>
      </div>
    </div>
  );
};
