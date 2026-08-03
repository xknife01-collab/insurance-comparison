import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\insurance\remodeling\PerPolicyDashboard.tsx"
out_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\covrow_matches.txt"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        lines = f.readlines()
    
    matches = []
    for idx, line in enumerate(lines):
        if "<CovRow" in line or "detectType" in line or "const typeLabel" in line or "case '" in line:
            matches.append(f"Line {idx+1}: {line.strip()}")
            
    with open(out_path, "w", encoding="utf-8") as out_f:
        out_f.write("\n".join(matches))
    print(f"Extracted {len(matches)} lines to {out_path}")
else:
    print("File not found")
