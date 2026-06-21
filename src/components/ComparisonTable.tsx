import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingDown, TrendingUp, ShieldCheck, HeartPulse, Brain, Heart, Stethoscope, Clock, Scale, Dog, Cat, Coins, Calendar, PiggyBank } from 'lucide-react';
import { InsuranceAnalysis, RecommendationPlan } from '../types/insurance';
import disclosureDates from '../lib/insurance/disclosure_dates.json';

interface ComparisonTableProps {
  analysis: InsuranceAnalysis;
  recommendation: RecommendationPlan;
  isUnlocked?: boolean;
  forceMobile?: boolean;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ analysis, recommendation, isUnlocked, forceMobile }) => {
  const savings = analysis.monthlyPremium - recommendation.estimatedPremium;

  const formatAmt = (amt: number) => {
    if (amt >= 100000000) return `${(amt / 100000000).toFixed(0)}억`;
    if (amt >= 10000) return `${(amt / 10000).toLocaleString()}만`;
    return `${amt.toLocaleString()}원`;
  };

  const category = analysis.selectedCategory ?? '';
  const isDental = category.includes('치아');
  const isSilbi = category.includes('실손') || category.includes('실비');
  const isCaregiving = category.includes('간병');
  const isDementia = isCaregiving && (analysis.caregiving as any)?.dementiaDiagnosis !== undefined;
  const isGeneralCaregiving = isCaregiving && !isDementia;
  const isNursing = category === '재가/시설' || category.includes('재가') || category.includes('시설');
  const isBrain = category.includes('뇌혈관') || category === 'brain';
  const isHeart = category.includes('심장') || category === 'heart';
  const isCancer = category.includes('암보험') || category === 'cancer';
  const isHealthGeneral = category.includes('종합건강') || category === 'health_general';
  const isChild = category.includes('어린이') || category.includes('태아') || category === 'child' || category === 'pre_family' || category === 'child_sick' || category.includes('유병력자');
  const isPreExisting = (category.includes('유병자') || category.includes('간편')) && !isChild;
  const isCar = category.includes('자동차') || category === 'car';
  const isDriver = category.includes('운전자') || category === 'driver';
  const isPet = category.includes('펫') || category === 'pet';
  const isGolf = category.includes('골프') || category.includes('레저') || category === 'golf' || category === 'leisure';
  const isProperty = category.includes('재물') || category === 'property';
  const isFire = (category.includes('주택화재') || category.includes('화재') || category === 'fire_real') && !isProperty;
  const isAnnuity = category.includes('연금') || category === 'annuity_savings';
  const isWholeLife = category.includes('종신') || category === 'whole';
  const isVariable = category.includes('변액') || category.includes('정기') || category === 'variable' || category === 'term';
  const isLegal = category.includes('민사') || category.includes('형사') || category.includes('법률') || category === 'legal';
  const isSavingsGeneral = category.includes('일반 저축') || category === 'savings_general';
  const isCredit = category.includes('신용') || category === 'credit';
  const isAccident = category.includes('상해') || category === 'accident';
  const isSurgeryHospital = category.includes('수술') || category.includes('입원');
  const isRemodeling = category === 'remodeling';
  const hasLiabilityRider = (analysis as any)._remodelingCoverage?.policies?.some((p: any) =>
    p.riders?.some((r: any) => /배상책임/.test(r.rider_name))
  ) || false;


  const benchmark = isSilbi ? 55000 : isDental ? 85000 : isCaregiving ? 45000 : isNursing ? 70000 : isHeart ? 120000 : isChild ? (analysis.child?.maturity === 30 ? 45000 : 95000) : isDriver ? 22000 : isPet ? 42000 : isGolf ? 15000 : isFire ? 12000 : isProperty ? 45000 : isWholeLife ? 150000 : isVariable ? 150000 : isLegal ? 18000 : isCredit ? 40000 : isAccident ? 30000 : 180000;
  const dietPremium = recommendation.estimatedPremium;
  const currentPremium = analysis.monthlyPremium;
  
  const displaySavings = currentPremium > dietPremium + 5000 ? (currentPremium - dietPremium) : (benchmark - dietPremium);
  
  // 1. 치아보험
  const dentalRows = [
    { 
      label: '임플란트 보장 한도', 
      current: analysis.dental?.implantLimit === 'unlimited' ? '무제한' : (analysis.dental?.implantLimit ? `${analysis.dental.implantLimit}개` : '연 3개'), 
      recommended: '무제한 (보증금 한도 걱정 없이 든든하게)', 
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '크라운 보장 금액', 
      current: formatAmt(analysis.dental?.crownAmount || 200000), 
      recommended: '최대 50만 원 (고액 보존치료 자기부담금 축소)', 
      icon: <TrendingUp className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '레진/인레이 보장', 
      current: formatAmt(analysis.dental?.inlayAmount || 100000), 
      recommended: '최대 15만 원 (자주 쓰는 보존치료 집중 케어)', 
      icon: <HeartPulse className="w-4 h-4 text-purple-600" /> 
    },
  ];

  // 2. 실손의료비
  const silbiRows = [
    { 
      label: '세대 구분 및 본인부담금', 
      current: `${analysis.silbi?.generation || 4}세대 (급여 20%/비급여 30%)`, 
      recommended: '4세대 유지 및 비급여 특약 할인 연동 적용', 
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '비급여 주사제 보장', 
      current: '가입 (연 250만 원 한도)', 
      recommended: '가입 유지 및 3대 비급여 한도 관리', 
      icon: <HeartPulse className="w-4 h-4 text-blue-600" /> 
    },
  ];

  // 3. 치매보험
  const dementiaRows = [
    { 
      label: '경도 치매 진단금 (CDR 1점)', 
      current: formatAmt(analysis.caregiving?.dementiaDiagnosis || 3000000), 
      recommended: '최대 1,000만 원 (초기 발견 시 즉각 치료비 확보)', 
      icon: <Brain className="w-4 h-4 text-rose-600" /> 
    },
    { 
      label: '중등도 치매 진단금 (CDR 2점)', 
      current: formatAmt((analysis.caregiving?.dementiaDiagnosis || 3000000) * 2), 
      recommended: '최대 2,000만 원 (간병 인프라 조기 세팅 자금)', 
      icon: <Brain className="w-4 h-4 text-rose-600" /> 
    },
    { 
      label: '중증 치매 생활비 (CDR 3점)', 
      current: '없음', 
      recommended: '매월 100만 원 평생 지급 (종신 보장으로 가족 간병 부담 해소)', 
      icon: <Clock className="w-4 h-4 text-rose-600" /> 
    },
  ];

  // 4. 일반 간병보험
  const caregivingRows = [
    { 
      label: '간병인 지원 일당 (보험사 직접 파견)', 
      current: '없음', 
      recommended: '일반 병실/요양병원 간병인 100% 매칭 지원', 
      icon: <Stethoscope className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '간병비 사용 일당 (현금 지급형)', 
      current: '없음', 
      recommended: '하루 최대 15만 원 현금 지급 (간병비 부담 제거)', 
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
    },
  ];

  // 5. 재가/시설 (장기요양)
  const nursingRows = [
    { 
      label: '재가급여 지원 한도 (장기요양 1~5등급)', 
      current: '없음', 
      recommended: '매월 최대 100만 원 (방문요양/방문목욕 서비스 국가지원 외 추가 지원)', 
      icon: <ShieldCheck className="w-4 h-4 text-teal-600" /> 
    },
    { 
      label: '시설급여 지원 한도 (요양원/실버타운)', 
      current: '없음', 
      recommended: '매월 최대 120만 원 (요양시설 입소 시 매달 생활비 보조)', 
      icon: <HeartPulse className="w-4 h-4 text-teal-600" /> 
    },
  ];

  // 6. 뇌혈관질환
  const brainRows = [
    { 
      label: '뇌혈관질환 진단비 (넓은 보장)', 
      current: formatAmt(analysis.brain?.diagnosisAmount || 10000000), 
      recommended: '최대 2,000만 원 (뇌졸중/뇌출혈 전조 증상인 뇌동맥류 단계부터 보장)', 
      icon: <Brain className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      label: '뇌졸중/뇌출혈 진단비', 
      current: formatAmt(analysis.brain?.strokeAmount || 20000000), 
      recommended: '최대 3,000만 원 (중증 뇌질환 진단 시 집중 보강)', 
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      label: '뇌혈관질환 수술비', 
      current: '없음', 
      recommended: '수술 1회당 1,000만 원 (관혈/비관혈 구분 없이 반복 지급)', 
      icon: <HeartPulse className="w-4 h-4 text-indigo-600" /> 
    },
  ];

  // 7. 허혈성심장질환
  const heartRows = [
    { 
      label: '허혈성 심장질환 진단비 (협심증 포함)', 
      current: formatAmt(analysis.heart?.diagnosisAmount || 10000000), 
      recommended: '최대 2,000만 원 (심장 질환의 70%인 협심증 단계부터 확실한 보장)', 
      icon: <Heart className="w-4 h-4 text-red-600" /> 
    },
    { 
      label: '급성심근경색증 진단비', 
      current: formatAmt(analysis.heart?.infarctionAmount || 20000000), 
      recommended: '최대 3,000만 원 (심장 쇼크 등 급성 중증 상태 대비)', 
      icon: <ShieldCheck className="w-4 h-4 text-red-600" /> 
    },
    { 
      label: '심장질환 수술비 (스텐트 삽입술 등)', 
      current: '없음', 
      recommended: '수술 1회당 1,000만 원 (재수술 빈도가 높은 스텐트 시술 매회 보장)', 
      icon: <HeartPulse className="w-4 h-4 text-red-600" /> 
    },
  ];

  // 8. 자동차보험
  const carModel = analysis.car?.model || 'grandeur';
  const carYear = analysis.car?.year || 2020;
  const carOwnDamage = analysis.car?.ownDamage || 'join';
  const carDriverLimit = analysis.car?.driverLimit || 'single';

  const ALL_MODEL_PRICES: Record<string, number> = {
    morning: 15000000,
    avante: 22000000,
    sonata: 32000000,
    grandeur: 43000000,
    g80: 68000000,
    sorento: 38000000,
    palisade: 45000000,
  };

  const ALL_MODEL_LABELS: Record<string, string> = {
    morning: '모닝',
    avante: '아반떼',
    sonata: '쏘나타',
    grandeur: '그랜저',
    g80: '제네시스 G80',
    sorento: '쏘렌토',
    palisade: '팰리세이드',
  };

  const DRIVER_LABELS: Record<string, string> = {
    single: '1인 한정',
    couple: '부부 한정',
    family: '가족 한정',
    anyone: '누구나',
  };

  const basePrice = ALL_MODEL_PRICES[carModel] || 43000000;
  const ageYears = Math.max(0, 2026 - carYear);
  const calculatedCarValue = Math.max(
    Math.round(basePrice * Math.pow(0.85, ageYears)),
    Math.round(basePrice * 0.1)
  );

  const carRows = [
    { 
      label: '평가 차량 모델 및 가액', 
      current: `${ALL_MODEL_LABELS[carModel] || carModel} (${carYear}년식)`, 
      recommended: `차량가액 ${(calculatedCarValue / 10000).toFixed(0)}만 원 산정 보장`, 
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '운전자 범위 특약', 
      current: DRIVER_LABELS[carDriverLimit] || '1인 한정', 
      recommended: carDriverLimit === 'single' ? '부부 한정 (가족 대비 절약) 권장' : `${DRIVER_LABELS[carDriverLimit]} 유지`, 
      icon: <HeartPulse className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '자기차량손해 (자차) 보장 방식', 
      current: carOwnDamage === 'join' ? '자차 가입 (종합 보장)' : (carOwnDamage === 'exclude_single' ? '단독사고 제외 가입' : '자차 미가입'), 
      recommended: carOwnDamage === 'none' ? '침수·단독 사고 대비 종합 보장 권장' : '자기차량손해 든든하게 보장', 
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '자기신체 상해 담보 방식', 
      current: analysis.car?.currentInjuryType === 'jasang' ? '자동차상해 (자상)' : '자기신체사고 (자손)', 
      recommended: '자동차상해 (치료비+위자료+휴업손해 100% 보장)', 
      icon: <HeartPulse className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '대물배상 보장 한도', 
      current: `${analysis.car?.currentPropertyLimit || 2}억 원`, 
      recommended: '10억 원 (연간 약 1.5만원 차이로 고가차 다중사고 완전 대비)', 
      icon: <Brain className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '안전운전 특약 할인 (Tmap)', 
      current: analysis.car?.safeDrivingScore === 'none' 
        ? '미적용' 
        : analysis.car?.safeDrivingScore === 'under_70' 
          ? '미적용 (70점 미만)' 
          : analysis.car?.safeDrivingScore === 'over_80' 
            ? '12% 할인 적용 중' 
            : '7% 할인 적용 중', 
      recommended: '최대 12% 캐시백 환급 (티맵 점수 연동 최적화)', 
      icon: <TrendingDown className="w-4 h-4 text-blue-600" /> 
    },
  ];

  // 9. 운전자보험
  const driverPlanType = analysis.driver?.planType || 'standard';
  const driverRows = [
    { 
      label: '교통사고처리지원금 (형사합의금)', 
      current: driverPlanType === 'saving' ? '1억 원' : (driverPlanType === 'standard' ? '1.5억 원' : '2억 원'), 
      recommended: '최대 2억 원 (형사합의비 한도 완벽 보강)', 
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '변호사 선임 비용 (경찰조사단계 포함)', 
      current: driverPlanType === 'saving' ? '3,000만 원' : '5,000만 원', 
      recommended: '5,000만 원 (경찰 첫 출석 단계부터 선지원)', 
      icon: <Clock className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '대인 벌금 (민식이법 법정 최고 벌금)', 
      current: driverPlanType === 'saving' ? '2,000만 원' : '3,000만 원', 
      recommended: '3,000만 원 (대인 벌금 리스크 전액 실손방어)', 
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '대물 벌금 (도로 파손 대비)', 
      current: driverPlanType === 'premium' ? '500만 원' : '없음', 
      recommended: '500만 원 (가드레일 및 공공기물 훼손 대비)', 
      icon: <Brain className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '자동차사고 부상치료비 (자부상)', 
      current: '없음', 
      recommended: '14급 단순염좌 시 30만 원 정액 보장', 
      icon: <HeartPulse className="w-4 h-4 text-purple-600" /> 
    },
  ];

  // 10. 어린이보험
  const childInfo = analysis.child || { targetAgeGroup: 'youth', maturity: 100 };
  const isPreFamily = category === 'pre_family' || category === 'child_sick' || category.includes('유병력자') || !!analysis.child?.isPreFamily;

  const preFamilyRows = [
    { 
      label: '산모 임신질환 수술/입원비', 
      current: '없음', 
      recommended: '가입 (임신성 고혈압/당뇨 및 조기진통 집중 방어)', 
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '태아 선천이상 수술비', 
      current: '없음', 
      recommended: '최대 500만 원 (혀유착증, 다지증 등 출생 즉시 수술 케어)', 
      icon: <HeartPulse className="w-4 h-4 text-emerald-600" /> 
    },
  ];

  const prenatalRows = [
    { 
      label: '저체중아/신생아 입원일당', 
      current: '없음', 
      recommended: '2.5kg 미만 출생 시 인큐베이터 비용 100% 매칭 지원', 
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '선천이상 수술비 (혀유착 등)', 
      current: '없음', 
      recommended: '1회당 최대 500만 원 (다지증, 선천성 모반 등 사소한 이상 든든하게 보장)', 
      icon: <HeartPulse className="w-4 h-4 text-emerald-600" /> 
    },
  ];

  const youthRows = [
    { 
      label: 'ADHD / 소아 우울증 진단비', 
      current: '없음', 
      recommended: '진단 시 최초 1회 최고 300만 원 지급', 
      icon: <Brain className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '독감(인플루엔자) 치료비', 
      current: '없음', 
      recommended: '타미플루 처방 시 연간 1회 10만 원 실손 정액 보장', 
      icon: <Stethoscope className="w-4 h-4 text-emerald-600" /> 
    },
  ];

  const childRows = [
    { 
      label: '3대 진단비 (암·뇌·심장)', 
      current: formatAmt(30000000), 
      recommended: '최대 5,000만 원 (어린이보험 특유의 면책기간/감액기간 없음 활용)', 
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
    },
  ];

  // 11. 암보험 전용 비교 행
  const cancerRows = [
    {
      label: '일반암 진단비',
      current: formatAmt(analysis.cancer?.currentAmount ?? 30000000),
      recommended: `최대 ${formatAmt(analysis.cancer?.currentAmount ?? 50000000)} (진단 즉시 치료비+생활비 일시금 확보)`,
      icon: <ShieldCheck className="w-4 h-4 text-rose-500" />
    },
    {
      label: '표적항암 치료비',
      current: analysis.cancer?.targetedTherapy ? '가입 완료' : '미가입',
      recommended: '최대 5,000만 원 (부작용 없는 정밀 표적항암제 처방비 실손 지원)',
      icon: <HeartPulse className="w-4 h-4 text-rose-500" />
    },
    {
      label: '비급여 암 주요치료비',
      current: analysis.cancer?.treatmentCost2025 ? '가입 완료' : '미가입',
      recommended: '연간 최대 1억 원 × 10년 = 총 10억 원 (매년 쓴 비급여 치료비 정산 지급)',
      icon: <TrendingUp className="w-4 h-4 text-rose-500" />
    },
    {
      label: '재발/전이암 반복 보장',
      current: analysis.cancer?.recurrentCancer ? '가입 완료' : '미가입',
      recommended: '재진단 시 2년마다 반복 지급 (장기 투병 시 핵심 안전망)',
      icon: <ShieldCheck className="w-4 h-4 text-rose-500" />
    },
    {
      label: '납입/갱신 유형',
      current: analysis.cancer?.paymentType === 'non-renewable' ? '비갱신형' : '갱신형',
      recommended: '비갱신형 (보험료 동결 — 나이 들어도 인상 없음)',
      icon: <Clock className="w-4 h-4 text-rose-500" />
    },
  ];

  // 12. 표준/일반 종합보험 기본행 (그 외 카테고리)
  const standardRows = [
    { 
      label: '일반암 진단비', 
      current: formatAmt(analysis.cancer?.currentAmount ?? 30000000), 
      recommended: isRemodeling 
        ? `${formatAmt(analysis.cancer?.currentAmount ?? 30000000)} (동일 보장 유지 및 보험료 절감)` 
        : '최대 5,000만 원 (가장 빈번한 고액 질병 치료비 선제 확보)', 
      icon: <ShieldCheck className="w-4 h-4 text-orange-500" /> 
    },
    { 
      label: '뇌혈관질환 진단비', 
      current: formatAmt(analysis.cerebrovascular?.currentAmount ?? 10000000), 
      recommended: isRemodeling 
        ? `${formatAmt(analysis.cerebrovascular?.currentAmount ?? 10000000)} (동일 보장 유지 및 보험료 절감)` 
        : '최대 3,000만 원 (뇌졸중/뇌동맥류 완벽 보강)', 
      icon: <Brain className="w-4 h-4 text-indigo-500" /> 
    },
    { 
      label: '허혈성 심장질환 진단비', 
      current: formatAmt(analysis.cardiovascular?.currentAmount ?? 10000000), 
      recommended: isRemodeling 
        ? `${formatAmt(analysis.cardiovascular?.currentAmount ?? 10000000)} (동일 보장 유지 및 보험료 절감)` 
        : '최대 3,000만 원 (협심증 및 급성심근경색 든든하게 보장)', 
      icon: <Heart className="w-4 h-4 text-red-500" /> 
    },
    { 
      label: '가족 일상생활 배상책임', 
      current: hasLiabilityRider ? '가입' : '미가입', 
      recommended: hasLiabilityRider 
        ? '가입 유지' 
        : '가입 (대인/대물 과실 누수 사고 시 자기부담금 20만 원 방어)', 
      icon: <TrendingDown className="w-4 h-4 text-orange-500" /> 
    },
  ];

  // 12. 펫보험 (Pet Insurance)
  const petRows = [
    { 
      label: '슬개골/고관절 탈구 보장', 
      current: analysis.pet?.patellaRider ? '가입 완료' : '미보장', 
      recommended: '실손 보장 (1년 대기 후 수술비 실비 지원)', 
      icon: <Dog className="w-4 h-4 text-orange-600" /> 
    },
    { 
      label: '피부염/귓병(외이염) 보장', 
      current: analysis.pet?.skinRider ? '가입 완료' : '미보장', 
      recommended: '통원 치료비 지원 (만성 피부질환 장기 처방)', 
      icon: <Heart className="w-4 h-4 text-orange-600" /> 
    },
    { 
      label: '구강 질환/스케일링 보장', 
      current: analysis.pet?.dentalRider ? '가입 완료' : '미보장', 
      recommended: '스케일링 및 치주염 수술 지원 (구강 관리 최적화)', 
      icon: <Stethoscope className="w-4 h-4 text-orange-600" /> 
    },
    { 
      label: '반려동물 배상책임', 
      current: '미가입', 
      recommended: '사고당 최대 1,000만 원 (자부담 3만 원 전액 방어)', 
      icon: <Scale className="w-4 h-4 text-orange-600" /> 
    },
  ];

  // 13. 골프보험 (Golf Insurance)
  const golfRows = [
    { 
      label: '홀인원 축하비용', 
      current: analysis.golf?.hasHoleInOneRider ? '가입 완료' : '미보장', 
      recommended: '실손 보장 (라운딩 후 1~3개월 이내 증빙영수증 청구 시 최대 200만 원 지원)', 
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '골프 배상책임 (타구 사고)', 
      current: analysis.golf?.hasLiabilityRider ? '가입 완료' : '미보장', 
      recommended: '사고당 최대 3,000만 원 (스윙 오발 사고 대인/대물 배상안심)', 
      icon: <Scale className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '골프용품 손해 (도난/파손)', 
      current: analysis.golf?.hasEquipmentRider ? '가입 완료' : '미보장', 
      recommended: '세트당 최대 200만 원 (드라이버 헤드 깨짐, 샤프트 부러짐 실 AS비 지원)', 
      icon: <HeartPulse className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '4인 동반 단체 할인', 
      current: analysis.golf?.isGroup ? '적용 완료' : '미적용', 
      recommended: '5% 즉시 추가할인 (1팀 동반 가입 시 일괄 적용 패키지 우대)', 
      icon: <TrendingDown className="w-4 h-4 text-emerald-600" /> 
    },
  ];

  const fireOpts = analysis.fire || {
    residenceType: 'apartment',
    occupancyType: 'owner',
    buildingLimit: 100000000,
    householdGoodsLimit: 30000000,
    hasWaterLeakRider: true,
    hasLiabilityRider: true,
  };

  const fireRows = [
    { 
      label: '건물 복구 가입 금액', 
      current: fireOpts.buildingLimit ? formatAmt(fireOpts.buildingLimit) + '원' : '1억 원', 
      recommended: `${formatAmt(fireOpts.buildingLimit || 100000000)}원 (시세 대비 비례보상 방지를 위한 실손 한도 설정)`, 
      icon: <ShieldCheck className="w-4 h-4 text-red-600" /> 
    },
    { 
      label: '가재도구 가입 금액', 
      current: fireOpts.householdGoodsLimit ? formatAmt(fireOpts.householdGoodsLimit) + '원' : '3천만 원', 
      recommended: `${formatAmt(fireOpts.householdGoodsLimit || 30000000)}원 (생활 가전/가구 일체 전손 피해 시 복구 지원)`, 
      icon: <TrendingUp className="w-4 h-4 text-red-600" /> 
    },
    { 
      label: '급배수시설누출손해 (누수 보장)', 
      current: fireOpts.hasWaterLeakRider ? '가입 완료' : '미보장', 
      recommended: '가입 유지 (아랫집 누수 피해 및 우리집 수리비 보장)', 
      icon: <HeartPulse className="w-4 h-4 text-red-600" /> 
    },
    { 
      label: '화재 배상책임 (이웃집 피해보상)', 
      current: fireOpts.hasLiabilityRider ? '가입 완료' : '미보장', 
      recommended: fireOpts.occupancyType === 'owner' ? '대물 20억 / 대인 1.5억 최고한도 설정' : '임차자 배상책임 1억 든든하게 설정', 
      icon: <Scale className="w-4 h-4 text-red-600" /> 
    },
    { 
      label: '최저보험료 룰 및 적립금 전환', 
      current: '최저보험료 미달 (소멸)', 
      recommended: `실 납입 월 10,000원 (남는 차액은 만기 시 환급되는 적립금으로 자동 전환)`, 
      icon: <Clock className="w-4 h-4 text-red-600" /> 
    },
  ];

  const propertyOpts = analysis.property || {
    businessType: 'restaurant',
    buildingGrade: 'grade_1',
    buildingLimit: 200000000,
    interiorLimit: 50000000,
    equipmentLimit: 30000000,
    inventoryLimit: 20000000,
    hasWaterLeak: true,
    hasPremisesLiability: true,
    hasBusinessInterruption: false,
    hasFoodLiability: true,
    hasMachineryBreakdown: false,
  };

  const propertyRows = [
    { 
      label: '건물 화재실손 보장한도', 
      current: propertyOpts.buildingLimit ? formatAmt(propertyOpts.buildingLimit) + '원' : '2억 원', 
      recommended: `${formatAmt(propertyOpts.buildingLimit || 200000000)}원 (과소 가입 시 비례보상 방지를 위한 실손 한도 설정)`, 
      icon: <ShieldCheck className="w-4 h-4 text-orange-500" /> 
    },
    { 
      label: '시설 및 인테리어 보장', 
      current: propertyOpts.interiorLimit ? formatAmt(propertyOpts.interiorLimit) + '원' : '5천만 원', 
      recommended: `${formatAmt(propertyOpts.interiorLimit || 50000000)}원 (매장 인테리어 침수/화재 시 원상 복구 비용 전액 지원)`, 
      icon: <TrendingUp className="w-4 h-4 text-orange-500" /> 
    },
    { 
      label: '급배수시설누출손해 (누수 보장)', 
      current: propertyOpts.hasWaterLeak ? '가입 완료' : '미보장', 
      recommended: '가입 (배관 파손으로 인한 매장 인테리어 침수 피해 보장)', 
      icon: <HeartPulse className="w-4 h-4 text-orange-500" /> 
    },
    { 
      label: '점포 휴업손해 (영업중단 보상)', 
      current: propertyOpts.hasBusinessInterruption ? '가입 완료' : '미보장', 
      recommended: '가입 (화재 사고 복구 기간 중 매일 고정 임차료 등 손실 지원)', 
      icon: <Clock className="w-4 h-4 text-orange-500" /> 
    },
    { 
      label: '시설소유자 및 업종 배상책임', 
      current: propertyOpts.hasPremisesLiability ? '가입 완료' : '미보장', 
      recommended: '가입 (매장 내 고객 미끄러짐 및 식중독 등 법적 배상책임 든든하게 보장)', 
      icon: <Scale className="w-4 h-4 text-orange-500" /> 
    },
    { 
      label: '최저보험료 기준 적립금 전환', 
      current: '최저보험료 미달 (소멸)', 
      recommended: '실 납입 월 10,000원 (최저보험료 차액은 만기 시 적립보험료로 자동 환급)', 
      icon: <Coins className="w-4 h-4 text-orange-500" /> 
    },
  ];

  const annuityOpts = analysis.annuity || {
    annuityType: 'savings',
    monthlyPremium: 300000,
    paymentPeriod: 10,
    commencementAge: 60,
    annualIncome: 50000000,
    hasIrp: false,
    receivingPeriod: 20
  };

  const isSavings = annuityOpts.annuityType === 'savings';

  const annuityRows = [
    { 
      label: '세액공제 연말정산 환급', 
      current: isSavings ? '세액공제 한도 미달 상태' : '환급 혜택 제외 (비과세 타겟)', 
      recommended: isSavings ? '최대 600만 원 풀 세액공제 최적 세팅' : '10년 이상 유지 시 이자소득세 전액 면제 매칭', 
      icon: <Coins className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '납입 기간 설계', 
      current: `${annuityOpts.paymentPeriod}년납`, 
      recommended: '10년 이상 납입하여 장기 복리 효과 극대화', 
      icon: <Clock className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '연금 개시 연령 및 세율', 
      current: `만 ${annuityOpts.commencementAge}세 개시`, 
      recommended: '70세 이후 개시 설정으로 3.3% 초저율 연금과세 적용', 
      icon: <Calendar className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: 'IRP 퇴직연금 매칭', 
      current: annuityOpts.hasIrp ? '가입 완료' : '미연동', 
      recommended: 'IRP 연동으로 통합 공제 한도 900만 원으로 확대', 
      icon: <PiggyBank className="w-4 h-4 text-blue-600" /> 
    },
  ];

  const wholeLifeOpts = analysis.wholeLife || {
    objective: 'family',
    paymentPeriod: 10,
    deathBenefit: 100000000,
    refundType: 'low',
    isStepUp: false
  };

  const wholeLifeRows = [
    { 
      label: '사망 보장 한도', 
      current: '기본 가입 (5,000만 원 상당)', 
      recommended: `최대 ${formatAmt(wholeLifeOpts.deathBenefit)} (평생 상속세 및 유가족 안심 생활 자금)`, 
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      label: '보험료 납입 구조', 
      current: '20년납 장기 납부 의무', 
      recommended: `${wholeLifeOpts.paymentPeriod}년납 단기완납 (납기 단축을 통한 장기 복리 효율화)`, 
      icon: <Clock className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      label: '해약환급금 구조', 
      current: '일반형 (비싸고 완납 후 환급률 낮음)', 
      recommended: wholeLifeOpts.refundType === 'low' ? '저해지/무해지형 (보험료 18% 즉시할인 + 완납 후 높은 환급금 확보)' : '일반형 (중도 해지 페널티 최소화 구조)', 
      icon: <PiggyBank className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      label: '물가상승 대응특약', 
      current: '일반 정액 보장 (인플레이션 시 가치 하락)', 
      recommended: wholeLifeOpts.isStepUp ? '체증형 적용 (만 60세부터 매년 5%씩 20년간 보장 금액 증액)' : '기본 고정형 적용 (체증형 미설정)', 
      icon: <TrendingUp className="w-4 h-4 text-indigo-600" /> 
    },
  ];

  const varOpts = analysis.variable || {
    subType: 'term',
    deathBenefit: 100000000,
    isHealthyDiscount: false,
    equityRatio: 50,
    paymentPeriod: 10
  };
  const isInvestment = ['investment', 'variable_saving'].includes(varOpts.subType);

  const variableRows = isInvestment ? [
    {
      label: '투자 매칭 및 펀드 비중',
      current: '미지정 (또는 보수적 채권형 위주)',
      recommended: `${varOpts.equityRatio || 50}% 주식형 비중 (투자 성향 맞춤형 포트폴리오)`,
      icon: <TrendingUp className="w-4 h-4 text-blue-600" />
    },
    {
      label: '비과세 절세 혜택',
      current: '미적용 (일반 예적금/과세 상품)',
      recommended: varOpts.paymentPeriod >= 10 ? '10년 유지 시 이자소득세 비과세 100% 만족' : '10년 비과세 최적 조건 충족 설계',
      icon: <Coins className="w-4 h-4 text-blue-600" />
    },
    {
      label: '중도인출 및 납입 일시정지',
      current: '불가능 (일반 적금은 해지 외에 출금 제한)',
      recommended: '유연한 추가납입 및 필요 시 중도인출 기능 활성화',
      icon: <Clock className="w-4 h-4 text-blue-600" />
    }
  ] : [
    { 
      label: '사망 보장 한도', 
      current: `${formatAmt(varOpts.deathBenefit || 100000000)} (평생 사망 보장)`, 
      recommended: `최대 ${formatAmt(varOpts.deathBenefit || 100000000)} (가장 빈번한 경제활동기 집중 보장)`, 
      icon: <ShieldCheck className="w-4 h-4 text-orange-600" /> 
    },
    { 
      label: '보험료 납입 규모', 
      current: '월 15만 ~ 25만 원 (평생 사망 보장 준비로 인한 고비용 구조)', 
      recommended: '월 1만 ~ 3만 원대 (동일 사망 보장 대비 보험료 최대 80%~90% 이상 절감)', 
      icon: <Coins className="w-4 h-4 text-orange-600" /> 
    },
    { 
      label: '우량체 특별 할인', 
      current: '미적용 (일반 종신보험은 할인 적용이 매우 제한적)', 
      recommended: '최대 15%~18% 즉시 할인 (비흡연 + 혈압/BMI 정상 기준 만족 시 즉시 적용)', 
      icon: <TrendingDown className="w-4 h-4 text-orange-600" /> 
    },
  ];

  const savingsGeneralOpts = analysis.savingsGeneral || {
    savingType: 'installment',
    monthlyPremium: 300000,
    paymentPeriod: 5,
    maintenancePeriod: 10,
    savingsObjective: 'wealth',
    hasUniversal: true
  };

  const isInstallmentSavings = savingsGeneralOpts.savingType === 'installment';
  const isSavingsGeneralTaxExempt = isInstallmentSavings
    ? (savingsGeneralOpts.paymentPeriod >= 5 && savingsGeneralOpts.maintenancePeriod >= 10 && savingsGeneralOpts.monthlyPremium <= 1500000)
    : (savingsGeneralOpts.maintenancePeriod >= 10 && savingsGeneralOpts.monthlyPremium <= 100000000);

  const savingsRows = [
    {
      label: '이자 소득세 (15.4%)',
      current: '과세 대상 (만기 시 발생한 이자액의 15.4% 원천징수 차감)',
      recommended: isSavingsGeneralTaxExempt ? '비과세 대상 (이자소득세 0% 전액 비과세 혜택 자동 적용)' : '요건 불충족 (납입/거치 조건 변경 시 비과세 혜택 가능)',
      icon: <Coins className="w-4 h-4 text-emerald-600" />
    },
    {
      label: '이자 계산 방식',
      current: '단리 이자 (원금에만 이자가 붙는 은행 적금 방식)',
      recommended: '월 복리 이자 (원금+이자가 새로운 원금이 되어 굴러가는 복리 부리)',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />
    },
    {
      label: '납입 유연성 (유니버셜)',
      current: '일반 적금 (약정 금액 미납 시 우대이율 취소 및 만기연장 발생)',
      recommended: savingsGeneralOpts.hasUniversal ? '자유 납입/추가 납입 (기본료 외 추가 납입 200% 및 중도인출 지원)' : '일반 납입 (유니버셜 미작동)',
      icon: <Clock className="w-4 h-4 text-emerald-600" />
    },
    {
      label: '금리 방어막 (최저보증)',
      current: '시중 연동 금리 (기준금리 급락 시 0%대 만기금리 발생 우려)',
      recommended: '최저보증이율 (금리가 아무리 하락해도 평생 0.75%~1.25% 최저 이율 보장)',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />
    }
  ];


  // 14. 법률비용보험 (Legal Insurance)
  const isLawyerFocus = analysis.legal?.subType === 'lawyer';
  const legalRows = [
    { 
      label: '심급별 변호사 선임비용', 
      current: analysis.legal?.lawyerLimit ? `${(analysis.legal.lawyerLimit / 10000).toLocaleString()}만 원` : '1,000만 원', 
      recommended: `최대 ${(isLawyerFocus ? 30000000 : 20000000) / 10000}만 원 (선택한 집중 영역에 맞춰 심급별 선임비 한도 최적 보강)`, 
      icon: <Scale className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      label: '인지대 및 송달료 실비', 
      current: analysis.legal?.courtFeeLimit ? `${(analysis.legal.courtFeeLimit / 10000).toLocaleString()}만 원` : '500만 원', 
      recommended: `최대 ${(!isLawyerFocus ? 10000000 : 5000000) / 10000}만 원 (대형 소송 전 발생 시 인지액 및 송달 실비 부족액 방어)`, 
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      label: '급발진 사고 분쟁 소송 특약', 
      current: analysis.legal?.suddenAccelerationRider ? '가입' : '미가입', 
      recommended: '가입 (EDR 입증 및 급발진 사고 시 전문 변호사 선임비 완비)', 
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      label: '소송비용 자기부담 공제방식', 
      current: analysis.legal?.deductibleType === 'fixed' ? '건당 10만원 정액 공제' : '지출액의 10% 비례 공제', 
      recommended: '비례 자부담 10% 적용 (동등 보장 대비 월 보험료 10% 자동 할인 획득)', 
      icon: <TrendingDown className="w-4 h-4 text-indigo-600" /> 
    },
  ];

  const creditOpts = analysis.credit || {
    loanType: 'mortgage',
    loanAmount: 100000000,
    loanPeriod: 10,
    creditBureau: 'nice',
    creditScore: 850,
    hasIllnessRider: true,
    hasDisabilityRider: true
  };

  const creditLoanAmount = creditOpts.loanAmount || 100000000;
  const creditBureauVal = creditOpts.creditBureau || 'nice';
  const creditScoreVal = creditOpts.creditScore || 850;
  const creditHasIllnessRider = creditOpts.hasIllnessRider;
  const creditHasDisabilityRider = creditOpts.hasDisabilityRider;

  let creditDiscountRate = 0;
  if (creditScoreVal >= 900) creditDiscountRate = 10;
  else if (creditScoreVal >= 800) creditDiscountRate = 8;
  else if (creditScoreVal >= 700) creditDiscountRate = 5;
  else if (creditScoreVal >= 600) creditDiscountRate = 3;

  const creditRows = [
    {
      label: '사망 상환 보장',
      current: '미가입 (유고 시 대출금이 가족에게 승계)',
      recommended: `대출금 ${formatAmt(creditLoanAmount)} 전액 즉시 대위변제 (채무 완전소거)`,
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />
    },
    {
      label: '3대 질병 보장',
      current: '미가입 (암/뇌/심 투병 시 가계 연체 노출)',
      recommended: creditHasIllnessRider ? '진단 확정 즉시 대출 잔액 전액 상환' : '사망 특화 가입 (질병 상환 제외)',
      icon: <HeartPulse className="w-4 h-4 text-emerald-600" />
    },
    {
      label: '고도후유장해 완납',
      current: '미가입 (장해 시 소득상실 및 경매 리스크)',
      recommended: creditHasDisabilityRider ? '장해율 50% 이상 시 잔여 대출금 전액 상환' : '사망 특화 가입 (장해 상환 제외)',
      icon: <Scale className="w-4 h-4 text-emerald-600" />
    },
    {
      label: '신용평가사 할인 연계',
      current: '일반 정액 보험료 (할인 없음)',
      recommended: `${creditBureauVal.toUpperCase()} 신용등급 반영 ${creditDiscountRate}% 추가 할인 및 갱신`,
      icon: <Coins className="w-4 h-4 text-emerald-600" />
    }
  ];

  // 15. 상해보험 (Accident Insurance)
  const accidentOpts = analysis.accident || {
    accidentDeathLimit: 50000000,
    accidentDisabilityLimit: 50000000,
    fractureLimit: 300000,
    castLimit: 100000,
    surgeryLimit: 500000,
    hospitalDailyLimit: 20000,
    jobClass: 1,
    drivingType: 'private',
    hasLeisureRider: false
  };

  const accidentRows = [
    { 
      label: '상해사망 보장액', 
      current: formatAmt(accidentOpts.accidentDeathLimit), 
      recommended: '최대 1억 5,000만 원 ~ 2억 원 (중대 사고 시 유가족을 위한 안심 자원 확보)', 
      icon: <ShieldCheck className="w-4 h-4 text-red-600" /> 
    },
    { 
      label: '상해후유장해 (3%~100%)', 
      current: formatAmt(accidentOpts.accidentDisabilityLimit), 
      recommended: '최대 1억 5,000만 원 (장해 상태 진단 시 장기 대체 소득 마련)', 
      icon: <TrendingUp className="w-4 h-4 text-red-600" /> 
    },
    { 
      label: '골절 진단비 / 상해 수술비', 
      current: `골절 ${formatAmt(accidentOpts.fractureLimit)} / 수술 ${formatAmt(accidentOpts.surgeryLimit)}`, 
      recommended: '골절 최대 100만 원 / 수술 200만 원 (빈번한 생활 상해 치료 실손 보강)', 
      icon: <HeartPulse className="w-4 h-4 text-red-600" /> 
    },
    { 
      label: '레저스포츠 상해 특약', 
      current: accidentOpts.hasLeisureRider ? '가입 완료' : '미가입', 
      recommended: '가입 (등산, 골프, 자전거 등 야외 취미 활동 리스크 집중 대비)', 
      icon: <Clock className="w-4 h-4 text-red-600" /> 
    },
  ];

  // 16. 종합건강보험 전용 비교행
  const hg = analysis.healthGeneral;
  const healthGeneralRows = [
    {
      label: '일반암 진단비',
      current: hg?.cancerLimit ? formatAmt(hg.cancerLimit) : '3,000만',
      recommended: '최대 5,000만 원 (종합건강 핵심 — 암·뇌·심장 동시 선제 확보)',
      icon: <ShieldCheck className="w-4 h-4 text-violet-600" />
    },
    {
      label: '뇌혈관 + 허혈성 심장 진단비',
      current: `뇌 ${hg?.brainLimit ? formatAmt(hg.brainLimit) : '1,000만'} / 심 ${hg?.heartLimit ? formatAmt(hg.heartLimit) : '1,000만'}`,
      recommended: '각 최대 3,000만 원 (2대 급성질환 동시 강화)',
      icon: <Brain className="w-4 h-4 text-violet-600" />
    },
    {
      label: '표적항암 치료비 특약',
      current: hg?.hasTargetedTherapy ? '가입 완료' : '미가입',
      recommended: '가입 (부작용 없는 정밀 표적항암제 처방비 연간 최대 5,000만 원)',
      icon: <HeartPulse className="w-4 h-4 text-violet-600" />
    },
    {
      label: '납입/갱신 구조',
      current: hg?.isRenewable ? '갱신형 (나이 들수록 보험료 인상)' : '비갱신형',
      recommended: `비갱신형 ${hg?.paymentPeriod ? hg.paymentPeriod + '년납' : '20년납'} (보험료 동결 — 완납 후 평생 보장)`,
      icon: <Clock className="w-4 h-4 text-violet-600" />
    },
    {
      label: '가족 일상생활 배상책임',
      current: hg?.hasLiability ? '가입 완료' : '미가입',
      recommended: '가입 (누수·대인·대물 사고 시 자기부담금 20만 원 방어)',
      icon: <Scale className="w-4 h-4 text-violet-600" />
    },
  ];

  // 17. 유병자보험 전용 비교행
  const preExistingTypeLabel: Record<string, string> = {
    '3.0.5': '3개월 고지 (경증)',
    '3.2.5': '1년 고지 (중등)',
    '3.3.5': '3년 고지 (중증)',
    '3.5.5': '5년 고지 (최중증)',
  };
  const currentPreExType = analysis.preExistingType || '3.3.5';
  const preExistingRows = [
    {
      label: '고지의무 기간 (현재 유형)',
      current: preExistingTypeLabel[currentPreExType] || '3년 고지',
      recommended: '3개월 고지형 전환 가능 여부 검토 (병력 기준 완화 시 보험료 최대 35% 절감)',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />
    },
    {
      label: '표준체 대비 보험료 할증',
      current: currentPreExType === '3.0.5' ? '~15% 할증' : currentPreExType === '3.2.5' ? '~30% 할증' : '~50% 이상 할증',
      recommended: '할증 최소화 플랜 (동일 보장 유지하면서 보험사별 할증률 최저 구간 선택)',
      icon: <TrendingDown className="w-4 h-4 text-amber-600" />
    },
    {
      label: '일반암 진단비 보장 한도',
      current: formatAmt(analysis.cancer?.currentAmount ?? 20000000),
      recommended: '최대 3,000만 원 (유병자 한도 내 최대치 — 할증 없이 보장 극대화)',
      icon: <HeartPulse className="w-4 h-4 text-amber-600" />
    },
    {
      label: '뇌혈관 + 심장 진단비',
      current: formatAmt(analysis.cerebrovascular?.currentAmount ?? 5000000),
      recommended: '각 최대 1,000만 ~ 2,000만 원 (유병자 전용 한도 내 최적 설계)',
      icon: <Brain className="w-4 h-4 text-amber-600" />
    },
  ];

  // 18. 수술/입원보험 전용 비교행
  const surgeryHospitalRows = [
    {
      label: '1~5종 수술비 보장',
      current: formatAmt(analysis.surgery?.currentAmount ?? 500000),
      recommended: '5종 수술 최대 500만 원 (맹장·담낭·자궁 등 빈번한 수술 전액 실손 대비)',
      icon: <Stethoscope className="w-4 h-4 text-sky-600" />
    },
    {
      label: '질병 입원일당',
      current: '없음 또는 1~2만 원',
      recommended: '하루 최대 5만 원 (장기 입원 시 생활비 손실 보전)',
      icon: <ShieldCheck className="w-4 h-4 text-sky-600" />
    },
    {
      label: '중환자실(ICU) 입원일당',
      current: '없음',
      recommended: '하루 최대 10만 원 (일반 병실 대비 5배 비용 — 중증 입원 핵심 방어)',
      icon: <HeartPulse className="w-4 h-4 text-sky-600" />
    },
    {
      label: '종합병원 이상 입원일당 할증',
      current: '없음',
      recommended: '3차 상급 종합병원 이상 입원 시 일당 2배 지급 특약 적용',
      icon: <TrendingUp className="w-4 h-4 text-sky-600" />
    },
  ];

  // 조건 분기 — selectedCategory 기반 단일 진입점 (!!analysis.xxx 폴백 없음)
  let comparisonRows = standardRows;
  if (isCancer) {
    comparisonRows = cancerRows;
  } else if (isChild) {
    comparisonRows = isPreFamily 
      ? preFamilyRows 
      : (childInfo.targetAgeGroup === 'prenatal' ? prenatalRows : childInfo.targetAgeGroup === 'youth' ? youthRows : childRows);
  } else if (isDental) {
    comparisonRows = dentalRows;
  } else if (isSilbi) {
    comparisonRows = silbiRows;
  } else if (isDementia) {
    comparisonRows = dementiaRows;
  } else if (isGeneralCaregiving) {
    comparisonRows = caregivingRows;
  } else if (isNursing) {
    comparisonRows = nursingRows;
  } else if (isBrain) {
    comparisonRows = brainRows;
  } else if (isHeart) {
    comparisonRows = heartRows;
  } else if (isCar) {
    comparisonRows = carRows;
  } else if (isDriver) {
    comparisonRows = driverRows;
  } else if (isPet) {
    comparisonRows = petRows;
  } else if (isGolf) {
    comparisonRows = golfRows;
  } else if (isFire) {
    comparisonRows = fireRows;
  } else if (isProperty) {
    comparisonRows = propertyRows;
  } else if (isAnnuity) {
    comparisonRows = annuityRows;
  } else if (isWholeLife) {
    comparisonRows = wholeLifeRows;
  } else if (isVariable) {
    comparisonRows = variableRows;
  } else if (isLegal) {
    comparisonRows = legalRows;
  } else if (isSavingsGeneral) {
    comparisonRows = savingsRows;
  } else if (isCredit) {
    comparisonRows = creditRows;
  } else if (isAccident) {
    comparisonRows = accidentRows;
  } else if (isHealthGeneral) {
    comparisonRows = healthGeneralRows;
  } else if (isPreExisting) {
    comparisonRows = preExistingRows;
  } else if (isSurgeryHospital) {
    comparisonRows = surgeryHospitalRows;
  }




  const getDisclosureDate = () => {
    let key: keyof typeof disclosureDates = 'updated_at';
    if (isChild) key = 'child';
    else if (isCancer) key = 'cancer';
    else if (isHealthGeneral) key = 'health_general';
    else if (isFire) key = 'fire';
    else if (isDementia) key = 'dementia';
    else if (isGeneralCaregiving) key = 'caregiving';
    else if (isNursing) key = 'nursing';
    else if (isBrain) key = 'brain';
    else if (isHeart) key = 'heart';
    else if (isDriver) key = 'driver';
    else if (isPet) key = 'pet';
    else if (isGolf) key = 'golf';
    else if (isProperty) key = 'property';
    else if (isAnnuity) key = 'annuity';
    else if (isWholeLife) key = 'whole_life';
    else if (isVariable) key = 'variable';
    else if (isLegal) key = 'legal';
    else if (isSavingsGeneral) key = 'savings_general';
    else if (isCredit) key = 'credit';
    else if (isAccident) key = 'accident';
    else if (isSurgeryHospital) key = 'surgery_hospital';
    else if (isDental) key = 'dental';
    else if (isSilbi) key = 'silson';
    else if (isCar) key = 'car';
    
    return disclosureDates[key] || '2026년 06월 공시';
  };

  return (
    <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 transform">
        <ShieldCheck className="w-64 h-64 text-orange-500" />
      </div>

      <div className="relative z-10 flex flex-col gap-12">
        <div className={`flex ${forceMobile ? 'flex-col items-start' : 'flex-col md:flex-row md:items-end'} justify-between gap-6`}>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">1:1 상세 비교 분석</h3>
            <p className="text-gray-500 font-bold italic">"가격은 낮추고, 보장은 더 든든하게!"</p>
          </div>
          
          <div className="inline-block bg-blue-50 px-8 py-5 rounded-3xl border border-blue-100 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-default">
             <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{isCar ? '연 예상 절감액' : '월 예상 절감액'}</div>
             <div className="flex items-baseline gap-1">
               <span className="text-4xl font-black text-blue-600">{Math.round(isCar ? displaySavings * 12 : displaySavings).toLocaleString()}</span>
               <span className="text-xl font-bold text-gray-900">원</span>
               <TrendingDown className="w-6 h-6 text-blue-500 ml-2 animate-bounce" />
             </div>
          </div>
        </div>

        {isGolf && analysis.golf?.gameType === 'professional' && (
          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100/70 flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-xs font-black text-amber-800">프로 골퍼 요금제 가격 안내</p>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed mt-1">
                프로/지도자 자격은 라운딩 빈도가 아주 높고 사고 확률이 높은 초고위험군에 해당하여, 보험사 규정 상 <span className="text-rose-600 font-black">홀인원 축하비용 및 골프용품 손해 특약 가입이 면책(제외)</span>됩니다. 이에 따라 아마추어 회원에게 추가로 부과되는 특약 비용(총 7,000원 상당)이 모두 제외되고 순수 상해 보장 위주로 가입되어 보험료가 매우 실속 있게 산정되었습니다.
              </p>
            </div>
          </div>
        )}

        <div className={`${forceMobile ? 'hidden' : 'hidden sm:grid'} grid-cols-12 gap-1 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1`}>
           <div className="col-span-4">보장 항목</div>
           <div className="col-span-4 text-center">기존 보험 유지 시 (Stay)</div>
           <div className="col-span-4 text-right">교체 제안 (Switch)</div>
        </div>

        <div className="space-y-4">
          {comparisonRows.map((row, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`flex flex-col ${forceMobile ? '' : 'sm:grid sm:grid-cols-12'} gap-4 sm:gap-2 items-start ${forceMobile ? '' : 'sm:items-center'} p-5 sm:p-6 rounded-[2rem] transition-all border ${
                i % 2 === 0 ? 'bg-gray-50/30 border-gray-100/50' : 'bg-white border-transparent'
              } hover:bg-orange-50/50 hover:shadow-xl hover:border-orange-100 group`}
            >
              <div className={`w-full ${forceMobile ? '' : 'sm:col-span-4'} flex items-center gap-3 sm:gap-4`}>
                 <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 transition-transform group-hover:rotate-12 group-hover:scale-110">
                   {row.icon}
                 </div>
                 <span className="text-sm font-black text-gray-900 break-keep">{row.label}</span>
              </div>
              
              <div className={`w-full flex flex-col ${forceMobile ? '' : 'sm:grid sm:col-span-8 sm:grid-cols-8'} gap-3 sm:gap-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100/30 ${forceMobile ? '' : 'sm:border-t-0'}`}>
                <div className={`w-full ${forceMobile ? 'text-left' : 'sm:col-span-4 sm:text-center'} flex flex-col ${forceMobile ? '' : 'sm:block'} gap-1`}>
                  <span className={`text-[9px] font-black text-gray-400 ${forceMobile ? '' : 'sm:hidden'}`}>기존 (Stay)</span>
                  <span className="font-black text-gray-400 sm:text-gray-300 text-xs sm:text-lg break-keep">{row.current}</span>
                </div>
                <div className={`w-full ${forceMobile ? 'text-left' : 'sm:col-span-4 sm:text-right'} flex flex-col ${forceMobile ? '' : 'sm:block'} gap-1 mt-2 sm:mt-0`}>
                  <span className={`text-[9px] font-black text-blue-500 ${forceMobile ? '' : 'sm:hidden'}`}>제안 (Switch)</span>
                  <span className="bg-slate-900 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl font-black text-xs sm:text-sm md:text-base lg:text-lg shadow-lg inline-block transform transition-all group-hover:-translate-x-2 break-keep">
                    {row.recommended}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8 border-t border-gray-50 mt-10">
          <p className="text-[10px] font-black text-gray-400 italic tracking-widest uppercase text-center">
            {isCar 
              ? `최적화 분석 완료: 매년 ${Math.round(displaySavings * 12).toLocaleString()}원을 자산으로 전환할 수 있습니다.`
              : `최적화 분석 완료: 매달 ${displaySavings.toLocaleString()}원을 자산으로 전환할 수 있습니다.`
            }
          </p>
        </div>

      </div>
    </div>
  );
};

export default ComparisonTable;
