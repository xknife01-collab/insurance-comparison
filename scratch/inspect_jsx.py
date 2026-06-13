import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line_num in [421, 748, 852, 954, 1001]:
    print(f"--- Line {line_num} ---")
    for idx in range(line_num - 5, line_num + 15):
        if idx >= 0 and idx < len(lines):
            print(f"{idx+1}: {lines[idx].strip()}")
