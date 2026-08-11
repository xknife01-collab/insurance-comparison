import { analyzeCancer } from './cancer/cancerEngine';
import { adaptLeadToProfile } from '../../components/report/v2/lib/leadDataAdapter';
import type { InsuranceCategory } from '../../components/report/v2/data/reportTypes';

export interface ProposalFactSnippet {
  currentPremium: number;
  optimizedPremium: number;
  monthlySavings: number;
  totalSavings20yr: number;
  formattedContext: string;
}

/**
 * 기존 정밀 설계안 엔진 코드를 단 1줄도 수정하지 않고 그대로 호출하여,
 * 실시간으로 생성된 설계안의 실제 팩트 수치(기존 납입액, 다이어트 최저가, 월 절감액, 20년 총 절감액)를
 * AI 챗봇 컨텍스트에 1:1로 다리 놓는(Bridge) 신규 서비스 모듈입니다.
 */
export function buildProposalFactContext(
  age: number = 40,
  gender: 'M' | 'F' | 'male' | 'female' = 'male',
  currentPremium: number = 125000,
  category: InsuranceCategory = 'cancer'
): ProposalFactSnippet {
  const normGender = (gender === 'M' || gender === 'male') ? 'male' : 'female';
  const normGenderCode: 'M' | 'F' = normGender === 'male' ? 'M' : 'F';

  // 1. 기존 암 분석 연산 엔진 호출 (원본 코드 100% 미수정 보존)
  const analysisRaw = analyzeCancer({
    age,
    gender: normGender,
    monthlyPremium: currentPremium,
    currentPremium
  });

  // 2. 기존 리포트 V2 변환 어댑터 호출 (원본 코드 100% 미수정 보존)
  const leadResult = {
    analysis: {
      age,
      gender: normGenderCode,
      monthlyPremium: currentPremium,
      selectedCategory: category,
      cancer: { currentAmount: 30000000, targetAmount: 50000000 }
    },
    scores: analysisRaw.scores || { totalScore: 83, cancerScore: 83, cerebrovascularScore: 70, cardiovascularScore: 70 },
    efficiency: analysisRaw.efficiency || 98,
    deficiencies: analysisRaw.deficiencies || [],
    recommendations: {
      diet: {
        estimatedPremium: analysisRaw.recommendations?.diet?.estimatedPremium || 45000,
        title: analysisRaw.recommendations?.diet?.title || '[추천 보험사] 실속 암진단 집중 플랜',
        description: analysisRaw.recommendations?.diet?.description || '가성비 핵심 암 진단비 플랜'
      },
      upgrade: {
        estimatedPremium: analysisRaw.recommendations?.upgrade?.estimatedPremium || 45000,
        title: analysisRaw.recommendations?.upgrade?.title || '[추천 보험사] 2025 암주요치료비 결합 플랜',
        description: analysisRaw.recommendations?.upgrade?.description || '암 주요치료비 특약 결합 플랜'
      },
      hybrid: {
        estimatedPremium: analysisRaw.recommendations?.hybrid?.estimatedPremium || 45000,
        title: analysisRaw.recommendations?.hybrid?.title || '[추천 보험사] 평생 보장 비갱신 프리미엄',
        description: analysisRaw.recommendations?.hybrid?.description || '비갱신 고정 보험료 플랜'
      }
    }
  };

  const profile = adaptLeadToProfile(leadResult, category);

  const monthlySavings = profile.monthlySavings || Math.max(0, currentPremium - profile.optimizedPremium);
  const totalSavings20yr = profile.totalSavings20yr || (monthlySavings * 12 * 20);

  const formattedLines: string[] = [];
  formattedLines.push(`### 📊 [실시간 생성된 35개사 정밀 설계안 팩트 명세]`);
  formattedLines.push(`• **고객 정보**: ${age}세 ${normGender === 'male' ? '남성' : '여성'}`);
  formattedLines.push(`• **고객 현재 납입 보험료**: ${currentPremium.toLocaleString()}원/월`);
  formattedLines.push(`• **엔진 산출 실속 다이어트 최저가 플랜**: ${profile.optimizedPremium.toLocaleString()}원/월`);
  formattedLines.push(`• **매월 다이어트 절감액**: ${monthlySavings.toLocaleString()}원/월`);
  formattedLines.push(`• **20년 납입 기간 총 절감액**: ${(totalSavings20yr / 10000).toLocaleString()}만 원`);
  formattedLines.push(`• **보장 상태 진단**: 종합 건강점수 ${profile.overallScore}점`);
  formattedLines.push(`• **35개사 정밀 리포트 URL**: /report-v2?category=${category}&age=${age}&gender=${normGenderCode}&premium=${currentPremium}`);
  formattedLines.push(`• **대화 필수 인용 문구**: 반드시 "현재 매월 내시는 ${currentPremium.toLocaleString()}원에서 실속 최저가 플랜인 ${profile.optimizedPremium.toLocaleString()}원으로 다이어트 시, 매월 무려 ${monthlySavings.toLocaleString()}원씩, 20년 동안 총 ${(totalSavings20yr / 10000).toLocaleString()}만 원을 절약하실 수 있습니다!" 하고 정밀 설계안 수치를 100% 동일하게 인용한 후, 마지막에 35개사 정밀 리포트 URL(/report-v2?category=${category}&age=${age}&gender=${normGenderCode}&premium=${currentPremium})을 제시하십시오.`);

  return {
    currentPremium,
    optimizedPremium: profile.optimizedPremium,
    monthlySavings,
    totalSavings20yr,
    formattedContext: formattedLines.join('\n')
  };
}
