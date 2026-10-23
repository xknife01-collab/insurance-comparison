import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingDown, TrendingUp, ShieldCheck, HeartPulse, Brain, Heart, Stethoscope, Clock, Scale, Dog, Cat, Coins, Calendar, PiggyBank, CheckCircle } from 'lucide-react';
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

  let category = analysis.selectedCategory ?? '';
  if (category === 'remodeling' && (analysis as any)._remodelingCoverage?.policies?.length > 0) {
    const policies = (analysis as any)._remodelingCoverage.policies;
    const typeCounts: Record<string, number> = {};
    for (const p of policies) {
      const name = p.product_name || '';
      let type = 'health';
      if (/의료실비|실손|실비/i.test(name)) type = '실손';
      else if (/치아|치과|덴탈|크라운|임플란트/i.test(name)) type = '치아';
      else if (/유병자|간편고지|3\.2\.5|3\.3\.5|3\.5\.5/i.test(name)) type = '유병자';
      else if (/수술\/입원|수술비|입원비|입원일당|수술입원/i.test(name)) type = '수술/입원';
      else if (/암보험|암진단|3대질환/i.test(name)) type = '암';
      else if (/어린이|신생아|자녀|태아/i.test(name)) type = '어린이';
      else if (/뇌혈관|뇌졸중|뇌출혈|뇌질환/i.test(name)) type = '뇌혈관';
      else if (/심장질환|허혈성|심근경색|심혈관|심장/i.test(name)) type = '심장';
      else if (/상해/i.test(name)) type = '상해';
      else if (/간병인|간병지원|간병사용|간병\s*보험/i.test(name)) type = '간병';
      else if (/치매/i.test(name)) type = '치매';
      else if (/재가\/시설|재가|시설급여|요양/i.test(name)) type = '재가/시설';
      else if (/자동차/i.test(name)) type = '자동차';
      else if (/운전자/i.test(name)) type = '운전자';
      else if (/펫|pet|반려동물|반려견|반려묘|강아지|애견|고양이|반려/i.test(name)) type = '펫';
      else if (/골프|레저/i.test(name)) type = '골프';
      else if (/주택화재|화재|풍수해/i.test(name)) type = '화재';
      else if (/재물/i.test(name)) type = '재물';
      else if (/연금|annuity/i.test(name)) type = '연금';
      else if (/종신|whole/i.test(name)) type = '종신';
      else if (/변액|정기/i.test(name)) type = '변액';
      else if (/민사\/형사|법률|소송/i.test(name)) type = '법률';
      else if (/저축|savings/i.test(name)) type = '일반 저축';
      else if (/신용/i.test(name)) type = '신용';
      
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    }
    
    let primaryType = 'health';
    let maxCount = 0;
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        primaryType = type;
      }
    }
    if (primaryType !== 'health') {
      category = primaryType;
    }
  }
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

  // 1. 치아보험
  const dentalRows = [
    { 
      label: '임플란트 보장 한도', 
      current: analysis.dental?.implantLimit === 'unlimited' ? '연간 개수 제한 없음' : (analysis.dental?.implantLimit ? `연간 ${analysis.dental.implantLimit}개 (치아당)` : '연간 3개 (치아당)'), 
      recommended: '연간 개수 제한 없음 (가입 2년 경과 시, 치아당 보장)', 
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '크라운 보장 금액', 
      current: `치아당 ${formatAmt(analysis.dental?.crownAmount || 200000)}`, 
      recommended: '치아당 최대 50만 원 (상품별 연간 한도 기준 준수)', 
      icon: <TrendingUp className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '레진/인레이 보장', 
      current: `치아당 ${formatAmt(analysis.dental?.inlayAmount || 100000)}`, 
      recommended: '치아당 최대 15만 원 (연간 개수 제한 없음)', 
      icon: <HeartPulse className="w-4 h-4 text-purple-600" /> 
    },
  ];

  // 2. 실손의료비 전용 비교행 (고객 선택값 1:1 연동)
  const silsonInfo = (analysis as any).silson || {};
  const silsonCurrentStatus = silsonInfo.hasCurrent === 'no' 
    ? '미보유 (신규 가입 희망)' 
    : silsonInfo.hasCurrent === 'yes'
    ? '기존 실손 보유 (전환 검토)'
    : '기본 설계 기준';

  const usageLabel = 
    silsonInfo.nonReimbursableUsage === 'none' ? '없음 (할인 대상)' :
    silsonInfo.nonReimbursableUsage === 'under100' ? '100만원 미만 (기본 유지)' :
    silsonInfo.nonReimbursableUsage === '100to150' ? '100~150만원 (할증 1단계)' :
    silsonInfo.nonReimbursableUsage === '150to300' ? '150~300만원 (할증 2단계)' :
    silsonInfo.nonReimbursableUsage === 'over300' ? '300만원 이상 (할증 3단계)' :
    '연간 비급여 의료이용량 기준';

  const silbiRows = [
    { 
      label: '실손 가입 구분 및 세대', 
      current: silsonCurrentStatus, 
      recommended: `${silsonInfo.subType || '4세대 실손'} (급여 20% / 비급여 30% 본인부담)`, 
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '비급여 특약 할인·할증 구간', 
      current: usageLabel, 
      recommended: '직전 1년 비급여 지급액 연동 차등 적용 (비급여 미이용 시 할인 검토)', 
      icon: <TrendingUp className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '3대 비급여 특약 보장한도', 
      current: '법정 표준 보장 기준', 
      recommended: '도수·체외충격파(최대 350만/50회), 주사제(최대 250만/50회), MRI(최대 300만)', 
      icon: <HeartPulse className="w-4 h-4 text-blue-600" /> 
    },
  ];

  // 3. 치매보험
  const demDiag = analysis.caregiving?.dementiaDiagnosis || 10000000;
  const demAllowance = analysis.caregiving?.monthlyAllowance || 500000;
  const dementiaRows = [
    { 
      label: '경도 치매 진단금 (CDR 1점)', 
      current: formatAmt(demDiag), 
      recommended: '최대 1,000만 원 (초기 발견 시 즉각 치료비 확보)', 
      icon: <Brain className="w-4 h-4 text-rose-600" /> 
    },
    { 
      label: '중등도 치매 진단금 (CDR 2점)', 
      current: formatAmt(demDiag * 2), 
      recommended: '최대 2,000만 원 (간병 인프라 조기 세팅 자금)', 
      icon: <Brain className="w-4 h-4 text-rose-600" /> 
    },
    { 
      label: '중증 치매 생활비 (CDR 3점)', 
      current: `매월 ${formatAmt(demAllowance)}`, 
      recommended: '매월 100만 원 평생 지급 (종신 보장으로 가족 간병 부담 해소)', 
      icon: <Clock className="w-4 h-4 text-rose-600" /> 
    },
  ];

  // 4. 일반 간병보험
  const careOpts = analysis.caregiving || {};
  const isCareSupport = careOpts.type === 'support' || (analysis as any).careType === 'support';
  const isCareStepUp = careOpts.isStepUp ?? (analysis as any).isStepUp ?? false;
  const isCareNursing = careOpts.isNursingHospital ?? (analysis as any).isNursingHospital ?? false;

  const caregivingRows = [
    { 
      label: '간병 서비스 매칭 방식', 
      current: isCareSupport ? '보험사 직접 파견 (지원형)' : '현금 일당 지급 (사용형)', 
      recommended: isCareSupport ? '보험사 파견 (간병인 구인 부담 해소)' : '사용일당형 (자율적 간병인 선택 및 영수증 청구)', 
      icon: <Stethoscope className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '인건비 상승 대비 체증형', 
      current: isCareStepUp ? '체증형 가입 (매년 증액)' : '일반 고정형', 
      recommended: isCareStepUp ? '체증형 유지 (물가 및 인건비 상승 방어)' : '체증형 검토 (장기 입원 시 간병비 실질 가치 보전)', 
      icon: <TrendingUp className="w-4 h-4 text-purple-600" /> 
    },
    { 
      label: '요양병원 간병비 보장', 
      current: isCareNursing ? '강화 가입' : '기본형', 
      recommended: isCareNursing ? '강화 유지 (장기 요양 시 본인부담 완화)' : '강화 검토 (노인 장기 요양 입원 대비)', 
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" /> 
    },
  ];

  // 5. 재가/시설 (장기요양)
  const nursingOpts = analysis.nursing || {};
  const nHomeAmt = nursingOpts.homeAmount || 500000;
  const nFacilityAmt = nursingOpts.facilityAmount || 500000;
  const nPref = nursingOpts.preferredService || 'both';

  const nursingRows = [
    { 
      label: '재가급여 지원 한도 (장기요양 1~5등급)', 
      current: nPref === 'facility' ? '미선택' : `매월 ${formatAmt(nHomeAmt)}`, 
      recommended: '매월 최대 100만 원 (방문요양/방문목욕 서비스 국가지원 외 추가 지원)', 
      icon: <ShieldCheck className="w-4 h-4 text-teal-600" /> 
    },
    { 
      label: '시설급여 지원 한도 (요양원/실버타운)', 
      current: nPref === 'home' ? '미선택' : `매월 ${formatAmt(nFacilityAmt)}`, 
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
      recommended: '자동차상해 (치료비+위자료+휴업손해 보장)', 
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
      label: '대인 벌금 (민식이법 법정 최대 벌금)', 
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
  const isChildSick = category === 'child_sick' || category.includes('유병력자') || (category.includes('어린이') && category.includes('유병')) || category === 'pre_family';
  const isPreFamily = (category.includes('태아') || !!analysis.child?.isPreFamily) && !isChildSick;

  const childSickRows = [
    { 
      label: '성장기 주요 질병 진단비', 
      current: '간편고지 심사 기준', 
      recommended: '소아 다빈도 만성질환 및 3대 질병 중심 정액 보장', 
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '입원일당 및 수술비 보장', 
      current: '회사별 인수 심사 매칭', 
      recommended: '성장기 치료 빈도가 높은 소아 수술 및 입원비 집중 보강', 
      icon: <HeartPulse className="w-4 h-4 text-blue-600" /> 
    },
    { 
      label: '간편심사 및 무사고 전환', 
      current: '3-N-5 간편고지 플랜', 
      recommended: '무사고 기간 경과 시 일반 표준체 전환 및 보험료 인하 옵션', 
      icon: <CheckCircle className="w-4 h-4 text-blue-600" /> 
    },
  ];

  const preFamilyRows = [
    { 
      label: '산모 임신질환 수술/입원비', 
      current: '미가입 시 본인 부담', 
      recommended: '임신성 고혈압/당뇨 및 조기진통 집중 방어', 
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '태아 선천이상 수술비', 
      current: '미가입 시 본인 부담', 
      recommended: '최대 500만 원 (혀유착증, 다지증 등 신생아 주요 수술 케어)', 
      icon: <HeartPulse className="w-4 h-4 text-emerald-600" /> 
    },
  ];

  const prenatalRows = [
    { 
      label: '저체중아/신생아 입원일당', 
      current: '미가입 시 본인 부담', 
      recommended: '2.5kg 미만 출생 시 인큐베이터 비용 매칭 지원', 
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '선천이상 수술비 (혀유착 등)', 
      current: '미가입 시 본인 부담', 
      recommended: '1회당 최대 500만 원 (다지증, 선천성 모반 등 주요 이상 보장)', 
      icon: <HeartPulse className="w-4 h-4 text-emerald-600" /> 
    },
  ];

  const youthRows = [
    { 
      label: 'ADHD / 소아 우울증 진단비', 
      current: '없음', 
      recommended: '진단 시 최초 1회 최대 300만 원 지급', 
      icon: <Brain className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '독감(인플루엔자) 치료비', 
      current: '없음', 
      recommended: '타미플루 처방 시 연간 1회 10만 원 실손 정액 보장', 
      icon: <Stethoscope className="w-4 h-4 text-emerald-600" /> 
    },
  ];

  const childOpts = analysis.child || {};
  const childMaturity = childOpts.maturity || 30;
  const childFocus = childOpts.focusArea || 'majorDisease';

  const childRows = [
    { 
      label: '보장 만기 및 설계 유형', 
      current: childMaturity === 100 ? '100세 만기 (평생 안심형)' : '30세 만기 (가성비 실속형)', 
      recommended: childMaturity === 100 
        ? '100세 비갱신 유지 (평생 동안 동일한 보험료로 3대 질병 보장)' 
        : '30세 만기 + 계약전환권 (성장기 알뜰 보장 후 성인보험 무심사 전환)', 
      icon: <Calendar className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '중점 보장 영역', 
      current: childFocus === 'majorDisease' ? '3대 질환 (암·뇌·심) 집중' : '입원일당 & 수술비 강화', 
      recommended: childFocus === 'majorDisease' 
        ? '소아암·뇌혈관·허혈성심장 진단비 극대화 (성장기 중대 질환 집중 보강)' 
        : '잦은 독감/폐렴 입원 및 성장기 생활 안전사고 수술비 집중 대비', 
      icon: <HeartPulse className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      label: '3대 진단비 (암·뇌·심장)', 
      current: formatAmt(30000000), 
      recommended: '최대 5,000만 원 (성인기까지 이어지는 든든한 3대 치료 자금 확보)', 
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
      recommended: '최대 5,000만 원 (부작용 적은 정밀 표적항암제 처방비 실손 지원)',
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
      recommended: '비갱신형 (납입기간 동안 보험료가 고정되어 장기 유지 시 유리)',
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
      recommended: fireOpts.occupancyType === 'owner' ? '대물 20억 / 대인 1.5억 최대 한도 설정' : '임차자 배상책임 1억 든든하게 설정', 
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
      recommended: wholeLifeOpts.refundType === 'low' ? '저해지/무해지형 (완납 후 높은 환급금 확보)' : '일반형 (중도 해지 페널티 최소화 구조)', 
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
      recommended: varOpts.paymentPeriod >= 10 ? '10년 유지 시 이자소득세 비과세 요건 만족' : '10년 비과세 최적 조건 충족 설계',
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
      current: '단리 이자 (원금에만 이자가 붙는 일반 단리 방식)',
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
      current: '시중 변동 금리 (시장 금리 변동에 따른 이율 연동)',
      recommended: '최저보증이율 적용 (금리 하락 시에도 약관상 최저 이율 보장)',
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
      recommended: `대출금 ${formatAmt(creditLoanAmount)} 대위변제 지원 (채무 상환)`,
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
      label: '상해후유장해 (3% 이상)', 
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
      recommended: accidentOpts.hasLeisureRider 
        ? '유지 (등산, 골프, 자전거 등 야외 취미 활동 리스크 집중 대비)' 
        : '선택 권장 (야외 취미 활동 빈도에 따른 선별적 대비)', 
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
      recommended: '가입 (부작용 적은 정밀 표적항암제 처방비 연간 최대 5,000만 원)',
      icon: <HeartPulse className="w-4 h-4 text-violet-600" />
    },
    {
      label: '납입/갱신 구조',
      current: hg?.isRenewable ? '갱신형 (갱신 시점 보험료 연동)' : '비갱신형',
      recommended: `비갱신형 ${hg?.paymentPeriod ? hg.paymentPeriod + '년납' : '20년납'} (납입기간 동안 보험료가 고정되어 장기 유지 시 유리)`,
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
    '3.0.5': '3개월 고지 (초경증)',
    '3.2.5': '2년 무사고 (일반 간편)',
    '3.3.5': '3년 무사고 (실속 간편)',
    '3.5.5': '5년 무사고 (우대 간편)',
  };
  const currentPreExType = analysis.preExistingType || '3.2.5';
  const preExistingRows = [
    {
      label: '고지의무 기간 (현재 유형)',
      current: preExistingTypeLabel[currentPreExType] || '간편고지 심사형',
      recommended: '3개월 고지형 전환 가능 여부 검토 (병력 기준 완화 시 인수 조건 재확인)',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />
    },
    {
      label: '표준체 대비 보험료 할증',
      current: '고지 유형별 인수 심사 기준 상이',
      recommended: '할증 최소화 플랜 (동일 보장 유지하면서 보험사별 인수 조건 비교)',
      icon: <TrendingDown className="w-4 h-4 text-amber-600" />
    },
    {
      label: '3대 질병 수술·입원 보장',
      current: '기본 가입 한도',
      recommended: '유병자 전용 수술·입원 한도 내 최적 구성 (반복 지급형)',
      icon: <HeartPulse className="w-4 h-4 text-amber-600" />
    },
    {
      label: '뇌혈관 + 심장 진단비',
      current: formatAmt(analysis.cerebrovascular?.currentAmount ?? 5000000),
      recommended: '각 최대 1,000만 ~ 2,000만 원 (유병자 전용 한도 내 최적 설계)',
      icon: <Brain className="w-4 h-4 text-amber-600" />
    },
  ];

  // 18. 수술/입원보험 전용 비교행 (고객 실제 선택 옵션 1:1 연동)
  const surgOpts = (analysis as any).surgery_hospital || {};
  const surgFocusLabel = 
    surgOpts.focus === 'named' ? '1~5종 정밀 요율형' :
    surgOpts.focus === 'major' ? '중증 질환 집중형' : '광범위 질병/상해형';
  const hospitalAmtLabel = surgOpts.hospitalAmount 
    ? `${Number(surgOpts.hospitalAmount).toLocaleString()}원` 
    : '기본 설계 기준';
  const caregiverLabel = 
    surgOpts.caregiverOption === 'support' ? '지원 일당형' :
    surgOpts.caregiverOption === 'use' ? '사용 일당형' : '선택 안함';
  const tertiaryLabel = surgOpts.tertiaryHospital ? '상급종합병원 특약 적용' : '일반 병원 기준';

  const surgeryHospitalRows = [
    {
      label: '수술비 보장 스타일',
      current: surgFocusLabel,
      recommended: surgOpts.focus === 'named' 
        ? '1~5종 수술 난이도별 차등 고액 보장 (수술 부위별 정밀 대비)' 
        : surgOpts.focus === 'major'
        ? '암·뇌·심 등 3대 중증 수술 집중 보장'
        : '질병·상해 전반을 폭넓게 커버하는 다빈도 수술 보장',
      icon: <Stethoscope className="w-4 h-4 text-sky-600" />
    },
    {
      label: '1일당 입원비 보장',
      current: hospitalAmtLabel,
      recommended: surgOpts.hospitalAmount && surgOpts.hospitalAmount > 0
        ? `하루 ${Number(surgOpts.hospitalAmount).toLocaleString()}원 (입원 1일차부터 정액 보장)`
        : '기본 입원 치료비 기준 설계',
      icon: <ShieldCheck className="w-4 h-4 text-sky-600" />
    },
    {
      label: '간병인 서비스 옵션',
      current: caregiverLabel,
      recommended: surgOpts.caregiverOption && surgOpts.caregiverOption !== 'none'
        ? `${caregiverLabel} (간병 발생 시 실질 비용 부담 완화)`
        : '필요 시 간병인 일당 연계 검토',
      icon: <HeartPulse className="w-4 h-4 text-sky-600" />
    },
    {
      label: '상급종합병원 집중 보장',
      current: tertiaryLabel,
      recommended: surgOpts.tertiaryHospital 
        ? '3차 상급 종합병원 입원 시 추가 일당 보전' 
        : '대학병원·종합병원 집중 치료 환경 고려 검토',
      icon: <TrendingUp className="w-4 h-4 text-sky-600" />
    },
  ];

  // 조건 분기 — selectedCategory 기반 단일 진입점 (!!analysis.xxx 폴백 없음)
  let comparisonRows = standardRows;
  if (isCancer) {
    comparisonRows = cancerRows;
  } else if (isChild) {
    comparisonRows = isChildSick
      ? childSickRows
      : (isPreFamily 
          ? preFamilyRows 
          : (childInfo.targetAgeGroup === 'prenatal' ? prenatalRows : childInfo.targetAgeGroup === 'youth' ? youthRows : childRows));
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

        {isDental && (
          <div className="mt-2 px-2">
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 leading-relaxed break-keep">
              ※ 각 담보는 질병(충치·치주질환) 치료 시 면책기간 및 감액기간이 적용될 수 있으며, 보험사 및 가입 상품 플랜에 따라 연간 보장 한도와 세부 지급 기준이 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isPreExisting && (
          <div className="mt-2 px-2">
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 leading-relaxed break-keep">
              ※ 유병자(간편심사) 보험은 일반 표준체에 비해 가입 심사가 간소화된 반면, 보험료가 다소 높을 수 있으며 가입 한도가 일부 제한될 수 있습니다.
            </p>
          </div>
        )}

        {isSurgeryHospital && (
          <div className="mt-2 px-2">
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 leading-relaxed break-keep">
              ※ 수술비 및 입원비 특약은 동일 질병으로 인한 반복 수술 시 지급 제한 조건이나 면책 기간이 적용될 수 있으며, 가입 담보 및 보험사별 상품 약관에 따라 세부 지급 기준이 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isSilbi && (
          <div className="mt-2 px-2">
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 leading-relaxed break-keep">
              ※ 실손의료보험은 실제 발생한 치료비 한도 내에서 비례 보상되며(중복 보상 불가), 1년 단위 갱신형 상품으로 5년마다 재가입 주기가 도래합니다. 직전 1년간 비급여 의료 이용량에 따라 보험료 할인 또는 할증이 차등 적용될 수 있습니다.
            </p>
          </div>
        )}

        {isAccident && (
          <div className="mt-2 px-2">
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 leading-relaxed break-keep">
              ※ 상해보험은 피보험자의 직업·직무 위험도(직업급수) 및 운전 여부 변경 시 보험회사에 지체 없이 알려야 할 의무(통지의무)가 있으며, 이를 이행하지 않을 경우 보험금 지급이 제한되거나 계약이 해지될 수 있습니다. 세부 보장 범위 및 면책 사항은 해당 상품 약관을 참조하시기 바랍니다.
            </p>
          </div>
        )}

        {isGeneralCaregiving && (
          <div className="mt-2 px-2">
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 leading-relaxed break-keep">
              ※ 간병인 지원/사용일당 및 요양병원 관련 특약은 1회 입원당 또는 연간 최대 보장 일수(최대 180일 등)가 상품 약관에 따라 제한될 수 있으며, 간병인 파견 여건 및 의료기관 종별(일반병원 vs 요양병원)에 따라 1일당 지급 금액이 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isDementia && (
          <div className="mt-2 px-2">
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 leading-relaxed break-keep">
              ※ 치매보험은 전문의(신경과·정신건강의학과)에 의한 임상치매척도(CDR) 판정 및 뇌영상 검사(CT·MRI) 결과가 일치해야 진단비가 지급되며, 가입 후 일정 기간 이내 발병 시 감액 또는 면책 기간이 적용될 수 있습니다. 치매 발병 시 피보험자 본인의 보험금 청구가 어려울 수 있으므로 계약 체결 시 지정대리청구인을 사전 지정하시기 바랍니다.
            </p>
          </div>
        )}

        {isNursing && (
          <div className="mt-2 px-2">
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 leading-relaxed break-keep">
              ※ 재가·시설 요양보험은 국민건강보험공단 장기요양 등급 판정(1~5등급 및 인지지원등급)을 받아야 보장이 개시되며, 재가급여는 복지용구 및 방문요양·방문목욕 등의 실제 월 이용 내역이 충족되어야 지원금이 지급됩니다. 시설급여 시 요양원 등 입소 시설 종류에 따라 비급여 식재료비 등 본인부담금이 추가로 발생할 수 있습니다.
            </p>
          </div>
        )}

        {isChild && (
          <div className="mt-2 px-2">
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 leading-relaxed break-keep">
              ※ 어린이보험은 상법 제732조에 따라 만 15세 미만 피보험자의 사망 담보 가입이 금지되어 진단비·수술비 등 순수 치료비 중심으로 설계됩니다. 담보별 세부 지급 기준 및 면책 조건은 해당 상품 약관을 참조하시기 바라며, 30세 만기 플랜의 경우 만기 시점에 무심사로 계약을 연장할 수 있는 계약전환제도 지원 여부를 확인하시기 바랍니다.
            </p>
          </div>
        )}

        {isCar && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 담보에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 선택하지 않은 담보(자기차량손해 미가입, 자동차상해 미선택, 대물배상 기본한도 유지 등)는 사고 발생 시 해당 손해에 대해 보상받으실 수 없거나 보장 한도가 제한되며, 초과 손해액은 전액 본인 부담이 발생할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값(현대 그랜저 2024년식, 1인 한정, 3년 무사고, 연간 주행거리 등)을 적용하여 산출된 예상 보험료이므로 실제 청약 시 본인의 가입 조건, 사고 이력 및 할인특약 증빙 제출 여부에 따라 실제 납입 보험료와 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isDriver && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 담보에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 선택하지 않은 담보(경찰조사단계 변호사선임비용, 자동차사고부상치료비(자부상), 대물벌금 등)는 사고 발생 시 해당 손해에 대해 보상받으실 수 없거나 보장 한도가 제한되며, 초과 형사합의금 및 변호사 선임료는 전액 본인 부담이 발생할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값(자가용 운행, 상해 위험 1급 사무직, 40세 등)을 적용하여 산출된 예상 보험료이므로 실제 청약 시 본인의 실제 운전 목적(영업용/화물차 등) 및 직업 급수 변경에 따라 실제 납입 보험료와 가입 가능 담보가 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isPet && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 담보에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 선택하지 않은 선택 특약(슬개골/고관절 탈구, 피부 질환, 치과/구강 질환, 반려동물 배상책임 등)은 진료 및 사고 발생 시 보상 범위에서 제외되며 전액 본인 부담이 발생할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 품종 및 연령 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값을 적용하여 산출된 예상 보험료이므로 실제 청약 시 실제 품종, 연령, 동물등록 여부 및 과거 동물병원 진료 이력에 따라 인수 거절 또는 보험료가 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isGolf && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 담보에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 선택하지 않은 특약(골프용품 손해/도난, 홀인원 축하비용, 골프활동 중 배상책임 등)은 사고 발생 시 해당 손해에 대해 보상받으실 수 없으며 전액 본인 부담이 발생할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 경기 유형(일반 아마추어/프로·지도자) 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값(일반 아마추어 라운딩 기준)을 적용하여 산출된 예상 보험료이므로 실제 프로 골퍼나 레슨 지도자 자격 여부에 따라 일부 특약 가입이 제한되거나 보험료가 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isFire && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 담보에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 선택하지 않은 선택 특약(가족일상생활배상책임/누수 손해, 가재도구 손해, 화재 대물배상 초과분, 임시거주비 등)은 화재 및 누수 사고 발생 시 보상 범위에서 제외되며 전액 본인 부담이 발생할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 주거 유형, 건물 구조 및 전용 면적 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값(표준 아파트, 철근콘크리트 구조)을 적용하여 산출된 예상 보험료이므로 실제 단독주택, 목조/조적조 건물 구조 또는 실제 전용 면적에 따라 인수 제한이나 실제 납입 보험료가 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isProperty && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 담보에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 선택하지 않은 선택 특약(점포 휴업손해, 시설소유관리자 배상책임, 가스사고 배상책임, 음식물 배상책임 등)은 화재, 재난 및 영업장 내 안전사고 발생 시 보상 범위에서 제외되며 영업 중단 손실과 피해 배상액은 전액 사업자 본인 부담이 발생할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 영위 업종, 다중이용업소 해당 여부 및 사업장 전용 면적 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값(표준 일반 사무실/도소매 업종)을 적용하여 산출된 예상 보험료이므로 실제 고위험 업종(일반음식점, 유흥주점, 제조업 등) 여부 및 건축물 급수에 따라 법적 의무 가입 요건, 가입 한도 또는 실제 납입 보험료가 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isAnnuity && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 옵션에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 선택하지 않은 수령 옵션(종신연금형 미선택, 조기 사망 시 유족 연금 특약 등)은 지정 수령 기간 종료 시점 이후 노후 연금 지급이 중단되거나 조기 사망 시 지속적인 유족 연금 혜택이 제한될 수 있습니다. 또한, 중도 해지 시에는 세액공제 받은 원금 및 이자에 대해 기타소득세가 부과되는 등 세제상 불이익이 발생할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 총급여(소득 수준), 타 금융기관 IRP/연금저축 기납입액 및 희망 연금 개시 연령 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값을 적용하여 산출된 예상 절세액 및 연금 수령액이므로 실제 소득 구간에 따른 세액공제율 차이, 연간 공제 한도 초과 여부 및 향후 공시이율 변동에 따라 실제 절세액과 연금 수령액이 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isWholeLife && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 담보에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              종신보험은 주계약상 피보험자의 사망을 보장하는 상품으로, 고객이 선택하지 않은 선택 특약(3대 질병 납입면제, 암/뇌/심장 진단비, 수술/입원비 등)은 질병 및 상해 사고 발생 시 보상 범위에서 제외되며 전액 본인 부담이 발생할 수 있습니다. 또한 체증형 사망 특약 미선택 시 물가 상승에 따른 사망보험금의 실질 가치가 하락할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 직업 위험 등급, 건강 고지 사항(표준체/간편고지) 및 흡연 여부 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값(표준체 1급 사무직, 일반 표준체 요율)을 적용하여 산출된 예상 보험료이므로 실제 청약 시 과거 병력에 따른 할증/인수 거절, 비흡연체 할인특약 증빙 제출 여부에 따라 실제 납입 보험료와 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isVariable && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 담보 및 옵션에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              정기보험은 약정한 보장 만기 도래 시 사망보장 효력이 종료되며 종신 전환 옵션을 선택하지 않은 경우 만기 이후 사망에 대해서는 보험금이 지급되지 않습니다. 또한 변액보험의 경우 펀드 투자 실적에 따라 해약환급금의 원금 손실이 발생할 수 있으며 고객이 선택하지 않은 3대 질병 납입면제 및 건강 치료비 특약은 질병 발생 시 보상에서 제외되어 전액 본인 부담이 발생할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 직업 등급, 건강 상태(흡연 여부) 및 펀드 편입 비율 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값(표준체 1급 사무직, 기본 채권/주식 분산 포트폴리오)을 적용하여 산출된 예상 보험료이므로 실제 비흡연체 할인 증빙 제출 여부 및 금융시장 변동에 따라 실제 납입 보험료와 해약환급금이 상이할 수 있습니다.
            </p>
          </div>
        )}

        {isLegal && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-left">
            <p className="text-xs font-black text-slate-800">
              ※ [고객 미선택 담보에 대한 보장 제외 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              법률비용보험은 피보험자가 실제 지출한 소송비용을 대법원 규칙상 한도 및 약관 기준 내에서 실손 보상하는 상품으로, 고객이 선택하지 않은 선택 특약(형사사건 방어비용, 행정소송 특약, 항소심·상고심 심급 확장 등)은 해당 사건 발생 시 보상 범위에서 제외되며 변호사 선임료와 소송 인지·송달료 전액이 본인 부담으로 발생할 수 있습니다.
            </p>
            <p className="text-xs font-black text-slate-800 pt-2 border-t border-slate-200">
              ※ [고객 미제공 정보 및 간편플랜 산출 기준 안내]
            </p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed break-keep">
              고객이 직접 희망 소송 유형(민사 중심/형사 방어) 및 직업 정보를 입력하지 않거나 간편플랜으로 조회한 경우, 통계적 표준 기본값(민사소송 중심 플랜, 1심 본안 기준, 표준 자기부담금)을 적용하여 산출된 예상 보험료이므로 실제 청약 시 소송가액(소가)의 규모, 과거 소송 계류 이력 및 특약 확장에 따라 실제 납입 보험료와 가입 가능 담보가 상이할 수 있습니다.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ComparisonTable;
