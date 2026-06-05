# -*- coding: utf-8 -*-
import os

keywords = ["민사소송", "형사소송", "행정소송", "법률비용", "교원소청"]
ignored_keywords = ["대인형사", "교통사고", "자동차사고", "이륜자동차", "PM", "화재", "일상생활", "가족일상", "배상책임", "벌금"]

output_lines = []

with open("legal_matches.txt", "r", encoding="utf-8") as f:
    for line in f:
        # Check if line contains any of the target keywords
        if any(k in line for k in keywords):
            # Let's see if we should ignore it
            # But wait, some driver insurance riders might have "변호사선임비용" but not "민사소송" or "형사소송". 
            # If it has "민사소송법률비용" or "민사소송법률비용손해" it is what we want!
            # Let's inspect all matches and write them out.
            output_lines.append(line.strip())

print(f"Total candidate matches from matches file: {len(output_lines)}")
with open("scratch/legal_filtered.txt", "w", encoding="utf-8") as out:
    for line in output_lines:
        out.write(line + "\n")

print("Filtered matches written to scratch/legal_filtered.txt")
