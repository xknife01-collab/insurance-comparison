// 엔진 형식 선택 옵션을 차종 속성에 맞춰 동적으로 반환
export const getEngineOptions = (type: string, brandId: string, modelId: string) => {
  // 1. 전기차인 경우 (EV)
  if (type === 'ev' || modelId.includes('ev') || modelId.includes('ioniq') || brandId === 'tesla') {
    return [
      { id: 'ev_rwd', label: '⚡ RWD 싱글 모터 (기본형)', desc: '실속형 후륜 구동 전기 사양', price: 0 },
      { id: 'ev_awd', label: '🔋 AWD 듀얼 모터 롱레인지 (+600만원)', desc: '대용량 배터리 및 사륜 구동 사양', price: 6000000 },
      { id: 'ev_perf', label: '🚀 AWD 고성능 퍼포먼스 (+1200만원)', desc: '압도적인 가속력의 고성능 트랙 사양', price: 12000000 }
    ];
  }

  // 2. RV / 승합 / 화물 / 대형 SUV (카니발, 팰리세이드, 스타리아, 봉고 등)
  if (type === 'van' || type === 'truck' || modelId === 'carnival' || modelId === 'palisade' || modelId === 'staria' || modelId === 'sorento') {
    return [
      { id: 'diesel_2_2', label: '⛽ 디젤 2.2 (기본형)', desc: '강력한 견인력과 우수한 연비의 디젤 엔진', price: 0 },
      { id: 'gas_3_5', label: '🚀 가솔린 3.5 (+150만원)', desc: '정숙하고 진동 없는 V6 가솔린 엔진', price: 1500000 },
      { id: 'hybrid_1_6', label: '⚡ 1.6 터보 하이브리드 (+450만원)', desc: '친환경 및 높은 경제성의 세제 혜택 하이브리드', price: 4500000 }
    ];
  }

  // 3. 일반 세단 및 중소형 SUV (그랜저, 아반떼, K5, 쏘나타 등)
  return [
    { id: 'g2_5', label: '⛽ 가솔린 2.0 / 2.5 (기본형)', desc: '부드러운 주행 질감의 기본 가솔린 사양', price: 0 },
    { id: 'g3_5', label: '🚀 가솔린 3.5 / 터보 (+300만원)', desc: '강력한 출력의 V6 / 터보 엔진 사양', price: 3000000 },
    { id: 'hybrid', label: '⚡ 1.6 터보 하이브리드 (+500만원)', desc: '최고의 연비와 친환경 세제 혜택', price: 5000000 },
    { id: 'lpi', label: '💨 LPi LPG (+100만원)', desc: '친환경적이며 경제적인 충전소 연료 사양', price: 1000000 }
  ];
};

