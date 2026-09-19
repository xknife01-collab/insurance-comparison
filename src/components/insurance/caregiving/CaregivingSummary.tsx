import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, CheckCircle2, AlertCircle, Scale, PiggyBank, Activity, Clock, Heart, Users } from 'lucide-react';
import { CaregivingAnalysisResult } from '../../../types/insurance/caregiving';

interface Props {
  result: CaregivingAnalysisResult;
  formatAmount?: (amt: number) => string;
  forceMobile?: boolean;
}

export const CaregivingSummary: React.FC<Props> = ({ result, forceMobile }) => {
  const { analysis, premium } = result as any;
  const currentPremium = analysis.monthlyPremium || 0;
  const recommendedPremium = premium || 0;
  const savings = currentPremium - recommendedPremium;

  const analysisItems = [
    { label: '간병 지원 방식', targetId: 'input-caregiving-fields', val: analysis.caregiving?.type === 'support' ? '지원형(파견)' : '사용형(일당)', status: '선택됨', icon: Users, color: 'text-purple-500' },
    { label: '체증형 여부', targetId: 'input-caregiving-fields', val: analysis.caregiving?.isStepUp ? '체증형(가입)' : '기본형', status: analysis.caregiving?.isStepUp ? '우수' : '보통', icon: TrendingUp, color: analysis.caregiving?.isStepUp ? 'text-emerald-500' : 'text-slate-400' },
    { label: '간병인 일당', targetId: 'input-caregiving-fields', val: '최대 15만원', status: '정상', icon: PiggyBank, color: 'text-emerald-500' },
    { label: '요양병원 보장', targetId: 'input-caregiving-fields', val: '최대 3~5만원', status: '정상', icon: Heart, color: 'text-emerald-500' },
    { label: '면책 기간', targetId: 'input-caregiving-fields', val: '90일', status: '고정', icon: Clock, color: 'text-slate-400' },
    { label: '납입 면제', targetId: 'input-caregiving-fields', val: '5대 질병', status: '포함', icon: Shield, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. 간병 서비스 보장 분석 현황 */}
      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)]">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 pl-2">
          <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
          간병 서비스 보장 분석 현황
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analysisItems.map((item, i) => (
            <div key={i} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center gap-3">
              <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm ${item.color}`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-black text-slate-700">{item.val}</p>
              </div>
              <span className={`text-[0.55rem] font-black px-3 py-1 rounded-full ${item.status === '우수' || item.status === '정상' || item.status === '선택됨' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 간병 서비스 상담 리포트 */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-[0.65rem] font-black uppercase tracking-widest mb-6">
              <Heart size={14} /> Caregiving Analysis
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              선택하신 맞춤 플랜의 <br/>
              <span className="text-purple-400">간병 보장 밸런스를 분석</span>했습니다.
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              "방사형 그래프가 둥근 모양일수록 안전한 보장 상태입니다."
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 w-full max-w-sm">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">보험료 효율성</p>
                  <p className="text-4xl font-black text-purple-400">73 <span className="text-lg text-slate-500">점</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] font-black text-red-500 uppercase">긴급 보강 필요</p>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3].map(s => <div key={s} className="w-2 h-2 rounded-full bg-red-500" />) }
                    {[4,5].map(s => <div key={s} className="w-2 h-2 rounded-full bg-white/10" />)}
                  </div>
                </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '73%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-purple-500"
                />
              </div>
              <p className="text-[0.7rem] text-slate-400 font-bold mt-4 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500" />
                긴급 보강 필요 항목: 인건비 상승 대비(체증형)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 동일 연령·조건 기준 월 예상 절약 보험료 섹션 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-4 -translate-y-4">
          <div className="w-48 h-48 rounded-full border-8 border-white"></div>
        </div>
        <div className={`relative z-10 flex ${forceMobile ? 'flex-col items-start' : 'flex-col md:flex-row md:items-center md:justify-between'} gap-8`}>
          <div>
            <span className="text-xs font-black text-purple-200 uppercase tracking-widest bg-purple-900/30 px-3 py-1 rounded-full mb-4 inline-block">
              Caregiving Specialization Analysis
            </span>
            <h4 className="text-2xl font-black mb-2">동일 연령·조건 기준 월 예상 절약 보험료</h4>
            <p className="text-purple-100 text-sm font-bold opacity-80">
              사용자님의 연령과 상황에 맞춘 최적의 간병인 지원/사용일당 플랜으로 전환 시 절감되는 금액입니다.
            </p>
          </div>
          <div className={forceMobile ? 'text-left' : 'text-right'}>
            {savings > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-yellow-300">
                  {savings.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-purple-100">원 절감</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-white">
                  현재 납입금액 유지/추가 보강 필요
                </span>
              </div>
            )}
            <p className="text-[10px] text-purple-200 font-bold mt-2 opacity-60 uppercase tracking-widest">
              * 추천 상품 기준 예상 수치
            </p>
          </div>
        </div>
      </div>

      {/* Optimized Protection Strategies Footer */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center border border-white/5">
        <p className="text-purple-400 font-black text-sm uppercase tracking-[0.2em] mb-2">Optimized Protection Strategies</p>
        <p className="text-slate-400 text-xs font-medium">당신에게 가장 적합한 간병 보장 최적화 전략이 수립되었습니다.</p>
      </div>
    </div>
  );
};
