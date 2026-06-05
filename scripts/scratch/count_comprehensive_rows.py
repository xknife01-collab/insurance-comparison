import os
import io
import re
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = pd.read_excel(filepath, engine='xlrd', header=None)
        return wb, "xlrd"
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
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    target_kws = ["건강보험", "종합보험", "통합보험", "종합건강"]
    exclude_kws = ["실손", "치아", "치과", "펫", "운전자", "자동차", "어린이", "자녀", "태아", "정기", "종신", "치매", "간병", "골프", "화재", "연금", "저축", "변액", "용종", "신용", "홀인원", "반려"]
    
    total_rows = 0
    extracted_files = 0
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # Check if the file contains comprehensive health products
        has_comp = False
        for idx, row in df.iterrows():
            for col_idx in range(min(5, len(row))):
                val = clean_val(row.iloc[col_idx])
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    if any(tk in val for tk in target_kws) and not any(ek in val for ek in exclude_kws):
                        has_comp = True
                        break
            if has_comp:
                break
                
        if not has_comp:
            continue
            
        extracted_files += 1
        # count matching rows
        file_rows = 0
        for idx, row in df.iterrows():
            if idx < 3: # Skip very top headers
                continue
            row_vals = [clean_val(v) for v in row.tolist()]
            if len(row_vals) < 4:
                continue
            
            # Check if this row belongs to a comprehensive product
            prod_candidate = ""
            for col_idx in range(min(5, len(row_vals))):
                val = row_vals[col_idx]
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    if any(tk in val for tk in target_kws) and not any(ek in val for ek in exclude_kws):
                        prod_candidate = val.split("\n")[0].strip()
                        break
            if prod_candidate:
                file_rows += 1
                
        total_rows += file_rows
        print(f"File {filename} ({method}) | Shape: {df.shape} | Matching Rows: {file_rows}")
        
    print(f"\nTotal extracted files: {extracted_files}")
    print(f"Total matching rows: {total_rows}")

if __name__ == "__main__":
    main()
