# -*- coding: utf-8 -*-
import os
import time
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class MeritzFireMobileScraper:
    def __init__(self):
        # 모바일 공시실 URL (있다면) 혹은 일반 URL에 모바일 UA 적용
        self.url = "https://www.meritzfire.com/customer/disclosure/insurance-product-disclosure.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "meritz_fire")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)

    def scrape_all(self):
        print("[*] Starting Meritz Fire (Mobile Emulation Mode)...", flush=True)
        with sync_playwright() as p:
            # iPhone 13 Pro User Agent
            iphone_ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent=iphone_ua,
                viewport={'width': 390, 'height': 844},
                is_mobile=True,
                has_touch=True
            )
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing Meritz: {self.url}", flush=True)
            try:
                # 60초 대기
                page.goto(self.url, wait_until="networkidle", timeout=60000)
                time.sleep(15)
                
                page.screenshot(path="meritz_mobile_debug.png")
                with open("meritz_mobile_debug.html", "w", encoding="utf-8") as f:
                    f.write(page.content())

                # '장기보험' 탭 텍스트 확인 및 클릭
                tab = page.locator("a:has-text('장기보험'), a:has-text('장기보장성')").first
                if tab.count() > 0:
                    tab.click(force=True)
                    time.sleep(10)
                    page.screenshot(path="meritz_mobile_tab.png")

                # 테이블/리스트 확인
                rows = page.locator("table tbody tr, .list_type1 li").all()
                print(f"[*] Found {len(rows)} potential product elements.", flush=True)

                for idx, row in enumerate(rows):
                    try:
                        p_name = row.inner_text().split('\n')[0].strip()
                        if not p_name or "데이터" in p_name: continue
                        
                        dl_btns = row.locator("a.btn_pdf, button:has-text('다운'), a:has-text('다운')").all()
                        for bidx, btn in enumerate(dl_btns):
                            file_name = f"Meritz_Mob_{p_name}_{idx}_{bidx}.pdf"
                            save_path = os.path.join(self.download_root, file_name)
                            with page.expect_download(timeout=15000) as dl_info:
                                btn.click(force=True)
                            dl_info.value.save_as(save_path)
                            print(f"      [+] Saved: {p_name}", flush=True)
                    except: continue

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}", flush=True)
                page.screenshot(path="meritz_mobile_err.png")

            browser.close()

if __name__ == "__main__":
    MeritzFireMobileScraper().scrape_all()
