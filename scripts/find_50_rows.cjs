
const fs = require('fs');
const path = require('path');

function findRowsWithAge(filepath, targetAge) {
  const content = fs.readFileSync(filepath, 'utf8');
  const rows = [];
  const trMatches = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  trMatches.forEach(tr => {
    const cells = (tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [])
      .map(c => c.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
    if (cells.length > 0) rows.push(cells);
  });

  console.log(`\n\n--- Searching for '${targetAge}' in ${path.basename(filepath)} ---`);
  rows.forEach((r, idx) => {
    const rowStr = r.join(' ');
    if (rowStr.includes(targetAge)) {
      console.log(`Row ${idx}: ${JSON.stringify(r.slice(0, 10))}`); // Print first 10 cols
      console.log(`Full Basis: ${rowStr.substring(0, 200)}...`); 
    }
  });
}

const silsonFile = 'scripts/scraper/raw_data/실손의료보험_상품비교_20260406102650414.xls';
findRowsWithAge(silsonFile, '50세');
