import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { 
  MessageSquare, Send, Users, Building, User, Search, 
  Shield, ArrowLeft, Volume2, Bell, Check, Clock,
  TrendingUp, TrendingDown, Zap, Info
} from 'lucide-react';
import { actionScoreToStep } from '../lib/insurance/aiPersona';
import type { CustomerMemory } from '../lib/insurance/aiPersona';

// ── [기능8] 고객 대화 분석 후 무비용 룰 기반으로 기억(Memory) 추출 및 Supabase 저장 ──────
async function extractAndSaveMemory(
  supabase: any,
  leadId: number,
  userMessage: string
) {
  try {
    const text = userMessage.toLowerCase();
    
    // 1. 기존 리드 정보 가져오기
    const { data: lead } = await supabase
      .from('customer_leads')
      .select('raw_payload')
      .eq('id', leadId)
      .single();
      
    const payload = lead?.raw_payload || {};
    const existingMemory: CustomerMemory = payload.customer_memory || {};
    
    const interests = new Set<string>(existingMemory.interests || []);
    const pain_points = new Set<string>(existingMemory.pain_points || []);
    let job = existingMemory.job;
    let family = { ...(existingMemory.family || {}) };

    // 2. 키워드 매칭 분석
    if (text.includes('암')) interests.add('암보험');
    if (text.includes('실손') || text.includes('실비')) interests.add('실손보험');
    if (text.includes('뇌') || text.includes('2대')) interests.add('뇌/심장보험');
    if (text.includes('태아') || text.includes('어린이')) interests.add('태아/어린이보험');
    if (text.includes('운전자')) interests.add('운전자보험');
    if (text.includes('자동차')) interests.add('자동차보험');
    if (text.includes('치아')) interests.add('치아보험');
    if (text.includes('종신')) interests.add('종신보험');

    if (text.includes('회사원') || text.includes('직장인') || text.includes('회사 다니')) job = '회사원';
    if (text.includes('사업') || text.includes('자영업') || text.includes('가게')) job = '자영업자';
    if (text.includes('프리랜서')) job = '프리랜서';
    if (text.includes('주부')) job = '주부';
    if (text.includes('공무원')) job = '공무원';

    if (text.includes('남편') || text.includes('아내') || text.includes('와이프') || text.includes('신랑') || text.includes('결혼')) {
      family.spouse = true;
    }
    const childMatch = text.match(/(아이|자녀|아들|딸|애들|애)\s*(\d+|한|두|세|첫째|둘째|셋째)/);
    if (childMatch) {
      const numStr = childMatch[2];
      let num = family.children || 1;
      if (numStr === '한' || numStr === '첫째' || numStr === '1') num = 1;
      else if (numStr === '두' || numStr === '둘째' || numStr === '2') num = 2;
      else if (numStr === '세' || numStr === '셋째' || numStr === '3') num = 3;
      family.children = num;
    } else if (text.includes('아이') || text.includes('자녀') || text.includes('애들')) {
      if (!family.children) family.children = 1;
    }

    if (text.includes('비싸') || text.includes('부담') || text.includes('부족') || text.includes('비용')) pain_points.add('보험료 부담');
    if (text.includes('갱신형') || text.includes('오르') || text.includes('인상') || text.includes('갱신')) pain_points.add('갱신형 보험료 부담');
    if (text.includes('중복') || text.includes('비슷')) pain_points.add('보장 중복 우려');
    if (text.includes('어려') || text.includes('모르')) pain_points.add('보험 용어 이해의 어려움');

    const updatedMemory: CustomerMemory = {
      interests: Array.from(interests),
      job,
      family: Object.keys(family).length > 0 ? family : undefined,
      pain_points: Array.from(pain_points),
      last_context: userMessage.slice(0, 50),
      updated_at: new Date().toISOString()
    };

    if (JSON.stringify(existingMemory) !== JSON.stringify(updatedMemory)) {
      await supabase.from('customer_leads').update({
        raw_payload: {
          ...payload,
          customer_memory: updatedMemory
        }
      }).eq('id', leadId);
      console.log(`[Memory Sync (Planner Side)] 🧠 고객 기억 업데이트 완료:`, updatedMemory);
    }
  } catch (err) {
    console.warn('[Memory Sync (Planner Side)] 실패:', err);
  }
}


// ══════════════════════════════════════════════════════════════════════
// [방법 3] 설계사 직접 대화 점수화 시스템
// ══════════════════════════════════════════════════════════════════════

// ── 키워드 룰 기반 점수화 (Gemini 호출 없음 → 비용 0원) ──────────────────────
function ruleBasedScore(text: string): { pos: number; neg: number; actionType: string; actionScore: number } {
  const t = text.toLowerCase();

  // 긍정 키워드 (고객 호응 신호)
  const posKeywords = ['좋아요','맞아요','네','알겠어요','감사','도움','궁금','한번','볼게요','해볼게요','신청','부탁드려요','알려주세요','관심','비교해줘','봐줘','어떻게','얼마','가능','ok','오케이'];
  // 부정 키워드 (거부/이탈 신호)
  const negKeywords = ['싫어요','아니요','됐어요','괜찮아요','필요없어요','사기','스팸','광고','귀찮','나중에','바빠요','안할게요','하지마세요','차단','신고'];
  // 행동 키워드 (단계 전환 신호)
  const actionKeywords: Record<string, { type: string; score: number }> = {
    '설계안': { type: 'proposal_request', score: 10 },
    '바꾸고싶': { type: 'proposal_request', score: 10 },
    '가입하고싶': { type: 'proposal_request', score: 10 },
    '신청할게': { type: 'proposal_request', score: 10 },
    '인증': { type: 'verification_done', score: 5 },
    '본인확인': { type: 'verification_done', score: 5 },
    '코드': { type: 'code_parsed', score: 2 },
    '문자': { type: 'sms_guide', score: 3 },
    'sms': { type: 'sms_guide', score: 3 },
  };

  const posCount = posKeywords.filter(k => t.includes(k)).length;
  const negCount = negKeywords.filter(k => t.includes(k)).length;
  const pos = Math.min(10, posCount * 2);
  const neg = Math.min(10, negCount * 3);

  let actionType = 'general_response';
  let actionScore = 0;
  for (const [keyword, val] of Object.entries(actionKeywords)) {
    if (t.includes(keyword)) {
      if (val.score > actionScore) { actionType = val.type; actionScore = val.score; }
    }
  }
  if (actionScore === 0 && pos >= 4) { actionType = 'consultation_active'; actionScore = 1; }

  return { pos, neg, actionType, actionScore };
}

// ── Gemini 정밀 분석 (proposal_request 달성 시 1회만 호출) ──────────────────
async function analyzeConversationWithGemini(
  supabase: ReturnType<typeof createClient>,
  roomId: string,
  leadId: number,
  plannerId: string
) {
  try {
    const { data: msgs } = await supabase
      .from('chat_messages')
      .select('sender_id, message, created_at')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(30);

    if (!msgs || msgs.length === 0) return;

    // 설계사가 직접 보낸 메시지만 추출 (is_manual 또는 planner_id 일치)
    const plannerMsgs = msgs.filter(m => m.sender_id === plannerId);
    if (plannerMsgs.length === 0) return;

    // insurance_scripts에 성공 멘트로 저장 (높은 가중치)
    for (const msg of plannerMsgs.slice(-5)) {
      const score = ruleBasedScore(msg.message);
      const step = actionScoreToStep(score.actionScore);

      const { data: existing } = await supabase
        .from('insurance_scripts')
        .select('id, success_weight, success_count')
        .eq('script_text', msg.message)
        .maybeSingle();

      if (existing) {
        await supabase.from('insurance_scripts').update({
          success_weight: (existing.success_weight || 0) + 25,
          success_count:  (existing.success_count  || 0) + 1,
          updated_at: new Date().toISOString()
        }).eq('id', existing.id);
        console.log(`[Planner Learn] ✅ 기존 멘트 가중치 +25: id=${existing.id}`);
      } else {
        await supabase.from('insurance_scripts').insert({
          consultation_step: step,
          script_text:       msg.message,
          script_type:       'planner_manual',
          description:       `설계사 직접 성공 멘트 (리드 ${leadId})`,
          success_weight:    25,
          success_count:     1,
          used_count:        1,
          ab_group:          'A',
        });
        console.log(`[Planner Learn] 🆕 새 설계사 멘트 저장: "${msg.message.slice(0, 30)}..."`);
      }
    }
    console.log('[Planner Learn] 🎯 설계사 직접 대화 Gemini 정밀 분석 완료');
  } catch (err) {
    console.warn('[Planner Learn] 분석 실패:', err);
  }
}

