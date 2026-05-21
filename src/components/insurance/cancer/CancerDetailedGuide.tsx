import React from 'react';
import { Lightbulb, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const CancerDetailedGuide: React.FC = () => {
  return (
    <div className="mt-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* 🏆 Header Section */}
      <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/10 to-transparent opacity-50"></div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-orange-500 font-black text-sm uppercase tracking-[0.4em]">암보험의 뉴 패러다임</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            2026 최신 암보험:<br />진단비를 넘어 주요치료비까지
          </h2>
          <p className="text-rose-200 font-bold max-w-2xl mx-auto leading-relaxed">
            이제는 '치료 효율'의 시대입니다. 표적항암제부터 중입자치료까지, 2026년 최신 암 치료 비용을 데이터로 분석했습니다.
          </p>
        </div>
      </div>

      {/* 🎯 Trend Analysis Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
            <TrendingUp size={24} />
          </div>
          <h4 className="text-xl font-black text-gray-900 mb-4">🎯 비급여 암 주요치료비</h4>
          <p className="text-gray-600 font-bold leading-relaxed">
            건강보험 비적용 항목인 표적항암, 로봇수술 비용을 집중 보장합니다. 연간 최대 1억 원까지 10년간 보장받는 '지속형'이 대세입니다.
          </p>
        </div>
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl hover:shadow-2xl transition-all">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mb-6">
            <Zap size={24} />
          </div>
          <h4 className="text-xl font-black text-gray-900 mb-4">🔍 전이암/재발암 보장</h4>
          <p className="text-gray-600 font-bold leading-relaxed">
            최초 암뿐만 아니라 전이되거나 다시 발생하는 암까지 계속해서 진단비를 지급받는 방식입니다. 완치까지의 경제적 안정망을 구축하세요.
          </p>
        </div>
      </div>

      {/* 📝 Checklist Section */}
      <div className="bg-orange-50/50 rounded-[3rem] p-12 border border-orange-100 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">가입 전 필수 체크리스트</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="text-orange-600 font-black text-sm uppercase tracking-widest">면책기간 90일 & 감액기간 1~2년</div>
            <p className="text-gray-700 font-bold leading-relaxed">
              가입 직후 90일은 보장이 안 되며, 1~2년 내엔 50%만 지급됩니다. 건강할 때 미리 준비해야 하는 가장 큰 이유입니다.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-orange-600 font-black text-sm uppercase tracking-widest">유사암(소액암) 한도 확인</div>
            <p className="text-gray-700 font-bold leading-relaxed">
              갑상선암, 기타피부암 등 발병률은 높고 완치도 빠른 암들의 보장 한도가 일반암의 20%인지, 그 이상인지 반드시 비교하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 💡 Expert Tips Section */}
      <div className="bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Lightbulb size={200} />
        </div>
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">💡 전문가의 핵심 팁</h3>
          </div>
          <p className="text-3xl font-black leading-tight tracking-tighter">
            "암 진단비는 치료비뿐만 아니라 치료 기간 동안의 '생활비'입니다. 연봉의 1~2배 수준으로 설정하는 것이 가장 안정적입니다."
          </p>
          <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-white/20">
            <div className="space-y-2">
              <div className="text-blue-200 font-black text-xs uppercase tracking-widest">누적 합산 한도 체크</div>
              <p className="text-sm font-bold text-white/80 leading-relaxed">여러 보험사에 나눠 가입하더라도 업계 전체 누적 한도가 존재합니다.</p>
            </div>
            <div className="space-y-2">
              <div className="text-blue-200 font-black text-xs uppercase tracking-widest">고액암 특정 보장</div>
              <p className="text-sm font-bold text-white/80 leading-relaxed">췌장암, 뇌암 등 치명률과 치료비가 높은 암에 대해 별도 특약을 추가하세요.</p>
            </div>
            <div className="space-y-2">
              <div className="text-blue-200 font-black text-xs uppercase tracking-widest">비갱신형 권장 전략</div>
              <p className="text-sm font-bold text-white/80 leading-relaxed">납입은 경제 활동기에 끝내고 노후엔 혜택만 받는 비갱신형이 합리적입니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancerDetailedGuide;
