import { GoogleGenAI } from '@google/genai';
import { RawRider, StandardizedCoverage, RawInsurancePolicy } from '../../types/remodeling';

const apiKey = (process.env as any).GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export function classifyRiderByRegex(riderName: string): 'cancer_diagnosis' | 'brain_vascular' | 'ischemic_heart' | 'caregiver_expense' | 'silson' | 'other' {
  const name = riderName.toLowerCase();
  if (/암진단|일반암|소액암|고액암|암 진단/.test(name)) return 'cancer_diagnosis';
  if (/뇌혈관|뇌졸중|뇌출혈|뇌 혈관/.test(name)) return 'brain_vascular';
  if (/허혈성|급성심근|심장질환|심장 질환|심근경색/.test(name)) return 'ischemic_heart';
  if (/간병인|간병지원|간병 사용|간병비/.test(name)) return 'caregiver_expense';
  if (/실손|실비|입원의료|통원의료/.test(name)) return 'silson';
  return 'other';
}

/**
 * 2차 필터링: Gemini AI 활용 매칭 (정규식 실패 시 우회로)
 */
export async function classifyRiderByAI(riderName: string): Promise<'cancer_diagnosis' | 'brain_vascular' | 'ischemic_heart' | 'caregiver_expense' | 'silson' | 'other'> {
  // 1. Regex First
  const regexResult = classifyRiderByRegex(riderName);
  if (regexResult !== 'other') return regexResult;

  // 2. Fallback to Gemini if API key is present
  if (ai) {
    try {
      const prompt = `특약명: "${riderName}"
위 특약명이 다음 중 어느 카테고리에 가장 가까운지 대답하세요. 오직 카테고리 영문명만 대답하세요.
- 암 진단비 관련: cancer_diagnosis
- 뇌혈관/뇌졸중/뇌출혈 관련: brain_vascular
- 허혈성/심근경색/심장질환 관련: ischemic_heart
- 간병인/간병지원 관련: caregiver_expense
- 실손의료비/실비 관련: silson
- 해당 없음: other`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text?.trim().toLowerCase() || '';
      if (text.includes('cancer_diagnosis')) return 'cancer_diagnosis';
      if (text.includes('brain_vascular')) return 'brain_vascular';
      if (text.includes('ischemic_heart')) return 'ischemic_heart';
      if (text.includes('caregiver_expense')) return 'caregiver_expense';
      if (text.includes('silson')) return 'silson';
    } catch (e) {
      console.error('Gemini classification failed, using keyword fallback', e);
    }
  }

  // 3. Fallback to keyword heuristics
  const name = riderName.toLowerCase();
  if (name.includes('암')) return 'cancer_diagnosis';
  if (name.includes('뇌') || name.includes('졸중') || name.includes('출혈')) return 'brain_vascular';
  if (name.includes('심장') || name.includes('심근') || name.includes('허혈')) return 'ischemic_heart';
  if (name.includes('간병') || name.includes('돌봄')) return 'caregiver_expense';
  if (name.includes('실손') || name.includes('실비') || name.includes('의료비')) return 'silson';

  return 'other';
}

/**
 * Parses raw insurance policies into a single StandardizedCoverage status
 */
export async function parsePoliciesToStandardized(
  age: number,
  gender: 'M' | 'F',
  policies: RawInsurancePolicy[]
): Promise<StandardizedCoverage> {
  let current_total_premium = 0;
  let cancer_diagnosis = 0;
  let brain_vascular = 0;
  let ischemic_heart = 0;
  let caregiver_expense = 0;
  let silson = false;

  for (const policy of policies) {
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
    silson
  };
}
