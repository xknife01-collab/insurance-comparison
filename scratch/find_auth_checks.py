with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "subscriptionStatus" in line or "subscription_status" in line:
            if "if (" in line or "?" in line or "&&" in line or "||" in line:
                print(f"Line {i+1}: {line.strip()}")
