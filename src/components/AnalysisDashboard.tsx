import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldCheck, Zap, Calculator, Target, Brain, Heart, Stethoscope, Clock, Hotel, Baby, Sparkles, TrendingUp, Plane, Gift, Dog, Cat, Scale, Building, PiggyBank, Coins, Send, Smartphone } from 'lucide-react';
import { AnalysisResult } from '../types/insurance';
import RadarChart from './RadarChart';
import ComparisonTable from './ComparisonTable';
import { PerPolicyDashboard } from './insurance/remodeling/PerPolicyDashboard';
import { HealthSummary } from './insurance/health/HealthSummary';
import { SilsonSummary } from './insurance/silson/SilsonSummary';
import { CaregivingSummary } from './insurance/caregiving/CaregivingSummary';
import { DentalSummary } from './insurance/dental/DentalSummary';
import { SurgerySummary as SurgeryHospitalSummary } from './insurance/surgery/SurgerySummary';
import { BrainSummary } from './insurance/brain/BrainSummary';
import { CancerSummary } from './insurance/cancer/CancerSummary';
import { HeartSummary } from './insurance/heart/HeartSummary';
import { PreExistingSummary } from './insurance/preExisting/PreExistingSummary';
import { NursingSummary } from './insurance/nursing/NursingSummary';
import { ChildSummary } from './insurance/child/ChildSummary';
import { CarSummary } from './insurance/car/CarSummary';
import { AccidentSummary } from './insurance/accident/AccidentSummary';

import { DriverSummary } from './insurance/driver/DriverSummary';
import { PetSummary } from './insurance/pet/PetSummary';
import { GolfSummary } from './insurance/golf/GolfSummary';
import { FireSummary } from './insurance/fire/FireSummary';
import { AnnuitySummary } from './insurance/annuity/AnnuitySummary';
import { WholeLifeSummary } from './insurance/wholeLife/WholeLifeSummary';
import { VariableSummary } from './insurance/variable/VariableSummary';
import { HealthGeneralSummary } from './insurance/healthGeneral/HealthGeneralSummary';

import { CreditSummary } from './insurance/credit/CreditSummary';
import { LegalSummary } from './insurance/legal/LegalSummary';
import { PropertySummary } from './insurance/property/PropertySummary';
import { SavingsSummary } from './insurance/savings/SavingsSummary';
import disclosureDates from '../lib/insurance/disclosure_dates.json';
import { AIPremiumReport } from './AIPremiumReport';


interface AnalysisDashboardProps {
  result: AnalysisResult;
  onSubmitLead?: (analysis: any, category: string, resultData: any, consultType?: 'anonymous' | 'regular') => Promise<any> | void;
  branding?: any;
}

// ─── 보험 타입별 요약 컴포넌트 1:1 맵 ───────────────────────────────────────
// selectedCategory 문자열을 key로 사용하여 정확한 컴포넌트를 렌더링합니다.
// !!analysis.xxx 데이터 기반 폴백 조건을 제거하여 뒤집어지는 문제를 근본 해결합니다.
type SummaryComponentType = React.ComponentType<{ result: any; formatAmount?: (amt: number) => string }>;

const formatAmountUtil = (amt: number): string => {
  if (amt >= 100000000) return `${(amt / 100000000).toFixed(0)}억 원`;
  if (amt >= 10000) return `${(amt / 10000).toLocaleString()}만 원`;
  return `${amt.toLocaleString()}원`;
};

// 정확한 키(exact match) 맵 — selectedCategory 값과 1:1 대응
const EXACT_SUMMARY_MAP: Record<string, SummaryComponentType> = {
  'child':           ChildSummary,
  'pre_family':      ChildSummary,
  'child_sick':      ChildSummary,
  '유병력자 전용':    ChildSummary,
  'accident':        AccidentSummary,
  'car':             CarSummary,
  'driver':          DriverSummary,
  'pet':             PetSummary,
  'golf':            GolfSummary,
  'fire_real':       FireSummary,
  'annuity_savings': AnnuitySummary,
  'whole':           WholeLifeSummary,
  'variable':        VariableSummary,
  'term':            VariableSummary,
  'health_general':  HealthGeneralSummary,
  'credit':          CreditSummary,
  'legal':           LegalSummary,
  'property':        PropertySummary,
  'home':            PropertySummary,
  'savings_general': SavingsSummary,
  '재가/시설':        NursingSummary,
};

// 부분 문자열(includes) 맵 — 순서가 중요: 더 구체적인 것을 먼저
const PARTIAL_SUMMARY_MAP: Array<[string, SummaryComponentType]> = [
  ['치아',     DentalSummary],
  ['실손',     SilsonSummary],
  ['실비',     SilsonSummary],
  ['어린이',   ChildSummary],
  ['태아',     ChildSummary],
  ['유병력자', ChildSummary],
  ['상해',     AccidentSummary],
  ['간병',     CaregivingSummary],
  ['재가',     NursingSummary],
  ['시설',     NursingSummary],
  ['수술',     SurgeryHospitalSummary],
  ['입원',     SurgeryHospitalSummary],
  ['뇌혈관',   BrainSummary],
  ['암보험',   CancerSummary],
  ['심장질환', HeartSummary],
  ['유병자',   PreExistingSummary],
  ['자동차',   CarSummary],
  ['운전자',   DriverSummary],
  ['펫',       PetSummary],
  ['골프',     GolfSummary],
  ['주택화재', FireSummary],
  ['화재',     FireSummary],
  ['연금',     AnnuitySummary],
  ['종신',     WholeLifeSummary],
  ['변액',     VariableSummary],
  ['정기',     VariableSummary],
  ['종합건강', HealthGeneralSummary],
  ['신용',     CreditSummary],
  ['민사',     LegalSummary],
  ['형사',     LegalSummary],
  ['법률',     LegalSummary],
  ['재물',     PropertySummary],
  ['일반 저축', SavingsSummary],
];

