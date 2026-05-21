# -*- coding: utf-8 -*-
import pdfplumber
import os
import json

def extract_hanwha_premium_test(pdf_path):
    print(f"[*] Targeting: {os.path.basename(pdf_path)}")
    extracted_results = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            # 보통 사업방법서의 요율표는 10~80페이지 사이에 위치함
            for i in range(5, min(80, len(pdf.pages))):
                page = pdf.pages[i]
                text = page.extract_text()
                
                # 요율표 페이지인지 키워드로 1차 필터링
                if text and ("기준" in text or "보험료" in text) and ("남자" in text or "남성" in text):
                    tables = page.extract_tables()
                    if tables:
                        print(f"  [✔] Found Table at Page {i+1}")
                        for t in tables:
                            # 표의 유효성 검사 (행이 일정 수 이상이고 숫자가 포함되어야 함)
                            if len(t) > 5:
                                # 샘플 데이터 5줄만 저장
                                clean_rows = []
                                for row in t[:10]:
                                    clean_row = [str(c).strip().replace("\n", " ") if c else "" for c in row]
                                    if any(clean_row):
                                        clean_rows.append(clean_row)
                                
                                extracted_results.append({
                                    "page": i + 1,
                                    "sample": clean_rows
                                })
                        # 테스트를 위해 테이블 하나만 찾으면 중단 가능 혹은 더 수집
                        if len(extracted_results) >= 2: break
            
            return extracted_results
            
    except Exception as e:
        print(f"  [-] Error: {e}")
        return []

if __name__ == "__main__":
    dl_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\downloads\hanwha_nonlife"
    # '_༭.pdf' 패턴의 파일 찾기
    targets = [f for f in os.listdir(dl_dir) if "༭.pdf" in f and "2026" in f]
    
    if not targets:
        # 일반 pdf로 대체
        targets = [f for f in os.listdir(dl_dir) if f.endswith(".pdf")][:1]

    if targets:
        path = os.path.join(dl_dir, targets[0])
        results = extract_hanwha_premium_test(path)
        
        print("\n=== Python Rule-Based Extraction Result (Hanwha) ===")
        if results:
            for res in results:
                print(f"\n[Page {res['page']}] Sample Rows:")
                for r in res['sample']:
                    print(f"  {r}")
        else:
            print("[-] No valid rate tables found in the first 80 pages.")
