import { fetchAccidentPremium } from '../src/lib/insurance/accident/accidentLoader';

async function run() {
  const analysis = {
    age: 40,
    gender: 'M',
    accident: {
      accidentDeathLimit: 150000000,
      accidentDisabilityLimit: 150000000,
      fractureLimit: 100000,
      castLimit: 0,
      surgeryLimit: 100000,
      hospitalDailyLimit: 0,
      jobClass: 1,
      drivingType: 'none',
      hasLeisureRider: false
    }
  };

  const res = await fetchAccidentPremium(analysis as any);
  console.log("=== RESULTS ===");
  console.log("Monthly Premium:", res.premium);
  console.log("Product Name:", res.productName);
  console.log("Company Name:", res.companyName);
  console.log("All Options:");
  res._allOptions.forEach((o: any) => {
    console.log(`- [${o.companyName}] ${o.productName} -> ${o.premium}원 (Plan: ${o.planLevel})`);
  });
}

run();
