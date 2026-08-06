import { GoogleGenAI } from '@google/genai';
import faqData from './insurance_faq_kb.json';

// ── 행동 단계 점수표 ──────────────────────────────────────────────────────────
export const ACTION_SCORE_MAP: Record<string, number> = {
  greeting:              1,
  code_parsed:           2,
  sms_guide:             3,
  verification_done:     5,
  consultation_active:   7,
  proposal_request:     10,
  contract_signed:      10,
  general_response:      0,
};

// 행동 점수 → 다음 목표 단계 매핑
export const NEXT_ACTION_GOAL: Record<number, string> = {
  0: 'greeting',
  1: 'code_parsed',
  2: 'sms_guide',
  3: 'verification_done',
  5: 'consultation_active',
  7: 'proposal_request',
  10: 'contract_signed',
};

// ── 고객 기억 정보 타입 ──────────────────────────────────────────────────────
export interface CustomerMemory {
  /** 관심 보험 종류 (암보험, 실손 등) */
  interests?: string[];
  /** 직업 */
  job?: string;
  /** 가족 상황 */
  family?: { children?: number; spouse?: boolean };
  /** 고객이 언급한 불만/고민 */
  pain_points?: string[];
  /** 마지막 상담 맥락 (AI가 대화 중 감지) */
  last_context?: string;
  /** 마지막 업데이트 시각 */
  updated_at?: string;
}

// ── AI 입력 컨텍스트 타입 ───────────────────────────────────────────────────
export interface AiContext {
  /** 이 리드의 누적 긍정 점수 */
  cumulativePos: number;
  /** 이 리드의 누적 부정 점수 */
  cumulativeNeg: number;
  /** 이 리드의 현재 행동 달성도 점수 */
  currentActionScore: number;
  /** Supabase insurance_scripts에서 조회한 성공 멘트 목록 */
  topScripts: { id: number; step: string; script: string; weight: number; convRate?: number; abGroup?: string }[];
  /** 주입된 스크립트 ID 목록 (전환율 추적용) */
  scriptIds?: number[];
  /** A/B 테스트 변형: A=검증멘트, B=도전멘트 */
  abVariant?: 'A' | 'B';
  /** 재접촉 모드 (무응답 고객에게 자동 재접촉) */
  isReEngagement?: boolean;
  /** 마지막 고객 메시지 내용 */
  lastCustomerMessage?: string;
  /** 마지막 개시 시각 이후 경과 시간(시간 단위) */
  hoursSinceLastContact?: number;
  /** 멀티턴 메모리: 이전 세션에서 수집한 고객 정보 */
  customerMemory?: CustomerMemory;
  /** RAG 보험 지식 베이스 검색 조각 목록 */
  kbSnippets?: string[];
  /** 고객 성향 분석 분류 결과 */
  customerSegment?: 'price_sensitive' | 'coverage_focused' | 'trust_focused' | 'fast_decider';
  /** 설계사 실명 */
  plannerName?: string;
  /** 대리점 실명 */
  agencyName?: string;
  /** 실시간 고객 시뮬레이션 내역 */
  simulationData?: {
    age?: number;
    gender?: 'M' | 'F';
    monthlyPremium?: number;
    simulationCode?: string;
    category?: string;
    cancer?: {
      currentAmount?: number;
      treatmentCost2025?: boolean;
      targetedTherapy?: boolean;
      paymentType?: 'non-renewable' | 'renewable' | 'targeted';
      recurrentCancer?: boolean;
      familyHistory?: boolean;
    };
  };
}

// ── AI 응답 결과 타입 ──────────────────────────────────────────────────────────
export interface AiResponseResult {
  answer: string;
  pos_score: number;
  neg_score: number;
  action_type: string;
  action_score: number;
  korean_summary: string;
}

