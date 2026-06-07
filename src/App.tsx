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
import { PerPolicyDashboard } from './components/insurance/remodeling/PerPolicyDashboard';
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
import { SavingsExplanation } from './components/insurance/savings/SavingsExplanation';
import { PropertyExplanation } from './components/insurance/property/PropertyExplanation';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [remodelingResult, setRemodelingResult] = useState<AnalysisResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<InsuranceAnalysis | null>(null);
  const [view, setView] = useState<'home' | 'indemnity' | 'preexisting' | 'dental' | 'caregiving' | 'dementia' | 'surgery' | 'cancer' | 'cerebrovascular' | 'heart' | 'nursing' | 'child' | 'child_sick' | 'car' | 'driver' | 'pet' | 'golf' | 'fire_real' | 'property' | 'annuity' | 'whole' | 'variable' | 'legal' | 'credit' | 'health_general' | 'accident' | 'savings_general'>('home');

  const [calcTarget, setCalcTarget] = useState<string | null>(null);

  const handleAnalyze = async (analysis: InsuranceAnalysis) => {
    if (analysis.selectedCategory === 'remodeling') {
      const result = await runAnalysis(analysis);
      setRemodelingResult(result);
      setTimeout(() => {
        document.getElementById('remodeling-results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setCurrentAnalysis(analysis);
      const result = await runAnalysis(analysis);
      setAnalysisResult(result);
      setView('home'); // Ensure we are on home to see results
      
      // Scroll to results after a short delay
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
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

  if (view === 'property') {
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
           <PropertyExplanation onAction={() => { setCalcTarget('property'); setView('home'); }} />
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

  if (view === 'savings_general') {
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
           <SavingsExplanation onAction={() => { setCalcTarget('savings_general'); setView('home'); }} />
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

        <AnimatePresence>
          {remodelingResult && (
            <motion.section 
              id="remodeling-results-section"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="max-w-7xl mx-auto px-4 py-32 border-t border-gray-100"
            >
              <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-lg text-white">
                  ✨ Real-time Remodeling Report
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                  내 보험 정밀 리모델링 결과
                </h2>
              </div>

              {/* 실시간 조회된 나의 가입 보험 내역 — 리모델링 결과 최상단 */}
              {(remodelingResult.analysis as any)._remodelingCoverage?.policies?.length > 0 && (() => {
                const coverage = (remodelingResult.analysis as any)._remodelingCoverage;
                const totalPremium = coverage.current_total_premium ||
                  coverage.policies.reduce((s: number, p: any) => s + (p.monthly_premium || 0), 0);
                return (
                  <section className="mb-20 bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-[3rem] p-8 md:p-12 space-y-8 text-left max-w-5xl mx-auto shadow-sm">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-8">
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-orange-500/10 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest inline-block">
                          🛡️ Verified Holdings
                        </span>
                        <h3 className="text-2xl font-black text-slate-800">
                          실시간 조회된 나의 가입 보험 내역
                        </h3>
                      </div>
                      <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-6 self-start md:self-auto shrink-0">
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

                    {/* Policy Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {coverage.policies.map((policy: any, pIdx: number) => (
                        <div key={pIdx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black">
                                  {policy.insurance_company}
                                </span>
                                <h4 className="text-base font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                  {policy.product_name}
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
                  </section>
                );
              })()}

              {/* 보험별 개별 분석 */}
              {(remodelingResult.analysis as any)._remodelingCoverage?.policies?.length > 0 && (
                <div className="mb-12">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4">
                      🔍 Per-Policy Individual Analysis
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">보험 1건씩 개별 정밀 분석</h3>
                    <p className="text-gray-400 font-bold italic mt-2">"가입된 보험 하나하나를 독립적으로 분석하여 중복·과납·부족을 정확히 진단합니다."</p>
                  </div>
                  <PerPolicyDashboard
                    policies={(remodelingResult.analysis as any)._remodelingCoverage.policies}
                    age={(remodelingResult.analysis as any).age || 40}
                    gender={(remodelingResult.analysis as any).gender || 'M'}
                  />
                </div>
              )}

              {/* 종합 리모델링 결과 */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] text-white mb-4">
                  📊 Comprehensive Remodeling Result
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">전체 보험 포트폴리오 종합 분석</h3>
              </div>
              <AnalysisDashboard result={remodelingResult} />
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
