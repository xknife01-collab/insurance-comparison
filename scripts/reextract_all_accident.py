import os
import io
import re
import pandas as pd
import numpy as np
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\accident"
TS_OUTPUT_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\lib\insurance\accident\accidentData.ts"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율",
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "납입주기", "source_file"
]

def load_df(filepath):
    # Try xlrd for binary xls
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "xlrd"
    except Exception:
        pass

    # Try HTML reader for HTML disguised as XLS
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['utf-8', 'cp949', 'euc-kr', 'utf-16']:
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

    # Try read_excel fallback
    try:
        return pd.read_excel(filepath, header=None), "read_excel_fallback"
    except Exception:
        pass

    return None, None

def clean_val(v):
    if pd.isna(v) or v is None:
        return ""
    return str(v).replace('\n', ' ').strip()

def clean_premium(v):
    v_str = str(v).replace(",", "").replace("원", "").replace(" ", "").strip()
    if not v_str or v_str == "-":
        return 0
    try:
        return int(float(v_str))
    except:
        return 0

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

def get_clean_company(c):
    c = str(c).strip().replace(' ', '')
    if not c:
        return ""
    mapping = {
        "메리츠": "메리츠화재", "한화손보": "한화손보", "한화손해보험": "한화손보",
        "롯데": "롯데손보", "롯데손보": "롯데손보", "롯데손해보험": "롯데손보",
        "흥국화재": "흥국화재", "삼성화재": "삼성화재", "현대해상": "현대해상",
        "KB손보": "KB손보", "KB손해보험": "KB손보", "DB손보": "DB손보",
        "DB손해보험": "DB손보", "하나손보": "하나손보", "하나손해보험": "하나손보",
        "농협손보": "농협손보", "NH농협손보": "농협손보", "NH농협손해보험": "농협손보",
        "신한EZ": "신한EZ손보", "신한EZ손보": "신한EZ손보", "AXA": "AXA손보",
        "AXA손보": "AXA손보", "에이스": "에이스손보", "에이스손보": "에이스손보",
        "한화생명": "한화생명", "삼성생명": "삼성생명", "교보생명": "교보생명",
        "신한라이프": "신한라이프생명", "신한라이프생명": "신한라이프생명",
        "미래에셋": "미래에셋생명", "미래에셋생명": "미래에셋생명", "동양생명": "동양생명",
        "흥국생명": "흥국생명", "DB생명": "DB생명", "KDB생명": "KDB생명",
        "DGB생명": "DGB생명", "IBK연금": "IBK연금보험", "IBK연금보험": "IBK연금보험",
        "푸르덴셜": "푸르덴셜생명", "KB생명": "KB생명", "하나생명": "하나생명",
        "교보라이프": "교보라이프플래닛", "NH농협생명": "NH농협생명", "농협생명": "NH농협생명",
        "처브라이프": "처브라이프생명", "처브라이프생명": "처브라이프생명",
        "BNP파리바": "BNP파리바카디프생명", "BNP파리바카디프": "BNP파리바카디프생명",
        "BNP파리바카디프생명": "BNP파리바카디프생명", "푸본현대": "푸본현대생명",
        "푸본현대생명": "푸본현대생명", "ABL": "ABL생명", "ABL생명": "ABL생명"
    }
    for k, v in mapping.items():
        if k in c:
            return v
    return c

def detect_payment_cycle(product_name, detail_text):
    combined = f"{product_name} {detail_text}".lower().replace(" ", "")
    
    # Precise rules for payment cycle
    if "일시납" in combined or "하루" in combined or "1회납" in combined:
        return "일시납"
    elif "연납" in combined or "년납" in combined or "1년납" in combined:
        return "연납"
    elif "월납" in combined:
        return "월납"
        
    return "월납" # Fallback default

def extract_number(val_str):
    if pd.isna(val_str):
        return 0
    s = str(val_str).replace(",", "").replace(" ", "").replace("원", "")
    if not s:
        return 0
    try:
        return float(s)
    except:
        m = re.search(r'(\d+(\.\d+)?)', s)
        if m:
            return float(m.group(1))
        return 0

def clean_concatenated_header(col_name):
    # Remove search condition prefix
    col_name = re.sub(r'^\[보험회사\].*?\[채널\].*?(전체|.*?)(_|$)', '', col_name)
    col_name = col_name.strip()
    return col_name

