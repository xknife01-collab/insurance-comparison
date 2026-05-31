import pandas as pd
import os

csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv'
loader_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\lib\insurance\driver\driverLoader.ts'

df = pd.read_csv(csv_path, encoding='utf-8-sig')

# Filter for rows with at least one premium
df = df[df['가입보험료'].notna() | df['기준보험료'].notna()].copy()

products = []

for idx, row in df.iterrows():
    company = str(row.get('보험회사', '')).strip()
    product_name = str(row.get('상품명', '')).strip()
    coverage = str(row.get('담보명(급부명)', '')).strip()
    payout = str(row.get('지급금액', '')).strip()
    
    if not company or company == 'nan':
        company = '기타'
    if not product_name or product_name == 'nan':
        product_name = '운전자보험 상품'
    if not coverage or coverage == 'nan':
        coverage = '기본 담보'
    if not payout or payout == 'nan':
        payout = '보험가입금액 한도'
        
    raw_male = row.get('기준보험료')
    raw_female = row.get('가입보험료')
    
    # Try parsing
    try:
        male = int(float(str(raw_male).replace(',', ''))) if pd.notna(raw_male) and str(raw_male).strip() != '' else None
    except:
        male = None
        
    try:
        female = int(float(str(raw_female).replace(',', ''))) if pd.notna(raw_female) and str(raw_female).strip() != '' else None
    except:
        female = None
        
    # Fallback
    if male is None and female is not None:
        male = female
    if female is None and male is not None:
        female = male
    if male is None and female is None:
        continue # Skip if no valid premiums
        
    products.append({
        'company': company,
        'productName': product_name,
        'coverage': coverage,
        'payoutAmount': payout,
        'malePremium': male,
        'femalePremium': female
    })

# Format the DRIVER_PRODUCTS array in TypeScript
ts_products = []
for p in products:
    ts_products.append(f"""  {{
    company: '{p['company']}',
    productName: `{p['productName']}`,
    coverage: `{p['coverage']}`,
    payoutAmount: `{p['payoutAmount']}`,
    malePremium: {p['malePremium']},
    femalePremium: {p['femalePremium']},
  }},""")

