import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// .env.local 로드
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log("[*] Connecting to Supabase...");
  
  // 1. 보험 상품 개수
  const { count: prodCount, error: prodError } = await supabase
    .from('insurance_products')
    .select('*', { count: 'exact', head: true });
    
  if (prodError) {
    console.error("[-] Error fetching product count:", prodError.message);
  } else {
    console.log(`[*] Total Products: ${prodCount}`);
  }

  // 2. 보험료 데이터 개수
  const { count: rateCount, error: rateError } = await supabase
    .from('insurance_rates')
    .select('*', { count: 'exact', head: true });
    
  if (rateError) {
    console.error("[-] Error fetching rate count:", rateError.message);
  } else {
    console.log(`[*] Total Rate Entries: ${rateCount}`);
  }

  // 3. 삼성화재(SAMSUNG_FIRE) 데이터 샘플
  const { data: samsungData, error: samsungError } = await supabase
    .from('insurance_rates')
    .select('*, insurance_products(company_name)')
    .eq('product_code', 'SAMSUNG_FIRE_HEALTH_01')
    .limit(5);

  if (samsungError) {
    console.error("[-] Error fetching Samsung Fire data:", samsungError.message);
  } else if (samsungData && samsungData.length > 0) {
    console.log("\n[*] Samsung Fire Data Sample (SAMSUNG_FIRE_HEALTH_01):");
    samsungData.forEach((row: any) => {
      console.log(`- Gender: ${row.gender}, Age: ${row.age}, Data:`, JSON.stringify(row.rate_data, null, 2));
    });
  } else {
    // 4. 만약 product_code가 다를 수 있으니 products 테이블에서 검색
    console.log("\n[*] No data found for 'SAMSUNG_FIRE_HEALTH_01'. Checking all Samsung products...");
    const { data: allSamsung, error: allErr } = await supabase
      .from('insurance_products')
      .select('product_code, company_name')
      .ilike('company_name', '%삼성%');
      
    if (allSamsung) {
      console.log("[*] Existing Samsung products in DB:", allSamsung.map(p => `${p.company_name} (${p.product_code})`).join(', '));
      
      // 여기서 찾은 코드 중 하나로 샘플 조회
      if (allSamsung.length > 0) {
        const firstCode = allSamsung[0].product_code;
        const { data: sampleData } = await supabase
          .from('insurance_rates')
          .select('*')
          .eq('product_code', firstCode)
          .limit(1);
        
        if (sampleData && sampleData.length > 0) {
            console.log(`[✔] Data found for ${firstCode}! Sample:`, JSON.stringify(sampleData[0].rate_data, null, 2));
        } else {
            console.log(`[-] No rates found for ${firstCode} in insurance_rates.`);
        }
      }
    }
  }
}

checkData();
