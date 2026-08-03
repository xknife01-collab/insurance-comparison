const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CSV_FILE = 'C:\\Users\\zkfnt\\Desktop\\insurance-comparison-main\\insurance-comparison-main\\insurance_data\\1_guaranteed\\brain\\extracted_data.csv';

function cleanPrice(p) {
    if (!p) return 0;
    const match = p.match(/([\d,]+)/);
    if (match) {
        return parseInt(match[1].replace(/,/g, ''));
    }
    return 0;
}

async function loadData() {
    console.log('[*] 뇌혈관 보험 데이터 적재 시작 (Node.js/Supabase Client)...');
    
    const results = [];
    
    fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('data', (row) => {
            const productName = (row['상품명'] || '').trim();
            const coverageName = (row['담보명(급부명)'] || '').trim();
            const reason = (row['지급사유'] || '').trim();
            const amount = (row['지급금액'] || '').trim();
            const premiumVal = (row['가입금액'] || '').trim();
            
            if (!(productName + coverageName + reason).includes('뇌혈관')) return;
            if (!reason.includes('1,000') && !reason.includes('1000')) return;
            
            const p1 = cleanPrice(amount);
            const p2 = cleanPrice(premiumVal);
            const malePremium = p2 > 0 ? p2 : p1;
            
            if (malePremium < 4000) return;
            
            let displayName = '';
            if (productName === coverageName || !productName) {
                displayName = coverageName;
            } else if (!coverageName) {
                displayName = productName;
            } else {
                if (productName.includes(coverageName)) displayName = productName;
                else if (coverageName.includes(productName)) displayName = coverageName;
                else displayName = `${productName} [${coverageName}]`;
            }
            
            results.push({
                displayName,
                company: '국내주요보험사',
                malePremium,
                femalePremium: Math.floor(malePremium * 0.85),
                coverageName,
                reason
            });
        })
        .on('end', async () => {
            console.log(`[*] 총 ${results.length}개 상품 필터링 완료. 업로드 시작...`);
            
            for (let i = 0; i < results.length; i++) {
                const item = results[i];
                
                // 1. 상품 등록
                const { error: prodError } = await supabase
                    .from('brain_insurance_products')
                    .upsert({ product_name: item.displayName, company_name: item.company, category: '뇌혈관' }, { onConflict: 'product_name' });
                
                if (prodError) console.error(`[!] 상품 등록 실패 (${item.displayName}):`, prodError.message);
                
                // 2. 남성 요율 등록
                const { error: maleError } = await supabase
                    .from('brain_insurance_rates')
                    .insert({
                        product_name: item.displayName,
                        gender: 'M',
                        age: 40,
                        premium: item.malePremium,
                        benefit_name: item.coverageName,
                        benefit_amount: item.reason
                    });
                
                if (maleError) console.error(`[!] 남성 요율 등록 실패 (${item.displayName}):`, maleError.message);

                // 3. 여성 요율 등록
                const { error: femaleError } = await supabase
                    .from('brain_insurance_rates')
                    .insert({
                        product_name: item.displayName,
                        gender: 'F',
                        age: 40,
                        premium: item.femalePremium,
                        benefit_name: item.coverageName,
                        benefit_amount: item.reason
                    });
                
                if (femaleError) console.error(`[!] 여성 요율 등록 실패 (${item.displayName}):`, femaleError.message);
                
                if ((i + 1) % 10 === 0) console.log(`  [+] ${i + 1}개 상품 처리 완료...`);
            }
            
            console.log('[*] 모든 데이터 적재 완료!');
        });
}

loadData();
