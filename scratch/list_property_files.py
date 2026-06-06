import os
import pandas as pd
import io
import xlrd
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

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

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, ftype = load_df(filepath)
        if df is None:
            continue
            
        # Find if there is any cell containing property keywords
        products = set()
        possible_cols = [1, 2]
        for c in possible_cols:
            if c < len(df.columns):
                # Use iloc to refer to column by index safely
                col_vals = df.iloc[:, c].dropna().unique()
                for v in col_vals:
                    v_str = str(v).strip()
                    if any(kw in v_str for kw in ["재물", "화재", "성공메이트", "우리집보험", "비즈앤안전", "홈가드", "하우스"]):
                        products.add(v_str)
                        
        if products:
            print(f"File: {filename} ({ftype})")
            print("  Products:")
            for p in sorted(list(products)):
                print(f"    - {p}")
            
            # Let's check rows and check if we see "성공메이트" or "우리집" or "재물"
            for r in range(len(df)):
                row_vals = [str(cell) for cell in df.iloc[r].tolist()]
                row_str = " ".join(row_vals)
                if any(kw in row_str for kw in ["성공메이트", "우리집", "재물보험"]):
                    # Print first data row that matches
                    print(f"    Matched Row {r}: {row_vals[:10]}")
                    break

if __name__ == "__main__":
    main()
