# -*- coding: utf-8 -*-
with open("scratch/pet_mentions.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

for line in lines:
    if "AnalysisDashboard.tsx" in line:
        print(line.strip())
