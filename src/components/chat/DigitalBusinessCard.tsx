import React from 'react';
import { Phone, Mail, MapPin, Building2, ShieldCheck } from 'lucide-react';

interface DigitalBusinessCardProps {
  plannerName?: string;
  agencyName?: string;
  customPhone?: string;
  customEmail?: string;
  customAddress?: string;
  certificationMessage?: string;
}

export const DigitalBusinessCard: React.FC<DigitalBusinessCardProps> = ({
  plannerName,
  agencyName,
  customPhone,
  customEmail,
  customAddress,
  certificationMessage,
}) => {
  // 실제 등록된 데이터만 사용 (하드코딩 디폴트 가짜 데이터 100% 전면 삭제)
  const displayAgency = agencyName?.trim() || '';
  const displayName = plannerName?.trim() || '';
  const displayCert = certificationMessage?.trim() || '';
  const displayPhone = customPhone?.trim() || '';
  const displayEmail = customEmail?.trim() || '';
  const displayAddress = customAddress?.trim() || '';

  // 설계사 이름이나 대리점명이 없는 경우 렌더링하지 않음
  if (!displayName && !displayAgency) return null;

  return (
    <div className="w-full max-w-sm my-2 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 p-4 text-left relative backdrop-blur-md select-none">
      {/* 장식용 골드 백그라운드 라인 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* 헤더: 소속 대리점 / 지점 */}
      {displayAgency && (
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-2.5 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] font-black text-amber-300 truncate tracking-tight">
              {displayAgency}
            </span>
          </div>
          <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full font-bold shrink-0 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            공식 인증
          </span>
        </div>
      )}

      {/* 본문: 설계사 이름 & 직책 */}
      {displayName && (
        <div className="mb-4 space-y-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 tracking-wide">
              {displayName}
            </h3>
            {displayCert && (
              <span className="text-[10px] font-extrabold text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
                {displayCert}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 상세 연락처 안내 (실제 등록 데이터만 표시) */}
      {(displayPhone || displayEmail || displayAddress) && (
        <div className="space-y-1.5 border-t border-slate-800/80 pt-2.5 text-[10px] text-slate-300 font-semibold">
          {displayPhone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 text-amber-400/80 shrink-0" />
              <span className="text-slate-400 font-medium">Mobile:</span>
              <span className="text-slate-200 font-bold">{displayPhone}</span>
            </div>
          )}

          {displayEmail && (
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-amber-400/80 shrink-0" />
              <span className="text-slate-400 font-medium">Email:</span>
              <span className="text-slate-200 font-bold truncate">{displayEmail}</span>
            </div>
          )}

          {displayAddress && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3 h-3 text-amber-400/80 shrink-0 mt-0.5" />
              <span className="text-slate-400 font-medium shrink-0">Address:</span>
              <span className="text-slate-300 leading-snug break-keep">{displayAddress}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
