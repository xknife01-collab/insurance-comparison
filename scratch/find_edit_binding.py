file_path = "src/components/AdminDashboard.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

import sys
sys.stdout.reconfigure(encoding='utf-8')

for idx, line in enumerate(lines):
    if "setEditPlannerName" in line or "setEditCompanyName" in line:
        print(f"{idx+1}: {line}", end="")
