import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

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

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]

report_lines = []

for filename in files:
    filepath = os.path.join(SOURCE_DIR, filename)
    df = load_raw_df(filepath)
    if df is None:
        continue
        
    found_rows = []
    for idx, row in df.iterrows():
        row_str = " ".join([str(x) for x in row.values])
        if "일시납" in row_str or "일시불" in row_str:
            found_rows.append((idx, [str(x).strip().replace('\n', ' ') for x in row.tolist()[:10]]))
            
    if found_rows:
        report_lines.append(f"\n=========================================")
        report_lines.append(f"FILE: {filename} has {len(found_rows)} matching rows")
        report_lines.append(f"=========================================")
        for r_idx, r_vals in found_rows[:10]:
            report_lines.append(f"Row {r_idx:04d}: {r_vals}")
        if len(found_rows) > 10:
            report_lines.append(f"... and {len(found_rows) - 10} more rows")

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\ilsi_raw_search_report.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(report_lines))

print("Raw Excel search for '일시납/일시불' completed!")
