import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\App.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "on" in line or "Calculator" in line or "Analysis" in line:
        if any(keyword in line for keyword in ["Calculator", "Analysis", "submit", "mobile"]):
            print(f"Line {idx+1}: {line.strip()}")
