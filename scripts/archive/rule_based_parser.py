# -*- coding: utf-8 -*-
import pdfplumber
import os
import json
import re

class SamsungFireRuleParser:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.output_data = []

    def parse(self):
        filename = os.path.basename(self.pdf_path)
        print(f"[*] Parsing PDF: {filename}")
        
        with pdfplumber.open(self.pdf_path) as pdf:
            target_pages = []
            for i, page in enumerate(pdf.pages):
                # 성능을 위해 150페이지 이상은 검색 중단 (보통 초중반에 요율표 위치)
                if i > 150: break
                
                text = page.extract_text()
                if text and ("보험료" in text and ("예시" in text or "부문" in text or "표" in text)):
                    # 목차나 용어 정의 제외를 위해 키워드 조합 확인
                    if "가입금액" in text or "상해" in text or "질병" in text:
                        target_pages.append(i)
                        if len(target_pages) >= 5: break
            
            if not target_pages:
                return {"status": "error", "message": "No rate tables found"}

            all_tables = []
            for page_idx in target_pages:
                page = pdf.pages[page_idx]
                tables = page.extract_tables()
                for t in tables:
                    if self.is_valid_table(t):
                        # 행 정제
                        cleaned_table = []
                        for row in t:
                            clean_row = [str(c).strip().replace('\n', ' ') if c else "" for c in row]
                            if any(clean_row):
                                cleaned_table.append(clean_row)
                        all_tables.append({
                            "page": page_idx + 1,
                            "data": cleaned_table
                        })

            return {
                "status": "success",
                "filename": filename,
                "tables": all_tables
            }

    def is_valid_table(self, table):
        if not table or len(table) < 3: return False
        header = "".join([str(c) for r in table[:2] for c in r if c])
        # 보험료 표 특유의 키워드 검증
        keywords = ["남자", "여자", "남성", "여성", "나이", "세", "보험료", "원"]
        return sum(1 for kw in keywords if kw in header) >= 2

if __name__ == "__main__":
    pdf_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\downloads\samsung_fire"
    # 두 가지 샘플 테스트
    samples = [
        "무배당_삼성화재_간편보험_3.10.5_새로고침(2601.3)(자동갱신형)(납입면제,_해약환급금_미지급형).pdf",
        "무배당_삼성화재_운전자보험_안전운전_파트너_플러스(2601.10)_1종(연만기,납입면제형).pdf"
    ]
    
    results = []
    for sname in samples:
        path = os.path.join(pdf_dir, sname)
        if os.path.exists(path):
            parser = SamsungFireRuleParser(path)
            res = parser.parse()
            results.append(res)
    
    output_log = "extracted_rates_debug.json"
    with open(output_log, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\n[OK] Extraction completed. Results saved to {output_log}")
    print(f"[*] Total tables found: {sum(len(r.get('tables', [])) for r in results)}")
