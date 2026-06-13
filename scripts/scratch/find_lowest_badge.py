# -*- coding: utf-8 -*-
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\components\InsuranceCalculator.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if "lowest" in line.lower() or "최저" in line or "market" in line.lower() or "idx === 0" in line:
        print(f"Line {idx+1}: {line.strip()}")
