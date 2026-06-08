file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """      {/* 5. 법적 면책 고지 (Disclaimer) */}
      <section className="mt-16 max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-slate-50 border border-slate-200/80 rounded-[2.5rem] p-10 shadow-sm text-left relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-base">⚠️</span>
            <h4 className="text-lg font-black text-slate-800 tracking-tight">안내사항 (법적 고지)</h4>
          </div>
          <div className="space-y-4 text-xs font-semibold text-slate-500 leading-relaxed break-keep">
            <p>
              본 보장 분석 리포트는 고객님의 가입 상품명과 월 납입 보험료 정보를 기반으로 산출된 AI 분석 추정치입니다.
            </p>
            <p>
              실제 가입하신 보험 증권의 세부 약관, 가입 시점 및 개별 특약 구성에 따라 실제 보장 금액과 차이가 발생할 수 있습니다.
            </p>
            <p className="text-slate-800 font-bold">
              따라서 정확한 보장 분석 및 리모델링 설계는 반드시 <span className="text-blue-600 font-black underline">전문 설계사를 통한 증권 회수 및 정밀 분석(증권 분석)</span>을 받아보시길 적극 권장해 드립니다.
            </p>
          </div>
        </div>
      </section>"""

replacement = """      {/* 5. 법적 면책 고지 및 전문 상담 유도 (Marketing CTA Disclaimer) */}
      <section className="mt-16 max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-slate-900 border-2 border-orange-500/30 rounded-[3rem] p-10 md:p-12 shadow-[0_30px_60px_-15px_rgba(255,107,0,0.15)] text-left relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-orange-500" />
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-8 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">⚠️ AI 분석의 한계</span>
                <span className="px-3 py-1 bg-white/10 text-orange-400 rounded-lg text-[9px] font-black uppercase tracking-widest">📢 필독 안내</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mt-2">
                AI 추정치만으로는 나의 소중한 자산을 완벽히 지킬 수 없습니다.
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-sm font-semibold text-slate-300 leading-relaxed break-keep">
            <p>
              현재 화면에 표시된 리밸런싱 및 업그레이드 분석 결과는 고객님의 가입 상품명과 보험료 데이터를 기반으로 자동 산출된 <span className="text-orange-400 font-bold">AI 분석 추정치</span>입니다.
            </p>
            <p>
              실제 가입하신 보험 증권의 세부 약관, 가입 시점 및 개별 특약 구성에 따라 실제 보장 금액과 차이가 발생할 수 있으며, 자칫 중요한 보장이 누락되는 손해를 입으실 수 있습니다.
            </p>
            <p className="text-white font-bold bg-white/5 p-4 rounded-xl border border-white/5">
              안전하고 확실한 보험료 절감 및 빈틈없는 보장자산 확보를 위해, <span className="text-orange-400 font-black underline">반드시 전문 설계사를 통한 실물 증권 회수 및 정밀 분석(증권 분석)</span>을 받아보시기를 강력히 권장해 드립니다.
            </p>
          </div>

          {/* Lead Generation Button */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <div className="text-left">
              <span className="text-[10px] font-black text-orange-400 block uppercase mb-1">1:1 맞춤형 컨설팅</span>
              <span className="text-sm font-bold text-slate-300">내 증권의 숨겨진 보장 구멍, 100% 정확하게 찾아드립니다.</span>
            </div>
            <button 
              onClick={() => {
                alert('0.1초 만에 무료 정밀 증권 분석 및 1:1 상담 예약이 신청되었습니다. 담당 설계사가 곧 연락드리겠습니다.');
              }}
              className="w-full sm:w-auto px-8 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-sm hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95 shadow-[0_15px_30px_-5px_rgba(255,107,0,0.4)] whitespace-nowrap"
            >
              0.1초 만에 무료 정밀 분석 신청
            </button>
          </div>
        </div>
      </section>"""

content_normalized = content.replace('\r\n', '\n')
target_normalized = target.replace('\r\n', '\n')
replacement_normalized = replacement.replace('\r\n', '\n')

if target_normalized not in content_normalized:
    print("Error: Target disclaimer section not found")
    exit(1)

content_new = content_normalized.replace(target_normalized, replacement_normalized)

if '\r\n' in content:
    content_new = content_new.replace('\n', '\r\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: Marketing CTA disclaimer successfully applied!")
