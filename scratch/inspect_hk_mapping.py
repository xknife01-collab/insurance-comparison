import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

def load_df(filepath):
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
    for i in range(min(15, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        if any("상품명" in val or "회사명" in val or "보험사" in val or "급부명" in val or "담보명" in val for val in row):
            header_row_idx = i
            next_row = [clean_val(v) for v in df.iloc[i+1].tolist()] if i+1 < len(df) else []
            combined_headers = []
            for col_idx in range(len(row)):
                main_h = row[col_idx]
                sub_h = next_row[col_idx] if col_idx < len(next_row) else ""
                combined = f"{main_h}_{sub_h}".replace(" ", "").replace("\n", "") if main_h and sub_h else (main_h or sub_h or "")
                combined_headers.append(combined)
            
            for col_idx, h in enumerate(combined_headers):
                h_clean = h.replace("_", "")
                if any(k in h_clean for k in ["보험회사", "보험사", "회사명"]):
                    mapping["보험회사"] = col_idx
                elif "상품명" in h_clean:
                    mapping["상품명"] = col_idx
                elif any(k in h_clean for k in ["구분", "주계약", "특약구분"]):
                    mapping["구분"] = col_idx
                elif any(k in h_clean for k in ["급부명", "담보명", "특약명", "보장명"]):
                    mapping["담보명(급부명)"] = col_idx
                elif any(k in h_clean for k in ["지급사유", "보장사유"]):
                    mapping["지급사유"] = col_idx
                elif any(k in h_clean for k in ["지급금액", "지급액"]):
                    mapping["지급금액"] = col_idx
                elif "가입금액" in h_clean:
                    mapping["가입금액"] = col_idx
            break
    return mapping, header_row_idx

df = load_df(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\보장성_상품비교_20260406102544980.xls")
mapping, header_idx = find_header_mapping(df)
print(f"Mapping: {mapping}")
print(f"Header Row Idx: {header_idx}")
for idx, row in df.iterrows():
    if idx > header_idx:
        raw_list = [clean_val(v) for v in row.tolist()]
        if "흥국생명" in "".join(raw_list):
            print(f"Row {idx}: {raw_list[:6]}")
            break
