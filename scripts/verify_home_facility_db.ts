import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Key missing.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("[*] Fetching all records from insurance_home_facility_rates to verify database integrity...");
  
  const { data, error } = await supabase
    .from('insurance_home_facility_rates')
    .select('*');

  if (error) {
    console.error("[-] Error fetching rates:", error.message);
    return;
  }

  console.log(`[+] Success! Total rows found in Database: ${data.length}\n`);

  // Group by product to list counts and riders
  const groups: { [key: string]: { company: string, count: number, riders: string[], totalM: number, totalF: number } } = {};

  data.forEach(r => {
    const key = r.product_name;
    if (!groups[key]) {
      groups[key] = {
        company: r.company_name,
        count: 0,
        riders: [],
        totalM: r.premium_male || 0, // Since we pre-summed, they are identical across rows
        totalF: r.premium_female || 0
      };
    }
    groups[key].count++;
    groups[key].riders.push(`${r.division}: ${r.benefit_name} (가입금액: ${r.insured_amount || r.benefit_amount || '미정'})`);
  });

  Object.keys(groups).forEach((prod, idx) => {
    const g = groups[prod];
    console.log(`======================================================================`);
    console.log(`${idx + 1}. [${g.company}] ${prod}`);
    console.log(`   - DB 적재 행수: ${g.count}개 담보`);
    console.log(`   - 남성 합산 월보험료: ${g.totalM.toLocaleString()} 원`);
    console.log(`   - 여성 합산 월보험료: ${g.totalF.toLocaleString()} 원`);
    console.log(`   - 세부 담보 리스트:`);
    g.riders.forEach(r => console.log(`     * ${r}`));
    console.log();
  });
}

run();
