import dotenv from 'dotenv';
import fs from 'fs';
const envConfig = dotenv.parse(fs.readFileSync('.env'));
console.log("DATABASE_URL:", envConfig.DATABASE_URL);
