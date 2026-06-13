# -*- coding: utf-8 -*-
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\InsuranceCalculator.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if ".map" in line or "premium" in line or "recommend" in line.lower() or "lowest" in line.lower() or "lowest" in line or "Market" in line or "Lowest" in line:
        if any(keyword in line for keyword in ["index", "idx", "badge", "Market", "Lowest", "lowest", "premium", "result", "list"]):
            print(f"Line {idx+1}: {line.strip()}")
