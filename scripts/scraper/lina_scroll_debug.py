# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class LinaLifeScrollScraper:
    def __init__(self):
        self.url = "https://www.lina.co.kr/disclosure/product-public-announcement/product-on-sales?k=1"
        self.download_root = os.path.join(os.getcwd(), "downloads", "lina_life")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)

    def scrape_all(self):
        print("[*] Starting Lina Life (Infinite Scroll Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 3000}) # Tall viewport
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing Lina: {self.url}", flush=True)
            page.goto(self.url, wait_until="networkidle", timeout=60000)
            time.sleep(15)

            try:
                # '판매중인상품' 클릭
                print("[*] Filtering Active Products...", flush=True)
                page.locator("label:has-text('판매중인상품')").first.click(force=True)
                time.sleep(10)

                # 인피니트 스크롤 수행 (10회)
                print("[*] Performing Infinite Scroll...", flush=True)
                for i in range(10):
                    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    time.sleep(3)
                
                # 행 전체 추출
                rows = page.locator(".el-table__row").all()
                print(f"[*] Total {len(rows)} product rows found after scroll.", flush=True)

                for idx, row in enumerate(rows):
                    try:
                        p_name = row.locator("td").first.inner_text().strip()
                        if not p_name: continue
                        print(f"    [{idx+1}] Product: {p_name}", flush=True)
                        row.locator("td").first.click(force=True)
                        time.sleep(10) # 상세 팝업 오픈 대기

                        # 방법서 등 버튼 찾기
                        btns = page.locator("button:has-text('방법서'), button:has-text('약관'), button:has-text('요약')").all()
                        for bidx, btn in enumerate(btns):
                            try:
                                b_text = btn.inner_text().strip() or str(bidx)
                                file_name = f"Lina_Scroll_{p_name}_{idx}_{b_text}.pdf"
                                file_name = "".join([c for c in file_name if c.isalnum() or c in "._- " ]).strip()
                                save_path = os.path.join(self.download_root, file_name)

                                if not os.path.exists(save_path):
                                    with page.expect_download(timeout=20000) as dl_info:
                                        btn.click(force=True)
                                    dl_info.value.save_as(save_path)
                                    print(f"      [+] Saved: {file_name}", flush=True)
                            except: continue

                        # 상세 닫기
                        page.keyboard.press("Escape")
                        time.sleep(5)
                    except: continue

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}", flush=True)
                page.screenshot(path="lina_scroll_err.png")

            browser.close()

if __name__ == "__main__":
    LinaLifeScrollScraper().scrape_all()
