import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "remodeling" in line or "다이어트" in line or "비교분석" in line or "filter" in line or "mask" in line or "maskPhone" in line or "phone" in line:
        print(f"Line {idx+1}: {line.strip()}")
