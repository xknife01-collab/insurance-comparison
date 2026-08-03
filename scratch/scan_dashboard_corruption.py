import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\insurance\remodeling\PerPolicyDashboard.tsx"
out_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\corruption_results.txt"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        lines = f.readlines()
        
    results = []
    for idx, line in enumerate(lines):
        if "\ufffd" in line or ("'" in line and "?" in line) or ('"' in line and "?" in line) or ("`" in line and "?" in line):
            results.append(f"Line {idx+1}: {repr(line.strip())}")
            
    with open(out_path, "w", encoding="utf-8") as out_f:
        out_f.write("\n".join(results))
    print(f"Saved results to {out_path}")
else:
    print("File not found")
