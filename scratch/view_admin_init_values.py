file_path = "src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

import sys
sys.stdout.reconfigure(encoding='utf-8')

for idx, line in enumerate(lines):
    if "const [edit" in line:
        print(f"{idx+1}: {line}", end="")
    if "useEffect" in line and idx > 2000 and idx < 2800:
        start = max(0, idx - 5)
        end = min(len(lines), idx + 45)
        print(f"--- MATCH useEffect at line {idx+1} ---")
        for j in range(start, end):
            print(f"{j+1}: {lines[j]}", end="")
        print("----------------------------\n")
