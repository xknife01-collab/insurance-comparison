/**
 * categoryMatcher.ts  (v2 — 비교 분석 Calculator와 동일한 파라미터 사용)
 *
 * 핵심 원칙:
 *   InsuranceCalculator(비교 분석)가 50대 암보험을 계산할 때 쓰는
 *   파라미터 세트를 그대로 구성하여 Loader를 호출합니다.
 *   → 나이 곱하기, 상품 타입 필터, 보장금액 모두 비교 분석과 동일
 *
 * 흐름:
 *   고객 policy (보험종류 + 월보험료 + riders)
 *     → detectCategoryFromPolicy() 카테고리 판별
 *     → buildAnalysisParams() 로 비교 분석과 동일한 파라미터 구성
 *     → 해당 Loader 호출 → 실제 상품명·회사명·보험료 반환
 */

import { fetchCancerPremium }        from '../insurance/cancer/cancerLoader';
import { fetchBrainPremium }         from '../insurance/brain/brainLoader';
import { fetchHeartPremium }         from '../insurance/heart/heartLoader';
import { fetchCaregivingPremium }    from '../insurance/caregiving/caregivingLoader';
import { fetchDriverPremium }        from '../insurance/driver/driverLoader';
import { fetchDentalPremium }        from '../insurance/dental/dentalLoader';
import { fetchSilsonPremium }        from '../insurance/silson/silsonLoader';
import { fetchDementiaPremium }      from '../insurance/dementia/dementiaLoader';
import { fetchChildPremium }         from '../insurance/child/childLoader';
import { fetchAccidentPremium }      from '../insurance/accident/accidentLoader';
import { fetchPetPremium }           from '../insurance/pet/petLoader';
import { fetchFirePremium }          from '../insurance/fire/fireLoader';
import { fetchCarPremium }           from '../insurance/car/carLoader';
import { fetchSurgeryPremium }       from '../insurance/surgery/surgeryLoader';
import { fetchPreExistingPremium }   from '../insurance/pre-existing/preExistingLoader';
// ✅ 추가 10개 카테고리 Loader
import { fetchGolfPremium }          from '../insurance/golf/golfLoader';
import { fetchAnnuityPremium }       from '../insurance/annuity/annuityLoader';
import { fetchWholeLifePremium }     from '../insurance/wholeLife/wholeLifeLoader';
import { fetchVariablePremium }      from '../insurance/variable/variableLoader';
import { fetchHomeFacilityPremium }  from '../insurance/home-facility/homeFacilityLoader';
import { fetchPropertyPremium }      from '../insurance/property/propertyLoader';
import { fetchLegalPremium }         from '../insurance/legal/legalLoader';
import { fetchSavingsPremium }       from '../insurance/savings/savingsLoader';
import { fetchCreditPremium }        from '../insurance/credit/creditLoader';
import { fetchHealthGeneralPremium } from '../insurance/healthGeneral/healthGeneralLoader';

import { RawInsurancePolicy } from '../../types/remodeling';
import { InsuranceAnalysis }  from '../../types/insurance';