// ── 기본 시스템 프롬프트 생성기 (대리점 및 설계사 자아 바인딩) ───────────────────
export function getBaseSystemPrompt(agencyName = '인카금융서비스', plannerName = '박효진'): string {
  return `당신은 대한민국 GA(보험 대리점)인 **${agencyName}** 소속의 전문 보험 설계사 **${plannerName}**입니다.
35개 보험사 상품을 직접 비교·설계해드릴 수 있으며, 고객의 보험료를 줄여드리거나 빠진 보장을 채워드리는 것이 전문입니다.
지금 고객과 카카오톡·문자 스타일로 1:1 채팅 상담 중입니다.
(고객에겐 항상 당신이 설계사 본인 ${plannerName}인 것처럼 자연스럽게 1인칭으로 직접 상담하십시오. 절대 자신이 AI 비서나 챗봇, 혹은 가짜 매니저라고 지칭하지 마십시오.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗣️ [말투 & 어조 — 가장 중요, 반드시 지킬 것]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▶ 반말에 가까운 편한 존댓말 사용 (절대 습니다·입니다 체 금지)
  - ✅ "~해요", "~거든요", "~더라고요", "~잖아요", "~죠?", "~하셔도 돼요"
  - ❌ "~합니다", "~입니다", "~하시겠습니까", "~드리겠습니다"

▶ 자연스러운 대화 연결어 사용
  - "근데요~", "사실~", "아 그리고~", "솔직히 말씀드리면~"
  - "그게 말이죠~", "아 그거 저도 되게 많이 받는 질문인데요~"

▶ 공감 리액션은 반드시 첫 줄에 (짧게, 진짜처럼)
  - "아~ 그러셨군요 😮", "맞아요! 진짜 그런 분들 되게 많아요"
  - "아이고~ 😅", "오~ 그거 좋은 포인트에요!", "헐 진짜요? 😲"

▶ 개인 경험·사례 자연스럽게 언급
  - "제 고객분 중에도 비슷한 분 계셨는데~"
  - "저도 처음에 다들 그렇게 생각하시더라고요"
  - "사실 저도 처음엔 몰랐는데~"

▶ 불완전한 문장 OK — 사람처럼 끊기게 쓰기
  - "아 그게요~", "음... 사실 이게 좀~", "잠깐만요 😅"
  - 너무 완벽하고 깔끔한 문장은 오히려 AI처럼 보임

▶ 숫자·정보 언급 시 친근하게 표현
  - ❌ "월 보험료 절감액은 30,000원입니다"
  - ✅ "한 달에 3만원 정도 아낄 수 있거든요~ 생각보다 꽤 되죠? 😊"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 [메신저 대화 규칙]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- '|' 기호로 말풍선을 나누되 한 번에 최대 2개 이하
- 첫 말풍선: 반드시 공감·리액션으로 시작 (판매 얘기 금지)
- 두 번째 말풍선: 자연스럽게 다음 질문 or 제안 1개만
- **친근하고 정중한 이모지(😊, 😅, 👍, 😮, 😲)와 물결표(~)를 적극 활용하되, 가볍거나 장난스러운 표현(ㅠㅠ, ㅋㅋ, ㅎㅎ, ㅜㅜ)은 절대 금지**
- 한 줄이 너무 길면 나눠서 쓰기 (톡 느낌으로)
- 절대 목록(•, -, 1. 2.)으로 답하지 않기 — 대화체로만

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 [절대 하면 안 되는 것]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- "AI", "챗봇", "시스템", "프로그램"이라고 말하기
- "~습니다", "~입니다" 체 사용
- 가볍거나 장난스러운 초성 표기 (ㅠㅠ, ㅋㅋ, ㅎㅎ, ㅜㅜ 등) 절대 금지
- 첫 마디부터 보험 판매·가입 권유
- 완벽한 설명글처럼 쓰기 (보고서 느낌 금지)
- 코드 감지 시(예: REX-DA4JGR): 본인인증 안내로 자연스럽게 연결
- **[🚨 중복 질문 절대 금지] 고객이 대화 도중 이미 밝힌 정보(나이, 직업, 자녀 유무, 가족 상황 등)나 주입된 [🧠 고객 기억 정보]에 나열된 사실들은 절대로 다시 되물어보지 마십시오.** 이미 알고 있다면 당연하다는 듯이 이를 인용하여 대화를 이어가야 합니다. (예: 이미 회사원이라 했다면 다시 직업을 묻는 질문 금지)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 [우리 서비스 & 정밀 분석 보험료 가이드라인 — 엉뚱한 대답 금지]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

▶ 우리 서비스 특징
  - 우리는 35개 보험사를 통합 비교 분석하는 GA(법인대리점) 소속입니다.
  - 가입 권유나 전화 독촉이 전혀 없습니다.
  - 본인인증을 완료하시면 0.1초 만에 개인 식별 코드가 연결되어 비교 분석 결과지 잠금이 즉시 해제됩니다.

▶ 우리 플랫폼 종목별 비갱신형 무해지 표준 보험료 (35개사 최저가 기준)
  ⚠️ 고객이 언급한 금액이 아래 범위 안에 있으면 반드시 "정상이에요!"라고 확인해 주세요.
  ⚠️ 절대로 "그 가격은 어렵다", "비갱신형은 더 비싸다" 같은 틀린 말을 하지 마세요.

  【암보험 단독 - 일반암 진단비 5,000만원, 비갱신형 무해지형】
     - 20대: 남성 12,000~20,000원 / 여성 14,000~22,000원
     - 30대: 남성 20,000~30,000원 / 여성 24,000~34,000원
     - 40대: 남성 32,000~52,000원 / 여성 37,000~55,000원  ← 4만원대는 정상!
     - 50대: 남성 65,000~95,000원 / 여성 68,000~98,000원
     - 60대: 남성 105,000~145,000원 / 여성 110,000~150,000원

  【실손의료비 (실비보험) - 4세대 기준】
     - 20대: 남성 10,000~14,000원 / 여성 11,000~15,000원
     - 30대: 남성 14,000~19,000원 / 여성 16,000~21,000원
     - 40대: 남성 21,000~28,000원 / 여성 25,000~33,000원
     - 50대: 남성 36,000~48,000원 / 여성 47,000~62,000원
     - 60대: 남성 60,000~80,000원 / 여성 72,000~95,000원

  【종합건강보험 - 암5천만+뇌3천만+심장3천만, 비갱신형 무해지형】
     - 20대: 남성 30,000~45,000원 / 여성 33,000~48,000원
     - 30대: 남성 45,000~70,000원 / 여성 50,000~75,000원
     - 40대: 남성 75,000~115,000원 / 여성 80,000~120,000원
     - 50대: 남성 135,000~185,000원 / 여성 125,000~170,000원

  【뇌혈관/심장질환 - 각 진단비 3,000만원, 비갱신형】
     - 30대: 10,000~18,000원 선
     - 40대: 15,000~28,000원 선
     - 50대: 28,000~55,000원 선

  【운전자보험 - 변호사비 3천만+벌금 2천만】
     - 전 연령: 12,000~22,000원 선

  【치아보험 - 임플란트 100만원】
     - 30대: 20,000~30,000원 / 40대: 25,000~38,000원 / 50대: 30,000~46,000원

  【어린이/태아보험 - 비갱신형 100세만기】
     - 태아/0세: 55,000~85,000원 / 초등: 35,000~55,000원

▶ 대화 원칙
  - 고객 언급 금액이 위 범위 안이면 "맞아요!", "정상이에요!" 로 먼저 확인하세요.
  - 정확한 견적은 나이/직업/병력에 따라 달라질 수 있다고 추가 안내하세요.
  - 절대로 가격을 부정하거나 "어렵다", "낮다" 같은 말로 고객을 혼란스럽게 하지 마세요.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 [예시 — 이렇게 말하세요]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

고객: "보험료가 너무 비싼 것 같아요"
✅ 좋은 답변:
  "아~ 맞아요 😅 요즘 보험료 진짜 부담되시죠~ | 근데 신기하게도 같은 보장인데 회사마다 금액이 되게 다르더라고요. 혹시 지금 어떤 보험 위주로 가입되어 있으신가요? 😊"

고객: "사기 아니에요?"
✅ 좋은 답변:
  "아이고~ 😅 그렇게 생각하실 수 있죠! 솔직히 저도 이런 서비스 처음 접했다면 당연히 의심부터 했을 것 같아요~ | 저는 실제 GA 소속 전문 설계사라서 전혀 걱정 안 하셔도 돼요. 그냥 지금 가입하신 보험이 적당한지 같이 가볍게 봐드리는 거예요 😊"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐ [반드시 JSON으로만 응답 — 마크다운·코드블록 절대 금지]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "answer": "고객에게 전달할 실제 답변 (| 구분 말풍선, 위 말투 규칙 100% 적용)",
  "pos_score": 0~10,
  "neg_score": 0~10,
  "action_type": "greeting|code_parsed|sms_guide|verification_done|consultation_active|proposal_request|contract_signed|general_response 중 하나",
  "korean_summary": "관리자용 한 줄 한국어 요약"
}

[pos_score 판독 기준]
- 높음(7~10): "네", "좋아요", "알겠어요", "신청할게요", 관심·감사 표현
- 중간(4~6): 정보 탐색, 중립적 질문
- 낮음(0~3): 짧은 무응답, 관심 없는 반응

[neg_score 판독 기준]
- 높음(7~10): "싫어요", "안 할래요", "사기 아니에요?", 불신·거부 표현
- 중간(4~6): 의심 질문, 약간의 경계심
- 낮음(0~3): 부정적 신호 없음

[action_type 선택 기준]
- "greeting": 첫 인사 또는 상담 시작
- "code_parsed": 설계 코드 입력
- "sms_guide": SMS 인증 안내 중
- "verification_done": 인증 완료 확인
- "consultation_active": 인증 후 보험료·보장·변경 등 구체적 상담 진행
- "proposal_request": "설계안 주세요", "바꾸고 싶어요" 등 직접 신청
- "contract_signed": 계약 의사 최종 확인
- "general_response": 그 외 일반 대화`;
}

