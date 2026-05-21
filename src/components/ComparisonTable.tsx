import React from 'react';
import { motion } from 'motion/react';
import { TrendingDown, TrendingUp, ShieldCheck, HeartPulse, Brain, Heart, Stethoscope, Clock } from 'lucide-react';
import { InsuranceAnalysis, RecommendationPlan } from '../types/insurance';

interface ComparisonTableProps {
  analysis: InsuranceAnalysis;
  recommendation: RecommendationPlan;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ analysis, recommendation }) => {
  const savings = analysis.monthlyPremium - recommendation.estimatedPremium;

  const formatAmt = (amt: number) => {
    if (amt >= 100000000) return `${(amt / 100000000).toFixed(0)}억`;
    if (amt >= 10000) return `${(amt / 10000).toLocaleString()}만`;
    return `${amt.toLocaleString()}원`;
  };

  const isDental = analysis.selectedCategory?.includes('치아');
  const isSilbi = analysis.selectedCategory?.includes('실손') || analysis.selectedCategory?.includes('실비');
  const isCaregiving = analysis.selectedCategory?.includes('간병');
  const isBrain = analysis.selectedCategory?.includes('뇌혈관') || analysis.selectedCategory === 'brain';
  const isHeart = analysis.selectedCategory?.includes('심장') || analysis.selectedCategory === 'heart';

  const benchmark = isSilbi ? 55000 : isDental ? 85000 : isCaregiving ? 45000 : isHeart ? 120000 : 180000;
  const dietPremium = recommendation.estimatedPremium;
  const currentPremium = analysis.monthlyPremium;
  
  const displaySavings = currentPremium > dietPremium + 5000 ? (currentPremium - dietPremium) : (benchmark - dietPremium);

  const dentalRows = [
    { label: '임플란트 보장', current: '없음', recommended: analysis.dental?.implantLimit === 'unlimited' ? '무제한' : '연 3회', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
    { label: '브릿지 보장', current: '없음', recommended: '연 3회', icon: <HeartPulse className="w-4 h-4 text-emerald-500" /> },
    { label: '크라운 치료', current: '없음', recommended: formatAmt(analysis.dental?.crownAmount || 0), icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
    { label: '충전치료(인레이)', current: '없음', recommended: '20만', icon: <Stethoscope className="w-4 h-4 text-emerald-500" /> },
    { label: '발치/치수치료', current: '없음', recommended: '5만', icon: <HeartPulse className="w-4 h-4 text-emerald-500" /> },
    { label: '면책/감액기간', current: '해당없음', recommended: '90일/1년', icon: <Clock className="w-4 h-4 text-emerald-500" /> },
  ];

  const silbiRows = [
    { label: '실손 의료비 세대', current: currentPremium > 40000 ? '1~3세대' : '4세대', recommended: '4세대 (전환 추천)', icon: <ShieldCheck className="w-4 h-4 text-blue-500" /> },
    { label: '급여 자기부담금', current: '10~20%', recommended: '20%', icon: <HeartPulse className="w-4 h-4 text-blue-500" /> },
    { label: '비급여 자기부담금', current: '20%', recommended: '30%', icon: <Stethoscope className="w-4 h-4 text-blue-500" /> },
    { label: '비급여 3대 특약', current: '별도 확인', recommended: '포함 (표준화)', icon: <Brain className="w-4 h-4 text-blue-500" /> },
    { label: '보험료 차등제', current: '미적용', recommended: '단계별 적용(할인 가능)', icon: <TrendingDown className="w-4 h-4 text-blue-500" /> },
    { label: '재가입 주기', current: '15년', recommended: '5년', icon: <Clock className="w-4 h-4 text-blue-500" /> },
  ];

  const caregivingRows = [
    { label: '간병 지원 방식', current: '직접 고용', recommended: analysis.caregiving?.type === 'support' ? '보험사 지원(추천)' : '현금 일당형', icon: <ShieldCheck className="w-4 h-4 text-purple-500" /> },
    { label: '인건비 상승 대비', current: '미보장', recommended: analysis.caregiving?.isStepUp ? '체증형(가입)' : '기본형', icon: <TrendingUp className="w-4 h-4 text-purple-500" /> },
    { label: '간병인 매칭 스트레스', current: '매우 높음', recommended: '제로 (보험사 대행)', icon: <Stethoscope className="w-4 h-4 text-purple-500" /> },
    { label: '비갱신형 가입 여부', current: '해당 없음', recommended: analysis.caregiving?.type === 'support' ? '지원형(갱신)' : '사용형(비갱신)', icon: <Clock className="w-4 h-4 text-purple-500" /> },
    { label: '가족 간병 보장', current: '불가', recommended: analysis.caregiving?.type === 'support' ? '파견 중심' : '가족 간병 가능', icon: <Heart className="w-4 h-4 text-purple-500" /> },
    { label: '요양병원 한도', current: '부족', recommended: '일당 3~5만', icon: <Brain className="w-4 h-4 text-purple-500" /> },
  ];
  
  const brainRows = [
    { label: '뇌혈관 진단비', current: formatAmt(analysis.cerebrovascular?.currentAmount || 0), recommended: formatAmt(analysis.cerebrovascular?.targetAmount || 10000000), icon: <Brain className="w-4 h-4 text-indigo-500" /> },
    { label: '뇌혈관 수술비', current: '미보장', recommended: analysis.cerebrovascular?.surgeryBenefit ? '포함(추천)' : '미포함', icon: <HeartPulse className="w-4 h-4 text-indigo-500" /> },
    { label: '납입/갱신 방식', current: '확인필요', recommended: analysis.cerebrovascular?.paymentType === 'non-renewable' ? '비갱신형' : '갱신형', icon: <Clock className="w-4 h-4 text-indigo-500" /> },
    { label: '심사 유형', current: '일반심사', recommended: '표준체', icon: <ShieldCheck className="w-4 h-4 text-indigo-500" /> },
    { label: '보장 만기', current: '80세', recommended: `${(analysis.cerebrovascular as any)?.coveragePeriod || 90}세`, icon: <TrendingUp className="w-4 h-4 text-indigo-500" /> },
    { label: '가족 간병인 지원', current: '없음', recommended: '선택 가능', icon: <Stethoscope className="w-4 h-4 text-indigo-500" /> },
  ];

  const heartRows = [
    { label: '심혈관 질환 진단비', current: formatAmt(analysis.cardiovascular?.currentAmount || 0), recommended: formatAmt(analysis.cardiovascular?.targetAmount || 30000000), icon: <Heart className="w-4 h-4 text-red-500" /> },
    { label: '심혈관 수술비', current: '미보장', recommended: '포함(추천)', icon: <HeartPulse className="w-4 h-4 text-rose-500" /> },
    { label: '보장 범위 (통합/급성)', current: (analysis as any).cardiovascular?.selectedType || '급성만 보장', recommended: '통합(허혈성 포함)', icon: <ShieldCheck className="w-4 h-4 text-red-500" /> },
    { label: '부정맥/심부전 보장', current: '없음', recommended: '확장 보장', icon: <Stethoscope className="w-4 h-4 text-red-500" /> },
    { label: '질병후유장해(3%~)', current: formatAmt(analysis.postDisability?.currentAmount || 0), recommended: formatAmt(analysis.postDisability?.targetAmount || 30000000), icon: <TrendingUp className="w-4 h-4 text-red-500" /> },
    { label: '납입면제 범위', current: '일반형', recommended: analysis.paymentExemption === 'premium' ? '고급형(범위확대)' : '표준형', icon: <Clock className="w-4 h-4 text-red-500" /> },
  ];

  const standardRows = [
    { label: '일반암 진단비', current: formatAmt(analysis.cancer?.currentAmount || 0), recommended: formatAmt(analysis.cancer?.targetAmount || 0), icon: <ShieldCheck className="w-4 h-4 text-orange-500" /> },
    { label: '뇌혈관 질환', current: formatAmt(analysis.cerebrovascular?.currentAmount || 0), recommended: formatAmt(analysis.cerebrovascular?.targetAmount || 0), icon: <Brain className="w-4 h-4 text-blue-500" /> },
    { label: '심혈관 질환', current: formatAmt(analysis.cardiovascular?.currentAmount || 0), recommended: formatAmt(analysis.cardiovascular?.targetAmount || 0), icon: <Heart className="w-4 h-4 text-red-500" /> },
    { label: '수술비 (질병/상해)', current: formatAmt(analysis.surgery?.currentAmount || 0), recommended: formatAmt(analysis.surgery?.targetAmount || 0), icon: <HeartPulse className="w-4 h-4 text-green-500" /> },
    { label: '질병후유장해(3%~)', current: formatAmt(analysis.postDisability?.currentAmount || 0), recommended: formatAmt(analysis.postDisability?.targetAmount || 0), icon: <Stethoscope className="w-4 h-4 text-purple-500" /> },
    { label: '납입면제 범위', current: '표준형', recommended: analysis.paymentExemption === 'premium' ? '고급형' : '표준형', icon: <Clock className="w-4 h-4 text-gray-500" /> },
  ];

  const comparisonRows = isDental ? dentalRows : (isSilbi ? silbiRows : (isCaregiving ? caregivingRows : (isBrain ? brainRows : (isHeart ? heartRows : standardRows))));

  return (
    <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 transform">
        <ShieldCheck className="w-64 h-64 text-orange-500" />
      </div>

      <div className="relative z-10 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">1:1 상세 비교 분석</h3>
            <p className="text-gray-500 font-bold italic">"가격은 낮추고, 보장은 더 든든하게!"</p>
          </div>
          
          <div className="inline-block bg-blue-50 px-8 py-5 rounded-3xl border border-blue-100 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-default">
             <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">월 예상 절감액</div>
             <div className="flex items-baseline gap-1">
               <span className="text-4xl font-black text-blue-600">{displaySavings.toLocaleString()}</span>
               <span className="text-xl font-bold text-gray-900">원</span>
               <TrendingDown className="w-6 h-6 text-blue-500 ml-2 animate-bounce" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-1 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
           <div className="col-span-4">보장 항목</div>
           <div className="col-span-4 text-center">기존 보험 유지 시 (Stay)</div>
           <div className="col-span-4 text-right">교체 제안 (Switch)</div>
        </div>

        <div className="space-y-4">
          {comparisonRows.map((row, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`grid grid-cols-12 items-center p-6 rounded-[2rem] transition-all border ${
                i % 2 === 0 ? 'bg-gray-50/30 border-gray-100/50' : 'bg-white border-transparent'
              } hover:bg-orange-50/50 hover:shadow-xl hover:border-orange-100 group`}
            >
              <div className="col-span-4 flex items-center gap-4">
                 <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 transition-transform group-hover:rotate-12 group-hover:scale-110">
                   {row.icon}
                 </div>
                 <span className="text-sm font-black text-gray-900">{row.label}</span>
              </div>
              <div className="col-span-4 text-center font-black text-gray-300 text-lg">
                {row.current}
              </div>
              <div className="col-span-4 text-right">
                <span className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-black text-lg shadow-lg inline-block transform transition-all group-hover:-translate-x-2">
                  {row.recommended}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8 border-t border-gray-50 mt-10">
          <p className="text-[10px] font-black text-gray-400 italic tracking-widest uppercase text-center">
            최적화 분석 완료: 매달 {displaySavings.toLocaleString()}원을 자산으로 전환할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
