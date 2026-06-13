filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-3 border-orange-500 pl-2">
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
                  </div>"""

replacement = """                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-3 border-orange-500 pl-2">
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

                  {/* 설계사 안내 문구 배너 */}
                  <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-2xl text-left">
                    <p className="text-[10px] text-orange-400 font-extrabold flex items-center gap-1.5 mb-1.5">
                      <span>💡</span> 설계사 가이드 (데이터 출처 안내)
                    </p>
                    <p className="text-[10.5px] text-slate-400 font-bold leading-relaxed break-keep">
                      본 리스트의 <span className="text-white font-extrabold">보험회사, 상품명, 월 납입 보험료</span>는 한국신용정보원 본인정보 열람서비스(내보험다보여)를 통해 실시간으로 수집된 실제 가입 정보입니다. 다만, <span className="text-white font-extrabold">가입 특약 및 세부 보장 금액</span>은 AI 엔진이 표준 요율을 기반으로 역산하여 추정한 분석값이므로, 실제 가입 증권과 한도 차이가 있을 수 있습니다. 계약 체결 전 반드시 고객의 실제 증권을 다시 한번 확인하시기 바랍니다.
                    </p>
                  </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("GUIDE_ADDED_SUCCESS")
else:
    print("TARGET_NOT_FOUND")
