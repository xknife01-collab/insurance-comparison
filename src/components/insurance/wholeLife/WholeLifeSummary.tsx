import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, CheckCircle2, Award, Star, AlertCircle, TrendingUp } from 'lucide-react';

interface Props {
  result: {
    scores: {
      cancerScore: number;          // deathBenefitScore 매핑
      cerebrovascularScore: number; // lowRefundScore (저해지) 매핑
      cardiovascularScore: number;  // structureScore 매핑
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const WholeLifeSummary: React.FC<Props> = ({ result }) => {
  const { scores, deficiencies, analysis } = result;
  const wholeLifeOpts = analysis?.wholeLife || {
    objective: 'family',
    paymentPeriod: 10,
    deathBenefit: 100000000,
    refundType: 'low',
    isStepUp: false
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-indigo-500';
    return 'bg-rose-500';
  };

  const isLowRefund = wholeLifeOpts.refundType === 'low';
  const isStepUp = wholeLifeOpts.isStepUp || false;

  const getObjectiveText = (obj: string) => {
    if (obj === 'family') return '유가족 생활비 보장';
    if (obj === 'inheritance') return '상속세 재원 마련';
    return '목돈 마련 및 연금 전환';
  };

  const formatAmt = (amt: number) => {
    if (amt >= 100000000) return `${(amt / 100000000).toFixed(0)}억 원`;
    return `${(amt / 10000).toLocaleString()}만 원`;
  };

  return (
    <div className="space-y-12 text-left">
      {/* 1. Header: Breed Card & Score Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <Award size={200} className="text-indigo-500" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Award size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {getObjectiveText(wholeLifeOpts.objective)} 종신 자산 분석 리포트
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  가입 연령: 만 {analysis.age || 35}세 · 사망보험금: {formatAmt(wholeLifeOpts.deathBenefit)} · {wholeLifeOpts.paymentPeriod}년납
                </p>
              </div>
            </div>

            {/* 저해지 환급 리스크 경고/체증형 혜택 배너 */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-indigo-800">종신 보장 설계 세부 진단</p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  {isLowRefund ? (
                    <>
                      고객님은 일반 상품보다 동일 보장료가 <span className="text-indigo-600 font-black">15~20% 저렴한 저해지형</span>을 가입 설계하셨습니다. 완납 후 10년 환급률은 우수하나, 납입 완료 전 해지 시 원금 손실이 막대하므로 <span className="text-rose-600 font-black">철저히 만기 유지를 강제</span>하셔야 합니다.
                    </>
                  ) : (
                    <>
                      일반형 구조로 중도 해지 시에도 비례형 환급금을 보존받아 유연합니다. 단, 월 납입 보험료가 저해지형 대비 다소 고가로 산출되므로 가계 소득 대비 적정선인지 확인해 주세요.
                    </>
                  )}
                  {isStepUp && (
                    <span className="block mt-1 font-black text-indigo-700">
                      💡 물가상승 방어(체증형) 옵션 설정으로, 만 60세부터 보장 금액이 매년 5%씩 점진적으로 불어납니다.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {[
                { label: '사망금 적정성', val: `${formatAmt(wholeLifeOpts.deathBenefit)} 설정`, score: scores.cancerScore },
                { label: '환급형 효율성', val: isLowRefund ? '저해지형 특약 반영' : '일반환급형 반영', score: scores.cerebrovascularScore },
                { label: '보장구조 최적성', val: isStepUp ? '체증형(물가대응)' : '기본고정형', score: scores.cardiovascularScore },
                { label: '소득대비 납입적성', val: '월 보험료 비율 분석', score: 85 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-sm font-black text-slate-800">{item.val}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
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

        {/* 종합 점수 카드 */}
        <div className="bg-indigo-600 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(79,70,229,0.3)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
          </div>
          <div className="relative z-10 text-left">
            <p className="text-indigo-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Whole Life Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="text-indigo-200" />
              <span className="text-xs font-bold">
                {scores.totalScore >= 85 ? '아주 합리적으로 사망자산을 준비 중입니다!' : scores.totalScore >= 65 ? '보통 수준의 종신보장 상태입니다.' : '종신 리스크 및 연금 연계 진단이 시급합니다.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 부족한 보장 공백 안내 */}
      {deficiencies.length > 0 && (
        <div className="bg-rose-50/50 border border-rose-100 rounded-[2.5rem] p-8 md:p-10 space-y-4">
          <h4 className="text-base font-black text-rose-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-rose-500 fill-rose-500" />
            진단된 보장 리모델링 공백 ({deficiencies.length}건)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deficiencies.map((def, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-rose-100/50">
                <span className="w-2 h-2 bg-rose-500 rounded-full shrink-0" />
                <span className="text-xs font-bold text-slate-700">{def}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default WholeLifeSummary;
