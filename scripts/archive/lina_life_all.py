# -*- coding: utf-8 -*-
import os
import time
import json
import sys
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

def setup_encoding():
    if sys.stdout.encoding != 'utf-8':
        try:
            import io
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        except:
            pass

class LinaLifeScraper:
    def __init__(self):
        self.base_url = "https://www.lina.co.kr/disclosure/product-public-announcement/product-on-sales"
        self.download_root = os.path.join(os.getcwd(), "downloads", "lina_life")
        os.makedirs(self.download_root, exist_ok=True)
        self.results_file = "lina_life_full_data.json"
        self.all_data = []

    def scrape_all(self):
        setup_encoding()
        print("\n[라이나생명] 로딩 대기 강화 및 카드 펼치기 로직 시작\n", flush=True)
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={'width': 1920, 'height': 1080},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            page = context.new_page()
            Stealth().apply_stealth_sync(page)
            
            try:
                page.goto(self.base_url, wait_until="networkidle", timeout=60000)
                time.sleep(5)
                
                # 탭 버튼 대기
                page.wait_for_selector("button.el-button.tab", timeout=20000)
                tabs = page.locator("button.el-button.tab").all()
                tab_names = [t.inner_text().strip() for t in tabs]
                print(f"[*] 발견된 카테고리: {', '.join(tab_names)}", flush=True)
                
                for i in range(len(tab_names)):
                    name = tab_names[i]
                    print(f"\n[1/3] 카테고리 클릭: {name}", flush=True)
                    tabs[i].click()
                    
                    # 로딩 마스크 대기
                    try:
                        page.wait_for_selector(".el-loading-mask", state="visible", timeout=3000)
                        page.wait_for_selector(".el-loading-mask", state="hidden", timeout=20000)
                    except: pass 
                    time.sleep(2)
                    
                    # 상품 리스트 (카드 형태 포함)
                    # Selector: list-top--inner 가 있으면 카드형, 없으면 바로 테이블
                    cards = page.locator("button.el-button.list-top--inner").all()
                    
                    if not cards:
                        # 바로 테이블이 보이는 경우 (예: 종신보험 초기화면)
                        print(f"  [*] 테이블 기반 즉시 추출 중...", flush=True)
                        self.extract_downloads(page, name, "Immediate List")
                    else:
                        print(f"  [+] {len(cards)}개의 카드형 상품 발견", flush=True)
                        for j in range(len(cards)):
                            p_name = cards[j].inner_text().strip()
                            print(f"    [2/3] 카드 펼치기: {p_name}", flush=True)
                            cards[j].click()
                            time.sleep(1.5)
                            self.extract_downloads(page, name, p_name)
                            
            except Exception as e:
                print(f"  [-] 오류 발생: {e}")
                
            browser.close()

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Lina Life finished. Total: {len(self.all_data)} items.", flush=True)

    def extract_downloads(self, page, cat_name, product_name):
        # Find all download buttons currently visible
        dl_btns = page.locator("button.el-button.down-button").all()
        for btn in dl_btns:
            try:
                # Get the document type from context
                parent_text = btn.evaluate("el => el.parentElement.parentElement.parentElement.innerText")
                f_type = "기타"
                if "요약서" in parent_text: f_type = "요약서"
                elif "방법서" in parent_text: f_type = "사업방법서"
                elif "약관" in parent_text: f_type = "약관"
                
                # If product_name is generic, try to get it from parent row
                actual_p_name = product_name
                if product_name == "Immediate List":
                    actual_p_name = btn.evaluate("el => el.closest('tr').cells[1].innerText").strip()
                
                safe_p = "".join([c for c in actual_p_name if c.isalnum() or c in "._- "]).strip().replace(" ", "_")
                # Avoid collision and identify UI source
                safe_name = f"Lina_UI_{safe_p}_{f_type}.pdf"
                save_path = os.path.join(self.download_root, safe_name)
                
                if not os.path.exists(save_path):
                    print(f"      [3/3] 다운로드: {actual_p_name} ({f_type}) ...", flush=True)
                    with page.expect_download(timeout=15000) as dl_info:
                        btn.click()
                    dl_info.value.save_as(save_path)
                    print(f"        [OK] 저장됨.", flush=True)
                
                self.all_data.append({"category": cat_name, "product": actual_p_name, "type": f_type, "path": save_path})
            except:
                continue

if __name__ == "__main__":
    LinaLifeScraper().scrape_all()
