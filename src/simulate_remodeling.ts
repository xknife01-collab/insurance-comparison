import * as fs from 'fs';
import { runAnalysis } from './lib/analysisEngine';

const leadsPath = './supabase-backup/backup_data/customer_leads.json';
const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf-8'));

// Lead ID 185
const lead = leads.find((l: any) => l.id === 185);

async function run() {
  const coverage = lead.raw_payload.analysisInputs._remodelingCoverage;
  
  const analysisInput = {
    name: '고객',
    mobile: '010-0000-0000',
    age: coverage.age,
    gender: coverage.gender,
    jobClass: 1,
    selectedCategory: 'remodeling',
    cancer: { currentAmount: coverage.cancer_diagnosis, targetAmount: 50000000 },
    cerebrovascular: { currentAmount: coverage.brain_vascular, targetAmount: 30000000 },
    cardiovascular: { currentAmount: coverage.ischemic_heart, targetAmount: 30000000 },
    surgery: { currentAmount: coverage.surgery_amount ?? 0, targetAmount: 10000000 },
    postDisability: { currentAmount: coverage.post_disability_amount ?? 0, targetAmount: 30000000 },
    paymentExemption: 'standard' as const,
    healthStatus: 'standard' as const,
    monthlyPremium: coverage.current_total_premium,
    _remodelingCoverage: coverage
  };

  const result = await runAnalysis(analysisInput);
  console.log('Result categories and premiums:');
  result.analysis?._allDietOptions?.forEach((opt: any, idx: number) => {
    console.log(`${idx}: categoryLabel=${opt.categoryLabel}, companyName=${opt.companyName}, productName=${opt.productName}, premium=${opt.premium}`);
  });
}

run().catch(console.error);
