import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "leadsCategoryFilter" in line or "Tab" in line or "Filter" in line:
        if idx > 2800 and idx < 3050:
            print(f"Line {idx+1}: {line.strip()}")
