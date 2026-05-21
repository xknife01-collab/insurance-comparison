# -*- coding: utf-8 -*-
import os
import time
import json
import sys
import requests
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

class HeungkukLifeScraper:
    def __init__(self):
        self.base_url = "https://www.heungkuklife.co.kr/front/public/saleProduct.do?searchFlgSale=Y"
        self.download_root = os.path.join(os.getcwd(), "downloads", "heungkuk_life")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "heungkuk_life_full_data.json"
        self.all_data = []
        self.pdf_urls = []

    def handle_request(self, request):
        url = request.url
        if ".pdf" in url.lower() and url not in self.pdf_urls:
            self.pdf_urls.append(url)
            print(f"  [NET] PDF: {url}", flush=True)

    def scrape_all(self):
        print("[*] Starting Heungkuk Life (Step-by-Step Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            context.on("request", self.handle_request)
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            time.sleep(5)

            try:
                # 팝업 제거
                page.evaluate("document.querySelectorAll('.modal, .dimmed, .layer_popup').forEach(el => el.remove());")

                # Step 1: 구분선택 (개인, 단체, 방카슈랑스)
                page.wait_for_selector("dl.category1 a", timeout=30000)
                cat_links = page.locator("dl.category1 a").all()
                print(f"[*] Found {len(cat_links)} categories in Step 1", flush=True)

                for c_idx, cat in enumerate(cat_links):
                    try:
                        c_name = cat.inner_text().strip()
                        if not c_name or "선택" in c_name: continue
                        print(f"\n[Cat] {c_name}", flush=True)
                        cat.scroll_into_view_if_needed()
                        cat.click(force=True)
                        time.sleep(3)

                        # Step 2: 보험유형선택 (전체, 연금, 보장성 등)
                        page.wait_for_selector("dl.category2 a", timeout=10000)
                        type_links = page.locator("dl.category2 a").all()
                        print(f"  - Found {len(type_links)} types in Step 2", flush=True)

                        for t_idx, t_link in enumerate(type_links):
                            try:
                                t_name = t_link.inner_text().strip()
                                if not t_name or "전체" not in t_name and t_idx > 0: continue # '전체'만 우선 처리하거나 필요시 확장
                                print(f"  [Type] {t_name}", flush=True)
                                t_link.click(force=True)
                                time.sleep(3)

                                # Step 3: 판매상품명 선택 (Scrollable list at dd#productList)
                                page.wait_for_selector("dd#productList a", timeout=10000)
                                prod_links = page.locator("dd#productList a").all()
                                print(f"    - Found {len(prod_links)} products in Step 3", flush=True)

                                for p_idx, p_link in enumerate(prod_links):
                                    try:
                                        p_name = p_link.inner_text().strip()
                                        if not p_name: continue
                                        
                                        print(f"      [{p_idx+1}/{len(prod_links)}] {p_name}", flush=True)
                                        p_link.scroll_into_view_if_needed()
                                        p_link.click(force=True)
                                        time.sleep(3)

                                        # Step 4: 상품 공시 다운로드 (테이블)
                                        # .table_box tbody tr
                                        page.wait_for_selector(".table_box tbody tr", timeout=10000)
                                        rows = page.locator(".table_box tbody tr").all()
                                        print(f"        - Found {len(rows)} sale periods.", flush=True)

                                        for r_idx, row in enumerate(rows):
                                            try:
                                                # Column 3, 4, 5 (가입설계서/약관, 사업방법서, 요약서)
                                                # 보통 td:nth-child(3), (4), (5)
                                                # PDF 버튼 링크 탐색
                                                btns = row.locator("a[onclick*='downloadFileEncrypt'], a:has-text('PDF'), a:has-text('다운로드')").all()
                                                for b_idx, btn in enumerate(btns):
                                                    try:
                                                        b_text = btn.inner_text().strip() or btn.get_attribute("title") or f"file_{b_idx}"
                                                        
                                                        target_name = f"{p_name}_{b_text}_r{r_idx+1}"
                                                        file_name = f"HeungkukLife_{target_name}.pdf"
                                                        file_name = "".join([c for c in file_name if c.isalnum() or c in "._- "]).strip()
                                                        save_path = os.path.join(self.download_root, file_name)

                                                        if not os.path.exists(save_path):
                                                            print(f"          [+] Downloading: {b_text}", flush=True)
                                                            with page.expect_download(timeout=15000) as dl_info:
                                                                btn.click(force=True)
                                                            dl_info.value.save_as(save_path)
                                                        self.all_data.append({"category": c_name, "type": t_name, "product": p_name, "file": b_text, "path": save_path})
                                                    except: continue
                                            except: continue
                                    except: continue
                            except: continue
                    except: continue

            except Exception as e:
                print(f"[-] Scraper Main Error: {e}", flush=True)
                page.screenshot(path="heungkuk_life_err.png")

            browser.close()
            
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Heungkuk Life finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HeungkukLifeScraper().scrape_all()
