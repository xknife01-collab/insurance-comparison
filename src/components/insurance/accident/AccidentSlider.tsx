import React, { useState, useMemo } from 'react';
import { Shield, TrendingUp, Sparkles, Calculator, HelpCircle } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { AccidentExplanation } from './AccidentExplanation';

export const AccidentSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const currentPremium = result.analysis.monthlyPremium || 25000;
  const dietPremium = result.recommendations?.diet?.estimatedPremium || 12000;
  const luxuryPremium = Math.max(
    result.recommendations?.hybrid?.estimatedPremium || 45000,
    Math.round((currentPremium * 1.15) / 1000) * 1000
  );

  const [value, setValue] = useState(currentPremium);

  const metrics = useMemo(() => {
    let ratio = 0;
    const diff = luxuryPremium - dietPremium;
    if (diff > 0) {
      ratio = (value - dietPremium) / diff;
    }
    ratio = Math.max(0, Math.min(1, ratio));

    // 상해사망 한도 (1000만 원 ~ 2억 원)
    const deathLimit = Math.round(10000000 + ratio * 190000000);
    // 상해후유장해 한도 (1000만 원 ~ 1.5억 원)
    const disabilityLimit = Math.round(10000000 + ratio * 140000000);
    // 골절진단비 한도 (10만 원 ~ 100만 원)
    const fractureLimit = Math.round(100000 + ratio * 900000);
    // 상해수술비 한도 (10만 원 ~ 300만 원)
    const surgeryLimit = Math.round(100000 + ratio * 2900000);

    return {
      deathLimit,
      disabilityLimit,
      fractureLimit,
      surgeryLimit,
      index: Math.round(76 + (ratio * 23)),
    };
  }, [value, dietPremium, luxuryPremium]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatAmountWan = (amt: number) => {
    if (amt >= 100000000) {
      const eok = Math.floor(amt / 100000000);
      const remain = Math.floor((amt % 100000000) / 10000);
      return remain > 0 ? `${eok}억 ${remain}만` : `${eok}억`;
    }
    return `${(amt / 10000).toLocaleString()}만`;
  };

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-950 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-red-400" /> Accident Coverage Simulation
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">예산에 따른 상해 보장 조립도 시뮬레이션</h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-red-100 relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10 mb-16">
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2">설정 보험료 (월)</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()} <span className="text-2xl">원</span></p>
                </div>
              </div>
              <div className="relative pt-10 pb-6">
                <input 
                  type="range" 
                  min={dietPremium} 
                  max={luxuryPremium} 
                  step={1000} 
                  value={value} 
                  onChange={(e) => setValue(Number(e.target.value))} 
                  className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-red-600" 
                />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>다이어트 ({dietPremium.toLocaleString()}원)</span>
                  <span className="text-red-600">현재 ({currentPremium.toLocaleString()}원)</span>
                  <span>럭셔리 ({luxuryPremium.toLocaleString()}원)</span>
                </div>
              </div>
            </div>
            <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100 relative overflow-hidden group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm shrink-0"><Sparkles size={24} /></div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-gray-900 italic">"슬라이더를 통해 상해 한도를 튜닝해 보세요."</p>
                  <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                    월 보험료 예산에 따라 상해사망, 후유장해, 골절, 수술 한도가 <span className="text-red-600 font-black underline decoration-2 underline-offset-4">실시간으로 어떻게 달라지는지 0.1초 만에 확인</span>하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-red-400"><Shield size={20} /></div>
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Expected Coverage</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">상해사망 보장 한도</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {formatAmountWan(metrics.deathLimit)} <span className="text-lg">원</span>
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">상해후유장해 한도</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {formatAmountWan(metrics.disabilityLimit)} <span className="text-lg">원</span>
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">골절진단비 한도</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {formatAmountWan(metrics.fractureLimit)} <span className="text-lg">원</span>
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">상해수술비 한도</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {formatAmountWan(metrics.surgeryLimit)} <span className="text-lg">원</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 flex flex-col justify-between shadow-xl group hover:border-red-200 transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500"><TrendingUp size={20} /></div>
                <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Remodeling Score</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">상해 리모델링 최적화 지수</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter group-hover:scale-105 transition-transform inline-block">{metrics.index}</span>
                  <span className="text-xl font-bold text-red-600">점</span>
                </div>
                <p className="text-[11px] text-gray-400 font-bold mt-2">
                  * 골절, 수술, 사망 및 레저 상해 특약 믹스매치 합산 결과
                </p>
              </div>
            </div>
          </div>
        </div>
        <AccidentExplanation onAction={handleScrollToTop} />
      </div>
    </section>
  );
};
