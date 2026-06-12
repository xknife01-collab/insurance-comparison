import os
import pandas as pd
import xlrd
import io
import re
import sys
import warnings

warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\property"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율",
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
]

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data)
    except Exception:
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

def parse_premium(val):
    if not val or pd.isna(val):
        return ""
    val_str = str(val).strip()
    try:
        if '.' in val_str:
            val_float = float(val_str)
            return f"{int(val_float):,} 원"
        else:
            val_int = int(val_str)
            return f"{val_int:,} 원"
    except ValueError:
        pass
    
    cleaned = re.sub(r'[^\d]', '', val_str)
    if cleaned.isdigit():
        return f"{int(cleaned):,} 원"
    return val_str

def map_and_copy_property_files(source_dir, dest_dir):
    import shutil
    import warnings
    warnings.filterwarnings('ignore')
    
    files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]
    
    file_38_found = None
    
    for filename in sorted(files):
        if filename == "file_38.xls":
            continue
            
        filepath = os.path.join(source_dir, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        flat_vals = []
        try:
            for col in df.columns:
                flat_vals.extend(df[col].dropna().astype(str).tolist())
        except Exception:
            continue
        all_text = " ".join(flat_vals)
        
        # Check for file_38 (Commercial property)
        try:
            val_7 = str(df.iloc[7, 1])
            val_20 = str(df.iloc[20, 1])
            val_31 = str(df.iloc[31, 1])
            val_42 = str(df.iloc[42, 1])
            if "메리츠" in val_7 and "한화" in val_20 and "롯데" in val_31 and "흥국" in val_42:
                file_38_found = filepath
                break
        except Exception:
            pass

    # Copy files
    if file_38_found:
        shutil.copy2(file_38_found, os.path.join(dest_dir, "file_38.xls"))
        print(f"[+] Mapped -> file_38.xls (from {os.path.basename(file_38_found)})")

def main():
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    # Auto-map raw file_38.xls in SOURCE_DIR
    map_and_copy_property_files(SOURCE_DIR, SOURCE_DIR)
    
    extracted_rows = []
    
    f38_path = os.path.join(SOURCE_DIR, "file_38.xls")
    df38 = load_df(f38_path)
    if df38 is None:
        print(f"Failed to load {f38_path}")
        return
        
    print(f"Loaded file_38.xls (Shape: {df38.shape})")
    
    current_company = None
    current_product = None
    start_row = None
    
    product_ranges = []
    
    for r in range(7, df38.shape[0]):
        company_val = clean_val(df38.iloc[r, 1])
        product_val = clean_val(df38.iloc[r, 2])
        
        if company_val or product_val:
            if current_product is not None:
                product_ranges.append({
                    "company": current_company,
                    "product": current_product,
                    "start": start_row,
                    "end": r - 1
                })
            current_company = company_val if company_val else current_company
            current_product = product_val
            start_row = r
            
    if current_product is not None:
        product_ranges.append({
            "company": current_company,
            "product": current_product,
            "start": start_row,
            "end": df38.shape[0] - 1
        })
        
    print(f"Found {len(product_ranges)} products to extract:")
    
    for idx, p in enumerate(product_ranges):
        comp = p["company"]
        prod = p["product"]
        start_idx = p["start"]
        end_idx = p["end"]
        print(f"  Product {idx+1:2d}: Company: {comp:<10} | Rows: {start_idx:3d} ~ {end_idx:3d} | Product: {prod}")
        
        current_cov = ""
        for r_idx in range(start_idx, end_idx + 1):
            row_vals = [clean_val(v) for v in df38.iloc[r_idx].tolist()]
            
            cov_val = row_vals[3] if len(row_vals) > 3 else ""
            if cov_val:
                current_cov = cov_val
            
            mapped_data = {h: "" for h in STANDARD_HEADERS}
            mapped_data["보험회사"] = comp
            mapped_data["상품명"] = prod
            mapped_data["구분"] = "주계약" if r_idx == start_idx else "특약"
            mapped_data["담보명(급부명)"] = current_cov
            mapped_data["지급사유"] = row_vals[4] if len(row_vals) > 4 else ""
            mapped_data["지급금액"] = row_vals[5] if len(row_vals) > 5 else ""
            mapped_data["가입금액"] = row_vals[5] if len(row_vals) > 5 else ""
            
            if r_idx == start_idx:
                mapped_data["기준보험료"] = parse_premium(row_vals[6]) if len(row_vals) > 6 else ""
                mapped_data["가입보험료"] = parse_premium(row_vals[7]) if len(row_vals) > 7 else ""
                
            mapped_data["source_file"] = "file_38.xls"
            
            ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
            raw_part = row_vals[:30] + [""] * max(0, 30 - len(row_vals))
            extracted_rows.append(ordered_part + raw_part)
            
    # Write to DataFrame
    num_raw = 30
    dynamic_headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(num_raw)]
    df_out = pd.DataFrame(extracted_rows, columns=dynamic_headers)
    
    # Save CSV
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"Successfully extracted {len(df_out)} rows and saved to {csv_path}")
    
    # Save XLSX
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"Successfully saved to {xlsx_path}")

if __name__ == "__main__":
    main()
