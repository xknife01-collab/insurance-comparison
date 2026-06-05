with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\all_products.txt", "r", encoding="utf-8") as f:
    products = f.readlines()

keywords = ["레저", "골프", "원데이", "상해", "안심", "휴대폰", "귀가"]
found = []
for line in products:
    for kw in keywords:
        if kw in line and not line.startswith("[") and not line.startswith("Total"):
            found.append(line.strip())
            break

print(f"Found {len(found)} products:")
for p in sorted(list(set(found)))[:50]:
    print(p)
