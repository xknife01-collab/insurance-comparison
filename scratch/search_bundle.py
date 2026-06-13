import re

bundle_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\dist\assets\index-Dzh33RV5.js"

with open(bundle_path, 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

# Let's search for keywords
keywords = [
    "소속 설계사 관리",
    "대리점 분배 정책 설정",
    "activeTab === 'planners'",
    "activeTab === \"planners\"",
    "activeTab==='planners'",
    "activeTab===\"planners\"",
    "activeTab === 'settings'",
    "activeTab === \"settings\"",
    "activeTab==='settings'",
    "activeTab===\"settings\""
]

for kw in keywords:
    matches = [m.start() for m in re.finditer(re.escape(kw), js)]
    print(f"Keyword: {repr(kw)}, matches: {len(matches)} at indices {matches}")
    for idx in matches[:2]:
        start = max(0, idx - 1000)
        end = min(len(js), idx + 2000)
        print(f"--- Context around match {idx} ---")
        print(js[start:end])
        print("---------------------------------")
