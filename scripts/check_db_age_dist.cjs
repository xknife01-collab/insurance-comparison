
const https = require('https');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkAges(productPattern) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/insurance_rates?product_code=ilike.*${productPattern}*&select=age,premium:rate_data->premium`);
  const options = {
    method: 'GET',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  };
  return new Promise((resolve) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch(e) { resolve([]); }
      });
    });
    req.end();
  });
}

async function run() {
  const dental = await checkAges('치아');
  const silson = await checkAges('실손');
  
  console.log('--- Dental Ages in DB ---');
  const dReq = dental.reduce((acc, r) => { acc[r.age] = (acc[r.age] || 0) + 1; return acc; }, {});
  console.log(dReq);

  console.log('--- Silson Ages in DB ---');
  const sReq = silson.reduce((acc, r) => { acc[r.age] = (acc[r.age] || 0) + 1; return acc; }, {});
  console.log(sReq);
}
run();
