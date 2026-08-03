file_path = r"src/components/Sections.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

import sys
sys.stdout.reconfigure(encoding='utf-8')

for idx in range(1265, 1405):
    print(f"{idx+1}: {lines[idx]}", end="")
