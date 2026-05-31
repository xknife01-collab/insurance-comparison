# -*- coding: utf-8 -*-
import os
import time
import json
import sys
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
# from pdf_parser import InsurancePDFParser
from dotenv import load_dotenv

if sys.stdout.encoding != 'utf-8':
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    except:
        pass

# .env 로드
load_dotenv()

class SamsungFireFullScraper:
    def __init__(self):
        self.base_url = "https://www.samsungfire.com/vh/page/VH.HPIF0103.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "samsung_fire")
        if not os.path.exists(self.download_root):
            os.makedirs(self.download_root)
        
        self.results_file = "samsung_fire_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Full-Scale Samsung Fire Scraper...")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True)
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}")
            page.goto(self.base_url, wait_until="networkidle")
            time.sleep(3)

            # 1. 메인 카테고리 목록
            categories = ["장기", "자동차", "일반보험", "퇴직연금", "퇴직보험"]
            
            for cat_name in categories:
                print(f"\n[>>>] Processing Main Category: {cat_name}")
                try:
                    # 메인 카테고리 선택
                    page.locator(f"a[title='{cat_name}']").click()
                    time.sleep(2)

                    # 2. 서브 카테고리 (장기보험 등에서 나타남)
                    sub_cats = page.locator("ul#product_gubun li a").all()
                    sub_cat_titles = [sc.get_attribute("title") for sc in sub_cats]
                    
                    if not sub_cat_titles:
                        # 서브 카테고리가 없는 경우 (자동차보험 등) 바로 상품 리스트 처리
                        self.process_product_list(page, cat_name, "Default")
                    else:
                        for sc_title in sub_cat_titles:
                            print(f"  [>] Sub Category: {sc_title}")
                            page.locator(f"ul#product_gubun a[title='{sc_title}']").click()
                            time.sleep(2)
                            self.process_product_list(page, cat_name, sc_title)
                
                except Exception as e:
                    print(f"  [-] Error in category {cat_name}: {e}")

            browser.close()
        
        # 전체 결과 저장
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[✔] Full Scrape Completed! Total products processed: {len(self.all_data)}")

    def process_product_list(self, page, main_cat, sub_cat):
        """
        현재 선택된 카테고리의 상품 리스트를 순회합니다.
        """
        product_links = page.locator("ul#product_list li a").all()
        product_count = len(product_links)
        print(f"    [*] Found {product_count} products in {main_cat} > {sub_cat}")

        for i in range(product_count):
            try:
                # 리스트가 갱신될 수 있으므로 매번 새로 찾음
                current_products = page.locator("ul#product_list li a")
                product_btn = current_products.nth(i)
                product_name = product_btn.inner_text().strip()
                
                print(f"      [{i+1}/{product_count}] Processing Product: {product_name}")
                product_btn.click()
                time.sleep(1.5)

                # 최신 판매 기간 선택 (보통 첫 번째)
                dates = page.locator("ul#date_list li a")
                if dates.count() > 0:
                    dates.first.click()
                    time.sleep(2)

                    # 사업방법서 다운로드 버튼 찾기
                    download_btn = page.locator("button[title*='사업방법서']").first
                    if download_btn.count() > 0:
                        file_name = f"{product_name.replace(' ', '_')}.pdf"
                        save_path = os.path.join(self.download_root, file_name)
                        
                        # 다운로드 실행
                        with page.expect_download() as download_info:
                            download_btn.click()
                        download = download_info.value
                        download.save_as(save_path)
                        print(f"        [+] Downloaded: {file_name}")

                        # PDF 분석 (Gemini 호출 - 시간/비용 절약을 위해 여기서는 로그만 남기거나 선택적으로 실행)
                        # self.parse_pdf(save_path, product_name, main_cat, sub_cat)
                        self.all_data.append({
                            "main_category": main_cat,
                            "sub_category": sub_cat,
                            "product_name": product_name,
                            "pdf_path": save_path
                        })
                    else:
                        print(f"        [-] No business manual found for {product_name}")
                else:
                    print(f"        [-] No sales period found for {product_name}")

            except Exception as e:
                print(f"      [-] Error processing product at index {i}: {e}")

    # def parse_pdf(self, pdf_path, product_name, main_cat, sub_cat):
    #     """
    #     Gemini AI를 사용하여 PDF를 분석합니다.
    #     """
    #     try:
    #         parser = InsurancePDFParser(api_key=os.environ.get("GOOGLE_API_KEY"))
    #         raw_text = parser.extract_table_data(pdf_path)
    #         json_data = parser.convert_to_json(raw_text)
    #         
    #         # TODO: DB 적재 로직 추가 (db_loader.py 연동)
    #         print(f"        [OK] AI Analysis completed.")
    #         return json_data
    #     except Exception as e:
    #         print(f"        [-] AI Analysis failed: {e}")
    #         return None

if __name__ == "__main__":
    scraper = SamsungFireFullScraper()
    scraper.scrape_all()
