import os
import io
import re
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['cp949', 'euc-kr', 'utf-8', 'utf-16']:
            try:
                raw_text = raw_bytes.decode(enc)
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        return frames[0], enc
            except Exception:
                continue
    except Exception:
        pass
    return None, None

def clean_val(v):
    if pd.isna(v): return ""
    return str(v).replace('\n', ' ').strip()

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    exclude_kws = ["실손", "치아", "치과", "펫", "운전자", "자동차", "어린이", "자녀", "태아", "정기", "종신", "치매", "간병", "골프", "화재", "연금", "저축", "변액", "용종", "신용", "홀인원", "반려"]
    target_kws = ["건강보험", "종합보험", "통합보험", "종합건강"]
    
    html_count = 0
    results = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, enc = load_df(filepath)
        if df is None:
            continue
            
        # Check if it has comprehensive health products
        has_comp = False
        for idx, row in df.iterrows():
            for col_idx in range(min(5, len(row))):
                val = clean_val(row.iloc[col_idx])
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    if any(tk in val for tk in target_kws) and not any(ek in val for ek in exclude_kws):
                        has_comp = True
                        break
            if has_comp:
                break
                
        if not has_comp:
            continue
            
        html_count += 1
        # Look for payment terms in the entire dataframe
        found_info = []
        for r_idx, row in df.iterrows():
            row_vals = [clean_val(v) for v in row.tolist()]
            for c_idx, val in enumerate(row_vals):
                if any(kw in val for kw in ["주기", "납입", "월납", "연납", "년납", "일시납"]):
                    # Keep a snippet
                    found_info.append(f"Row {r_idx} Col {c_idx}: {val[:150]}")
                    
        results.append(f"[{html_count}] File: {filename} ({enc}) | Shape: {df.shape}")
        results.append("Payment Info:")
        for info in found_info[:5]:
            results.append(f"  {info}")
        results.append("-" * 50)

    out_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\html_payment_inspection.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(results))
    print(f"Saved inspection to {out_path}")

if __name__ == "__main__":
    main()
