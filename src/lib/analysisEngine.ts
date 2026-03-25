import { InsuranceAnalysis, AnalysisResult, RecommendationPlan } from '../types/insurance';
import { createClient } from '../utils/supabase/client';

const SCORING_WEIGHTS = {
  cancer: 1.0,
  cerebrovascular: 0.8,
  cardiovascular: 0.8
};

const TARGET_COVERAGE = {
  cancer: 50000000,
  cerebrovascular: 30000000,
  cardiovascular: 30000000
};

// Supabase 클라이언트 초기화
const supabase = createClient();

export const calculateScore = (analysis: InsuranceAnalysis): AnalysisResult['scores'] => {
  const cancerScore = Math.min(100, (analysis.cancer.currentAmount / TARGET_COVERAGE.cancer) * 100);
  const cerebrovascularScore = Math.min(100, (analysis.cerebrovascular.currentAmount / TARGET_COVERAGE.cerebrovascular) * 100);
  const cardiovascularScore = Math.min(100, (analysis.cardiovascular.currentAmount / TARGET_COVERAGE.cardiovascular) * 100);

  const totalScore = (
    cancerScore * SCORING_WEIGHTS.cancer + 
    cerebrovascularScore * SCORING_WEIGHTS.cerebrovascular + 
    cardiovascularScore * SCORING_WEIGHTS.cardiovascular
  ) / (SCORING_WEIGHTS.cancer + SCORING_WEIGHTS.cerebrovascular + SCORING_WEIGHTS.cardiovascular);

  return {
    cancerScore,
    cerebrovascularScore,
    cardiovascularScore,
    totalScore
  };
};

/**
 * 실시간 DB 기반 보험 분석 실행
 */
export const runAnalysis = async (analysis: InsuranceAnalysis): Promise<AnalysisResult> => {
  const scores = calculateScore(analysis);
  const efficiency = scores.totalScore / (analysis.monthlyPremium / 1000);

  const deficiencies: string[] = [];
  if (scores.cancerScore < 80) deficiencies.push('일반암 진단비');
  if (scores.cerebrovascularScore < 80) deficiencies.push('뇌혈관질환 진단비');
  if (scores.cardiovascularScore < 80) deficiencies.push('허혈성심장질환 진단비');

  // --- [실시간 DB 요율 조회] ---
  // 삼성화재 건강보험 요율을 나이, 성별, 직급 기반으로 조회
  let realRateData: Record<string, number> = {};
  
  try {
    const { data, error } = await supabase
      .from('insurance_rates')
      .select('rate_data')
      .eq('product_code', 'SAMSUNG_FIRE_HEALTH_01')
      .eq('gender', analysis.gender)
      .eq('age', analysis.age)
      .eq('job_class', analysis.jobClass || 1)
      .single();

    if (!error && data) {
      realRateData = data.rate_data as Record<string, number>;
      console.log('[+] Fetched Real Rates from DB:', realRateData);
    }
  } catch (err) {
    console.warn('[-] DB Fetch Failed, using Fallback Rates:', err);
  }

  // 실시간 요율이 있으면 실제 보험료 계산, 없으면 75% 추정치 사용
  const getEstimatedPremium = (baseRateKey: string, targetAmount: number) => {
    const rate = realRateData[baseRateKey] || 0;
    if (rate > 0) {
      // 요율은 보통 1천만원 또는 100원 단위일 수 있으나 여기서는 정규화된 값으로 계산
      return Math.round(rate * (targetAmount / 10000000) / 100) * 100;
    }
    return Math.round(analysis.monthlyPremium * 0.75 / 100) * 100;
  };

  const dietPremium = getEstimatedPremium('간편심사보험 종합 보장', analysis.monthlyPremium);

  return {
    scores,
    efficiency,
    deficiencies,
    recommendations: {
      diet: {
        title: '보장 유지 다이어트형',
        description: '현재 보장은 유지하면서 보험료만 낮출 수 있는 실시간 삼성화재 무해지 플랜입니다.',
        estimatedPremium: dietPremium,
        coverageChanges: ['동일 보장 금액 유지', '삼성화재 실시간 요율 적용'],
        switchingLossNotice: '기존 보험 해약 시 손실이 발생할 수 있습니다.'
      },
      upgrade: generateUpgradePlan(analysis, scores),
      hybrid: generateHybridPlan(analysis)
    }
  };
};

const generateUpgradePlan = (analysis: InsuranceAnalysis, scores: AnalysisResult['scores']): RecommendationPlan => ({
  title: '가성비 보장 업그레이드형',
  description: '현재 보험료와 비슷한 가격대로 부족한 진단비를 평균 수준 이상으로 끌어올리는 플랜입니다.',
  estimatedPremium: analysis.monthlyPremium,
  coverageChanges: [
    `암 진단비 ${TARGET_COVERAGE.cancer / 10000}만 원으로 상향`,
    `뇌/심장 진단비 각 ${TARGET_COVERAGE.cerebrovascular / 10000}만 원 확보`
  ],
  switchingLossNotice: '보장 성격과 면책 기간이 달라질 수 있습니다.'
});

const generateHybridPlan = (analysis: InsuranceAnalysis): RecommendationPlan => ({
  title: '최적 포트폴리오 복합형',
  description: '기존 보험 중 비싼 특약만 정리하고 부족한 부분은 가성비 좋은 신규 담보로 보충합니다.',
  estimatedPremium: Math.round(analysis.monthlyPremium * 0.85 / 100) * 100,
  coverageChanges: ['가성비 나쁜 특약 정리', '삼성화재 핵심 보장 보강'],
  switchingLossNotice: '특약 삭제 시 점수가 변동될 수 있습니다.'
});
