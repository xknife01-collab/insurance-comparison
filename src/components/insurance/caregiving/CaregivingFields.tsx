import React from 'react';
import { HelpCircle, TrendingUp, ShieldCheck } from 'lucide-react';

interface Props {
  careType: 'support' | 'expense';
  setCareType: (v: 'support' | 'expense') => void;
  isStepUp: boolean;
  setIsStepUp: (v: boolean) => void;
  isNursingHospital: boolean;
  setNursingHospital: (v: boolean) => void;
  // New fields
  focusGeriatric: boolean;
  setFocusGeriatric: (v: boolean) => void;
  focusIntegrated: boolean;
  setFocusIntegrated: (v: boolean) => void;
}

export const CaregivingFields: React.FC<Props> = ({
  careType, setCareType,
  isStepUp, setIsStepUp,
  isNursingHospital, setNursingHospital,
  focusGeriatric, setFocusGeriatric,
  focusIntegrated, setFocusIntegrated
}) => {
  return (
    <div className="bg-purple-50/30 rounded-[3rem] p-10 mb-12 border border-purple-100/50">
      <div className="flex items-center gap-3 mb-8">
         <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
         <h3 className="text-xl font-bold text-slate-800">간병 서비스 방식 및 보장 설정</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-2">간병인 매칭 방식</p>
           <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-purple-100">
             {[
               { l: '보험사 직접 파견(지원형)', v: 'support' },
               { l: '현금 일당 지급(사용형)', v: 'expense' }
             ].map((opt, i) => (
               <button
                 key={i}
                 onClick={() => setCareType(opt.v as any)}
                 className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${careType === opt.v ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-300'}`}
               >
                 {opt.l}
               </button>
             ))}
           </div>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900">체증형 가입 (매년 5% 상승)</h4>
                <p className="text-[10px] text-gray-400 font-bold">인건비 상승 대비 필수 옵션</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsStepUp(false)}
                className={`py-4 rounded-2xl text-sm font-black transition-all border-2 ${
                  !isStepUp 
                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-purple-200'
                }`}
              >
                미가입
              </button>
              <button
                onClick={() => setIsStepUp(true)}
                className={`py-4 rounded-2xl text-sm font-black transition-all border-2 ${
                  isStepUp 
                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-purple-200'
                }`}
              >
                가입
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900">요양병원 보장 강화</h4>
                <p className="text-[10px] text-gray-400 font-bold">노인 장기 요양 목적 시 필수 선택</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNursingHospital(false)}
                className={`py-4 rounded-2xl text-sm font-black transition-all border-2 ${
                  !isNursingHospital 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'
                }`}
              >
                기본형
              </button>
              <button
                onClick={() => setNursingHospital(true)}
                className={`py-4 rounded-2xl text-sm font-black transition-all border-2 ${
                  isNursingHospital 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-white border-gray-100 text-gray-400 hover:border-emerald-200'
                }`}
              >
                강화 가입
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-2">기타 병동</p>
           <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-purple-50 shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-700">노인성 질환 집중보장</span>
                <span className="text-[0.65rem] text-purple-400 font-bold">치매/파킨슨 등 특화</span>
              </div>
              <button 
                onClick={() => setFocusGeriatric(!focusGeriatric)}
                className={`w-14 h-8 rounded-full transition-all relative ${focusGeriatric ? 'bg-purple-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${focusGeriatric ? 'left-7' : 'left-1'}`} />
              </button>
           </div>
        </div>

        <div className="space-y-4">
           <p className="text-[0.65rem] font-black text-slate-400 pl-1 uppercase tracking-widest mb-2">간병 환경 선택</p>
           <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-purple-50 shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-700">간호간병 통합서비스</span>
                <span className="text-[0.65rem] text-purple-400 font-bold">병원 자체 간병 인력 선호 시</span>
              </div>
              <button 
                onClick={() => setFocusIntegrated(!focusIntegrated)}
                className={`w-14 h-8 rounded-full transition-all relative ${focusIntegrated ? 'bg-purple-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${focusIntegrated ? 'left-7' : 'left-1'}`} />
              </button>
           </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-white/60 rounded-3xl border border-purple-100 flex items-center gap-4">
         <HelpCircle className="text-purple-500 shrink-0" size={24} />
         <p className="text-xs text-slate-500 font-bold leading-relaxed">
            최근에는 <span className="text-purple-600 font-black">요양병원</span> 한도가 축소되는 추세이므로 미리 보장을 확보하는 것이 유리하며, 인건비 상승에 대비한 <span className="text-purple-600 font-black">체증형</span> 가입율이 매우 높습니다.
         </p>
      </div>
    </div>
  );
};
