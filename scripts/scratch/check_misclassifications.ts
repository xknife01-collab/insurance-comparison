import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

async function run() {
  const { data, error } = await supabase
    .from('variable_products')
    .select('*');
    
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  console.log("=== MISCLASSIFICATION CHECK ===");
  let misclassified = 0;
  
  data?.forEach(p => {
    const name = p.product_name;
    const type = p.sub_type;
    
    // Check term_ceo
    if (type === 'term_ceo') {
      if (!name.includes("경영인") && !name.includes("CEO")) {
        console.log(`[!] CEO Warning: ${name} is marked as term_ceo`);
      }
    }
    
    // Check variable_term
    if (type === 'variable_term') {
      if (!name.includes("변액")) {
        console.log(`[!] Variable Term Warning: ${name} is marked as variable_term but does not contain 변액`);
      }
      if (!name.includes("정기") && !name.includes("종신") && !name.includes("GI")) {
        console.log(`[!] Variable Term Warning: ${name} is marked as variable_term but has no term/death indicators`);
      }
    }
    
    // Check variable_saving
    if (type === 'variable_saving') {
      if (!name.includes("변액")) {
        console.log(`[!] Variable Saving Warning: ${name} is marked as variable_saving but does not contain 변액`);
      }
    }
    
    // Check term_pure
    if (type === 'term_pure') {
      if (name.includes("변액")) {
        console.log(`[!] Pure Term Warning: ${name} contains 변액 but is marked as term_pure`);
        misclassified++;
      }
      if (name.includes("경영인") || name.includes("CEO")) {
        console.log(`[!] Pure Term Warning: ${name} contains CEO/경영인 but is marked as term_pure`);
        misclassified++;
      }
    }
  });
  
  console.log(`Check complete. Misclassified/Suspicious: ${misclassified}`);
}

run();
