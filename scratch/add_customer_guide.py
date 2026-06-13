filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\App.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                    </div>
                    
                    {/* Policy Cards */}"""

# Let's check if there are multiple occurrences or different indentation.
# In view_file we saw:
# 1002:                       </div>
# 1003:                     </div>
# 1004: 
# 1005:                     {/* Policy Cards */}

target_exact = """                    </div>
                  </div>

                  {/* Policy Cards */}"""

# Let's inspect the exact lines around 1000-1007 using a more specific target
target_find = """                      <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-6 self-start md:self-auto shrink-0">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 block uppercase">총 가입 건수</span>
                          <span className="text-xl font-black text-slate-800">{coverage.policies.length}건</span>
                        </div>
                        <div className="h-8 w-px bg-slate-100" />
                        <div>
                          <span className="text-[10px] font-black text-slate-400 block uppercase">월 총 납입료</span>
                          <span className="text-xl font-black text-orange-600">{totalPremium.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>

                    {/* Policy Cards */}"""

replacement = """                      <div className="bg-white border border-slate-100 px-6 py-4 rounded-2xl shadow-sm flex items-center gap-6 self-start md:self-auto shrink-0">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 block uppercase">총 가입 건수</span>
                          <span className="text-xl font-black text-slate-800">{coverage.policies.length}건</span>
                        </div>
                        <div className="h-8 w-px bg-slate-100" />
                        <div>
                          <span className="text-[10px] font-black text-slate-400 block uppercase">월 총 납입료</span>
                          <span className="text-xl font-black text-orange-600">{totalPremium.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>

                    {/* 고객 안내 사항 배너 */}
                    <div className="bg-orange-50/50 border border-orange-100/60 p-5 rounded-2xl text-left">
                      <p className="text-xs text-orange-600 font-extrabold flex items-center gap-1.5 mb-1.5">
                        <span>💡</span> 고객 안내 사항 (데이터 출처 안내)
                      </p>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed break-keep">
                        본 리스트의 <span className="text-slate-800 font-extrabold">보험 회사, 상품명, 월 납입 보험료</span>는 한국신용정보원 본인정보 열람서비스(내보험다보여)를 통해 실시간으로 수집된 실제 가입 정보입니다. 다만, <span className="text-slate-800 font-extrabold">가입 특약 및 세부 보장 금액</span>은 AI 엔진이 표준 요율을 기반으로 역산하여 추정한 분석값이므로, 실제 가입 증권과 차이가 있을 수 있습니다. 계약 체결 전 반드시 고객의 실제 증권을 다시 한번 확인하시기 바랍니다.
                      </p>
                    </div>

                    {/* Policy Cards */}"""

if target_find in content:
    content = content.replace(target_find, replacement)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("CUSTOMER_GUIDE_ADDED_SUCCESS")
else:
    # Try normalizing newlines
    normalized_content = content.replace('\r\n', '\n')
    normalized_target = target_find.replace('\r\n', '\n')
    if normalized_target in normalized_content:
        normalized_content = normalized_content.replace(normalized_target, replacement.replace('\r\n', '\n'))
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(normalized_content)
        print("CUSTOMER_GUIDE_ADDED_SUCCESS_NORMALIZED")
    else:
        print("TARGET_NOT_FOUND")
