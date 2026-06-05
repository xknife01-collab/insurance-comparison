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
            for enc in ['cp949', 'euc-kr', 'utf-8']:
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

def main():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    print(f"Total files: {len(files)}")
    
    summary_lines = []
    
    for filename in sorted(files):
        filepath = os.path.join(SOURCE_DIR, filename)
        df, method = load_df(filepath)
        if df is None:
            summary_lines.append(f"File: {filename} | Load failed")
            continue
            
        # Extract headers (first 5 rows)
        headers = []
        for idx in range(min(5, len(df))):
            row_str = " | ".join([clean_val(v) for v in df.iloc[idx].tolist()[:10]])
            headers.append(f"Row {idx}: {row_str[:150]}")
            
        # Sample products
        prods = set()
        for idx, row in df.iterrows():
            row_vals = [clean_val(v) for v in row.tolist()]
            for col_idx in range(min(5, len(row_vals))):
                val = row_vals[col_idx]
                if len(val) > 5 and any(k in val for k in ["보험", "공시", "다이렉트", "무배당"]):
                    prods.add(val.split("\n")[0].strip())
                    
        summary_lines.append(f"==================================================")
        summary_lines.append(f"File: {filename} | Method: {method} | Shape: {df.shape}")
        summary_lines.append(f"Sample Products (up to 3): {list(prods)[:3]}")
        summary_lines.append(f"Headers:")
        for h in headers:
            summary_lines.append(f"  {h}")
            
    out_path = os.path.join(SOURCE_DIR, "insurance-comparison-main", "scripts", "scratch", "xls_shapes_summary.txt")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(summary_lines))
    print(f"Saved shapes summary to {out_path}")

if __name__ == "__main__":
    main()
