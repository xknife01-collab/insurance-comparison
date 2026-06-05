# -*- coding: utf-8 -*-
with open("scratch/all_matching_rows.txt", "r", encoding="utf-8") as f:
    content = f.read()

entries = content.strip().split("\n\n")

print(f"Total entries: {len(entries)}")

true_legal = []
for entry in entries:
    if not entry.strip():
        continue
    lines = entry.strip().split("\n")
    meta = lines[0]
    row_text = lines[1] if len(lines) > 1 else ""
    
    # Exclude typical driver keywords
    exclude = ["운전", "자동차", "이륜", "재물", "과실치사상", "PM", "라이더", "바이크", "상해사고변호사", "사고변호사"]
    # Wait, we want to look at those that might be true legal
    if any(ex in row_text for ex in exclude) or any(ex in meta for ex in exclude):
        continue
        
    true_legal.append(entry)

print(f"Filtered true legal entries: {len(true_legal)}")
with open("scratch/true_legal_rows.txt", "w", encoding="utf-8") as f:
    for item in true_legal:
        f.write(item + "\n\n")
