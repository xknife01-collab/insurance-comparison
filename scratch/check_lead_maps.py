with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "getFilteredAnalysisLeads" in line or "getFilteredConsultLeads" in line:
        if ".map" in line or "map" in lines[i+1]:
            print(f"Line {i+1}: {line.strip()}")
            print(f"Line {i+2}: {lines[i+1].strip()}")
