import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldCheck, Zap, Calculator, Target, Brain, Heart, Stethoscope, Clock } from 'lucide-react';
import { AnalysisResult } from '../types/insurance';
import RadarChart from './RadarChart';
import ComparisonTable from './ComparisonTable';

interface AnalysisDashboardProps {
  result: AnalysisResult;
}

const InsuranceSummary = ({ result }: { result: AnalysisResult }) => {
  const { analysis } = result;
  const isDental = analysis.selectedCategory?.includes('치아');
  const isSilbi = analysis.selectedCategory?.includes('실손') || analysis.selectedCategory?.includes('실비');
  
  const formatAmount = (amt: number) => {
    if (amt >= 100000000) return `${(amt / 100000000).toFixed(0)}억 원`;
    if (amt >= 10000) return `${(amt / 10000).toLocaleString()}만 원`;
    return `${amt.toLocaleString()}원`;
  };

  const getStatus = (current: number, target: number, label: string) => {
    const ratio = current / target;
    if (ratio >= 1.0) return { text: '정상', color: 'text-emerald-500' };
    
    if (label.includes('뇌혈관') || label.includes('심혈관')) {
      if (ratio >= 0.3) return { text: '주의', color: 'text-orange-500' };
    }
    if (label.includes('후유장해') && ratio <= 0.4) return { text: '경고', color: 'text-red-600' };
    if (label.includes('수술비') && ratio < 0.5) return { text: '부족', color: 'text-red-500' };
    
    if (ratio >= 0.8) return { text: '정상', color: 'text-emerald-500' };
    if (ratio >= 0.6) return { text: '주의', color: 'text-orange-500' };
    if (ratio >= 0.3) return { text: '부족', color: 'text-red-500' };
    return { text: '경고', color: 'text-red-600' };
  };

  const dentalItems = [
    { label: '임플란트 보장', amount: analysis.dental?.implantLimit === 'unlimited' ? '무제한' : '연 3회', status: analysis.dental?.implantLimit === 'unlimited' ? '우수' : '정상', color: analysis.dental?.implantLimit === 'unlimited' ? 'text-emerald-500' : 'text-blue-500' },
    { label: '브릿지 보장', amount: '연 3회', status: '보통', color: 'text-slate-400' },
    { label: '크라운 치료', amount: formatAmount(analysis.dental?.crownAmount || 0), status: (analysis.dental?.crownAmount || 0) >= 500000 ? '정상' : (analysis.dental?.crownAmount || 0) >= 300000 ? '주의' : '부족', color: (analysis.dental?.crownAmount || 0) >= 400000 ? 'text-emerald-500' : 'text-orange-500' },
    { label: '보존치료(인레이)', amount: '20만 원', status: '정상', color: 'text-emerald-500' },
    { label: '치아 건강상태', amount: analysis.dental?.lastYear === 'yes' || analysis.dental?.last5Years === 'yes' ? '질병이력' : '건강체', status: analysis.dental?.lastYear === 'yes' || analysis.dental?.last5Years === 'yes' ? '할증' : '할인', color: analysis.dental?.lastYear === 'yes' || analysis.dental?.last5Years === 'yes' ? 'text-orange-600' : 'text-emerald-500' },
    { label: '감액기간', amount: '90일/1년', status: '고정', color: 'text-slate-400' },
  ];

  const silbiItems = [
    { label: '실손 의료비 세대', amount: analysis.monthlyPremium > 40000 ? '1~3세대' : '4세대', status: analysis.monthlyPremium > 40000 ? '주의' : '정상', color: analysis.monthlyPremium > 40000 ? 'text-orange-500' : 'text-emerald-500' },
    { label: '자기부담금 비율', amount: '20~30%', status: '정상', color: 'text-emerald-500' },
    { label: '3대 비급여 한도', amount: '특약 가입', status: '정상', color: 'text-emerald-500' },
    { label: '도수/MRI 보장', amount: '연간 300~350만', status: '정상', color: 'text-emerald-500' },
    { label: '보험료 차등제', amount: '1단계(할인)', status: '정상', color: 'text-emerald-500' },
    { label: '재가입 주기', amount: '5년', status: '정상', color: 'text-emerald-500' },
  ];

  const standardItems = [
    { label: '일반암 진단비', amount: formatAmount(analysis.cancer.currentAmount), status: getStatus(analysis.cancer.currentAmount, analysis.cancer.targetAmount, '일암').text, color: getStatus(analysis.cancer.currentAmount, analysis.cancer.targetAmount, '일암').color },
    { label: '뇌혈관 질환', amount: formatAmount(analysis.cerebrovascular.currentAmount), status: getStatus(analysis.cerebrovascular.currentAmount, analysis.cerebrovascular.targetAmount, '뇌').text, color: getStatus(analysis.cerebrovascular.currentAmount, analysis.cerebrovascular.targetAmount, '뇌').color },
    { label: '심혈관 질환', amount: formatAmount(analysis.cardiovascular.currentAmount), status: getStatus(analysis.cardiovascular.currentAmount, analysis.cardiovascular.targetAmount, '심').text, color: getStatus(analysis.cardiovascular.currentAmount, analysis.cardiovascular.targetAmount, '심').color },
    { label: '수술비(질병/상해)', amount: formatAmount(analysis.surgery.currentAmount), status: getStatus(analysis.surgery.currentAmount, analysis.surgery.targetAmount, '수').text, color: getStatus(analysis.surgery.currentAmount, analysis.surgery.targetAmount, '수').color },
    { label: '질병후유장해', amount: formatAmount(analysis.postDisability.currentAmount), status: getStatus(analysis.postDisability.currentAmount, analysis.postDisability.targetAmount, '질').text, color: getStatus(analysis.postDisability.currentAmount, analysis.postDisability.targetAmount, '질').color },
    { label: '납입면제 범위', amount: analysis.paymentExemption === 'premium' ? '고급형' : '표준형', status: analysis.paymentExemption === 'premium' ? '우수' : '정상', color: 'text-emerald-500' },
  ];

  const items = isDental ? dentalItems : isSilbi ? silbiItems : standardItems;

  return (
    <div className={`rounded-[2.5rem] p-10 border ${isDental || isSilbi ? 'bg-emerald-50/30 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
      <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
        <div className={`w-1.5 h-6 rounded-full ${isDental || isSilbi ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
        {isDental ? '치과 전용 보장 분석 현황' : isSilbi ? '실손 의료비 정밀 분석 현황' : '상세 보장 분석 현황'}
      </h3>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-emerald-200 transition-all">
            <div>
              <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">{item.label}</p>
              <p className="text-lg font-black text-gray-800">{item.amount}</p>
            </div>
            <span className={`text-[10px] font-black px-3 py-1 bg-gray-50 rounded-lg ${item.color}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const { scores, efficiency, deficiencies, analysis } = result;
  const isDental = analysis.selectedCategory?.includes('치아');
  const isSilbi = analysis.selectedCategory?.includes('실손') || analysis.selectedCategory?.includes('실비');

  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);
  const [showRejoinInfo, setShowRejoinInfo] = React.useState(false);

  // 연령대별 한국인 평균 보장 데이터
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
  ] : isSilbi ? [
    { label: '세대분석', value: analysis.monthlyPremium > 40000 ? 40 : 90, target: 70 },
    { label: '자기부담금', value: 85, target: 80 },
    { label: '입원보장', value: 90, target: 85 },
    { label: '통원보장', value: 90, target: 85 },
    { label: '비급여특약', value: 70, target: 80 },
    { label: '가성비', value: analysis.monthlyPremium < 20000 ? 95 : 70, target: 75 },
  ] : [
    { label: '일반암', value: scores.cancerScore, target: avg.c },
    { label: '뇌혈관', value: scores.cerebrovascularScore, target: avg.b },
    { label: '심혈관', value: scores.cardiovascularScore, target: avg.h },
    { label: '수술/입원', value: scores.totalScore > 70 ? 90 : 60, target: avg.s },
    { label: '장해/생활', value: scores.totalScore > 70 ? 80 : 50, target: avg.l },
    { label: '사망/정기', value: 75, target: avg.d },
  ];

  return (
    <div className="space-y-32 py-16">
      <InsuranceSummary result={result} />
      
      {/* 1. Score & Metrics Section with Radar Chart */}
      <section className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col lg:flex-row gap-24 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] scale-150 transform rotate-12">
           {isDental || isSilbi ? <Stethoscope className="w-96 h-96 text-emerald-500" /> : <Zap className="w-96 h-96 text-orange-500" />}
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
               {isDental ? '당신의 치아 보장 상태를 분석했습니다.' : isSilbi ? '당신의 실손 의료비 상담 리포트입니다.' : '당신의 보장 상태를 분석했습니다.'}
             </h3>
             <p className="text-gray-500 font-bold italic">
               {isDental 
                 ? '"방사형 그래프가 6각 별 모양에 가까울수록 빈틈없는 치아 보장 상태입니다."' 
                 : isSilbi
                 ? '"4세대 전환 시 보험료를 최대 70%까지 절감할 수 있는지 분석했습니다."'
                 : '"방사형 그래프가 둥근 모양일수록 안전한 보장 상태입니다."'
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
                <span className={`text-5xl font-black leading-none ${isDental || isSilbi ? 'text-emerald-600' : 'text-blue-600'}`}>{efficiency.toFixed(1)}</span>
                <span className={`${isDental || isSilbi ? 'text-emerald-900' : 'text-blue-900'} font-bold`}>점</span>
              </div>
              <div className={`w-full h-1.5 rounded-full mt-6 overflow-hidden ${isDental || isSilbi ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                 <div className={`h-full ${isDental || isSilbi ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, efficiency * 100)}%` }}></div>
              </div>
            </div>

            <div className="flex-[1.5] bg-red-50/50 p-8 rounded-[2rem] border border-red-100/50 hover:shadow-xl transition-all">
               <div className="flex items-center gap-2 mb-6 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">{isDental || isSilbi ? '실손 보장 보강 필요' : '긴급 보강 필요 항목'}</span>
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

      {/* 2. Comparative Analysis Table (The "Before & After") */}
      <ComparisonTable 
        analysis={result.analysis}
        recommendation={result.recommendations.upgrade} 
      />

      {/* 3. Recommendation Strategies - Card Layout */}
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
             <h4 className="text-2xl font-black mb-4 tracking-tighter text-blue-900 relative z-10">{result.recommendations.diet.title}</h4>
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
             <h4 className="text-2xl font-black mb-4 tracking-tighter text-orange-400">{result.recommendations.upgrade.title}</h4>
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
             <h4 className="text-2xl font-black mb-4 tracking-tighter text-purple-900 relative z-10">{result.recommendations.hybrid.title}</h4>
             <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10 min-h-[4rem]">
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

      {/* Detail Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto pt-20">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlan(null)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[3rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl"
          >
            <div className="p-10 md:p-16 space-y-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2 block">Premium Report</span>
                  <h4 className="text-3xl font-black text-gray-900 tracking-tighter">{selectedPlan.title} 상세 분석</h4>
                </div>
                <button 
                  onClick={() => setSelectedPlan(null)} 
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-800 hover:bg-orange-500 hover:text-white transition-all shadow-sm flex-shrink-0"
                >
                  <span className="text-xl font-bold">✕</span>
                </button>
              </div>

              <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-black text-gray-400 uppercase tracking-widest">실시간 보장 분석 리포트</h5>
                  <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase">4세대 실손 기준</div>
                </div>

                <div className="grid gap-6">
                  {/* Item 1: Generation Analysis */}
                  <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-blue-500 uppercase tracking-wider">01. 세대별 전환 분석</span>
                      <span className="text-sm font-black text-gray-900 px-3 py-1 bg-gray-50 rounded-lg">전환 추천</span>
                    </div>
                    <p className="text-base font-bold text-gray-800 leading-relaxed">
                      현재 고객님의 연령과 성별을 분석한 결과, 7년 뒤 예상 갱신 보험료가 <span className="text-red-500 font-black">280%</span> 이상 상승할 것으로 예측됩니다. <br/>
                      <span className="text-blue-500 font-black">4세대 전환 시 월 32,000원의 고정 지출을 절감</span>할 수 있습니다.
                    </p>
                  </div>

                  {/* Item 2: 3 Main Non-standard Treatments */}
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6">
                    <span className="text-xs font-black text-orange-500 uppercase tracking-wider block">02. 3대 비급여 특약 한도 (필수 체크)</span>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: '도수/충격파', value: '350만', sub: '연 50회' },
                        { label: '비급여 주사', value: '250만', sub: '연 50회' },
                        { label: '비급여 MRI', value: '300만', sub: '무제한' },
                      ].map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-2xl text-center">
                          <p className="text-[10px] text-gray-400 font-black mb-1">{item.label}</p>
                          <p className="text-lg font-black text-gray-900 leading-none mb-1">{item.value}</p>
                          <p className="text-[10px] text-orange-500 font-bold">{item.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Item 3: Deductibles & Discount */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between items-start gap-4">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">자기부담금 제도</span>
                       <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-gray-900">20/30</span>
                          <span className="text-xs text-gray-400 font-bold">% 분리</span>
                       </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between items-start gap-4">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">보험료 차등제</span>
                       <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-gray-900">최대 할인</span>
                          <span className="text-xs text-gray-400 font-bold">1단계</span>
                       </div>
                    </div>
                  </div>

                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRejoinInfo(true);
                    }}
                    className="px-6 py-4 bg-slate-900 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-black transition-all"
                  >
                    <span className="text-xs text-slate-400 font-black">5년 만기 재가입 주기 적용</span>
                    <div className="flex items-center gap-1 text-[10px] text-white font-black">
                      상세 안내 <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-modal: Rejoin Info */}
              {showRejoinInfo && (
                <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 transition-all duration-300">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm rounded-[3rem]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRejoinInfo(false);
                    }}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 shadow-2xl relative z-10 max-w-sm border border-gray-100"
                  >
                    <div className="flex flex-col items-center text-center gap-6">
                      <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-xl font-bold">!</div>
                      <div className="space-y-4">
                        <h5 className="text-xl font-black text-gray-900 tracking-tight">5년 만기 재가입 주기란?</h5>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                          보험 약관의 시대적 변화를 반영하기 위해 <span className="text-orange-500 font-bold">5년마다 최신 표준 약관으로 보장 내용이 갱신</span>되는 제도입니다.<br/><br/>
                          심사 없이 자동으로 연장되므로 건강 상태에 상관없이 계속 보장받으실 수 있습니다.
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRejoinInfo(false);
                        }}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all"
                      >
                        이해했습니다
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                 <button className="w-full bg-slate-900 text-orange-500 py-6 rounded-2xl font-black text-xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
                   이 플랜으로 전문가 상세 리포트 받기
                 </button>
                 <p className="text-xs text-gray-400 text-center font-medium">※ 위 내용은 보험사 및 가입 조건에 따라 변동될 수 있습니다.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
