import re

path = r"src/components/insurance/remodeling/PerPolicyDashboard.tsx"

with open(path, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

U = "\ufffd"

# Step 1: Line 19 - COMPANIES 배열 + detectType 분리
content = re.sub(
    r"const COMPANIES\s*=\s*\[.*?\];\s*(?=function detectType)",
    "const COMPANIES = ['DB손해보험','KB손해보험','한화손해보험','현대해상','삼성화재','메리츠화재'];\n",
    content, flags=re.DOTALL
)

# Step 2: typeLabel 교체
tl = [
    (f"silson: '{U}+료{U}+비',", "silson: '실손의료비',"),
    (f"pre_existing: '{U}+병{U}+보{U}+',", "pre_existing: '유병자보험',"),
    (f"cancer: '{U}+보{U}+',", "cancer: '암보험',"),
    (f"brain: '{U}+혈관보험',", "brain: '뇌혈관보험',"),
    (f"heart: '{U}+장질환보험',", "heart: '심장질환보험',"),
    (f"accident: '{U}+해보험',", "accident: '상해보험',"),
    (f"nursing: '{U}+양/{U}+설보험',", "nursing: '요양/시설보험',"),
    (f"child: '{U}+린{U}+/{U}+아보{U}+',", "child: '어린이/태아보험',"),
    (f"car: '{U}+동{U}+ 보험',", "car: '자동차 보험',"),
    (f"driver: '{U}+전{U}+ 보험',", "driver: '운전자 보험',"),
    (f"pet: '{U}+ 보험',", "pet: '펫 보험',"),
    (f"golf: '골프 / {U}+저보험',", "golf: '골프 / 레저보험',"),
    (f"annuity: '{U}+금{U}+축보{U}+',", "annuity: '연금저축보험',"),
    (f"variable: '변{U}+ {U}+기보험',", "variable: '변액 정기보험',"),
    (f"legal: '{U}+사/{U}+사보험',", "legal: '민사/형사보험',"),
    (f"savings: '{U}+반 {U}+축보{U}+',", "savings: '일반 저축보험',"),
]
for pat, repl in tl:
    content = re.sub(pat, repl, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

remaining = content.count(U)
print(f"Step1 완료. 남은 깨진 문자: {remaining}개")
