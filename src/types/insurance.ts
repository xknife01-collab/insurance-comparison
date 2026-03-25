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
  cancer: CoverageItem;      // 일반암
  cerebrovascular: CoverageItem; // 뇌혈관
  cardiovascular: CoverageItem;  // 심혈관
  monthlyPremium: number;       // 현재 월 보험료
}

export interface AnalysisResult {
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
