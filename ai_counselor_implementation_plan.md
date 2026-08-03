# [구현 계획서] 실시간 AI 보험설계사 상담 비서 (영업왕 김준현 페르소나)

본 계획서는 하이픈 API 기반 보장 분석 리포트 결과와 연계하여, 0.1초 만에 고객을 사로잡는 **"실시간 고객 상담"** (인앱 AI 및 설계사 개입 하이브리드) 시스템의 설계도와 마스터 블루프린트입니다. 본 시스템은 **"보험 비교 분석"** 및 **"내보험 정밀 분석"** 모드 모두에 동일하게 적용됩니다.

---

## 1. 아키텍처 및 시스템 데이터 흐름 (Data Flow)

```mermaid
graph TD
    User[고객: 비교 분석 또는 정밀 분석 완료] --> A{planners.is_ai_enabled == true?}
    A -- No --> B[기본 카톡 오픈채팅방 연결 버튼 노출]
    A -- Yes --> C[인앱 "실시간 고객 상담" Widget/모달 활성화]
    
    C --> D1[고객 & AI: 실시간 대화 및 안내 시작]
    D1 --> D2[고객: 설계 코드 입력하여 SMS 인증 유도 받음]
    D2 --> D3[고객: SMS 인증 완료 ➔ 마스킹 즉시 해제]
    
    %% 실시간 모니터링 및 언제든지 개입 가능 구조 표현
    C -.-> |언제든지 실시간 대화 감시| AdminMonitor[설계사 어드민: 실시간 대화 모니터링]
    D1 -.-> AdminMonitor
    D2 -.-> AdminMonitor
    D3 -.-> AdminMonitor
    
    AdminMonitor --> Intervene{설계사가 직접 메시지 입력/전송?}
    Intervene -- Yes --> Toggle[customer_leads.is_bot_active = false 설정]
    Toggle --> ManualChat[AI 답변 차단 및 1:1 수동 실시간 상담 전환]
```

---

## 2. 슈퍼베이스(Supabase) 데이터베이스 설계 준수 사항

수정 단계 없이 기존 원격 슈퍼베이스의 구조를 100% 매핑하여 작동하도록 구성합니다.

* **`planners` 테이블**:
  - `is_ai_enabled (boolean)`: 해당 설계사의 개인 화면에서 AI 상담 비서 가동 여부를 설정합니다.
  - `deliberation_code (text/object)`: 보험 대리점 협회 심의필 번호를 동적으로 노출합니다.
* **`customer_leads` 테이블**:
  - `is_bot_active (boolean)`: 해당 고객의 상담 건에 대해 AI가 응답 중인지를 기록합니다. 이 값이 `false`가 되면 AI는 응답을 멈춥니다.
  - `status (text)`: `'new'`, `'verified'` 등으로 고객 인증 상태를 나타냅니다.
* **`chat_messages` 테이블**:
  - `id (uuid, PK)`
  - `room_id (text)`: 고객 휴대폰 번호 또는 세션 ID 기반의 고유 룸 ID
  - `sender_type (text)`: `'user'` (고객), `'bot'` (AI 비서), `'planner'` (설계사)
  - `message_text (text)`: 메시지 본문
  - `created_at (timestamp)`
* **`chat_room_members` 테이블**:
  - 대화방의 활성화 세션 및 참여자 매핑 관리

---

## 3. 최고의 보험 영업왕 AI 페르소나 및 프롬프트 정의

#### 파일 위치: [aiPersona.ts](file:///c:/Users/zkfnt/Desktop/insurance-comparison-main/insurance-comparison-main/src/lib/insurance/aiPersona.ts)

"실시간 고객 상담"의 아이덴티티를 명확히 하여 다음과 같이 프롬프트 규칙을 정의합니다.

```typescript
export const INSURANCE_AI_SYSTEM_PROMPT = `당신은 대한민국 최고의 보험 대리점(GA) 소속의 공식 파트너이자, 35개 보험사의 상품과 요율을 완벽히 꿰뚫고 있는 세계 최고의 보험 영업 왕 [김준현 보험설계사 AI 비서]입니다.
고객이 가입 중인 기존 보험의 불필요한 거품을 걷어내는 '보험료 다이어트'와 부족한 보장을 채워주는 '보장 업그레이드'를 통해 고객이 안전하게 자산을 지키도록 돕는 것이 당신의 임무입니다.
현재 고객은 "실시간 고객 상담" 창을 통해 대화하고 있습니다.
최종 목표는 사용자가 설계안 코드(예: REX-DA4JGR)를 제공하면 이를 인식하고 본인인증(SMS 인증)을 수행할 수 있도록 안내하여, 마스킹을 해제하고 상담을 확정하는 [상담 신청 완료 (customer_leads 등록 및 verified)] 단계에 이르게 만드는 것입니다.

