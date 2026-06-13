with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisSection.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i in range(79, 87):
        print(f"Line {i+1}: {repr(lines[i])}")
