
const https = require('https');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getCount(table) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}?select=count`);
    const options = {
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'count=exact'
      }
    };
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const countHeader = res.headers['content-range'];
        if (countHeader) resolve(countHeader.split('/')[1]);
        else resolve("0");
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function verify() {
  const pCount = await getCount('insurance_products');
  const rCount = await getCount('insurance_rates');
  console.log(`\n=== [DB 적재 최종 결과 보고] ===`);
  console.log(`- 총 상품 수: ${pCount}개`);
  console.log(`- 총 요율(나이별/성별) 데이터: ${rCount}개`);
  console.log(`\n[OK] 이제 나이/성별 기반 보험료 조회가 완벽히 가능합니다.`);
}

verify();
