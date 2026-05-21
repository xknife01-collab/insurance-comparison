# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class HeungkukFireDirectScraper:
    def __init__(self):
        self.base_url = "https://www.heungkukfire.co.kr/FRW/announce/insGoodsGongsiSale.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "heungkuk_fire")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "heungkuk_fire_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Heungkuk Fire (Fixed Page Navigation Mode)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            # Heungkuk Fire has 3 main categories: Long-term (1), General (2), Auto (3)
            categories = [("장기보험", "1"), ("일반보험", "2"), ("자동차보험", "3")]
            
            for c_name, c_type in categories:
                print(f"[*] Category: {c_name} (Type {c_type}) ...", flush=True)
                page.goto(f"{self.base_url}?type={c_type}", wait_until="networkidle", timeout=60000)
                time.sleep(3)
                
                page_num = 1
                while True:
                    print(f"    [P{page_num}] Parsing rows...", flush=True)
                    rows = page.evaluate("""() => {
                        const trs = Array.from(document.querySelectorAll('.board_list tbody tr')).filter(tr => !tr.innerText.includes('내용이 없습니다'));
                        return trs.map(tr => {
                            const tds = Array.from(tr.querySelectorAll('td'));
                            if(tds.length < 4) return null;
                            const p_name = tds[2].innerText.trim();
                            const period = tds[3].innerText.trim();
                            const btns = Array.from(tr.querySelectorAll('a.btn_sub1')).map(a => ({
                                text: a.innerText.trim(),
                                onclick: a.getAttribute('onclick')
                            }));
                            return { p_name, period, btns };
                        }).filter(x => x);
                    }""")
                    
                    for row in rows:
                        p_name = row['p_name']
                        for b_info in row['btns']:
                            b_text = b_info['text']
                            if not b_text or "보기" in b_text: continue
                            
                            safe_name = f"HGKFire_{c_name}_{p_name}_{row['period']}_{b_text}.pdf"
                            safe_name = "".join([c for c in safe_name if c.isalnum() or c in "._- "]).strip().replace(" ", "_")
                            save_path = os.path.join(self.download_root, safe_name)
                            
                            if not os.path.exists(save_path):
                                try:
                                    # Use native find in evaluate to be safe
                                    with page.expect_download(timeout=10000) as dl_info:
                                        page.evaluate(f"""() => {{
                                            const all_btns = Array.from(document.querySelectorAll('.board_list tbody tr a.btn_sub1'));
                                            const target = all_btns.find(b => b.innerText.includes('{b_text}') && b.parentElement.parentElement.innerText.includes('{p_name}'));
                                            if(target) target.click();
                                        }}""")
                                    dl_info.value.save_as(save_path)
                                    print(f"      [OK] Saved: {safe_name}", flush=True)
                                except:
                                    # Playwright locator fallback
                                    try:
                                        with page.expect_download(timeout=10000) as dl_info:
                                            page.locator(f"tr:has-text('{p_name}') a:has-text('{b_text}')").first.click(force=True)
                                        dl_info.value.save_as(save_path)
                                        print(f"      [OK] Saved (Fallback): {safe_name}", flush=True)
                                    except:
                                        continue
                            
                            self.all_data.append({"category": c_name, "product": p_name, "period": row['period'], "file": b_text, "path": save_path})
                    
                    # Next Page
                    next_page = page_num + 1
                    clicked = page.evaluate(f"""() => {{
                        const nextBtn = Array.from(document.querySelectorAll('.pagination a')).find(a => a.innerText.trim() == '{next_page}');
                        if(nextBtn) {{
                            nextBtn.click();
                            return true;
                        }}
                        return false;
                    }}""")
                    
                    if clicked and next_page <= 30:
                        time.sleep(3)
                        page_num = next_page
                    else:
                        break

            browser.close()

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Heungkuk Fire Direct finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HeungkukFireDirectScraper().scrape_all()
