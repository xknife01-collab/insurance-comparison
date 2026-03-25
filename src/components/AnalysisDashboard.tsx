import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldCheck, Zap, Calculator, Target, Brain, Heart, Stethoscope, Clock } from 'lucide-react';
import { AnalysisResult } from '../types/insurance';
import RadarChart from './RadarChart';
import ComparisonTable from './ComparisonTable';

interface AnalysisDashboardProps {
  result: AnalysisResult;
}

const InsuranceSummary = ({ result }: { result: AnalysisResult }) => (
  <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
      <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
      나의 보험 가입 항목
    </h3>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { label: '일반암 진단비', amount: '3,000만 원', status: '부족', color: 'text-red-500' },
        { label: '뇌혈관 질환', amount: '1,000만 원', status: '주의', color: 'text-orange-500' },
        { label: '심혈관 질환', amount: '1,000만 원', status: '주의', color: 'text-orange-500' },
        { label: '수술비/입원비', amount: '가입됨', status: '정상', color: 'text-green-500' },
        { label: '일상생활배상', amount: '1억 원', status: '정상', color: 'text-green-500' },
        { label: '운전자 보험', amount: '가입됨', status: '정상', color: 'text-green-500' },
      ].map((item, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-tighter">{item.label}</p>
            <p className="text-lg font-black text-gray-800">{item.amount}</p>
          </div>
          <span className={`text-xs font-black px-3 py-1 bg-gray-50 rounded-lg ${item.color}`}>{item.status}</span>
        </div>
      ))}
    </div>
  </div>
);

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const { scores, efficiency, deficiencies } = result;

  const radarData = [
    { label: '일반암', value: scores.cancerScore, target: 80 },
    { label: '뇌혈관', value: scores.cerebrovascularScore, target: 80 },
    { label: '심혈관', value: scores.cardiovascularScore, target: 80 },
    { label: '수술/입원', value: 90, target: 85 },
    { label: '장해/생활', value: 70, target: 80 },
    { label: '사망/정기', value: 60, target: 75 },
  ];

  return (
    <div className="space-y-32 py-16">
      <InsuranceSummary result={result} />
      
      {/* 1. Score & Metrics Section with Radar Chart */}
      <section className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col lg:flex-row gap-24 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] scale-150 transform rotate-12">
           <Zap className="w-96 h-96 text-orange-500" />
        </div>

        {/* Radar Chart */}
        <div className="flex-shrink-0 relative z-10 w-full lg:w-auto">
          <RadarChart data={radarData} size={350} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center -mt-6">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Total</span>
            <span className="text-4xl font-black text-gray-900 leading-none">{Math.round(scores.totalScore)}</span>
          </div>
        </div>

        {/* Metrics & Deficiencies */}
        <div className="flex-1 space-y-12 relative z-10">
          <div className="space-y-4">
             <h3 className="text-3xl font-black text-gray-900 tracking-tighter">당신의 보장 상태를 분석했습니다.</h3>
             <p className="text-gray-500 font-bold italic">"방사형 그래프가 찌그러질수록 위험에 더 많이 노출되어 있습니다."</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/50 group hover:scale-105 transition-all">
              <div className="flex items-center gap-2 mb-6 text-blue-600">
                 <Calculator className="w-5 h-5" />
                 <span className="text-sm font-black uppercase tracking-widest">보험료 효율성</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-blue-600 leading-none">{efficiency.toFixed(1)}</span>
                <span className="text-blue-900 font-bold">점</span>
              </div>
              <div className="w-full bg-blue-100 h-1.5 rounded-full mt-6 overflow-hidden">
                 <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, efficiency * 100)}%` }}></div>
              </div>
            </div>

            <div className="flex-[1.5] bg-red-50/50 p-8 rounded-[2rem] border border-red-100/50 hover:shadow-xl transition-all">
               <div className="flex items-center gap-2 mb-6 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">긴급 보강 필요 항목</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {deficiencies.map((item, i) => (
                   <span key={i} className="bg-white px-5 py-3 rounded-2xl text-red-600 text-sm font-black shadow-sm border border-red-100 transform transition-all hover:scale-110 cursor-default">
                     {item}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Comparative Analysis Table (The "Before & After") */}
      <ComparisonTable 
        currentPremium={result.recommendations.upgrade.estimatedPremium} 
        recommendedPremium={result.recommendations.diet.estimatedPremium} 
      />

      {/* 3. Recommendation Strategies */}
      <section className="space-y-12">
        <div className="text-center space-y-4 mb-16">
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter">나에게 맞는 추천 시나리오</h3>
          <p className="text-gray-500 font-medium">현재 상황에서 가장 합리적인 3가지 탈출 경로를 제시합니다.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Diet Type */}
           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col"
           >
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
               <Zap className="w-6 h-6 fill-current" />
             </div>
             <h4 className="text-xl font-black mb-4 tracking-tight">{result.recommendations.diet.title}</h4>
             <p className="text-sm text-gray-500 leading-relaxed mb-10 min-h-[4rem]">
               {result.recommendations.diet.description}
             </p>

             <div className="mb-8 border-b border-gray-50 pb-8">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">월 예상 보험료</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-blue-600">{result.recommendations.diet.estimatedPremium.toLocaleString()}</span>
                  <span className="text-xl font-bold text-gray-900">원</span>
                </div>
             </div>

             <ul className="space-y-5 flex-1 mb-10">
               {result.recommendations.diet.coverageChanges.map((change, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-gray-50 text-gray-700 py-5 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95">
               상세 리포트 보기
             </button>
             <p className="text-[10px] text-gray-400 mt-4 leading-tight opacity-70">
               {result.recommendations.diet.switchingLossNotice}
             </p>
           </motion.div>

           {/* Upgrade Type (The "Main" Recommendation) */}
           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] flex flex-col relative scale-[1.05] z-10"
           >
             <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-8 py-2.5 rounded-full font-black text-xs shadow-lg uppercase tracking-widest">
                가장 많이 추천하는 플랜
             </div>
             <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-inner shadow-orange-600/50">
               <Zap className="w-6 h-6 fill-current" />
             </div>
             <h4 className="text-xl font-black mb-4 tracking-tight text-orange-400">{result.recommendations.upgrade.title}</h4>
             <p className="text-sm text-gray-400 leading-relaxed mb-10 min-h-[4rem]">
               {result.recommendations.upgrade.description}
             </p>

             <div className="mb-8 border-b border-white/10 pb-8">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">월 예상 보험료</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-orange-500">{result.recommendations.upgrade.estimatedPremium.toLocaleString()}</span>
                  <span className="text-xl font-bold">원</span>
                </div>
             </div>

             <ul className="space-y-5 flex-1 mb-10">
               {result.recommendations.upgrade.coverageChanges.map((change, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm font-bold">
                    <ShieldCheck className="w-5 h-5 text-orange-500" />
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-lg active:scale-95">
               상세 리포트 보기
             </button>
             <p className="text-[10px] text-gray-500 mt-4 leading-tight opacity-70">
               {result.recommendations.upgrade.switchingLossNotice}
             </p>
           </motion.div>

           {/* Hybrid Type */}
           <motion.div 
             whileHover={{ y: -10 }}
             className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col"
           >
             <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mb-8">
               <Zap className="w-6 h-6 fill-current" />
             </div>
             <h4 className="text-xl font-black mb-4 tracking-tight">{result.recommendations.hybrid.title}</h4>
             <p className="text-sm text-gray-500 leading-relaxed mb-10 min-h-[4rem]">
               {result.recommendations.hybrid.description}
             </p>

             <div className="mb-8 border-b border-gray-50 pb-8">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">월 예상 보험료</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">{result.recommendations.hybrid.estimatedPremium.toLocaleString()}</span>
                  <span className="text-xl font-bold text-gray-900">원</span>
                </div>
             </div>

             <ul className="space-y-5 flex-1 mb-10">
               {result.recommendations.hybrid.coverageChanges.map((change, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-gray-50 text-gray-700 py-5 rounded-2xl font-bold hover:bg-gray-100 transition-all active:scale-95">
               상세 리포트 보기
             </button>
             <p className="text-[10px] text-gray-400 mt-4 leading-tight opacity-70">
               {result.recommendations.hybrid.switchingLossNotice}
             </p>
           </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AnalysisDashboard;
