
const fs = require('fs');
const path = require('path');

function getLatestFiles() {
  const root = 'scripts/scraper/raw_data';
  const allFiles = fs.readdirSync(root).filter(f => f.endsWith('.xls'));
  
  const groups = {};
  allFiles.forEach(file => {
    // Group by prefix (e.g., "보장성_상품비교")
    const match = file.match(/^(.*?)_20\d+/);
    const prefix = match ? match[1] : file.split(' ')[0];
    
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(file);
  });
  
  const latest = [];
  Object.keys(groups).forEach(prefix => {
    // Sort by name (timestamp is in name) and take the last one
    const sorted = groups[prefix].sort();
    latest.push(sorted[sorted.length - 1]);
  });
  
  return latest;
}

const latestFiles = getLatestFiles();
console.log(`[*] Latest Unique Files count: ${latestFiles.length}`);
latestFiles.forEach(f => console.log(`  - ${f}`));

function inspectProductRows(filepath, productNameSearch) {
  console.log(`\n--- Inspecting [${productNameSearch}] in ${path.basename(filepath)} ---`);
  const content = fs.readFileSync(filepath, 'utf8');
  
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;

  let tableMatch;
  while ((tableMatch = tableRegex.exec(content)) !== null) {
    let rowMatch;
    let currentRowIdx = 0;
    while ((rowMatch = rowRegex.exec(tableMatch[1])) !== null) {
      const cells = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cellMatch[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim());
      }
      
      if (cells.some(c => c.includes(productNameSearch))) {
        console.log(`Row Found: ${cells.join(' | ')}`);
      }
      currentRowIdx++;
    }
  }
}

// Inspect a few common products to see if they repeat with different ages
inspectProductRows(path.join('scripts/scraper/raw_data', '보장성_상품비교_20260406102522903.xls'), '한화생명');
inspectProductRows(path.join('scripts/scraper/raw_data', '실손의료보험_상품비교_20260406102650414.xls'), '삼성화재');
inspectProductRows(path.join('scripts/scraper/raw_data', '저축성_상품비교_20260406102606288.xls'), '흥국생명');
