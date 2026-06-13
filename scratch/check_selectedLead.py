import sys
sys.stdout.reconfigure(encoding='utf-8')
with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "selectedLead" in line:
            print(f"Line {i+1}: {line.strip()[:100]}")
            if i > 5000: # let's just print a few
                pass
