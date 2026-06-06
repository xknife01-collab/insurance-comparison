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

def analyze_all_files():
    folder = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(folder) if f.lower().endswith('.xls')]
    
    results = []
    
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
            
        # Inspect sheet content
        all_text = ""
        row_count = 0
        for t in tables:
            for row in t:
                all_text += " " + " ".join(row)
                row_count += 1
                
        # Look for payment terms
        payment_type = "UNKNOWN"
        # Search patterns
        monthly_match = re.findall(r'(월납|매월|월\s*\d+\s*원|월보험료)', all_text)
        annual_match = re.findall(r'(연납|연\s*\d+\s*원|연보험료|1년납|연간)', all_text)
        
        if monthly_match and annual_match:
            payment_type = f"BOTH (monthly: {len(monthly_match)}, annual: {len(annual_match)})"
        elif monthly_match:
            payment_type = "MONTHLY"
        elif annual_match:
            payment_type = "ANNUAL"
            
        # Look for category indicators
        keywords = {
            "property": ["재물", "소상공인", "종합재물", "사업장", "상가", "공장", "창고", "비즈니스", "biz", "안심파트너", "성공파트너"],
            "fire": ["주택화재", "화재보험", "가정종합"],
            "pet": ["펫보험", "반려견", "반려묘", "애견", "슬개골"],
            "driver": ["운전자", "벌금", "교통사고", "변호사선임"],
            "golf": ["골프", "홀인원", "골프클럽", "알바트로스"],
            "car": ["자동차보험", "대인배상", "자기차량손해", "자차"],
            "caregiving": ["간병", "치매", "장기요양", "재가", "시설급여"],
            "annuity": ["연금저축", "연금보험", "세액공제"],
            "savings": ["저축보험", "일반저축", "목돈마련"],
            "wholelife": ["종신보험", "사망보험금", "정기보험"],
            "variable": ["변액", "투자형", "펀드"],
            "credit": ["신용보험", "채무상환", "대출상환"]
        }
        
        matched_categories = []
        for cat, kws in keywords.items():
            for kw in kws:
                if kw in all_text:
                    matched_categories.append(cat)
                    break
                    
        # Extract product names and companies (heuristically)
        # Let's peek at the first few rows to find company and product names
        sample_rows = []
        for t in tables[:1]:
            for r in t[:15]:
                # clean up row
                row_clean = [cell.strip() for cell in r if cell.strip()]
                if row_clean:
                    sample_rows.append(row_clean)
                    
        results.append({
            "filename": filename,
            "is_html": html_flag,
            "row_count": row_count,
            "payment_type": payment_type,
            "categories": matched_categories,
            "sample_rows": sample_rows[:6]
        })
        
    # Write report
    report_path = os.path.join(folder, "insurance-comparison-main", "scratch", "scan_results.txt")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(f"Total processed files: {len(results)}\n\n")
        for res in results:
            f.write(f"Filename: {res['filename']}\n")
            f.write(f"Type: {'HTML' if res['is_html'] else 'Binary XLS'}\n")
            f.write(f"Row count: {res['row_count']}\n")
            f.write(f"Payment type: {res['payment_type']}\n")
            f.write(f"Matched Categories: {', '.join(res['categories'])}\n")
            f.write("Sample rows:\n")
            for r in res['sample_rows']:
                f.write(f"  {r}\n")
            f.write("=" * 80 + "\n\n")
            
    print(f"Report written to: {report_path}")
    
    # Filter for property files
    print("\nPotential Property Insurance Files:")
    for res in results:
        if "property" in res['categories'] and "caregiving" not in res['categories'] and "wholelife" not in res['categories']:
            print(f"- {res['filename']} (HTML={res['is_html']}, Pay={res['payment_type']}, Cats={res['categories']})")

if __name__ == "__main__":
    analyze_all_files()
