import os
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

dir_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(dir_path) if f.endswith('.xls')]

credit_keywords = ["신용", "대출", "상환", "대출안심", "신용보험", "신용생명"]
matched_products = {}

for filename in files:
    full_path = os.path.join(dir_path, filename)
    try:
        # We can read HTML tables
        tables = pd.read_html(full_path, encoding='utf-8')
        for t_idx, df in enumerate(tables):
            # Flatten multi-index columns if present
            if isinstance(df.columns, pd.MultiIndex):
                cols = ['_'.join([str(c) for c in col]).strip() for col in df.columns.values]
            else:
                cols = [str(c) for c in df.columns]
            
            for r_idx, row in df.iterrows():
                row_str = " ".join([str(v) for v in row.values])
                for kw in credit_keywords:
                    if kw in row_str:
                        prod_name = None
                        for c in df.columns:
                            c_str = str(c)
                            if '상품명' in c_str:
                                prod_name = str(row[c])
                                break
                        if not prod_name:
                            if len(row) > 1:
                                prod_name = str(row.iloc[1])
                        
                        if prod_name and any(k in prod_name for k in credit_keywords):
                            prod_clean = prod_name.strip()
                            if prod_clean not in matched_products:
                                matched_products[prod_clean] = []
                            matched_products[prod_clean].append((filename, t_idx, r_idx))
    except Exception as e:
        try:
            df = pd.read_excel(full_path)
            for r_idx, row in df.iterrows():
                row_str = " ".join([str(v) for v in row.values])
                for kw in credit_keywords:
                    if kw in row_str:
                        prod_name = None
                        for c in df.columns:
                            c_str = str(c)
                            if '상품명' in c_str:
                                prod_name = str(row[c])
                                break
                        if not prod_name:
                            if len(row) > 1:
                                prod_name = str(row.iloc[1])
                        if prod_name and any(k in prod_name for k in credit_keywords):
                            prod_clean = prod_name.strip()
                            if prod_clean not in matched_products:
                                matched_products[prod_clean] = []
                            matched_products[prod_clean].append((filename, 'binary', r_idx))
        except Exception as ex:
            pass

out_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\find_all_credit_products_out.txt"
with open(out_path, 'w', encoding='utf-8') as out_f:
    out_f.write(f"Total unique credit products: {len(matched_products)}\n")
    for prod, occurrences in matched_products.items():
        out_f.write(f"\nProduct: {prod}\n")
        out_f.write(f"Occurrences (first 5): {str(occurrences[:5])}\n")

print("Saved output to find_all_credit_products_out.txt")
