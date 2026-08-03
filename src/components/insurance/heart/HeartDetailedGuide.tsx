import React from 'react';
import { Activity, ShieldCheck, Zap, Target } from 'lucide-react';

export const HeartDetailedGuide = () => {
  return (
    <div className="mt-20 pt-10 border-t border-red-100">
      <div className="text-center mb-16">
        <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
          당신의 <span className="text-red-600">심장</span>을 뛰게 할<br />
          가장 완벽한 방어선.
        </h3>
        <p className="text-gray-500 font-bold max-w-2xl mx-auto">
          급성심근경색 보장만으로는 부족합니다.<br />
          발병률이 가장 높은 협심증은 물론, 새로운 위험인 부정맥과 심부전까지 폭넓게 대비하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-[4rem] p-12 border border-red-100 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
             <Activity className="w-32 h-32 text-red-600" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-gray-900 mb-10 tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
              보장 범위의 '급'이 다릅니다
            </h3>
            <div className="space-y-6">
              <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100 group-hover:-translate-y-2 transition-transform">
                <p className="font-black text-red-700 mb-2 flex items-center gap-2">❤️ 심혈관질환 (전체 보장)</p>
                <p className="text-sm text-gray-600 font-bold leading-relaxed">
                  허혈성 심장질환(협심증)은 물론, 심장 박동에 이상이 생기는 <b>부정맥(I47~I49)</b>과 심장 펌프 기능이 저하되는 <b>심부전(I50)</b>까지 완벽하게 보장합니다.
                </p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 group-hover:-translate-y-2 transition-transform">
                <p className="font-black text-slate-800 mb-2 flex items-center gap-2">⚠️ 급성심근경색 (제한적 보장)</p>
                <p className="text-sm text-gray-500 font-bold leading-relaxed">
                  전체 심장질환의 10% 미만에 불과한 급성심근경색만 보장합니다. 발병률이 높은 협심증이 제외되어 보장 공백이 매우 큽니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:scale-125 transition-transform duration-1000">
              <ShieldCheck className="w-48 h-48" />
           </div>
           <div className="relative z-10">
              <h3 className="text-3xl font-black mb-10 tracking-tight italic">2026 핵심 신규 특약</h3>
              <div className="space-y-8">
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-12 transition-transform">
                       <Zap className="w-7 h-7" />
                    </div>
                    <div>
                       <p className="text-xl font-black mb-2">스텐트 삽입술 보장</p>
                       <p className="text-sm opacity-60 font-bold leading-relaxed">
                         협심증이나 심근경색으로 좁아진 혈관을 넓히는 스텐트 삽입술 비용을 크게 보장하여 치료비 걱정을 덜어줍니다.
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white/10 text-red-400 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                       <Target size={7} />
                    </div>
                    <div>
                       <p className="text-xl font-black mb-2">중증 심장질환 산정특례 보장</p>
                       <p className="text-sm opacity-60 font-bold leading-relaxed">
                         국가 건강보험 산정특례 대상 등록 시 매년 반복 지급되어, 만성적인 심장질환 관리와 통원 치료비를 든든히 지원합니다.
                       </p>
                    </div>
                 </div>
              </div>
              <div className="mt-12 p-8 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-md">
                 <p className="text-red-400 font-black text-sm mb-2 uppercase tracking-widest">💡 전문가의 핵심 팁</p>
                 <p className="text-white font-bold text-sm leading-relaxed tracking-tight">
                   "단순히 진단비 한 번 받는 것으로 끝나지 않습니다. 심장질환은 만성적인 관리와 재발 방지가 중요하므로 '매회 지급되는 수술비' 특약을 반드시 포함하세요."
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
         <div className="p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all">
            <h4 className="text-xl font-black mb-4">급증하는 부정맥·심부전</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
               고령화와 서구화된 식습관으로 인해 허혈성 심장질환 외에도 심부전과 부정맥 발병률이 급증하고 있습니다. 넓은 담보 범위 확보가 최우선입니다.
            </p>
         </div>
         <div className="p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all">
            <h4 className="text-xl font-black mb-4">가족력과 정기 검진</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
               심장질환은 유전적 요인이 크게 작용합니다. 가족력이 있다면 보장 한도를 높이고, 정기적인 심전도 검사로 조기 발견하는 것이 중요합니다.
            </p>
         </div>
         <div className="p-10 bg-red-600 rounded-[3.5rem] shadow-xl text-white">
            <h4 className="text-xl font-black mb-4">2대 질환의 균형 설계</h4>
            <p className="text-xs font-bold opacity-80 leading-relaxed">
               뇌혈관과 심혈관은 세트로 관리되어야 합니다. 한쪽으로 치우치지 않게 '2대 질환 진단/수술비' 비율을 1:1로 맞추는 것이 정석입니다.
            </p>
         </div>
      </div>
    </div>
  );
};
