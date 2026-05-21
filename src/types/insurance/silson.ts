import { BaseInsuranceAnalysis, BaseAnalysisResult } from './common';

export interface SilsonAnalysis extends BaseInsuranceAnalysis {
  hasCurrentSilson: 'yes' | 'no';
  threeMonthTreatment: 'yes' | 'no';
  oneYearExam: 'yes' | 'no';
  fiveYearTreatment: 'yes' | 'no';
  nonReimbursableUsage: 'none' | 'under100' | '100to150' | '150to300' | 'over300';
}

export interface SilsonAnalysisResult extends BaseAnalysisResult {
  scores: {
    totalScore: number;
  };
}
