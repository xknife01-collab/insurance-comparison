import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, ShieldCheck, Check } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import { generateAiResponse, parseCodeFromMessage, ACTION_SCORE_MAP, actionScoreToStep, getEmbedding, classifyCustomerSegment } from '../../lib/insurance/aiPersona';
import { searchGoogleAndExpandKb } from '../../lib/insurance/aiGoogleSearchService';
import { formatInputFieldExplanationContext } from '../../lib/insurance/aiInputFieldExplainService';
import { buildProposalFactContext } from '../../lib/insurance/aiProposalBridgeService';
import { ReportLinkButton } from './ReportLinkButton';
import { DigitalBusinessCard } from './DigitalBusinessCard';
import type { AiContext, CustomerMemory } from '../../lib/insurance/aiPersona';

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
    // 관심 보험
    if (text.includes('암')) interests.add('암보험');
    if (text.includes('실손') || text.includes('실비')) interests.add('실손보험');
    if (text.includes('뇌') || text.includes('2대')) interests.add('뇌/심장보험');
    if (text.includes('태아') || text.includes('어린이')) interests.add('태아/어린이보험');
    if (text.includes('운전자')) interests.add('운전자보험');
    if (text.includes('자동차')) interests.add('자동차보험');
    if (text.includes('치아')) interests.add('치아보험');
    if (text.includes('종신')) interests.add('종신보험');

    // 직업
    if (text.includes('회사원') || text.includes('직장인') || text.includes('회사 다니')) job = '회사원';
    if (text.includes('사업') || text.includes('자영업') || text.includes('가게')) job = '자영업자';
    if (text.includes('프리랜서')) job = '프리랜서';
    if (text.includes('주부')) job = '주부';
    if (text.includes('공무원')) job = '공무원';

    // 가족 관계
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

    // 페인 포인트 (고민거리)
    if (text.includes('비싸') || text.includes('부담') || text.includes('부족') || text.includes('비용')) pain_points.add('보험료 부담');
    if (text.includes('갱신형') || text.includes('오르') || text.includes('인상') || text.includes('갱신')) pain_points.add('갱신형 보험료 부담');
    if (text.includes('중복') || text.includes('비슷')) pain_points.add('보장 중복 우려');
    if (text.includes('어려') || text.includes('모르')) pain_points.add('보험 용어 이해의 어려움');

    // 3. 변경 사항이 있을 때만 업데이트
    const updatedMemory: CustomerMemory = {
      interests: Array.from(interests),
      job,
      family: Object.keys(family).length > 0 ? family : undefined,
      pain_points: Array.from(pain_points),
      last_context: userMessage.slice(0, 50),
      updated_at: new Date().toISOString()
    };

    // 간단한 비교를 통해 업데이트 수행
    if (JSON.stringify(existingMemory) !== JSON.stringify(updatedMemory)) {
      await supabase.from('customer_leads').update({
        raw_payload: {
          ...payload,
          customer_memory: updatedMemory
        }
      }).eq('id', leadId);
      console.log(`[Memory Sync] 🧠 고객 기억 업데이트 완료:`, updatedMemory);
    }
  } catch (err) {
    console.warn('[Memory Sync] 실패:', err);
  }
}

// ── [기능8] Supabase 지식 테이블 및 스크립트 테이블에 누락된 임베딩 벡터 자동 생성/채우기 ──
async function syncMissingEmbeddings(supabase: any) {
  try {
    // 1. 지식 테이블 (insurance_knowledge_base)
    const { data: kbRows } = await supabase
      .from('insurance_knowledge_base')
      .select('id, content')
      .is('embedding', null)
      .limit(5);

    if (kbRows && kbRows.length > 0) {
      console.log(`[Auto-Embedding] 🔍 지식 테이블 누락 ${kbRows.length}건 발견. 동기화 중...`);
      for (const row of kbRows) {
        const vector = await getEmbedding(row.content);
        if (vector.length > 0) {
          await supabase
            .from('insurance_knowledge_base')
            .update({ embedding: vector })
            .eq('id', row.id);
        }
      }
      console.log('[Auto-Embedding] ✅ 지식 테이블 동기화 완료');
    }

    // 2. 멘트 라이브러리 테이블 (insurance_scripts)
    const { data: scriptRows } = await supabase
      .from('insurance_scripts')
      .select('id, script_text')
      .is('embedding', null)
      .limit(5);

    if (scriptRows && scriptRows.length > 0) {
      console.log(`[Auto-Embedding] 🔍 멘트 테이블 누락 ${scriptRows.length}건 발견. 동기화 중...`);
      for (const row of scriptRows) {
        const vector = await getEmbedding(row.script_text);
        if (vector.length > 0) {
          await supabase
            .from('insurance_scripts')
            .update({ embedding: vector })
            .eq('id', row.id);
        }
      }
      console.log('[Auto-Embedding] ✅ 멘트 테이블 동기화 완료');
    }
  } catch (err) {
    console.warn('[Auto-Embedding] 백그라운드 동기화 실패:', err);
  }
}

