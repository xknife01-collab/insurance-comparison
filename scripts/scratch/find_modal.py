with open(r"src/components/AnalysisDashboard.tsx", "r", encoding="utf-8") as f:
    for idx, line in enumerate(f, 1):
        if "modal" in line.lower() or "dialog" in line.lower():
            print(f"{idx}: {line.strip()}")
