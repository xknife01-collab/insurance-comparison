/**
 * 자동차보험용 차종 데이터베이스
 * 다나와 자동차 및 네이버 자동차 제원 연계 (2024~2026년 기준 실거래 최신 MSRP 가격 기준)
 * 자동 생성 및 동기화된 파일이므로 수정 시 주의하십시오.
 */

export interface CarModel {
  id: string;
  label: string;        // 표시명
  basePrice: number;    // 신차 기준 가격 (원)
  category: 'domestic' | 'imported'; // 국산/수입
  type: 'sedan' | 'suv' | 'van' | 'truck' | 'ev' | 'hatchback'; // 차체 형태
}

export interface CarBrand {
  id: string;
  label: string;
  origin: 'domestic' | 'imported';
  models: CarModel[];
}

export const CAR_DATABASE: CarBrand[] = [
  {
    "id": "hyundai",
    "label": "현대자동차",
    "origin": "domestic",
    "models": [
      {
        "id": "casper",
        "label": "캐스퍼",
        "basePrice": 16000000,
        "category": "domestic",
        "type": "hatchback"
      },
      {
        "id": "venue",
        "label": "베뉴",
        "basePrice": 20000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "kona",
        "label": "코나",
        "basePrice": 24000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "avante",
        "label": "아반떼",
        "basePrice": 23000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "ioniq5",
        "label": "아이오닉5",
        "basePrice": 52000000,
        "category": "domestic",
        "type": "ev"
      },
      {
        "id": "ioniq6",
        "label": "아이오닉6",
        "basePrice": 52000000,
        "category": "domestic",
        "type": "ev"
      },
      {
        "id": "sonata",
        "label": "쏘나타",
        "basePrice": 29000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "grandeur",
        "label": "그랜저",
        "basePrice": 43000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "tucson",
        "label": "투싼",
        "basePrice": 28000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "santafe",
        "label": "싼타페",
        "basePrice": 37000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "palisade",
        "label": "팰리세이드",
        "basePrice": 41000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "staria",
        "label": "스타리아",
        "basePrice": 35000000,
        "category": "domestic",
        "type": "van"
      },
      {
        "id": "porter2",
        "label": "포터2",
        "basePrice": 22000000,
        "category": "domestic",
        "type": "truck"
      },
      {
        "id": "pavise",
        "label": "파비스",
        "basePrice": 48000000,
        "category": "domestic",
        "type": "truck"
      }
    ]
  },
  {
    "id": "kia",
    "label": "기아자동차",
    "origin": "domestic",
    "models": [
      {
        "id": "ray",
        "label": "레이",
        "basePrice": 16000000,
        "category": "domestic",
        "type": "hatchback"
      },
      {
        "id": "morning",
        "label": "모닝",
        "basePrice": 14000000,
        "category": "domestic",
        "type": "hatchback"
      },
      {
        "id": "seltos",
        "label": "셀토스",
        "basePrice": 23000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "niro",
        "label": "니로",
        "basePrice": 27000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "ev3",
        "label": "EV3",
        "basePrice": 42000000,
        "category": "domestic",
        "type": "ev"
      },
      {
        "id": "ev6",
        "label": "EV6",
        "basePrice": 52000000,
        "category": "domestic",
        "type": "ev"
      },
      {
        "id": "ev9",
        "label": "EV9",
        "basePrice": 78000000,
        "category": "domestic",
        "type": "ev"
      },
      {
        "id": "k3",
        "label": "K3",
        "basePrice": 22000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "k5",
        "label": "K5",
        "basePrice": 28000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "k8",
        "label": "K8",
        "basePrice": 37000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "k9",
        "label": "K9",
        "basePrice": 63000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "sportage",
        "label": "스포티지",
        "basePrice": 29000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "sorento",
        "label": "쏘렌토",
        "basePrice": 39000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "mohave",
        "label": "모하비",
        "basePrice": 53000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "carnival",
        "label": "카니발",
        "basePrice": 36000000,
        "category": "domestic",
        "type": "van"
      },
      {
        "id": "bongo3",
        "label": "봉고3",
        "basePrice": 20000000,
        "category": "domestic",
        "type": "truck"
      }
    ]
  },
  {
    "id": "genesis",
    "label": "제네시스",
    "origin": "domestic",
    "models": [
      {
        "id": "gv60",
        "label": "GV60",
        "basePrice": 65000000,
        "category": "domestic",
        "type": "ev"
      },
      {
        "id": "g70",
        "label": "G70",
        "basePrice": 44000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "g80",
        "label": "G80",
        "basePrice": 59000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "g90",
        "label": "G90",
        "basePrice": 95000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "gv70",
        "label": "GV70",
        "basePrice": 54000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "gv80",
        "label": "GV80",
        "basePrice": 78000000,
        "category": "domestic",
        "type": "suv"
      }
    ]
  },
  {
    "id": "kg",
    "label": "KG모빌리티 (구 쌍용)",
    "origin": "domestic",
    "models": [
      {
        "id": "tivoli",
        "label": "티볼리",
        "basePrice": 22000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "tivoli_air",
        "label": "티볼리 에어",
        "basePrice": 26000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "korando",
        "label": "코란도",
        "basePrice": 28000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "rexton",
        "label": "렉스턴",
        "basePrice": 42000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "torres",
        "label": "토레스",
        "basePrice": 31000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "torres_evx",
        "label": "토레스 EVX",
        "basePrice": 45000000,
        "category": "domestic",
        "type": "ev"
      },
      {
        "id": "musso",
        "label": "무쏘",
        "basePrice": 35000000,
        "category": "domestic",
        "type": "truck"
      }
    ]
  },
  {
    "id": "renault",
    "label": "르노코리아",
    "origin": "domestic",
    "models": [
      {
        "id": "clio",
        "label": "클리오",
        "basePrice": 22000000,
        "category": "domestic",
        "type": "hatchback"
      },
      {
        "id": "xm3",
        "label": "XM3",
        "basePrice": 22000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "arkana",
        "label": "아르카나",
        "basePrice": 26000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "sm6",
        "label": "SM6",
        "basePrice": 28000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "qm6",
        "label": "QM6",
        "basePrice": 33000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "grantour",
        "label": "그랑 콜레오스",
        "basePrice": 35000000,
        "category": "domestic",
        "type": "suv"
      }
    ]
  },
  {
    "id": "chevrolet",
    "label": "쉐보레 (GM코리아)",
    "origin": "domestic",
    "models": [
      {
        "id": "spark",
        "label": "스파크",
        "basePrice": 13000000,
        "category": "domestic",
        "type": "hatchback"
      },
      {
        "id": "trailblazer",
        "label": "트레일블레이저",
        "basePrice": 24000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "equinox",
        "label": "이쿼녹스",
        "basePrice": 33000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "trax",
        "label": "트랙스",
        "basePrice": 24000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "colorado",
        "label": "콜로라도",
        "basePrice": 46000000,
        "category": "domestic",
        "type": "truck"
      },
      {
        "id": "bolt_ev",
        "label": "볼트 EV",
        "basePrice": 37000000,
        "category": "domestic",
        "type": "ev"
      },
      {
        "id": "bolt_euv",
        "label": "볼트 EUV",
        "basePrice": 42000000,
        "category": "domestic",
        "type": "ev"
      }
    ]
  },
  {
    "id": "tesla",
    "label": "테슬라",
    "origin": "imported",
    "models": [
      {
        "id": "model3",
        "label": "Model 3",
        "basePrice": 48000000,
        "category": "imported",
        "type": "ev"
      },
      {
        "id": "modely",
        "label": "Model Y",
        "basePrice": 56000000,
        "category": "imported",
        "type": "ev"
      },
      {
        "id": "modelx",
        "label": "Model X",
        "basePrice": 120000000,
        "category": "imported",
        "type": "ev"
      },
      {
        "id": "models",
        "label": "Model S",
        "basePrice": 110000000,
        "category": "imported",
        "type": "ev"
      }
    ]
  },
  {
    "id": "bmw",
    "label": "BMW",
    "origin": "imported",
    "models": [
      {
        "id": "bmw1",
        "label": "1시리즈",
        "basePrice": 38000000,
        "category": "imported",
        "type": "hatchback"
      },
      {
        "id": "bmw2",
        "label": "2시리즈",
        "basePrice": 44000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "bmw3",
        "label": "3시리즈",
        "basePrice": 54000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "bmw5",
        "label": "5시리즈",
        "basePrice": 69000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "bmw7",
        "label": "7시리즈",
        "basePrice": 110000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "bmwx1",
        "label": "X1",
        "basePrice": 44000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "bmwx3",
        "label": "X3",
        "basePrice": 59000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "bmwx5",
        "label": "X5",
        "basePrice": 85000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "bmwx6",
        "label": "X6",
        "basePrice": 92000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "bmwi4",
        "label": "i4",
        "basePrice": 72000000,
        "category": "imported",
        "type": "ev"
      },
      {
        "id": "bmwix",
        "label": "iX",
        "basePrice": 108000000,
        "category": "imported",
        "type": "ev"
      }
    ]
  },
  {
    "id": "mercedes",
    "label": "메르세데스-벤츠",
    "origin": "imported",
    "models": [
      {
        "id": "merc_a",
        "label": "A클래스",
        "basePrice": 42000000,
        "category": "imported",
        "type": "hatchback"
      },
      {
        "id": "merc_c",
        "label": "C클래스",
        "basePrice": 57000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "merc_e",
        "label": "E클래스",
        "basePrice": 76000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "merc_s",
        "label": "S클래스",
        "basePrice": 145000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "merc_gla",
        "label": "GLA",
        "basePrice": 48000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "merc_glb",
        "label": "GLB",
        "basePrice": 53000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "merc_glc",
        "label": "GLC",
        "basePrice": 67000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "merc_gle",
        "label": "GLE",
        "basePrice": 95000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "merc_eqb",
        "label": "EQB",
        "basePrice": 68000000,
        "category": "imported",
        "type": "ev"
      },
      {
        "id": "merc_eqe",
        "label": "EQE",
        "basePrice": 90000000,
        "category": "imported",
        "type": "ev"
      },
      {
        "id": "merc_v",
        "label": "V클래스",
        "basePrice": 85000000,
        "category": "imported",
        "type": "van"
      }
    ]
  },
  {
    "id": "audi",
    "label": "아우디",
    "origin": "imported",
    "models": [
      {
        "id": "audi_a3",
        "label": "A3",
        "basePrice": 42000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "audi_a4",
        "label": "A4",
        "basePrice": 55000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "audi_a6",
        "label": "A6",
        "basePrice": 71000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "audi_a7",
        "label": "A7",
        "basePrice": 88000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "audi_a8",
        "label": "A8",
        "basePrice": 130000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "audi_q3",
        "label": "Q3",
        "basePrice": 48000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "audi_q5",
        "label": "Q5",
        "basePrice": 67000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "audi_q7",
        "label": "Q7",
        "basePrice": 89000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "audi_e_tron",
        "label": "e-tron",
        "basePrice": 85000000,
        "category": "imported",
        "type": "ev"
      },
      {
        "id": "audi_q8_etron",
        "label": "Q8 e-tron",
        "basePrice": 97000000,
        "category": "imported",
        "type": "ev"
      }
    ]
  },
  {
    "id": "volkswagen",
    "label": "폭스바겐",
    "origin": "imported",
    "models": [
      {
        "id": "vw_polo",
        "label": "폴로",
        "basePrice": 28000000,
        "category": "imported",
        "type": "hatchback"
      },
      {
        "id": "vw_golf",
        "label": "골프",
        "basePrice": 36000000,
        "category": "imported",
        "type": "hatchback"
      },
      {
        "id": "vw_jetta",
        "label": "제타",
        "basePrice": 33000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "vw_tiguan",
        "label": "티구안",
        "basePrice": 45000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "vw_touareg",
        "label": "투아렉",
        "basePrice": 75000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "vw_id4",
        "label": "ID.4",
        "basePrice": 52000000,
        "category": "imported",
        "type": "ev"
      }
    ]
  },
  {
    "id": "volvo",
    "label": "볼보",
    "origin": "imported",
    "models": [
      {
        "id": "volvo_s60",
        "label": "S60",
        "basePrice": 55000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "volvo_s90",
        "label": "S90",
        "basePrice": 78000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "volvo_xc40",
        "label": "XC40",
        "basePrice": 52000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "volvo_xc60",
        "label": "XC60",
        "basePrice": 65000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "volvo_xc90",
        "label": "XC90",
        "basePrice": 88000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "volvo_ex40",
        "label": "EX40",
        "basePrice": 58000000,
        "category": "imported",
        "type": "ev"
      }
    ]
  },
  {
    "id": "toyota",
    "label": "토요타/렉서스",
    "origin": "imported",
    "models": [
      {
        "id": "camry",
        "label": "캠리",
        "basePrice": 38000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "rav4",
        "label": "RAV4",
        "basePrice": 44000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "prius",
        "label": "프리우스",
        "basePrice": 39000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "sienna",
        "label": "시에나",
        "basePrice": 56000000,
        "category": "imported",
        "type": "van"
      },
      {
        "id": "lx_es",
        "label": "렉서스 ES",
        "basePrice": 62000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "lx_rx",
        "label": "렉서스 RX",
        "basePrice": 72000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "lx_lx600",
        "label": "렉서스 LX600",
        "basePrice": 135000000,
        "category": "imported",
        "type": "suv"
      }
    ]
  },
  {
    "id": "honda",
    "label": "혼다",
    "origin": "imported",
    "models": [
      {
        "id": "civic",
        "label": "시빅",
        "basePrice": 35000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "accord",
        "label": "어코드",
        "basePrice": 45000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "crv",
        "label": "CR-V",
        "basePrice": 42000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "pilot",
        "label": "파일럿",
        "basePrice": 58000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "odyssey",
        "label": "오딧세이",
        "basePrice": 54000000,
        "category": "imported",
        "type": "van"
      }
    ]
  },
  {
    "id": "porsche",
    "label": "포르쉐",
    "origin": "imported",
    "models": [
      {
        "id": "cayenne",
        "label": "카이엔",
        "basePrice": 115000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "macan",
        "label": "마칸",
        "basePrice": 78000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "panamera",
        "label": "파나메라",
        "basePrice": 140000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "taycan",
        "label": "타이칸",
        "basePrice": 135000000,
        "category": "imported",
        "type": "ev"
      }
    ]
  },
  {
    "id": "other",
    "label": "기타 / 직접 입력",
    "origin": "imported",
    "models": [
      {
        "id": "other_domestic_small",
        "label": "기타 국산 소형 (1,000cc급)",
        "basePrice": 12000000,
        "category": "domestic",
        "type": "hatchback"
      },
      {
        "id": "other_domestic_mid",
        "label": "기타 국산 중형",
        "basePrice": 28000000,
        "category": "domestic",
        "type": "sedan"
      },
      {
        "id": "other_domestic_suv",
        "label": "기타 국산 SUV",
        "basePrice": 30000000,
        "category": "domestic",
        "type": "suv"
      },
      {
        "id": "other_import_mid",
        "label": "기타 수입 중형 세단",
        "basePrice": 55000000,
        "category": "imported",
        "type": "sedan"
      },
      {
        "id": "other_import_suv",
        "label": "기타 수입 SUV",
        "basePrice": 70000000,
        "category": "imported",
        "type": "suv"
      },
      {
        "id": "other_import_luxury",
        "label": "기타 수입 고급차 (1억+)",
        "basePrice": 100000000,
        "category": "imported",
        "type": "sedan"
      }
    ]
  }
];

// 검색용 평탄화 목록 (브랜드 정보 포함)
export interface FlatCarModel extends CarModel {
  brandId: string;
  brandLabel: string;
}

export const FLAT_CAR_MODELS: FlatCarModel[] = CAR_DATABASE.flatMap((brand) =>
  brand.models.map((model) => ({
    ...model,
    brandId: brand.id,
    brandLabel: brand.label,
  }))
);

// 모델 ID로 빠른 조회
export const CAR_MODEL_MAP: Record<string, FlatCarModel> = Object.fromEntries(
  FLAT_CAR_MODELS.map((m) => [m.id, m])
);
