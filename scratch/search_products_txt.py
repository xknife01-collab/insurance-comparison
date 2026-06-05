import os

products_file = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\all_products.txt"
keywords = ["여행", "travel", "국내", "해외", "관광", "유학"]

if os.path.exists(products_file):
    print(f"Reading products from {products_file}...")
    with open(products_file, 'r', encoding='utf-8-sig') as f:
        lines = f.readlines()
        
    found = False
    for line in lines:
        for kw in keywords:
            if kw.lower() in line.lower():
                print(f"Match: {line.strip()}")
                found = True
                break
    if not found:
        print("No travel keywords found in all_products.txt.")
else:
    print(f"{products_file} does not exist.")
