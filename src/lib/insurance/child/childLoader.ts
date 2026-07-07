import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

const MOCK_CHILD_PRODUCTS = [
  // Prenatal (태아)
  { companyName: '현대해상', productName: '굿앤굿어린이종합보험(태아형)', basePremium30M: 32000, basePremium100M: 78000, category: 'hospitalization', targetCategory: 'prenatal' },
  { companyName: '동양생명', productName: '수호천사꿈나무태아보험(무)', basePremium30M: 28000, basePremium100M: 68000, category: 'majorDisease', targetCategory: 'prenatal' },
  { companyName: '삼성화재', productName: '마이헬스파트너태아보험(무)', basePremium30M: 34000, basePremium100M: 82000, category: 'hospitalization', targetCategory: 'prenatal' },
  
  // Child (어린이)
  { companyName: 'KB손해보험', productName: 'KB희망플러스어린이보험(무)', basePremium30M: 31000, basePremium100M: 75000, category: 'majorDisease', targetCategory: 'child' },
  { companyName: '메리츠화재', productName: '내맘같은어린이보험(무)', basePremium30M: 29000, basePremium100M: 72000, category: 'hospitalization', targetCategory: 'child' },
  { companyName: 'DB손해보험', productName: '아이러브건강어린이보험(무)', basePremium30M: 30000, basePremium100M: 74000, category: 'majorDisease', targetCategory: 'child' },
  
  // Youth (청년 / 어른이)
  { companyName: '현대해상', productName: '굿앤굿2030종합보험(무)', basePremium30M: 42000, basePremium100M: 98000, category: 'majorDisease', targetCategory: 'youth' },
  { companyName: '메리츠화재', productName: '내맘같은청년보험(무)', basePremium30M: 38000, basePremium100M: 89000, category: 'hospitalization', targetCategory: 'youth' },
  { companyName: 'KB손해보험', productName: 'KB금쪽같은청년보험(무)', basePremium30M: 39000, basePremium100M: 92000, category: 'majorDisease', targetCategory: 'youth' },
  { companyName: 'DB손해보험', productName: '청춘어른이종합보험(무)', basePremium30M: 40000, basePremium100M: 94000, category: 'hospitalization', targetCategory: 'youth' },
];

/**
 * 어린이/태아/청년 보험 실시간 요율 계산 로더
 */
