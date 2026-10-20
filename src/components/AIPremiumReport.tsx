import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, ShieldAlert, Zap } from 'lucide-react';
import { InsuranceAnalysis } from '../types/insurance';
import { getComplianceStatSource } from '../utils/complianceReportSources';
import { generateComplianceReportData } from '../utils/aiReportTemplates';

interface AIPremiumReportProps {
  analysis: InsuranceAnalysis;
  deficiencies: string[];
  scores: {
    cancerScore: number;
    cerebrovascularScore: number;
    cardiovascularScore: number;
    totalScore: number;
  };
  forceMobile?: boolean;
}

export const AIPremiumReport: React.FC<AIPremiumReportProps> = ({ analysis, deficiencies, scores, forceMobile }) => {
  const category = analysis.selectedCategory ?? '';
  const { riskTitle, riskPercent, riskStats, goodPoints, badPoints, actionTips } = generateComplianceReportData(category, analysis, deficiencies);
  const statSource = getComplianceStatSource(category);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-gradient-to-br from-[#120731] via-[#1a0b47] to-slate-950 text-white rounded-[3.5rem] p-8 md:p-14 shadow-[0_50px_100px_-20px_rgba(12,3,43,0.4)] border border-[#2b1767]/60 relative overflow-hidden"
    >
      {/* 백그라운드 미세 파스텔 그라데이션 광원 */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 헤더 AI 배지 */}
      <div className={`flex flex-col ${forceMobile ? 'flex-col items-start' : 'md:flex-row md:items-center'} justify-between gap-6 mb-10 pb-8 border-b border-[#2b1767]/60 relative z-10`}>
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-purple-500/20 text-purple-300 rounded-full text-sm md:text-base font-black tracking-wide border border-purple-500/30 shadow-sm">
            <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />
            <span className="text-orange-400">선택 맞춤 플랜 AI 1:1 정밀분석 리포트</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            {riskTitle}
          </h3>

          {/* 심의 필수 요건: 폰트를 키워 제목 밑에 공식 통계 출처(자료명, 발표기관, 발표일) 명시 */}
          <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs md:text-sm text-gray-200 shadow-sm font-medium">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/40 text-purple-200 font-black text-[11px] uppercase tracking-wider border border-purple-400/30">
              공인 통계 출처
            </span>
            <span className="font-bold text-white">{statSource.title}</span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-gray-300">발표기관: <strong className="text-purple-200 font-bold">{statSource.publisher}</strong></span>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-gray-300">발표일: <strong className="text-purple-200 font-bold">{statSource.publishDate}</strong></span>
          </div>
        </div>

        {/* 실시간 진단 상태 배지 */}
        <div className="flex-shrink-0 flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-4 rounded-3xl text-white shadow-lg shadow-black/25 border border-white/10">
          <div className="w-3 h-3 rounded-full bg-purple-400 animate-ping" />
          <div className="text-left">
            <span className="text-[10px] text-gray-400 font-bold block">ANALYSIS RUNTIME</span>
            <span className="text-sm font-black text-purple-300 tracking-tighter">실시간 분석 완료</span>
          </div>
        </div>
      </div>

      {/* 리포트 콘텐츠 그리드 */}
      <div className={`grid ${forceMobile ? 'grid-cols-1' : 'lg:grid-cols-12'} gap-10 md:gap-14 relative z-10`}>
        
        {/* 왼쪽: 질병 통계 및 리스크 요인 */}
        <div className={`${forceMobile ? 'col-span-1' : 'lg:col-span-5'} space-y-8 bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-inner flex flex-col justify-between`}>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-black text-gray-200">생애주기 통계적 위험 요인</h4>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed font-medium">
              {riskStats}
            </p>
          </div>

          <div className="border-t border-white/10 pt-6 mt-8 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-gray-400">
              <span>동일 성별/연령대 건강 취약 리스크 지표</span>
              <span className="text-purple-400 font-black">{riskPercent}% 위험 노출</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${riskPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
              />
            </div>
            <p className="text-xs text-purple-200/90 font-bold leading-normal">
              * 출처: {statSource.title} ({statSource.publisher}, {statSource.publishDate} 공표 기준)
            </p>
          </div>
        </div>

        {/* 오른쪽: AI 상세 진단 (Good, Bad, Solution) */}
        <div className={`${forceMobile ? 'col-span-1' : 'lg:col-span-7'} space-y-8`}>
          
          {/* Good & Bad 그리드 */}
          <div className={`grid ${forceMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
            {/* Good */}
            <div className="bg-emerald-950/20 backdrop-blur-md border border-emerald-900/30 p-8 rounded-[2.5rem] space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <CheckCircle className="w-5 h-5 fill-current bg-slate-900 rounded-full" />
                <h5 className="font-black text-sm uppercase tracking-wider">현행 설계 강점 (Good)</h5>
              </div>
              <ul className="space-y-3 text-xs text-gray-300 font-medium leading-relaxed list-disc list-inside">
                {goodPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Bad */}
            <div className="bg-rose-950/20 backdrop-blur-md border border-rose-900/30 p-8 rounded-[2.5rem] space-y-4">
              <div className="flex items-center gap-2.5 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h5 className="font-black text-sm uppercase tracking-wider">긴급 보강 요소 (Bad)</h5>
              </div>
              <ul className="space-y-3 text-xs text-gray-300 font-medium leading-relaxed list-disc list-inside">
                {badPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Plan (보완 솔루션) */}
          <div className="bg-[#1c0d3e]/60 backdrop-blur-md border border-[#2b1767]/50 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.04]">
              <Zap className="w-32 h-32 text-purple-400" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-lg font-black text-gray-200">AI 정밀 솔루션 가이드</h4>
            </div>

            <ul className="space-y-4 relative z-10">
              {actionTips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-sm font-semibold text-gray-300 leading-relaxed">
                  <span className="text-purple-300 font-black">Step {idx + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </motion.section>
  );
};
