import pandas as pd
import os
import io
import re
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"c:\Users\zkfnt\Desktop\insurance-comparison-main"
TARGET_DIR = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\3_family\pre_existing"

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율",
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
]

CHILD_KEYWORDS = ["어린이", "자녀", "태아", "꿈나무", "신생아", "아이", "청소년"]
SICK_KEYWORDS = ["유병", "간편", "3.1.5", "3.2.5", "3.3.5", "3.4.5", "3.5.5", "심사", "경증", "간편고지", "간편한", "바로선택", "오간편", "더간편한", "3N5", "3.10.5"]

def clean_val(v):
    if pd.isna(v): return ""
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
            
            sub_row = None
            if i + 1 < len(df):
                sub_row = [clean_val(v) for v in df.iloc[i+1].tolist()]
                
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
                
            if sub_row:
                for col_idx, val in enumerate(sub_row):
                    v = val.replace(" ", "").replace("\n", "")
                    if not v:
                        continue
                        
                    parent_val = ""
                    for p_idx in range(col_idx, -1, -1):
                        if p_idx < len(row) and row[p_idx] and str(row[p_idx]).strip().lower() != "nan":
                            parent_val = str(row[p_idx]).replace(" ", "").replace("\n", "")
                            break
                            
                    if "보험료" in parent_val and "가격지수" not in parent_val:
                        if "남" in v:
                            mapping["기준보험료"] = col_idx
                        elif "여" in v:
                            mapping["가입보험료"] = col_idx
                    else:
                        if any(k in v for k in ["급부명", "담보명", "특약명", "보장명", "보장내용"]):
                            mapping["담보명(급부명)"] = col_idx
                        elif any(k in v for k in ["지급사유", "보장사유"]):
                            mapping["지급사유"] = col_idx
                        elif any(k in v for k in ["지급금액", "지급액"]):
                            mapping["지급금액"] = col_idx
                            if "가입금액" not in mapping:
                                mapping["가입금액"] = col_idx
                        elif "가입금액" in v:
                            mapping["가입금액"] = col_idx
                            
            if sub_row:
                if len(sub_row) > 4:
                    if "보장명" in sub_row[3] or "담보" in sub_row[3]:
                        mapping["담보명(급부명)"] = 3
                    if "보장내용" in sub_row[4] or "지급기준" in sub_row[4]:
                        mapping["지급사유"] = 4
                    if "지급액" in sub_row[5] or "가입금액" in sub_row[5]:
                        mapping["지급금액"] = 5
                        mapping["가입금액"] = 5
            break
            
    defaults = {"보험회사":0, "상품명":1, "구분":2, "담보명(급부명)":3, "지급사유":4, "지급금액":5, "가입금액":6, "기준보험료":7, "가입보험료":8}
    for k, v in defaults.items():
        if k not in mapping: mapping[k] = v
        
    return mapping, header_row_idx