// ─── 카테고리 판별 ────────────────────────────────────────────────────────────
export function detectCategoryFromPolicy(policy: RawInsurancePolicy): string {
  const name       = (policy.product_name || '').toLowerCase();
  const riderNames = (policy.riders || []).map(r => r.rider_name).join(' ').toLowerCase();
  const combined   = name + ' ' + riderNames;

  // Strip company names containing "화재" to prevent keyword collision during classification.
  const cleanCombined = combined
    .replace(/삼성\s*화재/g, '')
    .replace(/메리츠\s*화재/g, '')
    .replace(/흥국\s*화재/g, '')
    .replace(/롯데\s*화재/g, '')
    .replace(/한화\s*화재/g, '');
  
  const cleanName = name
    .replace(/삼성\s*화재/g, '')
    .replace(/메리츠\s*화재/g, '')
    .replace(/흥국\s*화재/g, '')
    .replace(/롯데\s*화재/g, '')
    .replace(/한화\s*화재/g, '');

  // 3대 진단비 특약 존재 여부
  const hasCancer = /암|cancer/i.test(cleanCombined);
  const hasBrain = /뇌|cerebro|stroke/i.test(cleanCombined);
  const hasHeart = /심장|허혈성|cardio|infarction/i.test(cleanCombined);
  const majorCount = [hasCancer, hasBrain, hasHeart].filter(Boolean).length;

  // 1. Highly specific niche categories first (to prevent keyword collision)
  if (/펫|반려/i.test(cleanCombined))                            return 'pet';
  if (/골프|레저/i.test(cleanCombined))                          return 'golf';
  if (/주택화재|화재/i.test(cleanCombined))                        return 'fire';
  if (/재물|점포/i.test(cleanCombined))                          return 'property';
  if (/자동차|car\s*insurance/i.test(cleanName))                 return 'car';
  if (/운전자/i.test(cleanName))                                 return 'driver';
  if (/민사|형사|법률|소송/i.test(cleanCombined))                return 'legal';
  if (/치아|치과|덴탈|크라운|임플란트/i.test(cleanCombined))       return 'dental';
  
  // 2. Financial & Investment categories
  if (/연금저축|연금/i.test(cleanCombined))                      return 'annuity';
  if (/저축/i.test(cleanCombined))                               return 'savings';
  if (/신용|대출|상환/i.test(cleanCombined))                     return 'credit';
  if (/변액|정기/i.test(cleanCombined))                          return 'variable';
  if (/종신|whole/i.test(cleanName))                           return 'whole';
  
  // 3. Pre-existing conditions
  if (/유병력자/i.test(cleanCombined))                           return 'pre_family';
  if (/유병자|간편고지|3\.[0-5]\.[0-5]/i.test(cleanCombined))     return 'pre_existing';
  
  // 3.5. Comprehensive Health check (Moved up to prevent comprehensive policies from being misclassified as cancer/silson)
  if (majorCount >= 2 || /종합|통합|건강|다사랑|굿밸런스/i.test(cleanName)) return 'health';

  // 4. Silson (Loss) & Care/Nursing
  if (/실손|실비|의료실비|의료비/i.test(cleanCombined))            return 'silson';
  if (/재가|시설|요양/i.test(cleanCombined))                      return 'nursing';
  if (/간병인|간병지원/i.test(cleanCombined))                     return 'caregiving';
  if (/치매/i.test(cleanCombined))                               return 'dementia';
  if (/어린이|자녀|태아|신생아/i.test(cleanCombined))              return 'child';
  
  // 5. General accident/surgery/specific disease categories
  if (/상해/i.test(cleanCombined))                               return 'accident';
  if (/수술.*입원|입원.*수술|수술비|입원일당/i.test(cleanCombined)) return 'surgery_hospital';
  if (hasCancer)                                            return 'cancer';
  if (hasBrain)                                             return 'brain';
  if (hasHeart)                                             return 'heart';

  return 'health';
}

export function getCategoryLabel(categoryId: string): string {
  const map: Record<string, string> = {
    cancer: '암보험', brain: '뇌혈관보험', heart: '심장질환보험',
    caregiving: '간병보험', driver: '운전자보험', dental: '치아보험',
    silson: '실손보험', dementia: '치매보험', child: '어린이보험',
    accident: '상해보험', pet: '펫보험', fire: '화재보험',
    car: '자동차보험', surgery_hospital: '수술·입원보험', pre_existing: '유병자보험',
    pre_family: '유병력자 전용보험', nursing: '재가/시설보험',
    golf: '골프/레저보험', annuity: '연금저축보험', whole: '종신보험',
    variable: '변액/정기보험', legal: '민사/형사보험', savings: '일반저축보험',
    credit: '신용보험', property: '재물종합보험', health: '종합건강보험',
  };
  return map[categoryId] || categoryId;
}

