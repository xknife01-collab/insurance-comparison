import os
import pandas as pd
import glob
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\pension"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율",
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
]

KNOWN_COMPANIES = {
    "메리츠화재", "한화손보", "롯데손보", "흥국화재", "삼성화재", "현대해상", "KB손보", "DB손보",
    "하나손보", "농협손보", "신한EZ손보", "AXA손보", "에이스손보", "AIG손보", "카카오페이손보",
    "삼성생명", "한화생명", "교보생명", "신한라이프", "미래에셋생명", "동양생명", "흥국생명",
    "DB생명", "KDB생명", "DGB생명", "IBK연금", "IBK연금보험", "푸르덴셜생명", "KB생명", "하나생명",
    "교보라이프플래닛", "NH농협생명", "에이스손보(라이나)"
}

def get_clean_company(c):
    c = str(c).strip().replace(' ', '')
    if not c:
        return ""
    mapping = {
        "메리츠": "메리츠화재",
        "한화손보": "한화손보",
        "한화손해보험": "한화손보",
        "롯데": "롯데손보",
        "롯데손보": "롯데손보",
        "롯데손해보험": "롯데손보",
        "흥국화재": "흥국화재",
        "삼성화재": "삼성화재",
        "현대해상": "현대해상",
        "KB손보": "KB손보",
        "KB손해보험": "KB손보",
        "DB손보": "DB손보",
        "DB손해보험": "DB손보",
        "하나손보": "하나손보",
        "하나손해보험": "하나손보",
        "농협손보": "농협손보",
        "NH농협손보": "농협손보",
        "NH농협손해보험": "농협손보",
        "신한EZ": "신한EZ손보",
        "신한EZ손보": "신한EZ손보",
        "AXA": "AXA손보",
        "AXA손보": "AXA손보",
        "에이스": "에이스손보",
        "에이스손보": "에이스손보",
        "한화생명": "한화생명",
        "삼성생명": "삼성생명",
        "교보생명": "교보생명",
        "신한라이프": "신한라이프",
        "미래에셋": "미래에셋생명",
        "미래에셋생명": "미래에셋생명",
        "동양생명": "동양생명",
        "흥국생명": "흥국생명",
        "DB생명": "DB생명",
        "KDB생명": "KDB생명",
        "DGB생명": "DGB생명",
        "IBK연금": "IBK연금보험",
        "푸르덴셜": "푸르덴셜생명",
        "KB생명": "KB생명",
        "하나생명": "하나생명",
        "교보라이프": "교보라이프플래닛",
        "NH농협생명": "NH농협생명",
        "농협생명": "NH농협생명"
    }
    for k, v in mapping.items():
        if k in c:
            return v
    return c

def clean_val(v):
    if pd.isna(v) or v is None:
        return ""
    return str(v).replace('\n', ' ').strip()

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
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd_default"
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

