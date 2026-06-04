import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, ShieldCheck, Zap, Calculator, Target, Brain, Heart, Stethoscope, Clock, Hotel, Baby, Sparkles, TrendingUp, Plane, Gift, Dog, Cat } from 'lucide-react';
import { AnalysisResult } from '../types/insurance';
import RadarChart from './RadarChart';
import ComparisonTable from './ComparisonTable';
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

import { DriverSummary } from './insurance/driver/DriverSummary';
import { PetSummary } from './insurance/pet/PetSummary';
import { GolfSummary } from './insurance/golf/GolfSummary';
import { FireSummary } from './insurance/fire/FireSummary';
import { AnnuitySummary } from './insurance/annuity/AnnuitySummary';
import { WholeLifeSummary } from './insurance/wholeLife/WholeLifeSummary';
import { VariableSummary } from './insurance/variable/VariableSummary';


interface AnalysisDashboardProps {
  result: AnalysisResult;
}

const InsuranceSummary = ({ result }: { result: AnalysisResult }) => {
  const { analysis } = result;
  const isDental = analysis.selectedCategory?.includes('치아');
  const isSilbi = analysis.selectedCategory?.includes('실손') || analysis.selectedCategory?.includes('실비');
  const isCaregiving = analysis.selectedCategory?.includes('간병');
  const isSurgeryHospital = analysis.selectedCategory?.includes('수술') || analysis.selectedCategory?.includes('입원');
  const isNursing = analysis.selectedCategory === '재가/시설' || analysis.selectedCategory?.includes('재가') || analysis.selectedCategory?.includes('시설');
  const isChild = analysis.selectedCategory?.includes('어린이') || analysis.selectedCategory?.includes('태아') || analysis.selectedCategory === 'child' || !!analysis.child;
  
  const isDriver = analysis.selectedCategory?.includes('운전자') || analysis.selectedCategory === 'driver' || !!analysis.driver;
  const isPet = analysis.selectedCategory?.includes('펫') || analysis.selectedCategory === 'pet' || !!analysis.pet;
  const isGolf = analysis.selectedCategory?.includes('골프') || analysis.selectedCategory === 'golf' || !!analysis.golf;
  const isFire = analysis.selectedCategory?.includes('주택화재') || analysis.selectedCategory?.includes('화재') || analysis.selectedCategory === 'fire_real' || !!analysis.fire;
  const isAnnuity = analysis.selectedCategory?.includes('연금') || analysis.selectedCategory === 'annuity_savings' || !!analysis.annuity;
  const isWholeLife = analysis.selectedCategory?.includes('종신') || analysis.selectedCategory === 'whole' || !!analysis.wholeLife;
  const isVariable = analysis.selectedCategory?.includes('변액') || analysis.selectedCategory?.includes('정기') || analysis.selectedCategory === 'variable' || analysis.selectedCategory === 'term' || !!analysis.variable;


  const formatAmount = (amt: number) => {
    if (amt >= 100000000) return `${(amt / 100000000).toFixed(0)}억 원`;
    if (amt >= 10000) return `${(amt / 10000).toLocaleString()}만 원`;
    return `${amt.toLocaleString()}원`;
  };

  if (isDental) return <DentalSummary result={result as any} />;
  if (isSilbi) return <SilsonSummary result={result as any} />;
  if (isCaregiving) return <CaregivingSummary result={result as any} />;
  if (isNursing) return <NursingSummary result={result as any} />;
  if (isChild) return <ChildSummary result={result as any} />;
  if (isSurgeryHospital) return <SurgeryHospitalSummary result={result as any} />;
  if (analysis.selectedCategory?.includes('뇌혈관')) return <BrainSummary result={result as any} formatAmount={formatAmount} />;
  if (analysis.selectedCategory?.includes('암보험')) return <CancerSummary result={result as any} formatAmount={formatAmount} />;
  if (analysis.selectedCategory?.includes('심장질환')) return <HeartSummary result={result as any} formatAmount={formatAmount} />;
  if (analysis.selectedCategory?.includes('유병자')) return <PreExistingSummary result={result as any} formatAmount={formatAmount} />;
  if (analysis.selectedCategory?.includes('자동차') || analysis.selectedCategory === 'car') return <CarSummary result={result as any} />;
  if (isDriver) return <DriverSummary result={result as any} />;
  if (isPet) return <PetSummary result={result as any} />;
  if (isGolf) return <GolfSummary result={result as any} />;
  if (isFire) return <FireSummary result={result as any} />;
  if (isAnnuity) return <AnnuitySummary result={result as any} />;
  if (isWholeLife) return <WholeLifeSummary result={result as any} />;
  if (isVariable) return <VariableSummary result={result as any} />;


  return <HealthSummary result={result as any} formatAmount={formatAmount} />;
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result }) => {
  const { scores, efficiency, deficiencies, analysis } = result;
  const isDental = analysis.selectedCategory?.includes('치아');
  const isSilbi = analysis.selectedCategory?.includes('실손') || analysis.selectedCategory?.includes('실비');
  const isCaregiving = analysis.selectedCategory?.includes('간병');
  const isNursing = analysis.selectedCategory === '재가/시설' || analysis.selectedCategory?.includes('재가') || analysis.selectedCategory?.includes('시설');
  const isSurgeryHospital = analysis.selectedCategory?.includes('수술') || analysis.selectedCategory?.includes('입원');
  const isChild = analysis.selectedCategory?.includes('어린이') || analysis.selectedCategory?.includes('태아') || analysis.selectedCategory === 'child' || !!analysis.child;
  const isCar = analysis.selectedCategory?.includes('자동차') || analysis.selectedCategory === 'car';
  const isDriver = analysis.selectedCategory?.includes('운전자') || analysis.selectedCategory === 'driver' || !!analysis.driver;
  const isPet = analysis.selectedCategory?.includes('펫') || analysis.selectedCategory === 'pet' || !!analysis.pet;
  const isGolf = analysis.selectedCategory?.includes('골프') || analysis.selectedCategory === 'golf' || !!analysis.golf;
  const isFire = analysis.selectedCategory?.includes('주택화재') || analysis.selectedCategory?.includes('화재') || analysis.selectedCategory === 'fire_real' || !!analysis.fire;
  const isAnnuity = analysis.selectedCategory?.includes('연금') || analysis.selectedCategory === 'annuity_savings' || !!analysis.annuity;
  const isWholeLife = analysis.selectedCategory?.includes('종신') || analysis.selectedCategory === 'whole' || !!analysis.wholeLife;
  const isVariable = analysis.selectedCategory?.includes('변액') || analysis.selectedCategory?.includes('정기') || analysis.selectedCategory === 'variable' || analysis.selectedCategory === 'term' || !!analysis.variable;


  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);

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
      {/* Insurance Summary Cards (Silson, Caregiving, Dental, etc.) */}
      <InsuranceSummary result={result} />

      {/* 1. Score & Metrics Section with Radar Chart */}
      <section className="bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col lg:flex-row gap-24 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] scale-150 transform rotate-12">
           {isDental || isSilbi ? <Stethoscope className="w-96 h-96 text-emerald-500" /> : isCaregiving ? <Hotel className="w-96 h-96 text-purple-500" /> : isNursing ? <Heart className="w-96 h-96 text-pink-500" /> : isChild ? <Baby className="w-96 h-96 text-yellow-500" /> : isPet ? <Dog className="w-96 h-96 text-orange-500" /> : isGolf ? <Target className="w-96 h-96 text-emerald-500" /> : <Zap className="w-96 h-96 text-orange-500" />}
        </div>

        {/* Radar Chart */}
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
               {isDental ? '당신의 치아 보장 상태를 분석했습니다.' : isSilbi ? '당신의 실손 의료비 상담 리포트입니다.' : isCaregiving ? '당신의 간병 대비 준비 상태를 분석했습니다.' : isNursing ? '당신의 요양(재가/시설) 준비 상태를 분석했습니다.' : isChild ? '당신의 자녀/태아 보장 준비 상태를 분석했습니다.' : isCar ? '당신의 자동차보험 가입 상태를 분석했습니다.' : isDriver ? '운전자보험 상품 및 가격을 분석했습니다.' : isPet ? '당신의 펫보험 보장 상태를 분석했습니다.' : isGolf ? '당신의 골프보험 가입 상태를 분석했습니다.' : isVariable ? '변액 투자 및 정기 사망보장 상태를 분석했습니다.' : '당신의 보장 상태를 분석했습니다.'}
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
                  : isCar
                  ? '"방사형 그래프가 원형에 가까울수록 안전하고 가성비 높은 자동차 보장 상태입니다."'
                  : isSurgeryHospital
                  ? '"뇌/심장/암 등 주요 질환과 수술/입원 담보를 집중 분석했습니다."'
                  : isPet
                  ? '"방사형 그래프가 6각형 모양에 가까울수록 아이를 위한 펫보험 보장이 완벽한 상태입니다."'
                  : isGolf ? '"방사형 그래프가 6각형 모양에 가까울수록 홀인원 및 필드 사고 배상책임 보장이 완벽한 상태입니다."' : '"방사형 그래프가 원형에 가까울수록 안전한 보장 상태입니다."'
               }
             </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className={`flex-1 p-8 rounded-[2rem] border group hover:scale-105 transition-all ${isDental || isSilbi || isGolf ? 'bg-emerald-50/50 border-emerald-100/50' : isCaregiving ? 'bg-purple-50/50 border-purple-100/50' : isNursing ? 'bg-pink-50/50 border-pink-100/50' : isChild ? 'bg-yellow-50/50 border-yellow-100/50' : isPet ? 'bg-orange-50/50 border-orange-100/50' : 'bg-blue-50/50 border-blue-100/50'}`}>
              <div className={`flex items-center gap-2 mb-6 ${isDental || isSilbi || isGolf ? 'text-emerald-600' : isCaregiving ? 'text-purple-600' : isNursing ? 'text-pink-600' : isChild ? 'text-yellow-600' : isPet ? 'text-orange-600' : 'text-blue-600'}`}>
                 <Calculator className="w-5 h-5" />
                 <span className="text-sm font-black uppercase tracking-widest">{isDental || isSilbi ? '실손 보험 가성비' : '보험료 효율성'}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-black leading-none ${isDental || isSilbi || isGolf ? 'text-emerald-600' : isCaregiving ? 'text-purple-600' : isNursing ? 'text-pink-600' : isPet ? 'text-orange-600' : 'text-blue-600'}`}>{efficiency.toFixed(1)}</span>
                <span className={`${isDental || isSilbi || isGolf ? 'text-emerald-900' : isCaregiving ? 'text-purple-900' : isNursing ? 'text-pink-900' : isPet ? 'text-orange-900' : 'text-blue-900'} font-bold`}>점</span>
              </div>
              <div className={`w-full h-1.5 rounded-full mt-6 overflow-hidden ${isDental || isSilbi || isGolf ? 'bg-emerald-100' : isCaregiving ? 'bg-purple-100' : isNursing ? 'bg-pink-100' : isPet ? 'bg-orange-100' : 'bg-blue-100'}`}>
                 <div className={`h-full ${isDental || isSilbi || isGolf ? 'bg-emerald-500' : isCaregiving ? 'bg-purple-500' : isNursing ? 'bg-pink-500' : isPet ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, efficiency * 100)}%` }}></div>
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

      <ComparisonTable 
        analysis={result.analysis}
        recommendation={result.recommendations.upgrade} 
      />

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
          <p className="text-gray-500 font-bold italic">"현재 상황에서 가장 합리적인 3가지 탈출 경로를 제시합니다."</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-stretch">
           {/* Diet Type */}
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.diet)}
             className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(59,130,246,0.15)] border border-blue-100/50 flex flex-col group transition-all cursor-pointer overflow-hidden relative"
           >
             <div className="absolute top-0 right-0 p-8 opacity-10 rotate-45 transform">
               <Zap className="w-32 h-32 text-blue-500" />
             </div>
             <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-blue-200 group-hover:rotate-[360deg] transition-transform duration-1000 relative z-10">
               <Zap className="w-8 h-8 fill-current" />
             </div>
              <h4 className="text-2xl font-black mb-1 tracking-tighter text-blue-900 group-hover:text-blue-600 transition-colors uppercase">{result.recommendations.diet.title}</h4>
              {result.recommendations.diet.companyName && (
                <div className="flex flex-wrap items-center gap-y-1.5 mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.diet.companyName}</span>
                  <span className="text-xs font-bold text-slate-500 italic break-keep">{result.recommendations.diet.productName}</span>
                </div>
              )}
              <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10 min-h-[4rem]">
                {result.recommendations.diet.description}
              </p>

             <div className="mb-10 border-b border-gray-50 pb-10">
                <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">{isCar ? '연 예상 보험료' : '월 예상 보험료'}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-blue-600 tracking-tighter">{Math.round(isCar ? result.recommendations.diet.estimatedPremium * 12 : result.recommendations.diet.estimatedPremium).toLocaleString()}</span>
                  <span className="text-2xl font-black text-gray-900">원</span>
                </div>
                {result.recommendations.diet.isFire && (
                  <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 text-[11px] font-bold text-blue-800 space-y-1">
                    <div className="flex justify-between">
                      <span>보장 보험료 (소멸성):</span>
                      <span>{(result.recommendations.diet as any).riskPremium?.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>적립 보험료 (환급형):</span>
                      <span>{(result.recommendations.diet as any).savingsPremium?.toLocaleString()}원</span>
                    </div>
                  </div>
                )}
             </div>

             <ul className="space-y-6 flex-1 mb-12">
               {result.recommendations.diet.coverageChanges.map((change, i) => (
                 <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                    </div>
                    {change}
                 </li>
               ))}
             </ul>

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
             <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-10 shadow-[0_15px_30px_-5px_rgba(255,107,0,0.5)] animate-pulse">
               <Zap className="w-8 h-8 fill-current" />
             </div>
              <h4 className="text-2xl font-black mb-1 tracking-tighter text-orange-400 uppercase">{result.recommendations.upgrade.title}</h4>
              {result.recommendations.upgrade.companyName && (
                <div className="flex flex-wrap items-center gap-y-1.5 mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.upgrade.companyName}</span>
                  <span className="text-xs font-bold text-slate-400 italic break-keep">{result.recommendations.upgrade.productName}</span>
                </div>
              )}
              <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 min-h-[4rem]">
                {result.recommendations.upgrade.description}
              </p>

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
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-orange-500" />
                    </div>
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-orange-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_-5px_rgba(255,107,0,0.5)] hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-slate-500 mt-6 leading-tight font-bold text-center opacity-40">
               {result.recommendations.upgrade.switchingLossNotice}
             </p>
           </motion.div>

           {/* Hybrid Type */}
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
        </div>
      </section>

      {/* 4. Full Market Analysis Section */}
      <section className="space-y-16 pb-32">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
            <Heart size={14} className="fill-current text-emerald-400" /> Whole Market Comparison
          </div>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter">전 보험사 실시간 보험료 비교</h3>
          <p className="text-gray-500 font-bold italic">"대한민국 모든 보험사의 DB를 전수 조사한 결과입니다."</p>
        </div>

        {result.recommendations.diet.isFire && (
          <div className="p-6 bg-orange-50/80 rounded-2xl border border-orange-100 flex items-start gap-4 max-w-2xl mx-auto text-left shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-2xl mt-0.5">💡</span>
            <div className="space-y-1">
              <h5 className="text-sm font-black text-orange-950">화재보험 의무 최저보험료(10,000원) 안내</h5>
              <p className="text-xs font-bold text-orange-800 leading-relaxed">
                주택화재보험은 금융 규정상 **월 최소 납입 보험료가 10,000원**으로 고정되어 있습니다. 
                보장 한도 대비 계산된 실제 화재 보장비(소멸성)를 제외한 차액은 만기 시 돌려받을 수 있는 
                **'적립 보험료(환급형)'**로 자동 적립되어 안전하게 보관됩니다.
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
                       {opt.riskPremium !== undefined && !isAnnuity && !isVariable && (
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
        </div>
      </section>
    </div>
  );
};

export default AnalysisDashboard;
