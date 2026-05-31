import os
import pandas as pd
import io
import re
import warnings

warnings.filterwarnings('ignore')

source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(source_dir) if f.endswith(".xls")]

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception as e1:
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
                except Exception as e2:
                    continue
        except Exception as e3:
            pass
    return None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

STANDARD_HEADERS = [
    "보험회사", "상품명", "구분", "담보명(급부명)", "지급사유", 
    "지급금액", "가입금액", "기준보험료", "가입보험료", "적용이율",
    "갱신구분", "판매채널", "기준일자", "상세안내", "연락처", "source_file"
]

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

dementia_rows = []
for filename in files:
    filepath = os.path.join(source_dir, filename)
    df = load_df(filepath)
    if df is None:
        continue
    mapping, header_idx = find_header_mapping(df)
    prod_col = mapping.get("상품명", 1)
    
    for idx, row in df.iterrows():
        if idx <= header_idx:
            continue
        row_list = [clean_val(v) for v in row.tolist()]
        if prod_col >= len(row_list):
            continue
        product_name = row_list[prod_col]
        if not product_name and prod_col + 1 < len(row_list):
            product_name = row_list[prod_col + 1]
            
        if not product_name or len(product_name) < 2 or "상품명" in product_name:
            continue
            
        # Check dementia criteria: name contains "치매", doesn't contain "종신"
        if "치매" in product_name and "종신" not in product_name:
            # Let's collect standard columns and also all raw columns
            ord_row = []
            for h in STANDARD_HEADERS:
                if h == "source_file":
                    ord_row.append(filename)
                else:
                    col_idx = mapping.get(h)
                    val = row_list[col_idx] if col_idx is not None and col_idx < len(row_list) else ""
                    ord_row.append(val)
            dementia_rows.append((filename, idx, ord_row, row_list))

# Write to text file to inspect
with open("dementia_raw_inspect.txt", "w", encoding="utf-8") as f:
    for filename, r_idx, ord_row, raw in dementia_rows:
        f.write(f"File: {filename} | Row: {r_idx}\n")
        f.write(f"  Mapped: {ord_row}\n")
        f.write(f"  Raw   : {raw[:15]}\n\n")

print(f"Extracted {len(dementia_rows)} dementia rows. Written to dementia_raw_inspect.txt")
