import * as fs from 'fs';
import { maskCompany } from './utils/compliance';

const leadsPath = './supabase-backup/backup_data/customer_leads.json';
const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf-8'));

const companies = new Set<string>();
for (const lead of leads) {
  const isRemod = lead.insurance_type === 'remodeling' || lead.insurance_type === 'remodeling_consult';
  if (!isRemod) continue;
  
  const ar = lead.analysis_result;
  if (!ar) continue;
  
  const dietOpts = ar.analysis?._allDietOptions || [];
  for (const o of dietOpts) {
    const co = o.companyName || o.company || '';
    if (co) {
      companies.add(co);
    }
  }
}

console.log('All unique company names in database diet options:');
companies.forEach(co => {
  console.log(`${co} -> ${maskCompany(co, false)}`);
});
