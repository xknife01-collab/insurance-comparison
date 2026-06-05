import os
import io
import re
import pandas as pd
import warnings
import xlrd
from bs4 import BeautifulSoup

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUTPUT_REPORT = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\accident_inspection_report.txt"

def load_df(filepath):
    try:
        wb = xlrd.open_workbook(filepath, encoding_override='cp949')
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            data.append([sheet.cell_value(r, c) for c in range(sheet.ncols)])
        return pd.DataFrame(data), "xlrd"
    except Exception:
        try:
            return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd_fallback"
        except Exception:
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
    if pd.isna(v) or v is None: return ""
    return str(v).replace('\n', ' ').strip()

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls") or f.endswith(".xlsx")]
    print(f"Scanning {len(files)} files...")
    
    accident_files_and_prods = []
    
    # We want to identify any product that matches accident keywords
    # but exclude ones that belong to other clear categories
    target_kws = ["상해", "재해", "교통", "안전", "골절", "깁스"]
    exclude_kws = [
        "실손", "치아", "치과", "펫", "반려", "치매", "간병", "재가", "시설",
        "골프", "홀인원", "알바트로스", "화재", "재물", "건물", "사업장", "비즈",
        "연금", "저축", "대출안심", "신용", "종신", "변액"
    ]
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        # Scan for product candidates
        products_in_file = set()
        for idx, row in df.iterrows():
            if idx > 20: # products are in the top header section
                break
            for col_idx in range(min(5, len(row))):
                val = clean_val(row.iloc[col_idx])
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    cand = val.split("\n")[0].strip()
                    if len(cand) < 100 and not any(w in cand for w in ["경우", "지급", "판정", "의해", "등급", "보험료", "해당", "기준", "이상", "이하", "또는", "합니다", "있습니다", "받은"]):
                        products_in_file.add(cand)
                        
        # Filter for accident products
        accident_prods = []
        for prod in products_in_file:
            is_target = any(tk in prod for tk in target_kws)
            is_excluded = any(ek in prod for ek in exclude_kws)
            # Exception: some driver insurance has '상해' but we exclude driver if '운전자' or '자동차' is in product name
            if "운전자" in prod or "자동차" in prod or "운전" in prod:
                is_excluded = True
                
            if is_target and not is_excluded:
                accident_prods.append(prod)
                
        if accident_prods:
            # Check payment cycles in the file
            cycles = set()
            detail_texts = []
            for idx, row in df.iterrows():
                row_list = [clean_val(v) for v in row.tolist()]
                # look for detail text cols
                for cell in row_list:
                    if "주기" in cell or "납입" in cell or "년" in cell or "월" in cell:
                        cycle_match = re.search(r'(?:납입)?주기\s*:\s*([월연년일시납]+)', cell)
                        if cycle_match:
                            cycles.add(cycle_match.group(1))
                        elif "주기 : 월" in cell or "주기: 월" in cell or "주기:월" in cell:
                            cycles.add("월")
                        elif "주기 : 연" in cell or "주기 : 년" in cell or "주기:연" in cell or "주기:년" in cell:
                            cycles.add("연")
                        elif "주기 : 일시" in cell or "주기:일시" in cell:
                            cycles.add("일시")
                            
            accident_files_and_prods.append({
                "file": filename,
                "method": method,
                "products": accident_prods,
                "detected_cycles": list(cycles),
                "shape": df.shape
            })
            
    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        f.write("=== ACCIDENT INSURANCE PRODUCT DETECTION REPORT ===\n\n")
        f.write(f"Total files detected containing accident products: {len(accident_files_and_prods)}\n\n")
        for entry in accident_files_and_prods:
            f.write(f"File: {entry['file']} ({entry['method']}) | Shape: {entry['shape']}\n")
            f.write(f"  Products: {entry['products']}\n")
            f.write(f"  Detected Cycles: {entry['detected_cycles']}\n")
            f.write("-" * 80 + "\n")
            
    print(f"Inspection complete. Written to {OUTPUT_REPORT}")

if __name__ == "__main__":
    main()
