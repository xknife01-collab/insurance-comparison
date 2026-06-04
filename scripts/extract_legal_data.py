# -*- coding: utf-8 -*-
import os
import pandas as pd
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\legal"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율", 
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
]

def load_df(filepath):
    # Try reading as binary excel with cp949 override first to prevent garbled Korean strings
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data)
    except Exception:
        # Fallback to standard pd.read_excel
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None)
        except Exception:
            # Fallback to HTML-saved excel parsing
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

def clean_and_format_premium(val):
    if pd.isna(val) or val == "":
        return ""
    val_str = str(val).strip().replace(",", "").replace("원", "").replace(" ", "")
    if val_str == "" or val_str == "-":
        return ""
    try:
        num = int(float(val_str))
        return f"{num:,} 원"
    except ValueError:
        return str(val).strip()

def is_legal_row(coverage_name):
    if not coverage_name:
        return False
    name = coverage_name.replace(" ", "")
    
    # Exact matching coverages
    targets = [
        "민사소송법률비용Ⅱ",
        "민사소송법률비용손해",
        "행정소송법률비용손해",
        "교원소청변호사비용손해",
        "민사소송법률비용보장특별약관"
    ]
    if name in targets:
        return True
        
    # Regex-like checking to be robust
    if any(k in name for k in ["민사소송", "행정소송", "교원소청"]):
        return True
        
    return False

def extract_legal_data():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total files in source directory: {len(files)}")
    
    extracted_rows = []
    processed_files = 0
    failed_files = 0
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            print(f"[-] Failed to load {filename}")
            failed_files += 1
            continue
            
        processed_files += 1
        
        # In the legal file (file_47.xls / 장기보장성 비교 공시 (7).xls), the structure is:
        # Col 0: Empty
        # Col 1: Insurance Company (보험회사)
        # Col 2: Product Name (상품명)
        # Col 3: Coverage Name (담보명)
        # Col 4: Reason for payout (지급사유)
        # Col 5: Payout/Subscription Amount (지급금액/가입금액)
        # Col 6: Male Premium (기준보험료 / 남성보험료)
        # Col 7: Female Premium (가입보험료 / 여성보험료)
        # Row 0-6 are headers, content starts around row 7.
        
        last_company = ""
        last_product = ""
        file_extracted_count = 0
        
        for idx, row in df.iterrows():
            if idx < 7: # Skip header rows
                continue
                
            row_list = [clean_val(v) for v in row.tolist()]
            if len(row_list) < 4:
                continue
                
            # Forward-fill company and product name
            curr_company = row_list[1] if len(row_list) > 1 else ""
            curr_product = row_list[2] if len(row_list) > 2 else ""
            
            if curr_company:
                last_company = curr_company
            if curr_product:
                last_product = curr_product
                
            product_name = last_product
            company_name = last_company
            coverage_name = row_list[3]
            
            if is_legal_row(coverage_name):
                mapped_data = {}
                mapped_data["보험회사"] = company_name
                mapped_data["상품명"] = product_name
                mapped_data["구분"] = "특약" # Legal cost coverages are riders
                mapped_data["담보명(급부명)"] = coverage_name
                mapped_data["지급사유"] = row_list[4] if len(row_list) > 4 else ""
                mapped_data["지급금액"] = row_list[5] if len(row_list) > 5 else ""
                mapped_data["가입금액"] = row_list[5] if len(row_list) > 5 else ""
                
                # Premium formatting
                male_raw = row_list[6] if len(row_list) > 6 else ""
                female_raw = row_list[7] if len(row_list) > 7 else ""
                mapped_data["기준보험료"] = clean_and_format_premium(male_raw)
                mapped_data["가입보험료"] = clean_and_format_premium(female_raw)
                
                mapped_data["적용이율"] = ""
                mapped_data["갱신구분"] = "갱신형" if "갱신" in product_name else "비갱신형"
                mapped_data["판매채널"] = ""
                mapped_data["기준일자"] = ""
                mapped_data["상세안내"] = ""
                mapped_data["연락처"] = ""
                mapped_data["source_file"] = filename
                
                # Standard row formatting (16 columns)
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                
                # Raw row formatting (30 columns)
                padded_raw = row_list[:30] + [""] * max(0, 30 - len(row_list))
                
                # Full row (46 columns)
                full_row = ordered_part + padded_raw
                extracted_rows.append(full_row)
                file_extracted_count += 1
                
        if file_extracted_count > 0:
            print(f"[+] Loaded {filename}: extracted {file_extracted_count} rows")
            
    print(f"\nExtraction summary: {processed_files} files loaded successfully, {failed_files} failed.")
    print(f"Total legal insurance rows extracted: {len(extracted_rows)}")
    
    if not extracted_rows:
        print("No legal insurance rows extracted. Please verify the keyword filters.")
        return
        
    # Headers matching the 46 columns of caregiving
    dynamic_headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(30)]
    
    # Save output files
    os.makedirs(TARGET_DIR, exist_ok=True)
    df_out = pd.DataFrame(extracted_rows, columns=dynamic_headers)
    
    # Save as CSV
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"Saved CSV data: {len(df_out)} rows to {csv_path}")
    
    # Save as XLSX
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"Saved Excel data: {len(df_out)} rows to {xlsx_path}")

if __name__ == "__main__":
    extract_legal_data()
