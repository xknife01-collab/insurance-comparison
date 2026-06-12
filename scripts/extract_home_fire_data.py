import os
import pandas as pd
import io
import re
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\home_fire"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율",
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

def parse_premium(val):
    if not val:
        return ""
    cleaned = re.sub(r'[^\d]', '', str(val))
    if cleaned.isdigit():
        return f"{int(cleaned):,} 원"
    return str(val)

def map_and_copy_fire_files(source_dir, dest_dir):
    import shutil
    import warnings
    warnings.filterwarnings('ignore')
    
    files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]
    
    file_50_found = None
    file_47_found = None
    file_38_found = None
    
    for filename in sorted(files):
        if filename in ["file_50.xls", "file_47.xls", "file_38.xls"]:
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
        
        # Check for file_50
        try:
            val_7 = str(df.iloc[7, 2])
            val_12 = str(df.iloc[12, 2])
            if "우리집" in val_7 or "119주택" in val_12 or "My리치하우스" in str(df.iloc[79, 2]):
                file_50_found = filepath
        except Exception:
            pass
            
        # Check for file_47
        if "H주택화재" in all_text or "Hi2601" in all_text or "현대해상다이렉트H" in all_text:
            if df.shape[0] > 1000:
                file_47_found = filepath
                
        # Check for file_38
        try:
            val_7 = str(df.iloc[7, 1])
            val_20 = str(df.iloc[20, 1])
            val_31 = str(df.iloc[31, 1])
            val_42 = str(df.iloc[42, 1])
            if "메리츠" in val_7 and "한화" in val_20 and "롯데" in val_31 and "흥국" in val_42:
                file_38_found = filepath
        except Exception:
            pass

    # Copy files
    if file_50_found:
        shutil.copy2(file_50_found, os.path.join(dest_dir, "file_50.xls"))
        print(f"[+] Mapped -> file_50.xls (from {os.path.basename(file_50_found)})")
    if file_47_found:
        shutil.copy2(file_47_found, os.path.join(dest_dir, "file_47.xls"))
        print(f"[+] Mapped -> file_47.xls (from {os.path.basename(file_47_found)})")
    if file_38_found:
        shutil.copy2(file_38_found, os.path.join(dest_dir, "file_38.xls"))
        print(f"[+] Mapped -> file_38.xls (from {os.path.basename(file_38_found)})")

