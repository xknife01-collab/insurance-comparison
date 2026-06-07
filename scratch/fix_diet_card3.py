file_path = r'src\components\AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total lines: {len(lines)}')
print(f'Line 686 (0-idx): {repr(lines[686])}')
print(f'Line 767 (0-idx): {repr(lines[767])}')

# 0-indexed 686 ~ 767 (inclusive) = lines 687~768 (1-indexed)
# 이 범위를 새 단일 카드 블록으로 교체
start = 686
end = 767  # inclusive

new_block_lines = [
    '             <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(59,130,246,0.15)] border border-blue-100/50 flex flex-col overflow-hidden relative">\n',
    '               <div className="absolute top-0 right-0 p-8 opacity-10 rotate-45 transform">\n',
    '                 <Zap className="w-32 h-32 text-blue-500" />\n',
    '               </div>\n',
    '               {/* 아이콘 + 제목 */}\n',
    '               <div className="flex items-center gap-5 mb-6 relative z-10">\n',
    '                 <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">\n',
    '                   <Zap className="w-8 h-8 fill-current" />\n',
    '                 </div>\n',
    '                 <div>\n',
    '                   <h4 className="text-2xl font-black tracking-tighter text-blue-900">{result.recommendations.diet.title}</h4>\n',
    '                   {result.recommendations.diet.companyName && (\n',
    '                     <div className="flex flex-wrap items-center gap-y-1 mt-2">\n',
    '                       <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.diet.companyName}</span>\n',
    '                       <span className="text-xs font-bold text-slate-500 italic break-keep">{result.recommendations.diet.productName}</span>\n',
    '                     </div>\n',
    '                   )}\n',
    '                 </div>\n',
    '               </div>\n',
    '               {/* 설명 */}\n',
    '               <p className="text-sm text-gray-400 font-bold leading-relaxed mb-8 relative z-10">{result.recommendations.diet.description}</p>\n',
    '               {/* 월 예상 보험료 */}\n',
    '               <div className="mb-8 pb-8 border-b border-blue-100 relative z-10">\n',
    '                 <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">\xec\x9b\x94 \xec\x98\x88\xec\x83\x81 \xeb\xb3\xb4\xed\x97\x98\xeb\xa3\x8c</span>\n',
    '                 <div className="flex items-baseline gap-1">\n',
    '                   <span className="text-6xl font-black text-blue-600 tracking-tighter">{Math.round(result.recommendations.diet.estimatedPremium).toLocaleString()}</span>\n',
    '                   <span className="text-2xl font-black text-gray-900">\xec\x9b\x90</span>\n',
    '                 </div>\n',
    '               </div>\n',
    '               {/* 보장 내역 목록 */}\n',
    '               <ul className="space-y-5 mb-10 flex-1 relative z-10">\n',
    '                 {result.recommendations.diet.coverageChanges.map((change, i) => (\n',
    '                   <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">\n',
    '                     <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">\n',
    '                       <ShieldCheck className="w-4 h-4 text-blue-500" />\n',
    '                     </div>\n',
    '                     {change}\n',
    '                   </li>\n',
    '                 ))}\n',
    '               </ul>\n',
    '               {/* 비교 표 */}\n',
    '               <div className="bg-white rounded-3xl border border-blue-100/60 shadow-sm overflow-hidden text-left mb-6 relative z-10">\n',
    '                 <div className="grid grid-cols-12 bg-blue-50/50 px-6 py-3 text-[10px] font-black text-blue-900 uppercase tracking-widest border-b border-blue-100/30">\n',
    '                   <div className="col-span-1 text-center">\xec\x88\x9c\xec\x9c\x84</div>\n',
    '                   <div className="col-span-3">\xeb\xb3\xb4\xed\x97\x98\xec\x82\xac</div>\n',
    '                   <div className="col-span-4">\xec\x83\x81\xed\x92\x88\xeb\xaa\x85</div>\n',
    '                   <div className="col-span-4 text-right">\xec\x9b\x94 \xeb\xb3\xb4\xed\x97\x98\xeb\xa3\x8c (\xec\xa0\x88\xec\x95\xbd\xec\x95\xa1)</div>\n',
    '                 </div>\n',
    '                 <div className="divide-y divide-blue-50">\n',
    '                   {allDietOptions.slice(0, 6).map((opt: any, idx: number) => {\n',
    '                     const saving = currentPrem - opt.premium;\n',
    '                     return (\n',
    '                       <div key={idx} className="grid grid-cols-12 px-6 py-3 items-center hover:bg-blue-50/30 transition-all">\n',
    "                         <div className=\"col-span-1 text-center\">\n",
    "                           <span className={`text-xs font-black ${idx < 3 ? 'text-blue-600' : 'text-gray-300'}`}>0{idx + 1}</span>\n",
    '                         </div>\n',
    '                         <div className="col-span-3">\n',
    '                           <span className="text-sm font-black text-gray-900">{opt.companyName}</span>\n',
    '                         </div>\n',
    '                         <div className="col-span-4 text-xs font-semibold text-gray-500 truncate pr-2">\n',
    '                           {opt.productName}\n',
    '                         </div>\n',
    '                         <div className="col-span-4 text-right flex items-center justify-end gap-2">\n',
    '                           <span className="text-sm font-black text-blue-600">{opt.premium.toLocaleString()}\xec\x9b\x90</span>\n',
    '                           {saving > 0 && (\n',
    '                             <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded text-[9px] font-black whitespace-nowrap">\n',
    '                               -{Math.round(saving / 10000)}\xeb\xa7\x8c\xec\x9b\x90\n',
    '                             </span>\n',
    '                           )}\n',
    '                         </div>\n',
    '                       </div>\n',
    '                     );\n',
    '                   })}\n',
    '                 </div>\n',
    '               </div>\n',
    '               {/* 버튼 */}\n',
    '               <button className="w-full bg-white/80 text-blue-700 py-5 rounded-[2rem] font-black text-sm hover:bg-white transition-all active:scale-95 border border-blue-100 shadow-sm relative z-10">\n',
    '                 \xec\x83\x81\xec\x84\xb8 \xeb\xa6\xac\xed\x8f\xac\xed\x8a\xb8 \xeb\xb3\xb4\xea\xb8\xb0\n',
    '               </button>\n',
    '             </div>\n',
]

# lines[686] should be '           {isRemodeling ? (\n'
# lines[767] should be '           ) : (\n'
# We keep line 686 ({isRemodeling ? () and line 767 () : () as-is
# Replace lines[687:767] (0-indexed) with new_block_lines

lines[687:767] = new_block_lines

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f'Done! Total lines now: {len(lines)}')
# Verify
with open(file_path, 'r', encoding='utf-8') as f:
    verify = f.readlines()
print('Verification lines 686~695:')
for i, line in enumerate(verify[685:695], start=686):
    print(f'{i}: {repr(line[:80])}')
