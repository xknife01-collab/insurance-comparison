import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, X, User } from 'lucide-react';
import { B2BBranding, useB2BBranding } from '../hooks/useB2BBranding';

interface PlannerWidgetProps {
  branding: B2BBranding;
  onKakaoClick?: (type: 'anonymous' | 'regular') => void;
}

export default function PlannerWidget({ branding, onKakaoClick }: PlannerWidgetProps) {
  const { deferredPrompt, onInstallClick, isInAppBrowser, setShowInAppGuide, isIOS, isStandalone, isB2BMode } = useB2BBranding();
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);

  const isDefaultTitle = !branding.greetingTitle || 
                         branding.greetingTitle.trim() === '' || 
                         branding.greetingTitle.trim() === '-';
  const isDefaultContent = !branding.greetingContent || 
                           branding.greetingContent.trim() === '' || 
                           branding.greetingContent.trim() === '-';

  const displayTitle = isDefaultTitle ? '나만을 위한 맞춤형 보험 비교 서비스' : branding.greetingTitle;
  const displayContent = isDefaultContent ? '대한민국 모든 보험사의 상품을 0.1초 만에 비교 분석하여 불필요한 고정 지출을 성공적으로 줄여 드립니다.' : branding.greetingContent;

  if (!isOpen) {
    return null;
  }

  const handleKakaoClick = (type: 'anonymous' | 'regular') => {
    if (type === 'anonymous') {
      if (onKakaoClick) {
        onKakaoClick(type);
      }
    } else {
      if (branding.kakaoLink) {
        window.open(branding.kakaoLink, '_blank', 'noopener,noreferrer');
        if (onKakaoClick) {
          onKakaoClick(type);
        }
      } else {
        alert('카카오톡 링크가 등록되지 않았습니다. 전화번호로 연락해주세요.');
      }
    }
  };

  return (
    <AnimatePresence>
      {!isMinimized ? (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm w-80 bg-slate-950/95 text-white p-6 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          {/* Close/Minimize actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-white/5 rounded-lg transition-colors"
            >
              숨기기
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            {/* Profile Avatar / Photo */}
            <div className="relative">
              <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-2 border-orange-500/50 shadow-lg flex items-center justify-center bg-slate-950 p-2">
                {branding.profileImageUrl ? (
                  <img
                    src={branding.profileImageUrl}
                    alt={branding.name}
                    className="w-full h-full object-cover rounded-[1.7rem]"
                    referrerPolicy="no-referrer"
                  />
                ) : branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt={branding.name}
                    className="w-full h-full object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User size={36} className="text-slate-400" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>

            {/* Planner Info */}
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 bg-orange-500/10 text-orange-400 text-[9px] font-black rounded-md border border-orange-500/20 uppercase tracking-widest">
                {branding.type === 'planner' ? '전담 라이프 플래너' : '공식 설계사'}
              </span>
              <h4 className="text-lg font-black tracking-tight">
                {branding.type === 'planner' ? `${branding.name} 설계사` : `${branding.name} 공식 설계사`}
              </h4>
              {branding.customPhone && (
                <a 
                  href={`tel:${branding.customPhone}`} 
                  className="text-xs text-slate-400 hover:text-orange-400 transition-colors font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Phone size={12} className="text-orange-500" /> {branding.customPhone}
                </a>
              )}
            </div>

            {/* Greeting Box */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-xs font-semibold text-slate-300 leading-relaxed max-h-24 overflow-y-auto">
              <p className="font-bold text-white text-center mb-1 text-[11px] text-orange-300">
                "{displayTitle}"
              </p>
              <p className="text-center">{displayContent}</p>
            </div>

            {/* Kakao consult buttons */}
            <div className="w-full space-y-2">
              {branding.registrationNumber && branding.registrationNumber.trim() !== '' && (
                <button
                  onClick={() => handleKakaoClick('anonymous')}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 border border-white/10 shadow-md transform hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  <MessageSquare size={14} className="text-orange-400" />
                  실시간 고객 상담 💬
                </button>
              )}
              <button
                onClick={() => handleKakaoClick('regular')}
                className="w-full py-3.5 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(254,229,0,0.15)] transform hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <MessageSquare size={14} className="fill-current text-[#191919]" />
                정식 카톡 상담 🚀
              </button>
              {!isB2BMode && !isStandalone && (deferredPrompt || isInAppBrowser || isIOS) && (
                <button
                  onClick={onInstallClick}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(249,115,22,0.15)] transform hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer border border-orange-400/20"
                >
                  📱 내 휴대폰에 앱 설치하기
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        /* Minimized State Floating Button Stack */
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsMinimized(false)}
            className="pointer-events-auto px-6 py-4 bg-slate-950 text-white rounded-full border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-orange-500/50 flex items-center gap-3 transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-orange-500/30 flex items-center justify-center bg-slate-950 shrink-0 p-0.5">
              {branding.profileImageUrl ? (
                <img
                  src={branding.profileImageUrl}
                  alt={branding.name}
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              ) : branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.name}
                  className="w-full h-full object-contain p-0.5"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={16} className="text-slate-400" />
              )}
            </div>
            <div className="text-left">
              <p className="text-[8px] font-black text-orange-400 leading-none">
                {branding.type === 'planner' ? 'Planner Contact' : 'Official Planner'}
              </p>
              <p className="text-xs font-black mt-0.5">
                {branding.type === 'planner' ? `${branding.name} 설계사 상담` : `${branding.name} 공식 설계사 상담`}
              </p>
            </div>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
