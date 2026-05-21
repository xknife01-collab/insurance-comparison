import React from 'react';
import { Activity, ShieldCheck, Zap, Target, TrendingUp, AlertCircle } from 'lucide-react';

export const CerebrovascularDetailedGuide: React.FC = () => {
  return (
    <div className="mt-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* 🧠 Header Section */}
      <div className="bg-indigo-900 rounded-[3rem] p-12 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-32 opacity-10 rotate-12">
          <Activity size={300} className="text-indigo-400" />
        </div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-indigo-400 font-black text-sm uppercase tracking-[0.4em]">뇌혈관 보험 완벽 분석</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            뇌혈관의 <span className="text-indigo-400">골든타임</span>,<br />데이터로 지키는 법
          </h2>
          <p className="text-indigo-200 font-bold max-w-2xl mx-auto leading-relaxed">
            뇌출혈, 뇌졸중만으로는 부족합니다. 2026년 최신 뇌혈관 트렌드 분석인 전체 뇌혈관 질환(I60~I69) 보장과 신의료기술 특약을 전문가가 정리했습니다.
          </p>
        </div>
      </div>

      {/* 📊 Coverage Range Comparison */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white rounded-[4rem] p-12 border border-indigo-100 shadow-xl group">
          <h4 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <TrendingUp size={24} />
            </div>
            보장 범위의 차이
          </h4>
          <div className="space-y-6">
            <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100">
              <p className="font-black text-indigo-700 mb-2">💎 뇌혈관질환 (I60~I69)</p>
              <p className="text-sm text-gray-600 font-bold leading-relaxed">
                뇌출혈, 뇌졸중은 물론 뇌동맥류, 협착 등 뇌혈관의 모든 이상을 보장합니다. 전체 뇌혈관 질환을 100% 커버하는 필수 담보입니다.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 opacity-60">
              <p className="font-black text-gray-500 mb-2">⚠️ 뇌졸중/뇌출혈</p>
              <p className="text-sm text-gray-400 font-bold leading-relaxed">
                가장 빈번한 뇌경색이나 뇌동맥류가 빠진 경우가 많습니다. 전체 질환의 일부만 보장하므로 주의가 필요합니다.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl space-y-10">
          <h4 className="text-2xl font-black tracking-tight italic flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400">
              <Zap size={24} />
            </div>
            2026 핵심 신기술 보장
          </h4>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <Target size={28} />
              </div>
              <div>
                <p className="text-xl font-black mb-2">혈전용해/코일색전술</p>
                <p className="text-sm opacity-60 font-bold leading-relaxed">
                  막힌 혈관을 뚫는 약물 치료와 머리를 열지 않는 비침습적 수술비를 집중 보장합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20">
                <ShieldCheck size={28} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-xl font-black mb-2">중증 산정특례 반복 지급</p>
                <p className="text-sm opacity-60 font-bold leading-relaxed">
                  국가 산정특례 대상 시 매년 보험금을 반복 지급하여 장기적인 치료비 부담을 덜어줍니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 💡 Experts Tip Section */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[4rem] p-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-indigo-600 shrink-0">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-4">
            <p className="text-indigo-600 font-black text-sm uppercase tracking-widest">💡 전문가의 핵심 팁</p>
            <p className="text-2xl font-black text-gray-900 tracking-tight leading-snug">
              "뇌혈관 질환은 재발률이 매우 높습니다. 최초 1회로 끝나는 진단비보다, <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">매회 지급되는 수술비</span>를 함께 구성하는 것이 가장 현명한 노후 대비입니다."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
