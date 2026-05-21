
const fs = require('fs');
const path = require('path');

function inspectExcel(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const rows = [];
  const trMatches = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  trMatches.forEach(tr => {
    const cells = (tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [])
      .map(c => c.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
    if (cells.length > 0) rows.push(cells);
  });

  console.log(`\n\n=== [Audit: ${path.basename(filepath)}] ===`);
  console.log(`Total Rows: ${rows.length}`);
  if (rows.length > 0) {
    console.log(`Header (Row 0): ${JSON.stringify(rows[0])}`);
    console.log(`Header (Row 1): ${JSON.stringify(rows[1])}`);
    console.log(`Header (Row 2): ${JSON.stringify(rows[2])}`);
  }

  // Look for any cell containing '50세' or any age distribution
  let agePointsFound = new Set();
  rows.forEach(r => {
    r.forEach(c => {
      const match = c.match(/(\d+)세/g);
      if (match) match.forEach(m => agePointsFound.add(m));
    });
  });
  console.log(`Age points mentioned in this file: ${Array.from(agePointsFound).join(', ')}`);

  // Sample data rows
  console.log(`Sample Data (Row 5): ${JSON.stringify(rows[5])}`);
  console.log(`Sample Data (Row 56): ${JSON.stringify(rows[56])}`);
  if (rows[100]) console.log(`Sample Data (Row 100): ${JSON.stringify(rows[100])}`);
}

const silsonFiles = [
  'scripts/scraper/raw_data/실손의료보험_상품비교_20260406102650414.xls',
  'scripts/scraper/raw_data/실손의료보험 비교공시.xls'
];

silsonFiles.forEach(f => {
  const fullPath = path.join(process.cwd(), f);
  if (fs.existsSync(fullPath)) inspectExcel(fullPath);
});
