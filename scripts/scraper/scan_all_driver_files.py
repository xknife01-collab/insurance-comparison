import os
import pandas as pd
from bs4 import BeautifulSoup
import warnings
import json

warnings.filterwarnings('ignore')

root_dir = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
driver_keywords = ["운전자", "교통사고", "벌금", "변호사", "교통상해", "민식이법", "부상치료비", "자부상", "운전중"]
companies = ['DB손보', '메리츠화재', '삼성화재', 'KB손보', '현대해상', '한화손보', '롯데손보', '농협손보', '흥국화재', 'MG손보', 'AXA손보', 'AIG손보', '하나손보']

def scan_all_files():
    files = [f for f in os.listdir(root_dir) if f.endswith('.xls') or f.endswith('.xlsx')]
    print(f"Total files to scan: {len(files)}")
    matched_files = []
    
    for f in files:
        filepath = os.path.join(root_dir, f)
        is_html = False
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as file_obj:
                head = file_obj.read(500)
                if "<html" in head.lower() or "<table" in head.lower():
                    is_html = True
        except:
            pass
            
        driver_keyword_count = 0
        all_text = ""
        
        if is_html:
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as file_obj:
                    soup = BeautifulSoup(file_obj, 'html.parser')
                    all_text = soup.get_text()
            except Exception as e:
                continue
        else:
            try:
                xl = pd.ExcelFile(filepath)
                text_list = []
                for sheet in xl.sheet_names:
                    df = xl.parse(sheet, header=None)
                    text_list.append(df.to_string())
                all_text = "\n".join(text_list)
            except Exception as e:
                continue
                
        matched_kws = [kw for kw in driver_keywords if kw in all_text]
        if len(matched_kws) >= 2: # At least 2 keywords to avoid random accident matches
            # Let's count how many times "운전자" or "운전" appears
            cnt_driver = all_text.count("운전자") + all_text.count("운전")
            if cnt_driver > 2:
                matched_files.append({
                    "file": f,
                    "type": "HTML" if is_html else "Excel",
                    "matched_keywords": matched_kws,
                    "driver_count": cnt_driver
                })
                
    print(f"Matched {len(matched_files)} files:")
    for mf in matched_files:
        print(f"- {mf['file']} ({mf['type']}): keywords={mf['matched_keywords']}, count={mf['driver_count']}")

if __name__ == "__main__":
    scan_all_files()
