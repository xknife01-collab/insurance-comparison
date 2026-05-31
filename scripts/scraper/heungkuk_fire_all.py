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

load_dotenv()

class HeungkukFireScraper:
    def __init__(self):
        self.base_url = "https://www.heungkukfire.co.kr/FRW/announce/insGoodsGongsiSale.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "heungkuk_fire")
        if not os.path.exists(self.download_root):
            os.makedirs(self.download_root)
        
        self.results_file = "heungkuk_fire_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Heungkuk Fire Scraper (Final robust fix)...")
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}")
            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            time.sleep(5)

            try:
                # 테이블 대기
                page.wait_for_selector(".board_list, table", timeout=30000)
                
                # '요약서' 또는 '방법서' 버튼이 있는 모든 tr 추출
                rows = page.locator(".board_list tbody tr, table tr").all()
                print(f"[*] Found {len(rows)} product rows.")

                for idx, row in enumerate(rows):
                    try:
                        # 텍스트가 비어있으면 스킵
                        if not row.inner_text().strip(): continue
                        
                        # 상품명 추출 (보통 3번째 TD)
                        tds = row.locator("td").all()
                        if len(tds) < 3: continue
                        name = tds[2].inner_text().strip()
                        if not name or name == "내용이 없습니다.": continue
                        
                        print(f"    Product: {name}")

                        # '방법서' 버튼 (title 또는 text)
                        btn = row.locator("a[title*='사업방법서'], a:has-text('사업방법서'), a:has-text('요약서')").first
                        
                        if btn.count() > 0:
                            file_name = f"HeungkukFire_{name.replace(' ', '_')}.pdf"
                            file_name = "".join([c for c in file_name if c.isalnum() or c in "._- " ]).strip()
                            save_path = os.path.join(self.download_root, file_name)

                            try:
                                with page.expect_download(timeout=15000) as download_info:
                                    btn.click(force=True)
                                download = download_info.value
                                download.save_as(save_path)
                                print(f"      [+] Downloaded: {file_name}")
                                self.all_data.append({"product_name": name, "pdf_path": save_path})
                            except:
                                print(f"      [-] Download fail for: {name}")
                    except: continue

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}")
                page.screenshot(path="heungkuk_fire_error.png")

            browser.close()
            
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Heungkuk Fire scraping completed. Total: {len(self.all_data)} items.")

if __name__ == "__main__":
    scraper = HeungkukFireScraper()
    scraper.scrape_all()
