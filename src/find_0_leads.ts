import * as fs from 'fs';
import { runAnalysis } from './lib/analysisEngine';

const leadsPath = './supabase-backup/backup_data/customer_leads.json';
const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf-8'));

async function testAll() {
  console.log('Testing all remodeling leads in workspace...');
  let checked = 0;
  let zeros = 0;
  
  for (const lead of leads) {
    const isRemod = lead.insurance_type === 'remodeling' || lead.insurance_type === 'remodeling_consult';
    if (!isRemod) continue;
    
    checked++;
    const coverage = lead.raw_payload?.analysisInputs?._remodelingCoverage || lead.raw_payload?._remodelingCoverage;
    if (!coverage) {
      continue;
    }
    
    const analysisInput = {
      name: '고객',
      mobile: '010-0000-0000',
      age: coverage.age || lead.age || 40,
      gender: coverage.gender || lead.raw_payload?.gender || 'M',
      jobClass: 1,
      selectedCategory: 'remodeling',
      cancer: { currentAmount: coverage.cancer_diagnosis || 0, targetAmount: 50000000 },
      cerebrovascular: { currentAmount: coverage.brain_vascular || 0, targetAmount: 30000000 },
      cardiovascular: { currentAmount: coverage.ischemic_heart || 0, targetAmount: 30000000 },
      surgery: { currentAmount: coverage.surgery_amount ?? 0, targetAmount: 10000000 },
      postDisability: { currentAmount: coverage.post_disability_amount ?? 0, targetAmount: 30000000 },
      paymentExemption: 'standard' as const,
      healthStatus: 'standard' as const,
      monthlyPremium: coverage.current_total_premium || lead.monthly_premium || 50000,
      _remodelingCoverage: coverage
    };

    try {
      const result = await runAnalysis(analysisInput);
      const dietOpts = result.analysis?._allDietOptions || [];
      const upOpts = result.analysis?._allUpgradeOptions || [];
      
      const hasZeroDiet = dietOpts.some((o: any) => o.premium === 0 || o.premium === undefined);
      const hasZeroUp = upOpts.some((o: any) => o.premium === 0 || o.premium === undefined);
      
      if (hasZeroDiet || hasZeroUp) {
        zeros++;
        console.log(`Lead ID ${lead.id} (${lead.name}) has ZERO or undefined premium!`);
        console.log(`- Policies:`, coverage.policies?.map((p: any) => p.product_name));
        console.log(`- Diet options:`, dietOpts.map((o: any) => `${o.categoryLabel}: ${o.companyName} = ${o.premium}`));
      }
    } catch (e) {
      console.error(`Error on Lead ID ${lead.id}:`, e);
    }
  }
  
  console.log(`Done. Checked: ${checked}, Zeros/Undefined: ${zeros}`);
}

testAll().catch(console.error);
