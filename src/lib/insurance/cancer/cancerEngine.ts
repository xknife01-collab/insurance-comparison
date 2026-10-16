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

  const isRenewable = (analysis as any).cancer?.paymentType === 'renewable';

  const diet: RecommendationPlan = {
    title: '실속 암진단 집중 플랜',
    description: '20년 납입 완료 후 90세까지 보장받는 핵심 암 진단비 중심의 가성비 우수 플랜입니다.',
    productName: opt1.productName,
    companyName: opt1.companyName,
    estimatedPremium: Math.round(opt1.premium / 10) * 10,
    periodBadge: '20년납 · 90세만기 (비갱신형)',
    coverageChanges: [
      '일반암 진단비 집중 확보',
      '비유사암 전이 시 보장 강화',
      '실속형 요율 설계'
    ],
    switchingLossNotice: '기존 보험 해지 후 재가입 시 조건 및 연령에 따라 제한이 생길 수 있습니다.'
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
  if (currentDiagnosis < 30000000) deficiencies.push('일반암 진단비 보완 권장');

  if (isBrainDeficient) deficiencies.push('뇌혈관 질환 보장 보완 권장');
  if (isHeartDeficient) deficiencies.push('심혈관 질환 보장 보완 권장');
  if (isSurgeryDeficient) deficiencies.push('질병/상해 수술비 보완 권장');
  if (isAftereffectDeficient) deficiencies.push('질병후유장해 보장 점검 권장');

  if (deficiencies.length === 0) {
    deficiencies.push('보완할 점이 거의 없는 균형 잡힌 설계');
  }

  let totalScore = 95;
  totalScore -= (deficiencies.filter(d => d !== '보완할 점이 거의 없는 균형 잡힌 설계').length * 4);
  
  if (hasTreatment2025) totalScore += 3;
  if (hasTargeted) totalScore += 2;

  if (hasFamilyHistory) {
    if (currentDiagnosis < 70000000) {
      if (!deficiencies.includes('가족력 대비 진단비 보완 권장')) {
        deficiencies.unshift('가족력 대비 진단비 보완 권장');
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
    scores: {
      totalScore: Math.min(100, Math.max(0, totalScore)),
      cancerScore: Math.min(100, Math.max(0, totalScore)),
      cerebrovascularScore: 70,
      cardiovascularScore: 70
    },
    recommendations: {
      diet,
      upgrade: {
        title: '2025 암주요치료비 결합 플랜',
        description: `암 진단비와 함께 치료비 부담을 덜어주는 '암 주요 치료비' 특약을 결합한 20년납 비갱신형 플랜입니다.`,
        productName: opt2.productName,
        companyName: opt2.companyName,
        estimatedPremium: Math.round(opt2.premium / 10) * 10,
        periodBadge: '20년납 · 90세만기 (비갱신형)',
        coverageChanges: ['암 주요 치료비(비급여) 포함', '표적항암제 한도 상향', '뇌/심장 2대 질환 복합 보장'],
        switchingLossNotice: '기존 암보험 해지 후 재가입 시 감액 기간이 적용될 수 있습니다.',
      },
      hybrid: {
        title: isRenewable 
          ? '초기 저렴한 갱신형 실속 플랜'
          : '비갱신 든든 만기보장 프리미엄 플랜',
        periodBadge: isRenewable 
          ? '10년 갱신형 (전기납)' 
          : '20년납 · 90세/100세만기 (비갱신형)',
        description: isRenewable
          ? '초기 비용 부담을 줄인 갱신형 플랜입니다. 경제적인 보험료로 넓은 보장을 준비할 수 있습니다.'
          : (hasFamilyHistory 
              ? '가족력이 있으신 고객님을 위해 20년 납입으로 재발암/전이암까지 만기까지 든든하게 보장하는 VIP 집중 플랜입니다.'
              : '20년 납입 완료 후 약정 만기까지 보험료 인상 없이 안정적으로 보장받는 종합 암보험 플랜입니다.'),
        productName: opt3.productName,
        companyName: opt3.companyName,
        estimatedPremium: Math.round(opt3.premium / 10) * 10,
        coverageChanges: isRenewable
          ? ['초기 보험료 알뜰 구성', '유연한 보장 설계 가능', '최신 치료비 풀세트 탑재']
          : ['비갱신형 고정 보험료', '재발암/전이암 반복 지급', '건강관리 서비스 연계'],
        switchingLossNotice: isRenewable
          ? '보험료 인상 가능성이 있는 갱신형 상품의 경우 장기 보험료를 반드시 확인하세요.'
          : '비갱신 무해지환급형 상품으로, 납입 기간(20년) 중도 해지 시 해지환급금이 없거나 적을 수 있습니다.',
      }
    }
  };
};
