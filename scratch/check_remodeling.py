import sys
sys.stdout.reconfigure(encoding='utf-8')
with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\InsuranceCalculator.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "정밀분석" in line or "정밀 분석" in line or "내보험" in line or "remodeling" in line:
            print(f"Line {i+1}: {line.strip()}")
