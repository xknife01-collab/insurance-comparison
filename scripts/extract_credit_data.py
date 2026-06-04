# -*- coding: utf-8 -*-
import os
import pandas as pd
import io
import warnings
import xlrd
import re

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit"

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
        return pd.DataFrame(data), "xlrd"
    except Exception:
        pass
        
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['utf-8', 'cp949', 'euc-kr']:
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
    if pd.isna(v) or v is None:
        return ""
    return str(v).replace('\n', ' ').strip()

def clean_and_format_premium(val):
    if pd.isna(val) or val == "":
        return ""
    val_str = str(val).strip().replace(",", "").replace("원", "").replace(" ", "")
    if val_str == "" or val_str == "-":
        return ""
    # Extract numbers
    digits = "".join(c for c in val_str if c.isdigit())
    if not digits:
        return str(val).strip()
    try:
        num = int(digits)
        return f"{num:,} 원"
    except ValueError:
        return str(val).strip()

def get_clean_company_name(co):
    co = str(co).strip()
    if '삼성' in co:
        return '삼성생명'
    elif '메트' in co:
        return '메트라이프생명'
    elif '신한' in co:
        return '신한라이프생명'
    elif '하나' in co:
        return '하나생명'
    elif '카디프' in co or 'BNP' in co:
        return 'BNP파리바카디프생명'
    return co

def is_credit_row(row_vals):
    # Join row values to search
    full_text = " ".join([str(v) for v in row_vals])
    
    # Target products list
    targets = [
        "대출안심", "대출상환", "신용보험", "신용보장"
    ]
    
    # Exclude obvious non-targets (like whole life, pension, dementia)
    exclusions = [
        "변액유니버셜", "종신보험", "간병", "치매", "저축보험", "연금보험"
    ]
    
    # Must have at least one target keyword
    has_target = any(t in full_text for t in targets)
    has_exclusion = any(e in full_text for e in exclusions)
    
    if has_target and not has_exclusion:
        return True
            
    return False

def extract_credit_data():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total files in source directory: {len(files)}")
    
    extracted_rows = []
    processed_files = 0
    failed_files = 0
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            failed_files += 1
            continue
            
        processed_files += 1
        file_extracted_count = 0
        
        last_company = ""
        last_product = ""
        
        for idx, row in df.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            if len(row_list) < 4:
                continue
                
            # Forward-fill company and product name
            curr_company = row_list[0] if len(row_list) > 0 and row_list[0] else ""
            curr_product = row_list[1] if len(row_list) > 1 and row_list[1] else ""
            
            # Check if this row is a header row (skip typical headers)
            if "보험회사" in curr_company or "상품명" in curr_product:
                continue
                
            if curr_company:
                last_company = get_clean_company_name(curr_company)
            if curr_product:
                last_product = curr_product
                
            if not last_company or not last_product:
                continue
                
            row_vals = row_list.copy()
            # If the row matches credit criteria:
            if is_credit_row([last_company, last_product] + row_vals[2:]):
                mapped_data = {}
                mapped_data["보험회사"] = last_company
                mapped_data["상품명"] = last_product
                mapped_data["구분"] = row_vals[2] if len(row_vals) > 2 else "주계약"
                mapped_data["담보명(급부명)"] = row_vals[3] if len(row_vals) > 3 else ""
                mapped_data["지급사유"] = row_vals[4] if len(row_vals) > 4 else ""
                mapped_data["지급금액"] = row_vals[5] if len(row_vals) > 5 else ""
                mapped_data["가입금액"] = row_vals[6] if len(row_vals) > 6 else ""
                
                # Premium formatting
                male_raw = row_vals[7] if len(row_vals) > 7 else ""
                female_raw = row_vals[8] if len(row_vals) > 8 else ""
                mapped_data["기준보험료"] = clean_and_format_premium(male_raw)
                mapped_data["가입보험료"] = clean_and_format_premium(female_raw)
                
                mapped_data["적용이율"] = row_vals[9] if len(row_vals) > 9 else ""
                
                # Handle details depending on column counts (25 vs 30)
                n = len(row_vals)
                if n == 30:
                    mapped_data["갱신구분"] = row_vals[24]
                    mapped_data["판매채널"] = row_vals[26]
                    mapped_data["기준일자"] = row_vals[27]
                    mapped_data["상세안내"] = row_vals[28]
                    mapped_data["연락처"] = row_vals[29]
                elif n == 25:
                    mapped_data["갱신구분"] = row_vals[19]
                    mapped_data["판매채널"] = row_vals[21]
                    mapped_data["기준일자"] = row_vals[22]
                    mapped_data["상세안내"] = row_vals[23]
                    mapped_data["연락처"] = row_vals[24]
                else:
                    # Default / Fallback mappings if col count is weird
                    mapped_data["갱신구분"] = "비갱신형"
                    mapped_data["판매채널"] = ""
                    mapped_data["기준일자"] = ""
                    mapped_data["상세안내"] = ""
                    mapped_data["연락처"] = ""
                    
                mapped_data["source_file"] = filename
                
                # Ensure fields like 갱신구분 are clean
                if not mapped_data["갱신구분"] or mapped_data["갱신구분"] == "-":
                    mapped_data["갱신구분"] = "갱신형" if "갱신" in last_product else "비갱신형"
                
                # Standard row formatting (16 columns)
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                
                # Raw row formatting (30 columns)
                padded_raw = row_vals[:30] + [""] * max(0, 30 - len(row_vals))
                
                # Full row (46 columns)
                full_row = ordered_part + padded_raw
                extracted_rows.append(full_row)
                file_extracted_count += 1
                
        if file_extracted_count > 0:
            print(f"[+] Loaded {filename} ({method}): extracted {file_extracted_count} rows")
            
    print(f"\nExtraction summary: {processed_files} files loaded successfully, {failed_files} failed.")
    print(f"Total credit insurance rows extracted: {len(extracted_rows)}")
    
    if not extracted_rows:
        print("No credit insurance rows extracted. Please verify filters.")
        return
        
    dynamic_headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(30)]
    os.makedirs(TARGET_DIR, exist_ok=True)
    df_out = pd.DataFrame(extracted_rows, columns=dynamic_headers)
    
    # Save CSV
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"Saved CSV data: {len(df_out)} rows to {csv_path}")
    
    # Save XLSX
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"Saved Excel data: {len(df_out)} rows to {xlsx_path}")

if __name__ == "__main__":
    extract_credit_data()