[상담 및 영업 태도: 여유와 절제]
1. 이름: 김준현 (보험 전문 상담 파트너)
2. 태도: 매우 상냥하고 전문적이며, 자신감이 넘치고 신뢰감을 주는 어조입니다.
3. 여유로운 리드: 조급하게 여러 개의 질문을 던지거나 가입을 강요하지 마십시오. 고객이 부담 없이 반응할 수 있도록 한 턴에 오직 하나의 간단한 질문이나 다음 행동 제안만 던지십시오.
4. AI 표현 배제: 자신을 "AI", "챗봇", "프로그램", "시스템"으로 표현하지 마십시오. 당신은 실제 설계사를 보조하여 고객을 만나는 책임감 있는 사람처럼 말해야 합니다. "데이터베이스 조회 결과" 대신 "제가 요율표를 꼼꼼하게 비교해 보니까..." 같은 표현을 쓰십시오.
5. 코드 감지 시 동작: 고객이 영어 대문자와 숫자 조합의 고유 설계 코드(예: REX-DA4JGR)를 보내면, "코드가 확인되었습니다! 실명 정보 및 상세 분석 결과를 해제하기 위해 본인인증을 진행해 주세요."라고 하며 안전 인증 링크 버튼을 즉시 제시하십시오.

[메신저 대화 철칙: 절대 길게 말하지 말 것]
- 한 번 답장할 때 구구절절 긴 문단으로 작성하지 말고, 메신저 톡 스타일로 간결하게 끊어 쓰십시오.
- 정보 전달이 많아야 한다면, '|' 기호를 문장 사이에 삽입하여 여러 개의 말풍선으로 나누어 보내되, 한 번에 최대 2개 이하의 말풍선만 연달아 보내십시오.

[응답 작성 지침]
- 첫 문장은 반드시 고객의 이전 말에 깊이 공감하거나 짧게 맞장구를 치는 리액션으로 시작하며, 뒤에 '|' 부호를 입력하여 시간차 전송 효과를 구현합니다.
- 감정적 이모지(🥺, 👍, 😅, 😊)와 물결표(~), 말줄임표(...)를 어투가 부드럽게 들리도록 자연스러운 빈도로 섞어서 작성하십시오.
`;
```

---

## 4. Proposed Changes (변경 예정 파일 목록)

### [Component: AI Chat Integration]

#### [NEW] [aiPersona.ts](file:///c:/Users/zkfnt/Desktop/insurance-comparison-main/insurance-comparison-main/src/lib/insurance/aiPersona.ts)
- `INSURANCE_AI_SYSTEM_PROMPT` 상수 정의.
- 입력된 메시지에서 설계안 코드를 자동 파싱하고, DB의 lead 상태 조회 후 본인인증 링크/버튼 렌더링용 응답 반환 로직 구현.
- Gemini API (`gemini-2.5-flash`) 연동 모듈 정의.

