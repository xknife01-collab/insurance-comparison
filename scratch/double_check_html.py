# -*- coding: utf-8 -*-
import os
import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")]
html_files = []

for filename in files:
    filepath = os.path.join(SOURCE_DIR, filename)
    try:
        with open(filepath, 'rb') as f:
            raw_bytes = f.read()
        for enc in ['cp949', 'euc-kr', 'utf-8']:
            try:
                raw_text = raw_bytes.decode(enc)
                if '<table' in raw_text.lower() or '<html' in raw_text.lower():
                    html_files.append((filename, raw_text, enc))
                    break
            except Exception:
                continue
    except Exception:
        pass

print(f"Found {len(html_files)} HTML files out of {len(files)} total files.")

keywords = ["민사", "형사", "법률", "소송", "변호사"]
matched_html = []

for name, text, enc in html_files:
    # Check if any keyword in the text
    found = [kw for kw in keywords if kw in text]
    if found:
        matched_html.append((name, found))

print(f"HTML files with keywords: {matched_html}")
