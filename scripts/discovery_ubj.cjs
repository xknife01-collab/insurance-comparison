
const fs = require('fs');
const path = require('path');

function analyzeFile(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;

    let tables = [];
    let tableMatch;
    while ((tableMatch = tableRegex.exec(content)) !== null) {
      const rows = [];
      let rowMatch;
      while ((rowMatch = rowRegex.exec(tableMatch[1])) !== null && rows.length < 50) {
        const cells = [];
        let cellMatch;
        while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
          cells.push(cellMatch[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim());
        }
        if (cells.length > 0) rows.push(cells);
      }
      tables.push(rows);
    }
    return tables;
  } catch (err) {
    return null;
  }
}

const root = 'scripts/scraper/raw_data';
const allFiles = fs.readdirSync(root).filter(f => f.endsWith('.xls'));

const ubjFiles = [];

const keywords = ['간편', '유병', '3.3.5', '3.2.5', '3.1.5', '3.5.5', '3.0.5', '심사'];

allFiles.forEach(file => {
  const filepath = path.join(root, file);
  const tables = analyzeFile(filepath);
  if (!tables) return;

  let isUBJ = false;
  let productName = '';
  let companyName = '';
  let reviewType = 'unknown';

  for (const rows of tables) {
    for (const row of rows) {
      const rowText = row.join(' ');
      if (keywords.some(kw => rowText.includes(kw))) {
        isUBJ = true;
      }
      
      // Try to find product name / company
      row.forEach(cell => {
        if (cell.includes('보험회사명')) companyName = row[row.indexOf(cell) + 1] || companyName;
        if (cell.includes('상품명')) productName = row[row.indexOf(cell) + 1] || productName;
      });

      // Special check for 3.x.5 in product name or text
      const reviewMatch = rowText.match(/3\.\d\.5/);
      if (reviewMatch) reviewType = reviewMatch[0];
    }
    if (isUBJ) break;
  }

  if (isUBJ) {
    ubjFiles.push({ file, productName, companyName, reviewType });
  }
});

console.log(JSON.stringify(ubjFiles, null, 2));
