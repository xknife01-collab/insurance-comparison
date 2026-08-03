
const fs = require('fs');
const path = require('path');

function deepCheckAges(filepath) {
  try {
    const stats = fs.statSync(filepath);
    if (stats.size > 5 * 1024 * 1024) return { error: 'Large file' };
    
    const content = fs.readFileSync(filepath, 'utf8');
    if (!content.includes('<html')) return { error: 'Not HTML' };

    const ageMatches = content.match(/\d+세/g) || [];
    const uniqueAges = new Set(ageMatches);
    
    // Also look for male/female premium keywords
    const premiumMatches = content.match(/보험료/g) || [];
    
    return {
      ages: Array.from(uniqueAges),
      ageCount: uniqueAges.size,
      hasPremium: premiumMatches.length > 0
    };
  } catch (err) {
    return { error: err.message };
  }
}

const root = 'scripts/scraper/raw_data';
const allFiles = fs.readdirSync(root).filter(f => f.endsWith('.xls'));
const results = [];

allFiles.forEach(file => {
  const result = deepCheckAges(path.join(root, file));
  if (result.ageCount > 0) {
    results.push({ file, ...result });
  }
});

console.log('\n=== [연령별 데이터 보유 현황 보고] ===\n');

results.sort((a, b) => b.ageCount - a.ageCount).forEach(r => {
  if (r.ageCount > 1) {
    console.log(`[+] ${r.file}: 연령 정보 ${r.ageCount}종 발견 (${r.ages.slice(0, 10).join(', ')}...)`);
  }
});

const multiAgeFiles = results.filter(r => r.ageCount > 1);
console.log(`\n[*] 총 ${allFiles.length}개 파일 중 여러 연령 정보가 포함된 파일: ${multiAgeFiles.length}개`);
