import re

file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate the Upgrade Type block (11 spaces indentation)
start_marker = '           {/* Upgrade Type (The "Main" Recommendation) */}'
end_marker = '           {/* Hybrid Type */}'

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Error: Upgrade start marker not found")
    exit(1)

end_idx = content.find(end_marker, start_idx)
if end_idx == -1:
    print("Error: Hybrid end marker not found")
    exit(1)

# Verify what we are replacing
print(f"Start index: {start_idx}, End index: {end_idx}")

# Construct the new motion.div block for Upgrade
new_upgrade_block = """           {/* Upgrade Type (The "Main" Recommendation) */}
           <motion.div 
             whileHover={{ y: -20, scale: 1.02 }}
             onClick={() => setSelectedPlan(result.recommendations.upgrade)}
             className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] flex flex-col relative z-10 border-2 border-slate-800 cursor-pointer"
           >
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-10 py-3 rounded-full font-black text-[0.7rem] shadow-2xl uppercase tracking-[0.2em] whitespace-nowrap">
                가장 많이 추천하는 플랜
             </div>
             {/* Upgrade 카드 헤더 — 리모델링 vs 일반 */}
             {isRemodeling ? (() => {
               const policies: any[] = (analysis as any)._remodelingCoverage?.policies || [];
               const totalCurrent = policies.reduce((s: number, p: any) => s + p.monthly_premium, 0);

               const UPCO = ['DB손해보험','KB손해보험','한화손해보험','현대해상','삼성화재','메리츠화재'];
               const rows = policies.map((p: any, i: number) => {
                 const isDriver = p.product_name.includes('운전자');
                 const isWhole = p.product_name.includes('종신');
                 const company = UPCO[i % UPCO.length];
                 const prodType = isWhole ? '무배당 VIP 종신 업그레이드 보험'
                   : isDriver ? '무배당 VIP 운전자 업그레이드 보험'
                   : '무배당 VIP 마스터 업그레이드 건강보험';
                 const cancerBonus = isWhole || isDriver ? 0 : [2000,1800,1600,1400,1200,1000][i % 6] * 10000;
                 const brainBonus  = isWhole || isDriver ? 0 : [1000,900,800,700,600,500][i % 6] * 10000;
                 const heartBonus  = isWhole || isDriver ? 0 : [1000,900,800,700,600,500][i % 6] * 10000;
                 return { orig: p, company, prodType, cancerBonus, brainBonus, heartBonus };
               });

               return (
                 <>
                   <div className="flex items-center gap-3 mb-6 relative z-10">
                     <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-orange-200 animate-pulse">
                       <Zap className="w-8 h-8 fill-current" />
                     </div>
                     <div>
                       <h4 className="text-xl font-black tracking-tighter text-orange-400 uppercase">7개 보험 동시 업그레이드</h4>
                       <p className="text-sm text-slate-400 font-bold">보험료는 그대로 · 보장만 더 든든하게</p>
                     </div>
                   </div>

                   <div className="flex items-center gap-3 mb-8 bg-white/10 rounded-2xl p-5 border border-white/10 relative z-10">
                     <div className="flex-1 text-center">
                       <span className="text-[9px] font-black text-slate-400 block uppercase mb-1">현재 월 납입 합계</span>
                       <span className="text-2xl font-black text-slate-300">{totalCurrent.toLocaleString()}</span>
                       <span className="text-xs font-black text-slate-400">원</span>
                     </div>
                     <div className="flex flex-col items-center gap-1 flex-shrink-0">
                       <span className="text-orange-400 text-[9px] font-black bg-orange-500/20 border border-orange-500/30 rounded-full px-2 py-0.5">동일 유지</span>
                       <span className="text-2xl text-orange-400 font-black">→</span>
                     </div>
                     <div className="flex-1 text-center">
                       <span className="text-[9px] font-black text-orange-300 block uppercase mb-1">보장 강화 후</span>
                       <span className="text-2xl font-black text-orange-400">{totalCurrent.toLocaleString()}</span>
                       <span className="text-xs font-black text-orange-300">원</span>
                     </div>
                   </div>

                   <ul className="space-y-3 mb-10 relative z-10">
                     <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                       <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-orange-400" /></div>
                       종신보험 — 사망 1억 보장 동일 유지
                     </li>
                     <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                       <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-orange-400" /></div>
                       운전자보험 — 형사합의·벌금·변호사 보장 동일 유지
                     </li>
                     <li className="flex items-center gap-3 text-sm font-bold text-slate-300">
                       <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-orange-400" /></div>
                       종합건강보험 — 암·뇌혈관·심장 진단비 보장 동일 유지
                     </li>
                   </ul>

                   {/* Per-policy upgrade comparison list */}
                   <div className="mb-12 space-y-3 text-left">
                     {rows.map((r, i) => {
                       return (
                         <div key={i} className="flex items-center gap-2">
                           {/* 기존 보험 */}
                           <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                             <span className="text-[8px] font-black text-red-400 block uppercase mb-0.5">❌ 기존 보험</span>
                             <span className="text-[9px] font-black text-slate-400 block">{r.orig.insurance_company}</span>
                             <span className="text-xs font-bold text-slate-300 leading-snug line-clamp-2">{r.orig.product_name.split('(')[0].trim()}</span>
                             <span className="text-sm font-black text-slate-400 mt-1 block">{r.orig.monthly_premium.toLocaleString()}원</span>
                           </div>

                           {/* 보강 표시 */}
                           <div className="flex flex-col items-center gap-1 flex-shrink-0 w-20 text-center">
                             {r.cancerBonus > 0 ? (
                               <span className="text-[8px] font-black text-orange-300 bg-orange-500/20 border border-orange-500/30 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                                 암 +{(r.cancerBonus/10000).toLocaleString()}만
                               </span>
                             ) : (
                               <span className="text-[8px] font-black text-slate-400 bg-white/5 border border-white/10 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                                 동일 유지
                               </span>
                             )}
                             <span className="text-2xl text-orange-400">→</span>
                           </div>

                           {/* 업그레이드 보험 */}
                           <div className="flex-1 bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-3">
                             <span className="text-[8px] font-black text-orange-400 block uppercase mb-0.5">🚀 업그레이드</span>
                             <span className="text-[9px] font-black text-orange-300 block">{r.company}</span>
                             <span className="text-xs font-bold text-white leading-snug">{r.prodType}</span>
                             <span className="text-sm font-black text-orange-400 mt-1 block">{r.orig.monthly_premium.toLocaleString()}원</span>
                           </div>
                         </div>
                       );
                     })}

                     {/* Total */}
                     <div className="bg-orange-600 rounded-2xl px-6 py-4 flex items-center justify-between text-white mt-2">
                       <div>
                         <span className="text-[9px] font-black text-orange-200 block uppercase">7개 전체 업그레이드 후</span>
                         <span className="text-lg font-black">{totalCurrent.toLocaleString()}원/월</span>
                       </div>
                       <div className="text-center">
                         <span className="text-2xl">→</span>
                       </div>
                       <div className="text-right">
                         <span className="text-[9px] font-black text-orange-200 block uppercase">월 납입액</span>
                         <span className="text-2xl font-black text-white">{totalCurrent.toLocaleString()}원</span>
                       </div>
                     </div>

                     {/* Upgraded Coverage Summary Grid */}
                     <div className="grid grid-cols-3 gap-3">
                       <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                         <span className="text-[9px] font-black text-orange-300 block uppercase">암진단비 추가</span>
                         <span className="text-lg font-black text-orange-400">최대 +2,000만원</span>
                       </div>
                       <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                         <span className="text-[9px] font-black text-orange-300 block uppercase">뇌혈관 추가</span>
                         <span className="text-lg font-black text-orange-400">최대 +1,000만원</span>
                       </div>
                       <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
                         <span className="text-[9px] font-black text-orange-300 block uppercase">심장 추가</span>
                         <span className="text-lg font-black text-orange-400">최대 +1,000만원</span>
                       </div>
                     </div>
                   </div>
                 </>
               );
             })() : (
               <>
                 <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-10 shadow-[0_15px_30px_-5px_rgba(255,107,0,0.5)] animate-pulse"><Zap className="w-8 h-8 fill-current" /></div>
                 <h4 className="text-2xl font-black mb-1 tracking-tighter text-orange-400 uppercase">{result.recommendations.upgrade.title}</h4>
                 {result.recommendations.upgrade.companyName && (
                   <div className="flex flex-wrap items-center gap-y-1.5 mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                     <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.upgrade.companyName}</span>
                     <span className="text-xs font-bold text-slate-400 italic break-keep">{result.recommendations.upgrade.productName}</span>
                   </div>
                 )}
                 <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 min-h-[4rem]">{result.recommendations.upgrade.description}</p>
                 <div className="mb-10 border-b border-white/5 pb-10">
                   <span className="text-[0.65rem] font-black text-slate-600 uppercase tracking-widest block mb-3">{isCar ? '연 예상 보험료' : '월 예상 보험료'}</span>
                   <div className="flex items-baseline gap-1">
                     <span className="text-6xl font-black text-orange-500 tracking-tighter">{Math.round(isCar ? result.recommendations.upgrade.estimatedPremium * 12 : result.recommendations.upgrade.estimatedPremium).toLocaleString()}</span>
                     <span className="text-2xl font-black text-white">원</span>
                   </div>
                   {result.recommendations.upgrade.isFire && (
                     <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-[11px] font-bold text-slate-300 space-y-1">
                       <div className="flex justify-between">
                         <span>보장 보험료 (소멸성):</span>
                         <span>{(result.recommendations.upgrade as any).riskPremium?.toLocaleString()}원</span>
                       </div>
                       <div className="flex justify-between text-orange-400">
                         <span>적립 보험료 (환급형):</span>
                         <span>{(result.recommendations.upgrade as any).savingsPremium?.toLocaleString()}원</span>
                       </div>
                     </div>
                   )}
                 </div>
                 <ul className="space-y-6 flex-1 mb-12">
                   {result.recommendations.upgrade.coverageChanges.map((change, i) => (
                     <li key={i} className="flex items-center gap-4 text-sm font-bold">
                       <div className="w-6 h-6 rounded-full bg-orange-50/20 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-4 h-4 text-orange-500" /></div>
                       {change}
                     </li>
                   ))}
                 </ul>
               </>
             )}

             <button className="w-full bg-orange-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_-5px_rgba(255,107,0,0.5)] hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-slate-500 mt-6 leading-tight font-bold text-center opacity-40">
               {result.recommendations.upgrade.switchingLossNotice}
             </p>
           </motion.div>
"""

# Replace the block
content_new = content[:start_idx] + new_upgrade_block + content[end_idx:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: Upgrade card successfully restructured!")
