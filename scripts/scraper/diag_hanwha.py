# -*- coding: utf-8 -*-
import os
import time
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

def diag_hanwha():
    url = "https://www.hanwhalife.com/main/disclosure/goods/goodslist/DF_GDGL000_P10000.do"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        Stealth().apply_stealth_sync(page)
        
        print(f"[*] Accessing: {url}")
        page.goto(url, wait_until="networkidle", timeout=60000)
        time.sleep(10)
        
        print(f"\n[>>>] Main Frame URL: {page.url}")
        frames = page.frames
        print(f"[*] Found {len(frames)} total frames.")
        
        for idx, f in enumerate(frames):
            print(f"    Frame {idx}: Name='{f.name}', URL='{f.url}'")
            try:
                # 각 프레임에서 검색 버튼(#btnSearch) 및 테이블 존재 여부 확인
                btn = f.locator("#btnSearch")
                if btn.count() > 0:
                    print(f"      !!! Found #btnSearch in Frame {idx} !!!")
                
                table = f.locator("table")
                if table.count() > 0:
                    print(f"      Found {table.count()} tables in Frame {idx}")
            except:
                pass

        page.screenshot(path="hanwha_diag.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    diag_hanwha()
