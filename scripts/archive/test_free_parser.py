# -*- coding: utf-8 -*-
import pdfplumber
import os

def extract_premium_data_fast(pdf_dir):
    # 폴더 내 파일 하나 무작위 선택 (날짜 필터링)
    files = [f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")]
    target_file = None
    for f in files:
        if "2025" in f or "2026" in f:
            target_file = os.path.join(pdf_dir, f)
            break
    
    if not target_file:
        print("[-] No target PDF file found.")
        return

    print(f"[*] Analyzing (Free Python Mode): {os.path.basename(target_file)}")
    
    try:
        with pdfplumber.open(target_file) as pdf:
            # 10~300페이지까지 광범위하게 수색 (요율표는 보통 뒷부분에 있음)
            for i in range(10, min(300, len(pdf.pages))):
                page = pdf.pages[i]
                text = page.extract_text()
                
                # 표가 감지되고 특정 키워드가 포함된 경우
                if text and ("성별" in text or "보험료" in text or "표" in text):
                    tables = page.extract_tables()
                    for t_idx, table in enumerate(tables):
                        if len(table) > 5: # 일정 규모 이상의 표만 분석
                            print(f"\n[✔] Found Rate Table at Page {i+1} (Table {t_idx+1})")
                            print("--- Sample Rows Extracted ---")
                            for row in table[:15]:
                                # 데이터가 너무 길 경우 다듬어서 출력
                                clean_row = [str(c).replace("\n", " ")[:20] if c else "" for c in row]
                                print(f"  {clean_row}")
                            return True
            
            print("[-] No premium tables found in the first 50 pages.")
            return False
            
    except Exception as e:
        print(f"[-] Error parsing PDF: {e}")
        return False

if __name__ == "__main__":
    dl_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\downloads\hanwha_nonlife"
    extract_premium_data_fast(dl_dir)
