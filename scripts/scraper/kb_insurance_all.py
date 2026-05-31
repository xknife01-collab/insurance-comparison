# -*- coding: utf-8 -*-
import os
import time
import json
import sys
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
from dotenv import load_dotenv

if sys.stdout.encoding != 'utf-8':
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    except:
        pass

# .env 로드
load_dotenv()

class KBInsuranceScraper:
    def __init__(self):
        self.base_url = "https://www.kbinsure.co.kr/CG802030001.ec"
        self.download_root = os.path.join(os.getcwd(), "downloads", "kb_insurance")
        if not os.path.exists(self.download_root):
            os.makedirs(self.download_root)
        
        self.results_file = "kb_insurance_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting KB Insurance Scraper (Final robust version)...")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True)
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}")
            page.goto(self.base_url, wait_until="networkidle")
            time.sleep(5)

            try:
                # 1. 판매중인 상품 선택
                # select#search_onsale_yn 에서 '판매중' (Y) 선택
                page.select_option("select#search_onsale_yn", value="Y")
                time.sleep(1)

                # 2. 카테고리 (보험종류) 순회
                # select#search_gubun 내의 모든 옵션
                # 0: 전체, 1: 자동차, 2: 질병, ...
                categories = page.locator("select#search_gubun option").all()
                cat_count = len(categories)
                print(f"[*] Found {cat_count} category options.")

                for i in range(1, cat_count): # 0(전체) 제외
                    try:
                        cat_option = page.locator("select#search_gubun option").nth(i)
                        cat_name = cat_option.inner_text().strip()
                        cat_value = cat_option.get_attribute("value")
                        
                        print(f"\n[>>>] Selecting Category: {cat_name} ({cat_value})")
                        page.select_option("select#search_gubun", value=cat_value)
                        
                        # 조회 버튼 클릭
                        page.locator("button.btn_brown_small:has-text('조회')").click()
                        time.sleep(3) # 목록 로딩 대기

                        # 3. 상품 목록 추출
                        # a[href^="javascript:detail"]
                        products = page.locator('a[href^="javascript:detail"]').all()
                        print(f"  [*] Found {len(products)} products in {cat_name}.")

                        for j in range(len(products)):
                            try:
                                # 리스트가 바뀌었을 수 있으므로 다시 locator 잡음
                                prod = page.locator('a[href^="javascript:detail"]').nth(j)
                                prod_name = prod.inner_text().strip()
                                if not prod_name: continue
                                
                                print(f"    [{j+1}/{len(products)}] Product: {prod_name}")
                                # 상세 페이지 이동
                                prod.click()
                                time.sleep(3) # 상세 로딩 대기

                                # 4. 상세 페이지 내 사업방법서(PDF) 다운로드
                                # Selector: a[href*="_2.pdf"]
                                manual_links = page.locator('a[href*="_2.pdf"]').all()
                                if len(manual_links) > 0:
                                    file_name = f"{prod_name.replace(' ', '_')}.pdf"
                                    save_path = os.path.join(self.download_root, file_name)
                                    
                                    with page.expect_download() as download_info:
                                        manual_links[0].click()
                                    download = download_info.value
                                    download.save_as(save_path)
                                    print(f"      [+] Downloaded: {file_name}")

                                    self.all_data.append({
                                        "category": cat_name,
                                        "product_name": prod_name,
                                        "pdf_path": save_path
                                    })
                                else:
                                    print(f"      [-] No Business Manual (_2.pdf) found.")
                                
                                # 다시 목록으로 돌아오기
                                page.locator("a:has-text('목록보기')").click()
                                time.sleep(2)
                                
                            except Exception as e:
                                print(f"    [-] Error in product {j}: {e}")
                                # 에러 시 안전하게 목록으로 복귀 시도
                                try: page.goto(self.base_url, wait_until="networkidle"); time.sleep(3)
                                except: pass
                    except Exception as e:
                        print(f"[-] Error in category {i}: {e}")

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}")
                page.screenshot(path="kb_final_debug.png")

            browser.close()
            
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    scraper = KBInsuranceScraper()
    scraper.scrape_all()
