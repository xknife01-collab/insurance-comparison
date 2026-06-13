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

report_lines = []

def inspect_file(filename, search_keywords):
    filepath = os.path.join(r"C:\Users\zkfnt\Desktop\insurance-comparison-main", filename)
    df = load_raw_df(filepath)
    if df is None:
        report_lines.append(f"Failed to load {filename}")
        return
    
    report_lines.append(f"\n=========================================")
    report_lines.append(f"FILE: {filename}")
    report_lines.append(f"Shape: {df.shape}")
    report_lines.append(f"=========================================")
    
    # Print first 15 rows (headers usually reside here)
    report_lines.append("--- TOP 15 ROWS ---")
    for idx in range(min(15, len(df))):
        row_vals = [str(x).strip().replace('\n', ' ') for x in df.iloc[idx].tolist()]
        report_lines.append(f"Row {idx:02d}: {row_vals[:12]}")
        
    report_lines.append("\n--- MATCHING ROWS ---")
    match_count = 0
    for idx, row in df.iterrows():
        row_str = " ".join([str(x) for x in row.values])
        if any(keyword in row_str for keyword in search_keywords):
            row_vals = [str(x).strip().replace('\n', ' ') for x in row.tolist()]
            report_lines.append(f"Row {idx:04d}: {row_vals[:12]}")
            match_count += 1
            if match_count >= 15:
                report_lines.append("... truncated ...")
                break

inspect_file("보장성_상품비교_20260608162110819.xls", ["백년친구 안심보험", "골든라이프 안심보험"])
inspect_file("장기보장성 비교 공시 (5).xls", ["참좋은더보장", "한화 치매간병"])

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\raw_excel_inspection_report.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(report_lines))

print("Raw inspection completed!")
