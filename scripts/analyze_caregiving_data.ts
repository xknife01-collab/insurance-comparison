import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Key not found.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("[*] Fetching all caregiving plans to analyze data issue...");
  const { data: careData, error } = await supabase
    .from('caregiving_insurance_plans')
    .select('*');

  if (error) {
    console.error("[-] Error fetching caregiving plans:", error.message);
    return;
  }

  if (!careData || careData.length === 0) {
    console.log("[-] No data found in the table.");
    return;
  }

  console.log(`[+] Total rows fetched: ${careData.length}`);
  
  // 1. 성별 보험료 분포 진단
  console.log("\n[1] Check for Premium Values:");
  let invalidFemaleCount = 0;
  let invalidMaleCount = 0;
  let supportTypeCount = 0;
  let expenseTypeCount = 0;
  
  careData.forEach((row: any) => {
    const malePremium = row.premium_male_40;
    const femalePremium = row.premium_female_40;
    const careType = row.care_type;
    
    if (careType === '지원일당') supportTypeCount++;
    if (careType === '사용일당') expenseTypeCount++;
    
    if (femalePremium < 1000) {
      invalidFemaleCount++;
    }
    if (malePremium < 1000) {
      invalidMaleCount++;
    }
  });
  
  console.log(`- Male premiums < 1000 won: ${invalidMaleCount} / ${careData.length}`);
  console.log(`- Female premiums < 1000 won: ${invalidFemaleCount} / ${careData.length}`);
  console.log(`- care_type '지원일당' count: ${supportTypeCount}`);
  console.log(`- care_type '사용일당' count: ${expenseTypeCount}`);
  
  // 2. 전체 데이터 목록 출력
  console.log("\n[2] All entries in caregiving_insurance_plans:");
  careData.forEach((row: any) => {
    console.log(`[ID ${row.id}] ${row.company_name} | ${row.product_name} | 타입: ${row.care_type} | 남성40: ${row.premium_male_40}원 | 여성40: ${row.premium_female_40}원 | 체증: ${row.is_increasing}`);
  });
}

run();
