import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

export interface VariableProduct {
  company: string;
  productName: string;
  subType: 'term_pure' | 'term_ceo' | 'variable_term' | 'variable_saving' | 'investment' | 'term';
  feeOrDiscount: string; // "사업비 3.5%" or "우량체 할인 15%"
  baseRateOrYield: number; // 연수익률(5%) or 기본보험료율(원/1000만원)
  features: string;
}

export const fetchVariablePremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const varOpts = (analysis as any).variable || {
    subType: (analysis as any).selectedDetail === 1 ? 'term' : 'investment',
    monthlyPremium: 150000,
    paymentPeriod: 10,
    investmentStyle: 'balanced',
    equityRatio: 50,
    isAnnuityConversion: false,
    deathBenefit: 100000000,
    coveragePeriod: 70,
    isHealthyDiscount: false
  };

  const subType = varOpts.subType || ((analysis as any).selectedDetail === 1 ? 'term' : 'investment');
  const age = analysis.age || 35;
  const gender = analysis.gender || 'M';

  let productsList: VariableProduct[] = [];

  try {
    const supabase = createClient();
    const query = supabase
      .from('variable_products')
      .select('*');

    if (subType === 'term') {
      query.in('sub_type', ['term_pure', 'term_ceo', 'variable_term']);
    } else if (subType === 'investment') {
      query.in('sub_type', ['variable_saving']);
    } else {
      query.eq('sub_type', subType);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      productsList = data.map((item: any) => ({
        company: item.company,
        productName: item.product_name,
        subType: item.sub_type as any,
        feeOrDiscount: item.sub_type === 'variable_saving' 
          ? `사업비 ${item.business_fee}%`
          : `우량체 최대 15% 할인`,
        baseRateOrYield: item.sub_type === 'variable_saving'
          ? Number(item.declared_rate)
          : ((gender === 'F' || (gender as string) === 'female') ? item.female_premium_40 : item.male_premium_40),
        features: item.features || ''
      }));
    }
  } catch (err) {
    console.error("[-] Failed to fetch variable products from Supabase, using fallbacks:", err);
  }

  // Fallbacks if database has no rows or fails
  if (productsList.length === 0) {
    if (subType === 'investment' || subType === 'variable_saving') {
      productsList = [
        {
          company: '메트라이프생명',
          productName: '(무)메트라이프 e-변액적립보험',
          subType: 'investment',
          feeOrDiscount: '사업비 3.5%',
          baseRateOrYield: 6.2,
          features: '인터넷 CM 전용 저렴한 수수료 | 글로벌 자산배분 펀드 라인업 장점 | 펀드 전환 무료 제공'
        },
        {
          company: '미래에셋생명',
          productName: '(무)미래에셋 변액저축보험 글로벌자산배분형',
          subType: 'investment',
          feeOrDiscount: '사업비 4.0%',
          baseRateOrYield: 6.8,
          features: '글로벌 자산배분 펀드 관리 강자 | 해외 ETF 투입비율 최대 80% | 10년 시점 비과세 충족'
        },
        {
          company: '신한라이프',
          productName: '(무)신한 e-변액연금보험',
          subType: 'investment',
          feeOrDiscount: '사업비 4.5%',
          baseRateOrYield: 5.5,
          features: '안정적인 원금 최저보증(GMAB) 옵션 | 다양한 라이프사이클 펀드 | 모바일 간편 관리 가능'
        },
        {
          company: '삼성생명',
          productName: '(무)삼성생명 변액유니버셜적립보험',
          subType: 'investment',
          feeOrDiscount: '사업비 5.5%',
          baseRateOrYield: 5.2,
          features: '삼성그룹 브랜드 신뢰성 | 유니버셜 추가납입/중도인출 유연성 | 채권형 최저보증 이율 강화'
        }
      ];
    } else {
      productsList = [
        {
          company: '교보라이프플래닛',
          productName: '(무)라이프플래닛 e정기보험 (순수보장형)',
          subType: 'term',
          feeOrDiscount: '우량체 최대 18% 할인',
          baseRateOrYield: 22000,
          features: '인터넷 다이렉트 전용 최저가 보험료 | 비흡연/건강상태 우량체 추가 할인율 적용 | 공인인증 간편 가입'
        },
        {
          company: '한화생명',
          productName: '(무)한화생명 e다이렉트 정기보험',
          subType: 'term',
          feeOrDiscount: '우량체 15% 할인',
          baseRateOrYield: 24500,
          features: '비대면 다이렉트 스마트 계약 | 가입금액 최고 5억원 세팅 가능 | 암/질병 관련 특약 자유로운 추가'
        },
        {
          company: '삼성생명',
          productName: '(무)삼성생명 다이렉트 정기보험',
          subType: 'term',
          feeOrDiscount: '우량체 12% 할인',
          baseRateOrYield: 26000,
          features: '풍부한 지급 능력과 보장 안심 설계 | 모바일 3분 간편 청약 | 주계약 사망보장 깔끔한 구성'
        },
        {
          company: '동양생명',
          productName: '(무)동양생명 알뜰정기보험',
          subType: 'term',
          feeOrDiscount: '우량체 10% 할인',
          baseRateOrYield: 28000,
          features: '오프라인/온라인 결합 가성비 플랜 | 일정 연령 도달 시 종신 전환 옵션 제공 | 갱신 없이 납입 완료'
        }
      ];
    }
  }

  const calculatedOptions = productsList.map(prod => {
    let premium = 0;
    const isInvestment = prod.subType === 'variable_saving' || prod.subType === 'investment';
    
    if (isInvestment) {
      premium = varOpts.monthlyPremium || 150000;
    } else {
      // For Term Life, premium scales by age, gender, healthy discount, and death benefit amount.
      // Base premium is for 40-year old for 100,000,000 KRW death benefit.
      let mainPremium = prod.baseRateOrYield;
      let riderPremium = 0;

      // Extract main and rider premiums from features if present
      const isFemale = gender === 'F' || (gender as string) === 'female';
      if (prod.features && prod.features.includes('MAIN_M:')) {
        const parts = prod.features.split('|');
        const mainPart = parts.find(p => p.trim().startsWith(isFemale ? 'MAIN_F:' : 'MAIN_M:'));
        const riderPart = parts.find(p => p.trim().startsWith(isFemale ? 'RIDER_F:' : 'RIDER_M:'));
        
        if (mainPart) {
          const val = parseFloat(mainPart.split(':')[1]);
          if (!isNaN(val)) mainPremium = val;
        }
        if (riderPart) {
          const val = parseFloat(riderPart.split(':')[1]);
          if (!isNaN(val)) riderPremium = val;
        }
      }
      
      // Age scale factor: relative to age 40 (Exponential Gompertz-Makeham Law: ~8% annual risk growth)
      const ageFactor = Math.max(0.2, Math.min(15.0, Math.pow(1.08, age - 40)));

      // Death benefit factor: relative to 100,000,000 KRW
      const amountFactor = (varOpts.deathBenefit || 100000000) / 100000000;

      // Calculate scaled main contract premium and clamp to 10,000 KRW floor
      const scaledMain = mainPremium * ageFactor * amountFactor;
      const clampedMain = Math.max(10000, scaledMain);

      // Calculate scaled rider premiums
      const scaledRiders = riderPremium * ageFactor * amountFactor;

      // Sum and apply 1.35x fee multiplier
      let basePrem = clampedMain + scaledRiders;
      let premiumVal = basePrem * 1.35;

      // Apply Healthy Discount if active
      if (varOpts.isHealthyDiscount) {
        const discountPercent = parseInt(prod.feeOrDiscount.replace(/[^0-9]/g, '')) || 15;
        premiumVal = premiumVal * (1 - discountPercent / 100);
      }

      // Round to nearest 100 KRW
      premium = Math.round(premiumVal / 100) * 100;
    }

    return {
      companyName: prod.company,
      productName: prod.productName,
      premium: premium,
      riskPremium: Math.round(premium * 0.08), // 8% risk/fee
      savingsPremium: Math.round(premium * 0.92),
      declaredRate: isInvestment ? prod.baseRateOrYield : 0,
      businessFee: isInvestment ? parseFloat(prod.feeOrDiscount.replace(/[^0-9.]/g, '')) || 4.0 : 0,
      features: prod.features,
      subType: prod.subType
    };
  });

  // Sort by premium (ascending for Term Life, or just return as is)
  const sortedOptions = calculatedOptions.sort((a, b) => a.premium - b.premium);

  return {
    premium: sortedOptions[0].premium,
    productName: sortedOptions[0].productName,
    companyName: sortedOptions[0].companyName,
    _allOptions: sortedOptions
  };
};
