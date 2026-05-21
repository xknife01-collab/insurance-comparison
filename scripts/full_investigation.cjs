
const fs = require('fs');
const path = require('path');

function analyzeFile(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;

    let mainTable = null;
    let maxRows = 0;

    let tableMatch;
    while ((tableMatch = tableRegex.exec(content)) !== null) {
      const rows = [];
      let rowMatch;
      let rowCount = 0;
      while ((rowMatch = rowRegex.exec(tableMatch[1])) !== null && rowCount < 10) {
        const cells = [];
        let cellMatch;
        while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
          cells.push(cellMatch[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim());
        }
        if (cells.length > 0) rows.push(cells);
        rowCount++;
      }
      const totalRowsCount = (tableMatch[1].match(/<tr/gi) || []).length;
      if (totalRowsCount > maxRows) {
        maxRows = totalRowsCount;
        mainTable = { rows, totalRows: totalRowsCount };
      }
    }
    
    if (mainTable) {
      return {
        columns: mainTable.rows[0] || [],
        sampleRows: mainTable.rows.slice(1, 4),
        totalRows: mainTable.totalRows
      };
    }
    return null;
  } catch (err) {
    return { error: err.message };
  }
}

const root = 'scripts/scraper/raw_data';
const allFiles = fs.readdirSync(root).filter(f => f.endsWith('.xls'));
const summary = {};

allFiles.forEach(file => {
  // Better grouping: split by underscore or space
  let type = file.replace(/\(\d+\)/g, '').split(/[_\s]/)[0]; 
  if (type === '실손의료보험') type = '실손';
  
  if (!summary[type]) summary[type] = { count: 0, files: [], schemas: new Map() };
  
  const result = analyzeFile(path.join(root, file));
  if (result && result.columns.length > 0) {
    summary[type].count++;
    summary[type].files.push({ name: file, rows: result.totalRows });
    const schemaKey = result.columns.join('|');
    if (!summary[type].schemas.has(schemaKey)) {
      summary[type].schemas.set(schemaKey, { columns: result.columns, sample: result.sampleRows[0] || [] });
    }
  }
});

console.log('\n=== [전수 조사 최종 보고서] ===\n');

Object.keys(summary).sort().forEach(type => {
  const data = summary[type];
  if (data.count === 0) return;

  console.log(`[카테고리: ${type}]`);
  console.log(`- 전체 파일: ${data.count}개`);
  
  data.schemas.forEach((schemaData, schemaKey) => {
    console.log(`\n  >> 데이터 구조 (컬럼 수: ${schemaData.columns.length})`);
    console.log(`     컬럼명: ${schemaData.columns.slice(0, 10).join(' | ')}${schemaData.columns.length > 10 ? ' ...' : ''}`);
    console.log(`     샘플 데이터: ${schemaData.sample.slice(0, 10).map(s => s.length > 20 ? s.substring(0, 20) + '...' : s).join(' | ')}`);
  });

  const totalRows = data.files.reduce((acc, f) => acc + f.rows, 0);
  console.log(`\n- 총 데이터 행 수: 약 ${totalRows}개`);
  console.log('============================================================\n');
});
