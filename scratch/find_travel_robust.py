import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUTPUT_FILE = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\travel_robust_matches.txt"

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

def find_travel_robust():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
    keywords = ["여행", "해외", "국내", "유학", "워킹", "출장", "관광", "신혼"]
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write("Robust Search for Travel Insurance Keywords in All Sheets/Files\n\n")
        
        found_any = False
        for filename in sorted(files):
            filepath = os.path.join(SOURCE_DIR, filename)
            df = load_df(filepath)
            if df is None:
                out.write(f"[{filename}] - Failed to load df\n")
                continue
                
            # Search all cells safely
            matches = []
            for row_idx, row in df.iterrows():
                row_list = [clean_val(v) for v in row.tolist()]
                for col_idx, val in enumerate(row_list):
                    for kw in keywords:
                        if kw in val:
                            matches.append((row_idx, col_idx, val))
                            break
                            
            if matches:
                found_any = True
                out.write(f"[{filename}] - Found {len(matches)} matches:\n")
                for r, c, val in matches[:10]: # show first 10 matches
                    out.write(f"  Row {r}, Col {c}: {val}\n")
                if len(matches) > 10:
                    out.write(f"  ... and {len(matches) - 10} more matches.\n")
                out.write("\n")
                
        if not found_any:
            out.write("No travel insurance keywords found in any cells of any files.\n")

if __name__ == "__main__":
    find_travel_robust()
