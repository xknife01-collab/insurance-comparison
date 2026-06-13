with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "routing" in line.lower() or "distribute" in line.lower() or "direct" in line.lower():
            print(f"Line {i+1}: {line.strip()}")
