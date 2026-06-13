import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';

export interface B2BBranding {
  type: 'organic' | 'planner' | 'agency';
  plannerId: string | null;
  agencyId: string | null;
  name: string;
  profileImageUrl: string | null;
  logoUrl: string | null;
  greetingTitle: string | null;
  greetingContent: string | null;
  customPhone: string | null;
  customAddress: string | null;
  kakaoLink: string | null;
  agencyName?: string | null;
  agencyAddress?: string | null;
  registrationNumber?: string | null;
  customEmail?: string | null;
  leadRoutingType?: string | null;
}

const DEFAULT_BRANDING: B2BBranding = {
  type: 'organic',
  plannerId: null,
  agencyId: null,
  name: '보험리밸런스',
  profileImageUrl: null,
  logoUrl: "/6397187.png",
  greetingTitle: '나만을 위한 맞춤형 보험 비교 서비스',
  greetingContent: '대한민국 모든 보험사의 상품을 0.1초 만에 비교 분석하여 불필요한 고정 지출을 성공적으로 줄여 드립니다.',
  customPhone: '080.808.1088',
  customAddress: '보험대리점 : 인카금융서비스 (등록번호 : 제2006038313호) 본 광고는 광고심의기준을 준수하였으며, 유효기간은 심의일로부터 1년입니다.',
  kakaoLink: null,
  agencyName: '인카금융서비스',
  agencyAddress: '보험대리점 : 인카금융서비스 (등록번호 : 제2006038313호)',
  registrationNumber: null,
  customEmail: 'support@rebalance.com',
};

const CACHE_KEY = 'ins_rebalance_b2b_branding';

interface BrandingContextType {
  branding: B2BBranding;
  loading: boolean;
  deferredPrompt: any;
  onInstallClick: () => Promise<void>;
  isInAppBrowser: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  showInAppGuide: boolean;
  setShowInAppGuide: (show: boolean) => void;
  updateBranding: (newBranding: B2BBranding) => void;
}

