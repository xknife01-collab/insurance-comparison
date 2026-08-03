file_path = r"src/App.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

import sys
sys.stdout.reconfigure(encoding='utf-8')

for idx, line in enumerate(lines):
    if "newPlannerBranding" in line:
        print(f"Line {idx+1}: {line}", end="")
        start = max(0, idx - 5)
        end = min(len(lines), idx + 20)
        print("--- CONTEXT ---")
        for j in range(start, end):
            print(f"{j+1}: {lines[j]}", end="")
        print("----------------\n")
