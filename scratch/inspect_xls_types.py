import os
import pandas as pd
import io
import warnings
import xlrd
from bs4 import BeautifulSoup

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"

def inspect_files():
    files = [f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls") or f.endswith(".xlsx")]
    print(f"Total files: {len(files)}")
    
    html_count = 0
    binary_count = 0
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        is_html = False
        try:
            with open(filepath, 'rb') as f:
                header = f.read(100)
                if b'<html' in header.lower() or b'<table' in header.lower() or b'xml' in header.lower():
                    is_html = True
        except Exception:
            pass
            
        if is_html:
            html_count += 1
            # Inspect HTML file content for yearly payment keywords
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                # Check for keywords like 연납, 연보험료, 일시납, 년납, 월납
                keywords = []
                for kw in ["연납", "연보험료", "년납", "월납", "일시납", "연"]:
                    if kw in content:
                        keywords.append(kw)
                print(f"[HTML] {filename}: size={os.path.getsize(filepath)}, keywords found={keywords}")
            except Exception as e:
                print(f"[HTML] {filename}: error reading: {e}")
        else:
            binary_count += 1
            
    print(f"\nSummary: HTML/Web files={html_count}, Binary XLS/XLSX={binary_count}")

if __name__ == "__main__":
    inspect_files()
