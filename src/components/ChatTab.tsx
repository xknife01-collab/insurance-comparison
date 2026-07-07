import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '../utils/supabase/client';
import { 
  MessageSquare, Send, Users, Building, User, Search, 
  Shield, ArrowLeft, Volume2, Bell, Check, Clock
} from 'lucide-react';

interface ChatTabProps {
  currentUser: {
    role: 'super' | 'agency' | 'planner' | 'guest';
    plannerId?: string;
    agencyId?: string;
    name?: string;
  };
  showHelpGuide?: boolean;
  onToggleHelpGuide?: () => void;
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
    answer: "좌측 메뉴의 '개인 프로필/랜딩 설정' 탭에 진입하셔서 본인의 사진, 연락처, 인사말 및 카카오톡 상담 링크를 등록해 주세요. 등록이 완료되면 도메인/?planner=본인코드 형태의 개인화된 영업용 링크가 즉시 자동 생성됩니다."
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
    question: "30일 무료 체험 기간이 종료된 후 구독 결제는 어떻게 하나요?",
    answer: "가입 후 최초 30일간은 무료 서비스가 제공되며, 이후에는 좌측의 '구독 결제 관리' 메뉴에서 원하시는 등급(플래너/에이전시) 요금제를 선택하고 신용카드를 등록하시면 매월 자동으로 안전하게 정기 구독이 갱신됩니다."
  },
  {
    question: "왜 가격비교나 단순정밀분석 고객의 전화번호는 비공개(마스킹) 처리되어 있나요?",
    answer: "단순 가격비교나 자가 진단을 수행한 고객은 '개인정보 제공 및 제3자 마케팅 활용'에 명시적으로 동의하지 않은 상태이거나 단순 이탈 방지용 DB입니다.\n\n• 법률 준수(개인정보보호법): 명시적 동의 없는 유선 연락은 불법 스팸으로 간주되어 과태료 처분을 받을 수 있습니다.\n• 낮은 피로도 유지: 아직 상담 의사가 없는 고객에게 무단 유선 전화를 걸 경우 거부감과 민원이 발생하여 플랫폼 신뢰도가 낮아집니다.\n• 열람 권한 잠금 해제: 해당 고객이 결과를 확인한 후 [카톡 상담 신청]을 누르거나 [1:1 문의]를 남기는 순간, 정식 마케팅 동의가 완료되어 즉시 설계사 콘솔에서 전화번호가 투명하게 공개됩니다."
  }
];

export function ChatTab({ currentUser, showHelpGuide = false, onToggleHelpGuide }: ChatTabProps) {
  const supabase = createClient();
  const currentUserId = currentUser.plannerId || currentUser.agencyId || ADMIN_ID;

  const [subTab, setSubTab] = useState<'rooms' | 'contacts'>('rooms');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [userRoomIds, setUserRoomIds] = useState<string[]>([]);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [showFaqDrawer, setShowFaqDrawer] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

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
        icon: '/원금융.png'
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

      // For each room, load members to find the other user, and load last message + unread count
      const roomsList: ChatRoom[] = [];

      for (const r of roomsData || []) {
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

        roomsList.push({
          id: r.id,
          name: r.name,
          type: r.type,
          created_at: r.created_at,
          otherMember,
          lastMessage: lastMsgData?.[0]?.message || '대화 내역이 없습니다.',
          lastMessageTime: lastMsgData?.[0]?.created_at,
          unreadCount: count || 0
        });
      }

      // Sort by last message time
      roomsList.sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
        return timeB - timeA;
      });

      setRooms(roomsList);
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

  // Real-time subscription for messages in selected room
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
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
          <h2 className="text-base font-black text-white tracking-wide mr-2">소통 센터 (0.1초 실시간 알림)</h2>
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
              {rooms.map(room => {
                const isSelected = selectedRoom?.id === room.id;
                const member = room.otherMember;
                
                return (
                  <button 
                    key={room.id}
                    onClick={async () => {
                      setSelectedRoom(room);
                      await fetchMessages(room.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border text-left ${isSelected ? 'bg-violet-600/10 border-violet-500/30' : 'bg-transparent border-transparent hover:bg-slate-900/60 hover:border-slate-800'}`}
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
                          {member?.role === 'super' && <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1 rounded">관리자</span>}
                          {member?.role === 'agency' && <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 rounded">대리점</span>}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate mt-1 max-w-[150px]">{room.lastMessage}</p>
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
                  <button
                    type="button"
                    onClick={() => setShowFaqDrawer(!showFaqDrawer)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${showFaqDrawer ? 'bg-violet-600 border-violet-500 text-white shadow-md' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'}`}
                  >
                    <span>💡 자주 묻는 질문 (FAQ)</span>
                  </button>
                  <span className="hidden sm:flex text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    실시간 연결됨
                  </span>
                </div>
              </div>

              {/* Chat workspace split panel (Chat + FAQ drawer) */}
              <div className="flex-1 flex overflow-hidden">
                
                {/* Left Side: Message History and Input Form */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => {
                      const isMe = msg.sender_id === currentUserId;
                      const msgTime = new Date(msg.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

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

                          {/* Message bubble */}
                          <div 
                            className={`max-w-md px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${isMe ? 'bg-violet-600 text-white rounded-br-none shadow-md shadow-violet-700/10' : 'bg-slate-800 text-slate-100 rounded-bl-none'}`}
                          >
                            {msg.message}
                          </div>

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
              <h3 className="text-sm font-black text-white tracking-wide">실시간 소통 센터</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
                총관리자, 대리점 및 소속 설계사 간의 실시간 1:1 대화방을 지원합니다.<br/>
                왼쪽 연락처에서 대화할 대상을 선택해 보세요.
              </p>
              
              {/* Collapsible FAQ Accordion panel for Self-Service */}
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

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