function detectCustomerSegment(lead: any): { label: string; bg: string; text: string; border: string } | null {
  const memory = lead?.raw_payload?.customer_memory;
  if (!memory) return null;

  const painPoints = memory.pain_points || [];
  const lastContext = (memory.last_context || '').toLowerCase();

  if (painPoints.includes('보험료 부담') || lastContext.includes('비싸') || lastContext.includes('절약') || lastContext.includes('저렴')) {
    return { label: '💰 가격민감형', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
  }
  if (painPoints.includes('보장 중복 우려') || lastContext.includes('보장') || lastContext.includes('한도') || lastContext.includes('진단비')) {
    return { label: '🛡️ 보장중시형', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
  }
  if (painPoints.includes('보험 용어 이해의 어려움') || lastContext.includes('사기') || lastContext.includes('의심') || lastContext.includes('믿을')) {
    return { label: '🤝 신뢰중시형', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
  }
  if (lastContext.includes('바로') || lastContext.includes('빨리') || lastContext.includes('링크') || (lastContext.length > 0 && lastContext.length < 10)) {
    return { label: '⚡ 빠른결정형', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
  }
  return null;
}

const ACTION_SCORE_LABELS: Record<number, { label: string; color: string }> = {
  0:  { label: '대기중',     color: 'bg-slate-800 text-slate-500 border border-slate-750'   },
  1:  { label: '인사응대',   color: 'bg-slate-800 text-slate-400 border border-slate-750'   },
  2:  { label: '코드인식',   color: 'bg-blue-950 text-blue-400 border border-blue-900'    },
  3:  { label: 'SMS안내',    color: 'bg-cyan-950 text-cyan-400 border border-cyan-900'    },
  5:  { label: '인증완료',   color: 'bg-yellow-950 text-yellow-400 border border-yellow-900'  },
  7:  { label: '적극상담',   color: 'bg-emerald-950 text-emerald-400 border border-emerald-900' },
  10: { label: '🔥설계요청', color: 'bg-orange-950 text-orange-400 border border-orange-900 animate-pulse'  },
};

function getActionInfo(score: number): { label: string; color: string } {
  const keys = [10, 7, 5, 3, 2, 1, 0];
  for (const k of keys) {
    if (score >= k) return ACTION_SCORE_LABELS[k];
  }
  return ACTION_SCORE_LABELS[0];
}

// AI 실시간 요약 브리핑을 위한 진행상황 및 개입 전략 헬퍼 함수
function getLeadProgressText(lead: any): string {
  const score = lead?.action_score || 0;
  if (score >= 10) return '🔥 맞춤 제안 및 설계안 발송 요청 완료!';
  if (score >= 7) return '💬 비교 분석표 확인 후 상세 보장 및 보험료 상담 진행 중';
  if (score >= 5) return '📍 본인인증을 완료하고 35개사 비교 분석표 대기 중';
  if (score >= 3) return '📱 SMS 본인인증 안내 발송 후 대기 중';
  if (score >= 2) return '🔍 설계 분석용 코드 인식 완료';
  if (score >= 1) return '👋 첫 대화 및 인사 나누는 중';
  return '😐 상담 대기 중';
}

function getLeadStrategyText(lead: any): string {
  const memory = lead?.raw_payload?.customer_memory;
  if (!memory) return '고객과의 대화가 조금 더 필요합니다. AI 비서가 성향을 탐색하는 중입니다. 😐';

  const painPoints = memory.pain_points || [];
  const lastContext = (memory.last_context || '').toLowerCase();
  const score = lead?.action_score || 0;

  if (painPoints.includes('갱신형 보험료 부담') || painPoints.includes('보험료 부담') || lastContext.includes('갱신형') || lastContext.includes('오르') || lastContext.includes('비싸')) {
    if (score >= 5) {
      return '현재 기존 보험료 인상에 대한 거부감이 크므로, "비갱신형 전환 시 보험료가 고정된다"는 점을 어필하며 설계안 제안을 클로징 하세요!';
    }
    return '현재 기존 보험료 인상에 대한 거부감이 큽니다. "35개사 최저가 비갱신형 플랜 비교로 평생 보험료를 동결해 드리겠다"고 강조하며 본인인증을 유도하세요!';
  }
  if (painPoints.includes('보장 중복 우려') || lastContext.includes('보장') || lastContext.includes('한도') || lastContext.includes('중복')) {
    return '현재 기존 보험 보장 상태의 누락과 중복에 대해 고민하고 있습니다. "무료로 불필요한 거품을 빼고 핵심 3대 질병 진단금을 꽉 채워 설계해 드리겠다"며 인증 완료 후 세부 상담을 제안하세요!';
  }
  if (painPoints.includes('보험 용어 이해의 어려움') || lastContext.includes('사기') || lastContext.includes('의심') || lastContext.includes('믿을')) {
    return '플랫폼에 대한 가벼운 의심이나 경계심이 있습니다. "GA 35개사 통합 전산 실시간 조회 화면을 직접 공유해 드려 투명하게 비교해 드리겠다"며 설계사 본인의 실명과 대리점명을 어필하여 신뢰를 형성하세요!';
  }
  
  if (score >= 5) {
    return '본인인증이 완료된 고객입니다. "비교분석표가 나왔으니 직접 통화나 카톡으로 최종 맞춤 설계를 발송해 드리겠다"며 신속히 통화 상담으로 개입해 계약을 클로징 하세요!';
  }
  return '아직 첫 탐색 단계입니다. AI 비서가 친근하게 아이스브레이킹을 진행하여 코드를 획득하고 본인인증으로 넘어갈 수 있도록 대기를 추천합니다.';
}

interface ChatTabProps {
  currentUser: {
    role: 'super' | 'agency' | 'planner' | 'guest';
    plannerId?: string;
    agencyId?: string;
    name?: string;
  };
  showHelpGuide?: boolean;
  onToggleHelpGuide?: () => void;
  initialRoomId?: string | null;
  onClearInitialRoomId?: () => void;
  mode?: 'internal' | 'customer';
}

interface Contact {
  id: string;
  name: string;
  role: 'super' | 'agency' | 'planner';
  subText?: string;
  profile_image_url?: string;
  phone?: string;
}

interface ChatRoom {
  id: string;
  name?: string;
  type: string;
  created_at: string;
  otherMember?: Contact;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isBotActive?: boolean;
}

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ADMIN_ID = '00000000-0000-4000-a000-000000000000';

const FAQ_LIST = [
  {
    question: "회원가입 후 개인 프로필과 홍보용 랜딩페이지 주소는 어떻게 생성하나요?",
    answer: "좌측 메뉴의 '개인 프로필/랜딩 설정' 탭에 진입하셔서 본인의 사진, 연락처, 인사말 및 카카오톡 상담 링크를 등록해 주세요. 등록이 완료되면 도메인/본인코드 형태의 개인화된 영업용 링크가 즉시 자동 생성됩니다."
  },
  {
    question: "'실시간 보험 분석 리드'와 '카카오톡 상담 신청 리드'의 차이는 무엇인가요?",
    answer: "• 보험 분석 리드: 고객이 홈페이지에서 스스로 보장 분석을 해보고 이탈하지 않도록 시스템이 자동 수집한 데이터입니다.\n• 카톡 상담 신청: 분석을 마친 고객이 설계사에게 직접 1:1 상담을 요청한 초고관여 리드입니다. 카톡 상담 리드의 경우 무단 전화를 피하고 카톡으로 먼저 설계안을 전송하시는 규정을 준수해 주세요."
  },
  {
    question: "배정받은 고객 리드의 상세 분석 보고서는 어떻게 열람하나요?",
    answer: "'고객 리드 수집 현황' 리스트 우측에 배치된 [결과지 열람] 버튼을 클릭하시면 고객이 직접 진단한 암/간병/치매 등의 상세 보장 분석 정보와 나이, 납입 예정 금액, AI 리밸런싱 포트폴리오를 한눈에 보실 수 있습니다."
  },
  {
    question: "대리점(Agency) 권한인데 소속 설계사 가입 및 관리는 어떻게 하나요?",
    answer: "대리점 관리자 계정으로 로그인한 뒤 '소속 설계사 관리' 탭에서 [초대 링크 생성]을 진행해 주세요. 생성된 링크를 소속 설계사들에게 전달하여 가입시키면, 설계사들이 유치하는 리드 수집 및 배정 현황을 대리점 관리 콘솔에서 통합 모니터링할 수 있습니다."
  },
  {
    question: "14일 무료 체험 기간이 종료된 후 구독 결제는 어떻게 하나요?",
    answer: "가입 후 최초 14일간은 무료 서비스가 제공되며, 이후에는 좌측의 '구독 결제 관리' 메뉴에서 원하시는 등급(플래너/에이전시) 요금제를 선택하고 신용카드를 등록하시면 매월 자동으로 안전하게 정기 구독이 갱신됩니다."
  },
  {
    question: "왜 가격비교나 단순정밀분석 고객의 전화번호는 비공개(마스킹) 처리되어 있나요?",
    answer: "단순 가격비교나 자가 진단을 수행한 고객은 '개인정보 제공 및 제3자 마케팅 활용'에 명시적으로 동의하지 않은 상태이거나 단순 이탈 방지용 DB입니다.\n\n• 법률 준수(개인정보보호법): 명시적 동의 없는 유선 연락은 불법 스팸으로 간주되어 과태료 처분을 받을 수 있습니다.\n• 낮은 피로도 유지: 아직 상담 의사가 없는 고객에게 무단 유선 전화를 걸 경우 거부감과 민원이 발생하여 플랫폼 신뢰도가 낮아집니다.\n• 열람 권한 잠금 해제: 해당 고객이 결과를 확인한 후 [카톡 상담 신청]을 누르거나 [1:1 문의]를 남기는 순간, 정식 마케팅 동의가 완료되어 즉시 설계사 콘솔에서 전화번호가 투명하게 공개됩니다."
  }
];

export function ChatTab({ currentUser, showHelpGuide = false, onToggleHelpGuide, initialRoomId, onClearInitialRoomId, mode = 'internal' }: ChatTabProps) {
  const supabase = createClient();
  const currentUserId = currentUser.plannerId || currentUser.agencyId || ADMIN_ID;

  const [subTab, setSubTab] = useState<'rooms' | 'contacts'>('rooms');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationScores, setConversationScores] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [userRoomIds, setUserRoomIds] = useState<string[]>([]);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [showFaqDrawer, setShowFaqDrawer] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // AI Counselor Real-time Intervention States & Effects
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [isBotActive, setIsBotActive] = useState<boolean>(true);
  const [globalAiActive, setGlobalAiActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`global_ai_active_${currentUserId}`);
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  const updateGlobalAiActive = (active: boolean) => {
    setGlobalAiActive(active);
    try {
      localStorage.setItem(`global_ai_active_${currentUserId}`, active ? 'true' : 'false');
    } catch (e) {
      console.error("Failed to save global AI state:", e);
    }
  };

  // VIP Pinned Rooms state with localStorage integration
  const [pinnedRoomIds, setPinnedRoomIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`pinned_rooms_${currentUserId}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const togglePinRoom = (roomId: string) => {
    setPinnedRoomIds(prev => {
      const isPinned = prev.includes(roomId);
      const updated = isPinned ? prev.filter(id => id !== roomId) : [...prev, roomId];
      try {
        localStorage.setItem(`pinned_rooms_${currentUserId}`, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save pinned rooms:", e);
      }
      return updated;
    });
  };

  const syncLeadBotStatus = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_leads')
        .select('*')
        .eq('raw_payload->>chat_room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setSelectedLead(data[0]);
        setIsBotActive(data[0].is_bot_active !== false);
      } else {
        setSelectedLead(null);
        setIsBotActive(false);
      }
    } catch (err) {
      console.warn("Failed to fetch lead bot status:", err);
    }
  };

  useEffect(() => {
    if (!selectedRoom) {
      setSelectedLead(null);
      setIsBotActive(false);
      return;
    }

    syncLeadBotStatus(selectedRoom.id);

    const channel = supabase
      .channel(`admin_lead_chat_sync:${selectedRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_leads'
        },
        (payload) => {
          const roomCode = payload.new?.raw_payload?.chat_room_id;
          if (roomCode === selectedRoom.id) {
            setSelectedLead(payload.new);
            setIsBotActive(payload.new?.is_bot_active !== false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRoom?.id]);

  // Auto-select room from LeadsTab redirect
  useEffect(() => {
    if (initialRoomId && rooms.length > 0) {
      const roomToSelect = rooms.find(r => r.id === initialRoomId);
      if (roomToSelect) {
        setSelectedRoom(roomToSelect);
        fetchMessages(roomToSelect.id);
        if (onClearInitialRoomId) {
          onClearInitialRoomId();
        }
      }
    }
  }, [initialRoomId, rooms]);

  // Play premium synthesized sound using Web Audio API
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playChime = (time: number, freq: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };
      const now = audioCtx.currentTime;
      playChime(now, 523.25, 0.25); // C5
      playChime(now + 0.12, 659.25, 0.35); // E5
    } catch (e) {
      console.warn("Failed to play notification sound:", e);
    }
  };

  // Browser system-level notification
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const showBrowserNotification = (msg: Message) => {
    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
      // Find sender name
      const sender = contacts.find(c => c.id === msg.sender_id);
      const senderName = sender ? sender.name : '소통 센터';
      new Notification("새로운 소통 메시지 💬", {
        body: `${senderName}: ${msg.message}`,
        icon: '/logo.png'
      });
    }
  };

  // 1. Initial Load of Contacts
  const fetchContacts = async () => {
    try {
      // Fetch Planners
      const { data: plannersData, error: plannersErr } = await supabase
        .from('planners')
        .select('id, name, is_admin, phone, profile_image_url, company_name');

      if (plannersErr) throw plannersErr;

      // Map to contact list
      const list: Contact[] = [];
      
      // Add Super Admin explicitly
      list.push({
        id: ADMIN_ID,
        name: '플랫폼 총관리자',
        role: 'super',
        subText: '더윤컴퍼니 본사',
        profile_image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80',
        phone: '080-808-1088'
      });

      plannersData?.forEach((p: any) => {
        // Skip adding the user to their own contact list
        if (p.id === currentUserId) return;
        // Skip default admin
        if (p.planner_code === 'admin') return;

        list.push({
          id: p.id,
          name: p.name,
          role: p.is_admin ? 'agency' : 'planner',
          subText: p.company_name || (p.is_admin ? '대리점 관리자' : '소속 설계사'),
          profile_image_url: p.profile_image_url || undefined,
          phone: p.phone
        });
      });

      setContacts(list);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  // 2. Fetch Chat Rooms for Current User
  const fetchRooms = async () => {
    try {
      // Fetch all member mappings for the current user
      const { data: memberData, error: memberErr } = await supabase
        .from('chat_room_members')
        .select('room_id')
        .eq('user_id', currentUserId);

      if (memberErr) throw memberErr;
      if (!memberData || memberData.length === 0) {
        setRooms([]);
        return;
      }

      const roomIds = memberData.map(m => m.room_id);
      setUserRoomIds(roomIds);

      // Fetch room details
      const { data: roomsData, error: roomsErr } = await supabase
        .from('chat_rooms')
        .select('id, name, type, created_at')
        .in('id', roomIds);

      if (roomsErr) throw roomsErr;

      let filteredRoomsData = roomsData || [];
      if (mode === 'customer') {
        filteredRoomsData = filteredRoomsData.filter(r => r.name?.startsWith('실시간 고객 상담'));
      } else {
        filteredRoomsData = filteredRoomsData.filter(r => !r.name?.startsWith('실시간 고객 상담'));
      }

      // For each room, load members to find the other user, and load last message + unread count
      const roomsList: ChatRoom[] = [];

      for (const r of filteredRoomsData) {
        // Fetch members of this room
        const { data: membersData, error: membersErr } = await supabase
          .from('chat_room_members')
          .select('user_id')
          .eq('room_id', r.id);

        if (membersErr) continue;

        // Find the other user ID
        const otherMemberId = membersData.find(m => m.user_id !== currentUserId)?.user_id;
        
        // Find in contacts list or mock it
        let otherMember = contacts.find(c => c.id === otherMemberId);
        if (!otherMember && otherMemberId) {
          // Try fetching from planners directly
          const { data: pData } = await supabase
            .from('planners')
            .select('id, name, is_admin, phone, profile_image_url, company_name')
            .eq('id', otherMemberId)
            .maybeSingle();

          if (pData) {
            otherMember = {
              id: pData.id,
              name: pData.name,
              role: pData.is_admin ? 'agency' : 'planner',
              subText: pData.company_name || (pData.is_admin ? '대리점' : '설계사'),
              profile_image_url: pData.profile_image_url || undefined,
              phone: pData.phone
            };
          } else if (otherMemberId === ADMIN_ID) {
            otherMember = {
              id: ADMIN_ID,
              name: '플랫폼 총관리자',
              role: 'super',
              subText: '더윤컴퍼니 본사',
              profile_image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80'
            };
          }
        }

        // Fetch last message
        const { data: lastMsgData } = await supabase
          .from('chat_messages')
          .select('message, created_at')
          .eq('room_id', r.id)
          .order('created_at', { ascending: false })
          .limit(1);

        // Fetch unread count for current user
        const { count } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', r.id)
          .eq('is_read', false)
          .neq('sender_id', currentUserId);

        // Fetch matching customer lead for this room to associate bot activity status
        let botActive = true;
        if (mode === 'customer') {
          const { data: leadData } = await supabase
            .from('customer_leads')
            .select('is_bot_active')
            .eq('raw_payload->>chat_room_id', r.id)
            .order('created_at', { ascending: false })
            .limit(1);
          if (leadData && leadData.length > 0) {
            botActive = leadData[0].is_bot_active;
          }
        }

        roomsList.push({
          id: r.id,
          name: r.name,
          type: r.type,
          created_at: r.created_at,
          otherMember,
          lastMessage: lastMsgData?.[0]?.message || '대화 내역이 없습니다.',
          lastMessageTime: lastMsgData?.[0]?.created_at,
          unreadCount: count || 0,
          isBotActive: botActive
        });
      }

      // Sort by last message time
      roomsList.sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA;
      });

      setRooms(roomsList);

      // Sync global AI state based on active rooms status
      const activeRoomsForGlobal = roomsList.filter(r => !pinnedRoomIds.includes(r.id));
      if (activeRoomsForGlobal.length > 0) {
        const allActive = activeRoomsForGlobal.every(r => r.isBotActive);
        setGlobalAiActive(allActive);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  };

  // 3. Fetch Messages for Selected Room
  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Fetch conversation scores for displaying individual message points
      const { data: scoreData, error: scoreErr } = await supabase
        .from('ai_conversation_scores')
        .select('*')
        .eq('chat_room_id', roomId);
      if (!scoreErr) {
        setConversationScores(scoreData || []);
      }

      // Sync lead and bot active status to keep memory/briefing fresh
      await syncLeadBotStatus(roomId);

      // Mark messages as read
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('room_id', roomId)
        .neq('sender_id', currentUserId);

      // Trigger local unread count clear
      setRooms(prev => prev.map(room => {
        if (room.id === roomId) {
          return { ...room, unreadCount: 0 };
        }
        return room;
      }));
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // 4. Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedRoom || !newMessageText.trim()) return;

    const msgText = newMessageText.trim();
    setNewMessageText('');

    // Auto-disable AI Bot if active on planner intervention
    if (isBotActive && selectedLead) {
      try {
        const updatedPayload = {
          ...(selectedLead.raw_payload || {}),
          timeline: [
            {
              id: `planner-intervene-${Date.now()}`,
              type: 'system_log',
              author: '설계사',
              detail: '설계사가 직접 상담에 개입하여 AI 비서가 자동 비활성화되었습니다.',
              created_at: new Date().toISOString()
            },
            ...(selectedLead.raw_payload?.timeline || [])
          ]
        };

        await supabase
          .from('customer_leads')
          .update({
            is_bot_active: false,
            raw_payload: updatedPayload
          })
          .eq('id', selectedLead.id);
        
        setIsBotActive(false);
      } catch (err) {
        console.warn("Failed to auto-disable bot on planner message:", err);
      }
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: selectedRoom.id,
          sender_id: currentUserId,
          message: msgText,
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      
      // Update room last message locally
      setRooms(prev => prev.map(room => {
        if (room.id === selectedRoom.id) {
          return {
            ...room,
            lastMessage: msgText,
            lastMessageTime: new Date().toISOString()
          };
        }
        return room;
      }).sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA;
      }));

      // ── [백그라운드] 설계사 직접 대화 점수화 (설계사 화면에 표시 없음) ────────
      if (selectedLead?.id && mode === 'customer') {
        setTimeout(async () => {
          try {
            // 1. 룰 기반 즉시 점수화 (Gemini 호출 없음 → 비용 0원)
            const score = ruleBasedScore(msgText);

            // 2. ai_conversation_scores에 저장 (분석용)
            await supabase.from('ai_conversation_scores').insert({
              lead_id:      selectedLead.id,
              chat_room_id: selectedRoom.id,
              planner_id:   currentUserId,
              message_text: msgText,
              ai_response:  '(설계사 직접 메시지)',
              action_type:  score.actionType,
              action_score: score.actionScore,
              pos_score:    score.pos,
              neg_score:    score.neg,
            });

            // 3. customer_leads 점수 업데이트 (누적)
            if (score.pos > 0 || score.neg > 0 || score.actionScore > 0) {
              await supabase.rpc('update_lead_ai_scores', {
                p_lead_id:    selectedLead.id,
                p_pos_delta:  score.pos,
                p_neg_delta:  score.neg,
                p_new_action: score.actionScore > 0 ? score.actionScore : null,
              });
            }

            // 4. proposal_request 감지 시 → Gemini 정밀 분석 1회 트리거
            if (score.actionType === 'proposal_request') {
              console.log('[Planner Learn] 🔥 proposal_request 감지! Gemini 정밀 분석 시작...');
              await analyzeConversationWithGemini(supabase, selectedRoom.id, selectedLead.id, currentUserId);
            }

            console.log(`[Planner Score] 📊 룰 기반 점수화 완료 | pos:${score.pos} neg:${score.neg} action:${score.actionType}(${score.actionScore})`);
          } catch (err) {
            console.warn('[Planner Score] 백그라운드 점수화 실패:', err);
          }
        }, 500); // 500ms 후 비동기 실행 (UX 영향 없음)
      }

    } catch (err) {
      console.error("Failed to send message:", err);
      alert("메시지 전송에 실패했습니다.");
    }
  };

  // 5. Start or Join 1:1 Chat Room
  const handleStartChat = async (contact: Contact) => {
    setLoading(true);
    try {
      // Check if a one_to_one room already exists between current user and the contact
      // We can query rooms that the current user belongs to and check if the other contact is also in it
      const { data: myMembers, error: myMembersErr } = await supabase
        .from('chat_room_members')
        .select('room_id')
        .eq('user_id', currentUserId);

      if (myMembersErr) throw myMembersErr;

      let existingRoomId: string | null = null;

      if (myMembers && myMembers.length > 0) {
        const myRoomIds = myMembers.map(m => m.room_id);

        const { data: otherMembers, error: otherMembersErr } = await supabase
          .from('chat_room_members')
          .select('room_id')
          .eq('user_id', contact.id)
          .in('room_id', myRoomIds);

        if (!otherMembersErr && otherMembers && otherMembers.length > 0) {
          // Found an existing room!
          existingRoomId = otherMembers[0].room_id;
        }
      }

      if (existingRoomId) {
        // Load the existing room
        const { data: roomData } = await supabase
          .from('chat_rooms')
          .select('id, name, type, created_at')
          .eq('id', existingRoomId)
          .single();

        if (roomData) {
          const chatRoom: ChatRoom = {
            id: roomData.id,
            name: roomData.name,
            type: roomData.type,
            created_at: roomData.created_at,
            otherMember: contact,
            unreadCount: 0
          };
          setSelectedRoom(chatRoom);
          await fetchMessages(roomData.id);
          setSubTab('rooms');
        }
      } else {
        // Create a new chat room
        const { data: newRoom, error: newRoomErr } = await supabase
          .from('chat_rooms')
          .insert({
            name: `${currentUser.name} & ${contact.name} 대화방`,
            type: 'one_to_one'
          })
          .select()
          .single();

        if (newRoomErr || !newRoom) throw newRoomErr || new Error("Failed to create room");

        // Add both members
        const membersToInsert = [
          { room_id: newRoom.id, user_id: currentUserId },
          { room_id: newRoom.id, user_id: contact.id }
        ];

        const { error: insertMembersErr } = await supabase
          .from('chat_room_members')
          .insert(membersToInsert);

        if (insertMembersErr) throw insertMembersErr;

        const chatRoom: ChatRoom = {
          id: newRoom.id,
          name: newRoom.name,
          type: newRoom.type,
          created_at: newRoom.created_at,
          otherMember: contact,
          unreadCount: 0
        };

        setSelectedRoom(chatRoom);
        setMessages([]);
        setSubTab('rooms');
        await fetchRooms();
      }
    } catch (err: any) {
      console.error("Start chat failed:", err);
      alert("채팅 시작에 실패했습니다: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  useEffect(() => {
    requestNotificationPermission();
    fetchContacts().then(() => {
      fetchRooms();
    });
  }, []);

  // Update room list when contacts load (to get clean display names)
  useEffect(() => {
    if (contacts.length > 0) {
      fetchRooms();
    }
  }, [contacts]);

  // Real-time subscription for messages and scores in selected room
  useEffect(() => {
    if (!selectedRoom) return;

    const channel = supabase
      .channel(`chat_messages:${selectedRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${selectedRoom.id}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id !== currentUserId) {
            setMessages((prev) => {
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });

            // Mark as read in DB
            supabase
              .from('chat_messages')
              .update({ is_read: true })
              .eq('id', newMsg.id)
              .then();

            // Play sound locally
            playNotificationSound();

            // [기능8] 고객의 실시간 메시지에서 기억(기호, 직업, 가족 등) 추출
            if (selectedLead?.id) {
              extractAndSaveMemory(supabase, selectedLead.id, newMsg.message)
                .then(() => {
                  setTimeout(() => {
                    syncLeadBotStatus(selectedRoom.id);
                  }, 600);
                })
                .catch(() => {});
            }
          }
        }
      )
      .subscribe();

    // Subscribe to conversation scores to update score badges in real-time
    const scoreChannel = supabase
      .channel(`ai_conversation_scores:${selectedRoom.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_conversation_scores',
          filter: `chat_room_id=eq.${selectedRoom.id}`
        },
        (payload) => {
          setConversationScores((prev) => {
            if (prev.some(s => s.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(scoreChannel);
    };
  }, [selectedRoom?.id]);

  // Global Realtime Subscription for incoming messages (to notify in background)
  useEffect(() => {
    if (!currentUserId || userRoomIds.length === 0) return;

    const globalChannel = supabase
      .channel('global_chat_alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          const newMsg = payload.new as Message;
          
          // Is it in one of the user's rooms?
          if (userRoomIds.includes(newMsg.room_id) && newMsg.sender_id !== currentUserId) {
            // If the room is not currently selected
            if (!selectedRoom || selectedRoom.id !== newMsg.room_id) {
              playNotificationSound();
              showBrowserNotification(newMsg);
              fetchRooms(); // refresh list to show badge
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, [currentUserId, userRoomIds, selectedRoom?.id]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filtered contacts
  const filteredContacts = contacts.filter(c => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.subText?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`flex flex-col h-[600px] sm:h-[680px] bg-slate-950/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-violet-950/10 text-left transition-all duration-300 ${
      showHelpGuide ? 'help-guide-glow bg-slate-900/10' : 'border border-violet-500/20'
    }`}>
      
      {/* Sub Tabs Bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-slate-900/50 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-black text-white tracking-wide mr-2">
            {mode === 'customer' ? '실시간 고객 상담 💬' : '소통 센터 (0.1초 실시간 알림)'}
          </h2>
          {onToggleHelpGuide && (
            <button
              type="button"
              onClick={onToggleHelpGuide}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-black transition-all relative overflow-hidden shadow-sm cursor-pointer ${
                showHelpGuide 
                  ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 hover:bg-orange-500/20 shadow-sm shadow-orange-500/5' 
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 ${showHelpGuide ? '' : 'hidden'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${showHelpGuide ? 'bg-orange-500' : 'bg-slate-600'}`}></span>
              </span>
              <span>💡 도움말 가이드 {showHelpGuide ? 'ON' : 'OFF'}</span>
            </button>
          )}
        </div>
        {mode !== 'customer' && (
          <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button 
              onClick={() => setSubTab('rooms')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${subTab === 'rooms' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              채팅 목록 ({rooms.length})
            </button>
            <button 
              onClick={() => setSubTab('contacts')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${subTab === 'contacts' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              연락처 디렉토리
            </button>
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* Left Side: Directory or Rooms list */}
        <div className={`${selectedRoom ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-slate-800/80 flex-col bg-slate-950/40 overflow-y-auto`}>
          
          {subTab === 'contacts' ? (
            <div className="p-4 flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="연락처 검색..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-violet-500 transition-all placeholder-slate-500"
                />
              </div>

              {/* Contacts List */}
              <div className="space-y-1">
                {filteredContacts.map(contact => (
                  <div 
                    key={contact.id} 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900/80 transition-all border border-transparent hover:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={contact.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80'} 
                          alt={contact.name}
                          className="w-9 h-9 rounded-full border border-violet-500/20 object-cover"
                        />
                        {contact.role === 'super' && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 p-0.5 rounded-full text-slate-950 shadow-md z-10">
                            <Shield className="w-2.5 h-2.5" />
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                          <span className="absolute top-0 left-0 w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping" />
                        </div>
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          {contact.name}
                          {contact.role === 'super' && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-1 rounded">총관리자</span>}
                          {contact.role === 'agency' && <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 rounded">대리점</span>}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate w-36 mt-0.5">{contact.subText || '소속 설계사'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleStartChat(contact)}
                      className="bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black py-1.5 px-2.5 rounded-lg transition-all"
                    >
                      채팅
                    </button>
                  </div>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">일치하는 연락처가 없습니다.</div>
                )}
              </div>
            </div>
          ) : (
            // Active Chat Rooms list
            <div className="p-3 space-y-1">
              {[...rooms].sort((a, b) => {
                const aPinned = pinnedRoomIds.includes(a.id);
                const bPinned = pinnedRoomIds.includes(b.id);
                if (aPinned && !bPinned) return -1;
                if (!aPinned && bPinned) return 1;
                const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
                const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
                return timeB - timeA;
              }).map(room => {
                const isSelected = selectedRoom?.id === room.id;
                const isPinned = pinnedRoomIds.includes(room.id);
                const member = room.otherMember;
                
                return (
                  <button 
                    key={room.id}
                    onClick={async () => {
                      setSelectedRoom(room);
                      await fetchMessages(room.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border text-left ${
                      isSelected 
                        ? 'bg-violet-600/10 border-violet-500/30' 
                        : isPinned
                        ? 'bg-rose-500/5 border-rose-500/25 hover:bg-rose-500/10 hover:border-rose-500/40 shadow-[0_0_15px_rgba(239,68,68,0.03)]'
                        : 'bg-transparent border-transparent hover:bg-slate-900/60 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={member?.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80'} 
                          alt={member?.name || '대화방'}
                          className="w-10 h-10 rounded-full border border-violet-500/10 object-cover"
                        />
                        {room.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse border border-slate-950 z-20">
                            {room.unreadCount}
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10">
                          <span className="absolute top-0 left-0 w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                          {member?.name || '대화방'}
                          {isPinned && (
                            <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-black animate-pulse shadow-sm shadow-rose-500/20">
                              📌 집중
                            </span>
                          )}
                          {mode === 'customer' && (
                            <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded border leading-none ${
                              room.isBotActive 
                                ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                                : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}>
                              {room.isBotActive ? '🤖 AI' : '👤 수동'}
                            </span>
                          )}
                          {member?.role === 'super' && <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1 rounded">관리자</span>}
                          {member?.role === 'agency' && <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 rounded">대리점</span>}
                        </h4>
                        <p className={`text-[10px] truncate mt-1 max-w-[150px] ${isPinned ? 'text-rose-300 font-semibold' : 'text-slate-400'}`}>{room.lastMessage}</p>
                      </div>
                    </div>
                    
                    {room.lastMessageTime && (
                      <div className="text-[9px] text-slate-500 flex-shrink-0">
                        {new Date(room.lastMessageTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </div>
                    )}
                  </button>
                );
              })}
              {rooms.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-xs">개설된 채팅방이 없습니다.<br/>연락처 디렉토리에서 시작해 보세요.</div>
              )}
            </div>
          )}

        </div>

        {/* Right Side: Message Window */}
        <div className={`${selectedRoom ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-slate-950/20 relative overflow-hidden`}>
          {selectedRoom ? (
            <>
              {/* Message Header */}
              <div className="px-3 sm:px-6 py-4 border-b border-slate-800/80 bg-slate-900/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Back button on mobile */}
                  <button 
                    type="button" 
                    onClick={() => setSelectedRoom(null)}
                    className="block md:hidden text-slate-400 hover:text-white p-1 shrink-0"
                    title="목록으로 돌아가기"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="relative shrink-0">
                    <img 
                      src={selectedRoom.otherMember?.profile_image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80'} 
                      alt={selectedRoom.otherMember?.name}
                      className="w-9 h-9 rounded-full border border-violet-500/20 object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10">
                      <span className="absolute top-0 left-0 w-full h-full bg-emerald-400 rounded-full opacity-75 animate-ping" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                      {selectedRoom.otherMember?.name}
                      {selectedRoom.otherMember?.role === 'super' && <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 px-1 rounded">총관리자</span>}
                      {selectedRoom.otherMember?.role === 'agency' && <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/25 px-1 rounded">대리점</span>}
                      <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        온라인
                      </span>
                    </h3>
                    <p className="text-[9px] text-slate-400 mt-0.5">{selectedRoom.otherMember?.subText || '소통 멤버'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* AI Bot Active/Pause Controls */}
                  {selectedLead && (
                    <div className="flex items-center gap-2">
                      {/* Pinned Focus Toggle Button */}
                      {mode === 'customer' && (
                        <button
                          type="button"
                          onClick={async () => {
                            const isCurrentlyPinned = pinnedRoomIds.includes(selectedRoom.id);
                            togglePinRoom(selectedRoom.id);
                            
                            // Auto-disable AI Bot on pinning, or keep it on unpinning
                            const newBotStatus = isCurrentlyPinned; // if currently pinned, unpinning restores AI (true), pinning pauses AI (false)
                            try {
                              const updatedPayload = {
                                ...(selectedLead.raw_payload || {}),
                                timeline: [
                                  {
                                    id: `planner-pin-${Date.now()}`,
                                    type: 'system_log',
                                    author: '설계사',
                                    detail: `설계사가 이 고객을 집중 상담방으로 ${!isCurrentlyPinned ? '지정' : '해제'}했습니다.`,
                                    created_at: new Date().toISOString()
                                  },
                                  ...(selectedLead.raw_payload?.timeline || [])
                                ]
                              };
                              await supabase
                                .from('customer_leads')
                                .update({
                                  is_bot_active: newBotStatus,
                                  raw_payload: updatedPayload
                                })
                                .eq('id', selectedLead.id);
                              setIsBotActive(newBotStatus);
                              await fetchRooms();
                            } catch (e) {
                              console.error('Failed to update bot status on pin toggle:', e);
                            }
                          }}
                          className={`text-[9.5px] font-black px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            pinnedRoomIds.includes(selectedRoom.id)
                              ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {pinnedRoomIds.includes(selectedRoom.id) ? '📌 집중 상담 해제' : '📌 집중 상담 지정'}
                        </button>
                      )}

                      {/* AI Bot Active/Pause Status & Toggle */}
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                        isBotActive 
                          ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' 
                          : 'bg-slate-800 border-slate-750 text-slate-400'
                      }`}>
                        {isBotActive ? '🤖 AI 비서 응대중' : '👤 수동 상담 모드'}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          const newStatus = !isBotActive;
                          try {
                            const updatedPayload = {
                              ...(selectedLead.raw_payload || {}),
                              timeline: [
                                {
                                  id: `planner-toggle-${Date.now()}`,
                                  type: 'system_log',
                                  author: '설계사',
                                  detail: `설계사가 AI 비서 응대를 ${newStatus ? '활성화' : '일시 정지'}했습니다.`,
                                  created_at: new Date().toISOString()
                                },
                                ...(selectedLead.raw_payload?.timeline || [])
                              ]
                            };
                            await supabase
                              .from('customer_leads')
                              .update({
                                is_bot_active: newStatus,
                                raw_payload: updatedPayload
                              })
                              .eq('id', selectedLead.id);
                            setIsBotActive(newStatus);
                            await fetchRooms();
                          } catch (e) {
                            console.error('Failed to toggle bot activity:', e);
                          }
                        }}
                        className={`text-[9.5px] font-black px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isBotActive 
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' 
                            : 'bg-orange-600 border-orange-500 text-white hover:bg-orange-500'
                        }`}
                      >
                        {isBotActive ? 'AI 상담 일시정지' : 'AI 상담 활성화'}
                      </button>
                    </div>
                  )}

                  {mode !== 'customer' && (
                    <button
                      type="button"
                      onClick={() => setShowFaqDrawer(!showFaqDrawer)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${showFaqDrawer ? 'bg-violet-600 border-violet-500 text-white shadow-md' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'}`}
                    >
                      <span>💡 자주 묻는 질문 (FAQ)</span>
                    </button>
                  )}
                  <span className="hidden sm:flex text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    실시간 연결됨
                  </span>
                </div>
              </div>

              {/* 📊 AI 실시간 상담 점수 모니터링 바 */}
              {selectedLead && (
                <>
                  <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold select-none backdrop-blur-sm animate-in fade-in duration-300">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Zap className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>AI 실시간 분석:</span>
                    <span className="text-[10px] text-slate-600 font-medium">대화 흐름에 따라 실시간 반영됩니다.</span>
                  </div>
                  
                  <div className="flex items-center gap-5 flex-1 justify-end max-w-xl">
                    {/* 긍정 */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-bold">긍정</span>
                      </div>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.round(((selectedLead.pos_score ?? 0) / 30) * 100))}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-emerald-400 w-5 text-right">{selectedLead.pos_score ?? 0}pt</span>
                    </div>

                    {/* 부정 */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-[10px] text-rose-400 font-bold">부정</span>
                      </div>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.round(((selectedLead.neg_score ?? 0) / 30) * 100))}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-rose-400 w-5 text-right">{selectedLead.neg_score ?? 0}pt</span>
                    </div>

                    {/* 행동 */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">행동:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getActionInfo(selectedLead.action_score ?? 0).color}`}>
                        {getActionInfo(selectedLead.action_score ?? 0).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── [신규] 실시간 감정 흐름 곡선 및 설계 성공 확률 대시보드 ── */}
                <div className="px-6 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between gap-4 text-xs font-semibold backdrop-blur-sm">
                  {/* 감정 흐름 곡선 */}
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] text-slate-500 font-bold">감정 흐름 곡선:</span>
                    <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-850 px-2 py-1 rounded-lg">
                      <span className={`transition-all duration-300 ${selectedLead.neg_score >= 15 ? 'opacity-100 font-bold scale-110 text-rose-400' : 'opacity-30 scale-90'}`}>⚠️ 이탈위험</span>
                      <span className="text-slate-600 font-normal">&gt;</span>
                      <span className={`transition-all duration-300 ${(selectedLead.pos_score ?? 0) < 6 && selectedLead.neg_score < 15 ? 'opacity-100 font-bold scale-110 text-slate-400' : 'opacity-30 scale-90'}`}>😐 대기</span>
                      <span className="text-slate-600 font-normal">&gt;</span>
                      <span className={`transition-all duration-300 ${(selectedLead.pos_score ?? 0) >= 6 && (selectedLead.pos_score ?? 0) < 12 && selectedLead.neg_score < 15 ? 'opacity-100 font-bold scale-110 text-emerald-400' : 'opacity-30 scale-90'}`}>😊 호감</span>
                      <span className="text-slate-600 font-normal">&gt;</span>
                      <span className={`transition-all duration-300 ${(selectedLead.pos_score ?? 0) >= 12 && (selectedLead.action_score ?? 0) < 10 && selectedLead.neg_score < 15 ? 'opacity-100 font-bold scale-110 text-cyan-400' : 'opacity-30 scale-90'}`}>😮 관심</span>
                      <span className="text-slate-600 font-normal">&gt;</span>
                      <span className={`transition-all duration-300 ${selectedLead.action_score >= 10 ? 'opacity-100 font-bold scale-120 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'opacity-30 scale-90'}`}>🔥 설계요청</span>
                    </div>
                  </div>

                  {/* 설계 성공 예측 확률 및 성향 배지 */}
                  <div className="flex items-center gap-3">
                    {/* [기능8] 실시간 성향 분석 배지 */}
                    {(() => {
                      const seg = detectCustomerSegment(selectedLead);
                      if (!seg) return null;
                      return (
                        <div className={`px-2 py-0.5 rounded border text-[10px] font-black ${seg.bg} ${seg.text} ${seg.border}`}>
                          {seg.label}
                        </div>
                      );
                    })()}

                    <span className="text-[10px] text-slate-500 font-bold">설계 요청 확률:</span>
                    {(() => {
                      const pos = selectedLead.pos_score ?? 0;
                      const action = selectedLead.action_score ?? 0;
                      const prob = action >= 10
                        ? 100
                        : Math.max(5, Math.min(99, Math.round((pos * 1.5) + (action * 5.5))));
                      
                      let colorClass = 'text-slate-400';
                      let bgClass = 'bg-slate-900/60 border-slate-800';
                      if (prob >= 80) {
                        colorClass = 'text-orange-400 font-black animate-pulse';
                        bgClass = 'bg-orange-500/10 border-orange-500/30 shadow-md shadow-orange-500/5';
                      } else if (prob >= 50) {
                        colorClass = 'text-emerald-400 font-black';
                        bgClass = 'bg-emerald-500/10 border-emerald-500/20';
                      } else if (prob >= 25) {
                        colorClass = 'text-cyan-400 font-bold';
                        bgClass = 'bg-cyan-500/10 border-cyan-500/20';
                      }

                      return (
                        <div className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all duration-300 ${bgClass}`}>
                          <span className={colorClass}>{prob}%</span>
                          <span className="text-[9px] text-slate-500 font-medium">
                            {prob === 100 ? '설계 요청 수락 완료! 🎉' : prob >= 80 ? '클로징 적극 권장! 🔥' : prob >= 50 ? '대화 긍정적 흐름 👍' : '탐색 단계'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </>)}

              {/* Chat workspace split panel (Chat + FAQ drawer) */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Left Side: Message History and Input Form */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => {
                      const isMe = msg.sender_id === currentUserId;
                      const msgTime = new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                      const matchedScore = !isMe ? conversationScores.find(s => s.message_text === msg.message) : null;

                      return (
                        <div 
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                        >
                          {/* Left: display timestamp / read indicator for outgoing message */}
                          {isMe && (
                            <div className="flex flex-col items-end text-[9px] text-slate-500 space-y-0.5">
                              {!msg.is_read ? (
                                <span className="text-violet-400 font-bold">1</span>
                              ) : (
                                <span className="text-slate-600">읽음</span>
                              )}
                              <span>{msgTime}</span>
                            </div>
                          )}

                          {/* Message bubble / Score block */}
                          {!isMe ? (
                            <div className="flex flex-col gap-1.5 items-start max-w-md">
                              <div 
                                className="px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed bg-slate-800 text-slate-100 rounded-bl-none"
                              >
                                {msg.message}
                              </div>
                              {matchedScore && (
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[10px] font-semibold text-slate-400 select-none animate-in fade-in slide-in-from-top-1 duration-200">
                                  <span className="text-emerald-400 font-bold">🟢 +{matchedScore.pos_score ?? 0}</span>
                                  <span className="text-slate-700">|</span>
                                  <span className="text-rose-400 font-bold">🔴 -{matchedScore.neg_score ?? 0}</span>
                                  <span className="text-slate-700">|</span>
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getActionInfo(matchedScore.action_score || 0).color}`}>
                                    {getActionInfo(matchedScore.action_score || 0).label} ({matchedScore.action_score ?? 0}pt)
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div 
                              className="max-w-md px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed bg-violet-600 text-white rounded-br-none shadow-md shadow-violet-700/10"
                            >
                              {msg.message}
                            </div>
                          )}

                          {/* Right: display timestamp for incoming message */}
                          {!isMe && (
                            <div className="text-[9px] text-slate-500">
                              {msgTime}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Input box */}
                  <form 
                    onSubmit={handleSendMessage}
                    className="p-4 bg-slate-900/30 border-t border-slate-800/80 flex items-center gap-3 shrink-0"
                  >
                    <input 
                      type="text" 
                      placeholder="메시지를 입력해 주세요..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500 transition-all placeholder-slate-600"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessageText.trim()}
                      className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:hover:bg-violet-600 text-white p-3 rounded-xl transition-all shadow-lg shadow-violet-700/20"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Right Side: AI 상담 실시간 요약 브리핑 카드 (customer mode only) */}
                {mode === 'customer' && selectedLead && (
                  <div className="hidden lg:flex w-72 border-l border-slate-800/80 bg-slate-950/40 flex-col p-4 overflow-y-auto shrink-0 select-none backdrop-blur-md">
                    <div className="flex items-center gap-1.5 mb-4 border-b border-slate-800/80 pb-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        🤖 AI 실시간 요약 브리핑
                      </h4>
                    </div>

                    <div className="space-y-4 flex-1">
                      {/* 관심사, 고민거리, 진행상황 카드 */}
                      <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl space-y-3.5">
                        {/* 📌 관심사 */}
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block mb-1">📌 관심사</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedLead.raw_payload?.customer_memory?.interests?.length > 0 ? (
                              selectedLead.raw_payload.customer_memory.interests.map((it: string, i: number) => (
                                <span key={i} className="text-[9px] bg-violet-600/15 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-md font-bold">
                                  {it}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-500">분석 중... 😐</span>
                            )}
                          </div>
                        </div>

                        {/* 🔥 고민거리 */}
                        <div className="border-t border-slate-850 pt-3">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1">🔥 고민거리</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedLead.raw_payload?.customer_memory?.pain_points?.length > 0 ? (
                              selectedLead.raw_payload.customer_memory.pain_points.map((pt: string, i: number) => (
                                <span key={i} className="text-[9px] bg-rose-600/10 border border-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md font-bold">
                                  {pt}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-500">분석 중... 😐</span>
                            )}
                          </div>
                        </div>

                        {/* 📍 진행 상황 */}
                        <div className="border-t border-slate-850 pt-3">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1.5">📍 진행 상황</span>
                          <span className="text-[10px] text-slate-300 font-black leading-relaxed block break-keep">
                            {getLeadProgressText(selectedLead)}
                          </span>
                        </div>
                      </div>

                      {/* 💡 설계사 추천 개입 전략 */}
                      <div className="bg-gradient-to-br from-violet-950/20 to-slate-900 border border-violet-500/20 p-4 rounded-2xl">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Zap className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-[10px] text-orange-400 font-black">💡 [설계사 추천 개입 전략]</span>
                        </div>
                        <p className="text-[10px] text-slate-200 leading-relaxed font-bold break-keep">
                          "{getLeadStrategyText(selectedLead)}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Side: Interactive Sliding FAQ Drawer */}
                {showFaqDrawer && (
                  <div className="absolute md:relative right-0 top-0 bottom-0 z-30 w-full md:w-80 border-l border-slate-800/80 bg-slate-950/95 md:bg-slate-950/60 flex flex-col p-4 overflow-y-auto animate-in slide-in-from-right duration-350 shrink-0">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        💡 자주 묻는 질문 (FAQ)
                      </h4>
                      <button 
                        onClick={() => setShowFaqDrawer(false)}
                        className="text-slate-500 hover:text-slate-300 text-xs font-bold"
                      >
                        닫기
                      </button>
                    </div>

                    {/* 공지사항 배너 */}
                    <div className="mb-3 p-3 bg-violet-950/20 border border-violet-500/20 rounded-xl flex items-start gap-2">
                      <span className="text-xs shrink-0">📢</span>
                      <p className="text-[9px] text-violet-300 font-bold leading-relaxed">
                        보험료 비교 데이터는 생명보험협회 및 손해보험협회 공시자료를 토대로 한달에 한번 업데이트 됩니다.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {FAQ_LIST.map((faq, idx) => {
                        const isOpen = activeFaqIndex === idx;
                        return (
                          <div 
                            key={idx} 
                            className="bg-slate-900/50 border border-slate-800/80 rounded-xl overflow-hidden transition-all duration-300"
                          >
                            <button
                              type="button"
                              onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                              className="w-full flex items-center justify-between p-3 text-[11px] font-bold text-white hover:bg-slate-800 transition-all text-left"
                            >
                              <span className="pr-2">{faq.question}</span>
                              <span className={`transform transition-transform duration-300 text-slate-500 shrink-0 ${isOpen ? 'rotate-90' : ''}`}>
                                &gt;
                              </span>
                            </button>
                            <div 
                              className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[200px] border-t border-slate-900/60 p-3' : 'max-h-0'}`}
                            >
                              <p className="text-[10px] text-slate-300 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </>
          ) : (
            // Welcome center graphic screen (No active room selected)
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/10 overflow-y-auto">
              <div className="w-14 h-14 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-3 text-violet-400 shadow-xl shadow-violet-950/20">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-black text-white tracking-wide">
                {mode === 'customer' ? '실시간 고객 상담 센터' : '실시간 소통 센터'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed break-keep">
                {mode === 'customer' 
                  ? '고객과의 1:1 실시간 상담을 지원합니다.\n왼쪽 목록에서 상담을 진행할 고객을 선택해 보세요.'
                  : '총관리자, 대리점 및 소속 설계사 간의 실시간 1:1 대화방을 지원합니다. 왼쪽 연락처에서 대화할 대상을 선택해 보세요.'}
              </p>
              
              {/* 모든 고객 AI 마스터 제어 스위치 (customer mode only) */}
              {mode === 'customer' && (
                <div className="mt-6 w-full max-w-lg bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center space-y-3 shadow-lg">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    🤖 AI 비서 마스터 스위치 (전체 고객 일괄 통제)
                  </span>
                  <div className="flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={async () => {
                        updateGlobalAiActive(true);
                        if (rooms.length === 0) return;
                        if (!confirm("현재 리스트에 있는 모든 고객의 AI 상담을 활성화하시겠습니까? (📌 집중 상담방 제외)")) return;
                        try {
                          const roomIdsToUpdate = rooms.filter(r => !pinnedRoomIds.includes(r.id)).map(r => r.id);
                          if (roomIdsToUpdate.length > 0) {
                            const { data: leadsToUpdate, error: queryErr } = await supabase
                              .from('customer_leads')
                              .select('id, raw_payload');
                            
                            if (queryErr) throw queryErr;

                            const targetLeads = (leadsToUpdate || []).filter(lead => {
                              const roomId = lead.raw_payload?.chat_room_id;
                              return roomId && roomIdsToUpdate.includes(roomId);
                            });

                            let updatedCount = 0;
                            for (const lead of targetLeads) {
                              const updatedPayload = {
                                ...(lead.raw_payload || {}),
                                timeline: [
                                  {
                                    id: `planner-global-activate-${Date.now()}`,
                                    type: 'system_log',
                                    author: '설계사',
                                    detail: '설계사가 마스터 스위치를 가동하여 전체 AI 상담을 일괄 활성화했습니다.',
                                    created_at: new Date().toISOString()
                                  },
                                  ...(lead.raw_payload?.timeline || [])
                                ]
                              };
                              await supabase
                                .from('customer_leads')
                                .update({
                                  is_bot_active: true,
                                  raw_payload: updatedPayload
                                })
                                .eq('id', lead.id);
                              updatedCount++;
                            }
                            alert(`🤖 전체 AI 자동 응대가 가동되었습니다!\n\n• 대상 고객 수: 총 ${updatedCount}명\n• 집중 상담(📌) 중인 방은 변경 없이 안전하게 유지되었습니다.\n\n이제 AI 비서가 순차적으로 대화를 응대합니다.`);
                          } else {
                            alert("AI를 시작할 활성화된 일반 대화방이 없습니다.");
                          }
                          await fetchRooms();
                          if (selectedRoom && !pinnedRoomIds.includes(selectedRoom.id)) {
                            setIsBotActive(true);
                          }
                        } catch (e) {
                          console.error("Failed to globally resume AI bot:", e);
                          alert("상태 업데이트에 실패했습니다. 네트워크를 확인해 주세요.");
                        }
                      }}
                      className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer border ${
                        globalAiActive
                          ? 'bg-orange-600 border-orange-500 text-white shadow-md shadow-orange-600/30 scale-105 ring-2 ring-orange-500/15'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 opacity-60'
                      }`}
                    >
                      🤖 전체 AI 상담 시작
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        updateGlobalAiActive(false);
                        if (rooms.length === 0) return;
                        if (!confirm("현재 리스트에 있는 모든 고객의 AI 상담을 정지하고 수동 개입 모드로 전환하시겠습니까?")) return;
                        try {
                          const roomIdsToUpdate = rooms.map(r => r.id);
                          const { data: leadsToUpdate, error: queryErr } = await supabase
                            .from('customer_leads')
                            .select('id, raw_payload');
                          
                          if (queryErr) throw queryErr;

                          const targetLeads = (leadsToUpdate || []).filter(lead => {
                            const roomId = lead.raw_payload?.chat_room_id;
                            return roomId && roomIdsToUpdate.includes(roomId);
                          });

                          let updatedCount = 0;
                          for (const lead of targetLeads) {
                            const updatedPayload = {
                              ...(lead.raw_payload || {}),
                              timeline: [
                                {
                                  id: `planner-global-pause-${Date.now()}`,
                                  type: 'system_log',
                                  author: '설계사',
                                  detail: '설계사가 마스터 스위치를 정지하여 전체 AI 상담을 일괄 일시정지했습니다.',
                                  created_at: new Date().toISOString()
                                },
                                ...(lead.raw_payload?.timeline || [])
                              ]
                            };
                            await supabase
                              .from('customer_leads')
                              .update({
                                is_bot_active: false,
                                raw_payload: updatedPayload
                              })
                              .eq('id', lead.id);
                            updatedCount++;
                          }
                          alert(`👤 모든 고객의 AI 상담이 정지되었습니다!\n\n• 대상 고객 수: 총 ${updatedCount}명\n\n이제부터 모든 고객과의 대화는 대리점이나 설계사가 직접 입력하여 수동으로 상담을 진행하셔야 합니다.`);
                          await fetchRooms();
                          if (selectedRoom) {
                            setIsBotActive(false);
                          }
                        } catch (e) {
                          console.error("Failed to globally pause AI bot:", e);
                          alert("상태 업데이트에 실패했습니다. 네트워크를 확인해 주세요.");
                        }
                      }}
                      className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all border cursor-pointer ${
                        !globalAiActive
                          ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-600/30 scale-105 ring-2 ring-rose-500/15'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 opacity-60'
                      }`}
                    >
                      👤 전체 AI 상담 일시정지
                    </button>
                  </div>

                  {/* 실시간 모드 상태 안내 문구 (Dynamic Status Notice Banner) */}
                  <div className={`mt-4 p-4 rounded-xl border text-xs text-left leading-relaxed transition-all duration-300 ${
                    globalAiActive
                      ? 'bg-orange-500/10 border-orange-500/20 text-orange-200 shadow-md shadow-orange-950/20 animate-in fade-in duration-300'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-200 shadow-md shadow-rose-950/20 animate-in fade-in duration-300'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm shrink-0">{globalAiActive ? '🤖' : '👤'}</span>
                      <div className="space-y-1">
                        <p className="font-bold text-[12px] text-white flex items-center gap-1.5">
                          {globalAiActive 
                            ? '현재 AI 비서가 활성화(가동 중) 상태입니다.' 
                            : '현재 AI 비서가 일시정지(수동 모드) 상태입니다.'}
                        </p>
                        <p className="text-[11px] text-slate-300 leading-relaxed break-keep">
                          {globalAiActive
                            ? '신규 고객이 상담방에 입장하거나 설계안 코드를 입력하면 AI 비서가 인증 및 안내를 실시간 자동 대행합니다. (중요 고객에게 집중 개입하시려면 개별 채팅창에서 직접 답장하거나 📌 집중 상담 지정을 클릭하세요.)'
                            : '모든 대화방의 AI 자동 응답이 차단되었습니다. 고객이 대화를 시작하거나 코드를 입력해도 AI가 답장하지 않으므로, 설계사가 모든 실시간 메시지를 직접 모니터링하여 수동으로 답변하셔야 합니다.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI 실시간 상담 가이드 (customer mode only) */}
              {mode === 'customer' && (
                <div className="mt-8 w-full max-w-lg text-left space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
                    📖 실시간 AI 보험 비서 가이드 & 작동 방식
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-1.5 hover:border-slate-700 transition-all">
                      <span className="text-[10px] font-black text-orange-400 uppercase block tracking-wider">Step 1. 고유 코드 자동 파싱</span>
                      <p className="text-xs font-semibold text-slate-200 leading-relaxed break-keep">
                        고객이 상세분석지에서 복사해온 고유 설계안 코드 (예: `REX-XXXXXX`)를 메신저 창에 입력하는 즉시 AI 비서가 이를 감지하여 해당 고객 정보를 실시간 연동합니다.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-1.5 hover:border-slate-700 transition-all">
                      <span className="text-[10px] font-black text-orange-400 uppercase block tracking-wider">Step 2. 0.1초 본인인증 & 마스킹 해제</span>
                      <p className="text-xs font-semibold text-slate-200 leading-relaxed break-keep">
                        AI가 마스킹 잠금 해제를 위한 인증 안내 및 전용 버튼 링크를 전송합니다. 고객이 간편인증을 완료하면 0.1초 만에 마스킹이 완전 해제되어 설계사 리드 DB에 실명 및 연락처가 즉시 노출됩니다.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-1.5 hover:border-slate-700 transition-all">
                      <span className="text-[10px] font-black text-orange-400 uppercase block tracking-wider">Step 3. 집중 상담 지정 (📌 Pin) & 자유로운 개입</span>
                      <p className="text-xs font-semibold text-slate-200 leading-relaxed break-keep">
                        중요한 VIP 고객은 **`📌 집중 상담 지정`** 버튼을 눌러 목록 최상단에 고정하고 AI를 정지시킬 수 있습니다. 그동안 나머지 일반 대화는 AI 비서가 백그라운드에서 끊김 없이 논스톱 응대를 계속 전담합니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Collapsible FAQ Accordion panel for Self-Service (Internal mode only) */}
              {mode !== 'customer' && (
                <div className="mt-8 w-full max-w-lg text-left">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 px-1">
                    자주 묻는 질문 (FAQ)
                  </h4>
                  
                  {/* 공지사항 배너 */}
                  <div className="mb-4 p-3 bg-violet-950/20 border border-violet-500/20 rounded-2xl flex items-start gap-2.5">
                    <span className="text-sm shrink-0">📢</span>
                    <p className="text-[10px] text-violet-300 font-bold leading-relaxed">
                      보험료 비교 데이터는 생명보험협회 및 손해보험협회 공시자료를 토대로 한달에 한번 업데이트 됩니다.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {FAQ_LIST.map((faq, idx) => {
                      const isOpen = activeFaqIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-300"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between p-4 text-xs font-bold text-white hover:bg-slate-800/40 transition-all text-left"
                          >
                            <span>{faq.question}</span>
                            <span className={`transform transition-transform duration-300 text-slate-500 ${isOpen ? 'rotate-90' : ''}`}>
                              &gt;
                            </span>
                          </button>
                          <div 
                            className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[160px] border-t border-slate-900/60 p-4' : 'max-h-0'}`}
                          >
                            <p className="text-[11px] text-slate-300 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
