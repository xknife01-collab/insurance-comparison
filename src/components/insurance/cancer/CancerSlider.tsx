import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, Sparkles, Calculator, ChevronRight } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { CancerDetailedGuide } from './CancerDetailedGuide';

export const CancerSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const currentPremium = result.analysis.monthlyPremium || 120000;
  const dietPremium = result.recommendations?.diet?.estimatedPremium || Math.floor(currentPremium * 0.4);
  const luxuryPremium = result.recommendations?.hybrid?.estimatedPremium || Math.floor(currentPremium * 1.5);
  const [value, setValue] = useState(currentPremium);

  const metrics = useMemo(() => {
    const ratio = (value - dietPremium) / (luxuryPremium - dietPremium);
    return {
      benefit: Math.round(3000 + (ratio * 7000)),
      index: Math.round(72 + (ratio * 23)),
      percentage: Math.round(15 + ratio * 40)
    };
  }, [value]);

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-rose-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-rose-500" /> Cancer Simulation
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">예산에 따른 보장 변화 시뮬레이션</h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-rose-100 relative overflow-hidden">
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
                <input type="range" min={dietPremium} max={luxuryPremium} step={500} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-rose-500" />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>Diet ({dietPremium.toLocaleString()}원)</span>
                  <span className="text-rose-500">현재 ({currentPremium.toLocaleString()}원)</span>
                  <span>Luxury ({luxuryPremium.toLocaleString()}원)</span>
                </div>
              </div>
            </div>
            <div className="bg-rose-50/50 p-8 rounded-[2.5rem] border border-rose-100 relative overflow-hidden group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm shrink-0"><Sparkles size={24} /></div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-gray-900 italic">"슬라이더를 조작해 보세요."</p>
                  <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                    보험료를 세이브하여 설계하면 전체적인 보장의 질과 혜택이 <span className="text-rose-600 font-black underline decoration-2 underline-offset-4">{metrics.percentage}% 달라지는 것</span>을 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-rose-400"><Shield size={20} /></div>
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Expected Benefit</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">일반암 예상 보장 한도</p>
                <p className="text-4xl font-black text-white tracking-tighter">{metrics.benefit.toLocaleString()} <span className="text-xl">만원</span></p>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${(metrics.benefit / 10000) * 100}%` }} className="h-full bg-rose-500" /></div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 space-y-6 shadow-xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500"><TrendingUp size={20} /></div>
                <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Remodeling Index</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">보장 최적화 리모델링 지수</p>
                <p className="text-4xl font-black text-rose-500 tracking-tighter">{metrics.index} <span className="text-xl text-gray-900">점</span></p>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${metrics.index}%` }} className="h-full bg-rose-500" /></div>
            </div>
          </div>
        </div>
        <CancerDetailedGuide />
      </div>
      <p className="text-center text-rose-500 font-bold text-sm mt-12 bg-rose-50/50 py-4 rounded-full max-w-2xl mx-auto border border-rose-100">
        "전후 비교를 확인하는 순간, 지금까지 낸 보험료가 아까워 잠이 안 오실 수도 있습니다."
      </p>
    </section>
  );
};