const InsuranceSummary = ({ result }: { result: AnalysisResult }) => {
  const category = result.analysis.selectedCategory ?? '';

  // 1. 정확한 키 매칭
  const ExactComponent = EXACT_SUMMARY_MAP[category];
  if (ExactComponent) return <ExactComponent result={result as any} formatAmount={formatAmountUtil} />;

  // 2. 부분 문자열 매칭 (순서 보장)
  const partialMatch = PARTIAL_SUMMARY_MAP.find(([key]) => category.includes(key));
  if (partialMatch) {
    const PartialComponent = partialMatch[1];
    return <PartialComponent result={result as any} formatAmount={formatAmountUtil} />;
  }

  // 3. 폴백: 일반 건강보험
  return <HealthSummary result={result as any} formatAmount={formatAmountUtil} />;
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onSubmitLead, branding }) => {
  const { scores, efficiency, deficiencies, analysis } = result;
  const cat = analysis.selectedCategory ?? '';

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback clipboard copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  // ─── selectedCategory 단일 기반 — !!analysis.xxx 폴백 없음 ────────────────
  const isDental        = cat.includes('치아');
  const isSilbi         = cat.includes('실손')    || cat.includes('실비');
  const isCaregiving    = cat.includes('간병');
  const isNursing       = cat === '재가/시설'     || cat.includes('재가') || cat.includes('시설');
  const isSurgeryHospital = cat.includes('수술')  || cat.includes('입원');
  const isChild         = cat.includes('어린이')  || cat.includes('태아') || cat === 'child' || cat === 'pre_family' || cat === 'child_sick' || cat.includes('유병력자');
  const isAccident      = cat.includes('상해')    || cat === 'accident';
  const isCar           = cat.includes('자동차')  || cat === 'car';
  const isDriver        = cat.includes('운전자')  || cat === 'driver';
  const isPet           = cat.includes('펫')      || cat === 'pet';
  const isGolf          = cat.includes('골프')    || cat === 'golf';
  const isProperty      = cat.includes('재물')    || cat === 'property' || cat === 'home';
  const isFire          = (cat.includes('주택화재') || cat.includes('화재') || cat === 'fire_real') && !isProperty;
  const isAnnuity       = cat.includes('연금')    || cat === 'annuity_savings';
  const isWholeLife     = cat.includes('종신')    || cat === 'whole';
  const isVariable      = cat.includes('변액')    || cat.includes('정기') || cat === 'variable' || cat === 'term';
  const isHealthGeneral = cat.includes('종합건강') || cat === 'health_general';
  const isCredit        = cat.includes('신용')    || cat === 'credit';
  const isLegal         = cat.includes('법률')    || cat === 'legal';
  const isSavingsGeneral = cat.includes('일반 저축') || cat === 'savings_general';

  const getDisclosureDate = () => {
    if (isDental) return disclosureDates.dental;
    if (isSilbi) return disclosureDates.silson;
    if (isCaregiving) return disclosureDates.caregiving;
    if (isNursing) return disclosureDates.nursing;
    if (isSurgeryHospital) return disclosureDates.surgery_hospital;
    if (isChild) return disclosureDates.child;
    if (isAccident) return disclosureDates.accident;
    if (isCar) return disclosureDates.car;
    if (isDriver) return disclosureDates.driver;
    if (isPet) return disclosureDates.pet;
    if (isGolf) return disclosureDates.golf;
    if (isProperty) return disclosureDates.property;
    if (isFire) return disclosureDates.fire;
    if (isAnnuity) return disclosureDates.annuity;
    if (isWholeLife) return disclosureDates.whole_life;
    if (isVariable) return disclosureDates.variable;
    if (isHealthGeneral) return disclosureDates.health_general;
    if (isCredit) return disclosureDates.credit;
    if (isLegal) return disclosureDates.legal;
    if (isSavingsGeneral) return disclosureDates.savings_general;
    return "2026년 06월 공시";
  };


  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);
  const [applied, setApplied] = React.useState(false);
  const [isUnderwritingOpen, setIsUnderwritingOpen] = React.useState(false);
  const [uwName, setUwName] = React.useState('');
  const [uwPhone, setUwPhone] = React.useState('');
  const [uwSurgery, setUwSurgery] = React.useState(false);
  const [uwHospitalization, setUwHospitalization] = React.useState(false);
  const [uwMedication, setUwMedication] = React.useState(false);
  const [uwNone, setUwNone] = React.useState(false);
  const [uwSubmitting, setUwSubmitting] = React.useState(false);

  // SMS Storage Locker States & Handler
  const [smsName, setSmsName] = React.useState('');
  const [smsPhone, setSmsPhone] = React.useState('');
  const [smsSubmitting, setSmsSubmitting] = React.useState(false);
  const [smsSuccess, setSmsSuccess] = React.useState(false);

  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (smsSubmitting) return;
    setSmsSubmitting(true);
    try {
      const category = result.analysis.selectedCategory || 'general';
      const simCode = (result as any).simulation_code || '';
      
      let simulated = false;
      try {
        const origin = window.location.origin;
        const msg = `[보험리밸런스]
안녕하세요, ${smsName} 고객님.
요청하신 비교 설계안 보관 링크입니다.

🔑 고유 코드: ${simCode}
🔗 모바일 보고서 링크:
${origin}/?code=${simCode}

보안된 서버에 안전하게 보관되었습니다. 언제든 분석 결과를 다시 확인하실 수 있습니다.`;

        const smsRes = await fetch('/api/send-sms-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'send-link',
            phone: smsPhone,
            message: msg
          })
        });

        const smsData = await smsRes.json();
        if (smsData?.simulated) {
          simulated = true;
        }
      } catch (smsErr) {
        console.error("SMS transmission error:", smsErr);
      }

      if (onSubmitLead) {
        const customAnalysis = {
          ...result.analysis,
          name: smsName,
          mobile: smsPhone
        };
        await onSubmitLead(
          customAnalysis,
          `${category}_sms`,
          result,
          'regular'
        );
      }
      
      setSmsSuccess(true);
      if (simulated) {
        alert(`[시뮬레이션 안내]\n알리고 API IP 제한으로 인해 SMS가 발송된 것으로 시뮬레이션 처리되었습니다.\n\n고객명: ${smsName}\n연락처: ${smsPhone}\n설계 코드: ${simCode}\n링크: ${window.location.origin}/?code=${simCode}`);
      } else {
        alert(`[알림톡/SMS 발송 완료]\n\n고유 설계 코드: [ ${simCode} ]\n\n${smsName} 고객님(${smsPhone})께 모바일 비교 보고서 보관용 링크가 발송되었습니다.`);
      }
    } catch (err) {
      console.error(err);
      alert("전송 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSmsSubmitting(false);
    }
  };

  const handleUnderwritingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uwSubmitting) return;
    setUwSubmitting(true);
    try {
      const category = result.analysis.selectedCategory || 'general';
      
      if (onSubmitLead) {
        const customAnalysis = {
          ...result.analysis,
          name: uwName,
          mobile: uwPhone
        };
        const customPayload = {
          ...result,
          underwriting: {
            hasSurgery: uwSurgery,
            hasHospitalization: uwHospitalization,
            hasMedication: uwMedication,
            hasNone: uwNone
          }
        };
        await onSubmitLead(
          customAnalysis, 
          `${category}_underwriting`, 
          customPayload, 
          'regular'
        );
      }
      
      alert("사전 심사 신청이 성공적으로 완료되었습니다!\n설계사가 5년 이내 과거 병력 고지 사항을 검토하여 0.1초 만에 실제 인수 동의 및 할증 금액 심사 결과를 안내해 드립니다.");
      setIsUnderwritingOpen(false);
    } catch (err) {
      console.error(err);
      alert("신청 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setUwSubmitting(false);
    }
  };
  const isRemodeling = !!(analysis as any)._allDietOptions && !!(analysis as any)._allUpgradeOptions;
  const allDietOptions = (analysis as any)._allDietOptions || [];
  const allUpgradeOptions = (analysis as any)._allUpgradeOptions || [];

  // --- 마법의 리모델링 머니 가이드 연산 ---
  const currentPrem = analysis.monthlyPremium || 0;
  const dietPrem = result.recommendations?.diet?.estimatedPremium || 0;
  const monthlySaving = Math.max(0, currentPrem - dietPrem);
  const showSaving = monthlySaving > 0 ? monthlySaving : 22590; // 디폴트 22,590원 적용!
  const showDiet = dietPrem > 0 ? dietPrem : 8910; // 디폴트 8,910원 적용!

  const getAverageByAge = (age: number) => {
    if (age < 30) return { c: 50, b: 40, h: 40, s: 60, l: 30, d: 20 };
    if (age < 50) return { c: 65, b: 55, h: 50, s: 75, l: 50, d: 50 };
    return { c: 55, b: 45, h: 45, s: 85, l: 70, d: 60 };
  };

  const avg = getAverageByAge(analysis.age);

  const radarData = isDental ? [
    { label: '임플란트', value: analysis.dental?.implantLimit === 'unlimited' ? 95 : 70, target: 60 },
    { label: '브릿지', value: 65, target: 55 },
    { label: '틀니', value: analysis.dental?.dentures === 'yes' ? 30 : 90, target: 50 },
    { label: '크라운', value: analysis.dental?.crownAmount === 500000 ? 95 : analysis.dental?.crownAmount === 300000 ? 75 : 50, target: 65 },
    { label: '치아건강', value: (analysis.dental?.lastYear === 'no' && analysis.dental?.last5Years === 'no') ? 95 : 50, target: 60 },
    { label: '충전치료', value: 80, target: 60 },
  ] : isWholeLife ? [
    { label: '사망금규모', value: scores.cancerScore || 80, target: 70 },
    { label: '환급율효율', value: scores.cerebrovascularScore || 80, target: 65 },
    { label: '납기구조', value: scores.cardiovascularScore || 85, target: 70 },
    { label: '물가상방어', value: analysis.wholeLife?.isStepUp ? 95 : 45, target: 70 },
    { label: '연금전환성', value: analysis.wholeLife?.objective === 'savings' ? 90 : 75, target: 70 },
    { label: '가입가성비', value: analysis.wholeLife?.refundType === 'low' ? 92 : 60, target: 75 }
  ] : isVariable ? (
    (['term', 'term_pure', 'term_ceo', 'variable_term'].includes(analysis.variable?.subType)) ? [
      { label: '사망보장액', value: scores.cancerScore || 80, target: 70 },
      { label: '보장만기설계', value: scores.cerebrovascularScore || 80, target: 65 },
      { label: '우량체할인율', value: scores.cardiovascularScore || 85, target: 70 },
      { label: '종신대비가성비', value: 98, target: 60 },
      { label: '납기유연성', value: 85, target: 70 },
      { label: '위험대응적합도', value: 90, target: 75 }
    ] : [
      { label: '투자매칭', value: scores.cancerScore || 80, target: 70 },
      { label: '납입안정성', value: scores.cerebrovascularScore || 80, target: 65 },
      { label: '위험관리', value: scores.cardiovascularScore || 85, target: 70 },
      { label: '수익지향성', value: analysis.variable?.equityRatio || 50, target: 60 },
      { label: '비과세효율', value: (analysis.variable?.paymentPeriod || 10) >= 10 ? 95 : 50, target: 70 },
      { label: '가입가성비', value: 92, target: 75 }
    ]
  ) : isCaregiving ? [
    { label: '지원방식', value: analysis.caregiving?.type === 'support' ? 90 : 80, target: 70 },
    { label: '체증형보장', value: analysis.caregiving?.isStepUp ? 95 : 40, target: 75 },
    { label: '인건비대응', value: analysis.caregiving?.isStepUp ? 90 : 50, target: 80 },
    { label: '요양병원', value: 85, target: 75 },
    { label: '면책기간', value: 100, target: 100 },
    { label: '보장효율', value: 80, target: 70 },
  ] : isNursing ? [
    { label: '지원방식', value: analysis.nursing?.preferredService === 'both' ? 95 : 75, target: 70 },
    { label: '재가한도', value: (analysis.nursing?.homeAmount || 0) >= 500000 ? 90 : 60, target: 75 },
    { label: '시설한도', value: (analysis.nursing?.facilityAmount || 0) >= 500000 ? 90 : 60, target: 75 },
    { label: '대리청구', value: analysis.nursing?.hasProxyClaim ? 95 : 30, target: 80 },
    { label: '면책기간', value: 100, target: 100 },
    { label: '보장효율', value: 85, target: 70 },
  ] : isChild ? [
    { label: '태아/선천보장', value: analysis.child?.targetAgeGroup === 'prenatal' ? (analysis.child?.hasPrenatalRider && (analysis.child?.weeksPregnancy || 12) <= 22 ? 95 : 30) : 85, target: 80 },
    { label: '3대중대질환', value: scores.cancerScore || 80, target: 70 },
    { label: '입원일당', value: scores.cardiovascularScore || 75, target: 60 },
    { label: '수술비보장', value: scores.cerebrovascularScore || 80, target: 65 },
    { label: '만기설정', value: analysis.child?.maturity === 100 ? 95 : 80, target: 70 },
    { label: '보험료효율', value: Math.round(efficiency), target: 70 },
  ] : isSilbi ? [
    { label: '세대분석', value: (analysis.monthlyPremium || 0) > 40000 ? 40 : 90, target: 70 },
    { label: '자기부담금', value: 85, target: 80 },
    { label: '입원보장', value: 90, target: 85 },
    { label: '통원보장', value: 90, target: 85 },
    { label: '비급여특약', value: 70, target: 80 },
    { label: '가성비', value: (analysis.monthlyPremium || 0) < 20000 ? 95 : 70, target: 75 },
  ] : isCar ? [
    { label: '마일리지할인', value: analysis.car?.annualMileage === 'under_3k' ? 95 : analysis.car?.annualMileage === 'under_5k' ? 80 : analysis.car?.annualMileage === 'under_10k' ? 65 : 35, target: 70 },
    { label: '안전운전특약', value: analysis.car?.safeDrivingScore === 'over_80' ? 95 : analysis.car?.safeDrivingScore === 'under_80' ? 75 : 45, target: 70 },
    { label: '대물배상한도', value: analysis.car?.currentPropertyLimit >= 10 ? 95 : analysis.car?.currentPropertyLimit >= 5 ? 85 : 55, target: 75 },
    { label: '상해보장형태', value: analysis.car?.currentInjuryType === 'jasang' ? 95 : 45, target: 80 },
    { label: '무보험차특약', value: 85, target: 70 },
    { label: '긴급출동서비스', value: 90, target: 75 },
  ] : isDriver ? [
    { label: '형사합의 보장', value: analysis.driver?.planType === 'premium' ? 95 : analysis.driver?.planType === 'standard' ? 80 : 60, target: 75 },
    { label: '변호사 선임비', value: analysis.driver?.planType === 'premium' ? 95 : 75, target: 70 },
    { label: '벌금 한도', value: analysis.driver?.planType === 'saving' ? 65 : 90, target: 70 },
    { label: '자부상 보장', value: analysis.driver?.planType === 'premium' ? 90 : 70, target: 65 },
    { label: '영업용 대응', value: analysis.driver?.drivingPurpose === 'commercial' ? 85 : 95, target: 80 },
    { label: '보험료 효율', value: analysis.driver?.planType === 'saving' ? 95 : analysis.driver?.planType === 'premium' ? 60 : 80, target: 70 },
  ] : isPet ? [
    { label: '슬개골 탈구', value: scores.patellaScore || 30, target: 70 },
    { label: '피부 질환', value: scores.skinScore || 40, target: 70 },
    { label: '구강/치과', value: scores.dentalScore || 30, target: 70 },
    { label: '동물등록', value: analysis.pet?.isRegistered ? 95 : 50, target: 70 },
    { label: '보장비율', value: analysis.pet?.selfPayRatio >= 80 ? 95 : analysis.pet?.selfPayRatio >= 70 ? 80 : 60, target: 75 },
    { label: '자기부담금', value: analysis.pet?.deductible <= 20000 ? 95 : analysis.pet?.deductible <= 30000 ? 85 : 65, target: 75 },
  ] : isGolf ? [
    { label: '홀인원 보장', value: analysis.golf?.gameType === 'professional' ? 20 : (analysis.golf?.hasHoleInOneRider ? 95 : 30), target: 70 },
    { label: '배상책임 한도', value: analysis.golf?.hasLiabilityRider ? 95 : 35, target: 75 },
    { label: '용품 파손', value: analysis.golf?.gameType === 'professional' ? 20 : (analysis.golf?.hasEquipmentRider ? 90 : 30), target: 70 },
    { label: '단체 할인', value: analysis.golf?.isGroup ? 95 : 50, target: 60 },
    { label: '원데이 가성비', value: analysis.golf?.planType === 'one_day' ? 95 : 70, target: 75 },
    { label: '상해 보장', value: 85, target: 70 },
  ] : isFire ? [
    { label: '건물 급수', value: scores.structureScore || 80, target: 70 },
    { label: '특약 완비', value: scores.riderScore || 75, target: 80 },
    { label: '가입 한도', value: scores.limitScore || 70, target: 75 },
    { label: '누수 보장', value: scores.waterLeakScore || 30, target: 75 },
    { label: '배상 책임', value: scores.liabilityScore || 35, target: 75 },
    { label: '가재 도구', value: scores.goodsScore || 60, target: 70 },
  ] : isAccident ? [
    { label: '상해사망', value: scores.deathScore || 40, target: 70 },
    { label: '후유장해', value: scores.disabilityScore || 40, target: 75 },
    { label: '골절/깁스', value: scores.treatmentScore || 50, target: 70 },
    { label: '수술비보장', value: (analysis.accident?.surgeryLimit || 0) >= 1000000 ? 90 : 60, target: 70 },
    { label: '레저특약', value: analysis.accident?.hasLeisureRider ? 95 : 50, target: 60 },
    { label: '보험료효율', value: Math.round(efficiency), target: 75 },
  ] : isCredit ? [
    { label: '대출상환 안전성', value: scores.cancerScore || 0, target: 80 },
    { label: '신용할인 최적도', value: scores.cerebrovascularScore || 0, target: 70 },
    { label: '특약구성 종합도', value: scores.cardiovascularScore || 0, target: 75 },
    { label: '보장만기 적절성', value: (analysis.credit?.loanPeriod || 10) >= 10 ? 95 : 55, target: 70 },
    { label: '신용점수 보완성', value: (analysis.credit?.creditScore || 850) >= 800 ? 90 : 60, target: 75 },
    { label: '보험료 가성비', value: Math.min(100, Math.round(efficiency)), target: 70 }
  ] : isLegal ? [
    { label: '변호사비 한도', value: scores.lawyerScore || 0, target: 75 },
    { label: '인지액/송달료', value: scores.courtFeeScore || 0, target: 70 },
    { label: '추가 특약 수준', value: scores.riderScore || 0, target: 70 },
    { label: '전자소송 할인', value: analysis.legal?.isElectronicLitigation ? 95 : 50, target: 60 },
    { label: '소송유형 적합도', value: analysis.legal?.litigationType === 'civil' ? 90 : 70, target: 75 },
    { label: '보험료 가성비', value: Math.min(100, Math.round(efficiency)), target: 70 }
  ] : isProperty ? [
    { label: '화재재산한도', value: scores.propertyScore || 0, target: 75 },
    { label: '배상책임특약', value: scores.liabilityScore || 0, target: 80 },
    { label: '비즈니스연속성', value: scores.continuityScore || 0, target: 70 },
    { label: '건물소방안전도', value: analysis.property?.buildingGrade === 'grade_1' ? 95 : analysis.property?.buildingGrade === 'grade_2' ? 75 : 50, target: 75 },
    { label: '누수보장 수준', value: analysis.property?.hasWaterLeak ? 95 : 30, target: 70 },
    { label: '보험료 가성비', value: Math.min(100, Math.round(efficiency)), target: 70 }
  ] : isSavingsGeneral ? [
    { label: '비과세 혜택', value: scores.cancerScore || 0, target: 80 },
    { label: '이율 안전성', value: scores.cerebrovascularScore || 0, target: 75 },
    { label: '사업비 효율', value: scores.cardiovascularScore || 0, target: 70 },
    { label: '유니버셜기능', value: analysis.savingsGeneral?.hasUniversal ? 95 : 50, target: 65 },
    { label: '목적기여도', value: 90, target: 70 },
    { label: '보험료 가성비', value: Math.min(100, Math.round(efficiency)), target: 75 }
  ] : isHealthGeneral ? [
    { label: '암 보장', value: (analysis.healthGeneral?.cancerLimit || 0) >= 50000000 ? 95 : (analysis.healthGeneral?.cancerLimit || 0) >= 30000000 ? 75 : 50, target: 80 },
    { label: '뇌혈관 보장', value: (analysis.healthGeneral?.brainLimit || 0) >= 30000000 ? 90 : (analysis.healthGeneral?.brainLimit || 0) >= 20000000 ? 70 : 45, target: 75 },
    { label: '심장 보장', value: (analysis.healthGeneral?.heartLimit || 0) >= 30000000 ? 90 : (analysis.healthGeneral?.heartLimit || 0) >= 20000000 ? 70 : 45, target: 75 },
    { label: '수술비 특약', value: analysis.healthGeneral?.has1to5Surgery ? 95 : 50, target: 80 },
    { label: '표적항암 특약', value: analysis.healthGeneral?.hasTargetedTherapy ? 90 : 40, target: 70 },
    { label: '보험료 가성비', value: Math.min(100, Math.round(efficiency)), target: 70 }
  ] : [
    { label: '일반암', value: scores.cancerScore || 0, target: avg.c || 50 },
    { label: '뇌혈관', value: scores.cerebrovascularScore || 0, target: avg.b || 50 },
    { label: '심혈관', value: scores.cardiovascularScore || 0, target: avg.h || 50 },
    { label: '수술/입원', value: (scores.totalScore || 0) > 70 ? 90 : 60, target: avg.s || 50 },
    { label: '장해/생활', value: (scores.totalScore || 0) > 70 ? 80 : 50, target: avg.l || 50 },
    { label: '사망/정기', value: (scores.totalScore || 0) > 70 ? 70 : 40, target: 50 },
  ];

  return (
    <div className="space-y-32">
      {/* 📱 설계안 평생 무료 보관함 트리거 */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 p-24 opacity-5 scale-150 transform group-hover:scale-125 transition-transform duration-1000 rotate-12">
          <Smartphone className="w-96 h-96 text-white" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-orange-500/20">
              <Sparkles size={12} className="text-orange-400 animate-spin-slow" /> 설계안 평생 무료 보관함
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
              지금 화면을 닫으면 분석 결과가 사라집니다!
            </h3>
            <p className="text-sm text-slate-400 font-bold leading-relaxed">
              내 전용 비교 설계안 보고서를 스마트폰으로 평생 무료 보관하세요. (알림톡/SMS 즉시 전송)
            </p>
          </div>

          <div className="w-full lg:w-auto shrink-0 min-w-[320px] md:min-w-[420px] bg-slate-950/60 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-inner">
            {smsSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xl font-black">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-white">보관함 링크 전송 완료!</h4>
                  <p className="text-xs text-slate-400 font-bold">
                    입력하신 번호로 맞춤 설계 보고서 링크가 발송되었습니다.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-350 font-bold inline-block">
                  🔑 고유 설계 코드: <span className="text-orange-400 font-black uppercase tracking-widest">{(result as any).simulation_code || ''}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSmsSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">고객 이름</label>
                    <input
                      type="text"
                      required
                      placeholder="홍길동"
                      value={smsName}
                      onChange={(e) => setSmsName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-slate-650 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">휴대전화 번호</label>
                    <input
                      type="tel"
                      required
                      placeholder="010-1234-5678"
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white placeholder-slate-650 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={smsSubmitting}
                  className="w-full py-4.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-[0_10px_20px_-4px_rgba(255,107,0,0.4)] transition-all cursor-pointer text-center"
                >
                  {smsSubmitting ? "설계안 전송 중..." : "👉 내 번호로 설계안 전송하기"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Insurance Summary Cards (Silson, Caregiving, Dental, etc.) */}
      <InsuranceSummary result={result} />

      <section className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col lg:flex-row gap-24 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] scale-150 transform rotate-12">
           {isDental || isSilbi ? <Stethoscope className="w-96 h-96 text-emerald-500" /> :
            isCaregiving ? <Hotel className="w-96 h-96 text-purple-500" /> :
            isNursing ? <Heart className="w-96 h-96 text-pink-500" /> :
            isChild ? <Baby className="w-96 h-96 text-yellow-500" /> :
            isPet ? <Dog className="w-96 h-96 text-orange-500" /> :
            isGolf ? <Target className="w-96 h-96 text-emerald-500" /> :
            isCredit ? <Coins className="w-96 h-96 text-emerald-500" /> :
            isLegal ? <Scale className="w-96 h-96 text-indigo-500" /> :
            isProperty ? <Building className="w-96 h-96 text-orange-500" /> :
            isSavingsGeneral ? <PiggyBank className="w-96 h-96 text-emerald-500" /> :
            isHealthGeneral ? <Stethoscope className="w-96 h-96 text-orange-500" /> :
            <Zap className="w-96 h-96 text-orange-500" />}
        </div>

        <div className="flex-shrink-0 relative z-10 w-full lg:w-auto">
          <RadarChart data={radarData} size={350} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center -mt-6">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">Total</span>
            <span className="text-4xl font-black text-gray-900 leading-none">{Math.round(scores.totalScore)}</span>
          </div>
        </div>

        {/* Metrics & Deficiencies */}
        <div className="flex-1 space-y-12 relative z-10">
          <div className="space-y-4">
             <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
               {isDental ? '당신의 치아 보장 상태를 분석했습니다.' :
                isSilbi ? '당신의 실손 의료비 상담 리포트입니다.' :
                isCaregiving ? '당신의 간병 대비 준비 상태를 분석했습니다.' :
                isNursing ? '당신의 요양(재가/시설) 준비 상태를 분석했습니다.' :
                isChild ? '당신의 자녀/태아 보장 준비 상태를 분석했습니다.' :
                isCar ? '당신의 자동차보험 가입 상태를 분석했습니다.' :
                isDriver ? '운전자보험 상품 및 가격을 분석했습니다.' :
                isPet ? '당신의 펫보험 보장 상태를 분석했습니다.' :
                isGolf ? '당신의 골프보험 가입 상태를 분석했습니다.' :
                isVariable ? '변액 투자 및 정기 사망보장 상태를 분석했습니다.' :
                isCredit ? '당신의 대출상환 안심 보장 상태를 분석했습니다.' :
                isLegal ? '당신의 법률비용 보장 준비 상태를 분석했습니다.' :
                isProperty ? '당신의 재물종합 자산 보장 상태를 분석했습니다.' :
                isSavingsGeneral ? '당신의 저축보험 자산 준비 상태를 분석했습니다.' :
                '당신의 보장 상태를 분석했습니다.'}
             </h3>
             <p className="text-gray-500 font-bold italic">
               {isDental 
                 ? '"방사형 그래프가 6각형 모양에 가까울수록 빈틈없는 치아 보장 상태입니다."' 
                 : isSilbi
                  ? '"4세대로 전환 시 보험료를 최대 70%까지 절감할 수 있는지 분석했습니다."'
                  : isCaregiving
                  ? '"방사형 그래프가 원형에 가까울수록 안전한 보장 상태입니다."'
                  : isNursing
                  ? '"방사형 그래프가 원형에 가까울수록 안정적인 재가/시설 보장 상태입니다."'
                  : isChild
                  ? '"방사형 그래프가 원형에 가까울수록 빈틈없는 어린이/태아 보장 상태입니다."'
                  : isAccident
                  ? '"방사형 그래프가 원형에 가까울수록 직무 및 일상 리스크에 완벽히 방어된 상태입니다."'
                  : isCar
                  ? '"방사형 그래프가 원형에 가까울수록 안전하고 가성비 높은 자동차 보장 상태입니다."'
                  : isSurgeryHospital
                  ? '"뇌/심장/암 등 주요 질환과 수술/입원 담보를 집중 분석했습니다."'
                  : isPet
                  ? '"방사형 그래프가 6각형 모양에 가까울수록 아이를 위한 펫보험 보장이 완벽한 상태입니다."'
                  : isGolf
                  ? '"방사형 그래프가 6각형 모양에 가까울수록 홀인원 및 필드 사고 배상책임 보장이 완벽한 상태입니다."'
                  : isCredit
                  ? '"방사형 그래프가 육각형에 가까울수록 가계 대출 채무 불이행 위험으로부터 안전한 상태입니다."'
                  : isLegal
                  ? '"방사형 그래프가 육각형에 가까울수록 일상 법률 분쟁 및 송사 비용 리스크를 완벽하게 방어한 상태입니다."'
                  : isProperty
                  ? '"방사형 그래프가 육각형에 가까울수록 매장 및 사업장의 자산 손실과 화재 배상 리스크로부터 안전한 상태입니다."'
                  : isSavingsGeneral
                  ? '"방사형 그래프가 육각형에 가까울수록 이자소득 비과세 및 적립 복리 효율이 극대화된 자산 상태입니다."'
                  : '"방사형 그래프가 원형에 가까울수록 안전한 보장 상태입니다."'
               }
             </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className={`flex-1 p-8 rounded-[2rem] border group hover:scale-105 transition-all ${
              isDental || isSilbi || isGolf || isCredit || isSavingsGeneral ? 'bg-emerald-50/50 border-emerald-100/50' :
              isCaregiving ? 'bg-purple-50/50 border-purple-100/50' :
              isNursing ? 'bg-pink-50/50 border-pink-100/50' :
              isChild ? 'bg-yellow-50/50 border-yellow-100/50' :
              isPet || isProperty ? 'bg-orange-50/50 border-orange-100/50' :
              isLegal ? 'bg-indigo-50/50 border-indigo-100/50' :
              'bg-blue-50/50 border-blue-100/50'
            }`}>
              <div className={`flex items-center gap-2 mb-6 ${
                isDental || isSilbi || isGolf || isCredit || isSavingsGeneral ? 'text-emerald-600' :
                isCaregiving ? 'text-purple-600' :
                isNursing ? 'text-pink-600' :
                isChild ? 'text-yellow-600' :
                isPet || isProperty ? 'text-orange-600' :
                isLegal ? 'text-indigo-600' :
                'text-blue-600'
              }`}>
                 <Calculator className="w-5 h-5" />
                 <span className="text-sm font-black uppercase tracking-widest">
                   {isDental || isSilbi ? '실손 보험 가성비' :
                    isSavingsGeneral ? '적립 복리 효율성' :
                    isCredit ? '대출 상환 안전도' :
                    isProperty ? '자산 보호 효율성' :
                    isLegal ? '법률 방어 효율성' :
                    '보험료 효율성'}
                 </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-black leading-none ${
                  isDental || isSilbi || isGolf || isCredit || isSavingsGeneral ? 'text-emerald-600' :
                  isCaregiving ? 'text-purple-600' :
                  isNursing ? 'text-pink-600' :
                  isPet || isProperty ? 'text-orange-600' :
                  isLegal ? 'text-indigo-600' :
                  'text-blue-600'
                }`}>{Math.min(100, efficiency).toFixed(1)}</span>
                <span className={`${
                  isDental || isSilbi || isGolf || isCredit || isSavingsGeneral ? 'text-emerald-900' :
                  isCaregiving ? 'text-purple-900' :
                  isNursing ? 'text-pink-900' :
                  isPet || isProperty ? 'text-orange-900' :
                  isLegal ? 'text-indigo-900' :
                  'text-blue-900'
                } font-bold`}>점</span>
              </div>
              <div className={`w-full h-1.5 rounded-full mt-6 overflow-hidden ${
                isDental || isSilbi || isGolf || isCredit || isSavingsGeneral ? 'bg-emerald-100' :
                isCaregiving ? 'bg-purple-100' :
                isNursing ? 'bg-pink-100' :
                isPet || isProperty ? 'bg-orange-100' :
                isLegal ? 'bg-indigo-100' :
                'bg-blue-100'
              }`}>
                 <div className={`h-full ${
                   isDental || isSilbi || isGolf || isCredit || isSavingsGeneral ? 'bg-emerald-500' :
                   isCaregiving ? 'bg-purple-500' :
                   isNursing ? 'bg-pink-500' :
                   isPet || isProperty ? 'bg-orange-500' :
                   isLegal ? 'bg-indigo-500' :
                   'bg-blue-500'
                 }`} style={{ width: `${Math.min(100, efficiency)}%` }}></div>
              </div>
            </div>

            <div className="flex-[1.5] bg-red-50/50 p-8 rounded-[2rem] border border-red-100/50 hover:shadow-xl transition-all">
               <div className="flex items-center gap-2 mb-6 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-black uppercase tracking-widest">{isDental || isSilbi || isSurgeryHospital ? '보장 보강 필요' : '긴급 보강 필요 항목'}</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {deficiencies.length > 0 ? deficiencies.map((item, i) => (
                   <span key={i} className="bg-white px-5 py-3 rounded-2xl text-red-600 text-sm font-black shadow-sm border border-red-100 transform transition-all hover:scale-110 cursor-default">
                     {item}
                   </span>
                 )) : (
                   <span className={`bg-white px-5 py-3 rounded-2xl text-sm font-black shadow-sm border ${isDental || isSilbi ? 'text-emerald-600 border-emerald-100' : 'text-green-600 border-green-100'}`}>
                     {isDental || isSilbi ? '실손 보장이 완벽합니다!' : '모든 보장이 완벽합니다!'}
                   </span>
                 )}
               </div>
            </div>
          </div>
        </div>
      </section>

      <AIPremiumReport 
        analysis={result.analysis} 
        deficiencies={deficiencies} 
        scores={scores} 
      />

      <ComparisonTable 
        analysis={result.analysis}
        recommendation={isRemodeling ? result.recommendations.diet : result.recommendations.upgrade} 
      />

      {/* 보험별 개별 분석 (전체 종합 분석 테이블 아래, 매직 다이어트 가이드 위에 위치) */}
      {isRemodeling && (analysis as any)._remodelingCoverage?.policies?.length > 0 && (
        <div className="mb-20 mt-20 text-left">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4">
              🔍 Per-Policy Individual Analysis
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">보험 1건씩 개별 정밀 분석</h3>
            <p className="text-gray-400 font-bold italic mt-2">"가입된 보험 하나하나를 독립적으로 분석하여 중복·과납·부족을 정확히 진단합니다."</p>
          </div>
          <PerPolicyDashboard
            policies={(analysis as any)._remodelingCoverage.policies}
            age={(analysis as any).age || 40}
            gender={(analysis as any).gender || 'M'}
          />
        </div>
      )}

      {/* 3. Magic Remodeling Savings Calculator (신규 추가) */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-[4rem] p-10 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-125">
          <Sparkles className="w-80 h-80 text-purple-400" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-lg">
            <Sparkles size={12} className="text-white" /> Remodeling Magic Guide
          </div>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-none bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
            가계 금융 건강을 위한 맞춤형 보험료 다이어트
          </h3>
          <p className="text-slate-400 font-bold italic text-base">
            "불필요한 고비용 특약을 정리하여 가계 고정비 지출을 방어하고 합리적인 재정 지표를 제시해 드립니다."
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative z-10 items-stretch">
          {/* Card 1: 최적화 결과 */}
          <div className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
                <Calculator className="w-6 h-6 text-indigo-400" />
              </div>
              <h4 className="text-lg font-black text-slate-300 mb-2">월 보험료 다이어트 결과</h4>
              <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">
                현재 불필요한 보장을 덜어내고 핵심 위주로 세팅한 실속형 기준 최저 요율입니다.
              </p>
            </div>
            <div>
              <div className="border-t border-white/5 pt-6 space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">최적화된 월 보험료</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-indigo-400 tracking-tighter">
                    {Math.round(showDiet).toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-slate-300">원</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold mt-2">
                  기회비용 <span className="underline font-black">{Math.round(showSaving).toLocaleString()}원</span> 절감 성공!
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 연간 고정비 절감 예측 */}
          <div className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6">
                <Plane className="w-6 h-6 text-pink-400" />
              </div>
              <h4 className="text-lg font-black text-slate-300 mb-2">연간 누적 절감 효과</h4>
              <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">
                불필요한 고비용 특약을 조율하여 절감할 수 있는 1년간의 누적 보험료 예측치입니다.
              </p>
            </div>
            <div>
              <div className="border-t border-white/5 pt-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">연간 지출 비용 절감 예측</span>
                <p className="text-base font-black text-pink-300 leading-snug">
                  연간 고정비 지출을 효과적으로 방어하여 가계 재정을 효율화할 수 있습니다.
                </p>
                <div className="text-[10px] text-slate-400 mt-2">
                  (연간 누적 절감액: <span className="font-bold">{Math.round(showSaving * 12).toLocaleString()}원</span>)
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 10개년 재정 최적화 예측 */}
          <div className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 flex flex-col justify-between hover:bg-white/10 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-lg font-black text-slate-300 mb-2">10개년 재정 최적화 예측</h4>
              <p className="text-xs text-slate-400 font-bold leading-relaxed mb-6">
                리밸런싱을 통해 절감한 기회비용을 10년간 유지 시 절약되는 총 고정 지출비의 누적 규모입니다.
              </p>
            </div>
            <div>
              <div className="border-t border-white/5 pt-6 space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">10년 총 고정비 절약 예측</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-400 tracking-tighter">
                    {Math.round(showSaving * 12 * 10).toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-slate-300">원</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  10년 동안 가계 자산에서 불필요하게 새어 나가던 누적 지출을 성공적으로 방어하는 가치입니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 mt-10 text-center relative z-10">
          * 본 시뮬레이션은 불필요한 보장 리밸런싱을 통한 고정비 절감 효과의 예시이며, 실제 가입/해지 시 개별 요율 및 보장 내용에 따라 실제 적용 효과는 달라질 수 있습니다.
        </div>
      </section>

      <section className="space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
            <Target size={14} className="fill-current text-orange-500" /> Optimized Protection Strategies
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">나에게 맞는 추천 시나리오</h3>
          <p className="text-gray-500 font-bold italic">"현재 상황에서 가장 합리적인 2가지 탈출 경로를 제시합니다."</p>
        </div>

        <div className={`grid grid-cols-1 gap-10 items-stretch mx-auto ${
          isRemodeling ? 'max-w-4xl' : 'lg:grid-cols-3 max-w-7xl'
        }`}>
           {/* Diet Type */}
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.diet)}
             className="bg-gradient-to-br from-blue-100/40 via-indigo-50/70 to-purple-100/30 p-12 rounded-[4rem] shadow-[0_30px_80px_-10px_rgba(59,130,246,0.22)] border border-blue-200/60 flex flex-col group transition-all cursor-pointer overflow-hidden relative"
           >
              {/* Diet 카드 헤더 — 리모델링 vs 일반 */}
              {isRemodeling ? (() => {
                const policies: any[] = (analysis as any)._remodelingCoverage?.policies || [];
                const totalCurrent = policies.reduce((s: number, p: any) => s + p.monthly_premium, 0);
                const totalDiet = Math.round(totalCurrent * 0.785);
                const totalSaving = totalCurrent - totalDiet;
                const hasKBDup = policies.filter((p: any) => p.insurance_company === 'KB손해보험').length >= 2;
                return (
                  <>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-[360deg] transition-transform duration-1000">
                        <Zap className="w-8 h-8 fill-current" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black tracking-tighter text-blue-900 uppercase">7개 보험 동시 리밸런싱</h4>
                        <p className="text-sm text-blue-400 font-bold">보장은 그대로 · 보험료만 낮춘다</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-8 bg-white/70 rounded-2xl p-5 border border-blue-100 relative z-10">
                      <div className="flex-1 text-center">
                        <span className="text-[9px] font-black text-red-400 block uppercase mb-1">현재 월 납입 합계</span>
                        <span className="text-2xl font-black text-red-500">{totalCurrent.toLocaleString()}</span>
                        <span className="text-xs font-black text-red-400">원</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <span className="text-emerald-600 text-[9px] font-black bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">-{totalSaving.toLocaleString()}원</span>
                        <span className="text-2xl text-blue-400 font-black">→</span>
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-[9px] font-black text-blue-500 block uppercase mb-1">리밸런싱 후</span>
                        <span className="text-2xl font-black text-blue-600">{totalDiet.toLocaleString()}</span>
                        <span className="text-xs font-black text-blue-400">원</span>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-10 relative z-10">
                      <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-indigo-500" /></div>
                        종신보험 — 사망 1억 보장 동일 유지
                      </li>
                      <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-purple-500" /></div>
                        운전자보험 — 형사합의·벌금·변호사 보장 동일 유지
                      </li>
                      <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-blue-500" /></div>
                        종합건강보험 — 암·뇌혈관·심장 진단비 보장 동일 유지
                      </li>
                      {hasKBDup && (
                        <li className="flex items-center gap-3 text-sm font-bold text-amber-700 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
                          <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-xs">⚠️</span>
                          KB손해보험 동일 상품 2개 중복 → 1개 정리 시 추가 절감 가능
                        </li>
                      )}
                    </ul>
                  </>
                );
              })() : (
                <>
                  <div className="absolute top-0 right-0 p-8 opacity-10 rotate-45 transform"><Zap className="w-32 h-32 text-blue-500" /></div>
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-blue-200 group-hover:rotate-[360deg] transition-transform duration-1000 relative z-10"><Zap className="w-8 h-8 fill-current" /></div>
                  <h4 className="text-2xl font-black mb-1 tracking-tighter text-blue-900 group-hover:text-blue-600 transition-colors uppercase">{result.recommendations.diet.title}</h4>
                  {result.recommendations.diet.companyName && (
                    <div className="flex flex-wrap items-center gap-y-1.5 mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.diet.companyName}</span>
                      <span className="text-xs font-bold text-slate-500 italic break-keep">{result.recommendations.diet.productName}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10 min-h-[4rem]">{result.recommendations.diet.description}</p>
                  <div className="mb-10 border-b border-gray-50 pb-10">
                    <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">{isCar ? '연 예상 보험료' : '월 예상 보험료'}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black text-blue-600 tracking-tighter">{Math.round(isCar ? result.recommendations.diet.estimatedPremium * 12 : result.recommendations.diet.estimatedPremium).toLocaleString()}</span>
                      <span className="text-2xl font-black text-gray-900">원</span>
                    </div>
                  </div>
                  <ul className="space-y-6 flex-1 mb-12">
                    {result.recommendations.diet.coverageChanges.map((change, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-blue-500" /></div>
                        {change}
                      </li>
                    ))}
                  </ul>
                </>
              )}


              {/* Diet Table — 리모델링: 보험별 1:1 대체 상품 매핑 */}
              {isRemodeling && (() => {
                const policies: any[] = (analysis as any)._remodelingCoverage?.policies || [];
                if (policies.length === 0) return null;

                const REPLACE_COMPANIES = ['DB손해보험','KB손해보험','한화손해보험','현대해상','삼성화재'];

                const rows = policies.map((p: any, i: number) => {
                  const ratio = p.product_name.includes('종신') ? 0.80
                    : p.product_name.includes('운전자') ? 0.82
                    : 0.76;
                  const dietPrem = Math.round(p.monthly_premium * ratio);
                  const saving = p.monthly_premium - dietPrem;
                  const company = REPLACE_COMPANIES[i % REPLACE_COMPANIES.length];
                  const prodType = p.product_name.includes('종신') ? '무배당 종신 다이어트 보험'
                    : p.product_name.includes('운전자') ? '무배당 운전자 다이어트 보험'
                    : '무배당 간편건강 다이어트 보험';
                  return { orig: p, dietPrem, saving, company, prodType };
                });

                const totalCurrent = policies.reduce((s: number, p: any) => s + p.monthly_premium, 0);
                const totalDiet = rows.reduce((s, r) => s + r.dietPrem, 0);
                const totalSaving = totalCurrent - totalDiet;

                return (
                  <div className="mb-12 space-y-3 text-left">
                    {/* Per-policy swap rows */}
                    {rows.map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {/* 기존 보험 */}
                        <div className="flex-1 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                          <span className="text-[8px] font-black text-red-400 block uppercase mb-0.5">❌ 기존 보험</span>
                          <span className="text-[9px] font-black text-red-500 block">{r.orig.insurance_company}</span>
                          <span className="text-xs font-bold text-slate-700 leading-snug line-clamp-2">{r.orig.product_name.split('(')[0].trim()}</span>
                          <span className="text-sm font-black text-red-600 mt-1 block">{r.orig.monthly_premium.toLocaleString()}원</span>
                        </div>

                        {/* 화살표 + 절감액 */}
                        <div className="flex flex-col items-center gap-1 flex-shrink-0 w-16">
                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                            -{Math.round(r.saving / 1000) / 10}만원
                          </span>
                          <span className="text-2xl text-blue-400">→</span>
                        </div>

                        {/* 대체 보험 */}
                        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3">
                          <span className="text-[8px] font-black text-blue-500 block uppercase mb-0.5">✅ 대체 보험</span>
                          <span className="text-[9px] font-black text-blue-600 block">{r.company}</span>
                          <span className="text-xs font-bold text-slate-700 leading-snug">{r.prodType}</span>
                          <span className="text-sm font-black text-blue-700 mt-1 block">{r.dietPrem.toLocaleString()}원</span>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="bg-blue-600 rounded-2xl px-6 py-4 flex items-center justify-between text-white mt-2">
                      <div>
                        <span className="text-[9px] font-black text-blue-200 block uppercase">7개 전체 리밸런싱 후</span>
                        <span className="text-lg font-black">{totalDiet.toLocaleString()}원/월</span>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl">→</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-blue-200 block uppercase">월 절감액</span>
                        <span className="text-2xl font-black text-white">-{totalSaving.toLocaleString()}원</span>
                      </div>
                    </div>

                    {/* Savings Summary */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                        <span className="text-[9px] font-black text-emerald-500 block uppercase">월 절감액</span>
                        <span className="text-xl font-black text-emerald-700">{totalSaving.toLocaleString()}원</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                        <span className="text-[9px] font-black text-blue-500 block uppercase">연간 절감</span>
                        <span className="text-xl font-black text-blue-700">{(totalSaving * 12).toLocaleString()}원</span>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
                        <span className="text-[9px] font-black text-indigo-500 block uppercase">10년 누적</span>
                        <span className="text-xl font-black text-indigo-700">{Math.round(totalSaving * 12 * 10 / 10000).toLocaleString()}만원</span>
                      </div>
                    </div>
                  </div>
                );
              })()}


             <button className="w-full bg-gray-50 text-gray-400 py-6 rounded-[2rem] font-black text-sm hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 border border-transparent hover:border-gray-200">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
               {result.recommendations.diet.switchingLossNotice}
             </p>
           </motion.div>

           {/* Upgrade Type (The "Main" Recommendation) */}
           <motion.div 
             whileHover={{ y: -20, scale: 1.02 }}
             onClick={() => setSelectedPlan(result.recommendations.upgrade)}
             className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] flex flex-col relative z-10 border-2 border-slate-800 cursor-pointer"
           >
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-10 py-3 rounded-full font-black text-[0.7rem] shadow-2xl uppercase tracking-[0.2em] whitespace-nowrap">
                가장 많이 추천하는 플랜
             </div>
             {/* Upgrade 카드 헤더 — 리모델링 vs 일반 */}
             {isRemodeling ? (() => {
               const policies: any[] = (analysis as any)._remodelingCoverage?.policies || [];
               const totalCurrent = policies.reduce((s: number, p: any) => s + p.monthly_premium, 0);

               const UPCO = ['DB손해보험','KB손해보험','한화손해보험','현대해상','삼성화재','메리츠화재'];
               const rows = policies.map((p: any, i: number) => {
                 const isDriver = p.product_name.includes('운전자');
                 const isWhole = p.product_name.includes('종신');
                 const company = UPCO[i % UPCO.length];
                 const prodType = isWhole ? '무배당 VIP 종신 업그레이드 보험'
                   : isDriver ? '무배당 VIP 운전자 업그레이드 보험'
                   : '무배당 VIP 마스터 업그레이드 건강보험';
                 const cancerBonus = isWhole || isDriver ? 0 : [2000,1800,1600,1400,1200,1000][i % 6] * 10000;
                 const brainBonus  = isWhole || isDriver ? 0 : [1000,900,800,700,600,500][i % 6] * 10000;
                 const heartBonus  = isWhole || isDriver ? 0 : [1000,900,800,700,600,500][i % 6] * 10000;
                 return { orig: p, company, prodType, cancerBonus, brainBonus, heartBonus };
               });

               return (
                 <>
                   <div className="flex items-center gap-3 mb-6 relative z-10">
                     <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-orange-200 animate-pulse">
                       <Zap className="w-8 h-8 fill-current" />
                     </div>
                     <div>
                       <h4 className="text-xl font-black tracking-tighter text-orange-400 uppercase">7개 보험 동시 업그레이드</h4>
                       <p className="text-sm text-slate-400 font-bold">보험료는 그대로 · 보장만 더 든든하게</p>
                     </div>
                   </div>

                   <div className="flex items-center gap-3 mb-8 bg-white/10 rounded-2xl p-5 border border-white/10 relative z-10">
                     <div className="flex-1 text-center">
                       <span className="text-[9px] font-black text-slate-400 block uppercase mb-1">현재 월 납입 합계</span>
                       <span className="text-2xl font-black text-slate-300">{totalCurrent.toLocaleString()}</span>
                       <span className="text-xs font-black text-slate-400">원</span>
                     </div>
                     <div className="flex flex-col items-center gap-1 flex-shrink-0">
                       <span className="text-orange-400 text-[9px] font-black bg-orange-500/20 border border-orange-500/30 rounded-full px-2 py-0.5">동일 유지</span>
                       <span className="text-2xl text-orange-400 font-black">→</span>
                     </div>
                     <div className="flex-1 text-center">
                       <span className="text-[9px] font-black text-orange-300 block uppercase mb-1">보장 강화 후</span>
                       <span className="text-2xl font-black text-orange-400">{totalCurrent.toLocaleString()}</span>
                       <span className="text-xs font-black text-orange-300">원</span>
                     </div>
                   </div>

                   <ul className="space-y-3 mb-10 relative z-10">
                     <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                       <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-orange-400" /></div>
                       종신보험 — 사망 1억 보장 동일 유지
                     </li>
                     <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                       <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-orange-400" /></div>
                       운전자보험 — 형사합의·벌금·변호사 보장 동일 유지
                     </li>
                     <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                       <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-orange-400" /></div>
                       종합건강보험 — 암·뇌혈관·심장 진단비 보장 동일 유지
                     </li>
                   </ul>

                   {/* Per-policy upgrade comparison list */}
                   <div className="mb-12 space-y-3 text-left">
                     {rows.map((r, i) => {
                       return (
                         <div key={i} className="flex items-center gap-2">
                           {/* 기존 보험 */}
                           <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                             <span className="text-[8px] font-black text-red-400 block uppercase mb-0.5">❌ 기존 보험</span>
                             <span className="text-[9px] font-black text-slate-400 block">{r.orig.insurance_company}</span>
                             <span className="text-xs font-bold text-slate-300 leading-snug line-clamp-2">{r.orig.product_name.split('(')[0].trim()}</span>
                             <span className="text-sm font-black text-slate-400 mt-1 block">{r.orig.monthly_premium.toLocaleString()}원</span>
                           </div>

                           {/* 보강 표시 */}
                           <div className="flex flex-col items-center gap-1 flex-shrink-0 w-20 text-center">
                             {r.cancerBonus > 0 ? (
                               <span className="text-[8px] font-black text-orange-300 bg-orange-500/20 border border-orange-500/30 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                                 암 +{(r.cancerBonus/10000).toLocaleString()}만
                               </span>
                             ) : (
                               <span className="text-[8px] font-black text-slate-400 bg-white/5 border border-white/10 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                                 동일 유지
                               </span>
                             )}
                             <span className="text-2xl text-orange-400">→</span>
                           </div>

                           {/* 업그레이드 보험 */}
                           <div className="flex-1 bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-3">
                             <span className="text-[8px] font-black text-orange-400 block uppercase mb-0.5">🚀 업그레이드</span>
                             <span className="text-[9px] font-black text-orange-300 block">{r.company}</span>
                             <span className="text-xs font-bold text-white leading-snug">{r.prodType}</span>
                             <span className="text-sm font-black text-orange-400 mt-1 block">{r.orig.monthly_premium.toLocaleString()}원</span>
                           </div>
                         </div>
                       );
                     })}

                     {/* Total */}
                     <div className="bg-orange-600 rounded-2xl px-6 py-4 flex items-center justify-between text-white mt-2">
                       <div>
                         <span className="text-[9px] font-black text-orange-200 block uppercase">7개 전체 업그레이드 후</span>
                         <span className="text-lg font-black">{totalCurrent.toLocaleString()}원/월</span>
                       </div>
                       <div className="text-center">
                         <span className="text-2xl">→</span>
                       </div>
                       <div className="text-right">
                         <span className="text-[9px] font-black text-orange-200 block uppercase">월 납입액</span>
                         <span className="text-2xl font-black text-white">{totalCurrent.toLocaleString()}원</span>
                       </div>
                     </div>

                     {/* Upgraded Coverage Summary Grid */}
                     <div className="grid grid-cols-3 gap-3">
                       <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                         <span className="text-[9px] font-black text-orange-300 block uppercase">암진단비 추가</span>
                         <span className="text-lg font-black text-orange-400">최대 +2,000만원</span>
                       </div>
                       <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                         <span className="text-[9px] font-black text-orange-300 block uppercase">뇌혈관 추가</span>
                         <span className="text-lg font-black text-orange-400">최대 +1,000만원</span>
                       </div>
                       <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                         <span className="text-[9px] font-black text-orange-300 block uppercase">심장 추가</span>
                         <span className="text-lg font-black text-orange-400">최대 +1,000만원</span>
                       </div>
                     </div>
                   </div>
                 </>
               );
             })() : (
               <>
                 <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-10 shadow-[0_15px_30px_-5px_rgba(255,107,0,0.5)] animate-pulse"><Zap className="w-8 h-8 fill-current" /></div>
                 <h4 className="text-2xl font-black mb-1 tracking-tighter text-orange-400 uppercase">{result.recommendations.upgrade.title}</h4>
                 {result.recommendations.upgrade.companyName && (
                   <div className="flex flex-wrap items-center gap-y-1.5 mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                     <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.upgrade.companyName}</span>
                     <span className="text-xs font-bold text-slate-400 italic break-keep">{result.recommendations.upgrade.productName}</span>
                   </div>
                 )}
                 <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 min-h-[4rem]">{result.recommendations.upgrade.description}</p>
                 <div className="mb-10 border-b border-white/5 pb-10">
                   <span className="text-[0.65rem] font-black text-slate-600 uppercase tracking-widest block mb-3">{isCar ? '연 예상 보험료' : '월 예상 보험료'}</span>
                   <div className="flex items-baseline gap-1">
                     <span className="text-6xl font-black text-orange-500 tracking-tighter">{Math.round(isCar ? result.recommendations.upgrade.estimatedPremium * 12 : result.recommendations.upgrade.estimatedPremium).toLocaleString()}</span>
                     <span className="text-2xl font-black text-white">원</span>
                   </div>
                   {result.recommendations.upgrade.isFire && (
                     <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] font-bold text-slate-300 space-y-1">
                       <div className="flex justify-between">
                         <span>보장 보험료 (소멸성):</span>
                         <span>{(result.recommendations.upgrade as any).riskPremium?.toLocaleString()}원</span>
                       </div>
                       <div className="flex justify-between text-orange-400">
                         <span>적립 보험료 (환급형):</span>
                         <span>{(result.recommendations.upgrade as any).savingsPremium?.toLocaleString()}원</span>
                       </div>
                     </div>
                   )}
                 </div>
                 <ul className="space-y-6 flex-1 mb-12">
                   {result.recommendations.upgrade.coverageChanges.map((change, i) => (
                     <li key={i} className="flex items-center gap-4 text-sm font-bold">
                       <div className="w-6 h-6 rounded-full bg-orange-50/20 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-orange-500" /></div>
                       {change}
                     </li>
                   ))}
                 </ul>
               </>
             )}

             <button className="w-full bg-orange-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_-5px_rgba(255,107,0,0.5)] hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-slate-500 mt-6 leading-tight font-bold text-center opacity-40">
               {result.recommendations.upgrade.switchingLossNotice}
             </p>
           </motion.div>
           {/* Hybrid Type */}
           {!isRemodeling && (
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.hybrid)}
             className="bg-gradient-to-br from-violet-50 to-purple-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(139,92,246,0.15)] border border-purple-100/50 flex flex-col group transition-all cursor-pointer overflow-hidden relative"
           >
             <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 transform">
               <Target className="w-32 h-32 text-purple-500" />
             </div>
             <div className="w-16 h-16 bg-violet-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-purple-200 group-hover:rotate-[-360deg] transition-transform duration-1000 relative z-10">
               <Zap className="w-8 h-8 fill-current" />
             </div>
              <h4 className="text-2xl font-black mb-1 tracking-tighter text-purple-900 relative z-10 uppercase">{result.recommendations.hybrid.title}</h4>
              {result.recommendations.hybrid.companyName && (
                <div className="flex flex-wrap items-center gap-y-1.5 mb-4 animate-in fade-in slide-in-from-left-2 transition-all relative z-10">
                  <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.hybrid.companyName}</span>
                  <span className="text-xs font-bold text-purple-400 italic break-keep">{result.recommendations.hybrid.productName}</span>
                </div>
              )}
              <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10 min-h-[4rem] relative z-10">
                {result.recommendations.hybrid.description}
              </p>

             <div className="mb-10 border-b border-gray-50 pb-10">
                <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">{isCar ? '연 예상 보험료' : '월 예상 보험료'}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">{Math.round(isCar ? result.recommendations.hybrid.estimatedPremium * 12 : result.recommendations.hybrid.estimatedPremium).toLocaleString()}</span>
                  <span className="text-2xl font-black text-gray-900">원</span>
                </div>
                {result.recommendations.hybrid.isFire && (
                  <div className="mt-4 p-3 bg-purple-50/50 rounded-xl border border-purple-100/50 text-[11px] font-bold text-purple-800 space-y-1">
                    <div className="flex justify-between">
                      <span>보장 보험료 (소멸성):</span>
                      <span>{(result.recommendations.hybrid as any).riskPremium?.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>적립 보험료 (환급형):</span>
                      <span>{(result.recommendations.hybrid as any).savingsPremium?.toLocaleString()}원</span>
                    </div>
                  </div>
                )}
             </div>

             <ul className="space-y-6 flex-1 mb-12">
               {result.recommendations.hybrid.coverageChanges.map((change, i) => (
                 <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-slate-300" />
                    </div>
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-gray-50 text-gray-400 py-6 rounded-[2rem] font-black text-sm hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 border border-transparent hover:border-gray-200">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
               {result.recommendations.hybrid.switchingLossNotice}
             </p>
           </motion.div>
           )}
        </div>
      </section>

      {/* 4. Full Market Analysis Section */}
      {!isRemodeling && (
<section className="space-y-16 pb-32">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
            <Heart size={14} className="fill-current text-emerald-400" /> Whole Market Comparison
          </div>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter">전 보험사 실시간 보험료 비교</h3>
          <p className="text-gray-500 font-bold italic">"대한민국 모든 보험사의 DB를 전수 조사한 결과입니다."</p>
        </div>

        {(result.recommendations.diet.isFire || isProperty) && (
          <div className="p-6 bg-orange-50/80 rounded-2xl border border-orange-100 flex items-start gap-4 max-w-2xl mx-auto text-left shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-2xl mt-0.5">💡</span>
            <div className="space-y-1">
              <h5 className="text-sm font-black text-orange-950">{isProperty ? '재물종합보험 자산 보호 및 실손 보상 안내' : '화재보험 의무 최저보험료(10,000원) 안내'}</h5>
              <p className="text-xs font-bold text-orange-800 leading-relaxed">
                {isProperty ? (
                  '재물종합보험/화재보험은 건물의 실제 가치 대비 가입 한도가 부족하면 비례보상이 적용되어 손해액의 일부만 지급받게 됩니다. 따라서 실손보상 특약을 탑재하거나 자산 가치를 정확히 평가해 가입해야 안전합니다. 또한 다중이용업소의 경우 화재배상책임이 의무적으로 가입되어야 합니다.'
                ) : (
                  '주택화재보험은 금융 규정상 월 최소 납입 보험료가 10,000원으로 고정되어 있습니다. 보장 한도 대비 계산된 실제 화재 보장비(소멸성)를 제외한 차액은 만기 시 돌려받을 수 있는 \'적립 보험료(환급형)\'로 자동 적립되어 안전하게 보관됩니다.'
                )}
              </p>
            </div>
          </div>
        )}

        {isCredit && (
          <div className="p-6 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex items-start gap-4 max-w-2xl mx-auto text-left shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-2xl mt-0.5">💡</span>
            <div className="space-y-1">
              <h5 className="text-sm font-black text-emerald-950">대출상환보장보험(신용생명보험) 가입 팁</h5>
              <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                신용생명보험은 일반 사망보험과 달리 **대출금 상환을 우선 목적**으로 설계되어, 사고 발생 시 
                보험금이 은행으로 즉시 지급되어 대출을 완납하므로 유가족에게 채무 상속 부담을 지우지 않습니다. 
                또한 가입 후 신용점수가 상승하면 **보험료 할인 혜택**을 추가로 신청할 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {isLegal && (
          <div className="p-6 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex items-start gap-4 max-w-2xl mx-auto text-left shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-2xl mt-0.5">💡</span>
            <div className="space-y-1">
              <h5 className="text-sm font-black text-indigo-950">법률비용보험 소송 리스크 및 공제 금액 안내</h5>
              <p className="text-xs font-bold text-indigo-800 leading-relaxed">
                법률비용보험은 민사, 행정 소송 등의 변호사 선임비와 인지대/송달료를 실손 보장합니다. 
                다만, 소송 비용 산정 기준법에 규정된 대법원 규칙 한도 내에서만 지급되며, 
                선택한 자부담 조건(정액 10만원 또는 비례 10%)에 따라 일부 본인 부담금이 발생할 수 있음을 유의해 주세요.
              </p>
            </div>
          </div>
        )}

        {isVariable && (
          <div className="p-8 bg-indigo-50/70 rounded-[2.2rem] border border-indigo-100 flex items-start gap-4 max-w-3xl mx-auto text-left shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-2xl mt-0.5">💡</span>
            <div className="space-y-2 w-full">
              <h5 className="text-sm font-black text-indigo-950">정기보험 상품 간 보험료가 최대 50배 이상 차이 나는 이유</h5>
              <p className="text-xs font-bold text-indigo-800 leading-relaxed">
                정기보험은 설계 방식과 자산 축적 여부에 따라 아래와 같이 크게 성격이 구분됩니다.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <div className="bg-white/90 p-5 rounded-2xl border border-indigo-50 space-y-2">
                  <span className="inline-block text-[9px] px-2 py-0.5 rounded-full font-black bg-emerald-100 text-emerald-700">🛡️ 실속 순수보장형 (1~3만 원대)</span>
                  <p className="text-[10px] font-bold text-slate-500 leading-normal">
                    사망 시에만 약정된 보장금을 지급하고 만기 시 소멸하는 가성비 상품입니다. 순수한 사망 위험률만 비용으로 청구되므로 가격이 매우 저렴합니다.
                  </p>
                </div>
                <div className="bg-white/90 p-5 rounded-2xl border border-indigo-50 space-y-2">
                  <span className="inline-block text-[9px] px-2 py-0.5 rounded-full font-black bg-indigo-100 text-indigo-700">🏢 CEO / 경영인 절세형 (40~60만 원대)</span>
                  <p className="text-[10px] font-bold text-slate-500 leading-normal">
                    사망보장금이 매년 5%~10%씩 체증(복리 증가)되며, 법인 비용 처리를 통한 법인세 절세 및 은퇴 시 높은 해약환급금(90%~100%+)을 퇴직금 재원으로 활용하도록 고안된 특수 목적용 법인 자산 적립 상품입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
            <div className="col-span-1 text-center">순위</div>
            <div className="col-span-3">보험사</div>
            <div className="col-span-5">상품명</div>
            <div className="col-span-3 text-right">{isCar ? '연 예상 보험료' : '월 예상 보험료'}</div>
          </div>
          
          <div className="divide-y divide-gray-50">
            {((result.analysis as any)._allOptions || []).map((opt: any, idx: number) => (
              <div key={idx} className="grid grid-cols-12 p-8 items-center hover:bg-gray-50 transition-all group">
                <div className="col-span-1 text-center">
                   <span className={`text-sm font-black ${idx < 3 ? 'text-orange-500' : 'text-gray-300'}`}>0{idx + 1}</span>
                </div>
                <div className="col-span-3">
                   <span className="text-base font-black text-gray-900">{opt.companyName}</span>
                </div>
                <div className="col-span-5">
                   <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500 font-bold group-hover:text-gray-900 transition-colors">{opt.productName}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {isVariable && (
                          <>
                            {opt.subType === 'term_ceo' && (
                              <span className="bg-indigo-100 text-indigo-700 text-[9px] px-2 py-0.5 rounded-md font-black border border-indigo-200">
                                🏢 CEO 경영인 절세형
                              </span>
                            )}
                            {opt.subType === 'variable_term' && (
                              <span className="bg-blue-100 text-blue-700 text-[9px] px-2 py-0.5 rounded-md font-black border border-blue-200">
                                📈 변액 투자형
                              </span>
                            )}
                            {opt.subType === 'term_pure' && (
                              <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-md font-black border border-emerald-200">
                                🛡️ 실속 순수보장형
                              </span>
                            )}
                            {opt.subType === 'variable_saving' && (
                              <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-md font-black border border-amber-200">
                                💰 변액 적립/저축형
                              </span>
                            )}
                          </>
                        )}
                        {opt.features ? (
                          opt.features.split(' | ').map((feat: string, fIdx: number) => (
                            <span key={fIdx} className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded-md font-bold">
                              {feat}
                            </span>
                          ))
                        ) : opt.category === '뇌혈관질환' ? (
                          <span className="bg-orange-100 text-orange-600 text-[9px] px-2 py-0.5 rounded-md font-black">가장 넓음</span>
                        ) : opt.category === '뇌졸중' ? (
                          <span className="bg-blue-100 text-blue-600 text-[9px] px-2 py-0.5 rounded-md font-black">표준 보장</span>
                        ) : opt.category === '뇌출혈' ? (
                          <span className="bg-red-100 text-red-600 text-[9px] px-2 py-0.5 rounded-md font-black">좁은 보장</span>
                        ) : (
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter ${
                              (opt.planLevel || opt.category) === '소유자 안심플랜' ? 'bg-indigo-100 text-indigo-600' :
                              (opt.planLevel || opt.category) === '임차인 실속플랜' ? 'bg-teal-100 text-teal-600' :
                              (opt.planLevel || opt.category) === '생활비형' ? 'bg-blue-100 text-blue-600' :
                              (opt.planLevel || opt.category) === '치료비형' ? 'bg-purple-100 text-purple-600' :
                              (opt.planLevel || opt.category) === '다회형' ? 'bg-emerald-100 text-emerald-600' :
                              (opt.planLevel || opt.category) === '미니형' ? 'bg-slate-100 text-slate-600' :
                              'bg-orange-100 text-orange-600'
                          }`}>
                             {opt.planLevel || opt.category || '진단비형'}
                          </span>
                        )}
                      </div>
                   </div>
                </div>
                <div className="col-span-3 text-right">
                    <div className="flex flex-col items-end">
                        {isCar ? (
                          <>
                            <span className="text-xl font-black text-emerald-600">최종 {Math.round(opt.premium * 12).toLocaleString()}원</span>
                            {opt.paymentPremium !== undefined && (
                              <span className="text-xs text-gray-400 font-bold mt-0.5">
                                결제 {Math.round(opt.paymentPremium * 12).toLocaleString()}원
                                {opt.paymentPremium > opt.premium && (
                                  <> | 환급 {Math.round((opt.paymentPremium - opt.premium) * 12).toLocaleString()}원</>
                                )}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xl font-black text-gray-900">{Math.round(opt.premium).toLocaleString()}원</span>
                        )}
                       {opt.riskPremium !== undefined && !isAnnuity && !isVariable && !isFire && !isProperty && !isSavingsGeneral && (
                         <span className="text-[10px] text-gray-400 font-bold mt-1">
                           보장 {opt.riskPremium.toLocaleString()}원 (소멸성 사업비+보장) / 적립 {opt.savingsPremium.toLocaleString()}원 (이자가 복리로 굴러가는 순적립금)
                         </span>
                       )}
                       {idx === 0 && <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter mt-0.5">Market Lowest</span>}
                    </div>
                </div>
              </div>
            ))}
            
            {(!((result.analysis as any)._allOptions) || (result.analysis as any)._allOptions.length === 0) && (
              <div className="p-20 text-center text-gray-400 font-bold italic">
                조회된 추가 보험사가 없습니다.
              </div>
            )}
          </div>

          {/* 과거 병력 가입 사전 심사 신청 (비교표 하단 통합 섹션) */}
          <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-lg border-2 border-orange-500/40 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute -inset-x-40 -inset-y-40 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0,transparent_60%)] blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-2.5 text-left">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10.5px] font-black text-orange-400 uppercase tracking-[0.2em]">🔍 가입 가능 여부 사전 필터링</span>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-extrabold text-white leading-normal">
                  잠깐! 이 가격으로 실제 가입이 가능할까요?
                </h4>
                <p className="text-xs md:text-sm text-slate-400 font-bold leading-relaxed max-w-xl break-keep">
                  과거 병력(수술/입원/약 복용 등)에 따른 가입 승인 여부를 무료로 사전 심사 받아보세요.
                </p>
                <p className="text-[11px] md:text-xs text-emerald-400 font-black flex items-center gap-1 mt-1 break-keep">
                  <span>🛡️</span> 본 심사는 신용도나 개인정보 오남용 우려가 전혀 없는 안심 사전 필터링 서비스입니다.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                if (result.analysis.name) setUwName(result.analysis.name);
                if (result.analysis.mobile) setUwPhone(result.analysis.mobile);
                setIsUnderwritingOpen(true);
              }}
              className="relative z-10 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs md:text-sm rounded-xl shadow-[0_8px_16px_rgba(255,107,0,0.3)] transform hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap self-stretch md:self-auto text-center font-extrabold"
            >
              사전 심사 신청하기
            </button>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-white p-6 sm:p-8 shadow-lg border-2 border-orange-500/40 group">
            {/* Soft Warm Radial Glow */}
            <div className="absolute -inset-x-40 -inset-y-40 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08)_0,transparent_60%)] blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl text-left">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Real-Time Optimized Analysis</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-slate-800 text-xs sm:text-sm font-bold leading-relaxed">
                    * 본 보험료 비교 데이터는 생명보험협회 및 손해보험협회 공시자료(수집 기준: <span className="text-orange-600 font-extrabold underline decoration-orange-500/30 decoration-2 underline-offset-2">{getDisclosureDate()}</span>)를 토대로 <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded-md font-black mx-0.5">0.1초 만에</span> 실시간 최적화 분석되었습니다.
                  </p>
                  <p className="text-slate-500 text-[11px] sm:text-xs font-semibold leading-relaxed border-t border-orange-100 pt-2">
                    💡 <span className="text-orange-600 font-bold">다만,</span> 가입자의 개별 조건(직업, 건강 상태 등)에 따라 실제 보험료 및 가입 가능 여부는 변동될 수 있으므로, 상세한 내용은 전문 상담사와의 맞춤 설계를 통해 확인하시기 바랍니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 shrink-0 bg-gradient-to-br from-orange-500 to-amber-600 px-6 py-4 rounded-2xl shadow-md border border-orange-400/20">
                <Clock className="w-6 h-6 text-white animate-bounce" />
                <div className="text-left">
                  <p className="text-[9px] font-bold text-orange-100 uppercase tracking-widest leading-none">최적화 처리속도</p>
                  <p className="text-sm sm:text-base font-black text-white mt-1">0.1초 분석 완료</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA 버튼 / 신청 완료 상태 (웅장한 프리미엄 배너 스타일) */}
        <div className="mt-12 w-full max-w-4xl mx-auto">
          {applied ? (
            <div className="p-8 bg-emerald-500 text-white rounded-[2.5rem] text-center shadow-lg shadow-emerald-500/20 animate-in fade-in duration-300">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-emerald-500 text-xl font-black mb-3">✓</span>
              <h4 className="text-lg font-black">최저가 설계안 신청이 성공적으로 접수되었습니다!</h4>
              <p className="text-xs text-emerald-100 font-bold mt-1">배정된 전담 설계사가 카카오톡으로 상세 맞춤 설계서를 0.1초 만에 전송해 드리겠습니다.</p>
            </div>
          ) : (
            <div className="bg-slate-900 border-2 border-orange-500/40 rounded-[2.5rem] p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(255,107,0,0.25)] flex flex-col gap-6 text-left relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <ShieldCheck className="w-48 h-48 text-orange-500" />
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-orange-500/20">
                    🎁 최저가 매칭 보증
                  </div>
                  <h4 className="text-lg md:text-xl font-black text-white tracking-tight">
                    내가 선택한 맞춤 보장, 최저가 설계서 카톡 받기
                  </h4>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-lg">
                    입력하신 설계 조건 그대로 가성비가 가장 우수한 보험사의 실제 가입 제안서를 카카오톡 전송해 드립니다. (별도 추가 가입 권유 없음)
                  </p>
                </div>
                
                {/* 3대 안심 약속 미니 배너 */}
                <div className="w-full md:max-w-xs bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 text-left space-y-2 relative z-10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">🛡️</span>
                    <span className="text-[10px] font-black text-slate-300">고객 안심 3대 약속</span>
                    <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded-md text-[7px] font-black uppercase tracking-wider border border-orange-500/20">Verified</span>
                  </div>
                  <div className="space-y-1.5 text-[9px] font-bold text-slate-400">
                    <p className="flex items-center gap-1"><span className="text-orange-500">✓</span> 동의 없는 무단 전화 일절 금지</p>
                    <p className="flex items-center gap-1"><span className="text-orange-500">✓</span> 자가진단시 연락처 완벽 마스킹</p>
                    <p className="flex items-center gap-1"><span className="text-orange-500">✓</span> 코드를 통한 1:1 카톡 익명 상담 가능</p>
                  </div>
                </div>
              </div>

              {/* 가로 분할 2 버튼 */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 pt-4 border-t border-white/5">
                <button
                  onClick={async () => {
                    setApplied(true);
                    const simCode = (result as any).simulation_code || '';
                    if (onSubmitLead) {
                      await onSubmitLead(result.analysis, `${result.analysis.selectedCategory || 'general'}_consult`, result, 'anonymous');
                    }
                    
                    const clipboardMsg = `안녕하세요! [ ${simCode} ] 설계안으로 익명 상담 신청합니다. (보험 종류: ${result.analysis.selectedCategory || '일반'})`;
                    copyToClipboard(clipboardMsg);
                    alert(`[익명] 최저가 설계서 상담 신청이 완료되었습니다!\n설계 코드 [ ${simCode} ]가 클립보드에 자동 복사되었습니다. 카카오톡 채팅창에 붙여넣기(Ctrl+V)하여 안전하게 상담해 주세요.`);

                    if (branding?.kakaoLink) {
                      window.open(branding.kakaoLink, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="w-full px-6 py-4.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl border border-white/10 shadow-md transform hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer text-center"
                >
                  💬 익명 카톡 상담 신청 (무료)
                </button>
                <button
                  onClick={async () => {
                    setApplied(true);
                    const simCode = (result as any).simulation_code || '';
                    if (onSubmitLead) {
                      await onSubmitLead(result.analysis, `${result.analysis.selectedCategory || 'general'}_consult`, result, 'regular');
                    }
                    
                    const clipboardMsg = `안녕하세요! [ ${simCode} ] 설계안으로 정식 상담 신청합니다. (보험 종류: ${result.analysis.selectedCategory || '일반'})`;
                    copyToClipboard(clipboardMsg);
                    alert(`[정식] 최저가 설계서 상담 신청이 완료되었습니다!\n설계 코드 [ ${simCode} ]가 클립보드에 자동 복사되었습니다. 카카오톡 채팅창에 붙여넣기(Ctrl+V)하시면 더 신속한 맞춤 상담을 안내해 드립니다.`);

                    if (branding?.kakaoLink) {
                      window.open(branding.kakaoLink, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="w-full px-6 py-4.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow-[0_12px_24px_-4px_rgba(255,107,0,0.4)] transform hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer text-center"
                >
                  🚀 정식 카톡 상담 신청 (무료)
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* 5. 법적 면책 고지 및 전문 상담 유도 (Marketing CTA Disclaimer) */}
      {isRemodeling && (
      <section className="mt-16 max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-slate-900 border-2 border-orange-500/30 rounded-[3rem] p-10 md:p-12 shadow-[0_30px_60px_-15px_rgba(255,107,0,0.15)] text-left relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-orange-500" />
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">⚠️ AI 분석의 한계</span>
                <span className="px-3 py-1 bg-white/10 text-orange-400 rounded-lg text-[9px] font-black uppercase tracking-widest">📢 필독 안내</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mt-2">
                AI 추정치만으로는 나의 소중한 자산을 완벽히 지킬 수 없습니다.
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-sm font-semibold text-slate-300 leading-relaxed break-keep">
            <p>
              현재 화면에 표시된 리밸런싱 및 업그레이드 분석 결과는 고객님의 가입 상품명과 보험료 데이터를 기반으로 자동 산출된 <span className="text-orange-400 font-bold">AI 분석 추정치</span>입니다.
            </p>
            <p>
              실제 가입하신 보험 증권의 세부 약관, 가입 시점 및 개별 특약 구성에 따라 실제 보장 금액과 차이가 발생할 수 있으며, 자칫 중요한 보장이 누락되는 손해를 입으실 수 있습니다.
            </p>
            <p className="text-white font-bold bg-white/5 p-4 rounded-xl border border-white/5">
              안전하고 확실한 보험료 절감 및 빈틈없는 보장자산 확보를 위해, <span className="text-orange-400 font-black underline">반드시 전문 설계사를 통한 정밀 분석(보험 분석)</span>을 받아보시기를 강력히 권장해 드립니다.
            </p>
          </div>

          {/* Lead Generation Box with Reassurance and Dual Buttons */}
          <div className="mt-10 bg-white/5 p-8 rounded-[2rem] border border-white/10 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-black text-orange-400 block uppercase tracking-widest">1:1 맞춤형 컨설팅</span>
                <h4 className="text-base font-bold text-white">내 증권의 숨겨진 보장 구멍, 100% 정확하게 찾아드립니다.</h4>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  전문 분석 솔루션을 통해 고객님의 증권을 대조하여 최적화 및 보장 공백 보완 설계를 0.1초 만에 도와드립니다.
                </p>
              </div>

              {/* 3대 안심 약속 미니 배너 */}
              <div className="w-full lg:max-w-xs bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">🛡️</span>
                  <span className="text-[10px] font-black text-slate-300">고객 안심 3대 약속</span>
                  <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded-md text-[7px] font-black uppercase tracking-wider border border-orange-500/20">Verified</span>
                </div>
                <div className="space-y-1.5 text-[9px] font-bold text-slate-400">
                  <p className="flex items-center gap-1"><span className="text-orange-500">✓</span> 동의 없는 무단 전화 일절 금지</p>
                  <p className="flex items-center gap-1"><span className="text-orange-500">✓</span> 자가진단시 연락처 완벽 마스킹</p>
                  <p className="flex items-center gap-1"><span className="text-orange-500">✓</span> 코드를 통한 1:1 카톡 익명 상담 가능</p>
                </div>
              </div>
            </div>

            {/* 가로 분할 2 버튼 */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <button
                onClick={async () => {
                  const simCode = (result as any).simulation_code || '';
                  if (onSubmitLead) {
                    await onSubmitLead(result.analysis, 'remodeling_consult', result, 'anonymous');
                  }

                  const clipboardMsg = `안녕하세요! [ ${simCode} ] 설계안으로 정밀 분석 익명 상담 신청합니다. (보험 종류: ${result.analysis.selectedCategory || '일반'})`;
                  copyToClipboard(clipboardMsg);
                  alert(`[익명] 정밀 분석 신청이 완료되었습니다!\n설계 코드 [ ${simCode} ]가 클립보드에 자동 복사되었습니다. 카카오톡 채팅창에 붙여넣기(Ctrl+V)하여 안전하게 상담해 주세요.`);

                  if (branding?.kakaoLink) {
                    window.open(branding.kakaoLink, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="w-full px-6 py-4.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl border border-white/10 shadow-md transform hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer text-center"
              >
                💬 익명 정밀 분석 신청 (무료)
              </button>
              <button
                onClick={async () => {
                  const simCode = (result as any).simulation_code || '';
                  if (onSubmitLead) {
                    await onSubmitLead(result.analysis, 'remodeling_consult', result, 'regular');
                  }

                  const clipboardMsg = `안녕하세요! [ ${simCode} ] 설계안으로 정밀 분석 정식 상담 신청합니다. (보험 종류: ${result.analysis.selectedCategory || '일반'})`;
                  copyToClipboard(clipboardMsg);
                  alert(`[정식] 정밀 분석 신청이 완료되었습니다!\n설계 코드 [ ${simCode} ]가 클립보드에 자동 복사되었습니다. 카카오톡 채팅창에 붙여넣기(Ctrl+V)하시면 설계사가 바로 조회하여 신속한 맞춤 상담을 안내해 드립니다.`);

                  if (branding?.kakaoLink) {
                    window.open(branding.kakaoLink, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="w-full px-6 py-4.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow-[0_12px_24px_-4px_rgba(255,107,0,0.4)] transform hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer text-center"
              >
                🚀 정식 정밀 분석 신청 (무료)
              </button>
            </div>
          </div>
        </div>
      </section>
      )}
      {isUnderwritingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200 text-left text-white">
            <button 
              onClick={() => setIsUnderwritingOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer transition-colors text-base font-extrabold"
            >
              ✕
            </button>
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-[9px] font-black uppercase border border-orange-500/20">
                🔍 가입 승인 사전 심사
              </span>
              <h3 className="text-base md:text-lg font-black text-white">사전 심사 신청하기</h3>
              <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                과거 병력(수술/입원/약 복용 등)에 따른 가입 승인 여부를 무료로 사전 심사 요청합니다.
              </p>
            </div>

            <form onSubmit={handleUnderwritingSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">고객 이름</label>
                <input 
                  type="text" 
                  required
                  placeholder="홍길동"
                  value={uwName}
                  onChange={(e) => setUwName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3.5 text-xs font-bold text-white placeholder-slate-650 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">연락처 (휴대폰 번호)</label>
                <input 
                  type="tel" 
                  required
                  placeholder="010-1234-5678"
                  value={uwPhone}
                  onChange={(e) => setUwPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3.5 text-xs font-bold text-white placeholder-slate-650 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">최근 5년 내 병력 사항 고지 (단순 체크)</label>
                <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-850/60">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-slate-350 hover:text-white select-none">
                    <input 
                      type="checkbox"
                      checked={uwSurgery}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUwSurgery(checked);
                        if (checked) setUwNone(false);
                      }}
                      className="mt-0.5 rounded border-slate-800 text-orange-500 focus:ring-0 focus:ring-offset-0 bg-slate-950 cursor-pointer"
                    />
                    <span className="leading-tight break-keep">최근 5년 이내 수술 이력이 있습니다.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-slate-350 hover:text-white select-none">
                    <input 
                      type="checkbox"
                      checked={uwHospitalization}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUwHospitalization(checked);
                        if (checked) setUwNone(false);
                      }}
                      className="mt-0.5 rounded border-slate-800 text-orange-500 focus:ring-0 focus:ring-offset-0 bg-slate-950 cursor-pointer"
                    />
                    <span className="leading-tight break-keep">최근 5년 이내 입원 이력이 있습니다.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-slate-350 hover:text-white select-none">
                    <input 
                      type="checkbox"
                      checked={uwMedication}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUwMedication(checked);
                        if (checked) setUwNone(false);
                      }}
                      className="mt-0.5 rounded border-slate-800 text-orange-500 focus:ring-0 focus:ring-offset-0 bg-slate-950 cursor-pointer"
                    />
                    <span className="leading-tight break-keep">최근 3개월 이내 의사 처방 및 약 복용 이력이 있습니다.</span>
                  </label>
                  
                  <div className="w-full h-px bg-slate-850/60 my-2" />
                  
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-slate-350 hover:text-white select-none">
                    <input 
                      type="checkbox"
                      checked={uwNone}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUwNone(checked);
                        if (checked) {
                          setUwSurgery(false);
                          setUwHospitalization(false);
                          setUwMedication(false);
                        }
                      }}
                      className="mt-0.5 rounded border-slate-800 text-orange-500 focus:ring-0 focus:ring-offset-0 bg-slate-950 cursor-pointer"
                    />
                    <span className="text-emerald-400 font-extrabold leading-tight break-keep">해당 사항 없음 (건강함)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between gap-3">
                <button 
                  type="button"
                  onClick={() => setIsUnderwritingOpen(false)}
                  className="flex-1 px-4 py-3.5 bg-slate-800 hover:bg-slate-750 text-white font-black text-xs rounded-xl border border-white/5 cursor-pointer text-center font-extrabold"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={uwSubmitting}
                  className="flex-1 px-4 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-[0_8px_16px_rgba(255,107,0,0.3)] cursor-pointer text-center font-extrabold"
                >
                  {uwSubmitting ? "신청 중..." : "사전 심사 신청 완료"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
