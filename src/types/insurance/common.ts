export interface CoverageItem {
  currentAmount: number;
  targetAmount: number;
}

export interface RecommendationPlan {
  title: string;
  description: string;
  estimatedPremium: number;
  coverageChanges: string[];
  switchingLossNotice: string;
  productName?: string;
  companyName?: string;
}

export type Gender = 'M' | 'F';
export type HealthStatus = 'standard' | 'simple';
export type PreExistingType = '3.0.5' | '3.2.5' | '3.3.5' | '3.5.5';

export interface BaseInsuranceAnalysis {
  age: number;
  gender: Gender;
  jobClass?: number;
  selectedCategory?: string;
  monthlyPremium: number;
  healthStatus: HealthStatus;
  preExistingType?: PreExistingType;
}

export interface BaseAnalysisResult {
  efficiency: number;
  deficiencies: string[];
  scores: {
    totalScore: number;
    [key: string]: any;
  };
  recommendations: {
    diet: RecommendationPlan;
    upgrade: RecommendationPlan;
    hybrid: RecommendationPlan;
  };
}
