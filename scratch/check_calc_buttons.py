import sys
sys.stdout.reconfigure(encoding='utf-8')
with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\InsuranceCalculator.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "무료로" in line or "네이버로" in line or "카카오로" in line or "개인정보" in line:
            print(f"Line {i+1}: {line.strip()}")
