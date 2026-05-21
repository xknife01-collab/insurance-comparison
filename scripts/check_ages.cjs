
const fs = require('fs');
const path = require('path');

function checkAges(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;

  let products = {};
  let tableMatch;
  while ((tableMatch = tableRegex.exec(content)) !== null) {
    let rowMatch;
    let currentRow = [];
    while ((rowMatch = rowRegex.exec(tableMatch[1])) !== null) {
      const cells = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cellMatch[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim());
      }
      
      if (cells.length > 5) {
        const prod = cells[1]; // Product name is usually the 2nd col
        if (prod && prod.length > 5) {
          if (!products[prod]) products[prod] = 0;
          products[prod]++;
        }
      }
    }
  }
  return products;
}

const root = 'scripts/scraper/raw_data';
const file = '보장성_상품비교_20260406102522903.xls';
console.log(`Analyzing ${file} for duplicate products (indicating multiple ages/cases)...`);
const prods = checkAges(path.join(root, file));
Object.entries(prods).slice(0, 10).forEach(([name, count]) => {
  console.log(`${name}: ${count} rows`);
});
