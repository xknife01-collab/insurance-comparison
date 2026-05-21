import pandas as pd
import os
import io
import re

SOURCE_DIR = ".."
TARGET_BASE = "insurance_data"

# 앞부분에 배치할 중요 표준 헤더
STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율",
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
]

# 모든 보험 카테고리 정의 (순서대로 분류)
CATEGORIES = [
    {"path": "5_savings/whole_life", "keywords": ["종신"]},
    {"path": "0_popular/silson", "keywords": ["실손", "의료비", "의료실비"]},
    {"path": "0_popular/cancer", "keywords": ["암", "표적항암"], "exclude": ["종신", "연금"]},
    {"path": "0_popular/dental", "keywords": ["치아", "치과"]},
    {"path": "5_savings/pension", "keywords": ["연금"]},
    {"path": "0_popular/pre_existing", "keywords": ["유병", "간편", "3.2.5", "3.3.5", "3.5.5"], "exclude": ["종신"]},
    {"path": "2_care/caregiving", "keywords": ["간병", "간병인"], "exclude": ["종신"]},
    {"path": "2_care/dementia", "keywords": ["치매"], "exclude": ["종신"]},
    {"path": "3_family/child", "keywords": ["어린이", "자녀", "태아", "꿈나무"]},
    {"path": "4_life/auto", "keywords": ["자동차"]},
    {"path": "4_life/driver", "keywords": ["운전자"]},
    {"path": "1_guaranteed/brain", "keywords": ["뇌혈관", "뇌질환", "뇌졸중"], "exclude": ["종신"]},
    {"path": "1_guaranteed/heart", "keywords": ["허혈성", "심장", "심근경색"], "exclude": ["종신"]},
]

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def find_header_mapping(df):
    """표준 헤더 매핑 (암보험에 적용했던 로직)"""
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
                elif "지급금액" in v: mapping["지급금액"] = col_idx
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
            
    # 백업 기본 매핑 (실패 시 원본 순서 최대한 활용)
    defaults = {"보험회사":0, "상품명":1, "구분":2, "담보명(급부명)":3, "지급사유":4, "지급금액":5, "가입금액":6, "기준보험료":7, "가입보험료":8}
    for k, v in defaults.items():
        if k not in mapping: mapping[k] = v
        
    return mapping, header_row_idx

def process_all_files():
    collected_data = {cat['path']: [] for cat in CATEGORIES}
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    print(f"[*] 총 {len(files)}개의 엑셀 파일 전수 조사 및 모든 카테고리(암, 실손, 치아 등) 정렬 시작...")

    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df = None
        try:
            try:
                df = pd.read_excel(filepath, engine='xlrd', header=None)
            except:
                raw_bytes = open(filepath, 'rb').read()
                for enc in ['cp949', 'euc-kr', 'utf-8']:
                    try:
                        raw_text = raw_bytes.decode(enc)
                        if '<table' in raw_text.lower():
                            frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                            if frames: df = frames[0]; break
                    except: continue
            
            if df is None: continue
            
            mapping, header_idx = find_header_mapping(df)
            prod_col = mapping.get("상품명", 1)

            for idx, row in df.iterrows():
                if idx <= header_idx: continue
                
                row_list = [clean_val(v) for v in row.tolist()]
                if prod_col >= len(row_list): continue
                
                product_name = row_list[prod_col]
                if not product_name and prod_col + 1 < len(row_list):
                    product_name = row_list[prod_col + 1]

                if not product_name or len(product_name) < 2 or "상품명" in product_name: continue

                # 상품명을 기반으로 모든 카테고리에 분류
                for cat in CATEGORIES:
                    if any(k in product_name for k in cat['keywords']):
                        if not any(ex in product_name for ex in cat.get('exclude', [])):
                            # 1. 표준 데이터 구성
                            ordered_part = []
                            for h in STANDARD_HEADERS:
                                if h == "source_file": ordered_part.append(filename)
                                else:
                                    col_idx = mapping.get(h)
                                    val = row_list[col_idx] if col_idx is not None and col_idx < len(row_list) else ""
                                    ordered_part.append(val)
                            
                            # 2. 원본 데이터 전체 추가 (유실 방지)
                            full_row = ordered_part + row_list
                            collected_data[cat['path']].append(full_row)
                            break 

        except Exception as e:
            pass

    # 모든 카테고리별로 CSV 저장
    for path, rows in collected_data.items():
        if not rows: continue
        
        # 1. 해당 카테고리 내에서 가장 긴 줄의 길이 찾기 (열 갯수 맞추기 위함)
        max_len = max(len(r) for r in rows)
        
        # 2. 모든 줄의 길이를 max_len에 맞춤 (빈 칸 패딩)
        padded_rows = [r + [""] * (max_len - len(r)) for r in rows]
        
        # 3. 헤더 생성 (표준 헤더 16개 + 원본 열 전체 번호)
        num_raw = max_len - len(STANDARD_HEADERS)
        dynamic_headers = STANDARD_HEADERS + [f"원본_열_{i}" for i in range(num_raw)]
        
        output_path = os.path.join(TARGET_BASE, path, "extracted_data.csv")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        output_df = pd.DataFrame(padded_rows, columns=dynamic_headers)
        output_df.to_csv(output_path, index=False, encoding='utf-8-sig')
        print(f"  - [{path}] 정제 완료: {len(rows)}건 (표준열 16개 + 원본열 {num_raw}개 보존)")

if __name__ == "__main__":
    process_all_files()
