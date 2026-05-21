import pandas as pd
csv_path = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_extracted_data.csv'
df = pd.read_csv(csv_path, encoding='utf-8-sig')

prods = {}
for i, row in df.iterrows():
    c1 = str(row.iloc[1]).strip()
    c2 = str(row.iloc[2]).strip()
    c3 = str(row.iloc[3]).strip()
    
    if c1 != 'nan' and c2 != 'nan':
        if c1 not in prods:
            prods[c1] = set()
        prods[c1].add(c2)

with open('all_raw_products.txt', 'w', encoding='utf-8') as f:
    for comp in sorted(prods.keys()):
        f.write(f"\n[{comp}]\n")
        for p in sorted(prods[comp]):
            f.write(f" - {p}\n")
