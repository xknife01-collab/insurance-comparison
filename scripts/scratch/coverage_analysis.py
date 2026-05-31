import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv"

LTC_INCLUDE_RIDER_KEYWORDS = [
    '재가급여', '시설급여', '시설입소', '시설보장', '시설지원', '시설이용',
    '시설식사', '시설상급', '방문요양', '주야간', '주·야간', '단기보호',
    '요양원', '집에서집중간병', '집에서 집중간병',
    '장기요양급여금', '장기요양', '복지용구'
]

# 재가 in rider name, excluding 재가입
def has_home_care_keyword(rider_name):
    if '재가' in rider_name and '재가입' not in rider_name:
        return True
    for k in LTC_INCLUDE_RIDER_KEYWORDS:
        if k in rider_name:
            return True
    return False

BAD_KEYWORDS = [
    '배상', '화재', '실손', '의료비', '물적', '대인', '대물',
    '재물', '낙뢰', '붕괴', '반려견', '반려묘', '펫', '골프', '벌금'
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
            break

    defaults = {"보험회사": 0, "상품명": 1, "구분": 2, "담보명(급부명)": 3}
    for k, v in defaults.items():
        if k not in mapping: mapping[k] = v
    return mapping, header_row_idx

def scan_all():
    files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith('.xls')]
    print(f"Total .xls files: {len(files)}\n")

    # Load existing extracted CSV
    df_extracted = pd.read_csv(csv_path)
    extracted_products = set()
    for _, row in df_extracted.iterrows():
        key = (str(row['보험회사']).strip(), str(row['상품명']).strip(), str(row['source_file']).strip())
        extracted_products.add(key)

    print(f"Extracted CSV has {len(df_extracted)} rows, {df_extracted['상품명'].nunique()} unique products\n")

    # Scan all files for potential LTC products
    all_found = {}  # filename -> {product -> set of matching riders}
    for filename in sorted(files):
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
            rider_name = row_list[rider_col] if rider_col < len(row_list) else ""

            if not product_name or "종신" in product_name:
                continue

            if any(bad in product_name or bad in rider_name for bad in BAD_KEYWORDS):
                continue

            is_ltc = has_home_care_keyword(rider_name)

            # Also check product name
            if not is_ltc:
                if any(k in product_name for k in ['재가', '시설']) and not any(k in product_name for k in ['시설물', '시설소유', '화재', '재가입']):
                    is_ltc = True

            if is_ltc:
                key = filename
                if key not in all_found:
                    all_found[key] = {}
                if product_name not in all_found[key]:
                    all_found[key][product_name] = {'company': company_name, 'riders': set()}
                all_found[key][product_name]['riders'].add(rider_name)

    # Print comparison
    print("=" * 60)
    print("COVERAGE ANALYSIS - All detected LTC products")
    print("=" * 60)

    total_found = 0
    total_missing = 0
    
    out_lines = []
    for filename in sorted(all_found.keys()):
        prods = all_found[filename]
        for prod_name, info in sorted(prods.items()):
            company = info['company']
            riders = info['riders']
            key = (company, prod_name, filename)
            is_extracted = key in extracted_products
            status = "✅ EXTRACTED" if is_extracted else "❌ MISSING"
            if not is_extracted:
                total_missing += 1
            total_found += 1
            out_lines.append(f"\n[{status}] {filename} / {company} / {prod_name}")
            for r in sorted(riders):
                out_lines.append(f"    Rider: {r}")

    print(f"\nTotal LTC products found across all files: {total_found}")
    print(f"Successfully extracted: {total_found - total_missing}")
    print(f"MISSING from extracted CSV: {total_missing}")
    
    with open("c:\\Users\\zkfnt\\Desktop\\insurance-comparison-main\\insurance-comparison-main\\scripts\\scratch\\coverage_analysis.txt", "w", encoding="utf-8") as f:
        f.write(f"Total LTC products found: {total_found}\n")
        f.write(f"Extracted: {total_found - total_missing}\n")
        f.write(f"MISSING: {total_missing}\n")
        f.write("\n".join(out_lines))

    print("\nFull analysis written to coverage_analysis.txt")

if __name__ == "__main__":
    scan_all()
