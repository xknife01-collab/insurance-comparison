import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const TABLES = [
  'medical_silson_rates',
  'medical_silson_products',
  'insurance_cancer_rates',
  'insurance_cancer_products',
  'brain_insurance_rates',
  'brain_insurance_products',
  'heart_insurance_plans',
  'insurance_surgery_hospital_rates',
  'insurance_dementia_rates',
  'insurance_home_facility_rates',
  'dental_rates',
  'caregiving_insurance_plans',
  'insurance_yu_byung_ja',
  'insurance_child_sick_rates',
  'insurance_child_rates',
  'insurance_car_rates',
  'driver_insurance_rates',
  'driver_insurance_products',
  'pet_breeds',
  'insurance_pet_rates',
  'golf_insurance_rates',
  'insurance_fire_rates',
  'insurance_property_rates',
  'pension_products',
  'whole_life_products',
  'variable_products',
  'legal_insurance_rates',
  'legal_insurance_products',
  'savings_products',
  'credit_insurance_plans',
  'accident_products',
  'health_general_products',
  'customer_leads',
  'agencies',
  'planners',
  'credit_transactions',
  'chat_rooms',
  'chat_room_members',
  'chat_messages',
  'planner_push_subscriptions',
  'marketing_playbooks',
  'ad_requests',
  'visitor_logs',
  'insurance_rates'
];

async function fetchAllRows(tableName: string) {
  let allData: any[] = [];
  let start = 0;
  const limit = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .range(start, start + limit - 1);
      
    if (error) {
      // If table doesn't exist, we can log it and skip or rethrow
      if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
        console.warn(`[Warning] Table ${tableName} does not exist. Skipping...`);
        return null;
      }
      console.error(`Error fetching table ${tableName}:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      break;
    }
    
    allData = allData.concat(data);
    if (data.length < limit) {
      break;
    }
    start += limit;
  }
  return allData;
}

async function run() {
  const backupDir = path.resolve(process.cwd(), 'supabase-backup', 'backup_data');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`Starting Supabase data backup from: ${supabaseUrl}`);
  console.log(`Saving JSON files to: ${backupDir}\n`);

  for (const table of TABLES) {
    try {
      console.log(`[Backup] Fetching data from: ${table}...`);
      const data = await fetchAllRows(table);
      if (data !== null) {
        const filePath = path.join(backupDir, `${table}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`[Backup] Successfully saved ${data.length} rows to ${table}.json`);
      }
    } catch (err) {
      console.error(`[Error] Failed to back up table: ${table}`, err);
    }
  }

  console.log('\nBackup completed successfully!');
}

run();
