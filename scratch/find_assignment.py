with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "assign" in line.lower() or "배정" in line or "담당" in line:
            print(f"Line {i+1}: {line.strip()}")
