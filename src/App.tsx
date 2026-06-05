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
import { ProblemSection, PreExistingSection, CaregivingSection, CaregivingOldSection, NursingSection, SurgerySection, CancerSection, CerebrovascularSection, HeartSection, PhilosophySection, Footer, ChildPrenatalSection, ChildSickSection } from './components/Sections';
import { InsuranceAnalysis, AnalysisResult } from './types/insurance';
import { runAnalysis } from './lib/analysisEngine';
import { Sparkles, ChevronRight } from 'lucide-react';
import { CarExplanation } from './components/insurance/car/CarExplanation';
import { DriverExplanation } from './components/insurance/driver/DriverExplanation';
import { PetExplanation } from './components/insurance/pet/PetExplanation';
import { GolfExplanation } from './components/insurance/golf/GolfExplanation';
import { SilsonExplanation } from './components/insurance/silson/SilsonExplanation';
import { DentalExplanation } from './components/insurance/dental/DentalExplanation';
import { PreExistingExplanation } from './components/insurance/preExisting/PreExistingExplanation';
import { SurgeryExplanation } from './components/insurance/surgery/SurgeryExplanation';
import { CancerExplanation } from './components/insurance/cancer/CancerExplanation';
import { CerebrovascularExplanation } from './components/insurance/brain/CerebrovascularExplanation';
import { HeartExplanation } from './components/insurance/heart/HeartExplanation';
import { CaregivingExplanation } from './components/insurance/caregiving/CaregivingExplanation';
import { FireExplanation } from './components/insurance/fire/FireExplanation';
import { AnnuityExplanation } from './components/insurance/annuity/AnnuityExplanation';
import { WholeLifeExplanation } from './components/insurance/wholeLife/WholeLifeExplanation';
import { VariableExplanation } from './components/insurance/variable/VariableExplanation';
import { LegalExplanation } from './components/insurance/legal/LegalExplanation';
import { CreditExplanation } from './components/insurance/credit/CreditExplanation';
import { HealthGeneralExplanation } from './components/insurance/healthGeneral/HealthGeneralExplanation';
import { AccidentExplanation } from './components/insurance/accident/AccidentExplanation';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<InsuranceAnalysis | null>(null);
  const [view, setView] = useState<'home' | 'indemnity' | 'preexisting' | 'dental' | 'caregiving' | 'dementia' | 'surgery' | 'cancer' | 'cerebrovascular' | 'heart' | 'nursing' | 'child' | 'child_sick' | 'car' | 'driver' | 'pet' | 'golf' | 'fire_real' | 'annuity' | 'whole' | 'variable' | 'legal' | 'credit' | 'health_general' | 'accident'>('home');

  const [calcTarget, setCalcTarget] = useState<string | null>(null);

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
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <SilsonExplanation onAction={() => { setCalcTarget('silson'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'preexisting') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs transition-all mb-6 shadow-lg shadow-indigo-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <PreExistingExplanation onAction={() => { setCalcTarget('pre'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'dental') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-teal-100 selection:text-teal-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-teal-600 text-white hover:bg-teal-700 font-black text-xs transition-all mb-6 shadow-lg shadow-teal-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <DentalExplanation onAction={() => { setCalcTarget('dental'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'caregiving') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 font-black text-xs transition-all mb-6 shadow-lg shadow-purple-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <CaregivingExplanation onAction={() => { setCalcTarget('care_svc'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }
  if (view === 'dementia') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-amber-50/30">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 text-white hover:bg-amber-700 font-black text-xs transition-all mb-6 shadow-lg shadow-amber-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <CaregivingOldSection onAction={() => { setCalcTarget('care_old'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'surgery') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 font-black text-xs transition-all mb-6 shadow-lg shadow-orange-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <SurgeryExplanation onAction={() => { setCalcTarget('surgery'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }
  if (view === 'cerebrovascular') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs transition-all mb-6 shadow-lg shadow-indigo-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <CerebrovascularExplanation onAction={() => { setCalcTarget('brain'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }
  if (view === 'heart') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 font-black text-xs transition-all mb-6 shadow-lg shadow-red-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <HeartExplanation onAction={() => { setCalcTarget('heart'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }
  if (view === 'cancer') {

    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-rose-100 selection:text-rose-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 font-black text-xs transition-all mb-6 shadow-lg shadow-rose-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <CancerExplanation onAction={() => { setCalcTarget('cancer'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'nursing') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-pink-600 text-white hover:bg-pink-700 font-black text-xs transition-all mb-6 shadow-lg shadow-pink-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <NursingSection onAction={() => { setCalcTarget('nursing'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'child_sick') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <ChildSickSection onAction={() => { setCalcTarget('pre_family'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'child') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 font-black text-xs transition-all mb-6 shadow-lg shadow-yellow-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <ChildPrenatalSection onAction={() => { setCalcTarget('child'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'car') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <CarExplanation onAction={() => { setCalcTarget('car'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'driver') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 font-black text-xs transition-all mb-6 shadow-lg shadow-purple-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <DriverExplanation onAction={() => { setCalcTarget('driver'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'pet') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 font-black text-xs transition-all mb-6 shadow-lg shadow-orange-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <PetExplanation onAction={() => { setCalcTarget('pet'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'health_general') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 font-black text-xs transition-all mb-6 shadow-lg shadow-orange-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <HealthGeneralExplanation onAction={() => { setCalcTarget('health_general'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'accident') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 font-black text-xs transition-all mb-6 shadow-lg shadow-red-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <AccidentExplanation onAction={() => { setCalcTarget('accident'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'credit') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <CreditExplanation onAction={() => { setCalcTarget('credit'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'golf') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 font-black text-xs transition-all mb-6 shadow-lg shadow-emerald-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <GolfExplanation onAction={() => { setCalcTarget('golf'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'fire_real') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 font-black text-xs transition-all mb-6 shadow-lg shadow-red-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <FireExplanation onAction={() => { setCalcTarget('fire_real'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'annuity') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <AnnuityExplanation onAction={() => { setCalcTarget('pension'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'whole') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs transition-all mb-6 shadow-lg shadow-indigo-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <WholeLifeExplanation onAction={() => { setCalcTarget('whole'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'legal') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-slate-100 selection:text-slate-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-900 font-black text-xs transition-all mb-6 shadow-lg shadow-slate-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <LegalExplanation onAction={() => { setCalcTarget('legal'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'variable') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-4 bg-white">
           <div className="max-w-7xl mx-auto flex justify-end">
              <button 
                onClick={() => { setCalcTarget(null); setView('home'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs transition-all mb-6 shadow-lg shadow-indigo-500/20 active:scale-95 group"
              >
                메인으로 돌아가기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
              </button>
           </div>
           <VariableExplanation onAction={() => { setCalcTarget('variable'); setView('home'); }} />
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

        <InsuranceCalculator onCalculate={handleAnalyze} initialTarget={calcTarget} />

        <AnimatePresence>
          {analysisResult && (
            <motion.section 
              id="results-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="max-w-7xl mx-auto px-4 py-32"
            >
              {(() => {
                const isSilbi = analysisResult.analysis.selectedCategory?.includes('실손') || analysisResult.analysis.selectedCategory?.includes('실비');
                const isDental = analysisResult.analysis.selectedCategory?.includes('치아');
                const isCaregiving = analysisResult.analysis.selectedCategory?.includes('간병');
                const isSurgeryHospital = analysisResult.analysis.selectedCategory?.includes('수술') || analysisResult.analysis.selectedCategory?.includes('입원');
                const isCancer = analysisResult.analysis.selectedCategory?.includes('암') || analysisResult.analysis.selectedCategory === 'cancer';

                const dietPremium = analysisResult.recommendations.diet.estimatedPremium;
                const currentPremium = analysisResult.analysis.monthlyPremium;
                
                const benchmark = isSilbi ? 55000 : isDental ? 85000 : isCaregiving ? 45000 : 180000;
                const comparisonBasis = currentPremium > dietPremium + 5000 ? currentPremium : benchmark;
                const savings = comparisonBasis - dietPremium;

                return (
                  <>
                    <AnalysisDashboard result={analysisResult} />

                    {currentAnalysis && (
                      <div className="mt-40">
                        <SimulationSlider result={analysisResult} />
                      </div>
                    )}

                  </>
                );
              })()}
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
