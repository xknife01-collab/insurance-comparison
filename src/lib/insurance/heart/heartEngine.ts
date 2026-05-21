import { InsuranceAnalysis } from '../../../types/insurance';

export const analyzeHeart = (analysis: any) => {
  const basePrice = analysis._realDbPremium || 35000;
  const allOptions = analysis._allOptions || [];
  
  // 회사 중복 방지 로직
  const usedCompanies = new Set<string>();
  const getUniqueOption = (searchIndices: number[]) => {
    for (const idx of searchIndices) {
      const candidate = allOptions[idx];
      if (candidate && !usedCompanies.has(candidate.companyName)) {
        usedCompanies.add(candidate.companyName);
        return candidate;
      }
    }
    const fallback = allOptions.find((o: any) => !usedCompanies.has(o.companyName));
    if (fallback) {
      usedCompanies.add(fallback.companyName);
      return fallback;
    }
    return allOptions[searchIndices[0]] || { premium: basePrice, productName: '추천 상품', companyName: '-' };
  };

  const dietOption = getUniqueOption([0, 1, 2]);
  const hybridOption = getUniqueOption([1, 2, 3]);
  const upgradeOption = getUniqueOption([3, 4, 5]);

  const coverageLevel = analysis.heartCoverageLevel || 'standard';
  
  const coverageType = analysis.cardiovascular?.selectedType || '통합(급성+허혈성)';
  
  // 심장질환 점수 계산 (보장 범위 가중치 적용)
  const rawHeartAmount = analysis.cardiovascular?.currentAmount || 0;
  // 급성만 선택 시 보장 가중치 0.3 적용 (범위가 좁으므로)
  const weight = coverageType.includes('급성') && !coverageType.includes('통합') ? 0.3 : 1.0;
  const effectiveHeartAmount = rawHeartAmount * weight;
  
  const targetAmount = 30000000;
  const heartScore = Math.min(100, (effectiveHeartAmount / targetAmount) * 100);

  return {
    efficiency: heartScore > 80 ? 90 : 65,
    deficiencies: heartScore < 40 ? ['심혈관 보장 범위 확대 필요', '급성 심근경색 외 담보 부족'] : heartScore < 80 ? ['허혈성 진단비 보강 권고'] : [],
    scores: {
      heartScore,
      totalScore: heartScore,
      cancerScore: 70,
      cerebrovascularScore: 70,
      cardiovascularScore: heartScore,
    },
    recommendations: {
      diet: {
        title: '보험료 절감형 실속 플랜',
        description: '보장 범위는 협심증 등 핵심 위주로 구성하고, 보험료를 최대로 낮춘 가성비 플랜입니다.',
        estimatedPremium: dietOption.premium,
        productName: dietOption.productName,
        companyName: dietOption.companyName,
        coverageChanges: ['허혈성심장질환 진단비 중심', '무해지환급형 적용'],
        switchingLossNotice: '기존 심장 보험 해지 시 재가입 심사에서 불이익이 생길 수 있습니다.',
      },
      upgrade: {
        title: '심혈관 풀커버 고급 플랜',
        description: '부정맥, 심부전은 물론 스텐트 삽입술까지 심장의 모든 위험을 완벽하게 방어하는 프리미엄 플랜입니다.',
        estimatedPremium: upgradeOption.premium,
        productName: upgradeOption.productName,
        companyName: upgradeOption.companyName,
        coverageChanges: ['부정맥(I47-I49) 진단비 추가', '심장판막/조율기 수술비 포함'],
        switchingLossNotice: '급성심근경색 진단 이력이 있으면 신규 가입이 제한될 수 있습니다.',
      },
      hybrid: {
        title: '밸런스형 표준 포트폴리오',
        description: '가장 발병률이 높은 질환들을 합리적인 가격대에 맞춘 표준형 추천 플랜입니다.',
        estimatedPremium: hybridOption.premium,
        productName: hybridOption.productName,
        companyName: hybridOption.companyName,
        coverageChanges: ['진단비 2천 + 수술비 1천 구성', '비갱신형 안정적 복합형'],
        switchingLossNotice: '비갱신형 전환 시 초기 보험료가 높을 수 있으니 장기 계획 수립이 필요합니다.',
      }
    }
  };
};
