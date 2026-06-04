import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

export interface LegalProduct {
  company: string;
  productName: string;
  basePremium: number;
}

export const LEGAL_PRODUCTS: LegalProduct[] = [
  { company: '삼성화재', productName: '삼성화재 다이렉트 법률파트너', basePremium: 19000 },
  { company: '현대해상', productName: '현대해상 H&H 권리보호 법률비용보험', basePremium: 18500 },
  { company: 'DB손보', productName: 'DB손해 프로미라이프 법률안심보험', basePremium: 17800 },
  { company: 'KB손보', productName: 'KB 마이케어 법률비용보장보험', basePremium: 20500 },
  { company: '메리츠화재', productName: '메리츠 (무)법률방패 수호신보험', basePremium: 18000 },
  { company: '한화손보', productName: '한화 다이렉트 든든법률비용보험', basePremium: 16500 },
];

const parsePremium = (val: any): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val).replace(/[^0-9]/g, '');
  return parseInt(str, 10) || 0;
};

export const fetchLegalPremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const legalOpts = analysis.legal || {
    subType: 'lawyer',
    litigationType: 'civil',
    lawyerLimit: 10000000,
    courtFeeLimit: 5000000,
    deductibleType: 'fixed',
    suddenAccelerationRider: false,
    consultationRider: false,
    isElectronicLitigation: false,
  };

  // 1. 소송 구분 가중치
  let typeMultiplier = 1.0;
  if (legalOpts.litigationType === 'criminal') typeMultiplier = 1.25;
  if (legalOpts.litigationType === 'administrative') typeMultiplier = 0.90;

  // 2. 변호사선임비용 한도 가중치 (기본: 10,000,000원)
  let lawyerMultiplier = 1.0;
  if (legalOpts.lawyerLimit <= 5000000) lawyerMultiplier = 0.80;
  else if (legalOpts.lawyerLimit <= 10000000) lawyerMultiplier = 1.0;
  else if (legalOpts.lawyerLimit <= 15000000) lawyerMultiplier = 1.15;
  else if (legalOpts.lawyerLimit <= 20000000) lawyerMultiplier = 1.30;
  else lawyerMultiplier = 1.55; // 3,000만원 이상

  // 3. 인지대/송달료 한도 가중치 (기본: 5,000,000원)
  let courtMultiplier = 1.0;
  if (legalOpts.courtFeeLimit <= 2000000) courtMultiplier = 0.90;
  else if (legalOpts.courtFeeLimit <= 5000000) courtMultiplier = 1.0;
  else courtMultiplier = 1.25; // 1,000만원 이상

  // 4. 자기부담금 방식 가중치
  // 비례공제(ratio)의 경우 보험사의 위험 부담이 줄어드므로 요율 할인 적용
  const deductibleMultiplier = legalOpts.deductibleType === 'ratio' ? 0.90 : 1.0;

  // 5. 특약 추가금
  let riderCost = 0;
  if (legalOpts.suddenAccelerationRider) riderCost += 2500;
  if (legalOpts.consultationRider) riderCost += 1800;

  // 6. 연령 조정 (나이대별 위험률 변동 반영 - 20대, 30대, 50대, 60대, 70대 차등 적용)
  const age = analysis.age || 40;
  let ageMultiplier = 1.0;
  if (age < 30) {
    ageMultiplier = 0.90;      // 20대 이하
  } else if (age < 50) {
    ageMultiplier = 1.00;      // 30대~40대 (기준)
  } else if (age < 60) {
    ageMultiplier = 1.08;      // 50대
  } else if (age < 70) {
    ageMultiplier = 1.18;      // 60대
  } else {
    ageMultiplier = 1.28;      // 70대 이상
  }

  // 7. 할인 적용 (전자소송 선택 시 5% 할인)
  const discountMultiplier = legalOpts.isElectronicLitigation ? 0.95 : 1.0;

  // 최종 가중치 결합
  const combinedMultiplier = typeMultiplier * lawyerMultiplier * courtMultiplier * deductibleMultiplier * discountMultiplier * ageMultiplier;

  let productsToProcess: LegalProduct[] = [];

  try {
    const supabase = createClient();
    const { data: dbRates, error: ratesError } = await supabase
      .from('legal_insurance_rates')
      .select('*');

    const { data: dbProducts, error: prodError } = await supabase
      .from('legal_insurance_products')
      .select('*');

    if (!ratesError && !prodError && dbRates && dbProducts && dbRates.length > 0) {
      const prodMap = new Map<string, string>(); // productName -> companyName
      dbProducts.forEach(p => {
        prodMap.set(p.product_name, p.company_name);
      });

      const genderVal = (analysis.gender || 'M').toString().toUpperCase();
      const isMale = (genderVal.startsWith('M') || genderVal === '남');

      // 중복 제거하면서 product_name에 매칭되는 premium 정보 추출
      const seen = new Set<string>();
      dbRates.forEach(r => {
        if (!seen.has(r.product_name)) {
          seen.add(r.product_name);
          const company = prodMap.get(r.product_name) || '국내주요보험사';
          const rawPremStr = isMale ? r.male_premium : r.female_premium;
          const basePrem = parsePremium(rawPremStr) || 18000;
          productsToProcess.push({
            company,
            productName: r.product_name,
            basePremium: basePrem
          });
        }
      });
    }
  } catch (e) {
    console.error('[Legal Loader DB Query Error]:', e);
  }

  // Fallback: DB 데이터가 없는 경우 정적 리스트 사용
  if (productsToProcess.length === 0) {
    productsToProcess = LEGAL_PRODUCTS;
  }

  // 각 보험사별 월 보험료 산출
  const results = productsToProcess.map(p => {
    const rawPremium = p.basePremium * combinedMultiplier + riderCost;
    const finalPremium = Math.round(rawPremium / 100) * 100; // 100원 단위 절사

    // 보험사별 대표 담보 설명 세팅
    const details: Record<string, string> = {
      '집중 보장': legalOpts.subType === 'lawyer' ? '변호사 선임 비용 집중형' : '소송 실비(인지대/송달료) 집중형',
      '소송 구분': legalOpts.litigationType === 'civil' ? '민사소송 중심 보장' : legalOpts.litigationType === 'criminal' ? '형사사건 방어 보장' : '행정처분 소송 보장',
      '변호사 선임비': `${(legalOpts.lawyerLimit / 10000).toLocaleString()}만원 한도(심급별 실손)`,
      '인지대/송달료': `${(legalOpts.courtFeeLimit / 10000).toLocaleString()}만원 한도(실비 보상)`,
      '자기부담금': legalOpts.deductibleType === 'fixed' ? '건당 10만원 정액 공제' : '자기부담비율 10% 공제',
      '특약 가입': [
        legalOpts.suddenAccelerationRider ? '급발진 대응' : '',
        legalOpts.consultationRider ? '변호사 상담' : '',
      ].filter(Boolean).join(', ') || '없음'
    };

    return {
      premium: finalPremium,
      productName: p.productName,
      companyName: p.company,
      planLevel: legalOpts.lawyerLimit >= 20000000 ? '고급형' : legalOpts.lawyerLimit >= 10000000 ? '표준형' : '실속형',
      details
    };
  });

  // 보험료 순 오름차순 정렬
  results.sort((a, b) => a.premium - b.premium);

  const mainOption = results[0];

  return {
    premium: mainOption.premium,
    productName: mainOption.productName,
    companyName: mainOption.companyName,
    _allOptions: results
  };
};
