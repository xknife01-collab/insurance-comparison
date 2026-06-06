import { InsuranceAnalysis, AnalysisResult } from '../types/insurance';
import { analyzeHealth } from './engines/healthEngine';
import { fetchSilsonPremium } from './insurance/silson/silsonLoader';
import { analyzeSilson } from './insurance/silson/silsonEngine';
import { fetchCaregivingPremium } from './insurance/caregiving/caregivingLoader';
import { analyzeCaregiving } from './insurance/caregiving/caregivingEngine';
import { fetchDementiaPremium } from './insurance/dementia/dementiaLoader';
import { analyzeDementia } from './insurance/dementia/dementiaEngine';
import { fetchHomeFacilityPremium } from './insurance/home-facility/homeFacilityLoader';
import { analyzeHomeFacility } from './insurance/home-facility/homeFacilityEngine';
import { fetchDentalPremium } from './insurance/dental/dentalLoader';
import { analyzeDental } from './insurance/dental/dentalEngine';
import { fetchSurgeryPremium } from './insurance/surgery/surgeryLoader';
import { analyzeSurgery } from './insurance/surgery/surgeryEngine';
import { fetchPreExistingPremium } from './insurance/pre-existing/preExistingLoader';
import { analyzePreExisting } from './insurance/pre-existing/preExistingEngine';
import { fetchCancerPremium } from './insurance/cancer/cancerLoader';
import { analyzeCancer } from './insurance/cancer/cancerEngine';
import { fetchBrainPremium } from './insurance/brain/brainLoader';
import { analyzeBrain } from './insurance/brain/brainEngine';
import { fetchHeartPremium } from './insurance/heart/heartLoader';
import { analyzeHeart } from './insurance/heart/heartEngine';
import { fetchChildPremium } from './insurance/child/childLoader';
import { analyzeChild } from './insurance/child/childEngine';
import { analyzeCar } from './insurance/car/carEngine';
import { fetchCarPremium } from './insurance/car/carLoader';
import { analyzeDriver } from './insurance/driver/driverEngine';
import { fetchDriverPremium } from './insurance/driver/driverLoader';
import { fetchPremiumFromDatabase } from './engines/databaseLoader';
import { fetchPetPremium } from './insurance/pet/petLoader';
import { analyzePet } from './insurance/pet/petEngine';
import { fetchGolfPremium } from './insurance/golf/golfLoader';
import { analyzeGolf } from './insurance/golf/golfEngine';
import { fetchFirePremium } from './insurance/fire/fireLoader';
import { analyzeFire } from './insurance/fire/fireEngine';
import { fetchPropertyPremium } from './insurance/property/propertyLoader';
import { analyzeProperty } from './insurance/property/propertyEngine';
import { fetchAnnuityPremium } from './insurance/annuity/annuityLoader';
import { analyzeAnnuity } from './insurance/annuity/annuityEngine';
import { fetchWholeLifePremium } from './insurance/wholeLife/wholeLifeLoader';
import { analyzeWholeLife } from './insurance/wholeLife/wholeLifeEngine';
import { fetchVariablePremium } from './insurance/variable/variableLoader';
import { analyzeVariable } from './insurance/variable/variableEngine';
import { fetchLegalPremium } from './insurance/legal/legalLoader';
import { analyzeLegal } from './insurance/legal/legalEngine';
import { fetchSavingsPremium } from './insurance/savings/savingsLoader';
import { analyzeSavings } from './insurance/savings/savingsEngine';
import { fetchCreditPremium } from './insurance/credit/creditLoader';
import { analyzeCredit } from './insurance/credit/creditEngine';
import { fetchHealthGeneralPremium } from './insurance/healthGeneral/healthGeneralLoader';
import { analyzeHealthGeneral } from './insurance/healthGeneral/healthGeneralEngine';
import { fetchAccidentPremium } from './insurance/accident/accidentLoader';
import { analyzeAccident } from './insurance/accident/accidentEngine';


