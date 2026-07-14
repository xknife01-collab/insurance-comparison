import { StandardizedCoverage } from '../types/remodeling';

export const generateCustomMockData = (
  age: number,
  gender: 'M' | 'F',
  customPolicies: { categoryId: string; premium: number; riders?: { rider_name: string; coverage_amount: number }[]; isCustom?: boolean }[]
): StandardizedCoverage => {
  const pickCompany = (cat: string): string => {
    // Map categories to fixed companies matching the second photo's layout for consistent masking
    const fixedCompanies: Record<string, string> = {
      cancer: '삼성생명',          // A생보
      cerebrovascular: '한화생명', // C생보
      heart: '삼성생명',           // A생보
      whole: '교보생명',           // B생보
      indemnity: '한화손해보험',    // F손보
      surgery: '한화손해보험',      // F손보
      driver: '한화손해보험',       // F손보
      caregiving: '삼성생명',      // A생보
      dental: '교보생명',          // B생보
      accident: '한화손해보험',     // F손보
      dementia: '삼성생명',        // A생보
      nursing: '삼성생명',         // A생보
      child: '삼성생명',           // A생보
      child_sick: '삼성생명',      // A생보
      car: '한화손해보험',          // F손보
      pet: '한화손해보험',          // F손보
      golf: '한화손해보험',         // F손보
      fire_real: '한화손해보험',    // F손보
      property: '한화손해보험',     // F손보
      annuity: '교보생명',         // B생보
      variable: '교보생명',        // B생보
      legal: '한화손해보험',        // F손보
      savings_general: '교보생명', // B생보
      credit: '교보생명'           // B생보
    };
    if (fixedCompanies[cat]) return fixedCompanies[cat];

    const nonLife = ['현대해상', 'DB손해보험', 'KB손해보험', '메리츠화재', '한화손해보험', '삼성화재'];
    const life = ['삼성생명', '교보생명', '한화생명', '신한라이프', '미래에셋생명', '라이나생명'];
    const mixed = [...nonLife, ...life];
    let pool = mixed;
    if (['indemnity', 'car', 'driver', 'fire_real', 'property', 'golf', 'pet', 'accident'].includes(cat)) {
      pool = nonLife;
    } else if (['whole', 'annuity', 'variable'].includes(cat)) {
      pool = life;
    }
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
  };

  const getProductName = (cat: string, isCustom?: boolean): string => {
    const simpleNames: Record<string, string> = {
      indemnity: '의료실비',
      dental: '치아보험',
      preexisting: '유병자보험',
      surgery: '수술/입원보험',
      cancer: '암보험',
      health_general: '종합건강보험',
      cerebrovascular: '뇌혈관보험',
      heart: '심장질환보험',
      accident: '상해보험',
      caregiving: '간병 보험',
      dementia: '치매 간병보험',
      nursing: '재가/시설보험',
      child: '어린이/신생아보험',
      child_sick: '유병력자 전용보험',
      car: '자동차 보험',
      driver: '운전자 보험',
      pet: '펫 보험',
      golf: '골프 / 레저보험',
      fire_real: '주택화재보험',
      property: '재물종합보험',
      annuity: '연금저축보험',
      whole: '종신보험',
      variable: '변액, 정기보험',
      legal: '민사/형사보험',
      savings_general: '일반 저축보험',
      credit: '신용보험'
    };
    const baseName = simpleNames[cat] || '안심 보장보험';
    return isCustom ? baseName : `${baseName} (추정치)`;
  };

  const policies: any[] = [];
  let cancer_diagnosis = 0;
  let brain_vascular = 0;
  let ischemic_heart = 0;
  let caregiver_expense = 0;
  let silson = false;
  let surgery_amount = 0;
  let post_disability_amount = 0;
  let current_total_premium = 0;

  customPolicies.forEach((item: any) => {
    const p = item.premium;
    if (p <= 0) return;
    const cat = item.categoryId;
    const company = ''; // No company name for custom simulation
    const prodName = getProductName(cat, !!item.isCustom);
    current_total_premium += p;
    let riders: { rider_name: string; coverage_amount: number }[] = [];

    if (item.riders && item.riders.length > 0) {
      riders = item.riders;
      item.riders.forEach((r: any) => {
        const name = r.rider_name;
        const amt = r.coverage_amount;
        if (name.includes('암진단')) cancer_diagnosis += amt;
        if (name.includes('뇌혈관') || name.includes('뇌졸중')) brain_vascular += amt;
        if (name.includes('허혈성') || name.includes('심근경색')) ischemic_heart += amt;
        if (name.includes('수술비')) surgery_amount += amt;
        if (name.includes('후유장해')) post_disability_amount += amt;
        if (name.includes('간병')) caregiver_expense = Math.max(caregiver_expense, amt);
      });
    } else {
      if (cat === 'cancer') {
        const amt = p * 600;
        cancer_diagnosis += amt;
        riders.push(
          { rider_name: '일반암진단비 (추정치)', coverage_amount: amt },
          { rider_name: '표적항암약물허가치료비 (추정치)', coverage_amount: 50000000 },
          { rider_name: '암주요치료비 (추정치)', coverage_amount: 10000000 },
          { rider_name: '재발암진단비 (추정치)', coverage_amount: 20000000 }
        );
      } else if (cat === 'cerebrovascular') {
        const amt = p * 500;
        brain_vascular += amt;
        riders.push(
          { rider_name: '뇌혈관질환진단비 (추정치)', coverage_amount: amt },
          { rider_name: '뇌졸중진단비 (추정치)', coverage_amount: Math.round(amt * 0.6) },
          { rider_name: '뇌혈관질환수술비 (추정치)', coverage_amount: 10000000 }
        );
      } else if (cat === 'heart') {
        const amt = p * 500;
        ischemic_heart += amt;
        riders.push(
          { rider_name: '허혈성심장질환진단비 (추정치)', coverage_amount: amt },
          { rider_name: '급성심근경색진단비 (추정치)', coverage_amount: Math.round(amt * 0.6) },
          { rider_name: '심장질환수술비(스텐트) (추정치)', coverage_amount: 10000000 }
        );
      } else if (cat === 'health_general') {
        const cAmt = p * 200;
        const bAmt = p * 150;
        const hAmt = p * 150;
        const sAmt = p * 50;
        cancer_diagnosis += cAmt;
        brain_vascular += bAmt;
        ischemic_heart += hAmt;
        surgery_amount += sAmt;
        riders.push(
          { rider_name: '일반암진단비 (추정치)', coverage_amount: cAmt },
          { rider_name: '뇌혈관질환진단비 (추정치)', coverage_amount: bAmt },
          { rider_name: '허혈성심장질환진단비 (추정치)', coverage_amount: hAmt },
          { rider_name: '가족일상생활배상책임 (추정치)', coverage_amount: 100000000 }
        );
      } else if (cat === 'indemnity') {
        silson = true;
        riders.push(
          { rider_name: '상해급여실손의료비 (추정치)', coverage_amount: 50000000 },
          { rider_name: '질병급여실손의료비 (추정치)', coverage_amount: 50000000 },
          { rider_name: '비급여주사제실손의료비 (추정치)', coverage_amount: 2500000 }
        );
      } else if (cat === 'preexisting') {
        const cAmt = p * 150;
        const bAmt = p * 100;
        const hAmt = p * 100;
        cancer_diagnosis += cAmt;
        brain_vascular += bAmt;
        ischemic_heart += hAmt;
        riders.push(
          { rider_name: '일반암진단비 (추정치)', coverage_amount: cAmt },
          { rider_name: '뇌혈관질환진단비 (추정치)', coverage_amount: bAmt },
          { rider_name: '허혈성심장질환진단비 (추정치)', coverage_amount: hAmt },
          { rider_name: '간편고지유병자특약 (추정치)', coverage_amount: 0 }
        );
      } else if (cat === 'caregiving') {
        caregiver_expense = 150000;
        riders.push(
          { rider_name: '간병인지원일당 (추정치)', coverage_amount: 150000 },
          { rider_name: '간병인사용일당 (추정치)', coverage_amount: 150000 }
        );
      } else if (cat === 'dementia') {
        caregiver_expense = 100000;
        riders.push(
          { rider_name: '경도CDR1점치매진단비 (추정치)', coverage_amount: 10000000 },
          { rider_name: '중등도CDR2점치매진단비 (추정치)', coverage_amount: 20000000 },
          { rider_name: '중증CDR3점치매생활비 (추정치)', coverage_amount: 1000000 }
        );
      } else if (cat === 'nursing') {
        riders.push(
          { rider_name: '장기요양재가급여 (추정치)', coverage_amount: 1000000 },
          { rider_name: '장기요양시설급여 (추정치)', coverage_amount: 1200000 }
        );
      } else if (cat === 'child') {
        const amt = p * 800;
        cancer_diagnosis += amt;
        riders.push(
          { rider_name: 'ADHD우울증진단비 (추정치)', coverage_amount: 3000000 },
          { rider_name: '독감치료비 (추정치)', coverage_amount: 100000 },
          { rider_name: '3대진단비 (추정치)', coverage_amount: 50000000 }
        );
      } else if (cat === 'child_sick') {
        const amt = p * 400;
        cancer_diagnosis += amt;
        riders.push(
          { rider_name: '소아암진단비 (추정치)', coverage_amount: amt },
          { rider_name: '소아수술비 (추정치)', coverage_amount: 1000000 }
        );
      } else if (cat === 'surgery') {
        const amt = p * 15;
        surgery_amount += amt;
        riders.push(
          { rider_name: '질병1-5종수술비 (추정치)', coverage_amount: 5000000 },
          { rider_name: '질병입원일당 (추정치)', coverage_amount: 50000 },
          { rider_name: '중환자실입원일당 (추정치)', coverage_amount: 100000 }
        );
      } else if (cat === 'whole') {
        riders.push(
          { rider_name: '주계약사망보장 (추정치)', coverage_amount: p * 800 },
          { rider_name: '무해지환급금 (추정치)', coverage_amount: 100 },
          { rider_name: '체증형물가상승대응 (추정치)', coverage_amount: 1 }
        );
      } else if (cat === 'variable') {
        riders.push(
          { rider_name: '사망보장한도 (추정치)', coverage_amount: p * 1000 },
          { rider_name: '보험료납입규모 (추정치)', coverage_amount: p },
          { rider_name: '우량체할인 (추정치)', coverage_amount: 15 }
        );
      } else if (cat === 'dental') {
        riders.push(
          { rider_name: '임플란트치료비 (추정치)', coverage_amount: 1500000 },
          { rider_name: '크라운치료비 (추정치)', coverage_amount: 300000 },
          { rider_name: '레진인레이보존치료비 (추정치)', coverage_amount: 150000 }
        );
      } else if (cat === 'car') {
        riders.push(
          { rider_name: '자기차량손해자차 (추정치)', coverage_amount: 1 },
          { rider_name: '대물배상10억 (추정치)', coverage_amount: 1000000000 },
          { rider_name: '자동차상해자상 (추정치)', coverage_amount: 1 },
          { rider_name: '티맵안전운전할인 (추정치)', coverage_amount: 12 }
        );
      } else if (cat === 'driver') {
        riders.push(
          { rider_name: '교통사고처리지원금형사합의 (추정치)', coverage_amount: 200000000 },
          { rider_name: '변호사선임비용 (추정치)', coverage_amount: 50000000 },
          { rider_name: '대인벌금 (추정치)', coverage_amount: 30000000 },
          { rider_name: '대물벌금 (추정치)', coverage_amount: 5000000 },
          { rider_name: '자동차사고부상치료비자부상 (추정치)', coverage_amount: 300000 }
        );
      } else if (cat === 'pet') {
        riders.push(
          { rider_name: '슬개골고관절탈구보장 (추정치)', coverage_amount: 1 },
          { rider_name: '피부염귓병외이염보장 (추정치)', coverage_amount: 1 },
          { rider_name: '구강질환스케일링보장 (추정치)', coverage_amount: 1 },
          { rider_name: '반려동물배상책임 (추정치)', coverage_amount: 10000000 }
        );
      } else if (cat === 'golf') {
        riders.push(
          { rider_name: '홀인원축하비용 (추정치)', coverage_amount: 2000000 },
          { rider_name: '골프배상책임타구사고 (추정치)', coverage_amount: 30000000 },
          { rider_name: '골프용품손해도난파손 (추정치)', coverage_amount: 2000000 },
          { rider_name: '4인동반단체할인 (추정치)', coverage_amount: 5 }
        );
      } else if (cat === 'fire_real') {
        riders.push(
          { rider_name: '건물복구가입금액 (추정치)', coverage_amount: 100000000 },
          { rider_name: '가재도구가입금액 (추정치)', coverage_amount: 30000000 },
          { rider_name: '급배수시설누출손해누수 (추정치)', coverage_amount: 5000000 },
          { rider_name: '화재배상이웃집피해 (추정치)', coverage_amount: 2000000000 }
        );
      } else if (cat === 'property') {
        riders.push(
          { rider_name: '건물화재실손보장한도 (추정치)', coverage_amount: 200000000 },
          { rider_name: '시설인테리어보장 (추정치)', coverage_amount: 50000000 },
          { rider_name: '급배수시설누출손해누수 (추정치)', coverage_amount: 5000000 },
          { rider_name: '점포휴업손해영업중단 (추정치)', coverage_amount: 1 },
          { rider_name: '시설소유배상책임 (추정치)', coverage_amount: 100000000 }
        );
      } else if (cat === 'annuity') {
        riders.push(
          { rider_name: '세액공제연말정산환급 (추정치)', coverage_amount: 6000000 },
          { rider_name: 'IRP퇴직연금매칭 (추정치)', coverage_amount: 9000000 }
        );
      } else if (cat === 'legal') {
        riders.push(
          { rider_name: '심급별변호사선임비용 (추정치)', coverage_amount: 20000000 },
          { rider_name: '인지대송달료실비 (추정치)', coverage_amount: 5000000 },
          { rider_name: '급발진분쟁소송특약 (추정치)', coverage_amount: 1 }
        );
      } else if (cat === 'credit') {
        riders.push(
          { rider_name: '사망상환보장 (추정치)', coverage_amount: p * 500 },
          { rider_name: '질병상환보장 (추정치)', coverage_amount: p * 500 },
          { rider_name: '장해상환보장 (추정치)', coverage_amount: p * 500 }
        );
      } else if (cat === 'accident') {
        const postDis = p * 500;
        post_disability_amount += postDis;
        riders.push(
          { rider_name: '상해사망보험금 (추정치)', coverage_amount: p * 1000 },
          { rider_name: '상해후유장해3%이상 (추정치)', coverage_amount: postDis },
          { rider_name: '골절진단비 (추정치)', coverage_amount: 300000 },
          { rider_name: '상해수술비 (추정치)', coverage_amount: 500000 },
          { rider_name: '레저스포츠상해특약 (추정치)', coverage_amount: 1 }
        );
      } else if (cat === 'savings_general') {
        riders.push(
          { rider_name: '비과세이자소득세0% (추정치)', coverage_amount: p * 120 },
          { rider_name: '최저보증이율평생 (추정치)', coverage_amount: 1 }
        );
      } else {
        riders.push({ rider_name: '기본보장 (추정치)', coverage_amount: p * 500 });
      }
    }

    policies.push({
      insurance_company: company,
      product_name: prodName,
      monthly_premium: p,
      riders,
      isCustom: !!item.isCustom,
      isEstimated: !item.isCustom,
      categoryId: item.categoryId
    });
  });

  return {
    age,
    gender,
    current_total_premium,
    cancer_diagnosis,
    brain_vascular,
    ischemic_heart,
    caregiver_expense,
    silson,
    surgery_amount,
    post_disability_amount,
    policies
  };
};
