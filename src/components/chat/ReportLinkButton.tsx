import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface ReportLinkButtonProps {
  messageText: string;
}

/**
 * 챗봇 메시지 텍스트에서 /report-v2 URL을 추출하여
 * 35개사 정밀 비교 리포트 열람 & PDF 저장 전용 주황색 버튼을 클릭 가능하게 렌더링합니다.
 */
export const ReportLinkButton: React.FC<ReportLinkButtonProps> = ({ messageText }) => {
  if (!messageText) return null;

  // /report-v2 로 시작하는 URL 패턴 추출 (마침표나 무의미한 텍스트 제외)
  const match = messageText.match(/(\/report-v2\?[^\s\.]*)/);
  if (!match) return null;

  const rawUrl = match[1];
  // 파라미터 정제
  const cleanUrl = rawUrl.replace(/[\.\s]+$/, '');

  return (
    <div className="mt-2.5 pt-2 border-t border-slate-800/80 w-full">
      <a
        href={cleanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 px-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-[11px] rounded-xl shadow-lg flex items-center justify-between cursor-pointer transition-all hover:scale-[1.02] border border-orange-400/30 group"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <FileText className="w-4 h-4 text-amber-100 flex-shrink-0 animate-pulse" />
          <span className="truncate">📄 35개사 정밀 비교 리포트 열람 & PDF 저장</span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 opacity-80 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </div>
  );
};
