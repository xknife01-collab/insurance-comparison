import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Shield, 
  Target, 
  Activity, 
  Clock, 
  Heart,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import AnalysisDashboard from './AnalysisDashboard';
import { AnalysisResult } from '../types/insurance';

type StepType = 'input' | 'loading' | 'result';

// Generate 30 masked compliance-friendly products
const generateMaskedProducts = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const products = [];
  
  for (let i = 0; i < 30; i++) {
    const companyCode = letters[i % 26] + (i >= 26 ? '2' : '') + '사';
    const isRecommended = i === 0;
    const premium = 32400 + (i * 1250) + Math.floor(Math.sin(i) * 350);
    
    products.push({
      rank: i + 1,
      company: `${companyCode} 손해보험`,
      productName: `${companyCode} (무)실손더든든 암보험(개정)`,
      premium: Math.round(premium / 10) * 10,
      isRecommended,
      badge: isRecommended ? '최적가 추천' : i < 3 ? '가성비 우수' : undefined
    });
  }
  return products;
};

const MOCKED_PRODUCTS = generateMaskedProducts();

// High-precision mock AnalysisResult mirroring what the real engine produces for cancer
const mockAnalysisResult: AnalysisResult = {
  analysis: {
    age: 36,
    gender: 'M',
    name: '홍길동',
    mobile: '010-1234-5678',
    selectedCategory: '암보험',
    monthlyPremium: 98000,
    cancer: {
      currentAmount: 30000000,
      targetAmount: 50000000
    },
    cerebrovascular: { currentAmount: 10000000, targetAmount: 20000000 },
    cardiovascular: { currentAmount: 10000000, targetAmount: 20000000 },
    surgery: { currentAmount: 0, targetAmount: 1 },
    postDisability: { currentAmount: 0, targetAmount: 1 },
    paymentExemption: 'standard',
    healthStatus: 'standard',
    _allOptions: MOCKED_PRODUCTS.map(p => ({
      premium: p.premium,
      productName: p.productName,
      companyName: p.company
    }))
  },
  scores: {
    totalScore: 98,
    cancerScore: 98,
    cerebrovascularScore: 70,
    cardiovascularScore: 70
  },
  efficiency: 98.5,
  deficiencies: ['최신 암주요치료비 미가입', '중입자/표적항암 치료비 공백', '일반암 진단비 부족'],
  recommendations: {
    diet: {
      title: `[A사 손해보험] 실속 암진단 집중 플랜`,
      description: `불필요한 사망 보장을 최소화하고 핵심 암 진단비만 골라 담은 가성비 1등 플랜입니다.`,
      productName: `(무)실손더든든 암보험(개정)`,
      companyName: `A사 손해보험`,
      estimatedPremium: 32400,
      coverageChanges: [
        '일반암 진단비 최대 확보',
        '비유사암 전이 시 보장 강화',
        '업계 최저 수준 보험료'
      ],
      switchingLossNotice: '기존 보험 해지 후 재가입 시 조건 및 연령에 따라 제한이 생길 수 있습니다.'
    },
    upgrade: {
      title: `[A사 손해보험] 2025 암주요치료비 결합 플랜`,
      description: `진단비는 물론, 연간 최대 1억 원까지 지급되는 암 주요 치료비 특약이 포함된 최신 트렌드 플랜입니다.`,
      productName: `(무)실손더든든 암보험(개정)`,
      companyName: `A사 손해보험`,
      estimatedPremium: 32400,
      coverageChanges: ['암 주요 치료비(비급여) 포함', '표적항암제 한도 상향', '뇌/심장 2대 질환 복합 보장'],
      switchingLossNotice: '기존 암보험 해지 후 재가입 시 감액 기간이 적용될 수 있습니다.',
    },
    hybrid: {
      title: `[A사 손해보험] 평생 보장 비갱신 프리미엄`,
      description: `보험료 인상 걱정 없이 100세까지 든든하게 보장받는 명품 암보험입니다.`,
      productName: `(무)실손더든든 암보험(개정)`,
      companyName: `A사 손해보험`,
      estimatedPremium: 32400,
      coverageChanges: ['비갱신형 고정 보험료', '재발암/전이암 반복 지급', 'VIP 건강검진 서비스 연계'],
      switchingLossNotice: '보험료 인상 가능성이 있는 갱신형 상품의 경우 장기 보험료를 반드시 확인하세요.',
    }
  }
};

