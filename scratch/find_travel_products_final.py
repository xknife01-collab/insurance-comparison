import os
import pandas as pd
import io
import warnings
import xlrd
from bs4 import BeautifulSoup

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    # 1. Try reading as binary XLS with cp949 first
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "binary_cp949"
    except Exception:
        pass
        
    # 2. Try HTML format
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
            
        # Try decodings strictly
        for enc in ['utf-8', 'cp949', 'euc-kr']:
            try:
                raw_text = raw_bytes.decode(enc)
                if '<table' in raw_text.lower() or '<html' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        return frames[0], f"html_{enc}"
            except Exception:
                continue
                
        # Try decodings with ignore errors
        for enc in ['utf-8', 'cp949', 'euc-kr']:
            try:
                raw_text = raw_bytes.decode(enc, errors='ignore')
                if '<table' in raw_text.lower() or '<html' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        return frames[0], f"html_{enc}_ignore"
            except Exception:
                continue
    except Exception:
        pass
        
    # 3. Fallback standard pd.read_excel
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "fallback_xlrd"
    except Exception:
        pass
        
    return None, None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def search_travel_products():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    keywords = ["여행", "해외여행", "국내여행", "유학"]
    
    found_products = {}
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # Find product name column (상품명)
        prod_col = 1
        for i in range(min(30, len(df))):
            row = [clean_val(v) for v in df.iloc[i].tolist()]
            if any("상품명" in val or "상품명칭" in val or "회사명" in val or "보험사" in val for val in row):
                for col_idx, val in enumerate(row):
                    if any(k in val.replace(" ", "") for k in ["상품명", "상품명칭", "보험상품"]):
                        prod_col = col_idx
                        break
                break
                
        # Gather all product names in this file
        for idx, row in df.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            if prod_col < len(row_list):
                prod_name = row_list[prod_col]
                # If product name is empty, try adjacent columns if they look like product names
                if not prod_name and len(row_list) > 1:
                    # check col 1 or 2 as fallback
                    for c_idx in [1, 2]:
                        if c_idx < len(row_list) and "보험" in row_list[c_idx]:
                            prod_name = row_list[c_idx]
                            break
                            
                if prod_name and prod_name not in ["상품명", "상품명칭", "보험상품"] and len(prod_name) > 1:
                    for kw in keywords:
                        if kw in prod_name:
                            if filename not in found_products:
                                found_products[filename] = set()
                            found_products[filename].add((prod_name, method))
                            break

    # Write matches to file to ensure clean Korean output when read by model
    output_lines = []
    if found_products:
        output_lines.append(f"여행자/유학 관련 상품을 발견했습니다 (총 {len(found_products)}개 파일):")
        for fn, prods in sorted(found_products.items()):
            output_lines.append(f"\n■ 파일명: {fn}")
            for p, m in sorted(list(prods)):
                output_lines.append(f"  - 상품명: {p} (디코딩 방식: {m})")
    else:
        output_lines.append("모든 엑셀 파일을 정밀 분석했으나, 상품명에 '여행', '해외여행', '국내여행', '유학' 키워드가 포함된 상품이 존재하지 않습니다.")
        
    result_text = "\n".join(output_lines)
    print(result_text)
    
    with open(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\travel_products_search_result.txt", "w", encoding="utf-8") as f:
        f.write(result_text)

if __name__ == "__main__":
    search_travel_products()
