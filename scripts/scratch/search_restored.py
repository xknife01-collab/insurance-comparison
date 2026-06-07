with open(r'scripts\scratch\restored_code.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'recommendations' in line or 'isRemodeling' in line or 'cols' in line:
        print(f"Line {idx+1}: {line.strip()[:120]}")
