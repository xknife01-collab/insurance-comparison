# -*- coding: utf-8 -*-
import os
import time
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class MeritzFireScraper:
    def __init__(self):
        self.base_url = "https://www.meritzfire.com"
        self.disclosure_url = "https://www.meritzfire.com/customer/disclosure/insurance-product-disclosure.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "meritz_fire")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)

    def scrape_all(self):
        print("[*] Starting Meritz Fire (Full UI Navigation Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing main: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="networkidle")
            time.sleep(10)

            print(f"[*] Navigating to Disclosure: {self.disclosure_url}", flush=True)
            page.goto(self.disclosure_url, wait_until="networkidle")
            time.sleep(15)

            try:
                # '장기보험' 탭 텍스트 확인 및 클릭 (여러 버전 시도)
                print("[*] Looking for Longterm tab link...", flush=True)
                # XPath나 text selector로 시도
                tabs = page.locator("a:has-text('장기보험'), a:has-text('장기보장성'), a[href*='Longterm']").all()
                if tabs:
                    print(f"[*] Clicking tab {tabs[0].inner_text()}", flush=True)
                    tabs[0].click(force=True)
                    time.sleep(15)

                # 테이블 확인
                rows = page.locator("table tbody tr").all()
                print(f"[*] Found {len(rows)} product rows.", flush=True)

                for idx, row in enumerate(rows):
                    try:
                        p_name = row.locator("td").first.inner_text().strip()
                        if not p_name or "데이터" in p_name: continue
                        
                        dl_btns = row.locator("a.btn_pdf, button:has-text('다운')").all()
                        for bidx, btn in enumerate(dl_btns):
                            file_name = f"Meritz_{p_name}_{bidx}.pdf"
                            save_path = os.path.join(self.download_root, file_name)
                            with page.expect_download(timeout=15000) as dl_info:
                                btn.click(force=True)
                            dl_info.value.save_as(save_path)
                            print(f"      [+] Saved: {p_name}", flush=True)
                    except: continue

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}", flush=True)
                page.screenshot(path="meritz_ui_err.png")

            browser.close()

if __name__ == "__main__":
    MeritzFireScraper().scrape_all()
