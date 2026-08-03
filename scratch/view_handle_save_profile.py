file_path = "src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

import sys
sys.stdout.reconfigure(encoding='utf-8')

for idx, line in enumerate(lines):
    if "const handleSaveProfile =" in line:
        start = idx
        end = idx + 150
        print(f"--- MATCH at line {idx+1} ---")
        for j in range(start, end):
            print(f"{j+1}: {lines[j]}", end="")
        print("----------------------------\n")
