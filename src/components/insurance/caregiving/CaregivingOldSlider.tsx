import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Sparkles, Calculator } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { CaregivingOldGuide } from './CaregivingOldGuide';

export const CaregivingOldSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const currentPremium = result.analysis.monthlyPremium || 65000;
  const dietPremium = result.recommendations?.diet?.estimatedPremium || Math.floor(currentPremium * 0.4);
  const luxuryPremium = result.recommendations?.hybrid?.estimatedPremium || Math.floor(currentPremium * 1.5);
  const [value, setValue] = useState(currentPremium);

  const metrics = useMemo(() => {
    let ratio = 0;
    const diff = luxuryPremium - dietPremium;
    if (diff > 0) {
      ratio = (value - dietPremium) / diff;
    }
    ratio = Math.max(0, Math.min(1, ratio));

    return {
      benefit: Math.round(1000 + (ratio * 4000)), // 치매 진단비 (1,000~5,000만원)
      livingCost: Math.round(30 + (ratio * 70)), // 매월 생활비 (30~100만원)
      index: Math.round(72 + (ratio * 23)),
      percentage: Math.round(15 + ratio * 40)
    };
  }, [value, dietPremium, luxuryPremium]);

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-amber-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-amber-500" /> Dementia Care Simulation
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">예산에 따른 치매 보장 변화</h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-amber-100 relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2">설정 보험료 (월)</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()} <span className="text-2xl">원</span></p>
                </div>
              </div>
              <div className="relative pt-10 pb-6">
                <input type="range" min={dietPremium} max={luxuryPremium} step={500} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-amber-500" />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>Diet ({dietPremium.toLocaleString()}원)</span>
                  <span className="text-amber-600">현재 ({currentPremium.toLocaleString()}원)</span>
                  <span>Luxury ({luxuryPremium.toLocaleString()}원)</span>
                </div>
              </div>
            </div>
            <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100 relative overflow-hidden group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0"><Sparkles size={24} /></div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-gray-900 italic">"슬라이더를 조작해 보세요."</p>
                  <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                    치매 보험료를 효율적으로 재구성하면 진단비와 매월 지급되는 생활비 혜택이 <span className="text-amber-600 font-black underline decoration-2 underline-offset-4">{metrics.percentage}% 달라지는 것</span>을 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400"><Shield size={20} /></div>
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Expected Benefit</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">중증 치매 생활자금(월)</p>
                <p className="text-4xl font-black text-white tracking-tighter">{metrics.livingCost.toLocaleString()} <span className="text-xl">만원</span></p>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(metrics.livingCost / 100) * 100}%` }} className="h-full bg-amber-500" />
              </div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 space-y-6 shadow-xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500"><TrendingUp size={20} /></div>
                <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Remodeling Index</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">보장 최적화 리모델링 지수</p>
                <p className="text-4xl font-black text-amber-500 tracking-tighter">{metrics.index} <span className="text-xl text-gray-900">점</span></p>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${metrics.index}%` }} className="h-full bg-amber-500" />
              </div>
            </div>
          </div>
        </div>
        <CaregivingOldGuide />
      </div>
    </section>
  );
};
