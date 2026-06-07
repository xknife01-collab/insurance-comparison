import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Also fix the section title (currently says "3가지" for all, but should say "2가지" for isRemodeling)
# Find and fix the "나에게 맞는 추천 시나리오" section text
old_section_text = '''          <p className="text-gray-500 font-bold italic">"현재 상황에서 가장 합리적인 3가지 탈출 경로를 제시합니다."</p>'''
new_section_text = '''          <p className="text-gray-500 font-bold italic">{isRemodeling ? '"현재 상황에서 가장 합리적인 2가지 탈출 경로를 제시합니다."' : '"현재 상황에서 가장 합리적인 3가지 탈출 경로를 제시합니다."'}</p>'''

# Fix grid layout (isRemodeling should use max-w-4xl mx-auto for 2 cards, else 3-col grid)
old_grid = '        <div className="grid lg:grid-cols-3 gap-10 items-stretch">'
new_grid = '''        <div className={isRemodeling ? "grid lg:grid-cols-2 gap-10 items-stretch max-w-5xl mx-auto" : "grid lg:grid-cols-3 gap-10 items-stretch"}>'''

# Now find the exact diet block
start_marker = '           {/* Diet Type */}\n           <motion.div'
end_marker = '           </motion.div>\n\n           {/* Upgrade Type'
start_idx = content.find(start_marker)
end_search_from = start_idx + len(start_marker)
end_idx = content.find(end_marker, end_search_from)
end_full = end_idx + len('           </motion.div>')

old_diet_block = content[start_idx:end_full]

# New diet block: wrapped in isRemodeling conditional
# isRemodeling=true: single card (no motion), all content inside
# isRemodeling=false: original motion.div card (existing code)
new_diet_block = '''           {/* Diet Type */}
           {isRemodeling ? (
             <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(59,130,246,0.15)] border border-blue-100/50 flex flex-col overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-10 rotate-45 transform">
                 <Zap className="w-32 h-32 text-blue-500" />
               </div>
               <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-blue-200 relative z-10">
                 <Zap className="w-8 h-8 fill-current" />
               </div>
               <h4 className="text-2xl font-black mb-1 tracking-tighter text-blue-900 relative z-10">{result.recommendations.diet.title}</h4>
               {result.recommendations.diet.companyName && (
                 <div className="flex flex-wrap items-center gap-y-1.5 mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                   <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.diet.companyName}</span>
                   <span className="text-xs font-bold text-slate-500 italic break-keep">{result.recommendations.diet.productName}</span>
                 </div>
               )}
               <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10 min-h-[4rem]">
                 {result.recommendations.diet.description}
               </p>
               <div className="mb-10 border-b border-blue-100 pb-10">
                 <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">{isCar ? '연 예상 보험료' : '월 예상 보험료'}</span>
                 <div className="flex items-baseline gap-1">
                   <span className="text-6xl font-black text-blue-600 tracking-tighter">{Math.round(isCar ? result.recommendations.diet.estimatedPremium * 12 : result.recommendations.diet.estimatedPremium).toLocaleString()}</span>
                   <span className="text-2xl font-black text-gray-900">원</span>
                 </div>
               </div>
               <ul className="space-y-6 flex-1 mb-12">
                 {result.recommendations.diet.coverageChanges.map((change, i) => (
                   <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                     <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                       <ShieldCheck className="w-4 h-4 text-blue-500" />
                     </div>
                     {change}
                   </li>
                 ))}
               </ul>
               <button className="w-full bg-white/80 text-blue-700 py-6 rounded-[2rem] font-black text-sm hover:bg-white transition-all active:scale-95 border border-blue-100 shadow-sm">
                 상세 리포트 보기
               </button>
               <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
                 {result.recommendations.diet.switchingLossNotice}
               </p>
             </div>
           ) : (
             <motion.div 
               whileHover={{ y: -15, scale: 1.01 }}
               onClick={() => setSelectedPlan(result.recommendations.diet)}
               className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(59,130,246,0.15)] border border-blue-100/50 flex flex-col group transition-all cursor-pointer overflow-hidden relative"
             >
               <div className="absolute top-0 right-0 p-8 opacity-10 rotate-45 transform">
                 <Zap className="w-32 h-32 text-blue-500" />
               </div>
               <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-blue-200 group-hover:rotate-[360deg] transition-transform duration-1000 relative z-10">
                 <Zap className="w-8 h-8 fill-current" />
               </div>
               <h4 className="text-2xl font-black mb-1 tracking-tighter text-blue-900 group-hover:text-blue-600 transition-colors uppercase relative z-10">{result.recommendations.diet.title}</h4>
               {result.recommendations.diet.companyName && (
                 <div className="flex flex-wrap items-center gap-y-1.5 mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                   <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.diet.companyName}</span>
                   <span className="text-xs font-bold text-slate-500 italic break-keep">{result.recommendations.diet.productName}</span>
                 </div>
               )}
               <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10 min-h-[4rem]">
                 {result.recommendations.diet.description}
               </p>
               <div className="mb-10 border-b border-gray-50 pb-10">
                 <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">{isCar ? '연 예상 보험료' : '월 예상 보험료'}</span>
                 <div className="flex items-baseline gap-1">
                   <span className="text-6xl font-black text-blue-600 tracking-tighter">{Math.round(isCar ? result.recommendations.diet.estimatedPremium * 12 : result.recommendations.diet.estimatedPremium).toLocaleString()}</span>
                   <span className="text-2xl font-black text-gray-900">원</span>
                 </div>
                 {result.recommendations.diet.isFire && (
                   <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 text-[11px] font-bold text-blue-800 space-y-1">
                     <div className="flex justify-between">
                       <span>보장 보험료 (소멸성):</span>
                       <span>{(result.recommendations.diet as any).riskPremium?.toLocaleString()}원</span>
                     </div>
                     <div className="flex justify-between text-emerald-600">
                       <span>적립 보험료 (환급형):</span>
                       <span>{(result.recommendations.diet as any).savingsPremium?.toLocaleString()}원</span>
                     </div>
                   </div>
                 )}
               </div>
               <ul className="space-y-6 flex-1 mb-12">
                 {result.recommendations.diet.coverageChanges.map((change, i) => (
                   <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                     <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                       <ShieldCheck className="w-4 h-4 text-blue-500" />
                     </div>
                     {change}
                   </li>
                 ))}
               </ul>
               <button className="w-full bg-gray-50 text-gray-400 py-6 rounded-[2rem] font-black text-sm hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 border border-transparent hover:border-gray-200">
                 상세 리포트 보기
               </button>
               <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
                 {result.recommendations.diet.switchingLossNotice}
               </p>
             </motion.div>
           )}'''

# Apply changes
new_content = content.replace(old_diet_block, new_diet_block, 1)
if old_section_text in new_content:
    new_content = new_content.replace(old_section_text, new_section_text, 1)
    print('Section text updated')
else:
    print('WARNING: section text not found')
if old_grid in new_content:
    new_content = new_content.replace(old_grid, new_grid, 1)
    print('Grid layout updated')
else:
    print('WARNING: grid not found')

if new_content == content:
    print('ERROR: No changes made!')
else:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'SUCCESS: File updated. Old diet block ({len(old_diet_block)} chars) -> New ({len(new_diet_block)} chars)')
