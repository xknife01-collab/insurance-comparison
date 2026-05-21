import React from 'react';
import { DentalAnalysisResult } from '../../../types/insurance/dental';
import { motion } from 'motion/react';
import { ShieldCheck, TrendingDown, Zap, ArrowRight, CheckCircle2, AlertTriangle, Scale, Pill } from 'lucide-react';

interface Props {
  result: DentalAnalysisResult;
}

export const DentalSummary: React.FC<Props> = ({ result }) => {
  const { scores, efficiency, recommendations } = result;
  const { analysis } = result as any;

  // Calculate estimated monthly savings (example logic based on silson style)
  const currentPremium = analysis?.monthlyPremium || 55000;
  const bestPlanPremium = recommendations.diet.estimatedPremium;
  const monthlySavings = bestPlanPremium - currentPremium;

  const formatAmount = (amt: number) => {
    if (amt >= 10000) return `${(amt / 10000).toLocaleString()}만 원`;
    return `${amt.toLocaleString()}원`;
  };

  const getStatusColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-blue-500';
    return 'text-orange-500';
  };

  return (
    <div className="space-y-12">
      {/* 1. Header: Efficiency & Summary */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
             <ShieldCheck size={200} className="text-emerald-500" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Pill size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">치과 전용 보장 분석 현황</h3>
                <p className="text-sm font-bold text-slate-400">당신의 치아 보험 준비 상태를 정밀 분석했습니다.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {[
                { label: '보철(임플란트)', val: analysis.dental?.implantLimit === 'unlimited' ? '무제한' : '연 3회', score: scores.implant },
                { label: '보존(크라운)', val: formatAmount(analysis.dental?.crownAmount || 0), score: scores.crown },
                { label: '보존치료', val: '레진/인레이', score: scores.conservative },
                { label: '감액기간', val: '90일/1년', score: 95 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-lg font-black text-slate-800">{item.val}</p>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      className={`h-full ${item.score >= 90 ? 'bg-emerald-500' : 'bg-orange-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-emerald-600 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(16,185,129,0.3)] flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Zap size={200} fill="currentColor" />
           </div>
           <div className="relative z-10">
              <p className="text-emerald-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Efficiency Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black tracking-tighter">{scores.totalScore.toFixed(0)}</span>
                <span className="text-2xl font-bold opacity-80">점</span>
              </div>
           </div>
           <div className="relative z-10 pt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                 <CheckCircle2 size={16} className="text-emerald-200" />
                 <span className="text-sm font-bold">보장이 완벽한 수준입니다!</span>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Personalized Dental Insights (Optional/Future) */}
      {/* Redundant comparison tables removed to use the main dashboard's professional tools */}
    </div>
  );
};
