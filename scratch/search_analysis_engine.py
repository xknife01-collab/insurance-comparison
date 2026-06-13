import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\lib\analysisEngine.ts"
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "runAnalysis" in line or "analysis" in line or "return" in line:
        if any(keyword in line for keyword in ["runAnalysis", "analysis", "return"]):
            print(f"Line {idx+1}: {line.strip()}")
