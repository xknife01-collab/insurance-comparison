import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "const getFilteredAnalysisLeads" in line or "const getFilteredConsultLeads" in line:
        print(f"--- Line {idx+1} ---")
        for j in range(idx, idx + 45):
            if j < len(lines):
                print(f"{j+1}: {lines[j].rstrip()}")
