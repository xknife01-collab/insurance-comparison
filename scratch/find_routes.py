with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\App.tsx", "r", encoding="utf-8") as f:
    for line in f:
        if "admin" in line.lower() or "route" in line.lower():
            print(line.strip())
