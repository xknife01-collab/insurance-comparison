# -*- coding: utf-8 -*-
"""
한화손보 모든 카테고리/상품/기간 조합에서 파일 URL 수집
- 가장 큰 file들을 골라서 실제 요율표가 있는지 확인
"""
import json
import time
from playwright.sync_api import sync_playwright

def collect_all_files():
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
                    data = json.loads(body)
                    lst = data.get('list', []) if isinstance(data, dict) else data
                    all_captured.extend(lst)
                except:
                    pass

        page.on("response", handle_response)

        print("[*] 접속...", flush=True)
        page.goto("https://www.hwgeneralins.com/notice/ir/product-ing01.do", wait_until="domcontentloaded", timeout=60000)
        time.sleep(8)

        cats = page.locator("#step01 dd a").all()
        cat_names = [c.inner_text().strip() for c in cats]
        print(f"[+] 카테고리 {len(cat_names)}개: {cat_names}", flush=True)

        # 모든 카테고리 순회
        for i in range(len(cat_names)):
            cat = page.locator("#step01 dd a").nth(i)
            cat_name = cat.inner_text().strip()
            cat.click()
            time.sleep(2)

            prods = page.locator("#step02 a").all()
            prod_names = [a.inner_text().strip() for a in prods]
            print(f"\n[카테고리 {i+1}/{len(cat_names)}] {cat_name}: 상품 {len(prod_names)}개", flush=True)

            for j in range(len(prod_names)):
                prod = page.locator("#step02 a").nth(j)
                prod_name = prod.inner_text().strip()
                prod.click()
                time.sleep(2)

                pers = page.locator("#step03 a").all()
                # 현재 기간(isActive=1)만 클릭
                per = pers[0] if pers else None
                if per:
                    per.click()
                    time.sleep(3)

                print(f"  상품: {prod_name} | 기간 {len(pers)}개", flush=True)

        browser.close()

    # 중복 제거 및 파일 정보 추출
    seen = set()
    unique_items = []
    for row in all_captured:
        if isinstance(row, dict):
            key = (row.get('goodsCode', ''), row.get('goodsName', ''), row.get('path', ''))
            if key not in seen:
                seen.add(key)
                unique_items.append(row)

    print(f"\n[+] 총 {len(unique_items)}개 고유 항목")
    
    # 현재 판매 중인 항목만 필터링 (isActive=1)
    active = [r for r in unique_items if r.get('isActive') == 1]
    print(f"[+] 현재 판매 중: {len(active)}개")
    
    for row in active:
        name = row.get('goodsName', '')
        grp = row.get('goodsGrp', '')
        path = row.get('path', '')
        f1 = row.get('file1', '')
        f2 = row.get('file2', '')
        f3 = row.get('file3', '')
        print(f"\n  {grp} / {name}")
        print(f"  기간: {path}")
        if f1: print(f"  file1: {f1}")
        if f2: print(f"  file2: {f2}")
        if f3: print(f"  file3: {f3}")

    with open("hanwha_all_products.json", "w", encoding="utf-8") as f:
        json.dump(unique_items, f, ensure_ascii=False, indent=2)
    print(f"\n[DONE] 저장: hanwha_all_products.json ({len(unique_items)}개)")

if __name__ == "__main__":
    collect_all_files()
