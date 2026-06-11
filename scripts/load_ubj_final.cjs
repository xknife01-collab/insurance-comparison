
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
    const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;

    const tables = [];
    let tableMatch;
    while ((tableMatch = tableRegex.exec(content)) !== null) {
      const rows = [];
      let rowMatch;
      while ((rowMatch = rowRegex.exec(tableMatch[1])) !== null) {
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

async function startInvestigation() {
  const root = 'scripts/scraper/raw_data';
  const files = fs.readdirSync(root).filter(f => f.endsWith('.xls'));
  console.log(`[*] 전수 조사 시작: 총 ${files.length}개 파일 스캔 중...`);

  let loadedCount = 0;

  for (const file of files) {
    const tables = parseXlsToTable(path.join(root, file));
    if (!tables) continue;

    let company = '';
    let product = '';
    let isUBJ = false;
    let reviewType = '3.5.5'; // 기본값

    // 1. 유병자 상품 여부 및 기본 정보 확인
    for (const rows of tables) {
      for (const row of rows) {
        const rowText = row.join(' ');
        if (UBJ_KEYWORDS.some(kw => rowText.includes(kw))) isUBJ = true;
        
        row.forEach((cell, idx) => {
          if (cell.includes('보험회사명') && row[idx + 1]) company = row[idx + 1];
          if (cell.includes('상품명') && row[idx + 1]) product = row[idx + 1];
        });

        const typeMatch = rowText.match(/3\.\d\.5/);
        if (typeMatch) reviewType = typeMatch[0];
      }
    }

    // 만약 상품명만 있고 유병자 키워드가 없다면 스킵
    if (!isUBJ || !product || product === '상품명') continue;

    // 만보사명이 비어있으면 상품명에서 유추 시도 (간혹 파일 구조에 따라 다름)
    if (!company) {
      if (product.includes('메리츠')) company = '메리츠화재';
      else if (product.includes('삼성')) company = '삼성화재';
      else if (product.includes('현대')) company = '현대해상';
      else if (product.includes('삼성')) company = '삼성생명';
      else company = '기타';
    }

    console.log(`  [+] 발견: [${company}] ${product} (${reviewType})`);

    // 2. 연령별 보험료 추출
    const rates = { M: {}, F: {} };
    for (const rows of tables) {
      rows.forEach(row => {
        const rowText = row.join('|');
        // 연령 정보가 있는 행 탐색 (ex: "40세", "50세" 등)
        row.forEach((cell, idx) => {
          const ageMatch = cell.match(/^(\d+)세$/);
          if (ageMatch) {
            const age = ageMatch[1];
            // 보험료라고 생각되는 숫자 패턴 필터링 (ex: "45,000", "45000")
            const malePremiumCell = row[idx + 1] || "";
            const femalePremiumCell = row[idx + 2] || "";
            
            const malePremium = parseInt(malePremiumCell.replace(/,/g, '')) || 0;
            const femalePremium = parseInt(femalePremiumCell.replace(/,/g, '')) || 0;
            
            if (malePremium > 1000) rates.M[age] = malePremium;
            if (femalePremium > 1000) rates.F[age] = femalePremium;
          }
        });
      });
    }

    // 데이터가 너무 없으면 스킵
    if (Object.keys(rates.M).length === 0 && Object.keys(rates.F).length === 0) {
      console.log(`      -> 보험료 데이터를 찾을 수 없어 적재 보류`);
      continue;
    }

    // 3. Supabase 적재 (Upsert)
    const { error } = await supabase
      .from('insurance_yu_byung_ja')
      .upsert({
        company_name: company,
        product_name: product,
        review_type: reviewType,
        rates: rates,
        coverages: { "remark": "전수 조사 데이터" },
        updated_at: new Date()
      }, { onConflict: 'product_name' });

    if (!error) {
      loadedCount++;
      console.log(`      -> 적재 완료! (${Object.keys(rates.M).length + Object.keys(rates.F).length}개 연령 데이터)`);
    } else {
      console.error(`      [!] 적재 오류: ${error.message}`);
    }
  }

  console.log(`\n[*] 조사 종료: 총 ${loadedCount}개 유병자 상품이 Supabase에 성공적으로 이식되었습니다.`);
}

startInvestigation();
