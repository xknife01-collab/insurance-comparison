# -*- coding: utf-8 -*-
with open("src/App.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'legal' in line.lower() or '법률' in line or '민사' in line:
        print(f"Line {idx+1}: {line.strip()}")
