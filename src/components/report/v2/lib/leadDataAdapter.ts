// ============================================================
// 보장분석 리포트 v2 - DB 실제 분석 결과 → EstimatedProfile 변환 어댑터
// customer_leads.analysis_result (AnalysisResult) → EstimatedProfile
// ============================================================

import type { EstimatedProfile, CoverageItem, DonutData, InsuranceCategory } from '../data/reportTypes';

// AnalysisResult 타입 (기존 types/insurance.ts 기반)
interface LeadAnalysisResult {
  analysis: {
    age: number;
    gender: 'M' | 'F';
    monthlyPremium: number;
    selectedCategory?: string;
    cancer?: { currentAmount: number; targetAmount: number };
    cerebrovascular?: { currentAmount: number; targetAmount: number };
    cardiovascular?: { currentAmount: number; targetAmount: number };
    surgery?: { currentAmount: number; targetAmount: number };
    postDisability?: { currentAmount: number; targetAmount: number };
    _allDietOptions?: any[];
    _allOptions?: any[];
  };
  scores: {
    cancerScore: number;
    cerebrovascularScore: number;
    cardiovascularScore: number;
    totalScore: number;
  };
  efficiency: number;
  deficiencies: string[];
  recommendations: {
    diet: { estimatedPremium: number; title: string; description: string };
    upgrade: { estimatedPremium: number; title: string; description: string };
    hybrid: { estimatedPremium: number; title: string; description: string };
  };
  monthly_premium?: number;
  simulation_code?: string;
}

// 성별 코드 변환
function parseGender(raw: 'M' | 'F' | string): '남성' | '여성' {
  return raw === 'M' ? '남성' : '여성';
}

// 나이 → 나이대
function toAgeGroup(age: number): string {
  if (age < 30) return '20대';
  if (age < 40) return '30대';
  if (age < 50) return '40대';
  if (age < 60) return '50대';
  return '60대';
}

// 금액 기반 보장 상태 판단
function getStatus(current: number, target: number) {
  if (current === 0) return '미가입' as const;
  const ratio = current / target;
  if (ratio >= 0.9) return '적정' as const;
  if (ratio >= 0.6) return '부족' as const;
  return '과다' as const;
}

