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

                # Step 1: 구분선택 (개인, 단체, 방카)
                cat_links = page.locator("ul.select1 li a").all()
                print(f"[*] Found {len(cat_links)} categories in Step 1", flush=True)

                for c_idx, cat in enumerate(cat_links):
                    try:
                        c_name = cat.inner_text().strip()
                        print(f"\n[Cat] {c_name}", flush=True)
                        cat.click(force=True)
                        time.sleep(2)

                        # Step 2: 보험유형선택 (전체, 연금, 보장성 등)
                        # 여기서는 보통 '전체'만 해도 됨. 하지만 혹시 모르니 첫 번째(전체) 클릭 확인
                        type_links = page.locator(".list_product_check .left dd").nth(1).locator("li a").all()
                        if type_links:
                            type_links[0].click(force=True)
                            time.sleep(2)

                        # Step 3: 판매상품명 선택
                        prod_links = page.locator("#productList li a").all()
                        print(f"  - Found {len(prod_links)} products in Step 3", flush=True)

                        for p_idx, p_link in enumerate(prod_links):
                            try:
                                p_name = p_link.inner_text().strip()
                                if not p_name: continue
                                
                                print(f"    [{p_idx+1}] {p_name}", flush=True)
                                p_link.click(force=True)
                                time.sleep(3)

                                # Step 4: 상품 공시 다운로드 (테이블)
                                # tbody#productVoTr is where the data rows are
                                rows = page.locator("#productVoTr tr").all()
                                if not rows:
                                    # 가끔 로딩이 늦을 수 있음
                                    time.sleep(2)
                                    rows = page.locator("#productVoTr tr").all()
                                
                                print(f"      - Found {len(rows)} detail versions", flush=True)

                                for r_idx, row in enumerate(rows):
                                    if not row.is_visible(): continue
                                    
                                    # 각 행에서 PDF 버튼들 (약관, 사업방법서, 요약서) 탐색
                                    # 보통 a 태그에 downloadFileEncrypt 함수가 걸려있음
                                    tds = row.locator("td").all()
                                    if len(tds) < 5: continue
                                    
                                    # 3: 약관, 4: 사업방법서, 5: 상품요약서
                                    for col_idx in [2, 3, 4]:
                                        btn = tds[col_idx].locator("a").first
                                        if btn.count() > 0:
                                            btn_text = ["약관", "사업방법서", "요약서"][col_idx-2]
                                            
                                            target_name = f"{p_name}_{btn_text}_{r_idx+1}"
                                            file_name = f"HeungkukLife_{target_name.replace(' ', '_')}.pdf"
                                            file_name = "".join([c for c in file_name if c.isalnum() or c in "._- "]).strip()
                                            save_path = os.path.join(self.download_root, file_name)

                                            if os.path.exists(save_path):
                                                self.all_data.append({"product_name": target_name, "pdf_path": save_path})
                                                continue

                                            print(f"        [!] Downloading: {btn_text} (v{r_idx+1})", flush=True)
                                            prev_count = len(self.pdf_urls)
                                            
                                            try:
                                                with page.expect_download(timeout=10000) as dl_info:
                                                    btn.click(force=True)
                                                dl = dl_info.value
                                                dl.save_as(save_path)
                                                print(f"        [+] Saved: {file_name}", flush=True)
                                                self.all_data.append({"product_name": target_name, "pdf_path": save_path})
                                            except:
                                                # Intercept fallback
                                                new_urls = self.pdf_urls[prev_count:]
                                                if new_urls:
                                                    resp = requests.get(new_urls[-1], headers={"User-Agent": "Mozilla/5.0"}, timeout=30)
                                                    if resp.status_code == 200:
                                                        with open(save_path, "wb") as f: f.write(resp.content)
                                                        print(f"        [+] Saved (intercept): {file_name}", flush=True)
                                                        self.all_data.append({"product_name": target_name, "pdf_path": save_path})

                            except Exception as pe:
                                print(f"    [-] Product Error: {pe}", flush=True)
                                continue

                    except Exception as ce:
                        print(f"[-] Category Error: {ce}", flush=True)
                        continue

            except Exception as e:
                print(f"[-] Main Error: {e}", flush=True)
                page.screenshot(path="heungkuk_life_steps_err.png")

            browser.close()

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Heungkuk Life finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HeungkukLifeScraper().scrape_all()
