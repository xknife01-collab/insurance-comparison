# -*- coding: utf-8 -*-
import os
import pandas as pd
import glob
import io
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\savings"

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
    "교보라이프플래닛", "NH농협생명", "에이스손보(라이나)", "신한라이프생명", "처브라이프생명",
    "BNP파리바카디프생명", "푸본현대생명", "ABL생명"
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
        "신한라이프": "신한라이프생명",
        "신한라이프생명": "신한라이프생명",
        "미래에셋": "미래에셋생명",
        "미래에셋생명": "미래에셋생명",
        "동양생명": "동양생명",
        "흥국생명": "흥국생명",
        "DB생명": "DB생명",
        "KDB생명": "KDB생명",
        "DGB생명": "DGB생명",
        "IBK연금": "IBK연금보험",
        "IBK연금보험": "IBK연금보험",
        "푸르덴셜": "푸르덴셜생명",
        "KB생명": "KB생명",
        "하나생명": "하나생명",
        "교보라이프": "교보라이프플래닛",
        "NH농협생명": "NH농협생명",
        "농협생명": "NH농협생명",
        "처브라이프": "처브라이프생명",
        "처브라이프생명": "처브라이프생명",
        "BNP파리바": "BNP파리바카디프생명",
        "BNP파리바카디프": "BNP파리바카디프생명",
        "BNP파리바카디프생명": "BNP파리바카디프생명",
        "푸본현대": "푸본현대생명",
        "푸본현대생명": "푸본현대생명",
        "ABL": "ABL생명",
        "ABL생명": "ABL생명"
    }
    for k, v in mapping.items():
        if k in c:
            return v
    return c

def clean_val(v):
    if pd.isna(v) or v is None:
        return ""
    return str(v).replace('\n', ' ').strip()

