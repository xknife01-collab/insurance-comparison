import { fetchCaregivingPremium } from '../src/lib/insurance/caregiving/caregivingLoader';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  console.log("[*] Testing fetchCaregivingPremium with 40-year old Female, seeking '사용일당'...");
  
  const mockAnalysis: any = {
    gender: 'F',
    age: 40,
    caregiving: {
      type: 'expense', // 'expense' means 사용일당
      isStepUp: false,
      isNursingHospital: false,
      focusGeriatric: false,
      focusIntegrated: false
    }
  };

  const result = await fetchCaregivingPremium(mockAnalysis);
  
  if (!result) {
    console.log("[-] No result returned from loader.");
    return;
  }

  console.log("\n[+] Success! Loader result:");
  console.log(`- Recommended Company: ${result.companyName}`);
  console.log(`- Recommended Product: ${result.productName}`);
  console.log(`- Premium: ${result.premium.toLocaleString()} won`);
  
  console.log(`\n[+] All matching options (${result._allOptions.length} products found):`);
  result._allOptions.forEach((opt: any, index: number) => {
    console.log(`  [${index + 1}] ${opt.companyName} | ${opt.premium.toLocaleString()} won | ${opt.productName}`);
  });
}

run();