const BrandingContext = createContext<BrandingContextType>({
  branding: DEFAULT_BRANDING,
  loading: true,
  deferredPrompt: null,
  onInstallClick: async () => {},
  isInAppBrowser: false,
  isIOS: false,
  isStandalone: false,
  showInAppGuide: false,
  setShowInAppGuide: () => {},
  updateBranding: () => {},
});

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<B2BBranding>(() => {
    // Try to load cached branding first for 0.1s instant render
    try {
      const isStandaloneApp = typeof window !== 'undefined' && (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      );
      const cached = isStandaloneApp 
        ? localStorage.getItem(CACHE_KEY) 
        : sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error('Failed to parse cached branding', e);
    }
    return DEFAULT_BRANDING;
  });
  const [loading, setLoading] = useState(() => {
    try {
      const isStandaloneApp = typeof window !== 'undefined' && (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      );
      const cached = isStandaloneApp 
        ? localStorage.getItem(CACHE_KEY) 
        : sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        return false;
      }
    } catch (e) {
      console.error('Failed to parse cached branding for loading state', e);
    }
    return true;
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInAppGuide, setShowInAppGuide] = useState(false);

  // User Agent Detections for In-App browsers and OS
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isKakao = /KAKAOTALK/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isFacebook = /FBAN|FBAV/i.test(ua);
  const isInAppBrowser = isKakao || isInstagram || isFacebook;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('beforeinstallprompt event triggered and captured in BrandingProvider');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Capture when app is successfully installed and store the planner code permanently
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log('PWA was installed successfully');
      const params = new URLSearchParams(window.location.search);
      const plannerCode = params.get('planner');
      const agencyId = params.get('agency');
      if (plannerCode) {
        localStorage.setItem('pwa_saved_planner', plannerCode);
        localStorage.removeItem('pwa_saved_agency');
      } else if (agencyId) {
        localStorage.setItem('pwa_saved_agency', agencyId);
        localStorage.removeItem('pwa_saved_planner');
      }
    };
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install prompt outcome: ${outcome}`);
    if (outcome === 'accepted') {
      const params = new URLSearchParams(window.location.search);
      const plannerCode = params.get('planner');
      const agencyId = params.get('agency');
      if (plannerCode) {
        localStorage.setItem('pwa_saved_planner', plannerCode);
        localStorage.removeItem('pwa_saved_agency');
      } else if (agencyId) {
        localStorage.setItem('pwa_saved_agency', agencyId);
        localStorage.removeItem('pwa_saved_planner');
      }
    }
    setDeferredPrompt(null);
  };

  useEffect(() => {
    async function fetchBranding() {
      const params = new URLSearchParams(window.location.search);
      const plannerCode = params.get('planner');
      const agencyId = params.get('agency');

      // PWA / Link caching & auto-redirection logic
      if (params.get('clear_planner') === 'true') {
        localStorage.removeItem('pwa_saved_planner');
        localStorage.removeItem('pwa_saved_agency');
        sessionStorage.removeItem('pwa_saved_planner');
        sessionStorage.removeItem('pwa_saved_agency');
        params.delete('clear_planner');
        window.location.search = params.toString();
        return;
      }

      if (!window.location.pathname.startsWith('/admin')) {
        if (!plannerCode && !agencyId) {
          const isStandaloneApp = typeof window !== 'undefined' && (
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true
          );

          // PWA uses permanent localStorage, regular browser uses temporary sessionStorage
          const savedPlanner = isStandaloneApp 
            ? localStorage.getItem('pwa_saved_planner') 
            : sessionStorage.getItem('pwa_saved_planner');
          const savedAgency = isStandaloneApp 
            ? localStorage.getItem('pwa_saved_agency') 
            : sessionStorage.getItem('pwa_saved_agency');

          if (savedPlanner) {
            params.set('planner', savedPlanner);
            window.location.search = params.toString();
            return;
          } else if (savedAgency) {
            params.set('agency', savedAgency);
            window.location.search = params.toString();
            return;
          }
        } else {
          if (plannerCode) {
            sessionStorage.setItem('pwa_saved_planner', plannerCode);
            sessionStorage.removeItem('pwa_saved_agency');
          } else if (agencyId) {
            sessionStorage.setItem('pwa_saved_agency', agencyId);
            sessionStorage.removeItem('pwa_saved_planner');
          }
        }
      }

      // UTM Ad Source & Referrer Detection
      const utmSource = params.get('utm_source');
      const gclid = params.get('gclid');
      const fbclid = params.get('fbclid');
      const referrer = typeof document !== 'undefined' ? document.referrer : '';

      let detectedSource = 'organic';
      if (gclid) {
        detectedSource = 'google_ads';
      } else if (fbclid) {
        detectedSource = 'facebook';
      } else if (utmSource === 'gfa' || utmSource === 'naver_gfa') {
        detectedSource = 'naver_gfa';
      } else if (utmSource) {
        detectedSource = utmSource;
      } else if (/instagram/i.test(referrer) || isInstagram) {
        detectedSource = 'instagram';
      } else if (/facebook/i.test(referrer) || isFacebook || /fb/i.test(referrer)) {
        detectedSource = 'facebook';
      }

      if (detectedSource !== 'organic') {
        sessionStorage.setItem('ins_utm_source', detectedSource);
        localStorage.setItem('ins_utm_source', detectedSource);
      }

      const supabase = createClient();

      try {
        const isStandaloneApp = typeof window !== 'undefined' && (
          window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true
        );

        if (plannerCode) {
          // Fetch planner profile and subscription status
          const { data: planner, error: pError } = await supabase
            .from('planners')
            .select('*, agencies(*)')
            .eq('planner_code', plannerCode)
            .single();

          if (!pError && planner && planner.subscription_status === 'active') {
            const isDemo = planner.agencies?.id === '88888888-8888-4888-a888-888888888888' || planner.planner_code === 'test_planner';
            const demoRoutingOverride = isDemo ? sessionStorage.getItem('demo_lead_routing_type') : null;
            const plannerBranding: B2BBranding = {
              type: 'planner',
              plannerId: planner.id,
              agencyId: planner.agency_id || null,
              name: planner.name,
              profileImageUrl: planner.profile_image_url || null,
              logoUrl: planner.logo_url || planner.agencies?.logo_url || null,
              greetingTitle: planner.greeting_title || `${planner.name} 플래너의 맞춤 안심 보장`,
              greetingContent: planner.greeting_content || `${planner.name} 설계사가 양심을 걸고 정직하게 분석해 드립니다.`,
              customPhone: planner.custom_phone || planner.phone || planner.agencies?.custom_phone || DEFAULT_BRANDING.customPhone,
              customAddress: planner.custom_address || planner.agencies?.address || DEFAULT_BRANDING.customAddress,
              kakaoLink: planner.kakao_link || null,
              agencyName: planner.company_name || planner.agencies?.name || null,
              agencyAddress: planner.custom_address || planner.agencies?.address || null,
              registrationNumber: planner.registration_number || null,
              customEmail: planner.email || planner.agencies?.email || DEFAULT_BRANDING.customEmail,
              leadRoutingType: demoRoutingOverride || planner.agencies?.lead_routing_type || 'direct',
            };
            setBranding(plannerBranding);
            
            if (isStandaloneApp) {
              localStorage.setItem(CACHE_KEY, JSON.stringify(plannerBranding));
            } else {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(plannerBranding));
            }

            // Log visit in visitor_logs table in Supabase
            if (!sessionStorage.getItem('ins_visit_logged')) {
              const sessionId = Math.random().toString(36).substring(2, 15);
              supabase.from('visitor_logs')
                .insert({
                  planner_code: plannerCode,
                  utm_source: sessionStorage.getItem('ins_utm_source') || localStorage.getItem('ins_utm_source') || detectedSource,
                  session_id: sessionId
                })
                .then(({ error }) => {
                  if (!error) {
                    sessionStorage.setItem('ins_visit_logged', 'true');
                  }
                });
            }

            setLoading(false);
            return;
          }
        }

        if (agencyId) {
          // Fetch agency profile and subscription status
          const { data: agency, error: aError } = await supabase
            .from('agencies')
            .select('*')
            .eq('id', agencyId)
            .single();

          if (!aError && agency && agency.subscription_status === 'active') {
            const isDemo = agency.id === '88888888-8888-4888-a888-888888888888';
            const demoRoutingOverride = isDemo ? sessionStorage.getItem('demo_lead_routing_type') : null;
            const agencyBranding: B2BBranding = {
              type: 'agency',
              plannerId: null,
              agencyId: agency.id,
              name: agency.name,
              profileImageUrl: null,
              logoUrl: agency.logo_url || null,
              greetingTitle: agency.greeting_title || `${agency.name}의 실시간 최저가 비교`,
              greetingContent: agency.greeting_content || `${agency.name}가 제공하는 0.1초 맞춤 보험 리밸런싱 솔루션입니다.`,
              customPhone: agency.custom_phone || DEFAULT_BRANDING.customPhone,
              customAddress: agency.address || DEFAULT_BRANDING.customAddress,
              kakaoLink: null,
              agencyName: agency.name,
              agencyAddress: agency.address || null,
              customEmail: agency.email || DEFAULT_BRANDING.customEmail,
              leadRoutingType: demoRoutingOverride || agency.lead_routing_type || 'direct',
            };
            setBranding(agencyBranding);
            
            if (isStandaloneApp) {
              localStorage.setItem(CACHE_KEY, JSON.stringify(agencyBranding));
            } else {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(agencyBranding));
            }
            setLoading(false);
            return;
          }
        }

        // If no active planner or agency parameter, or verification fails, fallback to default organic branding
        if (!plannerCode && !agencyId) {
          const { data: adminPlanner, error: aError } = await supabase
            .from('planners')
            .select('*, agencies(*)')
            .eq('planner_code', 'admin')
            .maybeSingle();

          if (!aError && adminPlanner) {
            const isDemo = adminPlanner.agencies?.id === '88888888-8888-4888-a888-888888888888';
            const demoRoutingOverride = isDemo ? sessionStorage.getItem('demo_lead_routing_type') : null;
            const organicBranding: B2BBranding = {
              type: 'organic',
              plannerId: adminPlanner.id,
              agencyId: adminPlanner.agency_id || null,
              name: adminPlanner.name || '보험리밸런스',
              profileImageUrl: adminPlanner.profile_image_url || null,
              logoUrl: adminPlanner.logo_url || adminPlanner.agencies?.logo_url || null,
              greetingTitle: adminPlanner.greeting_title || DEFAULT_BRANDING.greetingTitle,
              greetingContent: adminPlanner.greeting_content || DEFAULT_BRANDING.greetingContent,
              customPhone: adminPlanner.custom_phone || adminPlanner.phone || adminPlanner.agencies?.custom_phone || DEFAULT_BRANDING.customPhone,
              customAddress: adminPlanner.custom_address || adminPlanner.agencies?.address || DEFAULT_BRANDING.customAddress,
              kakaoLink: adminPlanner.kakao_link || null,
              agencyName: adminPlanner.company_name || adminPlanner.agencies?.name || null,
              agencyAddress: adminPlanner.custom_address || adminPlanner.agencies?.address || null,
              registrationNumber: adminPlanner.registration_number || null,
              customEmail: adminPlanner.email || adminPlanner.agencies?.email || DEFAULT_BRANDING.customEmail,
              leadRoutingType: demoRoutingOverride || adminPlanner.agencies?.lead_routing_type || 'direct',
            };
            setBranding(organicBranding);
            
            if (isStandaloneApp) {
              localStorage.setItem(CACHE_KEY, JSON.stringify(organicBranding));
            } else {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(organicBranding));
            }
          } else {
            if (isStandaloneApp) {
              localStorage.removeItem(CACHE_KEY);
            } else {
              sessionStorage.removeItem(CACHE_KEY);
            }
            setBranding(DEFAULT_BRANDING);
          }
        }
      } catch (err) {
        console.error('Error fetching B2B branding:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBranding();
  }, []);

  const updateBranding = (newBranding: B2BBranding) => {
    setBranding(newBranding);
    const isStandaloneApp = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandaloneApp) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(newBranding));
    } else {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(newBranding));
    }
  };

  return (
    <BrandingContext.Provider value={{ 
      branding, 
      loading, 
      deferredPrompt, 
      onInstallClick: handleInstallApp,
      isInAppBrowser,
      isIOS,
      isStandalone,
      showInAppGuide,
      setShowInAppGuide,
      updateBranding
    }}>
      {children}
    </BrandingContext.Provider>
  );
}


export function useB2BBranding() {
  return useContext(BrandingContext);
}
