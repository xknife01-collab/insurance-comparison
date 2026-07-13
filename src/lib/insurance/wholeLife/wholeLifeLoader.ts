import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

export interface WholeLifeProduct {
  company: string;
  productName: string;
  refundType: 'standard' | 'low';
  declaredRate: number; // 공시이율 (%)
  businessFee: number; // 사업비 (%)
  features: string;
}

export const fetchWholeLifePremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const opts = analysis.wholeLife || {
    objective: 'family',
    paymentPeriod: 10,
    deathBenefit: 100000000,
    refundType: 'low',
    isStepUp: false
  };

  const currentAge = analysis.age || 35;
  const gender = analysis.gender || 'M';
  const payYears = opts.paymentPeriod || 10;
  const deathAmt = opts.deathBenefit || 100000000;
  const isLowRefund = opts.refundType === 'low';
  const isStepUp = opts.isStepUp || false;

  // 1. 실제 Supabase 데이터베이스 조회 시도
  let productsList: WholeLifeProduct[] = [];
  try {
    const supabase = createClient();
    const { data: dbProducts, error } = await supabase
      .from('whole_life_products')
      .select('*')
      .order('declared_rate', { ascending: false });

    if (!error && dbProducts && dbProducts.length > 0) {
      dbProducts.forEach((row: any) => {
        productsList.push({
          company: row.company,
          productName: row.product_name,
          refundType: row.refund_type || 'low',
          declaredRate: row.declared_rate || 3.10,
          businessFee: row.business_fee || 5.0,
          features: row.features || ''
        });
      });
    }
  } catch (dbErr) {
    console.warn('[Whole Life Loader DB Error]:', dbErr);
  }

  // 2. 회사 다양성 확보 및 폴백 Mock 리스트 병합
  const fallbackList: WholeLifeProduct[] = [
    { 
      company: '동양생명', 
      productName: '(무)수호천사 알뜰한종신보험(저해지)', 
      refundType: 'low', 
      declaredRate: 3.25, 
      businessFee: 4.8, 
      features: "완납 후 업계 우수한 수준 환급률 (123.4%) CM 전용 | 저해지 환급형 18% 할인 요율 반영 | 1:1 전담 계약유지 관리 서비스 제공" 
    },
    { 
      company: '신한라이프', 
      productName: '신한든든한종신보험(저해지)', 
      refundType: 'low', 
      declaredRate: 3.10, 
      businessFee: 5.0, 
      features: "오프라인 전담 헬스케어 동반 가입 매칭 CM 전용 | 완납 후 10년 비과세 즉시 자동 전환 가능 | 계약 전환 수수료 전액 면제" 
    },
    { 
      company: '교보생명', 
      productName: '교보실속종신보험(일반형)', 
      refundType: 'standard', 
      declaredRate: 2.95, 
      businessFee: 6.2, 
      features: "대면 채널 정밀 위험 보장 컨설팅 지원 | 납입 기간 중 해약 시 안심 비례 환급 보존 | 자산가 상속세 최적 파트너 선정" 
    },
    { 
      company: '삼성생명', 
      productName: '삼성통합종신보험(일반형)', 
      refundType: 'standard', 
      declaredRate: 2.85, 
      businessFee: 6.5, 
      features: "업계 최대 자산 규모 삼성생명 절대 안정성 지원 | 납입 기간 중 해약 시 안심 비례 환급 보존 | 연금전환 특약 업계 우수 적용율" 
    }
  ];

  // DB 상품과 폴백 상품 병합 (중복 방지)
  fallbackList.forEach(fb => {
    if (!productsList.some(p => p.productName === fb.productName)) {
      productsList.push(fb);
    }
  });

  // 3. 보험 요율 매커니즘 (Actuarial Formula Simulation)
  // - 기준: 35세 남성, 사망보험금 1억원, 20년납, 일반형 = 월 보험료 180,000원 기준
  const results = productsList.map(p => {
    // 기본 연령 및 성별 계수
    let genderFactor = gender === 'F' ? 0.90 : 1.0; // 여성이 남성보다 기대여명이 길어 10% 저렴
    let ageFactor = 1.0 + (currentAge - 35) * 0.035; // 35세 기준으로 매 1세마다 3.5%씩 할증
    if (currentAge < 35) {
      ageFactor = 1.0 - (35 - currentAge) * 0.02; // 연령 하락 시 감액
    }

    // 사망보장액 가중치
    const amountFactor = deathAmt / 100000000;

    // 납입기간 단기 완납 가중치 (5년납은 짧게 몰아내므로 매월 더 큰 금액 납입)
    let periodFactor = 1.0;
    if (payYears === 5) periodFactor = 2.85;
    else if (payYears === 7) periodFactor = 2.15;
    else if (payYears === 10) periodFactor = 1.60;
    else if (payYears === 20) periodFactor = 1.00;
    else periodFactor = 0.85; // 30년납

    // 환급형태 및 체증형 가중치
    const refundFactor = p.refundType === 'low' ? 0.82 : 1.0; // 저해지 선택 시 18% 즉시 할인
    const stepUpFactor = isStepUp ? 1.15 : 1.0; // 체증형 선택 시 사망금 체증 부담으로 15% 할증

    // 회사별/상품별 요율 편차 반영 (사업비 및 공시이율에 비례)
    const feeFactor = 1.0 + ((p.businessFee || 5.0) - 5.0) * 0.03;
    const rateFactor = 1.0 - ((p.declaredRate || 3.0) - 3.0) * 0.06;
    
    // 회사별 임의 편차 (동일 회사 내 상품 다양화를 위한 미세조정)
    let companySeed = 0;
    for(let idx=0; idx<p.productName.length; idx++) {
      companySeed += p.productName.charCodeAt(idx);
    }
    const seedFactor = 0.97 + (companySeed % 7) * 0.01; // 0.97 ~ 1.03 범위

    // 최종 월 보험료 산정
    const baseUnitPremium = 175000; // 35세 1억 20년납 기본 원단위
    const premium = Math.round((baseUnitPremium * ageFactor * genderFactor * amountFactor * periodFactor * refundFactor * stepUpFactor * feeFactor * rateFactor * seedFactor) / 100) * 100;

    return {
      companyName: p.company,
      productName: p.productName,
      premium,
      declaredRate: p.declaredRate,
      businessFee: p.businessFee,
      refundType: p.refundType,
      features: p.features
    };
  });

  // 해당 분석 옵션에 일치하는 최적 조건(예: refundType이 일치하는 최저가 상품) 선정
  const filtered = results.filter(r => {
    const isProdLow = r.productName.includes('저해지') || r.productName.includes('알뜰한') || r.productName.includes('일부지급형') || r.refundType === 'low';
    return isLowRefund ? isProdLow : !isProdLow;
  });

  const bestProduct = filtered.length > 0 
    ? filtered.reduce((prev, curr) => prev.premium < curr.premium ? prev : curr)
    : results[0];

  return {
    premium: bestProduct.premium,
    productName: bestProduct.productName,
    companyName: bestProduct.companyName,
    _allOptions: results // 전체 비교 결과 목록 반환
  };
};
