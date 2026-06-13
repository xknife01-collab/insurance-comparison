with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "credit_transactions" in line or "filteredTransactions" in line or "변동 크레딧" in line or "이력" in line:
            print(f"Line {i+1}: {line.strip()}")
