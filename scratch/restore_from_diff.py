import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f'Original: {len(content.splitlines())} lines')

# ── 1. Add isRemodeling + allDietOptions + allUpgradeOptions variables ──
old1 = "  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);\n\n  // --- 마법의 리모델링 머니 가이드 연산 ---"
new1 = "  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);\n  const isRemodeling = !!(analysis as any)._allDietOptions && !!(analysis as any)._allUpgradeOptions;\n  const allDietOptions = (analysis as any)._allDietOptions || [];\n  const allUpgradeOptions = (analysis as any)._allUpgradeOptions || [];\n\n  // --- 마법의 리모델링 머니 가이드 연산 ---"

if old1 in content:
    content = content.replace(old1, new1, 1)
    print('✓ Step 1: isRemodeling variables added')
else:
    print('✗ Step 1 FAILED')

# ── 2. Change "3가지" to "2가지" ──
old2 = '"현재 상황에서 가장 합리적인 3가지 탈출 경로를 제시합니다."'
new2 = '"현재 상황에서 가장 합리적인 2가지 탈출 경로를 제시합니다."'
if old2 in content:
    content = content.replace(old2, new2, 1)
    print('✓ Step 2: Section text updated')
else:
    print('✗ Step 2 FAILED')

# ── 3. Change grid from 3-col to 1-col (for isRemodeling) ──
old3 = '        <div className="grid lg:grid-cols-3 gap-10 items-stretch">'
new3 = '        <div className="grid grid-cols-1 gap-10 items-stretch max-w-4xl mx-auto">'
if old3 in content:
    content = content.replace(old3, new3, 1)
    print('✓ Step 3: Grid updated')
else:
    print('✗ Step 3 FAILED')

# ── 4. Add Diet Table Comparison inside diet card (after coverageChanges ul, before button) ──
diet_table = '''
              {/* Diet Table Comparison */}
              {isRemodeling && (
                <div className="bg-white rounded-3xl border border-blue-100/60 shadow-sm overflow-hidden mb-12 text-left">
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
                        <div key={idx} className="grid grid-cols-12 px-8 py-4 items-center hover:bg-blue-50/30 transition-all group">
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
                                -{Math.round(saving / 1000) / 10}만원
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

'''

old4 = '''             <button className="w-full bg-gray-50 text-gray-400 py-6 rounded-[2rem] font-black text-sm hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 border border-transparent hover:border-gray-200">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
               {result.recommendations.diet.switchingLossNotice}
             </p>
           </motion.div>'''

new4 = diet_table.rstrip('\n') + '\n' + old4

if old4 in content:
    content = content.replace(old4, new4, 1)
    print('✓ Step 4: Diet comparison table added')
else:
    print('✗ Step 4 FAILED - trying to find diet button...')
    idx = content.find('bg-gray-50 text-gray-400 py-6')
    print(f'Found at: {idx}')
    print(repr(content[idx-100:idx+200]))

# ── 5. Add Upgrade Table Comparison inside upgrade card (after coverageChanges ul, before button) ──
upgrade_table = '''
             {/* Upgrade Table Comparison */}
             {isRemodeling && (
               <div className="bg-white rounded-3xl border border-purple-100/60 shadow-sm overflow-hidden mb-12 text-left text-gray-900">
                 <div className="grid grid-cols-12 bg-purple-50/50 px-8 py-4 text-[10px] font-black text-purple-900 uppercase tracking-widest border-b border-purple-100/30">
                   <div className="col-span-1 text-center">순위</div>
                   <div className="col-span-3">보험사</div>
                   <div className="col-span-8 text-right">동일 예산 보장 극대화 (추가 보강 한도)</div>
                 </div>
                 <div className="divide-y divide-purple-50">
                   {allUpgradeOptions.slice(0, 6).map((opt: any, idx: number) => {
                     const hasUpgrades = opt.upgrades.addedCancer > 0 || opt.upgrades.addedBrain > 0 || opt.upgrades.addedHeart > 0;
                     return (
                       <div key={idx} className="grid grid-cols-12 px-8 py-4 items-center hover:bg-purple-50/30 transition-all group">
                         <div className="col-span-1 text-center">
                           <span className={`text-xs font-black ${idx < 3 ? 'text-purple-600' : 'text-gray-300'}`}>0{idx + 1}</span>
                         </div>
                         <div className="col-span-3">
                           <span className="text-sm font-black text-gray-900">{opt.companyName}</span>
                         </div>
                         <div className="col-span-8 flex flex-wrap lg:flex-nowrap gap-1.5 justify-end items-center">
                           {opt.upgrades.addedCancer > 0 && (
                             <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[9px] font-black whitespace-nowrap">
                               암 +{Math.round(opt.upgrades.addedCancer / 10000).toLocaleString()}만
                             </span>
                           )}
                           {opt.upgrades.addedBrain > 0 && (
                             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black whitespace-nowrap">
                               뇌 +{Math.round(opt.upgrades.addedBrain / 10000).toLocaleString()}만
                             </span>
                           )}
                           {opt.upgrades.addedHeart > 0 && (
                             <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black whitespace-nowrap">
                               심장 +{Math.round(opt.upgrades.addedHeart / 10000).toLocaleString()}만
                             </span>
                           )}
                           {!hasUpgrades && (
                             <span className="text-xs font-bold text-gray-400">기존 보장 동일 유지</span>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}

'''

old5 = '''              <button className="w-full bg-orange-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_-5px_rgba(255,107,0,0.5)] hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">
               상세 리포트 보기
              </button>'''

new5 = upgrade_table.rstrip('\n') + '\n' + old5

if old5 in content:
    content = content.replace(old5, new5, 1)
    print('✓ Step 5: Upgrade comparison table added')
else:
    print('✗ Step 5 FAILED - trying alternate...')
    idx = content.find('bg-orange-500 text-white py-6')
    print(f'Found at: {idx}')
    print(repr(content[idx-50:idx+200]))

# ── 6. Remove Hybrid card when isRemodeling ──
old6 = '''           {/* Hybrid Type */}
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.hybrid)}
             className="bg-gradient-to-br from-violet-50 to-purple-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(139,92,246,0.15)] border border-purple-100/50 flex flex-col group transition-all cursor-pointer overflow-hidden relative"
           >'''
new6 = '''           {/* Hybrid Type */}
           {!isRemodeling && (
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.hybrid)}
             className="bg-gradient-to-br from-violet-50 to-purple-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(139,92,246,0.15)] border border-purple-100/50 flex flex-col group transition-all cursor-pointer overflow-hidden relative"
           >'''
if old6 in content:
    content = content.replace(old6, new6, 1)
    # Also wrap the closing </motion.div> of hybrid
    old6b = '''             <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
               {result.recommendations.hybrid.switchingLossNotice}
             </p>
           </motion.div>
         </div>
       </section>'''
    new6b = '''             <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
               {result.recommendations.hybrid.switchingLossNotice}
             </p>
           </motion.div>
           )}
         </div>
       </section>'''
    if old6b in content:
        content = content.replace(old6b, new6b, 1)
        print('✓ Step 6: Hybrid card wrapped with !isRemodeling')
    else:
        print('✗ Step 6b FAILED (hybrid closing)')
else:
    print('✗ Step 6 FAILED (hybrid opening)')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nFinal: {len(content.splitlines())} lines')
print('DONE')
