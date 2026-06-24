import os

file_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisSection.tsx"

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        lines = f.readlines()
    
    for idx in range(1135, 1150):
        if idx < len(lines):
            line = lines[idx]
            print(f"Line {idx+1}: {repr(line)}")
else:
    print("File not found")
