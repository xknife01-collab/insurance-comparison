// ============================================================
// 보장분석 리포트 v2 - 공통 타입 정의
// 기존 코드 파일과 완전히 독립된 신규 모듈
// ============================================================

export type InsuranceCategory =
  | 'cancer'        // 암보험
  | 'silson'        // 의료실비
  | 'driver'        // 운전자보험
  | 'brain'         // 뇌혈관
  | 'heart'         // 심장질환
  | 'surgery'       // 수술/입원
  | 'dental'        // 치아보험
  | 'dementia'      // 치매보험
  | 'caregiving'    // 간병보험
  | 'nursing'       // 재가/시설
  | 'pre'           // 유병자보험
  | 'health_general'// 종합건강
  | 'accident'      // 상해보험
  | 'child'         // 어린이보험
  | 'pre_family'    // 유병력자 전용
  | 'car'           // 자동차보험
  | 'pet'           // 펫보험
  | 'golf'          // 골프/레저
  | 'fire_real'     // 주택화재
  | 'property'      // 재물종합
  | 'pension'       // 연금저축
  | 'whole'         // 종신보험
  | 'variable'      // 변액/정기
  | 'legal'         // 민사/형사
  | 'savings_general'// 일반저축
  | 'credit'        // 신용보험
  | 'care_svc'      // 간병보험(지원)
  | 'care_old';     // 치매 간병보험

// 보장 항목 상태 (뱃지 컬러)
export type CoverageStatus = '적정' | '부족' | '과다' | '미가입' | '우수';

// 보장 항목 1행
export interface CoverageItem {
  category: string;        // 대분류 (예: 진단비)
  name: string;            // 특약명 (예: 암 진단비(일반암))
  currentAmount: number;   // 현재 추정 보장금액 (원)
  recommendedAmount: number; // 권장 보장금액 (원)
  status: CoverageStatus;  // 적정/부족/과다/미가입
  note?: string;           // 비고
}

// 원그래프 데이터
export interface DonutData {
  label: string;
  value: number;           // 0~100 퍼센트
  color: string;
  subLabel?: string;
}

// 통계 역산 결과 (나이 + 보험료 기반)
export interface EstimatedProfile {
  ageGroup: string;          // 예: '40대'
  gender: '남성' | '여성';
  monthlyPremium: number;    // 현재 납입 보험료 (원)
  category: InsuranceCategory;

  // 현재 추정 보장 현황
  estimatedCoverages: CoverageItem[];

  // 최적화 결과
  optimizedPremium: number;       // 다이어트 후 보험료 (원)
  monthlySavings: number;         // 매월 절감액 (원)
  totalSavings20yr: number;       // 20년 총 절감 예상액 (원)

  // 원그래프 데이터
  premiumDonut: DonutData[];      // 보험료 비중 도넛
  coverageScoreDonut: DonutData[]; // 보장 충족도 도넛
  renewalRatioDonut: DonutData[];  // 비갱신 비중 도넛

  // 종합 점수
  overallScore: number;           // 100점 만점
  scoreBreakdown: {
    efficiency: number;    // 보험료 효율성
    coverage: number;      // 보장 적정성
    nonRenewal: number;    // 비갱신 비중
    diagnosis: number;     // 진단비 갭
    surgery: number;       // 수술비 보장
    injury: number;        // 상해후유장해
  };

  // 전 보험사 실시간 비교 옵션 배열
  allOptions?: any[];
}

// 관리자 DB에서 가져오는 명함 데이터
export interface BusinessCardData {
  agencyName: string;
  agencyLogo?: string;
  plannerName: string;
  plannerPhone: string;
  plannerEmail?: string;
  plannerPhoto?: string;
  registrationNumber?: string;
  title?: string;
  address?: string;
}

// 리포트 렌더링에 필요한 전체 데이터
export interface ReportData {
  profile: EstimatedProfile;
  businessCard?: BusinessCardData;
  generatedAt: string;      // 생성 일시
  disclaimer: string;       // 면책 고지문
}
