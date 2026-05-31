// 운전자 보험 데이터 로더 - extracted_data.csv 기반
// CSV에서 파싱된 실제 보험 상품 정보
import { createClient } from '../../../utils/supabase/client';
import { InsuranceAnalysis } from '../../../types/insurance';

export interface DriverProduct {
  company: string;
  productName: string;
  coverage: string;       // 담보명
  payoutAmount: string;   // 지급금액
  malePremium: number;    // 기준보험료(남자)
  femalePremium: number;  // 가입보험료(여자)
}

// extracted_data.csv에서 추출한 보험사별 대표 상품
export const DRIVER_PRODUCTS: DriverProduct[] = [
  {
    company: '메리츠화재',
    productName: `(무) 메리츠 안전한 MY바이크 운전자보험2601`,
    coverage: `운전자용 벌금(Ⅳ)(비탑승중포함)`,
    payoutAmount: `3,000만원`,
    malePremium: 9500,
    femalePremium: 9500,
  },
  {
    company: '메리츠화재',
    productName: `(무) 메리츠 운전자 상해 종합보험2601(1종)`,
    coverage: `교통사고·처리지원금(Ⅸ)(비탑승중포함)`,
    payoutAmount: `교통사고·처리지원금(Ⅸ)(비탑승중포함)`,
    malePremium: 5934,
    femalePremium: 4911,
  },
  {
    company: '메리츠화재',
    productName: `(무) 메리츠 운전자 상해 종합보험2601(2종)`,
    coverage: `교통사고·처리지원금(Ⅸ)(비탑승중포함)`,
    payoutAmount: `교통사고·처리지원금(Ⅸ)(비탑승중포함)`,
    malePremium: 5990,
    femalePremium: 4955,
  },
  {
    company: '한화손보',
    productName: `캐롯 운전자보험 (무) 2종(자가용, 표준형)`,
    coverage: `교통상해사망`,
    payoutAmount: `보험가입금액`,
    malePremium: 4301,
    femalePremium: 3399,
  },
  {
    company: '한화손보',
    productName: `캐롯 운전자보험 (무) 4종(영업용, 표준형)`,
    coverage: `교통상해사망`,
    payoutAmount: `보험가입금액`,
    malePremium: 20073,
    femalePremium: 19449,
  },
  {
    company: '한화손보',
    productName: `한화 운전자상해보험 (무)2601 1종(운전자보장형)`,
    coverage: `교통상해사망`,
    payoutAmount: `보험가입금액`,
    malePremium: 4973,
    femalePremium: 3869,
  },
  {
    company: '한화손보',
    productName: `한화 운전자상해보험 (무)2601 2종(상해보장형)`,
    coverage: `교통상해사망`,
    payoutAmount: `보험가입금액`,
    malePremium: 4945,
    femalePremium: 3830,
  },
  {
    company: '롯데손보',
    productName: `(무) 운전자보험(2601)`,
    coverage: `(자가용운전자/영업용운전자) 교통사고처리지원금(중상해보장확대,비탑승중Ⅱ포함)`,
    payoutAmount: `(자가용운전자/영업용운전자) 교통사고처리지원금(중상해보장확대,비탑승중Ⅱ포함)`,
    malePremium: 4942,
    femalePremium: 4233,
  },
  {
    company: '롯데손보',
    productName: `(무) let:drive 운전자보험(2601.2)_1종(연만기,운전자형)`,
    coverage: `(자가용운전자/영업용운전자) 교통사고처리지원금(중상해보장확대,비탑승중Ⅱ포함)`,
    payoutAmount: `(자가용운전자/영업용운전자) 교통사고처리지원금(중상해보장확대,비탑승중Ⅱ포함)`,
    malePremium: 6177,
    femalePremium: 5216,
  },
  {
    company: '흥국화재',
    productName: `무배당 흥Good 다이렉트 운전자보험(26.01)`,
    coverage: `교통사고합의비용Ⅴ(일반)`,
    payoutAmount: `무배당 흥Good 다이렉트 운전자보험(26.01)`,
    malePremium: 3255,
    femalePremium: 2455,
  },
  {
    company: '흥국화재',
    productName: `무배당 흥Good The편한 운전자상해보험(26.03)`,
    coverage: `교통사고합의비용Ⅱ(6주미만,중대법령위반)`,
    payoutAmount: `무배당 흥Good The편한 운전자상해보험(26.03)`,
    malePremium: 3782,
    femalePremium: 2778,
  },
  {
    company: '흥국화재',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `교통사고합의비용Ⅱ(6주미만,중대법령위반)`,
    payoutAmount: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    malePremium: 5205,
    femalePremium: 4102,
  },
  {
    company: '삼성화재',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `자동차 운전중 및 운전후 비탑승 상태에서 약관에 정한 일반교통사고로 피해자(피보험자의 부모, 배우자 및 자녀 제외)에게 「자동차사고 부상 등급표」에서 정한 상해급수 1급, 2급 또는 3급 외에 해당하는 중상해를 입혀 약관에 정한 법령으로 경찰조사 후 불송치되거나 검찰에 의해 불기소된 경우(1사고당 피보험자가 실제로 지급한 형사합의금 지급) 피해자 1명당 7,000만원 한도로 지급`,
    payoutAmount: `무배당 삼성화재 다이렉트 운전자보험(2601.24)`,
    malePremium: 4635,
    femalePremium: 3595,
  },
  {
    company: '삼성화재',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `운전자 벌금(대물)`,
    payoutAmount: `무배당 삼성화재 다이렉트 오토바이 운전자보험(2601.3)`,
    malePremium: 11719,
    femalePremium: 11719,
  },
  {
    company: '삼성화재',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `교통사고처리지원금Ⅶ(중상해보장확대)(비탑승중Ⅱ 포함)`,
    payoutAmount: `무배당 삼성화재 다이렉트 국방가족안심 운전자보험(2603.2)`,
    malePremium: 5701,
    femalePremium: 4501,
  },
  {
    company: '현대해상',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `교통상해사망(비운전중)`,
    payoutAmount: `1억원`,
    malePremium: 16196,
    femalePremium: 9043,
  },
  {
    company: '현대해상',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `교통상해사망(운전자)`,
    payoutAmount: `1억원`,
    malePremium: 9058,
    femalePremium: 6496,
  },
  {
    company: '현대해상',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `교통상해사망(운전자)`,
    payoutAmount: `1억원`,
    malePremium: 10245,
    femalePremium: 7738,
  },
  {
    company: '현대해상',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `교통상해사망(비운전중)`,
    payoutAmount: `1억원`,
    malePremium: 16281,
    femalePremium: 13753,
  },
  {
    company: '현대해상',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `교통상해사망(운전자)`,
    payoutAmount: `1억원`,
    malePremium: 8989,
    femalePremium: 8641,
  },
  {
    company: '현대해상',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `교통상해사망(운전자)`,
    payoutAmount: `1억원`,
    malePremium: 10900,
    femalePremium: 10753,
  },
  {
    company: '현대해상',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `기본계약(이륜자동차운전중상해사망)`,
    payoutAmount: `1억원`,
    malePremium: 9496,
    femalePremium: 9496,
  },
  {
    company: '현대해상',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `교통상해사망(운전자)`,
    payoutAmount: `5천만원`,
    malePremium: 6423,
    femalePremium: 5563,
  },
  {
    company: '현대해상',
    productName: `무배당 흥Good 든든한 SMILE 운전자 종합보험(26.03)`,
    coverage: `기본계약(이륜자동차운전중상해사망)`,
    payoutAmount: `1억원`,
    malePremium: 9430,
    femalePremium: 9430,
  },
  {
    company: 'KB손보',
    productName: `KB 다이렉트 플러스 오토바이 운전자보험(무배당)(26.01)`,
    coverage: `이륜자동차 운전중 교통사고처리보장Ⅳ`,
    payoutAmount: `KB 다이렉트 플러스 오토바이 운전자보험(무배당)(26.01)`,
    malePremium: 12928,
    femalePremium: 12928,
  },
  {
    company: 'KB손보',
    productName: `KB 다이렉트 플러스 운전자보험(무배당)(26.01)`,
    coverage: `교통사고처리보장A(중상해보장확대)(비탑승중포함)(운전자)`,
    payoutAmount: `KB 다이렉트 플러스 운전자보험(무배당)(26.01)`,
    malePremium: 4626,
    femalePremium: 3626,
  },
  {
    company: 'KB손보',
    productName: `KB 플러스 오토바이 운전자보험(무배당)(26.01)`,
    coverage: `이륜자동차 운전중 교통사고처리보장Ⅳ`,
    payoutAmount: `KB 플러스 오토바이 운전자보험(무배당)(26.01)`,
    malePremium: 13175,
    femalePremium: 13175,
  },
  {
    company: 'KB손보',
    productName: `보험가입금액(최초1회한)`,
    coverage: `교통사고처리보장A(중상해보장확대)(비탑승중포함)(운전자)`,
    payoutAmount: `KB 플러스 운전자상해보험(무배당)(26.01)_2형(납입면제 환급형)`,
    malePremium: 5046,
    femalePremium: 3997,
  },
  {
    company: 'KB손보',
    productName: `보험가입금액(최초1회한)`,
    coverage: `교통사고처리보장A(중상해보장확대)(비탑승중포함)(운전자)`,
    payoutAmount: `KB 플러스 운전자상해보험(무배당)(26.01)_1형(납입면제 기본형)`,
    malePremium: 4976,
    femalePremium: 3956,
  },
  {
    company: 'DB손보',
    productName: `(무)다이렉트 참좋은라이더 보험2601(CM)(2종)`,
    coverage: `PM 운전중 교통상해입원일당(4일이상180일한도)`,
    payoutAmount: `PM 운전중 교통상해입원일당(4일이상180일한도)`,
    malePremium: 5640,
    femalePremium: 5640,
  },
  {
    company: 'DB손보',
    productName: `(무)다이렉트 참좋은라이더 보험2601(CM)(1종)`,
    coverage: `심급별 자동차사고변호사선임비용Ⅲ(특정사고경찰조사포함)(비탑승중포함Ⅲ)(실손)`,
    payoutAmount: `보험가입금액(1500만원)`,
    malePremium: 17650,
    femalePremium: 17650,
  },
  {
    company: 'DB손보',
    productName: `(무)참좋은라이더 보험2601(4종)`,
    coverage: `PM 운전중 교통사고처리지원금(실손,동승자제외)(영업용제외)`,
    payoutAmount: `PM 운전중 교통사고처리지원금(실손,동승자제외)(영업용제외)`,
    malePremium: 12740,
    femalePremium: 12740,
  },
  {
    company: 'DB손보',
    productName: `(무)참좋은라이더 보험2601(1종)`,
    coverage: `심급별 자동차사고변호사선임비용Ⅲ(특정사고경찰조사포함)(비탑승중포함Ⅲ)(실손)`,
    payoutAmount: `보험가입금액(1,500만원)`,
    malePremium: 15460,
    femalePremium: 15460,
  },
  {
    company: 'DB손보',
    productName: `(무)다이렉트 참좋은운전생활 운전자보험2601(CM)`,
    coverage: `교통상해사망`,
    payoutAmount: `보험가입금액(1억원)`,
    malePremium: 8370,
    femalePremium: 6690,
  },
  {
    company: 'DB손보',
    productName: `(무)참좋은운전자상해보험2602`,
    coverage: `교통사고처리지원금(비탑승중포함Ⅲ)(실손)`,
    payoutAmount: `교통사고처리지원금(비탑승중포함Ⅲ)(실손)`,
    malePremium: 11980,
    femalePremium: 9290,
  },
  {
    company: 'DB손보',
    productName: `(무)참좋은운전자상해보험(TM)2602(1종)`,
    coverage: `교통사고처리지원금(비탑승중포함Ⅲ)(실손)`,
    payoutAmount: `교통사고처리지원금(비탑승중포함Ⅲ)(실손)`,
    malePremium: 12330,
    femalePremium: 9510,
  },
  {
    company: 'DB손보',
    productName: `(무)참좋은운전자상해보험(TM)2602(2종)`,
    coverage: `교통사고처리지원금(비탑승중포함Ⅲ)(실손)`,
    payoutAmount: `교통사고처리지원금(비탑승중포함Ⅲ)(실손)`,
    malePremium: 12330,
    femalePremium: 9510,
  },
  {
    company: 'AXA손보',
    productName: `(무)AXA늘안심운전자상해보험Ⅱ2601`,
    coverage: `교통상해80%이상후유장해(운전자용)`,
    payoutAmount: `교통상해80%이상후유장해(운전자용)`,
    malePremium: 4930,
    femalePremium: 3540,
  },
  {
    company: 'AXA손보',
    productName: `(무)AXA마일리지운전자상해보험Ⅱ2601`,
    coverage: `교통상해80%이상후유장해(운전자용)`,
    payoutAmount: `교통상해80%이상후유장해(운전자용)`,
    malePremium: 4830,
    femalePremium: 3450,
  },
  {
    company: '하나손보',
    productName: `무배당 하나더베스트 운전자상해종합보험(2601)`,
    coverage: `교통사고처리지원금Ⅴ(비탑승중포함)`,
    payoutAmount: `무배당 하나더베스트 운전자상해종합보험(2601)`,
    malePremium: 4650,
    femalePremium: 4267,
  },
  {
    company: '하나손보',
    productName: `무배당 하나더베스트 운전자보험(다이렉트)(2601)`,
    coverage: `자동차 운전 중 중대법규위반 교통사고(음주, 무면허, 약물복용 제외)로 피해자(부모, 배우자, 자녀 제외)가 42일 이상 치료를 요한다는 진단을 받은 경우 형사합의금으로 지급한 금액(피해자 1인당)`,
    payoutAmount: `무배당 하나더베스트 운전자보험(다이렉트)(2601)`,
    malePremium: 4934,
    femalePremium: 3865,
  },
  {
    company: '신한EZ손해보험',
    productName: `신한 이지로운 운전자보험(무배당)`,
    coverage: `교통사고처리지원금Ⅱ(중상해보장확대)(비탑승중포함)`,
    payoutAmount: `신한 이지로운 운전자보험(무배당)`,
    malePremium: 7881,
    femalePremium: 6693,
  },
  {
    company: '신한EZ손해보험',
    productName: `신한 SOL 처음운전자보험(무배당)`,
    coverage: `교통사고처리지원금Ⅱ(중상해보장확대)(비탑승중포함)`,
    payoutAmount: `신한 SOL 처음운전자보험(무배당)`,
    malePremium: 4675,
    femalePremium: 4463,
  },
  {
    company: '농협손보',
    productName: `(무) NH다이렉트운전자보험2601`,
    coverage: `교통사고처리지원금(중상해확대,2억원한도)`,
    payoutAmount: `교통사고처리지원금(중상해확대,2억원한도)`,
    malePremium: 10311,
    femalePremium: 5819,
  },
  {
    company: '농협손보',
    productName: `(무) NH올바른지구굿데이운전자상해보험2601`,
    coverage: `피해자 중상해 : 자동차 운전중 약관에 정한 일반교통사고로 인하여 다음 중 하나에 해당하는 사유가 발생한 경우1. 피해자에게 자동차손해배상보장에서 정한 상해급수 1급, 2급 또는 3급에 해당하는 부상을 입힌 경우2. 피해자에게 상해급수 1급, 2급 또는 3급 이외에 해당하는 중상해를 입혀 공소제기된 경우3. 피해자에게 상해급수 1급, 2급 또는 3급 이외에 해당하는 중상해를 입혀 불기소 및 불송치된 경우`,
    payoutAmount: `피해자 중상해 : 자동차 운전중 약관에 정한 일반교통사고로 인하여 다음 중 하나에 해당하는 사유가 발생한 경우1. 피해자에게 자동차손해배상보장에서 정한 상해급수 1급, 2급 또는 3급에 해당하는 부상을 입힌 경우2. 피해자에게 상해급수 1급, 2급 또는 3급 이외에 해당하는 중상해를 입혀 공소제기된 경우3. 피해자에게 상해급수 1급, 2급 또는 3급 이외에 해당하는 중상해를 입혀 불기소 및 불송치된 경우`,
    malePremium: 15034,
    femalePremium: 9068,
  },
  {
    company: '삼성화재',
    productName: `보험기간 중 약관에 정한 허혈성심장질환으로 진단 확정된 경우`,
    coverage: `자동차 운전중 및 운전후 비탑승 상태에서 약관에 정한 일반교통사고로 피해자(피보험자의 부모, 배우자 및 자녀 제외)에게 「자동차사고 부상 등급표」에서 정한 상해급수 1급, 2급 또는 3급 외에 해당하는 중상해를 입혀 약관에 정한 법령으로 경찰조사 후 불송치되거나 검찰에 의해 불기소된 경우(1사고당 피보험자가 실제로 지급한 형사합의금 지급) 피해자 1명당 7,000만원 한도로 지급`,
    payoutAmount: `무배당 삼성화재 상해보험 행복한 안심파트너(2601.13)`,
    malePremium: 6315,
    femalePremium: 4415,
  },
  {
    company: '하나손보',
    productName: `무배당 하나더퍼스트 교직원 안심보험(2601)`,
    coverage: `교원소청변호사비용손해`,
    payoutAmount: `무배당 하나더퍼스트 교직원 안심보험(2601)`,
    malePremium: 10487,
    femalePremium: 9399,
  },
  {
    company: 'AIG손보',
    productName: `무배당 AIG 꼭 필요한 상해종합보험2601`,
    coverage: `[갱신형]교통상해후유장해(3~100%)`,
    payoutAmount: `무배당 AIG 꼭 필요한 상해종합보험2601`,
    malePremium: 13618,
    femalePremium: 8060,
  },
  {
    company: 'AIG손보',
    productName: `무배당 AIG 꼭 필요한 상해보험2601(2종)`,
    coverage: `[갱신형]교통상해후유장해(3~100%)`,
    payoutAmount: `무배당 AIG 꼭 필요한 상해보험2601(2종)`,
    malePremium: 13618,
    femalePremium: 8060,
  },
  {
    company: 'AIG손보',
    productName: `무배당 AIG 꼭 필요한 상해보험2601(1종)`,
    coverage: `[갱신형]교통상해후유장해(3~100%)`,
    payoutAmount: `무배당 AIG 꼭 필요한 상해보험2601(1종)`,
    malePremium: 7258,
    femalePremium: 4520,
  },
  {
    company: '한화손보',
    productName: `캐롯 운전자보험 (무) 1종(자가용, 실속형)`,
    coverage: `자동차 운전 중 자동차사고로 타인(피보험자의 부모, 배우자, 자녀 제외)에게 다음 중 어느 하나에 해당하는 손해를 입힌 경우 형사합의금으로 지급한 금액 실손보상· 중대법규위반교통사고로 타인이 42일미만 진단을 받은 경우`,
    payoutAmount: `자동차 운전 중 자동차사고로 타인(피보험자의 부모, 배우자, 자녀 제외)에게 다음 중 어느 하나에 해당하는 손해를 입힌 경우 형사합의금으로 지급한 금액 실손보상· 중대법규위반교통사고로 타인이 42일미만 진단을 받은 경우`,
    malePremium: 3312,
    femalePremium: 3312,
  },
  {
    company: '한화손보',
    productName: `캐롯 운전자보험 (무) 3종(영업용, 실속형)`,
    coverage: `자동차 운전 중 자동차사고로 타인(피보험자의 부모, 배우자, 자녀 제외)에게 다음 중 어느 하나에 해당하는 손해를 입힌 경우 형사합의금으로 지급한 금액 실손보상· 중대법규위반교통사고로 타인이 42일미만 진단을 받은 경우`,
    payoutAmount: `자동차 운전 중 자동차사고로 타인(피보험자의 부모, 배우자, 자녀 제외)에게 다음 중 어느 하나에 해당하는 손해를 입힌 경우 형사합의금으로 지급한 금액 실손보상· 중대법규위반교통사고로 타인이 42일미만 진단을 받은 경우`,
    malePremium: 17456,
    femalePremium: 17456,
  },
];

