/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { TrendingDown, ShieldCheck, HeartPulse, User, Brain, Heart, Stethoscope, Clock } from 'lucide-react';

interface ComparisonTableProps {
  currentPremium: number;
  recommendedPremium: number;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ currentPremium, recommendedPremium }) => {
  const diff = currentPremium - recommendedPremium;

  const comparisonRows = [
    { label: '일반암 진단비', current: '3,000만', recommended: '5,000만', icon: <ShieldCheck className="w-4 h-4 text-orange-500" /> },
    { label: '뇌혈관 질환', current: '1,000만', recommended: '3,000만', icon: <Brain className="w-4 h-4 text-blue-500" /> },
    { label: '심혈관 질환', current: '1,000만', recommended: '3,000만', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { label: '수술비 (질병/상해)', current: '30만', recommended: '100만', icon: <HeartPulse className="w-4 h-4 text-green-500" /> },
    { label: '질병후유장해(3%~)', current: '1,000만', recommended: '3,000만', icon: <Stethoscope className="w-4 h-4 text-purple-500" /> },
    { label: '납입면제 범위', current: '표준형', recommended: '고급형', icon: <Clock className="w-4 h-4 text-gray-500" /> },
  ];

  return (
    <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 transform">
        <ShieldCheck className="w-64 h-64 text-orange-500" />
      </div>

      <div className="relative z-10 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">1:1 상세 비교 분석</h3>
            <p className="text-gray-500 font-bold italic">"가격은 낮추고, 보장은 든든하게 채웠습니다."</p>
          </div>
          
          <div className="inline-block bg-orange-50 px-8 py-5 rounded-3xl border border-orange-100 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-default">
             <div className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">월 예상 절감액</div>
             <div className="flex items-baseline gap-1">
               <span className="text-4xl font-black text-orange-500">{diff.toLocaleString()}</span>
               <span className="text-xl font-bold text-gray-900">원</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-1 px-4 text-xs font-black text-gray-400 uppercase tracking-widest uppercase mb-1">
           <div className="col-span-4">보장 항목</div>
           <div className="col-span-4 text-center">기존 유지 시 (Stay)</div>
           <div className="col-span-4 text-right">교체 제안 (Switch)</div>
        </div>

        <div className="space-y-2">
          {comparisonRows.map((row, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`grid grid-cols-12 items-center p-6 rounded-2xl transition-all border ${
                i % 2 === 0 ? 'bg-gray-50/50 border-gray-100/50' : 'bg-white border-transparent'
              } hover:bg-orange-50/30 hover:shadow-lg hover:border-orange-100 group`}
            >
              <div className="col-span-4 flex items-center gap-3">
                 <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 transition-transform group-hover:scale-110">
                   {row.icon}
                 </div>
                 <span className="text-sm font-bold text-gray-900">{row.label}</span>
              </div>
              <div className="col-span-4 text-center font-bold text-gray-400 text-lg">
                {row.current}
              </div>
              <div className="col-span-4 text-right">
                <span className="bg-orange-500 text-white px-5 py-2 rounded-full font-black text-lg shadow-lg shadow-orange-500/30 inline-block transform transition-all group-hover:translate-x-1 group-hover:scale-105">
                  {row.recommended}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8 border-t border-gray-50 mt-10">
          <p className="text-sm font-bold text-gray-400 italic">
            "전 상품군 중 가장 합리적인 담보만을 선별하여 구성한 1:1 맞춤 비교 리포트입니다."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
