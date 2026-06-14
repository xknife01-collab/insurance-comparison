import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowUpRight, Copy, Check } from 'lucide-react';

export default function InAppBrowserBuster() {
  const [isInApp, setIsInApp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isKakao, setIsKakao] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // Detect In-App Browsers
    const isKakaoTalk = userAgent.includes('kakaotalk');
    const isInstagram = userAgent.includes('instagram');
    const isFacebook = userAgent.includes('fbav') || userAgent.includes('fb_iab');
    const isLine = userAgent.includes('line');
    
    const detectedInApp = isKakaoTalk || isInstagram || isFacebook || isLine;
    setIsInApp(detectedInApp);
    setIsKakao(isKakaoTalk);

    // Detect iOS
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);
  }, []);

  const handleBusterClick = () => {
    const currentUrl = window.location.href;

    if (isIOS) {
      if (isKakao) {
        // Special out-link schema for KakaoTalk on iOS -> Automatically opens Safari!
        const kakaoSafariLink = `kakaotalk://web/openExternalApp?url=${encodeURIComponent(currentUrl)}`;
        window.location.href = kakaoSafariLink;
      } else {
        // Fallback for Instagram/Facebook on iOS: Prompt to open in Safari manually
        handleCopyLink();
      }
    } else {
      // Android: Force open Google Chrome via Intent
      const cleanUrl = currentUrl.replace(/https?:\/\//, '');
      const chromeIntent = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
      window.location.href = chromeIntent;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!isInApp) {
    return null; // Don't render if not inside an in-app browser
  }

  return (
    <div className="fixed inset-0 bg-slate-950 z-[99999] flex flex-col justify-between p-6 text-left">
      {/* Top Header decorative */}
      <div className="space-y-6 pt-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400 border border-orange-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block">SECURE CONNECTION</span>
            <h2 className="text-lg font-black text-white">안전하고 빠른 앱 설치 안내</h2>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-bold leading-relaxed break-keep">
          현재 접속하신 SNS(카카오톡/인스타/페이스북) 전용 브라우저에서는 개인 정보 보안 및 기기 바탕화면에 웹앱 설치를 직접 지원하지 않습니다.
          <br /><br />
          아래 버튼을 눌러 스마트폰 공식 기본 브라우저(크롬 또는 Safari)로 이동하여 더욱 원활하게 진단 및 앱 설치를 시작해 주세요!
        </p>
      </div>

      {/* Middle Interactive Guide for iOS non-Kakao */}
      {isIOS && !isKakao && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <span className="text-[10px] font-black text-slate-500 block">iOS 인스타그램 / 페이스북 수동 이동 가이드</span>
          <p className="text-xs text-slate-300 font-bold leading-normal break-keep">
            우측 상단의 **[더보기(점 3개 또는 나침반 모양 아이콘)]**을 누른 후 **[Safari로 열기]**를 선택해 주세요.
          </p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={window.location.href}
              className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-[10px] text-slate-500 outline-none font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="bg-slate-800 hover:bg-slate-750 text-white rounded-xl px-4 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '복사됨' : '복사'}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Action Button */}
      <div className="space-y-4 pb-8">
        <button
          onClick={handleBusterClick}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 px-6 rounded-2xl text-sm transition-all shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>{isIOS ? (isKakao ? 'Safari 브라우저로 이동하기' : '상단 사파리 실행 링크 복사됨') : '구글 크롬 브라우저로 안전하게 이동'}</span>
          <ArrowUpRight className="w-4.5 h-4.5" />
        </button>
        
        <p className="text-[10px] text-slate-500 text-center font-bold">
          보험리밸런스는 방송통신위원회 및 금융감독원 가이드를 준수합니다.
        </p>
      </div>
    </div>
  );
}
