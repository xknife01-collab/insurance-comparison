import os
import pandas as pd
import xlrd
import warnings
import io

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
                        return frames[0], f"html_{enc}"
            except Exception:
                continue
    except Exception:
        pass
    return None, None

def main():
    files = [
        "file_51.xls",
        "file_53.xls",
        "file_55.xls",
        "장기저축성 보험 비교 공시.xls",
        "저축성_상품비교_20260406102612904.xls"
    ]
    
    with open("savings_products_clean.txt", "w", encoding="utf-8") as out:
        for fn in files:
            path = os.path.join(SOURCE_DIR, fn)
            if not os.path.exists(path):
                out.write(f"[-] File not found: {fn}\n")
                continue
            df, method = load_df(path)
            if df is None:
                out.write(f"[-] Failed to load: {fn}\n")
                continue
                
            out.write(f"\n========================================\nFile: {fn} (Shape: {df.shape}, Method: {method})\n")
            products = []
            for idx, row in df.iterrows():
                if df.shape[1] == 26:
                    co = str(row.iloc[0]).strip()
                    prod = str(row.iloc[1]).strip()
                    if co and prod and co != "회사명" and not co.startswith("조회"):
                        products.append(f"{co} | {prod}")
                elif df.shape[1] == 14:
                    co = str(row.iloc[1]).strip()
                    prod = str(row.iloc[2]).strip()
                    if co and prod and co != "회사명" and not co.startswith("조회"):
                        products.append(f"{co} | {prod}")
                        
            uniq_products = []
            seen = set()
            for p in products:
                if p not in seen:
                    seen.add(p)
                    uniq_products.append(p)
                    
            out.write(f"Total unique products: {len(uniq_products)}\n")
            out.write("Unique products:\n")
            for p in uniq_products:
                out.write(f"  - {p}\n")

if __name__ == "__main__":
    main()
