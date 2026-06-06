import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\property_in_all_results.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Split by 📂 File:
blocks = content.split("📂 File:")
for block in blocks:
    if not block.strip() or "Property/Fire Insurance Scan" in block:
        continue
    lines = block.strip().split("\n")
    file_info = lines[0]
    products = ""
    cues = []
    
    for line in lines[1:]:
        if line.strip().startswith("Products:"):
            products = line.strip()
        elif line.strip().startswith("-") or line.strip().startswith("Cycle Cues:"):
            if "Cycle Cues:" not in line:
                cues.append(line.strip())
                
    print(f"File: {file_info}")
    print(f"  {products[:120]}")
    if cues:
        print("  Cues:")
        for cue in cues[:5]:
            print(f"    {cue[:120]}")
    print("-" * 50)
