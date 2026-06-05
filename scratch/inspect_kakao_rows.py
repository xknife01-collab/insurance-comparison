import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files_to_inspect = ["file_39.xls", "file_40.xls", "file_41.xls", "file_43.xls", "file_48.xls"]

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

def inspect():
    for fn in files_to_inspect:
        path = os.path.join(SOURCE_DIR, fn)
        if not os.path.exists(path):
            continue
        df = load_df(path)
        if df is None:
            continue
            
        print(f"\n==================== {fn} ====================")
        # find rows containing 카카오 or kakao
        for idx, row in df.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            row_str = " | ".join(row_list)
            if "카카오" in row_str or "kakao" in row_str or "ī" in row_str or "\xed\x95\x9c" in row_str or any("카카오" in val or "Kakao" in val for val in row_list):
                print(f"Row {idx}: {row_list[:10]}")
            # also look for euc-kr encoded bytes of 카카오
            # 카카오페이 in euc-kr is b'\xcb\xab\xcb\xab\xbf\xa5\xc0\xcc'
            # let's check if any cell contains that
            for val in row_list:
                if "카카오" in val or "Kakao" in val or "페이" in val:
                    print(f"Row {idx} (matched): {row_list[:10]}")
                    break

if __name__ == "__main__":
    inspect()