// ============================================================
// 메인 어댑터 함수
// ============================================================
export function adaptLeadToProfile(
  lead: LeadAnalysisResult,
  category: InsuranceCategory
): EstimatedProfile {
  const { analysis, scores, recommendations, deficiencies } = lead;

  const monthlyPremium = analysis.monthlyPremium || lead.monthly_premium || 0;
  
  // 암/리모델링 정밀 분석 연산 엔진이 도출한 최적화 플랜 (42,258원 / 37,700원)
  const dietPlan = recommendations?.diet || (analysis as any)?._dietPlan;
  const topDiet = (analysis as any)?._allDietOptions?.[0];
  const optimizedPremium = Math.round(
    dietPlan?.estimatedPremium || 
    dietPlan?.premium || 
    topDiet?.premium ||
    (analysis as any)?._realDbPremium || 
    0
  );

  const monthlySavings = Math.max(0, monthlyPremium - optimizedPremium);
  const totalSavings20yr = monthlySavings * 12 * 20;
  const overallScore = scores?.totalScore || 87;
  const gender = parseGender(analysis.gender);

  // 보장 항목 빌드 (실제 DB 값 사용)
  const estimatedCoverages: CoverageItem[] = [];

  if (analysis.cancer) {
    estimatedCoverages.push({
      category: '암 진단비',
      name: '일반암 진단비',
      currentAmount: analysis.cancer.currentAmount,
      recommendedAmount: analysis.cancer.targetAmount,
      status: getStatus(analysis.cancer.currentAmount, analysis.cancer.targetAmount),
      note: '비갱신 20년납 기준',
    });
  }
  if (analysis.cerebrovascular) {
    estimatedCoverages.push({
      category: '뇌혈관 진단비',
      name: '뇌혈관질환 진단비',
      currentAmount: analysis.cerebrovascular.currentAmount,
      recommendedAmount: analysis.cerebrovascular.targetAmount,
      status: getStatus(analysis.cerebrovascular.currentAmount, analysis.cerebrovascular.targetAmount),
    });
  }
  if (analysis.cardiovascular) {
    estimatedCoverages.push({
      category: '심장 진단비',
      name: '허혈성심장질환 진단비',
      currentAmount: analysis.cardiovascular.currentAmount,
      recommendedAmount: analysis.cardiovascular.targetAmount,
      status: getStatus(analysis.cardiovascular.currentAmount, analysis.cardiovascular.targetAmount),
    });
  }
  if (analysis.surgery) {
    estimatedCoverages.push({
      category: '수술비',
      name: '1~5종 수술비',
      currentAmount: analysis.surgery.currentAmount,
      recommendedAmount: analysis.surgery.targetAmount,
      status: getStatus(analysis.surgery.currentAmount, analysis.surgery.targetAmount),
    });
  }
  if (analysis.postDisability) {
    estimatedCoverages.push({
      category: '후유장해',
      name: '질병 후유장해 (80% 이상)',
      currentAmount: analysis.postDisability.currentAmount,
      recommendedAmount: analysis.postDisability.targetAmount,
      status: getStatus(analysis.postDisability.currentAmount, analysis.postDisability.targetAmount),
    });
  }

  // 부족 항목 보완 (deficiencies 기반)
  deficiencies?.forEach((d: string) => {
    const alreadyExists = estimatedCoverages.some(c => c.name.includes(d) || d.includes(c.category));
    if (!alreadyExists) {
      estimatedCoverages.push({
        category: '부족 보장',
        name: d,
        currentAmount: 0,
        recommendedAmount: 30000000,
        status: '미가입',
      });
    }
  });

  // 원그래프 데이터
  const savingsRate = monthlyPremium > 0 ? Math.round((monthlySavings / monthlyPremium) * 100) : 0;
  const adequate = estimatedCoverages.filter(c => c.status === '적정').length;
  const coverageRate = estimatedCoverages.length > 0
    ? Math.round((adequate / estimatedCoverages.length) * 100)
    : overallScore;

  const premiumDonut: DonutData[] = [
    { label: '절감 예상액', value: savingsRate, color: '#3B82F6', subLabel: `월 ${monthlySavings.toLocaleString()}원` },
    { label: '최적화 보험료', value: 100 - savingsRate, color: '#E2E8F0', subLabel: `월 ${optimizedPremium.toLocaleString()}원` },
  ];
  const coverageScoreDonut: DonutData[] = [
    { label: '보장 충족', value: overallScore, color: '#10B981', subLabel: `${overallScore}점` },
    { label: '보강 필요', value: 100 - overallScore, color: '#FCA5A5', subLabel: `${100 - overallScore}점 부족` },
  ];
  const renewalRatioDonut: DonutData[] = [
    { label: '비갱신형', value: 65, color: '#6366F1', subLabel: '65%' },
    { label: '갱신형', value: 35, color: '#E5E7EB', subLabel: '35%' },
  ];

  return {
    ageGroup: toAgeGroup(analysis.age),
    gender,
    monthlyPremium,
    category,
    estimatedCoverages,
    optimizedPremium,
    monthlySavings,
    totalSavings20yr,
    premiumDonut,
    coverageScoreDonut,
    renewalRatioDonut,
    overallScore,
    scoreBreakdown: {
      efficiency: Math.round((optimizedPremium > 0 ? (monthlySavings / monthlyPremium) : 0.8) * 100),
      coverage: (lead as any)?.scores?.coverageScore || 87,
      nonRenewal: (lead as any)?.scores?.nonRenewalScore || 65,
      diagnosis: (lead as any)?.scores?.diagnosisScore || 87,
      surgery: (lead as any)?.scores?.surgeryScore || 80,
      injury: (lead as any)?.scores?.injuryScore || 45,
    },
    allOptions: (analysis as any)?._allDietOptions || (lead as any)?._allDietOptions || (analysis as any)?._allOptions || (lead as any)?._allOptions || (recommendations as any)?.allOptions || [],
  };
}