def clean_premium(val):
    if not val:
        return 0
    val_str = str(val).replace(',', '').replace('원', '').replace('구좌', '').strip()
    try:
        return int(float(val_str))
    except ValueError:
        return 0

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
    
    # Files to process
    files_to_process = [
        "file_51.xls",
        "file_53.xls",
        "file_55.xls",
        "장기저축성 보험 비교 공시.xls",
        "저축성_상품비교_20260406102612904.xls"
    ]
    
    processed_count = 0
    
    for filename in files_to_process:
        filepath = os.path.join(SOURCE_DIR, filename)
        if not os.path.exists(filepath):
            print(f"[-] File not found: {filename}")
            continue
            
        df, method = load_df(filepath)
        if df is None:
            print(f"[-] Failed to load file: {filename}")
            continue
            
        print(f"[*] Processing: {filename} | Shape: {df.shape} | Method: {method}")
        processed_count += 1
        
        # -------------------------------------------------------------
        # Case A: 26-column HTML files (Life Companies)
        # -------------------------------------------------------------
        if df.shape[1] == 26:
            last_company = ""
            last_product = ""
            
            for idx, row in df.iterrows():
                row_vals = [clean_val(v) for v in row.tolist()]
                if not any(row_vals):
                    continue
                
                company = row_vals[0]
                product = row_vals[1]
                duration = row_vals[2]
                
                # Skip header rows
                if company == "회사명" or "조회" in company or not duration or not any(char.isdigit() for char in duration):
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
                
                # Scan for applied rate in index 17, or fall back to finding '%' cell starting from 13
                applied_rate = row_vals[17]
                if not applied_rate or applied_rate == '-':
                    # Scan row cells for first percent match
                    for c_idx in range(13, 19):
                        val = row_vals[c_idx]
                        if val and val != '-' and '%' in val:
                            applied_rate = val
                            break
                            
                sales_channel = row_vals[22]
                base_date = row_vals[23]
                detail_desc = row_vals[24]
                phone = row_vals[25]
                payment_cycle = row_vals[21].strip() # '월납', '일시납', etc.
                
                # Determine suffix
                if "일시납" in payment_cycle:
                    suffix = "(일시납)"
                else:
                    suffix = "(월납)"
                    
                product_name = last_product
                if suffix not in product_name:
                    product_name = f"{product_name} {suffix}"
                
                # Build standardized row dict
                mapped_data = {h: "" for h in STANDARD_HEADERS}
                mapped_data["보험회사"] = last_company
                mapped_data["상품명"] = product_name
                mapped_data["구분"] = duration
                mapped_data["담보명(급부명)"] = premium
                mapped_data["지급사유"] = male_acc_amt
                mapped_data["지급금액"] = male_acc_rate
                mapped_data["가입금액"] = male_refund
                mapped_data["기준보험료"] = female_acc_amt
                mapped_data["가입보험료"] = female_acc_rate
                mapped_data["적용이율"] = applied_rate
                mapped_data["갱신구분"] = ""
                mapped_data["판매채널"] = sales_channel
                mapped_data["기준일자"] = base_date
                mapped_data["상세안내"] = detail_desc
                mapped_data["연락처"] = phone
                mapped_data["source_file"] = filename
                
                # Raw row part
                raw_part = row_vals[:30] + [""] * max(0, 30 - len(row_vals))
                
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                extracted_rows.append(ordered_part + raw_part)
                
        # -------------------------------------------------------------
        # Case B: 14-column binary files (Non-Life Companies)
        # -------------------------------------------------------------
        elif df.shape[1] == 14:
            # 1. Group rows into product blocks to apply monthly/single premium heuristic
            blocks = []
            current_block = []
            
            for idx, row in df.iterrows():
                row_vals = [clean_val(v) for v in row.tolist()]
                if not any(row_vals):
                    continue
                    
                # Skip header rows
                if "회사명" in row_vals[1] or "조회" in row_vals[0] or "장기저축성" in row_vals[0]:
                    continue
                
                duration = row_vals[3]
                if not duration or not any(char.isdigit() for char in duration):
                    continue
                    
                # A row starting a new block has non-empty company and product
                if row_vals[1] and row_vals[2]:
                    if current_block:
                        blocks.append(current_block)
                    current_block = [row_vals]
                else:
                    if current_block:
                        current_block.append(row_vals)
                        
            if current_block:
                blocks.append(current_block)
                
            # 2. Process each block
            for block in blocks:
                # Find product details
                first_row = block[0]
                company = get_clean_company(first_row[1])
                product = first_row[2]
                
                # Determine payment cycle heuristic
                # Group premiums by duration
                premiums = {}
                for r in block:
                    dur = r[3]
                    prem = clean_premium(r[7]) # index 7 is 납입보험료
                    premiums[dur] = prem
                    
                # If premium at duration > 1 is equal to premium at 1, it's single premium (일시납)
                # Let's check dur '1' and dur '3' or '5'
                is_single_premium = True
                p_1 = premiums.get('1', 0)
                p_3 = premiums.get('3', 0)
                p_5 = premiums.get('5', 0)
                
                if p_1 > 0:
                    if p_3 > 0 and p_3 > p_1 * 1.5:
                        is_single_premium = False
                    elif p_5 > 0 and p_5 > p_1 * 1.5:
                        is_single_premium = False
                else:
                    # Fallback to checking if all values are equal
                    vals = [v for v in premiums.values() if v > 0]
                    if len(set(vals)) > 1:
                        is_single_premium = False
                        
                payment_cycle = "일시납" if is_single_premium else "월납"
                suffix = f"({payment_cycle})"
                
                product_name = product
                if suffix not in product_name:
                    product_name = f"{product_name} {suffix}"
                    
                # Standardize rows in the block
                for r in block:
                    duration = r[3]
                    premium_str = r[7]
                    male_acc_amt = r[8]
                    male_acc_rate = r[9]
                    male_refund = r[10]
                    female_acc_amt = r[11]
                    female_acc_rate = r[12]
                    female_refund = r[13]
                    
                    # Build standardized row dict
                    mapped_data = {h: "" for h in STANDARD_HEADERS}
                    mapped_data["보험회사"] = company
                    mapped_data["상품명"] = product_name
                    mapped_data["구분"] = duration
                    mapped_data["담보명(급부명)"] = premium_str
                    mapped_data["지급사유"] = male_acc_amt
                    mapped_data["지급금액"] = male_acc_rate
                    mapped_data["가입금액"] = male_refund
                    mapped_data["기준보험료"] = female_acc_amt
                    mapped_data["가입보험료"] = female_acc_rate
                    mapped_data["적용이율"] = "" # Leave blank, will default to 2.80% in loader
                    mapped_data["갱신구분"] = ""
                    mapped_data["판매채널"] = ""
                    mapped_data["기준일자"] = ""
                    mapped_data["상세안내"] = ""
                    mapped_data["연락처"] = ""
                    mapped_data["source_file"] = filename
                    
                    # Raw row parts: make it 30 columns and inject payment cycle at raw index 21
                    raw_part = r[:30] + [""] * max(0, 30 - len(r))
                    raw_part[21] = payment_cycle
                    
                    ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                    extracted_rows.append(ordered_part + raw_part)
                    
    print(f"[+] Total files processed: {processed_count}")
    
    # Save CSV & Excel
    num_raw = 30
    headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(num_raw)]
    df_out = pd.DataFrame(extracted_rows, columns=headers)
    
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"[+] Saved CSV: {csv_path} | Rows: {len(df_out)}")
    
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"[+] Saved Excel: {xlsx_path}")

if __name__ == "__main__":
    run_extraction()
