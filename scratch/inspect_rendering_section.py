import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\insurance\remodeling\PerPolicyDashboard.tsx"
out_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\rendering_section.txt"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        lines = f.readlines()
    
    selected_lines = []
    for idx in range(840, min(1120, len(lines))):
        selected_lines.append(f"Line {idx+1}: {lines[idx]}")
        
    with open(out_path, "w", encoding="utf-8") as out_f:
        out_f.write("".join(selected_lines))
    print(f"Saved lines to {out_path}")
else:
    print("File not found")
