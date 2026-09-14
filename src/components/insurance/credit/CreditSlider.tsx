import React, { useState, useMemo } from 'react';
import { Shield, TrendingUp, Sparkles, Calculator } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { CreditExplanation } from './CreditExplanation';

export const CreditSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const currentPremium = result.analysis.monthlyPremium || 45000;
  const dietPremium = result.recommendations?.diet?.estimatedPremium || 12000;
  const luxuryPremium = result.recommendations?.hybrid?.estimatedPremium || 85000;

  const [value, setValue] = useState(currentPremium);

  const metrics = useMemo(() => {
    let ratio = 0;
    const diff = luxuryPremium - dietPremium;
    if (diff > 0) {
      ratio = (value - dietPremium) / diff;
    }
    ratio = Math.max(0, Math.min(1, ratio));

    // 보장 수준 산출 (대출 원금 보장률, 특약 조립 범위 등)
    const coverageRatio = Math.round(60 + ratio * 39); // 60% ~ 99%
    const index = Math.round(72 + (ratio * 27)); // 72점 ~ 99점
    const percentage = Math.round(35 + ratio * 64); // 35% ~ 99%

    let riderText = '사망 단독 (기본형)';
    if (ratio >= 0.7) {
      riderText = '사망 + 3대질병 + 장해 + 신용케어';
    } else if (ratio >= 0.3) {
      riderText = '사망 + 3대질병 진단 상환';
    }

    return {
      coverageRatio,
      riderText,
      index,
      percentage
    };
  }, [value, dietPremium, luxuryPremium]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-950 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
          <Calculator size={14} className="text-blue-400" /> Credit Coverage Simulation
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">예산에 따른 대출상환 보장 범위 변화</h2>
      </div>

      <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-blue-100 relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10 mb-16">
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
                  className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600" 
                />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>Diet ({dietPremium.toLocaleString()}원)</span>
                  <span className="text-blue-600">현재 ({currentPremium.toLocaleString()}원)</span>
                  <span>Luxury ({luxuryPremium.toLocaleString()}원)</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 relative overflow-hidden group">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0"><Sparkles size={24} /></div>
                <div className="space-y-2 text-left">
                  <p className="text-[0.85rem] font-bold text-gray-600 leading-relaxed">
                    설정하신 월 예산에 맞춰 대출금 상환 보상 한도 비율 및 인수 특약 조립 범위가 <span className="text-blue-600 font-black underline decoration-2 underline-offset-4">실시간 맞춤 조율(참고용 예시)</span>되는 것을 확인하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400"><Shield size={20} /></div>
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Expected Benefit</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">대출금 보장비율 (예시)</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {metrics.coverageRatio} <span className="text-lg">%</span>
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 tracking-widest mb-1">조립 특약 범위</p>
                  <p className="text-xl font-black text-white tracking-tight leading-snug">
                    {metrics.riderText}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 border border-gray-100 flex flex-col justify-between shadow-xl group hover:border-blue-200 transition-all">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><TrendingUp size={20} /></div>
                <span className="text-[0.6rem] font-black text-gray-300 uppercase tracking-widest">Remodeling Index</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">보장 최적화 리모델링 지수</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter group-hover:scale-105 transition-transform inline-block">{metrics.index}</span>
                  <span className="text-xl font-bold text-blue-600">점</span>
                </div>
                <p className="text-[11px] text-gray-400 font-bold mt-2">
                  * 대출 상환 공백 대비도 및 신용 할인 연동 종합 분석 지수
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 슬라이더 하단 금융소비자 유의사항 안내 ── */}
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed text-left space-y-1">
          <p className="font-black text-slate-700">※ 신용생명보험 시뮬레이션 관련 유의사항</p>
          <p>• 신용생명보험은 차주의 사망, 장해, 중대질병 등 약관상 규정된 보험사고 발생 시 가입금액 한도 내에서 채권 금융기관에 대출금을 상환하는 순수 보장성 보험입니다.</p>
          <p>• 상기 시뮬레이션 결과는 고객의 이해를 돕기 위한 예시이며, 실제 월 납입보험료 및 보장한도는 피보험자의 성별, 연령, 건강상태, 대출 종류, 대출 잔액 및 신용평가 점수에 따라 상이할 수 있습니다.</p>
          <p>• 단순 대출 연체나 채무불이행 자체는 보험금 지급 사유에 해당하지 않으며, 기존 대출 조기 완납 또는 대환대출 시 계약자가 별도로 보험계약을 해지하셔야 합니다.</p>
        </div>

        <CreditExplanation onAction={handleScrollToTop} />
      </div>
    </section>
  );
};
