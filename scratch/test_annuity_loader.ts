import { fetchAnnuityPremium } from '../src/lib/insurance/annuity/annuityLoader';

async function run() {
  try {
    const result = await fetchAnnuityPremium({
      age: 35,
      gender: 'M',
      selectedCategory: 'annuity_savings',
      annuity: {
        annuityType: 'savings',
        monthlyPremium: 300000,
        paymentPeriod: 10,
        commencementAge: 60,
        annualIncome: 50000000,
        hasIrp: false,
        receivingPeriod: 20
      }
    } as any);
    console.log('Annuity results keys:', Object.keys(result));
    console.log('Result productName:', result.productName);
    console.log('Result companyName:', result.companyName);
    console.log('All options count:', result._allOptions?.length);
    if (result._allOptions && result._allOptions.length > 0) {
      console.log('First 5 options:');
      console.log(result._allOptions.slice(0, 5).map((o: any) => ({
        company: o.companyName,
        product: o.productName,
        premium: o.premium,
        features: o.features
      })));
    }
  } catch (err) {
    console.error('Error running test:', err);
  }
}

run();
