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

def search():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    keywords = ["여행", "해외", "국내", "유학", "워킹", "출장", "관광", "신혼"]
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        for row_idx, row in df.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            row_str = " ".join(row_list)
            for kw in keywords:
                if kw in row_str:
                    # Exclude common noise like variable funds, golf, etc.
                    if not any(x in row_str for x in ["채권", "주식", "반려", "치과", "골프", "홀인원"]):
                        print(f"[{filename}] Row {row_idx}: {row_list[:8]}")
                    break

if __name__ == "__main__":
    search()
