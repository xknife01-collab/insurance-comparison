with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "URLSearchParams" in line or "location.search" in line or "params.get" in line:
            print(f"Line {i+1}: {line.strip()}")
