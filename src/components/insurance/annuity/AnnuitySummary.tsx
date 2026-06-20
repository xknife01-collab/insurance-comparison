import { scrollToInputAndHighlight } from '../../../utils/scrollHelper';
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, CheckCircle2, PiggyBank, Star, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  result: {
    scores: {
      cancerScore: number;          // taxScore 매핑
      cerebrovascularScore: number; // savingsScore 매핑
      cardiovascularScore: number;  // adequacyScore 매핑
      totalScore: number;
    };
    efficiency: number;
    deficiencies: string[];
    recommendations: any;
    analysis: any;
  };
}

export const AnnuitySummary: React.FC<Props> = ({ result }) => {
  const { scores, efficiency, deficiencies } = result;
  const { analysis } = result;
  const annuityOpts = analysis?.annuity || {
    annuityType: 'savings',
    monthlyPremium: 300000,
    paymentPeriod: 10,
    commencementAge: 60,
    annualIncome: 50000000,
    hasIrp: false,
    receivingPeriod: 20
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

  const isSavings = annuityOpts.annuityType === 'savings';
  const taxCreditText = (annuityOpts.annualIncome || 50000000) > 55000000 ? '13.2% 세액공제 대상자' : '16.5% 세액공제 대상자';

  return (
    <div className="space-y-12 text-left">
      {/* 1. Header: Breed Card & Score Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 md:p-12 border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <PiggyBank size={200} className="text-blue-500" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <PiggyBank size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {isSavings ? '세액공제형 연금저축' : '비과세형 일반연금'} 자산 분석 리포트
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  가입 연령: 만 {analysis.age || 35}세 · 납입료: 월 {annuityOpts.monthlyPremium.toLocaleString()}원 · {annuityOpts.paymentPeriod}년납
                </p>
              </div>
            </div>

            {/* 맞춤형 연말정산 정보 배너 */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/50 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-black text-blue-800">연금 세액 설계 진단</p>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                  {isSavings ? (
                    <>
                      고객님은 연간 총급여 세부 구간 기준 <span className="text-blue-600 font-black">{taxCreditText}</span>입니다. 현재 설정된 {annuityOpts.monthlyPremium.toLocaleString()}원 기준 연간 예상 세액 환급금은 약 <span className="text-blue-600 font-black">{Math.round(Math.min(annuityOpts.monthlyPremium * 12, annuityOpts.hasIrp ? 9000000 : 6000000) * (taxCreditText.includes('13.2%') ? 0.132 : 0.165)).toLocaleString()}원</span>입니다.
                    </>
                  ) : (
                    <>
                      일반 연금보험(비과세) 상품을 선택하여 납입 중 연말정산 세액공제는 제외됩니다. 대신 10년 이상 가입 요건 충족 시 은퇴 후 연금 수령 차익에 대한 **소득세(15.4%)가 전액 비과세** 혜택으로 매칭됩니다.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 세부 점수 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
              {[
                { label: '세액공제 최적성', targetId: 'input-annuity-type', val: isSavings ? `${Math.round((Math.min(annuityOpts.monthlyPremium * 12, 6000000) / 6000000) * 100)}% 만족` : '비과세 대상', score: scores.cancerScore },
                { label: '소득 대비 저축 비중', targetId: 'input-annuity-premium', val: `${((annuityOpts.monthlyPremium * 12 / (annuityOpts.annualIncome || 50000000)) * 100).toFixed(1)}% 수준`, score: scores.cerebrovascularScore },
                { label: '노후 소득 대체율', targetId: 'input-annuity-commencement', val: '부부 최저생계비 대비', score: scores.cardiovascularScore },
                { label: 'IRP 연동 설계', targetId: 'input-annuity-irp', val: annuityOpts.hasIrp ? '통합 900만 공제' : '연금 단독 600만', score: annuityOpts.hasIrp ? 95 : 60 },
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
        <div className="bg-blue-600 rounded-[3.5rem] p-12 text-white shadow-[0_30px_70px_-20px_rgba(37,99,235,0.3)] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
            <Zap size={200} fill="currentColor" />
          </div>
          <div className="relative z-10 text-left">
            <p className="text-blue-100 font-black text-[0.65rem] uppercase tracking-[0.3em] mb-4">Pension Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black tracking-tighter">{scores.totalScore}</span>
              <span className="text-2xl font-bold opacity-80">점</span>
            </div>
          </div>
          <div className="relative z-10 pt-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
              <CheckCircle2 size={16} className="text-blue-200" />
              <span className="text-xs font-bold">
                {scores.totalScore >= 85 ? '아주 든든하게 은퇴를 준비 중입니다!' : scores.totalScore >= 65 ? '보통 수준의 노후 저축 상태입니다.' : '연금 자산 리모델링 보강이 시급합니다.'}
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
export default AnnuitySummary;