def get_unified_headers(df):
    # If MultiIndex columns, flatten and return
    if isinstance(df.columns, pd.MultiIndex):
        flat_cols = []
        for col in df.columns:
            parts = []
            for c in col:
                c_str = str(c).strip()
                if c_str and not c_str.startswith("Unnamed:") and c_str != "nan":
                    parts.append(c_str)
            flat_cols.append("_".join(parts))
        return flat_cols, []
        
    # If regular columns, check if the columns look like actual headers
    col_str = " ".join([str(c) for c in df.columns])
    if any(kw in col_str for kw in ["상품명", "보험회사", "회사명"]):
        return [clean_val(c) for c in df.columns], []
        
    # Otherwise, extract from first 12 rows
    header_rows = []
    for r_idx in range(min(12, len(df))):
        row_vals = [clean_val(v) for v in df.iloc[r_idx]]
        row_str = " ".join(row_vals)
        if any(kw in row_str for kw in ["상품명", "보험회사", "회사명", "담보명", "급부명", "지급사유", "보험료"]):
            header_rows.append(r_idx)
            
    if not header_rows:
        return [clean_val(c) for c in df.columns], []
        
    # Extract header rows and ffill horizontally
    header_df = df.iloc[header_rows].copy()
    header_df = header_df.replace("", np.nan).replace("nan", np.nan).ffill(axis=1)
    
    concat_headers = []
    for c_idx in range(len(df.columns)):
        parts = []
        for r_idx in range(len(header_df)):
            val = clean_val(header_df.iloc[r_idx, c_idx])
            if val and val not in parts:
                parts.append(val)
        concat_headers.append("_".join(parts))
        
    return concat_headers, header_rows