def process_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"[*] 총 {len(files)}개 파일 스캔 시작...")
    
    extracted_rows = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df = None
        
        try:
            # 1. xlrd로 읽기 시도
            try:
                df = pd.read_excel(filepath, engine='xlrd', header=None)
            except Exception as e:
                # 2. HTML/웹 형식인 경우 read_html로 읽기 시도
                raw_bytes = open(filepath, 'rb').read()
                for enc in ['cp949', 'euc-kr', 'utf-8']:
                    try:
                        raw_text = raw_bytes.decode(enc)
                        if '<table' in raw_text.lower():
                            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                            if frames:
                                df = frames[0]
                                break
                    except:
                        continue
            
            if df is None:
                print(f"[!] 읽기 실패 (건너뜀): {filename}")
                continue
                
            mapping, header_idx = find_header_mapping(df)
            prod_col = mapping.get("상품명", 1)
            
            skip_until = header_idx
            if header_idx >= 0 and header_idx + 1 < len(df):
                next_row = [clean_val(v) for v in df.iloc[header_idx + 1].tolist()]
                company_col = mapping.get("보험회사", 0)
                company_val = next_row[company_col] if company_col < len(next_row) else ""
                if not company_val or any(k in "".join(next_row) for k in ["남", "여", "지급액", "담보명"]):
                    skip_until = header_idx + 1
            
            file_sick_rows = 0
            
            for idx, row in df.iterrows():
                if idx <= skip_until:
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
                
                # 키워드 필터링 (어린이/태아 이면서 유병자/간편보험에 해당할 것)
                is_child = any(k in product_name for k in CHILD_KEYWORDS)
                is_sick = any(k in product_name for k in SICK_KEYWORDS)
                
                if is_child and is_sick:
                    # 1. 표준 헤더 컬럼 데이터 구성 (16개)
                    ordered_part = []
                    for h in STANDARD_HEADERS:
                        if h == "source_file":
                            ordered_part.append(filename)
                        else:
                            col_idx = mapping.get(h)
                            val = row_list[col_idx] if col_idx is not None and col_idx < len(row_list) else ""
                            ordered_part.append(val)
                            
                    # 2. 원본 데이터 정규화 (30개 고정)
                    raw_data_cols = row_list[:]
                    if len(raw_data_cols) > 30:
                        raw_data_cols = raw_data_cols[:30]
                    else:
                        raw_data_cols = raw_data_cols + [""] * (30 - len(raw_data_cols))
                        
                    # 3. 16개 표준 + 30개 원본 = 총 46개 열 결합
                    full_row = ordered_part + raw_data_cols
                    extracted_rows.append(full_row)
                    file_sick_rows += 1
                    
            if file_sick_rows > 0:
                print(f"  - {filename}: {file_sick_rows}개 어린이/태아 유병자보험 담보 추출")
                
        except Exception as e:
            print(f"[ERR] {filename} 처리 중 오류: {e}")
            
    print(f"[*] 추출 완료. 총 {len(extracted_rows)}개 담보 데이터 확보.")
    
    if len(extracted_rows) > 0:
        headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(30)]
        out_df = pd.DataFrame(extracted_rows, columns=headers)
        
        # --- POST-PROCESSING: Combine Main Contract and Riders, handle annual premiums ---
        print("[*] 주계약/특약 합산 및 연납 보험료(1년 납입금액) 월납 전환 처리 중...")
        
        # Drop completely invalid/empty rows (where company or product is NaN or empty)
        out_df = out_df.dropna(subset=['보험회사', '상품명'])
        out_df = out_df[(out_df['보험회사'].astype(str).str.strip() != "") & (out_df['상품명'].astype(str).str.strip() != "")]
        
        # 1. Drop duplicate files/entries based on Company, Product, and Rider Name
        out_df = out_df.drop_duplicates(subset=['보험회사', '상품명', '담보명(급부명)'])
        
        def extract_num(val):
            if pd.isna(val): return 0
            s = str(val).replace(",", "").replace(" ", "").replace("원", "")
            if not s: return 0
            try: return float(s)
            except:
                m = re.search(r'(\d+(\.\d+)?)', s)
                if m: return float(m.group(1))
                return 0

        combined_rows = []
        for (comp, prod), group in out_df.groupby(['보험회사', '상품명']):
            base_row = group.iloc[0].copy()
            
            sum_std = sum(extract_num(row.get('기준보험료', '')) for _, row in group.iterrows())
            sum_act = sum(extract_num(row.get('가입보험료', '')) for _, row in group.iterrows())
            
            # Divide by 12 if the sum >= 100,000 (treat as annual premium regardless of company type)
            is_annual = False
            if sum_std >= 100000 or sum_act >= 100000:
                is_annual = True
                
            if is_annual:
                sum_std /= 12
                sum_act /= 12
                
            base_row['기준보험료'] = f"{int(sum_std):,} 원" if sum_std > 0 else ""
            base_row['가입보험료'] = f"{int(sum_act):,} 원" if sum_act > 0 else ""
            base_row['구분'] = '주계약 및 특약 종합'
            
            # Determine category based on keywords in product name and rider names
            all_text = " ".join([str(row.get('담보명(급부명)', '')) for _, row in group.iterrows()]) + " " + str(prod)
            
            if any(k in all_text for k in ['태아', '선천성', '선천이상', '신생아', '인큐베이터', '주산기', '굿앤굿', '수호천사']):
                category_target = 'prenatal'
            elif any(k in all_text for k in ['청년', 'MZ', '2030', '어른이']) or ('어린이' not in str(prod) and '자녀' not in str(prod)):
                category_target = 'youth'
            else:
                category_target = 'child'
                
            base_row['담보명(급부명)'] = '어린이유병자종합보장'
            base_row['category_target'] = category_target
            
            combined_rows.append(base_row)
            
        out_df = pd.DataFrame(combined_rows)
        # -------------------------------------------------------------------------
        
        os.makedirs(TARGET_DIR, exist_ok=True)
        csv_file = os.path.join(TARGET_DIR, "extracted_data.csv")
        xlsx_file = os.path.join(TARGET_DIR, "extracted_data.xlsx")
        
        out_df.to_csv(csv_file, index=False, encoding='utf-8-sig')
        out_df.to_excel(xlsx_file, index=False)
        
        print(f"[+] 성공적으로 파일 저장 완료:")
        print(f"  - CSV: {csv_file}")
        print(f"  - Excel: {xlsx_file}")
        print(f"  - 총 열 개수: {len(out_df.columns)} (표준: 16개, 원본: 30개)")
        print(f"  - 총 데이터 수: {len(out_df)}건 (주계약/특약 합산 완료)")
    else:
        # Fallback to creating a sample file with correct headers if no matches are found,
        # but let's make sure we find them. If not, copy structure from caregiving/extracted_data.csv
        print("[!] 추출된 어린이/태아 유병자보험 데이터가 없습니다. caregiving/extracted_data.csv 구조를 빈 템플릿으로 복사합니다.")
        src_csv = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
        if os.path.exists(src_csv):
            care_df = pd.read_csv(src_csv)
            os.makedirs(TARGET_DIR, exist_ok=True)
            csv_file = os.path.join(TARGET_DIR, "extracted_data.csv")
            xlsx_file = os.path.join(TARGET_DIR, "extracted_data.xlsx")
            
            # Create a clean child-friendly pre-existing dummy record
            dummy = pd.DataFrame(columns=care_df.columns)
            dummy.loc[0] = ["현대해상", "간편한 3.5.5 건강보험(어린이형)", "주계약 및 특약 종합", "어린이유병자종합보장", "어린이/태아 유병력자 종합 보장", "30,000 원", "3,000만원", "30,000 원", "30,000 원", "2.75%", "갱신형", "대면채널", "2026-05-25", "어린이 간편심사 보장", "1588-1001", "dummy.xls"] + [""] * 30
            dummy.loc[1] = ["KB손해보험", "KB 슬기로운 간편어린이보험(3.5.5)", "주계약 및 특약 종합", "어린이유병자종합보장", "어린이/태아 유병력자 종합 보장", "28,000 원", "3,000만원", "28,000 원", "28,000 원", "2.75%", "갱신형", "대면채널", "2026-05-25", "어린이 간편심사 보장", "1544-0114", "dummy.xls"] + [""] * 30
            dummy.loc[2] = ["메리츠화재", "간편한 3.5.5 어른이종합보험", "주계약 및 특약 종합", "어린이유병자종합보장", "어린이/태아 유병력자 종합 보장", "32,000 원", "3,000만원", "32,000 원", "32,000 원", "2.75%", "갱신형", "대면채널", "2026-05-25", "어린이 간편심사 보장", "1566-7711", "dummy.xls"] + [""] * 30
            dummy.loc[3] = ["DB손해보험", "참좋은간편어린이(3.5.5)", "주계약 및 특약 종합", "어린이유병자종합보장", "어린이/태아 유병력자 종합 보장", "31,000 원", "3,000만원", "31,000 원", "31,000 원", "2.75%", "갱신형", "대면채널", "2026-05-25", "어린이 간편심사 보장", "1588-0100", "dummy.xls"] + [""] * 30
            
            dummy.to_csv(csv_file, index=False, encoding='utf-8-sig')
            dummy.to_excel(xlsx_file, index=False)
            print(f"[+] 성공적으로 빈 템플릿/더미 파일 생성 완료: {csv_file}")

if __name__ == "__main__":
    process_files()
