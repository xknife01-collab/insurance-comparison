import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("[*] Fetching all caregiving_insurance_plans from Supabase...\n");
  
  const { data: careData, error } = await supabase
    .from('caregiving_insurance_plans')
    .select('*');

  if (error || !careData) {
    console.error("[-] Fetch error:", error?.message);
    return;
  }

  console.log(`[+] Total rows in DB: ${careData.length}\n`);

  // Simulate the UPDATED caregivingLoader.ts filtering logic
  const gender: string = 'F'; // 여성 40세 기준
  const careTypePreference = '사용일당';
  const seen = new Set<string>();
  const groupMin = new Map<string, { premium: number; meta: any }>();

  careData.forEach((p: any) => {
    const rawName = p.product_name || '';
    const isCareTarget = rawName.includes('간병') || rawName.includes('요양');
    // Updated exclusion (no more '입원' or '수술')
    const isExcluded = /건강보험|종합보험|암보험|운전자|뇌혈관|심장|치매|CDR/.test(rawName);
    
    if (!isCareTarget || isExcluded) {
      console.log(`  [SKIP] ${rawName.substring(0, 40)} | isCareTarget=${isCareTarget}, isExcluded=${isExcluded}`);
      return;
    }

    const rawPremium = gender === 'M' ? p.premium_male_40 : p.premium_female_40;
    if (!rawPremium || rawPremium === 0) {
      console.log(`  [SKIP-no-premium] ${rawName.substring(0, 40)}`);
      return;
    }

    const dupeKey = `${rawName}|${rawPremium}`;
    if (seen.has(dupeKey)) return;
    seen.add(dupeKey);

    const corrected = rawPremium; // age=40 so ratio=1.0
    let basePremium = Math.round(corrected * 1.25);

    // Updated groupKey using rawName (no normalization)
    const groupKey = `${p.company_name}__${p.care_type}__${rawName}`;
    const typeMatch = !!(p.care_type === careTypePreference || (p.care_type && p.care_type.includes(careTypePreference)));

    const existing = groupMin.get(groupKey);
    if (!existing || basePremium < existing.premium) {
      groupMin.set(groupKey, {
        premium: basePremium,
        meta: {
          productName: p.product_name,
          companyName: p.company_name,
          careType: p.care_type,
          typeMatch,
          malePremium: p.premium_male_40,
          femalePremium: p.premium_female_40,
        }
      });
    }
  });

  const allOptions = Array.from(groupMin.values())
    .map(v => ({ premium: v.premium, ...v.meta }))
    .sort((a, b) => a.premium - b.premium);
    
  const matchedOptions = allOptions.filter(r => r.typeMatch);

  console.log(`\n[+] Total options after filtering: ${allOptions.length}`);
  console.log(`[+] Options matching care type '${careTypePreference}': ${matchedOptions.length}`);
  
  console.log("\n--- All Matched Options (sorted by premium) ---");
  matchedOptions.forEach((opt, idx) => {
    console.log(`[${idx + 1}] ${opt.companyName} | ${opt.careType} | Male: ${opt.malePremium?.toLocaleString()}원 | Female: ${opt.femalePremium?.toLocaleString()}원`);
    console.log(`    ${opt.productName.substring(0, 60)}`);
  });

  if (matchedOptions.length === 0) {
    console.log("\n[!] No matched options! Showing all options without typeMatch filter:");
    allOptions.forEach((opt, idx) => {
      console.log(`[${idx + 1}] ${opt.companyName} | care_type=${opt.careType} | typeMatch=${opt.typeMatch}`);
      console.log(`    ${opt.productName.substring(0, 60)}`);
    });
  }
}

run();
