# -*- coding: utf-8 -*-
import os
import sys
import io
import time
import json
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class DBInsuranceScraperFast:
    def __init__(self):
        self.base_url = "https://www.idbins.com/FWMAIV1534.do"
        self.download_root = os.path.join(os.getcwd(), "downloads", "db_insurance")
        os.makedirs(self.download_root, exist_ok=True)
        self.results_file = "db_insurance_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("\n[DB손해보험] (V5) 하드코딩된 이름표(Class) 완벽 폐기 & DOM 연쇄 탐색 도입\n", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False) 
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            print("  - 네트워크 로딩 대기 중...", flush=True)
            time.sleep(5) 
            
            # CSS 클래스가 바뀌어도 '자동차보험'이라는 텍스트가 있는 첫번째 리스트(UL)가 1열이라는 불변의 진리를 활용!
            # 이것은 DB 보험사측에서 웹사이트를 갈아엎어도 작동하는 최강의 방식입니다.
            try:
                page.wait_for_selector("text='자동차보험'", state="attached", timeout=15000)
            except Exception as e:
                print(f"[-] 페이지 로딩 실패: {e}", flush=True)
                return

            print("[*] .step1 구조 대신 '텍스트' 기반 구조 인식 성공! 스크래핑 시작...", flush=True)

            # Step 1: '자동차보험' 글자를 갖고 있는 리스트(ul) 안의 모든 링크(a) 개수
            cat_js = """() => {
                const uls = Array.from(document.querySelectorAll('ul'));
                const step1 = uls.find(u => u.innerText && u.innerText.includes('자동차보험') && u.innerText.includes('장기보험'));
                return step1 ? step1.querySelectorAll('a').length : 0;
            }"""
            
            cat_count = page.evaluate(cat_js)
            print(f"[*] Step 1: 총 {cat_count}개 카테고리 감지됨", flush=True)

            for cidx in range(cat_count):
                c_name = page.evaluate(f"""() => {{
                    const uls = Array.from(document.querySelectorAll('ul'));
                    const step1 = uls.find(u => u.innerText.includes('자동차보험') && u.innerText.includes('장기보험'));
                    return step1.querySelectorAll('a')[{cidx}].innerText;
                }}""")
                if not c_name or "선택" in c_name: continue
                
                print(f"\n[+] 카테고리 진입: {c_name.strip()}", flush=True)
                page.evaluate(f"""() => {{
                    const uls = Array.from(document.querySelectorAll('ul'));
                    const step1 = uls.find(u => u.innerText.includes('자동차보험') && u.innerText.includes('장기보험'));
                    step1.querySelectorAll('a')[{cidx}].click();
                }}""")
                time.sleep(1.5) 

                # Step 2: 두번째 목록
                prod_count = page.evaluate("""() => {
                    const uls = Array.from(document.querySelectorAll('h3, h4, div')).filter(e => e.innerText && e.innerText.includes('2 step')).map(e => e.parentElement.querySelector('ul')).filter(u => u);
                    if(uls.length > 0 && uls[0]) return uls[0].querySelectorAll('a').length;
                    
                    // 만약 2 step 텍스트가 분리되어 찾지 못한다면 화면상의 2번째로 긴 세로 리스트를 찾음
                    const all_uls = Array.from(document.querySelectorAll('ul')).filter(u => u.querySelectorAll('a').length > 0 && u.innerText.length > 5);
                    return all_uls.length > 1 ? all_uls[1].querySelectorAll('a').length : 0;
                }""")
                
                for pidx in range(prod_count):
                    p_name = page.evaluate(f"""() => {{
                        const all_uls = Array.from(document.querySelectorAll('ul')).filter(u => u.querySelectorAll('a').length > 0 && u.innerText.length > 5);
                        return all_uls[1].querySelectorAll('a')[{pidx}].innerText;
                    }}""")
                    if not p_name or "선택" in p_name: continue
                    
                    print(f"  -> 상품 선택: {p_name.strip()}", flush=True)
                    page.evaluate(f"""() => {{
                        const all_uls = Array.from(document.querySelectorAll('ul')).filter(u => u.querySelectorAll('a').length > 0 && u.innerText.length > 5);
                        all_uls[1].querySelectorAll('a')[{pidx}].click();
                    }}""")
                    time.sleep(1.5)

                    # Step 3: 세번째 목록
                    per_count = page.evaluate("""() => {
                        const all_uls = Array.from(document.querySelectorAll('ul')).filter(u => u.querySelectorAll('a').length > 0 && u.innerText.length > 5);
                        return all_uls.length > 2 ? all_uls[2].querySelectorAll('a').length : 0;
                    }""")
                    
                    for per_idx in range(per_count):
                        per_text = page.evaluate(f"""() => {{
                            const all_uls = Array.from(document.querySelectorAll('ul')).filter(u => u.querySelectorAll('a').length > 0 && u.innerText.length > 5);
                            return all_uls[2].querySelectorAll('a')[{per_idx}].innerText;
                        }}""")
                        if not per_text or "선택" in per_text: continue
                        print(f"    => 판매기간: {per_text.strip()}", flush=True)
                        page.evaluate(f"""() => {{
                            const all_uls = Array.from(document.querySelectorAll('ul')).filter(u => u.querySelectorAll('a').length > 0 && u.innerText.length > 5);
                            all_uls[2].querySelectorAll('a')[{per_idx}].click();
                        }}""")
                        time.sleep(1.5)

                        # Step 4: 네번째 목록 (다운로드 버튼들)
                        # 여기는 a 태그 중에 onclick 등 속성에 파일 정보를 담은 녀석들이 나열됨.
                        dl_btns_js = """() => {
                            const btns = Array.from(document.querySelectorAll('a.print, a.btn_down, a[onclick*="down"], a[href*=".pdf"], a[id^="step4Btn"]'));
                            return btns.map(b => ({id: b.id, text: b.innerText, className: b.className})).filter(b => b.text.includes('사업방법서') || b.text.includes('요약서') || b.text.includes('약관') || b.id.includes('step4'));
                        }"""
                        btn_list = page.evaluate(dl_btns_js)
                        
                        for b_info in btn_list:
                            btn_id = b_info['id']
                            b_title = b_info['text'] or btn_id
                            
                            safe_name = f"DB_{p_name}_{per_text}_{b_title}.pdf".replace("/", "_").replace(" ", "_")
                            save_path = os.path.join(self.download_root, safe_name)

                            if not os.path.exists(save_path):
                                print(f"      [다운로드 시작] {b_title}", flush=True)
                                try:
                                    if btn_id:
                                        with page.expect_download(timeout=10000) as dl_info:
                                            page.evaluate(f"document.getElementById('{btn_id}').click()")
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
