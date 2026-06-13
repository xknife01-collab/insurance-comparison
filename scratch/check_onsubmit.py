with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\App.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "onSubmitLead" in line:
            print(f"Line {i+1}: {line.strip()}")
