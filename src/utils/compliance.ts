export function maskCompany(name: string, isUnlocked: boolean): string {
  if (isUnlocked || !name) return name;
  
  const companyMap: { [key: string]: string } = {
    '삼성화재': 'A손보',
    '현대해상': 'B손보',
    'DB손해보험': 'C손보',
    'DB손보': 'C손보',
    'KB손해보험': 'D손보',
    'KB손보': 'D손보',
    '메리츠화재': 'E손보',
    '메리츠': 'E손보',
    '한화손해보험': 'F손보',
    '한화손보': 'F손보',
    '롯데손해보험': 'G손보',
    '롯데손보': 'G손보',
    'MG손해보험': 'H손보',
    'MG손보': 'H손보',
    '흥국화재': 'I손보',
    '농협손해보험': 'J손보',
    'NH농협손해보험': 'J손보',
    '농협손보': 'J손보',
    'NH농협손보': 'J손보',
    '하나손해보험': 'K손보',
    '하나손보': 'K손보',
    '카카오페이손해보험': 'L손보',
    '카카오페이손보': 'L손보',
    '처브라이프생명': 'T생보',
    '처브라이프': 'T생보',
    
    '삼성생명': 'A생보',
    '교보생명': 'B생보',
    '한화생명': 'C생보',
    '신한라이프': 'D생보',
    '신한라이프생명': 'D생보',
    '동양생명': 'E생보',
    '미래에셋생명': 'F생보',
    '미래에셋': 'F생보',
    '라이나생명': 'G생보',
    '라이나': 'G생보',
    '교보라이프플래닛': 'H생보',
    '교보라이프플래닛생명': 'H생보',
    '라이프플래닛': 'H생보',
    'KDB생명': 'I생보',
    'BNP파리바 카디프생명': 'J생보',
    '카디프생명': 'J생보',
    '흥국생명': 'K생보',
    'DB생명': 'L생보',
    'NH농협생명': 'M생보',
    'AIA생명': 'N생보',
    '메트라이프생명': 'O생보',
    '메트라이프': 'O생보',
    'ABL생명': 'P생보',
    '하나생명': 'Q생보',
    'KB라이프생명': 'R생보',
    'KB라이프': 'R생보',
    'iM라이프생명': 'S생보',
    'iM라이프': 'S생보',
    'DGB생명': 'S생보',
    'DGB생명보험': 'S생보',
    
    // Short / Abbreviated Brand mappings (non-duplicate)
    '교보라플': 'H사',
    '신한': 'D사',
    '우리': 'U사',
    'KDB': 'I사',
    'ABL': 'P사',
    'AIA': 'N사',
    'MG': 'H사',
    'DB': 'C사',
    'KB': 'D사',
    '흥': 'I사',
    '삼성': 'A사',
    '현대': 'B사',
    '교보': 'B사',
    '동양': 'E사',
    '한화': 'F사',
    '롯데': 'G사',
    '농협': 'J사',
    '하나': 'K사',
    'NH': 'J사',
    'DGB': 'S사',
    'iM': 'S사',
    '카카오페이': 'L사',
    '처브': 'T사',
  };

  for (const [key, val] of Object.entries(companyMap)) {
    if (name.includes(key)) {
      return val;
    }
  }

  // Fallback for generic brands
  if (name.includes('삼성')) return 'A사';
  if (name.includes('현대')) return 'B사';
  if (name.includes('동양')) return 'E사';
  if (name.includes('교보')) return 'B사';
  
  return name;
}

