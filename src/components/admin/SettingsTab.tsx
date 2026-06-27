import React from 'react';
import { Check } from 'lucide-react';
import { Lead, Planner, Agency } from '../AdminDashboard';
import { LeadDistributionSimulator } from '../LeadDistributionSimulator';
import { getInsuranceTypeName, isLeadConsult } from './adminUtils';

interface SettingsTabProps {
  currentUser: any;
  agencies: Agency[];
  planners: Planner[];
  leads: Lead[];
  showHelpGuide: boolean;
  onToggleHelpGuide: () => void;
  getCurrentRoutingType: () => string;
  getCurrentRoutingAlgo: () => 'round_robin' | 'weighted' | 'activity';
  handleUpdateRouting: (newType: string) => Promise<void>;
  handleAssignPlanner: (leadId: number, plannerId: string) => Promise<void>;
  getPlannerAssignmentStats: (plannerId: string) => { count: number; ratio: string };
  handleUpdatePlannerWeight: (plannerId: string, weight: number) => Promise<void>;
  handleTogglePlannerDistribution: (plannerId: string, currentRegNum: string | null) => Promise<void>;
  showFaq: boolean;
  setShowFaq: (show: boolean) => void;
  renderHelpGuideToggle: () => React.ReactNode;
}

export function SettingsTab({
  currentUser,
  agencies,
  planners,
  leads,
  showHelpGuide,
  onToggleHelpGuide,
  getCurrentRoutingType,
  getCurrentRoutingAlgo,
  handleUpdateRouting,
  handleAssignPlanner,
  getPlannerAssignmentStats,
  handleUpdatePlannerWeight,
  handleTogglePlannerDistribution,
  showFaq,
  setShowFaq,
  renderHelpGuideToggle
}: SettingsTabProps) {
  return (
    <div key="settings" className="active-tab-fade-slide space-y-6">
      {showHelpGuide && (
        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
          <div className="pl-2 space-y-1">
            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 대리점 분배 정책 설정</span>
            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
              "⚙️ 소속 설계사들에게 신규 유입 고객 DB를 분배하는 알고리즘 규칙(자동 즉시 분배 vs 대리점주 수동 재할당) 및 상세 시스템 정책을 실시간으로 제어합니다."
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black text-white">대리점 DB 분배 방식 변경 설정</h2>
        {renderHelpGuideToggle()}
      </div>
      <p className="text-xs text-slate-400 font-bold leading-normal break-keep text-left">
        대표 광고 또는 소속 플래너들이 수집한 고객 상담 데이터(리드)를 대리점 내부에서 어떻게 흐르게 할 것인지 결정합니다. 설정 변경 시 즉시 Supabase DB에 반영되어 다음 리드부터 적용됩니다.
      </p>
      {showHelpGuide && (
        <div className="p-6 bg-slate-950 border border-orange-500/30 rounded-[2rem] text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.08)] mb-6">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-amber-500" />
          <div className="pl-4 space-y-3">
            <span className="text-[11px] font-black text-orange-400 block uppercase tracking-wider">💡 분배 정책 도움말 가이드 및 매뉴얼</span>
            <h4 className="text-sm font-extrabold text-white">대리점 운영 환경에 맞는 최적의 라우팅 모드를 선택하세요</h4>
            <div className="grid md:grid-cols-3 gap-4 text-xs font-bold text-slate-350 pt-2">
              <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                <span className="text-white font-extrabold block">1. 개인 홍보 직접배정형 (Direct)</span>
                <p className="text-[11px] text-slate-455 leading-relaxed break-keep">각 플래너 개인 링크로 유치된 리드를 0.1초 만에 설계사 본인에게 즉시 단독 노출 및 배정합니다. 대리점 광고를 진행하지 않을 때 추천합니다.</p>
              </div>
              <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                <span className="text-white font-extrabold block">2. 대리점 수동 분배형 (Manual Pool)</span>
                <p className="text-[11px] text-slate-455 leading-relaxed break-keep">유입된 모든 공동 리드가 미배정 상태(대기 풀)로 안전하게 쌓집니다. 대리점주가 설문이나 분석 상세를 검토 후 수동으로 알맞은 설계사에게 배정합니다.</p>
              </div>
              <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                <span className="text-white font-extrabold block">3. 실시간 자동 분배형 (Auto-Routing)</span>
                <p className="text-[11px] text-slate-455 leading-relaxed break-keep">다량의 공동 광고 리드를 0.1초 안에 자동으로 매칭합니다. 세부 알고리즘(순차/가중치/실적)에 따라 대기 없이 설계사들에게 공평하게 즉시 할당합니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 pt-4">
        {/* 카드 1. 개인 홍보 직접배정형 */}
        <div
          onClick={() => handleUpdateRouting('direct')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left min-h-[17.5rem] relative ${getCurrentRoutingType() === 'direct' ? 'bg-slate-950/40 border-orange-500 shadow-md shadow-orange-500/5' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
        >
          {getCurrentRoutingType() === 'direct' && (
            <div className="absolute top-4 right-4 text-orange-500">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
          )}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white">개인 홍보 직접배정형 (Direct)</h4>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
              소속 설계사들이 각자 링크(<code className="text-orange-300 font-black bg-orange-500/5 px-1 py-0.5 rounded border border-orange-500/15 font-mono text-[10px]">?planner=코드</code>)로 직접 유치한 고객 DB를 대리점 개입 없이 설계사 본인에게 즉시 즉각 단독 노출 및 자동 지정하는 개인형 구조입니다.
            </p>
            <div className="border-t border-slate-900/60 pt-2.5">
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed break-keep">
                💡 대리점 차원의 통합 광고를 집행하지 않고, 소속 설계사들이 각자 개별 영업 및 홍보를 진행할 때 적합합니다.
              </p>
            </div>
          </div>
          <div className={`text-[9px] font-black tracking-widest uppercase mt-3 ${getCurrentRoutingType() === 'direct' ? 'text-orange-400' : 'text-slate-500'}`}>
            {getCurrentRoutingType() === 'direct' ? '현재 활성화 상태' : '선택하기'}
          </div>
        </div>

        {/* 카드 2. 대리점 수동 분배형 */}
        <div
          onClick={() => handleUpdateRouting('distribute')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left min-h-[17.5rem] relative ${getCurrentRoutingType() === 'distribute' ? 'bg-slate-950/40 border-orange-500 shadow-md shadow-orange-500/5' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
        >
          {getCurrentRoutingType() === 'distribute' && (
            <div className="absolute top-4 right-4 text-orange-500">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
          )}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white">대리점 수동 분배형 (Manual Pool)</h4>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
              대리점 대표 광고로 들어온 공용 DB를 미배정(대기 풀) 상태로 쌓아두고, 대리점주가 직접 고객 정보나 설문을 검토한 후 적합한 설계사를 수동 지정하는 통제형 구조입니다.
            </p>
            <div className="border-t border-slate-900/60 pt-2.5">
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed break-keep">
                📢 대리점 통합 광고를 집행하여 유입된 공용 DB를 대표자가 직접 검증 후 전략적으로 직접 배정하고자 할 때 적합합니다.
              </p>
            </div>
          </div>
          <div className={`text-[9px] font-black tracking-widest uppercase mt-3 ${getCurrentRoutingType() === 'distribute' ? 'text-orange-400' : 'text-slate-500'}`}>
            {getCurrentRoutingType() === 'distribute' ? '현재 활성화 상태' : '선택하기'}
          </div>
        </div>

        {/* 카드 3. 실시간 자동 분배형 */}
        <div
          onClick={() => handleUpdateRouting('distribute_auto_round_robin')}
          className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left min-h-[17.5rem] relative ${getCurrentRoutingType() === 'distribute_auto' ? 'bg-slate-950/40 border-orange-500 shadow-md shadow-orange-500/5' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
        >
          {getCurrentRoutingType() === 'distribute_auto' && (
            <div className="absolute top-4 right-4 text-orange-500">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
          )}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-amber-400 flex items-center gap-1">
              실시간 자동 분배형 (Auto-Routing) <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 px-1 py-0.5 rounded text-amber-500 font-black">★추천</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
              대리점 광고로 들어온 공용 DB를 시스템이 0.1초 만에 최적의 설계사를 골라 즉시 분배하는 고속 자동화 구조입니다. (하단에서 균등/가중치/실적 세부 알고리즘 선택 가능)
            </p>
            <div className="border-t border-slate-900/60 pt-2.5">
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed break-keep">
                ⚡ 대리점 통합 광고를 통해 유입되는 다량의 공용 DB를 대기 시간 없이 실시간으로 즉시 배정 분배하고자 할 때 최적입니다.
              </p>
            </div>
          </div>
          <div className={`text-[9px] font-black tracking-widest uppercase mt-3 ${getCurrentRoutingType() === 'distribute_auto' ? 'text-orange-400' : 'text-slate-500'}`}>
            {getCurrentRoutingType() === 'distribute_auto' ? '현재 활성화 상태' : '선택하기'}
          </div>
        </div>
      </div>

      {/* 분배형 분기 화면 */}
      {getCurrentRoutingType() === 'direct' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 text-left mt-6">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <span className="text-2xl">👤</span>
            <div>
              <h3 className="text-base font-extrabold text-white">개인 홍보 직접배정형 전용 관리</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                대리점 개입 없이 설계사 개별 유치 리드만 즉각 할당되는 상태입니다.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-350 font-bold leading-relaxed break-keep">
            현재 대리점의 분배 방식이 <span className="text-white font-extrabold font-mono">"개인 홍보 직접배정형"</span>으로 설정되어 있습니다. 이 모드에서는 대리점 통합 광고(공용 DB) 분배 기능이 동작하지 않으며, 각 설계사의 고유 링크(<code className="text-orange-400 bg-orange-500/5 px-1 py-0.5 rounded border border-orange-500/15 font-mono">?planner=코드</code>)를 통해 접수된 건만 해당 설계사에게 즉시 배정됩니다.
          </p>
          
          {/* 설계사 개인 링크 목록 */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-white">🔗 소속 설계사 개인 홍보 링크 현황</h4>
              <p className="text-[10px] text-slate-400 font-bold">소속 설계사들의 홍보용 URL입니다. 해당 주소로 유치 시 대리점을 안 거치고 다이렉트로 설계사에게 배정됩니다.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {planners
                .filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active')
                .map(p => (
                  <div key={p.id} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 flex items-center justify-between text-xs font-bold text-slate-300">
                    <div className="space-y-1 text-left">
                      <span className="text-white font-extrabold block">{p.name} ({p.planner_code})</span>
                      <span className="text-[10px] text-slate-500 font-mono select-all">/?planner={p.planner_code}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/?planner=${p.planner_code}`);
                        alert(`[${p.name}] 설계사의 개인 홍보 링크가 복사되었습니다!`);
                      }}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-orange-400 hover:text-orange-300 font-black rounded-lg text-[10px] cursor-pointer"
                    >
                      링크 복사
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {getCurrentRoutingType() === 'distribute' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 text-left mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                📥 수동 분배 대기 풀 관리 (Manual Pool Control)
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                대리점 공용 채널을 통해 유입되었으나 아직 담당자가 배정되지 않은 미배정 리드 목록입니다.
              </p>
            </div>
            <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-[10px] font-black">
              대기 DB: {leads.filter(l => !l.planner_id && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting'))).length}건
            </span>
          </div>

          {leads.filter(l => !l.planner_id && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting'))).length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-850 rounded-2xl bg-slate-950/20">
              🎉 대기 풀에 미배정된 고관여 공용 DB가 없습니다. 모든 리드가 배정되었습니다.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
              <table className="w-full min-w-[700px] text-xs font-bold text-slate-350">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450 text-left">
                    <th className="py-3 px-4">고객명</th>
                    <th className="py-3 px-4">연락처</th>
                    <th className="py-3 px-4">신청 유형</th>
                    <th className="py-3 px-4">유입 일시</th>
                    <th className="py-3 px-4 text-center">설계사 지정 배정</th>
                  </tr>
                </thead>
                <tbody>
                  {leads
                    .filter(l => !l.planner_id && (isLeadConsult(l.insurance_type) || l.insurance_type?.includes('_underwriting')))
                    .map(lead => (
                      <tr key={lead.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-slate-200">{lead.name}</td>
                        <td className="py-3 px-4 text-slate-400">{lead.phone}</td>
                        <td className="py-3 px-4">
                          <span className="px-1.5 py-0.5 bg-orange-500/10 text-orange-400 rounded text-[9px] font-black">
                            {getInsuranceTypeName(lead.insurance_type || '').label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-450">
                          {new Date(lead.created_at).toLocaleString('ko-KR')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignPlanner(lead.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="bg-slate-900 border border-slate-800 rounded-lg py-1 px-3 text-xs font-bold text-slate-300 focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="">설계사 지정...</option>
                            {planners
                              .filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active')
                              .map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.planner_code})</option>
                              ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {getCurrentRoutingType() === 'distribute_auto' && (
        <div className="space-y-6 mt-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-8 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  ⚡ 실시간 자동 분배 엔진 세부 설정 (Auto-Routing Settings)
                </h3>
                <p className="text-xs text-slate-450 font-semibold mt-1">
                  대리점 대표 광고로 들어온 공용 DB를 배정할 때 적용할 알고리즘 및 설계사별 정책을 제어합니다.
                </p>
              </div>
              <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-[10px] font-black uppercase">
                엔진 상태: 가동 중
              </span>
            </div>

            {/* 알고리즘 선택 버튼 */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-300 block">활성화 알고리즘 선택</label>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { 
                    type: 'distribute_auto_round_robin', 
                    label: '균등 순차 분배 (Round-Robin)', 
                    desc: '최근 30일 배정 건수가 가장 적은 설계사에게 순서대로 리드를 균등 분배합니다.' 
                  },
                  { 
                    type: 'distribute_auto_weighted', 
                    label: '가중치 기반 비율 분배 (Weighted)', 
                    desc: '설계사별 설정된 영업 가중치(비율)에 비례하여 높은 확률로 자동 분배합니다.' 
                  },
                  { 
                    type: 'distribute_auto_activity', 
                    label: '응대 실적 기반 분배 (Activity-Based)', 
                    desc: '이번 달 크레딧 사용량(활동 실적)이 높은 최우수 설계사에게 가중 우선 분배합니다.' 
                  }
                ].map((algo) => {
                  const isSelected = agencies.find(a => a.id === currentUser.agencyId)?.lead_routing_type === algo.type;
                  return (
                    <button
                      key={algo.type}
                      onClick={() => handleUpdateRouting(algo.type)}
                      className={`p-4.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${isSelected ? 'border-orange-500 bg-orange-500/5 text-white' : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'}`}
                    >
                      <div className="font-extrabold text-sm flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-orange-500' : 'bg-slate-750'}`} />
                        {algo.label}
                      </div>
                      <p className="text-[10px] text-slate-550 font-semibold mt-2 leading-relaxed break-keep">
                        {algo.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 설계사별 배정 상태 및 가중치 관리 테이블 */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-white">👥 플래너별 자동 분배 정책 설정</h4>
                <p className="text-[11px] text-slate-455 font-bold">각 설계사의 자동 분배 배제 여부(Disabled) 및 가중치(Weight)를 실시간으로 제어합니다.</p>
              </div>

              {/* PC View: Table */}
              <div className="hidden md:block overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full min-w-[800px] text-xs font-bold text-slate-350">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450 text-left">
                      <th className="py-3 px-4">설계사명</th>
                      <th className="py-3 px-4">연락처</th>
                      <th className="py-3 px-4 text-center">최근 30일 배정 상태</th>
                      <th className="py-3 px-4 text-center">이번 달 실적 점수</th>
                      <th className="py-3 px-4 text-center w-36">영업 가중치 (Weight)</th>
                      <th className="py-3 px-4 text-center w-32">분배 수신 상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planners
                      .filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active')
                      .map(planner => {
                        const stats = getPlannerAssignmentStats(planner.id);
                        const regNum = planner.registration_number || '';
                        const distPart = regNum.includes('|') ? regNum.split('|')[1] : regNum;
                        const isDisabled = distPart === 'dist_disabled';

                        // Parse weight
                        let weight = 5;
                        if (distPart.startsWith('dist_weight:')) {
                          const w = parseInt(distPart.split(':')[1]);
                          weight = isNaN(w) ? 5 : w;
                        }

                        return (
                          <tr key={planner.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                            <td className="py-3 px-4 text-slate-200">{planner.name} ({planner.planner_code})</td>
                            <td className="py-3 px-4 text-slate-455">{planner.phone}</td>
                            <td className="py-3 px-4 text-center text-slate-450">
                              {stats.count}건 <span className="text-[10px] text-slate-500">({stats.ratio}%)</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="text-emerald-400 font-extrabold">{planner.monthly_credit_used || 0}점</span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <input
                                type="number"
                                disabled={isDisabled}
                                defaultValue={isDisabled ? '' : weight}
                                onBlur={(e) => handleUpdatePlannerWeight(planner.id, Number(e.target.value))}
                                placeholder="5"
                                min="1"
                                max="100"
                                className="w-20 bg-slate-900 border border-slate-800 disabled:opacity-30 rounded-lg py-1 px-2 text-center text-xs font-black text-white focus:outline-none focus:border-orange-500"
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleTogglePlannerDistribution(planner.id, regNum)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${isDisabled ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'}`}
                              >
                                {isDisabled ? '❌ 제외됨 (Disabled)' : '🟢 배정중 (Active)'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Card List */}
              <div className="md:hidden space-y-3">
                {planners
                  .filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active')
                  .map(planner => {
                    const stats = getPlannerAssignmentStats(planner.id);
                    const regNum = planner.registration_number || '';
                    const distPart = regNum.includes('|') ? regNum.split('|')[1] : regNum;
                    const isDisabled = distPart === 'dist_disabled';

                    // Parse weight
                    let weight = 5;
                    if (distPart.startsWith('dist_weight:')) {
                      const w = parseInt(distPart.split(':')[1]);
                      weight = isNaN(w) ? 5 : w;
                    }

                    return (
                      <div 
                        key={planner.id}
                        className={`bg-slate-900/60 border rounded-2xl p-4 space-y-3.5 transition-all ${
                          isDisabled ? 'border-rose-500/20 opacity-80' : 'border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        {/* Planner Profile Header */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-left">
                            <h4 className="font-extrabold text-sm text-white">{planner.name}</h4>
                            <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                              코드: {planner.planner_code} • {planner.phone}
                            </p>
                          </div>
                          
                          {/* Status Button */}
                          <button
                            onClick={() => handleTogglePlannerDistribution(planner.id, regNum)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer shrink-0 ${
                              isDisabled 
                                ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20' 
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                            }`}
                          >
                            {isDisabled ? '❌ 제외됨' : '🟢 배정중'}
                          </button>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-slate-800/40" />

                        {/* Info and weight input */}
                        <div className="grid grid-cols-2 gap-3 items-center">
                          <div className="space-y-1 text-left">
                            <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">배정 및 실적</span>
                            <p className="text-[11px] font-semibold text-slate-350">
                              {stats.count}건 ({stats.ratio}%) • <span className="text-emerald-400 font-extrabold">{planner.monthly_credit_used || 0}점</span>
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-slate-500 font-black block text-[8px] uppercase tracking-wider">영업 가중치 (Weight)</span>
                            <input
                              type="number"
                              disabled={isDisabled}
                              defaultValue={isDisabled ? '' : weight}
                              onBlur={(e) => handleUpdatePlannerWeight(planner.id, Number(e.target.value))}
                              placeholder="5"
                              min="1"
                              max="100"
                              className="w-16 bg-slate-950 border border-slate-800 disabled:opacity-30 rounded-lg py-1 px-2 text-center text-xs font-black text-white focus:outline-none focus:border-orange-500/40"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* DB 분배 시뮬레이터 (Lead Distribution Visualizer) */}
          <LeadDistributionSimulator 
            planners={planners} 
            agencies={agencies} 
            currentUser={currentUser} 
            showHelpGuide={showHelpGuide} 
            activeStrategy={getCurrentRoutingAlgo()}
          />
        </div>
      )}

      {/* 자주 묻는 질문 (FAQ) 섹션 */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 space-y-6 text-left mt-8">
        <div className="flex items-center justify-between border-b border-slate-850 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">❓</span>
            <div>
              <h3 className="text-base font-extrabold text-white">⚙️ 분배 시스템 자주 묻는 질문 (FAQ)</h3>
              <p className="text-xs text-slate-450 font-semibold mt-1">대리점 대표자들이 가장 자주 문의하는 분배 정책 핵심 매뉴얼입니다.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFaq(!showFaq)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-black transition-all cursor-pointer ${
              showFaq 
                ? 'bg-orange-500/10 border-orange-500/40 text-orange-400 hover:bg-orange-500/20 shadow-lg shadow-orange-500/5' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {showFaq ? '📖 FAQ 접기' : '📘 FAQ 펼치기'}
          </button>
        </div>

        {showFaq && (
          <div className="space-y-4 active-tab-fade-slide">
            {[
              {
                q: "Q1. 3가지 분배 방식(Direct, Manual, Auto-Routing)은 각각 언제 선택하나요?",
                a: "• 개인 홍보 직접배정형 (Direct)은 대리점 차원 광고가 없고 설계사 개별 영업에 의존할 때 적합합니다.\n• 대리점 수동 분배형 (Manual Pool)은 공동 광고로 유입된 고관여 리드를 관리자가 면밀히 검토 후 수동 매칭하고자 할 때 최적입니다.\n• 실시간 자동 분배형 (Auto-Routing)은 대량의 공동 리드가 쏟아질 때 실시간(0.1초 이내)으로 공평 또는 성과 비례로 자동 즉시 분배하고자 할 때 최적입니다."
              },
              {
                q: "Q2. 실시간 자동 분배의 3가지 알고리즘(순차, 가중치, 실적)은 어떻게 작동하나요?",
                a: "• 균등 순차 분배 (Round-Robin): 최근 30일 배정 비율을 분석해 배정 건수가 가장 적은 플래너에게 순환하여 1건씩 똑같이 배정합니다.\n• 가중치 기반 비율 분배 (Weighted): 설정된 영업 가중치(Weight) 값에 비례하여 더 높은 확률로 분배받습니다. (예: 가중치 10은 가중치 5보다 2배 더 자주 배정됨)\n• 응대 실적 기반 분배 (Activity-Based): 이번 달 활동 실적 점수(크레딧 사용량 등)가 높은 열정적인 플래너에게 우선 할당됩니다."
              },
              {
                q: "Q3. 특정 설계사를 자동 배정 대상에서 완전히 제외하려면 어떻게 합니까?",
                a: "• 실시간 자동 분배형 하단 테이블의 '분배 수신 상태'에서 플래너 우측의 녹색 버튼(배정중)을 클릭하여 빨간색 '❌ 제외됨 (Disabled)' 상태로 변경하시면, 어떠한 분배 알고리즘에서도 0.1초 만에 즉각 제외 처리가 동기화됩니다."
              },
              {
                q: "Q4. 수동 분배 대기 풀에 누적된 리드는 플래너에게 보이나요?",
                a: "• 아니오. 수동 분배 대기 풀에 머물고 있는 공용 리드는 담당 플래너가 지정되지 않은 상태이므로 일반 소속 설계사의 대시보드에는 전혀 보이지 않으며, 오직 대리점 대표 관리자의 화면에서만 관리 및 배정이 가능합니다."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 hover:border-slate-800 transition-all">
                <span className="text-xs font-black text-orange-400 block mb-2 font-mono">{item.q}</span>
                <p className="text-xs font-bold text-slate-350 leading-relaxed whitespace-pre-line break-keep font-sans">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