// ─── 비교 분석 Calculator와 동일한 파라미터 세트 구성 ───────────────────────────
function buildAnalysisParams(
  policy: RawInsurancePolicy,
  baseAnalysis: InsuranceAnalysis,
  categoryId: string
): InsuranceAnalysis {
  const riders = policy.riders || [];

  // riders에서 보장금액 추출 헬퍼
  const getAmount = (keywords: string[]): number => {
    for (const r of riders) {
      const n = r.rider_name;
      if (keywords.some(k => n.includes(k)) && r.coverage_amount > 0) {
        return r.coverage_amount;
      }
    }
    return 0;
  };

  const hasRider = (keywords: string[]): boolean =>
    riders.some(r => keywords.some(k => r.rider_name.includes(k)));

  // 월보험료 → 보장금액 역산 (비교 분석과 동일한 공식)
  const p = policy.monthly_premium;

  const pa: InsuranceAnalysis = {
    ...baseAnalysis,
    selectedCategory: categoryId,
  };

  switch (categoryId) {
    // ── 암보험 ─────────────────────────────────────────────────────────────────
    case 'cancer': {
      // ✅ handleAuthSuccess에서 넘어온 Fields값 우선 사용 (비교 분석과 동일)
      const existing = (baseAnalysis as any).cancer || {};
      const diagAmt = existing.currentAmount
        || getAmount(['일반암진단', '암진단비', '일반암'])
        || (p * 600);
      (pa as any).cancer = {
        currentAmount:    diagAmt,
        targetAmount:     diagAmt,
        paymentType:      existing.paymentType   || (hasRider(['갱신형']) ? 'renewable' : 'non-renewable'),
        familyHistory:    existing.familyHistory  ?? false,
        treatmentCost2025: existing.treatmentCost2025 ?? hasRider(['주요치료비', '암치료비']),
        targetedTherapy:  existing.targetedTherapy  ?? hasRider(['표적항암', '중입자']),
        recurrentCancer:  existing.recurrentCancer  ?? hasRider(['재발암', '재진단암', '전이암']),
      };
      break;
    }
    // ── 뇌혈관 ─────────────────────────────────────────────────────────────────
    case 'brain': {
      const existing = (baseAnalysis as any).cerebrovascular || {};
      const diagAmt = existing.currentAmount
        || getAmount(['뇌혈관질환진단', '뇌졸중진단', '뇌혈관'])
        || (p * 500);
      const strokeAmt = existing.strokeAmount
        || getAmount(['뇌졸중', '뇌출혈'])
        || Math.round(diagAmt * 0.6);
      (pa as any).cerebrovascular = {
        currentAmount: diagAmt,
        targetAmount:  diagAmt,
        strokeAmount:  strokeAmt,
        surgeryAmount: getAmount(['뇌수술비', '뇌혈관수술']) || 10_000_000,
        paymentType:   existing.paymentType || 'non-renewable',
        surgeryBenefit: existing.surgeryBenefit ?? false,
      };
      break;
    }
    // ── 심장질환 ───────────────────────────────────────────────────────────────
    case 'heart': {
      const existing = (baseAnalysis as any).cardiovascular || {};
      const diagAmt = existing.currentAmount
        || getAmount(['허혈성심장', '심장질환진단', '심근경색'])
        || (p * 500);
      (pa as any).cardiovascular = {
        currentAmount:    diagAmt,
        targetAmount:     diagAmt,
        infarctionAmount: getAmount(['급성심근경색']) || Math.round(diagAmt * 0.6),
        surgeryAmount:    getAmount(['심장수술', '스텐트']) || 10_000_000,
        healthType:       existing.healthType    || 'normal',
        coverageLevel:    existing.coverageLevel || 'standard',
        paymentType:      'non-renewable',
      };
      break;
    }
    // ── 실손 ───────────────────────────────────────────────────────────────────
    case 'silson': {
      const existing = (baseAnalysis as any).silson || {};
      (pa as any).silson = {
        generation:        existing.generation        || '4세대',
        hasNonBenefitShot: existing.hasNonBenefitShot ?? hasRider(['주사제', '비급여주사']),
        hasNonBenefitMRI:  existing.hasNonBenefitMRI  ?? hasRider(['MRI', '비급여MRI']),
        selfPayRate:       existing.selfPayRate        || 20,
      };
      break;
    }
    // ── 치아 ───────────────────────────────────────────────────────────────────
    case 'dental': {
      const existing = (baseAnalysis as any).dental || {};
      (pa as any).dental = {
        implantLimit:   existing.implantLimit   || getAmount(['임플란트']) || 1_500_000,
        crownAmount:    existing.crownAmount    || getAmount(['크라운', '금니']) || 300_000,
        conserveAmount: existing.conserveAmount || getAmount(['레진', '인레이', '보존']) || 150_000,
        bridgeAmount:   existing.bridgeAmount   || getAmount(['브릿지']) || 0,
        waitingPeriod:  3,
      };
      break;
    }
    // ── 수술·입원 ──────────────────────────────────────────────────────────────
    case 'surgery_hospital': {
      const existing = (baseAnalysis as any).surgery || {};
      (pa as any).surgery = {
        surgeryLimit:     existing.currentAmount    || getAmount(['수술비', '1-5종수술']) || (p * 15),
        hospitalDailyAmt: existing.hospitalDailyAmt || getAmount(['입원일당']) || 50_000,
        icuDailyAmt:      getAmount(['중환자실']) || 100_000,
        surgeryFocus:     existing.surgeryFocus || 'wide',
        paymentType:      'non-renewable',
      };
      break;
    }
    // ── 간병 ───────────────────────────────────────────────────────────────────
    case 'caregiving': {
      const existing = (baseAnalysis as any).caregiving || {};
      (pa as any).caregiving = {
        dailyBenefit:      existing.dailyBenefit || getAmount(['간병인사용', '간병일당']) || 150_000,
        hasCaregiverSupport: existing.hasCaregiverSupport ?? hasRider(['간병인지원', '직접파견']),
        paymentType:       'non-renewable',
      };
      break;
    }
    // ── 치매 ───────────────────────────────────────────────────────────────────
    case 'dementia': {
      const existing = (baseAnalysis as any).dementia || {};
      (pa as any).dementia = {
        severeDiagAmt:   existing.severeDiagAmt   || getAmount(['중증치매', 'CDR3']) || 20_000_000,
        mildDiagAmt:     existing.mildDiagAmt     || getAmount(['경도치매', 'CDR1']) || 5_000_000,
        moderateDiagAmt: existing.moderateDiagAmt || getAmount(['중등도', 'CDR2']) || 10_000_000,
        caregiverAmt:    getAmount(['간병지원', '치매간병']) || 0,
        paymentType:     'non-renewable',
      };
      break;
    }
    // ── 운전자 ────────────────────────────────────────────────────────────────
    case 'driver': {
      const existing = (baseAnalysis as any).driver || {};
      (pa as any).driver = {
        drivingPurpose: existing.drivingPurpose || 'private',
        jobClass:       existing.jobClass       || 1,
        planType:       existing.planType       || 'standard',
        liabilityAmt:  existing.liabilityAmt  || getAmount(['교통사고처리지원금', '형사합의']) || 200_000_000,
        lawyerAmt:     existing.lawyerAmt     || getAmount(['변호사선임']) || 50_000_000,
        fineDaeinAmt:  existing.fineDaeinAmt  || getAmount(['대인벌금', '벌금']) || 30_000_000,
        fineDaemulAmt: existing.fineDaemulAmt || getAmount(['대물벌금']) || 5_000_000,
        injuryAmt:     existing.injuryAmt     || getAmount(['자부상', '부상치료비']) || 300_000,
        vehicleType:   existing.vehicleType   || '자가용',
      };
      break;
    }
    // ── 상해 ──────────────────────────────────────────────────────────────────
    case 'accident': {
      const existing = (baseAnalysis as any).accident || {};
      (pa as any).accident = {
        deathAmt:      existing.deathAmt      || getAmount(['상해사망', '재해사망']) || (p * 1000),
        disabilityAmt: existing.disabilityAmt || getAmount(['후유장해', '장해']) || (p * 500),
        fractureAmt:   existing.fractureAmt   || getAmount(['골절']) || 300_000,
        leisureRider:  existing.leisureRider  ?? hasRider(['레저', '스포츠']),
      };
      break;
    }
    // ── 어린이 ────────────────────────────────────────────────────────────────
    case 'child': {
      const existing = (baseAnalysis as any).child || {};
      (pa as any).child = {
        cancerAmt: existing.cancerAmt || getAmount(['소아암', '3대진단', '암진단']) || (p * 800),
        adhdAmt:   existing.adhdAmt   || getAmount(['ADHD', '우울증']) || 3_000_000,
        fluAmt:    existing.fluAmt    || getAmount(['독감', '인플루엔자']) || 100_000,
        birthType: existing.birthType || 'born',
      };
      break;
    }
    // ── 펫 ────────────────────────────────────────────────────────────────────
    case 'pet': {
      const existing = (baseAnalysis as any).pet || {};
      (pa as any).pet = {
        petType:      existing.petType      || 'dog',
        petName:      existing.petName      || '우리애기',
        breed:        existing.breed        || '말티즈',
        birthYearMonth: existing.birthYearMonth || '202305',
        selfPayRatio: existing.selfPayRatio || 70,
        deductible:   existing.deductible   || 30000,
        isRegistered: existing.isRegistered ?? false,
        patellaRider: existing.patellaRider ?? hasRider(['슬개골', '고관절']),
        skinRider:    existing.skinRider    ?? hasRider(['피부염', '귓병', '외이염']),
        dentalRider:  existing.dentalRider  ?? hasRider(['구강', '스케일링']),
        liabilityAmt: existing.liabilityAmt || getAmount(['배상책임']) || 10_000_000,
      };
      break;
    }
    case 'fire': {
      const existing = (baseAnalysis as any).fire || {};
      (pa as any).fire = {
        residenceType:            existing.residenceType || 'apartment',
        occupancyType:            existing.occupancyType || 'owner',
        buildingArea:             existing.buildingArea || 84,
        structureGrade:           existing.structureGrade || 1,
        hasWaterLeakRider:        existing.hasWaterLeakRider ?? existing.hasWaterLeak ?? hasRider(['급배수', '누수', '누출']),
        hasLiabilityRider:        existing.hasLiabilityRider ?? hasRider(['화재배상', '대물배상', '배상책임']),
        hasTemporaryHousingRider: existing.hasTemporaryHousingRider ?? hasRider(['임시거주', '전세금']),
        buildingLimit:            existing.buildingLimit || existing.buildingAmt || getAmount(['건물복구', '건물']) || 100_000_000,
        householdGoodsLimit:      existing.householdGoodsLimit || existing.contentsAmt || getAmount(['가재도구', '가재']) || 30_000_000,
      };
      break;
    }
    // ── 자동차 ────────────────────────────────────────────────────────────────
    case 'car': {
      const existing = (baseAnalysis as any).car || {};
      (pa as any).car = {
        propertyLimit: existing.propertyLimit || getAmount(['대물배상']) || 1_000_000_000,
        ownDamage:     existing.ownDamage     || (hasRider(['자차', '자기차량']) ? 'join' : 'none'),
        injuryType:    existing.injuryType    || (hasRider(['자상', '자동차상해']) ? 'jasang' : 'jason'),
        driverLimit:   existing.driverLimit   || (hasRider(['부부']) ? 'couple' : hasRider(['가족']) ? 'family' : 'single'),
        safeScore:     existing.safeScore     || (hasRider(['티맵', '안전운전']) ? 80 : 0),
      };
      break;
    }
    // ── 유병자 ────────────────────────────────────────────────────────────────
    case 'pre_existing': {
      const existing = (baseAnalysis as any).preExisting || {};
      (pa as any).preExisting = {
        cancerAmt:  existing.cancerAmt  || getAmount(['일반암진단', '암진단']) || (p * 150),
        brainAmt:   existing.brainAmt   || getAmount(['뇌혈관', '뇌졸중']) || (p * 100),
        heartAmt:   existing.heartAmt   || getAmount(['허혈성', '심근경색']) || (p * 100),
        noticeType: existing.noticeType || '3년고지',
      };
      break;
    }
    // ── 재가/시설 ────────────────────────────────────────────────────────────
    case 'nursing': {
      const existing = (baseAnalysis as any).nursing || {};
      (pa as any).nursing = {
        preferredService: existing.preferredService || 'both',
        homeAmount:       existing.homeAmount       || getAmount(['방문요양', '재가급여']) || 500_000,
        facilityAmount:   existing.facilityAmount   || getAmount(['시설급여', '요양원']) || 500_000,
        hasProxyClaim:    existing.hasProxyClaim    ?? true,
      };
      break;
    }
    // ── 골프/레저 ────────────────────────────────────────────────────────────
    case 'golf': {
      const existing = (baseAnalysis as any).golf || {};
      (pa as any).golf = {
        gameType:          existing.gameType          || 'amateur',
        planType:          existing.planType          || 'annual',
        durationDays:      existing.durationDays      || 365,
        hasHoleInOneRider: existing.hasHoleInOneRider ?? true,
        hasLiabilityRider: existing.hasLiabilityRider ?? true,
        hasEquipmentRider: existing.hasEquipmentRider ?? true,
        isGroup:           existing.isGroup           ?? false,
      };
      break;
    }
    // ── 연금저축 ─────────────────────────────────────────────────────────────
    case 'annuity': {
      const existing = (baseAnalysis as any).annuity || {};
      (pa as any).annuity = {
        annuityType:      existing.annuityType      || 'savings',
        monthlyPremium:   existing.monthlyPremium   || p,
        paymentPeriod:    existing.paymentPeriod    || 10,
        commencementAge:  existing.commencementAge  || 60,
        annualIncome:     existing.annualIncome     || 50_000_000,
        hasIrp:           existing.hasIrp           ?? false,
        receivingPeriod:  existing.receivingPeriod  || 20,
      };
      break;
    }
    // ── 종신 ─────────────────────────────────────────────────────────────────
    case 'whole': {
      const existing = (baseAnalysis as any).wholeLife || {};
      (pa as any).wholeLife = {
        objective:     existing.objective     || 'family',
        paymentPeriod: existing.paymentPeriod || 20,
        deathBenefit:  existing.deathBenefit  || getAmount(['사망보험금', '주계약사망']) || 100_000_000,
        refundType:    existing.refundType    || 'low',
        isStepUp:      existing.isStepUp      ?? false,
      };
      break;
    }
    // ── 변액/정기 ────────────────────────────────────────────────────────────
    case 'variable': {
      const existing = (baseAnalysis as any).variable || {};
      (pa as any).variable = {
        subType:         existing.subType         || 'variable_pension',
        monthlyPremium:  existing.monthlyPremium  || p,
        paymentPeriod:   existing.paymentPeriod   || 10,
        investmentStyle: existing.investmentStyle || 'balanced',
        equityRatio:     existing.equityRatio     || 50,
      };
      break;
    }
    case 'property': {
      const existing = (baseAnalysis as any).property || {};
      const bAmt = existing.buildingLimit || existing.buildingAmt || getAmount(['건물']) || 200_000_000;
      const cAmt = existing.interiorLimit || existing.contentsAmt || getAmount(['집기비품', '재물', '가재']) || 50_000_000;
      (pa as any).property = {
        businessType:            existing.businessType            || 'restaurant',
        buildingGrade:           existing.buildingGrade           || 'grade_1',
        buildingLimit:           bAmt,
        interiorLimit:           cAmt,
        equipmentLimit:          existing.equipmentLimit          || 30_000_000,
        inventoryLimit:          existing.inventoryLimit          || 20_000_000,
        hasWaterLeak:            existing.hasWaterLeak            ?? hasRider(['급배수', '누수', '누출']),
        hasPremisesLiability:    existing.hasPremisesLiability    ?? hasRider(['배상책임', '시설배상']),
        hasBusinessInterruption: existing.hasBusinessInterruption ?? hasRider(['휴업손해', '휴업']),
        hasFoodLiability:        existing.hasFoodLiability        ?? hasRider(['음식물', '식중독']),
        hasMachineryBreakdown:   existing.hasMachineryBreakdown   ?? hasRider(['기계고장', '전기손해']),
        subType:                 existing.subType                 || '상가 화재형',
      };
      break;
    }
    // ── 민사/형사 ────────────────────────────────────────────────────────────
    case 'legal': {
      const existing = (baseAnalysis as any).legal || {};
      (pa as any).legal = {
        litigationType: existing.litigationType || 'civil',
        lawyerLimit:    existing.lawyerLimit    || getAmount(['변호사선임비']) || 10_000_000,
        courtFeeLimit:  existing.courtFeeLimit  || 10_000_000,
        deductibleType: existing.deductibleType || 'none',
      };
      break;
    }
    // ── 일반 저축 ────────────────────────────────────────────────────────────
    case 'savings': {
      const existing = (baseAnalysis as any).savings || {};
      (pa as any).savings = {
        savingType:        existing.savingType        || 'installment',
        monthlyPremium:    existing.monthlyPremium    || p,
        paymentPeriod:     existing.paymentPeriod     || 5,
        maintenancePeriod: existing.maintenancePeriod || 10,
        savingsObjective:  existing.savingsObjective  || 'wealth',
        hasUniversal:      existing.hasUniversal      ?? true,
      };
      break;
    }
    // ── 신용보험 ─────────────────────────────────────────────────────────────
    case 'credit': {
      const existing = (baseAnalysis as any).credit || {};
      (pa as any).credit = {
        loanType:          existing.loanType          || 'mortgage',
        loanAmount:        existing.loanAmount        || getAmount(['대출금', '보증']) || 100_000_000,
        loanPeriod:        existing.loanPeriod        || 10,
        creditBureau:      existing.creditBureau      || 'nice',
        creditScore:       existing.creditScore       || 850,
        hasIllnessRider:   existing.hasIllnessRider   ?? true,
        hasDisabilityRider: existing.hasDisabilityRider ?? true,
      };
      break;
    }
    // ── 유병력자 전용 ────────────────────────────────────────────────────────
    case 'pre_family': {
      // preExistingLoader를 공용으로 사용 (간편고지 동일 구조)
      const existing = (baseAnalysis as any).preExisting || {};
      (pa as any).preExisting = {
        cancerAmt:  existing.cancerAmt  || getAmount(['일반암진단', '암진단']) || (p * 150),
        brainAmt:   existing.brainAmt   || getAmount(['뇌혈관', '뇌졸중']) || (p * 100),
        heartAmt:   existing.heartAmt   || getAmount(['허혈성', '심근경색']) || (p * 100),
        noticeType: existing.noticeType || '2년고지',
      };
      break;
    }
    // ── 종합건강 ─────────────────────────────────────────────────────────────
    case 'health': {
      const existing = (baseAnalysis as any).healthGeneral || {};
      (pa as any).healthGeneral = {
        cancerLimit:       existing.cancerLimit       || getAmount(['일반암진단', '암진단비']) || 50_000_000,
        similarCancerLimit: existing.similarCancerLimit || getAmount(['유사암', '소액암']) || 10_000_000,
        brainLimit:        existing.brainLimit        || getAmount(['뇌혈관']) || 20_000_000,
        heartLimit:        existing.heartLimit        || getAmount(['허혈성', '심장']) || 20_000_000,
        cardioLimit:        existing.cardioLimit        || getAmount(['심혈관', '부정맥']) || 10_000_000,
        has1to5Surgery:    existing.has1to5Surgery    ?? true,
        hasTargetedTherapy: existing.hasTargetedTherapy ?? true,
        hasThrombolysis:    existing.hasThrombolysis    ?? false,
        hasLiability:       existing.hasLiability       ?? true,
        paymentPeriod:      existing.paymentPeriod      || 20,
        coveragePeriod:     existing.coveragePeriod     || 90,
        isRenewable:       existing.isRenewable       ?? false,
        refundType:        existing.refundType        || 'low',
      };
      break;
    }
    default:
      break;
  }

  return pa;
}

