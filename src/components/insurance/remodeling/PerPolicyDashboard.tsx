import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import RadarChart from '../../RadarChart';
import { maskCompany, maskProductName } from '../../../utils/compliance';

interface Rider { rider_name: string; coverage_amount: number; }
interface Policy {
  insurance_company: string;
  product_name: string;
  monthly_premium: number;
  riders: Rider[];
  isCustom?: boolean;
  isEstimated?: boolean;
}

// Supabase Loader에서 가져온 실시간 옵션 타입
export interface LiveOption {
  companyName: string;
  productName: string;
  premium: number;
  category?: string;
  features?: string;
  saving?: number;
  currentProduct?: string;
  currentCompany?: string;
}

interface Props {
  policies: Policy[];
  age: number;
  gender: 'M' | 'F';
  isUnlocked?: boolean;
  forceAllOpen?: boolean;
  allDietOptions?: LiveOption[];     // Supabase 실시간 다이어트 옵션
  allUpgradeOptions?: LiveOption[];  // Supabase 실시간 업그레이드 옵션
}

const COMPANIES = ['DB손해보험','KB손해보험','한화손해보험','현대해상','삼성화재','메리츠화재'];
function detectType(name: string) {
  if (/의료실비|실손|실비/i.test(name)) return 'silson';
  if (/치아|치과|덴탈|크라운|임플란트/i.test(name)) return 'dental';
  if (/유병자|간편고지|3\.2\.5|3\.3\.5|3\.5\.5/i.test(name)) return 'pre_existing';
  if (/수술\/입원|수술비|입원비|입원일당|수술입원/i.test(name)) return 'surgery_hospital';
  if (/암보험|암진단|3대질환/i.test(name)) return 'cancer';
  if (/어린이|신생아|자녀|태아/i.test(name)) return 'child';
  if (/뇌혈관|뇌졸중|뇌출혈|뇌질환/i.test(name)) return 'brain';
  if (/심장질환|허혈성|심근경색|심혈관|심장/i.test(name)) return 'heart';
  if (/상해/i.test(name)) return 'accident';
  if (/간병인|간병지원|간병사용|간병\s*보험/i.test(name)) return 'caregiving';
  if (/치매/i.test(name)) return 'dementia';
  if (/재가\/시설|재가|시설급여|요양/i.test(name)) return 'nursing';
  if (/자동차/i.test(name)) return 'car';
  if (/운전자/i.test(name)) return 'driver';
  if (/펫|pet|개|고양이|반려/i.test(name)) return 'pet';
  if (/골프|레저/i.test(name)) return 'golf';
  if (/주택화재|화재|풍수해/i.test(name)) return 'fire';
  if (/재물/i.test(name)) return 'property';
  if (/연금|annuity/i.test(name)) return 'annuity';
  if (/종신|whole/i.test(name)) return 'whole';
  if (/변액|정기/i.test(name)) return 'variable';
  if (/민사\/형사|법률|소송/i.test(name)) return 'legal';
  if (/저축|savings/i.test(name)) return 'savings';
  if (/신용/i.test(name)) return 'credit';
  return 'health'; // default to 종합건강보험
}

const typeLabel: Record<string,string> = { 
  silson: '의료실비',
  dental: '치아보험',
  pre_existing: '유병자보험',
  surgery_hospital: '수술/입원보험',
  cancer: '암보험',
  health: '종합건강보험',
  brain: '뇌혈관보험',
  heart: '심장질환보험',
  accident: '상해보험',
  caregiving: '간병 보험',
  dementia: '치매 간병보험',
  nursing: '재가/시설보험',
  child: '어린이/신생아보험',
  car: '자동차 보험',
  driver: '운전자 보험',
  pet: '펫 보험',
  golf: '골프 / 레저보험',
  fire: '주택화재보험',
  property: '재물종합보험',
  annuity: '연금저축보험',
  whole: '종신보험',
  variable: '변액, 정기보험',
  legal: '민사/형사보험',
  savings: '일반 저축보험',
  credit: '신용보험'
};

const typeColor: Record<string,string> = { 
  silson: 'bg-teal-500',
  dental: 'bg-blue-500',
  pre_existing: 'bg-amber-600',
  surgery_hospital: 'bg-sky-500',
  cancer: 'bg-rose-500',
  health: 'bg-orange-500',
  brain: 'bg-indigo-500',
  heart: 'bg-red-500',
  accident: 'bg-cyan-500',
  caregiving: 'bg-emerald-500',
  dementia: 'bg-purple-500',
  nursing: 'bg-teal-600',
  child: 'bg-yellow-500',
  car: 'bg-blue-600',
  driver: 'bg-indigo-600',
  pet: 'bg-pink-500',
  golf: 'bg-emerald-600',
  fire: 'bg-red-500',
  property: 'bg-amber-500',
  annuity: 'bg-blue-700',
  whole: 'bg-purple-700',
  variable: 'bg-indigo-700',
  legal: 'bg-slate-600',
  savings: 'bg-green-600',
  credit: 'bg-slate-700'
};

