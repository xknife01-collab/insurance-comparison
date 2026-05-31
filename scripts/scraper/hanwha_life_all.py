# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class HanwhaLifeScraper:
    def __init__(self):
        self.base_url = "https://www.hanwhalife.com/main/disclosure/goods/goodslist/DF_GDGL000_P10000.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "hanwha_life")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "hanwha_life_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Hanwha Life (Targeted Selectors Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            time.sleep(15)

            try:
                # 1. 초기 로드
                print("[*] Triggering initial search...", flush=True)
                page.locator("#btnSearch").first.click(force=True)
                time.sleep(10)

                # .ck-search1 (Categories)
                categories = page.locator(".ck-search1").all()
                print(f"[*] Total {len(categories)} categories found.", flush=True)

                for cidx, cat in enumerate(categories):
                    c_name = cat.inner_text().strip()
                    print(f"    [{cidx+1}] Category: {c_name}", flush=True)
                    cat.scroll_into_view_if_needed()
                    cat.click(force=True)
                    time.sleep(5)

                    # .ck-search2 (Products)
                    products = page.locator(".ck-search2").all()
                    print(f"      - {len(products)} products in current category.", flush=True)
                    
                    for pidx, product in enumerate(products):
                        p_name = product.inner_text().strip()
                        print(f"        [{pidx+1}] Product: {p_name}", flush=True)
                        product.scroll_into_view_if_needed()
                        product.click(force=True)
                        time.sleep(5)

                        # List3 Rows
                        rows = page.locator("#List3 tr").all()
                        for ridx, row in enumerate(rows):
                            try:
                                # PDF 다운로드 버튼 (a, button)
                                dl_btns = row.locator("a, button").all()
                                for bidx, btn in enumerate(dl_btns):
                                    b_title = btn.get_attribute("title") or f"file_{bidx+1}"
                                    file_name = f"HanwhaLife_{p_name}_{b_title}.pdf"
                                    file_name = "".join([c for c in file_name if c.isalnum() or c in "._- " ]).strip()
                                    save_path = os.path.join(self.download_root, file_name)

                                    if not os.path.exists(save_path):
                                        print(f"          [!] Downloading: {b_title}", flush=True)
                                        with page.expect_download(timeout=15000) as dl_info:
                                            btn.click(force=True)
                                        download = dl_info.value
                                        download.save_as(save_path)
                                    
                                    self.all_data.append({"category": c_name, "product": p_name, "pdf": b_title, "path": save_path})
                            except: continue

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}", flush=True)
                page.screenshot(path="hanwha_life_targeted_err.png")

            browser.close()
            
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Hanwha Life finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HanwhaLifeScraper().scrape_all()
