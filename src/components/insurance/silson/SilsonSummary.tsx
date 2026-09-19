import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowDownCircle, TrendingDown, CheckCircle2, AlertCircle, Scale, PiggyBank, Activity, Clock } from 'lucide-react';
import { SilsonAnalysisResult } from '../../../types/insurance/silson';

interface Props {
  result: SilsonAnalysisResult;
  formatAmount?: (amt: number) => string;
  forceMobile?: boolean;
}

export const SilsonSummary: React.FC<Props> = ({ result, forceMobile }) => {
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
    if (usage === '100to150') return '3단계(보험료 2배)';
    if (usage === '150to300') return '4단계(보험료 3배)';
    return '5단계(보험료 4배)';
  };

  const getExplanationCopy = (type: string) => {
    if (type === '5세대 실손') return `"${type} 전환 시 세대별 가입 조건 및 본인부담 구조에 따른 보험료 절감 효과를 분석했습니다."`;
    if (type === '노후 실손') return `"${type} 전환 시 연령 및 보장 조건에 따른 보험료 지출을 합리적으로 분석했습니다."`;
    return `"${type} 전환 시 세대별 가입 조건 및 본인부담 구조에 따른 보험료 절감 효과를 분석했습니다."`;
  };

  const analysisItems = [
    { label: '실손 의료비 세대', targetId: 'input-silson-fields', val: getGenerationLabel(subType), status: '정상', icon: Activity },
    { label: '자기부담금 비율', targetId: 'input-silson-fields', val: getCoinsuranceLabel(subType), status: '정상', icon: Scale },
    { label: '3대 비급여 한도', targetId: 'input-silson-fields', val: subType === '노후 실손' ? '미보장/제한' : '특약 가입', status: '정상', icon: Shield },
    { label: '도수/MRI 보장', targetId: 'input-silson-fields', val: getCoverageLimitLabel(subType), status: '정상', icon: Activity },
    { label: '보험료 차등제', targetId: 'input-silson-fields', val: subType === '노후 실손' ? '해당없음' : getDifferentialStatus(), status: '정상', icon: TrendingDown },
    { label: '재가입 주기', targetId: 'input-silson-fields', val: getRenewalCycleLabel(subType), status: '정상', icon: Clock },
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
              선택하신 맞춤 플랜의 <br/>
              <span className="text-emerald-400">실손의료비 분석 리포트</span>입니다.
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

      {/* 동일 연령·조건 기준 월 예상 절약 보험료 섹션 */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-4 -translate-y-4">
          <div className="w-48 h-48 rounded-full border-8 border-white"></div>
        </div>
        <div className={`relative z-10 flex ${forceMobile ? 'flex-col items-start' : 'flex-col md:flex-row md:items-center md:justify-between'} gap-8`}>
          <div>
            <span className="text-xs font-black text-emerald-200 uppercase tracking-widest bg-emerald-900/30 px-3 py-1 rounded-full mb-4 inline-block">
              Silson Specialization Analysis
            </span>
            <h4 className="text-2xl font-black mb-2">동일 연령·조건 기준 월 예상 절약 보험료</h4>
            <p className="text-emerald-100 text-sm font-bold opacity-80">
              사용자님의 연령과 세대별 의료 이용 패턴에 맞춘 최적의 실손 플랜으로 전환 시 절감되는 금액입니다.
            </p>
          </div>
          <div className={forceMobile ? 'text-left' : 'text-right'}>
            {savings > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-yellow-300">
                  {savings.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-emerald-100">원 절감</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-white">
                  현재 납입금액 유지/추가 보강 필요
                </span>
              </div>
            )}
            <p className="text-[10px] text-emerald-200 font-bold mt-2 opacity-60 uppercase tracking-widest">
              * 추천 상품 기준 예상 수치
            </p>
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
