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

def clean_premium(v):
    v_str = str(v).replace(",", "").replace("원", "").replace(" ", "").strip()
    if not v_str or v_str == "-":
        return 0
    try:
        return int(float(v_str))
    except:
        return 0

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

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    target_kws = ["건강보험", "종합보험", "통합보험", "종합건강"]
    exclude_kws = ["실손", "치아", "치과", "펫", "운전자", "자동차", "어린이", "자녀", "태아", "정기", "종신", "치매", "간병", "골프", "화재", "연금", "저축", "변액", "용종", "신용", "홀인원", "반려"]
    
    unique_products = {}
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            continue
            
        last_company = ""
        last_product = ""
        is_in_comprehensive_block = False
        
        for idx, row in df.iterrows():
            if idx < 3:
                continue
            row_list = [clean_val(v) for v in row.tolist()]
            if len(row_list) < 4:
                continue
                
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
                        last_company = get_clean_company(row_list[0])
                else:
                    is_in_comprehensive_block = False
                    
            if is_in_comprehensive_block:
                premium = clean_premium(row_list[8]) # 가입보험료
                if premium == 0:
                    premium = clean_premium(row_list[7]) # 기준보험료
                
                prod_key = (last_company, last_product)
                if prod_key not in unique_products:
                    unique_products[prod_key] = []
                if premium > 0:
                    unique_products[prod_key].append(premium)
                    
    print("\nUnique Comprehensive Health Products & Typical Premiums:")
    for (company, product), prems in sorted(unique_products.items()):
        avg_prem = int(sum(prems)/len(prems)) if prems else 0
        print(f"Company: {company} | Product: {product} | Avg Premium: {avg_prem} | Samples: {len(prems)}")

if __name__ == "__main__":
    main()
