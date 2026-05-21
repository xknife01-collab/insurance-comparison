import { HealthAnalysis, HealthAnalysisResult } from '../../types/insurance/health';
import { RecommendationPlan } from '../../types/insurance/common';

const TARGET_COVERAGE = {
  cancer: 50000000,
  cerebrovascular: 30000000,
  cardiovascular: 30000000
};

export const analyzeHealth = (analysis: HealthAnalysis): HealthAnalysisResult => {
  const categoryStr = (analysis as any).selectedCategory || '';
  const isSilson = categoryStr.includes('실손') || categoryStr.includes('실비');
  const isSurgery = categoryStr.includes('수술') || categoryStr.includes('입원');
  const dbPremium = (analysis as any)._realDbPremium;
  
  // 만약 DB 프리미엄이 있으면 그것을 기준점으로 사용합니다.
  const basePrice = dbPremium || analysis.monthlyPremium;

  const cancerScore = Math.min(100, (analysis.cancer.currentAmount / TARGET_COVERAGE.cancer) * 100);
  const cerebrovascularScore = Math.min(100, (analysis.cerebrovascular.currentAmount / TARGET_COVERAGE.cerebrovascular) * 100);
  const cardiovascularScore = Math.min(100, (analysis.cardiovascular.currentAmount / TARGET_COVERAGE.cardiovascular) * 100);

  const totalScore = (cancerScore + cerebrovascularScore + cardiovascularScore) / 3;

  const deficiencies: string[] = [];
  if (cancerScore < 80) deficiencies.push('일반암 진단비');
  if (cerebrovascularScore < 80) deficiencies.push('뇌혈관질환 진단비');
  if (cardiovascularScore < 80) deficiencies.push('허혈성심장질환 진단비');

  // DB에서 조회된 모든 옵션들 (실제 상품 리스트)
  const allOptions = (analysis as any)._allOptions || [];
  
  // [핵심] 여러 보험사의 상품을 골고루 보여주기 위한 로직 (회사 중복 절대 금지)
  const usedCompanies = new Set<string>();
  
  const getUniqueOption = (searchIndices: number[]) => {
    // 1. 아직 사용되지 않은 보험사 중 가장 적절한 인덱스를 찾음
    for (const idx of searchIndices) {
      const candidate = allOptions[idx];
      if (candidate && !usedCompanies.has(candidate.companyName)) {
        usedCompanies.add(candidate.companyName);
        return candidate;
      }
    }
    // 2. 만약 해당 인덱스 범위에 유니크한 회사가 없으면 전체 리스트에서 찾음
    const fallback = allOptions.find(o => !usedCompanies.has(o.companyName));
    if (fallback) {
      usedCompanies.add(fallback.companyName);
      return fallback;
    }
    // 3. 진짜 없으면 그냥 순서대로
    return allOptions[searchIndices[0]] || { premium: basePrice, productName: 'DB 조회 데이터 없음', companyName: '-' };
  };

  // 다이어트형은 저렴한 쪽(상위권), 업그레이드형은 중간/고가형(중위권), 복합형은 가성비형
  const dietOption = getUniqueOption([0, 1, 2]);
  const hybridOption = getUniqueOption([1, 2, 3]);
  const upgradeOption = getUniqueOption([2, 3, 4, 10]); // 업그레이드형은 뒤쪽(보험료 높은 대형사)에서도 후보를 찾음

  return {
    scores: {
      cancerScore,
      cerebrovascularScore,
      cardiovascularScore,
      totalScore
    },
    efficiency: totalScore / (basePrice / 1000),
    deficiencies,
    recommendations: {
      diet: {
        title: isSilson ? '4세대 실손 전환 프로젝트' : '보장 유지 다이어트형',
        description: isSilson ? '기존 실손을 4세대로 전환하여 보험료를 최대 70% 절약하는 플랜입니다.' : '현재 보장은 유지하면서 보험료만 낮출 수 있는 실속 플랜입니다.',
        estimatedPremium: dietOption.premium,
        productName: dietOption.productName,
        companyName: dietOption.companyName,
        coverageChanges: isSilson ? ['자기부담금 상향(20~30%)', '비급여 차등제 적용'] : 
                         isSurgery ? ['동일 담보 금액 유지', '저해지 환급형 전환'] : ['동일 보장 금액 유지', '무해지 환급형 적용'],
        switchingLossNotice: '기존 보험 해약 시 손실이 발생할 수 있습니다.'
      },
      upgrade: {
        title: isSilson ? '가성비 실손 보완형' : '가성비 보장 업그레이드형',
        description: isSilson ? '실손과 함께 암/뇌/심 진단비를 밸런스 있게 보완하여 완벽하게 방어하는 플랜입니다.' : '현재 보험료와 비슷한 가격대로 부족한 진단비를 평균 수준 이상으로 올리는 플랜입니다.',
        estimatedPremium: upgradeOption.premium,
        productName: upgradeOption.productName,
        companyName: upgradeOption.companyName,
        coverageChanges: isSilson ? ['실손 포함 종합 보장 구성', '부족한 진단비 추가'] : 
                         isSurgery ? ['N대 질병 수술비 상향', '1-5종 수술비 중점 보강'] : [
          `암 진단비 ${TARGET_COVERAGE.cancer / 10000}만 원으로 상향`,
          `뇌/심장 진단비 각 ${TARGET_COVERAGE.cerebrovascular / 10000}만 원 확보`
        ],
        switchingLossNotice: '보장 성격과 면책 기간이 달라질 수 있습니다.'
      },
      hybrid: {
        title: isSilson ? '착한 실손 단독 유지' : '최적 포트폴리오 복합형',
        description: isSilson ? '불필요한 특약을 걷어내고 보험사 중 가장 저렴한 실손만 단독으로 유지하는 플랜입니다.' : '기존 보험 중 비싼 특약만 정리하고 부족한 부분은 신규 담보로 보충합니다.',
        estimatedPremium: hybridOption.premium,
        productName: hybridOption.productName,
        companyName: hybridOption.companyName,
        coverageChanges: isSilson ? ['최저가 실손 보험사 매칭', '표준 보장 범위 유지'] : 
                         isSurgery ? ['종합병원 입원일당 강화', '질병 수술비 그룹 재편'] : ['가성비 나쁜 특약 정리', '핵심 보장 위주 구성'],
        switchingLossNotice: '특약 삭제 시 점수가 변동될 수 있습니다.'
      }
    }
  };
};
