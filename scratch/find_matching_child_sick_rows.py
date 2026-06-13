import os
import pandas as pd
import io
import warnings
import re

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

CHILD_KEYWORDS = ["어린이", "자녀", "태아", "꿈나무", "신생아", "아이", "청소년"]
SICK_KEYWORDS = ["유병", "간편", "3.1.5", "3.2.5", "3.3.5", "3.4.5", "3.5.5", "심사", "경증", "간편고지", "간편한", "바로선택", "오간편", "더간편한", "3N5", "3.10.5"]

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

def run():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total files: {len(files)}")
    
    matches = []
    for f in files:
        filepath = os.path.join(SOURCE_DIR, f)
        df = load_df(filepath)
        if df is None:
            continue
            
        # Scan all columns for product name keywords
        for i in range(len(df)):
            row = [str(val) for val in df.iloc[i].tolist()]
            # Find any cell containing a child keyword and a sick keyword
            for cell in row:
                if pd.isna(cell) or not isinstance(cell, str):
                    continue
                is_child = any(k in cell for k in CHILD_KEYWORDS)
                is_sick = any(k in cell for k in SICK_KEYWORDS)
                if is_child and is_sick:
                    matches.append((f, i, cell))
                    
    print(f"\nTotal matches found: {len(matches)}")
    for m in matches[:30]:
        print(f"File: {m[0]} | Row {m[1]} | Content: {m[2]}")

if __name__ == '__main__':
    run()
