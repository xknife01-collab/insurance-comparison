import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

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

old5 = '             </ul>\n\n             <button className="w-full bg-orange-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_-5px_rgba(255,107,0,0.5)] hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">'
new5 = '             </ul>\n' + upgrade_table.rstrip('\n') + '\n             <button className="w-full bg-orange-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_-5px_rgba(255,107,0,0.5)] hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">'

if old5 in content:
    content = content.replace(old5, new5, 1)
    print('✓ Step 5: Upgrade table added')
else:
    print('✗ Step 5 FAILED')

# Step 6: hide hybrid card when isRemodeling
old6a = '''           {/* Hybrid Type */}
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.hybrid)}'''
new6a = '''           {/* Hybrid Type */}
           {!isRemodeling && (
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.hybrid)}'''

if old6a in content:
    content = content.replace(old6a, new6a, 1)
    print('✓ Step 6a: Hybrid opening wrapped')
else:
    print('✗ Step 6a FAILED')

# Find hybrid closing
old6b = "             {result.recommendations.hybrid.switchingLossNotice}\n             </p>\n           </motion.div>\n         </div>\n       </section>"
new6b = "             {result.recommendations.hybrid.switchingLossNotice}\n             </p>\n           </motion.div>\n           )}\n         </div>\n       </section>"

if old6b in content:
    content = content.replace(old6b, new6b, 1)
    print('✓ Step 6b: Hybrid closing wrapped')
else:
    print('✗ Step 6b FAILED - searching...')
    idx = content.find('result.recommendations.hybrid.switchingLossNotice')
    if idx >= 0:
        print(repr(content[idx:idx+200]))

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Final: {len(content.splitlines())} lines')
