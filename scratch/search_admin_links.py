import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "복사" in line or "copy" in line or "홍보" in line or "마이" in line or "Link" in line:
        if 2000 < idx < 4200:
            print(f"Line {idx+1}: {line.strip()}")
