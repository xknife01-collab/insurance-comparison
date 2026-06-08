file_path = r'src/components/AnalysisDashboard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We can find the end of the return statement
target = """      </section>
      )}
    </div>
  );
};

export default AnalysisDashboard;"""

# Standardize to Unix line endings for replacement mapping
content_normalized = content.replace('\r\n', '\n')
target_normalized = target.replace('\r\n', '\n')

if target_normalized not in content_normalized:
    print("Error: Target closing block not found")
    # Try alternative without isRemodeling wrapping if whitespace differs
    print("Content tail:")
    print(repr(content_normalized[-100:]))
    exit(1)

replacement = """      </section>
      )}

      {/* 5. 법적 면책 고지 (Disclaimer) */}
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
      </section>
    </div>
  );
};

export default AnalysisDashboard;"""

content_new = content_normalized.replace(target_normalized, replacement)

# Restore CRLF line endings if the original file had them
if '\r\n' in content:
    content_new = content_new.replace('\n', '\r\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("SUCCESS: Legal disclaimer successfully added at the bottom of AnalysisDashboard!")
