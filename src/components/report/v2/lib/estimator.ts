// ============================================================
// 보장분석 리포트 v2 - 나이 + 보험료 기반 보장금액 역산 추정 알고리즘
// 통계 기반 추정값 - 실제 계약 내역과 다를 수 있음 (면책 고지 필수)
// ============================================================

import type { InsuranceCategory, EstimatedProfile, CoverageItem, DonutData } from '../data/reportTypes';

// 나이 그룹 파싱
function parseAgeGroup(age: number): string {
  if (age < 30) return '20대';
  if (age < 40) return '30대';
  if (age < 50) return '40대';
  if (age < 60) return '50대';
  return '60대';
}

// 보험료 단계별 역산 테이블 (암보험 기준 - 40대 남성 단가: 1천만원당 약 1.2만원)
// 예: 125,000원 / 12,000원 × 10,000,000 ≈ 1억 원
function estimateCancerCoverage(
  age: number,
  gender: '남성' | '여성',
  premium: number
): CoverageItem[] {
  // 나이/성별별 단가 계수 (원/1천만원 암 진단비)
  const ratePerTenMillion =
    age < 40
      ? (gender === '남성' ? 8000 : 6500)
      : age < 50
      ? (gender === '남성' ? 12000 : 9000)
      : age < 60
      ? (gender === '남성' ? 19000 : 14000)
      : (gender === '남성' ? 28000 : 21000);

  // 유효 보험료 (전체 보험료의 약 70%가 주요 진단비 특약으로 추정)
  const effectivePremium = premium * 0.70;

  // 암 진단비 추정 (원 단위)
  const cancerAmount = Math.round((effectivePremium / ratePerTenMillion) * 10000000 / 1000000) * 1000000;
  const brainAmount = Math.round(cancerAmount * 0.35 / 1000000) * 1000000;
  const heartAmount = Math.round(cancerAmount * 0.25 / 1000000) * 1000000;
  const smallCancerAmount = Math.round(cancerAmount * 0.5 / 1000000) * 1000000;

  // 권장 보장금액 (40대 이상 권장: 암 1억, 뇌/심장 3천만)
  const recommendedCancer = age < 40 ? 50000000 : 100000000;
  const recommendedBrain = age < 40 ? 20000000 : 30000000;
  const recommendedHeart = age < 40 ? 20000000 : 30000000;

  const getStatus = (current: number, recommended: number) => {
    if (current === 0) return '미가입' as const;
    const ratio = current / recommended;
    if (ratio >= 0.9) return '적정' as const;
    if (ratio >= 0.6) return '부족' as const;
    return '과다' as const;
  };

  return [
    {
      category: '암 진단비',
      name: '일반암 진단비',
      currentAmount: cancerAmount,
      recommendedAmount: recommendedCancer,
      status: getStatus(cancerAmount, recommendedCancer),
      note: '비갱신 20년납 기준',
    },
    {
      category: '암 진단비',
      name: '소액암 진단비 (갑상선·경계성)',
      currentAmount: smallCancerAmount,
      recommendedAmount: 20000000,
      status: getStatus(smallCancerAmount, 20000000),
    },
    {
      category: '암 진단비',
      name: '유사암 진단비 (제자리·피부)',
      currentAmount: Math.round(smallCancerAmount * 0.3 / 1000000) * 1000000,
      recommendedAmount: 10000000,
      status: getStatus(Math.round(smallCancerAmount * 0.3 / 1000000) * 1000000, 10000000),
    },
    {
      category: '뇌혈관 진단비',
      name: '뇌혈관질환 진단비',
      currentAmount: brainAmount,
      recommendedAmount: recommendedBrain,
      status: getStatus(brainAmount, recommendedBrain),
    },
    {
      category: '뇌혈관 진단비',
      name: '뇌졸중 진단비',
      currentAmount: Math.round(brainAmount * 0.7 / 1000000) * 1000000,
      recommendedAmount: 20000000,
      status: getStatus(Math.round(brainAmount * 0.7 / 1000000) * 1000000, 20000000),
    },
    {
      category: '심장 진단비',
      name: '허혈성심장질환 진단비',
      currentAmount: heartAmount,
      recommendedAmount: recommendedHeart,
      status: getStatus(heartAmount, recommendedHeart),
    },
    {
      category: '심장 진단비',
      name: '급성심근경색증 진단비',
      currentAmount: Math.round(heartAmount * 0.7 / 1000000) * 1000000,
      recommendedAmount: 20000000,
      status: getStatus(Math.round(heartAmount * 0.7 / 1000000) * 1000000, 20000000),
    },
    {
      category: '수술비',
      name: '1~2종 수술비',
      currentAmount: premium > 100000 ? 500000 : 300000,
      recommendedAmount: 500000,
      status: premium > 100000 ? '적정' : '부족',
      note: '1회당 지급',
    },
    {
      category: '수술비',
      name: '3~5종 수술비',
      currentAmount: premium > 100000 ? 1000000 : 0,
      recommendedAmount: 1000000,
      status: premium > 100000 ? '적정' : '미가입',
    },
    {
      category: '항암 치료비',
      name: '표적항암약물허가치료비',
      currentAmount: premium > 80000 ? 50000000 : 0,
      recommendedAmount: 50000000,
      status: premium > 80000 ? '적정' : '미가입',
    },
    {
      category: '암 주요치료비',
      name: '암주요치료비',
      currentAmount: premium > 90000 ? 10000000 : 0,
      recommendedAmount: 10000000,
      status: premium > 90000 ? '적정' : '미가입',
    },
    {
      category: '입원 일당',
      name: '입원 일당 (질병)',
      currentAmount: premium > 90000 ? 30000 : 0,
      recommendedAmount: 30000,
      status: premium > 90000 ? '적정' : '미가입',
      note: '1일당 지급',
    },
  ];
}

