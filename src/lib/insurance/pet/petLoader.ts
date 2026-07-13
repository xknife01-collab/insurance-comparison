import { InsuranceAnalysis } from '../../../types/insurance';
import { createClient } from '../../../utils/supabase/client';

export interface PetProduct {
  company: string;
  productName: string;
  basePremium: number;
}

export const PET_PRODUCTS: PetProduct[] = [
  { company: '삼성화재', productName: '삼성화재 다이렉트 착한펫보험', basePremium: 29000 },
  { company: 'DB손보', productName: '프로미 라이프 펫블리', basePremium: 31000 },
  { company: '메리츠화재', productName: '(무) 메리츠 펫퍼민트 Puppy&Dog', basePremium: 32000 },
  { company: '현대해상', productName: '현대해상 굿앤굿 우리펫보험', basePremium: 33000 },
  { company: 'KB손보', productName: 'KB 금쪽같은 펫보험', basePremium: 34000 },
  { company: '농협손보', productName: '(무) NH다이렉트펫앤미든든보험', basePremium: 33800 },
  { company: '카카오페이손해보험', productName: '(무) 카카오페이손해보험 펫보험', basePremium: 35000 },
];

// 품종별 위험 요율 가중치 계산
export const getBreedMultiplier = (breed: string, petType: 'dog' | 'cat'): { multiplier: number; riskGroup: string; vulnerability: string } => {
  const normBreed = (breed || '').trim().toLowerCase();
  
  if (petType === 'cat') {
    const highRiskCats = ['폴드', '스코티시', '페르시안', '렉돌', '랙돌', '메인쿤'];
    const hasHighRisk = highRiskCats.some(kw => normBreed.includes(kw));
    if (hasHighRisk) {
      return { multiplier: 1.15, riskGroup: '품종묘 (고위험)', vulnerability: '유전성 골관절염, 신장 질환, 심근병증' };
    }
    const mediumRiskCats = ['샴', '러시안블루', '벵갈', '아비시니안', '폴드'];
    const hasMediumRisk = mediumRiskCats.some(kw => normBreed.includes(kw));
    if (hasMediumRisk) {
      return { multiplier: 1.05, riskGroup: '품종묘 (일반)', vulnerability: '비뇨기계 질환, 구강염' };
    }
    return { multiplier: 0.95, riskGroup: '믹스묘 / 코리안 쇼트헤어', vulnerability: '요로결석, 방광염' };
  } else {
    // Dogs
    const superHighRisk = ['불독', '불도그', '프렌치불독', '리트리버', '허스키', '말라뮤트', '대형견'];
    if (superHighRisk.some(kw => normBreed.includes(kw))) {
      return { multiplier: 1.40, riskGroup: '대형견/특수견 (최고위험)', vulnerability: '고관절 탈구, 피부염, 위확장증' };
    }
    
    const highRisk = ['말티즈', '포메라니안', '치와와', '요크셔', '장모치와와'];
    if (highRisk.some(kw => normBreed.includes(kw))) {
      return { multiplier: 1.25, riskGroup: '소형견 (고위험)', vulnerability: '슬개골 탈구, 기관지 협착증, 구강 질환' };
    }
    
    const mediumRisk = ['푸들', '토이푸들', '시추', '비글', '코카', '웰시코기', '닥스훈트', '웰시', '스피츠'];
    if (mediumRisk.some(kw => normBreed.includes(kw))) {
      return { multiplier: 1.15, riskGroup: '중형견 (중위험)', vulnerability: '외이염, 추간판 디스크, 알레르기 피부염' };
    }
    
    return { multiplier: 1.00, riskGroup: '믹스견 / 진돗개 / 하이브리드견', vulnerability: '피부염, 외상' };
  }
};

