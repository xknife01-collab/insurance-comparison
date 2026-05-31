# -*- coding: utf-8 -*-
import os
import json
import re
import pdfplumber

class InsuranceDataRefiner:
    def __init__(self):
        self.categories = {
            "실손": ["실손"],
            "암": ["암보험", "암보장"],
            "종합/건강": ["건강보험", "종합보험"],
            "운전자": ["운전자"],
            "어린이/자녀": ["자녀", "어린이", "태아"],
            "치아": ["치아", "치과"],
            "간병/치매": ["간병", "치매"],
            "종신/정기": ["종신", "정기"],
            "펫": ["펫", "강아지", "고양이", "반려"],
            "간편/유병자": ["간편", "유병"],
            "자동차": ["자동차"]
        }
        self.download_root = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\downloads\samsung_fire"
        self.output_file = "samsung_fire_refined_data.json"

    def refine_all(self):
        files = os.listdir(self.download_root)
        print(f"[*] Total files in Samsung Fire: {len(files)}")
        
        refined_results = []
        for filename in files:
            if not filename.endswith(".pdf"): continue
            
            # 카테고리 매칭
            matched_cat = self.get_category(filename)
            if matched_cat:
                print(f"  [>>>] Processing {matched_cat}: {filename}")
                data = self.parse_pdf(os.path.join(self.download_root, filename))
                if data:
                    refined_results.append({
                        "category": matched_cat,
                        "product_name": filename.replace(".pdf", ""),
                        "rates": data
                    })

        with open(self.output_file, "w", encoding="utf-8") as f:
            json.dump(refined_results, f, ensure_ascii=False, indent=2)
        print(f"\n[✔] Refinement Completed! Saved to {self.output_file}")

    def get_category(self, filename):
        for cat, keywords in self.categories.items():
            for kw in keywords:
                if kw in filename:
                    return cat
        return None

    def parse_pdf(self, pdf_path):
        """
        비용 없는 규칙 기반 파싱 (pdfplumber)
        전체 데이터보다는 상징적인 보험료 데이터(예: 40세 기준)를 찾는 로직
        """
        extracted_data = []
        try:
            with pdfplumber.open(pdf_path) as pdf:
                # 보험료 표가 있을만한 페이지 검색 (초반 100페이지 이내)
                for i in range(min(100, len(pdf.pages))):
                    page = pdf.pages[i]
                    text = page.extract_text()
                    if text and ("보험료" in text and ("예시" in text or "부문" in text or "표" in text)):
                        tables = page.extract_tables()
                        for t in tables:
                            if self.is_valid_rate_table(t):
                                refined_table = self.structure_table(t)
                                if refined_table:
                                    extracted_data.append({
                                        "page": i + 1,
                                        "table_data": refined_table
                                    })
                                    # 한 상품당 일단 하나의 주요 표만 추출 (중복/방대함 방지)
                                    return extracted_data
        except Exception as e:
            print(f"    [-] Error parsing {os.path.basename(pdf_path)}: {e}")
        return extracted_data

    def is_valid_rate_table(self, table):
        if not table or len(table) < 5: return False
        header_text = "".join([str(c) for r in table[:3] for c in r if c])
        keywords = ["성별", "나이", "세", "보험료", "남자", "여자", "기준"]
        return sum(1 for kw in keywords if kw in header_text) >= 2

    def structure_table(self, table):
        """
        표를 간단한 리스트 형태로 정제
        """
        clean_table = []
        for row in table:
            # None 처리 및 공백 제거
            clean_row = [str(c).strip().replace('\n', ' ') if c else "" for c in row]
            if any(clean_row):
                clean_table.append(clean_row)
        return clean_table

if __name__ == "__main__":
    refiner = InsuranceDataRefiner()
    refiner.refine_all()
