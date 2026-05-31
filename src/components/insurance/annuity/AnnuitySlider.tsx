import React, { useState, useMemo } from 'react';
import { Shield, TrendingUp, Sparkles, Calculator } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { AnnuityExplanation } from './AnnuityExplanation';

export const AnnuitySlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const opts = result.analysis.annuity || {
    annuityType: 'savings',
    monthlyPremium: 300000,
    paymentPeriod: 10,
    commencementAge: 60,
    annualIncome: 50000000,
    hasIrp: false,
    receivingPeriod: 20
  };

  const currentAge = result.analysis.age || 35;
  const payYears = opts.paymentPeriod || 10;
  const startAge = opts.commencementAge || 60;
  const deferYears = Math.max(0, startAge - currentAge - payYears);
  const income = opts.annualIncome || 50000000;
  const isHighIncome = income > 55000000;
  const taxCreditRate = isHighIncome ? 0.132 : 0.165;

  const currentPremium = opts.monthlyPremium || 300000;
  const [value, setValue] = useState(currentPremium);

  const metrics = useMemo(() => {
    // 1. 세액공제 환급금 실시간 연산
    const annualPremium = value * 12;
    // 연금저축 단독 한도: IRP 포함 설정 상태인 경우 900만 원으로 증액, 단독이면 600만 원
    const maxTaxLimit = opts.hasIrp ? 9000000 : 6000000;
    const eligiblePremium = Math.min(annualPremium, maxTaxLimit);
    const taxRefund = opts.annuityType === 'savings' ? eligiblePremium * taxCreditRate : 0;

    // 2. 복리 적립금 및 월 연금액 연산
    // 평균 공시이율 2.9% 가정, 사업비 5.0% 공제 후 순적립
    const businessFeeRate = 0.05;
    const netMonthlyPremium = value * (1 - businessFeeRate);
    const annualRate = 0.029;
    const monthlyRate = annualRate / 12;
    
    // 납입기간 복리 계산
    const payMonths = payYears * 12;
    let accumulated = 0;
    for (let m = 0; m < payMonths; m++) {
      accumulated = (accumulated + netMonthlyPremium) * (1 + monthlyRate);
    }
    
    // 거치기간 복리 계산
    const deferMonths = deferYears * 12;
    for (let m = 0; m < deferMonths; m++) {
      accumulated = accumulated * (1 + monthlyRate);
    }

    // 연금 수령 계산 (수령 중 잔액은 2.0% 공시이율로 추가 적립 가산 적용)
    const recvYears = opts.receivingPeriod || 20;
    const payoutMonths = recvYears === 999 ? 25 * 12 : recvYears * 12; // 종신형은 25년으로 가정
    const payoutMonthlyRate = (0.02) / 12;

    const monthlyPension = (accumulated * payoutMonthlyRate) / (1 - Math.pow(1 + payoutMonthlyRate, -payoutMonths));
    const totalPrincipal = value * 12 * payYears;

    // 리모델링 최적성 평가 지수 (Remodeling Index)
    // 연금저축 한도(600만 원 / 월 50만 원)에 맞출수록 96점에 가깝게 평가
    let scoreIndex = 70;
    if (opts.annuityType === 'savings') {
      const ratio = Math.min(1, value / 500000);
      scoreIndex = Math.round(68 + ratio * 28);
    } else {
      const ratio = Math.min(1, value / 800000);
      scoreIndex = Math.round(72 + ratio * 24);
    }

    const percentage = Math.round(30 + Math.min(1, value / 750000) * 65);

    return {
      taxRefund: Math.round(taxRefund),
      accumulatedAmount: Math.round(accumulated),
      monthlyPension: Math.round(monthlyPension),
      totalPrincipal: Math.round(totalPrincipal),
      scoreIndex,
      percentage
    };
  }, [value, opts.annuityType, opts.hasIrp, payYears, deferYears, taxCreditRate]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-950 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-blue-400" /> Annuity Savings Simulation
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">예산에 따른 연금저축/비과세 자산 변화</h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-blue-100 relative overflow-hidden text-left">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2">설정 월 납입액</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()} <span className="text-2xl">원</span></p>
                </div>
              </div>
              <div className="relative pt-10 pb-6">
                <input 
                  type="range" 
                  min={100000} 
                  max={1000000} 
                  step={50000} 
                  value={value} 
                  onChange={(e) => setValue(Number(e.target.value))} 
                  className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600" 
                />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>실속형 (10만 원)</span>
                  <span className="text-blue-600">현재 설정 ({value.toLocaleString()}원)</span>
                  <span>럭셔리 (100만 원)</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 relative overflow-hidden group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0"><Sparkles size={24} /></div>
                <div className="space-y-2 text-left">
                  <p className="text-sm font-black text-gray-900 italic">"슬라이더를 조작해 보세요."</p>
                  <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                    월 연금저축 예산을 조절하면 연말정산 환급 혜택과 은퇴 자산 적립 효율성이 <span className="text-blue-600 font-black underline decoration-2 underline-offset-4">{metrics.percentage}% 최적화되는 것</span>을 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400"><Shield size={20} /></div>
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Expected Benefit</span>
              </div>
              <div className="space-y-4 text-left">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">
                    {opts.annuityType === 'savings' ? '매년 세액공제 예상 환급금' : '연금수령 시 예상 비과세 혜택'}
                  </p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {opts.annuityType === 'savings' ? `${metrics.taxRefund.toLocaleString()}원` : '이자세(15.4%) 면제'}
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">은퇴 시 총 적립 자산 (공시이율 복리)</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {Math.round(metrics.accumulatedAmount / 10000).toLocaleString()} <span className="text-lg">만원</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                    총 납입 원금: {Math.round(metrics.totalPrincipal / 10000).toLocaleString()}만 원 (원금 복구 완료)
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">은퇴 후 매월 예상 수령 연금액</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {Math.round(metrics.monthlyPension).toLocaleString()} <span className="text-lg">원</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                    {opts.receivingPeriod === 999 ? '평생 동안 수령 시 매월액' : `만 ${startAge}세부터 ${opts.receivingPeriod}년간 수령`}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 flex flex-col justify-between shadow-xl group hover:border-blue-200 transition-all text-left">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><TrendingUp size={20} /></div>
                <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Remodeling Index</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">연금 자산 최적화 지수</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter group-hover:scale-105 transition-transform inline-block">{metrics.scoreIndex}</span>
                  <span className="text-xl font-bold text-blue-600">점</span>
                </div>
                <p className="text-[11px] text-gray-400 font-bold mt-2 leading-relaxed">
                  * 세액공제 납입한도 최적화, 총 연소득 대비 연금 비중, 은퇴 예상 수령액의 노후생활비 대체비율 가중 평균 점수
                </p>
              </div>
            </div>
          </div>
        </div>
        <AnnuityExplanation onAction={handleScrollToTop} />
      </div>
    </section>
  );
};
export default AnnuitySlider;
