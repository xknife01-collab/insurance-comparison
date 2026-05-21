# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

class LinaLifeDirectScraper:
    def __init__(self):
        self.base_url = "https://www.lina.co.kr/disclosure/product-public-announcement/product-on-sales?k=1"
        self.download_root = os.path.join(os.getcwd(), "downloads", "lina_life")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.results_file = "lina_life_full_data.json"
        self.all_data = []

    def scrape_all(self):
        print("[*] Starting Lina Life (Pure API Extraction Mode - LIGHTNING FAST)...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="networkidle", timeout=60000)
            time.sleep(3)

            # 카테고리 정보 추출 (API 호출용 데이터 확보)
            # 리나생명 탭 구조에서 코드 추출 시도
            category_info = page.evaluate("""() => {
                const tabs = Array.from(document.querySelectorAll('.el-button.tab.title-btn-'));
                // 내부적으로 KliaProdClcd가 매핑되어 있을 것이나, 명시적이지 않으므로 
                // 탭의 텍스트와 순서를 기반으로 하거나, 클릭 시 발생하는 네트워크를 활용함.
                // 01: 종신, 02: 정기, 03: 실버, 04: 건강/암, 05: 상해, 06: 치아, 07: 어린이, 08: 저축/연금
                return tabs.map((t, idx) => ({
                    name: t.innerText.trim(),
                    code: (idx + 1).toString().padStart(2, '0')
                })).filter(c => c.name && !c.name.includes('선택'));
            }""")
            
            print(f"[*] Identified {len(category_info)} target categories. Bypassing UI for data collection...", flush=True)
            
            all_collected_data = []
            
            # 브라우저 컨텍스트 내에서 직접 API를 호출하여 데이터 수집 (매우 빠름)
            # fetch()를 사용하면 쿠키와 헤더가 자동으로 포함됨.
            for cat in category_info:
                print(f"    > Fetching Category: {cat['name']} (Code: {cat['code']})...", flush=True)
                
                # 1. 상품 리스트 API 호출
                list_data = page.evaluate(f"""async (catCode) => {{
                    try {{
                        const url = `https://api.lina.co.kr/public/contents/v1/disclosure/product-list?mtrtDcd=B&KliaProdClcd=${{catCode}}&tabTitle=`;
                        const res = await fetch(url);
                        const json = await res.json();
                        return json.list || [];
                    }} catch(e) {{ return []; }}
                }}""", cat['code'])
                
                print(f"      - Found {len(list_data)} products.", flush=True)
                
                # 2. 각 상품별 상세 API 호출
                for prod in list_data:
                    p_name = prod.get('productNm', 'Unknown')
                    ins_cd = prod.get('insureCd')
                    grp_cd = prod.get('prodPbanGrpCd')
                    
                    if not ins_cd or not grp_cd: continue
                    
                    print(f"        [+] Detail: {p_name}", flush=True)
                    
                    detail_data = page.evaluate(f"""async (insCd, grpCd) => {{
                        try {{
                            const url = `https://api.lina.co.kr/public/contents/v1/disclosure/product-list-detail?insureCd=${{insCd}}&prodPbanGrpCd=${{grpCd}}`;
                            const res = await fetch(url);
                            const json = await res.json();
                            return json.detail || {{}};
                        }} catch(e) {{ return {{}}; }}
                    }}""", ins_cd, grp_cd)
                    
                    # PDF 파일 정보 추출
                    files = [
                        ("요약서", detail_data.get("productSumary")),
                        ("사업방법서", detail_data.get("productMethod")),
                        ("약관", detail_data.get("productProvision"))
                    ]
                    
                    added_count = 0
                    for f_type, f_name in files:
                        if f_name and f_name != 'null' and len(f_name) > 4:
                            all_collected_data.append({
                                "category": cat['name'],
                                "product": p_name,
                                "type": f_type,
                                "filename": f_name,
                                "period": f"{detail_data.get('sellOpnDt', 'N/A')}~{detail_data.get('sellEndDt', 'N/A')}"
                            })
                            added_count += 1
                    
            browser.close()

        # 파일 다운로드 (세션 유지하며 Requests 사용)
        print(f"[*] Total {len(all_collected_data)} files identified. Starting direct download...", flush=True)
        sess = requests.Session()
        sess.headers.update({"User-Agent": "Mozilla/5.0", "Referer": "https://www.lina.co.kr/"})
        
        final_results = []
        for item in all_collected_data:
            # 리나생명 PDF 서버 경로: https://www.lina.co.kr/cms/upload/HOMEPAGE/disclosure/pdf/
            pdf_url = f"https://www.lina.co.kr/cms/upload/HOMEPAGE/disclosure/pdf/{item['filename']}"
            safe_f_name = f"Lina_{item['category']}_{item['product']}_{item['type']}.pdf".replace(" ", "_").replace("/", "_")
            save_path = os.path.join(self.download_root, safe_f_name)
            
            if not os.path.exists(save_path):
                try:
                    res = sess.get(pdf_url, timeout=10)
                    if res.status_code == 200:
                        with open(save_path, 'wb') as f:
                            f.write(res.content)
                        print(f"    [OK] Saved: {safe_f_name}", flush=True)
                        item['path'] = save_path
                    else:
                        # 대체 경로 시도 (예전 경로)
                        old_url = f"https://www.lina.co.kr/cms/upload/upload/docs/disclosure/{item['filename']}"
                        res = sess.get(old_url, timeout=10)
                        if res.status_code == 200:
                            with open(save_path, 'wb') as f:
                                f.write(res.content)
                            print(f"    [OK] Saved (Old Path): {safe_f_name}", flush=True)
                            item['path'] = save_path
                        else:
                            print(f"    [FAIL] Status {res.status_code}: {pdf_url}", flush=True)
                except Exception as e:
                    print(f"    [FAIL] Error: {e}", flush=True)
            else:
                item['path'] = save_path
            
            if 'path' in item:
                final_results.append(item)

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(final_results, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] Lina Life Direct finished. Total: {len(final_results)} items.", flush=True)

if __name__ == "__main__":
    LinaLifeDirectScraper().scrape_all()
