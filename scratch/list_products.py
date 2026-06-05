import os
import io
import pandas as pd
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "xlrd"
    except Exception:
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd_fallback"
        except Exception:
            try:
                with open(filepath, 'rb') as f:
                    raw_bytes = f.read()
                for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
                    try:
                        raw_text = raw_bytes.decode(enc)
                        if '<table' in raw_text.lower():
                            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                            if frames:
                                return frames[0], f"html_{enc}"
                    except Exception:
                        continue
            except Exception:
                pass
    return None, None

def clean_val(v):
    if pd.isna(v) or v is None: return ""
    return str(v).replace('\n', ' ').strip()

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls") or f.endswith(".xlsx")]
    print(f"Scanning {len(files)} files...")
    
    product_to_files = {}
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # Try to find products by scanning cell values in the first 5 columns
        for idx, row in df.iterrows():
            if idx > 15: # usually headers are in first 15 rows
                break
            for col_idx in range(min(5, len(row))):
                val = clean_val(row.iloc[col_idx])
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    # split by newline and take the first line
                    cand = val.split("\n")[0].strip()
                    if len(cand) < 100 and not any(w in cand for w in ["경우", "지급", "판정", "의해", "등급", "보험료", "해당", "기준", "이상", "이하", "또는", "합니다", "있습니다", "받은"]):
                        if cand not in product_to_files:
                            product_to_files[cand] = []
                        product_to_files[cand].append(filename)
                        
    print(f"\nFound {len(product_to_files)} unique products:")
    for prod, fnames in sorted(product_to_files.items()):
        # Print if "상해" or "재해" is in product name
        if any(kw in prod for kw in ["상해", "재해", "교통", "안심", "레저"]):
            print(f"- [ACCIDENT CANDIDATE] {prod} -> Files: {fnames}")
        else:
            print(f"- {prod} -> Files: {fnames}")

if __name__ == "__main__":
    main()
