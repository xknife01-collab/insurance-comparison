
const XLSX = require('xlsx');
const fs = require('fs');

async function inspectSilpi() {
  const filePath = 'scripts/scraper/raw_data/실손의료보험_상품비교_20260406102650414.xls';
  const buf = fs.readFileSync(filePath);
  const workbook = XLSX.read(buf, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log('--- Silpi Excel Structure (First 20 rows) ---');
  data.slice(0, 20).forEach((row, i) => {
    console.log(`Row ${i}:`, JSON.stringify(row));
  });
}

inspectSilpi();
