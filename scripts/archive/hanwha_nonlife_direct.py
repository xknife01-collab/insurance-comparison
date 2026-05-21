# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class HanwhaNonLifeDirectScraper:
    def __init__(self):
        self.base_url = "https://www.hwgeneralins.com/notice/ir/product-ing01.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "hanwha_nonlife")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "hanwha_nonlife_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Hanwha Non-Life (Robust Playwright + AJAX Intercept Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 1920, 'height': 1080}, accept_downloads=True)
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            time.sleep(5)

            # 1. '현재판매상품' 탭 활성화
            try:
                page.evaluate("""() => {
                    const tab = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes('현재판매상품'));
                    if(tab) tab.click();
                }""")
                time.sleep(2)
            except: pass

            # 2. 카테고리(Step 01) 목록 가져오기
            categories_elements = page.query_selector_all("#uiStep01 .scroll > ul > li > a")
            print(f"[*] Found {len(categories_elements)} category candidates.", flush=True)

            cat_names = []
            for el in categories_elements:
                txt = el.inner_text().strip()
                if txt and "전체" not in txt:
                    cat_names.append(txt)

            for c_name in cat_names:
                print(f"\n[Category] {c_name}", flush=True)
                # 카테고리 클릭
                try:
                    cat_el = page.locator(f"#uiStep01 a:has-text('{c_name}')").first
                    cat_el.click(force=True)
                    time.sleep(3)
                except: continue

                # 상품 목록(Step 02) 가져오기
                product_elements = page.query_selector_all("#uiStep02 .scroll > ul > li > a")
                p_names = [el.inner_text().strip() for el in product_elements if el.inner_text().strip()]
                print(f"  [+] {len(p_names)} products found.", flush=True)

                for p_name in p_names:
                    print(f"    - Product: {p_name}", flush=True)
                    try:
                        p_el = page.locator(f"#uiStep02 a:has-text('{p_name}')").first
                        p_el.click(force=True)
                        time.sleep(2)

                        # 판매기간(Step 03) 목록 가져오기
                        period_elements = page.query_selector_all("#uiStep03 .scroll > ul > li > a")
                        per_texts = [el.inner_text().strip() for el in period_elements if el.inner_text().strip()]
                        
                        for per_text in per_texts:
                            print(f"      - Period: {per_text}", flush=True)
                            try:
                                per_el = page.locator(f"#uiStep03 a:has-text('{per_text}')").first
                                per_el.click(force=True)
                                time.sleep(2)

                                # 최종 확인 및 다운로드(Step 04)
                                # Step 04 영역에 버튼들이 나타날 때까지 대기
                                pdf_btns = page.locator("#uiStep04 a").all()
                                for btn in pdf_btns:
                                    b_txt = btn.inner_text().strip()
                                    if not b_txt or "데이터" in b_txt: continue
                                    
                                    print(f"        [+] Downloading: {b_txt}", flush=True)
                                    try:
                                        with page.expect_download(timeout=15000) as dl_info:
                                            btn.click(force=True)
                                        dl = dl_info.value
                                        
                                        # 파일명 생성
                                        safe_name = f"HanwhaNon_{c_name}_{p_name}_{per_text}_{b_txt}.pdf"
                                        safe_name = "".join([c for c in safe_name if c.isalnum() or c in "._- "]).strip().replace(" ", "_")
                                        save_path = os.path.join(self.download_root, safe_name)
                                        
                                        if not os.path.exists(save_path):
                                            dl.save_as(save_path)
                                            print(f"        [OK] Saved.", flush=True)
                                        
                                        self.all_data.append({"category": c_name, "product": p_name, "period": per_text, "file": b_txt, "path": save_path})
                                    except Exception as e:
                                        print(f"        [!] Download Failed: {e}", flush=True)
                            except: continue
                    except: continue

            browser.close()

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Hanwha Non-Life finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HanwhaNonLifeDirectScraper().scrape_all()
