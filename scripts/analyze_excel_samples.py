
import os
import re
from html.parser import HTMLParser

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

def analyze_file(filepath):
    print(f"\n[FILE ANALYZING]: {os.path.basename(filepath)}")
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        parser = SimpleTableParser()
        parser.feed(content)
        
        if not parser.tables:
            print("[-] No tables found.")
            return

        # Usually the first table has the main data
        main_table = parser.tables[1] if len(parser.tables) > 1 else parser.tables[0]
        
        # Print header
        if main_table:
            header = main_table[0]
            print(f"[*] Columns: {', '.join(header)}")
            print("-" * 10)
            # Print first 2 data rows
            for i, row in enumerate(main_table[1:6]):
                print(f"Row {i+1}: {row}")
            print(f"... Total {len(main_table)} rows.")
            
    except Exception as e:
        print(f"[-] Error: {e}")

def main():
    root = "scripts/scraper/raw_data"
    files = [
        "보장성_상품비교_20260406102522903.xls",
        "실손의료보험_상품비교_20260406102650414.xls",
        "장기보장성 비교 공시.xls"
    ]
    
    for f in files:
        analyze_file(os.path.join(root, f))

if __name__ == "__main__":
    main()
