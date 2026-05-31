import os
import pandas as pd
import io

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

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
            
    defaults = {"보험회사":0, "상품명":1, "구분":2, "담보명(급부명)":3, "지급사유":4, "지급금액":5, "가입금액":6, "기준보험료":7, "가입보험료":8}
    for k, v in defaults.items():
        if k not in mapping: mapping[k] = v
    return mapping, header_row_idx

def scan():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total .xls files: {len(files)}")
    
    matched_files = []
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        mapping, header_idx = find_header_mapping(df)
        prod_col = mapping.get("상품명", 1)
        company_col = mapping.get("보험회사", 0)
        rider_col = mapping.get("담보명(급부명)", 3)
        
        last_company = ""
        last_product = ""
        
        has_match = False
        matched_riders = []
        
        for idx, row in df.iterrows():
            if idx <= header_idx:
                continue
            row_list = [clean_val(v) for v in row.tolist()]
            
            curr_company = row_list[company_col] if company_col < len(row_list) else ""
            curr_product = row_list[prod_col] if prod_col < len(row_list) else ""
            
            if curr_company: last_company = curr_company
            if curr_product: last_product = curr_product
            
            product_name = last_product
            rider_name = row_list[rider_col] if rider_col < len(row_list) else ""
            
            if "종신" in product_name:
                continue
                
            # clean keywords matching
            keywords = ['재가', '시설급여', '시설입소', '시설보장', '시설지원', '시설이용', '시설식사', '시설상급', '방문요양', '주야간', '주·야간', '단기보호', '요양원', '집에서집중간병', '집에서 집중간병']
            
            is_match = False
            for k in keywords:
                if k in rider_name:
                    is_match = True
                    break
            
            if not is_match and any(k in product_name for k in ['재가', '시설']) and not any(k in product_name for k in ['시설물', '시설소유', '화재']):
                is_match = True
                
            # Exclude liability/fire terms
            if is_match:
                if any(bad in rider_name or bad in product_name for bad in ['배상', '화재', '실손', '의료비', '물적', '대인', '대물', '재물', '낙뢰', '붕괴']):
                    is_match = False
                    
            if is_match:
                has_match = True
                matched_riders.append(rider_name)
                
        if has_match:
            matched_files.append((filename, matched_riders))
                
    print(f"Matched {len(matched_files)} files.")
    for fn, riders in matched_files:
        print(f"\n- {fn} ({len(riders)} matched riders):")
        for r in riders[:5]:
            print(f"  - {r}")
        if len(riders) > 5:
            print(f"  - ... and {len(riders)-5} more")

if __name__ == "__main__":
    scan()
