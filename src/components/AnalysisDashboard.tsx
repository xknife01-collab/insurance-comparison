import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldCheck, Zap, Calculator, Target, Brain, Heart, Stethoscope, Clock, Hotel } from 'lucide-react';
import { AnalysisResult } from '../types/insurance';
import RadarChart from './RadarChart';
import ComparisonTable from './ComparisonTable';
import { HealthSummary } from './insurance/health/HealthSummary';
import { SilsonSummary } from './insurance/silson/SilsonSummary';
import { CaregivingSummary } from './insurance/caregiving/CaregivingSummary';
import { DentalSummary } from './insurance/dental/DentalSummary';
import { SurgerySummary as SurgeryHospitalSummary } from './insurance/surgery/SurgerySummary';
import { BrainSummary } from './insurance/brain/BrainSummary';
import { CancerSummary } from './insurance/cancer/CancerSummary';
import { HeartSummary } from './insurance/heart/HeartSummary';
import { PreExistingSummary } from './insurance/preExisting/PreExistingSummary';

interface AnalysisDashboardProps {
  result: AnalysisResult;
}

const InsuranceSummary = ({ result }: { result: AnalysisResult }) => {
  const { analysis } = result;
  const isDental = analysis.selectedCategory?.includes('치아');
  const isSilbi = analysis.selectedCategory?.includes('실손') || analysis.selectedCategory?.includes('실비');
  const isCaregiving = analysis.selectedCategory?.includes('간병');
  const isSurgeryHospital = analysis.selectedCategory?.includes('수술') || analysis.selectedCategory?.includes('입원');
  
  const formatAmount = (amt: number) => {
    if (amt >= 100000000) return `${(amt / 100000000).toFixed(0)}억 원`;
    if (amt >= 10000) return `${(amt / 10000).toLocaleString()}만 원`;
    return `${amt.toLocaleString()}원`;
  };

  if (isDental) return <DentalSummary result={result as any} />;
  if (isSilbi) return <SilsonSummary result={result as any} />;
  if (isCaregiving) return <CaregivingSummary result={result as any} />;
  if (isSurgeryHospital) return <SurgeryHospitalSummary result={result as any} />;
  if (analysis.selectedCategory?.includes('뇌혈관')) return <BrainSummary result={result as any} formatAmount={formatAmount} />;
  if (analysis.selectedCategory?.includes('암보험')) return <CancerSummary result={result as any} formatAmount={formatAmount} />;
  if (analysis.selectedCategory?.includes('심장질환')) return <HeartSummary result={result as any} formatAmount={formatAmount} />;
  if (analysis.selectedCategory?.includes('유병자')) return <PreExistingSummary result={result as any} formatAmount={formatAmount} />;

  return <HealthSummary result={result as any} formatAmount={formatAmount} />;
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const { scores, efficiency, deficiencies, analysis } = result;
  const isDental = analysis.selectedCategory?.includes('치아');
  const isSilbi = analysis.selectedCategory?.includes('실손') || analysis.selectedCategory?.includes('실비');
  const isCaregiving = analysis.selectedCategory?.includes('간병');
  const isSurgeryHospital = analysis.selectedCategory?.includes('수술') || analysis.selectedCategory?.includes('입원');

  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);

  const getAverageByAge = (age: number) => {
    if (age < 30) return { c: 50, b: 40, h: 40, s: 60, l: 30, d: 20 };
    if (age < 50) return { c: 65, b: 55, h: 50, s: 75, l: 50, d: 50 };
    return { c: 55, b: 45, h: 45, s: 85, l: 70, d: 60 };
  };

  const avg = getAverageByAge(analysis.age);

  const radarData = isDental ? [
    { label: '임플란트', value: analysis.dental?.implantLimit === 'unlimited' ? 95 : 70, target: 60 },
    { label: '브릿지', value: 65, target: 55 },
    { label: '틀니', value: analysis.dental?.dentures === 'yes' ? 30 : 90, target: 50 },
    { label: '크라운', value: analysis.dental?.crownAmount === 500000 ? 95 : analysis.dental?.crownAmount === 300000 ? 75 : 50, target: 65 },
    { label: '치아건강', value: (analysis.dental?.lastYear === 'no' && analysis.dental?.last5Years === 'no') ? 95 : 50, target: 60 },
    { label: '충전치료', value: 80, target: 60 },
  ] : isCaregiving ? [
    { label: '지원방식', value: analysis.caregiving?.type === 'support' ? 90 : 80, target: 70 },
    { label: '체증형보장', value: analysis.caregiving?.isStepUp ? 95 : 40, target: 75 },
    { label: '인건비대응', value: analysis.caregiving?.isStepUp ? 90 : 50, target: 80 },
    { label: '요양병원', value: 85, target: 75 },
    { label: '면책기간', value: 100, target: 100 },
    { label: '보장효율', value: 80, target: 70 },
  ] : isSilbi ? [
    { label: '세대분석', value: (analysis.monthlyPremium || 0) > 40000 ? 40 : 90, target: 70 },
    { label: '자기부담금', value: 85, target: 80 },
    { label: '입원보장', value: 90, target: 85 },
    { label: '통원보장', value: 90, target: 85 },
    { label: '비급여특약', value: 70, target: 80 },
    { label: '가성비', value: (analysis.monthlyPremium || 0) < 20000 ? 95 : 70, target: 75 },
  ] : [
    { label: '일반암', value: scores.cancerScore || 0, target: avg.c || 50 },
    { label: '뇌혈관', value: scores.cerebrovascularScore || 0, target: avg.b || 50 },
    { label: '심혈관', value: scores.cardiovascularScore || 0, target: avg.h || 50 },
    { label: '수술/입원', value: (scores.totalScore || 0) > 70 ? 90 : 60, target: avg.s || 50 },
    { label: '장해/생활', value: (scores.totalScore || 0) > 70 ? 80 : 50, target: avg.l || 50 },
    { label: '사망/정기', value: (scores.totalScore || 0) > 70 ? 70 : 40, target: 50 },
  ];

  return (
    <div className="space-y-32">
      {/* Insurance Summary Cards (Silson, Caregiving, Dental, etc.) */}
      <InsuranceSummary result={result} />

      {/* 1. Score & Metrics Section with Radar Chart */}
      <section className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col lg:flex-row gap-24 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] scale-150 transform rotate-12">
           {isDental || isSilbi ? <Stethoscope className="w-96 h-96 text-emerald-500" /> : isCaregiving ? <Hotel className="w-96 h-96 text-purple-500" /> : <Zap className="w-96 h-96 text-orange-500" />}
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
             <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
               {isDental ? '당신의 치아 보장 상태를 분석했습니다.' : isSilbi ? '당신의 실손 의료비 상담 리포트입니다.' : isCaregiving ? '당신의 간병 대비 준비 상태를 분석했습니다.' : '당신의 보장 상태를 분석했습니다.'}
             </h3>
             <p className="text-gray-500 font-bold italic">
               {isDental 
                 ? '"방사형 그래프가 6각형 모양에 가까울수록 빈틈없는 치아 보장 상태입니다."' 
                 : isSilbi
                  ? '"4세대로 전환 시 보험료를 최대 70%까지 절감할 수 있는지 분석했습니다."'
                  : isCaregiving
                  ? '"방사형 그래프가 원형에 가까울수록 안전한 보장 상태입니다."'
                  : isSurgeryHospital
                  ? '"뇌/심장/암 등 주요 질환과 수술/입원 담보를 집중 분석했습니다."'
                  : '"방사형 그래프가 원형에 가까울수록 안전한 보장 상태입니다."'
                }
             </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className={`flex-1 p-8 rounded-[2rem] border group hover:scale-105 transition-all ${isDental || isSilbi ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-blue-50/50 border-blue-100/50'}`}>
              <div className={`flex items-center gap-2 mb-6 ${isDental || isSilbi ? 'text-emerald-600' : 'text-blue-600'}`}>
                 <Calculator className="w-5 h-5" />
                 <span className="text-sm font-black uppercase tracking-widest">{isDental || isSilbi ? '실손 보험 가성비' : '보험료 효율성'}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-black leading-none ${isDental || isSilbi ? 'text-emerald-600' : isCaregiving ? 'text-purple-600' : 'text-blue-600'}`}>{efficiency.toFixed(1)}</span>
                <span className={`${isDental || isSilbi ? 'text-emerald-900' : isCaregiving ? 'text-purple-900' : 'text-blue-900'} font-bold`}>점</span>
              </div>
              <div className={`w-full h-1.5 rounded-full mt-6 overflow-hidden ${isDental || isSilbi ? 'bg-emerald-100' : isCaregiving ? 'bg-purple-100' : 'bg-blue-100'}`}>
                 <div className={`h-full ${isDental || isSilbi ? 'bg-emerald-500' : isCaregiving ? 'bg-purple-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, efficiency * 100)}%` }}></div>
              </div>
            </div>

            <div className="flex-[1.5] bg-red-50/50 p-8 rounded-[2rem] border border-red-100/50 hover:shadow-xl transition-all">
               <div className="flex items-center gap-2 mb-6 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">{isDental || isSilbi || isSurgeryHospital ? '보장 보강 필요' : '긴급 보강 필요 항목'}</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {deficiencies.length > 0 ? deficiencies.map((item, i) => (
                   <span key={i} className="bg-white px-5 py-3 rounded-2xl text-red-600 text-sm font-black shadow-sm border border-red-100 transform transition-all hover:scale-110 cursor-default">
                     {item}
                   </span>
                 )) : (
                   <span className={`bg-white px-5 py-3 rounded-2xl text-sm font-black shadow-sm border ${isDental || isSilbi ? 'text-emerald-600 border-emerald-100' : 'text-green-600 border-green-100'}`}>
                     {isDental || isSilbi ? '실손 보장이 완벽합니다!' : '모든 보장이 완벽합니다!'}
                   </span>
                 )}
               </div>
            </div>
          </div>
        </div>
      </section>

      <ComparisonTable 
        analysis={result.analysis}
        recommendation={result.recommendations.upgrade} 
      />

      <section className="space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
            <Target size={14} className="fill-current text-orange-500" /> Optimized Protection Strategies
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">나에게 맞는 추천 시나리오</h3>
          <p className="text-gray-500 font-bold italic">"현재 상황에서 가장 합리적인 3가지 탈출 경로를 제시합니다."</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-stretch">
           {/* Diet Type */}
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.diet)}
             className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(59,130,246,0.15)] border border-blue-100/50 flex flex-col group transition-all cursor-pointer overflow-hidden relative"
           >
             <div className="absolute top-0 right-0 p-8 opacity-10 rotate-45 transform">
               <Zap className="w-32 h-32 text-blue-500" />
             </div>
             <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-blue-200 group-hover:rotate-[360deg] transition-transform duration-1000 relative z-10">
               <Zap className="w-8 h-8 fill-current" />
             </div>
              <h4 className="text-2xl font-black mb-1 tracking-tighter text-blue-900 group-hover:text-blue-600 transition-colors uppercase">{result.recommendations.diet.title}</h4>
              {result.recommendations.diet.companyName && (
                <div className="mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.diet.companyName}</span>
                  <span className="text-xs font-bold text-slate-500 italic">{result.recommendations.diet.productName}</span>
                </div>
              )}
              <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10 min-h-[4rem]">
                {result.recommendations.diet.description}
              </p>

             <div className="mb-10 border-b border-gray-50 pb-10">
                <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">월 예상 보험료</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-blue-600 tracking-tighter">{result.recommendations.diet.estimatedPremium.toLocaleString()}</span>
                  <span className="text-2xl font-black text-gray-900">원</span>
                </div>
             </div>

             <ul className="space-y-6 flex-1 mb-12">
               {result.recommendations.diet.coverageChanges.map((change, i) => (
                 <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </div>
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-gray-50 text-gray-400 py-6 rounded-[2rem] font-black text-sm hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 border border-transparent hover:border-gray-200">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
               {result.recommendations.diet.switchingLossNotice}
             </p>
           </motion.div>

           {/* Upgrade Type (The "Main" Recommendation) */}
           <motion.div 
             whileHover={{ y: -20, scale: 1.02 }}
             onClick={() => setSelectedPlan(result.recommendations.upgrade)}
             className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] flex flex-col relative z-10 border-2 border-slate-800 cursor-pointer"
           >
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-10 py-3 rounded-full font-black text-[0.7rem] shadow-2xl uppercase tracking-[0.2em] whitespace-nowrap">
                가장 많이 추천하는 플랜
             </div>
             <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-10 shadow-[0_15px_30px_-5px_rgba(255,107,0,0.5)] animate-pulse">
               <Zap className="w-8 h-8 fill-current" />
             </div>
              <h4 className="text-2xl font-black mb-1 tracking-tighter text-orange-400 uppercase">{result.recommendations.upgrade.title}</h4>
              {result.recommendations.upgrade.companyName && (
                <div className="mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.upgrade.companyName}</span>
                  <span className="text-xs font-bold text-slate-400 italic">{result.recommendations.upgrade.productName}</span>
                </div>
              )}
              <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 min-h-[4rem]">
                {result.recommendations.upgrade.description}
              </p>

             <div className="mb-10 border-b border-white/5 pb-10">
                <span className="text-[0.65rem] font-black text-slate-600 uppercase tracking-widest block mb-3">월 예상 보험료</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-orange-500 tracking-tighter">{result.recommendations.upgrade.estimatedPremium.toLocaleString()}</span>
                  <span className="text-2xl font-black text-white">원</span>
                </div>
             </div>

             <ul className="space-y-6 flex-1 mb-12">
               {result.recommendations.upgrade.coverageChanges.map((change, i) => (
                 <li key={i} className="flex items-center gap-4 text-sm font-bold">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-orange-500" />
                    </div>
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-orange-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_-5px_rgba(255,107,0,0.5)] hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-slate-500 mt-6 leading-tight font-bold text-center opacity-40">
               {result.recommendations.upgrade.switchingLossNotice}
             </p>
           </motion.div>

           {/* Hybrid Type */}
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.hybrid)}
             className="bg-gradient-to-br from-violet-50 to-purple-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(139,92,246,0.15)] border border-purple-100/50 flex flex-col group transition-all cursor-pointer overflow-hidden relative"
           >
             <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 transform">
               <Target className="w-32 h-32 text-purple-500" />
             </div>
             <div className="w-16 h-16 bg-violet-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-purple-200 group-hover:rotate-[-360deg] transition-transform duration-1000 relative z-10">
               <Zap className="w-8 h-8 fill-current" />
             </div>
              <h4 className="text-2xl font-black mb-1 tracking-tighter text-purple-900 relative z-10 uppercase">{result.recommendations.hybrid.title}</h4>
              {result.recommendations.hybrid.companyName && (
                <div className="mb-4 animate-in fade-in slide-in-from-left-2 transition-all relative z-10">
                  <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.hybrid.companyName}</span>
                  <span className="text-xs font-bold text-purple-400 italic">{result.recommendations.hybrid.productName}</span>
                </div>
              )}
              <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10 min-h-[4rem] relative z-10">
                {result.recommendations.hybrid.description}
              </p>

             <div className="mb-10 border-b border-gray-50 pb-10">
                <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">월 예상 보험료</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">{result.recommendations.hybrid.estimatedPremium.toLocaleString()}</span>
                  <span className="text-2xl font-black text-gray-900">원</span>
                </div>
             </div>

             <ul className="space-y-6 flex-1 mb-12">
               {result.recommendations.hybrid.coverageChanges.map((change, i) => (
                 <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-slate-300" />
                    </div>
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-gray-50 text-gray-400 py-6 rounded-[2rem] font-black text-sm hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 border border-transparent hover:border-gray-200">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
               {result.recommendations.hybrid.switchingLossNotice}
             </p>
           </motion.div>
        </div>
      </section>

      {/* 4. Full Market Analysis Section */}
      <section className="space-y-16 pb-32">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
            <Heart size={14} className="fill-current text-emerald-400" /> Whole Market Comparison
          </div>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter">전 보험사 실시간 보험료 비교</h3>
          <p className="text-gray-500 font-bold italic">"대한민국 모든 보험사의 DB를 전수 조사한 결과입니다."</p>
        </div>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <div className="col-span-1 text-center">순위</div>
            <div className="col-span-3">보험사</div>
            <div className="col-span-5">상품명</div>
            <div className="col-span-3 text-right">월 예상 보험료</div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {((result.analysis as any)._allOptions || []).map((opt: any, idx: number) => (
              <div key={idx} className="grid grid-cols-12 p-8 items-center hover:bg-gray-50 transition-all group">
                <div className="col-span-1 text-center">
                   <span className={`text-sm font-black ${idx < 3 ? 'text-orange-500' : 'text-gray-300'}`}>0{idx + 1}</span>
                </div>
                <div className="col-span-3">
                   <span className="text-base font-black text-gray-900">{opt.companyName}</span>
                </div>
                <div className="col-span-5">
                   <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500 font-bold group-hover:text-gray-900 transition-colors">{opt.productName}</p>
                      <div className="flex gap-2">
                          {opt.category === '뇌혈관질환' ? (
                            <span className="bg-orange-100 text-orange-600 text-[9px] px-2 py-0.5 rounded-md font-black">가장 넓음</span>
                          ) : opt.category === '뇌졸중' ? (
                            <span className="bg-blue-100 text-blue-600 text-[9px] px-2 py-0.5 rounded-md font-black">표준 보장</span>
                          ) : opt.category === '뇌출혈' ? (
                            <span className="bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-md font-black">좁은 보장</span>
                          ) : (
                            <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter ${
                                opt.category === '생활비형' ? 'bg-blue-100 text-blue-600' :
                                opt.category === '치료비형' ? 'bg-purple-100 text-purple-600' :
                                opt.category === '다회형' ? 'bg-emerald-100 text-emerald-600' :
                                opt.category === '미니형' ? 'bg-slate-100 text-slate-600' :
                                'bg-orange-100 text-orange-600'
                            }`}>
                               {opt.category || '진단비형'}
                            </span>
                          )}
                      </div>
                   </div>
                </div>
                <div className="col-span-3 text-right">
                   <div className="flex flex-col items-end">
                      <span className="text-xl font-black text-gray-900">{Math.round(opt.premium).toLocaleString()}원</span>
                      {idx === 0 && <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">Market Lowest</span>}
                   </div>
                </div>
              </div>
            ))}
            
            {(!((result.analysis as any)._allOptions) || (result.analysis as any)._allOptions.length === 0) && (
              <div className="p-20 text-center text-gray-400 font-bold italic">
                조회된 추가 보험사가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnalysisDashboard;
