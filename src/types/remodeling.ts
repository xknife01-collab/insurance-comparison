export interface RawRider {
  rider_name: string;        // 예: "무배당일반암진단비특별약관"
  coverage_amount: number;   // 예: 30000000 (3천만원)
}

export interface RawInsurancePolicy {
  insurance_company: string; // 예: "삼성화재"
  product_name: string;      // 예: "무배당 삼성화재 건강보험 새시대"
  monthly_premium: number;   // 예: 120000 (12만원)
  riders: RawRider[];
}

export interface StandardizedCoverage {
  age: number;
  gender: 'M' | 'F';
  current_total_premium: number;
  cancer_diagnosis: number;  // 일반암 진단비
  brain_vascular: number;    // 뇌혈관 진단비
  ischemic_heart: number;    // 허혈성 심장 진단비
  caregiver_expense: number; // 간병인 일당/지원비
  silson: boolean;           // 실손보험 가입 여부
  surgery_amount?: number;   // 수술비
  post_disability_amount?: number; // 질병후유장해
  policies?: RawInsurancePolicy[];
}

export interface RecommendedPlan {
  company_name: string;
  total_premium: number;
  details: {
    cancer_premium: number;
    brain_premium: number;
    heart_premium: number;
    caregiver_premium: number;
  };
}
