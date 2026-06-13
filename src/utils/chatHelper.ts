import { createClient } from '../utils/supabase/client';

export const ADMIN_ID = '00000000-0000-4000-a000-000000000000';

/**
 * Trigger an onboarding welcome chat room and message for a newly registered user.
 * Wraps in a safe try-catch so it won't crash registration if chat tables aren't created yet.
 */
export async function triggerWelcomeChat(newUserId: string, newUserName: string) {
  const supabase = createClient();
  try {
    // 1. Create a chat room
    const { data: room, error: roomErr } = await supabase
      .from('chat_rooms')
      .insert({
        name: `${newUserName} 웰컴 채팅방`,
        type: 'one_to_one'
      })
      .select()
      .single();

    if (roomErr || !room) {
      console.warn("Welcome chat skipped (chat tables might not exist yet):", roomErr?.message);
      return;
    }

    // 2. Add members: Super Admin and the new user
    const members = [
      { room_id: room.id, user_id: ADMIN_ID },
      { room_id: room.id, user_id: newUserId }
    ];

    const { error: membersErr } = await supabase
      .from('chat_room_members')
      .insert(members);

    if (membersErr) {
      console.warn("Welcome chat members insert skipped:", membersErr.message);
      return;
    }

    // 3. Send welcoming message
    const welcomeMessageText = `안녕하세요! ${newUserName}님, 회원가입을 축하합니다. 🎉 실시간으로 총관리자와의 1:1 소통 채널이 준비되었습니다. 문의 사항이 있으시면 언제든지 메시지를 보내주세요.`;
    
    const { error: msgErr } = await supabase
      .from('chat_messages')
      .insert({
        room_id: room.id,
        sender_id: ADMIN_ID,
        message: welcomeMessageText,
        is_read: false
      });

    if (msgErr) {
      console.warn("Welcome chat message send failed:", msgErr.message);
    } else {
      console.log("[+] Welcome onboarding chat initialized successfully!");
    }
  } catch (err) {
    console.warn("Error running triggerWelcomeChat:", err);
  }
}
