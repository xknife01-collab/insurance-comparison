import { InsuranceAnalysis, AnalysisResult } from '../types/insurance';
import { analyzeHealth } from './engines/healthEngine';
import { fetchSilsonPremium } from './insurance/silson/silsonLoader';
import { analyzeSilson } from './insurance/silson/silsonEngine';
import { fetchCaregivingPremium } from './insurance/caregiving/caregivingLoader';
import { analyzeCaregiving } from './insurance/caregiving/caregivingEngine';
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
import { fetchPremiumFromDatabase } from './engines/databaseLoader';


export const runAnalysis = async (analysis: InsuranceAnalysis): Promise<any> => {
  const category = analysis.selectedCategory || '';
  
  // 1. Fetch real premium from the Supabase database
  const isBrain = category.includes('뇌혈관') || category === 'brain';
  const isCancer = category.includes('암') || category === 'cancer';
  const isSilson = category.includes('실손') || category.includes('실비');
  const isCaregiving = category.includes('간병');
  const isDental = category.includes('치아') || category.includes('dental');
  const isSurgery = category.includes('수술') || category.includes('입원');
  const isPreExisting = category.includes('유병자');
  const isHeart = category.includes('심장') || category === 'heart';
  
  const dbData = isBrain 
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

  if (category.includes('유병자')) {
    return { analysis: augmentedAnalysis, ...analyzePreExisting(augmentedAnalysis as any) };
  }

  if (category.includes('심장') || category === 'heart') {
    return { analysis: augmentedAnalysis, ...analyzeHeart(augmentedAnalysis as any) };
  }

  // 기본적으로 건강보험 엔진 사용
  return { analysis: augmentedAnalysis, ...analyzeHealth(augmentedAnalysis as any) };
};
