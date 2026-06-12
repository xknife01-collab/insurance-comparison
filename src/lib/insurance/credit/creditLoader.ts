import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

export interface CreditProduct {
  company: string;
  companyName: string;
  productName: string;
  businessFee: number;
  hasUniversal: boolean;
  premium: number;
  riskPremium: number;
  savingsPremium: number;
  declaredRate?: number;
  guaranteedRate?: number;
  coverageType: string;
  details?: string;
}

export const fetchCreditPremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const isMale = genderVal.startsWith('M') || genderVal === '남';
    const targetAge = analysis.age || 40;

    const creditOpts = analysis.credit || {
      loanType: 'mortgage',
      loanAmount: 100000000,
      loanPeriod: 10,
      creditBureau: 'nice',
      creditScore: 850,
      hasIllnessRider: true,
      hasDisabilityRider: true
    };

    const loanType = creditOpts.loanType || 'mortgage';
    const loanAmount = creditOpts.loanAmount || 100000000;
    const creditScore = creditOpts.creditScore || 850;
    const selectedSubType = analysis.credit?.subType || analysis.subType || '대출안심형';

    // 1. Fetch products from public.credit_insurance_plans matching the loan type
    const { data: dbPlans, error } = await supabase
      .from('credit_insurance_plans')
      .select('*')
      .eq('loan_type', loanType);

    if (error || !dbPlans || dbPlans.length === 0) {
      console.error('[Credit Loader] Error fetching database plans:', error);
      return getMockFallback(analysis);
    }

    // 2. Filter by subtype selection:
    // '정기보장형' -> product_name contains '정기보험'
    // '대출안심형' -> product_name does NOT contain '정기보험'
    let subTypeFiltered = dbPlans.filter(p => {
      const isTerm = p.product_name.includes('정기보험');
      return selectedSubType === '정기보장형' ? isTerm : !isTerm;
    });

    if (subTypeFiltered.length === 0) {
      subTypeFiltered = dbPlans;
    }

    // 3. Calculate credit score discount rate
    let discountRate = 0;
    if (creditScore >= 900) discountRate = 0.10;
    else if (creditScore >= 800) discountRate = 0.08;
    else if (creditScore >= 700) discountRate = 0.05;
    else if (creditScore >= 600) discountRate = 0.03;

    // 4. Calculate age multiplier (base age 40)
    const ageFactor = 1.0 + Math.max(-0.6, Math.min(2.5, (targetAge - 40) * 0.04));

    const options: CreditProduct[] = subTypeFiltered.map(p => {
      // Determine base sum assured for this product
      let baseAmount = 100000000; // 1억원 base
      if (p.product_name.includes('2형') || p.product_name.includes('신용대출 플랜') || p.product_name.includes('2종')) {
        baseAmount = 10000000; // 1,000만원 base
        if (p.product_name.includes('2형')) baseAmount = 50000000;
      } else if (p.product_name.includes('1형')) {
        baseAmount = 30000000; // 3,000만원 base
      }

      const dbPremium = isMale ? p.premium_male_40 : p.premium_female_40;
      const amountRatio = loanAmount / baseAmount;

      const finalPremium = Math.max(
        5000, 
        Math.round(dbPremium * amountRatio * ageFactor * (1 - discountRate))
      );

      return {
        company: p.company_name,
        companyName: p.company_name,
        productName: p.product_name,
        businessFee: p.product_name.includes('카디프') ? 1.5 : 1.8,
        hasUniversal: false,
        premium: finalPremium,
        riskPremium: finalPremium,
        savingsPremium: 0,
        declaredRate: 0,
        guaranteedRate: 0,
        coverageType: p.coverage_type,
        details: p.details
      };
    });

    // Sort by premium ascending
    options.sort((a, b) => a.premium - b.premium);

    return {
      _allOptions: options,
      _realDbPremium: options[0]?.premium || 30000,
      _productName: options[0]?.productName || '(무)카디프 대출안심 신용생명보험 (정기형)',
      _companyName: options[0]?.company || 'BNP파리바 카디프생명',
      discountRate,
      creditScore,
      loanAmount,
      premium: options[0]?.premium || 30000,
      productName: options[0]?.productName || '(무)카디프 대출안심 신용생명보험 (정기형)',
      companyName: options[0]?.company || 'BNP파리바 카디프생명'
    };

  } catch (e) {
    console.error('[Credit Loader Critical Error]:', e);
    return getMockFallback(analysis);
  }
};

function getMockFallback(analysis: InsuranceAnalysis) {
  const creditOpts = analysis.credit || {
    loanType: 'mortgage',
    loanAmount: 100000000,
    loanPeriod: 10,
    creditBureau: 'nice',
    creditScore: 850,
    hasIllnessRider: true,
    hasDisabilityRider: true
  };

  const loanAmount = creditOpts.loanAmount || 100000000;
  const creditScore = creditOpts.creditScore || 850;

  const age = analysis.age || 35;
  const gender = analysis.gender || 'M';
  const ageFactor = 1.0 + Math.max(-0.5, Math.min(2.0, (age - 35) * 0.04));
  const genderFactor = gender === 'M' ? 1.15 : 0.85;

  let discountRate = 0;
  if (creditScore >= 900) discountRate = 0.10;
  else if (creditScore >= 800) discountRate = 0.08;
  else if (creditScore >= 700) discountRate = 0.05;
  else if (creditScore >= 600) discountRate = 0.03;

  const baseMonthlyRate = 1200;
  const units = loanAmount / 10000000;
  const rawPremium = Math.max(5000, Math.round(units * baseMonthlyRate * ageFactor * genderFactor));

  const companies = [
    { name: 'BNP파리바 카디프생명', rate: 1.0, fee: 1.5, prod: '(무)카디프 대출안심 신용생명보험 (정기형)', type: '사망단독형' },
    { name: '신한라이프', rate: 1.05, fee: 1.8, prod: '(무)신한 대출안심 신용보험 (정기형)', type: '종합안심형' },
    { name: 'KB라이프생명', rate: 1.08, fee: 2.0, prod: '(무)KB 대출안심 신용생명보험 (정기형)', type: '종합안심형' }
  ];

  const allOptions: CreditProduct[] = companies.map((c) => {
    let finalPremium = rawPremium * c.rate;
    finalPremium = Math.round(finalPremium * (1 - discountRate));

    return {
      company: c.name,
      companyName: c.name,
      productName: c.prod,
      businessFee: c.fee,
      hasUniversal: false,
      premium: finalPremium,
      riskPremium: finalPremium,
      savingsPremium: 0,
      declaredRate: 0,
      guaranteedRate: 0,
      coverageType: c.type
    };
  });

  return {
    _allOptions: allOptions,
    _realDbPremium: allOptions[0]?.premium || 35000,
    _productName: allOptions[0]?.productName || '(무)카디프 대출안심 신용생명보험 (정기형)',
    _companyName: allOptions[0]?.company || 'BNP파리바 카디프생명',
    discountRate,
    creditScore,
    loanAmount,
    premium: allOptions[0]?.premium || 35000,
    productName: allOptions[0]?.productName || '(무)카디프 대출안심 신용생명보험 (정기형)',
    companyName: allOptions[0]?.company || 'BNP파리바 카디프생명'
  };
}
