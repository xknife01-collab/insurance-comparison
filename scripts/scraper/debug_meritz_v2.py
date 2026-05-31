# -*- coding: utf-8 -*-
import os
import time
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

def debug_meritz():
    # 메인 페이지부터 접근하여 세션 유도
    base_urls = [
        "https://www.meritzfire.com", # 메인
        "https://www.meritzfire.com/customer/disclosure/insurance-product-disclosure.do" # 공시실
    ]
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone User Agent나 다른 일반 PC UA 사용
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={'width': 1920, 'height': 1080}
        )
        page = context.new_page()
        Stealth().apply_stealth_sync(page)

        print("[*] Accessing Meritz Main...")
        page.goto(base_urls[0], wait_until="networkidle")
        time.sleep(5)
        
        print("[*] Accessing Disclosure Page...")
        page.goto(base_urls[1], wait_until="networkidle")
        time.sleep(15)
        
        # 스크린샷 캡처
        page.screenshot(path="meritz_debug_v2.png")
        with open("meritz_debug_v2.html", "w", encoding="utf-8") as f:
            f.write(page.content())
            
        # 탭 클릭 시도
        try:
            print("[*] Clicking Longterm tab...")
            # '장기보장성' 텍스트가 있는 링크 찾기
            tab = page.locator("a:has-text('장기보험'), a:has-text('장기보장성')").first
            if tab.count() > 0:
                tab.click()
                time.sleep(5)
                page.screenshot(path="meritz_debug_v2_tab.png")
        except:
            pass
            
        browser.close()

if __name__ == "__main__":
    debug_meritz()
