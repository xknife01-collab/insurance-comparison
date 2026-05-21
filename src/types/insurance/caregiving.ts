import { BaseInsuranceAnalysis, BaseAnalysisResult } from './common';

export interface CaregivingAnalysis extends BaseInsuranceAnalysis {
  careType: 'support' | 'expense';
  isStepUp: boolean;
}

export interface CaregivingAnalysisResult extends BaseAnalysisResult {
  scores: {
    totalScore: number;
    careTypeScore: number;
    stepUpScore: number;
  };
}
