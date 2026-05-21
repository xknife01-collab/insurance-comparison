# -*- coding: utf-8 -*-
"""
한화손보 API 인터셉트 디버그
- 카테고리 1개, 상품 1개, 기간 1개만 클릭해서
- 실제 intercepted API URL과 응답 데이터 구조를 파악한다
"""
import json
import time
from playwright.sync_api import sync_playwright

def debug_api():
    all_responses = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled']
        )
        context = browser.new_context(
            viewport={'width': 1280, 'height': 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )
        page = context.new_page()
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

        # 모든 XHR/fetch 응답 인터셉트 (JSON 포함)
        def handle_response(response):
            url = response.url
            ct = response.headers.get("content-type", "")
            if "hwgeneralins.com" in url and ("json" in ct or "javascript" in ct or "text" in ct):
                try:
                    body = response.text()
                    if len(body) > 10:
                        all_responses[url] = body[:2000]
                        print(f"  [API] {url.split('hwgeneralins.com')[-1][:80]} ({len(body)}b)", flush=True)
                except:
                    pass

        page.on("response", handle_response)

        print("[*] 접속 중...", flush=True)
        page.goto("https://www.hwgeneralins.com/notice/ir/product-ing01.do", wait_until="domcontentloaded", timeout=60000)
        time.sleep(7)
        print(f"[*] 제목: {page.title()}", flush=True)
        print(f"[*] 초기 API 응답 수: {len(all_responses)}", flush=True)

        # 카테고리 1번 클릭
        cats = page.locator("#step01 dd a").all()
        print(f"\n[+] 카테고리 {len(cats)}개", flush=True)
        cat_names = [c.inner_text().strip() for c in cats]
        print(f"    목록: {cat_names[:5]}", flush=True)
        
        all_responses.clear()
        cats[0].click()
        time.sleep(3)
        print(f"[+] 카테고리 클릭 후 API 응답: {len(all_responses)}개", flush=True)
        for u, b in all_responses.items():
            print(f"  URL: {u}")
            print(f"  BODY: {b[:500]}")
            print()

        # 상품 1번 클릭
        prods = page.locator("#step02 a").all()
        p_names = [a.inner_text().strip() for a in prods]
        print(f"\n[+] 상품 {len(prods)}개: {p_names[:5]}", flush=True)
        
        all_responses.clear()
        if prods:
            prods[0].click()
            time.sleep(3)
            print(f"[+] 상품 클릭 후 API 응답: {len(all_responses)}개", flush=True)
            for u, b in all_responses.items():
                print(f"  URL: {u}")
                print(f"  BODY: {b[:500]}")
                print()

        # 기간 1번 클릭
        pers = page.locator("#step03 a").all()
        per_names = [a.inner_text().strip() for a in pers]
        print(f"\n[+] 기간 {len(pers)}개: {per_names[:3]}", flush=True)

        all_responses.clear()
        if pers:
            pers[0].click()
            time.sleep(4)  # step4 데이터 로드 대기
            print(f"[+] 기간 클릭 후 API 응답: {len(all_responses)}개", flush=True)
            for u, b in all_responses.items():
                print(f"  URL: {u}")
                print(f"  BODY: {b[:1000]}")
                print()

        # Step04 실제 렌더링된 HTML 확인
        step4 = page.locator("#step04")
        if step4.count() > 0:
            html = step4.inner_html()
            print(f"\n[+] #step04 HTML ({len(html)}bytes):")
            print(html[:2000])
        else:
            # 렌더링된 btn_sub1 버튼 확인
            btns = page.locator(".info_data1 a, a.btn_sub1").all()
            print(f"\n[+] 다운로드 버튼 {len(btns)}개:")
            for btn in btns:
                print(f"  text={btn.inner_text().strip()!r} href={btn.get_attribute('href')!r}")

        browser.close()
    
    # 결과 저장
    with open("hanwha_api_debug.json", "w", encoding="utf-8") as f:
        json.dump(all_responses, f, ensure_ascii=False, indent=2)
    print(f"\n[DONE] 결과 저장: hanwha_api_debug.json", flush=True)

if __name__ == "__main__":
    debug_api()
