import os
import io
import re
import pandas as pd
from bs4 import BeautifulSoup
import xlrd

parent_dir = ".."
xls_files = [f for f in os.listdir(parent_dir) if f.lower().endswith('.xls')]

output_lines = []

def clean_txt(s):
    if pd.isna(s): return ""
    return str(s).strip().replace('\n', ' ').replace('\t', ' ')

for f in xls_files:
    file_path = os.path.join(parent_dir, f)
    is_html = False
    content = ""
    df = None
    
    # Try reading as Excel using xlrd
    try:
        df = pd.read_excel(file_path, engine='xlrd')
        is_html = False
    except Exception as e:
        # Try reading as HTML
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                with open(file_path, 'r', encoding=enc) as file_obj:
                    content = file_obj.read()
                if '<table' in content.lower():
                    is_html = True
                    # Parse HTML using BeautifulSoup & Pandas
                    content_clean = re.sub(r'<p.*?>.*?</p>', '', content, flags=re.DOTALL)
                    frames = pd.read_html(io.StringIO(content_clean), flavor='bs4')
                    if frames:
                        df = frames[0]
                    break
            except Exception as e2:
                continue

    if df is None:
        output_lines.append(f"File: {f} -> FAILED TO PARSE")
        continue

    # Classify file format & get shapes
    rows_cnt, cols_cnt = df.shape
    
    # Check for payment cycle keywords in the content or row text
    all_text = ""
    if is_html:
        all_text = content
    else:
        # Convert df to text
        all_text = " ".join([str(v) for col in df.columns for v in df[col].values])
        
    payment_cycle = "Unknown"
    # Find payment period keywords
    if '월납' in all_text:
        payment_cycle = "월납"
    elif '연납' in all_text or '1년납' in all_text or '연' in all_text:
        payment_cycle = "연납"
    elif '일시납' in all_text:
        payment_cycle = "일시납"

    # Get sample rows
    first_rows = []
    for idx, r in df.head(3).iterrows():
        first_rows.append([clean_txt(v) for v in r.values[:6]])
        
    output_lines.append(f"File: {f} | HTML: {is_html} | Shape: {rows_cnt}x{cols_cnt} | Cycle: {payment_cycle}")
    output_lines.append(f"  First rows: {first_rows}")

with open("scratch/parent_xls_audit.txt", "w", encoding="utf-8") as out_f:
    out_f.write("\n".join(output_lines))

print("Audit complete! Saved to scratch/parent_xls_audit.txt")
