import React from 'react';
import { Activity, ShieldCheck, Quote, Star, Zap, Target } from 'lucide-react';

export const SurgeryDetailedGuide: React.FC = () => {
  return (
    <div className="mt-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-orange-900 rounded-[3rem] p-12 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-32 opacity-10 rotate-12">
          <Zap size={300} className="text-orange-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-orange-400 font-black text-sm uppercase tracking-[0.4em]">수술·입원 완벽 가이드</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            수술비의 <span className="text-orange-500">모든 것</span><br />
            한눈에 분석해 드립니다.
          </h2>
          <p className="text-orange-200 font-bold max-w-2xl mx-auto leading-relaxed">
            실손보험의 완벽한 파트너. 복잡한 수술비 약관 뒤에 숨겨진 진짜 혜택을 전문가가 직접 정리했습니다.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-xl group">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg">
              <Activity size={32} />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-black tracking-widest">CONTENT 01</p>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">수술비 핵심 보장</h3>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group-hover:-translate-y-2 transition-transform">
              <p className="text-lg font-black text-slate-800 mb-2">🏥 급여 (공통 치료)</p>
              <p className="text-sm text-gray-500 font-bold leading-relaxed">
                국민건강보험이 적용되는 항목으로, 실제 병원비에서 자기부담금을 제외한 금액을 보상합니다.
              </p>
            </div>
            <div className="bg-orange-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-orange-200 group-hover:-translate-y-2 transition-transform">
              <p className="text-lg font-black mb-2 flex items-center gap-2">⭐ 비급여 (특화 치료)</p>
              <p className="text-sm opacity-90 font-bold leading-relaxed">
                건강보험 미적용 항목인 도수치료, 비급여 주사료, MRI 등을 중점 보장합니다. 수술 가입의 핵심입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[4rem] p-12 border-4 border-gray-50 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">3대 필수 체크 용어</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 mt-1">1</div>
              <div>
                <p className="font-black text-gray-900">자기부담금</p>
                <p className="text-xs text-gray-400 font-bold mt-1">치료비 전액이 아닌, 본인이 부담해야 하는 20~30%의 비율입니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 mt-1">2</div>
              <div>
                <p className="font-black text-gray-900">갱신 및 재가입 주기</p>
                <p className="text-xs text-gray-400 font-bold mt-1">가입 시기에 따라 1~5년 주기로 조건이 변경되는 갱신형 구조입니다.</p>
              </div>
            </div>
            <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100">
               <p className="text-orange-600 font-black text-xs mb-2 uppercase tracking-widest flex items-center gap-2"><Target size={14}/> Experts Tip</p>
               <p className="text-gray-900 font-bold text-sm leading-relaxed tracking-tight">
                 "소액 통원비는 모바일 앱으로 그때그때 청구하는 것이 가장 똑똑한 보장 활용법입니다."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
