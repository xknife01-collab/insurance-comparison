import { AnalysisResult } from '../../../types/insurance';
import { RecommendationPlan } from '../../../types/insurance/common';

/**
 * 암 보험 분석 엔진
 * 사용자 가입 정보와 DB에서 추출된 최적의 플랜들을 비교 분석하여
 * 실속(Diet), 보장강화(Upgrade), 프리미엄(Hybrid) 세 가지 제안을 생성합니다.
 */
export const analyzeCancer = (analysis: any): any => {
  const options = analysis._allOptions || [];
  
  // DB 데이터 부재 시 기본값
  const defaultOption = { 
    premium: analysis._realDbPremium || 45000, 
    productName: analysis._productName || '가성비 암보험',
    companyName: analysis._companyName || '추천 보험사'
  };

  const opt1 = options[0] || defaultOption;
  const opt2 = options[1] || options[0] || defaultOption;
  const opt3 = options[options.length - 1] || options[1] || options[0] || defaultOption;

  const diet: RecommendationPlan = {
    title: `[${opt1.companyName}] 실속 암진단 집중 플랜`,
    description: `불필요한 사망 보장을 최소화하고 ${opt1.productName}의 핵심 암 진단비만 골라 담은 가성비 1등 플랜입니다.`,
    productName: opt1.productName,
    companyName: opt1.companyName,
    estimatedPremium: Math.round(opt1.premium / 10) * 10,
    coverageChanges: [
      '일반암 진단비 최대 확보',
      '비유사암 전이 시 보장 강화',
      '업계 최저 수준 보험료'
    ]
  };

  const hasFamilyHistory = (analysis as any).cancer?.familyHistory === true;
  const currentDiagnosis = (analysis as any).cancer?.currentAmount || 0;
  const hasTreatment2025 = (analysis as any).cancer?.treatmentCost2025 === true;
  const hasTargeted = (analysis as any).cancer?.targetedTherapy === true;

  const healthStatus = (analysis as any).health || {};
  const isBrainDeficient = healthStatus.cerebrovascular === '부족';
  const isHeartDeficient = healthStatus.cardiovascular === '부족';
  const isSurgeryDeficient = healthStatus.surgery === '부족';
  const isAftereffectDeficient = healthStatus.aftereffect === '부족';
  
  const deficiencies = [];
  
  if (!hasTreatment2025) deficiencies.push('최신 암주요치료비 미가입');
  if (!hasTargeted) deficiencies.push('중입자/표적항암 치료비 공백');
  if (currentDiagnosis < 30000000) deficiencies.push('일반암 진단비 부족');

  if (isBrainDeficient) deficiencies.push('뇌혈관 질환 보장 부족');
  if (isHeartDeficient) deficiencies.push('심혈관 질환 보장 부족');
  if (isSurgeryDeficient) deficiencies.push('질병/상해 수술비 부족');
  if (isAftereffectDeficient) deficiencies.push('질병후유장해 보장 부족');

  if (deficiencies.length === 0) {
    deficiencies.push('보완할 점이 거의 없는 완벽한 설계');
  }

  let totalScore = 95;
  totalScore -= (deficiencies.filter(d => d !== '보완할 점이 거의 없는 완벽한 설계').length * 4);
  
  if (hasTreatment2025) totalScore += 3;
  if (hasTargeted) totalScore += 2;

  if (hasFamilyHistory) {
    if (currentDiagnosis < 70000000) {
      if (!deficiencies.includes('가족력 대비 진단비 매우 부족')) {
        deficiencies.unshift('가족력 대비 진단비 매우 부족');
      }
      totalScore -= 10;
    } else {
      totalScore += 5;
    }
  }

  totalScore = Math.max(0, Math.min(100, totalScore));

  return {
    estimatedPremium: Math.round(opt1.premium / 10) * 10,
    efficiency: (hasFamilyHistory && currentDiagnosis < 50000000) ? 75 : 98,
    deficiencies,
    scores: { totalScore: Math.min(100, Math.max(0, totalScore)) },
    recommendations: {
      diet,
      upgrade: {
        title: `[${opt2.companyName}] 2025 암주요치료비 결합 플랜`,
        description: `진단비는 물론, 연간 최대 1억 원까지 지급되는 ${opt2.companyName}의 '암 주요 치료비' 특약이 포함된 최신 트렌드 플랜입니다.`,
        productName: opt2.productName,
        companyName: opt2.companyName,
        estimatedPremium: Math.round(opt2.premium / 10) * 10,
        coverageChanges: ['암 주요 치료비(비급여) 포함', '표적항암제 한도 상향', '뇌/심장 2대 질환 복합 보장'],
        switchingLossNotice: '기존 암보험 해지 후 재가입 시 감액 기간이 적용될 수 있습니다.',
      },
      hybrid: {
        title: (analysis as any).cancer?.paymentType === 'renewable' 
          ? `[${opt3.companyName}] 초기 저렴한 갱신형 실속 플랜`
          : `[${opt3.companyName}] 평생 보장 비갱신 프리미엄`,
        description: (analysis as any).cancer?.paymentType === 'renewable'
          ? `초기 비용 부담을 획기적으로 줄인 ${opt3.companyName}의 갱신형 플랜입니다. 경제적인 보험료로 넓은 보장을 준비할 수 있습니다.`
          : (hasFamilyHistory 
              ? `가족력이 있으신 고객님께 꼭 필요한 ${opt3.companyName}의 VIP 집중 보장 플랜입니다. 반복되는 재발암까지 완벽하게 보장합니다.`
              : `보험료 인상 걱정 없이 100세까지 든든하게 보장받는 ${opt3.companyName}의 명품 암보험입니다.`),
        productName: opt3.productName,
        companyName: opt3.companyName,
        estimatedPremium: Math.round(opt3.premium / 10) * 10,
        coverageChanges: (analysis as any).cancer?.paymentType === 'renewable'
          ? ['초기 보험료 매우 저렴', '유연한 보장 설계 가능', '최신 치료비 풀세트 탑재']
          : ['비갱신형 고정 보험료', '재발암/전이암 반복 지급', 'VIP 건강검진 서비스 연계'],
        switchingLossNotice: '보험료 인상 가능성이 있는 갱신형 상품의 경우 장기 보험료를 반드시 확인하세요.',
      }
    }
  };
};
