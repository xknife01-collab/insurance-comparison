# -*- coding: utf-8 -*-
import pdfplumber
import os
import json
import re

def test_hanwha_parse(pdf_path):
    print(f"[*] Analyzing Hanwha PDF: {os.path.basename(pdf_path)}")
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"  - Total Pages: {len(pdf.pages)}")
            
            # 요율표가 있을 만한 페이지 검색 (10~50페이지 사이)
            start_page = 5
            end_page = min(len(pdf.pages), 100)
            
            target_page_idx = -1
            for i in range(start_page, end_page):
                text = pdf.pages[i].extract_text()
                if text and ("성별" in text and "연령" in text and "기준" in text and "보험료" in text):
                    print(f"  [✔] Found potential rate table at page {i+1}")
                    target_page_idx = i
                    break
            
            if target_page_idx == -1:
                print("  [-] Could not find rate table page automatically. Trying page 10...")
                target_page_idx = min(len(pdf.pages)-1, 10)

            # 표 추출
            page = pdf.pages[target_page_idx]
            tables = page.extract_tables()
            
            extracted_data = []
            for t_idx, table in enumerate(tables):
                print(f"  [Table {t_idx+1}] Extracted {len(table)} rows")
                # 상위 5개 행만 보여주기 (테스트)
                for row in table[:10]:
                    extracted_data.append([str(c).strip().replace("\n", " ") if c else "" for c in row])
            
            return {
                "page": target_page_idx + 1,
                "data_sample": extracted_data
            }
            
    except Exception as e:
        print(f"  [-] Error parsing PDF: {e}")
        return None

if __name__ == "__main__":
    # 한화손보 최신 파일 중 하나 선택
    dl_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\downloads\hanwha_nonlife"
    files = [f for f in os.listdir(dl_dir) if f.lower().endswith(".pdf")]
    
    if files:
        # 하나 골라서 테스트
        sample_path = os.path.join(dl_dir, files[0])
        result = test_hanwha_parse(sample_path)
        
        if result:
            print("\n=== Extracted Data Sample (Python Only) ===")
            for row in result["data_sample"]:
                print(f"  {row}")
    else:
        print("[-] No PDF files found in Hanwha download directory.")
