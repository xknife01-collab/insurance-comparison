import os
import pandas as pd
import io
import warnings
from bs4 import BeautifulSoup

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files_to_inspect = ["file_39.xls", "file_40.xls", "file_41.xls", "file_43.xls", "file_48.xls"]

def load_df_clean(filepath):
    # Try xlrd
    try:
        df = pd.read_excel(filepath, engine='xlrd', header=None)
        return df, "xlrd"
    except Exception:
        # Try HTML parsing with different encodings
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-8-sig']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        soup = BeautifulSoup(raw_text, "html.parser")
                        # clean up soup text or read with pandas
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            return frames[0], enc
                except Exception:
                    continue
        except Exception:
            pass
    return None, None

def inspect():
    for fn in files_to_inspect:
        path = os.path.join(SOURCE_DIR, fn)
        if not os.path.exists(path):
            continue
        df, enc = load_df_clean(path)
        if df is None:
            continue
            
        print(f"\n==================== {fn} ({enc}) ====================")
        for idx, row in df.iterrows():
            row_list = [str(v).strip().replace('\n', ' ') if not pd.isna(v) else "" for v in row.tolist()]
            row_str = " | ".join(row_list)
            if "카카오" in row_str or "kakao" in row_str:
                print(f"Row {idx}: {row_list[:8]}")

if __name__ == "__main__":
    inspect()
