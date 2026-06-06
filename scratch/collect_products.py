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
            header = f.read(200)
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
        return []

def main():
    folder = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(folder) if f.lower().endswith('.xls')]
    
    output_path = os.path.join(folder, "insurance-comparison-main", "scratch", "all_products_detailed.txt")
    
    with open(output_path, "w", encoding="utf-8") as out:
        out.write("=== ALL PRODUCTS DETAILED SEARCH ===\n\n")
        
        for filename in sorted(files):
            path = os.path.join(folder, filename)
            html_flag = is_html(path)
            
            tables = []
            if html_flag:
                tables = parse_html_xls(path)
            else:
                tables = parse_binary_xls(path)
                
            if not tables:
                continue
                
            # Find unique combinations of company name and product name
            companies = set()
            products = set()
            
            # Check for payment types in all text
            all_text = ""
            row_count = 0
            
            for t_idx, t in enumerate(tables):
                for r_idx, row in enumerate(t):
                    row_clean = [cell.strip() for cell in row if cell.strip()]
                    if not row_clean:
                        continue
                    row_str = " ".join(row_clean)
                    all_text += " " + row_str
                    row_count += 1
                    
                    # Heuristically detect company (usually index 0 or 1 in first few cols)
                    # and product (contains '보험', '공제', '파트너', '케어', etc.)
                    for cell in row_clean:
                        # Company detection
                        for com in ["메리츠", "삼성", "현대해상", "KB", "DB", "한화", "롯데", "MG", "흥국", "농협", "교보", "미래에셋", "신한라이프", "동양", "AIG", "캐롯"]:
                            if com in cell and len(cell) < 15:
                                companies.add(cell)
                        # Product name detection (usually longer, starts with (무) or contains 보험)
                        if ("무배당" in cell or "(무)" in cell or "보험" in cell or "공제" in cell) and len(cell) > 5 and len(cell) < 60:
                            # clean up product name
                            clean_prod = re.sub(r'\s+', ' ', cell).strip()
                            products.add(clean_prod)
            
            # Determine payment term
            payment_terms = []
            # Check for monthly
            if any(kw in all_text for kw in ["월납", "월보험료", "매월", "월납입"]):
                payment_terms.append("월납(Monthly)")
            # Check for annual
            if any(kw in all_text for kw in ["연납", "연보험료", "1년납", "연간", "연납입"]):
                payment_terms.append("연납/1년납(Annual)")
            # Check for single/lump sum
            if any(kw in all_text for kw in ["일시납"]):
                payment_terms.append("일시납(LumpSum)")
                
            term_str = ", ".join(payment_terms) if payment_terms else "UNKNOWN"
            
            # Write findings for this file
            out.write(f"File: {filename}\n")
            out.write(f"  Type: {'HTML' if html_flag else 'Binary XLS'}\n")
            out.write(f"  Row Count: {row_count}\n")
            out.write(f"  Payment Terms Found: {term_str}\n")
            out.write(f"  Companies: {', '.join(sorted(companies))}\n")
            out.write(f"  Products ({len(products)} found):\n")
            for p in sorted(products)[:10]:
                out.write(f"    - {p}\n")
            if len(products) > 10:
                out.write(f"    - ... and {len(products)-10} more\n")
            out.write("-" * 80 + "\n\n")
            
    print(f"Scan complete. Results written to: {output_path}")

if __name__ == "__main__":
    main()
