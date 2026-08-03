import React from 'react';
import { Sparkles, Clock, ShieldCheck, TrendingUp, Gem } from 'lucide-react';

export const DentalDetailedGuide: React.FC = () => {
  return (
    <div className="mt-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-emerald-900 rounded-[3rem] p-12 md:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-32 opacity-10 rotate-12">
          <Gem size={300} className="text-emerald-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-emerald-400 font-black text-sm uppercase tracking-[0.4em]">안심 치과 치료 가이드</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            임플란트부터 크라운까지,<br />빈틈없이 든든하게.
          </h2>
          <p className="text-emerald-200 font-bold max-w-2xl mx-auto leading-relaxed">
            비싼 치과 치료비, 이제 걱정 마세요. 보존치료와 보철치료의 차이점부터 가입 전 반드시 확인해야 할 면책/감액기간을 정리했습니다.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-emerald-50 border border-emerald-100 rounded-[4rem] p-12 shadow-sm group relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">핵심 보장 항목 분석</h4>
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
                <p className="font-black text-emerald-600 mb-2 flex items-center gap-2">🛠️ 보존치료 (내 치아 살리기)</p>
                <p className="text-sm text-gray-600 font-bold leading-relaxed">
                  레진, 인레이, 온레이, 크라운 등 치아를 뽑지 않고 치료하는 방식입니다. 대기기간 없이 개수 무제한 보장이 많습니다.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
                <p className="font-black text-emerald-600 mb-2 flex items-center gap-2">🦷 보철치료 (인공 치아 넣기)</p>
                <p className="text-sm text-gray-600 font-bold leading-relaxed">
                  임플란트, 브릿지, 틀니 등 치아 손실 시 대체물을 만드는 방식입니다. 비용이 높아 감액기간(50% 지급) 확인이 필수입니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl space-y-10">
          <h4 className="text-2xl font-black tracking-tight italic">가입 시 필수 체크리스트</h4>
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Clock size={28} />
              </div>
              <div>
                <p className="text-xl font-black mb-2">면책/감액기간 확인</p>
                <p className="text-sm opacity-60 font-bold leading-relaxed">
                  치아보험은 가입 후 90일(면책) 및 1~2년(감액) 기간이 있습니다. 큰 수술이 예상된다면 미리 준비해야 합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 backdrop-blur-md">
                <TrendingUp size={28} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-black mb-2">건강할 때 진단형 가입</p>
                <p className="text-sm opacity-60 font-bold leading-relaxed">
                  치아가 건강할 때 '진단형'으로 가입하면 면책기간 없이 즉시 100% 보장받을 수 있는 유일한 방법입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-[4rem] p-12 border border-gray-100">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className="space-y-4">
            <h5 className="font-black flex items-center gap-2 text-gray-900">
              <ShieldCheck className="text-emerald-500" /> 라이나 / 삼성
            </h5>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
              가장 넓은 치과 네트워크와 빠른 보상 처리가 강점입니다. 임플란트 보장 한도가 업계 최고 수준입니다.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="font-black flex items-center gap-2 text-gray-900">
              <TrendingUp className="text-emerald-500" /> DB / 메리츠
            </h5>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
              크라운 치료 무제한 플랜 등 가성비 높은 보존치료 중심의 경쟁력 있는 상품을 보유하고 있습니다.
            </p>
          </div>
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-600/20">
             <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">💡 Experts Tip</p>
             <p className="text-sm font-bold leading-relaxed">
               "기존 치과 치료 기록이 있더라도 일정 기간(1~2년)이 지났다면 가입에 문제가 없습니다."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
