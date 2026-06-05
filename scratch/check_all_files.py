import os
import io
import pandas as pd
import xlrd

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
        pass

    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['utf-8', 'cp949', 'euc-kr', 'utf-16']:
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

    try:
        return pd.read_excel(filepath, header=None), "read_excel_fallback"
    except Exception:
        pass

    return None, None

def clean_val(v):
    if pd.isna(v) or v is None:
        return ""
    return str(v).replace('\n', ' ').strip()

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls") or f.endswith(".xlsx")]
    print(f"Total files in directory: {len(files)}")
    
    target_kws = ["상해", "재해", "교통", "안전", "골절", "깁스"]
    exclude_kws = [
        "실손", "치아", "치과", "펫", "반려", "치매", "간병", "재가", "시설", 
        "골프", "홀인원", "알바트로스", "화재", "재물", "건물", "사업장", "비즈", 
        "연금", "저축", "대출안심", "신용", "종신", "변액", "운전자", "자동차", 
        "운전", "라이더", "어린이", "자녀", "태아", "주니어"
    ]
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            print(f"[-] {filename}: Failed to load")
            continue
            
        has_accident = False
        matched_product = ""
        for idx, row in df.iterrows():
            for col_idx in range(min(5, len(row))):
                val = clean_val(row.iloc[col_idx])
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    cand = val.split("\n")[0].strip()
                    if any(tk in cand for tk in target_kws) and not any(ek in cand for ek in exclude_kws):
                        has_accident = True
                        matched_product = cand
                        break
            if has_accident:
                break
                
        if has_accident:
            print(f"[o] {filename} ({method}) -> ACCIDENT: {matched_product}")
        else:
            # Let's print some candidate names to see what this file actually has
            cand_name = ""
            for idx, row in df.iterrows():
                for col_idx in range(min(5, len(row))):
                    val = clean_val(row.iloc[col_idx])
                    if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                        cand_name = val.split("\n")[0].strip()
                        break
                if cand_name:
                    break
            print(f"[x] {filename} ({method}) -> Non-Accident (Example: {cand_name})")

if __name__ == "__main__":
    main()
