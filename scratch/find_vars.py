import sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

with open(r'src/components/AnalysisDashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, start=1):
    if 'const isDental' in line or 'const isCar ' in line or 'const isHealth' in line:
        print(f'{i}: {repr(line[:120])}')
        # Show surrounding lines
        for j in range(max(0,i-2), min(len(lines), i+8)):
            print(f'  {j+1}: {repr(lines[j][:120])}')
        break