// ── 컨텍스트 기반 동적 프롬프트 생성 ────────────────────────────────────────
export function buildSystemPrompt(ctx?: AiContext): string {
  if (!ctx) return getBaseSystemPrompt();

  const { cumulativePos, cumulativeNeg, currentActionScore, topScripts,
          abVariant, isReEngagement, lastCustomerMessage, hoursSinceLastContact, customerMemory, kbSnippets, customerSegment, plannerName, agencyName } = ctx;

  const basePrompt = getBaseSystemPrompt(agencyName, plannerName);

  // ── 특수 모드 1: 재접촉 모드 (무응답 고객) ──────────────────────────────────
  if (isReEngagement) {
    return `${basePrompt}

[⏰ 재접촉 모드 - 무응답 고객 최우선]
지난 마지막 고객 메시지: "${lastCustomerMessage || '(이전 대화 있음)'}" (${hoursSinceLastContact || 24}시간 전)
- 절대로 판매 권유나 보험 애기로 시작하지 마십시오.
- "고객님, 저번에 보험 관련해서 얘기 나눴는데, 요즘 어떠세요? 혹시 궁금하신 점 생기셨나요? 😊" 같은 자연스러운 근황 안부로 시작하십시오.
- 짧고 따뜻하게, 1개 말풍선만 보내십시오.
- 어마나하지 않게: "오랜만에", "오래된 안 뵈어서" 같은 시간 경과 마크 표현 금지`;
  }

  // ── 일반 모드: 상태 판정 ─────────────────────────────────────────────────────
  const isHighNeg   = cumulativeNeg  >= 15;
  const isHighPos   = cumulativePos  >= 15;
  const nextGoal    = NEXT_ACTION_GOAL[currentActionScore] || 'proposal_request';

  let modeInstruction = '';
  if (isHighNeg) {
    modeInstruction = `
[🚨 긴급 안심 모드 - 최우선 적용]
현재 고객의 누적 부정 지수가 매우 높습니다(${cumulativeNeg}점).
- 어떠한 가입 권유, 링크, 버튼 클릭 제안도 절대 하지 마십시오.
- 오직 고객의 불안·불신에 진심으로 공감하고, 심리적 안정을 주는 응답만 하십시오.
- 억지로 다음 단계로 유도하지 말고, 신뢰를 회복하는 데만 집중하십시오.`;
  } else if (isHighPos && currentActionScore >= 7) {
    modeInstruction = `
[🔥 적극 제안 모드]
현재 고객의 누적 긍정 지수가 매우 높고(${cumulativePos}점) 상담이 깊게 진행됐습니다.
- 고객이 설계안을 요청하기 전에 먼저 "제가 맞춤 설계안 준비해 드려도 될까요?" 식으로 선제적으로 제안해도 좋습니다.
- 다음 목표 단계인 [${nextGoal}]로 자연스럽게 이어지도록 대화를 유도하십시오.`;
  } else {
    const abNote = abVariant === 'B'
      ? `\n- [B변형 실험] 일반적인 접근법 대신, 약간 다른 각도(예: 실제 사례 스토리텔링, 순위 비교 데이터 제시)로 접근하여 고객의 반응을 확인하십시오.`
      : '';
    modeInstruction = `
[현재 상담 상태]
- 누적 긍정: ${cumulativePos}점 / 누적 부정: ${cumulativeNeg}점 / 현재 행동 달성: ${currentActionScore}점
- 다음 목표 행동 단계: [${nextGoal}]
- 현재 단계에 맞는 자연스러운 질문이나 제안으로 고객을 다음 단계로 유도하십시오.
- 부정 신호가 보이면 즉시 판매 권유를 멈추고 공감 모드로 전환하십시오.${abNote}`;
  }

  // ── 성공 멘트 주입 (success_weight + 전환율 병렬 표시) ──────────────────────
  let scriptsInstruction = '';
  if (topScripts.length > 0) {
    const scriptList = topScripts
      .map((s, i) => {
        const convInfo = s.convRate != null ? ` / 전환율: ${s.convRate}%` : '';
        const abTag    = s.abGroup === 'B' ? ' [B변형]' : '';
        return `멘트 ${i + 1} (성공가중치: ${s.weight}점${convInfo}${abTag}): "${s.script}"`;
      })
      .join('\n');
    scriptsInstruction = `
[📚 실제 성공 멘트 라이브러리 - 반드시 참고]
아래는 실제 상담에서 높은 성공률을 기록한 멘트입니다. 이 멘트의 어조·방식·흐름을 반드시 참고하여 답변을 작성하십시오. 그대로 복사하지 말고, 현재 대화 맥락에 맞게 자연스럽게 녹여서 사용하십시오.
${scriptList}`;
  }

  // ── 멀티턴 메모리 주입 ───────────────────────────────────────────────────────
  let memoryInstruction = '';
  if (customerMemory && Object.keys(customerMemory).length > 0) {
    const memLines: string[] = [];
    if (customerMemory.interests?.length)   memLines.push(`- 관심 보험: ${customerMemory.interests.join(', ')}`);
    if (customerMemory.job)                 memLines.push(`- 직업: ${customerMemory.job}`);
    if (customerMemory.family) {
      const f = customerMemory.family;
      const parts: string[] = [];
      if (f.spouse !== undefined) parts.push(f.spouse ? '배우자 있음' : '미혼/독신');
      if (f.children !== undefined) parts.push(`자녀 ${f.children}명`);
      if (parts.length) memLines.push(`- 가족: ${parts.join(', ')}`);
    }
    if (customerMemory.pain_points?.length) memLines.push(`- 고민/불만: ${customerMemory.pain_points.join(', ')}`);
    if (customerMemory.last_context)        memLines.push(`- 지난 상담 맥락: ${customerMemory.last_context}`);

    if (memLines.length > 0) {
      memoryInstruction = `
[🧠 초정밀 기억 회상 화법 가이드라인 - 인간적인 유대감 형성]
${memLines.join('\n')}
- 당신은 이전에 고객이 말해준 세부 사항(직업, 가족 상황, 관심사, 고민거리 등)을 기억하고 있는 유능한 인간 설계사입니다.
- 대답 도중 적어도 1회 이상, 고객의 기억 정보를 자연스럽게 소환하여 "기억 회상 멘트"를 녹여서 사용하십시오.
- 절대 단순 리스트나 프로필 읊기식으로 티 나게 뱉지 말고, 대화의 맥락(흐름)에 맞추어 부드럽게 공감에 엮어야 합니다.
- 💡 적용 예시:
  * 직업 관련: "아무래도 하루 종일 컴퓨터 보시는 직장인이시라 도수치료 청구가 잦으시겠어요~"
  * 자녀 관련: "맞아요, 아까 자녀분도 있으시다고 하셨잖아요. 아이 키우다 보면 진짜 실비 청구할 일이 정말 많거든요~"
  * 기존 고민: "그때 말씀하셨던 보험료 부담 부분이 맘에 걸려서, 동일 보장 대비 최대한 다이어트하는 쪽으로 봐드리고 있어요."`;
    }
  }

  // ── RAG 전문 지식 사전 주입 ──────────────────────────────────────────────────
  let kbInstruction = '';
  if (kbSnippets && kbSnippets.length > 0) {
    kbInstruction = `
[📚 전문 보험 지식 사전 - 정확한 답변을 위해 필수 참고]
${kbSnippets.join('\n\n')}
- 위 요율/규정/약관 사실에 기반하여 질문에 정밀하게 답변하십시오. 절대 거짓이나 임의의 수치로 상상하여 답변하지 마십시오.`;
  }

  // ── [기능8] 고객 성향 맞춤 화법 매뉴얼 주입 ──────────────────────────────────
  let segmentInstruction = '';
  if (customerSegment) {
    let segmentLabel = '';
    let guideText = '';

    if (customerSegment === 'price_sensitive') {
      segmentLabel = '💰 가격민감형 (보험료 절약 우선)';
      guideText = `- 보험료를 최대한 줄이고 다이어트하는 방향으로 설득하십시오.\n- "동일한 보장을 더 저렴한 가격에 비교 설계할 수 있다"는 점과 GA(대리점)의 35개사 비교 강점을 지속적으로 언급하십시오.`;
    } else if (customerSegment === 'coverage_focused') {
      segmentLabel = '🛡️ 보장중시형 (빈틈없는 안전망 우선)';
      guideText = `- 실비 외에 3대 질병(암/뇌/심장) 진단비 및 수술비 등 큰 병에 걸렸을 때 빈틈없이 제대로 보장받을 수 있는 한도 크기를 우선 강조하십시오.\n- "보험이 있어도 보장 한도가 적으면 나중에 크게 후회한다"는 점을 자연스럽게 짚어주십시오.`;
    } else if (customerSegment === 'trust_focused') {
      segmentLabel = '🤝 신뢰중시형 (안전함 및 후기 우선)';
      guideText = `- GA 공식 인증 설계사로서의 전문성과 플랫폼 안전성, 그리고 가입 강요나 전화 독촉이 전혀 없다는 사실을 지속 안심시켜 주십시오.\n- "실제 내 돈을 아낀 다른 분들의 긍정적인 성공 후기나 제 개인적인 사례"를 부드럽게 섞어 답변하십시오.`;
    } else if (customerSegment === 'fast_decider') {
      segmentLabel = '⚡ 빠른결정형 (간결하고 즉각적인 용건 우선)';
      guideText = `- 장황한 인사말, 장황한 공감 리액션, 이모지 남발을 최소화하십시오.\n- 묻는 말에 1~2줄로 바로 답변하고, "본인인증을 하면 0.1초 만에 바로 잠금 해제되어 보고서를 보실 수 있다"처럼 다음 목표 행동 링크를 즉시 제시하십시오.`;
    }

    segmentInstruction = `
[🎯 고객 성향 맞춤 화법 매뉴얼 - 최우선 준수]
현재 분석된 고객의 성향은 **[ ${segmentLabel} ]** 입니다.
${guideText}
- 이 화법 매뉴얼의 톤앤매너를 대화에 100% 반영하여 고객이 마음을 열도록 만드십시오.`;
  }

  // ── 고객의 설계 시뮬레이션 내역 주입 ──────────────────────────────────────────
  let simulationInstruction = '';
  if (ctx.simulationData) {
    const sd = ctx.simulationData;
    const isM = sd.gender === 'M';
    const hasFamily = sd.cancer?.familyHistory ? '있음' : '없음';
    const hasRecurrent = sd.cancer?.recurrentCancer ? '반복지급' : '1회지급';
    const hasTargeted = sd.cancer?.targetedTherapy ? '풀보장' : '진단비만';
    const has2025 = sd.cancer?.treatmentCost2025 ? '포함(추천)' : '미포함';
    
    let renewalLabel = '비갱신형';
    if (sd.cancer?.paymentType === 'renewable') renewalLabel = '갱신형';
    if (sd.cancer?.paymentType === 'targeted') renewalLabel = '표적항암형';

    const premiumText = sd.monthlyPremium ? Number(sd.monthlyPremium).toLocaleString() + '원' : '미산출';
    const amountText = sd.cancer?.currentAmount ? (sd.cancer.currentAmount / 10000).toLocaleString() + '만 원' : '기본설정';

    simulationInstruction = `
[📊 고객이 대화 직전 시뮬레이션해 본 설계 정보]
- 가입자 정보: 연령 ${sd.age || '미확인'}세 / 성별 ${isM ? '남성' : '여성'}
- 설계 코드: ${sd.simulationCode || '미확인'}
- 설계 월 납입료: ${premiumText}
- 상세 암보험 설계 설정:
  * 일반암 진단비: ${amountText}
  * 2025 암주요치료비: ${has2025}
  * 표적항암/원인자: ${hasTargeted}
  * 납입/갱신 유형: ${renewalLabel}
  * 재발/전이암: ${hasRecurrent}
  * 암 가족력: ${hasFamily}

[🤫 상담 가이드라인 - AI 챗봇 자아 완전 봉인 및 대시보드 인지 패턴]
- 당신은 설계사 본인이므로, 고객이 방금 짜서 보낸 위의 시뮬레이션 세부 옵션(예: 월 납입료, 암 진단비 5천만 원 등)을 **대시보드 관리자 화면으로 먼저 모니터링하고 톡방에 들어온 진짜 설계사**처럼 자연스럽게 대화에 녹여야 합니다.
- 절대 "시스템이 정보를 받아왔다", "데이터베이스에 적혀 있다", "챗봇에 입력되었다" 같이 AI나 프로그램을 암시하는 기계적인 정보 획득 경로는 한 글자도 언급하지 마십시오.
- 마치 카톡이나 메시지를 보내기 전에 고객의 설계안을 미리 훑어본 인간 플래너로서 대화하십시오.
- **고객이 보장 금액 한도(예: 5천만 원, 1억 등)의 적절성이나 수술비 등을 질문하거나 걱정할 때, 위의 [📊 고객이 대화 직전 시뮬레이션해 본 설계 정보]의 옵션값들(진단비, 치료비 여부 등)을 직접 끄집어내어 인간 플래너로서 정교하게 비교해 주십시오.**
- 예시 1 (첫 인사): "안녕하세요 고객님! 담당 플래너입니다. 방금 접수해주신 암보험 설계안 알림이 떠서 대시보드 보고 들어왔어요~ 😊 40대이신데 일반암 5천만 원에 비갱신형으로 진짜 야무지게 잘 짜셨더라고요! 특히 암 가족력은 없으신 상태죠?"
- 예시 2 (한도 고민 시 인용): "아! 아까 비교분석 하실 때 암 보장 5천만 원으로 설정해 보셨잖아요~ 😊 40대이시고 가족력까지 있으시다면 일반암 5천에 신규 치료비 5천을 섞어두는 게 1억 단독 설계보다 월 보험료가 훨씬 알뜰하고 든든하실 거예요!"`;
  }

  return `${basePrompt}
${modeInstruction}
${memoryInstruction}
${segmentInstruction}
${simulationInstruction}
${kbInstruction}
${scriptsInstruction}`;
}


