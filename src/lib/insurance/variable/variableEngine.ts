import { RecommendationPlan } from '../../../types/insurance';

/**
 * 변액 및 정기보험 분석 엔진
 * 적립식 투자(변액 적립/연금)와 정기적 보호(정기 사망 보장)를 구분하여
 * 진단 지수, 보장 공백, 복리 투자 시뮬레이션 및 종신 대비 다이어트 교체 플랜을 제공합니다.
 */
export const analyzeVariable = (analysis: any): any => {
  const options = (analysis._allOptions || []).map((o: any) => ({
    ...o,
    riskPremium: o.riskPremium || 8000,
    savingsPremium: o.savingsPremium || 92000,
    estimatedPremium: o.premium || 100000
  })) || [];

  const defaultOption = {
    premium: analysis._realDbPremium || 150000,
    riskPremium: 10000,
    savingsPremium: 140000,
    productName: analysis._productName || 'e변액적립보험 무배당 (투자형)',
    companyName: analysis._companyName || '메트라이프생명'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[2] || options[1] || options[0] || defaultOption;

  const varOpts = analysis.variable || {
    subType: analysis.selectedDetail === 1 ? 'term' : 'investment',
    monthlyPremium: 150000,
    paymentPeriod: 10,
    investmentStyle: 'balanced',
    equityRatio: 50,
    isAnnuityConversion: false,
    deathBenefit: 100000000,
    coveragePeriod: 70, // 만 70세 만기
    isHealthyDiscount: false
  };

  const subType = varOpts.subType || (analysis.selectedDetail === 1 ? 'term' : 'investment');
  const monthlyPremium = varOpts.monthlyPremium || 150000;
  const paymentPeriod = varOpts.paymentPeriod || 10;
  const investmentStyle = varOpts.investmentStyle || 'balanced';
  const equityRatio = varOpts.equityRatio !== undefined ? varOpts.equityRatio : 50;
  const isAnnuityConversion = !!varOpts.isAnnuityConversion;

  const deathBenefit = varOpts.deathBenefit || 100000000;
  const coveragePeriod = varOpts.coveragePeriod || 70;
  const isHealthyDiscount = !!varOpts.isHealthyDiscount;

  let score1 = 90; // 투자 효율성 또는 사망보장 적정성
  let score2 = 85; // 사업비/수수료 또는 납입 구조
  let score3 = 80; // 위험 관리 또는 가치 보존
  let efficiency = 85;
  const deficiencies: string[] = [];

  if (subType === 'investment') {
    // -------------------------------------------------------------
    // 1. 변액 적립식 투자 분석
    // -------------------------------------------------------------

    // 1-1. 투자 스타일과 주식 비중 매칭도 평가 (score1)
    if (investmentStyle === 'aggressive') {
      if (equityRatio >= 70) {
        score1 = 98; // 공격적 성향에 맞게 주식 비중을 잘 가져감
      } else if (equityRatio >= 40) {
        score1 = 80; // 다소 보수적
      } else {
        score1 = 55; // 투자 스타일 대비 지나치게 낮은 주식 비중 (수익 극대화에 걸림돌)
        deficiencies.push('공격형 성향 대비 지나치게 낮은 주식 비중 설정 (인플레이션 헤지 및 수익 효율성 저하)');
      }
    } else if (investmentStyle === 'balanced') {
      if (equityRatio >= 40 && equityRatio <= 70) {
        score1 = 95;
      } else {
        score1 = 82;
      }
    } else { // conservative
      if (equityRatio <= 30) {
        score1 = 96;
      } else {
        score1 = 65; // 안정형인데 주식 비중이 높아 원금 변동 리스크 상존
        deficiencies.push('안정형 성향 대비 과도한 주식형 펀드 비율 설정 (시장 급변 시 중도해지 원금 손실 리스크 증가)');
      }
    }

    // 1-2. 사업비 차감 비율 및 납입 기간 점수 (score2)
    // 변액보험은 장기 납입 및 유지가 필수 (최소 10년)
    if (paymentPeriod < 10) {
      score2 = 60;
      deficiencies.push('장기 복리 효과 한계 (변액보험은 초기 사업비 차감 효과가 커서 10년 이상 납입 및 유지가 유리)');
    } else {
      score2 = 94;
    }

    // 1-3. 연금 전환 및 특약 세팅 구조 (score3)
    if (isAnnuityConversion) {
      score3 = 95; // 연금전환으로 비과세 노후연금 연계 세팅 양호
    } else {
      score3 = 80; // 연금전환 미선택으로 단순 거치식 만기 자금으로만 제한됨
    }

    const totalScore = Math.round((score1 + score2 + score3) / 3);
    efficiency = Math.round(Math.min(99.9, Math.max(30, (totalScore / 100) * 80 + (equityRatio / 5))));

    // -------------------------------------------------------------
    // 추천 플랜 (투자형)
    // -------------------------------------------------------------
    // Diet: 다이렉트 변액 적립 (사업비 최소화 플랜 - 월 15만원 세팅)
    const dietPremium = 150000;
    const diet: RecommendationPlan = {
      title: `[${opt1.companyName}] 온라인 다이렉트 변액적립 플랜`,
      description: `오프라인 설계사 채널 대비 사업비(수수료)를 약 35% 절감하여, 매월 더 많은 원금이 펀드에 자동 투자되는 실속형 적립식 플랜입니다.`,
      estimatedPremium: dietPremium,
      companyName: opt1.companyName,
      productName: opt1.productName,
      coverageChanges: [
        `사업비 업계 최저 수준 (3.5%대 적용으로 원금 회복 가속)`,
        `주식형 채권형 펀드 전환 연 12회 수수료 무료`,
        `10년 유지 시 투자 이익 전액 비과세 혜택`
      ],
      switchingLossNotice: '가입 초기 3년 내 해지 시에는 투자 수익률과 상관없이 원금 대비 손실이 발생할 수 있습니다.',
      isFire: false
    } as any;

    // Upgrade: 글로벌 자산배분 플랜 (월 50만원 세팅, ETF/글로벌 펀드 결합)
    const upgradePremium = 500000;
    const upgrade: RecommendationPlan = {
      title: `[${opt2.companyName}] 글로벌 자산배분 인공지능 매칭 플랜`,
      description: `미국 주식 및 글로벌 우량 자산 투입 비중을 70%로 높여 인플레이션을 완벽하게 상회하는 수익형 연금 자산 마련 플랜입니다.`,
      estimatedPremium: upgradePremium,
      companyName: opt2.companyName,
      productName: opt2.productName,
      coverageChanges: [
        `글로벌 주식/ETF 펀드 매치율 70% 세팅`,
        `AI 자동 펀드 리밸런싱 옵션 제공 (시장 급변 시 채권형 자동 전환)`,
        `연 1회 이상 중도인출 및 추가납입 기능으로 유동성 확보`
      ],
      switchingLossNotice: '실적 배당형 상품으로 원금 보호 대상이 아니며, 주식 시장 폭락 시 환급금이 대폭 줄어들 수 있습니다.',
      isFire: false
    } as any;

    // Hybrid: 최저보증형 변액 연금 (월 30만원 세팅, 원금 115%~130% 최저 보증)
    const hybridPremium = 300000;
    const hybrid: RecommendationPlan = {
      title: `[${opt3.companyName}] 최저보증형 수익 안심 플랜`,
      description: `투자 성과가 나빠도 연금 개시 시점에 납입 원금의 100%~120% 수준을 최저 보증(GMAB)하여, 투자 수익과 안전판을 동시에 챙기는 연금 최강자 플랜입니다.`,
      estimatedPremium: hybridPremium,
      companyName: opt3.companyName,
      productName: opt3.productName,
      coverageChanges: [
        `투자 이익 발생 시 실적 배당 환급률 적용`,
        `마이너스 수익률 발생 시에도 연금 개시 시 납입 원금 100% 보증`,
        `사망 시 가입 시점 사망보험금 최저 보증 (GMDB 적용)`
      ],
      switchingLossNotice: '최저 보증을 위한 비용(연 약 0.5%~0.8%)이 특별 계정에서 매월 차감되므로, 순수 변액적립보험 대비 기대 수익률은 약간 제한됩니다.',
      isFire: false
    } as any;

    return {
      estimatedPremium: upgradePremium,
      efficiency,
      deficiencies,
      scores: {
        cancerScore: score1,
        cerebrovascularScore: score2,
        cardiovascularScore: score3,
        totalScore
      },
      recommendations: {
        diet,
        upgrade,
        hybrid
      }
    };

  } else {
    // -------------------------------------------------------------
    // 2. 정기 사망 보장 분석 (Term Life)
    // -------------------------------------------------------------

    // 2-1. 사망 보장 금액 적절성 (score1)
    if (deathBenefit < 50000000) {
      score1 = 50;
      deficiencies.push('경제활동기 가족 생활비 대비 과소한 사망보장 금액 (최소 1억 원 수준의 안전자산 세팅 권장)');
    } else if (deathBenefit < 100000000) {
      score1 = 80;
    } else {
      score1 = 98;
    }

    // 2-2. 보장 기간 및 납입 기간 효율성 (score2)
    // 자녀가 경제적 자립을 마칠 때(만 60세~70세)까지만 보호하면 충분함. 너무 긴 보장(80세 만기)은 보험료 과도.
    if (coveragePeriod >= 80) {
      score2 = 70;
      deficiencies.push('과도하게 긴 보장 만기 설정 (정기보험은 자녀 독립기인 만 60~70세로 한정하여 보험료를 아끼는 것이 합리적)');
    } else {
      score2 = 95;
    }

    // 2-3. 우량체 할인 적용 여부 (score3)
    if (isHealthyDiscount) {
      score3 = 98;
    } else {
      score3 = 75;
      deficiencies.push('우량체 할인 미적용 (비흡연 + 혈압/BMI 정상 기준 만족 시 최대 15%~20% 보험료 즉시 절감 혜택 적용 가능)');
    }

    const totalScore = Math.round((score1 + score2 + score3) / 3);
    efficiency = Math.round(Math.min(99.9, Math.max(30, (totalScore / 100) * 85 + (isHealthyDiscount ? 15 : 0))));

    // -------------------------------------------------------------
    // 추천 플랜 (보장형 / 정기보험)
    // -------------------------------------------------------------
     // Diet: 가성비 실속 정기보험 (사망 1억, 60세 만기, 우량체 할인 결합)
    const dietPremium = opt1.premium;
    const diet: RecommendationPlan = {
      title: `[${opt1.companyName}] 초가성비 실속 정기 플랜`,
      description: `종신보험 대비 보험료를 85% 이상 다이어트! 자녀 독립 시점인 60세까지 핵심 사망 1억 원을 완벽히 보호하는 초실속 플랜입니다.`,
      estimatedPremium: dietPremium,
      companyName: opt1.companyName,
      productName: opt1.productName,
      coverageChanges: [
        `사망 보장금 1억 원 확보 (경제 활동기 집중 케어)`,
        `종신보험 대비 매월 평균 150,000원 이상의 지출 다이어트`,
        `우량체 할인 선반영으로 월 보험료 ${dietPremium.toLocaleString()}원 실현`
      ],
      switchingLossNotice: '순수 보장형 상품이므로 보장 기간 만기 시 해약환급금은 0원이 됩니다.',
      isFire: false
    } as any;

    // Upgrade: 프리미엄 가장 보호 플랜 (사망 3억, 70세 만기)
    const upgradePremium = opt2.premium;
    const upgrade: RecommendationPlan = {
      title: `[${opt2.companyName}] 든든 유가족 자산 보존 플랜`,
      description: `사망 보장 한도를 3억 원으로 증액하여, 가장 부재 시 상속세 세원 확보 및 유가족이 최소 5년간 안정적인 품격을 유지할 수 있는 프리미엄 세팅입니다.`,
      estimatedPremium: upgradePremium,
      companyName: opt2.companyName,
      productName: opt2.productName,
      coverageChanges: [
        `사망 보장 3억 원 세팅 (상속 및 안심 생활자금)`,
        `만기 70세 보장으로 대학 등록금 및 자녀 자립 시점까지 커버`,
        `비흡연 우량체 특별 추가 할인율 적용`
      ],
      switchingLossNotice: '비우량체(흡연 또는 혈압 기준 초과) 판정 시 표준 요율이 적용되어 안내된 보험료보다 10~15% 상승할 수 있습니다.',
      isFire: false
    } as any;

    // Hybrid: 정기/종신 결합 믹스 매치 플랜 (정기 2억 + 종신 5천만원 결합)
    const hybridPremium = opt3.premium;
    const hybrid: RecommendationPlan = {
      title: `[${opt3.companyName}] 정기 + 종신 믹스 매치 결합 플랜`,
      description: `평생 상속 자산(종신보험 5천만 원)과 경제활동기 집중 사망 자산(정기보험 2억 원)을 결합하여, 보장 공백은 차단하고 전체 지출 포트폴리오를 슬림하게 완성한 똑똑한 결합안입니다.`,
      estimatedPremium: hybridPremium,
      companyName: opt3.companyName,
      productName: opt3.productName,
      coverageChanges: [
        `자녀 독립 전 사망 보장 총 2억 5,000만 원 확보`,
        `자녀 독립 후에도 평생 사망 장례금 및 기본 상속세 세원 5,000만 원 영구 유지`,
        `단일 종신보험 가입 대비 보험료 효율성 58% 개선`
      ],
      switchingLossNotice: '두 개의 계약을 동시 관리하므로, 각각의 납입 만기 및 청구 프로세스를 확인해 두어야 합니다.',
      isFire: false
    } as any;

    return {
      estimatedPremium: upgradePremium,
      efficiency,
      deficiencies,
      scores: {
        cancerScore: score1,
        cerebrovascularScore: score2,
        cardiovascularScore: score3,
        totalScore
      },
      recommendations: {
        diet,
        upgrade,
        hybrid
      }
    };
  }
};
