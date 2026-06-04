import os
import re

dir_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
files = [f for f in os.listdir(dir_path) if f.endswith('.xls')]

print(f"Total files: {len(files)}")

credit_keywords_unicode = ["신용", "대출", "상환", "카디프", "대출안심"]
# Let's also compile bytes patterns for cp949 and utf-8
keywords_bytes = {}
for kw in credit_keywords_unicode:
    keywords_bytes[kw] = [kw.encode('utf-8'), kw.encode('cp949'), kw.encode('utf-16le'), kw.encode('utf-16be')]

matched_files = []
for f in files:
    full_path = os.path.join(dir_path, f)
    try:
        with open(full_path, 'rb') as file:
            content_bytes = file.read()
            
            # Check is html
            is_html = b"<html" in content_bytes.lower() or b"<table" in content_bytes.lower()
            
            found = []
            for kw, byte_variants in keywords_bytes.items():
                for b_var in byte_variants:
                    if b_var in content_bytes:
                        found.append(kw)
                        break
            if found:
                matched_files.append((f, is_html, found))
    except Exception as e:
        print(f"Error reading {f}: {e}")

print(f"Matched credit files ({len(matched_files)}):")
for f, is_html, kw in matched_files:
    print(f"File: {f}, HTML: {is_html}, Keywords: {kw}")
