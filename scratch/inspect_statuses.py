import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisSection.tsx"
out_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\status_results.txt"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        lines = f.readlines()
    
    results = []
    for idx in range(1005, 1025):
        if idx < len(lines):
            line = lines[idx]
            results.append(f"Line {idx+1}: {repr(line)}")
            
    with open(out_path, "w", encoding="utf-8") as out_f:
        out_f.write("\n".join(results))
    print(f"Saved results to {out_path}")
else:
    print("File not found")
