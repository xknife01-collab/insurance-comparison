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

class HyundaiMarineScraper:
    def __init__(self):
        self.base_url = "https://www.hi.co.kr/bin/CI/ON/CION3200G.jsp"
        self.download_root = os.path.join(os.getcwd(), "downloads", "hyundai_marine")
        if not os.path.exists(self.download_root):
            os.makedirs(self.download_root)
        
        self.results_file = "hyundai_marine_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Hyundai Marine Scraper (Fixed)...")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True)
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}")
            page.goto(self.base_url, wait_until="networkidle")
            time.sleep(5)

            try:
                # 1. '판매 중인 상품' 클릭
                sales_btn = page.locator("button.lv1:has-text('판매 중인 상품')")
                if sales_btn.count() > 0:
                    sales_btn.click()
                    time.sleep(2)

                # 2. 카테고리 (lv2)
                categories = page.locator("button.lv2").all()
                cat_count = len(categories)
                print(f"[*] Found {cat_count} categories.")

                for i in range(cat_count):
                    try:
                        cat = page.locator("button.lv2").nth(i)
                        cat_name = cat.inner_text().strip()
                        print(f"\n[>>>] Category: {cat_name}")
                        cat.click()
                        time.sleep(2)

                        # 3. 서브 카테고리 (lv3)
                        sub_cats = page.locator("button.lv3").all()
                        for j in range(len(sub_cats)):
                            try:
                                sub = page.locator("button.lv3").nth(j)
                                sub_name = sub.inner_text().strip()
                                print(f"  [>] Sub Category: {sub_name}")
                                sub.click()
                                time.sleep(2)

                                # 4. 상품 리스트 (lv4)
                                products = page.locator("button.lv4").all()
                                for k in range(len(products)):
                                    try:
                                        prod = page.locator("button.lv4").nth(k)
                                        prod_name = prod.inner_text().strip()
                                        print(f"    [{k+1}/{len(products)}] Product: {prod_name}")
                                        prod.click()
                                        time.sleep(2)

                                        # 5. 다운로드 버튼 (#userMthd) - 여러 개일 경우 첫 번째 것 클릭
                                        download_btn = page.locator("#userMthd").first
                                        if download_btn.is_visible():
                                            file_name = f"{prod_name.replace(' ', '_')}.pdf"
                                            save_path = os.path.join(self.download_root, file_name)
                                            
                                            with page.expect_download() as download_info:
                                                download_btn.click()
                                            download = download_info.value
                                            download.save_as(save_path)
                                            print(f"      [+] Downloaded: {file_name}")

                                            self.all_data.append({
                                                "main_category": cat_name,
                                                "sub_category": sub_name,
                                                "product_name": prod_name,
                                                "pdf_path": save_path
                                            })
                                        else:
                                            print(f"      [-] Download button not visible.")
                                    except Exception as e:
                                        print(f"    [-] Error product {k}: {e}")
                            except Exception as e:
                                print(f"  [-] Error sub-cat {j}: {e}")
                    except Exception as e:
                        print(f"[-] Error category {i}: {e}")

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}")
                page.screenshot(path="hyundai_debug.png")

            browser.close()
            
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    scraper = HyundaiMarineScraper()
    scraper.scrape_all()