/** 보험사별 대표 상품 (보험료가 낮은 순으로 1개만 반환) */
export function getDriverProductsByCompany(): DriverProduct[] {
  const seen = new Set<string>();
  const result: DriverProduct[] = [];
  // 남자 보험료 오름차순 정렬 → 보험사별 첫 번째(최저가) 픽
  const sorted = [...DRIVER_PRODUCTS].sort((a, b) => a.malePremium - b.malePremium);
  for (const p of sorted) {
    if (!seen.has(p.company)) {
      seen.add(p.company);
      result.push(p);
    }
  }
  return result.sort((a, b) => a.malePremium - b.malePremium);
}

/** 전체 상품 목록 (보험료 오름차순) */
export function getAllDriverProducts(): DriverProduct[] {
  return [...DRIVER_PRODUCTS].sort((a, b) => a.malePremium - b.malePremium);
}

/**
 * 운전자 보험 전용 데이터베이스 로더
 * Supabase에서 실시간 요율을 조회하여 나이, 운전 목적, 직업 급수를 보정해 반환합니다.
 */
export async function fetchDriverPremium(analysis: InsuranceAnalysis) {
  try {
    const supabase = createClient();
    const genderVal = (analysis.gender || 'M').toString().toUpperCase();
    const dbGender = (genderVal.startsWith('M') || genderVal === '남') ? 'M' : 'F';
    const targetAge = analysis.age || 40;
    
    const driverOpts = analysis.driver || {
      drivingPurpose: 'private',
      jobClass: 1,
      planType: 'standard'
    };
    const { drivingPurpose, jobClass, planType } = driverOpts;
    const planLevelMap: Record<string, string> = {
      saving: '실속형',
      standard: '표준형',
      premium: 'VIP안심'
    };
    const targetPlanLevel = planLevelMap[planType] || '표준형';

    // 1. 운전 목적(용도) 할증율
    const purposeMultiplier = drivingPurpose === 'commercial' ? 1.85 : 1.0;

    // 2. 직업 등급(상해위험도) 할증율
    let jobMultiplier = 1.0;
    if (jobClass === 2) jobMultiplier = 1.35;
    if (jobClass === 3) jobMultiplier = 1.65;

    // 3. 연령 조정 할증율 (U자형 요율 곡선 반영)
    let ageMultiplier = 1.0;
    if (targetAge < 21) {
      ageMultiplier = 1.55;      // 20대 초반 (55% 할증)
    } else if (targetAge < 26) {
      ageMultiplier = 1.35;      // 20대 중반 (35% 할증)
    } else if (targetAge < 30) {
      ageMultiplier = 1.20;      // 20대 후반 (20% 할증)
    } else if (targetAge < 50) {
      ageMultiplier = 0.90;      // 30대~40대 황금기 (10% 할인!)
    } else if (targetAge < 60) {
      ageMultiplier = 1.00;      // 50대 기준
    } else if (targetAge < 70) {
      ageMultiplier = 1.10;      // 60대 (10% 할증)
    } else {
      ageMultiplier = 1.25;      // 70대 이상 (25% 할증)
    }

    const totalMultiplier = purposeMultiplier * jobMultiplier * ageMultiplier;

    // Supabase 데이터 조회
    const { data: dbRates, error: ratesError } = await supabase
      .from('driver_insurance_rates')
      .select('*')
      .eq('gender', dbGender);

    const { data: dbProducts, error: prodError } = await supabase
      .from('driver_insurance_products')
      .select('*');

    let results: any[] = [];

    if (ratesError || prodError || !dbRates || dbRates.length === 0) {
      console.warn('[Driver DB Loader] Supabase 조회 실패, 정적 데이터 Fallback 적용:', ratesError || prodError);
      
      // Fallback 로직: 정적 DRIVER_PRODUCTS 활용
      const planConfigs = [
        { level: '실속형', add: 6000, min: 9900 },
        { level: '표준형', add: 11000, min: 15000 },
        { level: 'VIP안심형', add: 21000, min: 25000 }
      ];

      DRIVER_PRODUCTS.forEach(p => {
        const basePrem = dbGender === 'M' ? p.malePremium : p.femalePremium;
        planConfigs.forEach(cfg => {
          const rawPrem = Math.max(basePrem + cfg.add, cfg.min);
          const finalPrem = Math.round(rawPrem * totalMultiplier);
          results.push({
            premium: finalPrem,
            productName: p.productName,
            companyName: p.company,
            planLevel: cfg.level,
            details: {
              '교통사고처리지원금': cfg.level === '실속형' ? '1억 원 한도' : (cfg.level === '표준형' ? '1.5억 원 한도' : '2억 원 한도'),
              '변호사선임비용': cfg.level === '실속형' ? '3,000만 원 한도' : '5,000만 원 한도',
              '벌금': cfg.level === '실속형' ? '대인 2,000만 원 한도' : (cfg.level === '표준형' ? '대인 3,000만 원 한도' : '대인 3,000만 / 대물 500만 원 한도')
            }
          });
        });
      });
    } else {
      // Supabase 데이터가 있을 때 매핑
      const prodMap = new Map<string, string>(); // productName -> companyName
      dbProducts?.forEach(p => {
        prodMap.set(p.product_name, p.company_name);
      });

      dbRates.forEach(r => {
        const company = prodMap.get(r.product_name) || '국내주요보험사';
        const finalPrem = Math.round((r.premium || 15000) * totalMultiplier);
        results.push({
          premium: finalPrem,
          productName: r.product_name,
          companyName: company,
          planLevel: r.plan_level,
          details: r.details || {}
        });
      });
    }

    // 사용자가 선택한 상세 타입 (accident: 교통사고처리 집중, lawyer: 변호사비용 집중)
    const detailType = (driverOpts as any).detailType;

    // --- 오토바이 vs 자가용 상품 분리 필터링 ---
    const bikeKeywords = ['이륜', '오토바이', '바이크'];
    let filteredResults = results;
    
    if ((drivingPurpose as any) === 'motorcycle') {
      // 오토바이 상품만 노출
      filteredResults = results.filter(r => 
        bikeKeywords.some(kw => r.productName.includes(kw))
      );
    } else {
      // 일반 자가용/영업용: 오토바이 상품 원천 제거
      filteredResults = results.filter(r => 
        !bikeKeywords.some(kw => r.productName.includes(kw))
      );
    }

    // 프리미엄 기준 정렬
    filteredResults.sort((a, b) => a.premium - b.premium);

    // 상세 타입별 동적 필터링/우선순위 적용
    let displayOptions = filteredResults;
    if (detailType === 'accident') {
      // 교통사고처리지원금 집중형: 표준형, VIP안심만 필터링
      const filtered = filteredResults.filter(r => r.planLevel === '표준형' || r.planLevel === 'VIP안심');
      if (filtered.length > 0) displayOptions = filtered;
    } else if (detailType === 'lawyer') {
      // 변호사비용 집중형: VIP안심만 필터링
      const filtered = filteredResults.filter(r => r.planLevel === 'VIP안심');
      if (filtered.length > 0) displayOptions = filtered;
    } else {
      // 기본형: 사용자가 지정한 plan_level 요율만 필터링해 중복 제거
      const filtered = filteredResults.filter(r => r.planLevel === targetPlanLevel);
      if (filtered.length > 0) displayOptions = filtered;
    }

    const mainOption = displayOptions[0] || filteredResults[0] || { premium: 15000, productName: '기본 운전자보험', companyName: 'DB손보' };

    return {
      premium: mainOption.premium,
      productName: mainOption.productName,
      companyName: mainOption.companyName,
      _allOptions: displayOptions
    };
  } catch (e) {
    console.error('[Driver Loader Critical Error]:', e);
    return null;
  }
}
