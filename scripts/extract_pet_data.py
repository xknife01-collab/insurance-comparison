import os
import pandas as pd
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\pet"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "남성보험료", "여성보험료", "기준보험료", 
    "가입보험료", "적용이율", "갱신구분", "판매채널", "기준일자", 
    "상세안내", "연락처", "source_file"
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

def find_header_mapping(df):
    mapping = {}
    header_row_idx = -1
    
    # Inspect the first 15 rows to find the main headers
    for i in range(min(15, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        if any("상품명" in val or "회사명" in val or "보험사" in val for val in row):
            header_row_idx = i
            # If the next row contains sub-headers like '남자', '여자', let's check it
            next_row = []
            if i + 1 < len(df):
                next_row = [clean_val(v) for v in df.iloc[i+1].tolist()]
            
            combined_headers = []
            for col_idx in range(len(row)):
                main_h = row[col_idx]
                sub_h = next_row[col_idx] if col_idx < len(next_row) else ""
                
                # Combine main header and sub header
                if main_h and sub_h:
                    combined = f"{main_h}_{sub_h}".replace(" ", "").replace("\n", "")
                elif main_h:
                    combined = main_h.replace(" ", "").replace("\n", "")
                elif sub_h:
                    combined = sub_h.replace(" ", "").replace("\n", "")
                else:
                    combined = ""
                combined_headers.append(combined)
            
            # Map columns
            for col_idx, h in enumerate(combined_headers):
                h_clean = h.replace("_", "")
                if any(k in h_clean for k in ["보험회사", "보험사", "회사명"]):
                    mapping["보험회사"] = col_idx
                elif "상품명" in h_clean:
                    mapping["상품명"] = col_idx
                elif any(k in h_clean for k in ["구분", "주계약", "특약구분"]):
                    mapping["구분"] = col_idx
                elif any(k in h_clean for k in ["급부명", "담보명", "특약명", "보장명"]):
                    mapping["담보명(급부명)"] = col_idx
                elif any(k in h_clean for k in ["지급사유", "보장사유"]):
                    mapping["지급사유"] = col_idx
                elif any(k in h_clean for k in ["지급금액", "지급액"]):
                    mapping["지급금액"] = col_idx
                elif "가입금액" in h_clean:
                    mapping["가입금액"] = col_idx
                # Check for male/female premium
                elif "보험료" in h and "남" in h:
                    mapping["남성보험료"] = col_idx
                elif "보험료" in h and "여" in h:
                    mapping["여성보험료"] = col_idx
                elif "보험료" in h_clean:
                    if "남성보험료" not in mapping:
                        mapping["남성보험료"] = col_idx
                    elif "여성보험료" not in mapping:
                        mapping["여성보험료"] = col_idx
                elif any(k in h_clean for k in ["기준보험료", "월보험료", "보장보험료", "표준보험료"]):
                    mapping["기준보험료"] = col_idx
                elif any(k in h_clean for k in ["가입보험료", "실제보험료", "합계보험료", "월납보험료", "합계월보험료"]):
                    mapping["가입보험료"] = col_idx
                elif "이율" in h_clean:
                    mapping["적용이율"] = col_idx
                elif "갱신" in h_clean:
                    mapping["갱신구분"] = col_idx
                elif "채널" in h_clean:
                    mapping["판매채널"] = col_idx
                elif any(k in h_clean for k in ["일자", "기준일"]):
                    mapping["기준일자"] = col_idx
                elif any(k in h_clean for k in ["상세", "비고", "안내", "특이"]):
                    mapping["상세안내"] = col_idx
                elif any(k in h_clean for k in ["연락처", "전화", "콜센터"]):
                    mapping["연락처"] = col_idx
            
            # If sub-headers row was used, header_row_idx is i + 1
            if next_row and any(k in "".join(next_row) for k in ["남자", "여자", "지급액"]):
                header_row_idx = i + 1
            break
            
    defaults = {
        "보험회사": 0, "상품명": 1, "구분": 2, "담보명(급부명)": 3, "지급사유": 4, 
        "지급금액": 5, "가입금액": 6, "남성보험료": 7, "여성보험료": 8, 
        "기준보험료": 9, "가입보험료": 10
    }
    for k, v in defaults.items():
        if k not in mapping: mapping[k] = v
    return mapping, header_row_idx

def is_pet_insurance(product_name, filename):
    if not product_name:
        return False
    p = product_name.replace(" ", "").lower()
    fn = filename.lower()
    
    # Pet insurance keywords
    pet_keywords = ["펫", "반려견", "반려묘", "강아지", "고양이", "댕댕", "냥냥", "pet", "puppy", "cat", "개물림", "동물"]
    if any(k in p for k in pet_keywords):
        return True
    return False

def extract_pet_data():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total files in source directory: {len(files)}")
    
    extracted_rows = []
    processed_files = 0
    failed_files = 0
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            print(f"[-] Failed to load {filename} (Unsupported format)")
            failed_files += 1
            continue
            
        processed_files += 1
        mapping, header_idx = find_header_mapping(df)
        
        prod_col = mapping.get("상품명", 1)
        company_col = mapping.get("보험회사", 0)
        
        last_company = ""
        last_product = ""
        
        file_extracted_count = 0
        
        for idx, row in df.iterrows():
            if idx <= header_idx:
                continue
                
            row_list = [clean_val(v) for v in row.tolist()]
            
            # Forward-fill company and product name
            curr_company = row_list[company_col] if company_col < len(row_list) else ""
            curr_product = row_list[prod_col] if prod_col < len(row_list) else ""
            
            if curr_company:
                last_company = curr_company
            if curr_product:
                last_product = curr_product
                
            product_name = last_product
            company_name = last_company
            
            # Filter for Pet Insurance records
            if is_pet_insurance(product_name, filename):
                mapped_data = {}
                for h in STANDARD_HEADERS:
                    if h == "source_file":
                        mapped_data[h] = filename
                    elif h == "보험회사":
                        mapped_data[h] = company_name
                    elif h == "상품명":
                        mapped_data[h] = product_name
                    elif h in ["남성보험료", "여성보험료", "기준보험료", "가입보험료"]:
                        col_idx = mapping.get(h)
                        val = row_list[col_idx] if col_idx is not None and col_idx < len(row_list) else ""
                        mapped_data[h] = clean_and_format_premium(val)
                    elif h == "갱신구분":
                        col_idx = mapping.get(h)
                        val = row_list[col_idx] if col_idx is not None and col_idx < len(row_list) else ""
                        if not val:
                            if "갱신" in product_name:
                                val = "갱신형"
                            else:
                                val = "비갱신형"
                        mapped_data[h] = val
                    else:
                        col_idx = mapping.get(h)
                        val = row_list[col_idx] if col_idx is not None and col_idx < len(row_list) else ""
                        mapped_data[h] = val
                
                # Format to exactly 18 standard columns
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                
                # Format and pad/slice raw columns to exactly 28 columns (18 + 28 = 46 total)
                padded_raw = row_list[:28] + [""] * max(0, 28 - len(row_list))
                
                # Total 46 columns
                full_row = ordered_part + padded_raw
                extracted_rows.append(full_row)
                file_extracted_count += 1
                
        if file_extracted_count > 0:
            print(f"[+] Loaded {filename}: extracted {file_extracted_count} rows")
            
    print(f"\nExtraction summary: {processed_files} files loaded successfully, {failed_files} failed.")
    print(f"Total pet insurance rows extracted: {len(extracted_rows)}")
    
    if not extracted_rows:
        print("No pet insurance rows extracted. Please verify the keyword filters.")
        return
        
    # Headers formulation matching the 46 columns of caregiving
    dynamic_headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(28)]
    
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
    extract_pet_data()
