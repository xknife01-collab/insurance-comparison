import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calculator, Sparkles, Car, TrendingUp, ShieldCheck } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { CarExplanation } from './CarExplanation';

interface Props {
  result: AnalysisResult;
}

export const CarSlider: React.FC<Props> = ({ result }) => {
  const { analysis } = result;
  
  const currentPremium = analysis.monthlyPremium || 80000;
  const dietPremium = result.recommendations?.diet?.estimatedPremium || Math.floor(currentPremium * 0.7);
  const upgradePremium = result.recommendations?.upgrade?.estimatedPremium || Math.floor(currentPremium * 0.95);
  const undiscountedUpgradePremium = result.undiscountedPremiums?.upgrade || upgradePremium;

  const [mileage, setMileage] = useState<number>(8000); // 연간 주행거리 슬라이더

  const metrics = useMemo(() => {
    // 마일리지 할인율 곡선 연산 (주행거리가 짧을수록 급격히 하락)
    let discountRate = 0;
    if (mileage <= 3000) discountRate = 0.35;
    else if (mileage <= 5000) discountRate = 0.27;
    else if (mileage <= 10000) discountRate = 0.18 - ((mileage - 5000) / 5000) * 0.10;
    else if (mileage <= 15000) discountRate = 0.08 - ((mileage - 10000) / 5000) * 0.08;
    
    const basePremiumAnnual = undiscountedUpgradePremium * 12;
    const finalPremiumAnnual = Math.round(basePremiumAnnual * (1 - discountRate));
    const finalMonthlyPremium = Math.round(finalPremiumAnnual / 12);
    const refundAnnual = Math.round(basePremiumAnnual * discountRate);

    // 보장 최적화 지수 (주행거리가 짧을수록 환급률이 늘어나므로 가성비 최고점 달성)
    const efficiencyIndex = Math.round(72 + (discountRate * 75));

    return {
      finalMonthlyPremium,
      finalPremiumAnnual,
      refundAnnual,
      efficiencyIndex,
      percentage: Math.round(discountRate * 100)
    };
  }, [mileage, undiscountedUpgradePremium]);

  return (
    <section className="space-y-16 text-left">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl bg-blue-950 text-white">
          <Calculator size={14} className="text-blue-400" /> T-MAP & Mileage Simulator
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">주행거리에 따른 연간 예상 환급금 변화</h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-blue-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 transform translate-x-12 -translate-y-12">
          <Car className="w-96 h-96 text-blue-600" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          {/* 슬라이더 제어 영역 */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Mileage Simulator</span>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                나의 실제 연간 주행거리를 설정해 보세요
              </h3>
              <p className="text-sm font-bold text-gray-400 leading-relaxed">
                자동차보험은 주행거리를 3,000km 이하로 낮출 때 가장 강력한 마일리지 캐시백 혜택을 받으실 수 있습니다. 슬라이더를 통해 주행거리별 환급 혜택을 확인해 보세요.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-slate-400">연간 주행거리</span>
                <div className="text-right">
                  <span className="text-4xl font-black text-blue-600">{(mileage).toLocaleString()}</span>
                  <span className="text-lg font-bold text-slate-800 ml-1">km</span>
                </div>
              </div>

              <input
                type="range"
                min="2000"
                max="18000"
                step="500"
                value={mileage}
                onChange={(e) => setMileage(parseInt(e.target.value))}
                className="w-full h-3 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex justify-between text-[10px] font-black text-slate-400">
                <span>2,000 km (최단)</span>
                <span>10,000 km (평균)</span>
                <span>18,000 km (최장)</span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-400 italic">
              "슬라이더를 조작하면, 주행거리에 따른 실시간 마일리지 환급 혜택을 시각화하여 확인하실 수 있습니다."
            </p>
          </div>

          {/* 실시간 시뮬레이션 결과 영역 */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white shadow-2xl space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              {/* 마일리지 환급 */}
              <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                <span className="text-[10px] font-black text-blue-400 tracking-widest uppercase">Expected Mileage Rebate</span>
                <span className="text-xs text-slate-400">연간 마일리지 예상 캐시백</span>
                <div className="text-2xl font-black text-blue-400 mt-1">
                  {upgradePremium === 0 ? '연동 대기 중' : `약 ${metrics.refundAnnual.toLocaleString()}원`}
                </div>
              </div>

              {/* 실질 보험료 */}
              <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
                <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">Net Premium</span>
                <span className="text-xs text-slate-400">환급 반영 후 실질 연 보험료</span>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {upgradePremium === 0 ? '연동 대기 중' : `약 ${metrics.finalPremiumAnnual.toLocaleString()}원`}
                </div>
              </div>

              {/* 효율 지수 */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-orange-400 tracking-widest uppercase">Efficiency Index</span>
                <span className="text-xs text-slate-400">보장 가성비 지수</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-orange-400">{upgradePremium === 0 ? '-' : metrics.efficiencyIndex}</span>
                  <span className="text-sm font-bold text-slate-400">{upgradePremium === 0 ? '' : '점 / 100점'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-3">
              <Sparkles size={20} className="text-blue-400 flex-shrink-0" />
              <p className="text-[10px] text-slate-300 font-bold leading-relaxed">
                연간 주행거리 조절 시, 마일리지에 따른 최대 {metrics.percentage}% 추가 환급금액이 실시간 적용되어 실질 보험료를 획기적으로 낮춥니다!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 자동차 설명서 모듈 연동 */}
      <div className="border-t border-slate-100 pt-20">
        <CarExplanation onAction={() => document.getElementById('calculator-top')?.scrollIntoView({ behavior: 'smooth' })} />
      </div>
    </section>
  );
};
