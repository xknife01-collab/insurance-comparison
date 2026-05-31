import os
import pandas as pd
import io
import warnings
import re

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility"

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

def find_header_mapping(df):
    mapping = {}
    header_row_idx = -1
    
    # 1. 텍스트 기반 헤더 감지 시도
    for i in range(min(20, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        if any("상품명" in val or "보험사" in val or "회사명" in val for val in row):
            header_row_idx = i
            break
            
    if header_row_idx != -1:
        # 헤더가 있는 경우: 2개 행을 고려하여 Foward Fill 후 합침
        row1 = [clean_val(v) for v in df.iloc[header_row_idx].tolist()]
        row2 = []
        if header_row_idx + 1 < len(df):
            row2 = [clean_val(v) for v in df.iloc[header_row_idx + 1].tolist()]
            
        row1_filled = []
        last_val = ""
        for val in row1:
            if val: last_val = val
            row1_filled.append(last_val)
            
        full_headers = []
        for col_idx in range(len(row1_filled)):
            v1 = row1_filled[col_idx]
            v2 = row2[col_idx] if col_idx < len(row2) else ""
            joined = f"{v1}_{v2}".strip("_").replace(" ", "").replace("\n", "")
            full_headers.append(joined)
            
        for col_idx, v in enumerate(full_headers):
            if any(k in v for k in ["보험회사", "보험사", "회사명"]): mapping["보험회사"] = col_idx
            elif "상품명" in v: mapping["상품명"] = col_idx
            elif any(k in v for k in ["구분", "주계약", "특약구분"]): mapping["구분"] = col_idx
            elif any(k in v for k in ["급부명", "담보명", "특약명", "보장명"]): mapping["담보명(급부명)"] = col_idx
            elif any(k in v for k in ["지급사유", "보장사유"]): mapping["지급사유"] = col_idx
            elif "지급금액" in v: mapping["지급금액"] = col_idx
            elif "가입금액" in v: mapping["가입금액"] = col_idx
            elif "보험료" in v:
                if "남" in v: mapping["기준보험료"] = col_idx
                elif "여" in v: mapping["가입보험료"] = col_idx
                elif "기준" in v: mapping["기준보험료"] = col_idx
                elif "가입" in v: mapping["가입보험료"] = col_idx
                else:
                    if "기준보험료" not in mapping: mapping["기준보험료"] = col_idx
                    elif "가입보험료" not in mapping: mapping["가입보험료"] = col_idx
            elif "이율" in v: mapping["적용이율"] = col_idx
            elif "갱신" in v: mapping["갱신구분"] = col_idx
            elif "채널" in v: mapping["판매채널"] = col_idx
            elif any(k in v for k in ["일자", "기준일"]): mapping["기준일자"] = col_idx
            elif any(k in v for k in ["상세", "비고", "안내", "특이"]): mapping["상세안내"] = col_idx
            elif any(k in v for k in ["연락처", "전화", "콜센터"]): mapping["연락처"] = col_idx

        # 2차 시도: v1만 보고 채우기
        for col_idx, val in enumerate(row1):
            v = val.replace(" ", "").replace("\n", "")
            if "보험료" in v:
                if "기준보험료" not in mapping: mapping["기준보험료"] = col_idx
                elif "가입보험료" not in mapping: mapping["가입보험료"] = col_idx

        # 데이터 시작 행 판단
        actual_header_end = header_row_idx
        if header_row_idx + 1 < len(df):
            row2 = [clean_val(v) for v in df.iloc[header_row_idx + 1].tolist()]
            if any(any(k in val for k in ["남", "여", "가입금액", "지급사유", "담보명", "보험료"]) for val in row2):
                actual_header_end = header_row_idx + 1
        return mapping, actual_header_end

    # 2. 헤더 행을 못 찾은 경우 (헤더행 = -1): 데이터 특징 분석을 통한 heuristic 추론 실행
    sample_rows = []
    for idx in range(min(30, len(df))):
        sample_rows.append([clean_val(v) for v in df.iloc[idx].tolist()])
        
    num_cols = len(df.columns)
    col_scores = {c: {"company": 0, "product": 0, "division": 0, "rider": 0, "reason": 0, "amount": 0, "premium": 0, "date": 0, "phone": 0} for c in range(num_cols)}
    
    insurance_companies = ["메리츠", "한화", "롯데", "MG", "흥국", "삼성", "현대", "KB", "DB", "라이나", "AIG", "하나", "농협", "NH", "신한", "교보", "우리", "국민", "수협", "우체국", "동양", "KDB", "푸르덴셜", "미래에셋", "시그나", "생명", "화재", "손보"]
    
    for c in range(num_cols):
        vals = [row[c] for row in sample_rows if c < len(row)]
        non_empty = [v for v in vals if v]
        if not non_empty:
            continue
            
        comp_matches = sum(1 for v in non_empty if any(company in v for company in insurance_companies))
        col_scores[c]["company"] = comp_matches / len(non_empty)
        
        prod_matches = sum(1 for v in non_empty if ("보험" in v or "(무)" in v or "공제" in v) and len(v) > 6 and len(v) < 60)
        col_scores[c]["product"] = prod_matches / len(non_empty)
        
        div_matches = sum(1 for v in non_empty if v in ["주계약", "특약", "기본계약", "기본", "주", "특", "선택특약"])
        col_scores[c]["division"] = div_matches / len(non_empty)
        
        avg_len = sum(len(v) for v in non_empty) / len(non_empty)
        reason_kws = sum(1 for v in non_empty if any(k in v for k in ["경우", "지급", "판정", "상태", "진단", "사망"]))
        if avg_len > 30 and reason_kws > 0:
            col_scores[c]["reason"] = 1.0
            
        # 가입금액 (amount) 구분 정교화
        amt_matches = sum(1 for v in non_empty if any(k in v for k in ["만원", "천만원", "억", "억원"]) and re.search(r'\d', v) and len(v) < 25)
        if amt_matches == 0:
            pure_digits = []
            for v in non_empty:
                cleaned = v.replace(",", "").replace("원", "").replace(" ", "")
                if cleaned.isdigit():
                    pure_digits.append(int(cleaned))
            if pure_digits and sum(pure_digits)/len(pure_digits) >= 1000000:
                col_scores[c]["amount"] = 1.0
            else:
                col_scores[c]["amount"] = 0.0
        else:
            col_scores[c]["amount"] = amt_matches / len(non_empty)
            
        # 보험료 (premium) 구분 정교화
        prem_matches = 0
        if not any(k in "".join(non_empty) for k in ["만원", "천만원", "억", "억원"]):
            prem_matches = sum(1 for v in non_empty if re.search(r'\d', v) and not any(k in v for k in ["경우", "지급", "판정", "상태"]) and len(v) < 15 and (any(k in v for k in ["원", ","]) or v.isdigit()))
        col_scores[c]["premium"] = prem_matches / len(non_empty)
        
        date_matches = sum(1 for v in non_empty if re.match(r'^\d{4}[-\./]\d{2}[-\./]\d{2}$', v))
        col_scores[c]["date"] = date_matches / len(non_empty)
        
        phone_matches = sum(1 for v in non_empty if re.match(r'^\d{2,4}-\d{3,4}-\d{4}$', v) or (len(v) >= 8 and len(v) <= 12 and v.isdigit()))
        col_scores[c]["phone"] = phone_matches / len(non_empty)
        
        # 담보명(rider) 구분 정교화
        num_unique = len(set(non_empty))
        is_rider = True
        if avg_len < 3 or avg_len > 35:
            is_rider = False
        if any(company in "".join(non_empty) for company in insurance_companies):
            is_rider = False
        if any(v in ["주계약", "특약", "기본계약", "기본", "주", "특", "선택특약"] for v in non_empty):
            is_rider = False
        if re.search(r'\d{4}[-\./]\d{2}[-\./]\d{2}', "".join(non_empty)):
            is_rider = False
        if re.search(r'\d{2,4}-\d{3,4}-\d{4}', "".join(non_empty)):
            is_rider = False
            
        digit_only_ratio = sum(1 for v in non_empty if v.replace(",", "").replace("원", "").replace(" ", "").isdigit()) / len(non_empty)
        if digit_only_ratio > 0.5:
            is_rider = False
            
        if is_rider and num_unique >= 3:
            col_scores[c]["rider"] = 1.0
        else:
            col_scores[c]["rider"] = 0.0

    def get_best_col(score_key, threshold=0.3, exclude_cols=[]):
        best_col = None
        best_score = -1
        for c in range(num_cols):
            if c in exclude_cols: continue
            score = col_scores[c][score_key]
            if score > best_score and score >= threshold:
                best_score = score
                best_col = c
        return best_col

    mapping["보험회사"] = get_best_col("company", threshold=0.4)
    mapping["상품명"] = get_best_col("product", threshold=0.4, exclude_cols=[mapping.get("보험회사")])
    mapping["구분"] = get_best_col("division", threshold=0.4)
    mapping["지급사유"] = get_best_col("reason", threshold=0.5)
    mapping["기준일자"] = get_best_col("date", threshold=0.5)
    mapping["연락처"] = get_best_col("phone", threshold=0.5)
    
    exclude = [mapping.get(k) for k in ["보험회사", "상품명", "구분", "지급사유"] if mapping.get(k) is not None]
    mapping["담보명(급부명)"] = get_best_col("rider", threshold=0.3, exclude_cols=exclude)
    
    exclude = [mapping.get(k) for k in ["보험회사", "상품명", "구분", "지급사유", "담보명(급부명)"] if mapping.get(k) is not None]
    mapping["가입금액"] = get_best_col("amount", threshold=0.3, exclude_cols=exclude)
    mapping["지급금액"] = mapping["가입금액"]
    
    exclude = [mapping.get(k) for k in ["보험회사", "상품명", "구분", "지급사유", "담보명(급부명)", "가입금액", "기준일자", "연락처"] if mapping.get(k) is not None]
    
    premium_cols = []
    for c in range(num_cols):
        if c in exclude: continue
        if col_scores[c]["premium"] >= 0.5:
            premium_cols.append(c)
            
    if len(premium_cols) >= 2:
        mapping["기준보험료"] = premium_cols[0]
        mapping["가입보험료"] = premium_cols[1]
    elif len(premium_cols) == 1:
        mapping["기준보험료"] = premium_cols[0]
        mapping["가입보험료"] = premium_cols[0]
        
    defaults = {"보험회사":0, "상품명":1, "구분":2, "담보명(급부명)":3, "지급사유":4, "지급금액":5, "가입금액":6, "기준보험료":7, "가입보험료":8}
    for k, v in defaults.items():
        if k not in mapping or mapping[k] is None:
            mapping[k] = v
            
    return mapping, -1

def extract_home_facility_data():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total .xls files in source directory: {len(files)}")
    
    extracted_rows = []
    BAD_KEYWORDS = [
        '배상', '화재', '실손', '의료비', '물적', '대인', '대물', 
        '재물', '낙뢰', '붕괴', '반려견', '반려묘', '펫', '골프', '화재보험',
        '일상생활', '벌금'
    ]
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        mapping, header_idx = find_header_mapping(df)
        prod_col = mapping.get("상품명", 1)
        company_col = mapping.get("보험회사", 0)
        rider_col = mapping.get("담보명(급부명)", 3)
        
        target_products = set()
        
        # Pass 1: Identify target products containing home/facility riders
        last_product = ""
        for idx, row in df.iterrows():
            if idx <= header_idx:
                continue
            row_list = [clean_val(v) for v in row.tolist()]
            
            curr_product = row_list[prod_col] if prod_col < len(row_list) else ""
            if curr_product:
                last_product = curr_product
                
            product_name = last_product
            rider_name = row_list[rider_col] if rider_col < len(row_list) else ""
            
            # 종신 상품 제외
            if not product_name or "종신" in product_name:
                continue

            is_ltc = False

            # ── 재가급여 서비스 키워드 ──────────────────────────────────────────
            # 재가 in rider name (excluding 재가입 and 재가급여지원금)
            if '재가' in rider_name and '재가입' not in rider_name:
                is_ltc = True
            # ── 시설/방문요양/주야간 서비스 키워드 ──────────────────────────────
            elif any(k in rider_name for k in [
                '시설급여', '시설입소', '시설보장', '시설지원', '시설이용',
                '시설식사', '시설상급', '방문요양', '주야간', '주·야간',
                '단기보호', '요양원', '집에서집중간병', '복지용구급여',
                '간병인및장기요양', '복합재가'
            ]):
                is_ltc = True
            # ── 장기요양급여금 (서비스 급여형) – 재가/시설/주야간 등 서비스 구분 있는 것만 ──
            elif '장기요양급여금' in rider_name:
                # 장기요양급여금 with a specific service type (재가급여, 시설급여, 주야간보호, 복지용구)
                if any(k in rider_name for k in ['재가급여', '시설급여', '주야간보호', '복지용구', '방문요양']):
                    is_ltc = True
            # ── 보장특약 중 장기요양(1-인지지원등급)보장특약, 주야간보호보장특약 등 ──
            elif '장기요양' in rider_name and any(k in rider_name for k in [
                '주야간보호', '방문요양', '재가', '시설', '복지용구'
            ]):
                is_ltc = True
            # ── 상품명으로 재가/시설 명시 ────────────────────────────────────────
            elif any(k in product_name for k in ['재가', '시설']) and not any(k in product_name for k in ['시설물', '시설소유', '화재', '재가입']):
                is_ltc = True

            if is_ltc:
                # 치매/간병 상품 제외 규칙 적용
                # 1. 상품명에 '치매'가 들어가면 제외
                # 2. 상품명에 '간병'이 들어가면서 '요양', '재가', '시설' 키워드가 들어가지 않으면 제외
                is_dementia_caregiving = False
                if '치매' in product_name:
                    is_dementia_caregiving = True
                elif '간병' in product_name:
                    if not any(k in product_name for k in ['요양', '재가', '시설']):
                        is_dementia_caregiving = True
                
                if not is_dementia_caregiving:
                    # Filter out bad categories from rider name
                    if not any(bad in rider_name or bad in product_name for bad in BAD_KEYWORDS):
                        target_products.add(product_name)
                    
        if not target_products:
            continue
            
        # Pass 2: Extract all rows for target products
        last_company = ""
        last_product = ""
        file_extracted_count = 0
        
        for idx, row in df.iterrows():
            if idx <= header_idx:
                continue
            row_list = [clean_val(v) for v in row.tolist()]
            
            curr_company = row_list[company_col] if company_col < len(row_list) else ""
            curr_product = row_list[prod_col] if prod_col < len(row_list) else ""
            
            if curr_company: last_company = curr_company
            if curr_product: last_product = curr_product
            
            product_name = last_product
            company_name = last_company
            
            if product_name in target_products:
                mapped_data = {}
                for h in STANDARD_HEADERS:
                    if h == "source_file":
                        mapped_data[h] = filename
                    elif h == "보험회사":
                        mapped_data[h] = company_name
                    elif h == "상품명":
                        mapped_data[h] = product_name
                    else:
                        col_idx = mapping.get(h)
                        val = row_list[col_idx] if col_idx is not None and col_idx < len(row_list) else ""
                        mapped_data[h] = val
                        
                ordered_part = [mapped_data[h] for h in STANDARD_HEADERS]
                # Pad/truncate raw columns to exactly 30 columns
                raw_part = row_list[:30] + [""] * max(0, 30 - len(row_list))
                
                full_row = ordered_part + raw_part
                extracted_rows.append(full_row)
                file_extracted_count += 1
                
        print(f"  [+] {filename}: Extracted {file_extracted_count} rows for products: {list(target_products)}")
        
    def parse_premium(val):
        if not val:
            return 0
        cleaned = re.sub(r'[^\d]', '', str(val))
        if cleaned.isdigit():
            return int(cleaned)
        return 0

    if not extracted_rows:
        print("No home/facility care rows extracted!")
        return

    # Construct final DataFrame
    num_raw = 30
    dynamic_headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(num_raw)]
    
    os.makedirs(TARGET_DIR, exist_ok=True)
    df_out = pd.DataFrame(extracted_rows, columns=dynamic_headers)

    # 1. Drop duplicates based on all columns except 'source_file'
    compare_cols = [c for c in dynamic_headers if c != 'source_file']
    before_len = len(df_out)
    df_out = df_out.drop_duplicates(subset=compare_cols).reset_index(drop=True)
    print(f"Deduplicated rows: {before_len} -> {len(df_out)}")

    # 2. Convert raw premiums to normalized values (including dividing by 12 for non-life insurers) for each row individually
    for idx, row in df_out.iterrows():
        company = row['보험회사']
        raw_base = row['기준보험료']
        raw_join = row['가입보험료']
        
        base_val = parse_premium(raw_base)
        join_val = parse_premium(raw_join)
        
        # Normalize annual premiums to monthly premiums (divide by 12) for Non-life insurers
        if company in ['DB손보', '메리츠화재', '한화손보', '현대해상', '흥국화재', '농협손보']:
            base_val = round(base_val / 12)
            join_val = round(join_val / 12)
            
        df_out.at[idx, '기준보험료'] = f"{base_val:,} 원" if base_val > 0 else "0 원"
        df_out.at[idx, '가입보험료'] = f"{join_val:,} 원" if join_val > 0 else "0 원"
    
    # Save as CSV with utf-8-sig (Excel-friendly encoding for Korean characters)
    csv_path = os.path.join(TARGET_DIR, "extracted_data.csv")
    df_out.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"\nSaved {len(df_out)} rows to {csv_path}")
    
    # Save as XLSX
    xlsx_path = os.path.join(TARGET_DIR, "extracted_data.xlsx")
    df_out.to_excel(xlsx_path, index=False)
    print(f"Saved {len(df_out)} rows to {xlsx_path}")

if __name__ == "__main__":
    extract_home_facility_data()
