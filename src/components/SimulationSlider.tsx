/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, TrendingUp, Sparkles } from 'lucide-react';

import { AnalysisResult } from '../types/insurance';

interface SimulationSliderProps {
  result: AnalysisResult;
}

const SimulationSlider: React.FC<SimulationSliderProps> = ({ result }) => {
  const { analysis, recommendations, scores } = result;
  const originalPremium = analysis.monthlyPremium;
  const dietPremium = recommendations.diet.estimatedPremium;
  const hybridPremium = recommendations.hybrid.estimatedPremium;

  const isDental = analysis.selectedCategory?.includes('치아');
  const isSilbi = analysis.selectedCategory?.includes('실손') || analysis.selectedCategory?.includes('실비');

  // Slider range: From diet (min) to hybrid (max) or 150% of original
  let maxBudget = Math.max(hybridPremium * 1.2, originalPremium * 1.5, dietPremium * 1.5);
  
  // Silbi usually doesn't exceed 100k even for seniors
  if (isSilbi) {
    maxBudget = Math.min(maxBudget, 100000);
    if (maxBudget < originalPremium) maxBudget = originalPremium * 1.2;
  }

  const [budget, setBudget] = useState(Math.max(originalPremium, dietPremium));

  // If budget starts below dietPremium due to initial state, fix it
  React.useEffect(() => {
    if (budget < dietPremium) setBudget(dietPremium);
  }, [dietPremium]);

  const diff = budget - originalPremium;
  
  // Simulation Logic:
  const coverageRatio = (budget - dietPremium) / (Math.max(1, maxBudget - dietPremium));
  
  let label = '일반암 예상 보장 한도';
  let unit = '만원';
  let value = 0;

  if (isSilbi) {
    label = '하루 통원/입원 지원금';
    unit = '원';
    // Base 200k support, scales slightly or reflects generation quality
    value = Math.round(200000 + (100000 * coverageRatio));
  } else if (isDental) {
    label = '보존/보철 치료 지원';
    unit = '만원';
    value = Math.round(150 + (350 * coverageRatio));
  } else {
    const currentCoverage = analysis.cancer.currentAmount;
    const targetCoverage = analysis.cancer.targetAmount;
    value = Math.round((currentCoverage + (targetCoverage * 1.5 - currentCoverage) * coverageRatio) / 10000);
  }
  
  // Score Simulation: Scale score based on budget relative to diet premium
  const simulatedScore = Math.min(100, Math.round(scores.totalScore + (100 - scores.totalScore) * coverageRatio));

  return (
    <div className="bg-[#FFF9F2] p-10 md:p-20 rounded-[4rem] text-center max-w-6xl mx-auto shadow-2xl relative overflow-hidden border border-orange-100/50">
      <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 transform rotate-12">
        <Sparkles className="w-48 h-48 text-orange-500" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col items-center gap-4 mb-14">
           <div className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-lg">
             <Sparkles size={14} className="fill-current" /> Premium Simulator
           </div>
           <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">예산에 따른 보장 변화 시뮬레이션</h3>
           <p className="text-gray-500 font-bold italic">"부담 가능한 보험료를 설정하여 가장 합리적인 보장 구성을 확인하세요."</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-20">
          {/* Slider */}
          <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-50 relative">
            <div className="flex justify-between items-end mb-12 px-2">
               <div className="flex flex-col items-start gap-1">
                 <span className="text-[0.65rem] font-black text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-lg">Diet Plan</span>
                 <span className="text-sm font-black text-gray-400 mt-1">{dietPremium.toLocaleString()}원</span>
               </div>
               
               <div className="flex flex-col items-center relative -top-4">
                 <div className="text-5xl font-black text-gray-900 tracking-tighter mb-2">{Math.round(budget).toLocaleString()}<span className="text-2xl ml-1">원</span></div>
                 <motion.div 
                   key={diff}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`text-sm font-black px-5 py-2 rounded-2xl shadow-sm ${diff > 0 ? 'bg-red-50 text-red-600' : diff < 0 ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}
                 >
                   {diff > 100 ? `현재보다 +${diff.toLocaleString()}원 추가` : diff < -100 ? `매달 ${Math.abs(diff).toLocaleString()}원 절약!` : `현재 보험료 유지`}
                 </motion.div>
               </div>

               <div className="flex flex-col items-end gap-1">
                 <span className="text-[0.65rem] font-black text-orange-500 uppercase tracking-widest px-3 py-1 bg-orange-50 rounded-lg">Luxury Plan</span>
                 <span className="text-sm font-black text-gray-400 mt-1">{Math.round(maxBudget).toLocaleString()}원</span>
               </div>
            </div>

            <div className="relative h-12 flex items-center">
              <input 
                type="range" 
                min={dietPremium} 
                max={maxBudget} 
                step={100} 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-4 bg-orange-50 rounded-full appearance-none cursor-pointer accent-orange-500 focus:outline-none z-10"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-16 bg-slate-200 pointer-events-none" 
                style={{ left: `${((originalPremium - dietPremium) / (Math.max(1, maxBudget - dietPremium))) * 100}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-white text-[9px] font-black whitespace-nowrap rounded-lg shadow-xl">
                  현재 납입 중
                </div>
              </div>
            </div>
          </div>

          {/* Results Impact Cards */}
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div 
              animate={{ scale: budget > originalPremium ? 1.05 : 1 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-orange-50 flex flex-col items-center group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                <TrendingUp className="w-24 h-24 text-orange-500" />
              </div>
              <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl">
                <TrendingUp className="w-9 h-9" />
              </div>
              <span className="text-[10px] font-black text-gray-300 mb-2 uppercase tracking-[0.3em]">{label}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-gray-900 tracking-tighter">
                  {value.toLocaleString()}
                </span>
                <span className="text-2xl font-black text-gray-400">{unit}</span>
              </div>
            </motion.div>

            <motion.div 
              animate={{ scale: simulatedScore > 90 ? 1.05 : 1 }}
              className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl flex flex-col items-center group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                <Target className="w-24 h-24 text-orange-400" />
              </div>
              <div className="w-16 h-16 bg-slate-800 text-orange-400 rounded-3xl flex items-center justify-center mb-8 shadow-inner shadow-black/50">
                <Target className="w-9 h-9" />
              </div>
              <span className="text-[10px] font-black text-slate-600 mb-2 uppercase tracking-[0.3em]">보장 최적화 리모델링 지수</span>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-orange-400 tracking-tighter">
                  {simulatedScore}
                </span>
                <span className="text-2xl font-black text-slate-700">점</span>
              </div>
            </motion.div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-orange-100">
            <p className="text-base text-gray-600 font-bold leading-relaxed">
              "슬라이더를 조작해 보세요. {diff > 0 ? '보험료를 더 투자' : '보험료를 세이브'}하여 설계하면<br/>
              전체적인 보장의 질과 사고 시 받게 될 혜택의 크기가 <span className="text-orange-600 font-black px-1">{Math.abs(Math.round(coverageRatio * 100))}%</span> 달라지는 것을 확인하실 수 있습니다."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationSlider;
