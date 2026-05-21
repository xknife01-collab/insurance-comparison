
const fs = require('fs');
const path = require('path');

function inspectLongTerm(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const rows = [];
  const trMatches = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  trMatches.forEach(tr => {
    const cells = (tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [])
      .map(c => c.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
    if (cells.length > 0) rows.push(cells);
  });

  console.log(`\n\n=== [Audit: ${path.basename(filepath)}] ===`);
  // Look for age columns in the first 10 rows
  for (let i = 0; i < 10 && i < rows.length; i++) {
    const row = rows[i];
    row.forEach((cell, idx) => {
      if (cell.includes('50세')) {
        console.log(`Found '50세' in Row ${i}, Column ${idx}: ${cell}`);
      }
    });
  }

  // Show a couple of data rows
  if (rows[15]) console.log(`Data Row 15: ${JSON.stringify(rows[15])}`);
  if (rows[16]) console.log(`Data Row 16: ${JSON.stringify(rows[16])}`);
}

const file = 'scripts/scraper/raw_data/장기보장성 비교 공시 (1).xls';
inspectLongTerm(file);
