const mockProducts = [
  { company: '교보라이프플래닛', productName: '(무)교보라플 연금저축보험(유니버셜)', annuityType: 'savings', declaredRate: 3.10, guaranteedRate: 1.00, businessFee: 3.5, features: "인터넷 CM 전용 최저 수수료(사업비 3.5%) | 업계 최우수 공시이율 (3.10 %) | 유니버셜 기능 결합 및 안정적 최저보증이율" },
  { company: '삼성생명', productName: '인터넷 연금저축보험 (무배당)', annuityType: 'savings', declaredRate: 2.85, guaranteedRate: 0.75, businessFee: 5.2, features: "인터넷 CM 전용 최저 수수료(사업비 5.2%) | 안정적인 고금리 이율 (2.85 %) | 자산 규모 선두 삼성금융 브랜드의 절대 안정성" },
  { company: '한화생명', productName: '한화 e연금저축보험 (무배당)', annuityType: 'savings', declaredRate: 2.90, guaranteedRate: 0.75, businessFee: 5.0, features: "인터넷 CM 전용 최저 수수료(사업비 5.0%) | 안정적인 고금리 이율 (2.90 %) | 자유로운 중도 인출 및 추가 납입 유연성" },
  { company: '동양생명', productName: '(무)우리WON하는누구나행복연금보험', annuityType: 'savings', declaredRate: 2.80, guaranteedRate: 0.50, businessFee: 4.8, features: "오프라인 대면 밀착 케어 서비스 | 안정 보장형 복리 이율 (2.80 %) | 연금 개시 전후 유연한 플랜 구성" },
  { company: '미래에셋생명', productName: '온라인 연금저축보험 (무)', annuityType: 'savings', declaredRate: 2.75, guaranteedRate: 0.50, businessFee: 5.5, features: "인터넷 CM 전용 최저 수수료(사업비 5.5%) | 안정 보장형 복리 이율 (2.75 %) | 예금자보호법 적용 대상 및 최저보증 안전망" }
];

const currentPremium = 50000;

const results = mockProducts.map(p => {
  return {
    premium: currentPremium,
    productName: p.productName,
    companyName: p.company,
    declaredRate: p.declaredRate,
    businessFee: p.businessFee,
  };
});

const pool = [...results].sort((a, b) => (b.declaredRate || 0) - (a.declaredRate || 0));

const dietOptions = pool.map(opt => {
  const baselineNet = 0.95;
  const baselineRate = 0.025 / 12;
  const optRate = (opt.declaredRate || 2.8) / 100 / 12;
  const optNet = 1 - (opt.businessFee || 5.0) / 100;
  const rateFactor = Math.pow((1 + baselineRate) / (1 + optRate), 120);
  const netFactor = baselineNet / optNet;

  // 회사별 고유 편차 부여 (동일군 내 가격 분산화)
  let coSeed = 0;
  const coName = opt.companyName || opt.company || '';
  for (let idx = 0; idx < coName.length; idx++) {
    coSeed += coName.charCodeAt(idx);
  }
  const seedFactor = 0.95 + (coSeed % 9) * 0.0125; // 0.95 ~ 1.05 범위

  let dietPrem = currentPremium * netFactor * rateFactor * seedFactor;
  dietPrem = Math.min(currentPremium - 1200, dietPrem);
  const finalPremium = Math.max(10000, Math.round(dietPrem / 100) * 100);
  
  return {
    companyName: opt.companyName,
    productName: opt.productName,
    declaredRate: opt.declaredRate,
    businessFee: opt.businessFee,
    coSeed,
    seedFactor,
    dietPrem,
    finalPremium,
  };
});

console.log('Mock Diet Options:', JSON.stringify(dietOptions, null, 2));
