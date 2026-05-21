# -*- coding: utf-8 -*-
import os
import sys
import io
import time
import json
from playwright.sync_api import sync_playwright

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class DBInsuranceScraperFast:
    def __init__(self):
        self.base_url = "https://www.idbins.com/FWMAIV1534.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "db_insurance")
        os.makedirs(self.download_root, exist_ok=True)
        self.results_file = "db_insurance_full_data.json"
        self.all_data = []

    def get_column_items(self, page, col_idx):
        # 4개의 기둥(Column)의 예상 X 좌표 범위 (화면 1920x1080 기준)
        # 서브에이전트 측정결과: C1=240, C2=375, C3=521, C4(버튼들)=700~900
        bounds = {
            1: (200, 320),
            2: (320, 450),
            3: (450, 650),
            4: (650, 1000)
        }
        
        # 화면의 모든 요소 중 화면에 보이고 글자가 있는 것들의 좌표 수집
        script = """() => {
            const els = Array.from(document.querySelectorAll("a, button, li, span, dt, dd"));
            const items = [];
            for (let el of els) {
                if (!el.innerText) continue;
                const txt = el.innerText.trim();
                if (txt.length === 0 || txt === "선택") continue;
                
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && rect.y > 200) {
                    // Y > 200은 상단 메뉴바 제외를 위해
                    items.push({text: txt, x: rect.x + (rect.width/2), y: rect.y + (rect.height/2)});
                }
            }
            return items;
        }"""
        
        raw_items = page.evaluate(script)
        
        # 지정된 X 좌표 범위(Column)에 들어오는 항목 필터링 및 Y 좌표 정렬
        min_x, max_x = bounds[col_idx]
        col_items = [i for i in raw_items if min_x <= i['x'] <= max_x]
        
        # 중복 텍스트 제거 (같은 버튼이 span 등 중첩될 경우)
        unique_items = []
        seen = set()
        for i in col_items:
            # 텍스트가 "1 step." 같은 제목이면 제외
            if "step." in i['text'].lower() or i['text'] in seen: continue
            seen.add(i['text'])
            unique_items.append(i)
            
        return sorted(unique_items, key=lambda i: i['y'])

    def scrape_all(self):
        print("\n[DB손해보험] (Vision API) HTML 구조 무시 & 화면 기하학(X,Y좌표) 기반 클릭 주입 개시\n", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False) 
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            page = context.new_page()

            page.goto("https://www.idbins.com/")
            time.sleep(2)
            print("  - 메인 세션 확보 후 공시실 진입...", flush=True)
            page.goto(self.base_url, referer="https://www.idbins.com/", wait_until="networkidle", timeout=60000)
            time.sleep(5) 
            
            # 스크롤해서 Lazy Load 해제
            page.evaluate("window.scrollTo(0, 1000)")
            time.sleep(3)

            cat_items = self.get_column_items(page, 1)
            print(f"[*] 화면 기하학 분석: 1열(상품군) {len(cat_items)}개 인식됨", flush=True)

            for c_item in cat_items:
                c_name = c_item['text']
                if "Acrobat" in c_name: continue
                
                print(f"\n[+] 1열 좌표({c_item['x']},{c_item['y']}) 클릭: {c_name}", flush=True)
                page.mouse.click(c_item['x'], c_item['y'])
                time.sleep(2) 

                prod_items = self.get_column_items(page, 2)
                for p_item in prod_items:
                    p_name = p_item['text']
                    
                    print(f"  -> 2열 좌표({p_item['x']},{p_item['y']}) 클릭: {p_name}", flush=True)
                    page.mouse.click(p_item['x'], p_item['y'])
                    time.sleep(2)

                    period_items = self.get_column_items(page, 3)
                    for per_item in period_items:
                        per_text = per_item['text']
                        print(f"    => 3열 좌표({per_item['x']},{per_item['y']}) 클릭: {per_text}", flush=True)
                        page.mouse.click(per_item['x'], per_item['y'])
                        time.sleep(2)

                        # Step 4 버튼들
                        btn_items = self.get_column_items(page, 4)
                        for b_item in btn_items:
                            b_title = b_item['text']
                            if not b_title or "다운로드" not in b_title and "사업방법서" not in b_title and "약관" not in b_title and "요약서" not in b_title: continue
                            
                            safe_name = f"DB_{p_name}_{per_text}_{b_title}.pdf".replace("/", "_").replace(" ", "_")
                            save_path = os.path.join(self.download_root, safe_name)

                            if not os.path.exists(save_path):
                                print(f"      [다운로드 시작] {b_title} 위치({b_item['x']},{b_item['y']})", flush=True)
                                try:
                                    with page.expect_download(timeout=10000) as dl_info:
                                        page.mouse.click(b_item['x'], b_item['y'])
                                    dl_info.value.save_as(save_path)
                                    print(f"      [다운로드 완료] {safe_name}", flush=True)
                                except Exception as e:
                                    print(f"      [다운로드 실패] 파일이 없거나 오류 발생", flush=True)
                            
                            self.all_data.append({
                                "category": c_name.strip(), "product": p_name.strip(), 
                                "period": per_text.strip(), "file": b_title.strip(), "path": save_path
                            })
                                
            browser.close()

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
            
if __name__ == "__main__":
    DBInsuranceScraperFast().scrape_all()
