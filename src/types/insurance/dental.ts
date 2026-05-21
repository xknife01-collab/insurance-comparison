import { BaseInsuranceAnalysis, BaseAnalysisResult } from './common';

export interface DentalAnalysis extends BaseInsuranceAnalysis {
  lastYear: 'yes' | 'no';
  last5Years: 'yes' | 'no';
  dentures: 'yes' | 'no';
  implantLimit: '3' | 'unlimited';
  crownAmount: number;
  focus: 'conservative' | 'prosthetic';
  diagnosticType: 'diagnostic' | 'non-diagnostic';
}

export interface DentalAnalysisResult extends BaseAnalysisResult {
  scores: {
    implant: number;
    crown: number;
    conservative: number;
    totalScore: number;
  };
}