// ── 한국어 키워드 추출 (시맨틱 RAG 기능) ─────────────────────────────────────
function extractKeywords(messages: string[]): string[] {
  const stopWords = new Set(['이','가','을','를','은','는','의','에','에서','로','으로','와','과','도','만','에게','한테','께','부터','까지','보다','처럼','같이','마다','라도','이라도','어요','아요','습니다','니다','네요','겠어요','할게요','할까요','주세요','있어요','없어요','인데','인가요','인지','그','이','저','것','수','더','좀','정말','진짜','너무','뭐','왜','어떻게','언제','어디']);
  const allWords = messages.join(' ')
    .replace(/[^\w가-힣\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2 && !stopWords.has(w));
  const freq: Record<string, number> = {};
  allWords.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

interface AiChatWidgetProps {
  plannerId: string;
  plannerName: string;
  agencyName?: string | null;
  agencyId?: string | null;
  leadSource?: string | null;
  currentSimulationCode: string;
  onTriggerAuth: () => void;
  onTriggerAligoAuth?: () => void;
  onTriggerHyphenAuth?: () => void;
  isUnlocked: boolean;
  externalIsOpen?: boolean;
  onCloseExternal?: () => void;
  registrationNumber?: string | null;
  customPhone?: string | null;
  customEmail?: string | null;
  customAddress?: string | null;
  certificationMessage?: string | null;
  logoUrl?: string | null;
}

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AiChatWidget({
  plannerId,
  plannerName,
  agencyName,
  agencyId,
  leadSource,
  currentSimulationCode,
  onTriggerAuth,
  onTriggerAligoAuth,
  onTriggerHyphenAuth,
  isUnlocked,
  externalIsOpen,
  onCloseExternal,
  registrationNumber,
  customPhone,
  customEmail,
  customAddress,
  certificationMessage,
  logoUrl
}: AiChatWidgetProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : localIsOpen;
  
  const setIsOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    if (typeof val === 'function') {
      const nextVal = val(isOpen);
      if (externalIsOpen !== undefined) {
        if (!nextVal && onCloseExternal) onCloseExternal();
      } else {
        setLocalIsOpen(nextVal);
      }
    } else {
      if (externalIsOpen !== undefined) {
        if (!val && onCloseExternal) onCloseExternal();
      } else {
        setLocalIsOpen(val);
      }
    }
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBotActive, setIsBotActive] = useState(true);
  const [currentLeadId, setCurrentLeadId] = useState<number | null>(null);
  const [renderedCardUrl, setRenderedCardUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRoomIdRef = useRef<string | null>(null);
  const usedScriptIdsRef = useRef<number[]>([]); // [기능5] 전환율 추적용 스크립트 ID
  const supabase = createClient();

  // 실시간 B2B 대리점/설계사 등록 마이페이지 세팅 정보를 템플릿에 실시간으로 오버레이 합성하는 로직
  useEffect(() => {
    const generateCard = () => {
      const img = new Image();
      img.src = '/123456.png';
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1079;
        canvas.height = 698;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // 1. 공백 템플릿 이미지 드로잉 (1079x698)
        ctx.drawImage(img, 0, 0, 1079, 698);
        
        // 골드 컬러 세팅
        ctx.fillStyle = '#E5C158';
        ctx.textAlign = 'left';
        
        // 2. 좌측 영역 그리기 (이름, 소속, 직책)
        // 이름
        ctx.font = 'bold 55px "Malgun Gothic", "Nanum Gothic", sans-serif';
        const pName = plannerName || '박효진';
        ctx.fillText(pName, 110, 275);
        
        // 소속 (줄바꿈 처리)
        ctx.font = 'bold 30px "Malgun Gothic", "Nanum Gothic", sans-serif';
        const company = agencyName || '인카금융서비스 프로사업단총괄 라이즈지점';
        if (company.includes('인카금융서비스')) {
          ctx.fillText('인카금융서비스', 110, 365);
          ctx.fillText(company.replace('인카금융서비스', '').trim(), 110, 415);
        } else if (company.length > 12) {
          ctx.fillText(company.substring(0, 11), 110, 365);
          ctx.fillText(company.substring(11).trim(), 110, 415);
        } else {
          ctx.fillText(company, 110, 365);
        }
        
        // 직책 / 인증문구
        const pCert = certificationMessage || '총괄 관리자';
        ctx.fillText(pCert, 110, 475);
        
        // 3. 우측 영역 그리기 (전화번호, 이메일, 주소)
        ctx.font = 'normal 24px "Malgun Gothic", "Nanum Gothic", sans-serif';
        ctx.fillText(`Phone: ${customPhone || '010-6500-0636'}`, 580, 275);
        ctx.fillText(`Email: ${customEmail || 'zkfnth01@naver.com'}`, 580, 335);
        
        // 주소 (줄바꿈 처리)
        const rawAddr = customAddress || '경기 남양주시 다산지금로16번길 43 타임프라자 403호';
        let displayAddr = rawAddr;
        if (displayAddr.includes('보험대리점 :')) {
          displayAddr = '경기 남양주시 다산지금로16번길 43 타임프라자 403호';
        }
        
        if (displayAddr.includes('다산지금로16번길')) {
          ctx.fillText('Address: 경기 남양주시 다산지금로16번길', 580, 395);
          ctx.fillText('43 타임프라자 403호', 670, 435);
        } else if (displayAddr.length > 20) {
          ctx.fillText(`Address: ${displayAddr.substring(0, 18)}`, 580, 395);
          ctx.fillText(displayAddr.substring(18).trim(), 670, 435);
        } else {
          ctx.fillText(`Address: ${displayAddr}`, 580, 395);
        }
        
        try {
          setRenderedCardUrl(canvas.toDataURL('image/png'));
        } catch (e) {
          console.warn('[Card Generate] Canvas export failed:', e);
        }
      };
      
      img.onerror = () => {
        console.warn('[Card Generate] Template image failed to load');
      };
    };
    
    generateCard();
  }, [plannerName, agencyName, customPhone, customEmail, customAddress, certificationMessage, logoUrl]);

  // 1. guest_chat_room_id and guest_user_id from localStorage (Scoped by plannerId to avoid cross-planner message bleed)
  const getOrCreateGuestDetails = () => {
    const roomKey = `ins_guest_chat_room_id_${plannerId}`;
    let roomId = localStorage.getItem(roomKey);
    if (!roomId) {
      roomId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      localStorage.setItem(roomKey, roomId);
    }

    let guestId = localStorage.getItem('ins_guest_user_id');
    if (!guestId) {
      guestId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      localStorage.setItem('ins_guest_user_id', guestId);
    }

    return { roomId, guestId };
  };

  const { roomId: guestRoomId, guestId: guestUserId } = getOrCreateGuestDetails();

  // ── AI 점수 Supabase 저장 헬퍼 ──────────────────────────────────────────────
  const saveAiScores = async ({
    leadId,
    posScore,
    negScore,
    actionType,
    actionScore,
    messageText,
    aiResponse,
    koreanSummary,
  }: {
    leadId: number;
    posScore: number;
    negScore: number;
    actionType: string;
    actionScore: number;
    messageText: string;
    aiResponse: string;
    koreanSummary: string;
  }) => {
    try {
      // 1. ai_conversation_scores 테이블에 상세 기록
      await supabase.from('ai_conversation_scores').insert({
        lead_id:      leadId,
        chat_room_id: guestRoomId,
        message_text: messageText,
        ai_response:  aiResponse,
        action_type:  actionType,
        action_score: actionScore,
        pos_score:    posScore,
        neg_score:    negScore,
        planner_id:   plannerId,
      });

      // 2. customer_leads 테이블에 누적 점수 갱신 (RPC 호출)
      const { error: rpcErr } = await supabase.rpc('update_lead_ai_scores', {
        p_lead_id:    leadId,
        p_pos_delta:  posScore,
        p_neg_delta:  negScore,
        p_new_action: actionScore > 0 ? actionScore : null,
      });

      if (rpcErr) {
        // RPC 실패 시 직접 UPDATE fallback
        console.warn('[AI Score] RPC fallback:', rpcErr.message);
        const { data: current } = await supabase
          .from('customer_leads')
          .select('pos_score, neg_score, action_score')
          .eq('id', leadId)
          .single();
        if (current) {
          await supabase.from('customer_leads').update({
            pos_score:    Math.max(0, (current.pos_score || 0) + posScore),
            neg_score:    Math.max(0, (current.neg_score || 0) + negScore),
            action_score: actionScore > (current.action_score || 0)
              ? actionScore
              : (current.action_score || 0),
          }).eq('id', leadId);
        }
      }

      // 3. 관리자용 요약을 raw_payload.timeline에 기록
      if (koreanSummary) {
        const { data: lead } = await supabase
          .from('customer_leads')
          .select('raw_payload')
          .eq('id', leadId)
          .single();
        if (lead) {
          const updatedPayload = {
            ...(lead.raw_payload || {}),
            timeline: [
              {
                id: `ai-score-${Date.now()}`,
                type: 'ai_score_log',
                author: 'AI 비서',
                detail: `[${actionType}] ${koreanSummary} (긍정:${posScore} / 부정:${negScore} / 행동:${actionScore}점)`,
                created_at: new Date().toISOString(),
              },
              ...(lead.raw_payload?.timeline || []).slice(0, 19), // 최대 20개 유지
            ],
          };
          await supabase
            .from('customer_leads')
            .update({ raw_payload: updatedPayload })
            .eq('id', leadId);
        }
      }

      console.log(`[AI Score] ✅ Lead ${leadId} | pos:+${posScore} neg:+${negScore} action:${actionType}(${actionScore})`);
    } catch (err) {
      console.error('[AI Score] Failed to save scores:', err);
    }
  };

  // ── [기능 1+2] 설계사에게 브라우저 알림 발송 ───────────────────────────────
  const sendPlannerNotification = (title: string, body: string, urgent = false) => {
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico', tag: urgent ? 'urgent-alert' : 'ai-alert' });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') new Notification(title, { body });
        });
      }
      // 웹 오디오 알림음
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(urgent ? 880 : 660, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(urgent ? 440 : 880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
      } catch { /* 오디오 실패 시 무시 */ }
    } catch (err) {
      console.warn('[Notification] Failed:', err);
    }
  };

  // ── Supabase에서 AI 컨텍스트 조회 (누적 점수 + 성공 멘트) ───────────────────
  const fetchAiContext = async (leadId: number, recentCustomerMessages?: string[]): Promise<AiContext> => {
    const defaultCtx: AiContext = {
      cumulativePos: 0, cumulativeNeg: 0, currentActionScore: 0, topScripts: [], scriptIds: [], abVariant: 'A'
    };
    try {
      // 1. 누적 점수 + raw_payload(AB 배정 포함) 조회
      const { data: lead } = await supabase
        .from('customer_leads')
        .select('pos_score, neg_score, action_score, raw_payload')
        .eq('id', leadId)
        .single();

      const cumulativePos      = Number(lead?.pos_score    || 0);
      const cumulativeNeg      = Number(lead?.neg_score    || 0);
      const currentActionScore = Number(lead?.action_score || 0);

      // 2. [기능7] A/B 테스트 변형 배정 (최초 1회만)
      let abVariant: 'A' | 'B' = lead?.raw_payload?.ab_variant || (Math.random() < 0.5 ? 'A' : 'B');
      if (!lead?.raw_payload?.ab_variant) {
        await supabase.from('customer_leads').update({
          raw_payload: { ...(lead?.raw_payload || {}), ab_variant: abVariant }
        }).eq('id', leadId);
      }

      // 3. 현재 단계 결정
      const step = actionScoreToStep(currentActionScore);

      // 4. [기능6] 키워드 추출 (시맨틱 RAG)
      const keywords = recentCustomerMessages ? extractKeywords(recentCustomerMessages) : [];

      // 5. 단계별 스크립트 조회 (A변형: success_weight순 / B변형: success_count순)
      let queryBuilder = supabase
        .from('insurance_scripts')
        .select('id, consultation_step, script_text, success_weight, used_count, success_count, ab_group, keyword_tags')
        .eq('consultation_step', step);

      queryBuilder = abVariant === 'B'
        ? queryBuilder.order('success_count', { ascending: false })
        : queryBuilder.order('success_weight', { ascending: false });

      const { data: scripts } = await queryBuilder.limit(5);

      // 6. 키워드 매칭 스코어링 + 전환율 계산
      const rankedScripts = (scripts || [])
        .map((s: any) => {
          const keywordScore = keywords.length > 0 && s.keyword_tags?.length > 0
            ? keywords.filter((k: string) => s.keyword_tags.includes(k)).length
            : 0;
          const convRate = (s.used_count || 0) > 0
            ? Math.round((s.success_count / s.used_count) * 100 * 10) / 10
            : undefined;
          return { ...s, keywordScore, convRate };
        })
        .sort((a: any, b: any) => (b.keywordScore - a.keywordScore) || (b.success_weight - a.success_weight))
        .slice(0, 3);

      const scriptIds = rankedScripts.map((s: any) => Number(s.id));
      usedScriptIdsRef.current = scriptIds; // [기능5] 전환율 추적용

      // [기능5] 스크립트 사용 횟수 증가
      if (scriptIds.length > 0) {
        supabase.rpc('increment_script_usage', { p_script_ids: scriptIds }).catch(() => {});
      }

      const topScripts = rankedScripts.map((s: any) => ({
        id:       s.id,
        step:     s.consultation_step,
        script:   s.script_text,
        weight:   s.success_weight || 0,
        convRate: s.convRate,
        abGroup:  s.ab_group,
      }));

      // [기능8] 멀티턴 메모리 정보 추출
      const customerMemory = lead?.raw_payload?.customer_memory;

      // ── [RAG] Supabase 보험 지식 사전 실시간 조회 (의미 기반 벡터 검색) ───────────────────
      let kbSnippets: string[] = [];
      const lastUserMsg = recentCustomerMessages && recentCustomerMessages.length > 0
        ? recentCustomerMessages[recentCustomerMessages.length - 1]
        : null;

      if (lastUserMsg) {
        try {
          const queryEmbedding = await getEmbedding(lastUserMsg);
          if (queryEmbedding.length > 0) {
            const { data: kbRows } = await supabase.rpc('match_knowledge', {
              query_embedding: queryEmbedding,
              match_threshold: 0.3,
              match_count:     2
            });

            if (kbRows && kbRows.length > 0) {
              kbSnippets = kbRows.map((k: any) => `### ${k.title}\n${k.content}`);
              console.log(`[RAG Vector] 📚 의미 기반 지식 매칭 성공 (${kbRows.length}건) | 쿼리: "${lastUserMsg.slice(0, 20)}..."`);
            }

            // 🧮 [신규] Supabase 계산 수식 및 공백 판정 로직 매칭 (match_calculation_rules)
            const { data: calcRows } = await supabase.rpc('match_calculation_rules', {
              query_embedding: queryEmbedding,
              match_threshold: 0.3,
              match_count:     2
            });

            if (calcRows && calcRows.length > 0) {
              const calcSnippets = calcRows.map((c: any) => {
                let baseExp = `### 🧮 [Supabase 엔진 수식] ${c.category}\n${c.formula_explanation || ''}`;
                if (c.input_options_schema) {
                  const fieldExp = formatInputFieldExplanationContext(c.category, c.input_options_schema, c.premium_factor_matrix);
                  if (fieldExp) {
                    baseExp += `\n\n${fieldExp}`;
                  }
                }
                return baseExp;
              });
              kbSnippets = [...kbSnippets, ...calcSnippets];
              console.log(`[RAG Vector] 🧮 Supabase 계산 수식 및 UI 정밀 필드 매칭 성공 (${calcRows.length}건)`);
            }

            // 📊 [신규 브릿지] 기존 설계안 엔진 원본 무수정 보존 기반 실시간 설계안 팩트 연동
            const priceMatch = lastUserMsg.match(/(\d{2,3})[,\s]?000/);
            const rawPremium = priceMatch ? parseInt(priceMatch[1], 10) * 1000 : 125000;
            const isFemale = lastUserMsg.includes('여') || lastUserMsg.includes('여자');
            const ageMatch = lastUserMsg.match(/(\d{2})대/);
            const rawAge = ageMatch ? parseInt(ageMatch[1], 10) : 40;

            if (lastUserMsg.includes('다이어트') || lastUserMsg.includes('설계') || lastUserMsg.includes('얼마') || priceMatch) {
              const proposalSnippet = buildProposalFactContext(rawAge, isFemale ? 'female' : 'male', rawPremium, 'cancer');
              kbSnippets.push(proposalSnippet.formattedContext);
              console.log(`[Proposal Bridge] 📊 기존 설계안 엔진 연산 결과 1:1 브릿지 완료: 기존 ${rawPremium}원 ➔ 최저가 ${proposalSnippet.optimizedPremium}원 (월 ${proposalSnippet.monthlySavings}원 절감)`);
            }

            // 🌐 [신규 자가적재] DB 지식이 부족할 때 구글 실시간 웹 검색 ➔ Supabase 자동 insert 및 벡터화
            if (kbSnippets.length === 0) {
              const expanded = await searchGoogleAndExpandKb(lastUserMsg, supabase);
              if (expanded) {
                kbSnippets.push(`### 🌐 [구글 실시간 탐색 지식] ${expanded.title}\n${expanded.content}`);
              }
            }
          }
        } catch (kbErr) {
          console.warn('[RAG Vector] 의미 기반 지식 조회 실패:', kbErr);
        }
      }

      // [기능8] 고객 성향 분석 알고리즘
      let customerSegment: 'price_sensitive' | 'coverage_focused' | 'trust_focused' | 'fast_decider' | undefined = undefined;
      if (customerMemory) {
        const painPoints = customerMemory.pain_points || [];
        const lastContext = (customerMemory.last_context || '').toLowerCase();

        if (painPoints.includes('보험료 부담') || lastContext.includes('비싸') || lastContext.includes('절약') || lastContext.includes('저렴')) {
          customerSegment = 'price_sensitive';
        } else if (painPoints.includes('보장 중복 우려') || lastContext.includes('보장') || lastContext.includes('한도') || lastContext.includes('진단비')) {
          customerSegment = 'coverage_focused';
        } else if (painPoints.includes('보험 용어 이해의 어려움') || lastContext.includes('사기') || lastContext.includes('의심') || lastContext.includes('믿을')) {
          customerSegment = 'trust_focused';
        } else if (lastContext.includes('바로') || lastContext.includes('빨리') || lastContext.includes('링크') || (lastContext.length > 0 && lastContext.length < 10)) {
          customerSegment = 'fast_decider';
        }
      }

      // Extract simulation inputs
      const analysisInputs = lead?.raw_payload?.analysisInputs;
      const simulationData = analysisInputs ? {
        age: lead.age || analysisInputs.age,
        gender: lead.gender || analysisInputs.gender,
        monthlyPremium: lead.monthly_premium || analysisInputs.monthlyPremium,
        simulationCode: lead?.raw_payload?.simulation_code,
        category: lead?.insurance_type || lead?.raw_payload?.category,
        cancer: analysisInputs.cancer || lead?.raw_payload?.cancer
      } : undefined;

      console.log(`[AI Context] Lead ${leadId} | pos:${cumulativePos} neg:${cumulativeNeg} action:${currentActionScore} ab:${abVariant} scripts:${topScripts.length} memory:${!!customerMemory} segment:${customerSegment} simulationData:${!!simulationData}`);
      return { 
        cumulativePos, 
        cumulativeNeg, 
        currentActionScore, 
        topScripts, 
        scriptIds, 
        abVariant, 
        customerMemory, 
        kbSnippets, 
        customerSegment,
        plannerName,
        agencyName: agencyName || undefined,
        simulationData
      };
    } catch (err) {
      console.warn('[AI Context] Failed to fetch context:', err);
      return defaultCtx;
    }
  };

  // ── [기능 5+7] proposal_request 감지 시 성공 학습 + 전환율 갱신 ─────────────
  const triggerSelfLearning = async (leadId: number, successfulMessages: { role: string; text: string }[], abVariant?: 'A' | 'B') => {
    try {
      // 1. [기능5] 현재 세션에서 사용된 스크립트 ID에 success_count +1
      const usedIds = usedScriptIdsRef.current;
      if (usedIds.length > 0) {
        await supabase.rpc('increment_script_success', { p_script_ids: usedIds });
        console.log(`[Self-Learning] 📊 success_count +1 for scripts: [${usedIds.join(',')}]`);
      }

      // 2. [기능7] A/B 테스트 결과 로깅
      if (abVariant) {
        console.log(`[A/B Test] 🎯 proposal_request 달성! 변형: ${abVariant} | Lead: ${leadId}`);
        const { data: lead } = await supabase.from('customer_leads').select('raw_payload').eq('id', leadId).single();
        await supabase.from('customer_leads').update({
          raw_payload: {
            ...(lead?.raw_payload || {}),
            ab_test_result: { variant: abVariant, achieved_proposal: true, timestamp: new Date().toISOString() }
          }
        }).eq('id', leadId);
      }

      // 3. 성공 멘트를 insurance_scripts에 upsert (중복 방지)
      const aiMessages = successfulMessages.filter(m => m.role === 'model').map(m => m.text).filter(Boolean);
      if (aiMessages.length === 0) return;

      for (const scriptText of aiMessages.slice(-3)) {
        const { data: existing } = await supabase
          .from('insurance_scripts')
          .select('id, success_weight')
          .eq('script_text', scriptText)
          .maybeSingle();

        if (existing) {
          await supabase.from('insurance_scripts')
            .update({ success_weight: (existing.success_weight || 0) + 10 })
            .eq('id', existing.id);
          console.log(`[Self-Learning] ✅ Weight +10 for script id:${existing.id}`);
        } else {
          const { data: leadData } = await supabase.from('customer_leads').select('action_score').eq('id', leadId).single();
          const step = actionScoreToStep(Number(leadData?.action_score || 0));
          await supabase.from('insurance_scripts').insert({
            consultation_step: step,
            script_text:       scriptText,
            success_weight:    10,
            success_count:     1,
            used_count:        1,
            ab_group:          abVariant || 'A',
            script_type:       'auto_learned',
            description:       `자동 학습 (리드 ${leadId})`,
          });
          console.log(`[Self-Learning] 🆕 New script saved: "${scriptText.slice(0, 40)}..."`);
        }
      }
    } catch (err) {
      console.warn('[Self-Learning] Failed:', err);
    }
  };

  // ── [기능 4] 무응답 고객 자동 재접촉 ────────────────────────────────────────
  useEffect(() => {
    if (!plannerId || !guestRoomId || !isBotActive) return;
    const checkReEngagement = async () => {
      try {
        const { data: recentMsgs } = await supabase
          .from('chat_messages')
          .select('sender_id, created_at, message')
          .eq('room_id', guestRoomId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (!recentMsgs || recentMsgs.length === 0) return;
        const lastMsg = recentMsgs[0];
        if (lastMsg.sender_id !== guestUserId) return; // AI가 마지막인 경우 재접촉 불필요
        const hoursSince = (Date.now() - new Date(lastMsg.created_at).getTime()) / (1000 * 60 * 60);
        if (hoursSince < 24) return;

        console.log(`[Re-engage] 📬 ${Math.round(hoursSince)}시간 무응답 감지 → 재접촉 메시지 생성 중...`);
        const reEngageCtx: AiContext = {
          cumulativePos: 0, cumulativeNeg: 0, currentActionScore: 0, topScripts: [],
          isReEngagement: true,
          lastCustomerMessage: lastMsg.message,
          hoursSinceLastContact: Math.round(hoursSince),
        };
        const reResult = await generateAiResponse(
          [{ role: 'user', parts: [{ text: lastMsg.message }] }],
          reEngageCtx
        );
        await supabase.from('chat_messages').insert({
          room_id:    guestRoomId,
          sender_id:  plannerId,
          message:    reResult.answer.split('|')[0].trim(),
          is_read:    false,
          planner_id: plannerId,
        });
        console.log('[Re-engage] ✅ 재접촉 메시지 발송 완료');
      } catch (err) {
        console.warn('[Re-engage] Failed:', err);
      }
    };
    const timer = setTimeout(checkReEngagement, 3000);
    return () => clearTimeout(timer);
  }, [guestRoomId, plannerId, isBotActive]);

  // 2. Initialize chat room in database
  useEffect(() => {
    if (!plannerId || !guestRoomId || initializedRoomIdRef.current === guestRoomId) return;
    initializedRoomIdRef.current = guestRoomId;

    const initRoom = async () => {
      try {
        // Check if room exists
        const { data: roomExists } = await supabase
          .from('chat_rooms')
          .select('id')
          .eq('id', guestRoomId)
          .maybeSingle();

        if (!roomExists) {
          // Create chat room
          await supabase.from('chat_rooms').insert({
            id: guestRoomId,
            name: `실시간 고객 상담 - 게스트 (${plannerName} 배정)`,
            type: 'one_to_one'
          });

          // Add planner to members
          await supabase.from('chat_room_members').insert({
            room_id: guestRoomId,
            user_id: plannerId
          });

          // Insert welcome message
          const welcomeMsg = `안녕하세요! ${agencyName ? agencyName + ' ' : ''}${plannerName} 설계사입니다. 😊 어떤 점이 궁금하신가요? 가입하신 보험료의 다이어트가 필요하시거나 보장 비교 분석이 필요하시면 언제든 말씀해 주세요!`;
          await supabase.from('chat_messages').insert({
            room_id: guestRoomId,
            sender_id: plannerId,
            message: welcomeMsg,
            is_read: false
          });
        }

        // Check if there is already a lead linked to this chat room
        const { data: existingLead } = await supabase
          .from('customer_leads')
          .select('id, is_bot_active')
          .eq('raw_payload->>chat_room_id', guestRoomId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // ── 🛡️ AI 가동 권한 통제 (총괄 관리자 / 데모 모드 / 심의필 등록 지점만 100% 켜짐) ──
        const cleanReg = registrationNumber ? (registrationNumber.includes('|') ? registrationNumber.split('|')[0] : (registrationNumber.startsWith('dist_') ? '' : registrationNumber)) : '';
        const hasReg = Boolean(cleanReg && cleanReg.trim() !== '');
        const isSuperAdmin = plannerId === '00000000-0000-4000-a000-000000000000' ||
                             certificationMessage === '총괄 관리자' ||
                             plannerName?.includes('총괄') ||
                             plannerName?.includes('마스터');
        const isDemo = agencyId === '88888888-8888-4888-a888-888888888888';
        const canBotBeActive = isSuperAdmin || isDemo || hasReg;

        if (existingLead) {
          setCurrentLeadId(existingLead.id);
          setIsBotActive(canBotBeActive && existingLead.is_bot_active !== false);
        } else if (!currentSimulationCode) {
          // Create a dynamic guest lead if no simulation code has been run yet
          const { data: newLead } = await supabase
            .from('customer_leads')
            .insert({
              planner_id: plannerId,
              agency_id: agencyId || null,
              name: '고객님',
              phone: '010-0000-0000',
              age: 40,
              insurance_type: 'general',
              lead_source: leadSource || 'organic',
              status: 'new',
              raw_payload: {
                chat_room_id: guestRoomId,
                utm_source: sessionStorage.getItem('ins_utm_source') || localStorage.getItem('ins_utm_source') || 'organic',
                timeline: [
                  {
                    id: `chat-init-${Date.now()}`,
                    type: 'system_log',
                    author: '시스템',
                    detail: '고객이 실시간 AI 상담을 시작하여 상담방이 개설되었습니다.',
                    created_at: new Date().toISOString()
                  }
                ]
              }
            })
            .select()
            .single();

          if (newLead) {
            setCurrentLeadId(newLead.id);
            setIsBotActive(canBotBeActive);
          }
        }
      } catch (err) {
        console.error('Failed to initialize guest chat room:', err);
      }
    };

    initRoom();
  }, [plannerId, plannerName, guestRoomId, agencyId, leadSource, currentSimulationCode]);

  // ── [기능8] 앱 로딩 시 누락된 임베딩 벡터 자동 생성 동기화 ──────────────────────
  useEffect(() => {
    syncMissingEmbeddings(supabase);
  }, []);

  // 3. Load message history and subscribe to new messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('room_id', guestRoomId)
          .order('created_at', { ascending: true });

        if (!error && data) {
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to load message history:', err);
      }
    };

    fetchMessages();

    // Subscribe to messages in this room
    const channel = supabase
      .channel(`chat_messages:${guestRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${guestRoomId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [guestRoomId]);

  // 4. Check customer_leads for lead status (active bot status, unmasking code linkage)
  useEffect(() => {
    const checkLeadStatus = async () => {
      try {
        let query = supabase.from('customer_leads').select('id, is_bot_active, raw_payload');
        
        if (currentSimulationCode) {
          query = query.eq('raw_payload->>simulation_code', currentSimulationCode);
        } else if (guestRoomId) {
          query = query.eq('raw_payload->>chat_room_id', guestRoomId);
        } else {
          return;
        }

        const { data, error } = await query
          .order('created_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const lead = data[0];
          setCurrentLeadId(lead.id);
          setIsBotActive(lead.is_bot_active !== false);

          // Update lead's raw_payload with chat_room_id if not linked yet
          const payload = lead.raw_payload || {};
          if (payload.chat_room_id !== guestRoomId) {
            const updatedPayload = {
              ...payload,
              chat_room_id: guestRoomId
            };
            await supabase
              .from('customer_leads')
              .update({ raw_payload: updatedPayload })
              .eq('id', lead.id);
          }
        }
      } catch (err) {
        console.error('Failed to sync lead status with chat:', err);
      }
    };

    checkLeadStatus();

    // Listen to changes on the lead
    let leadChannel: any = null;
    const activeCode = currentSimulationCode;
    
    if (activeCode) {
      leadChannel = supabase
        .channel(`lead_chat_sync:${activeCode}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'customer_leads'
          },
          (payload) => {
            const leadCode = payload.new?.raw_payload?.simulation_code;
            if (leadCode === activeCode) {
              setIsBotActive(payload.new?.is_bot_active !== false);
              setCurrentLeadId(payload.new?.id);
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (leadChannel) {
        supabase.removeChannel(leadChannel);
      }
    };
  }, [currentSimulationCode, guestRoomId]);

  // 본인인증 성공(마스킹 해제) 시 자가 학습 트리거 및 DB 로그
  useEffect(() => {
    if (isUnlocked && currentLeadId) {
      const chatContext = messages
        .slice(-10)
        .map((m) => ({
          role: m.sender_id === guestUserId ? 'user' : 'model',
          text: m.message
        }));
      triggerSelfLearning(currentLeadId, chatContext).catch(err => {
        console.warn('[Self-Learning-Auth] Failed to trigger auth success learning:', err);
      });
      console.log('[Self-Learning] 🎯 verification_done detected via isUnlocked! Self-learning triggered.');
    }
  }, [isUnlocked, currentLeadId]);

  // 실시간 상담 요청 + 마스킹 해제 시 10~25초 딜레이 후 선제 톡 발송 (최대 3회)
  useEffect(() => {
    if (!isUnlocked || !currentLeadId || !guestRoomId || !isBotActive) return;
    
    // 중복 발송 방지를 위해 로컬스토리지 키 설정
    const storageKey = `ins_proactive_sent_${currentLeadId}`;
    if (localStorage.getItem(storageKey) === 'true') return;

    let active = true;
    let step1Timer: any = null;
    let step2Timer: any = null;
    let step3Timer: any = null;

    const generateAndSendProactive = async (stepNum: number) => {
      if (!active) return;
      
      // 고객이 그 사이에 대답을 했는지 DB를 직접 조회하여 검증 (가장 확실한 실시간 체크)
      const { data: currentMsgs } = await supabase
        .from('chat_messages')
        .select('sender_id')
        .eq('room_id', guestRoomId)
        .order('created_at', { ascending: false });

      if (currentMsgs && currentMsgs.length > 0) {
        // 마지막 메시지 전송자가 고객(guestUserId)이거나, 중간에 대답한 흔적이 있으면 중단
        const hasCustomerResponded = currentMsgs.some(m => m.sender_id === guestUserId);
        if (hasCustomerResponded) {
          console.log('[Proactive] Customer has already responded, aborting proactive step:', stepNum);
          localStorage.setItem(storageKey, 'true'); // 중단 표시
          return;
        }
      }

      // 3초간 입력 중 표시로 사람처럼 보임 효과 연출
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (!active) {
        setIsTyping(false);
        return;
      }

      // 최근 고객 메시지 조회 (있을 경우에만)
      const recentCustomerTexts = (messages || [])
        .filter(m => m.sender_id === guestUserId)
        .slice(-3)
        .map(m => m.message);

      // AI 컨텍스트 (대시보드 설계 데이터 포함) 조회
      const aiContext: AiContext = await fetchAiContext(currentLeadId, recentCustomerTexts);
      
      // 이전 대화 20턴 조회
      const chatContext = (messages || [])
        .slice(-20)
        .map((m) => ({
          role: m.sender_id === guestUserId ? 'user' : 'model',
          parts: [{ text: m.message }]
        }));

      // 단계별 프롬프트 가이드라인 주입
      const promptContext = {
        ...aiContext,
        isReEngagement: false
      };

      if (stepNum === 1) {
        promptContext.customerMemory = {
          ...promptContext.customerMemory,
          last_context: '고객이 마스킹을 풀고 들어와 대기하는 상태에서 첫 설계 안내 및 친근한 1:1 상담을 건네는 첫 인사'
        };
      } else if (stepNum === 2) {
        promptContext.customerMemory = {
          ...promptContext.customerMemory,
          last_context: '고객이 대화방에서 응답이 지연되는 상태에서 대시보드 암보험 설계 수치를 구체적으로 언급하며 호기심을 유도하는 질문'
        };
      } else if (stepNum === 3) {
        promptContext.customerMemory = {
          ...promptContext.customerMemory,
          last_context: '여전히 대답이 없는 상태에서 부담을 낮추고 설계서는 언제든 볼 수 있게 대화방에 평생 보관되니 필요할 때 답해달라고 친근하게 마무리하는 대기 안내'
        };
      }

      const aiResult = await generateAiResponse(chatContext, promptContext);
      setIsTyping(false);

      if (!active) return;

      const reply = aiResult.answer.split('|')[0].trim();
      if (reply) {
        // DB에 메시지 전송
        await supabase.from('chat_messages').insert({
          room_id:    guestRoomId,
          sender_id:  plannerId,
          message:    reply,
          is_read:    false,
          planner_id: plannerId,
        });

        // 상담 피드백 점수 기록
        await saveAiScores({
          leadId:        currentLeadId,
          posScore:      aiResult.pos_score,
          negScore:      aiResult.neg_score,
          actionType:    aiResult.action_type,
          actionScore:   aiResult.action_score,
          messageText:   `[Proactive Trigger Step ${stepNum}]`,
          aiResponse:    reply,
          koreanSummary: `선제 톡 ${stepNum}단계 발송 완료`,
        });
      }
    };

    // 10초 ~ 25초 사이의 무작위 딜레이 시간 계산
    const delay1 = Math.floor(Math.random() * (25 - 10 + 1) + 10) * 1000;
    console.log(`[Proactive] Unlocked! Scheduled step 1 in ${delay1 / 1000}s`);

    step1Timer = setTimeout(() => {
      generateAndSendProactive(1);

      // 1단계 전송 후 20초 뒤 2단계 전송
      step2Timer = setTimeout(() => {
        generateAndSendProactive(2);

        // 2단계 전송 후 25초 뒤 3단계 전송
        step3Timer = setTimeout(() => {
          generateAndSendProactive(3);
          localStorage.setItem(storageKey, 'true'); // 3회 종료 완료 기록
        }, 25000);

      }, 20000);

    }, delay1);

    return () => {
      active = false;
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
    };
  }, [isUnlocked, currentLeadId, guestRoomId, isBotActive]);

  // Scroll to bottom when messages update or chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen, isTyping]);

  // 5. Send message and handle AI reply
  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    
    const textToSubmit = customText || inputValue;
    if (!textToSubmit.trim()) return;

    const userText = textToSubmit.trim();
    if (!customText) {
      setInputValue('');
    }

    // Insert user message locally and to DB
    const { data: userMsg, error: insertErr } = await supabase
      .from('chat_messages')
      .insert({
        room_id: guestRoomId,
        sender_id: guestUserId,
        message: userText,
        is_read: false,
        planner_id: plannerId,
        lead_id: currentLeadId
      })
      .select()
      .single();

    if (insertErr) {
      console.error('Failed to send message:', insertErr);
      return;
    }

    // Update messages state locally (just in case subscription latency)
    setMessages((prev) => [...prev, userMsg as Message]);

    // [기능8] 고객의 대화 내용 분석하여 기억(interests, job, family 등) 자동 추출
    if (currentLeadId) {
      extractAndSaveMemory(supabase, currentLeadId, userText).catch(() => {});

      // [기능 추가] 실시간 백그라운드 고객 성향 분석 & 업데이트 실행 (비동기)
      setTimeout(async () => {
        try {
          // 최근 6개 대화 기록 추출
          const chatHistory = [...messages, userMsg as Message]
            .slice(-6)
            .map(m => ({
              role: m.sender_id === guestUserId ? 'user' : 'model',
              text: m.message
            }));
            
          const segment = await classifyCustomerSegment(chatHistory);
          if (segment) {
            console.log(`[AI segment classifier] Segment classified as: ${segment}`);
            // DB 조회 후 업데이트
            const { data: leadData } = await supabase
              .from('customer_leads')
              .select('raw_payload')
              .eq('id', currentLeadId)
              .single();
              
            if (leadData) {
              const updatedPayload = {
                ...(leadData.raw_payload || {}),
                customer_segment: segment // 성향 업데이트
              };
              await supabase
                .from('customer_leads')
                .update({ raw_payload: updatedPayload })
                .eq('id', currentLeadId);
            }
          }
        } catch (err) {
          console.error('[AI Segment Update Error]', err);
        }
      }, 500);
    }

    // Check if message has a simulation code
    const detectedCode = parseCodeFromMessage(userText);
    if (detectedCode) {
      setIsTyping(true);
      // Look up lead for this code
      const { data: leads } = await supabase
        .from('customer_leads')
        .select('id, name, is_bot_active, raw_payload, insurance_type')
        .eq('raw_payload->>simulation_code', detectedCode)
        .order('created_at', { ascending: false })
        .limit(1);

      if (leads && leads.length > 0) {
        const matchingLead = leads[0];
        setCurrentLeadId(matchingLead.id);
        setIsBotActive(matchingLead.is_bot_active !== false);

        // Check if this lead is from remodeling (내보험 정밀 분석)
        const isRemodeling = 
          matchingLead.insurance_type?.includes('remodeling') ||
          matchingLead.raw_payload?.category === 'remodeling' ||
          matchingLead.raw_payload?.analysisInputs?.selectedCategory === 'remodeling';

        // Update lead to link this chat room
        const updatedPayload = {
          ...(matchingLead.raw_payload || {}),
          chat_room_id: guestRoomId
        };
        await supabase
          .from('customer_leads')
          .update({ raw_payload: updatedPayload })
          .eq('id', matchingLead.id);

        // ── code_parsed 행동 점수 기록 ──
        await saveAiScores({
          leadId:       matchingLead.id,
          posScore:     5,  // 코드 입력 = 높은 관심
          negScore:     0,
          actionType:   'code_parsed',
          actionScore:  ACTION_SCORE_MAP['code_parsed'],
          messageText:  userText,
          aiResponse:   isRemodeling ? '정밀 분석 설계 코드 감지 → 한국신용정보원 연동 유도' : '비교 분석 설계 코드 감지 → SMS 본인인증 유도',
          koreanSummary: `설계 코드(${detectedCode}) 감지 완료, ${isRemodeling ? '한국신용정보원' : 'SMS 본인인증'} 버튼 제시`,
        });

        // Send AI reply with appropriate auth action button
        const botResponse = isRemodeling
          ? `설계 코드가 확인되었습니다! 고객님의 실제 가입 보험 내역으로 정밀 분석(마스킹 해제)을 진행하시려면 아래 [한국신용정보원 인증하기] 버튼을 눌러 연동을 완료해 주세요.`
          : `설계 코드가 확인되었습니다! 상세 비교 분석 결과(마스킹 해제)를 확인하시려면 아래 [SMS 본인인증] 버튼을 눌러 인증을 완료해 주세요.`;
        
        const actionTag = isRemodeling ? 'trigger_hyphen_auth' : 'trigger_aligo_auth';

        setTimeout(async () => {
          setIsTyping(false);
          await supabase.from('chat_messages').insert({
            room_id:    guestRoomId,
            sender_id:  plannerId,
            message:    botResponse,
            is_read:    false,
            planner_id: plannerId,
            lead_id:    matchingLead.id,
            action_tag: actionTag
          });
        }, 1000);
        return;
      }
    }

    // Trigger AI response if bot is active
    const isDemo = agencyId === '88888888-8888-4888-a888-888888888888';
    const cleanReg = registrationNumber ? (registrationNumber.includes('|') ? registrationNumber.split('|')[0] : (registrationNumber.startsWith('dist_') ? '' : registrationNumber)) : '';
    const hasReg = cleanReg && cleanReg.trim() !== '';

    if (isBotActive) {
      const isSuperAdmin = plannerId === '00000000-0000-4000-a000-000000000000';
      if (!isDemo && !isSuperAdmin && !hasReg) {
        setIsTyping(false);
        console.log('[AI Silenced] AI chatbot response bypassed because review certificate registrationNumber is missing/invalid.');
        return;
      }
      setIsTyping(true);

      // Fetch message history for AI prompt context
      const chatContext = messages
        .concat(userMsg as Message)
        .slice(-20)
        .map((m) => ({
          role: m.sender_id === guestUserId ? 'user' : 'model',
          parts: [{ text: m.message }]
        }));

      // ── 1. Supabase에서 누적 점수 + 성공 멘트 조회 ([기능6] 키워드 전달) ──
      const recentCustomerTexts = messages
        .concat(userMsg as Message)
        .filter(m => m.sender_id === guestUserId)
        .slice(-3)
        .map(m => m.message);

      const aiContext: AiContext | undefined = currentLeadId
        ? await fetchAiContext(currentLeadId, recentCustomerTexts)
        : undefined;

      // ── 2. AI 응답 생성 (콘텍스트 주입) ──────────────────────────────────
      const aiResult = await generateAiResponse(chatContext, aiContext);
      const { answer: aiReply, pos_score, neg_score, action_type, action_score, korean_summary } = aiResult;

      // ── 3. 점수 Supabase 저장 ────────────────────────────────────────────
      if (currentLeadId) {
        await saveAiScores({
          leadId:        currentLeadId,
          posScore:      pos_score,
          negScore:      neg_score,
          actionType:    action_type,
          actionScore:   action_score,
          messageText:   userText,
          aiResponse:    aiReply,
          koreanSummary: korean_summary,
        });

        // ── [기능1] 이탈 위험 알림 (누적 neg 임계값 초과) ───────────────────
        const newCumNeg = (aiContext?.cumulativeNeg || 0) + neg_score;
        if (newCumNeg >= 15 && (aiContext?.cumulativeNeg || 0) < 15) {
          sendPlannerNotification(
            '⚠️ 고객 이탈 위험 감지!',
            `고객의 부정 지수가 임계값(${newCumNeg}점)을 초과했습니다. 직접 개입을 권장합니다.`,
            true
          );
          console.log('[Alert] 🔴 이탈 위험 알림 발송 - neg:', newCumNeg);
        }

        // ── [기능3] 골든타임 개입 알림 (긍정 임계값 12 돌파 + 행동 점수 5 이상 + 부정 안전) ─
        const newCumPos = (aiContext?.cumulativePos || 0) + pos_score;
        const currentAction = action_score > 0 ? action_score : (aiContext?.currentActionScore || 0);
        if (
          newCumPos >= 12 && 
          (aiContext?.cumulativePos || 0) < 12 && 
          newCumNeg < 8 && 
          currentAction >= 5 && 
          currentAction < 10
        ) {
          sendPlannerNotification(
            '⚡ 골든타임! 직접 개입 적극 권장',
            '고객의 호감도가 최고조에 달했습니다! 지금 직접 개입하여 상담을 마무리하고 설계안을 제안하기 아주 좋은 타이밍입니다. 🔥',
            true
          );
          console.log('[Alert] ⚡ 골든타임 개입 권장 알림 발송 - pos:', newCumPos);
        }

        // ── [기능2] 설계요청 달성 알림 ───────────────────────────────────────
        if (action_type === 'proposal_request') {
          sendPlannerNotification(
            '🔥 설계안 요청 접수!',
            '고객이 설계안을 요청했습니다! 지금 바로 설계서를 작성해주세요.',
            true
          );
          console.log('[Alert] 🔥 설계요청 알림 발송!');

          // ── [기능5+7] 자가 학습 트리거 ────────────────────────────────────
          const recentMsgs = messages
            .concat(userMsg as Message)
            .slice(-10)
            .map(m => ({ role: m.sender_id === guestUserId ? 'user' : 'model', text: m.message }));
          triggerSelfLearning(currentLeadId, recentMsgs, aiContext?.abVariant);
          console.log('[Self-Learning] 🎯 proposal_request detected! Self-learning triggered.');
        }
      }


      // ── 5. 말풍선 분리 전송 (| 기호로 구분) ────────────────────
      const bubbles = aiReply.split('|').map((b) => b.trim()).filter(Boolean);
      
      let delay = 1000;
      bubbles.forEach((bubbleText, idx) => {
        setTimeout(async () => {
          if (idx === bubbles.length - 1) {
            setIsTyping(false);
          }
          await supabase.from('chat_messages').insert({
            room_id:    guestRoomId,
            sender_id:  plannerId,
            message:    bubbleText,
            is_read:    false,
            planner_id: plannerId,
            lead_id:    currentLeadId
          });
        }, delay);
        delay += 1200;
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* 💬 Floating 상담 위젯 버튼 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="px-5 py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black text-xs rounded-full shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            실시간 고객 상담
          </motion.button>
        )}
      </AnimatePresence>

      {/* 💻 실시간 고객 상담 창 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-[360px] h-[500px] bg-slate-950/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-xs">
                    {plannerName[0]}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full"></span>
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-100">실시간 고객 상담</h4>
                  <p className="text-[10px] text-slate-400 font-bold">
                    {isBotActive ? `${plannerName} 설계사 (온라인)` : `${plannerName} 설계사 직접 대화중`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg) => {
                const isMe = msg.sender_id === guestUserId;
                const isHyphenAuthTag = (msg as any).action_tag === 'trigger_hyphen_auth';
                const isAligoAuthTag = (msg as any).action_tag === 'trigger_aligo_auth' || (msg as any).action_tag === 'trigger_auth';
                const isAnyAuthTag = isHyphenAuthTag || isAligoAuthTag;
                const isFirstPlannerMsg = !isMe && !messages.slice(0, messages.findIndex(m => m.id === msg.id)).some(m => m.sender_id !== guestUserId);

                const isDemo = agencyId === '88888888-8888-4888-a888-888888888888';
                const isSuperAdmin = plannerId === '00000000-0000-4000-a000-000000000000';
                const cleanReg = registrationNumber ? (registrationNumber.includes('|') ? registrationNumber.split('|')[0] : (registrationNumber.startsWith('dist_') ? '' : registrationNumber)) : '';
                const hasReg = cleanReg && cleanReg.trim() !== '';
                const canShowCard = isDemo || isSuperAdmin || hasReg;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 w-full`}
                  >
                    {isFirstPlannerMsg && canShowCard && (
                      <DigitalBusinessCard
                        plannerName={plannerName}
                        agencyName={agencyName}
                        customPhone={customPhone}
                        customEmail={customEmail}
                        customAddress={customAddress}
                        certificationMessage={certificationMessage}
                      />
                    )}
                    {!isMe && (
                      <span className="text-[9px] text-slate-500 font-bold ml-1">
                        {plannerName}
                      </span>
                    )}
                    <div className="flex items-end gap-1.5 max-w-[85%]">
                      {isMe && (
                        <span className="text-[8px] text-slate-600 font-bold">
                          {msg.is_read ? '읽음' : '1'}
                        </span>
                      )}
                      <div
                        className={`p-3 rounded-2xl text-[11px] font-semibold leading-relaxed break-words text-left ${
                          isMe
                            ? 'bg-orange-500 text-white rounded-tr-sm'
                            : 'bg-slate-900 text-slate-200 rounded-tl-sm border border-slate-850'
                        }`}
                      >
                        {msg.message}

                        {/* 📄 35개사 정밀 비교 리포트 열람 & PDF 저장 클릭 버튼 */}
                        <ReportLinkButton messageText={msg.message} />
                        
                        {/* 🔒 한국신용정보원 인증 버튼 (내보험 정밀 분석 설계 코드인 경우: 언제든 연동 가능) */}
                        {isHyphenAuthTag && (
                          <button
                            onClick={onTriggerHyphenAuth || onTriggerAuth}
                            className="mt-3 w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-755 text-white font-black text-[10px] rounded-lg shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            🔒 한국신용정보원 인증 완료하기
                          </button>
                        )}

                        {/* 🔒 알리고 SMS 본인인증 버튼 (내 보험 비교 분석 설계 코드인 경우) */}
                        {isAligoAuthTag && !isUnlocked && (
                          <button
                            onClick={onTriggerAligoAuth || onTriggerAuth}
                            className="mt-3 w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-755 text-white font-black text-[10px] rounded-lg shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            🔒 SMS 본인인증 하기
                          </button>
                        )}
                        
                        {isAligoAuthTag && isUnlocked && (
                          <div className="mt-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg flex items-center justify-center gap-1.5 text-[9px] font-black">
                            <Check className="w-3.5 h-3.5" />
                            본인인증 완료됨 (잠금 해제 완료)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex flex-col items-start space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold ml-1">{plannerName} 설계사</span>
                  <div className="bg-slate-900 text-slate-400 border border-slate-850 px-4 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              {/* Suggestion cards for verified leads discussing plans */}
              {isUnlocked && messages.length > 0 && messages[messages.length - 1].sender_id === plannerId && (
                <div className="flex flex-col gap-2 mt-4 p-3 bg-slate-900/60 border border-slate-850/60 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <span className="text-[9px] text-slate-500 font-black ml-1 uppercase tracking-wider">💡 추천 제안 질문</span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSend(undefined, "📋 40대 추천 플랜 비교표 보여주세요!")}
                      className="px-3.5 py-2.5 bg-slate-950 hover:bg-slate-850 text-left text-[10px] text-slate-300 rounded-xl transition-all cursor-pointer font-bold border border-slate-850/80 flex items-center justify-between group shadow-sm"
                    >
                      <span>📋 40대 추천 플랜 비교표 보기</span>
                      <span className="text-[8px] text-slate-500 group-hover:text-slate-300 transition-colors">전송 ➔</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSend(undefined, "💵 월 보험료 가성비 다이어트안 받고 싶어요")}
                      className="px-3.5 py-2.5 bg-slate-950 hover:bg-slate-850 text-left text-[10px] text-slate-300 rounded-xl transition-all cursor-pointer font-bold border border-slate-850/80 flex items-center justify-between group shadow-sm"
                    >
                      <span>💵 월 보험료 가성비 다이어트안 받기</span>
                      <span className="text-[8px] text-slate-500 group-hover:text-slate-300 transition-colors">전송 ➔</span>
                    </button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-slate-950 border-t border-slate-900 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="메시지를 입력해 주세요..."
                className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                disabled={!inputValue.trim()}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
