import pandas as pd
import io
import os

def load_raw_df(filepath):
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

source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\Insurance_disclosure_room_data"
files = [os.path.join(source_dir, f) for f in os.listdir(source_dir) if f.endswith(".xls")]
# Find a file that does not contain "장기보장성" (which are non-life)
life_files = [f for f in files if "장기보장성" not in f]

if life_files:
    filepath = life_files[0]
    print(f"Inspecting life file: {filepath}")
    df = load_raw_df(filepath)
    if df is not None:
        print("=== FIRST 15 ROWS ===")
        for idx, row in df.iloc[:15].iterrows():
            print(f"Row {idx:02d}: {[str(x).strip() for x in row.tolist()[:10]]}")
    else:
        print("Could not load file.")
else:
    print("No life files found.")
