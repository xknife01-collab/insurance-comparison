# -*- coding: utf-8 -*-
import os

src_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src"
matches = []

for root, dirs, files in os.walk(src_dir):
    for filename in files:
        if filename.endswith(('.ts', '.tsx', '.json', '.js', '.jsx')):
            filepath = os.path.join(root, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                for idx, line in enumerate(lines):
                    if 'pet' in line.lower() or '펫' in line:
                        rel_path = os.path.relpath(filepath, src_dir)
                        matches.append((rel_path, idx + 1, line.strip()))
            except Exception as e:
                pass

with open("scratch/pet_mentions.txt", "w", encoding="utf-8") as out:
    out.write(f"Total matches: {len(matches)}\n")
    for file, line_num, content in matches:
        out.write(f"[{file}] Line {line_num}: {content}\n")

print(f"Done. Matches: {len(matches)}")
