import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Info } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed app)
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    
    setIsStandalone(isRunningStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Capture the beforeinstallprompt event for Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show Apple manual install guide modal
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) {
      // Show generic manual install guide modal instead of standard alert
      setShowGenericModal(true);
      return;
    }

    // Trigger browser's official install dialog
    await deferredPrompt.prompt();
    
    // Wait for the user response
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
      setDeferredPrompt(null);
    }
  };

  // If already installed (standalone mode) or user manually closed, don't show the card
  if (isStandalone || !isVisible) {
    return null;
  }

  // If not iOS and there's no install prompt yet, we can still show a generic guide
  // so the user knows they can install it, but only show if appropriate.
  return (
    <>
      <div className="w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-orange-500/30 rounded-2xl p-4.5 text-left relative overflow-hidden shadow-lg shadow-orange-500/5 animate-in fade-in duration-300 mt-4">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2.5 right-2.5 text-slate-500 hover:text-slate-300 transition-colors p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
              <Smartphone className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block">PWA APP INSTALL</span>
              <h4 className="text-xs font-black text-white">보험리밸런스 관리자</h4>
            </div>
          </div>

          <p className="text-[10.5px] text-slate-400 font-bold leading-normal break-keep">
            앱으로 바탕화면에 설치하시면, 웹을 켜지 않아도 신규 DB 알림을 실시간 0.1초 만에 무료로 받아보실 수 있습니다.
          </p>

          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-2.5 px-4 rounded-xl text-xs transition-all shadow-md shadow-orange-500/15 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            {isIOS ? '아이폰 설치 방법 보기' : '앱 설치하고 실시간 알림 받기'}
          </button>
        </div>
      </div>

      {/* PC/Android Generic Manual Installation Guide Modal */}
      {showGenericModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-left space-y-5 relative shadow-2xl">
            <button 
              onClick={() => setShowGenericModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20">
                  <Info className="w-5 h-5" />
                </span>
                앱 설치 안내 가이드
              </h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed break-keep">
                자동 설치 프롬프트가 차단되었거나 지연되고 있습니다. 아래 방법으로 직접 설치가 가능합니다.
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-850">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">방법 A</span>
                <p className="text-xs text-slate-300 font-bold break-keep">
                  브라우저 상단 주소창 우측 끝에 있는 **[모니터 모양 앱 설치 모니터 아이콘 🖥️]**을 클릭해 설치합니다.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">방법 B</span>
                <p className="text-xs text-slate-300 font-bold break-keep">
                  크레롬/웨일 우측 상단 **[메뉴(점 3개)] ➔ [보험리밸런스 관리자 설치]**를 클릭해 설치합니다.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGenericModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl text-xs transition-all cursor-pointer text-center"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* iOS Manual Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-left space-y-5 relative shadow-2xl">
            <button 
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/20">
                  <Smartphone className="w-5 h-5" />
                </span>
                아이폰 홈 화면에 앱 설치 가이드
              </h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed break-keep">
                Safari 브라우저의 제약으로 인해 아래 순서에 따라 홈 화면에 수동으로 앱을 추가해 주세요.
              </p>
            </div>

            <div className="space-y-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-850">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</span>
                <p className="text-xs text-slate-300 font-bold break-keep">
                  아이폰 하단 Safari 메뉴 바에서 **공유 버튼(네모 위에 화살표가 있는 버튼 📤)**을 터치합니다.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">2</span>
                <p className="text-xs text-slate-300 font-bold break-keep">
                  스크롤을 아래로 내려 **[홈 화면에 추가]** 항목을 찾아 선택합니다.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">3</span>
                <p className="text-xs text-slate-300 font-bold break-keep">
                  우측 상단의 **[추가]** 버튼을 누르면 설치가 완료되며, 바탕화면에 "보험리밸런스 관리자" 앱이 생성됩니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[10px] text-amber-500/90 font-bold leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
              <Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>설치 완료 후 홈 화면의 앱 아이콘을 통해 진입하시면 알림을 실시간으로 수령하실 수 있습니다.</span>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-3 rounded-xl text-xs transition-all cursor-pointer text-center"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
