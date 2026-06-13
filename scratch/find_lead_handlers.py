with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "update(" in line or "memo" in line or "status" in line or "setSelectedLead" in line:
            if "customer_leads" in line or "Lead" in line or "handle" in line:
                print(f"Line {i+1}: {line.strip()}")
