# -*- coding: utf-8 -*-
"""
한화손보 API 직접 접근 분석
product-ing01-list.json에 어떤 파라미터가 필요한지 확인
"""
import json
import time
import requests
import urllib3
from playwright.sync_api import sync_playwright

urllib3.disable_warnings()

def analyze_direct():
    # Step 1: Playwright로 인터셉트 - URL 파라미터 포함해서 저장
    all_captured = []

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

        def handle_response(response):
            url = response.url
            if "product-ing01-list.json" in url:
                try:
                    body = response.text()
                    all_captured.append({"url": url, "body": body, "size": len(body)})
                    print(f"  [CAPTURED] {url} ({len(body)}b)", flush=True)
                except:
                    pass

        page.on("response", handle_response)

        print("[*] 접속...", flush=True)
        page.goto("https://www.hwgeneralins.com/notice/ir/product-ing01.do", wait_until="domcontentloaded", timeout=60000)
        time.sleep(8)

        cats = page.locator("#step01 dd a").all()
        print(f"[+] 카테고리 {len(cats)}개", flush=True)

        # 카테고리 0번 클릭
        cats[0].click()
        time.sleep(3)

        prods = page.locator("#step02 a").all()
        print(f"[+] 상품 {len(prods)}개", flush=True)
        prods[0].click()
        time.sleep(3)

        pers = page.locator("#step03 a").all()
        print(f"[+] 기간 {len(pers)}개", flush=True)
        pers[0].click()
        time.sleep(5)

        browser.close()

    # 분석
    print(f"\n[+] 총 캡처 수: {len(all_captured)}", flush=True)
    for i, item in enumerate(all_captured):
        print(f"\n{'='*60}")
        print(f"[{i}] URL: {item['url']}")
        print(f"     size: {item['size']}b")
        try:
            data = json.loads(item['body'])
            if isinstance(data, list):
                print(f"     리스트 {len(data)}개 항목")
                if data:
                    print(f"     키: {list(data[0].keys()) if isinstance(data[0], dict) else type(data[0])}")
                    # file 관련 키 찾기
                    if isinstance(data[0], dict):
                        for k, v in data[0].items():
                            if v and str(v) not in ['None', 'null', '']:
                                print(f"     {k}: {str(v)[:150]}")
            elif isinstance(data, dict):
                print(f"     dict 키: {list(data.keys())}")
                for k, v in data.items():
                    if isinstance(v, list):
                        print(f"     [{k}] {len(v)}개")
                        if v and isinstance(v[0], dict):
                            print(f"       첫항목 키: {list(v[0].keys())}")
                            for fk, fv in v[0].items():
                                if fv and str(fv) not in ['None', 'null', '']:
                                    print(f"       {fk}: {str(fv)[:150]}")
                    else:
                        print(f"     [{k}]: {str(v)[:200]}")
        except Exception as e:
            print(f"     파싱 실패: {e}")

    # 모두 저장
    with open("hanwha_all_captured.json", "w", encoding="utf-8") as f:
        json.dump(all_captured, f, ensure_ascii=False, indent=2)
    print(f"\n[DONE] hanwha_all_captured.json 저장 완료")

if __name__ == "__main__":
    analyze_direct()
