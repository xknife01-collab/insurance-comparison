file_path = "src/components/Sections.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

import sys
sys.stdout.reconfigure(encoding='utf-8')

for idx, line in enumerate(lines):
    if "김리치" in line:
        start = max(0, idx - 10)
        end = min(len(lines), idx + 15)
        print(f"--- MATCH at line {idx+1} ---")
        for j in range(start, end):
            print(f"{j+1}: {lines[j]}", end="")
        print("----------------------------\n")
