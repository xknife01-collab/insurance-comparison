import re

path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"

with open(path, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

# Fix Line 19: COMPANIES + detectType merged on one line
# Pattern: line that has COMPANIES array AND function detectType merged
content = re.sub(
    r"const COMPANIES\s*=\s*\[.*?(?=function detectType)",
    "const COMPANIES = ['DB손해보험','KB손해보험','한화손해보험','현대해상','삼성화재','메리츠화재'];\n",
    content, flags=re.DOTALL
)

# Also fix any remaining \ufffd in COMPANIES line specifically
content = content.replace("한화손해보\ufffd", "한화손해보험")

# Verify
remaining = content.count('\ufffd')
has_companies = "const COMPANIES = ['DB손해보험'" in content
has_detecttype = "function detectType(name: string)" in content

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"남은 깨진문자: {remaining}개")
print(f"COMPANIES 배열 정상: {has_companies}")
print(f"detectType 함수 정상: {has_detecttype}")
