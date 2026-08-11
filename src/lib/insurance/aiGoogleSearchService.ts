import { GoogleGenAI } from '@google/genai';
import { getEmbedding } from './aiPersona';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || 
                 (typeof process !== 'undefined' && process.env && (process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY)) || '';

  if (!aiInstance && apiKey) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface ExpandedKnowledge {
  title: string;
  content: string;
  keywords: string[];
}

/**
 * 모르는 질문이나 최신 약관/규제 질문이 들어왔을 때, 
 * 1. 구글 실시간 웹 검색(Google Search Grounding)을 수행하고
 * 2. 결과를 정제하여 Supabase insurance_knowledge_base 테이블에 insert 및 768차원 임베딩 자동 생성
 */
export async function searchGoogleAndExpandKb(
  userQuery: string,
  supabase: any
): Promise<ExpandedKnowledge | null> {
  const ai = getAI();
  if (!ai) {
    console.warn('[Auto-Knowledge Expansion] ⚠️ Gemini API 키가 설정되지 않아 구글 검색을 건너뜁니다.');
    return null;
  }

  try {
    console.log(`[Auto-Knowledge Expansion] 🌐 구글 실시간 웹 검색 탐색 중... 쿼리: "${userQuery}"`);

    const prompt = `사용자가 다음 보험 질문을 했습니다: "${userQuery}"
구글 검색을 수행하여 2025-2026년 대한민국 금융감독원, 보험협회, 및 주요 생손보사의 최신 정식 기준에 근거해 질문에 대한 가장 정확하고 객관적인 지식 요약(제목, 핵심내용, 키워드)을 작성해 주세요.

반드시 아래 JSON 형식으로만 응답해 주세요. (마크다운이나 코드블록 절대 금지)
{
  "title": "질문의 주제 및 최신 규정 요약 제목",
  "content": "핵심 수치, 면책/감액 조건, 변경점 등 소비자가 이해하기 쉬운 3~5줄 요약 문장",
  "keywords": ["핵심키워드1", "핵심키워드2", "핵심키워드3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // 구글 실시간 웹 검색 Grounding 활성화
      }
    });

    const rawText = response.text?.trim() || '';
    let parsed: ExpandedKnowledge | null = null;

    try {
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      if (rawText.length > 20) {
        parsed = {
          title: `[실시간 구글 탐색 지식] ${userQuery.slice(0, 30)}`,
          content: rawText.slice(0, 500),
          keywords: ['실시간검색', '최신규정']
        };
      }
    }

    if (!parsed || !parsed.content) {
      console.warn('[Auto-Knowledge Expansion] ⚠️ 구글 검색 유의미한 응답 추출 실패');
      return null;
    }

    console.log(`[Auto-Knowledge Expansion] 💡 구글 탐색 성공: "${parsed.title}"`);

    // 백그라운드로 Supabase DB에 적재 및 벡터 생성 (무이탈)
    (async () => {
      try {
        const vector = await getEmbedding(parsed.content);

        const { error } = await supabase.from('insurance_knowledge_base').insert({
          category: 'auto_search_grounding',
          title: parsed.title,
          content: parsed.content,
          keywords: parsed.keywords || ['실시간검색', '자가적재'],
          embedding: vector.length > 0 ? vector : null
        });

        if (error) {
          console.warn('[Auto-Knowledge Expansion] ⚠️ Supabase DB 자동 적재 오류:', error.message);
        } else {
          console.log(`[Auto-Knowledge Expansion] ✅ Supabase DB 지식 자동 적재 및 임베딩 완료! ("${parsed.title}")`);
        }
      } catch (dbErr) {
        console.warn('[Auto-Knowledge Expansion] ⚠️ 백그라운드 적재 중 예외:', dbErr);
      }
    })();

    return parsed;
  } catch (err) {
    console.warn('[Auto-Knowledge Expansion] ❌ 구글 실시간 검색 가동 중 예외:', err);
    return null;
  }
}
