/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import { InsuranceCalculator } from './components/InsuranceCalculator';
import { useB2BBranding } from './hooks/useB2BBranding';
import PlannerWidget from './components/PlannerWidget';
import { createClient } from './utils/supabase/client';
import ComparisonSection from './components/ComparisonSection';
import AnalysisSection from './components/AnalysisSection';
import AnalysisDashboard from './components/AnalysisDashboard';
import { PerPolicyDashboard } from './components/insurance/remodeling/PerPolicyDashboard';
import SimulationSlider from './components/SimulationSlider';
import { ProblemSection, PreExistingSection, CaregivingSection, CaregivingOldSection, NursingSection, SurgerySection, CancerSection, CerebrovascularSection, HeartSection, PhilosophySection, Footer, ChildPrenatalSection, ChildSickSection } from './components/Sections';
import { InsuranceAnalysis, AnalysisResult } from './types/insurance';
import { runAnalysis } from './lib/analysisEngine';
import { Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
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
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const { branding } = useB2BBranding();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [remodelingResult, setRemodelingResult] = useState<AnalysisResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<InsuranceAnalysis | null>(null);
  const [view, setView] = useState<'admin' | 'home' | 'indemnity' | 'preexisting' | 'dental' | 'caregiving' | 'dementia' | 'surgery' | 'cancer' | 'cerebrovascular' | 'heart' | 'nursing' | 'child' | 'child_sick' | 'car' | 'driver' | 'pet' | 'golf' | 'fire_real' | 'property' | 'annuity' | 'whole' | 'variable' | 'legal' | 'credit' | 'health_general' | 'accident' | 'savings_general'>(() => {
    if (window.location.pathname === '/admin') return 'admin';
    return 'home';
  });

  const [calcTarget, setCalcTarget] = useState<string | null>(null);
  const [remodelingApplied, setRemodelingApplied] = useState(false);
  const [submittedLeads, setSubmittedLeads] = useState<string[]>([]);
  const [lastSubmittedLeadId, setLastSubmittedLeadId] = useState<number | null>(null);
  const [currentSimulationCode, setCurrentSimulationCode] = useState<string>('');

  const generateSimulationCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    // Generate 2 random letters for prefix (e.g., RA, RB, RZ...)
    let prefixLetters = '';
    for (let i = 0; i < 2; i++) {
      prefixLetters += letters[Math.floor(Math.random() * letters.length)];
    }
    
    // Generate 6 random alphanumeric characters
    let codeBody = '';
    for (let i = 0; i < 6; i++) {
      codeBody += alphaNum[Math.floor(Math.random() * alphaNum.length)];
    }
    
    return `R${prefixLetters}-${codeBody}`; // e.g. RXY-8K29P7
  };

  const logKakaoClick = async (leadId: number, type?: 'anonymous' | 'regular') => {
    try {
      const supabase = createClient();
      const { data: lead } = await supabase
        .from('customer_leads')
        .select('raw_payload')
        .eq('id', leadId)
        .single();
      
      if (lead) {
        const currentPayload = lead.raw_payload || {};
        const currentTimeline = currentPayload.timeline || [];
        
        // Avoid duplicate log clicks within 5 seconds
        const now = new Date();
        const fiveSecondsAgo = new Date(now.getTime() - 5000);
        const hasRecentClick = currentTimeline.some((t: any) => 
          t.type === 'kakao_click' && new Date(t.created_at) > fiveSecondsAgo
        );
        if (hasRecentClick) return;

        const typeLabel = type === 'anonymous' ? '익명' : type === 'regular' ? '정식' : '일반';
        const newEvent = {
          id: `kakao-${Date.now()}`,
          type: 'kakao_click',
          author: '고객',
          detail: `고객이 전담 설계사 카카오톡 1:1 [${typeLabel} 상담] 버튼을 클릭하여 채팅을 시작했습니다.`,
          created_at: now.toISOString()
        };

        const updatedPayload = {
          ...currentPayload,
          timeline: [newEvent, ...currentTimeline]
        };

        await supabase
          .from('customer_leads')
          .update({ raw_payload: updatedPayload })
          .eq('id', leadId);
      }
    } catch (err) {
      console.error('Failed to log KakaoTalk click:', err);
    }
  };

  const handlePlannerWidgetKakaoClick = (type: 'anonymous' | 'regular') => {
    if (lastSubmittedLeadId) {
      logKakaoClick(lastSubmittedLeadId, type);
    }
  };

  const submitLead = async (analysis: InsuranceAnalysis, category: string, resultData: any, consultType?: 'anonymous' | 'regular') => {
    const leadKey = `${analysis.name || '무명고객'}_${analysis.mobile || '010-0000-0000'}_${category}`;
    if (submittedLeads.includes(leadKey)) {
      console.log('Lead already submitted in this session:', leadKey);
      return null;
    }
    setSubmittedLeads(prev => [...prev, leadKey]);

    const supabase = createClient();
    let leadSource: 'direct' | 'distribute' | 'organic' = 'organic';
    if (branding.type === 'planner') {
      leadSource = 'direct';
    } else if (branding.type === 'agency') {
      leadSource = 'distribute';
    }

    // Determine simulation code
    const simulationCode = resultData?.simulation_code || currentSimulationCode || generateSimulationCode();
    if (!currentSimulationCode) {
      setCurrentSimulationCode(simulationCode);
    }

    const initialTimeline = [];
    const isConsult = category.endsWith('_consult') || category === 'remodeling_consult';
    if (isConsult) {
      const typeLabel = consultType === 'anonymous' ? '익명' : consultType === 'regular' ? '정식' : '일반';
      initialTimeline.push({
        id: `kakao-${Date.now()}`,
        type: 'kakao_click',
        author: '고객',
        detail: `고객이 전담 설계사 카카오톡 1:1 [${typeLabel} 상담] 버튼을 클릭하여 채팅을 시작했습니다.`,
        created_at: new Date().toISOString()
      });
    }

    const payload = {
      planner_id: branding.plannerId,
      agency_id: branding.agencyId,
      name: analysis.name || '무명고객',
      phone: analysis.mobile || '010-0000-0000',
      age: analysis.age || 40,
      insurance_type: category,
      analysis_result: resultData,
      monthly_premium: resultData?.efficiency?.totalPremium || 0,
      raw_payload: { 
        gender: analysis.gender, 
        jobClass: analysis.jobClass, 
        category,
        consult_type: consultType || 'regular',
        utm_source: sessionStorage.getItem('ins_utm_source') || 'organic',
        analysisInputs: analysis,
        timeline: initialTimeline,
        simulation_code: simulationCode
      },
      lead_source: leadSource,
      status: 'new',
    };

    try {
      const { data, error } = await supabase
        .from('customer_leads')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Supabase lead submit error:', error);
      }
      if (data && data.id) {
        setLastSubmittedLeadId(data.id);
      }
      return data;
    } catch (err) {
      console.error('Failed to submit lead to Supabase:', err);
    }
  };

  const handleAnalyze = async (analysis: InsuranceAnalysis) => {
    // Generate simulation code for this calculation run
    const simulationCode = generateSimulationCode();
    setCurrentSimulationCode(simulationCode);

    if (analysis.selectedCategory === 'remodeling') {
      setRemodelingApplied(false);
      const result = await runAnalysis(analysis);
      result.simulation_code = simulationCode; // attach code
      setRemodelingResult(result);
      // Automatically save lead upon analysis completion
      submitLead(analysis, 'remodeling', result);
    } else {
      setCurrentAnalysis(analysis);
      const result = await runAnalysis(analysis);
      result.simulation_code = simulationCode; // attach code
      setAnalysisResult(result);
      setView('home'); // Ensure we are on home to see results
      // Automatically save lead upon analysis completion
      submitLead(analysis, analysis.selectedCategory || 'general', result);
    }
  };

  useEffect(() => {
    if (remodelingResult) {
      const timer = setTimeout(() => {
        const element = document.getElementById('remodeling-results-section');
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [remodelingResult]);

  useEffect(() => {
    if (analysisResult) {
      const timer = setTimeout(() => {
        const element = document.getElementById('results-section');
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [analysisResult]);
  useEffect(() => {
    if (view === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      if (window.location.pathname === '/admin') {
        window.history.pushState({}, '', '/');
      }
    }
  }, [view]);

  if (view === 'admin') {
    return <AdminDashboard />;
  }

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
                    <AnalysisDashboard result={analysisResult} onSubmitLead={submitLead} branding={branding} />

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

              {/* AI Executive Summary 코멘트 카드 */}
              {(() => {
                const coverage = (remodelingResult.analysis as any)._remodelingCoverage;
                const totalPremium = remodelingResult.analysis.monthlyPremium || 0;
                const cheapestPremium = remodelingResult.recommendations.diet?.estimatedPremium || 0;
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
                  <div className="max-w-5xl mx-auto mb-12 bg-orange-50/50 border border-orange-100/60 rounded-[3rem] p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-8 items-center text-left">
                    <div className="w-16 h-16 rounded-3xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                      <Sparkles size={28} className="animate-pulse" />
                    </div>
                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black">
                          📢 AI 종합 분석 리포트 요약
                        </div>
                        <h4 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                          매달 불필요하게 낭비되는 보험료 <span className="text-orange-500 underline underline-offset-4 font-black">{savingAmount.toLocaleString()}원</span>을 찾아냈습니다!
                        </h4>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed break-keep">
                          고객님은 현재 총 <span className="text-slate-800 font-extrabold">{policies.length}건</span>의 보험을 유지 중이시며, 이 중 <span className="text-red-500 font-extrabold">{dups.size}건의 중복 가입 상품</span>이 확인되었습니다. 
                          불필요한 과납 보장과 사망 위주의 주계약 비용을 최적화하면, 기존 핵심 보장은 100% 동일하게 지키면서 매월 총 <span className="text-orange-500 font-extrabold">{savingAmount.toLocaleString()}원</span>의 기회 자산을 확보하실 수 있습니다.
                        </p>
                      </div>

                      {/* CTA 버튼 / 신청 완료 상태 (웅장하고 눈에 띄는 다크 배너 박스) */}
                      <div className="pt-6 border-t border-orange-200/40">
                        {remodelingApplied ? (
                          <div className="p-6 bg-emerald-500 text-white rounded-3xl text-center shadow-lg shadow-emerald-500/20 animate-in fade-in duration-300">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-emerald-500 text-xs font-black mb-2">✓</span>
                            <p className="text-sm font-black">100점 보완 및 절감 설계안 신청이 완료되었습니다!</p>
                            <p className="text-xs text-emerald-100 font-bold mt-1">전담 설계사가 분석된 고객 DB 정보를 확인하여 카카오톡으로 상세 설계안을 0.1초 만에 발송해 드립니다.</p>
                          </div>
                        ) : (
                          <div className="bg-slate-900 border border-orange-500/30 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6 text-white text-left relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
                              <ShieldCheck className="w-32 h-32 text-orange-500" />
                            </div>
                            <div className="space-y-1.5 relative z-10 flex-1">
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
                              onClick={() => {
                                setRemodelingApplied(true);
                                if (remodelingResult) {
                                  submitLead(remodelingResult.analysis, 'remodeling_consult', remodelingResult);
                                }
                              }}
                              className="px-6 py-4.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-xl text-xs shrink-0 shadow-[0_10px_20px_-4px_rgba(255,107,0,0.4)] transform transition-all hover:scale-105 active:scale-95 cursor-pointer text-center relative z-10"
                            >
                              👉 카톡으로 설계안 무료 신청
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

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

                    {/* 고객 안내 사항 배너 */}
                    <div className="bg-orange-50/50 border border-orange-100/60 p-5 rounded-2xl text-left">
                      <p className="text-xs text-orange-600 font-extrabold flex items-center gap-1.5 mb-1.5">
                        <span>💡</span> 고객 안내 사항 (데이터 출처 안내)
                      </p>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed break-keep">
                        본 리스트의 <span className="text-slate-800 font-extrabold">보험 회사, 상품명, 월 납입 보험료</span>는 한국신용정보원 본인정보 열람서비스(내보험다보여)를 통해 실시간으로 수집된 실제 가입 정보입니다. 다만, <span className="text-slate-800 font-extrabold">가입 특약 및 세부 보장 금액</span>은 AI 엔진이 표준 요율을 기반으로 역산하여 추정한 분석값이므로, 실제 가입 증권과 차이가 있을 수 있습니다. 계약 체결 전 반드시 고객의 실제 증권을 다시 한번 확인하시기 바랍니다.
                      </p>
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

              {/* 종합 리모델링 결과 */}
              <div className="text-center mb-10 mt-16">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] text-white mb-4">
                  📊 Comprehensive Remodeling Result
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">전체 보험 포트폴리오 종합 분석</h3>
                <p className="max-w-2xl mx-auto text-xs md:text-sm text-slate-500 font-semibold mt-3 px-4 leading-relaxed break-keep">
                  💡 본 분석은 한국신용정보원의 상품명과 월 납입 보험료 정보를 기반으로, AI가 표준 보험 요율에 맞춰 가입 특약 및 보장 금액을 정교하게 역산한 추정치입니다. 실제 가입하신 보험 증권의 세부 구성에 따라 차이가 있을 수 있으므로 정확한 진단은 전문 설계사의 정밀 상담을 권장합니다.
                </p>
              </div>
              <AnalysisDashboard result={remodelingResult} onSubmitLead={submitLead} branding={branding} />


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
      <PlannerWidget branding={branding} onKakaoClick={handlePlannerWidgetKakaoClick} />
    </div>
  );
}