export function maskProductName(name: string, isUnlocked: boolean): string {
  if (isUnlocked || !name) return name;

  const lower = name.toLowerCase();
  
  // Strip company names containing "화재", "생명", etc. to prevent keyword collision during product categorization.
  const cleanLower = lower
    .replace(/삼성\s*화재/g, '')
    .replace(/메리츠\s*화재/g, '')
    .replace(/흥국\s*화재/g, '')
    .replace(/롯데\s*화재/g, '')
    .replace(/한화\s*화재/g, '')
    .replace(/let\s*:\s*care/g, '')
    .replace(/letcare/g, '');

  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  const types = ['A형', 'B형', 'C형', 'D형', 'E형', 'F형'];
  const suffix = ` (${types[sum % types.length]})`;

  if (cleanLower.includes('암') || cleanLower.includes('cancer')) {
    if (cleanLower.includes('표적') || cleanLower.includes('치료비')) return '안심 표적항암치료보험' + suffix;
    if (cleanLower.includes('재진단') || cleanLower.includes('또받는')) return '반복보장 재진단암보험' + suffix;
    return '실속 암진단보장보험' + suffix;
  }
  if (cleanLower.includes('뇌') || cleanLower.includes('뇌혈관') || cleanLower.includes('뇌졸중') || cleanLower.includes('뇌출혈')) {
    return '뇌혈관질환 안심보장보험' + suffix;
  }
  if (cleanLower.includes('심장') || cleanLower.includes('허혈성') || cleanLower.includes('급성심근경색')) {
    return '허혈성 심장질환보장보험' + suffix;
  }
  if (cleanLower.includes('수술') || cleanLower.includes('입원') || cleanLower.includes('종수술')) {
    return '실속 수술입원보장보험' + suffix;
  }
  if (cleanLower.includes('운전자') || cleanLower.includes('driver')) {
    return '안심 운전자보장보험' + suffix;
  }
  if (cleanLower.includes('치아') || cleanLower.includes('덴탈') || cleanLower.includes('dental')) {
    return '실속 치아케어보장보험' + suffix;
  }
  if (cleanLower.includes('실손') || cleanLower.includes('실비')) {
    return '표준 실손의료비보험' + suffix;
  }
  if (cleanLower.includes('종신') || cleanLower.includes('whole life') || cleanLower.includes('wholelife')) {
    return '평생 종신보장보험' + suffix;
  }
  if (cleanLower.includes('펫') || cleanLower.includes('pet') || cleanLower.includes('개') || cleanLower.includes('고양이') || cleanLower.includes('반려')) {
    return '반려동물 건강케어보험' + suffix;
  }
  if (cleanLower.includes('어린이') || cleanLower.includes('자녀') || cleanLower.includes('아이') || cleanLower.includes('태아') || cleanLower.includes('child') || cleanLower.includes('신생아')) {
    return '희망 어린이종합보험' + suffix;
  }
  if ((cleanLower.includes('화재') || cleanLower.includes('주택') || cleanLower.includes('fire')) && !cleanLower.includes('상해')) {
    return '가정 주택화재보험' + suffix;
  }
  if (cleanLower.includes('치매') || cleanLower.includes('dementia')) {
    return '실버 치매간병보장보험' + suffix;
  }
  if (cleanLower.includes('재가') || cleanLower.includes('시설')) {
    return '실속 재가시설지원보험' + suffix;
  }
  if (cleanLower.includes('간병') || cleanLower.includes('care')) {
    return '안심 간병비지원보험' + suffix;
  }
  if (cleanLower.includes('연금') || cleanLower.includes('pension')) {
    return '안심 연금저축보험' + suffix;
  }
  if (cleanLower.includes('저축') || cleanLower.includes('savings')) {
    return '비과세 일반저축보험' + suffix;
  }
  if (cleanLower.includes('골프') || cleanLower.includes('golf')) {
    return '안심 골프레저보험' + suffix;
  }
  if (cleanLower.includes('변액')) {
    return '수익형 변액유니버설보험' + suffix;
  }
  if (cleanLower.includes('정기')) {
    return '합리적 정기사망보험' + suffix;
  }
  if (cleanLower.includes('종합') || cleanLower.includes('건강') || cleanLower.includes('통합') || cleanLower.includes('알파') || cleanLower.includes('플러스') || cleanLower.includes('올인원')) {
    return '실속 종합건강보장보험' + suffix;
  }
  if (cleanLower.includes('자동차') || cleanLower.includes('car') || cleanLower.includes('오토')) {
    return '전사 자동차다이렉트보험' + suffix;
  }
  if (cleanLower.includes('재물') || cleanLower.includes('상가') || cleanLower.includes('사업자') || cleanLower.includes('소상공인')) {
    return '재물종합 사업자보험' + suffix;
  }
  if (cleanLower.includes('민사') || cleanLower.includes('형사') || cleanLower.includes('법률')) {
    return '민형사 법률비용보험' + suffix;
  }
  if (cleanLower.includes('신용') || cleanLower.includes('대출')) {
    return '대출상환 안심신용보험' + suffix;
  }
  if (cleanLower.includes('유병') || cleanLower.includes('간편')) {
    return '간편고지 맞춤보장보험' + suffix;
  }
  if (cleanLower.includes('상해') || cleanLower.includes('레저') || cleanLower.includes('accident') || cleanLower.includes('골절')) {
    return '데일리 상해보장보험' + suffix;
  }

  // Fallback: Ensure NO real product name string is ever exposed unmasked!
  return '실속 맞춤보장보험' + suffix;
}

export function maskText(text: string, isUnlocked: boolean): string {
  if (isUnlocked || !text) return text;
  let masked = text;
  
  const companyKeys = [
    'BNP파리바 카디프생명', '교보라이프플래닛생명', '교보라이프플래닛', 'NH농협손해보험', '농협손해보험', '신한라이프생명', '미래에셋생명',
    '카카오페이손해보험',
    '처브라이프생명',
    'KB라이프생명', 'NH농협생명', '메트라이프생명', '하나손해보험', '신한라이프', '동양생명', '라이나생명', '카디프생명', '라이프플래닛',
    '삼성화재', '현대해상', 'DB손해보험', 'KB손해보험', '메리츠화재', '한화손해보험', '롯데손해보험', 'MG손해보험',
    '삼성생명', '교보생명', '한화생명', 'KDB생명', '흥국생명', 'DB생명', 'AIA생명', 'ABL생명', '하나생명', '교보라플',
    '카카오페이손보',
    '처브라이프',
    'KB라이프', 'NH농협손보', '농협손보', '하나손보', 'DB손보', 'KB손보', '한화손보', '롯데손보', 'MG손보', '메리츠',
    '미래에셋', '라이나', '메트라이프', 'iM라이프생명', 'DGB생명보험', 'iM라이프', 'DGB생명', '신한', '우리', 'KDB',
    'ABL', 'AIA', 'MG', 'DB', 'KB', '흥국', '삼성', '현대', '교보', '동양', '한화', '롯데', '농협', '하나',
    '카카오페이',
    '처브',
    'NH', 'DGB', 'iM', '흥'
  ];

  companyKeys.forEach(kw => {
    const maskedCo = maskCompany(kw, false);
    if (maskedCo !== kw) {
      masked = masked.split(kw).join(maskedCo);
    }
  });

  const productBrandMap: { [key: string]: string } = {
    '굿앤굿어린이': 'A사 어린이',
    'THE건강한치아': 'B사 치아',
    '하이카': 'C사 자동차',
  };

  for (const [key, val] of Object.entries(productBrandMap)) {
    if (masked.includes(key)) {
      masked = masked.split(key).join(val);
    }
  }

  masked = masked.split('다이렉트').join('온라인');
  
  return masked;
}
