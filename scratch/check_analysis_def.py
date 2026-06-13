with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "const AnalysisDashboard =" in line or "function AnalysisDashboard(" in line or "export default" in line:
            print(f"Line {i+1}: {line.strip()}")
