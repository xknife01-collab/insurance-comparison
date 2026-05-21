# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class HeungkukLifeDirectScraper:
    def __init__(self):
        self.base_url = "https://www.heungkuklife.co.kr/front/public/saleProduct.do?searchFlgSale=Y"
        self.download_root = os.path.join(os.getcwd(), "downloads", "heungkuk_life")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "heungkuk_life_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Heungkuk Life (Fixed Logic Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            time.sleep(5)

            # Step 1: 카테고리(개인, 단체 등) 추출
            categories = page.evaluate("""() => {
                return Array.from(document.querySelectorAll('dl.category1 a')).map(a => ({
                    name: a.innerText.trim()
                })).filter(c => c.name && !c.name.includes('선택'));
            }""")
            
            print(f"[*] Found {len(categories)} categories. Scraping products...", flush=True)
            
            for cat in categories:
                print(f"    > Category: {cat['name']}", flush=True)
                page.evaluate(f"Array.from(document.querySelectorAll('dl.category1 a')).find(a => a.innerText.includes('{cat['name']}')).click()")
                time.sleep(2)
                
                # Step 2: 유형(Type) 추출 (연금, 보장성 등)
                types = page.evaluate("""() => {
                    return Array.from(document.querySelectorAll('dl.category2 a')).map(a => a.innerText.trim()).filter(t => t && !t.includes('선택'));
                }""")
                
                for t_name in types:
                    print(f"      - {t_name}", flush=True)
                    page.evaluate(f"Array.from(document.querySelectorAll('dl.category2 a')).find(a => a.innerText.includes('{t_name}')).click()")
                    time.sleep(1.5)
                    
                    # Step 3: 상품 리스트
                    products = page.evaluate("""() => {
                        return Array.from(document.querySelectorAll('dd#productList a')).map(a => a.innerText.trim());
                    }""")
                    
                    for p_name in products:
                        print(f"        - {p_name} ...", flush=True)
                        page.evaluate(f"Array.from(document.querySelectorAll('dd#productList a')).find(a => a.innerText.includes('{p_name}')).click()")
                        time.sleep(1.5)
                        
                        # Step 4: PDF 다운로드 상세 테이블
                        pdfs = page.evaluate("""() => {
                            const rows = Array.from(document.querySelectorAll('.table_box tbody tr'));
                            return rows.map(r => {
                                const tds = Array.from(r.querySelectorAll('td'));
                                const period = (tds.length > 0) ? tds[0].innerText.trim() : 'N/A';
                                const btns = Array.from(r.querySelectorAll('a[onclick*="downloadFileEncrypt"], a')).filter(a => (a.innerText + (a.getAttribute('title')||'')).includes('PDF') || a.innerText.includes('다운로드')).map(a => ({
                                    text: a.innerText.trim() || a.getAttribute('title') || 'PDF'
                                }));
                                return { period, btns };
                            }).filter(x => x && x.btns.length > 0);
                        }""")
                        
                        for pdf_row in pdfs:
                            for btn_info in pdf_row['btns']:
                                b_text = btn_info['text']
                                if not b_text: continue
                                try:
                                    with page.expect_download(timeout=10000) as dl_info:
                                        # Use native JS find in evaluate to be accurate
                                        page.evaluate(f"""() => {{
                                            const btns = Array.from(document.querySelectorAll('.table_box tbody tr a'));
                                            const target = btns.find(b => (b.innerText + (b.getAttribute('title')||'')).includes('{b_text}'));
                                            if(target) target.click();
                                        }}""")
                                    
                                    dl = dl_info.value
                                    safe_name = f"HGKLife_{cat['name']}_{p_name}_{pdf_row['period']}_{b_text}.pdf"
                                    safe_name = "".join([c for c in safe_name if c.isalnum() or c in "._- "]).strip().replace(" ", "_")
                                    save_path = os.path.join(self.download_root, safe_name)
                                    
                                    if not os.path.exists(save_path):
                                        dl.save_as(save_path)
                                        print(f"            [OK] Saved: {safe_name}", flush=True)
                                    
                                    self.all_data.append({"category": cat['name'], "product": p_name, "period": pdf_row['period'], "file": b_text, "path": save_path})
                                except:
                                    continue

            browser.close()

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Heungkuk Life Direct finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HeungkukLifeDirectScraper().scrape_all()