// 세부 트림 선택 옵션을 브랜드 및 차종 속성에 맞춰 동적으로 반환
export const getTrimOptions = (type: string, brandId: string, modelId: string) => {
  // 1. 전기차인 경우 (EV)
  if (type === 'ev' || modelId.includes('ev') || modelId.includes('ioniq') || brandId === 'tesla') {
    return [
      { id: 'standard', label: '🎖️ 스탠다드', desc: '합리적인 전기차 기본 필수 패키지', price: 0 },
      { id: 'premium', label: '💎 프리미엄 (+500만원)', desc: '고급 인테리어와 ADAS 안전 편의 강화 사양', price: 5000000 },
      { id: 'prestige', label: '👑 프레스티지 (+1000만원)', desc: '최첨단 주행 보조 및 천연가죽 최고급 사양', price: 10000000 }
    ];
  }

  // 2. 수입 브랜드 차량인 경우 (BMW, 벤츠, 아우디, 볼보, 포르쉐 등)
  if (brandId === 'bmw' || brandId === 'mercedes' || brandId === 'audi' || brandId === 'volvo' || brandId === 'porsche') {
    return [
      { id: 'basic', label: '🎖️ 기본형 (Base)', desc: '수입차 본연의 가치를 담은 스탠다드 라인', price: 0 },
      { id: 'msport_amg', label: '💎 M Sport / AMG Line (+800만원)', desc: '스포티한 범퍼, 휠, 서스펜션 스타일링 패키지', price: 8000000 },
      { id: 'individual', label: '👑 인디비주얼 / 풀옵션 (+1500만원)', desc: '메리노 가죽, 프리미엄 오디오 등 초호화 인디비주얼 패키지', price: 15000000 }
    ];
  }

  // 3. 제네시스 (Genesis)
  if (brandId === 'genesis') {
    return [
      { id: 'standard', label: '🎖️ 기본형 스탠다드', desc: '제네시스 에센셜 기본 패키지', price: 0 },
      { id: 'sds1', label: '💎 시그니처 디자인 셀렉션 I (+300만원)', desc: '고급 천연가죽 시트 및 프라임 인테리어 패키지', price: 3000000 },
      { id: 'sds2', label: '👑 시그니처 디자인 셀렉션 II (+600만원)', desc: '퀼팅 나파 가죽 및 오픈포어 리얼우드 최고급 패키지', price: 6000000 }
    ];
  }

  // 4. 기아자동차 (Kia)
  if (brandId === 'kia') {
    return [
      { id: 'prestige', label: '🎖️ 프레스티지 (Prestige)', desc: '합리적인 기본 편의 품목을 갖춘 실속형 등급', price: 0 },
      { id: 'noblesse', label: '💎 노블레스 (Noblesse) (+350만원)', desc: '12.3인치 클러스터 및 서라운드 뷰 등 지능형 안전 사양 추가', price: 3500000 },
      { id: 'signature', label: '👑 시그니처 (Signature) (+650만원)', desc: '퀼팅 가죽 시트, 프리미엄 사운드 등 풀옵션 수준의 최고급 등급', price: 6500000 }
    ];
  }

  // 5. 쉐보레 (Chevrolet / GM코리아)
  if (brandId === 'chevrolet') {
    return [
      { id: 'ls_lt', label: '🎖️ LS / LT', desc: '실용성과 핵심 주행 가치에 집중한 가성비 기본 사양', price: 0 },
      { id: 'premier', label: '💎 프리미어 (Premier) (+300만원)', desc: '고급 내장재 및 스마트 안전 장비가 보강된 고급 사양', price: 3000000 },
      { id: 'activ_rs', label: '👑 액티브 / RS (+550만원)', desc: '스포티한 액티브/RS 전용 디자인 및 최고급 편의 장비 풀패키지', price: 5500000 }
    ];
  }

  // 6. KG모빌리티 (KG / 쌍용)
  if (brandId === 'kg') {
    return [
      { id: 'luxury', label: '🎖️ 럭셔리 / 더 클래스', desc: '동급 최대 적재 공간 및 풍부한 편의 사양의 기본 등급', price: 0 },
      { id: 'prestige', label: '💎 프레스티지 (Prestige) (+320만원)', desc: '지능형 안전 자율 주행 패키지 및 통풍/열선 고급 팩 기본 장착', price: 3200000 },
      { id: 'noblesse', label: '👑 노블레스 / 더 블랙 (+580만원)', desc: '천연 가죽 퀼팅 시트, 최고급 외장 및 풀패키지 하이엔드 사양', price: 5800000 }
    ];
  }

  // 7. 르노코리아 (Renault)
  if (brandId === 'renault') {
    return [
      { id: 'se_le', label: '🎖️ SE / LE (Techno)', desc: '르노 특유의 정숙성과 고효율 드라이빙 핵심 사양', price: 0 },
      { id: 're', label: '💎 RE (Iconic) (+300만원)', desc: '어댑티브 크루즈 컨트롤 및 앰비언트 라이트 등 품격 강화 사양', price: 3000000 },
      { id: 'premiere', label: '👑 프리미에르 / 알핀 (+600만원)', desc: '나파 가죽 시트, 보스 프리미엄 사운드 등 최상급 럭셔리 라인', price: 6000000 }
    ];
  }

  // 8. 국산 일반 브랜드 차량 (현대 및 기타 등)
  return [
    { id: 'premium', label: '🎖️ 프리미엄', desc: '합리적인 기본 핵심 품목 사양', price: 0 },
    { id: 'exclusive', label: '💎 익스클루시브 (+400만원)', desc: '안전/편의 장비가 강화된 고급형 사양', price: 4000000 },
    { id: 'calligraphy', label: '👑 캘리그래피 (+800만원)', desc: '독보적인 고급 외장과 소재의 최고급 사양', price: 8000000 }
  ];
};
