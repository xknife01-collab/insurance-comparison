
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scripts/scraper/unified_products_final.json', 'utf8'));

const keywords = ['간편', '유병', '3.5.5', '3.2.5', '3.3.5', '3.0.5', '심사'];
const results = data.filter(p => keywords.some(kw => p.product_name.includes(kw)));

console.log(`Found ${results.length} UBJ products in unified_products_final.json.`);
if (results.length > 0) {
    console.log('Sample Products:');
    results.slice(0, 5).forEach(p => console.log(`- [${p.company}] ${p.product_name}`));
}