// ─── 단일 policy → Loader 호출 → 다이어트·업그레이드 옵션 반환 ──────────────────
export async function fetchOptionsForPolicy(
  policy: RawInsurancePolicy,
  baseAnalysis: InsuranceAnalysis,
  categoryId: string
): Promise<{ dietOptions: any[]; upgradeOptions: any[]; categoryLabel: string }> {
  const categoryLabel  = getCategoryLabel(categoryId);
  const currentPremium = policy.monthly_premium;

  // 비교 분석 Calculator와 동일한 파라미터 세트 구성
  const policyAnalysis = buildAnalysisParams(policy, baseAnalysis, categoryId);

  let loaderResult: any = null;
  try {
    switch (categoryId) {
      case 'cancer':       loaderResult = await fetchCancerPremium(policyAnalysis);       break;
      case 'brain':        loaderResult = await fetchBrainPremium(policyAnalysis);        break;
      case 'heart':        loaderResult = await fetchHeartPremium(policyAnalysis);        break;
      case 'caregiving':   loaderResult = await fetchCaregivingPremium(policyAnalysis);   break;
      case 'driver':       loaderResult = await fetchDriverPremium(policyAnalysis);       break;
      case 'dental':       loaderResult = await fetchDentalPremium(policyAnalysis);       break;
      case 'silson':       loaderResult = await fetchSilsonPremium(policyAnalysis);       break;
      case 'dementia':     loaderResult = await fetchDementiaPremium(policyAnalysis);     break;
      case 'child':        loaderResult = await fetchChildPremium(policyAnalysis);        break;
      case 'accident':     loaderResult = await fetchAccidentPremium(policyAnalysis);     break;
      case 'pet':          loaderResult = await fetchPetPremium(policyAnalysis);          break;
      case 'fire':         loaderResult = await fetchFirePremium(policyAnalysis);         break;
      case 'car':          loaderResult = await fetchCarPremium(policyAnalysis);          break;
      case 'surgery_hospital': loaderResult = await fetchSurgeryPremium(policyAnalysis);      break;
      case 'pre_existing': loaderResult = await fetchPreExistingPremium(policyAnalysis);  break;
      // ✅ 추가 10개
      case 'golf':         loaderResult = await fetchGolfPremium(policyAnalysis);         break;
      case 'annuity':      loaderResult = await fetchAnnuityPremium(policyAnalysis);      break;
      case 'whole':        loaderResult = await fetchWholeLifePremium(policyAnalysis);    break;
      case 'variable':     loaderResult = await fetchVariablePremium(policyAnalysis);     break;
      case 'nursing':      loaderResult = await fetchHomeFacilityPremium(policyAnalysis); break;
      case 'property':     loaderResult = await fetchPropertyPremium(policyAnalysis);     break;
      case 'legal':        loaderResult = await fetchLegalPremium(policyAnalysis);        break;
      case 'savings':      loaderResult = await fetchSavingsPremium(policyAnalysis);      break;
      case 'credit':       loaderResult = await fetchCreditPremium(policyAnalysis);       break;
      case 'pre_family':   loaderResult = await fetchPreExistingPremium(policyAnalysis);  break;
      case 'health':       loaderResult = await fetchHealthGeneralPremium(policyAnalysis);break;
      default:             loaderResult = null;
    }
  } catch (e) {
    console.warn(`[CategoryMatcher] Loader 실패 (${categoryId}):`, e);
  }

  // Loader 실패 시 fallback
  if (!loaderResult) {
    const fallbackItem = {
      companyName: policy.insurance_company || '국내보험사',
      productName: policy.product_name      || categoryLabel,
      premium:     currentPremium,
      category:    categoryLabel,
      features:    '현재 보험료 기준',
    };
    return { categoryLabel, dietOptions: [fallbackItem], upgradeOptions: [fallbackItem] };
  }

  const allOptions: any[] = loaderResult._allOptions || [loaderResult];

  const isSavingsType = categoryId === 'annuity' || categoryId === 'savings';
  const pool = isSavingsType 
    ? [...allOptions].sort((a, b) => (b.declaredRate || 0) - (a.declaredRate || 0))
    : allOptions;

  // 다이어트: 현재 보험료보다 저렴한 상품 먼저 (오름차순 상위 6개)
  const dietOptions = [...pool]
    .map(opt => {
      let finalPremium = opt.premium;
      let features = `동일 보장 유지 | ${opt.category || '비갱신형'}`;
      
      if (isSavingsType) {
        const baselineNet = 0.95;
        const baselineRate = 0.025 / 12;
        const optRate = (opt.declaredRate || 2.8) / 100 / 12;
        const optNet = 1 - (opt.businessFee || 5.0) / 100;
        const rateFactor = Math.pow((1 + baselineRate) / (1 + optRate), 120);
        const netFactor = baselineNet / optNet;
        let dietPrem = currentPremium * netFactor * rateFactor;
        dietPrem = Math.min(currentPremium - 2000, dietPrem);
        finalPremium = Math.max(10000, Math.round(dietPrem / 1000) * 1000);
        
        const rateText = opt.declaredRate ? `${opt.declaredRate.toFixed(2)}%` : '2.80%';
        const ratioText = opt.refundRatio ? `${opt.refundRatio.toFixed(1)}%` : '120.0%';
        features = `동일 적립 목표 | 공시이율 ${rateText} | 환급률 ${ratioText}`;
      }

      return {
        companyName: opt.companyName || opt.company || '국내보험사',
        productName: opt.productName || opt.product || categoryLabel,
        premium:     finalPremium,
        category:    categoryLabel,
        features:    features,
        saving:      Math.max(0, currentPremium - finalPremium),
      };
    })
    .sort((a, b) => a.premium - b.premium)
    .slice(0, 6);

  // 업그레이드: 현재 보험료 ±20% 범위, 없으면 보험료 높은 순 상위 6개
  const budgetMin = currentPremium * 0.8;
  const budgetMax = currentPremium * 1.2;
  let upgradePool = isSavingsType 
    ? [...pool]
    : pool.filter(o => o.premium >= budgetMin && o.premium <= budgetMax);
    
  if (!isSavingsType && upgradePool.length === 0) {
    upgradePool = [...pool].sort((a, b) => b.premium - a.premium).slice(0, 6);
  }

  const upgradeOptions = upgradePool
    .map(opt => {
      let finalPremium = isSavingsType ? currentPremium : opt.premium;
      let features = `동일 예산 보장 강화 | ${opt.category || '비갱신형'}`;
      
      if (isSavingsType) {
        const rateText = opt.declaredRate ? `${opt.declaredRate.toFixed(2)}%` : '2.80%';
        const ratioText = opt.refundRatio ? `${opt.refundRatio.toFixed(1)}%` : '120.0%';
        features = `동일 예산 적립 강화 | 공시이율 ${rateText} | 환급률 ${ratioText}`;
      }

      return {
        companyName: opt.companyName || opt.company || '국내보험사',
        productName: opt.productName || opt.product || categoryLabel,
        premium:     finalPremium,
        category:    categoryLabel,
        features:    features,
        saving:      Math.max(0, currentPremium - finalPremium),
      };
    })
    .slice(0, 6);

  return { categoryLabel, dietOptions, upgradeOptions };
}

