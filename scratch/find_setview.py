# -*- coding: utf-8 -*-
import os

src_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src"
matches = []

for root, dirs, files in os.walk(src_dir):
    for filename in files:
        if filename.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                for idx, line in enumerate(lines):
                    if 'setView' in line:
                        rel_path = os.path.relpath(filepath, src_dir)
                        matches.append((rel_path, idx + 1, line.strip()))
            except Exception as e:
                pass

for file, line_num, content in sorted(matches):
    print(f"[{file}] Line {line_num}: {content}")