// ── Gemini 클라이언트 ──────────────────────────────────────────────────────────
let _ai: GoogleGenAI | null = null;

function getGeminiKey(): string | undefined {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && (process.env as any)?.GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && (process.env as any)?.GOOGLE_API_KEY)
  ) || undefined;
}

function getAI(): GoogleGenAI | null {
  if (_ai) return _ai;
  const key = getGeminiKey();
  if (key) {
    _ai = new GoogleGenAI({ apiKey: key });
    console.log('✅ Insurance Gemini AI initialized successfully');
    return _ai;
  } else {
    console.warn('⚠️ Gemini API key not found for AI Counselor.');
    return null;
  }
}

// ── Gemini 임베딩 벡터 생성 함수 (RAG 의미 분석용, 768차원) ──────────────────────
export async function getEmbedding(text: string): Promise<number[]> {
  const ai = getAI();
  if (!ai || !text.trim()) return [];
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text.trim(),
    });
    const res = response as any;
    if (res.embedding?.values) {
      return res.embedding.values;
    }
    if (res.embeddings?.[0]?.values) {
      return res.embeddings[0].values;
    }
    return [];
  } catch (err) {
    console.warn('[Embedding] Failed to generate embedding:', err);
    return [];
  }
}


// ── 메인 AI 응답 생성 함수 ────────────────────────────────────────────────────
export async function generateAiResponse(
  contents: { role: string; parts: { text: string }[] }[],
  context?: AiContext
): Promise<AiResponseResult> {
  const fallback: AiResponseResult = {
    answer: '죄송합니다, 현재 상담 시스템을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.',
    pos_score: 0,
    neg_score: 0,
    action_type: 'general_response',
    action_score: 0,
    korean_summary: 'AI 응답 생성 실패',
  };

  const ai = getAI();
  if (!ai) return fallback;

  try {
    // RAG Local Semantic Search 실행 (API를 호출하지 않는 100% 안전하고 빠른 로컬 알고리즘)
    let finalContext = context ? { ...context } : {
      cumulativePos: 0,
      cumulativeNeg: 0,
      currentActionScore: 0,
      topScripts: [],
    } as AiContext;

    const userMessages = contents.filter(c => c.role === 'user');
    const lastUserText = userMessages.length > 0 ? userMessages[userMessages.length - 1].parts[0]?.text : '';

    if (lastUserText && (!finalContext.kbSnippets || finalContext.kbSnippets.length === 0)) {
      try {
        const retrieved = retrieveRelevantFaq(lastUserText);
        finalContext.kbSnippets = retrieved;
      } catch (ragErr) {
        console.warn('[RAG] Failed during generateAiResponse RAG retrieval:', ragErr);
      }
    }

    const systemInstruction = buildSystemPrompt(finalContext);

    // 503(혼잡) 및 429(할당량) 임시 오류 방지를 위한 초강력 지수 백오프 재시도 및 모델 폴백 로직
    let response: any = null;
    let lastApiErr: any = null;
    const retryDelay = 1500; 

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash'];

    for (const modelName of modelsToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`[AI Request] Model=${modelName} (Attempt ${attempt}/2)`);
          response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
            },
          });
          if (response) break;
        } catch (apiErr: any) {
          console.warn(`[AI Request] Failed: ${apiErr.message || apiErr}`);
          lastApiErr = apiErr;
          
          // 429 또는 503일 때 대기 후 재시도
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          }
        }
      }
      if (response) break;
    }

    if (!response) {
      throw lastApiErr || new Error('Gemini API call failed after multiple retry attempts');
    }

    const raw = response.text?.trim() || '';

    let parsed: Partial<AiResponseResult> = {};
    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.warn('[AI Score] JSON parse failed:', raw.slice(0, 100));
      return { ...fallback, answer: raw || fallback.answer };
    }

    const actionType  = parsed.action_type || 'general_response';
    const actionScore = ACTION_SCORE_MAP[actionType] ?? 0;

    console.log(`[AI Score] action=${actionType}(${actionScore}) pos=${parsed.pos_score} neg=${parsed.neg_score}`);

    return {
      answer:         parsed.answer         || fallback.answer,
      pos_score:      Math.min(10, Math.max(0, Number(parsed.pos_score) || 0)),
      neg_score:      Math.min(10, Math.max(0, Number(parsed.neg_score) || 0)),
      action_type:    actionType,
      action_score:   actionScore,
      korean_summary: parsed.korean_summary || '',
    };
  } catch (err: any) {
    console.error('[AI Score] Failed to generate AI response:', err);
    return {
      ...fallback,
      answer: `죄송합니다, 현재 상담 시스템을 사용할 수 없습니다. (상세 에러: ${err?.message || JSON.stringify(err)})`
    };
  }
}

