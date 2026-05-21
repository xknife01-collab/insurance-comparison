import { BaseInsuranceAnalysis, BaseAnalysisResult, CoverageItem } from './common';

export interface HealthAnalysis extends BaseInsuranceAnalysis {
  cancer: CoverageItem;
  cerebrovascular: CoverageItem;
  cardiovascular: CoverageItem;
  surgery: CoverageItem;
  postDisability: CoverageItem;
  paymentExemption: 'standard' | 'premium';
}

export interface HealthAnalysisResult extends BaseAnalysisResult {
  scores: {
    cancerScore: number;
    cerebrovascularScore: number;
    cardiovascularScore: number;
    totalScore: number;
  };
}