// 운전자 보험 역산
function estimateDriverCoverage(
  age: number,
  gender: '남성' | '여성',
  premium: number
): CoverageItem[] {
  const base = premium / 15000; // 1만5천원당 기준 단위
  return [
    {
      category: '교통사고',
      name: '교통사고처리지원금 (형사합의)',
      currentAmount: Math.round(base * 30000000 / 1000000) * 1000000,
      recommendedAmount: 30000000,
      status: base >= 1 ? '적정' : '부족',
    },
    {
      category: '교통사고',
      name: '교통사고처리지원금 (대인)',
      currentAmount: Math.round(base * 20000000 / 1000000) * 1000000,
      recommendedAmount: 20000000,
      status: base >= 1 ? '적정' : '부족',
    },
    {
      category: '법률비용',
      name: '변호사 선임 비용',
      currentAmount: premium > 10000 ? 5000000 : 0,
      recommendedAmount: 5000000,
      status: premium > 10000 ? '적정' : '미가입',
    },
    {
      category: '법률비용',
      name: '형사 소송 비용',
      currentAmount: premium > 15000 ? 5000000 : 0,
      recommendedAmount: 5000000,
      status: premium > 15000 ? '적정' : '미가입',
    },
    {
      category: '벌금',
      name: '교통사고 벌금',
      currentAmount: premium > 12000 ? 20000000 : 10000000,
      recommendedAmount: 20000000,
      status: premium > 12000 ? '적정' : '부족',
    },
    {
      category: '면허',
      name: '면허정지 위로금',
      currentAmount: premium > 10000 ? 500000 : 0,
      recommendedAmount: 500000,
      status: premium > 10000 ? '적정' : '미가입',
    },
    {
      category: '면허',
      name: '면허취소 위로금',
      currentAmount: premium > 10000 ? 2000000 : 0,
      recommendedAmount: 2000000,
      status: premium > 10000 ? '적정' : '미가입',
    },
    {
      category: '상해',
      name: '자동차 사고 부상치료비',
      currentAmount: premium > 8000 ? 30000000 : 0,
      recommendedAmount: 30000000,
      status: premium > 8000 ? '적정' : '미가입',
    },
  ];
}

function estimateSilsonCoverage(
  age: number,
  gender: '남성' | '여성',
  premium: number
): CoverageItem[] {
  return [
    {
      category: '실손 의료비',
      name: '질병/상해 입원 의료비 (급여 80%/비급여 70%)',
      currentAmount: 50000000,
      recommendedAmount: 50000000,
      status: '적정',
      note: '4세대 실비 표준'
    },
    {
      category: '실손 의료비',
      name: '질병/상해 통원 의료비 (회당 20만원)',
      currentAmount: 20000000,
      recommendedAmount: 20000000,
      status: '적정',
      note: '외래+처방 종합'
    },
    {
      category: '3대 비급여',
      name: '도수/체외충격파/증식치료 (연 350만원)',
      currentAmount: 3500000,
      recommendedAmount: 3500000,
      status: '적정',
    },
    {
      category: '3대 비급여',
      name: '비급여 주사료 (연 250만원)',
      currentAmount: 2500000,
      recommendedAmount: 2500000,
      status: '적정',
    },
    {
      category: '3대 비급여',
      name: '비급여 MRI/MRA (연 300만원)',
      currentAmount: 3000000,
      recommendedAmount: 3000000,
      status: '적정',
    }
  ];
}

