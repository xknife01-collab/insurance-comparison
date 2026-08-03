import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisSection.tsx"

if os.path.exists(file_path):
    print("Searching...")
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        for idx, line in enumerate(f):
            if "getCustomPoliciesList" in line or "customPolicies" in line:
                print(f"Line {idx+1}: {line.strip()}")
else:
    print("File not found")
