# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class ShinhanLifeFinalScraper:
    def __init__(self):
        self.base_url = "https://www.shinhanlife.co.kr/hp/cdhi0030.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "shinhan_life")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "shinhan_life_full_data.json"
        self.all_data = []
        self.intercepted_pdf_url = None

    def handle_request(self, request):
        if ".pdf" in request.url.lower(): self.intercepted_pdf_url = request.url

    def scrape_all(self):
        print("[*] Starting Shinhan Life (Cold Reboot Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 1920, 'height': 1080})
            context.on("request", self.handle_request)
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            time.sleep(20)

            try:
                page.wait_for_selector("button[id$='_2']", timeout=30000)
                dl_btns = page.locator("button[id$='_2']").all()
                print(f"[*] Total {len(dl_btns)} products found.", flush=True)

                for idx, btn in enumerate(dl_btns):
                    try:
                        title = btn.get_attribute("title")
                        name = title.split("방법서")[0].strip() if title else f"Shinhan_{idx+1}"
                        file_name = f"Shinhan_{name.replace(' ', '_')}.pdf"
                        file_name = "".join([c for c in file_name if c.isalnum() or c in "._- " ]).strip()
                        save_path = os.path.join(self.download_root, file_name)

                        # 이미 존재하는 파일은 스킵 (37번까지는 초고속 통과)
                        if os.path.exists(save_path) and os.path.getsize(save_path) > 1000:
                            print(f"    [{idx+1}] Skipping: {name}", flush=True)
                            self.all_data.append({"product_name": name, "pdf_path": save_path})
                            continue

                        print(f"    [{idx+1}] Capturing Final: {name}", flush=True)
                        self.intercepted_pdf_url = None
                        btn.click(force=True)
                        
                        # 최대 15초간 인터셉트 대기
                        for _ in range(15):
                            if self.intercepted_pdf_url: break
                            time.sleep(1)
                        
                        if self.intercepted_pdf_url:
                            print(f"      [!] URL: {self.intercepted_pdf_url}", flush=True)
                            resp = requests.get(self.intercepted_pdf_url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=30)
                            if resp.status_code == 200:
                                with open(save_path, "wb") as f: f.write(resp.content)
                                print(f"      [+] Saved: {file_name}", flush=True)
                                self.all_data.append({"product_name": name, "pdf_path": save_path})
                        
                        # 세션 보호를 위해 매 수집마다 10초 대기
                        time.sleep(10)

                    except: continue

            except Exception as e: print(f"[-] Scraper Main Error: {e}", flush=True)
            browser.close()
            
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Shinhan Life finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    ShinhanLifeFinalScraper().scrape_all()