// 원그래프 데이터 생성
function buildDonutData(
  premium: number,
  optimized: number,
  coverages: CoverageItem[]
): { premiumDonut: DonutData[]; coverageScoreDonut: DonutData[]; renewalRatioDonut: DonutData[] } {
  const savings = premium - optimized;
  const savingsRate = Math.round((savings / premium) * 100);

  const adequate = coverages.filter(c => c.status === '적정').length;
  const total = coverages.length;
  const scoreRate = Math.round((adequate / total) * 100);

  return {
    premiumDonut: [
      { label: '절감 예상액', value: savingsRate, color: '#3B82F6', subLabel: `월 ${savings.toLocaleString()}원` },
      { label: '최적화 보험료', value: 100 - savingsRate, color: '#E2E8F0', subLabel: `월 ${optimized.toLocaleString()}원` },
    ],
    coverageScoreDonut: [
      { label: '보장 충족', value: scoreRate, color: '#10B981', subLabel: `${scoreRate}점` },
      { label: '보강 필요', value: 100 - scoreRate, color: '#FCA5A5', subLabel: `${100 - scoreRate}점 부족` },
    ],
    renewalRatioDonut: [
      { label: '비갱신형', value: 65, color: '#6366F1', subLabel: '65%' },
      { label: '갱신형', value: 35, color: '#E5E7EB', subLabel: '35%' },
    ],
  };
}

// ============================================================
// 메인 추정 함수 - 나이 + 성별 + 월보험료 + 종목 → EstimatedProfile
// ============================================================
export function estimateProfile(
  age: number,
  gender: '남성' | '여성',
  monthlyPremium: number,
  category: InsuranceCategory
): EstimatedProfile {
  let estimatedCoverages: CoverageItem[] = [];

  switch (category) {
    case 'cancer':
      estimatedCoverages = estimateCancerCoverage(age, gender, monthlyPremium);
      break;
    case 'driver':
      estimatedCoverages = estimateDriverCoverage(age, gender, monthlyPremium);
      break;
    case 'silson':
      estimatedCoverages = estimateSilsonCoverage(age, gender, monthlyPremium);
      break;
    default:
      estimatedCoverages = estimateCancerCoverage(age, gender, monthlyPremium);
  }

  // 35개사 비갱신 20년납 최저가 조합 계산 (암보험 기준: 3만원대)
  let optimizedPremium = 38000;
  if (category === 'cancer') {
    if (age < 40) {
      optimizedPremium = gender === '남성' ? 35000 : 29000;
    } else if (age < 50) {
      optimizedPremium = gender === '남성' ? 42000 : 36000;
    } else if (age < 60) {
      optimizedPremium = gender === '남성' ? 58000 : 48000;
    } else {
      optimizedPremium = gender === '남성' ? 78000 : 65000;
    }
  } else if (category === 'silson') {
    if (age < 40) {
      optimizedPremium = gender === '남성' ? 14000 : 12000;
    } else if (age < 50) {
      optimizedPremium = gender === '남성' ? 19000 : 16000;
    } else {
      optimizedPremium = gender === '남성' ? 28000 : 24000;
    }
  } else {
    const discountRate = age < 40 ? 0.55 : age < 50 ? 0.60 : 0.50;
    optimizedPremium = Math.round((monthlyPremium * (1 - discountRate)) / 1000) * 1000;
  }

  const monthlySavings = Math.max(0, monthlyPremium - optimizedPremium);
  const totalSavings20yr = monthlySavings * 12 * 20;

  const { premiumDonut, coverageScoreDonut, renewalRatioDonut } = buildDonutData(
    monthlyPremium,
    optimizedPremium,
    estimatedCoverages
  );

  const adequate = estimatedCoverages.filter(c => c.status === '적정').length;
  const overallScore = Math.round((adequate / estimatedCoverages.length) * 100);

  return {
    ageGroup: parseAgeGroup(age),
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
      efficiency: Math.min(100, Math.round((monthlySavings / monthlyPremium) * 200)),
      coverage: overallScore,
      nonRenewal: 65,
      diagnosis: Math.min(100, Math.round((adequate / estimatedCoverages.filter(c => c.category.includes('진단비')).length || 1) * 100)),
      surgery: estimatedCoverages.some(c => c.category === '수술비' && c.status === '적정') ? 80 : 40,
      injury: 60,
    },
  };
}
