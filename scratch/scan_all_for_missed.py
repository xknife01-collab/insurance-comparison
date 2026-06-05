import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
GOLF_KEYWORDS = ["골프", "레저", "홀인원", "알바트로스", "카트", "golf", "leisure", "hole-in-one", "albatross", "오잘공", "상과염", "테니스엘보", "골프엘보"]

def load_df(filepath):
    # Try standard HTML-saved excel parsing
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
    
    # Try modern pandas excel
    try:
        return pd.read_excel(filepath, header=None)
    except Exception:
        pass
    return None

files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls") or f.endswith(".xlsx")]
print(f"Scanning {len(files)} files for keywords...")

all_matches = []
for filename in files:
    filepath = os.path.join(SOURCE_DIR, filename)
    df = load_df(filepath)
    if df is None:
        continue
    
    match_count = 0
    for idx, row in df.iterrows():
        row_str = " ".join([str(v) for v in row.tolist()]).lower()
        if any(kw in row_str for kw in GOLF_KEYWORDS):
            match_count += 1
            all_matches.append({
                "file": filename,
                "row_idx": idx,
                "content": row_str[:150]
            })
            
    if match_count > 0:
        print(f"File {filename}: {match_count} matches found")

print(f"\nTotal matches found across all files: {len(all_matches)}")
