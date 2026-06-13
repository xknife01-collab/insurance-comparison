import fs from 'fs';
import path from 'path';

function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  const result: string[][] = [];
  
  for (let line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let inQuotes = false;
    let current = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    result.push(row);
  }
  return result;
}

function getNormalizationFactor(amountStr: string): number {
  if (!amountStr) return 1.0;
  
  const clean = amountStr.replace(/\s+/g, '').replace(/,/g, '');
  const numMatch = clean.match(/^[0-9.]+/);
  if (!numMatch) return 1.0;
  
  const numVal = parseFloat(numMatch[0]);
  if (numVal <= 0) return 1.0;
  
  if (clean.includes('억')) {
    return 1.0 / numVal; 
  }
  
  if (clean.includes('만원') || clean.includes('만')) {
    return 10000.0 / numVal;
  }
  
  if (clean.includes('달러') || clean.includes('USD')) {
    return 1000.0;
  }
  
  return 100000.0 / numVal;
}

const csvPath = path.resolve(process.cwd(), 'insurance_data', '5_savings', 'variable_term', 'extracted_data.csv');
const csvText = fs.readFileSync(csvPath, 'utf-8');
const rows = parseCSV(csvText);
const headers = rows[0];
const companyIdx = headers.indexOf("보험회사");
const productIdx = headers.indexOf("상품명");
const amountIdx = headers.indexOf("가입금액");
const subTypeIdx = headers.indexOf("sub_type");

console.log("Headers:", headers);
console.log("amountIdx:", amountIdx);

for (let row of rows.slice(1)) {
  const company = row[companyIdx];
  const prod = row[productIdx];
  const amt = row[amountIdx];
  const sub = row[subTypeIdx];
  if (company && (company.includes("흥국") || company.includes("푸본") || company.includes("교보") || company.includes("하나"))) {
    console.log(`Company: ${company} | Prod: ${prod} | Sub: ${sub} | AmtStr: "${amt}" | Factor: ${getNormalizationFactor(amt)}`);
  }
}
