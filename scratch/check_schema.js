import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('planners')
    .update({ certification_message: 'Test Message' })
    .eq('planner_code', 'admin')
    .select();

  if (error) {
    console.error("Error updating planner with cert message:", error);
  } else {
    console.log("Success! Updated data:", data);
  }
}

run();
