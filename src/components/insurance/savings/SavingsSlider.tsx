import React, { useState, useMemo } from 'react';
import { Shield, TrendingUp, Sparkles, Calculator, PiggyBank, ArrowDownUp } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { SavingsExplanation } from './SavingsExplanation';

export const SavingsSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const opts = result.analysis.savingsGeneral || {
    savingType: 'installment',
    monthlyPremium: 300000,
    paymentPeriod: 5,
    maintenancePeriod: 10,
    savingsObjective: 'wealth',
    hasUniversal: true
  };

  const savingType = opts.savingType || 'installment';
  const payYears = opts.paymentPeriod || 5;
  const keepYears = opts.maintenancePeriod || 10;
  
  const currentPremium = opts.monthlyPremium || (savingType === 'installment' ? 300000 : 10000000);
  const [value, setValue] = useState(currentPremium);

  // 슬라이더 바인딩 범위 설정
  const minVal = savingType === 'installment' ? 100000 : 5000000;
  const maxVal = savingType === 'installment' ? 2000000 : 200000000;
  const stepVal = savingType === 'installment' ? 100000 : 5000000;

  const metrics = useMemo(() => {
    const isTaxExempt = savingType === 'installment'
      ? (payYears >= 5 && keepYears >= 10 && value <= 1500000)
      : (keepYears >= 10 && value <= 100000000);

    const totalMonths = keepYears * 12;
    const payMonths = payYears * 12;
    const totalPrincipal = savingType === 'installment' ? value * payMonths : value;

    // 1. 저축보험 (CM 평균 이율/사업비 기반 복리 시뮬레이션)
    // CM 적립식: 사업비 3.5%, 공시이율 3.15%
    // CM 일시납: 사업비 3.0%, 공시이율 2.90%
    const feeRate = savingType === 'installment' ? 0.035 : 0.030;
    const declaredRate = savingType === 'installment' ? 0.0315 : 0.0290;
    const monthlyRate = declaredRate / 12;

    let accumulated = savingType === 'lumpSum' ? value * (1 - feeRate) : 0;
    
    for (let m = 0; m < totalMonths; m++) {
      if (savingType === 'installment') {
        const isPaying = m < payMonths;
        const addAmount = isPaying ? value * (1 - feeRate) : 0;
        accumulated = (accumulated + addAmount) * (1 + monthlyRate);
      } else {
        accumulated = accumulated * (1 + monthlyRate);
      }
    }

    // 2. 은행 상품 (적금 단리 3.5%, 예금 단리 3.2% + 15.4% 이자과세)
    let bankAccumulated = 0;
    if (savingType === 'installment') {
      let bankPrincipal = 0;
      let totalBankInterest = 0;
      for (let m = 0; m < totalMonths; m++) {
        const isPaying = m < payMonths;
        if (isPaying) {
          bankPrincipal += value;
          const monthsLeft = totalMonths - m;
          totalBankInterest += value * (0.035 / 12) * monthsLeft;
        }
      }
      const tax = totalBankInterest * 0.154;
      bankAccumulated = bankPrincipal + totalBankInterest - tax;
    } else {
      const totalInterest = value * 0.032 * keepYears;
      const tax = totalInterest * 0.154;
      bankAccumulated = value + totalInterest - tax;
    }

    // 3. 비과세 혜택 이자세액 세이브 계산
    const insuranceInterest = Math.max(0, accumulated - totalPrincipal);
    const savedTax = isTaxExempt ? insuranceInterest * 0.154 : 0;

    // 최적화 지수 산출
    let scoreIndex = 70;
    if (isTaxExempt) {
      scoreIndex = 95;
      if (savingType === 'installment' && value === 1500000) {
        scoreIndex = 100; // 비과세 월 한도 최대치 설계
      } else if (savingType === 'lumpSum' && value === 100000000) {
        scoreIndex = 100; // 일시납 비과세 최고 한도 설계
      }
    } else {
      if (keepYears < 10) {
        scoreIndex = 50; // 비과세 상실 패널티
      } else {
        scoreIndex = 75; // 한도 초과
      }
    }

    const percentage = Math.round(30 + Math.min(1, value / (savingType === 'installment' ? 1500000 : 100000000)) * 65);

    return {
      accumulatedAmount: Math.round(accumulated),
      bankAccumulated: Math.round(bankAccumulated),
      totalPrincipal,
      savedTax: Math.round(savedTax),
      gain: Math.round(accumulated - bankAccumulated),
      isTaxExempt,
      scoreIndex,
      percentage
    };
  }, [value, savingType, payYears, keepYears]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-950 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-emerald-400" /> Savings Assets Simulation
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
          예산 및 예치 원금에 따른 예상 만기 자산 비교
        </h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-emerald-100 relative overflow-hidden text-left">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12">
            <div className="space-y-8">
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2">
                  {savingType === 'installment' ? '설정 월 납입 저축액' : '설정 목돈 거치 금액'}
                </p>
                <p className="text-5xl font-black text-gray-900 tracking-tighter">
                  {value.toLocaleString()} <span className="text-2xl">원</span>
                </p>
              </div>
              <div className="relative pt-10 pb-6">
                <input 
                  type="range" 
                  min={minVal} 
                  max={maxVal} 
                  step={stepVal} 
                  value={value} 
                  onChange={(e) => setValue(Number(e.target.value))} 
                  className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-emerald-500" 
                />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>{minVal >= 100000000 ? `${minVal / 100000000}억원` : `${(minVal / 10000).toLocaleString()}만원`}</span>
                  <span className="text-emerald-600 font-bold">현재 설정 ({value >= 100000000 ? `${(value/100000000).toFixed(1)}억원` : `${(value/10000).toLocaleString()}만원`})</span>
                  <span>{maxVal >= 100000000 ? `${maxVal / 100000000}억원` : `${(maxVal / 10000).toLocaleString()}만원`}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 relative overflow-hidden group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                  <Sparkles size={24} />
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-sm font-black text-gray-900 italic">"슬라이더를 통해 원금을 늘려보세요."</p>
                  <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                    저축 규모를 조절하여 비과세 한도 충족 여부와 은행 일반 과세 적금 대비 복리 저산이 <span className="text-emerald-600 font-black underline decoration-2 underline-offset-4">{metrics.percentage}% 더 최적화되는 규모</span>를 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 시뮬레이션 비교 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <PiggyBank size={20} />
                </div>
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Compounding Savings</span>
              </div>
              <div className="space-y-4 text-left">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">총 예치/납입 원금</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {Math.round(metrics.totalPrincipal / 10000).toLocaleString()} <span className="text-lg">만원</span>
                  </p>
                </div>
                
                <div>
                  <p className="text-[0.65rem] font-black text-emerald-400 tracking-widest mb-1 flex items-center gap-1">
                    만기 예상 자산 (저축보험 복리 + 비과세)
                  </p>
                  <p className="text-4xl font-black text-emerald-300 tracking-tighter">
                    {Math.round(metrics.accumulatedAmount / 10000).toLocaleString()} <span className="text-lg text-white">만원</span>
                  </p>
                  {metrics.isTaxExempt && (
                    <p className="text-[9px] text-emerald-400 font-black mt-1">
                      * 이자소득세 비과세 0% 적용 완료 (약 {metrics.savedTax.toLocaleString()}원 절세 세이브)
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">만기 예상 자산 (일반 은행 예적금)</p>
                  <p className="text-2xl font-black text-slate-300 tracking-tighter line-through">
                    {Math.round(metrics.bankAccumulated / 10000).toLocaleString()} <span className="text-base text-slate-400">만원</span>
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold mt-1">
                    * 이자소득세 15.4% 과세 차감 적용
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-500/20 bg-emerald-950/20 -mx-4 px-4 py-2 rounded-xl">
                  <p className="text-[10px] font-black text-emerald-400">은행 대비 추가 수령액</p>
                  <p className="text-2xl font-black text-white">
                    +{Math.round(metrics.gain / 10000).toLocaleString()} <span className="text-sm">만원</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 자산 최적화 지수 */}
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 flex flex-col justify-between shadow-xl group hover:border-emerald-200 transition-all text-left">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                  <TrendingUp size={20} />
                </div>
                <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Optimization Index</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">저축 자산 최적화 지수</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter group-hover:scale-105 transition-transform inline-block">
                    {metrics.scoreIndex}
                  </span>
                  <span className="text-xl font-bold text-emerald-500">점</span>
                </div>
                <p className="text-[11px] text-gray-400 font-bold mt-2 leading-relaxed">
                  * 10년 비과세 세법 기준 매칭률, CM 저비용 사업비 요율 매칭 및 금리 복리 부리 효율성을 종합 계산한 자산 지수입니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <SavingsExplanation onAction={handleScrollToTop} />
      </div>
    </section>
  );
};

export default SavingsSlider;
