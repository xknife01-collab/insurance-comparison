import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception:
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
                except Exception:
                    continue
        except Exception:
            pass
    return None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def search_keywords():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    keywords = ["카카오", "kakao", "안전귀국", "귀국"]
    
    found = False
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        for row_idx, row in df.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            for col_idx, val in enumerate(row_list):
                for kw in keywords:
                    if kw in val:
                        print(f"[{filename}] Row {row_idx}, Col {col_idx}: {val}")
                        found = True
                        break
                        
    if not found:
        print("No Kakao or travel-related keywords found in the 90+ files.")

if __name__ == "__main__":
    search_keywords()