def run_extraction():
    os.makedirs(TARGET_DIR, exist_ok=True)
    extracted_rows = []
    
    files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.xls")))
    print(f"Total files found in source dir: {len(files)}")
    
    pension_files_processed = 0
    
    for filepath in files:
        filename = os.path.basename(filepath)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # Check if this file contains pension/annuity data
        has_pension_keywords = False
        for idx, row in df.iterrows():
            row_str = " ".join([str(v) for v in row.dropna().tolist()])
            if any(k in row_str for k in ['연금저축', '연금보험', '연금비교', '변액연금']):
                has_pension_keywords = True
                break
                
        if not has_pension_keywords:
            continue
            
        print(f"Processing pension file: {filename} | Shape: {df.shape} | Method: {method}")
        pension_files_processed += 1
        
        last_company = ""
        last_product = ""
        
        for idx, row in df.iterrows():
            row_vals = [clean_val(v) for v in row.tolist()]
            if not any(row_vals):
                continue
                
            cols_count = len(row_vals)
            
            # Map columns according to layout shape
            if cols_count == 11:
                # Group A: 11 columns (Excel standard)
                # Raw cols: [Select, Company, Product, Duration, Premium, MaleAccAmt, MaleAccRate, MaleRefund, FemaleAccAmt, FemaleAccRate, FemaleRefund]
                company = row_vals[1]
                product = row_vals[2]
                duration = row_vals[3]
                
                if not duration or not any(char.isdigit() for char in duration):
                    continue
                if company:
                    last_company = get_clean_company(company)
                if product:
                    last_product = product
                    
                if not last_company or not last_product:
                    continue
                    
                premium = row_vals[4]
                male_acc_amt = row_vals[5]
                male_acc_rate = row_vals[6]
                male_refund = row_vals[7]
                female_acc_amt = row_vals[8]
                female_acc_rate = row_vals[9]
                female_refund = row_vals[10]
                
                applied_rate = ""
                renew_type = ""
                sales_channel = ""
                base_date = ""
                detail_desc = ""
                phone = ""
                
            elif cols_count == 19:
                # Group B: 19 columns (HTML life)
                company = row_vals[0]
                product = row_vals[1]
                duration = row_vals[2]
                
                if not duration or not any(char.isdigit() for char in duration):
                    continue
                if company:
                    last_company = get_clean_company(company)
                if product:
                    last_product = product
                    
                if not last_company or not last_product:
                    continue
                    
                premium = row_vals[3]
                male_acc_amt = row_vals[4]
                male_acc_rate = row_vals[5]
                male_refund = row_vals[6]
                female_acc_amt = row_vals[7]
                female_acc_rate = row_vals[8]
                female_refund = row_vals[9]
                
                applied_rate = row_vals[11]
                renew_type = row_vals[12]
                sales_channel = row_vals[15]
                base_date = row_vals[16]
                detail_desc = row_vals[17]
                phone = row_vals[18]
                
            elif cols_count == 25:
                # Group C: 25 columns (HTML variable)
                company = row_vals[0]
                product = row_vals[1]
                duration = row_vals[2]
                
                if not duration or not any(char.isdigit() for char in duration):
                    continue
                if company:
                    last_company = get_clean_company(company)
                if product:
                    last_product = product
                    
                if not last_company or not last_product:
                    continue
                    
                premium = row_vals[3]
                male_acc_amt = row_vals[4]
                male_acc_rate = row_vals[5]
                male_refund = row_vals[6]
                female_acc_amt = row_vals[7]
                female_acc_rate = row_vals[8]
                female_refund = row_vals[9]
                
                applied_rate = ""
                renew_type = ""
                sales_channel = row_vals[21]
                base_date = row_vals[22]
                detail_desc = row_vals[23]
                phone = row_vals[24]
                
            elif cols_count == 26:
                # Group D: 26 columns (HTML life savings)
                company = row_vals[0]
                product = row_vals[1]
                duration = row_vals[2]
                
                if not duration or not any(char.isdigit() for char in duration):
                    continue
                if company:
                    last_company = get_clean_company(company)
                if product:
                    last_product = product
                    
                if not last_company or not last_product:
                    continue
                    
                premium = row_vals[3]
                male_acc_amt = row_vals[4]
                male_acc_rate = row_vals[5]
                male_refund = row_vals[6]
                female_acc_amt = row_vals[7]
                female_acc_rate = row_vals[8]
                female_refund = row_vals[9]
                
                applied_rate = row_vals[17]
                renew_type = ""
                sales_channel = row_vals[22]
                base_date = row_vals[23]
                detail_desc = row_vals[24]
                phone = row_vals[25]
                
            else:
                # Skip any row with unexpected column count
                continue
                
            # Build standardized row dict
            mapped_data = {h: "" for h in STANDARD_HEADERS}
            mapped_data["보험회사"] = last_company
            mapped_data["상품명"] = last_product
            mapped_data["구분"] = duration
            mapped_data["담보명(급부명)"] = premium
            mapped_data["지급사유"] = male_acc_amt
            mapped_data["지급금액"] = male_acc_rate
            mapped_data["가입금액"] = male_refund
            mapped_data["기준보험료"] = female_acc_amt
            mapped_data["가입보험료"] = female_acc_rate
            mapped_data["적용이율"] = applied_rate
            mapped_data["갱신구분"] = renew_type
            mapped_data["판매채널"] = sales_channel
            mapped_data["기준일자"] = base_date
            mapped_data["상세안내"] = detail_desc
            mapped_data["연락처"] = phone
            mapped_data["source_file"] = filename
            
            # Format row
            ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
            # Pads raw row parts up to 30 columns
            raw_part = row_vals[:30] + [""] * max(0, 30 - len(row_vals))
            
            extracted_rows.append(ordered_part + raw_part)
            
    print(f"Processed {pension_files_processed} pension files in total.")
    
    # Write to DataFrame
    num_raw = 30
    dynamic_headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(num_raw)]
    df_out = pd.DataFrame(extracted_rows, columns=dynamic_headers)
    
    # Save CSV with UTF-8 BOM encoding for proper Korean excel visualization
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"Successfully extracted {len(df_out)} rows and saved to {csv_path}")
    
    # Save XLSX
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"Successfully saved to {xlsx_path}")

if __name__ == "__main__":
    run_extraction()
