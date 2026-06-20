file_path = "src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

import sys
sys.stdout.reconfigure(encoding='utf-8')

found = False
for idx, line in enumerate(lines):
    if "admin" in line and "targetCode" in line:
        start = max(0, idx - 10)
        end = min(len(lines), idx + 80)
        print(f"--- MATCH at line {idx+1} ---")
        for j in range(start, end):
            print(f"{j+1}: {lines[j]}", end="")
        print("----------------------------\n")
        found = True

if not found:
    # search for handleLogin body
    for idx, line in enumerate(lines):
        if "const handleLogin =" in line:
            start = idx
            end = idx + 100
            print(f"--- handleLogin at line {idx+1} ---")
            for j in range(start, end):
                print(f"{j+1}: {lines[j]}", end="")
            print("----------------------------\n")
