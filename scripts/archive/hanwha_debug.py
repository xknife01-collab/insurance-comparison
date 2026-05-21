# -*- coding: utf-8 -*-
"""
한화손보 페이지 실제 DOM 구조 확인용 디버그 스크립트
"""
import time
from playwright.sync_api import sync_playwright

def debug_hanwha():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled']
        )
        context = browser.new_context(
            viewport={'width': 1280, 'height': 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        print("[*] 접속 중...")
        page.goto("https://www.hwgeneralins.com/notice/ir/product-ing01.do", wait_until="domcontentloaded", timeout=60000)
        print(f"[*] 초기 title: {page.title()}")
        time.sleep(8)  # 보안 스크립트 대기
        
        print(f"[*] 8초 후 title: {page.title()}")
        
        # 주요 셀렉터 확인
        selectors = [
            ".list_step01", ".list_step02", "#searchForm",
            "form", ".search_area", ".step01", ".step_area",
            "[class*='step']", "[id*='step']", "#step01",
            ".notice_cont", ".product", "table"
        ]
        
        for sel in selectors:
            count = page.locator(sel).count()
            if count > 0:
                print(f"  [FOUND] {sel}: {count}개")
        
        # 전체 HTML 일부 저장
        html = page.content()
        with open("hanwha_debug.html", "w", encoding="utf-8") as f:
            f.write(html)
        print(f"\n[*] HTML 저장 완료 (hanwha_debug.html, {len(html)} bytes)")
        print(f"[*] URL after load: {page.url}")
        
        browser.close()

if __name__ == "__main__":
    debug_hanwha()