#### [NEW] [AiChatWidget.tsx](file:///c:/Users/zkfnt/Desktop/insurance-comparison-main/insurance-comparison-main/src/components/chat/AiChatWidget.tsx)
- 고객 결과 화면 우측 하단에 위치할 플로팅 형태의 **"실시간 고객 상담"** 컴포넌트.
- 디자인 시스템 및 글라스모피즘 스타일을 적용하여 프리미엄한 인앱 채팅창 구현.
- Supabase `chat_messages` 테이블 실시간 구독 및 전송 구현.
- `|` 기호 파싱을 통한 시간차 말풍선 노출 효과 지원.
- AI가 보낸 인증 버튼 클릭 시, 인앱에서 바로 [HyphenAuthModal.tsx](file:///c:/Users/zkfnt/Desktop/insurance-comparison-main/insurance-comparison-main/src/components/insurance/remodeling/HyphenAuthModal.tsx)이 열리도록 브라우저 내 상태 결합.

#### [NEW] [LiveChatConsole.tsx](file:///c:/Users/zkfnt/Desktop/insurance-comparison-main/insurance-comparison-main/src/components/admin/LiveChatConsole.tsx)
- 설계사 어드민 콘솔 내에 삽입될 실시간 라이브 채팅 제어창.
- 현재 진행 중인 "실시간 고객 상담" 내용을 감시하며, **고객의 본인인증 완료 여부와 관계없이 대화 시작 직후부터 언제든지** 설계사가 직접 답장을 보내는 즉시 `customer_leads.is_bot_active = false`로 자동 토글되어 AI 자동 응답이 중단되고 1:1 라이브 상담 모드로 전환되도록 제어.

#### [MODIFY] [useAdminState.ts](file:///c:/Users/zkfnt/Desktop/insurance-comparison-main/insurance-comparison-main/src/hooks/useAdminState.ts)
- 실시간 대화 목록 조회 및 `is_bot_active` 상태 전환 액션 함수(`toggleBotActivity`, `sendPlannerMessage`) 구현.

#### [MODIFY] [App.tsx](file:///c:/Users/zkfnt/Desktop/insurance-comparison-main/insurance-comparison-main/src/App.tsx)
- 비교 분석(Comparison) 및 정밀 분석(Remodeling) 모드 구분 없이, `planners.is_ai_enabled`가 활성화되어 있으면 화면 하단 플로팅 바에서 복사한 코드를 기반으로 **"실시간 고객 상담"** 위젯을 노출하고 상호작용하도록 연동.
- 인증 성공 시 `isUnlocked` 상태를 `true`로 갱신하여 두 화면 모두 마스킹이 해제되도록 결합.
- Supabase Realtime 구독을 활용하여 다른 디바이스에서의 인증 성공 건에 대해서도 고객 브라우저 화면의 마스킹이 실시간 해제되도록 구독 로직 추가.

## 5. 개별 고객 집중 상담(📌) 및 전체 마스터 토글 설계

### A. 개별 고객 "집중 상담" (Pin & Focus) 기능
* **작동 기전**:
  1. 설계사가 개별 대화방 상단 헤더의 `[📌 집중 상담 지정]` 버튼을 클릭합니다.
  2. 해당 방의 ID가 설계사의 `localStorage`에 `pinned_rooms` 목록으로 추가되어 로컬에 영구 보존됩니다.
  3. 동시에 `customer_leads` 테이블의 `is_bot_active` 값을 `false`로 강제 업데이트하여 **AI 자동 응답을 일시 정지(Intervene)** 시킵니다.
  4. 대화방 목록 렌더링 시, 고정된 룸은 다른 모든 대화방을 제치고 **목록 최상단에 붉은색 테두리 강조 배지**와 함께 고정(Pin)됩니다.
  5. 집중 상담을 완료하고 `[🤖 AI 상담으로 복귀]` 버튼을 누르면 `pinned_rooms`에서 삭제되고 AI 비서 상태가 `is_bot_active = true`로 복구됩니다.
* **이점**: 설계사는 나머지 고객들을 AI에게 전담(논스톱 응대)시킨 상태에서, 수동 응대가 절실한 중요 고객 한 명에게만 집중 마크하여 상담 효율을 극대화합니다.

### B. 전체 고객 마스터 제어 스위치 (Global Master Switch)
* **작동 기전**:
  - 고객 상담 대기 화면(고객 선택 전 빈 화면)에 마스터 버튼이 추가됩니다:
    1. **`[👤 모든 고객 AI 일시정지]`**: 현재 활성화된 이 설계사의 모든 대화방(룸 목록에 있는 방들)의 `is_bot_active`를 `false`로 일괄 업데이트합니다.
    2. **`[🤖 모든 고객 AI 자동응대]`**: 집중 상담방(`pinned_rooms`)을 제외한 나머지 모든 대화방의 `is_bot_active`를 `true`로 일괄 복구합니다.

---

## 6. Verification Plan (검증 계획)

### 1) 자동화 테스트
- `npx tsc --noEmit`를 실행하여 컴파일 타임에 타입 에러나 임포트 누락이 없는지 확인합니다.
- `npm run build`를 실행하여 프로덕션 빌드 성공 여부를 체크합니다.

### 2) 수동 검증 및 시나리오 테스트
- **개별 핀(📌) 및 AI 정지 제어 검증**:
  - 특정 고객 상담방에서 `[📌 집중 상담 지정]` 버튼 클릭 시, 해당 대화방이 최상단으로 올라가고 `is_bot_active: false`로 바뀌어 설계사만 말할 수 있게 되는지 확인합니다.
  - 해당 방에서 `[🤖 AI 상담으로 복귀]` 클릭 시, 최상단 고정이 해제되고 `is_bot_active: true`로 복구되는지 검증합니다.
- **전체 마스터 스위치 검증**:
  - 고객 상담 대기 화면에서 `[👤 모든 고객 AI 일시정지]` 버튼 클릭 시, 모든 대화방의 AI 상태가 수동(👤)으로 전환되는지 확인합니다.
  - `[🤖 모든 고객 AI 자동응대]` 클릭 시, 📌 고정된 방을 제외하고 일괄 AI 모드(🤖)로 가동되는지 최종 검증합니다.
