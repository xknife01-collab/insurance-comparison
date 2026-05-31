# -*- coding: utf-8 -*-
import os
import sys
import time
from playwright.sync_api import sync_playwright

def debug_heungkuk_life():
    url = "https://www.heungkuklife.co.kr/front/public/saleProduct.do?searchFlgSale=Y"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print(f"[*] Accessing {url}...")
        page.goto(url, wait_until="networkidle", timeout=60000)
        time.sleep(10)
        
        page.screenshot(path="heungkuk_life_debug_init.png")
        
        # Check if there's a search button that needs to be clicked
        btns = page.locator("button, a.btn").all()
        for btn in btns:
            txt = btn.inner_text().strip()
            if "조회" in txt or "검색" in txt:
                print(f"[*] Clicking {txt} button...")
                btn.click()
                time.sleep(5)
                break
        
        page.screenshot(path="heungkuk_life_debug_after_search.png")
        
        # Check rows
        rows = page.locator("table tbody tr").all()
        print(f"[*] Rows found: {len(rows)}")
        if rows:
            print(f"[*] First row text: {rows[0].inner_text().strip()[:100]}")
            
        browser.close()

if __name__ == "__main__":
    debug_heungkuk_life()
