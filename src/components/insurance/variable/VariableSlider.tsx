import React, { useState, useMemo } from 'react';
import { Shield, TrendingUp, Sparkles, Calculator, PiggyBank, ArrowRightLeft } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { VariableExplanation } from './VariableExplanation';

export const VariableSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const opts = result.analysis.variable || {
    subType: result.analysis.selectedDetail === 1 ? 'term' : 'investment',
    monthlyPremium: 150000,
    paymentPeriod: 10,
    investmentStyle: 'balanced',
    equityRatio: 50,
    isAnnuityConversion: false,
    deathBenefit: 100000000,
    coveragePeriod: 70,
    isHealthyDiscount: false
  };

  const subType = opts.subType || (result.analysis.selectedDetail === 1 ? 'term' : 'investment');
  const payYears = opts.paymentPeriod || 10;
  const investmentStyle = opts.investmentStyle || 'balanced';
  const equityRatio = opts.equityRatio !== undefined ? opts.equityRatio : 50;
  const isHealthyDiscount = opts.isHealthyDiscount;
  const age = result.analysis.age || 35;
  const gender = result.analysis.gender || 'male';

  // State values for sliders
  const recommendedPremium = result.recommendations?.upgrade?.estimatedPremium || 150000;
  const [premiumVal, setPremiumVal] = useState(recommendedPremium);
  const [benefitVal, setBenefitVal] = useState(opts.deathBenefit || 100000000);

  // ── 1. INVESTMENT SUBTYPE CALCULATIONS ──
  const investmentMetrics = useMemo(() => {
    if (subType !== 'investment') return null;

    const totalPrincipal = premiumVal * 12 * payYears;
    
    // Yield rate based on style & equity
    let baseYield = 0.05; // Balanced
    if (investmentStyle === 'conservative') baseYield = 0.03;
    if (investmentStyle === 'aggressive') baseYield = 0.07;
    
    // Adjust by equity ratio (more equity adds variance/growth)
    const yieldRate = baseYield + (equityRatio - 50) * 0.0002;
    
    // Fees: Business fee (e.g. 4.0%), Fund fee (0.5% p.a.)
    const businessFeeRate = 0.04;
    const fundFeeRate = 0.005;
    
    // Future value calculation using monthly compound interest
    const simulateFutureValue = (years: number) => {
      const months = years * 12;
      const netMonthlyYield = (yieldRate - fundFeeRate) / 12;
      let balance = 0;
      
      for (let m = 1; m <= months; m++) {
        // Only pay premium during paymentPeriod
        if (m <= payYears * 12) {
          const netContribution = premiumVal * (1 - businessFeeRate);
          balance = (balance + netContribution) * (1 + netMonthlyYield);
        } else {
          // Deferral period: balance continues compound growth
          balance = balance * (1 + netMonthlyYield);
        }
      }
      return balance;
    };

    const value10Years = simulateFutureValue(10);
    const value20Years = simulateFutureValue(20);
    const value30Years = simulateFutureValue(30);

    const refundRate10 = Math.round((value10Years / (premiumVal * 12 * Math.min(10, payYears))) * 100);
    const refundRate20 = Math.round((value20Years / totalPrincipal) * 100);

    const scoreIndex = Math.min(98, Math.round(75 + (equityRatio / 5) + (payYears >= 10 ? 10 : 0)));
    const percentage = Math.round(50 + (equityRatio / 2));

    return {
      totalPrincipal,
      value10Years: Math.round(value10Years),
      value20Years: Math.round(value20Years),
      value30Years: Math.round(value30Years),
      refundRate10,
      refundRate20,
      scoreIndex,
      percentage
    };
  }, [premiumVal, payYears, investmentStyle, equityRatio, subType]);

  // ── 2. TERM LIFE SUBTYPE CALCULATIONS ──
  const termMetrics = useMemo(() => {
    if (subType !== 'term') return null;

    // Estimate equivalent Whole Life Premium (roughly 5.5x of Term Life)
    // Base rate per 1000만원 cover
    const benefitUnit = benefitVal / 10000000;
    const ageFactor = Math.max(0.5, (age - 20) * 0.05 + 0.8);
    const genderFactor = gender === 'male' ? 1.25 : 0.85;

    // Term Life premium
    let termPremium = Math.round((1300 * benefitUnit * ageFactor * genderFactor) / 100) * 100;
    if (isHealthyDiscount) {
      termPremium = Math.round((termPremium * 0.85) / 100) * 100; // 15% discount
    }

    // Whole Life equivalent
    const wholePremium = Math.round((7000 * benefitUnit * ageFactor * genderFactor) / 100) * 100;

    const monthlySavings = Math.max(10000, wholePremium - termPremium);
    
    // Compound savings at 5% annual rate
    const simulateSavingsCompound = (years: number) => {
      const months = years * 12;
      const rate = 0.05 / 12;
      let balance = 0;
      for (let m = 1; m <= months; m++) {
        balance = (balance + monthlySavings) * (1 + rate);
      }
      return balance;
    };

    const savings10Years = simulateSavingsCompound(10);
    const savings20Years = simulateSavingsCompound(20);

    const scoreIndex = Math.min(98, Math.round(80 + (isHealthyDiscount ? 10 : 0) + (benefitVal >= 100000000 ? 8 : 0)));
    const percentage = Math.round(15 + (benefitVal / 200000000) * 50);

    return {
      termPremium,
      wholePremium,
      monthlySavings,
      savings10Years: Math.round(savings10Years),
      savings20Years: Math.round(savings20Years),
      scoreIndex,
      percentage
    };
  }, [benefitVal, age, gender, isHealthyDiscount, subType]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-950 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-indigo-400" />
          {subType === 'investment' ? 'Variable Yield Simulator' : 'Term-Whole Switch Simulator'}
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
          {subType === 'investment' 
            ? '예산 및 펀드 배분에 따른 변액 투자 가치 변화' 
            : '보장 설계에 따른 종신 ➡️ 정기 다이어트 효과'}
        </h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-indigo-100 relative overflow-hidden text-left">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* LEFT PANEL: SLIDERS & CONTROLS */}
          {subType === 'investment' && investmentMetrics ? (
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2">설정 월 납입액</p>
                    <p className="text-5xl font-black text-gray-900 tracking-tighter">
                      {premiumVal.toLocaleString()} <span className="text-2xl">원</span>
                    </p>
                  </div>
                </div>
                <div className="relative pt-10 pb-6">
                  <input 
                    type="range" 
                    min={100000} 
                    max={2000000} 
                    step={50000} 
                    value={premiumVal} 
                    onChange={(e) => setPremiumVal(Number(e.target.value))} 
                    className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600" 
                  />
                  <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                    <span>최소 (10만 원)</span>
                    <span className="text-indigo-600">현재 납입액 ({premiumVal.toLocaleString()}원)</span>
                    <span>최대 (200만 원)</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100 relative overflow-hidden group">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0"><Sparkles size={24} /></div>
                  <div className="space-y-2 text-left">
                    <p className="text-sm font-black text-gray-900 italic">"복리의 마법을 확인해 보세요."</p>
                    <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                      장기 거치 시 비과세 연금 혜택 요건을 충족하면, 일반 과세 상품 대비 비과세 절세 효과가 약 <span className="text-indigo-600 font-black underline decoration-2 underline-offset-4">{investmentMetrics.percentage}% 추가 상승</span>하는 효과를 거둘 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : termMetrics ? (
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2">설정 사망 보장 금액</p>
                    <p className="text-5xl font-black text-gray-900 tracking-tighter">
                      {(benefitVal / 100000000).toFixed(1)} <span className="text-2xl">억원</span>
                    </p>
                  </div>
                </div>
                <div className="relative pt-10 pb-6">
                  <input 
                    type="range" 
                    min={50000000} 
                    max={1000000000} 
                    step={50000000} 
                    value={benefitVal} 
                    onChange={(e) => setBenefitVal(Number(e.target.value))} 
                    className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-orange-500" 
                  />
                  <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                    <span>5천만원</span>
                    <span className="text-orange-500 font-black">현재 설정 ({(benefitVal/100000000).toFixed(1)}억원)</span>
                    <span>10억원</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-orange-100 relative overflow-hidden group">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm shrink-0"><Sparkles size={24} /></div>
                  <div className="space-y-2 text-left">
                    <p className="text-sm font-black text-gray-900 italic">"종신 대신 정기보험으로 바꾸면?"</p>
                    <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                      매달 절약할 수 있는 기회비용 <span className="text-orange-600 font-black">{termMetrics.monthlySavings.toLocaleString()}원</span>을 다른 투자 자산으로 분산 운용하면 10년 뒤 목돈 가치로 치환 가능합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* RIGHT PANEL: DISPLAY METRICS */}
          {subType === 'investment' && investmentMetrics ? (
            <div className="space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400"><PiggyBank size={20} /></div>
                    <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Projected Fund Value</span>
                  </div>
                  <div className="space-y-4 text-left">
                    <div>
                      <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">
                        10년 시점 예상 평가액
                      </p>
                      <p className="text-3xl font-black text-white tracking-tighter">
                        {Math.round(investmentMetrics.value10Years / 10000).toLocaleString()} <span className="text-lg">만원</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                        예상 환급률: <span className="text-emerald-400 font-black">{investmentMetrics.refundRate10}%</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">
                        20년 시점 예상 평가액
                      </p>
                      <p className="text-3xl font-black text-white tracking-tighter">
                        {Math.round(investmentMetrics.value20Years / 10000).toLocaleString()} <span className="text-lg">만원</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                        예상 환급률: <span className="text-emerald-400 font-black">{investmentMetrics.refundRate20}%</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">총 납입 원금 ({payYears}년 완납)</p>
                      <p className="text-3xl font-black text-white tracking-tighter">
                        {Math.round(investmentMetrics.totalPrincipal / 10000).toLocaleString()} <span className="text-lg">만원</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 flex flex-col justify-between shadow-xl group hover:border-indigo-200 transition-all text-left">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500"><TrendingUp size={20} /></div>
                    <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Asset Efficiency Index</span>
                  </div>
                  <div className="my-auto space-y-2">
                    <div className="text-6xl font-black text-gray-900 tracking-tighter">{investmentMetrics.scoreIndex} <span className="text-xl text-gray-400">점</span></div>
                    <p className="text-[0.7rem] font-bold text-gray-500 leading-relaxed">
                      투자 성향에 최적화된 주식 비율과 복리 환급 효율을 가중 평균한 변액 자산 종합 관리 지수입니다.
                    </p>
                  </div>
                  <button 
                    onClick={handleScrollToTop}
                    className="w-full py-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    기반 조건 다시 재수정
                  </button>
                </div>
              </div>

              {/* Interactive SVG-styled Bar Chart */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 rounded-[3rem] p-8 text-white border border-indigo-950 shadow-xl space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-indigo-400 w-5 h-5" />
                    <h4 className="text-sm font-black text-white">중장기 복리 자산 성장 시뮬레이션</h4>
                  </div>
                  <span className="text-[9px] font-black text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    Compound Growth
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">
                  매월 납입하는 원금 대비 연 복리 수익이 쌓여 자산이 늘어나는 추이입니다.
                </p>

                <div className="pt-4 pb-2">
                  <div className="flex justify-between items-end h-40 border-b border-white/10 pb-4 relative">
                    <div className="absolute left-0 right-0 top-0 border-t border-white/5 h-0" />
                    <div className="absolute left-0 right-0 top-1/2 border-t border-white/5 h-0" />
                    
                    {(() => {
                      const maxVal = Math.max(
                        investmentMetrics.totalPrincipal,
                        investmentMetrics.value10Years,
                        investmentMetrics.value20Years,
                        investmentMetrics.value30Years,
                        100000
                      );
                      
                      const p10 = premiumVal * 12 * Math.min(10, payYears);
                      const v10 = investmentMetrics.value10Years;
                      const hP10 = (p10 / maxVal) * 100;
                      const hV10 = (v10 / maxVal) * 100;
                      
                      const p20 = premiumVal * 12 * Math.min(20, payYears);
                      const v20 = investmentMetrics.value20Years;
                      const hP20 = (p20 / maxVal) * 100;
                      const hV20 = (v20 / maxVal) * 100;
                      
                      const p30 = premiumVal * 12 * Math.min(30, payYears);
                      const v30 = investmentMetrics.value30Years;
                      const hP30 = (p30 / maxVal) * 100;
                      const hV30 = (v30 / maxVal) * 100;

                      return (
                        <>
                          {/* 10 Years */}
                          <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                            <div className="flex items-end gap-1.5 w-full justify-center">
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] text-slate-400 font-bold mb-1">
                                  {Math.round(p10 / 10000)}만
                                </span>
                                <div 
                                  className="w-4 sm:w-6 bg-slate-700 rounded-t-sm transition-all duration-500"
                                  style={{ height: `${hP10}%`, minHeight: '4px' }}
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] text-emerald-400 font-black mb-1">
                                  {Math.round(v10 / 10000)}만
                                </span>
                                <div 
                                  className="w-4 sm:w-6 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-sm shadow-lg shadow-indigo-500/20 transition-all duration-500"
                                  style={{ height: `${hV10}%`, minHeight: '4px' }}
                                />
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-300">10년 ({investmentMetrics.refundRate10}%)</span>
                          </div>

                          {/* 20 Years */}
                          <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                            <div className="flex items-end gap-1.5 w-full justify-center">
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] text-slate-400 font-bold mb-1">
                                  {Math.round(p20 / 10000)}만
                                </span>
                                <div 
                                  className="w-4 sm:w-6 bg-slate-700 rounded-t-sm transition-all duration-500"
                                  style={{ height: `${hP20}%`, minHeight: '4px' }}
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] text-emerald-400 font-black mb-1">
                                  {Math.round(v20 / 10000)}만
                                </span>
                                <div 
                                  className="w-4 sm:w-6 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-sm shadow-lg shadow-indigo-500/20 transition-all duration-500"
                                  style={{ height: `${hV20}%`, minHeight: '4px' }}
                                />
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-300">20년 ({investmentMetrics.refundRate20}%)</span>
                          </div>

                          {/* 30 Years */}
                          <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                            <div className="flex items-end gap-1.5 w-full justify-center">
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] text-slate-400 font-bold mb-1">
                                  {Math.round(p30 / 10000)}만
                                </span>
                                <div 
                                  className="w-4 sm:w-6 bg-slate-700 rounded-t-sm transition-all duration-500"
                                  style={{ height: `${hP30}%`, minHeight: '4px' }}
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[9px] text-emerald-400 font-black mb-1">
                                  {Math.round(v30 / 10000)}만
                                </span>
                                <div 
                                  className="w-4 sm:w-6 bg-gradient-to-t from-indigo-500 to-fuchsia-500 rounded-t-sm shadow-lg shadow-indigo-500/30 transition-all duration-500"
                                  style={{ height: `${hV30}%`, minHeight: '4px' }}
                                />
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-300">30년 ({Math.round((v30 / investmentMetrics.totalPrincipal) * 100)}%)</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex gap-6 justify-center text-xs font-bold text-slate-400 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-700 rounded-sm" />
                    <span>총 납입 원금</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-sm" />
                    <span>예상 평가액</span>
                  </div>
                </div>
              </div>
            </div>
          ) : termMetrics ? (
            <div className="space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-orange-400"><ArrowRightLeft size={20} /></div>
                    <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Saved Opportunity Value</span>
                  </div>
                  <div className="space-y-4 text-left">
                    <div>
                      <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">
                        기회비용 10년 적립 가치 (예상)
                      </p>
                      <p className="text-3xl font-black text-white tracking-tighter">
                        {Math.round(termMetrics.savings10Years / 10000).toLocaleString()} <span className="text-lg">만원</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                        연 5.0% 복리 투자 수익 가정 시
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">
                        기회비용 20년 적립 가치 (예상)
                      </p>
                      <p className="text-3xl font-black text-white tracking-tighter">
                        {Math.round(termMetrics.savings20Years / 10000).toLocaleString()} <span className="text-lg">만원</span>
                      </p>
                    </div>
                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <div className="flex justify-between text-[0.65rem] text-slate-400 font-bold">
                        <span>종신보험 가입 시 예상 보험료:</span>
                        <span className="text-rose-450">{termMetrics.wholePremium.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between text-[0.65rem] text-slate-400 font-bold">
                        <span>가성비 정기보험 예상 보험료:</span>
                        <span className="text-emerald-400">{termMetrics.termPremium.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 flex flex-col justify-between shadow-xl group hover:border-orange-200 transition-all text-left">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500"><Shield size={20} /></div>
                    <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Protection Efficiency Index</span>
                  </div>
                  <div className="my-auto space-y-2">
                    <div className="text-6xl font-black text-gray-900 tracking-tighter">{termMetrics.scoreIndex} <span className="text-xl text-gray-400">점</span></div>
                    <p className="text-[0.7rem] font-bold text-gray-500 leading-relaxed">
                      적정 사망 보장 금액, 자녀 독립 연령 맞춤 만기 설정, 우량체 할인 적용에 가중 평균을 둔 정기보험 보장 효율성 점수입니다.
                    </p>
                  </div>
                  <button 
                    onClick={handleScrollToTop}
                    className="w-full py-4 bg-orange-50 text-orange-600 hover:bg-[#FF6B00] hover:text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                  >
                    기반 조건 다시 재수정
                  </button>
                </div>
              </div>

              {/* Interactive SVG-styled Dual Bar Chart */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950 rounded-[3rem] p-8 text-white border border-orange-950 shadow-xl space-y-6 text-left">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="text-orange-400 w-5 h-5" />
                    <h4 className="text-sm font-black text-white">종신보험 ➡️ 정기보험 전환 리모델링 효과</h4>
                  </div>
                  <span className="text-[9px] font-black text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    Remodeling Impact
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                      기존 종신보험 대비 정기보험 가입 시 매달 고정적으로 아낄 수 있는 보험료 비교입니다.
                    </p>
                    <div className="flex items-end gap-6 h-32 border-b border-white/10 pb-4 relative">
                      <div className="absolute left-0 right-0 top-0 border-t border-white/5 h-0" />
                      <div className="absolute left-0 right-0 top-1/2 border-t border-white/5 h-0" />

                      <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                        <span className="text-[9px] text-rose-450 font-black mb-1">
                          {termMetrics.wholePremium.toLocaleString()}원
                        </span>
                        <div 
                          className="w-8 bg-gradient-to-t from-rose-900 to-rose-500 rounded-t-sm shadow-lg shadow-rose-500/10 transition-all duration-500"
                          style={{ height: '90%' }}
                        />
                        <span className="text-[9px] font-black text-slate-400">기존 종신</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                        <span className="text-[9px] text-emerald-400 font-black mb-1">
                          {termMetrics.termPremium.toLocaleString()}원
                        </span>
                        <div 
                          className="w-8 bg-gradient-to-t from-emerald-900 to-emerald-500 rounded-t-sm shadow-lg shadow-emerald-500/20 transition-all duration-500"
                          style={{ height: `${Math.max(12, (termMetrics.termPremium / termMetrics.wholePremium) * 90)}%` }}
                        />
                        <span className="text-[9px] font-black text-slate-300">교체 정기</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-orange-400 text-center bg-orange-500/10 py-1.5 rounded-xl">
                      매월 {termMetrics.monthlySavings.toLocaleString()}원 절감!
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                      절약한 보험료를 연 5% 복리 투자로 운용할 때 축적되는 기회비용 자산의 가치입니다.
                    </p>
                    <div className="flex items-end gap-6 h-32 border-b border-white/10 pb-4 relative">
                      <div className="absolute left-0 right-0 top-0 border-t border-white/5 h-0" />
                      <div className="absolute left-0 right-0 top-1/2 border-t border-white/5 h-0" />

                      <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                        <span className="text-[9px] text-orange-400 font-black mb-1">
                          {Math.round(termMetrics.savings10Years / 10000).toLocaleString()}만원
                        </span>
                        <div 
                          className="w-8 bg-gradient-to-t from-amber-900 to-amber-500 rounded-t-sm shadow-lg shadow-amber-500/10 transition-all duration-500"
                          style={{ height: '40%' }}
                        />
                        <span className="text-[9px] font-black text-slate-400">10년 적립</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                        <span className="text-[9px] text-amber-300 font-black mb-1">
                          {Math.round(termMetrics.savings20Years / 10000).toLocaleString()}만원
                        </span>
                        <div 
                          className="w-8 bg-gradient-to-t from-orange-800 to-orange-500 rounded-t-sm shadow-lg shadow-orange-500/30 transition-all duration-500"
                          style={{ height: '90%' }}
                        />
                        <span className="text-[9px] font-black text-slate-300">20년 적립</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-amber-300 text-center bg-amber-500/10 py-1.5 rounded-xl">
                      10년 은퇴비상금 {Math.round(termMetrics.savings10Years / 10000).toLocaleString()}만원 마련!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <VariableExplanation onAction={handleScrollToTop} />
      </div>
    </section>
  );
};
export default VariableSlider;
