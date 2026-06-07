import { GoogleGenAI } from '@google/genai';
import { RawRider, StandardizedCoverage, RawInsurancePolicy } from '../../types/remodeling';

let _ai: GoogleGenAI | null = null;

function getGeminiKey(): string | undefined {
  return (
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' && (process.env as any)?.GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && (process.env as any)?.GOOGLE_API_KEY)
  ) || undefined;
}

function getAI(): GoogleGenAI | null {
  if (_ai) return _ai;
  const key = getGeminiKey();
  if (key) {
    _ai = new GoogleGenAI({ apiKey: key });
    console.log('✅ Gemini AI initialized successfully');
  } else {
    console.warn('⚠️ Gemini API key not found. Using rule-based fallback.');
  }
  return _ai;
}

export function classifyRiderByRegex(riderName: string): 'cancer_diagnosis' | 'brain_vascular' | 'ischemic_heart' | 'caregiver_expense' | 'silson' | 'surgery' | 'post_disability' | 'other' {
  const name = riderName.toLowerCase();
  if (/암진단|일반암|소액암|고액암|암 진단/.test(name)) return 'cancer_diagnosis';
  if (/뇌혈관|뇌졸중|뇌출혈|뇌 혈관/.test(name)) return 'brain_vascular';
  if (/허혈성|급성심근|심장질환|심장 질환|심근경색/.test(name)) return 'ischemic_heart';
  if (/간병인|간병지원|간병 사용|간병비/.test(name)) return 'caregiver_expense';
  if (/실손|실비|입원의료|통원의료/.test(name)) return 'silson';
  if (/수술|입원/.test(name)) return 'surgery';
  if (/후유장해|후유 장해|장해/.test(name)) return 'post_disability';
  return 'other';
}

/**
 * 2차 필터링: Gemini AI 활용 매칭 (정규식 실패 시 우회로)
 */
export async function classifyRiderByAI(riderName: string): Promise<'cancer_diagnosis' | 'brain_vascular' | 'ischemic_heart' | 'caregiver_expense' | 'silson' | 'surgery' | 'post_disability' | 'other'> {
  // 1. Regex First
  const regexResult = classifyRiderByRegex(riderName);
  if (regexResult !== 'other') return regexResult;

  // 2. Fallback to keyword heuristics
  const name = riderName.toLowerCase();
  if (name.includes('암')) return 'cancer_diagnosis';
  if (name.includes('뇌') || name.includes('졸중') || name.includes('출혈')) return 'brain_vascular';
  if (name.includes('심장') || name.includes('심근') || name.includes('허혈')) return 'ischemic_heart';
  if (name.includes('간병') || name.includes('돌봄')) return 'caregiver_expense';
  if (name.includes('실손') || name.includes('실비') || name.includes('의료비')) return 'silson';
  if (name.includes('수술') || name.includes('입원')) return 'surgery';
  if (name.includes('후유장해') || name.includes('장해')) return 'post_disability';

  return 'other';
}

/**
 * 룰 기반 휴리스틱 추정 (로컬 폴백)
 */
export function runHeuristicEstimation(policies: RawInsurancePolicy[]) {
  for (const policy of policies) {
    const name = policy.product_name;
    const premium = policy.monthly_premium;
    const riders: RawRider[] = [];

    // 실손/실비 여부 판별
    if (/실손|실비|의료비/.test(name)) {
      riders.push({ rider_name: '실손의료비', coverage_amount: 1 });
    }

    if (/암|cancer/i.test(name)) {
      // 암 전문 보험
      const cancerAmt = Math.round((premium * 300) / 10000000) * 10000000 || 10000000;
      riders.push({ rider_name: '일반암진단비', coverage_amount: cancerAmt });
    } else if (/뇌|심장|혈관|건강|종합|종신|금쪽|올인원|자녀|어린이|행복/.test(name)) {
      // 종합 또는 건강보험
      const cancerAmt = Math.round((premium * 200) / 10000000) * 10000000 || 20000000;
      const brainAmt = Math.round((premium * 150) / 10000000) * 10000000 || 10000000;
      const heartAmt = Math.round((premium * 150) / 10000000) * 10000000 || 10000000;
      
      riders.push({ rider_name: '일반암진단비', coverage_amount: cancerAmt });
      riders.push({ rider_name: '뇌혈관질환진단비', coverage_amount: brainAmt });
      riders.push({ rider_name: '허혈성심장질환진단비', coverage_amount: heartAmt });
      riders.push({ rider_name: '수술비(질병/상해)', coverage_amount: 3000000 });
      riders.push({ rider_name: '질병후유장해', coverage_amount: 30000000 });
    }

    if (/간병|돌봄|요양/.test(name)) {
      riders.push({ rider_name: '간병인사용일당', coverage_amount: 150000 });
    }

    policy.riders = riders;
  }
}

/**
 * 제미나이 AI 기반 상품 정보 역산 추정
 */
