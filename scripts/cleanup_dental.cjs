const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function cleanup() {
  console.log('[*] FETCHING PRODUCTS FOR CLEANUP...');
  const { data: prods, error } = await supabase.from('dental_products').select('product_code, display_name');
  
  if (error) {
    console.error('[-] Error fetching products:', error);
    return;
  }

  const badProds = prods.filter(p => 
    !p.display_name.includes('치아') && 
    !p.display_name.includes('치과') && 
    !p.display_name.includes('덴탈')
  );

  console.log(`[!] FOUND ${badProds.length} IRRELEVANT PRODUCTS OUT OF ${prods.length}`);

  if (badProds.length > 0) {
    const codes = badProds.map(p => p.product_code);
    console.log('[*] DELETING IRRELEVANT DENTAL DATA...');
    
    // Delete rates first due to foreign key or logical link
    await supabase.from('dental_rates').delete().in('product_code', codes);
    await supabase.from('dental_products').delete().in('product_code', codes);
    
    console.log('[-] CLEANUP COMPLETE.');
  } else {
    console.log('[-] NO BAD PRODUCTS FOUND.');
  }
}

cleanup();