def run_extraction():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls") or f.endswith(".xlsx")]
    print(f"[+] Found {len(files)} source files in {SOURCE_DIR}.")
    
    target_kws = ["상해", "재해", "교통", "안전", "골절", "깁스"]
    exclude_kws = [
        "실손", "치아", "치과", "펫", "반려", "치매", "간병", "재가", "시설", 
        "골프", "홀인원", "알바트로스", "화재", "재물", "건물", "사업장", "비즈", 
        "연금", "저축", "대출안심", "신용", "종신", "변액", "운전자", "자동차", 
        "운전", "라이더", "어린이", "자녀", "태아", "주니어"
    ]
    
    strict_exclude_prod = [
        "사망시", "장해시", "진단시", "특약의", "원인으로", "피보험자", "피보험자가", 
        "보험기간", "치료를", "목적으로", "수술을", "이용", "이외의", "상태가", 
        "발생하였을", "사유가", "경우", "지급", "수술분류표", "급여금"
    ]

    extracted_rows = []
    processed_count = 0
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # Unified header parsing
        headers, header_rows = get_unified_headers(df)
        cleaned_headers = [clean_concatenated_header(h) for h in headers]
        df.columns = cleaned_headers
        
        col_mapping = {}
        for i, col in enumerate(df.columns):
            col_clean = col.lower().replace(" ", "").replace("\n", "")
            
            # Skip price index or refund rate columns
            if any(ek in col_clean for ek in ["지수", "비율", "이율", "환급금", "환급률", "수수료", "체결비용"]):
                continue
                
            if "보험회사" in col_clean or "회사명" in col_clean:
                col_mapping["보험회사"] = i
            elif "상품명" in col_clean:
                col_mapping["상품명"] = i
            elif "구분" in col_clean and "지급" not in col_clean:
                col_mapping["구분"] = i
            elif "급부명" in col_clean or "담보명" in col_clean:
                col_mapping["담보명(급부명)"] = i
            elif "지급사유" in col_clean:
                col_mapping["지급사유"] = i
            elif "지급금액" in col_clean:
                col_mapping["지급금액"] = i
            elif "가입금액" in col_clean:
                col_mapping["가입금액"] = i
            elif "남자" in col_clean or "남성" in col_clean or "기준보험료" in col_clean:
                col_mapping["기준보험료"] = i
            elif "여자" in col_clean or "여성" in col_clean or "가입보험료" in col_clean:
                col_mapping["가입보험료"] = i
            elif "특이사항" in col_clean or "상세안내" in col_clean or "상품특징" in col_clean:
                col_mapping["상세안내"] = i

        company_idx = col_mapping.get("보험회사", 0)
        product_idx = col_mapping.get("상품명", 1)
        
        # Verify if this file contains accident insurance
        has_accident = False
        start_row = max(header_rows) + 1 if header_rows else 3
        for idx, row in df.iterrows():
            if idx < start_row: continue
            if len(row) <= product_idx: continue
            prod_val = clean_val(row.iloc[product_idx])
            if len(prod_val) > 5 and any(k in prod_val for k in ["보험", "공시", "다이렉트", "무배당"]):
                cand = prod_val.split("\n")[0].strip()
                if any(tk in cand for tk in target_kws) and not any(ek in cand for ek in exclude_kws):
                    if not any(se in cand for se in strict_exclude_prod):
                        has_accident = True
                        break
                        
        if not has_accident:
            continue
            
        processed_count += 1
        print(f"[*] Processing file {processed_count}: {filename} ({method}) | Shape: {df.shape}")
        
        last_company = ""
        last_product = ""
        is_in_accident_block = False
        
        for idx, row in df.iterrows():
            # Skip header rows
            if idx < start_row: continue
            
            row_list = [clean_val(v) for v in row.tolist()]
            if len(row_list) <= max(company_idx, product_idx):
                continue
                
            prod_val = row_list[product_idx]
            comp_val = row_list[company_idx]
            
            # Check if this row initiates a new product block
            if len(prod_val) > 5 and any(k in prod_val for k in ["보험", "공시", "다이렉트", "무배당"]):
                cand = prod_val.split("\n")[0].strip()
                if len(cand) < 100 and not any(se in cand for se in strict_exclude_prod):
                    if any(tk in cand for tk in target_kws) and not any(ek in cand for ek in exclude_kws):
                        is_in_accident_block = True
                        last_product = cand
                        last_company = get_clean_company(comp_val if comp_val else last_company)
                    else:
                        is_in_accident_block = False
                        
            if is_in_accident_block and last_product:
                # Find detail guide text
                detail_text = ""
                detail_idx = col_mapping.get("상세안내", -1)
                if detail_idx >= 0 and len(row_list) > detail_idx:
                    detail_text = row_list[detail_idx]
                else:
                    for v in row_list:
                        if len(v) > 20:
                            detail_text += " " + v

                # Detect payment cycle
                payment_cycle_original = detect_payment_cycle(last_product, detail_text)
                payment_cycle = "월납" # Convert all payments to monthly equivalent
                
                # Standardize product name to append cycle info
                suffix = f"({payment_cycle})"
                product_name_normalized = last_product
                for c in ["(월납)", "(연납)", "(일시납)"]:
                    product_name_normalized = product_name_normalized.replace(c, "").strip()
                product_name_normalized = f"{product_name_normalized} {suffix}"
                
                mapped_data = {h: "" for h in STANDARD_HEADERS}
                mapped_data["보험회사"] = last_company
                mapped_data["상품명"] = product_name_normalized
                mapped_data["납입주기"] = payment_cycle
                
                mapped_data["구분"] = row_list[col_mapping["구분"]] if "구분" in col_mapping and len(row_list) > col_mapping["구분"] else "주계약"
                mapped_data["담보명(급부명)"] = row_list[col_mapping["담보명(급부명)"]] if "담보명(급부명)" in col_mapping and len(row_list) > col_mapping["담보명(급부명)"] else ""
                mapped_data["지급사유"] = row_list[col_mapping["지급사유"]] if "지급사유" in col_mapping and len(row_list) > col_mapping["지급사유"] else ""
                mapped_data["지급금액"] = row_list[col_mapping["지급금액"]] if "지급금액" in col_mapping and len(row_list) > col_mapping["지급금액"] else ""
                mapped_data["가입금액"] = row_list[col_mapping["가입금액"]] if "가입금액" in col_mapping and len(row_list) > col_mapping["가입금액"] else ""
                
                male_raw = row_list[col_mapping["기준보험료"]] if "기준보험료" in col_mapping and len(row_list) > col_mapping["기준보험료"] else ""
                female_raw = row_list[col_mapping["가입보험료"]] if "가입보험료" in col_mapping and len(row_list) > col_mapping["가입보험료"] else ""
                
                male_num = extract_number(male_raw)
                female_num = extract_number(female_raw)
                
                if payment_cycle_original in ["연납", "일시납"]:
                    male_num = male_num / 12.0
                    female_num = female_num / 12.0
                
                mapped_data["기준보험료"] = f"{int(round(male_num)):,} 원" if male_num > 0 else ""
                mapped_data["가입보험료"] = f"{int(round(female_num)):,} 원" if female_num > 0 else ""
                mapped_data["상세안내"] = detail_text
                mapped_data["source_file"] = filename
                
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                extracted_rows.append(ordered_part)
                
    print(f"\n[+] Total accident files processed: {processed_count}")
    print(f"[+] Total accident rows extracted: {len(extracted_rows)}")
    
    if not extracted_rows:
        print("[-] No rows extracted!")
        return
        
    os.makedirs(TARGET_DIR, exist_ok=True)
    df_out = pd.DataFrame(extracted_rows, columns=STANDARD_HEADERS)
    
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"[+] Saved CSV: {csv_path}")
    
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"[+] Saved Excel: {xlsx_path}")
    
    # Smart Combined data
    combined_rows = []
    product_premiums = {}
    seen_products = set()
    
    for (src, comp, prod), group in df_out.groupby(['source_file', '보험회사', '상품명']):
        base_row = group.iloc[0].copy()
        
        main_rows = group[group['구분'] == '주계약']
        rider_rows = group[group['구분'] == '특약']
        
        if not main_rows.empty:
            main_std = extract_number(main_rows.iloc[0].get('기준보험료', ''))
            main_act = extract_number(main_rows.iloc[0].get('가입보험료', ''))
        else:
            main_std = 0
            main_act = 0
            
        rider_std = 0
        rider_act = 0
        if not rider_rows.empty:
            for r_name, r_group in rider_rows.groupby('담보명(급부명)'):
                rider_std += extract_number(r_group.iloc[0].get('기준보험료', ''))
                rider_act += extract_number(r_group.iloc[0].get('가입보험료', ''))
                
        sum_std = main_std + rider_std
        sum_act = main_act + rider_act
        
        payment_cycle = base_row.get('납입주기', '월납')
        is_annual = payment_cycle == "연납"
        is_one_day = payment_cycle == "일시납"
        
        base_row['기준보험료'] = f"{int(sum_std):,} 원" if sum_std > 0 else ""
        base_row['가입보험료'] = f"{int(sum_act):,} 원" if sum_act > 0 else ""
        base_row['구분'] = '종합'
        base_row['담보명(급부명)'] = '주계약 및 특약 스마트 합산'
        
        prem_val = sum_act if sum_act > 0 else sum_std
        
        if is_annual:
            prem_val = prem_val / 12.0
        elif is_one_day:
            prem_val = prem_val / 12.0
            
        avg_prem = round(prem_val / 100) * 100
        if avg_prem < 5000:
            continue
            
        if comp and prod:
            prod_key = (comp, prod)
            if prod_key not in product_premiums:
                product_premiums[prod_key] = avg_prem
                combined_rows.append(base_row)

    out_df = pd.DataFrame(combined_rows)
    out_csv = os.path.join(TARGET_DIR, "extracted_data_combined.csv")
    out_xlsx = os.path.join(TARGET_DIR, "extracted_data_combined.xlsx")
    
    out_df.to_csv(out_csv, index=False, encoding='utf-8-sig')
    out_df.to_excel(out_xlsx, index=False)
    
    print(f"[+] Saved Smart Combined CSV: {out_csv}")
    print(f"[+] Saved Smart Combined Excel: {out_xlsx}")
    print(f"Original rows: {len(df_out)}, Combined rows: {len(out_df)}")
    
    unique_products_list = []
    for (company, product), premium in product_premiums.items():
        unique_products_list.append({
            "company": company,
            "productName": product,
            "basePremium": premium
        })
        seen_products.add((company, product))
        
    fallbacks = [
        {"company": "삼성화재", "productName": "삼성화재 다이렉트 착한상해보험 (월납)", "basePremium": 12000},
        {"company": "현대해상", "productName": "현대해상 다이렉트 든든상해보험 (월납)", "basePremium": 13000},
        {"company": "DB손보", "productName": "프로미라이프 참좋은상해보험 (월납)", "basePremium": 12500},
        {"company": "KB손보", "productName": "KB 다이렉트 플러스상해보험 (월납)", "basePremium": 13500},
        {"company": "메리츠화재", "productName": "메리츠화재 올바른상해보험 (월납)", "basePremium": 14000}
    ]
    for fb in fallbacks:
        if (fb["company"], fb["productName"]) not in seen_products:
            unique_products_list.append(fb)
            
    # Write TS File
    with open(TS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("export interface AccidentProduct {\n")
        f.write("  company: string;\n")
        f.write("  productName: string;\n")
        f.write("  basePremium: number;\n")
        f.write("}\n\n")
        f.write("export const ACCIDENT_PRODUCTS: AccidentProduct[] = [\n")
        for p in unique_products_list:
            p_name_escaped = p['productName'].replace("'", "\\'")
            f.write(f"  {{ company: '{p['company']}', productName: '{p_name_escaped}', basePremium: {p['basePremium']} }},\n")
        f.write("];\n")
        
    print(f"[+] Saved TS Data to: {TS_OUTPUT_PATH} | Products compiled: {len(unique_products_list)}")

if __name__ == "__main__":
    run_extraction()
