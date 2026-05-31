import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\whole_life"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율",
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
]

WHOLE_LIFE_KEYWORDS = ["종신"]

def clean_val(v):
    if pd.isna(v) or v is None: return ""
    val_str = str(v).replace('\n', ' ').strip()
    if val_str.endswith(".0"):
        part = val_str[:-2]
        if part.replace("-", "", 1).isdigit():
            return part
    return val_str

def find_header_mapping(df):
    mapping = {}
    header_row_idx = -1
    
    for i in range(min(20, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        if any("상품명" in val or "보험사" in val or "회사명" in val for val in row):
            header_row_idx = i
            for col_idx, val in enumerate(row):
                v = val.replace(" ", "").replace("\n", "")
                if not v:
                    continue
                if any(k in v for k in ["보험회사", "보험사", "회사명"]): mapping["보험회사"] = col_idx
                elif "상품명" in v: mapping["상품명"] = col_idx
                elif any(k in v for k in ["구분", "주계약", "특약구분"]): mapping["구분"] = col_idx
                elif any(k in v for k in ["급부명", "담보명", "특약명", "보장명", "보장내용"]): mapping["담보명(급부명)"] = col_idx
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
        
    return mapping, header_row_idx

def load_df(filepath):
    # 1. Try reading with xlrd
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd"
    except Exception:
        pass
        
    # 2. Try reading as HTML/pseudo-xls
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
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

def process_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"[*] Total {len(files)} files scanned in {SOURCE_DIR}...")
    
    extracted_rows = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        
        if df is None:
            print(f"[!] Read failed (Skipped): {filename}")
            continue
            
        mapping, header_idx = find_header_mapping(df)
        prod_col = mapping.get("상품명", 1)
        
        file_rows_count = 0
        for idx, row in df.iterrows():
            if idx <= header_idx:
                continue
                
            row_list = [clean_val(v) for v in row.tolist()]
            if prod_col >= len(row_list):
                continue
                
            product_name = row_list[prod_col]
            if (not product_name or str(product_name).strip() == "") and prod_col + 1 < len(row_list):
                product_name = row_list[prod_col + 1]
                
            product_name = str(product_name).strip()
            if not product_name or len(product_name) < 2 or "상품명" in product_name:
                continue
                
            # Filter by Whole Life ("종신") keyword
            is_whole_life = any(k in product_name for k in WHOLE_LIFE_KEYWORDS)
            
            if is_whole_life:
                # 1. 16 Standard Columns
                ordered_part = []
                for h in STANDARD_HEADERS:
                    if h == "source_file":
                        ordered_part.append(filename)
                    else:
                        col_idx = mapping.get(h)
                        val = row_list[col_idx] if col_idx is not None and col_idx < len(row_list) else ""
                        ordered_part.append(val)
                        
                # 2. Raw Row Columns (padded/truncated to exactly 30 columns)
                raw_data_cols = row_list[:]
                if len(raw_data_cols) > 30:
                    raw_data_cols = raw_data_cols[:30]
                else:
                    raw_data_cols = raw_data_cols + [""] * (30 - len(raw_data_cols))
                    
                # Combine standard (16) + raw (30) = 46 columns
                full_row = ordered_part + raw_data_cols
                extracted_rows.append(full_row)
                file_rows_count += 1
                
        if file_rows_count > 0:
            print(f"  - {filename} ({method}): Extracted {file_rows_count} whole life rows")
            
    print(f"[*] Total whole life rows extracted: {len(extracted_rows)}")
    
    if len(extracted_rows) > 0:
        headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(30)]
        out_df = pd.DataFrame(extracted_rows, columns=headers)
        
        os.makedirs(TARGET_DIR, exist_ok=True)
        csv_file = os.path.join(TARGET_DIR, "extracted_data.csv")
        xlsx_file = os.path.join(TARGET_DIR, "extracted_data.xlsx")
        
        out_df.to_csv(csv_file, index=False, encoding='utf-8-sig')
        out_df.to_excel(xlsx_file, index=False)
        
        print(f"[+] Save completed:")
        print(f"  - CSV: {csv_file}")
        print(f"  - Excel: {xlsx_file}")
    else:
        print("[!] No whole life insurance data found.")

if __name__ == "__main__":
    process_files()
