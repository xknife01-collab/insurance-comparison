# -*- coding: utf-8 -*-
"""
한화손보 공시실에서 '보험료 및 해약환급금표' 또는 '요율표' 직접 탐색
- 페이지 JS 분석 및 API 엔드포인트 직접 탐색
"""
import json
import time
from playwright.sync_api import sync_playwright

def find_rate_table():
    network_log = []

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,  # 시각적으로 확인
            args=['--disable-blink-features=AutomationControlled']
        )
        context = browser.new_context(
            viewport={'width': 1280, 'height': 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )
        page = context.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        def handle_response(response):
            url = response.url
            if "hwgeneralins.com" in url and (".pdf" in url.lower() or ".json" in url.lower() or "list" in url.lower()):
                network_log.append({"url": url, "status": response.status})
                print(f"  [NET] {response.status} {url[-80:]}", flush=True)

        page.on("response", handle_response)

        print("[*] 접속...", flush=True)
        page.goto("https://www.hwgeneralins.com/notice/ir/product-ing01.do", wait_until="domcontentloaded", timeout=60000)
        time.sleep(7)

        # 카테고리 -> 상품 -> 기간 선택
        cats = page.locator("#step01 dd a").all()
        cats[0].click()
        time.sleep(2)
        
        prods = page.locator("#step02 a").all()
        print(f"상품 이름들: {[a.inner_text().strip() for a in prods]}", flush=True)
        prods[0].click()
        time.sleep(2)

        pers = page.locator("#step03 a").all()
        pers[0].click()
        time.sleep(4)

        # 현재 페이지의 모든 버튼/링크 확인
        print("\n=== 모든 a 태그 ===", flush=True)
        links = page.locator("a").all()
        for a in links:
            href = a.get_attribute("href") or ""
            text = a.inner_text().strip()
            title = a.get_attribute("title") or ""
            cls = a.get_attribute("class") or ""
            if href and (href != "#" and href != "javascript:void(0)" and href != "javascript:;"):
                print(f"  [{cls}] {text!r} | {title!r} | {href[:100]}", flush=True)

        # step04 또는 info_data1 내 다운로드 버튼 확인
        print("\n=== .info_data1 내 링크 ===", flush=True)
        try:
            dl = page.locator(".info_data1 a, .btn_sub1").all()
            for a in dl:
                href = a.get_attribute("href") or ""
                text = a.inner_text().strip()
                title = a.get_attribute("title") or ""
                print(f"  {text!r} | {title!r} | {href[:100]}", flush=True)
        except:
            pass

        # step04 렌더링 HTML 확인
        for sel in ["#step04 .con", "#step04", ".box_step4", ".step04_area"]:
            el = page.locator(sel)
            if el.count() > 0:
                html = el.inner_html()
                print(f"\n=== {sel} ({len(html)}b) ===", flush=True)
                print(html[:2000], flush=True)
                break

        # 전체 HTML에서 '보험료' 부분 찾기
        full_html = page.content()
        idx = full_html.find("보험료")
        while idx >= 0 and idx < len(full_html):
            snippet = full_html[max(0,idx-50):idx+200]
            if "href" in snippet or "file" in snippet.lower():
                print(f"\n[보험료 주변]: {snippet}", flush=True)
            idx = full_html.find("보험료", idx+1)
            if idx > 500000:
                break

        # 스크린샷
        page.screenshot(path="hanwha_step4_screenshot.png")
        print("\n[*] 스크린샷: hanwha_step4_screenshot.png", flush=True)

        print("\n[*] 5초 대기 (직접 확인)", flush=True)
        time.sleep(5)
        browser.close()

    print(f"\n[DONE] 네트워크 로그 {len(network_log)}개")

if __name__ == "__main__":
    find_rate_table()
