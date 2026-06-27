import React from 'react';
import { Download } from 'lucide-react';
import { Planner, Agency } from '../AdminDashboard';

interface BillingTabProps {
  currentUser: any;
  agencies: Agency[];
  planners: Planner[];
  transactions: any[];
  showHelpGuide: boolean;
  onToggleHelpGuide: () => void;
  topupLoading: boolean;
  alertThreshold: number;
  setAlertThreshold: (val: number) => void;
  alertPhone: string;
  setAlertPhone: (val: string) => void;
  savingAlert: boolean;
  handleSaveAlertSettings: () => Promise<void>;
  handleTopupCredits: (agencyId: string, amount: number) => Promise<void>;
  handleUpdatePlannerQuota: (plannerId: string, quota: number) => Promise<void>;
  handleDownloadTxCsv: () => void;
  txSearch: string;
  setTxSearch: (val: string) => void;
  txTypeFilter: 'all' | 'remodeling' | 'car' | 'topup' | 'adjust';
  setTxTypeFilter: (val: 'all' | 'remodeling' | 'car' | 'topup' | 'adjust') => void;
  filteredTransactions: any[];
  roiStats: {
    totalSpentCredits: number;
    totalCostKRW: number;
    totalLeads: number;
    completedLeads: number;
    conversionRate: number;
    cac: number;
  };
  setShowPaymentModal: (show: boolean) => void;
  setPaymentSuccess: (success: boolean) => void;
  renderHelpGuideToggle: () => React.ReactNode;
}

