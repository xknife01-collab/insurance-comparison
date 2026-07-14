import React from 'react';
import { 
  Download, FileText, ShieldCheck, ExternalLink, ChevronRight, Copy, Plus, Check, Building 
} from 'lucide-react';
import { Lead, Planner, Agency } from '../AdminDashboard';
import { createClient } from '../../utils/supabase/client';
import { 
  isLeadConsult, 
  maskPhoneNumber, 
  getUtmSourceBadge, 
  getInsuranceTypeName, 
  isInKstDateRange, 
  handleDownloadCSV, 
  renderPagination 
} from './adminUtils';

interface LeadsTabProps {
  currentUser: any;
  leads: Lead[];
  planners: Planner[];
  agencies: Agency[];
  leadsPeriod: 'today' | '7days' | 'all';
  setLeadsPeriod: (period: 'today' | '7days' | 'all') => void;
  leadsCategoryFilter: 'all' | 'remodeling' | 'compare';
  setLeadsCategoryFilter: (filter: 'all' | 'remodeling' | 'compare') => void;
  consultCategoryFilter: 'all' | 'remodeling' | 'compare' | 'underwriting' | 'support';
  setConsultCategoryFilter: (filter: 'all' | 'remodeling' | 'compare' | 'underwriting' | 'support') => void;
  leadSearchTerm: string;
  setLeadSearchTerm: (term: string) => void;
  showHelpGuide: boolean;
  onToggleHelpGuide: () => void;
  analysisPage: number;
  setAnalysisPage: (page: number) => void;
  consultPage: number;
  setConsultPage: (page: number) => void;
  isKakaoGuideOpen: boolean;
  setIsKakaoGuideOpen: (open: boolean) => void;
  expandedLeadId: number | null;
  setExpandedLeadId: (id: number | null) => void;
  setToastMessage: (msg: string) => void;
  setShowToast: (show: boolean) => void;
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  setSelectedLead: React.Dispatch<React.SetStateAction<Lead | null>>;
  setAssigningLead: (lead: Lead | null) => void;
  handleUpdateStatus: (leadId: number, status: string) => void;
  setAdminHyphenLead: (lead: Lead | null) => void;
  setShowAdminHyphen: (show: boolean) => void;
  renderHelpGuideToggle: () => React.ReactNode;
}

