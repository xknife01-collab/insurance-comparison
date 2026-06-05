import os
import io
import re
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def load_df(filepath):
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None)
    except Exception:
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['utf-8', 'euc-kr', 'cp949', 'utf-16']:
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

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    # Target keyword matches
    target_kws = ["건강보험", "종합보험", "통합보험", "종합건강"]
    exclude_kws = ["실손", "치아", "치과", "펫", "운전자", "자동차", "어린이", "자녀", "태아", "정기", "종신", "치매", "간병", "골프", "화재", "연금", "저축", "변액", "용종", "신용", "홀인원", "반려"]
    
    comprehensive_files = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df = load_df(filepath)
        if df is None:
            continue
            
        products_in_file = set()
        for idx, row in df.iterrows():
            for col_idx in range(min(5, len(row))):
                val = clean_val(row.iloc[col_idx])
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    p_name = val.split("\n")[0].strip()
                    p_name = re.sub(r'\s+', ' ', p_name)
                    if any(tk in p_name for tk in target_kws):
                        if not any(ek in p_name for ek in exclude_kws):
                            products_in_file.add(p_name)
                            
        if products_in_file:
            comprehensive_files.append({
                "filename": filename,
                "products": list(products_in_file)
            })
            
    out_path = os.path.join(SOURCE_DIR, "insurance-comparison-main", "scripts", "scratch", "comprehensive_files.txt")
    with open(out_path, "w", encoding="utf-8") as f_out:
        f_out.write(f"Found {len(comprehensive_files)} files containing comprehensive health products:\n\n")
        for item in comprehensive_files:
            f_out.write(f"File: {item['filename']}\n")
            for p in sorted(item['products']):
                f_out.write(f"  - {p}\n")
            f_out.write("-" * 80 + "\n")
            
    print(f"Saved comprehensive files report to {out_path}")

if __name__ == "__main__":
    main()
