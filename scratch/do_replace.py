import os

dashboard_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx"

with open(dashboard_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# The replacement starts at line 2473 (index 2472)
# and ends right before line 3009 (index 3008)
# Let's verify line 2473 and line 3009 again:
start_line = 2473
end_line = 3009

print(f"Targeting replacement from line {start_line} to {end_line}")
print("Start line content:", repr(lines[start_line-1]))
print("End line content:", repr(lines[end_line-1]))

replacement_content = """                          <button
                            type="button"
                            onClick={() => setConsultCategoryFilter('remodeling')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'remodeling' ? 'bg-emerald-500 text-white shadow shadow-emerald-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            💸 내 보험 다이어트 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && (l.insurance_type === 'remodeling_consult')).length}건)
                          </button>
                          <button
                            type="button"
                            onClick={() => setConsultCategoryFilter('compare')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${consultCategoryFilter === 'compare' ? 'bg-sky-500 text-white shadow shadow-sky-500/10' : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'}`}
                          >
                            📊 보험 비교분석 ({leads.filter(l => isInKstDateRange(l.created_at, leadsPeriod) && l.insurance_type?.endsWith('_consult') && l.insurance_type !== 'remodeling_consult').length}건)
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
                        <p className="text-xs font-bold">수집된 카카오톡 상담 요청 리드가 없습니다.</p>
                      </div>
                    ) : (
                      renderLeadsTable(getFilteredConsultLeads())
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Planners panel */}
              {activeTab === 'planners' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-white">대리점 소속 설계사 관리</h2>
                    <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-black">
                      대리점 소속원: {planners.filter(p => p.agency_id === currentUser.agencyId).length}명
                    </span>
                  </div>
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
                            <p className="text-[10px] text-slate-500 truncate italic">"{p.greeting_title}"</p>
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
              )}

              {/* Tab 3: Settings panel */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-black text-white">대리점 DB 분배 방식 변경 설정</h2>
                  <p className="text-xs text-slate-400 font-bold leading-normal break-keep">
                    대표 광고 또는 소속 플래너들이 수집한 고객 상담 데이터(리드)를 대리점 내부에서 어떻게 흐르게 할 것인지 결정합니다. 설정 변경 시 즉시 Supabase DB에 반영되어 다음 리드부터 적용됩니다.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <div
                      onClick={() => handleUpdateRouting('direct')}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left h-52 relative ${getCurrentRoutingType() === 'direct' ? 'bg-slate-950/40 border-orange-500 shadow-md' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                    >
                      {getCurrentRoutingType() === 'direct' && (
                        <div className="absolute top-4 right-4 text-orange-500">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-sm text-white">개인 홍보 직접배정형 (Direct)</h4>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                          소속 설계사들의 개인화 링크(`?planner=코드`)로 접수된 모든 고객 리드가 대리점을 거치지 않고, 해당 설계사에게 즉시 단독 노출 및 배정됩니다.
                        </p>
                      </div>
                      <div className="text-[9px] text-orange-400 font-black tracking-widest uppercase">
                        현재 활성화 상태
                      </div>
                    </div>
                    <div
                      onClick={() => handleUpdateRouting('distribute')}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between text-left h-52 relative ${getCurrentRoutingType() === 'distribute' ? 'bg-slate-950/40 border-orange-500 shadow-md' : 'bg-slate-950/10 border-slate-800 hover:border-slate-700'}`}
                    >
                      {getCurrentRoutingType() === 'distribute' && (
                        <div className="absolute top-4 right-4 text-orange-500">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-sm text-white">대리점 집중 분배형 (Distribute)</h4>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed break-keep">
                          대리점 전체 광고 등으로 들어온 모든 리드가 대기 풀(Pool)로 모이며, 대표 관리자(대리점주)가 '고객 리드 수집 현황' 탭에서 클릭 한 번으로 특정 플래너에게 담당을 재지정해 줍니다.
                        </p>
                      </div>
                      <div className="text-[9px] text-orange-400 font-black tracking-widest uppercase">
                        현재 활성화 상태
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Billing panel */}
              {activeTab === 'billing' && (
                <div className="space-y-8">
                  <h2 className="text-lg font-black text-white">구독 계약 및 결제 시뮬레이션</h2>

                  {/* 1. Subscription card */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2rem] p-8 space-y-6 text-left relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-44 h-44 bg-orange-500/5 rounded-full blur-2xl" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                      <div className="space-y-1.5">
                        <span className="px-2.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md text-[10px] font-black uppercase tracking-wider inline-block">
                          무료 체험 혜택 중 (Free Trial)
                        </span>
                        <h3 className="text-xl font-extrabold text-white">
                          {currentUser.role === 'agency' ? '대리점 통합 단체 구독 플랜' : '개인 설계사 독립형 구독 플랜'}
                        </h3>
                      </div>
                      
                      <div className="bg-slate-950 border border-slate-900/60 px-6 py-3.5 rounded-2xl flex items-center gap-6 shrink-0 self-start md:self-auto shadow-inner">
                        <div>
                          <span className="text-[9px] font-bold text-slate-500 block uppercase">정상 요금</span>
                          <span className="text-base font-black text-white">
                            {currentUser.role === 'agency' ? '월 500,000 원' : '월 50,000 원'}
                          </span>
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
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-xl text-xs shadow-lg shadow-orange-500/10 cursor-pointer text-center"
                        >
                          👉 1개월 구독 연장 결제하기 (시뮬레이터)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 2. Prepaid Credits Card */}
                  {(currentUser.role === 'agency' || currentUser.role === 'super') && (
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2rem] p-8 space-y-6 text-left relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl" />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                        <div className="space-y-1.5">
                          <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md text-[10px] font-black uppercase tracking-wider inline-block">
                            선불 크레딧 잔액 (Prepaid Credits)
                          </span>
                          <h3 className="text-xl font-extrabold text-white">
                            {currentUser.role === 'agency' 
                              ? `${agencies.find(a => a.id === currentUser.agencyId)?.name || '대리점'} API 크레딧`
                              : '대리점별 선불 크레딧 관리'}
                          </h3>
                        </div>

                        {currentUser.role === 'agency' && (
                          <div className="bg-slate-950 border border-slate-900/60 px-6 py-3.5 rounded-2xl flex items-center gap-6 shrink-0 self-start md:self-auto shadow-inner">
                            <div>
                              <span className="text-[9px] font-bold text-slate-500 block uppercase">보유 잔액</span>
                              <span className="text-xl font-black text-amber-500">
                                {(agencies.find(a => a.id === currentUser.agencyId)?.current_credits || 0).toLocaleString()} <span className="text-xs text-slate-400">크레딧</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {currentUser.role === 'agency' && currentUser.agencyId && (
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-slate-450">
                            💡 내 보험 분석(400 크레딧) 및 자동차 실시간 비교(300 크레딧) 완료 시 실시간으로 차감됩니다.
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { label: '+3,000 크레딧', amount: 3000 },
                              { label: '+10,000 크레딧', amount: 10000 },
                              { label: '+30,000 크레딧', amount: 30000 },
                              { label: '+100,000 크레딧', amount: 100000 },
                            ].map((item, idx) => (
                              <button
                                key={idx}
                                disabled={topupLoading}
                                onClick={() => handleTopupCredits(currentUser.agencyId!, item.amount)}
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
                            <table className="w-full text-xs font-bold text-slate-350">
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
                                    <td className="py-3 px-4">{agency.name}</td>
                                    <td className="py-3 px-4">
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
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          +1만
                                        </button>
                                        <button
                                          disabled={topupLoading}
                                          onClick={() => handleTopupCredits(agency.id, 50000)}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          +5만
                                        </button>
                                        <button
                                          disabled={topupLoading}
                                          onClick={() => handleTopupCredits(agency.id, -10000)}
                                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-rose-500 border border-slate-850 rounded font-black text-[10px]"
                                        >
                                          -1만
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">총 투입 비용 (API 원가)</span>
                        <span className="text-lg font-black text-white">{roiStats.totalCostKRW.toLocaleString()}원</span>
                        <span className="text-[9px] text-slate-400 block font-semibold">사용된 {roiStats.totalSpentCredits.toLocaleString()} 크레딧</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">수집 고객 리드</span>
                        <span className="text-lg font-black text-white">{roiStats.totalLeads.toLocaleString()}건</span>
                        <span className="text-[9px] text-slate-400 block font-semibold">설계사 링크 총 유입</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">평균 리드 획득 단가 (CAC)</span>
                        <span className="text-lg font-black text-amber-500">{roiStats.cac.toLocaleString()}원</span>
                        <span className="text-[9px] text-slate-450 block font-semibold">리드 1건당 평균 분석 비용</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">영업 전환율 (ROI)</span>
                        <span className="text-lg font-black text-emerald-500">{roiStats.conversionRate}%</span>
                        <span className="text-[9px] text-slate-400 block font-semibold">전체 {roiStats.totalLeads}건 중 {roiStats.completedLeads}건 완료</span>
                      </div>
                    </div>
                  )}

                  {/* 4. Low Credit Alerts Config Card */}
                  {currentUser.role === 'agency' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-left space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-white">🚨 크레딧 소진 경보 및 알림 설정</h3>
                        <p className="text-xs text-slate-450 font-medium">크레딧이 부족할 경우 알림을 받을 경고 기준 액수와 휴대폰 번호를 구성합니다.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 block uppercase">경고 기준 잔액 (크레딧)</label>
                          <input
                            type="number"
                            value={alertThreshold}
                            onChange={(e) => setAlertThreshold(Number(e.target.value))}
                            placeholder="예: 2000"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 block uppercase">알림 수신 연락처</label>
                          <input
                            type="text"
                            value={alertPhone}
                            onChange={(e) => setAlertPhone(e.target.value)}
                            placeholder="예: 01012345678"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleSaveAlertSettings}
                        disabled={savingAlert}
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-all disabled:opacity-50"
                      >
                        {savingAlert ? '저장 중...' : '💾 경보 설정 저장'}
                      </button>
                    </div>
                  )}

                  {/* 5. Planner Quotas Card */}
                  {currentUser.role === 'agency' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-left space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-white">🛡️ 소속 설계사 월간 사용 한도 설정</h3>
                        <p className="text-xs text-slate-450 font-medium">소속 설계사의 무분별한 크레딧 남용을 방지하기 위해 개별 월간 할당량을 부여할 수 있습니다. (-1은 제한 없음)</p>
                      </div>
                      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                        <table className="w-full text-xs font-bold text-slate-300">
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
                                  <td className="py-3 px-4">{planner.name}</td>
                                  <td className="py-3 px-4 text-slate-450">{planner.phone}</td>
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
                  {(currentUser.role === 'agency' || currentUser.role === 'super') && (
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-left space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
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
                          className="bg-slate-950 border border-slate-850 rounded-xl py-3 px-4 text-xs font-bold text-slate-300 focus:outline-none w-full sm:w-44"
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
                        <table className="w-full text-xs font-bold text-slate-350">
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
                                  <td className="py-3 px-4 text-[10px] text-slate-450">
                                    {new Date(tx.created_at).toLocaleString('ko-KR')}
                                  </td>
                                  <td className="py-3 px-4">{tx.planner_name || '시스템/관리자'}</td>
                                  <td className="py-3 px-4">
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
                                  <td className="py-3 px-4 text-slate-300 font-semibold">{tx.description}</td>
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
              )
"""

# Now build the new content:
# lines before start_line (start_line-1 is lines[2472])
new_lines = lines[:start_line-1] + [replacement_content] + lines[end_line-1:]

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Replacement done successfully!")
