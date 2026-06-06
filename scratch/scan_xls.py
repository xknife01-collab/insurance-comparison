import os
import re
from html.parser import HTMLParser
import xlrd

class SimpleTableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables = []
        self.current_table = []
        self.current_row = []
        self.current_cell = ""
        self.in_cell = False

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.current_table = []
        elif tag == "tr":
            self.current_row = []
        elif tag in ["td", "th"]:
            self.in_cell = True
            self.current_cell = ""

    def handle_endtag(self, tag):
        if tag == "table":
            self.tables.append(self.current_table)
        elif tag == "tr":
            self.current_table.append(self.current_row)
        elif tag in ["td", "th"]:
            self.in_cell = False
            self.current_row.append(self.current_cell.strip())

    def handle_data(self, data):
        if self.in_cell:
            self.current_cell += data

def is_html(filepath):
    try:
        with open(filepath, "rb") as f:
            header = f.read(100)
        # Check if it has HTML tags
        header_text = header.decode('utf-8', errors='ignore').lower()
        if "<html" in header_text or "<table" in header_text or "xmlns:o=" in header_text:
            return True
        header_utf16 = header.decode('utf-16', errors='ignore').lower()
        if "<html" in header_utf16 or "<table" in header_utf16 or "xmlns:o=" in header_utf16:
            return True
        return False
    except Exception:
        return False

def parse_html_xls(filepath):
    # Try different encodings
    for encoding in ['utf-8', 'utf-16', 'cp949', 'euc-kr']:
        try:
            with open(filepath, "r", encoding=encoding) as f:
                content = f.read()
            parser = SimpleTableParser()
            parser.feed(content)
            if parser.tables:
                return parser.tables
        except Exception:
            continue
    return []

def parse_binary_xls(filepath):
    try:
        wb = xlrd.open_workbook(filepath)
        sheet = wb.sheet_by_index(0)
        data = []
        for r in range(sheet.nrows):
            row = [str(sheet.cell_value(r, c)) for c in range(sheet.ncols)]
            data.append(row)
        return [data]
    except Exception as e:
        # print(f"xlrd error for {filepath}: {e}")
        return []

def main():
    folder = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(folder) if f.lower().endswith('.xls')]
    print(f"Total .xls files in parent: {len(files)}")
    
    keyword_files = []
    
    for filename in sorted(files):
        path = os.path.join(folder, filename)
        html_flag = is_html(path)
        
        tables = []
        if html_flag:
            tables = parse_html_xls(path)
        else:
            tables = parse_binary_xls(path)
            
        if not tables:
            # print(f"[-] Could not parse: {filename}")
            continue
            
        # Search for property keywords in the parsed tables
        found = False
        text_preview = ""
        for t_idx, t in enumerate(tables):
            for r_idx, row in enumerate(t):
                row_str = " ".join(row)
                if any(kw in row_str for kw in ["재물", "소상공인", "종합재물", "화재배상"]):
                    found = True
                    text_preview = f"Table {t_idx} Row {r_idx}: {row_str[:200]}"
                    break
            if found:
                break
                
        if found:
            keyword_files.append((filename, html_flag, text_preview, len(tables)))
            
    print("\n=== FILES CONTAINING PROPERTY KEYWORDS ===")
    for filename, html_flag, preview, num_tables in keyword_files:
        print(f"File: {filename}")
        print(f"  Type: {'HTML' if html_flag else 'Binary XLS'}")
        print(f"  Tables: {num_tables}")
        print(f"  Preview: {preview}")
        print("-" * 50)

if __name__ == "__main__":
    main()
