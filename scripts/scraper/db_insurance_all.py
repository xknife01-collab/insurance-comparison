# -*- coding: utf-8 -*-
import os
import time
import json
import re
import sys
import io
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
from dotenv import load_dotenv

if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

class DBInsuranceScraper:
    def __init__(self):
        self.base_url = "https://www.idbins.com/FWMAIV1534.do"
        self.download_root = os.path.join(os.getcwd(), "..", "..", "downloads", "db_insurance")
        if not os.path.exists(self.download_root): os.makedirs(self.download_root)
        self.pdf_urls = []

    def scrape_all(self):
        print("[*] DB Insurance Final Break-through: Deep Frame Infiltration...", flush=True)
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(accept_downloads=True, viewport={'width': 1920, 'height': 1080})
            page = context.new_page()
            Stealth().apply_stealth_sync(page)

            print(f"[*] Accessing DB InS: {self.base_url}", flush=True)
            page.goto(self.base_url, wait_until="commit", timeout=30000)
            time.sleep(15)

            # 🖼️ 1. 모든 프레임 탐색
            all_frames = page.frames
            print(f"[*] Detected {len(all_frames)} frames. Searching for content area...")

            for idx, frame in enumerate(all_frames):
                f_url = frame.url
                print(f"  [{idx}] Frame URL: {f_url}")
                
                try:
                    # 각 프레임에 JS 후킹 주입
                    frame.evaluate("""
                        () => {
                            window.captured_files = window.captured_files || [];
                            window.goPdf = (sqno, valpdf) => {
                                window.captured_files.push(valpdf);
                            };
                        }
                    """)

                    # [판매상품] 탭 강제 활성화 시도
                    frame.evaluate("() => document.querySelector('#tabSaleProduct1')?.click()")
                    time.sleep(2)

                    # 검색창 강제 침투 및 키워드 입력 (암, 건강 등)
                    keywords = ["암", "건강", "운전자", "연금"]
                    for kw in keywords:
                        print(f"    - Trying Keyword '{kw}' in frame {idx}...")
                        frame.evaluate(f"""
                            () => {{
                                const sBox = document.querySelector('input[type=text]') || document.querySelector('#FW_MAL_searchWord');
                                if (sBox) {{
                                    sBox.value = '{kw}';
                                    sBox.dispatchEvent(new Event('input', {{ bubbles: true }}));
                                    sBox.dispatchEvent(new Event('change', {{ bubbles: true }}));
                                    sBox.dispatchEvent(new KeyboardEvent('keydown', {{ key: 'Enter' }}));
                                }}
                            }}
                        """)
                        time.sleep(5)

                        # 결과 테이블의 버튼들 강제 클릭 (Hooked goPdf 가 가로챔)
                        frame.evaluate("""
                            () => {
                                const btns = Array.from(document.querySelectorAll('a, button'));
                                const calls = btns.filter(b => b.innerText.includes('요약서') || b.className.includes('pdf') || b.title.includes('다운로드'));
                                calls.forEach(c => { try { c.click(); } catch(e) {} });
                            }
                        """)
                        time.sleep(5)

                    # 가로챈 파일명 추출
                    fnames = frame.evaluate("() => window.captured_files")
                    if fnames:
                        fnames = list(set(fnames))
                        print(f"    [✔] Hooked {len(fnames)} filenames from frame {idx}!")
                        for fn in fnames:
                            self.pdf_urls.append(fn)
                except: continue

            # 🎣 2. 실제 다운로드 (중복 제거 후 실행)
            unique_files = list(set(self.pdf_urls))
            print(f"\n[*] Total {len(unique_files)} files to download via Direct Link Phase.")
            
            for id_f, fname in enumerate(unique_files):
                try:
                    url = f"https://www.idbins.com/cYakgwanDown.do?FilePath=InsProduct/{fname}"
                    resp = requests.get(url, headers={"Referer": "https://www.idbins.com/"}, timeout=30)
                    if resp.status_code == 200:
                        save_name = f"DB_Final_{id_f}_{int(time.time())}.pdf"
                        save_path = os.path.join(self.download_root, save_name)
                        with open(save_path, "wb") as f: f.write(resp.content)
                        print(f"      [✔] Saved: {save_name} (from {fname})", flush=True)
                except: continue

            browser.close()

        print(f"\n[*] DB Insurance Penetration Finished. Total Files: {len(os.listdir(self.download_root))}")

if __name__ == "__main__":
    DBInsuranceScraper().scrape_all()
