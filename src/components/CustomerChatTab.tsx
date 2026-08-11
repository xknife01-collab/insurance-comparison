import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import {
  MessageSquare, Send, Search,
  Shield, ArrowLeft, Volume2, Check, Clock,
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
  if (!leadId || leadId <= 0) return;
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

// ── [기능8-보강] 메시지 배열에서 실시간 관심사 및 고민거리 0.1초 즉시 추출 ─────────
function extractMemoryFromMessages(messages: Message[]): { interests: string[]; pain_points: string[] } {
  const interests = new Set<string>();
  const pain_points = new Set<string>();

  for (const m of messages) {
    const text = (m.message || '').toLowerCase();
    if (text.includes('암')) interests.add('암보험');
    if (text.includes('실손') || text.includes('실비')) interests.add('실손보험');
    if (text.includes('뇌') || text.includes('2대')) interests.add('뇌/심장보험');
    if (text.includes('태아') || text.includes('어린이')) interests.add('태아/어린이보험');
    if (text.includes('운전자')) interests.add('운전자보험');
    if (text.includes('치아')) interests.add('치아보험');
    if (text.includes('종신')) interests.add('종신보험');
    if (text.includes('간병')) interests.add('간병인보험');

    if (text.includes('다이어트') || text.includes('비싸') || text.includes('부담') || text.includes('줄이')) pain_points.add('보험료 다이어트');
    if (text.includes('갱신형') || text.includes('오르')) pain_points.add('갱신형 인상 부담');
    if (text.includes('중복')) pain_points.add('보장 중복 우려');
    if (text.includes('어려') || text.includes('모르')) pain_points.add('보험 용어 어려움');
  }

  return {
    interests: Array.from(interests),
    pain_points: Array.from(pain_points)
  };
}

// ── 키워드 룰 기반 점수화 (Gemini 호출 없음 → 비용 0원) ──────────────────────
function ruleBasedScore(text: string): { pos: number; neg: number; actionType: string; actionScore: number } {
  const t = text.toLowerCase();

  const posKeywords = ['좋아요', '맞아요', '네', '알겠어요', '감사', '도움', '궁금', '한번', '볼게요', '해볼게요', '신청', '부탁드려요', '알려주세요', '관심', '비교해줘', '봐줘', '어떻게', '얼마', '가능', 'ok', '오케이'];
  const negKeywords = ['싫어요', '아니요', '됐어요', '괜찮아요', '필요없어요', '사기', '스팸', '광고', '귀찮', '나중에', '바빠요', '안할게요', '하지마세요', '차단', '신고'];
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
  supabase: any,
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

    const plannerMsgs = msgs.filter(m => m.sender_id === plannerId);
    if (plannerMsgs.length === 0) return;

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
          success_count: (existing.success_count || 0) + 1,
          updated_at: new Date().toISOString()
        }).eq('id', existing.id);
        console.log(`[Planner Learn] ✅ 기존 멘트 가중치 +25: id=${existing.id}`);
      } else {
        await supabase.from('insurance_scripts').insert({
          consultation_step: step,
          script_text: msg.message,
          script_type: 'planner_manual',
          description: `설계사 직접 성공 멘트 (리드 ${leadId})`,
          success_weight: 25,
          success_count: 1,
          used_count: 1,
          ab_group: 'A',
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
  0: { label: '대기중', color: 'bg-slate-800 text-slate-500 border border-slate-750' },
  1: { label: '인사응대', color: 'bg-slate-800 text-slate-400 border border-slate-750' },
  2: { label: '코드인식', color: 'bg-blue-950 text-blue-400 border border-blue-900' },
  3: { label: 'SMS안내', color: 'bg-cyan-950 text-cyan-400 border border-cyan-900' },
  5: { label: '인증완료', color: 'bg-yellow-950 text-yellow-400 border border-yellow-900' },
  7: { label: '적극상담', color: 'bg-emerald-950 text-emerald-400 border border-emerald-900' },
  10: { label: '🔥설계요청', color: 'bg-orange-950 text-orange-400 border border-orange-900 animate-pulse' },
};

function getActionInfo(score: number): { label: string; color: string } {
  const keys = [10, 7, 5, 3, 2, 1, 0];
  for (const k of keys) {
    if (score >= k) return ACTION_SCORE_LABELS[k];
  }
  return ACTION_SCORE_LABELS[0];
}

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

interface CustomerChatTabProps {
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
}

interface ChatRoom {
  id: string;
  name?: string;
  type: string;
  created_at: string;
  otherMember?: {
    id: string;
    name: string;
    role: 'super' | 'agency' | 'planner';
    subText?: string;
    profile_image_url?: string;
    phone?: string;
  };
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

export function CustomerChatTab({ currentUser, showHelpGuide = false, onToggleHelpGuide, initialRoomId, onClearInitialRoomId }: CustomerChatTabProps) {
  const supabase = createClient();
  const currentUserId = currentUser.plannerId || currentUser.agencyId || ADMIN_ID;

  const [plannerRegNumber, setPlannerRegNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchReg = async () => {
      try {
        const { data, error } = await supabase
          .from('planners')
          .select('registration_number')
          .eq('id', currentUserId)
          .maybeSingle();
        if (!error && data) {
          setPlannerRegNumber(data.registration_number || '');
        }
      } catch (err) {
        console.warn('Failed to fetch planner reg number:', err);
      }
    };
    fetchReg();
  }, [currentUserId]);

  const cleanReg = plannerRegNumber ? (plannerRegNumber.includes('|') ? plannerRegNumber.split('|')[0] : (plannerRegNumber.startsWith('dist_') ? '' : plannerRegNumber)) : '';
  const isRegMissing = currentUser.role !== 'super' && (!cleanReg || cleanReg.trim() === '');
  const isDemoMode = window.location.search.includes('demo=');

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationScores, setConversationScores] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState('');

  const [loading, setLoading] = useState(false);
  const [userRoomIds, setUserRoomIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const chatEndRef = useRef<HTMLDivElement>(null);

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
          const isTargetLead = selectedLead?.id && payload.new?.id === selectedLead.id;
          if (roomCode === selectedRoom.id || isTargetLead) {
            setSelectedLead(payload.new);
            setIsBotActive(payload.new?.is_bot_active !== false);
            console.log('[Real-time Sync] ⚡ 고객 리드 점수 및 AI 브리핑 실시간 동기화 완료:', payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedRoom?.id]);

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
      playChime(now, 523.25, 0.25);
      playChime(now + 0.12, 659.25, 0.35);
    } catch (e) {
      console.warn("Failed to play notification sound:", e);
    }
  };

  const fetchRooms = async () => {
    try {
      let roomIds: string[] = [];

      // 대리점 대표(role === 'agency')인 경우 소속 설계사의 대화방 목록도 함께 조회하여 통합 모니터링 지원
      if (currentUser.role === 'agency' && currentUser.agencyId) {
        const { data: plannersData } = await supabase
          .from('planners')
          .select('id')
          .eq('agency_id', currentUser.agencyId);

        const plannerIds = (plannersData || []).map(p => p.id);
        const targetUserIds = Array.from(new Set([currentUserId, ...plannerIds]));

        const { data: memberData, error: memberErr } = await supabase
          .from('chat_room_members')
          .select('room_id')
          .in('user_id', targetUserIds);

        if (memberErr) throw memberErr;
        if (memberData) {
          roomIds = Array.from(new Set(memberData.map(m => m.room_id)));
        }
      } else {
        // 일반 설계사인 경우 본인이 할당된 방만 조회
        const { data: memberData, error: memberErr } = await supabase
          .from('chat_room_members')
          .select('room_id')
          .eq('user_id', currentUserId);

        if (memberErr) throw memberErr;
        if (memberData) {
          roomIds = memberData.map(m => m.room_id);
        }
      }

      if (roomIds.length === 0) {
        setRooms([]);
        return;
      }

      setUserRoomIds(roomIds);

      const { data: roomsData, error: roomsErr } = await supabase
        .from('chat_rooms')
        .select('id, name, type, created_at')
        .in('id', roomIds);

      if (roomsErr) throw roomsErr;

      let filteredRoomsData = roomsData || [];
      filteredRoomsData = filteredRoomsData.filter(r => r.name?.startsWith('실시간 고객 상담'));

      const roomsList: ChatRoom[] = [];

      for (const r of filteredRoomsData) {
        const { data: membersData, error: membersErr } = await supabase
          .from('chat_room_members')
          .select('user_id')
          .eq('room_id', r.id);

        if (membersErr) continue;

        const otherMemberId = membersData.find(m =>
          m.user_id !== currentUserId &&
          m.user_id !== '22222222-2222-4222-a222-222222222222' &&
          m.user_id !== '11111111-1111-4111-a111-111111111111' &&
          m.user_id !== '00000000-0000-4000-a000-000000000000'
        )?.user_id || membersData.find(m => m.user_id !== currentUserId)?.user_id;

        let otherMember: any = null;
        if (otherMemberId) {
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

        const { data: lastMsgData } = await supabase
          .from('chat_messages')
          .select('message, created_at')
          .eq('room_id', r.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const { count } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('room_id', r.id)
          .eq('is_read', false)
          .neq('sender_id', currentUserId);

        let botActive = true;
        const { data: leadData } = await supabase
          .from('customer_leads')
          .select('is_bot_active')
          .eq('raw_payload->>chat_room_id', r.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (leadData && leadData.length > 0) {
          botActive = leadData[0].is_bot_active;
        }

        roomsList.push({
          id: r.id,
          name: r.name,
          type: r.type,
          created_at: r.created_at,
          otherMember: otherMember || { id: otherMemberId || 'guest', name: '고객', role: 'planner', subText: '고객님' },
          lastMessage: lastMsgData?.[0]?.message || '대화 내역이 없습니다.',
          lastMessageTime: lastMsgData?.[0]?.created_at,
          unreadCount: count || 0,
          isBotActive: botActive
        });
      }

      roomsList.sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA;
      });

      setRooms(roomsList);

      const activeRoomsForGlobal = roomsList.filter(r => !pinnedRoomIds.includes(r.id));
      if (activeRoomsForGlobal.length > 0) {
        const allActive = activeRoomsForGlobal.every(r => r.isBotActive);
        setGlobalAiActive(allActive);
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      const { data: scoreData, error: scoreErr } = await supabase
        .from('ai_conversation_scores')
        .select('*')
        .eq('chat_room_id', roomId);
      if (!scoreErr) {
        setConversationScores(scoreData || []);
      }

      // 🔄 [과거 대화 전수 소급 계산] 기존 대화 내역의 긍정/부정 점수 및 고객 기억(Memory) 전수 소급 분석
      if (data && data.length > 0) {
        const userMsgs = data.filter(m => m.sender_id !== currentUserId);
        const { data: targetLead } = await supabase
          .from('customer_leads')
          .select('id, pos_score, neg_score, action_score, raw_payload')
          .eq('raw_payload->>chat_room_id', roomId)
          .maybeSingle();

        if (targetLead && userMsgs.length > 0) {
          let cumPos = 0;
          let cumNeg = 0;
          let maxActionScore = targetLead.action_score || 0;

          for (const uMsg of userMsgs) {
            const sc = ruleBasedScore(uMsg.message);
            cumPos += sc.pos;
            cumNeg += sc.neg;
            if (sc.actionScore > maxActionScore) maxActionScore = sc.actionScore;
            await extractAndSaveMemory(supabase, targetLead.id, uMsg.message);
          }

          const finalPos = Math.max(targetLead.pos_score || 0, Math.min(100, cumPos));
          const finalNeg = Math.max(targetLead.neg_score || 0, Math.min(100, cumNeg));

          await supabase
            .from('customer_leads')
            .update({
              pos_score: finalPos,
              neg_score: finalNeg,
              action_score: maxActionScore
            })
            .eq('id', targetLead.id);
        }
      }

      await syncLeadBotStatus(roomId);

      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('room_id', roomId)
        .neq('sender_id', currentUserId);

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

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedRoom || !newMessageText.trim()) return;

    const msgText = newMessageText.trim();
    setNewMessageText('');

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

      if (selectedLead?.id) {
        setTimeout(async () => {
          try {
            const score = ruleBasedScore(msgText);

            await supabase.from('ai_conversation_scores').insert({
              lead_id: selectedLead.id,
              chat_room_id: selectedRoom.id,
              planner_id: currentUserId,
              message_text: msgText,
              ai_response: '(설계사 직접 메시지)',
              action_type: score.actionType,
              action_score: score.actionScore,
              pos_score: score.pos,
              neg_score: score.neg,
            });

            if (score.pos > 0 || score.neg > 0 || score.actionScore > 0) {
              await supabase.rpc('update_lead_ai_scores', {
                p_lead_id: selectedLead.id,
                p_pos_delta: score.pos,
                p_neg_delta: score.neg,
                p_new_action: score.actionScore > 0 ? score.actionScore : null,
              });
            }

            if (score.actionType === 'proposal_request') {
              console.log('[Planner Learn] 🔥 proposal_request 감지! Gemini 정밀 분석 시작...');
              await analyzeConversationWithGemini(supabase, selectedRoom.id, selectedLead.id, currentUserId);
            }
          } catch (err) {
            console.warn('[Planner Score] 백그라운드 점수화 실패:', err);
          }
        }, 500);
      }

    } catch (err) {
      console.error("Failed to send message:", err);
      alert("메시지 전송에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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

          setMessages((prev) => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          if (newMsg.sender_id !== currentUserId) {
            supabase
              .from('chat_messages')
              .update({ is_read: true })
              .eq('id', newMsg.id)
              .then();

            playNotificationSound();

            if (selectedLead?.id) {
              extractAndSaveMemory(supabase, selectedLead.id, newMsg.message)
                .then(() => {
                  setTimeout(() => {
                    syncLeadBotStatus(selectedRoom.id);
                  }, 600);
                })
                .catch(() => { });
            }
          }
        }
      )
      .subscribe();

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
          // ⚡ [실시간 동기화] 점수 추가 감지 시 고객 리드 상태 및 점수를 즉시 재조회하여 반영
          if (selectedRoom?.id) {
            syncLeadBotStatus(selectedRoom.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(scoreChannel);
    };
  }, [selectedRoom?.id]);

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

          if (userRoomIds.includes(newMsg.room_id) && newMsg.sender_id !== currentUserId) {
            if (!selectedRoom || selectedRoom.id !== newMsg.room_id) {
              playNotificationSound();
              fetchRooms();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, [currentUserId, userRoomIds, selectedRoom?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`flex flex-col h-[600px] sm:h-[680px] bg-slate-950/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-violet-950/10 text-left transition-all duration-300 ${showHelpGuide ? 'help-guide-glow bg-slate-900/10' : 'border border-violet-500/20'
      }`}>

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-slate-900/50 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-black text-white tracking-wide mr-2">
            실시간 고객 상담 💬
          </h2>
          {onToggleHelpGuide && (
            <button
              type="button"
              onClick={onToggleHelpGuide}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-black transition-all relative overflow-hidden shadow-sm cursor-pointer ${showHelpGuide
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
      </div>

      {/* Main Grid */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* Left Sidebar: Active Customer Rooms */}
        <div className={`${selectedRoom ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-slate-800/80 flex-col bg-slate-950/40 overflow-y-auto`}>
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
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border text-left ${isSelected
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
                        alt={member?.name || '고객'}
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
                        {member?.name || '고객'}
                        {isPinned && (
                          <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-black animate-pulse shadow-sm shadow-rose-500/20">
                            📌 집중
                          </span>
                        )}
                        <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded border leading-none ${room.isBotActive
                            ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}>
                          {room.isBotActive ? '🤖 AI' : '👤 수동'}
                        </span>
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
              <div className="text-center py-12 text-slate-500 text-xs">상담 개설 대기 중인 고객이 없습니다.</div>
            )}
          </div>
        </div>

        {/* Right Side: Message Window */}
        <div className={`${selectedRoom ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-slate-950/20 relative overflow-hidden`}>
          {selectedRoom ? (
            <>
              {/* Message Header */}
              <div className="px-3 sm:px-6 py-4 border-b border-slate-800/80 bg-slate-900/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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
                      {selectedRoom.otherMember?.name || '고객'}
                      <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        온라인
                      </span>
                    </h3>
                    <p className="text-[9px] text-slate-400 mt-0.5">{selectedRoom.otherMember?.subText || '고객님'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {selectedLead && (
                    <div className="flex items-center gap-2">
                      {/* Pinned Focus Toggle Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          const isCurrentlyPinned = pinnedRoomIds.includes(selectedRoom.id);
                          togglePinRoom(selectedRoom.id);

                          const newBotStatus = isCurrentlyPinned;
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
                        className={`text-[9.5px] font-black px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${pinnedRoomIds.includes(selectedRoom.id)
                            ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                      >
                        {pinnedRoomIds.includes(selectedRoom.id) ? '📌 집중 상담 해제' : '📌 집중 상담 지정'}
                      </button>

                      {/* AI Bot Active/Pause Status & Toggle */}
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${isBotActive
                          ? 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                          : 'bg-slate-800 border-slate-750 text-slate-400'
                        }`}>
                        {isBotActive ? '🤖 AI 비서 응대중' : '👤 수동 상담 모드'}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!isBotActive && isRegMissing && !isDemoMode) {
                            alert('광고 심의필(등록번호) 정보가 등록되지 않아 실시간 AI 상담을 활성화할 수 없습니다. 프로필 설정 탭에서 심의필 번호를 먼저 등록해 주세요.');
                            return;
                          }
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
                        className={`text-[9.5px] font-black px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${isBotActive
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                            : (!isBotActive && isRegMissing && !isDemoMode)
                              ? 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                              : 'bg-orange-600 border-orange-500 text-white hover:bg-orange-500'
                          }`}
                      >
                        {isBotActive ? 'AI 상담 일시정지' : 'AI 상담 활성화' + ((isRegMissing && !isDemoMode) ? ' (비활성화)' : '')}
                      </button>
                    </div>
                  )}
                  <span className="hidden sm:flex text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    연결됨
                  </span>
                </div>
              </div>

              {/* AI metrics top bar */}
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
                      {(() => {
                        const totalPosFromScores = conversationScores.reduce((acc, s) => acc + (s.pos_score || 0), 0);
                        const displayPos = Math.max(selectedLead.pos_score ?? 0, totalPosFromScores);
                        const totalNegFromScores = conversationScores.reduce((acc, s) => acc + (s.neg_score || 0), 0);
                        const displayNeg = Math.max(selectedLead.neg_score ?? 0, totalNegFromScores);
                        const maxActionFromScores = Math.max(0, ...conversationScores.map(s => s.action_score || 0));
                        const displayAction = Math.max(selectedLead.action_score ?? 0, maxActionFromScores);

                        return (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] text-emerald-400 font-bold">긍정</span>
                              </div>
                              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(100, Math.round((displayPos / 30) * 100))}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-emerald-400 w-5 text-right">{displayPos}pt</span>
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
                                  style={{ width: `${Math.min(100, Math.round((displayNeg / 30) * 100))}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-rose-400 w-5 text-right">{displayNeg}pt</span>
                            </div>

                            {/* 행동 */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400">행동:</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getActionInfo(displayAction).color}`}>
                                {getActionInfo(displayAction).label}
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="px-6 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between gap-4 text-xs font-semibold backdrop-blur-sm">
                    {/* 감정 흐름 */}
                    {/* 감정 흐름 */}
                    {(() => {
                      const totalPosFromScores = conversationScores.reduce((acc, s) => acc + (s.pos_score || 0), 0);
                      const displayPos = Math.max(selectedLead?.pos_score ?? 0, totalPosFromScores);
                      const totalNegFromScores = conversationScores.reduce((acc, s) => acc + (s.neg_score || 0), 0);
                      const displayNeg = Math.max(selectedLead?.neg_score ?? 0, totalNegFromScores);
                      const maxActionFromScores = Math.max(0, ...conversationScores.map(s => s.action_score || 0));
                      const displayAction = Math.max(selectedLead?.action_score ?? 0, maxActionFromScores);

                      const prob = displayAction >= 10
                        ? 100
                        : Math.max(5, Math.min(99, Math.round((displayPos * 1.5) + (displayAction * 5.5))));

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
                        <>
                          <div className="flex items-center gap-2 select-none">
                            <span className="text-[10px] text-slate-500 font-bold">감정 흐름 곡선:</span>
                            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-850 px-2 py-1 rounded-lg">
                              <span className={`transition-all duration-300 ${displayNeg >= 15 ? 'opacity-100 font-bold scale-110 text-rose-400' : 'opacity-30 scale-90'}`}>⚠️ 이탈위험</span>
                              <span className="text-slate-600 font-normal">&gt;</span>
                              <span className={`transition-all duration-300 ${displayPos < 6 && displayNeg < 15 ? 'opacity-100 font-bold scale-110 text-slate-400' : 'opacity-30 scale-90'}`}>😐 대기</span>
                              <span className="text-slate-600 font-normal">&gt;</span>
                              <span className={`transition-all duration-300 ${displayPos >= 6 && displayPos < 12 && displayNeg < 15 ? 'opacity-100 font-bold scale-110 text-emerald-400' : 'opacity-30 scale-90'}`}>😊 호감</span>
                              <span className="text-slate-600 font-normal">&gt;</span>
                              <span className={`transition-all duration-300 ${displayPos >= 12 && displayAction < 10 && displayNeg < 15 ? 'opacity-100 font-bold scale-110 text-cyan-400' : 'opacity-30 scale-90'}`}>😮 관심</span>
                              <span className="text-slate-600 font-normal">&gt;</span>
                              <span className={`transition-all duration-300 ${displayAction >= 10 ? 'opacity-100 font-bold scale-120 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'opacity-30 scale-90'}`}>🔥 설계요청</span>
                            </div>
                          </div>

                          {/* 성공 확률 및 성향 배지 */}
                          <div className="flex items-center gap-3">
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
                            <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${bgClass}`}>
                              <span className={`text-[11px] ${colorClass}`}>{prob}%</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </>
              )}

              {/* Chat workspace split panel */}
              <div className="flex-1 flex overflow-hidden">

                {/* Left Side: Message History and Input Form */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Golden time banner */}
                  {(() => {
                    if (!selectedLead) return null;
                    const pos = selectedLead.pos_score || 0;
                    const action = selectedLead.action_score || 0;
                    const isGoldenTime = action >= 7 || pos >= 12;
                    if (!isGoldenTime) return null;

                    return (
                      <div className="mx-6 mt-3 p-3 bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-yellow-500/20 border border-amber-500/30 rounded-xl flex items-center justify-between shadow-lg shadow-orange-950/20 animate-pulse select-none shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⏰</span>
                          <div className="text-left">
                            <p className="text-xs font-black text-amber-300">골든타임 개입 알림 (전환율 최고치 예측)</p>
                            <p className="text-[10px] text-amber-100 font-semibold mt-0.5">지금 개입하면 전환율 최고입니다! 고객 설득 직전 상태 🔥</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const updatedPayload = {
                              ...(selectedLead.raw_payload || {}),
                              timeline: [
                                {
                                  id: `planner-gold-intervene-${Date.now()}`,
                                  type: 'system_log',
                                  author: '설계사',
                                  detail: '설계사가 골든타임 개입 알림을 확인하고 수동 상담을 시작했습니다.',
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
                            await fetchRooms();
                          }}
                          className="px-2.5 py-1 bg-amber-50 border border-amber-400 text-slate-950 text-[10px] font-black rounded-lg hover:bg-amber-400 active:scale-95 transition-all cursor-pointer shadow-md shadow-amber-600/10 shrink-0"
                        >
                          ⚡ 즉시 개입 (수동 전환)
                        </button>
                      </div>
                    );
                  })()}

                  {/* AI scoring help guide */}
                  {showHelpGuide && (
                    <div className="mx-6 mt-3 p-4 bg-gradient-to-br from-violet-950/45 to-slate-900/90 border border-violet-500/35 rounded-2xl shadow-xl relative overflow-hidden animate-in slide-in-from-top duration-300">
                      <div className="absolute top-0 right-0 p-3">
                        <button
                          type="button"
                          onClick={onToggleHelpGuide}
                          className="text-slate-500 hover:text-slate-300 text-xs font-bold font-mono cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-violet-500/10 border border-violet-400/20 rounded-xl text-violet-400 shrink-0">
                          <Info className="w-5 h-5 text-violet-400 animate-pulse" />
                        </div>
                        <div className="space-y-1.5 pr-6 text-left">
                          <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                            🏆 AI 실시간 감정·행동 점수화 도움말 가이드
                            <span className="text-[9px] bg-orange-500/20 border border-orange-500/30 text-orange-400 px-1.5 py-0.2 rounded font-black">PRO 영업 도구</span>
                          </h4>
                          <p className="text-[11px] text-slate-300 font-semibold leading-relaxed break-keep">
                            이 화면은 실시간 대화를 추적하여 고객의 <span className="text-emerald-400">정서(긍정/부정)</span> 및 <span className="text-violet-400">행동 달성도</span>를 분석하여 10점 만점의 점수를 실시간으로 부여합니다.
                            <br />
                            <span className="text-orange-400 font-black">데이터가 쌓일수록</span> AI 비서가 성공적인 영업 멘트 패턴을 자가 학습(Self-Learning)하여, 고객의 심리를 자극하고 계약 성사율을 극대화시켜 당신을 **최고의 실적을 올리는 1등 보험 설계사**로 만들어 줍니다!
                          </p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2.5 pt-2 border-t border-slate-800/80">
                            <div className="text-[10px] text-slate-400">
                              <span className="font-bold text-emerald-400">🟢 긍정 지수 (0~10점):</span> 고객이 AI 설명에 호응하거나 긍정한 누적치
                            </div>
                            <div className="text-[10px] text-slate-400">
                              <span className="font-bold text-rose-400">🔴 부정 지수 (0~10점):</span> 불신, 이탈 위험을 감지하여 설계사 개입을 경고하는 지표
                            </div>
                            <div className="text-[10px] text-slate-400">
                              <span className="font-bold text-violet-400">⚡ 행동 점수 (1~10점):</span> 첫 인사(1pt)부터 설계안 최종 요청(10pt)까지의 진척도
                            </div>
                            <div className="text-[10px] text-slate-400">
                              <span className="font-bold text-orange-400">🧠 자가 진화 RAG:</span> 10점 성공 패턴을 누적 수집하여 더 스마트한 제안 자동화
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => {
                      const otherMemberId = selectedRoom?.otherMember?.id;
                      const isMe = msg.sender_id === '00000000-0000-4000-a000-000000000000' || 
                                   msg.sender_id === '22222222-2222-4222-a222-222222222222' || 
                                   msg.sender_id === '11111111-1111-4111-a111-111111111111' || 
                                   msg.sender_id === 'c3b2830f-0a53-47df-857b-03a7fc74114e' ||
                                   msg.sender_id === currentUserId;
                      const msgTime = new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                      const matchedScore = conversationScores.find(s => {
                        const cleanMsg = msg.message.trim();
                        const cleanText = (s.message_text || '').trim();
                        const cleanAi = (s.ai_response || '').trim();
                        const isShort = cleanMsg.length < 5;
                        return isMe
                          ? (cleanText === cleanMsg || cleanAi === cleanMsg || (!isShort && cleanAi.includes(cleanMsg)))
                          : (cleanText === cleanMsg || (!isShort && cleanText.includes(cleanMsg)));
                      });

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                        >
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
                            <div className="flex flex-col gap-1.5 items-end max-w-md">
                              <div
                                className="px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed bg-violet-600 text-white rounded-br-none shadow-md shadow-violet-700/10 text-left"
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
                          )}

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

                  {/* Input Form */}
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

                {/* Right Side: AI briefing card */}
                {selectedLead && (
                  <div className="hidden lg:flex w-72 border-l border-slate-800/80 bg-slate-950/40 flex-col p-4 overflow-y-auto shrink-0 select-none backdrop-blur-md">
                    <div className="flex items-center gap-1.5 mb-4 border-b border-slate-800/80 pb-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        🤖 AI 실시간 요약 브리핑
                      </h4>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl space-y-3.5">
                        {(() => {
                          const memFromMsg = extractMemoryFromMessages(messages);
                          const dbInterests = selectedLead.raw_payload?.customer_memory?.interests || [];
                          const displayInterests = Array.from(new Set([...dbInterests, ...memFromMsg.interests]));

                          const dbPainPoints = selectedLead.raw_payload?.customer_memory?.pain_points || [];
                          const displayPainPoints = Array.from(new Set([...dbPainPoints, ...memFromMsg.pain_points]));

                          return (
                            <>
                              {/* Interests */}
                              <div>
                                <span className="text-[10px] text-slate-500 font-bold block mb-1">📌 관심사</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {displayInterests.length > 0 ? (
                                    displayInterests.map((it: string, i: number) => (
                                      <span key={i} className="text-[9px] bg-violet-600/15 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-md font-bold">
                                        {it}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-slate-500">분석 중... 😐</span>
                                  )}
                                </div>
                              </div>

                              {/* Pain points */}
                              <div className="border-t border-slate-850 pt-3">
                                <span className="text-[10px] text-slate-500 font-bold block mb-1">🔥 고민거리</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {displayPainPoints.length > 0 ? (
                                    displayPainPoints.map((pt: string, i: number) => (
                                      <span key={i} className="text-[9px] bg-rose-600/10 border border-rose-500/20 text-rose-400 px-2 py-0.5 rounded-md font-bold">
                                        {pt}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-slate-500">분석 중... 😐</span>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })()}

                        {/* Progress */}
                        <div className="border-t border-slate-850 pt-3">
                          <span className="text-[10px] text-slate-500 font-bold block mb-1.5">📍 진행 상황</span>
                          <span className="text-[10px] text-slate-300 font-black leading-relaxed block break-keep">
                            {getLeadProgressText(selectedLead)}
                          </span>
                        </div>
                      </div>

                      {/* Strategy */}
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

              </div>
            </>
          ) : (
            // Welcome screen
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/10 overflow-y-auto">
              <div className="w-14 h-14 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-3 text-violet-400 shadow-xl shadow-violet-950/20">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-black text-white tracking-wide">
                실시간 고객 상담 센터
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed break-keep">
                고객과의 1:1 실시간 상담을 지원합니다.
                <br />
                왼쪽 목록에서 상담을 진행할 고객을 선택해 보세요.
              </p>

              {/* AI Master control switches */}
              <div className="mt-6 w-full max-w-lg bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center space-y-3 shadow-lg">
                <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                  🤖 AI 비서 마스터 스위치 (전체 고객 일괄 통제)
                </span>
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={async () => {
                      if (isRegMissing && !isDemoMode) {
                        alert('광고 심의필(등록번호) 정보가 등록되지 않아 전체 AI 상담을 일괄 활성화할 수 없습니다. 프로필 설정 탭에서 심의필 번호를 먼저 등록해 주세요.');
                        return;
                      }
                      updateGlobalAiActive(true);
                      try {
                        const roomIdsToUpdate = rooms.filter(r => !pinnedRoomIds.includes(r.id)).map(r => r.id);
                        let updatedCount = 0;
                        if (roomIdsToUpdate.length > 0) {
                          const { data: leadsToUpdate, error: queryErr } = await supabase
                            .from('customer_leads')
                            .select('id, raw_payload');

                          if (!queryErr && leadsToUpdate) {
                            const targetLeads = leadsToUpdate.filter(lead => {
                              const roomId = lead.raw_payload?.chat_room_id;
                              return roomId && roomIdsToUpdate.includes(roomId);
                            });

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
                          }
                        }
                        setToastMessage(`🤖 전체 AI 자동 응대가 일괄 활성화되었습니다. (총 ${updatedCount}개 방 가동 시작)`);
                        await fetchRooms();
                        if (selectedRoom && !pinnedRoomIds.includes(selectedRoom.id)) {
                          setIsBotActive(true);
                        }
                      } catch (e) {
                        console.error("Failed to globally resume AI bot:", e);
                        setToastMessage("상태 업데이트에 실패했습니다.");
                      }
                    }}
                    className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer border ${globalAiActive
                        ? 'bg-orange-600 border-orange-500 text-white shadow-md shadow-orange-600/30 scale-105 ring-2 ring-orange-500/15'
                        : (isRegMissing && !isDemoMode)
                          ? 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 opacity-60'
                      }`}
                  >
                    🤖 전체 AI 상담 시작 {isRegMissing && !isDemoMode && '(비활성화)'}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      updateGlobalAiActive(false);
                      try {
                        const roomIdsToUpdate = rooms.map(r => r.id);
                        let updatedCount = 0;
                        if (roomIdsToUpdate.length > 0) {
                          const { data: leadsToUpdate, error: queryErr } = await supabase
                            .from('customer_leads')
                            .select('id, raw_payload');

                          if (!queryErr && leadsToUpdate) {
                            const targetLeads = leadsToUpdate.filter(lead => {
                              const roomId = lead.raw_payload?.chat_room_id;
                              return roomId && roomIdsToUpdate.includes(roomId);
                            });

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
                          }
                        }
                        setToastMessage(`👤 전체 AI 자동 응대가 일시정지(차단)되었습니다. (총 ${updatedCount}개 방 수동 전환)`);
                        await fetchRooms();
                        if (selectedRoom) {
                          setIsBotActive(false);
                        }
                      } catch (e) {
                        console.error("Failed to globally pause AI bot:", e);
                        setToastMessage("상태 업데이트에 실패했습니다.");
                      }
                    }}
                    className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all border cursor-pointer ${!globalAiActive
                        ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-600/30 scale-105 ring-2 ring-rose-500/15'
                        : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 opacity-60'
                      }`}
                  >
                    👤 전체 AI 상담 일시정지
                  </button>
                </div>
              </div>

              {/* Status notice */}
              <div className={`mt-4 p-4 rounded-xl border text-xs text-left leading-relaxed transition-all duration-300 ${globalAiActive
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
        </div>

      </div>

      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] max-w-sm p-4 bg-slate-900 border border-orange-500/30 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-6 duration-300 select-none">
          <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-xs shrink-0">
            🤖
          </div>
          <div className="text-left">
            <p className="text-xs font-black text-slate-100">알림</p>
            <p className="text-[11px] text-slate-350 font-bold mt-0.5 leading-normal">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
