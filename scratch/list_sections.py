# -*- coding: utf-8 -*-
with open("src/components/Sections.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

for line in lines:
    if line.startswith("export const"):
        print(line.strip())
