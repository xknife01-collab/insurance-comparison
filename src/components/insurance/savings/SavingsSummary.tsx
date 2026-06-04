import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, CheckCircle2, PiggyBank, Star, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  result: {
    scores: {
      cancerScore: number;          // taxBenefitScore 매핑
      cerebrovascularScore: number; // rateStabilityScore 매핑
      cardiovascularScore: number;  // feeEfficiencyScore 매핑
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const SavingsSummary: React.FC<Props> = ({ result }) => {
  const { scores, efficiency, deficiencies } = result;
  const { analysis } = result;
  const savingsOpts = analysis?.savingsGeneral || {
    savingType: 'installment',
    monthlyPremium: 300000,
    paymentPeriod: 5,
    maintenancePeriod: 10,
    savingsObjective: 'wealth',
    hasUniversal: true
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    return 'bg-rose-500';
  };

  const isInstallment = savingsOpts.savingType === 'installment';
  const payYears = savingsOpts.paymentPeriod || 5;
  const keepYears = savingsOpts.maintenancePeriod || 10;
  const premium = savingsOpts.monthlyPremium || 300000;

  // 비과세 충족 여부 체크
  const isTaxExempt = isInstallment
    ? (payYears >= 5 && keepYears >= 10 && premium <= 1500000)
    : (keepYears >= 10 && premium <= 100000000);

  // 예상 이자소득세 절세액 계산 (간이 공식: 연이율 3.0% 기준 복리 이자의 15.4% 수준)
  const totalMonths = keepYears * 12;
  const payMonths = payYears * 12;
  const totalPrincipal = isInstallment ? premium * payMonths : premium;
  
  // CM 평균 이율 3.0% 기준 시뮬레이션 간략화
  const declaredRate = isInstallment ? 0.0315 : 0.0290;
  const feeRate = isInstallment ? 0.035 : 0.030;
  const monthlyRate = declaredRate / 12;
  let accumulated = isInstallment ? 0 : premium * (1 - feeRate);

  for (let m = 0; m < totalMonths; m++) {
    if (isInstallment) {
      const isPaying = m < payMonths;
      const addAmount = isPaying ? premium * (1 - feeRate) : 0;
      accumulated = (accumulated + addAmount) * (1 + monthlyRate);
    } else {
      accumulated = accumulated * (1 + monthlyRate);
    }
  }

  const insuranceInterest = Math.max(0, accumulated - totalPrincipal);
  const savedTax = isTaxExempt ? Math.round(insuranceInterest * 0.154) : 0;

  return (
    <div className="space-y-12 text-left">
      {/* 1. Header: Breed Card & Score Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <PiggyBank size={200} className="text-emerald-500" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <PiggyBank size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {isInstallment ? '적립식 비과세 저축보험' : '거치식 일시납 저축보험'} 자산 분석 리포트
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  가입 연령: 만 {analysis.age || 35}세 · {isInstallment ? `납입료: 월 ${premium.toLocaleString()}원 · ${payYears}년납` : `거치금: 일시납 ${premium.toLocaleString()}원`} · {keepYears}년만기 유지
                </p>
              </div>
            </div>

            {/* 맞춤형 비과세 정보 배너 */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-emerald-800">이자소득 비과세 혜택 분석</p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  {isTaxExempt ? (
                    <>
                      고객님은 현재 비과세 충족 조건을 완벽하게 만족하고 계십니다! 만기 시점 예상 적립금 {Math.round(accumulated / 10000).toLocaleString()}만 원에 대한 이자 소득세(15.4%)가 전액 면제되며, 예상되는 절세 규모는 약 <span className="text-emerald-600 font-black">{savedTax.toLocaleString()}원</span>입니다.
                    </>
                  ) : (
                    <>
                      현재 설정된 저축 조건은 비과세 세법 기준(적립식: 5년 이상 납입, 10년 이상 유지, 월 150만원 이하 / 일시납: 10년 이상 유지, 총 1억 이하)에 어긋나 만기 시점에 **이자소득세 15.4%가 일반과세**됩니다. 조건 수정을 권장합니다.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {[
                { label: '비과세 혜택 최적성', val: isTaxExempt ? '비과세 100% 매칭' : '일반과세 대상', score: scores.cancerScore },
                { label: '이율 안전성 점수', val: `공시이율 ${(declaredRate*100).toFixed(2)}%`, score: scores.cerebrovascularScore },
                { label: '사업비 효율 점수', val: `수수료 ${(feeRate*100).toFixed(1)}% 수준`, score: scores.cardiovascularScore },
                { label: '유니버셜 기능성', val: savingsOpts.hasUniversal ? '기능 보유 (200%)' : '미보유 (100%)', score: savingsOpts.hasUniversal ? 95 : 50 },
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
        <div className="bg-emerald-600 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(16,185,129,0.3)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
          </div>
          <div className="relative z-10 text-left">
            <p className="text-emerald-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Savings Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="text-emerald-200" />
              <span className="text-xs font-bold">
                {scores.totalScore >= 85 ? '아주 현명하게 자산을 굴리는 중입니다!' : scores.totalScore >= 65 ? '보통 수준의 저축보험 활용 상태입니다.' : '적립식 비과세 자산 재설계가 시급합니다.'}
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
            진단된 자산 리모델링 공백 ({deficiencies.length}건)
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

export default SavingsSummary;