function extractAllCov(riders: Rider[]) {
  // 1. Silson (의료실비)
  let hasSilsonInjections = false;
  let hasSilsonCommon = false;

  // 2. Dental (치아)
  let dentalImplants = 0;
  let dentalBridge = 0;
  let dentalCrown = 0;
  let dentalConserve = 0;

  // 3. Pre Existing (유병자)
  let hasPreExDiscount = false;

  // 4. Surgery/Hospital (수술/입원)
  let surgery1to5Limit = 0;
  let hospitalDaily = 0;
  let hospitalICUDaily = 0;
  let hospitalGeneralDaily = 0;

  // 5. Cancer (암보험)
  let cancer = 0;
  let hasTargetedTherapy = false;
  let hasTreatmentCost2025 = false;
  let hasRecurrentCancer = false;
  let isRenewable = false;

  // 7. Brain (뇌혈관)
  let brainVascular = 0;
  let strokeAmount = 0;
  let brainSurgery = 0;

  // 8. Heart (심장)
  let ischemicHeart = 0;
  let infarctionAmount = 0;
  let heartSurgery = 0;

  // 9. Accident (상해)
  let accidentDeath = 0;
  let accidentDisability = 0;
  let accidentFracture = 0;
  let accidentSurgery = 0;
  let hasLeisureRider = false;

  // 10. Caregiving (간병)
  let hasCaregiverSupport = false;
  let caregiverDaily = 0;

  // 11. Dementia (치매)
  let dementiaMild = 0;
  let dementiaModerate = 0;
  let dementiaSevere = 0;
  let dementiaCaregiver = 0;
  let dementiaHome = 0;

  // 12. Nursing (재가/시설)
  let nursingHomeLimit = 0;
  let nursingFacilityLimit = 0;

  // 13. Child (어린이)
  let childAdhd = 0;
  let childFlu = 0;
  let child3Major = 0;

  // 14. Car (자동차)
  let carOwnDamage = 'none';
  let carDriverLimit = 'single';
  let carPropertyLimit = 0;
  let carInjuryType = 'jason';
  let carSafeScore = 0;

  // 15. Driver (운전자)
  let driverLiability = 0;
  let driverLawyer = 0;
  let driverFineDaein = 0;
  let driverFineDaemul = 0;
  let driverInjury = 0;

  // 16. Pet (펫)
  let petPatella = false;
  let petSkin = false;
  let petDental = false;
  let petLiability = 0;
  let petMedical = 0;

  // 17. Golf (골프)
  let golfHoleInOne = 0;
  let golfLiability = 0;
  let golfEquipment = 0;
  let golfGroup = false;

  // 18. Fire (주택화재)
  let fireBuilding = 0;
  let fireContents = 0;
  let fireWaterLeak = false;
  let fireLiability = 0;

  // 19. Property (재물종합)
  let propertyBuilding = 0;
  let propertyInterior = 0;
  let propertyWaterLeak = false;
  let propertyInterruption = false;
  let propertyLiability = 0;

  // 20. Annuity (연금저축)
  let annuityTaxRefund = false;
  let annuityPeriod = 10;
  let annuityAge = 60;
  let annuityIrp = false;

  // 21. Whole (종신)
  let wholeDeathBenefit = 0;
  let wholePeriod = 10;
  let wholeRefundType = 'normal';
  let wholeStepUp = false;

  // 22. Variable (변액)
  let variableDeath = 0;
  let variablePremium = 0;
  let variableDiscount = false;

  // 23. Legal (법률)
  let legalLawyer = 0;
  let legalCourtFee = 0;
  let legalSuddenAccel = false;
  let legalDeductible = 'percent';

  // 24. Savings (일반저축)
  let savingsTaxExempt = false;
  let savingsCompound = false;
  let savingsUniversal = false;

  // 25. Credit (신용)
  let creditDeath = false;
  let creditIllness = false;
  let creditDisability = false;

  for(const r of riders){
    const name = r.rider_name;
    const amt = r.coverage_amount;

    // Common / Health
    if (/암진단|일반암|소액암|고액암/.test(name)) cancer += amt;
    if (/뇌혈관|뇌졸중|뇌출혈/.test(name)) brainVascular += amt;
    if (/허혈성|심근경색|심장질환/.test(name)) ischemicHeart += amt;

    // 1. Silson
    if (/실손|실비|의료비/.test(name)) {
      hasSilsonCommon = true;
      if (/주사/.test(name)) hasSilsonInjections = true;
    }

    // 2. Dental
    if (/임플란트|보철/.test(name)) dentalImplants += amt;
    if (/브릿지/.test(name)) dentalBridge += amt;
    if (/크라운|금니/.test(name)) dentalCrown += amt;
    if (/보존|인레이|온레이|레진|충치/.test(name)) dentalConserve += amt;

    // 3. Pre Existing
    if (/유병자|고지/.test(name)) hasPreExDiscount = true;

    // 4. Surgery/Hospital
    if (/수술비|수술/.test(name)) {
      if (/1.*5종|종수술/.test(name)) surgery1to5Limit += amt;
      else surgery1to5Limit += amt;
    }
    if (/입원일당|입원비/.test(name)) {
      if (/중환자/.test(name)) hospitalICUDaily += amt;
      else if (/종합병원/.test(name)) hospitalGeneralDaily += amt;
      else hospitalDaily += amt;
    }

    // 5. Cancer Specific
    if (/표적/.test(name)) hasTargetedTherapy = true;
    if (/주요치료비|암치료비/.test(name)) hasTreatmentCost2025 = true;
    if (/재발암|재진단암|전이암/.test(name)) hasRecurrentCancer = true;
    if (/갱신형/.test(name)) isRenewable = true;

    // 7. Brain Specific
    if (/뇌혈관|뇌질환/.test(name)) brainVascular += amt;
    if (/뇌졸중|뇌출혈/.test(name)) strokeAmount += amt;
    if (/뇌.*수술/.test(name)) brainSurgery += amt;

    // 8. Heart Specific
    if (/허혈성|심장/.test(name)) ischemicHeart += amt;
    if (/심근경색/.test(name)) infarctionAmount += amt;
    if (/심장.*수술|스텐트/.test(name)) heartSurgery += amt;

    // 9. Accident
    if (/상해사망|재해사망/.test(name)) accidentDeath += amt;
    if (/후유장해|장해/.test(name)) accidentDisability += amt;
    if (/골절/.test(name)) accidentFracture += amt;
    if (/상해수술|상해입원/.test(name)) accidentSurgery += amt;
    if (/레저|스포츠|골프/.test(name)) hasLeisureRider = true;

    // 10. Caregiving
    if (/간병인.*지원|직접.*파견/.test(name)) hasCaregiverSupport = true;
    if (/간병인.*사용|간병.*사용|간병일당|간병비/.test(name)) caregiverDaily += amt;

    // 11. Dementia
    if (/경증치매|경도/.test(name)) dementiaMild += amt;
    if (/중등도/.test(name)) dementiaModerate += amt;
    if (/중증치매|중증/.test(name)) dementiaSevere += amt;
    if (/치매.*간병|간병.*치매|치매.*지원/.test(name)) dementiaCaregiver += amt;
    if (/치매.*재가|재가.*치매|치매.*요양|장기요양/.test(name)) dementiaHome += amt;

    // 12. Nursing
    if (/재가급여|재가/.test(name)) nursingHomeLimit += amt;
    if (/시설급여|시설/.test(name)) nursingFacilityLimit += amt;

    // 13. Child
    if (/ADHD|우울증/.test(name)) childAdhd += amt;
    if (/독감|인플루엔자/.test(name)) childFlu += amt;
    if (/3대|암.*뇌.*심/.test(name)) child3Major += amt;

    // 14. Car
    if (/자차|자기차량/.test(name)) {
      if (/단독사고.*제외/.test(name)) carOwnDamage = 'exclude_single';
      else carOwnDamage = 'join';
    }
    if (/부부/.test(name)) carDriverLimit = 'couple';
    else if (/가족/.test(name)) carDriverLimit = 'family';
    else if (/누구나/.test(name)) carDriverLimit = 'anyone';
    if (/대물/.test(name)) carPropertyLimit = amt;
    if (/자손|자기신체사고/.test(name)) carInjuryType = 'jason';
    else if (/자상|자동차상해/.test(name)) carInjuryType = 'jasang';
    if (/티맵|안전운전/.test(name)) carSafeScore = amt;

    // 15. Driver
    if (/교통사고처리지원금|형사합의/.test(name)) driverLiability += amt;
    if (/변호사/.test(name)) driverLawyer += amt;
    if (/대인.*벌금|벌금/.test(name)) driverFineDaein += amt;
    if (/대물.*벌금/.test(name)) driverFineDaemul += amt;
    if (/부상치료|자부상/.test(name)) driverInjury += amt;

    // 16. Pet
    if (/슬개골|고관절|탈구/.test(name)) petPatella = true;
    if (/피부|귓병|외이염|피부염/.test(name)) petSkin = true;
    if (/구강|스케일링|치과/.test(name)) petDental = true;
    if (/배상책임|배상/.test(name)) petLiability += amt;
    if (/통원|입원치료|수술비|의료비/.test(name)) petMedical += amt;

    // 17. Golf
    if (/홀인원/.test(name)) golfHoleInOne += amt;
    if (/골프.*배상/.test(name)) golfLiability += amt;
    if (/골프용품|용품|도난|파손/.test(name)) golfEquipment += amt;
    if (/동반|단체|그룹/.test(name)) golfGroup = true;

    // 18. Fire
    if (/건물/.test(name) && !/가재/.test(name)) fireBuilding += amt;
    if (/가재/.test(name)) fireContents += amt;
    if (/급배수|누출|누수/.test(name)) fireWaterLeak = true;
    if (/화재.*배상|대인.*배상|대물.*배상/.test(name)) fireLiability += amt;

    // 19. Property
    if (/건물/.test(name) && !/시설/.test(name)) propertyBuilding += amt;
    if (/시설|인테리어/.test(name)) propertyInterior += amt;
    if (/급배수|누출|누수/.test(name)) propertyWaterLeak = true;
    if (/휴업|영업중단/.test(name)) propertyInterruption = true;
    if (/화재배상|시설소유배상/.test(name)) propertyLiability += amt;

    // 20. Annuity
    if (/세액공제|공제/.test(name)) annuityTaxRefund = true;
    if (/IRP|퇴직/.test(name)) annuityIrp = true;

    // 21. Whole
    if (/사망보험금|주계약|기본사망/.test(name)) wholeDeathBenefit += amt;
    if (/무해지|저해지/.test(name)) wholeRefundType = 'low';
    if (/체증/.test(name)) wholeStepUp = true;

    // 22. Variable
    if (/사망보험금|사망/.test(name)) variableDeath += amt;
    if (/우량체|건강체/.test(name)) variableDiscount = true;

    // 23. Legal
    if (/변호사비용/.test(name)) legalLawyer += amt;
    if (/인지대|송달료/.test(name)) legalCourtFee += amt;
    if (/급발진/.test(name)) legalSuddenAccel = true;
    if (/비례/.test(name)) legalDeductible = 'percent';

    // 24. Savings
    if (/비과세/.test(name)) savingsTaxExempt = true;
    if (/복리/.test(name)) savingsCompound = true;
    if (/유니버셜|자유납입/.test(name)) savingsUniversal = true;

    // 25. Credit
    if (/사망상환/.test(name)) creditDeath = true;
    if (/질병상환/.test(name)) creditIllness = true;
    if (/장해상환/.test(name)) creditDisability = true;
  }

  return {
    cancer, brain: brainVascular, heart: ischemicHeart, caregiver: caregiverDaily, surgery: surgery1to5Limit, death: wholeDeathBenefit, silson: hasSilsonCommon,
    hasSilsonInjections, hasSilsonCommon,
    dentalImplants, dentalBridge, dentalCrown, dentalConserve,
    hasPreExDiscount,
    surgery1to5Limit, hospitalDaily, hospitalICUDaily, hospitalGeneralDaily,
    hasTargetedTherapy, hasTreatmentCost2025, hasRecurrentCancer, isRenewable,
    brainVascular, strokeAmount, brainSurgery,
    ischemicHeart, infarctionAmount, heartSurgery,
    accidentDeath, accidentDisability, accidentFracture, accidentSurgery, hasLeisureRider,
    hasCaregiverSupport, caregiverDaily,
    dementiaMild, dementiaModerate, dementiaSevere, dementiaCaregiver, dementiaHome,
    nursingHomeLimit, nursingFacilityLimit,
    childAdhd, childFlu, child3Major,
    carOwnDamage, carDriverLimit, carPropertyLimit, carInjuryType, carSafeScore,
    driverLiability, driverLawyer, driverFineDaein, driverFineDaemul, driverInjury,
    driverFine: driverFineDaein + driverFineDaemul,
    petPatella, petSkin, petDental, petLiability, petMedical,
    golfHoleInOne, golfLiability, golfEquipment, golfGroup,
    fireBuilding, fireContents, fireWaterLeak, fireLiability,
    propertyBuilding, propertyInterior, propertyWaterLeak, propertyInterruption, propertyLiability,
    annuityTaxRefund, annuityPeriod, annuityAge, annuityIrp,
    wholeDeathBenefit, wholePeriod, wholeRefundType, wholeStepUp,
    variableDeath, variablePremium, variableDiscount,
    legalLawyer, legalCourtFee, legalSuddenAccel, legalDeductible,
    savingsTaxExempt, savingsCompound, savingsUniversal,
    creditDeath, creditIllness, creditDisability
  };
}

function fmt(n: number) {
  if(n>=100000000) return `${(n/100000000).toFixed(0)}억원`;
  if(n>=10000) return `${(n/10000).toLocaleString()}만원`;
  return `${n.toLocaleString()}원`;
}

type Status = 'good'|'warn'|'bad'|'none';
function statusOf(val: number, good: number, warn: number): Status {
  if(val===0) return 'none';
  if(val>=good) return 'good';
  if(val>=warn) return 'warn';
  return 'bad';
}
const STATUS_STYLE: Record<Status,{bg:string,text:string,label:string,icon:string}> = {
  good:{bg:'bg-emerald-50',text:'text-emerald-600',label:'정상',icon:'✅'},
  warn:{bg:'bg-amber-50',text:'text-amber-600',label:'보강 권장',icon:'⚠️'},
  bad:{bg:'bg-red-50',text:'text-red-600',label:'부족',icon:'❌'},
  none:{bg:'bg-slate-50',text:'text-slate-400',label:'미가입',icon:'—'},
};

