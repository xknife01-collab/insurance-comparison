import os
import pandas as pd
from bs4 import BeautifulSoup
import warnings
import json

warnings.filterwarnings('ignore')

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
companies = ['DB손보', '메리츠화재', '삼성화재', 'KB손보', '현대해상', '한화손보', '롯데손보', '농협손보', '흥국화재', 'MG손보', 'AXA손보', 'AIG손보', '하나손보']

target_files = [
    "file_40.xls", "file_41.xls", "file_42.xls", "file_43.xls", "file_47.xls", "file_49.xls",
    "장기보장성 비교 공시 (11).xls", "장기보장성 비교 공시 (2).xls", "장기보장성 비교 공시 (3).xls",
    "장기보장성 비교 공시 (7).xls", "장기보장성 비교 공시 (9).xls"
]

def check_file_detail(filepath):
    filename = os.path.basename(filepath)
    is_html = False
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            head = f.read(500)
            if "<html" in head.lower() or "<table" in head.lower():
                is_html = True
    except:
        pass

    products = set()
    coverages = set()
    
    if is_html:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                soup = BeautifulSoup(f, 'html.parser')
                table = soup.find('table')
                if table:
                    for tr in table.find_all('tr'):
                        tds = tr.find_all(['td', 'th'])
                        row_list = [" ".join(td.get_text().split()) for td in tds]
                        for val in row_list:
                            if "보험" in val and len(val) > 8:
                                products.add(val)
                            if any(k in val for k in ["벌금", "변호사", "교통사고", "부상치료비", "교통상해"]):
                                coverages.add(val)
        except Exception as e:
            pass
    else:
        try:
            xl = pd.ExcelFile(filepath)
            for sheet in xl.sheet_names:
                df = xl.parse(sheet, header=None)
                for idx, row in df.iterrows():
                    row_list = [str(val).strip() for val in row if pd.notna(val)]
                    for val in row_list:
                        if "보험" in val and len(val) > 8:
                            products.add(val)
                        if any(k in val for k in ["벌금", "변호사", "교통사고", "부상치료비", "교통상해"]):
                            coverages.add(val)
        except Exception as e:
            pass
            
    return {
        "file": filename,
        "type": "HTML" if is_html else "Excel",
        "products": list(products)[:10],
        "coverages": list(coverages)[:10]
    }

if __name__ == "__main__":
    results = []
    for f in target_files:
        filepath = os.path.join(root_dir, f)
        if os.path.exists(filepath):
            results.append(check_file_detail(filepath))
            
    output_path = os.path.join(root_dir, "insurance-comparison-main", "scripts", "scraper", "inspect_details.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"Details written to {output_path}.")
