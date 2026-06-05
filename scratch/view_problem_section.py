# -*- coding: utf-8 -*-
with open("src/components/Sections.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Find export const ProblemSection
idx = content.find("export const ProblemSection")
if idx != -1:
    print(content[idx:idx+1500])
else:
    print("ProblemSection not found")