function CovRow({label,value,status,note}:{label:string;value:string;status:Status;note:string}) {
  const s=STATUS_STYLE[status];
  return (
    <div className="flex items-center justify-between py-3 px-5 border-b border-slate-100/70 last:border-0">
      <div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
        {status==='warn'||status==='bad'||status==='none' ? <span className="block text-[10px] text-slate-400 font-bold">{note}</span> : null}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-slate-800">{value}</span>
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${s.bg} ${s.text}`}>{s.icon} {s.label}</span>
      </div>
    </div>
  );
}

function findDups(policies: Policy[]): Set<number> {
  const dups=new Set<number>();
  for(let i=0;i<policies.length;i++){
    for(let j=i+1;j<policies.length;j++){
      const a=policies[i].product_name.replace(/\(보장종료 \d+\)/g,'').trim();
      const b=policies[j].product_name.replace(/\(보장종료 \d+\)/g,'').trim();
      if(a===b||(a.length>10&&(b.includes(a.slice(0,12))||a.includes(b.slice(0,12))))){
        dups.add(i);dups.add(j);
      }
    }
  }
  return dups;
}

function PolicyCard({policy,index,isDup,totalCount,isUnlocked,forceOpen,liveDietOptions,liveUpgradeOptions}:{policy:Policy;index:number;isDup:boolean;totalCount:number;isUnlocked?:boolean;forceOpen?:boolean;key?:any;liveDietOptions?:LiveOption[];liveUpgradeOptions?:LiveOption[]}) {
  const [openState,setOpenState]=useState(index === 0);
  const open = forceOpen ? true : openState;
  const setOpen = (val: boolean) => {
    if (!forceOpen) {
      setOpenState(val);
    }
  };
  const t=detectType(policy.product_name);
  const cov=extractAllCov(policy.riders);
  const p=policy.monthly_premium;

  // Radar Configurations for all 25 categories
  const radar = t==='silson' ? [
    {label:'급여실손',value:cov.hasSilsonCommon?90:20,target:75},
    {label:'비급여실손',value:cov.hasSilsonCommon?88:20,target:70},
    {label:'주사제실비',value:cov.hasSilsonInjections?92:20,target:75},
    {label:'가성비',value:p<=20000?95:75,target:70},
    {label:'본인부담',value:80,target:75},
    {label:'갱신주기',value:82,target:70},
  ] : t==='dental' ? [
    {label:'임플란트',value:cov.dentalImplants>=1000000?90:cov.dentalImplants>0?65:20,target:75},
    {label:'보존치료',value:cov.dentalConserve>=100000?88:cov.dentalConserve>0?60:25,target:70},
    {label:'크라운',value:cov.dentalCrown>=250000?90:cov.dentalCrown>0?60:20,target:70},
    {label:'납입면제',value:75,target:60},
    {label:'가성비',value:p<=30000?88:p<=50000?75:55,target:70},
    {label:'보장기간',value:80,target:75},
  ] : t==='pre_existing' ? [
    {label:'암진단비',value:cov.cancer>=30000000?90:cov.cancer>0?60:20,target:75},
    {label:'2대진단비',value:cov.brain>=10000000?88:cov.brain>0?55:20,target:70},
    {label:'수술비',value:cov.surgery1to5Limit>0?85:20,target:70},
    {label:'가성비',value:p<=60000?90:70,target:75},
    {label:'고지기간',value:80,target:70},
    {label:'할증률',value:cov.hasPreExDiscount?92:65,target:75},
  ] : t==='surgery_hospital' ? [
    {label:'1-5종수술',value:cov.surgery1to5Limit>=5000000?92:cov.surgery1to5Limit>0?70:20,target:75},
    {label:'질병입원',value:cov.hospitalDaily>=50000?90:cov.hospitalDaily>0?65:20,target:70},
    {label:'중환자실',value:cov.hospitalICUDaily>=100000?92:cov.hospitalICUDaily>0?60:20,target:75},
    {label:'상급입원',value:cov.hospitalGeneralDaily>0?88:20,target:70},
    {label:'가성비',value:p<=30000?92:75,target:70},
    {label:'보장한도',value:82,target:75},
  ] : t==='cancer' ? [
    {label:'일반암',value:cov.cancer>=50000000?95:cov.cancer>=30000000?80:20,target:75},
    {label:'표적항암',value:cov.hasTargetedTherapy?92:20,target:70},
    {label:'암치료비',value:cov.hasTreatmentCost2025?90:20,target:75},
    {label:'재발암',value:cov.hasRecurrentCancer?88:20,target:70},
    {label:'갱신구조',value:cov.isRenewable?55:92,target:75},
    {label:'가성비',value:p<=50000?90:75,target:70},
  ] : t==='brain' ? [
    {label:'뇌혈관진단',value:cov.brainVascular>=20000000?92:cov.brainVascular>0?70:20,target:75},
    {label:'뇌졸중진단',value:cov.strokeAmount>=30000000?90:cov.strokeAmount>0?65:20,target:70},
    {label:'뇌출혈진단',value:cov.strokeAmount>=30000000?90:20,target:65},
    {label:'뇌수술비',value:cov.brainSurgery>=10000000?92:cov.brainSurgery>0?68:20,target:70},
    {label:'가성비',value:p<=25000?92:75,target:70},
    {label:'보장한도',value:82,target:75},
  ] : t==='heart' ? [
    {label:'심장진단',value:cov.ischemicHeart>=20000000?92:cov.ischemicHeart>0?70:20,target:75},
    {label:'심근경색',value:cov.infarctionAmount>=30000000?90:cov.infarctionAmount>0?65:20,target:70},
    {label:'심장수술',value:cov.heartSurgery>=10000000?92:cov.heartSurgery>0?68:20,target:70},
    {label:'스텐트',value:cov.heartSurgery>=5000000?88:20,target:65},
    {label:'가성비',value:p<=25000?92:75,target:70},
    {label:'보장한도',value:82,target:75},
  ] : t==='accident' ? [
    {label:'상해사망',value:cov.accidentDeath>=150000000?92:cov.accidentDeath>0?68:20,target:75},
    {label:'골절진단',value:cov.accidentFracture>=500000?90:cov.accidentFracture>0?60:25,target:70},
    {label:'상해수술',value:cov.accidentSurgery>0?88:20,target:70},
    {label:'깁스치료',value:75,target:60},
    {label:'가성비',value:p<=20000?90:p<=40000?75:55,target:70},
    {label:'보장범위',value:cov.hasLeisureRider?90:65,target:75},
  ] : t==='caregiving' ? [
    {label:'간병인지원',value:cov.hasCaregiverSupport?95:20,target:75},
    {label:'간병비사용',value:cov.caregiverDaily>=150000?92:cov.caregiverDaily>0?70:20,target:70},
    {label:'요양병원',value:cov.caregiverDaily>=50000?88:20,target:65},
    {label:'가성비',value:p<=30000?90:75,target:70},
    {label:'일당한도',value:85,target:75},
    {label:'납입기간',value:82,target:70},
  ] : t==='dementia' ? [
    {label:'중증치매',value:cov.dementiaSevere>=20000000?92:cov.dementiaSevere>0?65:20,target:75},
    {label:'경증치매',value:cov.dementiaMild>=5000000?90:cov.dementiaMild>0?60:25,target:70},
    {label:'간병지원',value:cov.dementiaCaregiver>0?92:20,target:70},
    {label:'장기요양',value:cov.dementiaHome>0?88:20,target:70},
    {label:'가성비',value:p<=50000?88:p<=80000?75:55,target:70},
    {label:'납기구조',value:80,target:75},
  ] : t==='nursing' ? [
    {label:'재가급여',value:cov.nursingHomeLimit>=1000000?92:cov.nursingHomeLimit>0?70:20,target:75},
    {label:'시설급여',value:cov.nursingFacilityLimit>=1200000?90:cov.nursingFacilityLimit>0?65:20,target:70},
    {label:'간병지원',value:75,target:70},
    {label:'가성비',value:p<=40000?92:75,target:70},
    {label:'보장한도',value:82,target:75},
    {label:'장기요양',value:88,target:75},
  ] : t==='child' ? [
    {label:'3대진단비',value:cov.child3Major>=50000000?95:cov.child3Major>0?70:20,target:75},
    {label:'ADHD보장',value:cov.childAdhd>0?90:20,target:70},
    {label:'독감치료',value:cov.childFlu>0?88:20,target:75},
    {label:'소아수술',value:82,target:70},
    {label:'가성비',value:p<=50000?92:75,target:70},
    {label:'납입기간',value:85,target:75},
  ] : t==='car' ? [
    {label:'차량가액',value:90,target:75},
    {label:'대물배상',value:cov.carPropertyLimit>=1000000000?95:cov.carPropertyLimit>0?70:20,target:80},
    {label:'자차가입',value:cov.carOwnDamage==='join'?92:20,target:75},
    {label:'자상가입',value:cov.carInjuryType==='jasang'?92:50,target:70},
    {label:'가성비',value:p<=60000?90:75,target:70},
    {label:'할인적용',value:cov.carSafeScore>=70?92:60,target:75},
  ] : t==='driver' ? [
    {label:'형사합의',value:cov.driverLiability>=200000000?95:cov.driverLiability>0?75:20,target:75},
    {label:'변호사비',value:cov.driverLawyer>=50000000?92:cov.driverLawyer>0?70:20,target:70},
    {label:'벌금한도',value:cov.driverFineDaein>=30000000?90:cov.driverFineDaein>0?65:20,target:70},
    {label:'자부상',value:cov.driverInjury>=300000?88:cov.driverInjury>0?60:20,target:65},
    {label:'영업용',value:80,target:80},
    {label:'가성비',value:p<=25000?92:75,target:70},
  ] : t==='pet' ? [
    {label:'슬개골탈구',value:cov.petPatella?92:20,target:75},
    {label:'피부질환',value:cov.petSkin?90:20,target:70},
    {label:'구강/치과',value:cov.petDental?88:20,target:75},
    {label:'동물등록',value:80,target:70},
    {label:'보장비율',value:85,target:75},
    {label:'자가부담금',value:78,target:70},
  ] : t==='golf' ? [
    {label:'홀인원',value:cov.golfHoleInOne>=2000000?92:cov.golfHoleInOne>0?70:20,target:75},
    {label:'골프배상',value:cov.golfLiability>=30000000?90:cov.golfLiability>0?65:20,target:70},
    {label:'용품손해',value:cov.golfEquipment>=2000000?88:cov.golfEquipment>0?60:20,target:70},
    {label:'단체할인',value:cov.golfGroup?92:60,target:65},
    {label:'가성비',value:p<=15000?92:75,target:70},
    {label:'보장범위',value:80,target:75},
  ] : t==='fire' ? [
    {label:'건물보장',value:cov.fireBuilding>=100000000?90:cov.fireBuilding>0?60:20,target:75},
    {label:'대물배상',value:cov.fireLiability>=1000000000?92:cov.fireLiability>0?65:20,target:80},
    {label:'가재도구',value:cov.fireContents>=20000000?88:cov.fireContents>0?60:20,target:70},
    {label:'임시주거비',value:75,target:70},
    {label:'가성비',value:p<=10000?92:p<=20000?80:60,target:70},
    {label:'풍수해특약',value:cov.fireWaterLeak?90:25,target:75},
  ] : t==='property' ? [
    {label:'건물실손',value:cov.propertyBuilding>=200000000?92:cov.propertyBuilding>0?65:20,target:75},
    {label:'시설보장',value:cov.propertyInterior>=50000000?90:cov.propertyInterior>0?60:20,target:70},
    {label:'누수보장',value:cov.propertyWaterLeak?92:20,target:70},
    {label:'휴업손해',value:cov.propertyInterruption?88:20,target:65},
    {label:'업종배상',value:cov.propertyLiability>=100000000?90:20,target:75},
    {label:'가성비',value:p<=30000?92:75,target:70},
  ] : t==='annuity' ? [
    {label:'공시이율',value:85,target:70},
    {label:'최저보증',value:78,target:75},
    {label:'비과세',value:cov.annuityTaxRefund?95:75,target:80},
    {label:'납입기간',value:82,target:75},
    {label:'중도인출',value:88,target:75},
    {label:'사업비율',value:80,target:70},
  ] : t==='whole' ? [
    {label:'사망보장',value:cov.wholeDeathBenefit>=100000000?92:60,target:70},
    {label:'환급율',value:72,target:65},
    {label:'납기구조',value:78,target:70},
    {label:'물가방어',value:cov.wholeStepUp?85:58,target:60},
    {label:'연금전환',value:68,target:65},
    {label:'가성비',value:cov.wholeRefundType==='low'?82:52,target:70},
  ] : t==='variable' ? [
    {label:'사망보장',value:cov.variableDeath>=100000000?92:60,target:70},
    {label:'보험료절감',value:88,target:75},
    {label:'우량체할인',value:cov.variableDiscount?92:60,target:70},
    {label:'납입기간',value:80,target:70},
    {label:'중도인출',value:82,target:65},
    {label:'가성비',value:p<=30000?90:70,target:75},
  ] : t==='legal' ? [
    {label:'변호사비',value:cov.legalLawyer>=20000000?92:cov.legalLawyer>0?70:20,target:75},
    {label:'인지송달료',value:cov.legalCourtFee>=5000000?90:cov.legalCourtFee>0?65:20,target:70},
    {label:'급발진분쟁',value:cov.legalSuddenAccel?92:20,target:70},
    {label:'공제방식',value:cov.legalDeductible==='percent'?88:75,target:65},
    {label:'가성비',value:p<=15000?92:75,target:70},
    {label:'보장범위',value:80,target:75},
  ] : t==='savings' ? [
    {label:'이자소득세',value:cov.savingsTaxExempt?95:50,target:75},
    {label:'단리복리',value:cov.savingsCompound?92:60,target:70},
    {label:'유니버셜',value:cov.savingsUniversal?90:60,target:70},
    {label:'최저보증',value:85,target:75},
    {label:'가성비',value:p<=500000?92:75,target:70},
    {label:'납입유연',value:80,target:75},
  ] : t==='credit' ? [
    {label:'사망상환',value:cov.creditDeath?92:20,target:75},
    {label:'질병상환',value:cov.creditIllness?90:20,target:70},
    {label:'장해상환',value:cov.creditDisability?88:20,target:70},
    {label:'신용할인',value:82,target:65},
    {label:'가성비',value:p<=20000?92:75,target:70},
    {label:'대출연계',value:80,target:75},
  ] : [
    {label:'일반암',value:cov.cancer>=50000000?95:cov.cancer>=30000000?80:cov.cancer>0?55:15,target:75},
    {label:'뇌혈관',value:cov.brain>=30000000?90:cov.brain>=20000000?75:cov.brain>0?50:15,target:70},
    {label:'심혈관',value:cov.heart>=30000000?90:cov.heart>=20000000?75:cov.heart>0?50:15,target:70},
    {label:'수술/입원',value:cov.surgery>=3000000?85:cov.surgery>0?60:25,target:70},
    {label:'간병일당',value:cov.caregiver>=150000?90:cov.caregiver>0?60:15,target:65},
    {label:'실손여부',value:cov.silson?92:18,target:75},
  ];
  const score=Math.round(radar.reduce((s,d)=>s+d.value,0)/radar.length);

  // Diet options — Supabase Loader 결과 우선 사용, 없으면 fallback
  const hasliveOpts = liveDietOptions && liveDietOptions.length > 0;
  const dietOpts = hasliveOpts
    ? liveDietOptions!.map(o => ({ company: o.companyName, product: o.productName, premium: o.premium }))
    : COMPANIES.map((c,i) => ({ company: c, product: '비교 상품', premium: Math.round(p*0.76)+Math.round(p*0.024)*i }));
  const dietPremium = dietOpts[0]?.premium ?? Math.round(p*0.76);
  const saving = Math.max(0, p - dietPremium);

  const hasLiveUpgrade = liveUpgradeOptions && liveUpgradeOptions.length > 0;
  const upgradeOpts = hasLiveUpgrade
    ? liveUpgradeOptions!.map(o => ({ company: o.companyName, product: o.productName, premium: o.premium }))
    : COMPANIES.map((c,i) => ({ company: c, product: '업그레이드 상품', premium: p }));

  // Problems
  const probs:string[]=[];
  if(isDup) probs.push('동일 상품이 중복 가입 중 → 월 보험료 이중 납부');
  
  if (t === 'whole') {
    if (cov.wholeDeathBenefit < 50000000) probs.push('사망 보장 한도 권장 미달 ➔ 유가족 생활비 보완 필요');
    probs.push('저해약환급금형 → 중도 해지 시 원금 손실 가능');
  } else if (t === 'driver') {
    if (cov.driverLiability === 0) probs.push('교통사고처리지원금(형사합의금) 미가입 ➔ 민사 외 합의 비용 전액 부담');
    if (cov.driverLawyer === 0) probs.push('변호사선임비용 미가입');
    if (cov.driverFineDaein === 0) probs.push('벌금 특약 미가입');
  } else if (t === 'dental') {
    if (cov.dentalImplants === 0 && cov.dentalCrown === 0) {
      probs.push('치과 보존/보철 핵심 보장(임플란트, 크라운) 미가입');
    }
  } else if (t === 'dementia') {
    if (cov.dementiaSevere === 0) {
      probs.push('중증 치매 진단비 미가입');
    }
    if (cov.dementiaCaregiver === 0) {
      probs.push('간병인/간병지원일당 미가입');
    }
  } else if (t === 'fire') {
    if (cov.fireLiability === 0) {
      probs.push('화재 대물배상책임 미가입');
    }
    if (cov.fireBuilding === 0) {
      probs.push('건물 화재손해 보장 미가입');
    }
  } else if (t === 'savings') {
    if (p > 1500000) {
      probs.push('월 납입액이 적립식 비과세 한도(150만원)를 초과하여 이자소득세가 부과될 수 있습니다.');
    }
    if (!cov.savingsUniversal) {
      probs.push('자유납입(유니버셜) 미작동 ➔ 납입 유연성 제한');
    }
  } else if (t === 'accident') {
    if (cov.accidentDeath === 0) {
      probs.push('상해사망/후유장해 보장 미가입');
    }
  } else if (t === 'pet') {
    if (!cov.petPatella) probs.push('슬개골/고관절 탈구 보장 공백');
    if (!cov.petSkin) probs.push('피부염/귓병 보장 공백');
    if (!cov.petDental) probs.push('구강 질환/스케일링 보장 공백');
    if (cov.petLiability === 0) probs.push('반려동물 배상책임 미가입 → 타인/타인 동물 피해 배상 책임');
  } else if (t === 'silson') {
    if (!cov.hasSilsonCommon) probs.push('실손의료비 미가입 ➔ 의료비 리스크 노출');
  } else if (t === 'pre_existing') {
    if (!cov.hasPreExDiscount) probs.push('표준체 전환 할인 미적용 ➔ 유병자 할증 완화 요건 확인 필요');
  } else if (t === 'surgery_hospital') {
    if (cov.surgery1to5Limit === 0) probs.push('종수술비 특약 미가입 ➔ 수술비 부담 증가');
    if (cov.hospitalDaily === 0) probs.push('질병입원일당 미가입');
  } else if (t === 'cancer') {
    if (cov.cancer < 30000000) probs.push('일반암 진단비 권장(3,000만원) 미달');
    if (!cov.hasTargetedTherapy) probs.push('표적항암 치료비 미가입 ➔ 정밀 치료 비용 부담');
  } else if (t === 'brain') {
    if (cov.brainVascular < 20000000) probs.push('뇌혈관질환 진단비 권장(2,000만원) 미달');
  } else if (t === 'heart') {
    if (cov.ischemicHeart < 20000000) probs.push('허혈성 심장질환 진단비 권장(2,000만원) 미달');
  } else if (t === 'caregiving') {
    if (!cov.hasCaregiverSupport && cov.caregiverDaily === 0) probs.push('간병인 지원/사용 일당 미가입 ➔ 간병비 부담 리스크');
  } else if (t === 'nursing') {
    if (cov.nursingHomeLimit === 0 && cov.nursingFacilityLimit === 0) probs.push('재가/시설 장기요양급여 보장 공백');
  } else if (t === 'child') {
    if (cov.child3Major < 30000000) probs.push('어린이 3대진단비 권장 미달');
  } else if (t === 'car') {
    if (cov.carPropertyLimit < 1000000000) probs.push('대물배상 한도 10억 미만 ➔ 슈퍼카 다중사고 대비 한도 증액 권장');
    if (cov.carInjuryType === 'jason') probs.push('자기신체사고(자손) 가입 ➔ 보장 범위가 넓은 자동차상해(자상) 변경 권장');
  } else if (t === 'golf') {
    if (cov.golfHoleInOne === 0) probs.push('홀인원 축하비용 미가입');
    if (cov.golfLiability === 0) probs.push('골프 배상책임 미가입 ➔ 타구 사고 리스크 노출');
  } else if (t === 'property') {
    if (cov.propertyBuilding === 0) probs.push('건물 화재실손 보장한도 설정 누락');
    if (cov.propertyLiability === 0) probs.push('시설소유자 및 업종 배상책임 미가입');
  } else if (t === 'annuity') {
    if (!cov.annuityTaxRefund) probs.push('세액공제 혜택 조건 미충족 또는 연동 누락');
  } else if (t === 'variable') {
    if (cov.variableDeath < 50000000) probs.push('사망 보장 한도 권장 미달');
  } else if (t === 'legal') {
    if (cov.legalLawyer === 0) probs.push('심급별 변호사 선임비용 미가입');
  } else if (t === 'credit') {
    if (!cov.creditDeath) probs.push('사망 상환 보장 미가입 ➔ 유고 시 채무 승계 리스크');
  } else {
    // health general default
    if(cov.cancer>0&&cov.cancer<30000000) probs.push('일반암 진단비 권장(3,000만원) 미달');
    if(cov.brain>0&&cov.brain<20000000) probs.push('뇌혈관 진단비 권장(2,000만원) 미달');
    if(!cov.silson) probs.push('실손의료비 미가입 → 의료비 리스크 노출');
    if(cov.caregiver===0) probs.push('간병인사용일당 미가입');
  }

  const scoreColor=score>=70?'text-emerald-600':score>=50?'text-amber-600':'text-red-500';

  // Badges to show on card header
  const badges: { text: string; bg: string; textCol: string }[] = [];
  if (isDup) {
    badges.push({ text: '📉 다이어트 1순위', bg: 'bg-red-50 border border-red-100/65', textCol: 'text-red-600' });
  } else if (t === 'whole') {
    badges.push({ text: '⚠️ 주계약 비용 과다', bg: 'bg-orange-50 border border-orange-100/65', textCol: 'text-orange-600' });
  } else if (score >= 80) {
    badges.push({ text: '✅ 유지 권장', bg: 'bg-emerald-50 border border-emerald-100/65', textCol: 'text-emerald-600' });
  } else if (score < 50) {
    badges.push({ text: '🚀 보강 필요', bg: 'bg-indigo-50 border border-indigo-100/65', textCol: 'text-indigo-600' });
  }

  // Dynamic card styling based on diagnostic status (Solid color for maximum contrast)
  let cardStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100/50';
  if (isDup) {
    cardStyle = 'bg-rose-50 border-rose-200 hover:bg-rose-100/40';
  } else if (t === 'whole') {
    cardStyle = 'bg-amber-50 border-amber-200 hover:bg-amber-100/40';
  } else if (score >= 80) {
    cardStyle = 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/40';
  } else if (score < 50) {
    cardStyle = 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100/40';
  }

  return (
    <div className={`${cardStyle} rounded-[2rem] border shadow-sm overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <button onClick={()=>setOpen(!open)} className="w-full text-left p-6 md:p-8 flex items-start justify-between gap-4 bg-transparent hover:bg-black/[0.02] transition-colors group">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm font-black text-white ${isDup?'bg-amber-500':typeColor[t] || 'bg-slate-500'}`}>
             {String(index+1).padStart(2,'0')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              {policy.insurance_company && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black">
                  {maskCompany(policy.insurance_company, !!isUnlocked)}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white ${typeColor[t] || 'bg-slate-500'}`}>{typeLabel[t] || '안심보험'}</span>
              {isDup&&<span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-[10px] font-black">⚠️ 중복</span>}
              {badges.map((b, idx) => (
                <span key={idx} className={`px-2 py-0.5 rounded-md text-[10px] font-black ${b.bg} ${b.textCol}`}>
                  {b.text}
                </span>
              ))}
            </div>
            <p className="text-sm font-black text-slate-800 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
              {maskProductName(policy.product_name, !!isUnlocked)}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-black text-orange-600">월 {p.toLocaleString()}원</span>
              <span className="text-[10px] text-slate-400 font-bold">특약 {policy.riders.length}개</span>
              {saving>0&&<span className="text-[10px] text-emerald-600 font-black">절감 가능 {fmt(saving)}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-center hidden sm:block">
            <span className="text-[9px] font-black text-slate-400 block uppercase">보장점수</span>
            <span className={`text-2xl font-black ${scoreColor}`}>{score}</span>
          </div>
          <div className={`p-2 rounded-full transition-all flex items-center justify-center ${
            open 
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 rotate-0' 
              : 'bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200 group-hover:scale-110'
          }`}>
            {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>
  
      {/* Expanded */}
      <AnimatePresence>
        {open&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3}} className="overflow-hidden">
            <div className="border-t border-slate-100 px-6 md:px-8 pb-8 space-y-8 pt-6">
  
              {/* Rider List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">가입 특약 내역</p>
                  {!isUnlocked && (policy.isEstimated || !policy.isCustom) && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-600 text-[10px] font-black border border-orange-500/25">
                      추정치
                    </span>
                  )}
                </div>
 
                {!isUnlocked && (policy.isEstimated || !policy.isCustom) ? (
                  <div className="bg-slate-100/60 border border-slate-200/80 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2">
                    <span className="text-xl">🔒</span>
                    <p className="text-xs font-black text-slate-700">정확한 상세 보장은 1:1 상담 시 실제 조회로 확인 가능</p>
                    <p className="text-[10px] text-slate-400 font-bold">(AI가 연령/성별/보험료를 기반으로 추정한 보장 내역입니다)</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {policy.riders.map((r,i)=>(
                      <div key={i} className="flex justify-between items-center bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-sm">
                        <span className="font-bold text-slate-700 truncate pr-2">{r.rider_name}</span>
                        <span className="font-black text-slate-900 shrink-0">{fmt(r.coverage_amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
  
              {/* Coverage Status */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">📋 상세 보장 분석 현황</p>
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  {t === 'silson' && (
                    <>
                      <CovRow label="세대 구분 및 본인부담금" value={cov.hasSilsonCommon ? '4세대 가입' : '미가입'} status={cov.hasSilsonCommon ? 'good' : 'none'} note="의료비 리스크 노출"/>
                      <CovRow label="비급여 주사제 보장" value={cov.hasSilsonInjections ? '가입' : '미가입'} status={cov.hasSilsonInjections ? 'good' : 'none'} note="3대 비급여 한도 부족"/>
                    </>
                  )}
                  {t === 'dental' && (
                    <>
                      <CovRow label="임플란트 보장 한도" value={cov.dentalImplants > 0 ? fmt(cov.dentalImplants) : '미가입'} status={statusOf(cov.dentalImplants, 1000000, 500000)} note="권장: 100~150만원"/>
                      <CovRow label="크라운 보장 금액" value={cov.dentalCrown > 0 ? fmt(cov.dentalCrown) : '미가입'} status={statusOf(cov.dentalCrown, 250000, 150000)} note="권장: 20~30만원"/>
                      <CovRow label="레진/인레이 보장" value={cov.dentalConserve > 0 ? fmt(cov.dentalConserve) : '미가입'} status={statusOf(cov.dentalConserve, 100000, 50000)} note="권장: 10만원 이상"/>
                    </>
                  )}
                  {t === 'pre_existing' && (
                    <>
                      <CovRow label="고지의무 기간 (현재 유형)" value="3년 고지형" status="good" note="고지 유형 최적화 필요"/>
                      <CovRow label="표준체 대비 보험료 할증" value="~50% 할증 적용" status="warn" note="할증 최소화 플랜 검토 필요"/>
                      <CovRow label="일반암 진단비 보장 한도" value={cov.cancer > 0 ? fmt(cov.cancer) : '미가입'} status={statusOf(cov.cancer, 30000000, 10000000)} note="권장: 3,000만원 이상"/>
                      <CovRow label="뇌혈관 + 심장 진단비" value={cov.brain > 0 && cov.heart > 0 ? '가입 완료' : '미가입'} status={cov.brain > 0 && cov.heart > 0 ? 'good' : 'none'} note="2대질환 동시 강화 권장"/>
                    </>
                  )}
                  {t === 'surgery_hospital' && (
                    <>
                      <CovRow label="1~5종 수술비 보장" value={cov.surgery1to5Limit > 0 ? fmt(cov.surgery1to5Limit) : '미가입'} status={statusOf(cov.surgery1to5Limit, 5000000, 2000000)} note="권장: 5종 최대 500만원"/>
                      <CovRow label="질병 입원일당" value={cov.hospitalDaily > 0 ? fmt(cov.hospitalDaily) + '/일' : '미가입'} status={statusOf(cov.hospitalDaily, 50000, 20000)} note="권장: 5만원/일"/>
                      <CovRow label="중환자실(ICU) 입원일당" value={cov.hospitalICUDaily > 0 ? fmt(cov.hospitalICUDaily) + '/일' : '미가입'} status={statusOf(cov.hospitalICUDaily, 100000, 50000)} note="권장: 10만원/일"/>
                      <CovRow label="종합병원 이상 입원일당 할증" value={cov.hospitalGeneralDaily > 0 ? '적용 완료' : '미적용'} status={cov.hospitalGeneralDaily > 0 ? 'good' : 'none'} note="상급병원 입원일당 보강 권장"/>
                    </>
                  )}
                  {t === 'cancer' && (
                    <>
                      <CovRow label="일반암 진단비" value={cov.cancer > 0 ? fmt(cov.cancer) : '미가입'} status={statusOf(cov.cancer, 50000000, 30000000)} note="권장: 5,000만원 이상"/>
                      <CovRow label="표적항암 치료비" value={cov.hasTargetedTherapy ? '가입 완료' : '미가입'} status={cov.hasTargetedTherapy ? 'good' : 'none'} note="권장: 5,000만원 한도"/>
                      <CovRow label="비급여 암 주요치료비" value={cov.hasTreatmentCost2025 ? '가입 완료' : '미가입'} status={cov.hasTreatmentCost2025 ? 'good' : 'none'} note="권장: 연간 최대 1억원"/>
                      <CovRow label="재발/전이암 반복 보장" value={cov.hasRecurrentCancer ? '가입 완료' : '미가입'} status={cov.hasRecurrentCancer ? 'good' : 'none'} note="2년마다 반복 지급 보강 권장"/>
                      <CovRow label="납입/갱신 유형" value={cov.isRenewable ? '갱신형' : '비갱신형'} status={cov.isRenewable ? 'warn' : 'good'} note="장기 유지 시 비갱신형 권장"/>
                    </>
                  )}
                  {t === 'brain' && (
                    <>
                      <CovRow label="뇌혈관질환 진단비 (넓은 보장)" value={cov.brainVascular > 0 ? fmt(cov.brainVascular) : '미가입'} status={statusOf(cov.brainVascular, 20000000, 10000000)} note="권장: 2,000만원 이상"/>
                      <CovRow label="뇌졸중/뇌출혈 진단비" value={cov.strokeAmount > 0 ? fmt(cov.strokeAmount) : '미가입'} status={statusOf(cov.strokeAmount, 30000000, 10000000)} note="중증 뇌질환 대비 보강 권장"/>
                      <CovRow label="뇌혈관질환 수술비" value={cov.brainSurgery > 0 ? fmt(cov.brainSurgery) : '미가입'} status={statusOf(cov.brainSurgery, 10000000, 5000000)} note="권장: 회당 1,000만원"/>
                    </>
                  )}
                  {t === 'heart' && (
                    <>
                      <CovRow label="허혈성 심장질환 진단비 (협심증 포함)" value={cov.ischemicHeart > 0 ? fmt(cov.ischemicHeart) : '미가입'} status={statusOf(cov.ischemicHeart, 20000000, 10000000)} note="권장: 2,000만원 이상"/>
                      <CovRow label="급성심근경색증 진단비" value={cov.infarctionAmount > 0 ? fmt(cov.infarctionAmount) : '미가입'} status={statusOf(cov.infarctionAmount, 30000000, 10000000)} note="중증 심장질환 집중 보완 권장"/>
                      <CovRow label="심장질환 수술비 (스텐트 삽입술 등)" value={cov.heartSurgery > 0 ? fmt(cov.heartSurgery) : '미가입'} status={statusOf(cov.heartSurgery, 10000000, 5000000)} note="권장: 회당 1,000만원"/>
                    </>
                  )}
                  {t === 'accident' && (
                    <>
                      <CovRow label="상해사망 보장액" value={cov.accidentDeath > 0 ? fmt(cov.accidentDeath) : '미가입'} status={statusOf(cov.accidentDeath, 150000000, 50000000)} note="권장: 1.5억~2억원"/>
                      <CovRow label="상해후유장해 (3% 이상)" value={cov.accidentDisability > 0 ? fmt(cov.accidentDisability) : '미가입'} status={statusOf(cov.accidentDisability, 150000000, 50000000)} note="장기 대체 소득 보완 권장"/>
                      <CovRow label="골절 진단비 / 상해 수술비" value={cov.accidentFracture > 0 ? `골절 ${fmt(cov.accidentFracture)}` : '미가입'} status={cov.accidentFracture > 0 ? 'good' : 'none'} note="생활 상해 치료비 보완 권장"/>
                      <CovRow label="레저스포츠 상해 특약" value={cov.hasLeisureRider ? '가입 완료' : '미가입'} status={cov.hasLeisureRider ? 'good' : 'none'} note="야외 취미 활동 리스크 대비 권장"/>
                    </>
                  )}
                  {t === 'caregiving' && (
                    <>
                      <CovRow label="간병인 지원 일당 (보험사 직접 파견)" value={cov.hasCaregiverSupport ? '가입 완료' : '미가입'} status={cov.hasCaregiverSupport ? 'good' : 'none'} note="요양/일반 병동 간병인 매칭"/>
                      <CovRow label="간병비 사용 일당 (현금 지급형)" value={cov.caregiverDaily > 0 ? fmt(cov.caregiverDaily) + '/일' : '미가입'} status={statusOf(cov.caregiverDaily, 150000, 100000)} note="권장: 하루 최대 15만원"/>
                    </>
                  )}
                  {t === 'dementia' && (
                    <>
                      <CovRow label="경도 치매 진단금 (CDR 1점)" value={cov.dementiaMild > 0 ? fmt(cov.dementiaMild) : '미가입'} status={statusOf(cov.dementiaMild, 10000000, 3000000)} note="권장: 1,000만원 이상"/>
                      <CovRow label="중등도 치매 진단금 (CDR 2점)" value={cov.dementiaModerate > 0 ? fmt(cov.dementiaModerate) : '미가입'} status={statusOf(cov.dementiaModerate, 20000000, 5000000)} note="권장: 2,000만원 이상"/>
                      <CovRow label="중증 치매 생활비 (CDR 3점)" value={cov.dementiaSevere > 0 ? fmt(cov.dementiaSevere) + '/월' : '미가입'} status={cov.dementiaSevere > 0 ? 'good' : 'none'} note="평생 매월 생활비 보조 지원"/>
                    </>
                  )}
                  {t === 'nursing' && (
                    <>
                      <CovRow label="재가급여 지원 한도 (장기요양 1~5등급)" value={cov.nursingHomeLimit > 0 ? fmt(cov.nursingHomeLimit) + '/월' : '미가입'} status={statusOf(cov.nursingHomeLimit, 1000000, 500000)} note="권장: 매월 최대 100만원"/>
                      <CovRow label="시설급여 지원 한도 (요양원/실버타운)" value={cov.nursingFacilityLimit > 0 ? fmt(cov.nursingFacilityLimit) + '/월' : '미가입'} status={statusOf(cov.nursingFacilityLimit, 1200000, 500000)} note="권장: 매월 최대 120만원"/>
                    </>
                  )}
                  {t === 'child' && (
                    <>
                      <CovRow label="ADHD / 소아 우울증 진단비" value={cov.childAdhd > 0 ? fmt(cov.childAdhd) : '미가입'} status={cov.childAdhd > 0 ? 'good' : 'none'} note="최초 1회 300만원 보장 권장"/>
                      <CovRow label="독감(인플루엔자) 치료비" value={cov.childFlu > 0 ? fmt(cov.childFlu) : '미가입'} status={cov.childFlu > 0 ? 'good' : 'none'} note="연 1회 10만원 정액 지원"/>
                      <CovRow label="3대 진단비 (암·뇌·심장)" value={cov.child3Major > 0 ? fmt(cov.child3Major) : '미가입'} status={statusOf(cov.child3Major, 50000000, 30000000)} note="권장: 최대 5,000만원"/>
                    </>
                  )}
                  {t === 'car' && (
                    <>
                      <CovRow label="평가 차량 모델 및 가액" value="가액 정상 반영" status="good" note="차량가액 기준 비례보상 방지"/>
                      <CovRow label="운전자 범위 특약" value={cov.carDriverLimit === 'single' ? '1인 한정' : cov.carDriverLimit === 'couple' ? '부부 한정' : '가족 한정'} status="good" note="범위 설정 최적화 필요"/>
                      <CovRow label="자기차량손해 (자차) 보장 방식" value={cov.carOwnDamage === 'join' ? '자차 가입 완료' : '미가입'} status={cov.carOwnDamage === 'join' ? 'good' : 'none'} note="단독사고 종합보장 대비"/>
                      <CovRow label="자기신체 상해 담보 방식" value={cov.carInjuryType === 'jasang' ? '자동차상해 (자상)' : '자기신체사고 (자손)'} status={cov.carInjuryType === 'jasang' ? 'good' : 'warn'} note="자손 대비 자상 가입 권장"/>
                      <CovRow label="대물배상 보장 한도" value={cov.carPropertyLimit > 0 ? fmt(cov.carPropertyLimit) : '미가입'} status={statusOf(cov.carPropertyLimit, 1000000000, 200000000)} note="권장: 10억원 이상 고용한도"/>
                      <CovRow label="안전운전 특약 할인 (Tmap)" value={cov.carSafeScore >= 70 ? '12% 할인 적용' : '미적용'} status={cov.carSafeScore >= 70 ? 'good' : 'warn'} note="안전운전 점수 연동 할인 권장"/>
                    </>
                  )}
                  {t === 'driver' && (
                    <>
                      <CovRow label="교통사고처리지원금 (형사합의금)" value={cov.driverLiability > 0 ? fmt(cov.driverLiability) : '미가입'} status={statusOf(cov.driverLiability, 200000000, 100000000)} note="권장: 2억원 이상"/>
                      <CovRow label="변호사 선임 비용 (경찰조사단계 포함)" value={cov.driverLawyer > 0 ? fmt(cov.driverLawyer) : '미가입'} status={statusOf(cov.driverLawyer, 50000000, 30000000)} note="권장: 5,000만원 선지원"/>
                      <CovRow label="대인 벌금 (민식이법 법정 최대 벌금)" value={cov.driverFineDaein > 0 ? fmt(cov.driverFineDaein) : '미가입'} status={statusOf(cov.driverFineDaein, 30000000, 20000000)} note="권장: 3,000만원 한도"/>
                      <CovRow label="대물 벌금 (도로 파손 대비)" value={cov.driverFineDaemul > 0 ? fmt(cov.driverFineDaemul) : '미가입'} status={cov.driverFineDaemul > 0 ? 'good' : 'none'} note="가재도구/가드레일 파손 대비"/>
                      <CovRow label="자동차사고 부상치료비 (자부상)" value={cov.driverInjury > 0 ? fmt(cov.driverInjury) : '미가입'} status={statusOf(cov.driverInjury, 300000, 100000)} note="권장: 14급 기준 30만원"/>
                    </>
                  )}
                  {t === 'pet' && (
                    <>
                      <CovRow label="슬개골/고관절 탈구 보장" value={cov.petPatella ? '가입 완료' : '미보장'} status={cov.petPatella ? 'good' : 'none'} note="실손 보장 (1년 대기 후 수술비 실비 지원)"/>
                      <CovRow label="피부염/귓병(외이염) 보장" value={cov.petSkin ? '가입 완료' : '미보장'} status={cov.petSkin ? 'good' : 'none'} note="통원 치료비 지원 (만성 피부질환 장기 처방)"/>
                      <CovRow label="구강 질환/스케일링 보장" value={cov.petDental ? '가입 완료' : '미보장'} status={cov.petDental ? 'good' : 'none'} note="스케일링 및 치주염 수술 지원 (구강 관리 최적화)"/>
                      <CovRow label="반려동물 배상책임" value={cov.petLiability > 0 ? fmt(cov.petLiability) : '미가입'} status={statusOf(cov.petLiability, 10000000, 5000000)} note="사고당 최대 1,000만원 (자부담 3만)"/>
                    </>
                  )}
                  {t === 'golf' && (
                    <>
                      <CovRow label="홀인원 축하비용" value={cov.golfHoleInOne > 0 ? fmt(cov.golfHoleInOne) : '미가입'} status={cov.golfHoleInOne > 0 ? 'good' : 'none'} note="최대 200만원 실손 지원"/>
                      <CovRow label="골프 배상책임 (타구 사고)" value={cov.golfLiability > 0 ? fmt(cov.golfLiability) : '미가입'} status={statusOf(cov.golfLiability, 30000000, 10000000)} note="사고당 최대 3,000만원 대인/대물 보장"/>
                      <CovRow label="골프용품 손해 (도난/파손)" value={cov.golfEquipment > 0 ? fmt(cov.golfEquipment) : '미가입'} status={statusOf(cov.golfEquipment, 2000000, 1000000)} note="세트당 최대 200만원 AS비용 지원"/>
                      <CovRow label="4인 동반 단체 할인" value={cov.golfGroup ? '적용 완료' : '미적용'} status={cov.golfGroup ? 'good' : 'warn'} note="5% 추가할인 단체 패키지 우대"/>
                    </>
                  )}
                  {t === 'fire' && (
                    <>
                      <CovRow label="건물 복구 가입 금액" value={cov.fireBuilding > 0 ? fmt(cov.fireBuilding) : '미가입'} status={statusOf(cov.fireBuilding, 100000000, 50000000)} note="실손 한도 설정 권장"/>
                      <CovRow label="가재도구 가입 금액" value={cov.fireContents > 0 ? fmt(cov.fireContents) : '미가입'} status={statusOf(cov.fireContents, 30000000, 10000000)} note="가전/가구 전손 피해 복구 지원"/>
                      <CovRow label="급배수시설누출손해 (누수 보장)" value={cov.fireWaterLeak ? '가입 완료' : '미보장'} status={cov.fireWaterLeak ? 'good' : 'none'} note="아랫집 누수 및 수리비 보장"/>
                      <CovRow label="화재 배상책임 (이웃집 피해보상)" value={cov.fireLiability > 0 ? fmt(cov.fireLiability) : '미가입'} status={statusOf(cov.fireLiability, 2000000000, 100000000)} note="대물 20억, 대인 1.5억 한도 설정 권장"/>
                      <CovRow label="최저보험료 룰 및 적립금 전환" value="만기 시 적립전환" status="good" note="월 10,000원 납입 차액 적립금 전환"/>
                    </>
                  )}
                  {t === 'property' && (
                    <>
                      <CovRow label="건물 화재실손 보장한도" value={cov.propertyBuilding > 0 ? fmt(cov.propertyBuilding) : '미가입'} status={statusOf(cov.propertyBuilding, 200000000, 100000000)} note="비례보상 방지 실손한도 설정"/>
                      <CovRow label="시설 및 인테리어 보장" value={cov.propertyInterior > 0 ? fmt(cov.propertyInterior) : '미가입'} status={statusOf(cov.propertyInterior, 50000000, 20000000)} note="침수/화재 시 인테리어 원상복구 지원"/>
                      <CovRow label="급배수시설누출손해 (누수 보장)" value={cov.propertyWaterLeak ? '가입 완료' : '미보장'} status={cov.propertyWaterLeak ? 'good' : 'none'} note="누수로 인한 인테리어 침수 보장"/>
                      <CovRow label="점포 휴업손해 (영업중단 보상)" value={cov.propertyInterruption ? '가입 완료' : '미보장'} status={cov.propertyInterruption ? 'good' : 'none'} note="복구 기간 중 고정임차료 등 지원"/>
                      <CovRow label="시설소유자 및 업종 배상책임" value={cov.propertyLiability > 0 ? fmt(cov.propertyLiability) : '미가입'} status={statusOf(cov.propertyLiability, 100000000, 50000000)} note="매장 내 미끄러짐/식중독 등 배상"/>
                      <CovRow label="최저보험료 기준 적립금 전환" value="적립 자동 전환" status="good" note="최저보험료 초과분 환급"/>
                    </>
                  )}
                  {t === 'annuity' && (
                    <>
                      <CovRow label="세액공제 연말정산 환급" value={cov.annuityTaxRefund ? '최대 600만 세액공제' : '공제한도 미달'} status={cov.annuityTaxRefund ? 'good' : 'warn'} note="최대 600만원 세액공제 설계"/>
                      <CovRow label="납입 기간 설계" value={cov.annuityPeriod >= 10 ? `${cov.annuityPeriod}년납` : '단기 납입'} status={cov.annuityPeriod >= 10 ? 'good' : 'warn'} note="10년 이상 납입 복리효과 권장"/>
                      <CovRow label="연금 개시 연령 및 세율" value={`만 ${cov.annuityAge}세 개시`} status="good" note="70세 이후 개시 시 3.3% 저율과세"/>
                      <CovRow label="IRP 퇴직연금 매칭" value={cov.annuityIrp ? '가입 완료' : '미연동'} status={cov.annuityIrp ? 'good' : 'none'} note="통합 공제 한도 900만원으로 확대"/>
                    </>
                  )}
                  {t === 'whole' && (
                    <>
                      <CovRow label="사망 보장 한도" value={cov.wholeDeathBenefit > 0 ? fmt(cov.wholeDeathBenefit) : '미가입'} status={statusOf(cov.wholeDeathBenefit, 100000000, 50000000)} note="상속세 및 유가족 안심자금 준비"/>
                      <CovRow label="보험료 납입 구조" value={`${cov.wholePeriod}년납`} status="good" note="단기완납 구조 권장"/>
                      <CovRow label="해약환급금 구조" value={cov.wholeRefundType === 'low' ? '무해지/저해지형' : '일반 환급형'} status="good" note="완납 후 높은 환급금 확보 설계"/>
                      <CovRow label="물가상승 대응특약" value={cov.wholeStepUp ? '체증형 적용' : '기본 고정형'} status={cov.wholeStepUp ? 'good' : 'warn'} note="매년 5% 보장 체증 권장"/>
                    </>
                  )}
                  {t === 'variable' && (
                    <>
                      <CovRow label="사망 보장 한도" value={cov.variableDeath > 0 ? fmt(cov.variableDeath) : '미가입'} status={statusOf(cov.variableDeath, 100000000, 50000000)} note="경제활동기 집중 사망보장"/>
                      <CovRow label="보험료 납입 규모" value={cov.variablePremium > 0 ? `${fmt(cov.variablePremium)}/월` : '평가 불가'} status="good" note="동일 보장 대비 저렴한 정기보험"/>
                      <CovRow label="우량체 특별 할인" value={cov.variableDiscount ? '최대 18% 즉시할인' : '미적용'} status={cov.variableDiscount ? 'good' : 'warn'} note="비흡연/혈압 정상 시 즉시할인"/>
                    </>
                  )}
                  {t === 'legal' && (
                    <>
                      <CovRow label="심급별 변호사 선임비용" value={cov.legalLawyer > 0 ? fmt(cov.legalLawyer) : '미가입'} status={statusOf(cov.legalLawyer, 20000000, 10000000)} note="심급별 변호사 비용 선임비 보강"/>
                      <CovRow label="인지대 및 송달료 실비" value={cov.legalCourtFee > 0 ? fmt(cov.legalCourtFee) : '미가입'} status={statusOf(cov.legalCourtFee, 5000000, 2000000)} note="대형 소송 전 인지액 방어"/>
                      <CovRow label="급발진 사고 분쟁 소송 특약" value={cov.legalSuddenAccel ? '가입 완료' : '미가입'} status={cov.legalSuddenAccel ? 'good' : 'none'} note="급발진 시 변호사 선임비 완비"/>
                      <CovRow label="소송비용 자기부담 공제방식" value={cov.legalDeductible === 'percent' ? '비례 10% 공제' : '정액 공제'} status="good" note="비례 자부담 시 월 보험료 할인"/>
                    </>
                  )}
                  {t === 'savings' && (
                    <>
                      <CovRow label="이자 소득세 (15.4%)" value={cov.savingsTaxExempt ? '비과세 대상 (이자세 0%)' : '과세 대상'} status={cov.savingsTaxExempt ? 'good' : 'warn'} note="10년 유지 시 비과세 혜택 적용"/>
                      <CovRow label="이자 계산 방식" value={cov.savingsCompound ? '월 복리 이자' : '단리 이자'} status={cov.savingsCompound ? 'good' : 'warn'} note="장기 복리 효과 극대화"/>
                      <CovRow label="납입 유연성 (유니버셜)" value={cov.savingsUniversal ? '유니버셜 자유 납입' : '일반 납입'} status={cov.savingsUniversal ? 'good' : 'warn'} note="자유 추가납입 및 중도인출 연동"/>
                      <CovRow label="금리 방어막 (최저보증)" value="최저보증이율 평생 보장" status="good" note="기준금리 급락 시 안전판 확보"/>
                    </>
                  )}
                  {t === 'credit' && (
                    <>
                      <CovRow label="사망 상환 보장" value={cov.creditDeath ? '채무 전액 대위변제' : '미가입'} status={cov.creditDeath ? 'good' : 'none'} note="유고 시 채무 유가족 승계 리스크"/>
                      <CovRow label="3대 질병 보장" value={cov.creditIllness ? '진단 즉시 대출상환' : '미가입'} status={cov.creditIllness ? 'good' : 'none'} note="암/뇌/심 투병 시 가계 연체 노출"/>
                      <CovRow label="고도후유장해 완납" value={cov.creditDisability ? '대출금 전액 상환' : '미가입'} status={cov.creditDisability ? 'good' : 'none'} note="장해 시 소득상실 경매 리스크 방어"/>
                      <CovRow label="신용평가사 할인 연계" value="신용등급 우대 할인" status="good" note="신용 점수 반영 추가 할인 연동"/>
                    </>
                  )}
                  {t !== 'silson' && t !== 'dental' && t !== 'pre_existing' && t !== 'surgery_hospital' && t !== 'cancer' && t !== 'brain' && t !== 'heart' && t !== 'accident' && t !== 'caregiving' && t !== 'dementia' && t !== 'nursing' && t !== 'child' && t !== 'car' && t !== 'driver' && t !== 'pet' && t !== 'golf' && t !== 'fire' && t !== 'property' && t !== 'annuity' && t !== 'whole' && t !== 'variable' && t !== 'legal' && t !== 'savings' && t !== 'credit' && (
                    <>
                      <CovRow label="일반암 진단비" value={cov.cancer > 0 ? fmt(cov.cancer) : '미가입'} status={statusOf(cov.cancer, 30000000, 10000000)} note="권장: 3,000~5,000만원"/>
                      <CovRow label="뇌혈관 질환 진단비" value={cov.brain > 0 ? fmt(cov.brain) : '미가입'} status={statusOf(cov.brain, 20000000, 10000000)} note="권장: 2,000~3,000만원"/>
                      <CovRow label="허혈성 심장질환 진단비" value={cov.heart > 0 ? fmt(cov.heart) : '미가입'} status={statusOf(cov.heart, 20000000, 10000000)} note="권장: 2,000~3,000만원"/>
                      <CovRow label="수술비(질병/상해)" value={cov.surgery > 0 ? fmt(cov.surgery) : '미가입'} status={statusOf(cov.surgery, 3000000, 1000000)} note="권장: 300만원 이상"/>
                      <CovRow label="간병인사용일당" value={cov.caregiver > 0 ? fmt(cov.caregiver) + '/일' : '미가입'} status={statusOf(cov.caregiver, 150000, 100000)} note="권장: 15만원/일 이상"/>
                      <CovRow label="실손의료비" value={cov.silson ? '가입' : '미가입'} status={cov.silson ? 'good' : 'none'} note="의료비 리스크 노출"/>
                    </>
                  )}
                </div>
              </div>

              {t === 'driver' && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">📋 상세 보장 분석 현황</p>
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                    <CovRow label="교통사고처리지원금(형사합의)" value={cov.driverLiability > 0 ? fmt(cov.driverLiability) : '미가입'} status={statusOf(cov.driverLiability, 200000000, 100000000)} note="권장: 2억원 이상"/>
                    <CovRow label="변호사선임비용" value={cov.driverLawyer > 0 ? fmt(cov.driverLawyer) : '미가입'} status={statusOf(cov.driverLawyer, 50000000, 30000000)} note="권장: 5,000만원"/>
                    <CovRow label="벌금(대인/대물)" value={cov.driverFine > 0 ? fmt(cov.driverFine) : '미가입'} status={statusOf(cov.driverFine, 30000000, 20000000)} note="권장: 3,000만원"/>
                    <CovRow label="자동차사고부상치료비" value={cov.driverInjury > 0 ? fmt(cov.driverInjury) : '미가입'} status={statusOf(cov.driverInjury, 300000, 100000)} note="권장: 30만원 이상"/>
                  </div>
                </div>
              )}

              {t === 'whole' && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">📋 상세 보장 분석 현황</p>
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                    <CovRow label="주계약 사망보장" value={cov.death > 0 ? fmt(cov.death) : '미가입'} status={statusOf(cov.death, 100000000, 50000000)} note="권장: 1억원 이상"/>
                    <CovRow label="해약 환급률 수준" value="72% (평가 진행)" status="warn" note="해약 시 원금 대비 85% 이상 권장"/>
                  </div>
                </div>
              )}

              {t === 'pet' && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">📋 상세 보장 분석 현황</p>
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                    <CovRow label="반려동물 의료실비(통원/입원)" value={cov.petMedical > 0 ? '가입' : '미가입'} status={cov.petMedical > 0 ? 'good' : 'none'} note="반려동물 핵심 의료비 실손 보장"/>
                    <CovRow label="반려동물 수술비" value={cov.petMedical > 0 ? '가입' : '미가입'} status={cov.petMedical > 0 ? 'good' : 'none'} note="반려동물 주요 수술비 100% 보강"/>
                    <CovRow label="반려동물 배상책임" value={cov.petLiability > 0 ? fmt(cov.petLiability) : '미가입'} status={statusOf(cov.petLiability, 10000000, 5000000)} note="권장: 사고당 1,000만원 한도"/>
                  </div>
                </div>
              )}
 
              {/* Radar + Score */}
              <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-2xl p-6 border border-slate-200/60">
                <div className="relative flex-shrink-0">
                  <RadarChart data={radar} size={260}/>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase block">Score</span>
                    <span className={`text-3xl font-black ${scoreColor}`}>{score}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">이 보험의 종합 평가</p>
                    <p className="text-2xl font-black text-slate-900">
                      {maskProductName(policy.product_name.split('(')[0].trim(), !!isUnlocked)}
                    </p>
                  </div>
                  {probs.length>0&&(
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">⚠️ 발견된 문제점</p>
                      {probs.map((pr,i)=>(
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-600 font-bold">
                          <span className="text-red-400 mt-0.5 shrink-0">•</span>{pr}
                        </div>
                      ))}
                    </div>
                  )}
                  {probs.length===0&&<p className="text-emerald-600 font-black text-sm">✅ 이 보험은 양호한 상태입니다.</p>}
                </div>
              </div>

              {/* Diet / Upgrade Options — Supabase 실시간 데이터 */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Diet */}
                <div className="bg-blue-50/50 border border-blue-100/60 rounded-2xl p-6">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">📉 다이어트 플랜</p>
                  <p className="text-lg font-black text-blue-900 mb-1">동일 보장, 더 저렴하게</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-blue-600">{dietPremium.toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-500">원/월</span>
                    {saving > 0 && <span className="ml-2 text-xs font-black text-emerald-600">월 {fmt(saving)} 절감</span>}
                  </div>
                  <div className="space-y-1">
                    {dietOpts.slice(0,4).map((o,i)=>(
                      <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-blue-100/50 last:border-0">
                        <span className="font-bold text-slate-700 truncate max-w-[60%]">{String(i+1).padStart(2,'0')} {maskCompany(o.company, !!isUnlocked)}</span>
                        <span className="font-black text-blue-700 shrink-0">{o.premium.toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Upgrade */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">🚀 업그레이드 플랜</p>
                  <p className="text-lg font-black text-white mb-1">동일 예산, 더 든든하게</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-orange-400">{p.toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">원/월 유지</span>
                  </div>
                  <div className="space-y-1">
                    {upgradeOpts.slice(0,4).map((o,i)=>(
                      <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-white/10 last:border-0">
                        <span className="font-bold text-slate-300 truncate max-w-[60%]">{String(i+1).padStart(2,'0')} {maskCompany(o.company, !!isUnlocked)}</span>
                        <span className="font-black text-orange-300 shrink-0">{o.premium.toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Market Comparison */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">🏆 전 보험사 실시간 비교</p>
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 bg-slate-50 px-5 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                    <div className="col-span-1">순위</div>
                    <div className="col-span-4">보험사</div>
                    <div className="col-span-5">상품</div>
                    <div className="col-span-2 text-right">월 보험료</div>
                  </div>
                  {dietOpts.map((o,i)=>(
                    <div key={i} className={`grid grid-cols-12 px-5 py-3 text-xs items-center border-b border-slate-50 last:border-0 ${i===0?'bg-emerald-50/30':''}`}>
                      <div className="col-span-1 font-black text-slate-400">{String(i+1).padStart(2,'0')}</div>
                      <div className="col-span-4 font-black text-slate-800">{maskCompany(o.company, !!isUnlocked)}</div>
                      <div className="col-span-5 text-slate-500 truncate">{maskProductName((o as any).product || '', !!isUnlocked)}</div>
                      <div className="col-span-2 text-right font-black text-blue-600">
                        {o.premium.toLocaleString()}원
                        {i===0&&<span className="block text-[9px] text-emerald-600 font-black">최저가</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const PerPolicyDashboard: React.FC<Props> = ({ policies, age, gender, isUnlocked, forceAllOpen, allDietOptions, allUpgradeOptions }) => {
  const dups = findDups(policies);
  const total = policies.reduce((s,p)=>s+p.monthly_premium,0);
  const hasDups = dups.size > 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Summary Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] font-black text-slate-400 block uppercase">총 가입 건수</span>
            <span className="text-xl font-black text-slate-800">{policies.length}건</span>
          </div>
          <div className="h-8 w-px bg-slate-200"/>
          <div>
            <span className="text-[10px] font-black text-slate-400 block uppercase">월 총 납입료</span>
            <span className="text-xl font-black text-orange-600">{total.toLocaleString()}원</span>
          </div>
          {hasDups&&(
            <>
              <div className="h-8 w-px bg-slate-200"/>
              <div>
                <span className="text-[10px] font-black text-amber-500 block uppercase">⚠️ 중복 감지</span>
                <span className="text-xl font-black text-amber-600">{dups.size}건</span>
              </div>
            </>
          )}
        </div>
        <div className="text-[10px] text-slate-400 font-bold">각 카드를 클릭하면 개별 분석이 펼쳐집니다</div>
      </div>

      {/* Per-Policy Cards */}
      {policies.map((policy,i)=>{
        // 이 policy의 카테고리에 해당하는 Loader 옵션 필터링
        const pDietOpts  = allDietOptions?.filter(o => o.currentProduct === policy.product_name || !o.currentProduct) || [];
        const pUpOpts    = allUpgradeOptions?.filter(o => o.currentProduct === policy.product_name || !o.currentProduct) || [];
        return (
          <PolicyCard
            key={i}
            policy={policy}
            index={i}
            isDup={dups.has(i)}
            totalCount={policies.length}
            isUnlocked={isUnlocked}
            forceOpen={forceAllOpen}
            liveDietOptions={pDietOpts.length > 0 ? pDietOpts : allDietOptions}
            liveUpgradeOptions={pUpOpts.length > 0 ? pUpOpts : allUpgradeOptions}
          />
        );
      })}
    </div>
  );
};
