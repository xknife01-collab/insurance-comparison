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
    keywords = ["법률", "소송", "민사", "형사", "변호사"]
    
    matches = []
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
                    matches.append((filename, row_idx, row_list))
                    print(f"[{filename}] Row {row_idx}: {row_list[:10]}")
                    break
                    
    print(f"Total matching rows: {len(matches)}")
    # Write to a file for review
    with open("legal_matches.txt", "w", encoding="utf-8") as out:
        for filename, row_idx, row_list in matches:
            out.write(f"{filename}\t{row_idx}\t" + "\t".join(row_list) + "\n")

if __name__ == "__main__":
    search()
