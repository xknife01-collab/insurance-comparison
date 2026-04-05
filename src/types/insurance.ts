/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CoverageItem {
  currentAmount: number; // 현재 가입 금액 (원)
  targetAmount: number;  // 권장 가입 금액 (원, 연령/성별 기반)
}

export interface InsuranceAnalysis {
  age: number;               // 연령
  gender: 'M' | 'F';        // 성별
  jobClass?: number;         // 직업급수 (1~3)
  selectedCategory?: string; // 선택된 보험 카테고리
  cancer: CoverageItem;      // 일반암
  cerebrovascular: CoverageItem; // 뇌혈관
  cardiovascular: CoverageItem;  // 심혈관
  surgery: CoverageItem;         // 수술비
  postDisability: CoverageItem;  // 질병후유장해
  paymentExemption: 'standard' | 'premium'; // 납입면제
  healthStatus: 'standard' | 'simple'; // 건강상태 (표준체/유병자)
  preExistingType?: '3.0.5' | '3.2.5' | '3.3.5' | '3.5.5'; // 유병자 상세 유형 (3.0.5 ~ 3.5.5)
  monthlyPremium: number;       // 현재 월 보험료
  dental?: {                    // 치아보험 전용 필드
    lastYear: 'yes' | 'no';
    last5Years: 'yes' | 'no';
    dentures: 'yes' | 'no';
    implantLimit: '3' | 'unlimited';
    crownAmount: number;
    focus: 'conservative' | 'prosthetic';
  };
  caregiving?: {                // 간병 서비스 보험 전용 필드
    type: 'support' | 'expense';
    isStepUp: boolean;
  };
  silson?: {                    // 실손의료보험 전용 필드
    hasCurrentSilson: 'yes' | 'no';    // 기존 실손 가입 여부 (중복방지)
    threeMonthTreatment: 'yes' | 'no'; // 3개월 내 의료행위
    oneYearExam: 'yes' | 'no';         // 1년 내 추가검사
    fiveYearTreatment: 'yes' | 'no';   // 5년 내 입원/수술/계속치료
  };
}

export interface AnalysisResult {
  analysis: InsuranceAnalysis; // 원본 분석 요청 데이터
  scores: {
    cancerScore: number;
    cerebrovascularScore: number;
    cardiovascularScore: number;
    totalScore: number;
  };
  efficiency: number; // 보장 점수 합계 / 월 보험료
  deficiencies: string[]; // 부족한 보장 항목 리스트
  recommendations: {
    diet: RecommendationPlan;
    upgrade: RecommendationPlan;
    hybrid: RecommendationPlan;
  };
}

export interface RecommendationPlan {
  title: string;
  description: string;
  estimatedPremium: number;
  coverageChanges: string[];
  switchingLossNotice: string;
}
