with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()
    for i in range(1785, 1797):
        print(f"Line {i+1}: {repr(lines[i])}")