export default function MobileShowcase() {
  const [activeStep, setActiveStep] = useState<StepType>('input');
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Phase 1 (Input) simulation states
  const [simBirthDate, setSimBirthDate] = useState('');
  const [simGender, setSimGender] = useState<'M' | 'F' | null>(null);
  
  // Precision fields matching our real app
  const [simDiagnosisAmount, setSimDiagnosisAmount] = useState(30000000);
  const [simTreatmentCost2025, setSimTreatmentCost2025] = useState(false);
  const [simTargetedTherapy, setSimTargetedTherapy] = useState(false);
  const [simPaymentType, setSimPaymentType] = useState<'non-renewable' | 'renewable' | 'targeted'>('non-renewable');
  const [simRecurrentCancer, setSimRecurrentCancer] = useState(false);
  const [simFamilyHistory, setSimFamilyHistory] = useState(false);
  
  const [pointerStyle, setPointerStyle] = useState({ top: '25%', left: '50%', opacity: 0 });
  const [isClicking, setIsClicking] = useState(false);
  
  // Progress indicators
  const [stepProgress, setStepProgress] = useState(0);
  
  // Ref for results auto scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timeline manager
  useEffect(() => {
    if (!isPlaying) {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      return;
    }

    let timer: NodeJS.Timeout;
    
    if (activeStep === 'input') {
      // Reset simulator values to initial states
      setSimBirthDate('');
      setSimGender(null);
      setSimDiagnosisAmount(30000000);
      setSimTreatmentCost2025(false);
      setSimTargetedTherapy(false);
      setSimPaymentType('non-renewable');
      setSimRecurrentCancer(false);
      setSimFamilyHistory(false);
      setStepProgress(0);
      
      // Pointer appears at bottom right
      setPointerStyle({ top: '65%', left: '85%', opacity: 1 });
      
      // T1: Type Birthday
      timer = setTimeout(() => {
        setPointerStyle({ top: '21%', left: '40%', opacity: 1 });
        
        const fullDate = '19900515';
        let typed = '';
        const typeInterval = setInterval(() => {
          if (typed.length < fullDate.length) {
            typed += fullDate[typed.length];
            setSimBirthDate(typed);
          } else {
            clearInterval(typeInterval);
          }
        }, 100);
        
        // T2: Click Gender "남성"
        setTimeout(() => {
          setPointerStyle({ top: '30%', left: '33%', opacity: 1 });
          
          setTimeout(() => {
            setIsClicking(true);
            setSimGender('M');
            setTimeout(() => setIsClicking(false), 150);
            
            // T3: Click 일반암 진단비 "5,000만"
            setTimeout(() => {
              setPointerStyle({ top: '43%', left: '50%', opacity: 1 });
              
              setTimeout(() => {
                setIsClicking(true);
                setSimDiagnosisAmount(50000000);
                setTimeout(() => setIsClicking(false), 150);
                
                // T4: Click 2025 암주요치료비 "포함(추천)"
                setTimeout(() => {
                  setPointerStyle({ top: '53%', left: '33%', opacity: 1 });
                  
                  setTimeout(() => {
                    setIsClicking(true);
                    setSimTreatmentCost2025(true);
                    setTimeout(() => setIsClicking(false), 150);
                    
                    // T5: Click 표적항암/중입자 "풀보장"
                    setTimeout(() => {
                      setPointerStyle({ top: '63%', left: '33%', opacity: 1 });
                      
                      setTimeout(() => {
                        setIsClicking(true);
                        setSimTargetedTherapy(true);
                        setTimeout(() => setIsClicking(false), 150);
                        
                        // T6: Click 납입/갱신 유형 "비갱신형"
                        setTimeout(() => {
                          setPointerStyle({ top: '73%', left: '25%', opacity: 1 });
                          
                          setTimeout(() => {
                            setIsClicking(true);
                            setSimPaymentType('non-renewable');
                            setTimeout(() => setIsClicking(false), 150);
                            
                            // T7: Click 재발/전이암 "반복지급"
                            setTimeout(() => {
                              setPointerStyle({ top: '83%', left: '33%', opacity: 1 });
                              
                              setTimeout(() => {
                                setIsClicking(true);
                                setSimRecurrentCancer(true);
                                setTimeout(() => setIsClicking(false), 150);
                                
                                // T8: Click 암 가족력 "없음"
                                setTimeout(() => {
                                  setPointerStyle({ top: '92%', left: '75%', opacity: 1 });
                                  
                                  setTimeout(() => {
                                    setIsClicking(true);
                                    setSimFamilyHistory(false);
                                    setTimeout(() => setIsClicking(false), 150);
                                    
                                    // T9: Click CTA "0.1초 실시간 비교 분석하기"
                                    setTimeout(() => {
                                      setPointerStyle({ top: '97%', left: '50%', opacity: 1 });
                                      
                                      setTimeout(() => {
                                        setIsClicking(true);
                                        setTimeout(() => {
                                          setIsClicking(false);
                                          setActiveStep('loading');
                                        }, 150);
                                      }, 600);
                                    }, 800);
                                  }, 600);
                                }, 800);
                              }, 600);
                            }, 800);
                          }, 600);
                        }, 800);
                      }, 600);
                    }, 800);
                  }, 600);
                }, 800);
              }, 600);
            }, 800);
          }, 800);
        }, 1200);
      }, 800);

    } else if (activeStep === 'loading') {
      setStepProgress(0);
      setPointerStyle(prev => ({ ...prev, opacity: 0 }));
      
      const startTime = Date.now();
      const duration = 800; // 0.8s
      
      const progInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(elapsed / duration, 1);
        setStepProgress(ratio * 100);
        
        if (ratio >= 1) {
          clearInterval(progInterval);
          setActiveStep('result');
        }
      }, 30);
      
      return () => clearInterval(progInterval);

    } else if (activeStep === 'result') {
      setStepProgress(0);
      setPointerStyle(prev => ({ ...prev, opacity: 0 }));
      
      let scrollTimer: NodeJS.Timeout;
      
      scrollTimer = setTimeout(() => {
        if (!scrollContainerRef.current) return;
        
        const container = scrollContainerRef.current;
        container.scrollTop = 0;
        
        scrollIntervalRef.current = setInterval(() => {
          if (!container) return;
          
          const maxScroll = container.scrollHeight - container.clientHeight;
          if (container.scrollTop < maxScroll) {
            container.scrollTop += 5.1; // Smooth scroll speed (6x faster)
            const progress = (container.scrollTop / maxScroll) * 100;
            setStepProgress(progress);
          } else {
            if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
            setStepProgress(100);
            
            // Hold at the bottom
            timer = setTimeout(() => {
              setActiveStep('input');
            }, 2500);
          }
        }, 16);
      }, 2000);

      return () => {
        clearTimeout(scrollTimer);
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      };
    }

    return () => {
      clearTimeout(timer);
    };
  }, [activeStep, isPlaying]);

  const handleStepClick = (step: StepType) => {
    setActiveStep(step);
    if (step === 'input') {
      setSimBirthDate('');
      setSimGender(null);
      setSimDiagnosisAmount(30000000);
      setSimTreatmentCost2025(false);
      setSimTargetedTherapy(false);
      setSimPaymentType('non-renewable');
      setSimRecurrentCancer(false);
      setSimFamilyHistory(false);
    }
  };

  return (
    <section className="w-full py-16 px-4 bg-slate-900 text-white rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden mb-20 max-w-[1600px] mx-auto">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

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
              <span>14:33</span>
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
            <div className="w-full flex-1 bg-slate-550 rounded-[2.2rem] overflow-hidden flex flex-col relative bg-slate-50 text-slate-850 font-sans">
              
              {/* Browser URL Bar */}
              <div className="w-full bg-slate-100 border-b border-slate-200/60 p-2 flex items-center gap-2">
                <div className="flex gap-1.5 pl-1">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-lg py-0.5 px-3 text-[9px] text-slate-450 font-medium text-center truncate flex items-center justify-center gap-1">
                  <span className="text-emerald-500">🔒</span> bohum-rebalance.co.kr
                </div>
              </div>

              {/* Viewport content */}
              <div className="w-full flex-1 flex flex-col overflow-hidden relative bg-white">
                
                {/* PHASE 1: EXACT CANCER FIELDS INPUTS */}
                {activeStep === 'input' && (
                  <div className="p-3.5 flex flex-col flex-1 text-left overflow-y-auto hide-scrollbar animate-in fade-in duration-300">
                    <div className="mb-3">
                      <span className="inline-block px-2 py-0.5 bg-rose-500/10 text-rose-600 rounded-full text-[8px] font-black uppercase tracking-wider mb-1">
                        암보험 정밀 계산
                      </span>
                      <h4 className="text-xs font-black text-slate-900 tracking-tight leading-tight">
                        실시간 암보험 정밀 분석
                      </h4>
                    </div>

                    <div className="space-y-2.5 flex-1 text-[10px]">
                      {/* Name & Birthday */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400">성함</label>
                          <div className="w-full bg-slate-50 border border-slate-100 rounded-lg p-1.5 font-bold text-slate-800 text-[10px]">
                            홍길동
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400">생년월일 (8자리)</label>
                          <div className="w-full bg-slate-50 border border-rose-300/40 rounded-lg p-1.5 font-black text-slate-800 text-[10px] relative">
                            {simBirthDate || <span className="text-slate-350">19900515</span>}
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 w-0.5 h-2.5 bg-rose-500 animate-pulse" />
                          </div>
                        </div>
                      </div>

                      {/* Gender Select */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400">성별</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className={`py-1.5 rounded-lg border text-center font-black transition-all ${simGender === 'M' ? 'border-rose-500 bg-rose-50/50 text-rose-600' : 'border-slate-200 bg-white text-slate-400'}`}>
                            남성
                          </div>
                          <div className="py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 text-center font-bold">
                            여성
                          </div>
                        </div>
                      </div>

                      {/* 일반암 진단비 */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400">일반암 진단비</label>
                        <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-100 text-[9px]">
                          {[30000000, 50000000, 100000000].map((v) => (
                            <button
                              key={v}
                              type="button"
                              className={`flex-1 py-1 rounded-md font-black transition-all ${simDiagnosisAmount === v ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-300'}`}
                            >
                              {(v/10000).toLocaleString()}만
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2025 암주요치료비 */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400">2025 암주요치료비 (핵심)</label>
                        <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-100 text-[9px]">
                          {[true, false].map((v) => (
                            <button
                              key={v ? 'y' : 'n'}
                              type="button"
                              className={`flex-1 py-1 rounded-md font-black transition-all ${simTreatmentCost2025 === v ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-300'}`}
                            >
                              {v ? '포함(추천)' : '미포함'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 표적항암/중입자 */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400">표적항암 / 중입자 치료비</label>
                        <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-100 text-[9px]">
                          {[true, false].map((v) => (
                            <button
                              key={v ? 'y' : 'n'}
                              type="button"
                              className={`flex-1 py-1 rounded-md font-black transition-all ${simTargetedTherapy === v ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-300'}`}
                            >
                              {v ? '풀보장' : '진단비만'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 납입/갱신 유형 */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400">납입 / 갱신 유형</label>
                        <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-100 text-[9px]">
                          {['non-renewable', 'renewable', 'targeted'].map((v) => (
                            <button
                              key={v}
                              type="button"
                              className={`flex-1 py-1 rounded-md font-black transition-all ${simPaymentType === v ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-300'}`}
                            >
                              {v === 'non-renewable' ? '비갱신형' : v === 'renewable' ? '갱신형' : '표적항암형'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 재발/전이암 & 가족력 */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400">재발 / 전이암</label>
                          <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-100 text-[8px]">
                            {[true, false].map((v) => (
                              <button
                                key={v ? 'y' : 'n'}
                                type="button"
                                className={`flex-1 py-1 rounded-md font-black transition-all ${simRecurrentCancer === v ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-300'}`}
                              >
                                {v ? '반복지급' : '1회지급'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400">암 가족력</label>
                          <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-100 text-[8px]">
                            {[true, false].map((v) => (
                              <button
                                key={v ? 'y' : 'n'}
                                type="button"
                                className={`flex-1 py-1 rounded-md font-black transition-all ${simFamilyHistory === v ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-300'}`}
                              >
                                {v ? '있음' : '없음'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl font-black text-[10px] shadow-md shadow-rose-500/10 active:scale-95 transition-all mt-2.5 flex-shrink-0">
                      0.1초 실시간 비교 분석하기
                    </button>
                  </div>
                )}

                {/* PHASE 2: LOADING */}
                {activeStep === 'loading' && (
                  <div className="p-6 flex flex-col items-center justify-center flex-1 text-center bg-slate-900 text-white animate-in fade-in duration-300">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
                      <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-rose-500 fill-current animate-pulse" />
                    </div>
                    <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block mb-2">AI 정밀 비교 연산</span>
                    <h4 className="text-xs font-black text-slate-100 tracking-tight leading-relaxed max-w-[200px] break-keep">
                      전 보험사 2025 최신 요율 전수 조사 및 매칭 검증 중...
                    </h4>
                    <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${stepProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* PHASE 3: LIVE RENDER OF THE REAL DASHBOARD COMPONENT */}
                {activeStep === 'result' && (
                  <div className="absolute inset-0 overflow-hidden bg-slate-50">
                    <div 
                      ref={scrollContainerRef}
                      className="absolute top-0 left-0 w-[200%] h-[200%] overflow-y-auto text-left flex flex-col bg-slate-50 select-none origin-top-left scale-[0.5] hide-scrollbar"
                      style={{ scrollBehavior: 'auto' }}
                    >
                       <AnalysisDashboard 
                         result={mockAnalysisResult} 
                         onSubmitLead={async () => null} 
                         branding={{ type: 'organic', name: '아이지에이수수', registrationNumber: '2020-IGA-SOOSOO' }} 
                         isUnlocked={true} 
                         forceMobile={true}
                       />
                    </div>
                  </div>
                )}

                {/* Virtual Pointer element */}
                <div 
                  className={`absolute pointer-events-none w-5 h-5 rounded-full border-2 border-white bg-rose-500/70 shadow-lg z-50 flex items-center justify-center transition-all duration-700 ease-in-out ${
                    isClicking ? 'scale-75 bg-rose-700' : 'scale-100'
                  }`}
                  style={{
                    top: pointerStyle.top,
                    left: pointerStyle.left,
                    opacity: pointerStyle.opacity,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Interactive step buttons & controls (7 cols) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 text-rose-400 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles size={14} className="animate-pulse text-rose-500" /> High-Fidelity Simulator
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              실제 앱과 100% 동일한<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-400">정밀 암보험 진단 과정</span>을 체험해 보세요
            </h3>
            <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-xl break-keep">
              암 주요 치료비 신설, 표적 항암 풀보장 등 실제 플랫폼 설계창의 상세 세부 항목들이 
              시뮬레이터 안에 그대로 이식되어 있습니다. AI 분석을 통한 부족한 핵심 보장 진단 피드백과 
              오각형 밸런스 차트 비교, 그리고 30개 전체 보험사 실시간 가격 대조까지 생생히 동작합니다.
            </p>
          </div>

          {/* Controls list */}
          <div className="space-y-4 max-w-xl">
            {/* Step 1 Button */}
            <button 
              onClick={() => handleStepClick('input')}
              className={`w-full p-5 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden flex flex-col gap-1 group ${
                activeStep === 'input' 
                  ? 'border-rose-500/50 bg-rose-500/[0.05] shadow-[0_15px_30px_-10px_rgba(244,63,94,0.15)]' 
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
                    activeStep === 'input' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}>
                    01
                  </span>
                  <span className="font-black text-base text-slate-200">정밀 입력 필드 가상 기입 (Inputs)</span>
                </div>
                <ChevronRight size={16} className={`text-slate-500 transition-transform ${activeStep === 'input' ? 'translate-x-1' : ''}`} />
              </div>
              <p className="text-xs text-slate-400 font-bold pl-10 mt-1 leading-normal break-keep">
                생년월일, 일반암 진단비 조절, 2025 암주요치료비 신설, 표적항암 풀보장, 납입유형, 재발암 등 앱 내 모든 정밀 설정을 차례로 클릭 및 기입하는 단계입니다.
              </p>
              
              {activeStep === 'input' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-850">
                  <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: '100%' }} />
                </div>
              )}
            </button>

            {/* Step 2 Button */}
            <button 
              onClick={() => handleStepClick('loading')}
              className={`w-full p-5 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden flex flex-col gap-1 group ${
                activeStep === 'loading' 
                  ? 'border-rose-500/50 bg-rose-500/[0.05] shadow-[0_15px_30px_-10px_rgba(244,63,94,0.15)]' 
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
                    activeStep === 'loading' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}>
                    02
                  </span>
                  <span className="font-black text-base text-slate-200">0.8초 실시간 AI 정밀 연산 (Engine)</span>
                </div>
                <ChevronRight size={16} className={`text-slate-500 transition-transform ${activeStep === 'loading' ? 'translate-x-1' : ''}`} />
              </div>
              <p className="text-xs text-slate-400 font-bold pl-10 mt-1 leading-normal break-keep">
                입력 데이터에 맞춰 전 보험사 최신 요율 조건 대조 및 AI 분석 엔진이 진단 처리를 완료합니다.
              </p>

              {activeStep === 'loading' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-850">
                  <div className="h-full bg-rose-500 transition-all" style={{ width: `${stepProgress}%` }} />
                </div>
              )}
            </button>

            {/* Step 3 Button */}
            <button 
              onClick={() => handleStepClick('result')}
              className={`w-full p-5 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden flex flex-col gap-1 group ${
                activeStep === 'result' 
                  ? 'border-rose-500/50 bg-rose-500/[0.05] shadow-[0_15px_30px_-10px_rgba(244,63,94,0.15)]' 
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-colors ${
                    activeStep === 'result' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  }`}>
                    03
                  </span>
                  <span className="font-black text-base text-slate-200">정밀 진단 & 30개 전사 대조 결과 (Result)</span>
                </div>
                <ChevronRight size={16} className={`text-slate-500 transition-transform ${activeStep === 'result' ? 'translate-x-1' : ''}`} />
              </div>
              <p className="text-xs text-slate-400 font-bold pl-10 mt-1 leading-normal break-keep">
                실제 앱 결과 화면(오각형 보장 밸런스 차트, 상세 리밸런싱 대조표, 그리고 30개 보험사 실시간 예상 월 보험료 비교 리스트 피드)이 모바일 크기에 맞춰 실시간 라이브로 렌더링되며 자동 슬롤링다운됩니다.
              </p>

              {activeStep === 'result' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-850">
                  <div className="h-full bg-rose-500 transition-all" style={{ width: `${stepProgress}%` }} />
                </div>
              )}
            </button>
          </div>

          {/* Action Player controls */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 max-w-md">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause size={12} fill="white" /> 일시정지 (Pause)
                </>
              ) : (
                <>
                  <Play size={12} fill="white" /> 자동재생 (Play)
                </>
              )}
            </button>

            <button 
              onClick={() => {
                setActiveStep('input');
                setIsPlaying(true);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-slate-700/60"
            >
              <RotateCcw size={12} /> 처음부터 다시 (Reset)
            </button>

            <div className="flex items-center gap-2 ml-auto text-[10px] font-black text-slate-500">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {isPlaying ? 'AUTO PLAYING' : 'PAUSED'}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
