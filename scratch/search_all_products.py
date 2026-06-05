with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\all_products.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

keywords = ["여행", "해외", "국내", "유학", "워킹", "출장", "레저", "trip", "travel"]

found = []
current_file = ""
for idx, line in enumerate(lines):
    if line.startswith("["):
        current_file = line.strip()
    for kw in keywords:
        if kw in line and not line.startswith("["):
            found.append((idx + 1, current_file, line.strip()))
            break

print(f"Total matching lines found: {len(found)}")
for line_num, f, content in found:
    print(f"Line {line_num} | {f} | {content}")
