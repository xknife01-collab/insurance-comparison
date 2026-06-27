import React from 'react';
import { Copy, Check, Plus } from 'lucide-react';
import { Planner, Agency } from '../AdminDashboard';
import { createClient } from '../../utils/supabase/client';
import { DEFAULT_PROFILE_IMG } from './adminUtils';

interface PlannersTabProps {
  currentUser: any;
  planners: Planner[];
  agencies: Agency[];
  showHelpGuide: boolean;
  onToggleHelpGuide: () => void;
  setPlanners: React.Dispatch<React.SetStateAction<Planner[]>>;
  renderHelpGuideToggle: () => React.ReactNode;
}

export function PlannersTab({
  currentUser,
  planners,
  agencies,
  showHelpGuide,
  onToggleHelpGuide,
  setPlanners,
  renderHelpGuideToggle
}: PlannersTabProps) {
  const supabase = createClient();

  // Approve invited planner's registration
  const handleApprovePlanner = async (plannerId: string) => {
    try {
      if (!currentUser.agencyId) return;

      // 1. Get current count of active planners in the agency
      const { count, error: countErr } = await supabase
        .from('planners')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', currentUser.agencyId)
        .eq('subscription_status', 'active');

      // 2. Get the agency's limit
      const { data: agencyData, error: agencyErr } = await supabase
        .from('agencies')
        .select('max_planner_limit, subscription_tier')
        .eq('id', currentUser.agencyId)
        .single();

      if (!agencyErr && agencyData) {
        const activeCount = count || 0;
        if (activeCount >= (agencyData.max_planner_limit || 13)) {
          alert(`[승인 실패] 대리점의 요금제(${agencyData.subscription_tier?.toUpperCase() || 'BASIC'}) 설계사 등록 한도(${agencyData.max_planner_limit || 13}명)를 초과하였습니다. 설계사를 추가하려면 대리점 요금제를 업그레이드해 주세요.`);
          return;
        }
      }

      const { error } = await supabase
        .from('planners')
        .update({ subscription_status: 'active' })
        .eq('id', plannerId);

      if (error) throw error;
      
      setPlanners(prev => prev.map(p => p.id === plannerId ? { ...p, subscription_status: 'active' } : p));
      alert("설계사 가입을 승인하였습니다!");
    } catch (err: any) {
      alert("승인 처리 실패: " + err?.message);
    }
  };

  // Reject and delete invited planner's registration
  const handleRejectPlanner = async (plannerId: string) => {
    if (!confirm("정말 이 설계사의 가입 요청을 거절하고 삭제하시겠습니까?")) return;
    try {
      const { error } = await supabase
        .from('planners')
        .delete()
        .eq('id', plannerId);

      if (error) throw error;
      
      setPlanners(prev => prev.filter(p => p.id !== plannerId));
      alert("가입 요청이 거절 및 삭제되었습니다.");
    } catch (err: any) {
      alert("거절 처리 실패: " + err?.message);
    }
  };

  return (
    <div key="planners" className="active-tab-fade-slide space-y-6">
      {showHelpGuide && (
        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
          <div className="pl-2 space-y-1">
            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 소속 설계사 관리</span>
            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
              "👥 대리점에 소속되어 활동 중인 보험 설계사(플래너) 목록입니다. 신규 플래너의 가입 승인, 승인 대기 해제, 활동 상태(활성/정지)를 한눈에 관리하세요."
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-white">
          {currentUser.role === 'super' ? '전체 가입 설계사 현황' : '대리점 소속 설계사 관리'}
        </h2>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black">
            {currentUser.role === 'super' 
              ? `전체 설계사: ${planners.length}명`
              : `대리점 소속원: ${planners.filter(p => p.agency_id === currentUser.agencyId).length}명`}
          </span>
          {renderHelpGuideToggle()}
        </div>
      </div>

      {/* 초대 코드 및 링크 섹션 */}
      {currentUser.role === 'agency' && (
        <div className={`bg-gradient-to-r from-blue-500/10 via-slate-900 to-slate-950 rounded-2xl p-6 text-left space-y-4 transition-all duration-350 border border-blue-500/20 relative overflow-hidden`}>
          {showHelpGuide && (
            <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <div className="pl-2 space-y-1">
                <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 소속 설계사 가입 초대 링크</span>
                <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                  "🔗 대리점에 소속되어 활동할 설계사분들에게 전달할 초대 링크입니다. 이 링크로 가입한 플래너는 대리점 승인 대기 목록에 자동으로 등록됩니다."
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[9px] font-black uppercase">
              INVITATION LINK
            </span>
            <h3 className="font-extrabold text-sm text-white">소속 설계사 가입 초대</h3>
          </div>
          <p className="text-[11px] font-bold text-slate-400 leading-normal break-keep">
            새로운 설계사를 대리점 소속원으로 등록하려면 아래의 초대 링크를 복사하여 전달해 주세요. 이 링크로 가입한 설계사는 자동으로 본 대리점에 소속 신청(승인 대기) 상태로 가입됩니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input 
              type="text" 
              readOnly 
              value={`${window.location.origin}/admin?invite_agency=${currentUser.agencyId || ''}`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-slate-300 font-bold outline-none"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/admin?invite_agency=${currentUser.agencyId || ''}`);
                alert("설계사 초대 링크가 클립보드에 복사되었습니다!");
              }}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-black text-xs rounded-xl cursor-pointer shrink-0 transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> 초대 링크 복사
            </button>
          </div>
        </div>
      )}

      {showHelpGuide && (
        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] mb-4">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
          <div className="pl-2 space-y-1">
            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 소속 설계사 목록 및 승인</span>
            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
              "👥 등록된 설계사의 코드를 확인하고 홍보 링크를 복사할 수 있으며, 신규 가입한 대기 설계사의 가입 승인 및 해지가 가능합니다."
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {planners
          .filter(p => currentUser.role === 'super' ? true : p.agency_id === currentUser.agencyId)
          .map(p => (
            <div key={p.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex items-start gap-4">
              <img
                src={p.profile_image_url || DEFAULT_PROFILE_IMG}
                alt={p.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-900 border border-slate-800"
              />
              <div className="flex-1 space-y-1 text-left min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-extrabold text-sm text-white truncate">{p.name}</h4>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black uppercase">
                    {p.planner_code}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold">{p.phone}</p>
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                    !p.agency_id
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {!p.agency_id
                      ? '개인설계사 (단독)'
                      : `대리점 소속 (${agencies.find(a => a.id === p.agency_id)?.name || ''})`}
                  </span>
                  {p.subscription_status === 'pending' && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                      승인 대기 중
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 truncate italic">"{p.greeting_title || ''}"</p>
                
                {/* Approval and rejection controls */}
                {p.subscription_status === 'pending' && (currentUser.role === 'agency' || currentUser.role === 'super') && (
                  <div className="pt-2.5 pb-1 flex items-center gap-2">
                    <button
                      onClick={() => handleApprovePlanner(p.id)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[9px] cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5" /> 가입 승인
                    </button>
                    <button
                      onClick={() => handleRejectPlanner(p.id)}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg text-[9px] cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5 rotate-45" /> 거절 및 삭제
                    </button>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-900 mt-2 flex items-center justify-between text-[9px] font-bold text-slate-400">
                  <span>개인주소: /?planner={p.planner_code}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/?planner=${p.planner_code}`);
                      alert("개인 홍보 링크가 복사되었습니다!");
                    }}
                    className="text-orange-400 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <Copy className="w-2.5 h-2.5" /> 링크 복사
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
