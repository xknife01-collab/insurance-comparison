file_path = r'src/App.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target_block = """              {/* 보험별 개별 분석 */}
              {(remodelingResult.analysis as any)._remodelingCoverage?.policies?.length > 0 && (
                <div className="mb-12">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4">
                      🔍 Per-Policy Individual Analysis
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">보험 1건씩 개별 정밀 분석</h3>
                    <p className="text-gray-400 font-bold italic mt-2">"가입된 보험 하나하나를 독립적으로 분석하여 중복·과납·부족을 정확히 진단합니다."</p>
                  </div>
                  <PerPolicyDashboard
                    policies={(remodelingResult.analysis as any)._remodelingCoverage.policies}
                    age={(remodelingResult.analysis as any).age || 40}
                    gender={(remodelingResult.analysis as any).gender || 'M'}
                  />
                </div>
              )}

              {/* 종합 리모델링 결과 */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] text-white mb-4">
                  📊 Comprehensive Remodeling Result
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">전체 보험 포트폴리오 종합 분석</h3>
                <p className="max-w-2xl mx-auto text-xs md:text-sm text-slate-500 font-semibold mt-3 px-4 leading-relaxed break-keep">
                  💡 본 분석은 한국신용정보원의 상품명과 월 납입 보험료 정보를 기반으로, AI가 표준 보험 요율에 맞춰 가입 특약 및 보장 금액을 정교하게 역산한 추정치입니다. 실제 가입하신 보험 증권의 세부 구성에 따라 차이가 있을 수 있으므로 정확한 진단은 전문 설계사의 정밀 상담을 권장합니다.
                </p>
              </div>
              <AnalysisDashboard result={remodelingResult} />"""

replacement_block = """              {/* 종합 리모델링 결과 */}
              <div className="text-center mb-10 mt-16">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] text-white mb-4">
                  📊 Comprehensive Remodeling Result
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">전체 보험 포트폴리오 종합 분석</h3>
                <p className="max-w-2xl mx-auto text-xs md:text-sm text-slate-500 font-semibold mt-3 px-4 leading-relaxed break-keep">
                  💡 본 분석은 한국신용정보원의 상품명과 월 납입 보험료 정보를 기반으로, AI가 표준 보험 요율에 맞춰 가입 특약 및 보장 금액을 정교하게 역산한 추정치입니다. 실제 가입하신 보험 증권의 세부 구성에 따라 차이가 있을 수 있으므로 정확한 진단은 전문 설계사의 정밀 상담을 권장합니다.
                </p>
              </div>
              <AnalysisDashboard result={remodelingResult} />

              {/* 보험별 개별 분석 */}
              {(remodelingResult.analysis as any)._remodelingCoverage?.policies?.length > 0 && (
                <div className="mb-12 mt-24">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-[0.65rem] font-black uppercase tracking-[0.3em] mb-4">
                      🔍 Per-Policy Individual Analysis
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">보험 1건씩 개별 정밀 분석</h3>
                    <p className="text-gray-400 font-bold italic mt-2">"가입된 보험 하나하나를 독립적으로 분석하여 중복·과납·부족을 정확히 진단합니다."</p>
                  </div>
                  <PerPolicyDashboard
                    policies={(remodelingResult.analysis as any)._remodelingCoverage.policies}
                    age={(remodelingResult.analysis as any).age || 40}
                    gender={(remodelingResult.analysis as any).gender || 'M'}
                  />
                </div>
              )}"""

content_normalized = content.replace('\r\n', '\n')
target_block_norm = target_block.replace('\r\n', '\n')
replacement_block_norm = replacement_block.replace('\r\n', '\n')

if target_block_norm not in content_normalized:
    print("Error: Target blocks to swap not found in App.tsx")
    exit(1)

content_new = content_normalized.replace(target_block_norm, replacement_block_norm)

if '\r\n' in content:
    content_new = content_new.replace('\n', '\r\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: App.tsx sections successfully swapped!")
