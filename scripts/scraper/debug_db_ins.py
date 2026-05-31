# -*- coding: utf-8 -*-
import os
import time
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

def debug_db_insurance():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        Stealth().apply_stealth_sync(page)

        print("[*] Navigating to DB Insurance...")
        page.goto("https://www.idbins.com/FWCU7040.do", wait_until="networkidle")
        time.sleep(15) # 넉넉하게 대기

        # 1. 페이지 전체 HTML 저장
        with open("db_insurance_dump.html", "w", encoding="utf-8") as f:
            f.write(page.content())
        print("[*] Saved HTML dump to db_insurance_dump.html")

        # 2. 모든 버튼 및 링크 텍스트 확인
        buttons = page.locator("button, a, input[type=button], input[type=submit]").all()
        print(f"[*] Found {len(buttons)} interactive elements.")
        
        for btn in buttons:
            try:
                txt = btn.inner_text().strip()
                if not txt: txt = btn.get_attribute("title") or ""
                if not txt: txt = btn.get_attribute("id") or ""
                
                if any(kw in txt for kw in ["조회", "검색", "search", "Search"]):
                    print(f"  [FOUND BTN] Text: '{txt}', ID: '{btn.get_attribute('id')}', Class: '{btn.get_attribute('class')}'")
            except: pass

        # 3. 테이블 존재 여부 확인
        tables = page.locator("table").count()
        print(f"[*] Tables found: {tables}")

        browser.close()

if __name__ == "__main__":
    debug_db_insurance()
