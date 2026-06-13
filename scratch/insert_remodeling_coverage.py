filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = '            {/* Coverage details */}'

insertion = """            {/* Real-time Remodeling Active Insurance Policy List */}
            {(() => {
              const coverage = selectedLead.analysis_result?.analysis?._remodelingCoverage || 
                               selectedLead.raw_payload?.analysisInputs?._remodelingCoverage;
              if (!coverage || !coverage.policies || coverage.policies.length === 0) return null;
              
              const totalPremium = coverage.current_total_premium ||
                coverage.policies.reduce((s: number, p: any) => s + (p.monthly_premium || 0), 0);
                
              return (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-3 border-orange-500 pl-2">
                    <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                      🛡️ 실시간 조회된 나의 가입 보험 내역
                    </h4>
                    <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850 self-start sm:self-auto text-[10px] font-bold">
                      <div>
                        <span className="text-slate-500 mr-1">총 가입 건수</span>
                        <span className="text-white font-extrabold">{coverage.policies.length}건</span>
                      </div>
                      <div className="w-px h-3 bg-slate-850" />
                      <div>
                        <span className="text-slate-500 mr-1">월 총 납입료</span>
                        <span className="text-orange-400 font-extrabold">{totalPremium.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
                    {coverage.policies.map((policy: any, pIdx: number) => (
                      <div key={pIdx} className="bg-slate-950/80 border border-slate-850 rounded-2xl p-4.5 space-y-4 text-xs">
                        <div className="flex justify-between items-start gap-3">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-extrabold">
                              {policy.insurance_company}
                            </span>
                            <h5 className="font-extrabold text-white text-xs leading-normal">
                              {policy.product_name}
                            </h5>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-slate-500 text-[9px] block uppercase font-bold">월 보험료</span>
                            <span className="font-extrabold text-white text-xs">{policy.monthly_premium?.toLocaleString()}원</span>
                          </div>
                        </div>

                        {policy.riders?.length > 0 && (
                          <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-850/60 space-y-2">
                            <span className="text-slate-500 text-[9px] block uppercase font-bold">가입 특약 내역</span>
                            <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto pr-1">
                              {policy.riders.map((rider: any, rIdx: number) => (
                                <div key={rIdx} className="flex justify-between items-center text-[11px] font-bold text-slate-400 py-0.5 border-b border-dashed border-slate-900 last:border-0">
                                  <span className="truncate max-w-[180px]">{rider.rider_name}</span>
                                  <span className="text-slate-200 shrink-0 font-extrabold">
                                    {rider.coverage_amount >= 100000000
                                      ? `${(rider.coverage_amount / 100000000).toFixed(0)}억원`
                                      : `${(rider.coverage_amount / 10000).toLocaleString()}만원`}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

"""

if target in content:
    content = content.replace(target, insertion + target)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("TARGET_NOT_FOUND")
