import sys
sys.stdout.reconfigure(encoding='utf-8')
with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "mobile" in line or "phone" in line or "연락처" in line or "RPT" in line or "RXX" in line:
            if len(line.strip()) < 120:
                print(f"Line {i+1}: {line.strip()}")
