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
  certificationMessage?: string | null;
  kakaoLink: string | null;
  agencyName?: string | null;
  agencyAddress?: string | null;
  registrationNumber?: string | null;
  agencyRegistrationNumber?: string | null;
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
  greetingContent: '대한민국 모든 보험사의 상품을 실시간으로 비교 분석하여 불필요한 고정 지출을 성공적으로 줄여 드립니다.',
  customPhone: '080.808.1088',
  customAddress: '보험대리점 : 인카금융서비스 (등록번호 : 제2006038313호) 본 광고는 광고심의기준을 준수하였으며, 유효기간은 심의일로부터 1년입니다.',
  certificationMessage: null,
  kakaoLink: null,
  agencyName: '인카금융서비스',
  agencyAddress: '보험대리점 : 인카금융서비스 (등록번호 : 제2006038313호)',
  registrationNumber: null,
  agencyRegistrationNumber: null,
  customEmail: 'support@rebalance.com',
};

const CACHE_KEY = 'ins_rebalance_b2b_branding';

const extractDelibNumber = (raw: string | null | undefined): string | null => {
  if (!raw) return null;
  const delibPart = raw.includes('|') ? raw.split('|')[0] : (raw.startsWith('dist_') ? '' : raw);
  return delibPart || null;
};

const getB2BParams = () => {
  if (typeof window === 'undefined') return { plannerCode: null, agencyId: null };
  const params = new URLSearchParams(window.location.search);
  let plannerCode = params.get('planner');
  let agencyId = params.get('agency');

  if (!plannerCode && !agencyId) {
    const SYSTEM_PATHS = ['admin', 'partner', 'verify', 'remodeling'];
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    
    if (pathParts.length > 0) {
      const firstPart = pathParts[0];
      if (!SYSTEM_PATHS.includes(firstPart.toLowerCase())) {
        if (pathParts.length === 2) {
          // Format: /agencyCode/plannerCode (e.g. /won-novel/gildong)
          agencyId = firstPart;
          plannerCode = pathParts[1];
        } else if (pathParts.length === 1) {
          // Format: /code (could be agencyCode or plannerCode)
          plannerCode = firstPart;
          agencyId = firstPart;
        }
      }
    }
  }
  return { plannerCode, agencyId };
};

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
  isB2BMode: boolean;
  getComplianceText: (text: string) => string;
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
  isB2BMode: false,
  getComplianceText: (text: string) => text,
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
  const autoTriggerRef = React.useRef(false);

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
      
      if (autoTriggerRef.current) {
        autoTriggerRef.current = false;
        setTimeout(() => {
          (e as any).prompt();
        }, 100);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('install_pwa') === 'true') {
      params.delete('install_pwa');
      const newSearch = params.toString();
      const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');
      window.history.replaceState({}, '', newUrl);

      if (!isInAppBrowser) {
        if (isIOS) {
          setShowInAppGuide(true);
        } else {
          autoTriggerRef.current = true;
          if (deferredPrompt) {
            deferredPrompt.prompt();
            autoTriggerRef.current = false;
          }
        }
      }
    }
  }, [isInAppBrowser, isIOS, deferredPrompt]);

  // Capture when app is successfully installed and store the planner code permanently
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log('PWA was installed successfully');
      const { plannerCode, agencyId } = getB2BParams();
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
    if (isInAppBrowser) {
      const currentUrl = window.location.href;
      const separator = currentUrl.includes('?') ? '&' : '?';
      const targetUrl = currentUrl + separator + 'install_pwa=true';

      if (isIOS) {
        if (isKakao) {
          const kakaoSafariLink = `kakaotalk://web/openExternalApp?url=${encodeURIComponent(targetUrl)}`;
          window.location.href = kakaoSafariLink;
        } else {
          setShowInAppGuide(true);
        }
      } else {
        const cleanUrl = targetUrl.replace(/https?:\/\//, '');
        const chromeIntent = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
        window.location.href = chromeIntent;
      }
      return;
    }

    if (isIOS) {
      setShowInAppGuide(true);
      return;
    }

    if (!deferredPrompt) {
      alert('앱 설치를 지원하지 않거나 이미 설치되어 있습니다. 크롬/사파리 브라우저의 메뉴에서 [홈 화면에 추가]를 선택해 주세요.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA install prompt outcome: ${outcome}`);
    if (outcome === 'accepted') {
      const { plannerCode, agencyId } = getB2BParams();
      if (plannerCode) {
        localStorage.setItem('pwa_saved_planner', plannerCode);
        localStorage.removeItem('pwa_saved_agency');
      } else if (agencyId) {
        localStorage.setItem('pwa_saved_agency', agencyId);
        localStorage.removeItem('pwa_saved_planner');
      }
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    async function fetchBranding() {
      const params = new URLSearchParams(window.location.search);
      const { plannerCode, agencyId } = getB2BParams();

      // PWA / Link caching & auto-redirection logic
      if (params.get('clear_planner') === 'true') {
        localStorage.removeItem('pwa_saved_planner');
        localStorage.removeItem('pwa_saved_agency');
        sessionStorage.removeItem('pwa_saved_planner');
        sessionStorage.removeItem('pwa_saved_agency');
        window.location.href = '/';
        return;
      }

      const SYSTEM_PATHS = ['admin', 'partner', 'verify', 'remodeling'];
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const isSystemPath = pathParts.length > 0 && SYSTEM_PATHS.includes(pathParts[0].toLowerCase());

      if (!isSystemPath) {
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
            window.location.pathname = '/' + savedPlanner;
            return;
          } else if (savedAgency) {
            window.location.pathname = '/' + savedAgency;
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
          let plannerQuery = supabase
            .from('planners')
            .select('*');
            
          if (plannerCode.length === 36) {
            plannerQuery = plannerQuery.eq('id', plannerCode);
          } else {
            plannerQuery = plannerQuery.eq('planner_code', plannerCode);
          }
          
          const { data: planner, error: pError } = await plannerQuery.maybeSingle();

          let agency = null;
          if (!pError && planner && planner.agency_id) {
            try {
              const { data: agencyData } = await supabase
                .from('agencies')
                .select('*')
                .eq('id', planner.agency_id)
                .maybeSingle();
              agency = agencyData;
            } catch (ae) {
              console.warn("Failed to fetch agency details for planner:", ae);
            }
          }
          if (planner) {
            planner.agencies = agency;
          }

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
              greetingTitle: planner.greeting_title || null,
              greetingContent: planner.greeting_content || null,
              customPhone: planner.custom_phone || planner.phone || planner.agencies?.phone || planner.agencies?.custom_phone || DEFAULT_BRANDING.customPhone,
              customAddress: planner.custom_address || planner.agencies?.address || DEFAULT_BRANDING.customAddress,
              certificationMessage: planner.certification_message || null,
              kakaoLink: planner.kakao_link || null,
              agencyName: planner.company_name || planner.agencies?.name || null,
              agencyAddress: planner.custom_address || planner.agencies?.address || null,
              registrationNumber: extractDelibNumber(planner.registration_number),
              agencyRegistrationNumber: planner.agency_registration_number || planner.agencies?.agency_registration_number || null,
              customEmail: planner.email || planner.agencies?.email || DEFAULT_BRANDING.customEmail,
              leadRoutingType: demoRoutingOverride || planner.agencies?.lead_routing_type || 'direct',
            };
            setBranding(plannerBranding);
            
            if (isStandaloneApp) {
              localStorage.setItem(CACHE_KEY, JSON.stringify(plannerBranding));
              localStorage.setItem('pwa_saved_planner', planner.planner_code);
              localStorage.removeItem('pwa_saved_agency');
            } else {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(plannerBranding));
              sessionStorage.setItem('pwa_saved_planner', planner.planner_code);
              sessionStorage.removeItem('pwa_saved_agency');
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
          // Fetch agency profile and subscription status (Supports full UUID, 8-character short UUID, and custom short code)
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(agencyId);
          const isShortUuid = agencyId.length === 8 && /^[0-9a-f]{8}$/i.test(agencyId);
          let query = supabase.from('agencies').select('*');
          
          if (isUuid) {
            query = query.eq('id', agencyId);
          } else if (isShortUuid) {
            // Range check to support 8-character prefix match on UUIDs without casting
            query = query.gte('id', `${agencyId.toLowerCase()}-0000-0000-0000-000000000000`)
                          .lte('id', `${agencyId.toLowerCase()}-ffff-ffff-ffff-ffffffffffff`);
          } else {
            query = query.eq('code', agencyId);
          }
          const { data: agencyData, error: aError } = await query;
          const agency = agencyData?.[0] || null;

          if (!aError && agency && agency.subscription_status === 'active') {
            let fallbackPlannerId: string | null = null;
            try {
              const { data: planners } = await supabase
                .from('planners')
                .select('id')
                .eq('agency_id', agency.id)
                .limit(1);
              if (planners && planners.length > 0) {
                fallbackPlannerId = planners[0].id;
              }
            } catch (pe) {
              console.warn('Failed to fetch fallback planner for agency:', pe);
            }

            const isDemo = agency.id === '88888888-8888-4888-a888-888888888888';
            const demoRoutingOverride = isDemo ? sessionStorage.getItem('demo_lead_routing_type') : null;
            const agencyBranding: B2BBranding = {
              type: 'agency',
              plannerId: fallbackPlannerId,
              agencyId: agency.id,
              name: agency.name,
              profileImageUrl: null,
              logoUrl: agency.logo_url || null,
              greetingTitle: agency.greeting_title || null,
              greetingContent: agency.greeting_content || null,
              customPhone: agency.phone || agency.custom_phone || DEFAULT_BRANDING.customPhone,
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
              localStorage.setItem('pwa_saved_agency', agency.code || agency.id);
              localStorage.removeItem('pwa_saved_planner');
            } else {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify(agencyBranding));
              sessionStorage.setItem('pwa_saved_agency', agency.code || agency.id);
              sessionStorage.removeItem('pwa_saved_planner');
            }
            setLoading(false);
            return;
          }
        }

        // If no active planner or agency parameter, or verification fails, fallback to default organic branding
        if (!plannerCode && !agencyId) {
          const { data: adminPlanner, error: aError } = await supabase
            .from('planners')
            .select('*')
            .eq('planner_code', 'admin')
            .maybeSingle();

          let adminAgency = null;
          if (!aError && adminPlanner && adminPlanner.agency_id) {
            try {
              const { data: agencyData } = await supabase
                .from('agencies')
                .select('*')
                .eq('id', adminPlanner.agency_id)
                .maybeSingle();
              adminAgency = agencyData;
            } catch (ae) {
              console.warn("Failed to fetch agency details for admin planner:", ae);
            }
          }
          if (adminPlanner) {
            adminPlanner.agencies = adminAgency;
          }

          if (!aError && adminPlanner) {
            const isDemo = adminPlanner.agencies?.id === '88888888-8888-4888-a888-888888888888';
            const demoRoutingOverride = isDemo ? sessionStorage.getItem('demo_lead_routing_type') : null;
            const organicBranding: B2BBranding = {
              type: 'organic',
              plannerId: adminPlanner.id,
              agencyId: adminPlanner.agency_id || null,
              name: adminPlanner.name || '보험리밸런스',
              profileImageUrl: adminPlanner.profile_image_url || null,
              logoUrl: adminPlanner.logo_url || adminPlanner.agencies?.logo_url || "/6397187.png",
              greetingTitle: adminPlanner.greeting_title || null,
              greetingContent: adminPlanner.greeting_content || null,
              customPhone: adminPlanner.custom_phone || adminPlanner.phone || adminPlanner.agencies?.phone || adminPlanner.agencies?.custom_phone || DEFAULT_BRANDING.customPhone,
              customAddress: adminPlanner.custom_address || adminPlanner.agencies?.address || DEFAULT_BRANDING.customAddress,
              certificationMessage: adminPlanner.certification_message || null,
              kakaoLink: adminPlanner.kakao_link || null,
              agencyName: adminPlanner.company_name || adminPlanner.agencies?.name || null,
              agencyAddress: adminPlanner.custom_address || adminPlanner.agencies?.address || null,
              registrationNumber: extractDelibNumber(adminPlanner.registration_number),
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

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CACHE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setBranding(parsed);
        } catch (err) {
          console.error('Failed to parse storage changed branding', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateBranding = (newBranding: B2BBranding) => {
    const sanitizedBranding = {
      ...newBranding,
      registrationNumber: extractDelibNumber(newBranding.registrationNumber)
    };
    setBranding(sanitizedBranding);
    localStorage.setItem(CACHE_KEY, JSON.stringify(sanitizedBranding));
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(sanitizedBranding));
  };

  const isB2BMode = branding.type !== 'organic';

  const getComplianceText = (text: string): string => {
    if (!isB2BMode) return text;
    let result = text;
    result = result.replace(/보험리밸런스\s*AI\s*빅데이터\s*엔진/g, '맞춤 설계 분석 시스템');
    result = result.replace(/보험리밸런스\s*AI\s*엔진/g, '비교 분석 시스템');
    result = result.replace(/보험리밸런스\s*AI/g, '맞춤 설계 분석');
    const agencyBrand = branding.agencyName || branding.name || '공식 제휴 보험대리점';
    result = result.replace(/보험리밸런스/g, agencyBrand);
    result = result.replace(/AI\s*빅데이터\s*엔진/g, '비교 분석 데이터 시스템');
    result = result.replace(/AI\s*빅데이터/g, '비교 분석 데이터');
    result = result.replace(/AI\s*엔진/g, '비교 분석 시스템');
    result = result.replace(/빅데이터\s*엔진/g, '비교 분석 시스템');
    result = result.replace(/빅데이터/g, '비교 분석');
    result = result.replace(/AI/g, '비교 분석');
    return result;
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
      updateBranding,
      isB2BMode,
      getComplianceText
    }}>
      {children}
    </BrandingContext.Provider>
  );
}


export function useB2BBranding() {
  return useContext(BrandingContext);
}
