import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, CheckCircle2, Coins, Star, AlertTriangle, Sparkles, Building2, Wallet, UserCheck, ShieldAlert } from 'lucide-react';

interface Props {
  result: {
    scores: {
      cancerScore: number;          // 대출상환 안전성 매핑
      cerebrovascularScore: number; // 신용 할인 최적성 매핑
      cardiovascularScore: number;  // 특약 구성 종합도 매핑
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const CreditSummary: React.FC<Props> = ({ result }) => {
  const { scores, deficiencies, analysis } = result;
  const creditOpts = analysis?.credit || {
    loanType: 'mortgage',
    loanAmount: 100000000,
    loanPeriod: 10,
    creditBureau: 'nice',
    creditScore: 850,
    hasIllnessRider: true,
    hasDisabilityRider: true
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-emerald-500 to-teal-400';
    if (score >= 70) return 'bg-gradient-to-r from-blue-500 to-indigo-400';
    return 'bg-gradient-to-r from-rose-500 to-orange-400';
  };

  const formatAmount = (amt: number) => {
    if (amt >= 100000000) {
      const eok = Math.floor(amt / 100000000);
      const remaining = amt % 100000000;
      if (remaining > 0) {
        return `${eok}억 ${(remaining / 10000).toLocaleString()}만원`;
      }
      return `${eok}억원`;
    }
    return `${(amt / 10000).toLocaleString()}만원`;
  };

  const getLoanLabel = (type: string) => {
    switch (type) {
      case 'mortgage': return '주택담보대출';
      case 'jeonse': return '전세자금대출';
      case 'business': return '개인사업자대출';
      default: return '개인신용대출';
    }
  };

  const getLoanIcon = (type: string) => {
    switch (type) {
      case 'mortgage': return <Building2 className="w-7 h-7 text-emerald-400" />;
      case 'jeonse': return <Wallet className="w-7 h-7 text-emerald-400" />;
      case 'business': return <UserCheck className="w-7 h-7 text-emerald-400" />;
      default: return <Coins className="w-7 h-7 text-emerald-400" />;
    }
  };

  const loanAmount = creditOpts.loanAmount || 100000000;
  const loanPeriod = creditOpts.loanPeriod || 10;
  const creditBureau = creditOpts.creditBureau || 'nice';
  const creditScore = creditOpts.creditScore || 850;
  const hasIllnessRider = creditOpts.hasIllnessRider;
  const hasDisabilityRider = creditOpts.hasDisabilityRider;

  // 신용점수 기반 할인 요율 재산출 (엔진 동기화)
  let discountRate = 0;
  if (creditScore >= 900) discountRate = 10;
  else if (creditScore >= 800) discountRate = 8;
  else if (creditScore >= 700) discountRate = 5;
  else if (creditScore >= 600) discountRate = 3;

  return (
    <div className="space-y-12 text-left">
      
      {/* ── 상단 웅장한 대출 리포트 헤더 & 종합 점수 ── */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* 왼쪽: 대출 상환 리스크 리포트 카드 */}
        <div className="lg:col-span-2 bg-slate-950 rounded-[3.5rem] p-10 md:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck size={220} className="text-emerald-400" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-center shadow-lg">
                {getLoanIcon(creditOpts.loanType)}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Credit Debt-Erasure Report</span>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-0.5">
                  {getLoanLabel(creditOpts.loanType)} 상환 안심 분석 리포트
                </h3>
              </div>
            </div>

            {/* 핵심 가치 제안 배너 */}
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles size={18} />
                <span className="text-xs font-black uppercase tracking-wider">채무 전액 면제 & 주거 환경 보존</span>
              </div>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">
                차주 본인에게 유고 발생 시, 남겨진 유가족에게 빚이 상속되거나 담보 주택이 경매 처리되는 것을 막고, 
                <strong> 보험회사가 즉시 남은 대출금 {formatAmount(loanAmount)}을 대신 전액 상환</strong>하여 주거 안정성을 든든하게 수호합니다.
              </p>
            </div>

            {/* 세부 평가 점수 바 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/5">
              {[
                { label: '대출상환 안전성', targetId: 'input-credit-fields', val: `한도 ${formatAmount(loanAmount)}`, score: scores.cancerScore },
                { label: '신용할인 최적도', targetId: 'input-credit-fields', val: `${creditBureau.toUpperCase()} ${discountRate}% 할인`, score: scores.cerebrovascularScore },
                { label: '특약 구성 종합도', targetId: 'input-credit-fields', val: hasIllnessRider && hasDisabilityRider ? '종합안심 가입' : '일부 위험 노출', score: scores.cardiovascularScore },
                { label: '보장 만기 적절성', targetId: 'input-credit-fields', val: `${loanPeriod}년 보장`, score: loanPeriod >= 10 ? 95 : 55 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 tracking-wider uppercase">{item.label}</p>
                  <p className="text-xs font-black text-white">{item.val}</p>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      className={`h-full ${getProgressColor(item.score)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 종합 상환 신뢰도 점수 카드 */}
        <div className="bg-emerald-600 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(16,185,129,0.3)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={220} fill="currentColor" />
          </div>
          <div className="relative z-10 text-left">
            <span className="text-emerald-200 font-black text-[10px] uppercase tracking-[0.2em] mb-4 block">Debt Safety Index</span>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full backdrop-blur-md border border-white/10">
              <CheckCircle2 size={16} className="text-emerald-200" />
              <span className="text-[11px] font-black">
                {scores.totalScore >= 85 ? '안전한 대출 자산 보호망 가동 중' : scores.totalScore >= 65 ? '보통 수준의 대출 안전도' : '대출상환 공백 리스크 위험 수준'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── 대출금 대비 보장 공백 시각화 ── */}
      <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-6">
        <h4 className="text-lg font-black text-slate-800">
          대출 잔액 vs 안심 보장 범위 시뮬레이션
        </h4>
        
        <div className="space-y-4 pt-2">
          {/* 대출 원금 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>대출 원금 및 상환 책임</span>
              <span className="text-slate-800">{formatAmount(loanAmount)}</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full relative overflow-hidden">
              <div className="h-full bg-slate-800 rounded-full w-full" />
            </div>
          </div>

          {/* 안심 보험 보장 범위 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>채무 대위변제 안심 커버리지</span>
              <span className="text-emerald-600 font-black">최대 {formatAmount(loanAmount)} (100% 매칭)</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full relative overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-full" />
            </div>
          </div>

          {/* 특약 가입 시 커버력 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>질병 및 장해 연체 예방 커버리지 (암/뇌/심장/장해)</span>
              <span>{hasIllnessRider && hasDisabilityRider ? (
                <span className="text-emerald-600 font-black">종합 보장 활성화</span>
              ) : (
                <span className="text-rose-500 font-black">비활성화 (가계 이자 연체 노출)</span>
              )}</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full relative overflow-hidden">
              <div className={`h-full rounded-full transition-all ${hasIllnessRider && hasDisabilityRider ? 'bg-emerald-500 w-full' : 'bg-rose-500 w-[20%]'}`} />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-bold leading-relaxed bg-slate-50 p-4 rounded-2xl">
          * 사망 보장만 가입한 경우 차주가 중증 질병 투병으로 소득을 상실해도 남은 원금에 대해 대출금 완납이 불가합니다. 
          따라서 <strong>종합안심 특약(암, 뇌출혈, 심근경색증 진단 및 50% 후유장해 완납)</strong> 가입을 적극 권장합니다.
        </p>
      </div>

      {/* ── 진단된 신용 상환 공백 및 개선 권장사항 ── */}
      {deficiencies.length > 0 && (
        <div className="bg-rose-50/40 border border-rose-100 rounded-[3.5rem] p-8 md:p-12 space-y-6">
          <h4 className="text-lg font-black text-rose-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            진단된 대출상환 위험 공백 및 신용 등급 보완 권고 ({deficiencies.length}건)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deficiencies.map((def, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-rose-100/50 shadow-sm">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shrink-0 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">{def}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default CreditSummary;
