# -*- coding: utf-8 -*-
with open("scratch/pet_mentions.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

grouped = {}
for line in lines[1:]:
    if line.startswith('['):
        parts = line.split(']')
        filename = parts[0][1:]
        grouped[filename] = grouped.get(filename, 0) + 1

for file, count in sorted(grouped.items(), key=lambda x: x[1], reverse=True):
    print(f"{file}: {count} matches")
