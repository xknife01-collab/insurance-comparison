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

class HanaNonLifeScraper:
    def __init__(self):
        self.base_url = "https://www.hanainsure.co.kr/w/disclosure/product/saleProduct"
        self.download_root = os.path.join(os.getcwd(), "downloads", "hana_nonlife")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "hana_nonlife_full_data.json"
        self.all_data = []
        self.pdf_urls = []

    def handle_request(self, request):
        url = request.url
        if ".pdf" in url.lower() and url not in self.pdf_urls:
            self.pdf_urls.append(url)

    def scrape_all(self):
        print("[*] Starting Hana Non-life (5-Step Navigator Mode)...", flush=True)
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
                # Step 1: 보험상품 선택 (자동차, 일반, 장기)
                cat_selectors = ["#divStep01 a[data-ins_type='0']", "#divStep01 a[data-ins_type='1']", "#divStep01 a[data-ins_type='2']"]
                cat_names = ["자동차보험", "일반보험", "장기보험"]

                for cat_idx, cat_sel in enumerate(cat_selectors):
                    try:
                        cat_el = page.locator(cat_sel).first
                        if cat_el.count() == 0: continue
                        
                        cat_name = cat_names[cat_idx]
                        print(f"\n[Cat] {cat_name}", flush=True)
                        cat_el.click(force=True)
                        time.sleep(2)

                        # Step 1.1: 하위 카테고리 (개인용, 업무용, 해외여행 등)
                        subcat_links = page.locator("#divStep01_1 a").all()
                        print(f"  - Found {len(subcat_links)} sub-categories in Step 1.1", flush=True)

                        for s_idx, s_link in enumerate(subcat_links):
                            try:
                                s_name = s_link.inner_text().strip().split("\n")[0]
                                print(f"  [Sub] {s_name}", flush=True)
                                s_link.click(force=True)
                                time.sleep(2)

                                # Step 2: 보험상품목록
                                prod_links = page.locator("#divStep02 a").all()
                                print(f"    - Found {len(prod_links)} products in Step 2", flush=True)

                                for p_idx, p_link in enumerate(prod_links):
                                    try:
                                        p_name = p_link.inner_text().strip().split("\n")[0]
                                        print(f"      [{p_idx+1}] {p_name}", flush=True)
                                        p_link.click(force=True)
                                        time.sleep(2)

                                        # Step 3: 판매기간 (최신 것 선택)
                                        period_links = page.locator("#divStep03 a").all()
                                        if not period_links:
                                            print("        [!] No items in Step 3", flush=True)
                                            continue
                                        
                                        period_links[0].click(force=True)
                                        time.sleep(2)

                                        # Step 4: 선택항목 (PDF)
                                        pdf_items = page.locator("#divStep04 a").all()
                                        for item in pdf_items:
                                            item_text = item.inner_text().strip()
                                            if "방법서" in item_text or "약관" in item_text:
                                                target_name = f"{p_name}_{item_text}"
                                                file_name = f"Hana_{target_name.replace(' ', '_')}.pdf"
                                                file_name = "".join([c for c in file_name if c.isalnum() or c in "._- "]).strip()
                                                save_path = os.path.join(self.download_root, file_name)

                                                if os.path.exists(save_path):
                                                    self.all_data.append({"product_name": target_name, "pdf_path": save_path})
                                                    continue

                                                print(f"        [!] Downloading: {item_text}", flush=True)
                                                prev_count = len(self.pdf_urls)
                                                
                                                try:
                                                    with page.expect_download(timeout=10000) as dl_info:
                                                        item.click(force=True)
                                                    dl = dl_info.value
                                                    dl.save_as(save_path)
                                                    print(f"        [+] Saved: {file_name}", flush=True)
                                                    self.all_data.append({"product_name": target_name, "pdf_path": save_path})
                                                except:
                                                    new_urls = self.pdf_urls[prev_count:]
                                                    if new_urls:
                                                        resp = requests.get(new_urls[-1], headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
                                                        if resp.status_code == 200:
                                                            with open(save_path, "wb") as f: f.write(resp.content)
                                                            print(f"        [+] Saved (intercept): {file_name}", flush=True)
                                                            self.all_data.append({"product_name": target_name, "pdf_path": save_path})
                                    except: continue
                            except: continue
                    except: continue

            except Exception as e:
                print(f"[-] Main Error: {e}", flush=True)
                page.screenshot(path="hana_step_detailed_err.png")

            browser.close()

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Hana Non-life finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HanaNonLifeScraper().scrape_all()