export async function fetchChildPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 5;

    const childConfig = analysis.child || {
      targetAgeGroup: 'child',
      maturity: 30,
      focusArea: 'majorDisease',
      hasPrenatalRider: false
    };

    const ageGroup = childConfig.targetAgeGroup || 'child';
    const maturity = childConfig.maturity || 30;
    const focusArea = childConfig.focusArea || 'majorDisease';
    const hasPrenatal = !!childConfig.hasPrenatalRider;
    const weeksPregnancy = childConfig.weeksPregnancy || 12;

    // Determine pre-family loading and DB table target
    const isPreFamily = !!childConfig.isPreFamily;
    const nVal = childConfig.noAccidentYears || '5';
    const screeningCode = `3.${nVal}.5`;

    // 1. Try to fetch from Supabase (failsafe fallback to mock)
    let dbRates: any[] = [];
    try {
      const targetTable = isPreFamily ? 'insurance_child_sick_rates' : 'insurance_child_rates';
      let query = supabase.from(targetTable).select('*');
      
      if (isPreFamily) {
        query = query.eq('screening_code', screeningCode);
      }
      
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        dbRates = data;
      }
    } catch (dbErr) {
      console.warn('[Child Loader] DB table not ready, using high-fidelity mock calculations.');
    }

    // 2. Age-based multiplier
    let ageMultiplier = 1.0;
    if (ageGroup === 'prenatal') {
      ageMultiplier = 0.95; // prenatal basic rate is slightly lower before birth
    } else if (targetAge <= 2) {
      ageMultiplier = 1.15; // Infants have higher accident/illness rates
    } else if (targetAge <= 10) {
      ageMultiplier = 0.90; // Stable childhood rates
    } else if (targetAge <= 15) {
      ageMultiplier = 1.05; // Adolescent growth risks
    } else {
      // Youth (16~35) - 어른이보험
      const diffYears = targetAge - 15;
      ageMultiplier = 1.15 + (diffYears * 0.04); // Rises gradually as age increases
    }

    // Gender multiplier (Boys usually have slightly higher premium due to active injuries)
    const genderMultiplier = dbGender === 'M' ? 1.05 : 0.95;

    // 3. Process products (either from DB or Mock)
    const rawOptions = dbRates.length > 0 
      ? dbRates.map(r => {
          const basePrem = dbGender === 'M' ? (r.premium_male || 0) : (r.premium_female || 0);
          return {
            companyName: r.company_name || r.companyName,
            productName: r.product_name || r.productName,
            basePremium30M: basePrem,
            basePremium100M: Math.round(basePrem * 2.3),
            premium: basePrem,
            targetCategory: r.category || 'child',
            category: (r.product_name || '').includes('치아') || (r.product_name || '').includes('입원') || (r.product_name || '').includes('수술') 
              ? 'hospitalization' 
              : 'majorDisease'
          };
        })
      : MOCK_CHILD_PRODUCTS;

    let filteredOptions = rawOptions.filter((o: any) => o.targetCategory === ageGroup);
    if (filteredOptions.length < 3 && ageGroup !== 'child') {
      filteredOptions = [...filteredOptions, ...rawOptions.filter((o: any) => o.targetCategory === 'child')];
    }

    // Exclude dental products from child insurance comparison
    filteredOptions = filteredOptions.filter((o: any) => {
      const name = o.productName || '';
      return !name.includes('치아') && !name.includes('치과') && !name.includes('덴탈');
    });

    const results: any[] = [];

    // Determine pre-family premium loading and naming
    const isPreFamilyDBLoaded = isPreFamily && dbRates.length > 0;
    
    // Only apply the manual multiplier if DB fetch failed and we fell back to MOCK
    let preFamilyMultiplier = 1.0;
    if (isPreFamily && !isPreFamilyDBLoaded) {
      if (nVal === '0') preFamilyMultiplier = 1.35;
      else if (nVal === '2') preFamilyMultiplier = 1.25;
      else if (nVal === '3') preFamilyMultiplier = 1.18;
      else if (nVal === '5') preFamilyMultiplier = 1.10;
    }

    filteredOptions.forEach((prod: any) => {
      // Determine base premium depending on maturity
      let base = maturity === 30
        ? (prod.basePremium30M || prod.premium || 30000)
        : (prod.basePremium100M || prod.premium * 2.3 || 75000);

      // Focus area adjustment
      let focusMultiplier = 1.0;
      if (focusArea === 'hospitalization') {
        focusMultiplier = prod.category === 'hospitalization' ? 1.12 : 0.90;
      } else {
        focusMultiplier = prod.category === 'majorDisease' ? 1.15 : 0.88;
      }

      // Calculate base premium
      // For sick kids, if loaded from DB, gender is already separated! So we only apply age/focus multipliers.
      // If it is from sick DB, do not re-multiply gender.
      let finalGenderMultiplier = (isPreFamily && isPreFamilyDBLoaded) ? 1.0 : genderMultiplier;
      
      let calculatedPremium = Math.round(base * ageMultiplier * finalGenderMultiplier * focusMultiplier);

      // Add pre-family premium loading (only if mock fallback)
      if (isPreFamily && !isPreFamilyDBLoaded) {
        calculatedPremium = Math.round(calculatedPremium * preFamilyMultiplier);
      }

      // Add prenatal rider premium if applicable
      if (ageGroup === 'prenatal' && hasPrenatal) {
        if (weeksPregnancy <= 22) {
          calculatedPremium += 13500;
        }
      }

      // Rename product dynamically if pre-family (skip if loaded from sick DB which already has names)
      let finalProductName = prod.productName;
      if (isPreFamily && !isPreFamilyDBLoaded) {
        if (prod.companyName === '현대해상') {
          finalProductName = `간편한 3.${nVal}.5 건강보험(어린이형)`;
        } else if (prod.companyName === 'KB손해보험') {
          finalProductName = `KB 슬기로운 간편어린이보험(3.${nVal}.5)`;
        } else if (prod.companyName === '메리츠화재') {
          finalProductName = `간편한 3.${nVal}.5 어른이종합보험`;
        } else {
          finalProductName = `${prod.companyName} 참좋은간편어린이(3.${nVal}.5)`;
        }
      }

      if (calculatedPremium >= 20000) {
        results.push({
          premium: calculatedPremium,
          productName: finalProductName,
          companyName: prod.companyName,
          category: prod.category === 'hospitalization' ? '입원/수술형' : '3대진단형',
          appliedRate: '2.75%'
        });
      }
    });

    // Sort by premium ascending
    results.sort((a, b) => a.premium - b.premium);

    if (results.length > 0) {
      return {
        premium: results[0].premium,
        productName: results[0].productName,
        companyName: results[0].companyName,
        _allOptions: results
      };
    }
    return null;
  } catch (e) {
    console.error('[Child Loader Critical Error]:', e);
    return null;
  }
}
