# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class HanwhaNonLifeScraper:
    def __init__(self):
        self.base_url = "https://www.hwgeneralins.com/notice/ir/product-ing01.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "hanwha_nonlife")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "hanwha_nonlife_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Hanwha Non-Life (Universal Link Discovery Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            time.sleep(20)

            try:
                # 탭 클릭 (SPA 강제 트리거)
                page.locator("li:has-text('현재판매상품') a").first.click(force=True)
                time.sleep(10)

                # 페이지 내의 모든 clickable element 탐색 (Step 1 -> 4)
                # #uiFormField1 내의 모든 링크 -> #uiFormField2 -> #uiFormField3 -> Table
                for step in ["#uiFormField1", "#uiFormField2", "#uiFormField3"]:
                    print(f"[*] Step scanning: {step}", flush=True)
                    links = page.locator(f"{step} a, {step} button").all()
                    if links:
                        links[0].click(force=True) # 일단 첫 번째 클릭해서 다음 단계 유도
                        time.sleep(5)
                
                # 최종 PDF 목록 테이블 스캔
                pdf_btns = page.locator("a.btn_pdf, button:has-text('다운'), a:has-text('다운')").all()
                print(f"[*] Found {len(pdf_btns)} download buttons via broad search.", flush=True)

                if not pdf_btns:
                    # '검색' 버튼 클릭 후 재시도
                    print("[*] No buttons found, clicking search button first...", flush=True)
                    page.locator("button.btn_search, .search_area button").first.click(force=True)
                    time.sleep(10)
                    pdf_btns = page.locator("a.btn_pdf, button:has-text('다운'), a[href*='download']").all()

                for idx, btn in enumerate(pdf_btns):
                    try:
                        file_name = f"HanwhaNon_Broad_{idx+1}.pdf"
                        save_path = os.path.join(self.download_root, file_name)
                        if not os.path.exists(save_path):
                            with page.expect_download(timeout=15000) as dl_info:
                                btn.click(force=True)
                            dl_info.value.save_as(save_path)
                            print(f"    [+] Saved: {file_name}", flush=True)
                        self.all_data.append({"path": save_path})
                    except: continue

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}", flush=True)
                page.screenshot(path="hanwha_nonlife_broad_err.png")

            browser.close()
            
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Hanwha Non-Life finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HanwhaNonLifeScraper().scrape_all()
