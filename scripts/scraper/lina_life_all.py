# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class LinaLifeScraper:
    def __init__(self):
        self.base_url = "https://www.lina.co.kr/disclosure/product-public-announcement/product-on-sales?k=1"
        self.download_root = os.path.join(os.getcwd(), "downloads", "lina_life")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "lina_life_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Lina Life (JSON Discovery Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            time.sleep(15)

            try:
                # 탭 클릭 (SPA 갱신 유도)
                page.locator("label:has-text('판매중인상품')").first.click(force=True)
                time.sleep(10)

                # 페이지 내의 모든 .el-table__row 찾아서 클릭
                rows = page.locator(".el-table__row").all()
                print(f"[*] Found {len(rows)} product rows.", flush=True)

                for idx, row in enumerate(rows):
                    try:
                        p_name = row.locator("td").first.inner_text().strip()
                        print(f"    [{idx+1}] Product: {p_name}", flush=True)
                        row.locator("td").first.click(force=True)
                        time.sleep(10) # 상세 팝업/페이지 로딩

                        # 상세 내의 버튼들 추출 (방법서 등)
                        btns = page.locator("button:has-text('방법서'), button:has-text('약관'), button:has-text('요약')").all()
                        for bidx, btn in enumerate(btns):
                            try:
                                b_text = btn.inner_text().strip() or str(bidx)
                                file_name = f"Lina_{p_name}_{b_text}.pdf"
                                file_name = "".join([c for c in file_name if c.isalnum() or c in "._- " ]).strip()
                                save_path = os.path.join(self.download_root, file_name)

                                if not os.path.exists(save_path):
                                    with page.expect_download(timeout=15000) as dl_info:
                                        btn.click(force=True)
                                    download = dl_info.value
                                    download.save_as(save_path)
                                    print(f"      [+] Saved: {file_name}", flush=True)
                                
                                self.all_data.append({"product": p_name, "type": b_text, "path": save_path})
                            except: continue

                        # 상세 닫기 (ESC 혹은 닫기 버튼)
                        page.keyboard.press("Escape")
                        time.sleep(5)
                    except: continue

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}", flush=True)
                page.screenshot(path="lina_life_json_err.png")

            browser.close()
            
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Lina Life finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    LinaLifeScraper().scrape_all()
