import re

bundle_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\dist\assets\index-Dzh33RV5.js"

with open(bundle_path, 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

keywords = [
    "소속 설계사 관리",
    "대리점 분배 정책 설정"
]

with open("bundle_matches.txt", "w", encoding="utf-8") as out:
    for kw in keywords:
        matches = [m.start() for m in re.finditer(re.escape(kw), js)]
        out.write(f"Keyword: {kw}, matches: {len(matches)} at indices {matches}\n")
        for idx in matches:
            start = max(0, idx - 2000)
            end = min(len(js), idx + 8000)
            out.write(f"--- Context around match {idx} ---\n")
            out.write(js[start:end])
            out.write("\n---------------------------------\n\n")

print("Wrote bundle matches to bundle_matches.txt")
