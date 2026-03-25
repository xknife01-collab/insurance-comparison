/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, TrendingUp, Sparkles } from 'lucide-react';

interface SimulationSliderProps {
  currentPremium: number;
}

const SimulationSlider: React.FC<SimulationSliderProps> = ({ currentPremium }) => {
  const [budget, setBudget] = useState(currentPremium);

  const diff = budget - currentPremium;

  return (
    <div className="bg-[#FFF9F2] p-10 md:p-16 rounded-[4rem] text-center max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5">
        <Sparkles className="w-48 h-48 text-orange-500" />
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-black text-gray-900 mb-8 italic">시뮬레이션: 보험료를 얼마나 더 낼 수 있나요?</h3>
        <p className="text-gray-600 mb-12 text-lg">
          예산을 조절하며 예상되는 암 진단비 변동폭을 실시간으로 확인해 보세요.
        </p>

        <div className="max-w-2xl mx-auto space-y-12">
          {/* Slider */}
          <div className="space-y-6">
            <div className="flex justify-between items-end mb-4 px-2 font-bold text-sm text-gray-500">
               <span>다이어트 중점</span>
               <span className="text-orange-600 text-xl font-black">{Math.round(budget).toLocaleString()}원</span>
               <span>보장 강화 중점</span>
            </div>
            <input 
              type="range" 
              min={currentPremium * 0.5} 
              max={currentPremium * 2} 
              step={1000} 
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Results Impact */}
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-orange-100 flex flex-col items-center">
              <TrendingUp className="w-8 h-8 text-orange-500 mb-4" />
              <span className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">일반암 예상 보장</span>
              <span className="text-2xl font-black text-gray-900">
                {Math.round(3000 * (budget / currentPremium)).toLocaleString()}만 원
              </span>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 flex flex-col items-center">
              <Target className="w-8 h-8 text-blue-600 mb-4" />
              <span className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">보장 종합 지수</span>
              <span className="text-2xl font-black text-blue-600">
                {Math.min(100, Math.round(75 * (budget / currentPremium)))}점
              </span>
            </div>
          </div>

          {diff !== 0 && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={`text-sm font-bold py-4 px-8 rounded-2xl inline-block ${diff > 0 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}
             >
               현재보다 월 <span className="text-xl font-black">{Math.abs(diff).toLocaleString()}원</span> 
               {diff > 0 ? ' 더 투자하여 보장을 대폭 강화합니다.' : ' 절약하지만 필수 보장은 유지합니다.'}
             </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationSlider;
