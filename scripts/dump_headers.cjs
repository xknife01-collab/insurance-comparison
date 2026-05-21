
const fs = require('fs');
const path = require('path');

function dumpHeaders(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const rows = [];
  const trMatches = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  trMatches.forEach(tr => {
    const cells = (tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [])
      .map(c => c.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
    if (cells.length > 0) rows.push(cells);
  });

  console.log(`\n\n=== [Headers: ${path.basename(filepath)}] ===`);
  for (let i = 0; i < 5; i++) {
    process.stdout.write(`Row ${i}: `);
    console.log(JSON.stringify(rows[i]));
  }
}

const file = 'scripts/scraper/raw_data/장기보장성 비교 공시 (1).xls';
dumpHeaders(file);
