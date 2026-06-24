import os
import json

brain_dir = r"C:\Users\zkfnt\.gemini\antigravity\brain"
target_folder = "d56e43ae-f705-4f9f-9c59-511b497f8b25"
log_path = os.path.join(brain_dir, target_folder, ".system_generated", "logs", "overview.txt")
out_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\search_results.txt"

if os.path.exists(log_path):
    print(f"Scanning log: {log_path}")
    results = []
    with open(log_path, "r", encoding="utf-8", errors="ignore") as f:
        for idx, line in enumerate(f):
            if "PerPolicyDashboard.tsx" in line:
                results.append(f"Line {idx}: length {len(line)}")
                results.append(line[:500] + " ...\n")
    
    with open(out_path, "w", encoding="utf-8") as out_f:
        out_f.write("\n".join(results))
    print(f"Saved results to {out_path}")
else:
    print("Log not found")
