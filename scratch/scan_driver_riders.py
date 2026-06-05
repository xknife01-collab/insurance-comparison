import os
import pandas as pd
from bs4 import BeautifulSoup
import warnings

warnings.filterwarnings('ignore')

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
companies = ['DB손보', '메리츠화재', '삼성화재', 'KB손보', '현대해상', '한화손보', '롯데손보', '농협손보', '흥국화재', 'MG손보', 'AXA손보', 'AIG손보', '하나손보', '신한EZ손해보험']

def clean_txt(val):
    return " ".join(str(val).split()).strip()

def analyze_file(filepath):
    filename = os.path.basename(filepath)
    is_html = False
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            head = f.read(500)
            if "<html" in head.lower() or "<table" in head.lower():
                is_html = True
    except:
        pass
        
    rows = []
    if is_html:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')
            table = soup.find('table')
            if table:
                for tr in table.find_all('tr'):
                    tds = tr.find_all(['td', 'th'])
                    row_list = [clean_txt(td.get_text()) for td in tds]
                    if row_list:
                        rows.append(row_list)
        except:
            pass
    else:
        try:
            xl = pd.ExcelFile(filepath)
            for sheet in xl.sheet_names:
                df = xl.parse(sheet, header=None)
                for idx, r in df.iterrows():
                    row_list = [clean_txt(x) for x in r.tolist() if pd.notna(x)]
                    if row_list:
                        rows.append(row_list)
        except:
            pass
            
    # Look for driver-related rows in this file
    matches = []
    for r in rows:
        r_str = " ".join(r)
        # Check if the row contains typical riders
        if any(kw in r_str for kw in ["교통사고처리지원금", "형사합의", "변호사선임", "벌금"]):
            matches.append(r)
            
    return filename, matches

def main():
    files = [f for f in os.listdir(root_dir) if f.endswith('.xls') or f.endswith('.xlsx')]
    print(f"Total files in directory: {len(files)}")
    
    detailed_files = []
    for filename in files:
        filepath = os.path.join(root_dir, filename)
        fname, matches = analyze_file(filepath)
        if len(matches) > 0:
            # Check if there are different limits for the same coverage name
            # Let's group matches by their first column or string matching
            detailed_files.append((fname, matches))
            
    print(f"Found {len(detailed_files)} files containing driver riders.")
    print("\n=== Sample files details ===")
    
    # Print sample files to check if they have multiple rows for the same coverage
    sample_count = 0
    for fname, matches in detailed_files:
        print(f"\n[File: {fname}] (Total matched rows: {len(matches)})")
        
        # Let's find distinct row lengths or structures
        # Group by rider name (usually column 0 or 1 or 2)
        rider_names = {}
        for m in matches[:15]:  # print first 15 matched rows
            # Find the element containing our keywords
            rider_name = "unknown"
            for x in m:
                if any(kw in x for kw in ["교통사고처리지원금", "형사합의", "변호사선임", "벌금"]):
                    rider_name = x
                    break
            print(f"  Row: {m[:6]} -> Rider parsed: {rider_name}")
            
        sample_count += 1
        if sample_count >= 5:
            break

if __name__ == "__main__":
    main()