export async function estimatePolicyRidersWithAI(
  age: number,
  gender: 'M' | 'F',
  policies: RawInsurancePolicy[]
): Promise<RawInsurancePolicy[]> {
  const needsEstimation = policies.filter(p => !p.riders || p.riders.length === 0);
  if (needsEstimation.length === 0) {
    return policies;
  }

  const ai = getAI();

  if (ai) {
    try {
      console.log(`🤖 Gemini: ${needsEstimation.length}개 상품 특약 역산 추정 시작...`);
      const prompt = `당신은 대한민국 최고의 보험 계리사 및 설계사 AI입니다. 
가입자의 기본 정보(나이: ${age}세, 성별: ${gender === 'M' ? '남성' : '여성'})와 가입된 보험 목록(상품명, 월 보험료)을 기반으로, 국내 표준 설계 요율 및 통계 자료를 바탕으로 각 상품별 핵심 특약(일반암 진단비, 뇌혈관질환 진단비, 허혈성심장질환 진단비, 간병인사용일당, 실손의료비 가입여부, 수술비(질병/상해) 보장한도, 질병후유장해 보장한도)의 보장 금액을 정교하게 역산하여 추정해 주세요.

[분석 가이드]
1. 일반암 진단비, 뇌혈관질환 진단비, 허혈성심장질환 진단비는 원(KRW) 단위 숫자로 추정하세요. (예: 30000000)
2. 간병인사용일당은 1일당 보장 금액(원)으로 추정하세요. (예: 150000)
3. 실손의료비는 해당 상품이 실손의료보험이거나 실손 특약이 포함되어 있는지 여부(포함되어 있다면 1, 포함되어 있지 않다면 0)로 판별하세요.
4. 수술비(질병/상해) 보장한도는 종합건강, 다사랑 등 종합보험인 경우 3,000,000원(3000000) 내외로 추정하고, 그 외 건강 특성이 없는 경우 0으로 설정하세요.
5. 질병후유장해 보장한도는 종합건강, 다사랑 등 종합보험인 경우 30,000,000원(30000000) 내외로 추정하고, 그 외 건강 특성이 없는 경우 0으로 설정하세요.
6. 각 보험의 상품명과 월 보험료 수준을 고려하여 현실적인 데이터로 역산해야 합니다. 예를 들어, 암보험이면 암 진단비가 높을 것이고, 건강/종합보험이면 암, 뇌, 심장 진단비가 고루 들어있을 것입니다. 운전자보험이나 화재보험 등 기타 보험은 해당 특약들이 없을 것이므로 0으로 설정하세요.

[대상 보험 목록]
${needsEstimation.map((p) => `- 상품명: "${p.product_name}", 월 보험료: ${p.monthly_premium}원`).join('\n')}

[출력 형식]
반드시 다음 JSON 구조의 배열만 출력하세요. 마크다운 코드 블록 (\`\`\`json ... \`\`\`) 형식도 괜찮으나, 다른 일반 설명이나 서두/결론 텍스트는 절대 포함하지 마세요.
[
  {
    "product_name": "상품명1",
    "riders": [
      { "rider_name": "일반암진단비", "coverage_amount": 30000000 },
      { "rider_name": "뇌혈관질환진단비", "coverage_amount": 20000000 },
      { "rider_name": "허혈성심장질환진단비", "coverage_amount": 20000000 },
      { "rider_name": "간병인사용일당", "coverage_amount": 150000 },
      { "rider_name": "실손의료비", "coverage_amount": 1 },
      { "rider_name": "수술비(질병/상해)", "coverage_amount": 3000000 },
      { "rider_name": "질병후유장해", "coverage_amount": 30000000 }
    ]
  }
]
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text?.trim() || '';
      console.log('✅ Gemini AI 응답:', responseText);

      let jsonText = responseText;
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
      }

      const estimatedData = JSON.parse(jsonText);
      if (Array.isArray(estimatedData)) {
        for (const item of estimatedData) {
          const matchingPolicy = needsEstimation.find(p =>
            p.product_name === item.product_name ||
            item.product_name.includes(p.product_name) ||
            p.product_name.includes(item.product_name)
          );
          if (matchingPolicy && Array.isArray(item.riders)) {
            matchingPolicy.riders = item.riders.map((r: any) => ({
              rider_name: r.rider_name,
              coverage_amount: Number(r.coverage_amount || 0)
            }));
          }
        }
        console.log(`✅ Gemini 특약 역산 완료. 적용 상품 수: ${estimatedData.length}개`);
      }
    } catch (e) {
      console.error('❌ Gemini AI 추정 실패, 룰 기반 폴백 사용', e);
      runHeuristicEstimation(needsEstimation);
    }
  } else {
    console.warn('⚠️ Gemini AI 미초기화. 룰 기반 폴백 사용.');
    runHeuristicEstimation(needsEstimation);
  }

  return policies;
}

/**
 * Parses raw insurance policies into a single StandardizedCoverage status
 */
export async function parsePoliciesToStandardized(
  age: number,
  gender: 'M' | 'F',
  policies: RawInsurancePolicy[]
): Promise<StandardizedCoverage> {
  // 1. Run AI estimation for policies with empty riders
  const estimatedPolicies = await estimatePolicyRidersWithAI(age, gender, policies);

  let current_total_premium = 0;
  let cancer_diagnosis = 0;
  let brain_vascular = 0;
  let ischemic_heart = 0;
  let caregiver_expense = 0;
  let silson = false;
  let surgery_amount = 0;
  let post_disability_amount = 0;

  for (const policy of estimatedPolicies) {
    current_total_premium += policy.monthly_premium;
    for (const rider of policy.riders) {
      const category = await classifyRiderByAI(rider.rider_name);
      if (category === 'cancer_diagnosis') {
        cancer_diagnosis += rider.coverage_amount;
      } else if (category === 'brain_vascular') {
        brain_vascular += rider.coverage_amount;
      } else if (category === 'ischemic_heart') {
        ischemic_heart += rider.coverage_amount;
      } else if (category === 'caregiver_expense') {
        caregiver_expense += rider.coverage_amount;
      } else if (category === 'silson') {
        silson = true;
      } else if (category === 'surgery') {
        surgery_amount += rider.coverage_amount;
      } else if (category === 'post_disability') {
        post_disability_amount += rider.coverage_amount;
      }
    }
  }

  return {
    age,
    gender,
    current_total_premium,
    cancer_diagnosis,
    brain_vascular,
    ischemic_heart,
    caregiver_expense,
    silson,
    surgery_amount,
    post_disability_amount,
    policies: estimatedPolicies
  };
}
