import { createClient } from '../../utils/supabase/client';

/**
 * 방문 기록(visitor_logs) 전용 트래커.
 * - 중복 방지: 세션 + 설계사 코드당 1회
 * - 어떤 경우에도 앱을 깨지 않는다 (try/catch)
 */

export interface TrackVisitOptions {
  plannerCode?: string | null;
}

const LEGACY_FLAG = 'ins_visit_logged';
const VISITOR_ID_KEY = 'ins_visitor_id';
const UTM_KEY = 'ins_utm_source';
const EXCLUDED_PLANNER_CODES = ['test', 'test_planner'];
const EXCLUDED_HOSTS = ['localhost', '127.0.0.1'];

const safeSession = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* ignore */ } },
};
const safeLocal = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

function getVisitorId(): string {
  const existing = safeLocal.get(VISITOR_ID_KEY);
  if (existing) return existing;
  const id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  safeLocal.set(VISITOR_ID_KEY, id);
  return id;
}

function classifyReferrerHost(host: string): string | null {
  const h = host.toLowerCase().replace(/^www\./, '');
  if (!h) return null;
  if (h === 'youtube.com' || h.endsWith('.youtube.com') || h === 'youtu.be') return 'youtube';
  if (h === 'instagram.com' || h.endsWith('.instagram.com')) return 'instagram';
  if (h === 'facebook.com' || h.endsWith('.facebook.com') || h === 'fb.com' || h.endsWith('.fb.com')) return 'facebook';
  if (h === 'threads.net' || h.endsWith('.threads.net')) return 'threads';
  if (h === 'tiktok.com' || h.endsWith('.tiktok.com')) return 'tiktok';
  if (h === 'blog.naver.com' || h === 'm.blog.naver.com') return 'naver_blog';
  if (h === 'cafe.naver.com' || h === 'm.cafe.naver.com') return 'naver_cafe';
  if (h === 'kin.naver.com' || h === 'm.kin.naver.com') return 'naver_kin';
  if (h === 'search.naver.com' || h === 'm.search.naver.com') return 'naver_search';
  if (/(^|\.)google\./.test(h)) return 'google';
  if (h === 'tistory.com' || h.endsWith('.tistory.com')) return 'tistory';
  return h;
}

function resolveUtmSource(params: URLSearchParams): string {
  // a) URL 쿼리
  const q = params.get('utm_source');
  if (q) {
    safeSession.set(UTM_KEY, q);
    safeLocal.set(UTM_KEY, q);
    return q;
  }
  // b) 저장된 값 ('organic'은 과거 하드코딩 기본값이므로 유효한 값으로 취급하지 않음)
  const stored = safeSession.get(UTM_KEY) || safeLocal.get(UTM_KEY);
  if (stored && stored !== 'organic') return stored;
  // c) referrer 분류 (자기 도메인은 무시)
  try {
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host && host !== location.hostname) {
        const classified = classifyReferrerHost(host);
        if (classified) return classified;
      }
    }
  } catch { /* ignore */ }
  // d) 없음
  return 'direct';
}

function resolveDevice(): string {
  try {
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches
      || (navigator as any).standalone === true;
    if (standalone) return 'pwa';
  } catch { /* ignore */ }
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent || '') ? 'mobile' : 'desktop';
}

function resolvePlannerCode(optionCode?: string | null): string {
  if (optionCode) return optionCode;
  const saved = safeSession.get('pwa_saved_planner') || safeLocal.get('pwa_saved_planner');
  return saved || 'direct';
}

function isMissingColumnError(error: any): boolean {
  const msg = String(error?.message || '').toLowerCase();
  return error?.code === 'PGRST204' || error?.code === '42703'
    || (msg.includes('column') && (msg.includes('does not exist') || msg.includes('schema cache')));
}

export async function trackVisit(options: TrackVisitOptions = {}): Promise<void> {
  try {
    if (typeof window === 'undefined') return;

    // 테스트 트래픽 제외 (검증용 우회: VITE_VISIT_TRACK_LOCALHOST=true)
    const bypassLocalhost = (import.meta as any)?.env?.VITE_VISIT_TRACK_LOCALHOST === 'true';
    if (!bypassLocalhost && EXCLUDED_HOSTS.includes(location.hostname)) return;

    const plannerCode = resolvePlannerCode(options.plannerCode);
    if (EXCLUDED_PLANNER_CODES.includes(plannerCode)) return;

    // 세션 + 설계사 코드당 1회
    const flagKey = `${LEGACY_FLAG}:${plannerCode}`;
    if (safeSession.get(flagKey) === 'true') return;

    const params = new URLSearchParams(location.search);
    const utmSource = resolveUtmSource(params);
    const sessionId = getVisitorId();

    const baseRow = { planner_code: plannerCode, utm_source: utmSource, session_id: sessionId };
    const fullRow = {
      ...baseRow,
      referrer: document.referrer ? document.referrer.slice(0, 300) : null,
      path: location.pathname,
      device: resolveDevice(),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    };

    const supabase = createClient();
    let { error } = await supabase.from('visitor_logs').insert(fullRow);

    if (error && isMissingColumnError(error)) {
      console.warn('[visitTracker] 새 컬럼 없음, 기본 3컬럼으로 재시도', error);
      ({ error } = await supabase.from('visitor_logs').insert(baseRow));
    }

    if (error) {
      console.warn('[visitTracker] insert 실패', error);
      return;
    }
    safeSession.set(flagKey, 'true');
    safeSession.set(LEGACY_FLAG, 'true');
  } catch (err) {
    console.warn('[visitTracker] insert 실패', err);
  }
}
