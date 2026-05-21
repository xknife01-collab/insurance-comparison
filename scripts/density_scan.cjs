
const fs = require('fs');
const path = require('path');

function finalProductScan(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;

    let prodCounts = {};
    let rowMatch;
    while ((rowMatch = rowRegex.exec(content)) !== null) {
      const cells = [];
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cellMatch[2].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim());
      }
      
      // Look for product name in 2nd column (standard for these HTML files)
      if (cells.length > 5) {
        const prod = cells[1];
        if (prod && prod.length > 5) {
          if (!prodCounts[prod]) prodCounts[prod] = 0;
          prodCounts[prod]++;
        }
      }
    }
    
    // Find products with maximum rows
    const maxRows = Math.max(...Object.values(prodCounts), 0);
    return {
      totalProducts: Object.keys(prodCounts).length,
      maxRowsPerProduct: maxRows,
      sampleProduct: Object.keys(prodCounts)[0] || 'None'
    };
  } catch (err) {
    return { error: err.message };
  }
}

const root = 'scripts/scraper/raw_data';
const allFiles = fs.readdirSync(root).filter(f => f.endsWith('.xls'));
console.log('=== [제품별 데이터 밀도 전수 조사] ===\n');

allFiles.forEach(file => {
  const result = finalProductScan(path.join(root, file));
  if (result.maxRowsPerProduct > 1) {
    console.log(`[+] ${file}: 한 상품당 최대 ${result.maxRowsPerProduct}개 행 보유 (총 ${result.totalProducts}개 상품)`);
  } else if (result.totalProducts > 0) {
    console.log(`[!] ${file}: 상품당 1개 행만 존재 (단일 연령 데이터로 추정)`);
  }
});
