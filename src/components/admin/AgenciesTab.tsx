import React from 'react';
import { Building } from 'lucide-react';
import { Planner, Agency } from '../AdminDashboard';

interface AgenciesTabProps {
  currentUser: any;
  agencies: Agency[];
  planners: Planner[];
  showHelpGuide: boolean;
  onToggleHelpGuide: () => void;
  topupLoading: boolean;
  handleTopupCredits: (agencyId: string, amount: number) => Promise<void>;
  renderHelpGuideToggle: () => React.ReactNode;
}

export function AgenciesTab({
  currentUser,
  agencies,
  planners,
  showHelpGuide,
  onToggleHelpGuide,
  topupLoading,
  handleTopupCredits,
  renderHelpGuideToggle
}: AgenciesTabProps) {
  if (currentUser.role !== 'super') return null;

  return (
    <div key="agencies" className="active-tab-fade-slide space-y-6">
      {showHelpGuide && (
        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
          <div className="pl-2 space-y-1">
            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 전체 대리점 관리 (총관리자 전용)</span>
            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
              "🏢 시스템 내에 등록된 모든 보험대리점(GA)의 결제 상태, 보유 크레딧 잔액, 소속 설계사 수 및 분배 방식을 통합 관제하고 크레딧 조정을 수행합니다."
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">전체 등록 대리점 관리</h2>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black">
            등록 대리점: {agencies.length}개
          </span>
          {renderHelpGuideToggle()}
        </div>
      </div>

      {showHelpGuide && (
        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] mb-4">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
          <div className="pl-2 space-y-1">
            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 대리점 정보 및 크레딧 실시간 충전</span>
            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
              "🏢 등록 대리점들의 정보를 수정하거나, 선불 API 조회 크레딧을 추가/차감 충전하여 강제 할당 상태를 0.1초 만에 즉각 제어하는 관제 카드입니다."
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {agencies.map((agency) => {
          const affiliatedPlannersCount = planners.filter(p => p.agency_id === agency.id).length;
          return (
            <div key={agency.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  {agency.logo_url ? (
                    <img src={agency.logo_url} alt={agency.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <Building className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5 text-left min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-extrabold text-sm text-white truncate">{agency.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      agency.subscription_status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      구독: {agency.subscription_status === 'active' ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold space-y-0.5">
                    {agency.phone && <p>📞 연락처: {agency.phone}</p>}
                    {agency.address && <p>📍 주소: {agency.address}</p>}
                    <p>⚙️ 분배 방식: {agency.lead_routing_type === 'direct' ? '개인 홍보 직접배정형' : '대리점 집중 분배형'}</p>
                    <p>👥 소속 설계사: <span className="text-blue-400 font-extrabold">{affiliatedPlannersCount}명</span></p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">보유 잔액</span>
                  <span className="text-sm font-black text-amber-500">
                    {(agency.current_credits || 0).toLocaleString()} <span className="text-[10px] text-slate-400">크레딧</span>
                  </span>
                </div>
                <div className="inline-flex gap-1 shrink-0 self-stretch sm:self-auto justify-end">
                  <button
                    disabled={topupLoading}
                    onClick={() => handleTopupCredits(agency.id, 10000)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-amber-500 border border-slate-800 rounded-lg font-black text-[10px] cursor-pointer disabled:opacity-50"
                  >
                    +1만
                  </button>
                  <button
                    disabled={topupLoading}
                    onClick={() => handleTopupCredits(agency.id, 50000)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-amber-500 border border-slate-800 rounded-lg font-black text-[10px] cursor-pointer disabled:opacity-50"
                  >
                    +5만
                  </button>
                  <button
                    disabled={topupLoading}
                    onClick={() => handleTopupCredits(agency.id, -10000)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-rose-500 border border-slate-800 rounded-lg font-black text-[10px] cursor-pointer disabled:opacity-50"
                  >
                    -1만
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
