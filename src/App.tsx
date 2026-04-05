/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import { InsuranceCalculator } from './components/InsuranceCalculator';
import ComparisonSection from './components/ComparisonSection';
import AnalysisSection from './components/AnalysisSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import SimulationSlider from './components/SimulationSlider';
import { ProblemSection, IndemnitySection, PreExistingSection, DentalSection, CaregivingSection, PhilosophySection, Footer } from './components/Sections';
import { InsuranceAnalysis, AnalysisResult } from './types/insurance';
import { runAnalysis } from './lib/analysisEngine';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<InsuranceAnalysis | null>(null);
  const [view, setView] = useState<'home' | 'indemnity' | 'preexisting' | 'dental' | 'caregiving'>('home');

  const handleAnalyze = async (analysis: InsuranceAnalysis) => {
    setCurrentAnalysis(analysis);
    const result = await runAnalysis(analysis);
    setAnalysisResult(result);
    setView('home'); // Ensure we are on home to see results
    
    // Scroll to results after a short delay
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (view === 'indemnity') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => setView('home')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 font-black text-xs transition-all mb-6 shadow-lg shadow-orange-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <IndemnitySection onAction={() => setView('home')} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'preexisting') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-gray-50">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => setView('home')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs transition-all mb-6 shadow-lg shadow-indigo-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <PreExistingSection onAction={() => setView('home')} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'dental') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => setView('home')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 font-black text-xs transition-all mb-6 shadow-lg shadow-emerald-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <DentalSection onAction={() => setView('home')} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'caregiving') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-slate-50">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => setView('home')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 font-black text-xs transition-all mb-6 shadow-lg shadow-purple-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <CaregivingSection onAction={() => setView('home')} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
      <Header setView={setView} />
      
      <main>
        {/* Section 1: Insurance Hero & Quick Match (Moved to top) */}
        <ComparisonSection />

        <InsuranceCalculator onCalculate={handleAnalyze} />

        <AnimatePresence>
          {analysisResult && (
            <motion.section 
              id="results-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="max-w-7xl mx-auto px-4 py-32"
            >
              <div className="text-center mb-24 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 opacity-10">
                   <Sparkles className="w-32 h-32 text-orange-500 animate-pulse" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tighter leading-tight relative z-10">
                   당신의 10년 후가 달라지는<br/>
                   <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">마법의 리모델링</span>
                </h2>

                <div className="flex flex-col items-center gap-6 w-full">
                  <div className="bg-white px-12 py-10 rounded-[3rem] border border-orange-100 shadow-[0_30px_70px_-15px_rgba(255,100,0,0.15)] group w-full max-w-5xl">
                    {(() => {
                      const isSilbi = analysisResult.analysis.selectedCategory?.includes('실손') || analysisResult.analysis.selectedCategory?.includes('실비');
                      const isDental = analysisResult.analysis.selectedCategory?.includes('치아');
                      
                      const dietPremium = analysisResult.recommendations.diet.estimatedPremium;
                      const currentPremium = analysisResult.analysis.monthlyPremium;
                      
                      // Benchmark is what a typical "expensive" plan costs
                      const benchmark = isSilbi ? 55000 : isDental ? 85000 : 180000;
                      
                      // Show savings compared to current OR market benchmark if current is too low/not set
                      const comparisonBasis = currentPremium > dietPremium + 5000 ? currentPremium : benchmark;
                      const savings = comparisonBasis - dietPremium;

                      return (
                        <>
                          <p className="text-2xl text-gray-400 font-bold mb-8 tracking-tight text-center">
                            월 보험료를 <span className="text-orange-500 underline decoration-4 underline-offset-8">{dietPremium.toLocaleString()}원</span>으로 최적화하면, 기회비용 <span className="text-orange-500">{savings.toLocaleString()}원</span>이 당신의 자산이 됩니다.
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-6 text-left">
                            <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100/50">
                              <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">오늘을 위해 쓰면?</p>
                              <p className="text-lg font-bold text-gray-800 leading-tight">
                                가족과 함께하는 매년 한 번의<br/>
                                <span className="text-orange-600">특별한 호캉스</span>가 가능한 돈입니다.
                              </p>
                            </div>
                            
                            <div className="bg-slate-900 p-6 rounded-3xl shadow-xl">
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">내일을 위해 모으면?</p>
                              <p className="text-lg font-bold text-white leading-tight">
                                <span className="text-orange-400">10년 뒤 {(savings * 12 * 10).toLocaleString()}원</span>이라는<br/>
                                든든한 <span className="text-orange-400">은퇴 비상금</span>으로 돌아옵니다.
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  <p className="text-gray-400 text-sm font-bold animate-pulse">
                    ※ 실시간 최저가 플랜(Diet) 기준 절약 예상액입니다.
                  </p>
                </div>
              </div>

              <AnalysisDashboard result={analysisResult} />

              {currentAnalysis && (
                <div className="mt-40">
                  <SimulationSlider result={analysisResult} />
                </div>
              )}

              <p className="text-center text-gray-400 text-sm mt-32 italic font-black uppercase tracking-widest opacity-40">
                "전후 비교를 확인하는 순간, 지금까지 낸 보험료가 아까워 잠이 안 오실 수도 있습니다."
              </p>

              {/* Conditional Indemnity Detail for Analysis Results */}
              {analysisResult.analysis.selectedCategory === '의료실비' && (
                <div className="mt-32">
                   <IndemnitySection onAction={() => setView('home')} />
                </div>
              )}

              {/* Conditional Pre-existing Detail for Analysis Results */}
              {analysisResult.analysis.selectedCategory?.includes('유병') && (
                <div className="mt-32">
                   <PreExistingSection onAction={() => setView('home')} />
                </div>
              )}

              {/* Conditional Caregiving Detail for Analysis Results */}
              {analysisResult.analysis.selectedCategory?.includes('간병') && (
                <div className="mt-32">
                   <CaregivingSection onAction={() => setView('home')} />
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        <div className="bg-gray-50/30 overflow-hidden">
           {/* Section 2: My Insurance Analysis */}
           <AnalysisSection onAnalyze={handleAnalyze} />
        </div>

        <ProblemSection />
        
        <PhilosophySection />
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
          <button className="w-16 h-16 bg-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all hover:scale-110 active:scale-95 group">
            <span className="text-3xl group-hover:rotate-90 transition-transform">+</span>
          </button>
          <button className="w-16 h-16 bg-gray-900 rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] flex items-center justify-center text-white hover:bg-black transition-all hover:scale-110 active:scale-95">
            <span className="text-xl">↑</span>
          </button>
      </div>

      <Footer />
    </div>
  );
}
