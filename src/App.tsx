/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
import { maskCompany, maskProductName } from './utils/compliance';
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
import { CustomerSupportSection } from './components/CustomerSupportSection';
import { PartnerLanding } from './components/PartnerLanding';
import VerificationPage from './components/VerificationPage';
import { HyphenAuthModal } from './components/insurance/remodeling/HyphenAuthModal';
import { StandardizedCoverage } from './types/remodeling';
import AiChatWidget from './components/chat/AiChatWidget';

export default function App() {
  const { branding, loading, showInAppGuide, setShowInAppGuide, isIOS, isInAppBrowser, isStandalone, updateBranding, isB2BMode } = useB2BBranding();
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [remodelingResult, setRemodelingResult] = useState<AnalysisResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<InsuranceAnalysis | null>(null);
  const [view, setView] = useState<'admin' | 'partner' | 'home' | 'indemnity' | 'preexisting' | 'dental' | 'caregiving' | 'dementia' | 'surgery' | 'cancer' | 'cerebrovascular' | 'heart' | 'nursing' | 'child' | 'child_sick' | 'car' | 'driver' | 'pet' | 'golf' | 'fire_real' | 'property' | 'annuity' | 'whole' | 'variable' | 'legal' | 'credit' | 'health_general' | 'accident' | 'savings_general' | 'support' | 'verify'>(() => {
    const cleanPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (cleanPath === '/admin') return 'admin';
    if (cleanPath === '/partner') return 'partner';
    if (cleanPath === '/verify') return 'verify';
    return 'home';
  });
  const [adminTab, setAdminTab] = useState<'login' | 'register'>('login');

  const [calcTarget, setCalcTarget] = useState<string | null>(null);
  const [remodelingApplied, setRemodelingApplied] = useState(false);
  const [submittedLeads, setSubmittedLeads] = useState<string[]>([]);
  const [lastSubmittedLeadId, setLastSubmittedLeadId] = useState<number | null>(null);
  const [currentSimulationCode, setCurrentSimulationCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ins_current_simulation_code') || '';
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentSimulationCode) {
        localStorage.setItem('ins_current_simulation_code', currentSimulationCode);
      } else {
        localStorage.removeItem('ins_current_simulation_code');
      }
    }
  }, [currentSimulationCode]);
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [showAligoAuthModal, setShowAligoAuthModal] = useState<boolean>(false);
  const [isInRemodelingZone, setIsInRemodelingZone] = useState<boolean>(false);
  const [showComparisonBar, setShowComparisonBar] = useState<boolean>(false);
  const [isRemodelingHyphenOpen, setIsRemodelingHyphenOpen] = useState<boolean>(false);
  // 고객이 /remodeling?code= 링크 접속 시 외부 하이픈 모달
  const [hyphenCodeParam, setHyphenCodeParam] = useState<string | null>(null);
  const [showExternalHyphenModal, setShowExternalHyphenModal] = useState<boolean>(false);
  const [externalLeadData, setExternalLeadData] = useState<{
    userName: string;
    gender: 'M' | 'F';
    birth: string;
    mobileNo: string;
    age: number;
  } | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (window.location.search.includes('reset')) {
      localStorage.removeItem('ins_unlocked');
      return false;
    }
    return localStorage.getItem('ins_unlocked') === 'true';
  });

  const [isAiEnabled, setIsAiEnabled] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);

  useEffect(() => {
    if (branding.plannerId) {
      const fetchPlannerAiStatus = async () => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('planners')
            .select('is_ai_enabled')
            .eq('id', branding.plannerId)
            .maybeSingle();
          if (!error && data) {
            setIsAiEnabled(!!data.is_ai_enabled);
          }
        } catch (e) {
          console.warn('Failed to fetch planner AI enabled status:', e);
        }
      };
      fetchPlannerAiStatus();
    }
  }, [branding.plannerId]);

  useEffect(() => {
    if (window.location.search.includes('reset')) {
      localStorage.removeItem('ins_unlocked');
      setIsUnlocked(false);
    }
  }, []);

  // /remodeling?code=... 접속 시 HyphenAuthModal 자동 오픈 및 리드 정보 조회
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    const isRemodelingPath = window.location.pathname === '/remodeling';
    if (isRemodelingPath && codeParam) {
      setHyphenCodeParam(codeParam);
      setCurrentSimulationCode(codeParam);

      const fetchLeadAndOpenModal = async () => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('customer_leads')
            .select('*')
            .eq('raw_payload->>simulation_code', codeParam)
            .order('created_at', { ascending: false })
            .limit(1);

          if (!error && data && data.length > 0) {
            const lead = data[0];
            const payload = lead.raw_payload || {};
            setExternalLeadData({
              userName: lead.name || '',
              gender: payload.gender || 'M',
              birth: payload.analysisInputs?.birthYear || '',
              mobileNo: lead.phone || '',
              age: lead.age || 40,
            });
          }
        } catch (err) {
          console.error('Failed to fetch external lead on mount:', err);
        } finally {
          setShowExternalHyphenModal(true);
        }
      };

      fetchLeadAndOpenModal();
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    const isExternalHyphenPath = window.location.pathname === '/remodeling';

    // 외부 하이픈 플로우(/remodeling?code=...)에서는 이전 결과 복원 안 함
    // → 데모/실제 인증 후 7개 카드가 레이스 컨디션으로 덮어쓰이는 것 방지
    if (codeParam && codeParam.startsWith('R') && !isExternalHyphenPath) {
      const fetchLeadOnMount = async () => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('customer_leads')
            .select('*')
            .eq('raw_payload->>simulation_code', codeParam)
            .order('created_at', { ascending: false })
            .limit(1);

          if (!error && data && data.length > 0) {
            const lead = data[0];
            const payload = lead.raw_payload || {};
            const analysisInputs = payload.analysisInputs;

            if (analysisInputs) {
              setCurrentAnalysis(analysisInputs);
              setCurrentSimulationCode(codeParam);

              const isRemod = lead.insurance_type === 'remodeling' || lead.insurance_type === 'remodeling_consult';
              setCalcTarget(isRemod ? 'remodeling' : (lead.insurance_type?.replace('_consult', '') || 'general'));

              if (isRemod) {
                const hasZeroPremium = !lead.analysis_result ||
                  !lead.analysis_result.recommendations ||
                  (lead.analysis_result.analysis?._allDietOptions || []).some((o: any) => !o.premium) ||
                  lead.analysis_result.analysis?._allDietOptions?.length === 0;

                if (hasZeroPremium) {
                  runAnalysis(analysisInputs).then(async (result) => {
                    result.simulation_code = codeParam;
                    setRemodelingResult(result);
                    try {
                      await supabase
                        .from('customer_leads')
                        .update({
                          analysis_result: result,
                          monthly_premium: analysisInputs.monthlyPremium || 0
                        })
                        .eq('id', lead.id);
                    } catch (e) {
                      console.warn('Failed to update corrected lead result in DB:', e);
                    }
                  });
                } else {
                  setRemodelingResult(lead.analysis_result);
                }
              } else {
                const hasZeroPremium = !lead.analysis_result ||
                  !lead.analysis_result.recommendations ||
                  (lead.analysis_result.analysis?._allOptions || []).some((o: any) => !o.premium) ||
                  lead.analysis_result.analysis?._allOptions?.length === 0;

                if (hasZeroPremium) {
                  runAnalysis(analysisInputs).then(async (result) => {
                    result.simulation_code = codeParam;
                    setAnalysisResult(result);
                    try {
                      await supabase
                        .from('customer_leads')
                        .update({
                          analysis_result: result,
                          monthly_premium: result?.recommendations?.diet?.estimatedPremium || result?.estimatedPremium || 0
                        })
                        .eq('id', lead.id);
                    } catch (e) {
                      console.warn('Failed to update corrected lead result in DB:', e);
                    }
                  });
                } else {
                  setAnalysisResult(lead.analysis_result);
                }
              }

              if (lead.status === 'verified') {
                setIsUnlocked(true);
                localStorage.setItem('ins_unlocked', 'true');
              }
            }
          }
        } catch (err) {
          console.error('Failed to load lead on mount:', err);
        }
      };
      fetchLeadOnMount();
    }
  }, []);

  useEffect(() => {
    const hasHighIntentLead = submittedLeads.some(leadKey => {
      const parts = leadKey.split('_');
      const cat = parts[parts.length - 1];
      return cat === 'remodeling_consult' || cat.endsWith('_consult') || cat.endsWith('_underwriting');
    });
    if (hasHighIntentLead) {
      setIsUnlocked(true);
      localStorage.setItem('ins_unlocked', 'true');
    }
  }, [submittedLeads]);

  useEffect(() => {
    if (!currentSimulationCode) return;

    const supabase = createClient();

    // Listen to updates on customer_leads where raw_payload->>simulation_code equals currentSimulationCode
    const channel = supabase
      .channel(`verification_listener:${currentSimulationCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_leads'
        },
        (payload) => {
          const leadCode = payload.new?.raw_payload?.simulation_code;
          const status = payload.new?.status;
          const hyphenCoverage = payload.new?.raw_payload?.hyphen_coverage;

          if (leadCode === currentSimulationCode && status === 'verified') {
            if (hyphenCoverage) {
              // 정밀 분석 플로우: 실제 보험 데이터 → remodelingResult 갱신
              setIsInRemodelingZone(true);
              handleRemodelingHyphenSuccess(hyphenCoverage);
              alert('🔍 설계사가 하이픈 연동을 완료했습니다! 실제 보험 데이터가 로드됩니다.');
            } else {
              // 비교 분석 플로우: 마스킹 해제
              setIsUnlocked(true);
              localStorage.setItem('ins_unlocked', 'true');
              alert('🎉 본인인증이 확인되어 실명 마스킹이 해제되었습니다!');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSimulationCode]);

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
        .select('raw_payload, insurance_type')
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
          consult_type: type || 'anonymous',
          copied_by_planner: false,
          timeline: [newEvent, ...currentTimeline]
        };

        let currentType = lead.insurance_type || '';
        let newType = currentType;
        if (type === 'anonymous' && !currentType.endsWith('_consult')) {
          newType = `${currentType}_consult`;
        }

        await supabase
          .from('customer_leads')
          .update({
            insurance_type: newType,
            raw_payload: updatedPayload
          })
          .eq('id', leadId);
      }
    } catch (err) {
      console.error('Failed to log KakaoTalk click:', err);
    }
  };

  const handlePlannerWidgetKakaoClick = (type: 'anonymous' | 'regular') => {
    if (type === 'anonymous') {
      setIsAiChatOpen(true);
    }
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
    const isConsult = (category.endsWith('_consult') || category === 'remodeling_consult') && category !== 'support_consult';
    if (isConsult) {
      const typeLabel = consultType === 'anonymous' ? '익명' : consultType === 'regular' ? '정식' : '일반';
      initialTimeline.push({
        id: `kakao-${Date.now()}`,
        type: 'kakao_click',
        author: '고객',
        detail: `고객이 전담 설계사 카카오톡 1:1 [${typeLabel} 상담] 버튼을 클릭하여 채팅을 시작했습니다.`,
        created_at: new Date().toISOString()
      });
    } else if (category === 'support_consult') {
      initialTimeline.push({
        id: `support-${Date.now()}`,
        type: 'support_submit',
        author: '고객',
        detail: `고객이 1:1 문의 폼을 작성하고 [전송하기]를 눌러 문의를 남겼습니다.`,
        created_at: new Date().toISOString()
      });
    }

    let chosenPlannerId = branding.plannerId;
    let autoAssignedLog = '';

    const isUnderwriting = category.includes('_underwriting');
    const isSupport = category === 'support_consult';
    const isHighIntent = isUnderwriting || isConsult || isSupport;

    if (isHighIntent && branding.agencyId && (branding.type === 'agency' || branding.type === 'organic')) {
      if (branding.leadRoutingType && branding.leadRoutingType.startsWith('distribute_auto_')) {
        try {
          const { data: planners } = await supabase
            .from('planners')
            .select('id, name, registration_number, monthly_credit_used, profile_image_url, logo_url, greeting_title, greeting_content, custom_phone, custom_address, certification_message, kakao_link, company_name, phone, email, subscription_status')
            .eq('agency_id', branding.agencyId)
            .eq('subscription_status', 'active');

          const activePlanners = (planners || []).filter(p => {
            const reg = p.registration_number || '';
            const dist = reg.includes('|') ? reg.split('|')[1] : reg;
            return dist !== 'dist_disabled';
          });

          if (activePlanners.length > 0) {
            let chosen = activePlanners[0];

            if (activePlanners.length > 1) {
              const { data: recentLeads } = await supabase
                .from('customer_leads')
                .select('planner_id')
                .eq('agency_id', branding.agencyId)
                .not('planner_id', 'is', null)
                .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

              const counts: Record<string, number> = {};
              activePlanners.forEach(p => { counts[p.id] = 0; });
              recentLeads?.forEach(l => {
                if (l.planner_id && counts[l.planner_id] !== undefined) {
                  counts[l.planner_id]++;
                }
              });

              let minScore = Infinity;
              activePlanners.forEach(p => {
                let weight = 1;
                if (branding.leadRoutingType === 'distribute_auto_weighted') {
                  const reg = p.registration_number || '';
                  const dist = reg.includes('|') ? reg.split('|')[1] : reg;
                  if (dist && dist.startsWith('dist_weight:')) {
                    const w = parseInt(dist.split(':')[1]);
                    weight = isNaN(w) ? 5 : w;
                  } else {
                    weight = 5;
                  }
                } else if (branding.leadRoutingType === 'distribute_auto_activity') {
                  weight = (p.monthly_credit_used || 0) + 1;
                }

                const score = counts[p.id] / (weight || 1);
                if (score < minScore) {
                  minScore = score;
                  chosen = p;
                }
              });
            }

            chosenPlannerId = chosen.id;

            const algoName = branding.leadRoutingType === 'distribute_auto_round_robin'
              ? '균등 순차 분배'
              : branding.leadRoutingType === 'distribute_auto_weighted'
                ? '가중치 비율 분배'
                : '실적 기반 분배';

            autoAssignedLog = `⚡ 실시간 자동 분배 엔진에 의해 [${chosen.name}] 플래너에게 배정되었습니다. (${algoName})`;

            const rawReg = chosen.registration_number || '';
            const cleanRegNum = rawReg.includes('|') ? rawReg.split('|')[0] : (rawReg.startsWith('dist_') ? null : rawReg);

            const newPlannerBranding = {
              type: 'planner' as const,
              plannerId: chosen.id,
              agencyId: branding.agencyId,
              name: chosen.name,
              profileImageUrl: chosen.profile_image_url || null,
              logoUrl: chosen.logo_url || branding.logoUrl || null,
              greetingTitle: chosen.greeting_title || null,
              greetingContent: chosen.greeting_content || null,
              customPhone: chosen.custom_phone || chosen.phone || branding.customPhone,
              customAddress: chosen.custom_address || branding.customAddress,
              certificationMessage: (chosen as any).certification_message || null,
              kakaoLink: chosen.kakao_link || null,
              agencyName: chosen.company_name || branding.agencyName || null,
              agencyAddress: chosen.custom_address || branding.agencyAddress || null,
              registrationNumber: cleanRegNum || null,
              customEmail: chosen.email || branding.customEmail || null,
              leadRoutingType: branding.leadRoutingType,
            };
            updateBranding(newPlannerBranding);
          }
        } catch (err) {
          console.error('Error during auto distribution:', err);
        }
      }
    }

    if (autoAssignedLog) {
      initialTimeline.push({
        id: `system-dist-${Date.now()}`,
        type: 'system_log',
        author: '시스템',
        detail: autoAssignedLog,
        created_at: new Date().toISOString()
      });
    }

    const payload = {
      planner_id: chosenPlannerId,
      agency_id: branding.agencyId,
      name: analysis.name || '무명고객',
      phone: analysis.mobile || '010-0000-0000',
      age: analysis.age || 40,
      insurance_type: category,
      analysis_result: resultData,
      monthly_premium: category.includes('remodeling')
        ? (analysis.monthlyPremium || 0)
        : (resultData?.recommendations?.diet?.estimatedPremium || resultData?.estimatedPremium || 0),
      raw_payload: {
        gender: analysis.gender,
        jobClass: analysis.jobClass,
        category,
        consult_type: consultType || 'regular',
        utm_source: sessionStorage.getItem('ins_utm_source') || localStorage.getItem('ins_utm_source') || 'organic',
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
      setIsInRemodelingZone(true); // 정밀 분석 클릭 순간 floating bar 즉시 교체
      setShowComparisonBar(false);
      setRemodelingApplied(false);
      const result = await runAnalysis(analysis);
      result.simulation_code = simulationCode; // attach code
      setRemodelingResult({ ...result, _timestamp: Date.now() });
      // Automatically save lead upon analysis completion
      submitLead(analysis, 'remodeling', result);
    } else {
      setIsInRemodelingZone(false);
      setShowComparisonBar(true); // 비교 분석 클릭 순간 즉시 bar 표시
      setCurrentAnalysis(analysis);
      const result = await runAnalysis(analysis);
      result.simulation_code = simulationCode; // attach code
      setAnalysisResult({ ...result, _timestamp: Date.now() });
      setView('home'); // Ensure we are on home to see results
      // Automatically save lead upon analysis completion
      submitLead(analysis, analysis.selectedCategory || 'general', result);

      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  // 정밀 분석용 하이픈 연동 성공 핸들러 — floating bar에서 HyphenAuthModal 완료 시 호출
  const handleRemodelingHyphenSuccess = async (coverage: StandardizedCoverage) => {
    const analysisInput = {
      name: '고객',
      mobile: '010-0000-0000',
      age: coverage.age,
      gender: coverage.gender,
      jobClass: 1,
      selectedCategory: 'remodeling',
      cancer: { currentAmount: coverage.cancer_diagnosis, targetAmount: 50000000 },
      cerebrovascular: { currentAmount: coverage.brain_vascular, targetAmount: 30000000 },
      cardiovascular: { currentAmount: coverage.ischemic_heart, targetAmount: 30000000 },
      surgery: { currentAmount: (coverage as any).surgery_amount ?? 0, targetAmount: 10000000 },
      postDisability: { currentAmount: (coverage as any).post_disability_amount ?? 0, targetAmount: 30000000 },
      paymentExemption: 'standard' as const,
      healthStatus: 'standard' as const,
      monthlyPremium: coverage.current_total_premium,
      _remodelingCoverage: coverage
    };
    setIsInRemodelingZone(true);
    setShowComparisonBar(false);
    setRemodelingApplied(false);
    const result = await runAnalysis(analysisInput);
    result.simulation_code = currentSimulationCode || hyphenCodeParam || '';
    setRemodelingResult(result);
  };

  // 고객이 /remodeling?code= 링크 접속 후 인증 성공 → Supabase 저장 + 로컬 즉시 렌더링
  const handleExternalHyphenSuccess = async (coverage: StandardizedCoverage, customerInfo?: { name: string; phone: string }) => {
    // 1. 로컬 화면 즉시 갱신 (Supabase 성공 여부와 무관)
    await handleRemodelingHyphenSuccess(coverage);
    setShowExternalHyphenModal(false);

    // 2. Supabase 저장 (백그라운드)
    if (!hyphenCodeParam) return;
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('customer_leads')
        .select('*')
        .eq('raw_payload->>simulation_code', hyphenCodeParam)
        .limit(1);

      if (!data || data.length === 0) return;

      const lead = data[0];

      const analysisInput = {
        name: customerInfo?.name || lead.name || '고객',
        mobile: customerInfo?.phone || lead.phone || '010-0000-0000',
        age: coverage.age,
        gender: coverage.gender,
        jobClass: 1,
        selectedCategory: 'remodeling',
        cancer: { currentAmount: coverage.cancer_diagnosis, targetAmount: 50000000 },
        cerebrovascular: { currentAmount: coverage.brain_vascular, targetAmount: 30000000 },
        cardiovascular: { currentAmount: coverage.ischemic_heart, targetAmount: 30000000 },
        surgery: { currentAmount: (coverage as any).surgery_amount ?? 0, targetAmount: 10000000 },
        postDisability: { currentAmount: (coverage as any).post_disability_amount ?? 0, targetAmount: 30000000 },
        paymentExemption: 'standard' as const,
        healthStatus: 'standard' as const,
        monthlyPremium: coverage.current_total_premium,
        _remodelingCoverage: coverage
      };

      const result = await runAnalysis(analysisInput);
      result.simulation_code = hyphenCodeParam;

      const updatedPayload = {
        ...(lead.raw_payload || {}),
        hyphen_coverage: coverage,
        timeline: [
          {
            id: `hyphen-${Date.now()}`,
            type: 'system_log',
            author: '고객',
            detail: '고객이 한국신용정보원 인증을 완료하여 실제 보험 데이터가 조회되었습니다.',
            created_at: new Date().toISOString()
          },
          ...(lead.raw_payload?.timeline || [])
        ]
      };

      const updateData: any = {
        status: 'verified',
        raw_payload: updatedPayload,
        analysis_result: result,
        monthly_premium: coverage.current_total_premium || 0
      };
      if (customerInfo?.name && customerInfo.name !== '고객') updateData.name = customerInfo.name;
      if (customerInfo?.phone && customerInfo.phone !== '010-0000-0000') updateData.phone = customerInfo.phone;

      await supabase.from('customer_leads').update(updateData).eq('id', lead.id);
    } catch (err) {
      console.error('Supabase 저장 실패 (로컬 렌더링은 완료):', err);
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
    const cleanPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
    if (view === 'admin') {
      if (cleanPath !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
    } else if (view === 'partner') {
      if (cleanPath !== '/partner') {
        window.history.pushState({}, '', '/partner');
      }
    } else if (view === 'verify') {
      if (cleanPath !== '/verify') {
        window.history.pushState({}, '', '/verify' + window.location.search);
      }
    } else {
      if (cleanPath === '/admin' || cleanPath === '/partner' || cleanPath === '/verify') {
        window.history.pushState({}, '', '/');
      }
    }
  }, [view]);

  useEffect(() => {
    const handlePopState = () => {
      const cleanPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
      if (cleanPath === '/admin') {
        setView('admin');
      } else if (cleanPath === '/partner') {
        setView('partner');
      } else if (cleanPath === '/verify') {
        setView('verify');
      } else {
        setView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Preload the large hero background image to prevent pop-in flickering
  useEffect(() => {
    if (view === 'admin') return;
    const img = new Image();
    img.src = '/hero.webp';
    img.onload = () => setHeroImageLoaded(true);
    img.onerror = () => setHeroImageLoaded(true); // Prevent infinite loading if image fails
  }, [view]);

  // Set document title dynamically based on B2B branding
  useEffect(() => {
    if (view === 'admin' || view === 'partner') return;
    if (isB2BMode) {
      const agencyBrand = branding.agencyName || branding.name || '공식 제휴 보험대리점';
      document.title = `${agencyBrand} - 맞춤형 보장 비교 분석`;
    } else {
      document.title = '보험리밸런스 - 실시간 맞춤 보장 분석';
    }
  }, [isB2BMode, branding, view]);

  // Render splash screen while loading B2B branding or preloading critical hero image to prevent logo/UI pop-in flickering
  if (view !== 'admin' && view !== 'partner' && (loading || !heroImageLoaded)) {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950 text-white select-none">
        {/* Modern grand background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black opacity-90" />

        {/* Splash Content */}
        <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-6 animate-pulse duration-1000">
          {/* Logo Symbol Container */}
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden">
            <img
              src={isB2BMode && branding?.logoUrl && !branding.logoUrl.includes('6397187') ? branding.logoUrl : "/6397187-1.png"}
              alt={isB2BMode ? (branding?.name || "인카금융서비스") : "보험리밸런스"}
              className="w-16 h-16 object-contain"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              {isB2BMode ? (branding?.name || "인카금융서비스") : "보험리밸런스"}
            </h1>
            <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">
              {isB2BMode ? "0.1s Custom Analysis Engine" : "0.1s Big Data Analysis Engine"}
            </p>
          </div>

          {/* Loading Indicator */}
          <div className="flex items-center gap-1.5 pt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>

          <p className="text-[10px] text-slate-500 font-bold tracking-tight">
            {window.location.search.includes('planner') || window.location.search.includes('agency') || localStorage.getItem('pwa_saved_planner') || localStorage.getItem('pwa_saved_agency')
              ? '설계사 맞춤 솔루션을 안전하게 불러오는 중입니다...'
              : (isB2BMode ? '0.1초 비교 분석 시스템을 안전하게 불러오는 중입니다...' : '0.1초 빅데이터 분석 시스템을 안전하게 불러오는 중입니다...')}
          </p>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return <AdminDashboard initialTab={adminTab} />;
  }

  if (view === 'partner') {
    return (
      <PartnerLanding
        onNavigate={(newView, options) => {
          if (newView === 'admin' && options?.tab) {
            setAdminTab(options.tab);
          }
          setView(newView);
        }}
      />
    );
  }

  if (view === 'verify') {
    return (
      <div className="min-h-screen bg-slate-900 font-sans text-white antialiased flex flex-col justify-between">
        <div>
          <Header setView={setView} />
          <main className="pt-24 px-4 max-w-xl mx-auto w-full">
            <VerificationPage branding={branding} />
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (view === 'support') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased flex flex-col justify-between">
        <div>
          <Header setView={setView} />
          <main className="bg-white">
            <CustomerSupportSection
              branding={branding}
              onSubmitLead={submitLead}
              setView={setView}
              setCalcTarget={setCalcTarget}
            />
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (view === 'indemnity') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <SilsonExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('silson'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'preexisting') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs transition-all mb-6 shadow-lg shadow-indigo-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <PreExistingExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('pre'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'dental') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-teal-100 selection:text-teal-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-teal-600 text-white hover:bg-teal-700 font-black text-xs transition-all mb-6 shadow-lg shadow-teal-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <DentalExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('dental'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'caregiving') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 font-black text-xs transition-all mb-6 shadow-lg shadow-purple-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <CaregivingExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('care_svc'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }
  if (view === 'dementia') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-amber-50/30">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 text-white hover:bg-amber-700 font-black text-xs transition-all mb-6 shadow-lg shadow-amber-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <CaregivingOldSection isUnlocked={isUnlocked} onAction={() => { setCalcTarget('care_old'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'surgery') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 font-black text-xs transition-all mb-6 shadow-lg shadow-orange-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <SurgeryExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('surgery'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }
  if (view === 'cerebrovascular') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs transition-all mb-6 shadow-lg shadow-indigo-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <CerebrovascularExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('brain'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }
  if (view === 'heart') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 font-black text-xs transition-all mb-6 shadow-lg shadow-red-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <HeartExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('heart'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }
  if (view === 'cancer') {

    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-rose-100 selection:text-rose-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 font-black text-xs transition-all mb-6 shadow-lg shadow-rose-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <CancerExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('cancer'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'nursing') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-pink-600 text-white hover:bg-pink-700 font-black text-xs transition-all mb-6 shadow-lg shadow-pink-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <NursingSection isUnlocked={isUnlocked} onAction={() => { setCalcTarget('nursing'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'child_sick') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <ChildSickSection isUnlocked={isUnlocked} onAction={() => { setCalcTarget('pre_family'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'child') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 font-black text-xs transition-all mb-6 shadow-lg shadow-yellow-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <ChildPrenatalSection isUnlocked={isUnlocked} onAction={() => { setCalcTarget('child'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'car') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <CarExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('car'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'driver') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 text-white hover:bg-purple-700 font-black text-xs transition-all mb-6 shadow-lg shadow-purple-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <DriverExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('driver'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'pet') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 font-black text-xs transition-all mb-6 shadow-lg shadow-orange-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <PetExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('pet'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'health_general') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 font-black text-xs transition-all mb-6 shadow-lg shadow-orange-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <HealthGeneralExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('health_general'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'accident') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 font-black text-xs transition-all mb-6 shadow-lg shadow-red-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <AccidentExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('accident'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'credit') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <CreditExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('credit'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'golf') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 font-black text-xs transition-all mb-6 shadow-lg shadow-emerald-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <GolfExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('golf'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'fire_real') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-red-100 selection:text-red-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 font-black text-xs transition-all mb-6 shadow-lg shadow-red-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <FireExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('fire_real'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'property') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <PropertyExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('property'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'annuity') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-black text-xs transition-all mb-6 shadow-lg shadow-blue-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <AnnuityExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('pension'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'whole') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs transition-all mb-6 shadow-lg shadow-indigo-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <WholeLifeExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('whole'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'legal') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-slate-100 selection:text-slate-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-800 text-white hover:bg-slate-900 font-black text-xs transition-all mb-6 shadow-lg shadow-slate-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <LegalExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('legal'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'variable') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs transition-all mb-6 shadow-lg shadow-indigo-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <VariableExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('variable'); setView('home'); }} />
        </main>
        <Footer />
      </div>
    );
  }

  if (view === 'savings_general') {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-100 selection:text-emerald-900 antialiased">
        <Header setView={setView} />
        <main className="pt-12 px-2 sm:px-4 bg-white">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => { setCalcTarget(null); setView('home'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 font-black text-xs transition-all mb-6 shadow-lg shadow-emerald-500/20 active:scale-95 group"
            >
              메인으로 돌아가기
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </button>
          </div>
          <SavingsExplanation isUnlocked={isUnlocked} onAction={() => { setCalcTarget('savings_general'); setView('home'); }} />
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

        <InsuranceCalculator onCalculate={handleAnalyze} initialTarget={calcTarget} isUnlocked={isUnlocked} />

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
                    <AnalysisDashboard result={analysisResult} onSubmitLead={submitLead} branding={branding} isUnlocked={isUnlocked} />

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
                <p className="text-sm text-slate-500 font-semibold leading-relaxed break-keep mt-4 max-w-xl mx-auto">
                  💡 본 분석은 고객님이 입력하신 보험 종류 및 월 보험료를 기반으로 AI가 통계적으로 추정한 결과입니다. 실제 가입 특약·보장 금액과 차이가 있을 수 있으며, 정확한 보장 내역은{' '}
                  <span className="text-orange-500 font-black">실시간 고객상담</span>을 통해 실제 가입정보를 기준으로 확인하실 수 있습니다.
                </p>
              </div>

              {/* AI Executive Summary 코멘트 카드 */}
              {(() => {
                const coverage = (remodelingResult.analysis as any)._remodelingCoverage;
                const policies: any[] = coverage?.policies || [];

                // AnalysisDashboard의 "N개 보험 동시 리밸런싱" 카드와 완전히 동일한 계산
                const fallbackPremium = remodelingResult.analysis.monthlyPremium || 0;
                const totalCurrent = policies.reduce((s: number, p: any) => s + (p.monthly_premium || 0), 0) || fallbackPremium;
                const totalDiet = Math.round(totalCurrent * 0.785);
                const savingAmount = totalCurrent - totalDiet;

                const dietCompanyRaw = remodelingResult.recommendations.diet?.companyName || '';
                const dietCompany = dietCompanyRaw ? maskCompany(dietCompanyRaw, isUnlocked) : '';

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
                          {savingAmount > 0 ? (
                            <>매달 합리적으로 조정 가능한 보험료 <span className="text-orange-500 underline underline-offset-4 font-black">{savingAmount.toLocaleString()}원</span>을 찾아냈습니다!</>
                          ) : (
                            <>현재 보험 구조 분석 완료 — 보장 최적화 상담을 추천드립니다.</>
                          )}
                        </h4>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed break-keep">
                          고객님은 현재 총 <span className="text-slate-800 font-extrabold">{policies.length}건</span>의 보험을 유지 중이시며{dups.size > 0 && <>, 이 중 <span className="text-red-500 font-extrabold">{dups.size}건의 중복 가입 상품</span>이 확인되었습니다</>}.
                          {savingAmount > 0 ? (
                            <> {dietCompany ? <><span className="text-orange-500 font-extrabold">{dietCompany}</span> {totalDiet.toLocaleString()}원 플랜으로 전환 시,</> : <>최적 플랜({totalDiet.toLocaleString()}원)으로 전환 시,</>} 기존 핵심 보장을 동일하게 지키면서 매월 총 <span className="text-orange-500 font-extrabold">{savingAmount.toLocaleString()}원</span>의 기회 자산을 확보하실 수 있습니다.</>
                          ) : (
                            <> 현재 보장 구조에서 추가 보완이 필요한 항목을 확인해 드립니다. 설계사 상담을 통해 최적 포트폴리오를 제안받으세요.</>
                          )}
                        </p>
                      </div>

                      {/* CTA 버튼 / 신청 완료 상태 (웅장하고 눈에 띄는 다크 배너 박스) */}
                      <div className="pt-6 border-t border-orange-200/40">
                        {remodelingApplied ? (
                          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 animate-in fade-in duration-300 text-white">
                            {/* 헤더 */}
                            <div className="text-center space-y-1">
                              <p className="text-sm font-black text-white">고유 보관 코드가 발급되었습니다.</p>
                              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                                이 코드를 복사하여 1:1 카카오톡 상담방에서 전송하고, 설계사가 본인인증을 통해 설계안을 안전하게 보관해 드립니다.
                              </p>
                            </div>
                            {/* 코드 박스 */}
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col items-center gap-2">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">나의 고유 보관 코드</span>
                              <span className="text-xl font-black text-orange-500 font-mono tracking-wider">{currentSimulationCode || '발급 중...'}</span>
                            </div>
                            {/* 복사 버튼 */}
                            <button
                              onClick={() => {
                                if (currentSimulationCode) {
                                  navigator.clipboard.writeText(currentSimulationCode);
                                  alert('코드가 복사되었습니다! 카카오톡 채팅방에 붙여넣어 주세요.');
                                }
                              }}
                              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition-colors cursor-pointer"
                            >
                              코드 복사하기 📋
                            </button>
                            {/* 카카오톡 입장 버튼 */}
                            <button
                              onClick={() => {
                                const kLink = branding.kakaoLink || 'https://open.kakao.com/o/sB1B2C3D';
                                if (lastSubmittedLeadId) logKakaoClick(lastSubmittedLeadId, 'anonymous');
                                window.open(kLink, '_blank');
                              }}
                              className="w-full py-3 bg-[#FEE500] hover:bg-[#FDD800] text-black font-black text-xs rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                              <span>💬</span> 카카오톡 1:1 상담방 입장하기
                            </button>
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
                              👉 실시간 고객 상담 무료 신청
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
                        {isUnlocked ? (
                          <>
                            본 리스트의 <span className="text-slate-800 font-extrabold">보험 회사, 상품명, 월 납입 보험료</span>는 한국신용정보원 본인정보 열람서비스(내보험다보여)를 통해 실시간으로 수집된 실제 가입 정보입니다. 다만, <span className="text-slate-800 font-extrabold">가입 특약 및 세부 보장 금액</span>은 AI 엔진이 표준 요율을 기반으로 역산하여 추정한 분석값이므로, 실제 가입 증권과 차이가 있을 수 있습니다. 계약 체결 전 반드시 고객의 실제 증권을 다시 한번 확인하시기 바랍니다.
                          </>
                        ) : (
                          <>
                            본 리스트의 <span className="text-slate-800 font-extrabold">보험 회사, 상품명, 월 납입 보험료</span>는 고객님이 입력한 수치를 기반으로 AI 엔진이 표준 요율을 기반으로 역산하여 추정한 분석값이므로, 실제 가입 증권과 차이가 있을 수 있습니다. 계약 체결 전 반드시 고객의 실제 증권을 다시 한번 확인하시기 바랍니다.
                          </>
                        )}
                      </p>
                    </div>

                    {/* Policy Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {coverage.policies.map((policy: any, pIdx: number) => (
                        <div key={pIdx} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                {policy.insurance_company && (
                                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black">
                                    {maskCompany(policy.insurance_company, isUnlocked)}
                                  </span>
                                )}
                                <h4 className="text-base font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                  {maskProductName(policy.product_name, isUnlocked)}
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
                  {isUnlocked ? (
                    <>
                      💡 본 분석은 한국신용정보원의 상품명과 월 납입 보험료 정보를 기반으로, AI가 표준 보험 요율에 맞춰 가입 특약 및 보장 금액을 정교하게 역산한 추정치입니다. 실제 가입하신 보험 증권의 세부 구성에 따라 차이가 있을 수 있으므로 정확한 진단은 전문 설계사의 정밀 상담을 권장합니다.
                    </>
                  ) : (
                    <>
                      💡 본 분석은 고객님이 입력한 수치를 기반으로, AI가 표준 보험 요율에 맞춰 가입 특약 및 보장 금액을 정교하게 역산한 추정치입니다. 실제 가입하신 보험 증권의 세부 구성에 따라 차이가 있을 수 있으므로 정확한 진단은 전문 설계사의 정밀 상담을 권장합니다.
                    </>
                  )}
                </p>
              </div>
              <AnalysisDashboard result={remodelingResult} onSubmitLead={submitLead} branding={branding} isUnlocked={isUnlocked} />


            </motion.section>
          )}
        </AnimatePresence>

        <ProblemSection />

        <PhilosophySection />
      </main>

      <Footer />
      <PlannerWidget branding={branding} onKakaoClick={handlePlannerWidgetKakaoClick} />

      {/* PWA In-App Browser & iOS Safari Guidance Modal */}
      {showInAppGuide && !isB2BMode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-[2.5rem] p-6 max-w-sm w-full space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header / Icon */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-lg font-black tracking-tight mt-2">
                {isInAppBrowser ? '안전하고 빠른 앱 설치 안내' : '아이폰 앱 바로가기 설치 안내'}
              </h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed break-keep">
                {isInAppBrowser ? (
                  <>
                    현재 접속하신 인스타그램/페이스북/카카오톡 화면 내에서는 직접 앱을 다운로드할 수 없습니다.
                    아래 순서에 따라 **기본 브라우저(사파리 또는 크롬)**로 이동하여 편리하게 앱을 설치해 주세요!
                  </>
                ) : (
                  <>
                    아이폰 사파리(Safari) 브라우저에서 아래 순서에 따라 홈 화면에 바로가기 앱을 등록해 보세요.
                    아이콘 터치 한 번으로 0.1초 만에 보험 분석을 시작할 수 있습니다!
                  </>
                )}
              </p>
            </div>

            {/* Instruction Steps */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
              {isInAppBrowser ? (
                isIOS ? (
                  <>
                    <div className="flex items-start gap-3 text-left">
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-white">1</span>
                      <p className="text-xs font-bold text-slate-200">
                        화면 아래에 있는 **공유(내보내기) 버튼** 또는 우측 하단 **점 3개(...)** 버튼을 터치해 주세요.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-white">2</span>
                      <p className="text-xs font-bold text-slate-200">
                        옵션 메뉴 중에서 **[Safari로 열기]** 또는 **[기본 브라우저로 열기]**를 선택해 주세요.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 text-left">
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-white">1</span>
                      <p className="text-xs font-bold text-slate-200">
                        화면 우측 상단에 있는 **점 3개(더보기 `⋮`)** 버튼을 터치해 주세요.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <span className="w-5 h-5 rounded-full bg-orange-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-white">2</span>
                      <p className="text-xs font-bold text-slate-200">
                        메뉴 중에서 **[다른 브라우저로 열기]** 또는 **[Chrome으로 열기]**를 선택해 주세요.
                      </p>
                    </div>
                  </>
                )
              ) : (
                /* iOS Safari Native PWA Add to Home Screen Instructions */
                <>
                  <div className="flex items-start gap-3 text-left">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-white">1</span>
                    <p className="text-xs font-bold text-slate-200">
                      사파리 브라우저 화면 하단의 **[공유(내보내기)]** 아이콘을 터치해 주세요.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 text-left">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 text-white">2</span>
                    <p className="text-xs font-bold text-slate-200">
                      메뉴를 아래로 스크롤하여 **[홈 화면에 추가]** 버튼을 선택해 주세요.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setShowInAppGuide(false)}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow-lg transition-colors cursor-pointer text-center"
              >
                확인했습니다
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🔒 PII-Free Pivot: Sticky Floating Bottom Bar for Unmasking (비교 분석 구간) */}
      {(analysisResult || showComparisonBar) && !isUnlocked && !isInRemodelingZone && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
          <div className="bg-slate-950/90 text-white rounded-[2rem] p-4.5 border border-slate-800 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4">
            <div className="text-left space-y-0.5 pl-1">
              <p className="text-[11px] font-black text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                익명 안심 비교 모드
              </p>
              <h4 className="text-xs font-black text-slate-200">
                실시간 상담 요청 시 실명 공개
              </h4>
            </div>
            <button
              onClick={() => setShowUnlockModal(true)}
              className="px-5 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-950/40 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              실시간 상담 요청하기
            </button>
          </div>
        </div>
      )}

      {/* 🔬 정밀 분석 구간 Floating Bar */}
      {isInRemodelingZone && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-950/95 text-white rounded-[2rem] p-4 border border-orange-500/30 backdrop-blur-md shadow-[0_20px_40px_rgba(255,107,0,0.15)] flex items-center justify-between gap-3">
            <div className="text-left space-y-0.5 pl-1 flex-1 min-w-0">
              <p className="text-[10px] font-black text-orange-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                내보험 정밀 분석모드
              </p>
              <h4 className="text-[11px] font-black text-white leading-tight">
                🔍 실제 내가 가입한 보험, 지금 바로 확인
              </h4>
              <p className="text-[9px] text-slate-400 font-semibold">
                한국신용정보원 연동 후 자동진단
              </p>
            </div>
            <button
              onClick={() => setShowUnlockModal(true)}
              className="shrink-0 px-3.5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-[10px] rounded-xl shadow-lg shadow-orange-950/40 transition-all flex items-center gap-1 whitespace-nowrap"
            >
              💬 실시간 고객 상담 (무료)
            </button>
          </div>
        </div>
      )}

      {/* 🔒 PII-Free Pivot: Unmasking Instruction Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-[2.5rem] p-6 max-w-sm w-full space-y-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            <button
              onClick={() => setShowUnlockModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer transition-colors text-base font-extrabold"
            >
              ✕
            </button>

            <div className="space-y-1.5 text-center">
              <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-base font-black tracking-tight text-white">상세 상품 정보 안내</h3>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed break-keep">
                블라인드 처리된 구체적인 회사명 및 상품명은<br />
                1:1 실시간 상담 시 투명하고 상세하게 안내해 드립니다.
              </p>
            </div>

            {/* Code Box */}
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">나의 고유 설계 코드</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-orange-500 font-mono tracking-wider">
                  {currentSimulationCode || '발급 중...'}
                </span>
                <button
                  onClick={() => {
                    if (currentSimulationCode) {
                      navigator.clipboard.writeText(currentSimulationCode);
                      alert('설계 코드가 복사되었습니다! 대화방에 붙여넣어 주세요.');
                    }
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-black rounded-lg transition-colors"
                >
                  복사
                </button>
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="bg-slate-950/40 border border-slate-850/50 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5 text-slate-300">1</span>
                <p className="text-[10px] font-semibold text-slate-300 leading-normal">
                  아래 1:1 상담 오픈채팅방 링크로 이동합니다.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5 text-slate-300">2</span>
                <p className="text-[10px] font-semibold text-slate-300 leading-normal">
                  입장 후 복사한 고유 코드 <strong className="text-orange-500 font-mono">{currentSimulationCode}</strong>를 메시지로 전송해 주세요.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5 text-slate-300">3</span>
                <p className="text-[10px] font-semibold text-slate-300 leading-normal">
                  실시간 상담 요청을 완료하고, 대화방 링크를 통해 실명 정보 잠금 해제를 완료합니다.
                </p>
              </div>
            </div>

            {/* Redirect Button */}
            <button
              onClick={() => {
                setIsAiChatOpen(true);
                setShowUnlockModal(false);
              }}
              className="w-full py-3.5 bg-[#FEE500] hover:bg-[#FDD800] text-black font-black text-xs rounded-xl shadow-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
            >
              💬 1:1 상담 요청하고 대화방 입장하기
            </button>
          </div>
        </div>
      )}
      {/* 🔬 정밀 분석용 하이픈 연동 모달 — floating bar에서 트리거 */}
      <HyphenAuthModal
        isOpen={isRemodelingHyphenOpen}
        onClose={() => setIsRemodelingHyphenOpen(false)}
        onSuccess={(coverage) => {
          setIsRemodelingHyphenOpen(false);
          handleRemodelingHyphenSuccess(coverage);
        }}
        defaultTab="register"
        initialData={{
          userName: '고객',
          gender: (remodelingResult?.analysis?.gender as 'M' | 'F') || 'M',
          birth: '',
          mobileNo: '',
          age: remodelingResult?.analysis?.age || 40,
        }}
      />

      {/* 고객이 /remodeling?code=... 링크 접속 시 자동 오픈 */}
      <HyphenAuthModal
        isOpen={showExternalHyphenModal}
        onClose={() => setShowExternalHyphenModal(false)}
        onSuccess={handleExternalHyphenSuccess}
        initialData={externalLeadData || {
          userName: '',
          gender: 'M',
          birth: '',
          mobileNo: '',
          age: 40,
        }}
      />

      {/* 🔒 알리고 SMS 본인인증 모달 (마스킹 해제용) */}
      {showAligoAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-y-auto max-h-[95vh] scrollbar-none">
            <VerificationPage 
              branding={branding} 
              initialCode={currentSimulationCode || ''} 
              onClose={() => setShowAligoAuthModal(false)}
              onSuccess={() => {
                setTimeout(() => {
                  setShowAligoAuthModal(false);
                  setIsUnlocked(true);
                }, 2500);
              }}
            />
          </div>
        </div>
      )}

      {/* 🤖 실시간 고객 상담 AI 위젯 */}
      {view !== 'admin' && view !== 'partner' && (isAiEnabled || isAiChatOpen) && branding.plannerId && (
        <AiChatWidget
          plannerId={branding.plannerId}
          plannerName={branding.name || '담당'}
          agencyName={branding.agencyName}
          agencyId={branding.agencyId}
          leadSource={branding.type === 'planner' ? 'direct' : (branding.type === 'agency' ? 'distribute' : 'organic')}
          currentSimulationCode={currentSimulationCode}
          onTriggerAuth={() => setIsRemodelingHyphenOpen(true)}
          isUnlocked={isUnlocked}
          externalIsOpen={isAiChatOpen}
          onCloseExternal={() => setIsAiChatOpen(false)}
          registrationNumber={branding.registrationNumber}
          customPhone={branding.customPhone}
          customEmail={branding.customEmail}
          customAddress={branding.customAddress || branding.agencyAddress}
          certificationMessage={branding.certificationMessage}
          logoUrl={branding.logoUrl || null}
        />
      )}
    </div>
  );
}
