# -*- coding: utf-8 -*-
import os
import time
import json
import sys
from playwright.sync_api import sync_playwright

def setup_encoding():
    if sys.stdout.encoding != 'utf-8':
        try:
            import io
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        except:
            pass

class HeungkukFireScraper:
    def __init__(self):
        self.base_url = "https://www.heungkukfire.co.kr/FRW/announce/insGoodsGongsiSale.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "heungkuk_fire")
        os.makedirs(self.download_root, exist_ok=True)
        self.results_file = "heungkuk_fire_full_data.json"
        self.all_data = []

    def scrape_all(self):
        setup_encoding()
        print("\n[흥국화재] Playwright 최신 셀렉터 기반 크롤링 시작\n", flush=True)
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 1280, 'height': 800})
            page = context.new_page()
            
            # 유형별 루프: 장기(1), 일반(2), 자동차(3)
            categories = [("장기보험", "1"), ("일반보험", "2"), ("자동차보험", "3")]
            
            for c_name, c_type in categories:
                print(f"[*] 카테고리: {c_name} (Type: {c_type}) 접속 중...", flush=True)
                url = f"{self.base_url}?type={c_type}"
                page.goto(url, wait_until="networkidle", timeout=60000)
                time.sleep(3)
                
                # 페이지네이션 루프
                page_num = 1
                while True:
                    print(f"    [Page {page_num}] 데이터 추출 중...", flush=True)
                    try:
                        page.wait_for_selector(".tbl_list tr", timeout=10000)
                    except:
                        break

                    rows = page.locator(".tbl_list tr").all()
                    for row in rows:
                        try:
                            # Skip header or empty rows
                            row_txt = row.inner_text().strip()
                            if "내용이 없습니다" in row_txt or "보험상품명" in row_txt: continue
                            
                            tds = row.locator("td").all()
                            if len(tds) < 3: continue
                            
                            p_name = tds[2].inner_text().strip()
                            sale_period = tds[3].inner_text().strip()
                            
                            # Grab PDF buttons by looking for '보기' or specific text
                            btns = row.locator("a:has-text('보기')").all() # Or btn_sub1
                            if not btns:
                                btns = row.locator(".btn_sub1").all()
                                
                            for btn in btns:
                                b_text = btn.inner_text().strip()
                                # Identify file type from header or title if possible
                                # In Heungkuk Fire, usually they are arranged in columns: 약관, 사업방법서, 상품요약서
                                try:
                                    col_idx = 0
                                    # Find matching column for type
                                    # btn link index or column index
                                    f_type = "기타"
                                    # We can try to guess or use the button title
                                    title = btn.get_attribute("title") or ""
                                    if "약관" in title or "약관" in b_text: f_type = "약관"
                                    elif "사업방법서" in title or "방법서" in b_text: f_type = "사업방법서"
                                    elif "요약서" in title or "요약서" in b_text: f_type = "요약서"
                                    
                                    safe_p_name = "".join([c for c in p_name if c.isalnum() or c in "._- "]).strip().replace(" ", "_")
                                    safe_name = f"HeungkukFire_{c_name}_{safe_p_name}_{sale_period}_{f_type}.pdf"
                                    save_path = os.path.join(self.download_root, safe_name)
                                    
                                    if not os.path.exists(save_path):
                                        print(f"        [+] 다운로드: {p_name} ({f_type})...", flush=True)
                                        with page.expect_download(timeout=15000) as dl_info:
                                            btn.click()
                                        dl_info.value.save_as(save_path)
                                        print(f"          [OK] 저장됨.", flush=True)
                                    
                                    self.all_data.append({
                                        "category": c_name, "product": p_name, 
                                        "period": sale_period, "type": f_type, "path": save_path
                                    })
                                except Exception as ex:
                                    # print(f"        [!] Download Fail: {ex}", flush=True)
                                    continue
                        except: continue

                    # Next page action
                    next_page = page_num + 1
                    next_btn = page.locator(f".pagination a:has-text('{next_page}')").first
                    if next_btn.count() > 0:
                        next_btn.click()
                        time.sleep(3)
                        page_num += 1
                    else:
                        break
            browser.close()

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Heungkuk Fire finished. Total: {len(self.all_data)} items.", flush=True)

if __name__ == "__main__":
    HeungkukFireScraper().scrape_all()
