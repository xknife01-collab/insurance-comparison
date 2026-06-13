import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Let's print lines around the start of the return block of the main component
for idx, line in enumerate(lines):
    if "return (" in line and idx > 100 and idx < 200:
        print(f"Line {idx+1}: {line.strip()}")
    if "className=\"min-h-screen" in line or "className='min-h-screen" in line:
        print(f"Line {idx+1}: {line.strip()}")
