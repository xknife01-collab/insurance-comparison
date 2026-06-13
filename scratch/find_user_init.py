with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "currentUser" in line or "agencyId" in line:
            if "state" in line.lower() or "set" in line.lower() or "const" in line.lower() or "user" in line.lower():
                print(f"Line {i+1}: {line.strip()}")
