# -*- coding: utf-8 -*-
import os
import time
import json
import requests
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

def debug_hanwha():
    url = "https://www.hanwhalife.com/main/disclosure/goods/goodslist/DF_GDGL000_P10000.do"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        Stealth().apply_stealth_sync(page)
        
        print(f"[*] Accessing: {url}")
        page.goto(url, wait_until="networkidle", timeout=60000)
        time.sleep(10)
        
        # 1. '검색' 버튼 클릭 시도
        search_btn = page.locator("#btnSearch").first
        if search_btn.count() > 0:
            print("[*] Clicking Search Button...")
            search_btn.click(force=True)
            time.sleep(10)
        
        # 2. 모든 테이블 및 행 내용 추출
        rows = page.locator("tr").all()
        print(f"[*] Total TR count: {len(rows)}")
        
        for idx, row in enumerate(rows[:20]):
            txt = row.inner_text().strip().replace("\n", " ")
            if txt:
                print(f"    Line {idx}: {txt[:100]}...")

        # 3. HTML 소스 전체 저장 (분석용)
        with open("hanwha_debug.html", "w", encoding="utf-8") as f:
            f.write(page.content())
        print("[!] HTML saved to hanwha_debug.html")

        # 4. 스크린샷 저장
        page.screenshot(path="hanwha_debug.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    debug_hanwha()
