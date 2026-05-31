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
import { analyzeDriver } from './insurance/driver/driverEngine';
import { fetchDriverPremium } from './insurance/driver/driverLoader';
import { fetchPremiumFromDatabase } from './engines/databaseLoader';
import { fetchPetPremium } from './insurance/pet/petLoader';
import { analyzePet } from './insurance/pet/petEngine';
import { fetchGolfPremium } from './insurance/golf/golfLoader';
import { analyzeGolf } from './insurance/golf/golfEngine';
import { fetchFirePremium } from './insurance/fire/fireLoader';
import { analyzeFire } from './insurance/fire/fireEngine';
import { fetchAnnuityPremium } from './insurance/annuity/annuityLoader';
import { analyzeAnnuity } from './insurance/annuity/annuityEngine';
import { fetchWholeLifePremium } from './insurance/wholeLife/wholeLifeLoader';
import { analyzeWholeLife } from './insurance/wholeLife/wholeLifeEngine';

export const runAnalysis = async (analysis: InsuranceAnalysis): Promise<any> => {
  const category = analysis.selectedCategory || '';
  
  // 1. Fetch real premium from the Supabase database
  const isDementia = category.includes('치매') || category === 'dementia';
  const isNursing = category === 'nursing' || category.includes('재가') || category.includes('시설');
  const isBrain = category.includes('뇌혈관') || category === 'brain';
  const isCancer = category.includes('암') || category === 'cancer';
  const isSilson = category.includes('실손') || category.includes('실비');
  const isCaregiving = category.includes('간병') && !isDementia && !isNursing;
  const isDental = category.includes('치아') || category.includes('dental');
  const isSurgery = category.includes('수술') || category.includes('입원');
  const isChild = category.includes('어린이') || category.includes('태아') || category === 'child' || category === 'pre_family' || !!analysis.child;
  const isPreExisting = category.includes('유병자') && !isChild;
  const isHeart = category.includes('심장') || category === 'heart';
  const isCar = category.includes('자동차') || category === 'car';
  const isDriver = category.includes('운전자') || category === 'driver';
  const isPet = category.includes('펫') || category === 'pet' || !!analysis.pet;
  const isGolf = category.includes('골프') || category.includes('레저') || category === 'golf' || category === 'leisure' || !!analysis.golf;
  const isFire = category.includes('주택화재') || category.includes('화재') || category === 'fire_real' || !!analysis.fire;
  const isAnnuity = category.includes('연금') || category === 'annuity_savings' || !!analysis.annuity;
  const isWholeLife = category.includes('종신') || category === 'whole' || !!analysis.wholeLife;
  
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
    : isDriver
    ? await fetchDriverPremium(analysis)
    : isPet
    ? await fetchPetPremium(analysis)
    : isGolf
    ? await fetchGolfPremium(analysis)
    : isFire
    ? await fetchFirePremium(analysis)
    : isAnnuity
    ? await fetchAnnuityPremium(analysis)
    : isWholeLife
    ? await fetchWholeLifePremium(analysis)
    : await fetchPremiumFromDatabase(analysis);
     
  const realPremium = dbData ? dbData.premium : 0;
  
  // Inject the real premium and product info into the analysis object
  const augmentedAnalysis = { 
    ...analysis, 
    _realDbPremium: realPremium,
    _productName: dbData?.productName || '',
    _companyName: dbData?.companyName || '',
    _allOptions: (dbData as any)?._allOptions || []
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

  if (isFire) {
    return { analysis: augmentedAnalysis, ...analyzeFire(augmentedAnalysis as any) };
  }

  if (isAnnuity) {
    return { analysis: augmentedAnalysis, ...analyzeAnnuity(augmentedAnalysis as any) };
  }

  if (isWholeLife) {
    return { analysis: augmentedAnalysis, ...analyzeWholeLife(augmentedAnalysis as any) };
  }

  // 기본적으로 건강보험 엔진 사용
  return { analysis: augmentedAnalysis, ...analyzeHealth(augmentedAnalysis as any) };
};
