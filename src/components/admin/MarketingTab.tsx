import React from 'react';
import { Lead, Planner } from '../AdminDashboard';
import { isInKstDateRange } from './adminUtils';

interface MarketingTabProps {
  visitorLogs: any[];
  leads: Lead[];
  planners: Planner[];
  showHelpGuide: boolean;
  marketingPeriod: 'today' | '7days' | 'all';
  setMarketingPeriod: (val: 'today' | '7days' | 'all') => void;
  statsSubTab: 'marketing' | 'sales';
  setStatsSubTab: (val: 'marketing' | 'sales') => void;
  renderHelpGuideToggle: () => React.ReactNode;
}

export function MarketingTab({
  visitorLogs,
  leads,
  planners,
  showHelpGuide,
  marketingPeriod,
  setMarketingPeriod,
  statsSubTab,
  setStatsSubTab,
  renderHelpGuideToggle
}: MarketingTabProps) {

  // Calculations
  const getTodayVisitors = () => {
    return visitorLogs.filter(log => isInKstDateRange(log.created_at, 'today')).length;
  };

  const getFilteredVisitorLogs = () => {
    return visitorLogs.filter(log => isInKstDateRange(log.created_at, marketingPeriod));
  };

  const getFilteredLeads = () => {
    return leads.filter(lead => isInKstDateRange(lead.created_at, marketingPeriod));
  };

  const getChannelStats = () => {
    const channels = [
      { key: 'google_ads', name: '구글 키워드/디스플레이 광고', iconColor: 'bg-blue-500' },
      { key: 'naver_gfa', name: '네이버 디스플레이 광고 (GFA)', iconColor: 'bg-emerald-600' },
      { key: 'naver', name: '네이버 일반/검색', iconColor: 'bg-emerald-500' },
      { key: 'facebook', name: '페이스북 스폰서드 광고', iconColor: 'bg-indigo-600' },
      { key: 'instagram', name: '인스타그램 피드/스토리 광고', iconColor: 'bg-pink-500' },
      { key: 'kakaotalk', name: '카카오톡 공유/광고', iconColor: 'bg-amber-400' },
      { key: 'tiktok', name: '틱톡 동영상 광고', iconColor: 'bg-cyan-400' },
      { key: 'google', name: '구글 일반/검색', iconColor: 'bg-red-500' },
      { key: 'organic', name: '일반/자연 유입 (Direct)', iconColor: 'bg-slate-600' },
    ];

    const filteredLogs = getFilteredVisitorLogs();
    const filteredLeads = getFilteredLeads();

    const stats = channels.map(ch => {
      const visits = filteredLogs.filter(log => {
        let logSrc = log.utm_source || 'organic';
        if (logSrc === 'kakao') logSrc = 'kakaotalk';
        return logSrc === ch.key;
      }).length;
      const conversions = filteredLeads.filter(lead => {
        let leadSrc = lead.raw_payload?.utm_source || 'organic';
        if (leadSrc === 'kakao') leadSrc = 'kakaotalk';
        return leadSrc === ch.key;
      }).length;
      const rate = visits > 0 ? ((conversions / visits) * 100) : 0;
      return {
        ...ch,
        visits,
        conversions,
        rate
      };
    });

    return stats.sort((a, b) => b.visits - a.visits);
  };

  const getSalesStats = () => {
    // 1. Planner stats
    const plannerMap: Record<string, { name: string; total: number; calling: number; completed: number; revenue: number }> = {};
    
    // Initialize planners
    planners.forEach(p => {
      plannerMap[p.id] = { name: p.name, total: 0, calling: 0, completed: 0, revenue: 0 };
    });
    // Add fallback for unassigned
    plannerMap['unassigned'] = { name: '미배정', total: 0, calling: 0, completed: 0, revenue: 0 };

    leads.forEach(l => {
      const pId = l.planner_id || 'unassigned';
      if (!plannerMap[pId]) {
        plannerMap[pId] = { name: l.planner_name || '외부 설계사', total: 0, calling: 0, completed: 0, revenue: 0 };
      }
      plannerMap[pId].total += 1;
      if (l.status === 'calling') {
        plannerMap[pId].calling += 1;
      } else if (l.status === 'completed' || l.status === 'done') {
        plannerMap[pId].completed += 1;
      }
      if (l.monthly_premium) {
        plannerMap[pId].revenue += l.monthly_premium;
      }
    });

    const plannerStats = Object.values(plannerMap).sort((a, b) => b.total - a.total);

    // 2. Product Category stats
    const categoryMap: Record<string, { count: number; totalPremium: number }> = {};
    leads.forEach(l => {
      const type = l.insurance_type || '기타';
      if (!categoryMap[type]) {
        categoryMap[type] = { count: 0, totalPremium: 0 };
      }
      categoryMap[type].count += 1;
      if (l.monthly_premium) {
        categoryMap[type].totalPremium += l.monthly_premium;
      }
    });
    const categoryStats = Object.entries(categoryMap).map(([name, val]) => ({
      name,
      count: val.count,
      avgPremium: val.count > 0 ? Math.round(val.totalPremium / val.count) : 0,
      share: leads.length > 0 ? (val.count / leads.length) * 100 : 0
    })).sort((a, b) => b.count - a.count);

    // 3. Demographic stats
    let maleCount = 0;
    let femaleCount = 0;
    const ageGroups = { '20s_under': 0, '30s': 0, '40s': 0, '50s_over': 0 };

    leads.forEach(l => {
      const gender = l.raw_payload?.gender;
      if (gender === 'M') maleCount++;
      else if (gender === 'F') femaleCount++;

      const age = l.age;
      if (age !== undefined) {
        if (age < 30) ageGroups['20s_under']++;
        else if (age < 40) ageGroups['30s']++;
        else if (age < 50) ageGroups['40s']++;
        else ageGroups['50s_over']++;
      }
    });

    const totalDemographics = leads.length || 1;
    const genderStats = {
      maleRate: (maleCount / totalDemographics) * 100,
      femaleRate: (femaleCount / totalDemographics) * 100
    };

    return {
      plannerStats,
      categoryStats,
      genderStats,
      ageGroups
    };
  };

  return (
    <div key="marketing" className="active-tab-fade-slide space-y-8 text-left">
      {showHelpGuide && (
        <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
          <div className="pl-2 space-y-1">
            <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 광고 / 유입 분석</span>
            <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
              "📈 오늘 및 누적 접속자 수, 카톡 상담 요청 전환율, 유입 경로(인스타, 네이버, 카톡, 구글 광고) 성과 지표를 실시간으로 모니터링하여 광고 효율을 극대화합니다."
            </p>
          </div>
        </div>
      )}
      
      {/* Tab Header Row 1: Title and Toggle */}
      <div className="flex flex-row justify-between items-center gap-4 pb-2">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            📈 실시간 마케팅 & 광고 유입 통계
          </h2>
          <p className="text-xs font-bold text-slate-400">
            내 브랜드 홍보 링크로 접속한 경로별 광고 성과와 고객 전환율을 0.1초 만에 실시간 모니터링합니다.
          </p>
        </div>

        {renderHelpGuideToggle()}
      </div>

      {/* Tab Header Row 2: Time Period Filter Tabs */}
      <div className="flex flex-wrap items-center justify-end gap-3 border-b border-slate-800/80 pb-4">
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-855 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMarketingPeriod('today')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border-none ${marketingPeriod === 'today' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200 bg-transparent'}`}
          >
            오늘
          </button>
          <button
            type="button"
            onClick={() => setMarketingPeriod('7days')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border-none ${marketingPeriod === '7days' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200 bg-transparent'}`}
          >
            최근 7일
          </button>
          <button
            type="button"
            onClick={() => setMarketingPeriod('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer border-none ${marketingPeriod === 'all' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' : 'text-slate-400 hover:text-slate-200 bg-transparent'}`}
          >
            전체 기간
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex gap-2 p-1 bg-slate-950/60 border border-slate-855 rounded-xl max-w-sm">
        <button
          type="button"
          onClick={() => setStatsSubTab('marketing')}
          className={`flex-1 px-4 py-2 rounded-lg text-[11px] font-black transition-all cursor-pointer text-center border-none ${statsSubTab === 'marketing' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 bg-transparent'}`}
        >
          📢 유입 경로별 분석
        </button>
        <button
          type="button"
          onClick={() => setStatsSubTab('sales')}
          className={`flex-1 px-4 py-2 rounded-lg text-[11px] font-black transition-all cursor-pointer text-center border-none ${statsSubTab === 'sales' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 bg-transparent'}`}
        >
          💼 설계사/상품별 실적
        </button>
      </div>

      {/* 유입 매체 분석 서브탭 */}
      {statsSubTab === 'marketing' && (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Today Visitors */}
            <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">오늘 접속자 수</span>
              <p className="text-2xl font-black text-orange-500">{getTodayVisitors().toLocaleString()} 명</p>
              <p className="text-[9px] text-slate-500 font-bold">당일 KST 0시 기준 유니크 세션</p>
            </div>

            {/* Filtered Period Visitors */}
            <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all relative overflow-hidden">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                {marketingPeriod === 'today' ? '오늘' : marketingPeriod === '7days' ? '최근 7일' : '누적'} 접속자 수
              </span>
              <p className="text-2xl font-black text-white">{getFilteredVisitorLogs().length.toLocaleString()} 명</p>
              <p className="text-[9px] text-slate-500 font-bold">선택한 기간 동안의 방문 세션</p>
            </div>

            {/* Filtered Period Converted Leads */}
            <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                {marketingPeriod === 'today' ? '오늘' : marketingPeriod === '7days' ? '최근 7일' : '누적'} 상담 신청 수
              </span>
              <p className="text-2xl font-black text-emerald-400">{getFilteredLeads().length.toLocaleString()} 명</p>
              <p className="text-[9px] text-slate-500 font-bold">선택한 기간 내 보장분석 완료 건</p>
            </div>

            {/* Filtered Period Avg. Conversion Rate */}
            <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">선택 기간 평균 전환율</span>
              <p className="text-2xl font-black text-sky-400">
                {getFilteredVisitorLogs().length > 0 ? ((getFilteredLeads().length / getFilteredVisitorLogs().length) * 100).toFixed(1) : '0.0'} %
              </p>
              <p className="text-[9px] text-slate-500 font-bold">방문 대비 상담 신청 성공 비율</p>
            </div>
          </div>

          {/* KST Timezone Indicator */}
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-3 py-1 rounded-md border border-slate-900/60 inline-flex items-center gap-1">
              ⏰ 모든 데이터는 대한민국 표준시(KST) 기준으로 0.1초 만에 실시간 집계됩니다.
            </span>
          </div>

          {/* Best Performing Channel Highlight */}
          {(() => {
            const stats = getChannelStats();
            const bestChannel = stats.filter(s => s.visits > 0).sort((a, b) => b.rate - a.rate)[0];
            if (!bestChannel || bestChannel.rate === 0) return null;
            return (
              <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-5 flex items-center gap-4 text-xs">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-orange-500/20 shrink-0">
                  👑
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-white">
                    {marketingPeriod === 'today' ? '오늘' : marketingPeriod === '7days' ? '최근 7일간' : '현재'} 최고 전환 매체는 <span className="text-orange-400 font-black">{bestChannel.name}</span> 입니다!
                  </p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    해당 채널의 전환율은 <span className="text-emerald-400 font-black">{bestChannel.rate.toFixed(1)}%</span>로 전체 평균을 웃돌고 있습니다. 이 매체에 광고 비중을 늘리는 것을 적극 권장합니다.
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Channel Breakdown */}
          <div className="p-4 sm:p-8 space-y-6 bg-slate-950/40 border border-slate-850 rounded-2xl sm:rounded-[2rem]">
            {showHelpGuide && (
              <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                <div className="pl-2 space-y-1">
                  <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 유입 경로별 효율 상세 분석</span>
                  <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                    "📍 인스타그램, 네이버 블로그, 카카오톡 채널, 구글 검색광고 등 마케팅 매체별 방문 횟수 대비 실제 내보험 분석 신청 전환 건수를 0.1초 단위로 대조 정산합니다."
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                📍 유입 채널별 효율 상세 데이터
                <span className="text-[10px] text-slate-500 font-normal">
                  ({marketingPeriod === 'today' ? '오늘' : marketingPeriod === '7days' ? '최근 7일' : '전체'})
                </span>
              </h3>
              <span className="text-[10px] text-slate-550 font-bold">
                (유입량 순 정렬)
              </span>
            </div>

            <div className="space-y-5">
              {getChannelStats().map(ch => {
                const filteredTotalVisits = getFilteredVisitorLogs().length || 1;
                const visitPercent = Math.min(100, (ch.visits / filteredTotalVisits) * 100);
                return (
                  <div key={ch.key} className="space-y-2 border-b border-slate-900/60 pb-4 last:border-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                      {/* Label and Badge */}
                      <div className="flex items-center gap-2 font-extrabold">
                        <span className={`w-2.5 h-2.5 rounded-full ${ch.iconColor}`} />
                        <span className="text-slate-200">{ch.name}</span>
                        {ch.visits > 0 && ch.rate >= 10 && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded text-[9px] font-black">
                            고효율
                          </span>
                        )}
                      </div>

                      {/* Stat figures */}
                      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                        <div>
                          <span className="text-slate-550">방문:</span>{' '}
                          <span className="text-white font-extrabold">{ch.visits.toLocaleString()} 명</span>
                        </div>
                        <div className="w-px h-3 bg-slate-800" />
                        <div>
                          <span className="text-slate-550">상담 신청:</span>{' '}
                          <span className="text-emerald-400 font-black">{ch.conversions.toLocaleString()} 건</span>
                        </div>
                        <div className="w-px h-3 bg-slate-800" />
                        <div>
                          <span className="text-slate-550">전환율:</span>{' '}
                          <span className="text-orange-400 font-black">{ch.rate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Visited proportion progress bar */}
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${visitPercent}%` }} 
                        className={`h-full ${ch.iconColor} rounded-full transition-all duration-500`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* B2B 대리점/설계사 실적 통계 서브탭 */}
      {statsSubTab === 'sales' && (
        <div className="space-y-8">
          {/* Top stat overview cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">총 배정 설계사</span>
              <p className="text-2xl font-black text-orange-500">{planners.length} 명</p>
              <p className="text-[9px] text-slate-500 font-bold">소속 활성 설계사 수</p>
            </div>
            <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">총 설계 월 보험료</span>
              <p className="text-2xl font-black text-emerald-400">
                {leads.reduce((sum, l) => sum + (l.monthly_premium || 0), 0).toLocaleString()} 원
              </p>
              <p className="text-[9px] text-slate-500 font-bold">전체 수집 건의 누적 월 납입료</p>
            </div>
            <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">평균 월 납입료</span>
              <p className="text-2xl font-black text-sky-400">
                {Math.round(leads.reduce((sum, l) => sum + (l.monthly_premium || 0), 0) / (leads.filter(l => l.monthly_premium).length || 1)).toLocaleString()} 원
              </p>
              <p className="text-[9px] text-slate-500 font-bold">건당 평균 월 설계 비용</p>
            </div>
            <div className="bg-slate-950/45 border border-slate-850 p-5 rounded-2xl space-y-1 hover:border-slate-800 transition-all">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">평균 연령대</span>
              <p className="text-2xl font-black text-white">
                {Math.round(leads.reduce((sum, l) => sum + (l.age || 0), 0) / (leads.filter(l => l.age).length || 1))} 세
              </p>
              <p className="text-[9px] text-slate-500 font-bold">수집된 가입 신청고객 평균 나이</p>
            </div>
          </div>

          {/* Main grids */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* 1. Planner performance table */}
            <div className="lg:col-span-2 p-4 sm:p-8 space-y-6 bg-slate-950/40 border border-slate-850 rounded-2xl sm:rounded-[2rem]">
              {showHelpGuide && (
                <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)] relative z-10">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                  <div className="pl-2 space-y-1">
                    <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 설계사별 리드 배정 및 계약 실적 현황</span>
                    <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                      "👤 소속 설계사 개개인에게 배정된 총 상담 리드 대비 최종 계약 완료를 지은 실적과 그에 따른 영업 전환율(%)을 일목요연하게 표시합니다."
                    </p>
                  </div>
                </div>
              )}
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                👤 설계사별 리드 배정 및 계약 실적 현황
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-black">
                      <th className="pb-3 pr-2">설계사명</th>
                      <th className="pb-3 px-2 text-center">배정 리드</th>
                      <th className="pb-3 px-2 text-center">상담 진행</th>
                      <th className="pb-3 px-2 text-center">계약 완료</th>
                      <th className="pb-3 px-2 text-center">전환율</th>
                      <th className="pb-3 pl-2 text-right">총 설계 금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSalesStats().plannerStats.map((pl) => {
                      const total = pl.total || 1;
                      const conversionRate = ((pl.completed / total) * 100).toFixed(1);
                      return (
                        <tr key={pl.name} className="border-b border-slate-900/60 font-bold text-slate-350 hover:text-white transition-colors">
                          <td className="py-3.5 pr-2 font-black text-slate-200">{pl.name}</td>
                          <td className="py-3.5 px-2 text-center text-slate-400">{pl.total} 건</td>
                          <td className="py-3.5 px-2 text-center text-amber-400">{pl.calling} 건</td>
                          <td className="py-3.5 px-2 text-center text-emerald-400">{pl.completed} 건</td>
                          <td className="py-3.5 px-2 text-center">
                            <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded text-[10px]">
                              {conversionRate}%
                            </span>
                          </td>
                          <td className="py-3.5 pl-2 text-right font-black text-slate-100">{pl.revenue.toLocaleString()} 원</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right column: Category Share & Demographics */}
            <div className="space-y-6">
              {showHelpGuide && (
                <div className="p-4 bg-slate-950 border border-orange-500/30 rounded-2xl text-left relative overflow-hidden shadow-[0_10px_30px_rgba(255,107,0,0.05)]">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500" />
                  <div className="pl-2 space-y-1">
                    <span className="text-[10px] font-black text-orange-400 block uppercase tracking-wider">💡 도움말 가이드: 가입 분석 상품 점유율 및 성별/연령대</span>
                    <p className="text-xs font-extrabold text-white leading-relaxed break-keep">
                      "📦 고객들이 신청한 보험군(실손, 암, 뇌/심장, 연금 등) 분포와 신청자들의 성별 및 연령대 통계 비율을 시각적으로 0.1초 만에 집계 제공합니다."
                    </p>
                  </div>
                </div>
              )}
              
              {/* 2. Product Category breakdown */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-[2rem] p-6 space-y-4">
                <h3 className="text-xs font-extrabold text-white">
                  📦 상품 종류별 점유율 및 평균 납입료
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {getSalesStats().categoryStats.map((cat) => (
                    <div key={cat.name} className="space-y-1.5 text-[11px] font-bold">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="font-extrabold text-white">{cat.name}</span>
                        <span className="text-slate-550">
                          {cat.count}건 ({cat.share.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${cat.share}%` }} 
                          className="h-full bg-orange-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Customer Demographics */}
              <div className="bg-slate-950/40 border border-slate-850 rounded-[2rem] p-6 space-y-4">
                <h3 className="text-xs font-extrabold text-white text-left">
                  👥 가입 신청고객 인구통계
                </h3>
                
                {/* Gender split */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold block text-left">성별 분포</span>
                  <div className="h-4 bg-slate-900 rounded-full overflow-hidden flex text-[9px] font-black text-white">
                    <div 
                      style={{ width: `${getSalesStats().genderStats.maleRate}%` }} 
                      className="h-full bg-sky-500 flex items-center justify-center transition-all"
                    >
                      {getSalesStats().genderStats.maleRate > 15 ? `남성 ${getSalesStats().genderStats.maleRate.toFixed(0)}%` : ''}
                    </div>
                    <div 
                      style={{ width: `${getSalesStats().genderStats.femaleRate}%` }} 
                      className="h-full bg-pink-500 flex items-center justify-center transition-all"
                    >
                      {getSalesStats().genderStats.femaleRate > 15 ? `여성 ${getSalesStats().genderStats.femaleRate.toFixed(0)}%` : ''}
                    </div>
                  </div>
                </div>

                {/* Age groups split */}
                <div className="space-y-2 pt-2 border-t border-slate-900/60">
                  <span className="text-[10px] text-slate-500 font-bold block text-left">연령별 분포</span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black">
                    <div className="bg-slate-900 p-2 rounded-xl">
                      <span className="text-slate-550 block text-[9px]">20대 이하</span>
                      <span className="text-slate-200 block mt-0.5">{getSalesStats().ageGroups['20s_under']}명</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl">
                      <span className="text-slate-555 block text-[9px]">30대</span>
                      <span className="text-slate-200 block mt-0.5">{getSalesStats().ageGroups['30s']}명</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl">
                      <span className="text-slate-555 block text-[9px]">40대</span>
                      <span className="text-slate-200 block mt-0.5">{getSalesStats().ageGroups['40s']}명</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl">
                      <span className="text-slate-555 block text-[9px]">50대 이상</span>
                      <span className="text-slate-200 block mt-0.5">{getSalesStats().ageGroups['50s_over']}명</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
