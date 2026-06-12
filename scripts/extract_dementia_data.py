import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "남성보험료", "여성보험료", "기준보험료", "가입보험료", "적용이율",
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
]

def load_df(filepath):
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
    for i in range(min(20, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        if any("상품명" in val or "보험사" in val or "회사명" in val for val in row):
            header_row_idx = i
            for col_idx, val in enumerate(row):
                v = val.replace(" ", "").replace("\n", "")
                if any(k in v for k in ["보험회사", "보험사", "회사명"]): mapping["보험회사"] = col_idx
                elif "상품명" in v: mapping["상품명"] = col_idx
                elif any(k in v for k in ["구분", "주계약", "특약구분"]): mapping["구분"] = col_idx
                elif any(k in v for k in ["급부명", "담보명", "특약명", "보장명"]): mapping["담보명(급부명)"] = col_idx
                elif any(k in v for k in ["지급사유", "보장사유"]): mapping["지급사유"] = col_idx
                elif any(k in v for k in ["지급금액", "지급액"]): mapping["지급금액"] = col_idx
                elif "가입금액" in v: mapping["가입금액"] = col_idx
                elif any(k in v for k in ["기준보험료", "월보험료", "보장보험료", "표준보험료"]): mapping["기준보험료"] = col_idx
                elif any(k in v for k in ["가입보험료", "실제보험료", "합계보험료", "월납보험료", "합계월보험료"]): mapping["가입보험료"] = col_idx
                elif "이율" in v: mapping["적용이율"] = col_idx
                elif "갱신" in v: mapping["갱신구분"] = col_idx
                elif "채널" in v: mapping["판매채널"] = col_idx
                elif any(k in v for k in ["일자", "기준일"]): mapping["기준일자"] = col_idx
                elif any(k in v for k in ["상세", "비고", "안내", "특이"]): mapping["상세안내"] = col_idx
                elif any(k in v for k in ["연락처", "전화", "콜센터"]): mapping["연락처"] = col_idx
            break
            
    defaults = {"보험회사":0, "상품명":1, "구분":2, "담보명(급부명)":3, "지급사유":4, "지급금액":5, "가입금액":6, "기준보험료":7, "가입보험료":8}
    for k, v in defaults.items():
        if k not in mapping: mapping[k] = v
        
    # Dynamic description column scan if 상세안내 is missing or points to empty
    desc_col = -1
    for r in range(min(20, len(df))):
        for c in range(df.shape[1]):
            val = str(df.iloc[r, c])
            if any(k in val for k in ["가입나이", "보험료 예시", "보험료 기준", "가격지수 기준"]):
                desc_col = c
                break
        if desc_col != -1:
            break
    if desc_col != -1:
        mapping["상세안내"] = desc_col
    else:
        if "상세안내" not in mapping:
            mapping["상세안내"] = 15
            
    return mapping, header_row_idx

def extract_dementia_data():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total files in source directory: {len(files)}")
    
    extracted_rows = []
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        mapping, header_idx = find_header_mapping(df)
        
        # Determine if it has gender subheader (Double-Header layout)
        has_gender_sub = False
        if header_idx != -1 and header_idx + 1 < len(df):
            n_row = [clean_val(v) for v in df.iloc[header_idx + 1].tolist()]
            has_gender_sub = any("남자" in str(v) or "여자" in str(v) for v in n_row)
            
        prod_col = mapping.get("상품명", 1)
        company_col = mapping.get("보험회사", 0)
        
        # Forward fill variables
        last_company = ""
        last_product = ""
        
        for idx, row in df.iterrows():
            if idx <= header_idx:
                continue
                
            row_list = [clean_val(v) for v in row.tolist()]
            
            # Forward-fill company and product name
            curr_company = row_list[company_col] if company_col < len(row_list) else ""
            curr_product = row_list[prod_col] if prod_col < len(row_list) else ""
            
            # Special case for double-header: if prod_col is empty, check next column
            if not curr_product and not curr_company and has_gender_sub:
                # If they are empty, we keep using the last seen company and product
                pass
            else:
                if curr_company:
                    last_company = curr_company
                if curr_product:
                    last_product = curr_product
                    
            product_name = last_product
            company_name = last_company
            
            # Check if this row belongs to dementia insurance (contains 치매, excludes 종신)
            if product_name and "치매" in product_name and "종신" not in product_name:
                # Map standard columns
                mapped_data = {}
                for h in STANDARD_HEADERS:
                    if h == "source_file":
                        mapped_data[h] = filename
                    elif h == "보험회사":
                        mapped_data[h] = company_name
                    elif h == "상품명":
                        mapped_data[h] = product_name
                    elif h in ["남성보험료", "여성보험료"]:
                        mapped_data[h] = ""
                    else:
                        col_idx = mapping.get(h)
                        val = row_list[col_idx] if col_idx is not None and col_idx < len(row_list) else ""
                        mapped_data[h] = val
                
                # Handle layout specific premium extraction
                if has_gender_sub:
                    # In Double-Header Layout:
                    # Col 6 is Male premium, Col 7 is Female premium
                    male_raw = row_list[6] if len(row_list) > 6 else ""
                    female_raw = row_list[7] if len(row_list) > 7 else ""
                    
                    mapped_data["남성보험료"] = clean_and_format_premium(male_raw)
                    mapped_data["여성보험료"] = clean_and_format_premium(female_raw)
                    
                    # For double-header files, the standard 기준보험료 and 가입보험료 columns should be empty
                    mapped_data["기준보험료"] = ""
                    mapped_data["가입보험료"] = ""
                else:
                    # In standard files:
                    # Column mapped to '기준보험료' (default index 7) is Male premium,
                    # and column mapped to '가입보험료' (default index 8) is Female premium.
                    male_col = mapping.get("기준보험료", 7)
                    female_col = mapping.get("가입보험료", 8)
                    
                    male_raw = row_list[male_col] if male_col is not None and male_col < len(row_list) else ""
                    female_raw = row_list[female_col] if female_col is not None and female_col < len(row_list) else ""
                    
                    mapped_data["남성보험료"] = clean_and_format_premium(male_raw)
                    mapped_data["여성보험료"] = clean_and_format_premium(female_raw)
                    
                    mapped_data["기준보험료"] = ""
                    mapped_data["가입보험료"] = ""
                    
                # Clean up other text columns
                if "지급금액" in mapped_data:
                    # If we don't have 지급금액 but have 가입금액, fallback
                    # Or keep as is.
                    pass
                
                # Construct standard row list
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                # Append raw columns
                full_row = ordered_part + row_list
                extracted_rows.append(full_row)
                
    if not extracted_rows:
        print("No dementia rows extracted!")
        return
        
    # Find max length to pad
    max_len = max(len(r) for r in extracted_rows)
    padded_rows = [r + [""] * (max_len - len(r)) for r in extracted_rows]
    
    # Construct headers
    num_raw = max_len - len(STANDARD_HEADERS)
    dynamic_headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(num_raw)]
    
    # Save outputs
    os.makedirs(TARGET_DIR, exist_ok=True)
    df_out = pd.DataFrame(padded_rows, columns=dynamic_headers)
    
    # Save as CSV
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"Saved {len(padded_rows)} rows to {csv_path}")
    
    # Save as XLSX
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"Saved {len(padded_rows)} rows to {xlsx_path}")

if __name__ == "__main__":
    extract_dementia_data()
