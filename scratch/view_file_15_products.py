with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\all_products.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

found = False
count = 0
for idx, line in enumerate(lines):
    if "[file_15.xls]" in line:
        found = True
        print(f"Lines around {idx+1}:")
        for i in range(max(0, idx - 2), min(len(lines), idx + 25)):
            print(f"{i+1}: {lines[i]}", end="")
        break
