file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 현재 isRemodeling diet 블록 전체를 찾아서 새로운 단일 카드 구조로 교체
old_block = '''              <div className="space-y-8">
                {/* 카드 밖 - 제목/설명 */}
                <div>
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
                      <Zap className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black tracking-tighter text-blue-900">{result.recommendations.diet.title}</h4>
                      {result.recommendations.diet.companyName && (
                        <div className="flex flex-wrap items-center gap-y-1 mt-2">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.diet.companyName}</span>
                          <span className="text-xs font-bold text-slate-500 italic break-keep">{result.recommendations.diet.productName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 font-bold leading-relaxed mb-6">{result.recommendations.diet.description}</p>
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-2">월 예상 보험료</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-blue-600 tracking-tighter">{Math.round(result.recommendations.diet.estimatedPremium).toLocaleString()}</span>
                      <span className="text-2xl font-black text-gray-900">원</span>
                    </div>
                  </div>
                </div>
                {/* 카드 안 - 비교 표만 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-[4rem] border border-blue-100/50 shadow-[0_30px_80px_-15px_rgba(59,130,246,0.15)] overflow-hidden">
                  <div className="bg-white m-5 rounded-3xl border border-blue-100/60 shadow-sm overflow-hidden text-left">
                    <div className="grid grid-cols-12 bg-blue-50/50 px-8 py-4 text-[10px] font-black text-blue-900 uppercase tracking-widest border-b border-blue-100/30">
                      <div className="col-span-1 text-center">순위</div>
                      <div className="col-span-3">보험사</div>
                      <div className="col-span-4">상품명</div>
                      <div className="col-span-4 text-right">월 예상 보험료 (절약액)</div>
                    </div>
                    <div className="divide-y divide-blue-50">
                      {allDietOptions.slice(0, 6).map((opt: any, idx: number) => {
                        const saving = currentPrem - opt.premium;
                        return (
                          <div key={idx} className="grid grid-cols-12 px-8 py-4 items-center hover:bg-blue-50/30 transition-all">
                            <div className="col-span-1 text-center">
                              <span className={`text-xs font-black ${idx < 3 ? 'text-blue-600' : 'text-gray-300'}`}>0{idx + 1}</span>
                            </div>
                            <div className="col-span-3">
                              <span className="text-sm font-black text-gray-900">{opt.companyName}</span>
                            </div>
                            <div className="col-span-4 text-xs font-semibold text-gray-500 truncate pr-2">
                              {opt.productName}
                            </div>
                            <div className="col-span-4 text-right flex items-center justify-end gap-2">
                              <span className="text-sm font-black text-blue-600">{opt.premium.toLocaleString()}원</span>
                              {saving > 0 && (
                                <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded text-[9px] font-black whitespace-nowrap">
                                  -{Math.round(saving / 10000)}만원
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="px-8 pt-6">
                    <ul className="space-y-3 mb-4">
                      {result.recommendations.diet.coverageChanges.map((change, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                          </div>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-8 pb-8">
                    <button className="w-full bg-white/80 text-blue-700 py-5 rounded-[2rem] font-black text-sm hover:bg-white transition-all active:scale-95 border border-blue-100 shadow-sm">
                      상세 리포트 보기
                    </button>
                  </div>
                </div>
              </div>'''

new_block = '''              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(59,130,246,0.15)] border border-blue-100/50 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-45 transform">
                  <Zap className="w-32 h-32 text-blue-500" />
                </div>
                {/* 아이콘 + 제목 */}
                <div className="flex items-center gap-5 mb-6 relative z-10">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
                    <Zap className="w-8 h-8 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black tracking-tighter text-blue-900">{result.recommendations.diet.title}</h4>
                    {result.recommendations.diet.companyName && (
                      <div className="flex flex-wrap items-center gap-y-1 mt-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.diet.companyName}</span>
                        <span className="text-xs font-bold text-slate-500 italic break-keep">{result.recommendations.diet.productName}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* 설명 */}
                <p className="text-sm text-gray-400 font-bold leading-relaxed mb-8 relative z-10">{result.recommendations.diet.description}</p>
                {/* 월 예상 보험료 */}
                <div className="mb-8 pb-8 border-b border-blue-100 relative z-10">
                  <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">월 예상 보험료</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-blue-600 tracking-tighter">{Math.round(result.recommendations.diet.estimatedPremium).toLocaleString()}</span>
                    <span className="text-2xl font-black text-gray-900">원</span>
                  </div>
                </div>
                {/* 보장 내역 목록 */}
                <ul className="space-y-5 mb-10 flex-1 relative z-10">
                  {result.recommendations.diet.coverageChanges.map((change, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                      </div>
                      {change}
                    </li>
                  ))}
                </ul>
                {/* 비교 표 */}
                <div className="bg-white rounded-3xl border border-blue-100/60 shadow-sm overflow-hidden text-left mb-6 relative z-10">
                  <div className="grid grid-cols-12 bg-blue-50/50 px-6 py-3 text-[10px] font-black text-blue-900 uppercase tracking-widest border-b border-blue-100/30">
                    <div className="col-span-1 text-center">순위</div>
                    <div className="col-span-3">보험사</div>
                    <div className="col-span-4">상품명</div>
                    <div className="col-span-4 text-right">월 보험료 (절약액)</div>
                  </div>
                  <div className="divide-y divide-blue-50">
                    {allDietOptions.slice(0, 6).map((opt: any, idx: number) => {
                      const saving = currentPrem - opt.premium;
                      return (
                        <div key={idx} className="grid grid-cols-12 px-6 py-3 items-center hover:bg-blue-50/30 transition-all">
                          <div className="col-span-1 text-center">
                            <span className={`text-xs font-black ${idx < 3 ? 'text-blue-600' : 'text-gray-300'}`}>0{idx + 1}</span>
                          </div>
                          <div className="col-span-3">
                            <span className="text-sm font-black text-gray-900">{opt.companyName}</span>
                          </div>
                          <div className="col-span-4 text-xs font-semibold text-gray-500 truncate pr-2">
                            {opt.productName}
                          </div>
                          <div className="col-span-4 text-right flex items-center justify-end gap-2">
                            <span className="text-sm font-black text-blue-600">{opt.premium.toLocaleString()}원</span>
                            {saving > 0 && (
                              <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded text-[9px] font-black whitespace-nowrap">
                                -{Math.round(saving / 10000)}만원
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* 버튼 */}
                <button className="w-full bg-white/80 text-blue-700 py-5 rounded-[2rem] font-black text-sm hover:bg-white transition-all active:scale-95 border border-blue-100 shadow-sm relative z-10">
                  상세 리포트 보기
                </button>
              </div>'''

if old_block in content:
    new_content = content.replace(old_block, new_block, 1)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS: Diet card restructured into single card.')
else:
    print('ERROR: Old block not found. Printing first 200 chars of expected block:')
    # find partial match
    idx = content.find('space-y-8')
    print(f'space-y-8 found at index: {idx}')
    print(repr(content[idx:idx+200]))