// ─── 전체 policies 처리 → allDietOptions / allUpgradeOptions 반환 ─────────────
export async function buildCategoryOptions(
  policies: RawInsurancePolicy[],
  baseAnalysis: InsuranceAnalysis
): Promise<{ allDietOptions: any[]; allUpgradeOptions: any[] }> {
  if (!policies || policies.length === 0) {
    return { allDietOptions: [], allUpgradeOptions: [] };
  }

  const allDietOptions:    any[] = [];
  const allUpgradeOptions: any[] = [];

  await Promise.all(
    policies.map(async (policy) => {
      const categoryId = detectCategoryFromPolicy(policy);
      const { dietOptions, upgradeOptions, categoryLabel } =
        await fetchOptionsForPolicy(policy, baseAnalysis, categoryId);

      const tag = {
        currentPremium: policy.monthly_premium,
        currentCompany: policy.insurance_company,
        currentProduct: policy.product_name,
        categoryLabel,
      };

      dietOptions.forEach(opt    => allDietOptions.push({ ...opt, ...tag }));
      upgradeOptions.forEach(opt => allUpgradeOptions.push({ ...opt, ...tag }));
    })
  );

  allDietOptions.sort((a, b)    => a.premium - b.premium);
  allUpgradeOptions.sort((a, b) => b.saving  - a.saving);

  return { allDietOptions, allUpgradeOptions };
}
