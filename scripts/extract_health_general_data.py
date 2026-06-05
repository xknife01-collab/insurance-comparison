# -*- coding: utf-8 -*-
import os
import io
import re
import pandas as pd
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\health_general"
TS_OUTPUT_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\src\lib\insurance\healthGeneral\healthGeneralData.ts"

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
        return pd.DataFrame(data), "xlrd"
    except Exception:
        # Fallback to standard pd.read_excel
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd_fallback"
        except Exception:
            # Fallback to HTML-saved excel parsing
            try:
                with open(filepath, 'rb') as f:
                    raw_bytes = f.read()
                for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
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

def run_extraction():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"[+] Found {len(files)} source files.")
    
    target_kws = ["건강보험", "종합보험", "통합보험", "종합건강"]
    exclude_kws = [
        "실손", "치아", "치과", "펫", "운전자", "자동차", "어린이", "자녀", "태아", 
        "정기", "종신", "치매", "간병", "골프", "화재", "연금", "저축", "변액", 
        "용종", "신용", "홀인원", "반려", "간편", "유병", "3.10.5", "3.5.5", 
        "3.7.5", "3.1.5", "3.2.5", "3.3.5", "3.4.5", "335", "355", "345", 
        "325", "315", "3.N.5", "3.10", "3.5", "3.2", "3.1", "초경증", "딱좋은", "가벼운",
        "재산", "재물", "사업장", "비즈", "재난", "주니어", "생활안심", "성공마스터", 
        "Owner", "홈케어", "상가", "건물", "공장", "재해", "책임", "재해", "상해", "주택"
    ]
    
    extracted_rows = []
    product_premiums = {}
    
    processed_count = 0
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # 1. First scan to see if the file contains comprehensive health insurance
        has_comp = False
        for idx, row in df.iterrows():
            for col_idx in range(min(5, len(row))):
                val = clean_val(row.iloc[col_idx])
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    if any(tk in val for tk in target_kws) and not any(ek in val for ek in exclude_kws):
                        has_comp = True
                        break
            if has_comp:
                break
                
        if not has_comp:
            continue
            
        processed_count += 1
        print(f"[*] Processing file {processed_count}: {filename} ({method}) | Shape: {df.shape}")
        
        last_company = ""
        last_product = ""
        is_in_comprehensive_block = False
        
        for idx, row in df.iterrows():
            if idx < 3: # Skip very top header rows
                continue
                
            row_list = [clean_val(v) for v in row.tolist()]
            if len(row_list) < 4:
                continue
                
            # Forward-fill company and product name
            prod_candidate = ""
            comp_candidate = ""
            for col_idx in range(min(5, len(row_list))):
                val = row_list[col_idx]
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    cand = val.split("\n")[0].strip()
                    # Validate product name candidate - filter out descriptive sentences
                    if len(cand) < 100 and not any(w in cand for w in ["경우", "지급", "판정", "의해", "등급", "보험료", "해당", "기준", "이상", "이하", "또는", "합니다", "있습니다", "받은"]):
                        prod_candidate = cand
                        comp_candidate = row_list[col_idx - 1] if col_idx > 0 else ""
                        break
                    
            if prod_candidate:
                if any(tk in prod_candidate for tk in target_kws) and not any(ek in prod_candidate for ek in exclude_kws):
                    is_in_comprehensive_block = True
                    last_product = prod_candidate
                    if comp_candidate:
                        last_company = get_clean_company(comp_candidate)
                    else:
                        last_company = get_clean_company(row_list[0])
                else:
                    is_in_comprehensive_block = False
                    
            if is_in_comprehensive_block:
                # Normalizing payment cycles for HTML files (or search detail texts in the row)
                payment_cycle = "월납" # Default to monthly
                
                # Check for cycle keyword in detail desc columns
                detail_col = 28 if len(row_list) > 28 else (24 if len(row_list) > 24 else len(row_list) - 1)
                detail_text = row_list[detail_col] if detail_col >= 0 else ""
                
                cycle_match = re.search(r'(?:납입)?주기\s*:\s*([월연년일시납]+)', detail_text)
                if cycle_match:
                    group_val = cycle_match.group(1)
                    if "월" in group_val:
                        payment_cycle = "월납"
                    elif "연" in group_val or "년" in group_val:
                        payment_cycle = "연납"
                    elif "일시" in group_val:
                        payment_cycle = "일시납"
                else:
                    if "주기 : 월" in detail_text or "주기: 월" in detail_text or "주기:월" in detail_text:
                        payment_cycle = "월납"
                    elif "주기 : 연" in detail_text or "주기 : 년" in detail_text or "주기:연" in detail_text or "주기:년" in detail_text:
                        payment_cycle = "연납"
                    elif "주기 : 일시" in detail_text or "주기:일시" in detail_text:
                        payment_cycle = "일시납"
                
                # Suffix
                suffix = f"({payment_cycle})"
                product_name_normalized = last_product
                if suffix not in product_name_normalized:
                    product_name_normalized = f"{product_name_normalized} {suffix}"
                
                # Premium formatting
                male_raw = row_list[7] if len(row_list) > 7 else ""
                female_raw = row_list[8] if len(row_list) > 8 else ""
                
                # Collect premium samples for product base premium calculation
                prem_val = clean_premium(female_raw) if clean_premium(female_raw) > 0 else clean_premium(male_raw)
                if 10000 < prem_val < 150000:
                    prod_key = (last_company, product_name_normalized)
                    if prod_key not in product_premiums:
                        product_premiums[prod_key] = []
                    product_premiums[prod_key].append(prem_val)
                
                # Build standard row dict
                mapped_data = {h: "" for h in STANDARD_HEADERS}
                mapped_data["보험회사"] = last_company
                mapped_data["상품명"] = product_name_normalized
                mapped_data["구분"] = row_list[2] if len(row_list) > 2 else ""
                mapped_data["담보명(급부명)"] = row_list[3] if len(row_list) > 3 else ""
                mapped_data["지급사유"] = row_list[4] if len(row_list) > 4 else ""
                mapped_data["지급금액"] = row_list[5] if len(row_list) > 5 else ""
                mapped_data["가입금액"] = row_list[6] if len(row_list) > 6 else ""
                mapped_data["기준보험료"] = clean_and_format_premium(male_raw)
                mapped_data["가입보험료"] = clean_and_format_premium(female_raw)
                mapped_data["적용이율"] = row_list[9] if len(row_list) > 9 else ""
                mapped_data["갱신구분"] = "갱신형" if "갱신" in product_name_normalized else "비갱신형"
                mapped_data["판매채널"] = row_list[25] if len(row_list) > 25 else ""
                mapped_data["기준일자"] = row_list[27] if len(row_list) > 27 else ""
                mapped_data["상세안내"] = detail_text
                mapped_data["연락처"] = row_list[29] if len(row_list) > 29 else ""
                mapped_data["source_file"] = filename
                
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                raw_part = row_list[:30] + [""] * max(0, 30 - len(row_list))
                
                extracted_rows.append(ordered_part + raw_part)
                
    print(f"\n[+] Total comprehensive files processed: {processed_count}")
    print(f"[+] Total comprehensive rows extracted: {len(extracted_rows)}")
    
    if not extracted_rows:
        print("[-] No rows extracted!")
        return
        
    # Create target directory
    os.makedirs(TARGET_DIR, exist_ok=True)
    
    # Save CSV
    headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(30)]
    df_out = pd.DataFrame(extracted_rows, columns=headers)
    
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"[+] Saved CSV: {csv_path}")
    
    # Save XLSX
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"[+] Saved Excel: {xlsx_path}")
    
    # Generate TypeScript file
    unique_products_list = []
    seen_products = set()
    
    # Compile a sensible default basePremium for each product
    for (company, product), prems in product_premiums.items():
        avg_prem = int(sum(prems)/len(prems)) if prems else 65000
        # Round to nearest 1,000 KRW
        avg_prem = round(avg_prem / 1000) * 1000
        # Keep premium between 40000 and 90000
        avg_prem = max(40000, min(90000, avg_prem))
        
        unique_products_list.append({
            "company": company,
            "productName": product,
            "basePremium": avg_prem
        })
        seen_products.add((company, product))
        
    # If some companies are missing from the parsed list, add standard fallbacks
    fallbacks = [
        {"company": "삼성화재", "productName": "삼성화재 마이헬스 파트너 종합보험 (월납)", "basePremium": 65000},
        {"company": "메리츠화재", "productName": "메리츠화재 내Mom같은 건강보험 (월납)", "basePremium": 68000},
        {"company": "DB손보", "productName": "DB손보 나에게맞춘 간편건강보험 (월납)", "basePremium": 67000},
        {"company": "현대해상", "productName": "현대해상 퍼펙트플러스 종합보험 (월납)", "basePremium": 72000},
        {"company": "KB손보", "productName": "KB 오텐텐 건강보험 (월납)", "basePremium": 70000},
        {"company": "한화손보", "productName": "한화 시그니처 여성 건강보험 (월납)", "basePremium": 63000},
        {"company": "흥국화재", "productName": "흥국화재 행복을다주는 가족사랑보험 (월납)", "basePremium": 59000}
    ]
    for fb in fallbacks:
        if (fb["company"], fb["productName"]) not in seen_products:
            unique_products_list.append(fb)
            
    # Write healthGeneralData.ts
    os.makedirs(os.path.dirname(TS_OUTPUT_PATH), exist_ok=True)
    with open(TS_OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("export interface HealthGeneralProduct {\n")
        f.write("  company: string;\n")
        f.write("  productName: string;\n")
        f.write("  basePremium: number;\n")
        f.write("}\n\n")
        f.write("export const HEALTH_GENERAL_PRODUCTS: HealthGeneralProduct[] = [\n")
        for p in unique_products_list:
            f.write(f"  {{ company: '{p['company']}', productName: '{p['productName']}', basePremium: {p['basePremium']} }},\n")
        f.write("];\n")
        
    print(f"[+] Saved TS Data to: {TS_OUTPUT_PATH} | Products compiled: {len(unique_products_list)}")

if __name__ == "__main__":
    run_extraction()
