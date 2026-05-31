import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  console.log("[*] Testing fetchHomeFacilityPremium with 40-year old Male, seeking 'both' (home & facility)...");
  
  // Dynamically import loader after dotenv config has been applied to process.env
  const { fetchHomeFacilityPremium } = await import('../src/lib/insurance/home-facility/homeFacilityLoader');

  const mockAnalysis: any = {
    gender: 'M',
    age: 40,
    nursing: {
      preferredService: 'both',
      homeAmount: 500000,
      facilityAmount: 500000,
      hasProxyClaim: true,
      hasBrainHistory: false,
      hasLtcHistory: false
    }
  };

  const result = await fetchHomeFacilityPremium(mockAnalysis);
  
  if (!result) {
    console.log("[-] No result returned from home/facility loader.");
    return;
  }

  console.log("\n[+] Success! Loader result:");
  console.log(`- Recommended Company: ${result.companyName}`);
  console.log(`- Recommended Product: ${result.productName}`);
  console.log(`- Premium: ${result.premium.toLocaleString()} won`);
  
  console.log(`\n[+] All matching options (${result._allOptions.length} products found):`);
  result._allOptions.forEach((opt: any, index: number) => {
    console.log(`  [${index + 1}] ${opt.companyName} | ${opt.premium.toLocaleString()} won | ${opt.productName} (Riders: ${opt.ridersCount})`);
  });
}

run();
