import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "from('planners')" in line or "from('agencies')" in line:
        print(f"--- Line {idx+1} ---")
        for j in range(max(0, idx - 5), min(len(lines), idx + 15)):
            print(f"{j+1}: {lines[j].rstrip()}")
