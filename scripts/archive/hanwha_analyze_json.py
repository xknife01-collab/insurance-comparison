# -*- coding: utf-8 -*-
"""
한화손보 product-ing01-list.json 분석
- 기간 클릭 후 반환되는 JSON의 실제 구조와 파일 URL 확인
"""
import json
import time
import requests
import urllib3
from playwright.sync_api import sync_playwright

urllib3.disable_warnings()

def analyze_list_json():
    captured = {}  # key: url, val: body text

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
                    captured[url] = body
                    print(f"  [CAPTURED] {url} ({len(body)}b)", flush=True)
                except:
                    pass

        page.on("response", handle_response)

        print("[*] 접속...", flush=True)
        page.goto("https://www.hwgeneralins.com/notice/ir/product-ing01.do", wait_until="domcontentloaded", timeout=60000)
        time.sleep(7)

        # 카테고리 -> 상품 -> 기간 순으로 몇 가지 조합 테스트
        cats = page.locator("#step01 dd a").all()
        cat_names = [c.inner_text().strip() for c in cats]
        print(f"[+] 카테고리 {len(cat_names)}개: {cat_names}", flush=True)

        # 첫 번째 카테고리 클릭
        cats[0].click()
        time.sleep(2)

        prods = page.locator("#step02 a").all()
        p_names = [a.inner_text().strip() for a in prods]
        print(f"[+] 상품 {len(p_names)}개: {p_names}", flush=True)

        # 첫 번째 상품 클릭
        prods[0].click()
        time.sleep(2)

        pers = page.locator("#step03 a").all()
        per_names = [a.inner_text().strip() for a in pers]
        print(f"[+] 기간 {len(per_names)}개: {per_names[:5]}", flush=True)

        # 첫 번째 기간 클릭 (가장 최신)
        captured.clear()
        pers[0].click()
        time.sleep(4)

        print(f"\n[+] 기간 클릭 후 캡처된 JSON: {len(captured)}개", flush=True)
        for url, body in captured.items():
            print(f"\n  URL: {url}")
            try:
                data = json.loads(body)
                print(f"  타입: {type(data)}")
                if isinstance(data, list):
                    print(f"  항목 수: {len(data)}")
                    if data:
                        print(f"  첫 번째 항목 키: {list(data[0].keys())}")
                        print(f"  첫 번째 항목 전체:")
                        print(json.dumps(data[0], ensure_ascii=False, indent=2)[:1000])
                elif isinstance(data, dict):
                    print(f"  키: {list(data.keys())}")
                    for k, v in data.items():
                        if isinstance(v, list) and v:
                            print(f"  [{k}] ({len(v)}개) 첫 항목: {json.dumps(v[0], ensure_ascii=False)[:500]}")
                        else:
                            print(f"  [{k}]: {str(v)[:200]}")
            except json.JSONDecodeError as e:
                print(f"  JSON 파싱 실패: {e}")
                print(f"  내용(앞 500): {body[:500]}")

        # 전체 JSON 저장
        with open("hanwha_list_analysis.json", "w", encoding="utf-8") as f:
            json.dump(captured, f, ensure_ascii=False, indent=2)

        browser.close()

    print(f"\n[DONE] 저장 완료: hanwha_list_analysis.json", flush=True)

if __name__ == "__main__":
    analyze_list_json()
