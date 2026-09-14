/**
 * 보험 광고 심의 기준 통계 출처 메타데이터 제공 모듈
 * 심의 필수 3요소: 자료명, 발표기관, 발표일 명시
 */

export interface ComplianceStatSource {
  title: string;        // 자료명
  publisher: string;    // 발표기관
  publishDate: string;  // 발표일(공표연월)
  categoryName: string; // 카테고리명
}

/**
 * 27개 보험 카테고리별 공인 통계 출처 데이터 매핑
 */
export function getComplianceStatSource(categoryRaw?: string): ComplianceStatSource {
  const category = (categoryRaw || '').toLowerCase();

  // 1. 암보험
  if (category.includes('cancer') || category.includes('암')) {
    return {
      categoryName: '암보험',
      title: '2021년 국가암등록통계',
      publisher: '보건복지부 · 국립암센터(중앙암등록본부)',
      publishDate: '2023년 12월'
    };
  }

  // 2. 뇌혈관질환
  if (category.includes('brain') || category.includes('뇌')) {
    return {
      categoryName: '뇌혈관질환보험',
      title: '2022년 사망원인통계 및 중증질환 등록자료',
      publisher: '통계청 · 국민건강보험공단',
      publishDate: '2023년 9월'
    };
  }

  // 3. 심장질환 (허혈성/심혈관)
  if (category.includes('heart') || category.includes('심장') || category.includes('허혈')) {
    return {
      categoryName: '심장질환보험',
      title: '2022년 사망원인통계 (심혈관질환 통계)',
      publisher: '통계청 · 질병관리청',
      publishDate: '2023년 9월'
    };
  }

  // 4. 실손의료비
  if (category.includes('silson') || category.includes('실손') || category.includes('실비')) {
    return {
      categoryName: '실손의료비',
      title: '2022년도 건강보험환자 진료비 실태조사',
      publisher: '국민건강보험공단',
      publishDate: '2023년 12월'
    };
  }

  // 5. 치아보험
  if (category.includes('dental') || category.includes('치아')) {
    return {
      categoryName: '치아보험',
      title: '2022년 건강보험통계연보 (외래 다빈도 상병 통계)',
      publisher: '건강보험심사평가원 · 국민건강보험공단',
      publishDate: '2023년 10월'
    };
  }

  // 6. 간병보험 / 치매
  if (category.includes('caregiving') || category.includes('간병') || category.includes('dementia') || category.includes('치매')) {
    return {
      categoryName: '간병·치매보험',
      title: '2022년 노인장기요양보험 통계연보',
      publisher: '국민건강보험공단',
      publishDate: '2023년 7월'
    };
  }

  // 7. 요양(재가/시설)
  if (category.includes('nursing') || category.includes('재가') || category.includes('시설')) {
    return {
      categoryName: '재가·시설 요양보험',
      title: '2022년 장기요양 실태조사 및 급여통계',
      publisher: '보건복지부 · 국민건강보험공단',
      publishDate: '2023년 7월'
    };
  }

  // 8. 어린이 / 태아 / 신생아 / 유병력자 어린이
  if (category.includes('child') || category.includes('어린이') || category.includes('태아') || category.includes('pre_family')) {
    return {
      categoryName: '어린이·태아보험',
      title: '2022년 출생통계 및 소아 다빈도 질환 통계',
      publisher: '통계청 · 건강보험심사평가원',
      publishDate: '2023년 8월'
    };
  }

  // 9. 운전자보험
  if (category.includes('driver') || category.includes('운전자')) {
    return {
      categoryName: '운전자보험',
      title: '2022년 교통사고 통계분석 (중대법규위반 및 형사사고)',
      publisher: '도로교통공단 · 경찰청',
      publishDate: '2023년 8월'
    };
  }

  // 10. 자동차보험
  if (category.includes('car') || category.includes('자동차')) {
    return {
      categoryName: '자동차보험',
      title: '2023년 자동차보험 사업실적 및 대인·대물 통계',
      publisher: '금융감독원 · 손해보험협회',
      publishDate: '2024년 3월'
    };
  }

  // 11. 펫보험
  if (category.includes('pet') || category.includes('펫')) {
    return {
      categoryName: '펫보험',
      title: '2023년 동물보호에 대한 국민의식조사 및 반려견 질환 실태',
      publisher: '농림축산식품부',
      publishDate: '2023년 6월'
    };
  }

  // 12. 골프 / 레저
  if (category.includes('golf') || category.includes('골프')) {
    return {
      categoryName: '골프·레저보험',
      title: '2022년 스포츠안전사고 실태조사',
      publisher: '스포츠안전재단 · 문화체육관광부',
      publishDate: '2023년 5월'
    };
  }

  // 13. 상해보험 (사고, 골절, 깁스)
  if (category.includes('accident') || category.includes('상해')) {
    return {
      categoryName: '상해보험',
      title: '2022년 생활안전사고 통계연보 (손상통계)',
      publisher: '질병관리청 · 소방청',
      publishDate: '2023년 6월'
    };
  }

  // 14. 수술/입원
  if (category.includes('surgery') || category.includes('hospital') || category.includes('수술') || category.includes('입원')) {
    return {
      categoryName: '수술·입원비보험',
      title: '2022년 주요수술통계연보',
      publisher: '국민건강보험공단',
      publishDate: '2023년 11월'
    };
  }

  // 15. 유병자 간편건강
  if (category.includes('pre_existing') || category.includes('유병자')) {
    return {
      categoryName: '유병자간편보험',
      title: '2022년 만성질환 현황과 이슈 통계',
      publisher: '질병관리청',
      publishDate: '2023년 11월'
    };
  }

  // 16. 주택화재
  if (category.includes('fire') || category.includes('화재')) {
    return {
      categoryName: '주택화재보험',
      title: '2022년 국가화재통계연보 (주거시설 화재 분석)',
      publisher: '소방청',
      publishDate: '2023년 4월'
    };
  }

  // 17. 재물종합 (사업장/상가)
  if (category.includes('property') || category.includes('재물')) {
    return {
      categoryName: '재물종합보험',
      title: '2022년 화재발생통계 및 소상공인 재난피해 실태',
      publisher: '소방청 · 행정안전부',
      publishDate: '2023년 4월'
    };
  }

  // 18. 종신보험
  if (category.includes('whole') || category.includes('종신')) {
    return {
      categoryName: '종신보험',
      title: '2023년 생명보험 통계연보 및 가계금융복지조사',
      publisher: '생명보험협회 · 통계청',
      publishDate: '2023년 12월'
    };
  }

  // 19. 변액 / 정기보험
  if (category.includes('variable') || category.includes('term') || category.includes('변액') || category.includes('정기')) {
    return {
      categoryName: '변액·정기보험',
      title: '2023년 금융투자상품 공시 및 변액보험 수익통계',
      publisher: '생명보험협회 · 금융투자협회',
      publishDate: '2023년 12월'
    };
  }

  // 20. 연금저축
  if (category.includes('annuity') || category.includes('연금')) {
    return {
      categoryName: '연금저축보험',
      title: '2022년 연금저축 취급기관별 비교공시 통계',
      publisher: '금융감독원',
      publishDate: '2023년 6월'
    };
  }

  // 21. 일반 저축보험
  if (category.includes('savings') || category.includes('저축')) {
    return {
      categoryName: '저축보험',
      title: '2023년 가계금융복지조사 (가계 저축 및 자산 운용)',
      publisher: '통계청 · 한국은행 · 금융감독원',
      publishDate: '2023년 12월'
    };
  }

  // 22. 신용보험 (대출상환보장)
  if (category.includes('credit') || category.includes('신용')) {
    return {
      categoryName: '신용대출안심보험',
      title: '2023년 가계부채 동향 및 대출차주 신용위험 지표',
      publisher: '한국은행 · 금융감독원',
      publishDate: '2023년 11월'
    };
  }

  // 23. 법률비용보험
  if (category.includes('legal') || category.includes('법률')) {
    return {
      categoryName: '법률비용보험',
      title: '2022년 사법연감 (민사·가사·행정 소송 통계)',
      publisher: '대법원 법원행정처',
      publishDate: '2023년 10월'
    };
  }

  // 24. 종합건강 / 리모델링 / 기본 공통
  return {
    categoryName: '종합건강보험',
    title: '2022년 국민보건의료통계 및 주요 사망원인통계',
    publisher: '보건복지부 · 통계청',
    publishDate: '2023년 9월'
  };
}
