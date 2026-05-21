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

class LinaSimulationScraper:
    def __init__(self):
        self.list_url = "https://www.lina.co.kr/disclosure/price-public-announcement"
        self.results_file = "lina_simulation_rates.json"
        self.extracted_data = []

    def run(self):
        setup_encoding()
        print(f"[*] Starting Lina Life Simulation Scraping (Enhanced)...", flush=True)
        
        with sync_playwright() as p:
            # 브라우저 실행 (헤드리스 모드)
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 1200, 'height': 1000})
            page = context.new_page()
            
            print(f"    > Accessing List: {self.list_url}", flush=True)
            page.goto(self.list_url, wait_until="networkidle", timeout=60000)
            time.sleep(3)
            
            # 첫 번째 상품의 '상세보기' 버튼 클릭하여 시뮬레이션 팝업 열기
            print("    > Opening Simulation Popup...", flush=True)
            try:
                with context.expect_page() as new_page_info:
                    # '상세보기' 버튼이 여러 개일 수 있으므로 첫 번째 것 클릭
                    page.locator("button:has-text('상세보기')").first.click()
                
                sim_page = new_page_info.value
                sim_page.wait_for_load_state("networkidle")
                time.sleep(5) # 팝업 로딩 충분히 대기
            except Exception as e:
                print(f"    [-] Failed to open popup: {e}")
                browser.close()
                return

            print(f"    > Simulation Page Loaded: {sim_page.url}", flush=True)

            # 테스트 대상 (20, 30, 40, 50, 60세)
            ages = [20, 30, 40, 50, 60]
            genders = [("남자", "man"), ("여자", "woman")]
            
            for age_val in ages:
                # 2026년 기준 생년월일
                birth_str = f"{2026 - age_val}0101"
                
                for g_name, g_id in genders:
                    print(f"    [+] Calculating: Age {age_val}, Gender {g_name}...", flush=True)
                    
                    try:
                        # 폼 입력 (JS로 안정적 입력)
                        sim_page.evaluate(f"""(bStr, gId) => {{
                            const nameField = document.getElementById('name');
                            const birthField = document.getElementById('iresid_no1');
                            if(nameField) nameField.value = '홍길동';
                            if(birthField) birthField.value = bStr;
                            
                            const gLabel = document.getElementById('leftinlabel1_' + gId);
                            if(gLabel) gLabel.click();
                        }}""", birth_str, g_id)
                        
                        # 보험료 조회 클릭 (Class selector: btnProductPremium)
                        sim_page.locator(".btnProductPremium").click()
                        time.sleep(3) # 계산 결과 업데이트 대기
                        
                        # 결과 데이터 추출
                        data = sim_page.evaluate("""() => {
                            const premEl = document.getElementById('tot_prem_text');
                            const titleEl = document.querySelector('.simulation-title .title') || {innerText: "Lina Product"};
                            const coverage = document.querySelector('select[name="main_amt_code"] option:checked')?.innerText || "Unknown";
                            
                            return {
                                premium: premEl ? premEl.innerText.replace(/[^0-9]/g, "") : "0",
                                product: titleEl.innerText.trim(),
                                coverage: coverage.trim()
                            };
                        }""")
                        
                        result = {
                            "company": "Lina Life",
                            "product": data['product'],
                            "age": age_val,
                            "gender": g_name,
                            "coverage": data['coverage'],
                            "premium": data['premium'],
                            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
                        }
                        print(f"      - Result: {data['premium']} KRW", flush=True)
                        self.extracted_data.append(result)
                        
                    except Exception as e:
                        print(f"      [-] Extraction Error: {e}", flush=True)
            
            browser.close()

        # 결과 저장
        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.extracted_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Saved {len(self.extracted_data)} points to {self.results_file}", flush=True)

if __name__ == "__main__":
    LinaSimulationScraper().run()
