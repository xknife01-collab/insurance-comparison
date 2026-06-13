import sys
sys.stdout.reconfigure(encoding='utf-8')
with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\InsuranceCalculator.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "상세타입" in line or "선택해 보세요" in line or "선택해보세요" in line:
            print(f"Line {i+1}: {line.strip()}")