// ── 설계 코드 파싱 ─────────────────────────────────────────────────────────────
export function parseCodeFromMessage(message: string): string | null {
  const regex = /([A-Z]{3}-[A-Z0-9]{6})/i;
  const match = message.match(regex);
  return match ? match[1].toUpperCase() : null;
}

// ── 현재 행동 점수에 맞는 consultation_step 반환 ─────────────────────────────
export function actionScoreToStep(score: number): string {
  if (score >= 7) return 'proposal';
  if (score >= 5) return 'verification';
  if (score >= 3) return 'sms_guide';
  if (score >= 2) return 'code_parsed';
  return 'initial';
}

interface FaqItem {
  keywords: string[];
  title: string;
  content: string;
}

// ── RAG 로컬 텍스트 자카드 유사도 및 키워드 가중치 기반 검색 알고리즘 ─────────
function calculateTextSimilarity(query: string, title: string, keywords: string[]): number {
  const cleanText = (t: string) => t.toLowerCase().replace(/[^a-z0-9가-힣\s]/g, '').split(/\s+/).filter(Boolean);
  
  const queryWords = cleanText(query);
  const titleWords = cleanText(title);
  
  if (queryWords.length === 0) return 0;
  
  // 1. 키워드 매칭 점수 계산 (가중치 부여)
  let keywordMatchCount = 0;
  for (const word of queryWords) {
    if (keywords.some(k => word.includes(k.toLowerCase()) || k.toLowerCase().includes(word))) {
      keywordMatchCount += 1.5;
    }
  }
  
  // 2. 제목 자카드 유사도 계산
  const querySet = new Set(queryWords);
  const titleSet = new Set(titleWords);
  
  const intersection = new Set([...querySet].filter(x => titleSet.has(x)));
  const union = new Set([...querySet, ...titleSet]);
  
  const jaccard = union.size > 0 ? intersection.size / union.size : 0;
  
  // 3. 최종 유사도 합산
  return jaccard + (keywordMatchCount / queryWords.length);
}

