import os
import io
import pandas as pd
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
KEYWORDS = ["법률", "민사", "형사", "소송", "변호사"]

def load_df(filepath):
    # 1. Try reading with xlrd
    try:
        return pd.read_excel(filepath, engine='xlrd', header=None), "xlrd"
    except Exception:
        pass
        
    # 2. Try reading as HTML/pseudo-xls
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

def scan_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    
    with open("scripts/scratch/legal_matches.txt", "w", encoding="utf-8") as f_out:
        f_out.write(f"[*] Scanning {len(files)} files in {SOURCE_DIR}...\n")
        
        for filename in sorted(files):
            filepath = os.path.join(SOURCE_DIR, filename)
            df, method = load_df(filepath)
            
            if df is None:
                continue
                
            matched_cells = []
            for r_idx in range(len(df)):
                for c_idx in range(df.shape[1]):
                    val = str(df.iloc[r_idx, c_idx])
                    for kw in KEYWORDS:
                        if kw in val:
                            matched_cells.append((r_idx, c_idx, val))
                            break
            
            if matched_cells:
                f_out.write(f"\n=========================================\n")
                f_out.write(f"File: {filename} ({method}) - {len(matched_cells)} matches\n")
                f_out.write(f"=========================================\n")
                
                # Print unique rows that matched
                matched_rows = sorted(list(set(cell[0] for cell in matched_cells)))
                for r_idx in matched_rows:
                    row_vals = [str(x) for x in df.iloc[r_idx].tolist()]
                    f_out.write(f"Row {r_idx}: {' | '.join(row_vals)}\n")

if __name__ == "__main__":
    scan_files()
