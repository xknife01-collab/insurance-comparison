import React from 'react';
import { Stethoscope, CheckCircle2, ShieldCheck, HelpCircle, Activity, HeartPulse } from 'lucide-react';

export const SilbiDetailedGuide: React.FC = () => {
  return (
    <div className="mt-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* 🏥 Header Section */}
      <div className="bg-blue-900 rounded-[3rem] p-12 md:p-16 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent opacity-50"></div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-blue-400 font-black text-sm uppercase tracking-[0.4em]">의료실비의 모든 것</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            제 2의 건강보험,<br />실손의료비 완벽 가이드
          </h2>
          <p className="text-blue-200 font-bold max-w-2xl mx-auto leading-relaxed">
            대한민국 국민 4,000만 명이 가입한 국민 보험 실손. 복잡한 약관 뒤에 숨겨진 진짜 혜택을 전문가가 직접 정리했습니다.
          </p>
        </div>
      </div>

      {/* 📦 Content 01: Core Coverage */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
            <Activity size={24} />
          </div>
          <h4 className="text-xl font-black text-gray-900 mb-4">🏥 급여 (공통 치료)</h4>
          <p className="text-gray-600 font-bold leading-relaxed">
            국민건강보험이 적용되는 항목으로, 실제 병원비에서 자기부담금을 제외한 금액을 보상합니다. (입원, 외래, 처방조제 포함)
          </p>
        </div>
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-6">
            <HeartPulse size={24} />
          </div>
          <h4 className="text-xl font-black text-gray-900 mb-4">⭐ 비급여 (특화 치료)</h4>
          <p className="text-gray-600 font-bold leading-relaxed">
            건강보험이 적용되지 않아 부담이 큰 도수치료, 비급여 주사료, MRI/MRA 등을 중점 보장합니다. 실손 가입의 핵심 이유입니다.
          </p>
        </div>
      </div>

      {/* 📝 Content 02: Essential Terms */}
      <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-200 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">3대 필수 체크 용어</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-3">
            <div className="text-slate-400 font-black text-3xl">01</div>
            <h5 className="font-black text-gray-900">자기부담금</h5>
            <p className="text-sm text-gray-500 font-bold leading-relaxed">치료비 전액이 아닌, 본인이 부담해야 하는 20~30%의 최소 비율입니다.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-3">
            <div className="text-slate-400 font-black text-3xl">02</div>
            <h5 className="font-black text-gray-900">갱신 및 재가입</h5>
            <p className="text-sm text-gray-500 font-bold leading-relaxed">실손은 100% 갱신형이며, 가입 시기에 따라 1~5년 주기로 조건이 변경됩니다.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 space-y-3">
            <div className="text-slate-400 font-black text-3xl">03</div>
            <h5 className="font-black text-gray-900">고지의무</h5>
            <p className="text-sm text-gray-500 font-bold leading-relaxed">5년 내 질환이나 1년 내 추가 검사 소견 등을 정확히 밝혀야 보장이 취소되지 않습니다.</p>
          </div>
        </div>
      </div>

      {/* 💡 Expert Tips Section */}
      <div className="bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Stethoscope size={200} />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">💡 전문가의 핵심 팁</h3>
          </div>
          <p className="text-3xl font-black leading-tight tracking-tighter">
            "실물 카드가 아닌 '모바일 앱' 청구가 가능한지 확인하세요. 소액 통원비는 그때그때 청구하는 것이 실손을 가장 똑똑하게 활용하는 방법입니다."
          </p>
          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-white/20">
            <div className="space-y-2">
              <div className="text-indigo-200 font-black text-xs uppercase tracking-widest">대형 보험사 (S사, H사)</div>
              <p className="text-sm font-bold text-white/80 leading-relaxed">전국적인 서비스망과 빠른 보험금 지급 심사가 최대 강점입니다.</p>
            </div>
            <div className="space-y-2">
              <div className="text-indigo-200 font-black text-xs uppercase tracking-widest">다이렉트 전용 (D사, M사)</div>
              <p className="text-sm font-bold text-white/80 leading-relaxed">설계사 수수료가 빠져 있어 동일 보장 대비 월 보험료가 15~20% 저렴합니다.</p>
            </div>
            <div className="space-y-2">
              <div className="text-indigo-200 font-black text-xs uppercase tracking-widest">4세대 착한 실손</div>
              <p className="text-sm font-bold text-white/80 leading-relaxed">병원을 자주 안 가면 보험료를 깎아주고, 잦으면 할증되는 최신 실손입니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SilbiDetailedGuide;
