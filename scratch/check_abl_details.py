with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "카톡" in line or "카카오" in line:
            print(f"Line {i+1}: {line.strip()}")
