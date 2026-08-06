import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, Scale, AlertCircle, ArrowRightLeft, Shield, Sparkles } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { LegalExplanation } from './LegalExplanation';
import { maskCompany, maskProductName } from '../../../utils/compliance';

export const LegalSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const opts = result.analysis.legal || {
    litigationType: 'civil',
    lawyerLimit: 10000000,
    courtFeeLimit: 5000000,
    deductibleType: 'fixed',
    suddenAccelerationRider: false,
    consultationRider: false,
    isElectronicLitigation: false,
  };

  const options = (result as any)._allOptions || [];
  const defaultOption = { 
    premium: result._realDbPremium || 18500, 
    productName: result._productName || '법률비용보전보험',
    companyName: result._companyName || '현대해상'
  };
  const opt1 = options[0] || defaultOption;

  // 변호사 선임 한도 조작 상태 (최소 500만 원 ~ 최대 3,000만 원)
  const [lawyerLimitVal, setLawyerLimitVal] = useState(opts.lawyerLimit || 10000000);

  // 실시간 요율 연계 및 점수 계산
  const metrics = useMemo(() => {
    // 1. 변호사 한도 배수에 따른 실시간 보험료 계산
    const scale = lawyerLimitVal / (opts.lawyerLimit || 10000000);
    const simulatedPremium = Math.round((opt1.premium * scale) / 100) * 100;

    // 2. 최적화 점수 재계측
    const lawyerScore = lawyerLimitVal >= 30000000 
      ? 98 
      : lawyerLimitVal >= 20000000 
      ? 90 
      : lawyerLimitVal >= 15000000 
      ? 80 
      : lawyerLimitVal >= 10000000 
      ? 70 
      : 50;

    const courtFeeScore = opts.courtFeeLimit >= 10000000 
      ? 95 
      : opts.courtFeeLimit >= 5000000 
      ? 85 
      : 60;

    let riderScore = 50;
    if (opts.suddenAccelerationRider) riderScore += 15;
    if (opts.consultationRider) riderScore += 15;
    if (opts.isElectronicLitigation) riderScore += 20;
    riderScore = Math.min(100, riderScore);

    const totalScore = Math.round(
      (lawyerScore * 0.5) + (courtFeeScore * 0.3) + (riderScore * 0.2)
    );

    return {
      simulatedPremium,
      totalScore,
      lawyerScore,
      courtFeeScore,
      riderScore
    };
  }, [lawyerLimitVal, opts, opt1.premium]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 소송 규모 시나리오별 본인 부담 비용 연산
  // 시나리오 1: 500만원 소송 / 시나리오 2: 1,500만원 소송 / 시나리오 3: 3,000만원 소송
  const getOutofPocket = (litigationCost: number, withInsurance: boolean) => {
    if (!withInsurance) return litigationCost;
    
    // 보험 가입 시
    let covered = Math.min(litigationCost, lawyerLimitVal);
    let selfPay = 0;
    
    if (opts.deductibleType === 'fixed') {
      selfPay = 100000; // 10만원 정액 공제
    } else {
      selfPay = covered * 0.1; // 10% 비례 공제
    }
    
    // 한도 초과금액은 본인 자부담으로 추가 가산
    const overLimitCost = Math.max(0, litigationCost - lawyerLimitVal);
    return Math.round(selfPay + overLimitCost);
  };

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-950 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-indigo-400" />
          Legal Expense Limit Simulator
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">
          변호사 선임 한도 조절 시뮬레이터
        </h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden text-left">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* LEFT PANEL: SLIDERS & CONTROLS */}
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2">설정 변호사 선임 한도</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter">
                    {(lawyerLimitVal / 10000000).toFixed(1)} <span className="text-2xl">천만 원</span>
                  </p>
                </div>
              </div>
              <div className="relative pt-10 pb-6">
                <input 
                  type="range" 
                  min={5000000} 
                  max={30000000} 
                  step={5000000} 
                  value={lawyerLimitVal} 
                  onChange={(e) => setLawyerLimitVal(Number(e.target.value))} 
                  className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-indigo-600" 
                />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>최소 (500만 원)</span>
                  <span className="text-indigo-600">설정치 ({(lawyerLimitVal / 10000).toLocaleString()}만원)</span>
                  <span>최대 (3,000만 원)</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/30 p-8 rounded-[2.5rem] border border-indigo-100/50 relative overflow-hidden group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0"><Sparkles size={24} /></div>
                <div className="space-y-2 text-left">
                  <p className="text-sm font-black text-gray-900 italic">"한도 가성비 최적 조율법"</p>
                  <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                    변호사 비용은 1심 평균 **1,500만 원** 수준에 달하므로 최소 한도를 2,000만 원 이상 설계해야 대형 분쟁 공백을 막을 수 있습니다. 슬라이더를 늘려도 월 납입료 상승 폭은 크지 않습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: DISPLAY METRICS */}
          <div className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl text-left">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400"><ArrowRightLeft size={20} /></div>
                  <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Simulated Premium</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">
                      시뮬레이션 월 예상 보험료
                    </p>
                    <p className="text-3xl font-black text-white tracking-tighter">
                      {metrics.simulatedPremium.toLocaleString()} <span className="text-lg">원</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                      기준 상품: {maskProductName(opt1.productName, false)} ({maskCompany(opt1.companyName, false)})
                    </p>
                  </div>
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-[0.65rem] text-slate-400 font-bold">
                      <span>기존(입력된) 한도 보험료:</span>
                      <span className="text-indigo-300">{opt1.premium.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-[0.65rem] text-slate-400 font-bold">
                      <span>한도 변경 시 시뮬레이션:</span>
                      <span className="text-emerald-400">{metrics.simulatedPremium.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] p-10 border border-slate-100 flex flex-col justify-between shadow-xl group hover:border-indigo-600 transition-all text-left">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><Shield size={20} /></div>
                  <span className="text-[0.6rem] font-black text-slate-350 uppercase tracking-widest">Efficiency Index</span>
                </div>
                <div className="my-auto space-y-2">
                  <div className="text-6xl font-black text-gray-900 tracking-tighter">{metrics.totalScore} <span className="text-xl text-gray-400">점</span></div>
                  <p className="text-[0.7rem] font-bold text-gray-500 leading-relaxed">
                    변호사 선임 한도, 인지대 한도 및 상담 특약 가입 상태를 가중 종합 계산한 최적화 평가 지수입니다.
                  </p>
                </div>
                <button 
                  onClick={handleScrollToTop}
                  className="w-full py-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                >
                  기반 입력 다시 수정
                </button>
              </div>
            </div>

            {/* Interactive SVG-styled Dual Bar Chart */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-[3rem] p-8 text-white border border-indigo-950 shadow-xl space-y-6 text-left">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="text-indigo-400 w-5 h-5" />
                  <h4 className="text-sm font-black text-white">보험 가입 여부에 따른 지출액 비교 시뮬레이션</h4>
                </div>
                <span className="text-[9px] font-black text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  Litigation Cost Impact
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                    실제 소송 규모(500만, 1500만, 3000만 원)가 발생했을 때 본인이 실제로 주머니에서 꺼내야 하는 **총 자부담금** 비교 지표입니다.
                  </p>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <p className="text-[10px] text-indigo-300 font-bold flex items-center gap-1.5">
                      <AlertCircle size={12} /> 시뮬레이션 분석 정보
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      한도 한도 { (lawyerLimitVal / 10000).toLocaleString() }만 원 적용 상태 기준이며, 비례 한도 차감 및 한도 초과 금액이 자부담에 자동 가산 적용되었습니다.
                    </p>
                  </div>
                </div>

                {/* SVG/HTML Chart Container */}
                <div className="bg-slate-950/60 p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-[180px]">
                  <div className="flex items-end justify-between h-[110px] pb-2 border-b border-white/10 relative">
                    {(() => {
                      const sc1_no = getOutofPocket(5000000, false);
                      const sc1_yes = getOutofPocket(5000000, true);
                      
                      const sc2_no = getOutofPocket(15000000, false);
                      const sc2_yes = getOutofPocket(15000000, true);
                      
                      const sc3_no = getOutofPocket(30000000, false);
                      const sc3_yes = getOutofPocket(30000000, true);

                      // Max value for chart scaling (30,000,000)
                      const maxVal = 30000000;
                      
                      const hSc1_no = (sc1_no / maxVal) * 100;
                      const hSc1_yes = (sc1_yes / maxVal) * 100;
                      
                      const hSc2_no = (sc2_no / maxVal) * 100;
                      const hSc2_yes = (sc2_yes / maxVal) * 100;
                      
                      const hSc3_no = (sc3_no / maxVal) * 100;
                      const hSc3_yes = (sc3_yes / maxVal) * 100;

                      return (
                        <>
                          {/* 500만원 소송 */}
                          <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                            <div className="flex items-end gap-1.5 w-full justify-center">
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-slate-400 font-bold mb-1">
                                  {Math.round(sc1_no / 10000)}만
                                </span>
                                <div 
                                  className="w-3 sm:w-4 bg-slate-700 rounded-t-sm transition-all duration-500"
                                  style={{ height: `${hSc1_no}%`, minHeight: '4px' }}
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-indigo-400 font-black mb-1">
                                  {Math.round(sc1_yes / 10000)}만
                                </span>
                                <div 
                                  className="w-3 sm:w-4 bg-gradient-to-t from-indigo-500 to-indigo-600 rounded-t-sm shadow-md transition-all duration-500"
                                  style={{ height: `${hSc1_yes}%`, minHeight: '4px' }}
                                />
                              </div>
                            </div>
                            <span className="text-[9px] font-black text-slate-300">500만 소송</span>
                          </div>

                          {/* 1,500만원 소송 */}
                          <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                            <div className="flex items-end gap-1.5 w-full justify-center">
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-slate-400 font-bold mb-1">
                                  {Math.round(sc2_no / 10000)}만
                                </span>
                                <div 
                                  className="w-3 sm:w-4 bg-slate-700 rounded-t-sm transition-all duration-500"
                                  style={{ height: `${hSc2_no}%`, minHeight: '4px' }}
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-indigo-400 font-black mb-1">
                                  {Math.round(sc2_yes / 10000)}만
                                </span>
                                <div 
                                  className="w-3 sm:w-4 bg-gradient-to-t from-indigo-500 to-indigo-600 rounded-t-sm shadow-md transition-all duration-500"
                                  style={{ height: `${hSc2_yes}%`, minHeight: '4px' }}
                                />
                              </div>
                            </div>
                            <span className="text-[9px] font-black text-slate-300">1,500만 소송</span>
                          </div>

                          {/* 3,000만원 소송 */}
                          <div className="flex-1 flex flex-col items-center space-y-2 h-full justify-end relative">
                            <div className="flex items-end gap-1.5 w-full justify-center">
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-slate-400 font-bold mb-1">
                                  {Math.round(sc3_no / 10000)}만
                                </span>
                                <div 
                                  className="w-3 sm:w-4 bg-slate-700 rounded-t-sm transition-all duration-500"
                                  style={{ height: `${hSc3_no}%`, minHeight: '4px' }}
                                />
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] text-indigo-400 font-black mb-1">
                                  {Math.round(sc3_yes / 10000)}만
                                </span>
                                <div 
                                  className="w-3 sm:w-4 bg-gradient-to-t from-indigo-500 to-indigo-600 rounded-t-sm shadow-md transition-all duration-500"
                                  style={{ height: `${hSc3_yes}%`, minHeight: '4px' }}
                                />
                              </div>
                            </div>
                            <span className="text-[9px] font-black text-slate-300">3,000만 소송</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex gap-4 justify-center text-[10px] font-bold text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-slate-700 rounded-sm" />
                      <span>보험 미가입 자부담</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-sm" />
                      <span>보험 가입 시 자부담</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
        <LegalExplanation onAction={handleScrollToTop} />
      </div>
    </section>
  );
};
