import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowDownCircle, TrendingDown, CheckCircle2, AlertCircle, Scale, PiggyBank, Activity, Clock } from 'lucide-react';
import { SilsonAnalysisResult } from '../../../types/insurance/silson';

interface Props {
  result: SilsonAnalysisResult;
}

export const SilsonSummary: React.FC<Props> = ({ result }) => {
  const { analysis, premium, companyName } = result as any;
  const currentPremium = analysis.monthlyPremium || 0;
  const recommendedPremium = premium || 0;
  const savings = currentPremium - recommendedPremium;
  const isSwitchBeneficial = savings > 10000;

  const subType = analysis.silson?.subType || '4세대 실손';

  const getGenerationLabel = (type: string) => {
    if (type === '5세대 실손') return '5세대';
    if (type === '노후 실손') return '노후실손';
    return '4세대';
  };

  const getCoinsuranceLabel = (type: string) => {
    if (type === '5세대 실손') return '급여 20%/중증 30%/비중증 50%';
    if (type === '노후 실손') return '자기부담 30만/통원 3만';
    return '급여 20% / 비급여 30%';
  };

  const getCoverageLimitLabel = (type: string) => {
    if (type === '5세대 실손') return '연간 1,000만 한도';
    if (type === '노후 실손') return '미보장/제한';
    return '연간 300~350만';
  };

  const getRenewalCycleLabel = (type: string) => {
    if (type === '5세대 실손') return '5년';
    if (type === '노후 실손') return '3년';
    return '5년';
  };

  const getDifferentialStatus = () => {
    const usage = analysis.silson?.nonReimbursableUsage || 'under100';
    if (usage === 'none') return '1단계(할인)';
    if (usage === 'under100') return '2단계(정상)';
    if (usage === '100to150') return '3단계(100% 할증)';
    if (usage === '150to300') return '4단계(200% 할증)';
    return '5단계(300% 할증)';
  };

  const getExplanationCopy = (type: string) => {
    if (type === '5세대 실손') return `"${type} 전환 시 보험료를 최대 75%까지 절감할 수 있는지 분석했습니다."`;
    if (type === '노후 실손') return `"${type} 전환 시 보험료 지출을 합리적으로 절감할 수 있는지 분석했습니다."`;
    return `"${type} 전환 시 보험료를 최대 70%까지 절감할 수 있는지 분석했습니다."`;
  };

  const analysisItems = [
    { label: '실손 의료비 세대', val: getGenerationLabel(subType), status: '정상', icon: Activity },
    { label: '자기부담금 비율', val: getCoinsuranceLabel(subType), status: '정상', icon: Scale },
    { label: '3대 비급여 한도', val: subType === '노후 실손' ? '미보장/제한' : '특약 가입', status: '정상', icon: Shield },
    { label: '도수/MRI 보장', val: getCoverageLimitLabel(subType), status: '정상', icon: Activity },
    { label: '보험료 차등제', val: subType === '노후 실손' ? '해당없음' : getDifferentialStatus(), status: '정상', icon: TrendingDown },
    { label: '재가입 주기', val: getRenewalCycleLabel(subType), status: '정상', icon: Clock },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. 정밀 분석 현황 대시보드 */}
      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)]">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 pl-2">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          실손 의료비 정밀 분석 현황
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analysisItems.map((item, i) => (
            <div key={i} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-black text-slate-700">{item.val}</p>
              </div>
              <span className="text-[0.55rem] font-black px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 상담 리포트 메인 카드 */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[0.65rem] font-black uppercase tracking-widest mb-6">
              <Shield size={14} /> Comprehensive Report
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              당신의 실손 의료비 <br/>
              <span className="text-emerald-400">상담 리포트</span>입니다.
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              {getExplanationCopy(subType)}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 w-full max-w-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">실손 보험 가성비</p>
                  <p className="text-4xl font-black text-emerald-400">95.0 <span className="text-lg text-slate-500">점</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] font-black text-emerald-500 uppercase">보장 완벽</p>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(s => <div key={s} className="w-2 h-2 rounded-full bg-emerald-500" />)}
                  </div>
                </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '95%' }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className="h-full bg-emerald-500"
                />
              </div>
              <p className="text-[0.7rem] text-slate-400 font-bold mt-4 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                실손 보장이 안정적입니다!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 월 예상 절감액 */}
      <div className="bg-emerald-50 rounded-[3rem] p-10 border border-emerald-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <PiggyBank size={20} />
              <h4 className="text-xl font-black">월 예상 절감액</h4>
            </div>
            <p className="text-[0.65rem] text-slate-400 font-bold mb-6 uppercase tracking-widest pl-7">Price Optimization Analysis</p>
            <div className="flex flex-col gap-1 pl-7">
              <p className="text-5xl font-black text-emerald-600">
                {savings > 0 ? `-${savings.toLocaleString()}` : '0'} <span className="text-2xl">원</span>
              </p>
              <p className="text-sm font-bold text-emerald-600/60">매달 고정 지출을 이만큼 절약할 수 있습니다.</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-xl max-w-md w-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               <TrendingDown size={80} className="text-emerald-500" />
            </div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 mb-1">최적화 분석 완료</p>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  불필요한 보험료 지출을 줄여 매달 <span className="text-emerald-600 font-black">{savings.toLocaleString()}원</span>을 가계 자산으로 전환하는 것을 추천합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {subType === '5세대 실손' && (
        <div className="grid grid-cols-1 gap-6">
          {analysis.silson?.pregnancyCover === 'yes' && (
            <div className="bg-blue-50 border border-blue-100 rounded-[3rem] p-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 mb-1">임신·출산 및 발달장애 보장 추가 매칭</p>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  5세대 실손은 기존 실손에서 보장되지 않던 임신성 빈혈, 분만 비용 등 **임신·출산 급여 의료비**와 소아 **발달장애 급여 의료비**를 새로이 보장합니다. 요청하신 보장 니즈에 맞춰 최적으로 매칭되었습니다.
                </p>
              </div>
            </div>
          )}

          {analysis.silson?.frequentNonSevere === 'yes' && (
            <div className="bg-amber-50 border border-amber-100 rounded-[3rem] p-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-amber-800 mb-1">⚠️ 비중증 비급여(도수치료/비급여 주사 등) 자주 이용 시 주의</p>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  도수치료, 비급여 주사, MRI 등 비중증 비급여 이용이 빈번한 경우, 5세대 실손은 이들의 **자기부담률이 50%로 설정**되고 연간 한도가 **1,000만 원으로 제한**되므로, 기존 실손(4세대 30% 등)을 유지하는 것이 더 이득일 수 있습니다. 전환 시 면밀히 대조하시길 권장합니다.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
