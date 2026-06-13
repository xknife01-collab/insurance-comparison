# -*- coding: utf-8 -*-
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
source_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = os.listdir(source_dir)

print("=== ALL SOURCE FILES ===")
for f in sorted(files):
    if f.endswith(".xls") or f.endswith(".xlsx"):
        print(f"File: {f} | Size: {os.path.getsize(os.path.join(source_dir, f))} bytes")
