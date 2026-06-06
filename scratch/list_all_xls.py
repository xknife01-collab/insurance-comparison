import os
import glob
import xlrd
import io
import pandas as pd

parent_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = glob.glob(os.path.join(parent_dir, "*.xls"))

print(f"Total .xls files in parent dir: {len(files)}")

def get_file_type(filepath):
    try:
        xlrd.open_workbook(filepath)
        return "binary_xls"
    except Exception:
        try:
            with open(filepath, 'rb') as f:
                content = f.read()
            for enc in ['utf-8', 'cp949', 'euc-kr', 'utf-16']:
                try:
                    text = content.decode(enc)
                    if '<table' in text.lower():
                        return f"html_{enc}"
                except Exception:
                    continue
        except Exception:
            pass
    return "unknown"

results = []
for filepath in sorted(files):
    name = os.path.basename(filepath)
    ftype = get_file_type(filepath)
    size = os.path.getsize(filepath)
    results.append((name, ftype, size))

for r in results:
    print(f"{r[0]}: type={r[1]}, size={r[2]}")
