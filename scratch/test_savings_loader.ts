import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runTest(profileName: string, age: number, gender: 'M' | 'F', monthlyPremium: number, paymentPeriod: number, maintenancePeriod: number) {
  const { fetchSavingsPremium } = await import('../src/lib/insurance/savings/savingsLoader');
  
  console.log(`\n========================================`);
  console.log(`[*] Testing Profile: ${profileName} (${age}세 ${gender === 'M' ? '남성' : '여성'}, 납입: ${paymentPeriod}년, 유지: ${maintenancePeriod}년, 월: ${monthlyPremium.toLocaleString()}원)`);
  
  const mockAnalysis: any = {
    age,
    gender,
    savingsGeneral: {
      savingType: 'installment',
      monthlyPremium,
      paymentPeriod,
      maintenancePeriod,
      savingsObjective: 'wealth',
      hasUniversal: true
    }
  };

  const result = await fetchSavingsPremium(mockAnalysis);
  
  if (!result || !result._allOptions || result._allOptions.length === 0) {
    console.log("[-] No options returned.");
    return;
  }

  // Print recommended product info
  const topOpt = result._allOptions[0];
  console.log(`[+] Recommended Product: ${topOpt.companyName} - ${topOpt.productName}`);
  console.log(`    - Plan Level: ${topOpt.planLevel}`);
  console.log(`    - Declared Rate: ${topOpt.declaredRate}%`);
  console.log(`    - Refund Ratio: ${topOpt.refundRatio.toFixed(2)}%`);
  console.log(`    - Tax Status: ${topOpt.details['비과세 혜택 여부']}`);
}

async function main() {
  // 1. Profile A: 25세 여성 (20대 - 저위험, 고환급형)
  await runTest("Profile A: 20대 여성", 25, 'F', 300000, 5, 10);
  
  // 2. Profile B: 55세 남성 (50대 - 고위험, 저환급형)
  await runTest("Profile B: 50대 남성", 55, 'M', 300000, 5, 10);
  
  // 3. Profile C: 68세 여성 (고령자 비과세 종합저축 특례 대상 - 단기 납입에도 비과세 충족)
  await runTest("Profile C: 고령자 여성 특례", 68, 'F', 300000, 3, 3);
}

main();
