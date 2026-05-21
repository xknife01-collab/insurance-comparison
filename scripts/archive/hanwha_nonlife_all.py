# -*- coding: utf-8 -*-
"""
한화손보 - Playwright로 실제 브라우저 세션 유지하면서 API intercept
"""
import os
import json
import time
import requests
import urllib3
from playwright.sync_api import sync_playwright

urllib3.disable_warnings()

class HanwhaNonLifeScraper:
    def __init__(self):
        self.base_url = "https://www.hwgeneralins.com/notice/ir/product-ing01.do"
        self.api_base = "https://www.hwgeneralins.com/notice/ir/"
        self.download_root = os.path.join(os.getcwd(), "downloads", "hanwha_nonlife")
        os.makedirs(self.download_root, exist_ok=True)
        self.results_file = "hanwha_nonlife_full_data.json"
        self.all_data = []
        self.intercepted_responses = []

    def safe_fname(self, *parts):
        combined = "_".join(str(p) for p in parts if p)
        safe = "".join(c for c in combined if c.isalnum() or c in "._-").strip()
        return (safe[:140] + ".pdf") if len(safe) > 140 else safe + ".pdf"

    def download_file(self, url, save_path, session):
        """requests로 파일 다운로드"""
        try:
            r = session.get(url, verify=False, timeout=30)
            if r.status_code == 200 and len(r.content) > 500:
                with open(save_path, 'wb') as f:
                    f.write(r.content)
                print(f"              [OK] {len(r.content)} bytes", flush=True)
                return True
            else:
                print(f"              [Skip] status={r.status_code}, size={len(r.content)}", flush=True)
        except Exception as e:
            print(f"              [DL Fail] {e}", flush=True)
        return False

    def scrape_all(self):
        print("\n[한화손해보험] API 인터셉트 방식 스크래핑 시작\n", flush=True)

        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=['--disable-blink-features=AutomationControlled']
            )
            context = browser.new_context(
                viewport={'width': 1280, 'height': 900},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                accept_downloads=True
            )
            page = context.new_page()
            page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

            # API 응답 인터셉트 저장
            intercepted = {}

            def handle_response(response):
                url = response.url
                if "product-ing01" in url and ".json" in url:
                    try:
                        data = response.json()
                        intercepted[url] = data
                        rows = data.get("rows", data.get("list", []))
                        print(f"  [INTERCEPT] {url.split('/')[-1]}: {len(rows)}건", flush=True)
                    except:
                        pass

            page.on("response", handle_response)

            try:
                print("[*] 페이지 접속...", flush=True)
                page.goto(self.base_url, wait_until="domcontentloaded", timeout=60000)
                time.sleep(7)

                print(f"[*] 제목: {page.title()}", flush=True)

                # 카테고리 목록
                cats = page.locator("#step01 dd a").all()
                cat_count = len(cats)
                print(f"[+] 카테고리 {cat_count}개 발견", flush=True)

                # requests 세션에 브라우저 쿠키 등록
                def make_session():
                    session = requests.Session()
                    for c in context.cookies():
                        session.cookies.set(c['name'], c['value'], domain=c.get('domain',''))
                    session.headers.update({
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': self.base_url,
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                    })
                    return session

                for i in range(cat_count):
                    intercepted.clear()
                    cat = page.locator("#step01 dd a").nth(i)
                    cat_name = cat.inner_text().strip()
                    print(f"\n>>> [{i+1}/{cat_count}] {cat_name}", flush=True)
                    cat.click()
                    time.sleep(3)

                    prods = page.locator("#step02 a").all()
                    print(f"    상품 {len(prods)}개", flush=True)

                    for j in range(len(prods)):
                        intercepted.clear()
                        prod = page.locator("#step02 a").nth(j)
                        p_name = prod.inner_text().strip()
                        print(f"    >> {p_name}", flush=True)
                        prod.click()
                        time.sleep(2)

                        pers = page.locator("#step03 a").all()
                        print(f"       기간 {len(pers)}개", flush=True)

                        for k in range(len(pers)):
                            intercepted.clear()
                            per = page.locator("#step03 a").nth(k)
                            per_name = per.inner_text().strip()
                            print(f"       - 기간: {per_name}", flush=True)
                            per.click()
                            time.sleep(2.5)  # step4 API 응답 대기

                            # 인터셉트된 응답 중 step4 또는 단일 파일 row 찾기
                            file_rows = []
                            for iurl, idata in intercepted.items():
                                rows = idata.get("rows", idata.get("list", []))
                                # file1,file2,file3 중 하나라도 있으면 file row
                                for row in rows:
                                    if any(row.get(fk) for fk in ['file1','file2','file3','fileUrl','filePath']):
                                        file_rows.append(row)

                            if file_rows:
                                print(f"          [FILE ROW] {len(file_rows)}개 row 발견", flush=True)
                                for row in file_rows:
                                    for fkey, ftype_name in [('file1','약관'), ('file2','사업방법서'), ('file3','요약서'), ('fileUrl','파일'), ('filePath','파일')]:
                                        fval = row.get(fkey, "")
                                        if fval and str(fval) not in ["null", "", "None"]:
                                            file_url = str(fval) if str(fval).startswith("http") else "https://www.hwgeneralins.com" + str(fval)
                                            fname = self.safe_fname("HanwhaNon", cat_name, p_name, per_name, ftype_name)
                                            save_path = os.path.join(self.download_root, fname)
                                            print(f"          [{ftype_name}] {file_url[:80]}", flush=True)
                                            sess2 = make_session()
                                            downloaded = self.download_file(file_url, save_path, sess2)
                                            self.all_data.append({
                                                "category": cat_name, "product": p_name,
                                                "period": per_name, "type": ftype_name,
                                                "url": file_url,
                                                "path": save_path if downloaded else ""
                                            })
                            else:
                                # 인터셉트된 단일 row(기간 당 1건) 구조도 확인
                                all_rows = []
                                for iurl, idata in intercepted.items():
                                    rows = idata.get("rows", idata.get("list", []))
                                    all_rows.extend(rows)
                                if all_rows:
                                    print(f"          [ROW 구조 확인] 첫 row: {json.dumps(all_rows[0], ensure_ascii=False)[:300]}", flush=True)
                                else:
                                    print(f"          [기간 {per_name}] 인터셉트 데이터 없음", flush=True)

            except Exception as e:
                print(f"\n[-] 오류: {e}", flush=True)
                import traceback; traceback.print_exc()
            finally:
                browser.close()

        with open(self.results_file, "w", encoding="utf-8") as f:
            json.dump(self.all_data, f, ensure_ascii=False, indent=2)
        print(f"\n[DONE] 총 {len(self.all_data)}개 항목 수집 완료.", flush=True)

if __name__ == "__main__":
    HanwhaNonLifeScraper().scrape_all()