ts_content = f"""// 운전자 보험 데이터 로더 - extracted_data.csv 기반
// CSV에서 파싱된 실제 보험 상품 정보
import {{ createClient }} from '../../../utils/supabase/client';
import {{ InsuranceAnalysis }} from '../../../types/insurance';

export interface DriverProduct {{
  company: string;
  productName: string;
  coverage: string;       // 담보명
  payoutAmount: string;   // 지급금액
  malePremium: number;    // 기준보험료(남자)
  femalePremium: number;  // 가입보험료(여자)
}}

// extracted_data.csv에서 추출한 보험사별 대표 상품
export const DRIVER_PRODUCTS: DriverProduct[] = [
{"\n".join(ts_products)}
];

/** 보험사별 대표 상품 (보험료가 낮은 순으로 1개만 반환) */
export function getDriverProductsByCompany(): DriverProduct[] {{
  const seen = new Set<string>();
  const result: DriverProduct[] = [];
  // 남자 보험료 오름차순 정렬 → 보험사별 첫 번째(최저가) 픽
  const sorted = [...DRIVER_PRODUCTS].sort((a, b) => a.malePremium - b.malePremium);
  for (const p of sorted) {{
    if (!seen.has(p.company)) {{
      seen.add(p.company);
      result.push(p);
    }}
  }}
  return result.sort((a, b) => a.malePremium - b.malePremium);
}}

/** 전체 상품 목록 (보험료 오름차순) */
export function getAllDriverProducts(): DriverProduct[] {{
  return [...DRIVER_PRODUCTS].sort((a, b) => a.malePremium - b.malePremium);
}}

/**
 * 운전자 보험 전용 데이터베이스 로더
 * Supabase에서 실시간 요율을 조회하여 나이, 운전 목적, 직업 급수를 보정해 반환합니다.
 */
export async function fetchDriverPremium(analysis: InsuranceAnalysis) {{
  try {{
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;
    
    const driverOpts = analysis.driver || {{
      drivingPurpose: 'private',
      jobClass: 1,
      planType: 'standard'
    }};
    const {{ drivingPurpose, jobClass, planType }} = driverOpts;
    const planLevelMap: Record<string, string> = {{
      saving: '실속형',
      standard: '표준형',
      premium: 'VIP안심'
    }};
    const targetPlanLevel = planLevelMap[planType] || '표준형';

    // 1. 운전 목적(용도) 할증율
    const purposeMultiplier = drivingPurpose === 'commercial' ? 1.85 : 1.0;

    // 2. 직업 등급(상해위험도) 할증율
    let jobMultiplier = 1.0;
    if (jobClass === 2) jobMultiplier = 1.35;
    if (jobClass === 3) jobMultiplier = 1.65;

    // 3. 연령 조정 할증율 (U자형 요율 곡선 반영)
    let ageMultiplier = 1.0;
    if (targetAge < 21) {{
      ageMultiplier = 1.55;      // 20대 초반 (55% 할증)
    }} else if (targetAge < 26) {{
      ageMultiplier = 1.35;      // 20대 중반 (35% 할증)
    }} else if (targetAge < 30) {{
      ageMultiplier = 1.20;      // 20대 후반 (20% 할증)
    }} else if (targetAge < 50) {{
      ageMultiplier = 0.90;      // 30대~40대 황금기 (10% 할인!)
    }} else if (targetAge < 60) {{
      ageMultiplier = 1.00;      // 50대 기준
    }} else if (targetAge < 70) {{
      ageMultiplier = 1.10;      // 60대 (10% 할증)
    }} else {{
      ageMultiplier = 1.25;      // 70대 이상 (25% 할증)
    }}

    const totalMultiplier = purposeMultiplier * jobMultiplier * ageMultiplier;

    // Supabase 데이터 조회
    const {{ data: dbRates, error: ratesError }} = await supabase
      .from('driver_insurance_rates')
      .select('*')
      .eq('gender', dbGender);

    const {{ data: dbProducts, error: prodError }} = await supabase
      .from('driver_insurance_products')
      .select('*');

    let results: any[] = [];

    if (ratesError || prodError || !dbRates || dbRates.length === 0) {{
      console.warn('[Driver DB Loader] Supabase 조회 실패, 정적 데이터 Fallback 적용:', ratesError || prodError);
      
      // Fallback 로직: 정적 DRIVER_PRODUCTS 활용
      const planConfigs = [
        {{ level: '실속형', add: 6000, min: 9900 }},
        {{ level: '표준형', add: 11000, min: 15000 }},
        {{ level: 'VIP안심형', add: 21000, min: 25000 }}
      ];

      DRIVER_PRODUCTS.forEach(p => {{
        const basePrem = dbGender === 'M' ? p.malePremium : p.femalePremium;
        planConfigs.forEach(cfg => {{
          const rawPrem = Math.max(basePrem + cfg.add, cfg.min);
          const finalPrem = Math.round(rawPrem * totalMultiplier);
          results.push({{
            premium: finalPrem,
            productName: p.productName,
            companyName: p.company,
            planLevel: cfg.level,
            details: {{
              '교통사고처리지원금': cfg.level === '실속형' ? '1억 원 한도' : (cfg.level === '표준형' ? '1.5억 원 한도' : '2억 원 한도'),
              '변호사선임비용': cfg.level === '실속형' ? '3,000만 원 한도' : '5,000만 원 한도',
              '벌금': cfg.level === '실속형' ? '대인 2,000만 원 한도' : (cfg.level === '표준형' ? '대인 3,000만 원 한도' : '대인 3,000만 / 대물 500만 원 한도')
            }}
          }});
        }});
      }});
    }} else {{
      // Supabase 데이터가 있을 때 매핑
      const prodMap = new Map<string, string>(); // productName -> companyName
      dbProducts?.forEach(p => {{
        prodMap.set(p.product_name, p.company_name);
      }});

      dbRates.forEach(r => {{
        const company = prodMap.get(r.product_name) || '국내주요보험사';
        const finalPrem = Math.round((r.premium || 15000) * totalMultiplier);
        results.push({{
          premium: finalPrem,
          productName: r.product_name,
          companyName: company,
          planLevel: r.plan_level,
          details: r.details || {{}}
        }});
      }});
    }}

    // 사용자가 선택한 상세 타입 (accident: 교통사고처리 집중, lawyer: 변호사비용 집중)
    const detailType = (driverOpts as any).detailType;

    // --- 오토바이 vs 자가용 상품 분리 필터링 ---
    const bikeKeywords = ['이륜', '오토바이', '바이크'];
    let filteredResults = results;
    
    if (drivingPurpose === 'motorcycle') {{
      // 오토바이 상품만 노출
      filteredResults = results.filter(r => 
        bikeKeywords.some(kw => r.productName.includes(kw))
      );
    }} else {{
      // 일반 자가용/영업용: 오토바이 상품 원천 제거
      filteredResults = results.filter(r => 
        !bikeKeywords.some(kw => r.productName.includes(kw))
      );
    }}

    // 프리미엄 기준 정렬
    filteredResults.sort((a, b) => a.premium - b.premium);

    // 상세 타입별 동적 필터링/우선순위 적용
    let displayOptions = filteredResults;
    if (detailType === 'accident') {{
      // 교통사고처리지원금 집중형: 표준형, VIP안심만 필터링
      const filtered = filteredResults.filter(r => r.planLevel === '표준형' || r.planLevel === 'VIP안심');
      if (filtered.length > 0) displayOptions = filtered;
    }} else if (detailType === 'lawyer') {{
      // 변호사비용 집중형: VIP안심만 필터링
      const filtered = filteredResults.filter(r => r.planLevel === 'VIP안심');
      if (filtered.length > 0) displayOptions = filtered;
    }} else {{
      // 기본형: 사용자가 지정한 plan_level 요율만 필터링해 중복 제거
      const filtered = filteredResults.filter(r => r.planLevel === targetPlanLevel);
      if (filtered.length > 0) displayOptions = filtered;
    }}

    const mainOption = displayOptions[0] || filteredResults[0] || {{ premium: 15000, productName: '기본 운전자보험', companyName: 'DB손보' }};

    return {{
      premium: mainOption.premium,
      productName: mainOption.productName,
      companyName: mainOption.companyName,
      _allOptions: displayOptions
    }};
  }} catch (e) {{
    console.error('[Driver Loader Critical Error]:', e);
    return null;
  }}
}}
"""

with open(loader_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Successfully wrote {len(products)} products to {loader_path}")
