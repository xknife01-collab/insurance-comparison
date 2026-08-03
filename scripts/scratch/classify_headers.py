import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception as e1:
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['cp949', 'euc-kr', 'utf-8']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            return frames[0]
                except Exception as e2:
                    continue
        except Exception as e3:
            pass
    return None

results = []
for filename in files:
    filepath = os.path.join(source_dir, filename)
    df = load_df(filepath)
    if df is None:
        results.append((filename, "Load error", [], []))
        continue
        
    # Find row with "상품명"
    header_row_idx = -1
    for i in range(min(20, len(df))):
        row = [str(v) for v in df.iloc[i].tolist()]
        if any("상품명" in val or "보험사" in val or "회사명" in val for val in row):
            header_row_idx = i
            break
            
    if header_row_idx == -1:
        results.append((filename, "Header not found", [], []))
        continue
        
    # Let's inspect the row itself and the next row
    h_row = [str(v).strip().replace('\n', ' ') for v in df.iloc[header_row_idx].tolist()]
    next_row = []
    if header_row_idx + 1 < len(df):
        next_row = [str(v).strip().replace('\n', ' ') for v in df.iloc[header_row_idx + 1].tolist()]
        
    has_gender_sub = any("남자" in str(v) or "여자" in str(v) for v in next_row)
    
    results.append((filename, "Has Gender Sub" if has_gender_sub else "Standard", h_row, next_row))

with open("header_classification.txt", "w", encoding="utf-8") as f:
    for filename, kind, h, n in results:
        f.write(f"File: {filename} | Kind: {kind}\n")
        f.write(f"  H: {h}\n")
        f.write(f"  N: {n}\n\n")

# Count kinds
kinds = {}
for r in results:
    k = r[1]
    kinds[k] = kinds.get(k, 0) + 1
print("Classification counts:", kinds)