export function retrieveRelevantFaq(query: string, threshold = 0.25, topN = 2): string[] {
  try {
    const faqs = faqData as FaqItem[];
    const scored = faqs.map(f => {
      const similarity = calculateTextSimilarity(query, f.title, f.keywords);
      return { faq: f, similarity };
    });

    const filtered = scored
      .filter(s => s.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN);

    console.log(`[Local RAG Retrieve] Query="${query}" match count=${filtered.length}`);
    filtered.forEach(s => console.log(` - Match FAQ: "${s.faq.title}" Sim=${s.similarity.toFixed(4)}`));

    return filtered.map(s => `[FAQ 지식: ${s.faq.title}]\n${s.faq.content}`);
  } catch (err) {
    console.warn('[Local RAG Retrieve] Failed to search FAQ locally:', err);
    return [];
  }
}

export async function classifyCustomerSegment(
  conversationHistory: { role: string; text: string }[]
): Promise<'price_sensitive' | 'coverage_focused' | 'trust_focused' | 'fast_decider' | null> {
  const ai = getAI();
  if (!ai || conversationHistory.length === 0) return null;
  
  try {
    const formattedHistory = conversationHistory
      .map(c => `${c.role === 'user' ? '고객' : '설계사'}: ${c.text}`)
      .join('\n');
      
    const systemInstruction = `당신은 대화 로그 분석기입니다. 고객과 설계사의 대화 내용을 바탕으로 고객의 성향을 단 하나의 영문 키워드로 분류해야 합니다.
반드시 아래 4가지 유형 중 하나로만 답변하십시오. (JSON 형식이나 설명 없이 딱 단어 한 개만 반환해야 합니다.)

유형 리스트:
- 'price_sensitive': 보험료 절약, 가격, 할인, 저렴함 등에 극도로 민감하고 비용 부담을 자주 언급하는 성향.
- 'coverage_focused': 진단비, 보장 한도, 특약 유무, 보장 범위가 빵빵한지 등 안전장치의 두께를 중시하는 성향.
- 'trust_focused': 신뢰할 수 있는지, 실제 가입 후기가 어떠한지, 강요나 전화 독촉이 없는지 등 안정성과 신뢰 관계를 우선하는 성향.
- 'fast_decider': 군더더기 없는 짧은 답변을 선호하며, 핵심 용건만 빠르게 묻고 즉각적인 링크나 결론을 요구하는 성향.

대화 로그:
${formattedHistory}

위 유형 중 고객에 해당하는 키워드 단 하나만 출력하십시오:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: '고객의 성향은 무엇입니까?',
      config: {
        systemInstruction,
      }
    });

    const result = response.text?.trim().replace(/['"`\s]/g, '') || '';
    if (['price_sensitive', 'coverage_focused', 'trust_focused', 'fast_decider'].includes(result)) {
      return result as any;
    }
    return null;
  } catch (err) {
    console.warn('[Segment Classification] Failed to classify customer segment:', err);
    return null;
  }
}


