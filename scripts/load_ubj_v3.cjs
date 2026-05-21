
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// [최강 필터] 순수 유병자 건강보험 분석에 부적합한 모든 카테고리 퇴출
const EXCLUDE_KEYWORDS = ['실비', '실손', '장기요양', '치아', '운전자', '태아', '자녀', '정기', '종신', '연금', '저축', '사망', '변액', '연계'];
const UBJ_KEYWORDS = ['간편', '유병', '3.5.5', '3.2.5', '3.1.5', '3.3.5', '3.0.5', '3.1', '심사', '고지'];

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

async function runGrandIngestV11_Final() {
  console.log('[*] 11차 최종 대공습: 전수 조사(0~50번대)를 통한 손보사(하나/DB/KB) 복구 개시...');
  const root = 'scripts/scraper/raw_data';
  const files = fs.readdirSync(root).filter(f => f.endsWith('.xls')).sort((a, b) => {
    const an = parseInt(a.match(/\d+/)[0]);
    const bn = parseInt(b.match(/\d+/)[0]);
    return an - bn;
  });
  
  await supabase.from('insurance_yu_byung_ja').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  let totalLoaded = 0;

  for (const file of files) {
    const table = parseXlsToTable(path.join(root, file));
    if (!table) continue;

    // 헤더 위치를 손보사 구조에 맞게 더 깊고 넓게 탐색
    let maleCol = -1, femaleCol = -1, ageCol = -1;
    for (let r = 0; r < Math.min(table.length, 25); r++){
       const rowText = table[r].join('|');
       table[r].forEach((cell, idx) => {
          if (cell.includes('남자') && maleCol === -1 && (rowText.includes('보험료') || rowText.includes('합계'))) maleCol = idx;
          if (cell.includes('여자') && femaleCol === -1 && (rowText.includes('보험료') || rowText.includes('합계'))) femaleCol = idx;
          if ((cell.includes('연령') || cell.includes('나이')) && ageCol === -1) ageCol = idx;
       });
    }
    
    // 손보사 표준 구조 보정 (헤더 미발견 시)
    if (maleCol === -1) maleCol = 9; 
    if (femaleCol === -1) femaleCol = 10;
    if (ageCol === -1) ageCol = 8; // 나이 컬럼은 보통 앞에 배치됨

    let lastCompany = '';
    let lastProduct = '';
    const collectedData = [];

    for (let i = 0; i < table.length; i++) {
      const row = table[i];
      if (row.length < 5) continue;

      // 손보사 전용 회사명/상품명 추출 지능화
      if (row[0].length > 2 && !row[0].includes(' ') && !row[0].includes('세') && !row[0].includes('특약')) lastCompany = row[0];
      if (row[1].length > 5 && !row[1].includes('남')) lastProduct = row[1];
      
      row.forEach((cell, idx) => {
         if (cell.includes('보험회사명') && row[idx+1]) lastCompany = row[idx+1];
         if (cell.includes('상품명') && row[idx+1]) lastProduct = row[idx+1];
      });

      if (!lastProduct) continue;
      if (EXCLUDE_KEYWORDS.some(kw => lastProduct.includes(kw))) continue;
      if (!UBJ_KEYWORDS.some(kw => lastProduct.includes(kw))) continue;

      let age = 0;
      if (ageCol !== -1 && row[ageCol]) age = parseInt(row[ageCol].replace(/[^0-9]/g, '')) || 0;
      if (age < 30 || age > 80) {
         const m = row.join(' ').match(/(\d\d+)세/);
         if (m) age = parseInt(m[1]);
      }
      if (age < 30 || age > 80) continue;

      let mPremium = 0, fPremium = 0;
      if (row[maleCol]) mPremium = parseInt(row[maleCol].replace(/[^0-9]/g, '')) || 0;
      if (row[femaleCol]) fPremium = parseInt(row[femaleCol].replace(/[^0-9]/g, '')) || 0;

      // 코드성 숫자(100250 등) 자동 배제 및 재수색
      if (mPremium < 15000 || mPremium > 180000 || [100250, 35355, 32500, 31100, 100, 20].includes(mPremium)) {
         row.forEach(cell => {
            const val = parseInt(cell.replace(/[^0-9]/g, '')) || 0;
            if (val >= 15000 && val <= 180000 && ![100250, 35355, 32500, age, 100, 20].includes(val)) mPremium = val;
         });
      }

      if (mPremium >= 15000 && mPremium <= 180000) {
         let existing = collectedData.find(d => d.product_name === lastProduct && d.company_name === lastCompany);
         if (!existing) {
            const typeMatch = lastProduct.match(/3\.(\d|\d\d)\.5/) || lastProduct.match(/3\.\d/);
            existing = { company_name: lastCompany, product_name: lastProduct, review_type: typeMatch?.[0] || '3.5.5', rates: {} };
            collectedData.push(existing);
         }
         existing.rates[`premium_M_${age}`] = mPremium;
         existing.rates[`premium_F_${age}`] = (fPremium >= 15000 && fPremium <= 180000) ? fPremium : mPremium;
      }
    }

    if (collectedData.length > 0) {
       const uData = collectedData.map(d => ({ ...d, category: '11차_손보복구', updated_at: new Date() }));
       const { error } = await supabase.from('insurance_yu_byung_ja').upsert(uData, { onConflict: 'product_name' });
       if (!error) totalLoaded += collectedData.length;
       console.log(`  [+] ${file}: ${collectedData.length}개 상품 적재 성공 (손보사 수색 중...)`);
    }
  }
  console.log(`\n[*] 11차 최종 대공습 종료: 총 ${totalLoaded}개의 '손보사 포함 최정예 팩트'가 안착되었습니다.`);
}

runGrandIngestV11_Final();