export function BillingTab({
  currentUser,
  agencies,
  planners,
  transactions,
  showHelpGuide,
  onToggleHelpGuide,
  topupLoading,
  alertThreshold,
  setAlertThreshold,
  alertPhone,
  setAlertPhone,
  savingAlert,
  handleSaveAlertSettings,
  handleTopupCredits,
  handleUpdatePlannerQuota,
  handleDownloadTxCsv,
  txSearch,
  setTxSearch,
  txTypeFilter,
  setTxTypeFilter,
  filteredTransactions,
  roiStats,
  setShowPaymentModal,
  setPaymentSuccess,
  renderHelpGuideToggle
}: BillingTabProps) {

  // Calculations
  const activeBillingAgencyId = currentUser.agencyId || '88888888-8888-4888-a888-888888888888';
  const isIndependentPlanner = currentUser.role === 'planner' && (!currentUser.agencyId || currentUser.agencyId === '88888888-8888-4888-a888-888888888888');

  const getDaysRemaining = () => {
    if (!currentUser.expiresAt) return 0;
    const diff = new Date(currentUser.expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  const billingAgency = agencies.find(a => a.id === currentUser.agencyId);
  const billingTier = billingAgency?.subscription_tier || 'pro';
  const billingMaxLimit = billingAgency?.max_planner_limit || 28;
  const billingActivePlanners = planners.filter(p => p.agency_id === currentUser.agencyId && p.subscription_status === 'active').length;
  const billingCapacityPercent = Math.min(100, Math.round((billingActivePlanners / billingMaxLimit) * 100));

  let billingGaugeColor = 'from-emerald-500 to-teal-500';
  let billingTextColor = 'text-emerald-400';
  let billingBorderColor = 'border-emerald-500/20';
  let billingBgColor = 'bg-emerald-500/5';
  if (billingCapacityPercent >= 90) {
    billingGaugeColor = 'from-red-500 to-rose-600';
    billingTextColor = 'text-red-400';
    billingBorderColor = 'border-red-500/20';
    billingBgColor = 'bg-red-500/5';
  } else if (billingCapacityPercent >= 70) {
    billingGaugeColor = 'from-orange-500 to-amber-500';
    billingTextColor = 'text-orange-400';
    billingBorderColor = 'border-orange-500/20';
    billingBgColor = 'bg-orange-500/5';
  }

  return (
    <div key="billing" className="active-tab-fade-slide space-y-8">
      {showHelpGuide && (
        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
          <div className="pl-2 space-y-1">
            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 구독 결제 관리</span>
            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
              "🎫 대시보드 라이선스를 유지하는 정기 구독권(월단위 연장) 및 실시간 가격비교 API 연동에 사용되는 건별 선불 크레딧 충전 상태를 투명하게 모니터링합니다."
            </p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black text-white">구독 계약 및 결제 시뮬레이션</h2>
        {renderHelpGuideToggle()}
      </div>

      {/* 1. Subscription card */}
      <div className={`p-4 sm:p-8 space-y-6 text-left relative overflow-hidden transition-all duration-300 ${
        showHelpGuide 
          ? 'help-guide-glow bg-slate-900/90 shadow-[0_20px_50px_-12px_rgba(255,107,0,0.25)] rounded-2xl sm:rounded-[2rem]' 
          : 'bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-orange-500/20 rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(255,107,0,0.08)]'
      }`}>
        {showHelpGuide && (
          <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
            <div className="pl-2 space-y-1">
              <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 월 정기 라이선스 결제 및 연장</span>
              <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                "🎫 플랫폼 대시보드와 개인/대리점 홍보용 홈페이지를 활성화 상태로 유지하기 위한 월 정기 라이선스 계약 영역입니다. 시뮬레이터를 통해 1개월 연장이 가능합니다."
              </p>
            </div>
          </div>
        )}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-orange-500/5 rounded-full blur-2xl" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md text-[10px] font-black uppercase tracking-wider inline-block">
                🎫 월간 정기 구독권 라이선스 (Subscription)
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-black">
                기간제 라이선스
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>{currentUser.role === 'agency' ? '대리점 통합 단체 구독 플랜' : '개인 설계사 독립형 구독 플랜'}</span>
              {currentUser.role === 'agency' && (
                <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 border border-orange-500/20 rounded font-black uppercase tracking-wider">
                  {billingTier}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-450 font-bold leading-relaxed">
              대리점 플랫폼 이용 권한 및 소속 설계사들의 마케팅 랜딩페이지 활성화 상태를 유지하는 월 정기 구독 계약 정보입니다.
            </p>
          </div>
          
          <div className="bg-slate-950 border border-slate-900/60 px-6 py-3.5 rounded-2xl flex items-center gap-6 shrink-0 self-start md:self-auto shadow-inner">
            <div>
              <span className="text-[9px] font-bold text-slate-500 block uppercase">정상 요금</span>
              <span className="text-base font-black text-white">
                {currentUser.role === 'agency' 
                  ? (billingTier === 'basic' 
                      ? '월 500,000 원' 
                      : billingTier === 'pro' 
                        ? '월 1,000,000 원' 
                        : '월 5,000,000 원')
                  : '월 50,000 원'}
              </span>
              <span className="text-[9px] text-slate-500 font-bold block">(부가세 10% 별도)</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-[9px] font-bold text-slate-500 block uppercase">남은 기간</span>
              <span className="text-base font-black text-orange-500">{getDaysRemaining()} 일</span>
            </div>
          </div>
        </div>
  
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-bold">
            <div className="space-y-1">
              <p className="text-slate-300">구독 만료 예정일</p>
              <p className="text-slate-500 text-[11px]">
                {currentUser.expiresAt ? new Date(currentUser.expiresAt).toLocaleDateString('ko-KR', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : '정보 없음'}
              </p>
            </div>
            
            <button 
              onClick={() => {
                setPaymentSuccess(false);
                setShowPaymentModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-xl text-xs shadow-lg shadow-orange-500/10 cursor-pointer text-center border-none"
            >
              👉 1개월 구독 연장 결제하기 (시뮬레이터)
            </button>
          </div>

          {/* B2B Agency Capacity Gauge Bar */}
          {currentUser.role === 'agency' && (
            <div className={`mt-6 p-5 border rounded-2xl ${billingBorderColor} ${billingBgColor} space-y-4`}>
              <div className="flex justify-between items-center text-xs font-bold">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">소속 설계사 등록 한도 (Capacity Status)</span>
                  <h4 className="text-sm font-extrabold text-white">
                    현재 요금제 등급: <span className="text-orange-400 font-black uppercase">{billingTier} 플랜</span>
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block">활성 인원수</span>
                  <span className={`text-base font-black ${billingTextColor}`}>{billingActivePlanners}</span>
                  <span className="text-slate-500 text-xs font-bold"> / {billingMaxLimit} 명 ({billingCapacityPercent}%)</span>
                </div>
              </div>

              {/* Visual Gauge Bar */}
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-900">
                <div 
                  className={`h-full bg-gradient-to-r ${billingGaugeColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${billingCapacityPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                <span>0%</span>
                <span>70% (경고)</span>
                <span>90% (정원 임박)</span>
                <span>100% (정원 초과)</span>
              </div>
            </div>
          )}
        </div>
      </div>
 
      {/* 2. Prepaid Credits Card */}
      {(currentUser.role === 'agency' || currentUser.role === 'super' || currentUser.role === 'planner') && (
        <div className={`p-4 sm:p-8 space-y-6 text-left relative overflow-hidden transition-all duration-350 ${
          showHelpGuide 
            ? 'help-guide-glow bg-slate-900/90 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.25)] rounded-2xl sm:rounded-[2rem]' 
            : 'bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/20 rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(245,158,11,0.08)]'
        }`}>
          {showHelpGuide && (
            <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <div className="pl-2 space-y-1">
                <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 실시간 API 크레딧 충전 및 잔액 관리</span>
                <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                  "⚡ 보험 보장 분석(300크레딧) 및 자동차 보험료 계산(100크레딧)을 수행할 때 API 서버 통신 원가로 실시간 차감되는 선불제 크레딧입니다. 버튼을 클릭해 충전이 가능합니다."
                </p>
              </div>
            </div>
          )}
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-[10px] font-black uppercase tracking-wider inline-block">
                  ⚡ 종량제 실시간 API 크레딧 (Prepaid Credits)
                </span>
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[9px] font-black">
                  건별 차감식 크레딧
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {(currentUser.role === 'agency' || currentUser.role === 'planner') 
                  ? `${agencies.find(a => a.id === activeBillingAgencyId)?.name || '대리점'} API 크레딧`
                  : '대리점별 선불 크레딧 관리'}
              </h3>
              <p className="text-[11px] text-slate-450 font-bold leading-relaxed">
                고객이 내보험 분석을 하면 보험다모아에서 API를 통해 실시간으로 자료를 가져오는데 쓰이며, 자동차 보험의 내 차량정보 조회를 하면 car365에서 API를 통해 실시간 분석을 위해 쓰여 집니다.
                <br />
                (내 보험 분석 300크레딧, 실시간 자동차 비교 100크레딧) API 연동 시 실시간 차감되는 선불금 잔액입니다.
                <br />
                <span className="text-orange-400 font-extrabold">※ 모든 크레딧 결제금액은 부가세(10%) 별도입니다. (예: 10만 크레딧 충전 시 110,000원 결제)</span>
              </p>
            </div>

            {(currentUser.role === 'agency' || currentUser.role === 'planner') && (
              <div className="bg-slate-950 border border-slate-900/60 px-6 py-3.5 rounded-2xl flex items-center gap-6 shrink-0 self-start md:self-auto shadow-inner">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 block uppercase">보유 잔액</span>
                  <span className="text-xl font-black text-amber-500">
                    {(agencies.find(a => a.id === activeBillingAgencyId)?.current_credits || 0).toLocaleString()} <span className="text-xs text-slate-400">크레딧</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {(currentUser.role === 'agency' || isIndependentPlanner) && activeBillingAgencyId && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: '+3,000 크레딧', amount: 3000 },
                  { label: '+10,000 크레딧', amount: 10000 },
                  { label: '+30,000 크레딧', amount: 30000 },
                  { label: '+100,000 크레딧', amount: 100000 },
                  { label: '+300,000 크레딧', amount: 300000 },
                  { label: '+1,000,000 크레딧', amount: 1000000 },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    disabled={topupLoading}
                    onClick={() => handleTopupCredits(activeBillingAgencyId, item.amount)}
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-850 text-amber-500 border border-slate-800 rounded-xl font-bold text-xs cursor-pointer text-center transition-all hover:border-amber-500/40 disabled:opacity-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentUser.role === 'super' && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-450">
                총관리자 권한으로 대리점별 크레딧 잔액을 실시간으로 확인하고 충전/차감 조정을 수행합니다.
              </p>
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full min-w-[800px] text-xs font-bold text-slate-350">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450">
                      <th className="py-3 px-4 text-left">대리점명</th>
                      <th className="py-3 px-4 text-left">구독 상태</th>
                      <th className="py-3 px-4 text-right">잔여 크레딧</th>
                      <th className="py-3 px-4 text-center">크레딧 조정</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.map((agency) => (
                      <tr key={agency.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                        <td className="py-3 px-4 text-left">{agency.name}</td>
                        <td className="py-3 px-4 text-left">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${agency.subscription_status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {agency.subscription_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-amber-500 font-extrabold">
                          {(agency.current_credits || 0).toLocaleString()} 크레딧
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex gap-1 justify-center">
                            <button
                              disabled={topupLoading}
                              onClick={() => handleTopupCredits(agency.id, 10000)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-850 rounded font-black text-[10px] disabled:opacity-50 cursor-pointer"
                            >
                              +1만
                            </button>
                            <button
                              disabled={topupLoading}
                              onClick={() => handleTopupCredits(agency.id, 100000)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-850 rounded font-black text-[10px] disabled:opacity-50 cursor-pointer"
                            >
                              +10만
                            </button>
                            <button
                              disabled={topupLoading}
                              onClick={() => handleTopupCredits(agency.id, 1000000)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-850 rounded font-black text-[10px] disabled:opacity-50 cursor-pointer"
                            >
                              +100만
                            </button>
                            <button
                              disabled={topupLoading}
                              onClick={() => handleTopupCredits(agency.id, -10000)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-500 border border-slate-850 rounded font-black text-[10px] disabled:opacity-50 cursor-pointer"
                            >
                              -1만
                            </button>
                            <button
                              disabled={topupLoading}
                              onClick={() => handleTopupCredits(agency.id, -100000)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-500 border border-slate-850 rounded font-black text-[10px] disabled:opacity-50 cursor-pointer"
                            >
                              -10만
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ROI Stats & Analytics Card */}
      {(currentUser.role === 'agency' || currentUser.role === 'super') && (
        <div className="space-y-4">
          {showHelpGuide && (
            <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <div className="pl-2 space-y-1">
                <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 마케팅 투자 대비 효율 (ROI) 분석</span>
                <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                  "📊 총 비용(API 사용 원가), 수집 리드 수, 고객 획득 비용(CAC) 및 최종 상담 완료율을 종합하여 0.1초 만에 마케팅 생산성 지표를 제공합니다."
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-[10px] text-slate-550 font-bold block uppercase">총 투입 비용 (API 원가)</span>
              <span className="text-lg font-black text-white">{roiStats.totalCostKRW.toLocaleString()}원</span>
              <span className="text-[9px] text-slate-400 block font-semibold">사용된 {roiStats.totalSpentCredits.toLocaleString()} 크레딧</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-[10px] text-slate-550 font-bold block uppercase">수집 고객 리드</span>
              <span className="text-lg font-black text-white">{roiStats.totalLeads.toLocaleString()}건</span>
              <span className="text-[9px] text-slate-450 block font-semibold">설계사 링크 총 유입</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-[10px] text-slate-550 font-bold block uppercase">평균 리드 획득 단가 (CAC)</span>
              <span className="text-lg font-black text-amber-500">{roiStats.cac.toLocaleString()}원</span>
              <span className="text-[9px] text-slate-450 block font-semibold">리드 1건당 평균 분석 비용</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
              <span className="text-[10px] text-slate-550 font-bold block uppercase">영업 전환율 (ROI)</span>
              <span className="text-lg font-black text-emerald-500">{roiStats.conversionRate}%</span>
              <span className="text-[9px] text-slate-400 block font-semibold">전체 {roiStats.totalLeads}건 중 {roiStats.completedLeads}건 완료</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Low Credit Alerts Config Card */}
      {currentUser.role === 'agency' && (
        <div className={`rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 text-left space-y-6 transition-all duration-300 ${
          showHelpGuide 
            ? 'help-guide-glow bg-slate-900/90' 
            : 'bg-slate-900 border border-slate-800'
        }`}>
          {showHelpGuide && (
            <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <div className="pl-2 space-y-1">
                <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 대리점 전용 크레딧 및 알림 설정</span>
                <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                  "💳 소속 설계사들의 보장 분석 건당 차감되는 크레딧 잔액을 확인하고 충전할 수 있습니다. 크레딧 소진 경보 번호를 등록하면 한도 소진 전 문자로 즉시 알림이 발송됩니다."
                </p>
              </div>
            </div>
          )}
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white">🚨 크레딧 소진 경보 및 알림 설정</h3>
            <p className="text-xs text-slate-450 font-medium">크레딧이 부족할 경우 알림을 받을 경고 기준 액수와 휴대폰 번호를 구성합니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-400 block uppercase">경고 기준 잔액 (크레딧)</label>
              <input
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                placeholder="예: 2000"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-400 block uppercase">알림 수신 연락처</label>
              <input
                type="text"
                value={alertPhone}
                onChange={(e) => setAlertPhone(e.target.value)}
                placeholder="예: 01012345678"
                className="w-full bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <button
            onClick={handleSaveAlertSettings}
            disabled={savingAlert}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-all disabled:opacity-50 cursor-pointer border-none"
          >
            {savingAlert ? '저장 중...' : '💾 경보 설정 저장'}
          </button>
        </div>
      )}

      {/* 5. Planner Quotas Card */}
      {currentUser.role === 'agency' && (
        <div className="p-4 sm:p-8 text-left space-y-6 bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[2rem]">
          {showHelpGuide && (
            <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <div className="pl-2 space-y-1">
                <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 설계사 월간 크레딧 제한 설정</span>
                <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                  "🛡️ 소속 설계사가 단기간에 대량의 API를 호출하여 크레딧을 무단 소진하지 못하도록 월간 사용 한도를 강제 지정할 수 있는 차단기 설정판입니다."
                </p>
              </div>
            </div>
          )}
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white">🛡️ 소속 설계사 월간 사용 한도 설정</h3>
            <p className="text-xs text-slate-450 font-medium">소속 설계사의 무분별한 크레딧 남용을 방지하기 위해 개별 월간 할당량을 부여할 수 있습니다. (-1은 제한 없음)</p>
          </div>
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
            <table className="w-full min-w-[800px] text-xs font-bold text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450">
                  <th className="py-3 px-4 text-left">설계사명</th>
                  <th className="py-3 px-4 text-left">연락처</th>
                  <th className="py-3 px-4 text-right">이번 달 실사용 크레딧</th>
                  <th className="py-3 px-4 text-center w-40">월간 이용 한도</th>
                </tr>
              </thead>
              <tbody>
                {planners
                  .filter(p => p.agency_id === currentUser.agencyId)
                  .map(planner => (
                    <tr key={planner.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                      <td className="py-3 px-4 text-left">{planner.name}</td>
                      <td className="py-3 px-4 text-left text-slate-450">{planner.phone}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-amber-500 font-extrabold">{(planner as any).monthly_credit_used || 0}</span> 크레딧
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="number"
                          defaultValue={(planner as any).monthly_credit_quota ?? -1}
                          onBlur={(e) => handleUpdatePlannerQuota(planner.id, Number(e.target.value))}
                          placeholder="-1"
                          className="w-24 bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-center text-xs font-black text-white focus:outline-none focus:border-amber-500"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Transaction Log Table Card */}
      {(currentUser.role === 'agency' || currentUser.role === 'super' || currentUser.role === 'planner') && (
        <div className="p-4 sm:p-8 text-left space-y-6 bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[2rem]">
          {showHelpGuide && (
            <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
              <div className="pl-2 space-y-1">
                <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 크레딧 사용 및 충전 입출금 장부</span>
                <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                  "📝 대리점 크레딧이 어떠한 경위로 충전/조정되었고, 어떤 설계사가 몇 시 몇 분에 어떠한 유형(내보험 분석/자동차)으로 소진했는지 보여주는 회계 이력입니다."
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <h3 className="text-base font-extrabold text-white">📝 크레딧 충전 및 사용 이력</h3>
              <p className="text-xs text-slate-450 font-medium">대리점 크레딧 잔액 변동 상세 내역을 실시간으로 확인하고 다운로드합니다.</p>
            </div>
            <button
              onClick={handleDownloadTxCsv}
              className="px-4 py-2.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> CSV 다운로드
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
              placeholder="설명 또는 설계사명 검색..."
              className="flex-1 bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none"
            />
            <select
              value={txTypeFilter}
              onChange={(e) => setTxTypeFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs font-bold text-slate-300 focus:outline-none w-full sm:w-44 cursor-pointer"
            >
              <option value="all">모든 내역</option>
              <option value="remodeling">내보험 분석</option>
              <option value="car">자동차 비교</option>
              <option value="topup">충전 내역</option>
              <option value="adjust">관리자 조정</option>
            </select>
          </div>

          {/* Log Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
            <table className="w-full min-w-[800px] text-xs font-bold text-slate-350">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-[10px] text-slate-450">
                  <th className="py-3 px-4 text-left">일시</th>
                  <th className="py-3 px-4 text-left">설계사</th>
                  <th className="py-3 px-4 text-left">유형</th>
                  <th className="py-3 px-4 text-left">상세 설명</th>
                  <th className="py-3 px-4 text-right">변동 크레딧</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      기록된 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-800/60 hover:bg-slate-900/40">
                      <td className="py-3 px-4 text-[10px] text-slate-450 text-left">
                        {new Date(tx.created_at).toLocaleString('ko-KR')}
                      </td>
                      <td className="py-3 px-4 text-left">{tx.planner_name || '시스템/관리자'}</td>
                      <td className="py-3 px-4 text-left">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          tx.type === 'remodeling' ? 'bg-orange-500/10 text-orange-400' :
                          tx.type === 'car' ? 'bg-blue-500/10 text-blue-400' :
                          tx.type === 'topup' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {tx.type === 'remodeling' ? '내보험 분석' :
                           tx.type === 'car' ? '자동차 비교' :
                           tx.type === 'topup' ? '충전' : '조정'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-semibold text-left">{tx.description}</td>
                      <td className={`py-3 px-4 text-right font-black ${tx.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 text-left text-xs text-slate-400 space-y-2">
        <p className="font-extrabold text-slate-300">💡 B2B SaaS 구독 서비스 유의 사항 안내</p>
        <p className="leading-relaxed font-semibold">
          - 모든 가입 신청자는 기본적으로 가입 승인일로부터 **30일간 무료 체험(Trial)**이 제공됩니다.<br />
          - 무료 체험 만료 전에 연장 결제를 진행할 경우 남은 무료 일수에 추가로 30일이 합산 연장됩니다.<br />
          - 구독 기간이 만료되어도 어드민은 정지되지 않으나, 고객에게 노출되는 **개인화 분석 랜딩이 중지(기본 회사 정보로 대체)**되므로 만료 전 갱신을 권장합니다.
        </p>
      </div>
    </div>
  );
}
