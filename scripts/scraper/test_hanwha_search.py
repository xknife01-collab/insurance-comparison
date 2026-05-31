# -*- coding: utf-8 -*-
from playwright.sync_api import sync_playwright

def test_hanwha_search():
    url = "https://www.hwgeneralins.com/notice/ir/product-ing01.do"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle")
        import time
        time.sleep(5)
        
        print("[*] Clicking Search with empty input...")
        # 검색 버튼
        search_btn = page.locator(".btn_search, button:has-text('검색')").first
        search_btn.click(force=True)
        time.sleep(5)
        
        print(f"[*] Post-search Step1 count: {page.locator('#uiFormField1 a').count()}")
        print(f"[*] Post-search Results table count: {page.locator('table tr').count()}")
        
        page.screenshot(path="hanwha_search_result.png")
        browser.close()

if __name__ == "__main__":
    test_hanwha_search()
