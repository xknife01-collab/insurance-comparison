
const fs = require('fs');
const path = require('path');

function analyzeFile(filepath) {
  console.log(`\n[FILE ANALYZING]: ${path.basename(filepath)}`);
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Very simple table parser for HTML (match <tr> and <td>/<th>)
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;

    let tableMatch;
    while ((tableMatch = tableRegex.exec(content)) !== null) {
      const rows = [];
      let rowMatch;
      while ((rowMatch = rowRegex.exec(tableMatch[1])) !== null) {
        const cells = [];
        let cellMatch;
        while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
          // Clean up HTML tags and whitespace
          cells.push(cellMatch[2].replace(/<[^>]*>/g, '').trim());
        }
        if (cells.length > 0) rows.push(cells);
      }
      
      if (rows.length > 0) {
        console.log(`[*] Table with ${rows.length} rows found.`);
        console.log(`[*] Columns: ${rows[0].join(', ')}`);
        for (let i = 1; i < Math.min(6, rows.length); i++) {
          console.log(`Row ${i}: ${rows[i].join(', ')}`);
        }
        // Only analyze the largest table as it's likely the main one
        break; 
      }
    }
  } catch (err) {
    console.error(`[-] Error: ${err.message}`);
  }
}

const root = 'scripts/scraper/raw_data';
const files = [
  '보장성_상품비교_20260406102522903.xls',
  '실손의료보험_상품비교_20260406102650414.xls',
  '장기보장성 비교 공시.xls'
];

files.forEach(f => analyzeFile(path.join(root, f)));
