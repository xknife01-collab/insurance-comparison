
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 유병자 식별 키워드
const UBJ_KEYWORDS = ['간편', '유병', '3.5.5', '3.2.5', '3.3.5', '3.0.5', '심사', '고지'];

function parseXlsToTable(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    
    const productsInFile = [];
    let tableMatch;
    while ((tableMatch = tableRegex.exec(content)) !== null) {
      let rowMatch;
      while ((rowMatch = rowRegex.exec(tableMatch[1])) !== null) {
        const cells = (rowMatch[1].match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [])
          .map(c => c.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
        
        cells.forEach((cell, idx) => {
          // "상품명" 레이블 바로 다음 칸이 상품명이라고 가정
          if (cell.includes('상품명') && cells[idx + 1]) {
             const name = cells[idx + 1];
             if (UBJ_KEYWORDS.some(kw => name.includes(kw))) {
               if (!productsInFile.includes(name)) productsInFile.push(name);
             }
          }
          
          // 혹은 셀 내용물 자체가 길고 유병자 키워드가 있으면 상품명으로 의심
          if (cell.length > 10 && UBJ_KEYWORDS.some(kw => cell.includes(kw))) {
             if (!productsInFile.includes(cell) && !cell.includes('<')) {
               productsInFile.push(cell);
             }
          }
        });
      }
    }
    return productsInFile;
  } catch (err) {
    return [];
  }
}

async function startAudit() {
  console.log('[*] 엑셀 원본 56개 파일 정밀 감사 시작...');
  const root = 'scripts/scraper/raw_data';
  const files = fs.readdirSync(root).filter(f => f.endsWith('.xls'));
  
  const excelProducts = new Set();
  files.forEach(file => {
    const found = parseXlsToTable(path.join(root, file));
    found.forEach(p => {
        // 불필요한 헤더나 특약 제외 로직 (최소한의 필터)
        if (p.length < 100) excelProducts.add(p);
    });
  });

  console.log(`[*] 원본 엑셀 전수 스캔 완료: 총 ${excelProducts.size}개의 유병자 후보 상품 발견`);

  const { data: dbData, error } = await supabase
    .from('insurance_yu_byung_ja')
    .select('product_name');

  if (error) {
    console.error(`[!] DB 조회 실패: ${error.message}`);
    return;
  }

  const dbProducts = new Set(dbData.map(d => d.product_name));
  console.log(`[*] 현재 DB 적재 상품 수: ${dbProducts.size}개`);

  const missing = [];
  excelProducts.forEach(p => {
    if (!dbProducts.has(p)) {
      missing.push(p);
    }
  });

  console.log('\n=== [감사 결과: 누락 팩트 리스트] ===');
  if (missing.length === 0) {
    console.log('  [Success] 누락된 유병자 상품이 없습니다! 팩트 사수 완료.');
  } else {
    // 상품명처럼 보이지 않는 노이즈(긴 설명 등) 제외하고 상위 30개만 출력
    const realMissing = missing.filter(m => m.length < 60 && !m.includes('|'));
    console.log(`  [!] 총 ${realMissing.length}개의 잠재적 누락 상품이 발견되었습니다.`);
    realMissing.slice(0, 30).forEach((p, i) => console.log(`    ${i+1}. ${p}`));
    if (realMissing.length > 30) console.log(`    ... 외 ${realMissing.length - 30}개 더 있음`);
  }
}

startAudit();
