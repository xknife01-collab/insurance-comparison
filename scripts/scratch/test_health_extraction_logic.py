import os
import io
import re
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        wb = pd.read_excel(filepath, engine='xlrd', header=None)
        return wb, "xlrd"
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
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def clean_and_format_premium(val):
    if pd.isna(val) or val == "":
        return ""
    val_str = str(val).strip().replace(",", "").replace("원", "").replace(" ", "")
    if val_str == "" or val_str == "-":
        return ""
    try:
        num = int(float(val_str))
        return f"{num:,} 원"
    except ValueError:
        return str(val).strip()

def get_clean_company(c):
    c = str(c).strip().replace(' ', '')
    if not c:
        return ""
    mapping = {
        "메리츠": "메리츠화재", "한화손보": "한화손보", "한화손해보험": "한화손보",
        "롯데": "롯데손보", "롯데손보": "롯데손보", "롯데손해보험": "롯데손보",
        "흥국화재": "흥국화재", "삼성화재": "삼성화재", "현대해상": "현대해상",
        "KB손보": "KB손보", "KB손해보험": "KB손보", "DB손보": "DB손보",
        "DB손해보험": "DB손보", "하나손보": "하나손보", "하나손해보험": "하나손보",
        "농협손보": "농협손보", "NH농협손보": "농협손보", "NH농협손해보험": "농협손보",
        "신한EZ": "신한EZ손보", "신한EZ손보": "신한EZ손보", "AXA": "AXA손보",
        "AXA손보": "AXA손보", "에이스": "에이스손보", "에이스손보": "에이스손보",
        "한화생명": "한화생명", "삼성생명": "삼성생명", "교보생명": "교보생명",
        "신한라이프": "신한라이프생명", "신한라이프생명": "신한라이프생명",
        "미래에셋": "미래에셋생명", "미래에셋생명": "미래에셋생명", "동양생명": "동양생명",
        "흥국생명": "흥국생명", "DB생명": "DB생명", "KDB생명": "KDB생명",
        "DGB생명": "DGB생명", "IBK연금": "IBK연금보험", "IBK연금보험": "IBK연금보험",
        "푸르덴셜": "푸르덴셜생명", "KB생명": "KB생명", "하나생명": "하나생명",
        "교보라이프": "교보라이프플래닛", "NH농협생명": "NH농협생명", "농협생명": "NH농협생명",
        "처브라이프": "처브라이프생명", "처브라이프생명": "처브라이프생명",
        "BNP파리바": "BNP파리바카디프생명", "BNP파리바카디프": "BNP파리바카디프생명",
        "BNP파리바카디프생명": "BNP파리바카디프생명", "푸본현대": "푸본현대생명",
        "푸본현대생명": "푸본현대생명", "ABL": "ABL생명", "ABL생명": "ABL생명"
    }
    for k, v in mapping.items():
        if k in c:
            return v
    return c

def test_extract():
    test_files = ["file_10.xls", "file_47.xls"]
    target_kws = ["건강보험", "종합보험", "통합보험", "종합건강"]
    exclude_kws = ["실손", "치아", "치과", "펫", "운전자", "자동차", "어린이", "자녀", "태아", "정기", "종신", "치매", "간병", "골프", "화재", "연금", "저축", "변액", "용종", "신용", "홀인원", "반려"]
    
    for filename in test_files:
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            print(f"Failed to load {filename}")
            continue
            
        print(f"\n==================== Testing {filename} ({method}) shape: {df.shape} ====================")
        
        last_company = ""
        last_product = ""
        is_in_comprehensive_block = False
        extracted_count = 0
        
        for idx, row in df.iterrows():
            if idx < 3: # Skip top rows
                continue
                
            row_list = [clean_val(v) for v in row.tolist()]
            if len(row_list) < 4:
                continue
                
            # Check for product candidate
            prod_candidate = ""
            comp_candidate = ""
            for col_idx in range(min(5, len(row_list))):
                val = row_list[col_idx]
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    prod_candidate = val.split("\n")[0].strip()
                    comp_candidate = row_list[col_idx - 1] if col_idx > 0 else ""
                    break
                    
            if prod_candidate:
                if any(tk in prod_candidate for tk in target_kws) and not any(ek in prod_candidate for ek in exclude_kws):
                    is_in_comprehensive_block = True
                    last_product = prod_candidate
                    if comp_candidate:
                        last_company = get_clean_company(comp_candidate)
                    else:
                        # Fallback: check index 0
                        last_company = get_clean_company(row_list[0])
                else:
                    is_in_comprehensive_block = False
                    
            if is_in_comprehensive_block:
                # Extract payment cycle for HTML files
                payment_cycle = ""
                if method.startswith("html"):
                    # Find detail desc column
                    detail_col = 28 if len(row_list) > 28 else (24 if len(row_list) > 24 else len(row_list) - 1)
                    detail_text = row_list[detail_col]
                    cycle_match = re.search(r'(?:납입)?주기\s*:\s*([월연년일시납]+)', detail_text)
                    if cycle_match:
                        group_val = cycle_match.group(1)
                        if "월" in group_val:
                            payment_cycle = "월납"
                        elif "연" in group_val or "년" in group_val:
                            payment_cycle = "연납"
                        elif "일시" in group_val:
                            payment_cycle = "일시납"
                    else:
                        # Fallback substring checks
                        if "주기 : 월" in detail_text or "주기: 월" in detail_text or "주기:월" in detail_text:
                            payment_cycle = "월납"
                        elif "주기 : 연" in detail_text or "주기 : 년" in detail_text or "주기:연" in detail_text or "주기:년" in detail_text:
                            payment_cycle = "연납"
                        elif "주기 : 일시" in detail_text or "주기:일시" in detail_text:
                            payment_cycle = "일시납"
                
                # Suffix
                suffix = f"({payment_cycle})" if payment_cycle else ""
                prod_name_with_suffix = last_product
                if suffix and suffix not in prod_name_with_suffix:
                    prod_name_with_suffix = f"{prod_name_with_suffix} {suffix}"
                
                # Print sample
                if extracted_count < 3:
                    print(f"Row {idx} | Company: {last_company} | Product: {prod_name_with_suffix} | Coverage: {row_list[3]} | BasePrem: {clean_and_format_premium(row_list[7])} | AppliedPrem: {clean_and_format_premium(row_list[8])}")
                extracted_count += 1
                
        print(f"Total extracted from {filename}: {extracted_count}")

if __name__ == "__main__":
    test_extract()
