import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, Sparkles, Calculator, Baby } from 'lucide-react';
import { AnalysisResult } from '../../../types/insurance';
import { ChildPrenatalSection } from './ChildPrenatalSection';
import { ChildSickSection } from './ChildSickSection';

export const ChildSlider: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const currentPremium = result.analysis.monthlyPremium || 60000;
  const dietPremium = result.recommendations?.diet?.estimatedPremium || Math.floor(currentPremium * 0.5);
  const luxuryPremium = Math.max(
    result.recommendations?.upgrade?.estimatedPremium || 0,
    result.recommendations?.hybrid?.estimatedPremium || 0,
    Math.floor(currentPremium * 1.5)
  );
  
  const childInfo = result.analysis.child || { targetAgeGroup: 'child', maturity: 30, focusArea: 'majorDisease' };
  const isPreFamily = !!childInfo.isPreFamily;
  
  const [value, setValue] = useState(currentPremium);

  const metrics = useMemo(() => {
    let ratio = 0;
    const diff = luxuryPremium - dietPremium;
    if (diff > 0) {
      ratio = (value - dietPremium) / diff;
    }
    ratio = Math.max(0, Math.min(1, ratio));

    return {
      cancerLimit: Math.round(3000 + (ratio * 7000)),
      brainHeartLimit: Math.round(1000 + (ratio * 4000)),
      hospitalLimit: Math.round(3 + (ratio * 7)),
      prenatalSurgeryLimit: Math.round(100 + (ratio * 150)),
      incubatorLimit: Math.round(3 + (ratio * 2)),
      adultSurgeryLimit: Math.round(1000 + (ratio * 1000)),
      index: Math.round(75 + (ratio * 23)),
      percentage: Math.round(30 + ratio * 60)
    };
  }, [value, dietPremium, luxuryPremium]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contentMap = {
    prenatal: {
      title: '예산에 따른 태아 보장 한도 변화',
      tag: 'Prenatal Care Simulation',
      description: `태아특약과 선천보장 가입 구조를 최적화하면, 동일 예산 범위에서 신생아 선천이상 및 인큐베이터 입원 보장 크기가 <span class="text-yellow-600 font-black underline decoration-2 underline-offset-4">${metrics.percentage}% 이상 극대화</span>됩니다.`,
      label1: '선천이상 수술비 (최대)', value1: `${metrics.prenatalSurgeryLimit.toLocaleString()} 만원`,
      label2: '저체중아 입원일당', value2: `${metrics.incubatorLimit} 만원`,
      label3: '일반암 진단비', value3: `${metrics.cancerLimit >= 10000 ? (metrics.cancerLimit/10000).toFixed(0)+'억' : metrics.cancerLimit.toLocaleString()} 만원`,
      footer: '* 태아특약 및 기본 진단비 최적 매칭 분석 결과'
    },
    child: {
      title: '예산에 따른 자녀 보장 한도 변화',
      tag: 'Child Care Simulation',
      description: `자녀 어린이보험의 만기와 가입 구조를 최적화하면, 동일 예산 범위에서 자녀 성장기 3대 중대질환 및 치료비 보장 크기가 <span class="text-yellow-600 font-black underline decoration-2 underline-offset-4">${metrics.percentage}% 이상 극대화</span>됩니다.`,
      label1: '일반암 진단비 (최대)', value1: `${metrics.cancerLimit >= 10000 ? (metrics.cancerLimit/10000).toFixed(0)+'억' : metrics.cancerLimit.toLocaleString()} 만원`,
      label2: '뇌/심혈관 진단비 (최대)', value2: `${metrics.brainHeartLimit.toLocaleString()} 만원`,
      label3: '질병/상해 입원일당', value3: `${metrics.hospitalLimit} 만원`,
      footer: '* 3대 진단비 대비 보험료 최적 매칭 분석 결과'
    },
    youth: {
      title: '예산에 따른 어른이 보장 한도 변화',
      tag: 'Youth Care Simulation',
      description: `2030 어른이보험의 납입면제와 3대질환 구조를 최적화하면, 동일 예산 범위에서 평생 가져갈 핵심 진단비 및 수술비 크기가 <span class="text-yellow-600 font-black underline decoration-2 underline-offset-4">${metrics.percentage}% 이상 극대화</span>됩니다.`,
      label1: '일반암 진단비 (최대)', value1: `${metrics.cancerLimit >= 10000 ? (metrics.cancerLimit/10000).toFixed(0)+'억' : metrics.cancerLimit.toLocaleString()} 만원`,
      label2: '1~5종 수술비 (최대)', value2: `${metrics.adultSurgeryLimit.toLocaleString()} 만원`,
      label3: '뇌/심혈관 진단비', value3: `${metrics.brainHeartLimit.toLocaleString()} 만원`,
      footer: '* 3대 진단비 및 수술비 최적 매칭 분석 결과'
    },
    pre_family: {
      title: '예산에 따른 유병력자 보장 한도 변화',
      tag: 'Pre-Family Care Simulation',
      description: `우리아이의 유병력 상태(발달지연, ADHD 등)에 맞춰 최적의 간편고지 상품을 매칭하면, 불필요한 할증을 줄여 보장 크기가 <span class="text-blue-600 font-black underline decoration-2 underline-offset-4">${metrics.percentage}% 이상 극대화</span>됩니다.`,
      label1: '일반암 진단비 (최대)', value1: `${metrics.cancerLimit >= 10000 ? (metrics.cancerLimit/10000).toFixed(0)+'억' : metrics.cancerLimit.toLocaleString()} 만원`,
      label2: '뇌/심혈관 진단비 (최대)', value2: `${metrics.brainHeartLimit.toLocaleString()} 만원`,
      label3: '질병/상해 종수술비', value3: `${metrics.adultSurgeryLimit.toLocaleString()} 만원`,
      footer: '* 간편고지(3-N-5) 심사 우대 상품 분석 결과'
    }
  };

  const currentContent = isPreFamily
    ? contentMap.pre_family
    : (contentMap[childInfo.targetAgeGroup as keyof typeof contentMap] || contentMap.child);

  return (
    <section className="space-y-16">
      <div className="text-center space-y-6">
        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl
          ${isPreFamily ? 'bg-blue-950 text-white' : 'bg-yellow-950 text-white'}`}>
          <Calculator size={14} className={isPreFamily ? 'text-blue-400' : 'text-yellow-400'} /> {currentContent.tag}
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">{currentContent.title}</h2>
      </div>

      <div className={`bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border relative overflow-hidden
        ${isPreFamily ? 'border-blue-100' : 'border-yellow-100'}`}>
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
                  className={`w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer
                    ${isPreFamily ? 'accent-blue-500' : 'accent-yellow-500'}`} 
                />
                <div className="flex justify-between mt-6 text-[0.65rem] font-black text-gray-400 uppercase tracking-widest">
                  <span>Diet ({dietPremium.toLocaleString()}원)</span>
                  <span className={isPreFamily ? 'text-blue-600' : 'text-yellow-600'}>현재 ({currentPremium.toLocaleString()}원)</span>
                  <span>Luxury ({luxuryPremium.toLocaleString()}원)</span>
                </div>
              </div>
            </div>
            <div className={`p-8 rounded-[2.5rem] border relative overflow-hidden group
              ${isPreFamily ? 'bg-blue-50/30 border-blue-100' : 'bg-yellow-50/30 border-yellow-100'}`}>
              <div className="flex gap-4">
                <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0
                  ${isPreFamily ? 'text-blue-500' : 'text-yellow-500'}`}><Sparkles size={24} /></div>
                <div className="space-y-2">
                  <p className="text-sm font-black text-gray-900 italic">"슬라이더를 조작해 보세요."</p>
                  <p 
                    className="text-[0.85rem] font-bold text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentContent.description }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6 shadow-2xl">
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center
                  ${isPreFamily ? 'text-blue-400' : 'text-yellow-400'}`}><Shield size={20} /></div>
                <span className="text-[0.6rem] font-black text-slate-500 uppercase tracking-widest">Expected Benefit</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">{currentContent.label1}</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {currentContent.value1.split(' ')[0]} <span className="text-lg">{currentContent.value1.split(' ')[1]}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">{currentContent.label2}</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {currentContent.value2.split(' ')[0]} <span className="text-lg">{currentContent.value2.split(' ')[1]}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1">{currentContent.label3}</p>
                  <p className="text-3xl font-black text-white tracking-tighter">
                    {currentContent.value3.split(' ')[0]} <span className="text-lg">{currentContent.value3.split(' ')[1]}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className={`border rounded-[3rem] p-10 flex flex-col justify-between shadow-sm group transition-all
              ${isPreFamily 
                ? 'bg-blue-50/20 border-blue-100 hover:border-blue-300' 
                : 'bg-yellow-50/20 border-yellow-100 hover:border-yellow-300'}`}>
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white
                  ${isPreFamily ? 'bg-blue-500' : 'bg-yellow-500'}`}><TrendingUp size={20} /></div>
                <span className="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">Efficiency Index</span>
              </div>
              <div>
                <p className="text-[0.65rem] font-black text-gray-400 uppercase tracking-widest mb-1">보장 최적화 지수</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter group-hover:scale-105 transition-transform inline-block">{metrics.index}</span>
                  <span className={`text-xl font-bold ${isPreFamily ? 'text-blue-600' : 'text-yellow-600'}`}>점</span>
                </div>
                <p className="text-[11px] text-gray-400 font-bold mt-2">
                  {currentContent.footer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPreFamily
        ? <ChildSickSection onAction={handleScrollToTop} />
        : <ChildPrenatalSection onAction={handleScrollToTop} />
      }
    </section>
  );
};
