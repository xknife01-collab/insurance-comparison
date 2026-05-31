import os
import pandas as pd
import io
import re
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
        continue
    
    # Let's search every cell in the dataframe for male/female premium patterns
    for r_idx, row in df.iterrows():
        row_str = " | ".join([str(v).strip() for v in row.tolist() if not pd.isna(v)])
        # Check if the row mentions both "남" and "여" or "남성" and "여성" along with digits
        # e.g., "남 12,300", "여 11,200", "남성 123", "여성 123"
        # Or look for specific columns that represent male/female premiums
        
        has_num = any(c.isdigit() for c in row_str)
        if has_num:
            # Let's search for patterns like 남 ... 여 ...
            m_match = re.search(r'(남|남성)\s*[:\s]*([\d,]+)\s*원?', row_str)
            f_match = re.search(r'(여|여성)\s*[:\s]*([\d,]+)\s*원?', row_str)
            if m_match or f_match:
                results.append(f"File: {filename} | Row {r_idx}: {row_str}")

with open("gender_scan_results.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(results))

print(f"Scan complete. Found {len(results)} matching rows. Written to gender_scan_results.txt")