export const runAnalysis = async (analysis: InsuranceAnalysis): Promise<any> => {
  const category = analysis.selectedCategory || '';
  
  if (category === 'remodeling' || analysis._remodelingCoverage) {
    const { analyzeRemodeling } = await import('./remodeling/remodelingEngine');
    return analyzeRemodeling(analysis);
  }

  // 1. Fetch real premium from the Supabase database
  // ─── selectedCategory 단일 진입점 — !!analysis.xxx 데이터 폴백 없음 ──────────
  const isDementia      = category === 'dementia' || category.includes('치매');
  const isNursing       = category === 'nursing'       || category.includes('재가') || category.includes('시설');
  const isBrain         = category === 'brain' || category.includes('뇌혈관');
  const isCancer        = category === 'cancer' || category.includes('암');
  const isSilson        = category.includes('실손')    || category.includes('실비');
  const isCaregiving    = category.includes('간병')    && !isDementia && !isNursing;
  const isDental        = category === 'dental' || category.includes('치아');
  const isSurgery       = category.includes('수술')    || category.includes('입원');
  const isChild         = category === 'child' || category === 'pre_family' || (category.includes('어린이') || category.includes('태아')) && !category.includes('유병자');
  const isPreExisting   = category === 'pre' || (category.includes('유병자') && !isChild);
  const isHeart         = category === 'heart' || category.includes('심장');
  const isCar           = category === 'car' || category.includes('자동차');
  const isDriver        = category === 'driver' || category.includes('운전자');
  const isPet           = category === 'pet' || category.includes('펫');
  const isGolf          = category === 'golf' || category === 'leisure' || category.includes('골프') || category.includes('레저');
  const isProperty      = category === 'property' || category === 'home' || (category.includes('재물') && !category.includes('주택화재'));
  const isFire          = category === 'fire_real' || ((category.includes('주택화재') || category.includes('화재')) && !isProperty);
  const isAnnuity       = category === 'annuity_savings' || category.includes('연금');
  const isWholeLife     = category === 'whole' || category.includes('종신');
  const isVariable      = category === 'variable' || category === 'term' || category.includes('변액') || category.includes('정기');
  const isLegal         = category === 'legal' || category.includes('법률') || category.includes('민사') || category.includes('형사');
  const isSavingsGeneral = category === 'savings_general' || category.includes('일반 저축');
  const isCredit        = category === 'credit' || category.includes('신용');
  const isHealthGeneral = category === 'health_general' || category.includes('종합건강');
  const isAccident      = category === 'accident' || category.includes('상해');

  
  const dbData = isDementia
    ? await fetchDementiaPremium(analysis)
    : isNursing
    ? await fetchHomeFacilityPremium(analysis)
    : isBrain 
    ? await fetchBrainPremium(analysis)
    : isCancer
    ? await fetchCancerPremium(analysis)
    : isSilson
    ? await fetchSilsonPremium(analysis)
    : isCaregiving
    ? await fetchCaregivingPremium(analysis)
    : isDental
    ? await fetchDentalPremium(analysis)
    : isSurgery
    ? await fetchSurgeryPremium(analysis)
    : isPreExisting
    ? await fetchPreExistingPremium(analysis)
    : isHeart
    ? await fetchHeartPremium(analysis)
    : isChild
    ? await fetchChildPremium(analysis)
    : isCar
    ? await fetchCarPremium(analysis)
    : isDriver
    ? await fetchDriverPremium(analysis)
    : isPet
    ? await fetchPetPremium(analysis)
    : isGolf
    ? await fetchGolfPremium(analysis)
    : isFire
    ? await fetchFirePremium(analysis)
    : isProperty
    ? await fetchPropertyPremium(analysis)
    : isAnnuity
    ? await fetchAnnuityPremium(analysis)
    : isWholeLife
    ? await fetchWholeLifePremium(analysis)
    : isVariable
    ? await fetchVariablePremium(analysis)
    : isLegal
    ? await fetchLegalPremium(analysis)
    : isSavingsGeneral
    ? await fetchSavingsPremium(analysis)
    : isCredit
    ? await fetchCreditPremium(analysis)
    : isHealthGeneral
    ? await fetchHealthGeneralPremium(analysis)
    : isAccident
    ? await fetchAccidentPremium(analysis)
    : await fetchPremiumFromDatabase(analysis);
     
  const realPremium = dbData ? dbData.premium : 0;
  
  // Inject the real premium and product info into the analysis object
  const augmentedAnalysis = { 
    ...analysis, 
    _realDbPremium: realPremium,
    _productName: dbData?.productName || '',
    _companyName: dbData?.companyName || '',
    _allOptions: (dbData as any)?._allOptions || [],
    _dietPlan: (dbData as any)?._dietPlan,
    _upgradePlan: (dbData as any)?._upgradePlan,
    _hybridPlan: (dbData as any)?._hybridPlan,
    _upgradePlans: (dbData as any)?._upgradePlans || [],
    _hybridPlans: (dbData as any)?._hybridPlans || []
  };

  // 2. 카테고리에 따른 전용 엔진 실행
  if (category.includes('실손') || category.includes('실비')) {
    return { analysis: augmentedAnalysis, ...analyzeSilson(augmentedAnalysis as any) };
  }
  
  if (category.includes('치매') || category === 'dementia') {
    return { analysis: augmentedAnalysis, ...analyzeDementia(augmentedAnalysis as any) };
  }

  if (category === 'nursing' || category.includes('재가') || category.includes('시설')) {
    return { analysis: augmentedAnalysis, ...analyzeHomeFacility(augmentedAnalysis as any) };
  }

  if (category.includes('간병')) {
    return { analysis: augmentedAnalysis, ...analyzeCaregiving(augmentedAnalysis as any) };
  }

  if (category.includes('치아')) {
    return { analysis: augmentedAnalysis, ...analyzeDental(augmentedAnalysis as any) };
  }

  if (category.includes('암') || category === 'cancer') {
    return { analysis: augmentedAnalysis, ...analyzeCancer(augmentedAnalysis as any) };
  }
  
  if (category.includes('뇌혈관') || category === 'brain') {
    return { analysis: augmentedAnalysis, ...analyzeBrain(augmentedAnalysis as any) };
  }

  if (category.includes('수술') || category.includes('입원')) {
    return { analysis: augmentedAnalysis, ...analyzeSurgery(augmentedAnalysis as any) };
  }

  if (isChild) {
    return { analysis: augmentedAnalysis, ...analyzeChild(augmentedAnalysis as any) };
  }

  if (category.includes('유병자')) {
    return { analysis: augmentedAnalysis, ...analyzePreExisting(augmentedAnalysis as any) };
  }

  if (category.includes('심장') || category === 'heart') {
    return { analysis: augmentedAnalysis, ...analyzeHeart(augmentedAnalysis as any) };
  }

  if (category.includes('자동차') || category === 'car') {
    return analyzeCar(augmentedAnalysis as any);
  }

  if (category.includes('운전자') || category === 'driver') {
    return analyzeDriver(augmentedAnalysis as any);
  }

  if (isPet) {
    return { analysis: augmentedAnalysis, ...analyzePet(augmentedAnalysis as any) };
  }

  if (isGolf) {
    return { analysis: augmentedAnalysis, ...analyzeGolf(augmentedAnalysis as any) };
  }

  if (isProperty) {
    return { analysis: augmentedAnalysis, ...analyzeProperty(augmentedAnalysis as any) };
  }

  if (isFire) {
    return { analysis: augmentedAnalysis, ...analyzeFire(augmentedAnalysis as any) };
  }

  if (isAnnuity) {
    return { analysis: augmentedAnalysis, ...analyzeAnnuity(augmentedAnalysis as any) };
  }

  if (isWholeLife) {
    return { analysis: augmentedAnalysis, ...analyzeWholeLife(augmentedAnalysis as any) };
  }

  if (isVariable) {
    return { analysis: augmentedAnalysis, ...analyzeVariable(augmentedAnalysis as any) };
  }

  if (isLegal) {
    return { analysis: augmentedAnalysis, ...analyzeLegal(augmentedAnalysis as any) };
  }

  if (isSavingsGeneral) {
    return { analysis: augmentedAnalysis, ...analyzeSavings(augmentedAnalysis as any) };
  }

  if (isCredit) {
    return { analysis: augmentedAnalysis, ...analyzeCredit(augmentedAnalysis as any) };
  }

  if (isHealthGeneral) {
    return { analysis: augmentedAnalysis, ...analyzeHealthGeneral(augmentedAnalysis as any) };
  }

  if (isAccident) {
    return { analysis: augmentedAnalysis, ...analyzeAccident(augmentedAnalysis as any) };
  }

  // 기본적으로 건강보험 엔진 사용
  return { analysis: augmentedAnalysis, ...analyzeHealth(augmentedAnalysis as any) };
};
