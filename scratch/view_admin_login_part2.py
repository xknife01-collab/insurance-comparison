file_path = "src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

import sys
sys.stdout.reconfigure(encoding='utf-8')

for j in range(1411, 1500):
    print(f"{j+1}: {lines[j]}", end="")
