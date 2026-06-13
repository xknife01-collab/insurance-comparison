import pandas as pd
import io
import sys
import os
import re

sys.stdout.reconfigure(encoding='utf-8')

filepath = os.path.join("..", "보장성_상품비교_20260608162037508.xls")

with open(filepath, "rb") as f:
    raw_bytes = f.read()

for enc in ['utf-8', 'cp949', 'euc-kr']:
    try:
        raw_text = raw_bytes.decode(enc)
        if '<table' in raw_text.lower():
            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
            if frames:
                df = frames[0]
                is_renewable = (
                    (df.iloc[:, 24].astype(str).str.strip() == "갱신형") |
                    (df.iloc[:, 1].astype(str).str.contains(r'(?<!비)갱신', na=False, regex=True))
                )
                term_df = df[
                    (~is_renewable) &
                    (df.iloc[:, 1].astype(str).str.contains("정기보험", na=False))
                ]
                
                print(f"Number of filtered rows: {len(term_df)}")
                
                # Group by (Company, Product Name)
                groups = {}
                for idx, row in term_df.iterrows():
                    company = str(row.iloc[0]).strip()
                    product_name = str(row.iloc[1]).strip()
                    
                    if company in ["보험회사", "회사명", "nan"] or not product_name or product_name == "nan":
                        continue
                    
                    key = (company, product_name)
                    if "흥국" in company or "헤리티지" in product_name:
                        print(f"Row {idx}: {company} | {product_name} | {row.iloc[2]} | {row.iloc[6]} | {row.iloc[7]}")
                        
        break
    except Exception as e:
        print(f"Error: {e}")
        continue
