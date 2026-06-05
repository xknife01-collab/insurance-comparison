import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Explicitly assign before dynamically importing the loader
process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

async function run() {
  const { fetchAccidentPremium } = await import('../src/lib/insurance/accident/accidentLoader');

  const cases = [
    { name: "비운전 (none), 남성", drivingType: 'none', gender: 'M' },
    { name: "자가용 (private), 남성", drivingType: 'private', gender: 'M' },
    { name: "비운전 (none), 여성", drivingType: 'none', gender: 'F' },
    { name: "자가용 (private), 여성", drivingType: 'private', gender: 'F' },
  ];

  for (const c of cases) {
    const analysis = {
      age: 40,
      gender: c.gender,
      accident: {
        accidentDeathLimit: 150000000,
        accidentDisabilityLimit: 150000000,
        fractureLimit: 100000,
        castLimit: 0,
        surgeryLimit: 100000,
        hospitalDailyLimit: 0,
        jobClass: 1,
        drivingType: c.drivingType,
        hasLeisureRider: false
      }
    };

    const res = await fetchAccidentPremium(analysis as any);
    console.log(`\n=== CASE: ${c.name} ===`);
    res._allOptions.slice(0, 3).forEach((o: any) => {
      console.log(`- [${o.companyName}] ${o.productName} -> ${o.premium}원`);
    });
  }
}

run();
