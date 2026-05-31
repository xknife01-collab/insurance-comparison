import React, { useState, useMemo } from 'react';
import { Shield, TrendingUp, Sparkles, Calculator } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { GolfExplanation } from './GolfExplanation';

export const GolfSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const currentPremium = result.analysis.monthlyPremium || 9900;
  const dietPremium = result.recommendations?.diet?.estimatedPremium || 4900;
  const luxuryPremium = result.recommendations?.hybrid?.estimatedPremium || 25000;

  const [value, setValue] = useState(currentPremium);

  const metrics = useMemo(() => {
    let ratio = 0;
    const diff = luxuryPremium - dietPremium;
    if (diff > 0) {
      ratio = (value - dietPremium) / diff;
    }
    ratio = Math.max(0, Math.min(1, ratio));

    // 홀인원 축하비용 (30만 ~ 200만 원)
    // 골프 배상책임 (500만 ~ 3,000만 원)
    // 골프용품 손해 (30만 ~ 200만 원)
    const holeInOneLimit = Math.round(30 + ratio * 170);
    const liabilityLimit = Math.round(500 + ratio * 2500);
    const equipmentLimit = Math.round(30 + ratio * 170);

    return {
      holeInOneLimit,
      liabilityLimit,
      equipmentLimit,
      index: Math.round(72 + (ratio * 27)),
      percentage: Math.round(30 + ratio * 70)
    };
  }, [value, dietPremium, luxuryPremium]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-950 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-emerald-400" /> Golf Coverage Simulation
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">예산에 따른 골프 보장 한도 변화</h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-emerald-100 relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-2">설정 보험료 (월)</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter">{value.toLocaleString()} <span className="text-2xl">원</span></p>
                </div>
              </div>
              <div className="relative pt-10 pb-6">
                <input 
                  type="range" 
                  min={dietPremium} 
                  max={luxuryPremium} 
                  step={500} 
                  value={value} 
                  onChange={(e) => setValue(Number(e.target.value))} 
                  className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-emerald-500" 
                />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>Diet ({dietPremium.toLocaleString()}원)</span>
                  <span className="text-emerald-600">현재 ({currentPremium.toLocaleString()}원)</span>
                  <span>Luxury ({luxuryPremium.toLocaleString()}원)</span>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 relative overflow-hidden group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0"><Sparkles size={24} /></div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-gray-900 italic">"슬라이더를 조작해 보세요."</p>
                  <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                    골프보험 예산을 조정하면 홀인원 축하비용, 골프 배상책임 및 골프용품 파손 손해의 실시간 보장 한도가 <span className="text-emerald-600 font-black underline decoration-2 underline-offset-4">{metrics.percentage}% 최적화되는 것</span>을 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400"><Shield size={20} /></div>
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Expected Benefit</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">홀인원 축하 비용 (회당)</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {result.analysis.golf?.gameType === 'professional' ? '보장제외' : `${metrics.holeInOneLimit} 만원`}
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">골프 배상책임 (사고당)</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {metrics.liabilityLimit.toLocaleString()} <span className="text-lg">만원</span>
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">골프용품 파손/도난 손해</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {result.analysis.golf?.gameType === 'professional' ? '보장제외' : `${metrics.equipmentLimit} 만원`}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 flex flex-col justify-between shadow-xl group hover:border-emerald-200 transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500"><TrendingUp size={20} /></div>
                <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Remodeling Index</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">보장 최적화 리모델링 지수</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter group-hover:scale-105 transition-transform inline-block">{metrics.index}</span>
                  <span className="text-xl font-bold text-emerald-600">점</span>
                </div>
                <p className="text-[11px] text-gray-400 font-bold mt-2">
                  * 경기 유형별 위험도 및 특약 결합 분석 지수
                </p>
              </div>
            </div>
          </div>
        </div>
        <GolfExplanation onAction={handleScrollToTop} gameType={result.analysis.golf?.gameType} />
      </div>
    </section>
  );
};
