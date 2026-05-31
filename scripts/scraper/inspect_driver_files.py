import os
import pandas as pd
from bs4 import BeautifulSoup
import warnings
import json

warnings.filterwarnings('ignore')

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
driver_keywords = ["운전자", "교통사고", "벌금", "변호사", "교통상해", "민식이법", "부상치료비", "자부상", "운전중"]

def check_file(filepath):
    filename = os.path.basename(filepath)
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".xls", ".xlsx"]:
        return None
        
    is_html = False
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            head = f.read(500)
            if "<html" in head.lower() or "<table" in head.lower():
                is_html = True
    except:
        pass

    matched_keywords = []
    matched_products = []
    
    if is_html:
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                soup = BeautifulSoup(f, 'html.parser')
                text = soup.get_text()
                for kw in driver_keywords:
                    if kw in text:
                        matched_keywords.append(kw)
                        
                table = soup.find('table')
                if table:
                    for tr in table.find_all('tr'):
                        tds = tr.find_all(['td', 'th'])
                        row_list = [" ".join(td.get_text().split()) for td in tds]
                        for val in row_list:
                            if "보험" in val and len(val) > 8 and any(k in val for k in ["운전자", "운전", "drive"]):
                                matched_products.append(val)
        except Exception as e:
            return None
    else:
        try:
            xl = pd.ExcelFile(filepath)
            for sheet in xl.sheet_names:
                df = xl.parse(sheet, header=None)
                text = df.to_string()
                for kw in driver_keywords:
                    if kw in text:
                        matched_keywords.append(kw)
                for idx, row in df.iterrows():
                    row_list = [str(val).strip() for val in row if pd.notna(val)]
                    for val in row_list:
                        if "보험" in val and len(val) > 8 and any(k in val for k in ["운전자", "운전", "drive"]):
                            matched_products.append(val)
        except Exception as e:
            return None
            
    if matched_keywords and matched_products:
        return {
            "file": filename,
            "type": "HTML" if is_html else "Excel",
            "keywords": list(set(matched_keywords)),
            "products": list(set(matched_products))[:5]
        }
    return None

if __name__ == "__main__":
    files = [f for f in os.listdir(root_dir) if f.endswith('.xls') or f.endswith('.xlsx')]
    driver_files = []
    for f in files:
        filepath = os.path.join(root_dir, f)
        res = check_file(filepath)
        if res:
            driver_files.append(res)
            
    output_path = os.path.join(root_dir, "insurance-comparison-main", "scripts", "scraper", "inspect_results.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(driver_files, f, ensure_ascii=False, indent=2)
    print(f"Results written to {output_path}. Matched {len(driver_files)} files.")
