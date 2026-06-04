import os
import glob
import pandas as pd
import io
import xlrd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        df = pd.DataFrame(data)
        df.columns = range(df.shape[1])
        return df, "xlrd"
    except Exception:
        pass
        
    try:
        df = pd.read_excel(filepath, engine='xlrd', header=None)
        df.columns = range(df.shape[1])
        return df, "xlrd_default"
    except Exception:
        pass
        
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['utf-8', 'cp949', 'euc-kr']:
            try:
                raw_text = raw_bytes.decode(enc, errors='replace')
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        df = frames[0]
                        df.columns = range(df.shape[1])
                        return df, f"html_{enc}"
            except Exception:
                continue
    except Exception:
        pass
        
    return None, None

def main():
    files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.xls")))
    
    with open("payments_inspection.txt", "w", encoding="utf-8") as out:
        for filepath in files:
            filename = os.path.basename(filepath)
            df, method = load_df(filepath)
            if df is None:
                continue
                
            all_text = " ".join([str(v) for idx, r in df.iterrows() for v in r.dropna().tolist()])
            
            # Filter for general savings
            has_savings = "저축" in all_text or "저축" in filename
            has_pension = "연금" in all_text or "연금" in filename
            has_variable = "변액" in all_text or "변액" in filename
            
            is_general_savings = False
            if has_savings and not has_variable and not has_pension:
                is_general_savings = True
            if any(k in filename for k in ['저축성_상품비교', '장기저축성']):
                is_general_savings = True
                
            if is_general_savings:
                out.write(f"File: {filename} (Shape: {df.shape}, Method: {method})\n")
                if df.shape[1] == 26:
                    unique_vals = [str(x) for x in df[21].unique().tolist()]
                    out.write(f"  Col 21 unique values: {unique_vals}\n")
                    # Write rows
                    sub_df = df[[0, 1, 2, 21]].drop_duplicates()
                    for idx, row in sub_df.iterrows():
                        out.write(f"    Company: {row[0]} | Product: {row[1]} | Term: {row[2]} | Payment Cycle: {row[21]}\n")
                else:
                    out.write(f"  Binary columns: {df.shape[1]}\n")
                    # Let's see some row samples from column 1, 2, 3
                    # print first 10 rows
                    for idx, row in df.head(15).iterrows():
                        row_vals = [str(v) for v in row.tolist()]
                        out.write(f"    Row {idx}: {row_vals[:6]}\n")
                out.write("="*60 + "\n")

if __name__ == "__main__":
    main()
