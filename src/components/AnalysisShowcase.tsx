import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Shield, 
  User, 
  Lock, 
  RefreshCw, 
  CheckCircle, 
  ChevronRight, 
  Sparkles, 
  AlertCircle,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import AnalysisDashboard from './AnalysisDashboard';
import { AnalysisResult } from '../types/insurance';
import { analyzeRemodeling } from '../lib/remodeling/remodelingEngine';
import { MOCK_REMODELING_DATA } from '../lib/insurance/remodeling/hyphenRemodelingService';
import { maskCompany, maskProductName } from '../utils/compliance';
import { useB2BBranding } from '../hooks/useB2BBranding';

type StepType = 'input' | 'loading' | 'result';

export default function AnalysisShowcase() {
  const { isB2BMode } = useB2BBranding();
  const [activeStep, setActiveStep] = useState<StepType>('input');
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Phase 1 (Input) simulation states
  const [simName, setSimName] = useState('');
  const [simGender, setSimGender] = useState<'M' | 'F' | null>(null);
  const [simBirthDate, setSimBirthDate] = useState('');
  const [simAge, setSimAge] = useState('');
  const [simMobile, setSimMobile] = useState('');
  
  // Phase 3 (Loading Statuses) simulation states
  const [loadingStatus, setLoadingStatus] = useState('');
  const [stepProgress, setStepProgress] = useState(0);

  // Virtual pointer states
  const [pointerStyle, setPointerStyle] = useState({ top: '65%', left: '85%', opacity: 0 });
  const [isClicking, setIsClicking] = useState(false);

  // Computed Analysis Result
  const [computedResult, setComputedResult] = useState<AnalysisResult | null>(null);
  const [simRemodelingApplied, setSimRemodelingApplied] = useState(false);

  // Ref for results auto scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate remodeling results on mount/update so it's ready
  useEffect(() => {
    async function calculateResult() {
      try {
        const rawAnalysis = {
          age: 40,
          gender: 'M' as const,
          name: '홍길동',
          mobile: '01012345678',
          selectedCategory: 'remodeling',
          monthlyPremium: 506774,
          cancer: { currentAmount: 190000000, targetAmount: 50000000 },
          cerebrovascular: { currentAmount: 120000000, targetAmount: 30000000 },
          cardiovascular: { currentAmount: 120000000, targetAmount: 30000000 },
          surgery: { currentAmount: 9000000, targetAmount: 10000000 },
          postDisability: { currentAmount: 0, targetAmount: 30000000 },
          paymentExemption: 'standard' as const,
          healthStatus: 'standard' as const,
          _remodelingCoverage: {
            age: 40,
            gender: 'M' as const,
            current_total_premium: 506774,
            cancer_diagnosis: 190000000,
            brain_vascular: 120000000,
            ischemic_heart: 120000000,
            caregiver_expense: 200000,
            silson: true,
            surgery_amount: 9000000,
            post_disability_amount: 0,
            policies: MOCK_REMODELING_DATA.overpaying.policies
          }
        };
        const result = await analyzeRemodeling(rawAnalysis);
        setComputedResult(result);
      } catch (err) {
        console.error('Failed to compute mock remodeling results:', err);
      }
    }
    calculateResult();
  }, []);

  // Timeline manager
  useEffect(() => {
    if (!isPlaying) {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      return;
    }

    let timer: NodeJS.Timeout;

    if (activeStep === 'input') {
      // Reset simulator values
      setSimName('');
      setSimGender(null);
      setSimBirthDate('');
      setSimAge('');
      setSimMobile('');
      setLoadingStatus('');
      setStepProgress(0);

      // Pointer appears
      setPointerStyle({ top: '65%', left: '85%', opacity: 1 });

      // T1: Type Birthdate "19800101"
      timer = setTimeout(() => {
        setPointerStyle({ top: '25%', left: '28%', opacity: 1 });

        const fullBirth = '19800101';
        let typedBirth = '';
        const birthInterval = setInterval(() => {
          if (typedBirth.length < fullBirth.length) {
            typedBirth += fullBirth[typedBirth.length];
            setSimBirthDate(typedBirth);
          } else {
            clearInterval(birthInterval);
          }
        }, 100);

        // T2: Type Age "40"
        setTimeout(() => {
          setPointerStyle({ top: '25%', left: '72%', opacity: 1 });

          const fullAge = '40';
          let typedAge = '';
          const ageInterval = setInterval(() => {
            if (typedAge.length < fullAge.length) {
              typedAge += fullAge[typedAge.length];
              setSimAge(typedAge);
            } else {
              clearInterval(ageInterval);
            }
          }, 150);

          // T3: Click Gender "남성"
          setTimeout(() => {
            setPointerStyle({ top: '36%', left: '28%', opacity: 1 });

            setTimeout(() => {
              setIsClicking(true);
              setSimGender('M');
              setTimeout(() => setIsClicking(false), 150);

              // T4: Click CTA "내 보험 정밀 분석 시작하기"
              setTimeout(() => {
                setPointerStyle({ top: '55%', left: '50%', opacity: 1 });

                setTimeout(() => {
                  setIsClicking(true);
                  setTimeout(() => {
                    setIsClicking(false);
                    setActiveStep('loading');
                  }, 150);
                }, 600);
              }, 1200);
            }, 600);
          }, 1000);
        }, 1200);
      }, 800);

    } else if (activeStep === 'loading') {
      setStepProgress(0);
      setPointerStyle(prev => ({ ...prev, opacity: 0 }));

      const statuses = [
        '🔒 보안 통신망을 안전하게 개설하는 중...',
        '📡 한국신용정보원(내보험다보여) 서버 연결 중...',
        '🔍 가입된 모든 보험 상품 기본 정보 수집 중...',
        '📝 상품명, 납입료, 연령, 성별 정보 수집 완료...',
        isB2BMode ? '⚙️ 비교분석 엔진이 0.1초 만에 최적의 보장 금액을 정교하게 추정하는 중...' : '🤖 제미나이 AI가 0.1초 만에 최적의 보장 금액을 정교하게 추정하는 중...',
        isB2BMode ? '💎 표준 설계 요율 테이블 실시간 매칭 연산 완료!' : '💎 Supabase 표준 설계 요율 테이블 실시간 매칭 연산 완료!',
        isB2BMode ? '✨ 웅장한 비교 분석 포트폴리오 및 리모델링 대시보드 산출 완료!' : '✨ 웅장한 AI 분석 포트폴리오 및 리모델링 대시보드 산출 완료!'
      ];

      let currentIndex = 0;
      setLoadingStatus(statuses[0]);

      const interval = setInterval(() => {
        currentIndex++;
        if (currentIndex < statuses.length) {
          setLoadingStatus(statuses[currentIndex]);
          setStepProgress((currentIndex / statuses.length) * 100);
        } else {
          clearInterval(interval);
          setStepProgress(100);
          setActiveStep('result');
        }
      }, 500);

      return () => clearInterval(interval);

    } else if (activeStep === 'result') {
      setStepProgress(0);
      setPointerStyle(prev => ({ ...prev, opacity: 0 }));

      let scrollTimer: NodeJS.Timeout;

      scrollTimer = setTimeout(() => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        container.scrollTop = 0;
        if (progressBarRef.current) {
          progressBarRef.current.style.width = '0%';
        }

        const scrollSpeed = 2.5; // pixels per frame (smooth)

        const animateScroll = () => {
          if (!container) return;
          const contentHeight = contentRef.current ? contentRef.current.offsetHeight : container.scrollHeight;
          const visibleContentHeight = contentHeight * 0.5;
          const maxScroll = Math.max(0, visibleContentHeight - container.clientHeight);

          if (container.scrollTop < maxScroll) {
            container.scrollTop += scrollSpeed;
            const progress = (container.scrollTop / maxScroll) * 100;
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${progress}%`;
            }
            scrollRafRef.current = requestAnimationFrame(animateScroll);
          } else {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = '100%';
            }
            // Hold at the bottom
            timer = setTimeout(() => {
              setActiveStep('input');
              setSimRemodelingApplied(false);
            }, 3000);
          }
        };

        scrollRafRef.current = requestAnimationFrame(animateScroll);
      }, 2500);

      return () => {
        clearTimeout(scrollTimer);
        if (scrollRafRef.current) {
          cancelAnimationFrame(scrollRafRef.current);
          scrollRafRef.current = null;
        }
      };
    }

    return () => {
      clearTimeout(timer);
    };
  }, [activeStep, isPlaying]);

  const handleStepClick = (step: StepType) => {
    setActiveStep(step);
    if (step === 'input') {
      setSimName('');
      setSimGender(null);
      setSimBirthDate('');
      setSimAge('');
      setSimMobile('');
      setSimRemodelingApplied(false);
    }
  };

  return (
    <section className="w-full py-16 px-4 bg-slate-900 text-white rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden mb-20 max-w-[1600px] mx-auto">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Bezel Framed Smartphone Mockup (40% / 5 cols) */}
        <div className="lg:col-span-5 flex justify-center relative select-none">
          
          {/* Phone Frame */}
          <div className="relative w-[340px] h-[690px] bg-slate-950 rounded-[3rem] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),_0_0_0_1px_rgba(255,255,255,0.15)] border-4 border-slate-800 flex flex-col overflow-hidden">
            
            {/* Camera notch / Dynamic Island */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-end px-4 gap-1">
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
              <div className="w-1 h-1 bg-slate-850 rounded-full" />
            </div>

            {/* Status Bar */}
            <div className="w-full h-8 flex justify-between items-center px-6 pt-1 text-[10px] font-bold text-white/90 z-40 bg-slate-900/50 backdrop-blur-sm">
              <span>16:22</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <div className="flex items-end gap-0.5 h-2">
                  <div className="w-0.5 h-1 bg-white rounded-full" />
                  <div className="w-0.5 h-1.5 bg-white rounded-full" />
                  <div className="w-0.5 h-2 bg-white rounded-full" />
                </div>
                <div className="w-5 h-2.5 border border-white/60 rounded-[3px] p-[1px] flex items-center">
                  <div className="h-full w-4 bg-orange-500 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Web Viewport */}
            <div className="w-full flex-1 bg-slate-50 rounded-[2.2rem] overflow-hidden flex flex-col relative text-slate-850 font-sans">
              
              {/* Browser URL Bar */}
              <div className="w-full bg-slate-100 border-b border-slate-200/60 p-2 flex items-center gap-2">
                <div className="flex gap-1.5 pl-1">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-lg py-0.5 px-3 text-[9px] text-slate-450 font-medium text-center truncate flex items-center justify-center gap-1">
                  <span className="text-emerald-500">🔒</span> {isB2BMode ? 'ins-comparison.co.kr' : 'bohum-rebalance.co.kr'}
                </div>
              </div>

              {/* Viewport content */}
              <div className="w-full flex-1 flex flex-col overflow-hidden relative bg-white">
                
                {/* PHASE 1: INPUTS */}
                {activeStep === 'input' && (
                  <div className="flex-1 flex flex-col p-5 bg-slate-900 text-white overflow-y-auto">
                    <div className="mb-4 text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-[9px] font-black tracking-widest border border-orange-500/20 mb-2">
                        {isB2BMode ? '🛡️ INSURANCE REMODELING' : '🛡️ AI INSURANCE REMODELING'}
                      </div>
                      <h4 className="text-sm font-black text-white leading-tight">내 보험 정밀 분석</h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">간편인증 한번으로 가입된 전보험사 분석</p>
                    </div>

                    <div className="space-y-3 mt-2 flex-1">
                      {/* Birth & Age */}
                      <div className="grid grid-cols-2 gap-2 text-left">
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-slate-450 uppercase pl-1">생년월일 (8자리)</label>
                          <input
                            type="text"
                            readOnly
                            placeholder="예) 19800101"
                            value={simBirthDate}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-bold text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-[8px] font-bold text-slate-450 uppercase pl-1">나이</label>
                          <div className="relative">
                            <input
                              type="text"
                              readOnly
                              placeholder="예) 40"
                              value={simAge}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs font-bold text-white focus:outline-none"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-500 text-xs">세</span>
                          </div>
                        </div>
                      </div>

                      {/* Gender Select */}
                      <div className="space-y-1 text-left">
                        <label className="text-[8px] font-bold text-slate-450 uppercase pl-1">성별</label>
                        <div className="flex bg-white/5 p-0.5 rounded-xl h-[34px] gap-0.5 border border-white/10">
                          <div className={`flex-1 rounded-lg font-black text-[10px] flex items-center justify-center transition-all ${simGender === 'M' ? 'bg-white text-slate-900 font-extrabold' : 'text-slate-400'}`}>
                            남성
                          </div>
                          <div className={`flex-1 rounded-lg font-black text-[10px] flex items-center justify-center transition-all ${simGender === 'F' ? 'bg-orange-500 text-white font-extrabold' : 'text-slate-400'}`}>
                            여성
                          </div>
                        </div>
                      </div>

                      {/* Info Banner */}
                      <div className="bg-slate-950/60 border border-orange-500/20 rounded-2xl p-3 flex gap-2 text-left mt-2 shadow-inner">
                        <span className="text-xs">🛡️</span>
                        <p className="text-[9px] font-bold text-slate-350 leading-relaxed break-keep">
                          동의 없는 광고성 전화를 일절 유도하지 않으며, 자가진단 분석 단계에서는 정보가 마스킹 처리되어 안전하게 보장됩니다.
                        </p>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <div className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 mt-4">
                      내 보험 정밀 분석 시작하기
                      <ChevronRight size={14} />
                    </div>
                  </div>
                )}



                {/* PHASE 3: LOADING STATUSES */}
                {activeStep === 'loading' && (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-white">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500">
                        <Lock className="w-5 h-5 animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-center max-w-[240px]">
                      <h5 className="text-xs font-black text-white">한국신용정보원 API 연동 중</h5>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${stepProgress}%` }} />
                      </div>
                      <p className="text-[9px] text-slate-450 font-bold leading-relaxed min-h-[36px] transition-all duration-300">
                        {loadingStatus}
                      </p>
                    </div>
                  </div>
                )}

                {/* PHASE 4: ANALYSIS DASHBOARD (SCALED DOWN) */}
                {activeStep === 'result' && (
                  <div className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
                    {/* Top progress indicator bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 z-50">
                      <div 
                        ref={progressBarRef}
                        className="h-full bg-orange-500" 
                        style={{ width: '0%' }} 
                      />
                    </div>

                    <div 
                      ref={scrollContainerRef}
                      className="w-full flex-1 overflow-y-auto scrollbar-none text-slate-800"
                      style={{ scrollBehavior: 'auto' }}
                      onWheel={() => setIsPlaying(false)}
                      onTouchStart={() => setIsPlaying(false)}
                      onMouseDown={() => setIsPlaying(false)}
                    >
                      {/* Scale down the dashboard to fit mobile viewport (50% scale) */}
                      <div ref={contentRef} className="w-[200%] origin-top-left scale-[0.5] pb-24 p-6 bg-slate-50 text-left">
                        {computedResult ? (
                          <div className="space-y-16">
                            {/* AI Executive Summary 코멘트 카드 */}
                            {(() => {
                              const coverage = (computedResult.analysis as any)._remodelingCoverage;
                              const totalPremium = computedResult.analysis.monthlyPremium || 0;
                              const cheapestPremium = computedResult.recommendations.diet?.estimatedPremium || 0;
                              const savingAmount = totalPremium - cheapestPremium;
                              const policies = coverage?.policies || [];
                              
                              // 중복 가입 건수 계산
                              const dups = new Set<number>();
                              for (let i = 0; i < policies.length; i++) {
                                for (let j = i + 1; j < policies.length; j++) {
                                  const a = policies[i].product_name.replace(/\(보장종료 \d+\)/g, '').trim();
                                  const b = policies[j].product_name.replace(/\(보장종료 \d+\)/g, '').trim();
                                  if (a === b || (a.length > 10 && (b.includes(a.slice(0, 12)) || a.includes(b.slice(0, 12))))) {
                                    dups.add(i); dups.add(j);
                                  }
                                }
                              }

                              return (
                                <div className="bg-orange-50/50 border border-orange-100/60 rounded-[3rem] p-8 flex flex-col gap-6 items-center text-left">
                                  <div className="flex items-center gap-4 w-full">
                                    <div className="w-16 h-16 rounded-3xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                                      <Sparkles size={28} className="animate-pulse" />
                                    </div>
                                    <div className="space-y-1 flex-1">
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black">
                                        📢 {isB2BMode ? '종합 분석 리포트 요약' : 'AI 종합 분석 리포트 요약'}
                                      </div>
                                      <h4 className="text-xl font-black text-slate-800 tracking-tight leading-snug">
                                        매달 합리적으로 조정 가능한 보험료 <span className="text-orange-500 underline underline-offset-4 font-black">{savingAmount.toLocaleString()}원</span>을 찾아냈습니다!
                                      </h4>
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-slate-550 font-semibold leading-relaxed break-keep w-full">
                                    고객님은 현재 총 <span className="text-slate-800 font-extrabold">{policies.length}건</span>의 보험을 유지 중이시며, 이 중 <span className="text-red-500 font-extrabold">{dups.size}건의 중복 가입 상품</span>이 확인되었습니다. 
                                    불필요한 과납 보장과 사망 위주의 주계약 비용을 최적화하면, 기존 핵심 보장은 동일하게 지키면서 매월 총 <span className="text-orange-500 font-extrabold">{savingAmount.toLocaleString()}원</span>의 기회 자산을 확보하실 수 있습니다.
                                  </p>

                                  {/* CTA 버튼 / 신청 완료 상태 */}
                                  <div className="pt-6 border-t border-orange-200/40 w-full">
                                    {simRemodelingApplied ? (
                                      <div className="p-6 bg-emerald-500 text-white rounded-3xl text-center shadow-lg shadow-emerald-500/20">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-emerald-500 text-xs font-black mb-2">✓</span>
                                        <p className="text-sm font-black">100점 보완 및 절감 설계안 신청이 완료되었습니다!</p>
                                        <p className="text-xs text-emerald-100 font-bold mt-1">전담 설계사가 분석된 고객 DB 정보를 확인하여 카카오톡으로 상세 설계안을 0.1초 만에 발송해 드립니다.</p>
                                      </div>
                                    ) : (
                                      <div className="bg-slate-900 border border-orange-500/30 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col justify-between gap-6 text-white text-left relative overflow-hidden">
                                        <div className="space-y-1.5 relative z-10">
                                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-md text-[8px] font-black uppercase tracking-widest border border-orange-500/20">
                                            🔥 보완설계 & 보험료 절감
                                          </div>
                                          <h5 className="text-sm font-black text-white">
                                            분석 점수 65점 ➡️ 100점으로 올리는 맞춤 보완 설계안 신청
                                          </h5>
                                          <p className="text-[11px] text-slate-400 font-bold leading-normal">
                                            월 {savingAmount.toLocaleString()}원을 즉시 아낄 수 있는 리모델링 상세 계획서 및 카카오톡 무료 상담을 신청하시겠습니까?
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => setSimRemodelingApplied(true)}
                                          className="px-6 py-4.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-xl text-xs shrink-0 shadow-[0_10px_20px_-4px_rgba(255,107,0,0.4)] transform transition-all hover:scale-105 active:scale-95 cursor-pointer text-center relative z-10"
                                        >
                                          👉 실시간 고객 상담 무료 신청
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* 실시간 조회된 나의 가입 보험 내역 */}
                            {(() => {
                              const coverage = (computedResult.analysis as any)._remodelingCoverage;
                              const totalPremium = coverage.current_total_premium ||
                                coverage.policies.reduce((s: number, p: any) => s + (p.monthly_premium || 0), 0);
                              return (
                                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-[3rem] p-8 space-y-8 text-left shadow-sm">
                                  {/* Header */}
                                  <div className="flex flex-col justify-between gap-6 border-b border-slate-200/60 pb-8">
                                    <div className="space-y-2">
                                      <span className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block">
                                        🛡️ Verified Holdings
                                      </span>
                                      <h3 className="text-2xl font-black text-slate-800">
                                        실시간 조회된 나의 가입 보험 내역
                                      </h3>
                                    </div>
                                    <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-6 self-start shrink-0">
                                      <div>
                                        <span className="text-[10px] font-black text-slate-400 block uppercase">총 가입 건수</span>
                                        <span className="text-xl font-black text-slate-800">{coverage.policies.length}건</span>
                                      </div>
                                      <div className="h-8 w-px bg-slate-100" />
                                      <div>
                                        <span className="text-[10px] font-black text-slate-400 block uppercase">월 총 납입료</span>
                                        <span className="text-xl font-black text-orange-600">{totalPremium.toLocaleString()}원</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* 고객 안내 사항 배너 */}
                                  <div className="bg-orange-50/50 border border-orange-100/60 p-5 rounded-2xl text-left">
                                    <p className="text-xs text-orange-600 font-extrabold flex items-center gap-1.5 mb-1.5">
                                      <span>💡</span> 고객 안내 사항 (데이터 출처 안내)
                                    </p>
                                    <p className="text-xs text-slate-650 font-semibold leading-relaxed break-keep">
                                      본 리스트의 <span className="text-slate-800 font-extrabold">보험 회사, 상품명, 월 납입 보험료</span>는 한국신용정보원 본인정보 열람서비스(내보험다보여)를 통해 실시간으로 수집된 실제 가입 정보입니다. 다만, <span className="text-slate-800 font-extrabold">가입 특약 및 세부 보장 금액</span>은 AI 엔진이 표준 요율을 기반으로 역산하여 추정한 분석값이므로, 실제 가입 증권과 차이가 있을 수 있습니다.
                                    </p>
                                  </div>

                                  {/* Policy Cards */}
                                  <div className="grid grid-cols-1 gap-6">
                                    {coverage.policies.map((policy: any, pIdx: number) => (
                                      <div key={pIdx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
                                        <div className="space-y-4">
                                          <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                              {policy.insurance_company && (
                                                <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black">
                                                  {maskCompany(policy.insurance_company, false)}
                                                </span>
                                              )}
                                              <h4 className="text-base font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                                {maskProductName(policy.product_name, false)}
                                              </h4>
                                            </div>
                                            <div className="text-right shrink-0">
                                              <span className="text-[9px] font-black text-slate-400 block uppercase">월 보험료</span>
                                              <span className="text-lg font-black text-slate-800">{policy.monthly_premium?.toLocaleString()}원</span>
                                            </div>
                                          </div>

                                          {policy.riders?.length > 0 && (
                                            <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100/80 space-y-2">
                                              <span className="text-[9px] font-black text-slate-400 block uppercase mb-1">가입 특약 내역</span>
                                              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                                                {policy.riders.map((rider: any, rIdx: number) => (
                                                  <div key={rIdx} className="flex justify-between items-center text-xs font-bold text-slate-600 py-0.5 border-b border-dashed border-slate-100 last:border-0">
                                                    <span className="truncate max-w-[180px]">{rider.rider_name}</span>
                                                    <span className="text-slate-900 shrink-0">
                                                      {rider.coverage_amount >= 100000000
                                                        ? `${(rider.coverage_amount / 100000000).toFixed(0)}억원`
                                                        : `${(rider.coverage_amount / 10000).toLocaleString()}만원`}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* 종합 리모델링 결과 */}
                            <div className="text-center mt-16">
                              <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] text-white mb-4">
                                📊 Comprehensive Remodeling Result
                              </div>
                              <h3 className="text-3xl font-black text-gray-900 tracking-tighter">전체 보험 포트폴리오 종합 분석</h3>
                            </div>

                            <AnalysisDashboard 
                              result={computedResult}
                              isUnlocked={false}
                              forceMobile={true}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-96 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-800 animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Result Footer Panel inside phone */}
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-white/10 px-4 py-3 flex justify-between items-center z-40 shadow-[0_-10px_25px_rgba(0,0,0,0.3)]">
                      <div className="text-[8px] font-black text-slate-400">
                        고유 설계 코드: <span className="text-orange-400 uppercase tracking-widest font-black font-mono">{(computedResult?.analysis as any)?.simulation_code || 'SIM-407'}</span>
                      </div>
                      <div className="px-2.5 py-1 bg-orange-500 text-white text-[8px] font-black rounded-lg shadow">
                        리모델링 상담 신청
                      </div>
                    </div>
                  </div>
                )}

                {/* Simulated Virtual Cursor/Pointer */}
                <div 
                  className="absolute pointer-events-none rounded-full w-5 h-5 bg-orange-500/60 border border-white shadow-lg z-50 transition-all duration-500 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: pointerStyle.top,
                    left: pointerStyle.left,
                    opacity: pointerStyle.opacity,
                    scale: isClicking ? 0.8 : 1.0,
                    boxShadow: isClicking ? '0 0 10px 4px rgba(249,115,22,0.6)' : '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Interaction Flow Controls and Description (7 cols) */}
        <div className="lg:col-span-7 flex flex-col text-left justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 text-orange-500 rounded-full text-xs font-black uppercase tracking-widest border border-orange-500/20">
              <Sparkles size={14} className="text-orange-500" /> High-Fidelity Simulator
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              실제 앱과 동일한<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400">내 보험 정밀 분석</span> 재현
            </h2>
            <p className="text-slate-400 font-bold text-sm leading-relaxed max-w-xl break-keep">
              단순히 이미지만 슬라이드 형태로 보여주는 더미 애니메이션이 아닙니다. 이름이나 연락처 등 개인정보를 전혀 요구하지 않고, 고객의 연령·성별 및 관심 보장 정보만을 기반으로 {isB2BMode ? '표준 설계 요율 테이블과 대조하여 분석하는' : '분석 시스템이 표준 설계 요율 테이블과 대조하여 분석하는'} 전 과정을 실제 앱의 코드로 동일하게 재현합니다.
            </p>
          </div>

          {/* Steps Timeline Trackers */}
          <div className="space-y-3 max-w-xl">
            {/* Step 1 */}
            <div 
              onClick={() => handleStepClick('input')}
              className={`p-4.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                activeStep === 'input' 
                  ? 'bg-gradient-to-r from-orange-500/15 via-orange-500/[0.03] to-slate-900 border-orange-500/30' 
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                  activeStep === 'input' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  01
                </div>
                <div className="text-left">
                  <h4 className={`text-xs font-black ${activeStep === 'input' ? 'text-orange-500' : 'text-slate-300'}`}>
                    정밀 분석 입력 폼 (Inputs)
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">생년월일과 성별 정보를 차례대로 가상 타이핑합니다.</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeStep === 'input' ? 'text-orange-500' : 'text-slate-650'}`} />
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => handleStepClick('loading')}
              className={`p-4.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                activeStep === 'loading' 
                  ? 'bg-gradient-to-r from-orange-500/15 via-orange-500/[0.03] to-slate-900 border-orange-500/30' 
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                  activeStep === 'loading' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  02
                </div>
                <div className="text-left">
                  <h4 className={`text-xs font-black ${activeStep === 'loading' ? 'text-orange-500' : 'text-slate-300'}`}>
                    0.1초 {isB2BMode ? '정밀 분석 및 매칭' : 'AI 정밀 분석 및 매칭'} (Engine)
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">입력된 최소한의 기본 정보와 표준 설계 요율 테이블을 0.1초 만에 실시간으로 매칭하여 {isB2BMode ? '자율 진단 보장 점수를' : 'AI가 자율 진단 보장 점수를'} 초정밀 연산합니다.</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeStep === 'loading' ? 'text-orange-500' : 'text-slate-650'}`} />
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => handleStepClick('result')}
              className={`p-4.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                activeStep === 'result' 
                  ? 'bg-gradient-to-r from-orange-500/15 via-orange-500/[0.03] to-slate-900 border-orange-500/30' 
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                  activeStep === 'result' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  03
                </div>
                <div className="text-left">
                  <h4 className={`text-xs font-black ${activeStep === 'result' ? 'text-orange-500' : 'text-slate-300'}`}>
                    진단 리포트 출력 및 자동 스크롤 (Report)
                  </h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">실제 대시보드 컴포넌트를 스케일 다운 렌더링하고 위에서 아래로 자동 탐색합니다.</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeStep === 'result' ? 'text-orange-500' : 'text-slate-650'}`} />
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center gap-4 border-t border-slate-800 pt-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-6 py-3.5 rounded-2xl font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
                isPlaying 
                  ? 'bg-slate-800 text-white hover:bg-slate-750 border border-slate-700' 
                  : 'bg-orange-500 text-white hover:bg-orange-650'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause size={14} fill="currentColor" /> 일시 정지
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" /> 자동 재생
                </>
              )}
            </button>
            <button
              onClick={() => handleStepClick('input')}
              className="px-6 py-3.5 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750 rounded-2xl font-black text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <RotateCcw size={14} /> 처음부터
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
