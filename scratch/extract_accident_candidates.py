import os
import io
import re
import pandas as pd
import warnings
import xlrd

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

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
    if pd.isna(v) or v is None:
        return ""
    return str(v).replace('\n', ' ').strip()

def get_clean_company(c):
    c = str(c).strip().replace(' ', '')
    if not c: return ""
    mapping = {
        "메리츠": "메리츠화재", "한화손보": "한화손보", "롯데": "롯데손보",
        "흥국화재": "흥국화재", "삼성화재": "삼성화재", "현대해상": "현대해상",
        "KB손보": "KB손보", "DB손보": "DB손보", "하나손보": "하나손보",
        "농협손보": "농협손보", "신한EZ": "신한EZ손보", "AXA": "AXA손보",
        "에이스": "에이스손보", "한화생명": "한화생명", "삼성생명": "삼성생명",
        "교보생명": "교보생명", "신한라이프": "신한라이프생명", "미래에셋": "미래에셋생명",
        "동양생명": "동양생명", "흥국생명": "흥국생명", "DB생명": "DB생명",
        "KDB생명": "KDB생명", "DGB생명": "DGB생명", "IBK연금": "IBK연금보험",
        "푸르덴셜": "푸르덴셜생명", "KB생명": "KB생명", "하나생명": "하나생명",
        "교보라이프": "교보라이프플래닛", "NH농협생명": "NH농협생명",
        "처브라이프": "처브라이프생명", "BNP파리바": "BNP파리바카디프생명",
        "푸본현대": "푸본현대생명", "ABL": "ABL생명"
    }
    for k, v in mapping.items():
        if k in c: return v
    return c

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Found {len(files)} files.")
    
    target_kws = ["상해", "재해", "교통", "안전", "골절", "깁스"]
    exclude_kws = [
        "실손", "치아", "치과", "펫", "반려", "치매", "간병", "재가", "시설", 
        "골프", "홀인원", "알바트로스", "화재", "재물", "건물", "사업장", "비즈", 
        "연금", "저축", "대출안심", "신용", "종신", "변액", "운전자", "자동차", 
        "운전", "라이더", "어린이", "자녀", "태아", "주니어"
    ]
    
    found_products = {}
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        file_products = set()
        
        for idx, row in df.iterrows():
            row_list = [clean_val(v) for v in row.tolist()]
            
            # Look for product name candidate in the row
            prod_candidate = ""
            for col_idx in range(min(5, len(row_list))):
                val = row_list[col_idx]
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    cand = val.split("\n")[0].strip()
                    if len(cand) < 100 and not any(w in cand for w in ["경우", "지급", "판정", "의해", "등급", "보험료", "해당", "기준", "이상", "이하", "또는", "합니다", "있습니다", "받은"]):
                        prod_candidate = cand
                        break
                        
            if prod_candidate:
                if any(tk in prod_candidate for tk in target_kws) and not any(ek in prod_candidate for ek in exclude_kws):
                    # Check payment cycle
                    detail_col = 28 if len(row_list) > 28 else (24 if len(row_list) > 24 else len(row_list) - 1)
                    detail_text = row_list[detail_col] if detail_col >= 0 else ""
                    
                    payment_cycle = "월납"
                    cycle_match = re.search(r'(?:납입)?주기\s*:\s*([월연년일시납]+)', detail_text)
                    if cycle_match:
                        group_val = cycle_match.group(1)
                        if "월" in group_val: payment_cycle = "월납"
                        elif "연" in group_val or "년" in group_val: payment_cycle = "연납"
                        elif "일시" in group_val: payment_cycle = "일시납"
                    else:
                        if any(x in detail_text for x in ["주기 : 월", "주기: 월", "주기:월"]):
                            payment_cycle = "월납"
                        elif any(x in detail_text for x in ["주기 : 연", "주기 : 년", "주기:연", "주기:년"]):
                            payment_cycle = "연납"
                        elif any(x in detail_text for x in ["주기 : 일시", "주기:일시"]):
                            payment_cycle = "일시납"
                        elif "일시납" in prod_candidate:
                            payment_cycle = "일시납"
                            
                    file_products.add((prod_candidate, payment_cycle))
                    
        if file_products:
            print(f"File {filename} ({method}, Shape: {df.shape}) has accident products:")
            for p, cycle in file_products:
                print(f"  - {p} ({cycle})")
                key = (p, cycle)
                if key not in found_products:
                    found_products[key] = []
                found_products[key].append(filename)

    with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\accident_candidates.txt", "w", encoding="utf-8") as f:
        f.write("=== ACCIDENT INSURANCE PRODUCTS FOUND ===\n")
        for (prod, cycle), files in sorted(found_products.items()):
            f.write(f"Product: {prod}\n  Cycle: {cycle}\n  Files: {', '.join(files)}\n\n")
            
if __name__ == "__main__":
    main()
