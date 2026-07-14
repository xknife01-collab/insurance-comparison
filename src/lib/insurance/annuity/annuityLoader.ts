import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

export interface AnnuityProduct {
  company: string;
  productName: string;
  annuityType: 'savings' | 'insurance'; // 세액공제형 vs 비과세형
  declaredRate: number;                  // 공시이율 (%)
  guaranteedRate: number;                // 최저보증이율 (%)
  businessFee: number;                   // 사업비 비율 (%)
  features?: string;                     // 상품 특장점
}

export const fetchAnnuityPremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const opts = analysis.annuity || {
    annuityType: 'savings',
    monthlyPremium: 300000,
    paymentPeriod: 10,
    commencementAge: 60,
    annualIncome: 50000000,
    hasIrp: false,
    receivingPeriod: 20
  };

  const selectedType = opts.annuityType || 'savings';

  // 사용자의 소득에 따라 세액공제 한도 및 공제율 결정
  const income = opts.annualIncome || 50000000;
  const isHighIncome = income > 55000000;
  const taxCreditRate = isHighIncome ? 0.132 : 0.165; // 13.2% vs 16.5%

  // 1년 총 납입금
  const annualPremium = opts.monthlyPremium * 12;
  // 세액공제 대상 납입한도 (연금저축 단독 한도: 6,000,000원)
  const taxLimit = 6000000;
  const eligiblePremium = Math.min(annualPremium, taxLimit);
  const annualTaxRefund = selectedType === 'savings' ? eligiblePremium * taxCreditRate : 0;

  // 각 상품별 은퇴 적립 시뮬레이션 계산
  // - 납입기간 N년, 거치기간 M년 (개시연령 - 현재연령 - 납입기간)
  const currentAge = analysis.age || 35;
  const payYears = opts.paymentPeriod || 10;
  const startAge = opts.commencementAge || 60;
  const deferYears = Math.max(0, startAge - currentAge - payYears);

  // Supabase에서 실제 연금 상품 목록 가져오기
  let productsList: AnnuityProduct[] = [];
  try {
    const supabase = createClient();
    const { data: dbProducts, error } = await supabase
      .from('pension_products')
      .select('company, product_name, interest_rate, channel, features');

    if (!error && dbProducts && dbProducts.length > 0) {
      const seen = new Set<string>();
      dbProducts.forEach(row => {
        const key = `${row.company}__${row.product_name}`;
        if (seen.has(key)) return;
        seen.add(key);

        let rate = 2.50;
        if (row.interest_rate) {
          const parsed = parseFloat(row.interest_rate.replace(/%/g, '').trim());
          if (!isNaN(parsed)) rate = parsed;
        }

        const isCM = row.channel?.includes('CM') || 
                     row.product_name.includes('다이렉트') || 
                     row.product_name.includes('인터넷') || 
                     row.product_name.includes('e-') || 
                     row.product_name.includes('라플') || 
                     row.product_name.includes('b연금');
        
        const businessFee = isCM ? 3.5 : (row.company.includes('생명') ? 5.0 : 4.5);
        const isSavings = row.product_name.includes('연금저축');
        const annuityType = isSavings ? 'savings' : 'insurance';

        productsList.push({
          company: row.company,
          productName: row.product_name,
          annuityType: annuityType,
          declaredRate: rate,
          guaranteedRate: rate * 0.3,
          businessFee: businessFee,
          features: row.features || ""
        });
      });
    }
  } catch (dbErr) {
    console.error('[Annuity Loader DB Error]:', dbErr);
  }

  // DB 조회 실패 또는 비어있을 시 폴백 (Mock 데이터 사용)
  if (productsList.length === 0) {
    productsList = [
      { company: '교보라이프플래닛', productName: '(무)교보라플 연금저축보험(유니버셜)', annuityType: 'savings', declaredRate: 3.10, guaranteedRate: 1.00, businessFee: 3.5, features: "인터넷 CM 전용 최저 수수료(사업비 3.5%) | 업계 최우수 공시이율 (3.10 %) | 유니버셜 기능 결합 및 안정적 최저보증이율" },
      { company: '삼성생명', productName: '인터넷 연금저축보험 (무배당)', annuityType: 'savings', declaredRate: 2.85, guaranteedRate: 0.75, businessFee: 5.2, features: "인터넷 CM 전용 최저 수수료(사업비 5.2%) | 안정적인 고금리 이율 (2.85 %) | 자산 규모 선두 삼성금융 브랜드의 절대 안정성" },
      { company: '한화생명', productName: '한화 e연금저축보험 (무배당)', annuityType: 'savings', declaredRate: 2.90, guaranteedRate: 0.75, businessFee: 5.0, features: "인터넷 CM 전용 최저 수수료(사업비 5.0%) | 안정적인 고금리 이율 (2.90 %) | 자유로운 중도 인출 및 추가 납입 유연성" },
      { company: '동양생명', productName: '(무)우리WON하는누구나행복연금보험', annuityType: 'savings', declaredRate: 2.80, guaranteedRate: 0.50, businessFee: 4.8, features: "오프라인 대면 밀착 케어 서비스 | 안정 보장형 복리 이율 (2.80 %) | 연금 개시 전후 유연한 플랜 구성" },
      { company: '미래에셋생명', productName: '온라인 연금저축보험 (무)', annuityType: 'savings', declaredRate: 2.75, guaranteedRate: 0.50, businessFee: 5.5, features: "인터넷 CM 전용 최저 수수료(사업비 5.5%) | 안정 보장형 복리 이율 (2.75 %) | 예금자보호법 적용 대상 및 최저보증 안전망" },
      { company: '삼성생명', productName: '인터넷 연금보험 (무배당, 비과세)', annuityType: 'insurance', declaredRate: 2.80, guaranteedRate: 0.75, businessFee: 5.8, features: "인터넷 CM 전용 최저 수수료(사업비 5.8%) | 안정 보장형 복리 이율 (2.80 %) | 자산 규모 선두 삼성금융 브랜드의 절대 안정성" },
      { company: '교보라이프플래닛', productName: '(무)교보라플 연금보험(유니버셜)', annuityType: 'insurance', declaredRate: 3.00, guaranteedRate: 1.00, businessFee: 4.0, features: "인터넷 CM 전용 최저 수수료(사업비 4.0%) | 업계 최우수 공시이율 (3.00 %) | 유니버셜 기능 결합 및 안정적 최저보증이율" },
      { company: '한화생명', productName: '한화 e연금보험 (무배당, 비과세)', annuityType: 'insurance', declaredRate: 2.85, guaranteedRate: 0.75, businessFee: 5.5, features: "인터넷 CM 전용 최저 수수료(사업비 5.5%) | 안정적인 고금리 이율 (2.85 %) | 자유로운 중도 인출 및 추가 납입 유연성" }
    ];
  }

  const results = productsList.filter(p => p.annuityType === selectedType).map(p => {
    // 월별 복리 계산식 시뮬레이션
    // Net Premium = Monthly Premium * (1 - BusinessFee)
    const monthlyNetPremium = opts.monthlyPremium * (1 - p.businessFee / 100);
    const monthlyRate = (p.declaredRate / 100) / 12;

    let accumulated = 0;
    // 1. 납입 기간 (월 복리 계산)
    const totalPayMonths = payYears * 12;
    for (let m = 0; m < totalPayMonths; m++) {
      accumulated = (accumulated + monthlyNetPremium) * (1 + monthlyRate);
    }

    // 2. 거치 기간 (월 복리 계산, 추가 납입 없음)
    const totalDeferMonths = deferYears * 12;
    for (let m = 0; m < totalDeferMonths; m++) {
      accumulated = accumulated * (1 + monthlyRate);
    }

    // 최종 총 납입 원금
    const totalPrincipal = opts.monthlyPremium * 12 * payYears;
    // 환급률 (%)
    const refundRatio = totalPrincipal > 0 ? (accumulated / totalPrincipal) * 100 : 0;

    // 은퇴 후 수령 시뮬레이션 (확정기간 10년 / 20년 또는 종신형 분기)
    const recvYears = opts.receivingPeriod || 20;
    
    // 단순 확정 연금 수령액 산출 (수령 중에도 남은 잔액은 공시이율의 80% 수준으로 계속 굴러간다고 계산)
    const payoutMonths = recvYears * 12;
    const payoutMonthlyRate = (p.declaredRate * 0.8 / 100) / 12;
    
    let monthlyPension = 0;
    if (recvYears === 999) { // 종신형 (평균 여명 남성 23년, 여성 28년 가정하여 성별에 따른 기대여명 차이 반영)
      const isFemale = analysis.gender === 'F';
      const estimatedMonths = (isFemale ? 28 : 23) * 12;
      monthlyPension = (accumulated * payoutMonthlyRate) / (1 - Math.pow(1 + payoutMonthlyRate, -estimatedMonths));
    } else { // 확정기간형
      monthlyPension = (accumulated * payoutMonthlyRate) / (1 - Math.pow(1 + payoutMonthlyRate, -payoutMonths));
    }

    const detailDetails: Record<string, string> = {
      '연 연말정산 환급금': selectedType === 'savings' ? `${Math.round(annualTaxRefund).toLocaleString()}원` : '비과세 대상 (세액공제 없음)',
      '총 납입 원금': `${Math.round(totalPrincipal / 10000).toLocaleString()}만원`,
      '은퇴 시 적립 자산': `${Math.round(accumulated / 10000).toLocaleString()}만원`,
      '예상 환급률': `${refundRatio.toFixed(1)}%`,
      '매월 수령 예상액': `${Math.round(monthlyPension).toLocaleString()}원`,
    };

    return {
      premium: opts.monthlyPremium,
      riskPremium: Math.round(opts.monthlyPremium * (p.businessFee / 100)), // 사업비를 위험비용(소멸성)으로 분류 매칭
      savingsPremium: Math.round(opts.monthlyPremium * (1 - p.businessFee / 100)), // 순 적립금
      productName: p.productName,
      companyName: p.company,
      planLevel: selectedType === 'savings' ? '세액공제 집중형' : '미래 비과세 연금형',
      details: detailDetails,
      accumulatedAmount: Math.round(accumulated),
      monthlyPension: Math.round(monthlyPension),
      refundRatio: refundRatio,
      totalPrincipal: totalPrincipal,
      annualTaxRefund: annualTaxRefund,
      taxCreditRateText: isHighIncome ? '13.2%' : '16.5%',
      features: p.features || "",
      declaredRate: p.declaredRate,
      guaranteedRate: p.guaranteedRate,
      businessFee: p.businessFee
    };
  });

  // 적립금(또는 수령 연금액)이 가장 높은 상품이 최선책으로 정렬
  results.sort((a, b) => b.accumulatedAmount - a.accumulatedAmount);

  const mainOption = results[0];

  return {
    premium: mainOption.premium,
    riskPremium: mainOption.riskPremium,
    savingsPremium: mainOption.savingsPremium,
    productName: mainOption.productName,
    companyName: mainOption.companyName,
    _allOptions: results
  };
};
