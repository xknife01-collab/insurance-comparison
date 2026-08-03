import dotenv from 'dotenv';
import fs from 'fs';
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
console.log("VITE_SUPABASE_URL:", envConfig.VITE_SUPABASE_URL);
