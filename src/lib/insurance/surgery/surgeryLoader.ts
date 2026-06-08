import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

/**
 * 수술/입원 보험 전용 데이터 로더
 * 장기보장성 비교공시 XLS → ingest_surgery.py 로 적재된 데이터 활용
 * 기준: 수술비 1,000만원 담보 보험료 합산 (40세 기준)
 */
export async function fetchSurgeryPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const isMale = (analysis.gender === 'M' || analysis.gender?.toString() === '남');
    const dbGender = isMale ? 'M' : 'F';
    const targetAge = analysis.age || 40;

    const getAgeRatio = (a: number): number => {
      if (a <= 25) return 0.5;
      if (a <= 35) return 0.75;
      if (a <= 45) return 1.00;
      if (a <= 55) return 1.40;
      if (a <= 65) return 2.00;
      return 3.00;
    };
    const ageRatio = getAgeRatio(targetAge) / getAgeRatio(40);

    // 성별·연령 기준으로 조회
    const { data, error } = await supabase
      .from('insurance_surgery_hospital_rates')
      .select('company_name, product_name, rider_name, category_type, premium')
      .eq('gender', dbGender)
      .eq('age', 40);

    if (error || !data || data.length === 0) return null;

    // 상품별로 담보 보험료 합산
    const productMap: Record<string, { company: string; product: string; total: number; riders: string[] }> = {};
    for (const row of data) {
      const key = `${row.company_name}__${row.product_name}`;
      if (!productMap[key]) {
        productMap[key] = { company: row.company_name, product: row.product_name, total: 0, riders: [] };
      }
      productMap[key].total += (row.premium || 0);
      productMap[key].riders.push(row.rider_name);
    }

    const results = Object.values(productMap)
      .map(p => ({
        premium: Math.round(p.total * ageRatio),
        productName: p.product,
        companyName: p.company,
        riderCount: p.riders.length,
      }))
      .filter(r => r.premium >= 10000)
      .sort((a, b) => a.premium - b.premium);

    if (results.length === 0) return null;

    return {
      premium: results[0].premium,
      productName: results[0].productName,
      companyName: results[0].companyName,
      _allOptions: results,
    };
  } catch (e) {
    console.error('[Surgery Loader Error]:', e);
    return null;
  }
}
