import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
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
      {/* 1. Header: Dental Coverage Summary */}
      <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
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
              <p className="text-sm font-bold text-slate-400">선택하신 맞춤 플랜의 치아 보장 항목을 정밀 분석했습니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            {[
              { label: '보철(임플란트)', targetId: 'input-dental-fields', val: analysis.dental?.implantLimit === 'unlimited' ? '연간 제한 없음' : '연간 3개 (치아당)', status: '선택' },
              { label: '보존(크라운)', targetId: 'input-dental-fields', val: formatAmount(analysis.dental?.crownAmount || 0), status: '선택' },
              { label: '보존치료', targetId: 'input-dental-fields', val: '레진/인레이', status: '보장' },
              { label: '감액기간', targetId: 'input-dental-fields', val: '90일/1년', status: '확인' },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={() => scrollToInputAndHighlight((item as any).targetId)}
                className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center gap-2 group hover:border-emerald-300 hover:shadow-sm cursor-pointer transition-all duration-300"
              >
                <div className="flex justify-between items-center w-full">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <span className="text-[10px] font-black px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">{item.status}</span>
                </div>
                <p className="text-lg font-black text-slate-800">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Personalized Dental Insights (Optional/Future) */}
      {/* Redundant comparison tables removed to use the main dashboard's professional tools */}
    </div>
  );
};
