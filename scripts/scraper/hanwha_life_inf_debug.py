# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class HanwhaLifeInfiniteScraper:
    def __init__(self):
        self.url = "https://www.hanwhalife.com/main/disclosure/goods/goodslist/DF_GDGL000_P10000.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "hanwha_life")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)

    def scrape_all(self):
        print("[*] Starting Hanwha Life (Extreme Patience Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing Hanwha Life: {self.url}", flush=True)
            page.goto(self.url, wait_until="networkidle", timeout=60000)
            time.sleep(30) # Initial wait

            try:
                # 검색 버튼 클릭
                page.locator("#btnSearch").first.click(force=True)
                time.sleep(15)

                # .ck-search1 이 나타날 때까지 최대 60초 대기
                print("[*] Waiting for .ck-search1 (Categories)...", flush=True)
                page.wait_for_selector(".ck-search1", timeout=60000)
                
                categories = page.locator(".ck-search1").all()
                print(f"[*] Found {len(categories)} categories.", flush=True)

                for cat in categories[:5]: # 테스트용 상위 5개
                    c_name = cat.inner_text().strip()
                    print(f"    - Category: {c_name}", flush=True)
                    cat.click(force=True)
                    time.sleep(10)

                    products = page.locator(".ck-search2").all()
                    for product in products:
                        p_name = product.inner_text().strip()
                        print(f"      - Product: {p_name}", flush=True)
                        product.click(force=True)
                        time.sleep(10)

                        details = page.locator("#List3 tr").all()
                        for row in details:
                            btns = row.locator("a, button").all()
                            for btn in btns:
                                b_title = btn.get_attribute("title") or "Down"
                                file_name = f"HanwhaLife_Inf_{p_name}_{b_title}.pdf"
                                file_name = "".join([c for c in file_name if c.isalnum() or c in "._- " ]).strip()
                                save_path = os.path.join(self.download_root, file_name)
                                if not os.path.exists(save_path):
                                    with page.expect_download(timeout=20000) as dl_info:
                                        btn.click(force=True)
                                    dl_info.value.save_as(save_path)
                                    print(f"        [+] Saved: {b_title}", flush=True)

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}", flush=True)
                page.screenshot(path="hanwha_life_inf_err.png")

            browser.close()

if __name__ == "__main__":
    HanwhaLifeInfiniteScraper().scrape_all()
