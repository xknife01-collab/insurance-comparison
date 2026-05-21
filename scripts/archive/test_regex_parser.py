# -*- coding: utf-8 -*-
import pdfplumber
import os
import re

def test_regex_extraction(pdf_path):
    print(f"[*] Regex analysis on: {os.path.basename(pdf_path)}")
    try:
        with pdfplumber.open(pdf_path) as pdf:
            # 100~300페이지 집중 수색
            for i in range(100, min(300, len(pdf.pages))):
                text = pdf.pages[i].extract_text()
                if not text: continue
                
                # '나이(2자리) + 공백 + 보험료(3~10자리)' 패턴 매칭
                matches = re.findall(r'(\d{2})\s+(\d[,\d]{2,})', text)
                
                if matches and len(matches) > 10:
                    print(f"  [✔] Found Age-Rate pattern at Page {i+1}!")
                    print(f"  - Pattern Count: {len(matches)} items")
                    print("  - Samples (Age, Premium):")
                    for age, premium in matches[:10]:
                        print(f"    Age: {age}, Rate: {premium}")
                    return True
            
            print("[-] No clear numeric patterns found in the given range.")
            return False
    except Exception as e:
        print(f"[-] Error: {e}")
        return False

if __name__ == "__main__":
    dl_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\downloads\hanwha_nonlife"
    files = [f for f in os.listdir(dl_dir) if f.lower().endswith(".pdf")]
    if files:
        test_regex_extraction(os.path.join(dl_dir, files[0]))
