# -*- coding: utf-8 -*-
"""
한화손보 Step4 영역 실제 버튼 구조 분석
카테고리 클릭 후 Step4 HTML 캡처
"""
import re
import time
from playwright.sync_api import sync_playwright

def debug_step4():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            args=['--disable-blink-features=AutomationControlled']
        )
        context = browser.new_context(
            viewport={'width': 1280, 'height': 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        page.goto("https://www.hwgeneralins.com/notice/ir/product-ing01.do", wait_until="domcontentloaded", timeout=60000)
        time.sleep(6)

        print(f"제목: {page.title()}")

        # 첫 번째 카테고리 클릭 (이미 선택된 상태일 수 있음)
        cats = page.locator("#step01 dd a").all()
        print(f"카테고리 {len(cats)}개")
        cats[0].click()
        time.sleep(3)

        # Step02 상품 클릭
        prods = page.locator("#step02 a").all()
        print(f"상품 {len(prods)}개: {[a.inner_text().strip() for a in prods[:5]]}")
        if prods:
            prods[0].click()
            time.sleep(2)

        # Step03 기간 클릭
        pers = page.locator("#step03 a").all()
        print(f"기간 {len(pers)}개: {[a.inner_text().strip() for a in pers[:5]]}")
        if pers:
            pers[0].click()
            time.sleep(2)

        # Step04 전체 HTML 캡처
        step4_el = page.locator("#step04")
        if step4_el.count() > 0:
            step4_html = step4_el.inner_html()
            print(f"\n=== #step04 HTML ({len(step4_html)} bytes) ===")
            print(step4_html[:3000])
        else:
            print("[-] #step04 not found")
            # 전체에서 btn_sub1 버튼 정보
            btns = page.locator("a.btn_sub1").all()
            print(f"\n=== 전체 btn_sub1 {len(btns)}개 ===")
            for btn in btns:
                print(f"  text={btn.inner_text().strip()!r} | class={btn.get_attribute('class')!r} | href={btn.get_attribute('href')!r} | onclick={btn.get_attribute('onclick')!r}")

        # Step4 템플릿 소스도 확인
        template = page.locator("#step04-template")
        if template.count() > 0:
            print(f"\n=== #step04-template ===")
            print(template.inner_html()[:2000])

        browser.close()

if __name__ == "__main__":
    debug_step4()
