import os

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisDashboard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

target = """      {/* 5. 법적 면책 고지 및 전문 상담 유도 (Marketing CTA Disclaimer) */}
      {isRemodeling && (
      <section className="mt-16 max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-slate-900 border-2 border-orange-500/30 rounded-[3rem] p-10 md:p-12 shadow-[0_30px_60px_-15px_rgba(255,107,0,0.15)] text-left relative overflow-hidden text-white">"""

replacement = """      {/* 5. 법적 면책 고지 및 전문 상담 유도 (Marketing CTA Disclaimer) */}
      {isRemodeling && (
      <section className="mt-16 max-w-4xl mx-auto px-4 pb-20 space-y-8">
        
        {/* 실시간 최적화 분석 카드 */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-white p-6 sm:p-8 shadow-lg border-2 border-orange-500/40 group">
          {/* Soft Warm Radial Glow */}
          <div className="absolute -inset-x-40 -inset-y-40 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08)_0,transparent_60%)] blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Real-Time Optimized Analysis</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-slate-800 text-xs sm:text-sm font-bold leading-relaxed">
                  * 본 보험료 비교 데이터는 생명보험협회 및 손해보험협회 공시자료(수집 기준: <span className="text-orange-600 font-extrabold underline decoration-orange-500/30 decoration-2 underline-offset-2">{getDisclosureDate()}</span>)를 토대로 <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded-md font-black mx-0.5">0.1초 만에</span> 실시간 최적화 분석되었습니다.
                </p>
                <p className="text-slate-500 text-[11px] sm:text-xs font-semibold leading-relaxed border-t border-orange-100 pt-2">
                  💡 <span className="text-orange-600 font-bold">다만,</span> 가입자의 개별 조건(직업, 건강 상태 등)에 따라 실제 보험료 및 가입 가능 여부는 변동될 수 있으므로, 상세한 내용은 전문 상담사와의 맞춤 설계를 통해 확인하시기 바랍니다.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 bg-gradient-to-br from-orange-500 to-amber-600 px-6 py-4 rounded-2xl shadow-md border border-orange-400/20">
              <Clock className="w-6 h-6 text-white animate-bounce" />
              <div className="text-left">
                <p className="text-[9px] font-bold text-orange-100 uppercase tracking-widest leading-none">최적화 처리속도</p>
                <p className="text-sm sm:text-base font-black text-white mt-1">0.1초 분석 완료</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border-2 border-orange-500/30 rounded-[3rem] p-10 md:p-12 shadow-[0_30px_60px_-15px_rgba(255,107,0,0.15)] text-left relative overflow-hidden text-white">"""

# Normalize newlines
target_crlf = target.replace("\n", "\r\n")
replacement_crlf = replacement.replace("\n", "\r\n")

if target_crlf in content:
    content = content.replace(target_crlf, replacement_crlf)
    print("Replaced with CRLF.")
elif target in content:
    content = content.replace(target, replacement)
    print("Replaced with LF.")
else:
    # Sequence matching
    lines_to_find = [line.strip() for line in target.splitlines() if line.strip()]
    content_lines = content.splitlines()
    
    found_idx = -1
    for idx in range(len(content_lines) - len(lines_to_find) + 1):
        match = True
        for offset, target_line in enumerate(lines_to_find):
            if content_lines[idx + offset].strip() != target_line:
                match = False
                break
        if match:
            found_idx = idx
            break
            
    if found_idx != -1:
        new_content_lines = content_lines[:found_idx] + [replacement] + content_lines[found_idx + len(lines_to_find):]
        content = "\n".join(new_content_lines)
        print(f"Replaced using sequence match at index {found_idx}.")
    else:
        print("Error: Could not locate target at all.")

with open(filepath, "w", encoding="utf-8", newline="") as f:
    f.write(content)
print("Done.")
