import { fetchAccidentPremium } from '../src/lib/insurance/accident/accidentLoader';

async function test() {
  const analysis = {
    age: 40,
    gender: 'M',
    accident: {
      accidentDeathLimit: 50000000,
      accidentDisabilityLimit: 50000000,
      fractureLimit: 300000,
      castLimit: 100000,
      surgeryLimit: 500000,
      hospitalDailyLimit: 20000,
      jobClass: 1,
      drivingType: 'private',
      hasLeisureRider: false
    }
  };

  const res = await fetchAccidentPremium(analysis as any);
  console.log('Results length:', res._allOptions.length);
  console.log('Results sample:', res._allOptions.map((o: any) => ({
    companyName: o.companyName,
    productName: o.productName,
    premium: o.premium
  })));
}

test();
