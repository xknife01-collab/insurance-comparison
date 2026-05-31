import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), 'xlrd'
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
                            return frames[0], f'html({enc})'
                except Exception:
                    continue
        except Exception:
            pass
    return None, None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

files = sorted([f for f in os.listdir(SOURCE_DIR) if f.lower().endswith('.xls')])
print(f"총 .xls 파일 수: {len(files)}\n")

out_lines = []

for filename in files:
    filepath = os.path.join(SOURCE_DIR, filename)
    df, method = load_df(filepath)
    if df is None:
        out_lines.append(f"\n❌ 읽기 실패: {filename}")
        continue

    # Find header row
    header_row_idx = -1
    header_row = []
    for i in range(min(20, len(df))):
        row = [clean_val(v) for v in df.iloc[i].tolist()]
        if any("상품명" in val or "보험사" in val or "회사명" in val for val in row):
            header_row_idx = i
            header_row = row
            break

    # Check if LTC product exists
    is_ltc_file = False
    prod_col = 1
    rider_col = 3
    company_col = 0

    for i, val in enumerate(header_row):
        v = val.replace(" ", "")
        if "상품명" in v: prod_col = i
        if any(k in v for k in ["급부명", "담보명", "특약명"]): rider_col = i
        if any(k in v for k in ["보험회사", "보험사", "회사명"]): company_col = i

    last_prod = ""
    ltc_products = set()
    for idx, row in df.iterrows():
        if idx <= header_row_idx:
            continue
        row_list = [clean_val(v) for v in row.tolist()]
        curr_prod = row_list[prod_col] if prod_col < len(row_list) else ""
        if curr_prod: last_prod = curr_prod
        rider = row_list[rider_col] if rider_col < len(row_list) else ""

        if any(k in rider for k in ['재가급여', '시설급여', '시설입소', '방문요양', '주야간', '복지용구급여', '복합재가', '집에서집중간병']) or \
           ('재가' in rider and '재가입' not in rider) or \
           ('장기요양급여금' in rider and any(k in rider for k in ['재가급여', '시설급여', '주야간보호', '복지용구', '방문요양'])) or \
           ('장기요양' in rider and any(k in rider for k in ['주야간보호', '방문요양', '재가', '시설', '복지용구'])):
            if last_prod and '종신' not in last_prod:
                ltc_products.add(last_prod)

    if not ltc_products:
        continue

    # For LTC files, show header and sample row for premium diagnosis
    out_lines.append(f"\n{'='*60}")
    out_lines.append(f"파일: {filename}  [파싱방식: {method}]")
    out_lines.append(f"LTC 상품: {sorted(ltc_products)}")
    out_lines.append(f"헤더행({header_row_idx}): {header_row}")

    # Show first data row for a LTC product to see premium columns
    last_prod = ""
    for idx, row in df.iterrows():
        if idx <= header_row_idx:
            continue
        row_list = [clean_val(v) for v in row.tolist()]
        curr_prod = row_list[prod_col] if prod_col < len(row_list) else ""
        if curr_prod: last_prod = curr_prod
        rider = row_list[rider_col] if rider_col < len(row_list) else ""
        if last_prod in ltc_products and rider:
            out_lines.append(f"\n  [샘플행 - 담보: {rider}]")
            for ci, val in enumerate(row_list):
                if val:
                    hdr = header_row[ci] if ci < len(header_row) else f"col{ci}"
                    out_lines.append(f"    col{ci}({hdr}): {val}")
            break

out_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\premium_diagnosis.txt"
with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))

print('\n'.join(out_lines))
print(f"\n\n저장완료: {out_path}")
