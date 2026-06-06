import os
import pandas as pd
import io
import xlrd
import sys
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUTPUT_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\property_scan_results.txt"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "binary"
    except Exception:
        try:
            df = pd.read_excel(filepath, engine='xlrd', header=None)
            return df, "binary_std"
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
                                return frames[0], "html"
                    except Exception:
                        continue
            except Exception:
                pass
    return None, None

def inspect_all_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    property_keywords = ["재물", "화재", "재산", "성공메이트", "소상공인", "비즈니스", "biz", "하우스", "우리집", "사업장"]
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write(f"Total files in source dir: {len(files)}\n")
        
        for filename in sorted(files):
            filepath = os.path.join(SOURCE_DIR, filename)
            df, ftype = load_df(filepath)
            if df is None:
                continue
                
            has_property_kw = False
            payment_cycle_info = []
            
            # Check for property keywords in the entire dataframe
            for r in range(len(df)):
                row_str = " ".join([str(v) for v in df.iloc[r].tolist() if pd.notna(v)])
                if any(kw in row_str for kw in property_keywords):
                    has_property_kw = True
                if any(kw in row_str for kw in ["월납", "연납", "1년납", "연보험료", "월보험료", "납입주기"]):
                    payment_cycle_info.append(row_str)
            
            if has_property_kw:
                # Collect products
                products = set()
                possible_cols = [1, 2]
                for c in possible_cols:
                    if c < len(df.columns):
                        for v in df[c].dropna().unique():
                            v_str = str(v).strip()
                            if len(v_str) > 5 and any(kw in v_str for kw in property_keywords + ["보험"]):
                                products.add(v_str)
                
                out.write(f"\n[+] File: {filename} ({ftype})\n")
                out.write(f"    Products found: {sorted(list(products))}\n")
                
                # Check for cycle keywords specifically
                cycle_cues = []
                for cue in payment_cycle_info:
                    # Keep only short portions containing the keyword
                    for part in cue.split():
                        if any(kw in part for kw in ["월납", "연납", "1년납", "연보험료", "월보험료", "납입주기"]):
                            cycle_cues.append(part)
                out.write(f"    Payment cycle cues: {list(set(cycle_cues))[:15]}\n")

if __name__ == "__main__":
    inspect_all_files()
    print("Done scanning!")
