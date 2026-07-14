const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../supabase-backup/backup_data/accident_products.json');
if (!fs.existsSync(filePath)) {
  console.error('File does not exist:', filePath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log(`Loaded ${data.length} rows.`);

let invalidCount = 0;
data.forEach((row, i) => {
  const bp = row.base_premium;
  if (bp === undefined || bp === null || typeof bp !== 'number' || Number.isNaN(bp)) {
    console.log(`Row ${i} is invalid:`, row);
    invalidCount++;
  }
});

console.log(`Total invalid rows: ${invalidCount}`);
