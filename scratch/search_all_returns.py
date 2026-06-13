import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AnalysisDashboard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "return" in line:
        # Check if it starts a JSX return or is inside the main component
        if "return (" in line or "return <" in line or "return div" in line:
            print(f"Line {idx+1}: {line.strip()}")
