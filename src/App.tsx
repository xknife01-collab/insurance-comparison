/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import ComparisonSection from './components/ComparisonSection';
import AnalysisSection from './components/AnalysisSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import SimulationSlider from './components/SimulationSlider';
import { ProblemSection, PhilosophySection, Footer } from './components/Sections';
import { InsuranceAnalysis, AnalysisResult } from './types/insurance';
import { runAnalysis } from './lib/analysisEngine';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<InsuranceAnalysis | null>(null);

  const handleAnalyze = async (analysis: InsuranceAnalysis) => {
    setCurrentAnalysis(analysis);
    const result = await runAnalysis(analysis);
    setAnalysisResult(result);
    
    // Scroll to results after a short delay
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
      <Header />
      
      <main>
        <Hero />
        
        {/* Section 1: Insurance Comparison (Browsing) */}
        <ComparisonSection />

        <div className="bg-gray-50/30 overflow-hidden">
           {/* Section 2: My Insurance Analysis */}
           <AnalysisSection onAnalyze={handleAnalyze} />
        </div>

        <AnimatePresence>
          {analysisResult && (
            <motion.section 
              id="results-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="max-w-7xl mx-auto px-4 py-32 mt-20"
            >
              <div className="text-center mb-24 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 opacity-10">
                   <Sparkles className="w-32 h-32 text-orange-500 animate-pulse" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black mb-10 tracking-tighter leading-tight relative z-10">
                   당신의 10년 후가 달라지는<br/>
                   <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">마법의 리모델링</span>
                </h2>

                <div className="inline-block bg-white px-12 py-8 rounded-[2.5rem] border border-orange-100 shadow-[0_20px_50px_-15px_rgba(255,100,0,0.1)] group">
                   <p className="text-2xl text-gray-800 leading-relaxed font-bold tracking-tight">
                     월 <span className="text-orange-500 font-black">50,000원</span> 절약, 
                     10년이면 <span className="text-orange-500 font-black text-4xl">6,000,000원</span>입니다.<br />
                     <span className="text-gray-400 text-lg font-bold mt-2 inline-block opacity-70 group-hover:opacity-100 transition-opacity">이 돈이면 우리 가족 해외여행이 바뀝니다.</span>
                   </p>
                </div>
              </div>

              <AnalysisDashboard result={analysisResult} />

              {currentAnalysis && (
                <div className="mt-40">
                  <SimulationSlider currentPremium={currentAnalysis.monthlyPremium} />
                </div>
              )}

              <p className="text-center text-gray-400 text-sm mt-32 italic font-black uppercase tracking-widest opacity-40">
                "전후 비교를 확인하는 순간, 지금까지 낸 보험료가 아까워 잠이 안 오실 수도 있습니다."
              </p>
            </motion.section>
          )}
        </AnimatePresence>

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
