import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\property_in_all_results.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

current_block = []
in_block = False

for line in lines:
    if line.startswith("📂 File:") or line.startswith("### Property"):
        if current_block:
            print("".join(current_block))
        current_block = [line]
        in_block = True
    elif in_block:
        current_block.append(line)

if current_block:
    print("".join(current_block))
