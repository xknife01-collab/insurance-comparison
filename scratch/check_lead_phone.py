import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

pattern = re.compile(r'\b(lead|l|selectedLead)\.phone\b')
with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\AdminDashboard.tsx", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if pattern.search(line):
            print(f"Line {i+1}: {line.strip()}")
