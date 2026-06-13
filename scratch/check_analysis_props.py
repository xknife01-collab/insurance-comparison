with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "interface AnalysisDashboardProps" in line or "AnalysisDashboardProps = " in line:
            start = max(0, i - 1)
            end = min(len(f.readlines()), i + 15)
            # Re-read file to print lines
            f.seek(0)
            lines = f.readlines()
            for idx in range(start, end):
                print(f"{idx+1}: {lines[idx]}", end="")
            break
