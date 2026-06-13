with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "handleDownloadTxCsv" in line or "filteredTransactions" in line:
            if i + 1 > 600:
                print(f"Line {i+1}: {line.strip()}")
