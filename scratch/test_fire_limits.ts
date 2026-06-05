import * as fs from 'fs';
import * as path from 'path';

// Load env variables manually from .env.local using process.cwd()
try {
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envConfig = fs.readFileSync(envLocalPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/\r/g, '');
        process.env[key] = value;
      }
    });
    console.log('[*] Loaded .env.local successfully.');
    console.log('URL:', JSON.stringify(process.env.VITE_SUPABASE_URL));
    console.log('KEY:', JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing'));
  } else {
    console.log('[-] .env.local not found at ' + envLocalPath);
  }
} catch (e) {
  console.error('[-] Failed to load .env.local', e);
}

import { fetchFirePremium } from '../src/lib/insurance/fire/fireLoader';
import { InsuranceAnalysis } from '../src/types/insurance';

const runTest = async () => {
  const analysis1Ok = {
    selectedCategory: 'fire_real',
    monthlyPremium: 10000,
    age: 40,
    gender: 'M',
    healthStatus: 'standard',
    fire: {
      residenceType: 'apartment',
      occupancyType: 'owner',
      buildingArea: 84,
      structureGrade: 1,
      hasWaterLeakRider: true,
      hasLiabilityRider: true,
      hasTemporaryHousingRider: true,
      householdGoodsLimit: 30000000,
      buildingLimit: 100000000, // 1억
    }
  } as any as InsuranceAnalysis;

  const analysis100Ok = {
    selectedCategory: 'fire_real',
    monthlyPremium: 10000,
    age: 40,
    gender: 'M',
    healthStatus: 'standard',
    fire: {
      residenceType: 'apartment',
      occupancyType: 'owner',
      buildingArea: 84,
      structureGrade: 1,
      hasWaterLeakRider: true,
      hasLiabilityRider: true,
      hasTemporaryHousingRider: true,
      householdGoodsLimit: 30000000,
      buildingLimit: 10000000000, // 100억
    }
  } as any as InsuranceAnalysis;

  const res1 = await fetchFirePremium(analysis1Ok);
  const res100 = await fetchFirePremium(analysis100Ok);

  console.log('\n=== [1억] 회사별 계산 결과 (DB 요율 반영) ===');
  res1._allOptions.forEach((opt: any) => {
    console.log(`${opt.companyName.padEnd(10)}: 실납입=${opt.premium.toLocaleString().padStart(7)}원 (위험=${opt.riskPremium.toLocaleString().padStart(6)}원, 적립=${opt.savingsPremium.toLocaleString().padStart(6)}원)`);
  });

  console.log('\n=== [100억] 회사별 계산 결과 (DB 요율 반영) ===');
  res100._allOptions.forEach((opt: any) => {
    console.log(`${opt.companyName.padEnd(10)}: 실납입=${opt.premium.toLocaleString().padStart(7)}원 (위험=${opt.riskPremium.toLocaleString().padStart(6)}원, 적립=${opt.savingsPremium.toLocaleString().padStart(6)}원)`);
  });
};

runTest().catch(console.error);
