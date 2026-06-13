with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if 'placeholder="검색' in line or 'placeholder="고객' in line or 'type="text"' in line:
            print(f"Line {i+1}: {line.strip()}")
