import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env.local
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase URL or service role key in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('planners').select('*');
  if (error) {
    console.error("Error fetching planners:", error);
  } else {
    console.log("Planners count:", data.length);
    data.forEach(p => {
      console.log(`ID: ${p.id} | Code: ${p.planner_code} | Name: ${p.name} | Cert: ${p.certification_message}`);
    });
  }
}

run();
