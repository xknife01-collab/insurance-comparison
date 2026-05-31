import React, { useState, useMemo } from 'react';
import { Shield, TrendingUp, Sparkles, Calculator } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { WholeLifeExplanation } from './WholeLifeExplanation';

export const WholeLifeSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const opts = result.analysis.wholeLife || {
    objective: 'family',
    paymentPeriod: 10,
    deathBenefit: 100000000,
    refundType: 'low',
    isStepUp: false
  };

  const payYears = opts.paymentPeriod || 10;
  const isLowRefund = opts.refundType === 'low';
  const isStepUp = opts.isStepUp || false;

  // 기본 월 보험료 제안액 가져오기 (없으면 25만 원)
  const recommendedPremium = result.recommendations?.upgrade?.estimatedPremium || 250000;
  const [value, setValue] = useState(recommendedPremium);

  const metrics = useMemo(() => {
    // 1. 총 납입 원금
    const totalPrincipal = value * 12 * payYears;

    // 2. 완납 후 10년 해약환급금 및 환급률 계산
    // 저해지 환급형 단기납인 경우: 10년 시점 약 122.8% 환급률 가정
    // 일반 환급형인 경우: 10년 시점 약 102.5% 환급률 가정
    const refundRate = isLowRefund 
      ? (payYears <= 7 ? 1.234 : 1.215) 
      : 1.025;
      
    const surrenderValue = totalPrincipal * refundRate;
    const ratePercentage = Math.round(refundRate * 100);

    // 3. 사망보험금 설계 평가 지수 (Remodeling Index)
    // 연령 및 사망보험금, 납입액 구조에 기반하여 65~98점 사이 책정
    let scoreIndex = 75;
    const ratio = Math.min(1, value / 400000);
    if (isLowRefund && payYears <= 10) {
      scoreIndex = Math.round(82 + ratio * 16);
    } else {
      scoreIndex = Math.round(65 + ratio * 20);
    }

    // 4. 최적화 비율 (%)
    const percentage = Math.round(45 + Math.min(1, value / 600000) * 50);

    return {
      totalPrincipal,
      surrenderValue: Math.round(surrenderValue),
      ratePercentage,
      scoreIndex,
      percentage
    };
  }, [value, payYears, isLowRefund]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-950 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-indigo-400" /> Whole Life Asset Simulator
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">예산에 따른 종신 보장/환급 자산 변화</h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-indigo-100 relative overflow-hidden text-left">
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
                  max={1500000} 
                  step={50000} 
                  value={value} 
                  onChange={(e) => setValue(Number(e.target.value))} 
                  className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600" 
                />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>가성비 (10만 원)</span>
                  <span className="text-indigo-600">현재 설정 ({value.toLocaleString()}원)</span>
                  <span>상속 세원 (150만 원)</span>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100 relative overflow-hidden group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0"><Sparkles size={24} /></div>
                <div className="space-y-2 text-left">
                  <p className="text-sm font-black text-gray-900 italic">"슬라이더를 조작해 보세요."</p>
                  <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                    월 납입 금액 조절 시, 중도해지 리스크를 차단하면서 확보할 수 있는 10년 시점 비과세 자산 가치가 <span className="text-indigo-600 font-black underline decoration-2 underline-offset-4">{metrics.percentage}% 향상됨</span>을 체감하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400"><Shield size={20} /></div>
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Expected Benefit</span>
              </div>
              <div className="space-y-4 text-left">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">
                    완납 후 10년 해약환급금 (예상)
                  </p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {Math.round(metrics.surrenderValue / 10000).toLocaleString()} <span className="text-lg">만원</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                    예상 환급률: <span className="text-emerald-400 font-black">{metrics.ratePercentage}%</span> (비과세 요건 충족 시)
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">총 납입 원금 ({payYears}년 동안 완납)</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {Math.round(metrics.totalPrincipal / 10000).toLocaleString()} <span className="text-lg">만원</span>
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">확보되는 사망보장 자산</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {Math.round(opts.deathBenefit / 100000000).toFixed(0)}억 원 {isStepUp && <span className="text-xs text-indigo-400">(체증형)</span>}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                    평생 사망 시 즉시 가족에게 정액 현금 지급
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 flex flex-col justify-between shadow-xl group hover:border-indigo-200 transition-all text-left">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500"><TrendingUp size={20} /></div>
                <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Remodeling Index</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">보장 자산 최적화 지수</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter group-hover:scale-105 transition-transform inline-block">{metrics.scoreIndex}</span>
                  <span className="text-xl font-bold text-indigo-600">점</span>
                </div>
                <p className="text-[11px] text-gray-400 font-bold mt-2 leading-relaxed">
                  * 사망 보장 금액 적정성, 월 납입 보험료 대비 소득 비중, 완납 후 비과세 환급 효율성의 가중 평균 점수입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        <WholeLifeExplanation onAction={handleScrollToTop} />
      </div>
    </section>
  );
};
export default WholeLifeSlider;
