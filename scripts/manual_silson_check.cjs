
const fs = require('fs');
const path = require('path');

function parseSilsonRough(filepath) {
    const content = fs.readFileSync(filepath, 'utf8');
    const rows = [];
    const trMatches = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    trMatches.forEach(tr => {
        const cells = (tr.match(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi) || [])
            .map(c => c.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
        if (cells.length > 0) rows.push(cells);
    });

    console.log(`--- Inspecting ${path.basename(filepath)} ---`);
    let male40Idx = -1;
    let female40Idx = -1;

    // Search for 40세 in headers
    for (let i = 0; i < 10 && i < rows.length; i++) {
        rows[i].forEach((cell, idx) => {
            if (cell.includes('40세')) {
                if (cell.includes('남')) male40Idx = idx;
                if (cell.includes('여')) female40Idx = idx;
            }
        });
    }

    console.log(`Male 40 Column Index: ${male40Idx}, Female 40 Index: ${female40Idx}`);

    rows.forEach((row, i) => {
        if (i < 10) return; // Skip headers
        const company = row[0];
        const productName = row[1];
        const maleVal = male40Idx !== -1 ? row[male40Idx] : 'N/A';
        const femaleVal = female40Idx !== -1 ? row[female40Idx] : 'N/A';
        
        if (maleVal !== 'N/A' || femaleVal !== 'N/A') {
             console.log(`Row ${i}: [${company}] [${productName}] M40: ${maleVal} | F40: ${femaleVal}`);
        }
    });
}

const silsonFiles = [
    'scripts/scraper/raw_data/실손의료보험_상품비교_20260406102650414.xls',
    'scripts/scraper/raw_data/실손의료보험 비교공시.xls'
];

silsonFiles.forEach(f => {
    if (fs.existsSync(f)) parseSilsonRough(f);
});
