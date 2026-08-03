
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const UBJ_KEYWORDS = ['간편', '유병', '3.5.5', '3.2.5', '3.3.5', '3.0.5', '심사', '고지'];

function parseXlsToTable(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const rows = [];
    const trMatches = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    trMatches.forEach(tr => {
      const cells = (tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [])
        .map(c => c.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
      if (cells.length > 0) rows.push(cells);
    });
    return rows;
  } catch (err) {
    return null;
  }
}

async function runGrandIngestV2() {
  console.log('[*] 2차 대공습: 원본 엑셀 56개 파일 전수 직접 추출 시작...');
  const root = 'scripts/scraper/raw_data';
  const files = fs.readdirSync(root).filter(f => f.endsWith('.xls'));
  
  let totalLoaded = 0;

  for (const file of files) {
    const table = parseXlsToTable(path.join(root, file));
    if (!table) continue;

    let lastCompany = '';
    let lastProduct = '';
    const collectedData = [];

    // 파일 내 모든 행을 순회하며 유병자 상품군 탐색
    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      const rowText = row.join(' ');

      // 회사명 및 상품명 업데이트
      row.forEach((cell, idx) => {
        if (cell.includes('보험회사명') && row[idx + 1]) lastCompany = row[idx + 1];
        if (cell.includes('상품명') && row[idx + 1]) lastProduct = row[idx + 1];
      });

      // 만약 행에 회사/상품명이 있다면 업데이트 (일부 레이아웃 대응)
      if (row.length > 2 && row[0].length > 2 && !row[0].includes(' ')) lastCompany = row[0];
      if (row.length > 2 && row[1].length > 5 && !row[1].includes('남')) lastProduct = row[1];

      if (!lastProduct || !UBJ_KEYWORDS.some(kw => lastProduct.includes(kw))) continue;

      // 보험료 데이터 추출 (연령 키워드가 있는 행 탐색)
      const ageMatch = rowText.match(/(\d+)세/);
      if (ageMatch) {
         const age = ageMatch[1];
         let mPremium = 0, fPremium = 0;
         
         // 연령 옆의 숫자들을 보험료로 인식 시도
         row.forEach((cell, idx) => {
            const val = parseInt(cell.replace(/[^0-9]/g, '')) || 0;
            if (val > 1000) {
               if (mPremium === 0) mPremium = val;
               else if (fPremium === 0) fPremium = val;
            }
         });

         if (mPremium > 0 || fPremium > 0) {
            const key = `${lastCompany}_${lastProduct}`;
            let existing = collectedData.find(d => d.key === key);
            if (!existing) {
               const typeMatch = lastProduct.match(/3\.\d\.5/);
               const reviewType = typeMatch ? typeMatch[0] : '3.5.5';
               existing = { 
                 key, 
                 company_name: lastCompany || '기타', 
                 product_name: lastProduct, 
                 review_type: reviewType, 
                 rates: { M: {}, F: {} } 
               };
               collectedData.push(existing);
            }
            if (mPremium > 0) existing.rates.M[age] = mPremium;
            if (fPremium > 0) existing.rates.F[age] = fPremium;
         }
      }
    }

    if (collectedData.length > 0) {
       console.log(`  [+] ${file}: ${collectedData.length}개 상품 데이터 추출 완료...`);
       const { error } = await supabase
         .from('insurance_yu_byung_ja')
         .upsert(collectedData.map(d => ({
            company_name: d.company_name,
            product_name: d.product_name,
            review_type: d.review_type,
            category: '정밀분석적재',
            rates: d.rates,
            updated_at: new Date()
         })), { onConflict: 'product_name' });

       if (!error) totalLoaded += collectedData.length;
       else console.error(`    [!] 적재 오류: ${error.message}`);
    }
  }

  console.log(`\n[*] 2차 대공습 종료: 총 ${totalLoaded}개의 최신 유병자 팩트가 DB에 추가로 안착되었습니다.`);
}

runGrandIngestV2();
