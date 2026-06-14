import { createClient } from './supabase/client';

/**
 * URL Base64 문자열을 PushManager가 요구하는 Uint8Array 형식으로 변환합니다.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * 브라우저의 알림 권한 동의 여부를 확인하고, 동의를 요청합니다.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('이 브라우저는 알림을 지원하지 않습니다.');
    return 'denied';
  }
  
  if (Notification.permission === 'default') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
}

/**
 * 브라우저 푸시 토큰(Subscription)을 생성하여 Supabase DB에 저장합니다.
 */
export async function registerPushSubscription(plannerId: string): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('이 브라우저는 PWA 푸시 알림을 지원하지 않습니다.');
    return null;
  }

  // 1. 알림 권한 획득 여부 검증
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    console.warn('푸시 알림 수신 권한이 거부되었거나 미설정 상태입니다:', permission);
    return null;
  }

  try {
    // 2. 서비스 워커 준비 대기
    const reg = await navigator.serviceWorker.ready;
    
    // 3. 환경 변수에서 VAPID Public Key 추출
    const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!publicVapidKey) {
      console.warn('VITE_VAPID_PUBLIC_KEY 환경변수가 정의되지 않았습니다. 테스트 키 또는 실서버 키가 필요합니다.');
      return null;
    }

    const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

    // 4. 브라우저 푸시 서버(구글/애플 등)에 구독 요청 및 토큰 생성
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    const supabase = createClient();
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      registeredAt: new Date().toISOString()
    };

    // 5. 이미 동일한 기기(endpoint)의 구독 정보가 등록되어 있는지 검색 후 Upsert
    const { data: existing } = await supabase
      .from('planner_push_subscriptions')
      .select('id')
      .eq('planner_id', plannerId)
      .eq('subscription->>endpoint', subscription.endpoint)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('planner_push_subscriptions')
        .update({
          device_info: deviceInfo,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('planner_push_subscriptions')
        .insert({
          planner_id: plannerId,
          subscription: subscription.toJSON(),
          device_info: deviceInfo
        });
    }

    console.log('🔔 웹 푸시 알림 구독이 데이터베이스에 등록되었습니다.');
    return subscription;
  } catch (err) {
    console.error('푸시 알림 구독 등록 중 오류 발생:', err);
    return null;
  }
}

/**
 * Supabase Edge Function을 호출하여 본인 기기로 테스트 푸시를 발송합니다.
 */
export async function triggerTestPushNotification(plannerId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Supabase Edge Function 직접 호출
    const { data, error } = await supabase.functions.invoke('send-lead-push', {
      body: {
        planner_id: plannerId,
        is_test: true
      }
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error('테스트 푸시 발송 실패:', err);
    return { success: false, error: err.message || String(err) };
  }
}