export function LeadsTab({
  currentUser,
  leads,
  planners,
  agencies,
  leadsPeriod,
  setLeadsPeriod,
  leadsCategoryFilter,
  setLeadsCategoryFilter,
  consultCategoryFilter,
  setConsultCategoryFilter,
  leadSearchTerm,
  setLeadSearchTerm,
  showHelpGuide,
  onToggleHelpGuide,
  analysisPage,
  setAnalysisPage,
  consultPage,
  setConsultPage,
  isKakaoGuideOpen,
  setIsKakaoGuideOpen,
  expandedLeadId,
  setExpandedLeadId,
  setToastMessage,
  setShowToast,
  setLeads,
  setSelectedLead,
  setAssigningLead,
  handleUpdateStatus,
  setAdminHyphenLead,
  setShowAdminHyphen,
  renderHelpGuideToggle
}: LeadsTabProps) {

  const getFilteredAnalysisLeads = () => {
    return leads.filter(lead => {
      // 1. Period filter
      const dateMatch = isInKstDateRange(lead.created_at, leadsPeriod);
      if (!dateMatch) return false;

      // 2. Search filter
      if (leadSearchTerm.trim()) {
        const query = leadSearchTerm.toLowerCase().trim();
        const nameMatch = lead.name?.toLowerCase().includes(query);
        const phoneMatch = lead.phone?.replace(/[^0-9]/g, '').includes(query);
        const codeMatch = lead.raw_payload?.simulation_code?.toLowerCase().includes(query);
        if (!nameMatch && !phoneMatch && !codeMatch) return false;
      }

      // 3. Exclude high intent (consult, underwriting)
      const isHighIntent = isLeadConsult(lead.insurance_type) || lead.insurance_type?.includes('_underwriting');
      if (isHighIntent) return false;

      // 4. Role based filtering
      if (currentUser.role === 'agency') {
        if (lead.agency_id !== currentUser.agencyId) return false;
      } else if (currentUser.role === 'planner') {
        if (lead.planner_id !== currentUser.plannerId) return false;
      }

      // 5. Category tab filter
      if (leadsCategoryFilter === 'remodeling') {
        return lead.insurance_type === 'remodeling';
      }
      if (leadsCategoryFilter === 'compare') {
        return lead.insurance_type !== 'remodeling';
      }

      return true;
    });
  };

  const getFilteredConsultLeads = () => {
    return leads.filter(lead => {
      // 1. Period filter
      const dateMatch = isInKstDateRange(lead.created_at, leadsPeriod);
      if (!dateMatch) return false;

      // 2. Search filter
      if (leadSearchTerm.trim()) {
        const query = leadSearchTerm.toLowerCase().trim();
        const nameMatch = lead.name?.toLowerCase().includes(query);
        const phoneMatch = lead.phone?.replace(/[^0-9]/g, '').includes(query);
        const codeMatch = lead.raw_payload?.simulation_code?.toLowerCase().includes(query);
        if (!nameMatch && !phoneMatch && !codeMatch) return false;
      }

      // 3. Exclude normal analysis
      const isHighIntent = isLeadConsult(lead.insurance_type) || lead.insurance_type?.includes('_underwriting');
      if (!isHighIntent) return false;

      // 4. Role based filtering
      if (currentUser.role === 'agency') {
        if (lead.agency_id !== currentUser.agencyId) return false;
      } else if (currentUser.role === 'planner') {
        if (lead.planner_id !== currentUser.plannerId) return false;
      }

      // 5. Category tab filter
      if (consultCategoryFilter === 'remodeling') {
        return lead.insurance_type?.includes('remodeling');
      }
      if (consultCategoryFilter === 'compare') {
        return !lead.insurance_type?.includes('remodeling') && lead.insurance_type !== 'support_consult' && !lead.insurance_type?.includes('_underwriting');
      }
      if (consultCategoryFilter === 'underwriting') {
        return lead.insurance_type?.includes('_underwriting');
      }
      if (consultCategoryFilter === 'support') {
        return lead.insurance_type === 'support_consult';
      }

      return true;
    });
  };

  const renderLeadsTable = (leadsList: Lead[]) => {
    return (
      <div className="space-y-4 pr-1">
        {/* PC (Desktop) View: Table Layout */}
        <div className="hidden md:block overflow-x-auto max-h-[450px] overflow-y-auto pr-1">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">고객 정보</th>
                <th className="py-3 px-4">비교 상품</th>
                <th className="py-3 px-4">월 보험료</th>
                <th className="py-3 px-4">유입 소스</th>
                <th className="py-3 px-4">담당 설계사</th>
                <th className="py-3 px-4">처리 현황</th>
                <th className="py-3 px-4 text-right">상세진단</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-semibold">
              {leadsList.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/20 transition-all">
                  <td className="py-4.5 px-4 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-extrabold text-sm text-white">{lead.name}</p>
                      {lead.raw_payload?.simulation_code && (
                        <div className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-black uppercase tracking-wider">
                            {lead.raw_payload.simulation_code}
                          </span>
                          {lead.raw_payload?.consult_type === 'anonymous' && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                const simCode = lead.raw_payload?.simulation_code || '';
                                const origin = window.location.origin;
                                const isRemodeling = lead.insurance_type?.includes('remodeling');
                                const link = isRemodeling 
                                  ? `${origin}/remodeling?code=${simCode}`
                                  : `${origin}/verify?code=${simCode}`;
                                const msg = isRemodeling
                                  ? `안녕하세요! 인카금융서비스 소속 설계사입니다. 고객님의 내보험 정밀분석을 위한 하이픈 연동 링크입니다. 아래 링크를 눌러 한국신용정보원 인증을 완료하시면 0.1초 만에 실제 보험 내역이 자동으로 조회됩니다.\n▶ 하이픈 연동 링크: ${link}`
                                  : `안녕하세요! 인카금융서비스 소속 설계사입니다. 고객님의 설계서 잠금 해제를 위한 본인인증 전용 링크입니다. 아래 링크를 눌러 간편인증을 완료하시면 0.1초 만에 마스킹이 해제됩니다.\n▶ 인증 링크: ${link}`;
                                navigator.clipboard.writeText(msg);
                                setToastMessage("✨ 카톡 인증 문구가 복사되었습니다! 카톡창에 붙여넣기(Ctrl+V) 하세요.");
                                setShowToast(true);
                                setTimeout(() => setShowToast(false), 3000);

                                // Stop flashing via DB update
                                try {
                                  const supabase = createClient();
                                  const updatedPayload = {
                                    ...(lead.raw_payload || {}),
                                    copied_by_planner: true,
                                    timeline: [
                                      {
                                        id: `copy-${Date.now()}`,
                                        type: 'system_log',
                                        author: '설계사',
                                        detail: '설계사가 카톡 인증 안내 문구를 복사하여 전달했습니다.',
                                        created_at: new Date().toISOString()
                                      },
                                      ...(lead.raw_payload?.timeline || [])
                                    ]
                                  };
                                  await supabase
                                    .from('customer_leads')
                                    .update({ raw_payload: updatedPayload })
                                    .eq('id', lead.id);
                                } catch (err) {
                                  console.error(err);
                                }

                                // Update local state for immediate 0.1s responsiveness
                                setLeads(prev => prev.map(l => {
                                  if (l.id === lead.id) {
                                    return {
                                      ...l,
                                      raw_payload: {
                                        ...(l.raw_payload || {}),
                                        copied_by_planner: true
                                      }
                                    };
                                  }
                                  return l;
                                }));

                                setSelectedLead(prev => prev && prev.id === lead.id ? {
                                  ...prev,
                                  raw_payload: {
                                    ...(prev.raw_payload || {}),
                                    copied_by_planner: true
                                  }
                                } : prev);
                              }}
                              className="px-2.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-lg text-[10px] font-black cursor-pointer transition-all active:scale-95 flex items-center gap-1 shadow-md shadow-yellow-500/15"
                              title="카톡 인증문구 복사"
                            >
                              문구복사 📋
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {(() => {
                        const isConsult = isLeadConsult(lead.insurance_type);
                        const isUnderwriting = lead.insurance_type?.includes('_underwriting');
                        const isVerified = lead.status === 'verified' || !!lead.raw_payload?.verified_at || (lead.phone && lead.phone !== '010-0000-0000' && lead.phone !== '0');
                        return (isConsult || isUnderwriting || isVerified) ? lead.phone : maskPhoneNumber(lead.phone);
                      })()} • {lead.age}세
                    </p>
                    <p className="text-[9px] text-slate-500 font-black">
                      ⏱️ 비교: {new Date(lead.created_at).toLocaleString('ko-KR')}
                    </p>
                  </td>
                  <td className="py-4.5 px-4 font-bold text-slate-300">
                    <div className="flex flex-col gap-1.5 items-start">
                      {(() => {
                        const isPrecision = lead.insurance_type?.includes('remodeling');
                        return (
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                            isPrecision 
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {isPrecision ? '내보험 정밀분석 🔍' : '실시간 가격비교 📊'}
                          </span>
                        );
                      })()}
                      {(() => {
                        const badge = getInsuranceTypeName(lead.insurance_type || '');
                        return (
                          <span className={`px-2.5 py-1 rounded-md text-[10px] border font-black ${badge.bgClass} ${badge.textClass}`}>
                            {badge.label}
                          </span>
                        );
                      })()}
                      {(() => {
                        const isUnderwriting = lead.insurance_type?.includes('_underwriting');
                        if ((!isLeadConsult(lead.insurance_type) && !isUnderwriting) || lead.insurance_type === 'support_consult') return null;
                        
                        const isAnonymous = lead.raw_payload?.consult_type === 'anonymous' || (isUnderwriting && lead.status !== 'verified');
                        if (isAnonymous) {
                          const isCopied = lead.raw_payload?.copied_by_planner === true;
                          return (
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1 select-none border transition-all ${
                              isCopied
                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/25'
                                : 'bg-yellow-500 text-slate-900 border-yellow-400 animate-pulse shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                            }`}>
                              카톡채팅요청 💬
                            </span>
                          );
                        }
                        return (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase flex items-center gap-1 select-none">
                            {isUnderwriting ? '인증완료 ✅' : '정식상담요청 🔑'}
                          </span>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="py-4.5 px-4 font-black text-orange-400">
                    {lead.insurance_type === 'support_consult' ? '-' : `${lead.monthly_premium?.toLocaleString() || 0} 원`}
                  </td>
                  <td className="py-4.5 px-4 space-y-1.5">
                    <div className="text-slate-400 font-bold text-[10px] uppercase">
                      {lead.lead_source === 'direct' && '개인직송 (Direct)'}
                      {lead.lead_source === 'distribute' && '본사분배 (Central)'}
                      {lead.lead_source === 'organic' && '오가닉 유입'}
                    </div>
                    {(() => {
                      const utmSource = lead.raw_payload?.utm_source;
                      const badge = getUtmSourceBadge(utmSource);
                      return (
                        <span className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-black tracking-tight ${badge.bgClass}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-4.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-300">{lead.planner_name}</span>
                      {currentUser.role === 'agency' && (
                        <button 
                          onClick={() => setAssigningLead(lead)}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-[9px] font-black rounded-md text-slate-300 cursor-pointer"
                        >
                          재지정
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-4.5 px-4">
                    <select 
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-1 px-2 text-white font-bold outline-none cursor-pointer focus:border-orange-500/40"
                    >
                      <option value="new">신규 (New)</option>
                      <option value="calling">상담중 (Calling)</option>
                      <option value="completed">계약완료 (Completed)</option>
                      <option value="canceled">취소/부재 (Canceled)</option>
                    </select>
                  </td>
                  <td className="py-4.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">

                      {lead.raw_payload?.hyphen_coverage && (
                        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-black">
                          실데이터 완료 ✅
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/20 hover:border-transparent rounded-lg font-black transition-all cursor-pointer text-[10px]"
                      >
                        {lead.insurance_type === 'support_consult' ? '문의 내용' : '결과지 열람'}
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Accordion Card Layout */}
        <div className="md:hidden space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {leadsList.map((lead) => {
            const isExpanded = expandedLeadId === lead.id;
            const isPrecision = lead.insurance_type?.includes('remodeling');
            const badge = getInsuranceTypeName(lead.insurance_type || '');
            const utmSource = lead.raw_payload?.utm_source;
            const utmBadge = getUtmSourceBadge(utmSource);
            const isConsult = isLeadConsult(lead.insurance_type);
            const isUnderwriting = lead.insurance_type?.includes('_underwriting');
            const isVerified = lead.status === 'verified' || !!lead.raw_payload?.verified_at || (lead.phone && lead.phone !== '010-0000-0000' && lead.phone !== '0');
            const phone = (isConsult || isUnderwriting || isVerified) ? lead.phone : maskPhoneNumber(lead.phone);

            return (
              <div 
                key={lead.id} 
                className={`bg-slate-950/60 border rounded-2xl p-4 space-y-3 transition-all ${
                  isExpanded ? 'border-orange-500/40 bg-slate-950' : 'border-slate-850'
                }`}
              >
                <div 
                  onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                  className="flex items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="space-y-1 text-left min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-extrabold text-sm text-white truncate">{lead.name}</p>
                      <span className={`px-1 rounded text-[7px] font-black uppercase ${
                        isPrecision 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {isPrecision ? '정밀' : '비교'}
                      </span>
                      {lead.raw_payload?.simulation_code && (
                        <span className="px-1 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[7px] font-bold">
                          {lead.raw_payload.simulation_code}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold">{phone} • {lead.age || 0}세</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-black text-orange-400">
                      {lead.insurance_type === 'support_consult' ? '-' : `${(lead.monthly_premium || 0).toLocaleString()}원`}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-slate-900 space-y-3 text-left text-xs font-bold text-slate-300">
                    <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">비교 상품</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-black mt-0.5 ${badge.bgClass} ${badge.textClass}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">유입 경로</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-black mt-0.5 ${utmBadge.bgClass}`}>
                          {utmBadge.label}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">담당 설계사</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span>{lead.planner_name}</span>
                          {currentUser.role === 'agency' && (
                            <button 
                              onClick={() => setAssigningLead(lead)}
                              className="px-1 py-0.5 bg-slate-900 border border-slate-800 text-[8px] font-black rounded text-slate-400 cursor-pointer"
                            >
                              재지정
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">신청 일시</span>
                        <span className="text-slate-400 text-[9px] font-black mt-0.5 block">
                          {new Date(lead.created_at).toLocaleString('ko-KR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-slate-500 uppercase">진행상태</span>
                        <select 
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          className="bg-slate-950 border border-slate-850 rounded-lg text-[10px] py-1 px-1.5 text-white font-bold cursor-pointer"
                        >
                          <option value="new">신규 (New)</option>
                          <option value="calling">상담중 (Calling)</option>
                          <option value="completed">계약완료 (Completed)</option>
                          <option value="canceled">취소/부재 (Canceled)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {lead.raw_payload?.consult_type === 'anonymous' && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              const simCode = lead.raw_payload?.simulation_code || '';
                              const origin = window.location.origin;
                              const isRemodeling = lead.insurance_type?.includes('remodeling');
                              const link = isRemodeling 
                                ? `${origin}/remodeling?code=${simCode}`
                                : `${origin}/verify?code=${simCode}`;
                              const msg = isRemodeling
                                ? `안녕하세요! 인카금융서비스 소속 설계사입니다. 고객님의 내보험 정밀분석을 위한 하이픈 연동 링크입니다. 아래 링크를 눌러 한국신용정보원 인증을 완료하시면 0.1초 만에 실제 보험 내역이 자동으로 조회됩니다.\n▶ 하이픈 연동 링크: ${link}`
                                : `안녕하세요! 인카금융서비스 소속 설계사입니다. 고객님의 설계서 잠금 해제를 위한 본인인증 전용 링크입니다. 아래 링크를 눌러 간편인증을 완료하시면 0.1초 만에 마스킹이 해제됩니다.\n▶ 인증 링크: ${link}`;
                              navigator.clipboard.writeText(msg);
                              setToastMessage("✨ 카톡 인증 문구가 복사되었습니다! 카톡창에 붙여넣기(Ctrl+V) 하세요.");
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 3000);

                              // Stop flashing via DB update
                              try {
                                const supabase = createClient();
                                const updatedPayload = {
                                  ...(lead.raw_payload || {}),
                                  copied_by_planner: true,
                                  timeline: [
                                    {
                                      id: `copy-${Date.now()}`,
                                      type: 'system_log',
                                      author: '설계사',
                                      detail: '설계사가 카톡 인증 안내 문구를 복사하여 전달했습니다.',
                                      created_at: new Date().toISOString()
                                    },
                                    ...(lead.raw_payload?.timeline || [])
                                  ]
                                };
                                await supabase
                                  .from('customer_leads')
                                  .update({ raw_payload: updatedPayload })
                                  .eq('id', lead.id);
                              } catch (err) {
                                console.error(err);
                              }

                              // Update local state for immediate 0.1s responsiveness
                              setLeads(prev => prev.map(l => {
                                if (l.id === lead.id) {
                                  return {
                                    ...l,
                                    raw_payload: {
                                      ...(l.raw_payload || {}),
                                      copied_by_planner: true
                                    }
                                  };
                                }
                                return l;
                              }));

                              setSelectedLead(prev => prev && prev.id === lead.id ? {
                                ...prev,
                                raw_payload: {
                                  ...(prev.raw_payload || {}),
                                  copied_by_planner: true
                                }
                              } : prev);
                            }}
                            className="px-2 py-1 bg-yellow-500 text-slate-950 rounded-lg text-[9px] font-black cursor-pointer"
                          >
                            문구복사 📋
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1 bg-orange-500 text-white rounded-lg text-[9px] font-black cursor-pointer flex items-center gap-0.5"
                        >
                          {lead.insurance_type === 'support_consult' ? '문의 내용' : '결과지'}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div key="leads" className="active-tab-fade-slide space-y-8">
      
      {/* Header Row 1: Title and Toggle */}
      <div className="flex flex-row justify-between items-center gap-4 pb-2">
        <div className="space-y-1 text-left">
          <h2 className="text-lg font-black text-white">상담 리드 수집 목록</h2>
          <p className="text-[10px] text-slate-400 font-bold">
            💡 상태 선택 시 즉시 변경 사항이 DB에 동기화되며, 대한민국 표준시(KST)를 기준으로 필터링됩니다.
          </p>
        </div>

        {renderHelpGuideToggle()}
      </div>

      {/* Header Row 2: Search and Leads Period Filter Tabs */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-b border-slate-800/80 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="이름, 연락처, 설계코드 검색..."
            value={leadSearchTerm}
            onChange={(e) => setLeadSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-orange-500/50 rounded-xl py-1.5 pl-3 pr-8 text-xs font-bold text-white outline-none w-52 transition-all placeholder:text-slate-600"
          />
          {leadSearchTerm && (
            <button 
              type="button"
              onClick={() => setLeadSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-[10px] font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

         <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setLeadsPeriod('today')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${leadsPeriod === 'today' ? 'bg-orange-500 text-white shadow shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            오늘
          </button>
          <button
            type="button"
            onClick={() => setLeadsPeriod('7days')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${leadsPeriod === '7days' ? 'bg-orange-500 text-white shadow shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            최근 7일
          </button>
          <button
            type="button"
            onClick={() => setLeadsPeriod('all')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${leadsPeriod === 'all' ? 'bg-orange-500 text-white shadow shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200'}`}
          >
            전체 기간
          </button>
        </div>
      </div>

      {/* 카카오톡 설계코드 상담 매칭 기능 안내 배너 */}
      <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 p-4.5 rounded-2xl flex items-start gap-3 relative overflow-hidden text-left">
        <span className="text-xl shrink-0">🔑</span>
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold text-orange-400">카카오톡 설계코드 상담 매칭 기능 안내</h4>
          <p className="text-[11px] text-slate-300 font-bold leading-relaxed break-keep">
            고객이 카카오톡으로 상담을 신청하면 메시지에 포함된 설계 코드 <code className="text-orange-300 font-black bg-orange-500/5 px-1 py-0.5 rounded border border-orange-500/15 font-mono uppercase tracking-wider text-[10px]">RPT-xxxxxx</code>를 복사하여 오른쪽 검색창에 입력하세요. 0.1초 만에 해당 고객의 가입 내역, 진단 결과 및 세부 타임라인을 파악하여 신속하고 정확한 맞춤형 보험 상담을 진행할 수 있습니다.
          </p>
        </div>
      </div>

      {/* ── CARD 1: 실시간 보험 분석 & 다이어트 시도 목록 (잠재고객 DB) ── */}
      <div className={`p-3 sm:p-6 rounded-2xl sm:rounded-[2rem] space-y-6 relative overflow-hidden transition-all duration-300 ${
        showHelpGuide 
          ? 'help-guide-glow bg-slate-900/20 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.25)]' 
          : 'bg-slate-900/40 border border-slate-800/80 shadow-none'
      }`}>
        {showHelpGuide && (
          <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
            <div className="pl-2 space-y-1">
              <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 실시간 자가진단 분석 리드 목록</span>
              <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                "📊 홈페이지에 들어와서 자가보장비교 및 보험 다이어트를 완료한 잠재고객 DB입니다. 연락처와 상세 보장 분석 내역이 자동으로 수집되어 즉각 상담이 가능합니다."
              </p>
            </div>
          </div>
        )}
        <div className="space-y-1 text-left">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            실시간 보험 분석 & 다이어트 시도 목록
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">고객이 홈페이지에서 자가 보장 진단 및 보험 분석을 수행하여 이탈 방지용으로 자동 수집된 DB입니다.</p>
        </div>

        {/* Upper Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-850">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-2 block">
              구분 필터:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLeadsCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${leadsCategoryFilter === 'all' ? 'bg-orange-500 text-white shadow shadow-orange-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
              >
                전체보기 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && !isLeadConsult(l.insurance_type) && !l.insurance_type?.includes('_underwriting')).length}건)
              </button>
              <button
                type="button"
                onClick={() => setLeadsCategoryFilter('remodeling')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${leadsCategoryFilter === 'remodeling' ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
              >
                💸 내 보험 다이어트 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && l.insurance_type === 'remodeling').length}건)
              </button>
              <button
                type="button"
                onClick={() => setLeadsCategoryFilter('compare')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${leadsCategoryFilter === 'compare' ? 'bg-sky-500 text-white shadow shadow-sky-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
              >
                📊 보험 비교분석 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && !isLeadConsult(l.insurance_type) && l.insurance_type !== 'remodeling' && !l.insurance_type?.includes('_underwriting')).length}건)
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDownloadCSV(getFilteredAnalysisLeads(), "보험분석_자가리드")}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-orange-500" />
            엑셀 다운로드 (CSV)
          </button>
        </div>

        {getFilteredAnalysisLeads().length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2 bg-slate-950/20 rounded-2xl border border-slate-900/60">
            <FileText className="w-10 h-10 text-slate-600" />
            <p className="text-xs font-bold">수집된 자가 분석 리드가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {renderLeadsTable(getFilteredAnalysisLeads().slice((analysisPage - 1) * 10, analysisPage * 10))}
            {renderPagination(analysisPage, getFilteredAnalysisLeads().length, 10, setAnalysisPage)}
          </div>
        )}
      </div>

      {/* ── CARD 2: 🔥 카카오톡 정밀설계 신청 목록 (초고관여 상담 DB) ── */}
      <div className={`p-3 sm:p-6 rounded-2xl sm:rounded-[2rem] space-y-6 relative overflow-hidden transition-all duration-300 ${
        showHelpGuide 
          ? 'help-guide-glow bg-slate-950/90 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.25)]' 
          : 'bg-slate-950 border-2 border-orange-500/30 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.15)]'
      }`}>
        {showHelpGuide && (
          <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
            <div className="pl-2 space-y-1">
              <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 실시간 고객 상담 신청 현황 (리드 목록)</span>
              <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                "📋 진단을 마친 고객이 상담 신청 시 실시간으로 DB가 쌓이는 곳입니다. 상세 보기 버튼을 눌러 고객의 성별, 연령, 매칭률 및 상세 설문 결과를 확인하고 상담을 진행하세요."
              </p>
            </div>
          </div>
        )}
        <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-orange-500" />
        </div>
        
        <div className="space-y-1 relative z-10 text-left">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            💬 카톡 상담 신청 및 1:1 고객센터 문의 목록
          </h3>
          <p className="text-[10px] text-slate-400 font-bold">고객이 분석 결과를 확인한 후 카톡 상담을 요청했거나, 고객센터를 통해 1:1 문의를 남긴 초고관여 리드 목록입니다.</p>
          <div className="mt-3 overflow-hidden rounded-xl border border-yellow-500/30 bg-yellow-500/5 transition-all">
            {/* Accordion Header */}
            <button
              type="button"
              onClick={() => setIsKakaoGuideOpen(!isKakaoGuideOpen)}
              className="w-full flex items-center justify-between p-3.5 text-left text-[11px] font-black text-yellow-400 hover:bg-yellow-500/10 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                💡 [필독] 카톡 신청 시 고객 정보 잠금 해제하는 방법 (클릭해서 보기)
              </span>
              <span className="text-yellow-500 text-xs font-bold transition-transform duration-200">
                {isKakaoGuideOpen ? '▲ 닫기' : '▼ 열기'}
              </span>
            </button>

            {/* Accordion Content */}
            {isKakaoGuideOpen && (
              <div className="p-4 border-t border-yellow-500/20 bg-slate-950/40 text-[10.5px] text-slate-300 space-y-3 font-bold leading-relaxed break-keep">
                <p className="text-xs font-black text-yellow-300">🔓 [필독] 0.1초 카카오톡 실시간 상담 연동 가이드</p>
                
                <div className="space-y-2.5 pl-1">
                  <div>
                    <span className="text-white font-black block">1단계. 실시간 알림 확인</span>
                    <span className="text-slate-400">고객이 카톡 상담을 신청하면, 대시보드에 노란색 <span className="text-yellow-400">카톡채팅요청 💬</span> 배지가 번쩍이며 실시간으로 뜹니다.</span>
                  </div>
                  <div>
                    <span className="text-white font-black block">2단계. 카톡방에서 코드 확인</span>
                    <span className="text-slate-400">고객이 오픈채팅방에 입장하여 자신의 <span className="text-orange-400 font-extrabold bg-orange-500/10 px-1 py-0.5 rounded border border-orange-500/20 uppercase text-[9px] tracking-wider">고유 코드 (예: REX-DA4JGR)</span>를 보낼 것입니다.</span>
                  </div>
                  <div>
                    <span className="text-white font-black block">3단계. 인증 문구 복사 및 전달</span>
                    <span className="text-slate-400">어드민에서 해당 고객을 찾아 <span className="text-yellow-400 bg-yellow-500/10 px-1 py-0.5 rounded border border-yellow-500/20">[문구복사 📋]</span> 버튼을 누릅니다. 자동으로 복사된 인증 안내 문구를 카카오톡 오픈채팅방에 붙여넣기(Ctrl+V) 하여 고객에게 전송합니다.</span>
                  </div>
                  <div>
                    <span className="text-white font-black block">4단계. 마스킹 자동 해제 및 상담</span>
                    <span className="text-slate-400">고객이 링크를 눌러 본인인증을 마치는 순간, 설계사님 어드민 화면의 숨겨진 실명과 연락처가 <span className="text-yellow-400 font-extrabold underline">0.1초 만에 자동으로 잠금 해제</span>됩니다. 이제 확보된 정보로 상담을 진행하세요!</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lower Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/85 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-2 block">
              구분 필터:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setConsultCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'all' ? 'bg-amber-500 text-white shadow shadow-amber-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
              >
                전체보기 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting'))).length}건)
              </button>
              <button
                type="button"
                onClick={() => setConsultCategoryFilter('remodeling')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'remodeling' ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
              >
                💸 내 보험 다이어트 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting')) && l.insurance_type?.includes('remodeling')).length}건)
              </button>
              <button
                type="button"
                onClick={() => setConsultCategoryFilter('compare')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'compare' ? 'bg-sky-500 text-white shadow shadow-sky-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
              >
                📊 보험 비교분석 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && isLeadConsult(l.insurance_type) && !l.insurance_type?.includes('remodeling') && l.insurance_type !== 'support_consult').length}건)
              </button>
              <button
                type="button"
                onClick={() => setConsultCategoryFilter('underwriting')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'underwriting' ? 'bg-amber-500 text-white shadow shadow-amber-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
              >
                🔍 사전심사 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && l.insurance_type?.includes('_underwriting')).length}건)
              </button>
              <button
                type="button"
                onClick={() => setConsultCategoryFilter('support')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'support' ? 'bg-indigo-500 text-white shadow shadow-indigo-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
              >
                📞 고객센터 문의 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && l.insurance_type === 'support_consult').length}건)
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleDownloadCSV(getFilteredConsultLeads(), "카톡상담_요청리드")}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-orange-500" />
            엑셀 다운로드 (CSV)
          </button>
        </div>

        {getFilteredConsultLeads().length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 space-y-2 bg-slate-950/20 rounded-2xl border border-slate-900/60">
            <FileText className="w-10 h-10 text-slate-600" />
            <p className="text-xs font-bold">수집된 카카오톡 상담 요청 또는 고객센터 문의 리드가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {renderLeadsTable(getFilteredConsultLeads().slice((consultPage - 1) * 10, consultPage * 10))}
            {renderPagination(consultPage, getFilteredConsultLeads().length, 10, setConsultPage)}
          </div>
        )}
      </div>
    </div>
  );
}
