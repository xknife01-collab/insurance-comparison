import os
import xlrd
from bs4 import BeautifulSoup

parent_dir = ".."
xls_files = [f for f in os.listdir(parent_dir) if f.lower().endswith('.xls')]

html_count = 0
standard_count = 0
error_count = 0

html_files = []
standard_files = []

for f in xls_files:
    file_path = os.path.join(parent_dir, f)
    # Check if standard Excel or HTML
    try:
        wb = xlrd.open_workbook(file_path)
        standard_count += 1
        standard_files.append(f)
    except Exception as e:
        # Try reading as HTML
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as file_obj:
                content = file_obj.read()
            if '<table' in content.lower() or '<html' in content.lower():
                html_count += 1
                html_files.append(f)
            else:
                # Try cp949
                with open(file_path, 'r', encoding='cp949', errors='ignore') as file_obj:
                    content = file_obj.read()
                if '<table' in content.lower() or '<html' in content.lower():
                    html_count += 1
                    html_files.append(f)
                else:
                    error_count += 1
        except Exception as e2:
            error_count += 1

print(f"Total .xls files: {len(xls_files)}")
print(f"Standard Excel (xlrd readable): {standard_count}")
print(f"HTML format (xlrd fails, bs4 readable): {html_count}")
print(f"Errors/Other: {error_count}")

print("\nFirst 5 Standard files:")
print(standard_files[:5])

print("\nFirst 5 HTML files:")
print(html_files[:5])