export const fetchPetPremium = async (analysis: InsuranceAnalysis): Promise<any> => {
  const petOpts = analysis.pet || {
    petType: 'dog',
    petName: '우리애기',
    breed: '말티즈',
    birthYearMonth: '202305',
    selfPayRatio: 70,
    deductible: 30000,
    isRegistered: false,
    patellaRider: true,
    skinRider: true,
    dentalRider: false
  };

  // 1. 나이 계산 (기준년도: 2026년)
  let age = 3;
  if (petOpts.birthYearMonth && petOpts.birthYearMonth.length >= 4) {
    const birthYear = parseInt(petOpts.birthYearMonth.substring(0, 4));
    age = Math.max(0, 2026 - birthYear);
  }

  // 2. 나이별 요율 커브
  let ageMultiplier = 1.0;
  if (age === 0) ageMultiplier = 0.85;
  else if (age <= 2) ageMultiplier = 1.0;
  else if (age <= 5) ageMultiplier = 1.2;
  else if (age <= 8) ageMultiplier = 1.55;
  else if (age <= 11) ageMultiplier = 2.0;
  else ageMultiplier = 2.65; // 고령 노령묘/노령견

  // 3. 품종 요율 곱 (Try Supabase first, fallback to offline mapper)
  let breedMultiplier = 1.0;
  const realPremiums: Record<string, number> = {};
  
  try {
    const supabase = createClient();
    
    // Fetch breed multiplier
    const { data: breedData, error: breedError } = await supabase
      .from('pet_breeds')
      .select('multiplier')
      .eq('breed_name', petOpts.breed)
      .maybeSingle();
      
    if (!breedError && breedData) {
      breedMultiplier = Number(breedData.multiplier || 1.0);
    } else {
      const fallback = getBreedMultiplier(petOpts.breed, petOpts.petType);
      breedMultiplier = fallback.multiplier;
    }

    // Fetch actual base premiums from insurance_pet_rates in Supabase
    const { data: rateData } = await supabase
      .from('insurance_pet_rates')
      .select('company_name, premium_male')
      .gt('premium_male', 15000)
      .lt('premium_male', 60000);
      
    if (rateData && rateData.length > 0) {
      rateData.forEach(row => {
        if (row.company_name && row.premium_male && !realPremiums[row.company_name]) {
          realPremiums[row.company_name] = row.premium_male;
        }
      });
    }
  } catch (err) {
    const fallback = getBreedMultiplier(petOpts.breed, petOpts.petType);
    breedMultiplier = fallback.multiplier;
  }

  // 4. 보장비율(selfPayRatio) 가중치 (50%~90%)
  let ratioMultiplier = 1.0;
  if (petOpts.selfPayRatio === 50) ratioMultiplier = 0.75;
  else if (petOpts.selfPayRatio === 80) ratioMultiplier = 1.15;
  else if (petOpts.selfPayRatio === 90) ratioMultiplier = 1.30;

  // 5. 자기부담금(deductible) 가중치 (1만~10만)
  let dedMultiplier = 1.0;
  if (petOpts.deductible === 10000) dedMultiplier = 1.20;
  else if (petOpts.deductible === 20000) dedMultiplier = 1.10;
  else if (petOpts.deductible === 50000) dedMultiplier = 0.85;
  else if (petOpts.deductible === 100000) dedMultiplier = 0.70;

  // 6. 특약 가중치 누적
  let riderCost = 0;
  if (petOpts.patellaRider) riderCost += 6000;
  if (petOpts.skinRider) riderCost += 4000;
  if (petOpts.dentalRider) riderCost += 3500;

  // 7. 동물등록 할인 적용
  const regDiscount = petOpts.isRegistered ? 0.95 : 1.0;

  // 최종 요율 누적계수
  const combinedMultiplier = breedMultiplier * ageMultiplier * ratioMultiplier * dedMultiplier * regDiscount;

  // 각 보험사별로 최종 가상 보험료 계산
  const results = PET_PRODUCTS.map(p => {
    // Prefer database-driven base premium, fallback to static defaults
    const basePremium = realPremiums[p.company] || p.basePremium;
    const rawPremium = basePremium * combinedMultiplier + riderCost;
    const finalPremium = Math.round(rawPremium / 100) * 100; // 100원 단위 절사
    
    // 특색 있는 담보 내용 추가
    let details: Record<string, string> = {
      '입원/통원 일당': petOpts.selfPayRatio === 50 ? '최대 10만원 한도' : '최대 15만원 한도',
      '수술 회당 한도': petOpts.selfPayRatio === 90 ? '최대 250만원 한도' : '최대 200만원 한도',
      '슬개골 탈구': petOpts.patellaRider ? '수술비 실손 보장(1년 면책)' : '미보장',
      '배상책임 한도': '사고당 1,000만 원 (자부담 3만)',
    };

    return {
      premium: finalPremium,
      productName: p.productName,
      companyName: p.company,
      planLevel: petOpts.selfPayRatio >= 80 ? '고급형' : petOpts.selfPayRatio >= 70 ? '표준형' : '실속형',
      details
    };
  });

  // 보험료 순으로 오름차순 정렬
  results.sort((a, b) => a.premium - b.premium);

  const mainOption = results[0];

  return {
    premium: mainOption.premium,
    productName: mainOption.productName,
    companyName: mainOption.companyName,
    _allOptions: results
  };
};
