import os
import pandas as pd
import io
import warnings
import xlrd
from bs4 import BeautifulSoup

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\golf_leisure"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율", 
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
]

GOLF_KEYWORDS = ["골프", "레저", "홀인원", "알바트로스", "카트", "golf", "leisure", "hole-in-one", "albatross", "오잘공", "상과염", "테니스엘보", "골프엘보"]

def load_df(filepath):
    # Try standard binary reading with cp949 first
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data)
    except Exception:
        # Fallback to standard pandas read_excel
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

def find_header_mapping(df, filename):
    # Check if this is one of the custom-formatted files (file_47, file_49, (7), (9))
    fn_lower = filename.lower()
    if "file_47" in fn_lower or "file_49" in fn_lower or "(7)" in fn_lower or "(9)" in fn_lower:
        mapping = {
            "보험회사": 1,
            "상품명": 2,
            "구분": 0,
            "담보명(급부명)": 3,
            "지급사유": 4,
            "지급금액": 5,
            "가입금액": 5,
            "기준보험료": 6,
            "가입보험료": 7,
            "상세안내": 11,
            "연락처": 12,
            "기준일자": 10
        }
        return mapping, 6
        
    mapping = {}
    header_row_idx = -1
    
    for i in range(min(15, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        # Check if row looks like a header row
        if any("상품명" in val or "회사명" in val or "보험사" in val or "급부명" in val or "담보명" in val for val in row):
            header_row_idx = i
            
            # Combine main header and sub header if the next row also has header content
            next_row = []
            if i + 1 < len(df):
                next_row = [clean_val(v) for v in df.iloc[i+1].tolist()]
            
            combined_headers = []
            for col_idx in range(len(row)):
                main_h = row[col_idx]
                sub_h = next_row[col_idx] if col_idx < len(next_row) else ""
                if main_h and sub_h:
                    combined = f"{main_h}_{sub_h}".replace(" ", "").replace("\n", "")
                elif main_h:
                    combined = main_h.replace(" ", "").replace("\n", "")
                elif sub_h:
                    combined = sub_h.replace(" ", "").replace("\n", "")
                else:
                    combined = ""
                combined_headers.append(combined)
            
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
            
            if next_row and any(k in "".join(next_row) for k in ["남자", "여자", "지급액", "보험료"]):
                header_row_idx = i + 1
            break
            
    defaults = {
        "보험회사": 0, "상품명": 1, "구분": 2, "담보명(급부명)": 3, "지급사유": 4, 
        "지급금액": 5, "가입금액": 6, "기준보험료": 7, "가입보험료": 8
    }
    for k, v in defaults.items():
        if k not in mapping: mapping[k] = v
    return mapping, header_row_idx

def extract_golf_data():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls") or f.endswith(".xlsx")]
    print(f"Total source files to scan: {len(files)}")
    
    extracted_rows = []
    processed_count = 0
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df_raw = load_df(filepath)
        if df_raw is None:
            continue
            
        cleaned_rows = []
        for idx, row in df_raw.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            if not any(row_list):
                continue
            cleaned_rows.append(row_list)
            
        if not cleaned_rows:
            continue
            
        df = pd.DataFrame(cleaned_rows)
        mapping, header_idx = find_header_mapping(df, filename)
        
        comp_col = mapping.get("보험회사", 0)
        prod_col = mapping.get("상품명", 1)
        
        last_company = ""
        last_product = ""
        
        file_extracted_count = 0
        
        for idx, row in df.iterrows():
            if idx <= header_idx:
                continue
                
            raw_list = row.tolist()
            
            # Forward-fill company and product names
            curr_company = raw_list[comp_col] if comp_col < len(raw_list) else ""
            curr_product = raw_list[prod_col] if prod_col < len(raw_list) else ""
            
            if curr_company:
                last_company = curr_company
            if curr_product:
                last_product = curr_product
                
            company_name = last_company
            product_name = last_product
            
            # Clean and check row for golf keyword matching
            row_str = " ".join(raw_list).lower()
            prod_clean = product_name.lower()
            
            is_golf = False
            if any(k in prod_clean for k in GOLF_KEYWORDS):
                is_golf = True
            elif any(k in row_str for k in GOLF_KEYWORDS):
                is_golf = True
                
            if is_golf:
                mapped_data = {}
                for h in STANDARD_HEADERS:
                    if h == "source_file":
                        mapped_data[h] = filename
                    elif h == "보험회사":
                        mapped_data[h] = company_name
                    elif h == "상품명":
                        mapped_data[h] = product_name
                    elif h in ["기준보험료", "가입보험료"]:
                        col_idx = mapping.get(h)
                        val = raw_list[col_idx] if col_idx is not None and col_idx < len(raw_list) else ""
                        if company_name == "하나생명" and val:
                            val_str = str(val).strip().replace(",", "").replace("원", "").replace(" ", "")
                            try:
                                num = float(val_str)
                                if num > 0:
                                    monthly_num = round(num / 12)
                                    mapped_data[h] = f"{monthly_num:,} 원"
                                else:
                                    mapped_data[h] = clean_and_format_premium(val)
                            except ValueError:
                                mapped_data[h] = clean_and_format_premium(val)
                        else:
                            mapped_data[h] = clean_and_format_premium(val)
                    elif h == "갱신구분":
                        col_idx = mapping.get(h)
                        val = raw_list[col_idx] if col_idx is not None and col_idx < len(raw_list) else ""
                        if not val or val == "-":
                            if "갱신" in product_name:
                                val = "갱신형"
                            else:
                                val = "비갱신형"
                        mapped_data[h] = val
                    else:
                        col_idx = mapping.get(h)
                        val = raw_list[col_idx] if col_idx is not None and col_idx < len(raw_list) else ""
                        mapped_data[h] = val
                
                # Format to exactly 16 standard columns
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                
                # Pad/slice raw unparsed columns to exactly 30 columns (16 + 30 = 46 total columns)
                padded_raw = raw_list[:30] + [""] * max(0, 30 - len(raw_list))
                
                full_row = ordered_part + padded_raw
                extracted_rows.append(full_row)
                file_extracted_count += 1
                
        if file_extracted_count > 0:
            print(f"[+] Successfully loaded {filename}: extracted {file_extracted_count} rows")
            processed_count += 1
            
    print(f"\nExtraction complete. Scanned all files, extracted {len(extracted_rows)} total rows from {processed_count} unique files.")
    
    # Format and save output
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    dynamic_headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(30)]
    df_out = pd.DataFrame(extracted_rows, columns=dynamic_headers)
    
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"[SUCCESS] Saved standardized CSV: {len(df_out)} rows to {csv_path}")
    
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"[SUCCESS] Saved standardized Excel: {len(df_out)} rows to {xlsx_path}")

if __name__ == "__main__":
    extract_golf_data()