def extract_home_fire_data():
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    # Auto-map raw files in SOURCE_DIR
    map_and_copy_fire_files(SOURCE_DIR, SOURCE_DIR)
    
    extracted_rows = []
    
    # 1. Load file_50.xls (Home Fire Insurance products)
    f50_path = os.path.join(SOURCE_DIR, "file_50.xls")
    df50 = load_df(f50_path)
    if df50 is not None:
        print(f"Loaded file_50.xls (Shape: {df50.shape})")
        ranges_50 = [
            ("메리츠화재", 7, 11),
            ("한화손보", 12, 16),
            ("삼성화재", 17, 22),
            ("KB손보", 28, 32),
            ("하나손보", 33, 37),
            ("에이스손보(라이나)", 38, 45),
            ("에이스손보(라이나)", 46, 53),
            ("エ이스손보(라이나)", 54, 61), # Note Ace / Lina names
            ("에이스손보(라이나)", 62, 68),
            ("신한EZ손보", 69, 73),
            ("신한EZ손보", 74, 78),
            ("농협손보", 79, 83), # NH Nonghyup fixed mapping
        ]
        
        for company_name, start_idx, end_idx in ranges_50:
            product_name = clean_val(df50.iloc[start_idx, 2])
            for idx in range(start_idx, end_idx + 1):
                row = df50.iloc[idx]
                row_list = [clean_val(v) for v in row.tolist()]
                
                mapped_data = {h: "" for h in STANDARD_HEADERS}
                mapped_data["보험회사"] = company_name
                mapped_data["상품명"] = product_name
                mapped_data["구분"] = "주계약" if idx == start_idx else "특약"
                mapped_data["담보명(급부명)"] = row_list[3]
                mapped_data["지급사유"] = row_list[4]
                mapped_data["지급금액"] = row_list[5]
                mapped_data["가입금액"] = row_list[5]
                
                if idx == start_idx:
                    mapped_data["기준보험료"] = parse_premium(row_list[6])
                    mapped_data["가입보험료"] = parse_premium(row_list[7])
                
                mapped_data["source_file"] = "file_50.xls"
                
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                raw_part = row_list[:30] + [""] * max(0, 30 - len(row_list))
                extracted_rows.append(ordered_part + raw_part)
    
    # 2. Load file_47.xls (Hyundai Marine & Fire H주택화재보험)
    f47_path = os.path.join(SOURCE_DIR, "file_47.xls")
    df47 = load_df(f47_path)
    if df47 is not None:
        print(f"Loaded file_47.xls (Shape: {df47.shape})")
        
        # Dynamically find the row for H주택화재상해보험
        start_idx = 1533  # fallback default
        for r_idx in range(len(df47)):
            try:
                val = str(df47.iloc[r_idx, 2]).replace(" ", "")
                if "H주택화재" in val or "Hi2601" in val:
                    start_idx = r_idx
                    break
            except Exception:
                continue
                
        end_idx = start_idx + 5
        print(f"Detected start_idx for Hyundai Marine: {start_idx} (end_idx: {end_idx})")
        
        company_name = "현대해상"
        product_name = clean_val(df47.iloc[start_idx, 2])
        
        for idx in range(start_idx, end_idx + 1):
            row = df47.iloc[idx]
            row_list = [clean_val(v) for v in row.tolist()]
            
            mapped_data = {h: "" for h in STANDARD_HEADERS}
            mapped_data["보험회사"] = company_name
            mapped_data["상품명"] = product_name
            mapped_data["구분"] = "주계약" if idx == start_idx else "특약"
            mapped_data["담보명(급부명)"] = row_list[3]
            mapped_data["지급사유"] = row_list[4]
            mapped_data["지급금액"] = row_list[5]
            mapped_data["가입금액"] = row_list[5]
            
            if idx == start_idx:
                mapped_data["기준보험료"] = parse_premium(row_list[6])
                mapped_data["가입보험료"] = parse_premium(row_list[7])
            
            mapped_data["source_file"] = "file_47.xls"
            
            ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
            raw_part = row_list[:30] + [""] * max(0, 30 - len(row_list))
            extracted_rows.append(ordered_part + raw_part)

    # 3. Load file_38.xls (Property & Commercial Fire Insurance products)
    f38_path = os.path.join(SOURCE_DIR, "file_38.xls")
    df38 = load_df(f38_path)
    if df38 is not None:
        print(f"Loaded file_38.xls (Shape: {df38.shape})")
        ranges_38 = [
            ("메리츠화재", 7, 13),
            ("메리츠화재", 14, 19),
            ("한화손보", 20, 25),
            ("한화손보", 26, 30),
            ("롯데손보", 31, 37),
            ("흥국화재", 42, 47),
            ("흥국화재", 48, 53),
            ("삼성화재", 54, 62),
            ("삼성화재", 63, 73),
            ("삼성화재", 82, 89),
            ("현대해상", 90, 95),
            ("현대해상", 96, 101),
            ("KB손보", 102, 106),
            ("KB손보", 107, 110),
            ("KB손보", 111, 115),
            ("DB손보", 116, 121),
            ("DB손보", 122, 127),
            ("DB손보", 128, 133),
            ("AXA손보", 139, 145),
        ]
        
        for company_name, start_idx, end_idx in ranges_38:
            product_name = clean_val(df38.iloc[start_idx, 2])
            for idx in range(start_idx, end_idx + 1):
                row = df38.iloc[idx]
                row_list = [clean_val(v) for v in row.tolist()]
                
                mapped_data = {h: "" for h in STANDARD_HEADERS}
                mapped_data["보험회사"] = company_name
                mapped_data["상품명"] = product_name
                mapped_data["구분"] = "주계약" if idx == start_idx else "특약"
                mapped_data["담보명(급부명)"] = row_list[3]
                mapped_data["지급사유"] = row_list[4]
                mapped_data["지급금액"] = row_list[5]
                mapped_data["가입금액"] = row_list[5]
                
                if idx == start_idx:
                    mapped_data["기준보험료"] = parse_premium(row_list[6])
                    mapped_data["가입보험료"] = parse_premium(row_list[7])
                
                mapped_data["source_file"] = "file_38.xls"
                
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                raw_part = row_list[:30] + [""] * max(0, 30 - len(row_list))
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
    extract_home_fire_data()
