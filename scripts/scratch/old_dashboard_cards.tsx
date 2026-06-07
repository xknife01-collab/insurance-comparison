      <section className="space-y-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
            <Target size={14} className="fill-current text-orange-500" /> Optimized Protection Strategies
          </div>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">나에게 맞는 추천 시나리오</h3>
          <p className="text-gray-500 font-bold italic">"현재 상황에서 가장 합리적인 3가지 탈출 경로를 제시합니다."</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-stretch">
           {/* Diet Type */}
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
              <h4 className="text-2xl font-black mb-1 tracking-tighter text-blue-900 group-hover:text-blue-600 transition-colors uppercase">{result.recommendations.diet.title}</h4>
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

           {/* Upgrade Type (The "Main" Recommendation) */}
           <motion.div 
             whileHover={{ y: -20, scale: 1.02 }}
             onClick={() => setSelectedPlan(result.recommendations.upgrade)}
             className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] flex flex-col relative z-10 border-2 border-slate-800 cursor-pointer"
           >
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-10 py-3 rounded-full font-black text-[0.7rem] shadow-2xl uppercase tracking-[0.2em] whitespace-nowrap">
                가장 많이 추천하는 플랜
             </div>
             <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center mb-10 shadow-[0_15px_30px_-5px_rgba(255,107,0,0.5)] animate-pulse">
               <Zap className="w-8 h-8 fill-current" />
             </div>
              <h4 className="text-2xl font-black mb-1 tracking-tighter text-orange-400 uppercase">{result.recommendations.upgrade.title}</h4>
              {result.recommendations.upgrade.companyName && (
                <div className="flex flex-wrap items-center gap-y-1.5 mb-4 animate-in fade-in slide-in-from-left-2 transition-all">
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.upgrade.companyName}</span>
                  <span className="text-xs font-bold text-slate-400 italic break-keep">{result.recommendations.upgrade.productName}</span>
                </div>
              )}
              <p className="text-sm text-slate-400 font-bold leading-relaxed mb-10 min-h-[4rem]">
                {result.recommendations.upgrade.description}
              </p>

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
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-orange-500" />
                    </div>
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-orange-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_-5px_rgba(255,107,0,0.5)] hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-slate-500 mt-6 leading-tight font-bold text-center opacity-40">
               {result.recommendations.upgrade.switchingLossNotice}
             </p>
           </motion.div>

           {/* Hybrid Type */}
           <motion.div 
             whileHover={{ y: -15, scale: 1.01 }}
             onClick={() => setSelectedPlan(result.recommendations.hybrid)}
             className="bg-gradient-to-br from-violet-50 to-purple-50/50 p-12 rounded-[4rem] shadow-[0_30px_80px_-15px_rgba(139,92,246,0.15)] border border-purple-100/50 flex flex-col group transition-all cursor-pointer overflow-hidden relative"
           >
             <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 transform">
               <Target className="w-32 h-32 text-purple-500" />
             </div>
             <div className="w-16 h-16 bg-violet-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-purple-200 group-hover:rotate-[-360deg] transition-transform duration-1000 relative z-10">
               <Zap className="w-8 h-8 fill-current" />
             </div>
              <h4 className="text-2xl font-black mb-1 tracking-tighter text-purple-900 relative z-10 uppercase">{result.recommendations.hybrid.title}</h4>
              {result.recommendations.hybrid.companyName && (
                <div className="flex flex-wrap items-center gap-y-1.5 mb-4 animate-in fade-in slide-in-from-left-2 transition-all relative z-10">
                  <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 rounded-lg text-[0.6rem] font-black mr-2 uppercase tracking-widest">{result.recommendations.hybrid.companyName}</span>
                  <span className="text-xs font-bold text-purple-400 italic break-keep">{result.recommendations.hybrid.productName}</span>
                </div>
              )}
              <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10 min-h-[4rem] relative z-10">
                {result.recommendations.hybrid.description}
              </p>

             <div className="mb-10 border-b border-gray-50 pb-10">
                <span className="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest block mb-3">{isCar ? '연 예상 보험료' : '월 예상 보험료'}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">{Math.round(isCar ? result.recommendations.hybrid.estimatedPremium * 12 : result.recommendations.hybrid.estimatedPremium).toLocaleString()}</span>
                  <span className="text-2xl font-black text-gray-900">원</span>
                </div>
                {result.recommendations.hybrid.isFire && (
                  <div className="mt-4 p-3 bg-purple-50/50 rounded-xl border border-purple-100/50 text-[11px] font-bold text-purple-800 space-y-1">
                    <div className="flex justify-between">
                      <span>보장 보험료 (소멸성):</span>
                      <span>{(result.recommendations.hybrid as any).riskPremium?.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>적립 보험료 (환급형):</span>
                      <span>{(result.recommendations.hybrid as any).savingsPremium?.toLocaleString()}원</span>
                    </div>
                  </div>
                )}
             </div>

             <ul className="space-y-6 flex-1 mb-12">
               {result.recommendations.hybrid.coverageChanges.map((change, i) => (
                 <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-slate-300" />
                    </div>
                    {change}
                 </li>
               ))}
             </ul>

             <button className="w-full bg-gray-50 text-gray-400 py-6 rounded-[2rem] font-black text-sm hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 border border-transparent hover:border-gray-200">
               상세 리포트 보기
             </button>
             <p className="text-[0.6rem] text-gray-300 mt-6 leading-tight font-bold text-center opacity-60">
               {result.recommendations.hybrid.switchingLossNotice}
             </p>
           </motion.div>
        </div>
      </section>

      {/* 4. Full Market Analysis Section */}
      <section className="space-y-16 pb-32">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] shadow-xl">
            <Heart size={14} className="fill-current text-emerald-400" /> Whole Market Comparison
          </div>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter">전 보험사 실시간 보험료 비교</h3>
          <p className="text-gray-500 font-bold italic">"대한민국 모든 보험사의 DB를 전수 조사한 결과입니다."</p>
        </div>

        {(result.recommendations.diet.isFire || isProperty) && (
          <div className="p-6 bg-orange-50/80 rounded-2xl border border-orange-100 flex items-start gap-4 max-w-2xl mx-auto text-left shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-2xl mt-0.5">💡</span>
            <div className="space-y-1">
              <h5 className="text-sm font-black text-orange-950">{isProperty ? '재물종합보험 자산 보호 및 실손 보상 안내' : '화재보험 의무 최저보험료(10,000원) 안내'}</h5>
              <p className="text-xs font-bold text-orange-800 leading-relaxed">
                {isProperty ? (
                  '재물종합보험/화재보험은 건물의 실제 가치 대비 가입 한도가 부족하면 비례보상이 적용되어 손해액의 일부만 지급받게 됩니다. 따라서 실손보상 특약을 탑재하거나 자산 가치를 정확히 평가해 가입해야 안전합니다. 또한 다중이용업소의 경우 화재배상책임이 의무적으로 가입되어야 합니다.'
                ) : (
                  '주택화재보험은 금융 규정상 월 최소 납입 보험료가 10,000원으로 고정되어 있습니다. 보장 한도 대비 계산된 실제 화재 보장비(소멸성)를 제외한 차액은 만기 시 돌려받을 수 있는 \'적립 보험료(환급형)\'로 자동 적립되어 안전하게 보관됩니다.'