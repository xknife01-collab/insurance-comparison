
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function loadFromMaster() {
  console.log('[*] 마스터 JSON에서 유병자 팩트 소환 중...');
  
  const rawData = JSON.parse(fs.readFileSync('scripts/scraper/unified_products_final.json', 'utf8'));
  const UBJ_KEYWORDS = ['간편', '유병', '3.5.5', '3.2.5', '3.3.5', '3.1.5', '3.0.5', '심사'];
  
  const targets = rawData.filter(p => UBJ_KEYWORDS.some(kw => p.product_name.includes(kw)));
  console.log(`[*] 총 ${targets.length}개의 유병자 상품을 발견했습니다.`);

  let successCount = 0;
  const batchSize = 25; // 넉넉하게 배치 조절

  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize);
    const payload = batch.map(p => {
      // 심사 유형 판별 (기본값 3.5.5)
      const typeMatch = p.product_name.match(/3\.\d\.5/);
      const reviewType = typeMatch ? typeMatch[0] : '3.5.5';

      return {
        company_name: p.company,
        product_name: p.product_name,
        review_type: reviewType,
        category: p.category || '간편고지',
        rates: p.rates,
        coverages: p.coverages || {},
        extras: p.extras || {},
        updated_at: new Date()
      };
    });

    const { error } = await supabase
      .from('insurance_yu_byung_ja')
      .upsert(payload, { onConflict: 'product_name' });

    if (error) {
      console.error(`  [!] Batch ${i} 오류:`, error.message);
    } else {
      successCount += payload.length;
      console.log(`  [+] 적재 진행: (${successCount}/${targets.length}) 완료`);
    }
  }

  console.log(`\n[*] 최종 결과: ${successCount}개의 유병자 전수 조사가 완료되어 DB에 안착했습니다!`);
}

loadFromMaster();
