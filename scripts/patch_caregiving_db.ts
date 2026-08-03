import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[-] Supabase URL or Key not found in env.");
  process.exit(1);
}

// Use Service Role Key if available for bypass RLS and direct write permissions
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("[*] Fetching all rows from caregiving_insurance_plans...");
  const { data: rows, error: fetchErr } = await supabase
    .from('caregiving_insurance_plans')
    .select('*');

  if (fetchErr || !rows) {
    console.error("[-] Fetch error:", fetchErr?.message || "No data");
    return;
  }

  console.log(`[+] Fetched ${rows.length} rows.`);

  // 1. Identify dementia (치매) related rows to delete
  const dementiaIds: number[] = [];
  const pureRows: any[] = [];

  rows.forEach((row: any) => {
    const name = row.product_name || '';
    const careType = row.care_type || '';
    if (name.includes('치매') || name.includes('CDR') || careType === '치매간병') {
      dementiaIds.push(row.id);
    } else {
      pureRows.push(row);
    }
  });

  if (dementiaIds.length > 0) {
    console.log(`[*] Deleting ${dementiaIds.length} dementia-related rows...`);
    const { error: delErr } = await supabase
      .from('caregiving_insurance_plans')
      .delete()
      .in('id', dementiaIds);

    if (delErr) {
      console.error("[-] Delete error:", delErr.message);
    } else {
      console.log("[+] Successfully deleted dementia rows.");
    }
  } else {
    console.log("[*] No dementia-related rows found to delete.");
  }

  // 2. Patch pure caregiving rows
  console.log(`[*] Patching ${pureRows.length} remaining pure caregiving rows...`);
  for (const row of pureRows) {
    const malePrem = row.premium_male_40 || 0;
    const femalePrem = Math.round((malePrem * 1.2) / 10) * 10;
    
    // Determine is_increasing flag
    const name = row.product_name || '';
    let isIncreasing = false;
    if (name.includes('체증') || name.includes('RICH') || name.includes('리치') || name.includes('프리미엄') || name.includes('Rich')) {
      isIncreasing = true;
    }

    console.log(`  -> ID ${row.id} (${row.company_name} - ${name.substring(0, 20)}...): Male=${malePrem} -> Female=${femalePrem}, Increasing=${isIncreasing}`);

    const { error: updErr } = await supabase
      .from('caregiving_insurance_plans')
      .update({
        premium_female_40: femalePrem,
        is_increasing: isIncreasing
      })
      .eq('id', row.id);

    if (updErr) {
      console.error(`  [-] Update failed for ID ${row.id}:`, updErr.message);
    }
  }

  console.log("\n[*] Verification: Fetching final results...");
  const { data: finalRows, error: verifyErr } = await supabase
    .from('caregiving_insurance_plans')
    .select('id, company_name, product_name, care_type, premium_male_40, premium_female_40, is_increasing');

  if (verifyErr || !finalRows) {
    console.error("[-] Verification failed:", verifyErr?.message);
  } else {
    console.log(`[+] Total remaining pure rows: ${finalRows.length}`);
    console.log("[+] Sample of patched rows:");
    console.log(JSON.stringify(finalRows.slice(0, 5), null, 2));
  }
}

run();
