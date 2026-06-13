with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "agencies" in line or "대리점" in line or "super" in line:
            if "map(" in line or "list" in line or "table" in line or "card" in line:
                if i + 1 > 2000:
                    print(f"Line {i+1}: {line.strip()}")
