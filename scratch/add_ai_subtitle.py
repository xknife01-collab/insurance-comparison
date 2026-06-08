file_path = r'src/App.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">전체 보험 포트폴리오 종합 분석</h3>
              </div>"""

replacement = """                <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">전체 보험 포트폴리오 종합 분석</h3>
                <p className="max-w-2xl mx-auto text-xs md:text-sm text-slate-500 font-semibold mt-3 px-4 leading-relaxed break-keep">
                  💡 본 분석은 한국신용정보원의 상품명과 월 납입 보험료 정보를 기반으로, AI가 표준 보험 요율에 맞춰 가입 특약 및 보장 금액을 정교하게 역산한 추정치입니다. 실제 가입하신 보험 증권의 세부 구성에 따라 차이가 있을 수 있으므로 정확한 진단은 전문 설계사의 정밀 상담을 권장합니다.
                </p>
              </div>"""

content_normalized = content.replace('\r\n', '\n')
target_normalized = target.replace('\r\n', '\n')
replacement_normalized = replacement.replace('\r\n', '\n')

if target_normalized not in content_normalized:
    print("Error: Target heading in App.tsx not found")
    exit(1)

content_new = content_normalized.replace(target_normalized, replacement_normalized)

if '\r\n' in content:
    content_new = content_new.replace('\n', '\r\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: AI estimation subtitle added successfully below the title!")
