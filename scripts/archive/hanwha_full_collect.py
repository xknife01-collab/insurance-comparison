# -*- coding: utf-8 -*-
"""
한화손보 모든 카테고리/상품의 현재 판매 중 파일 URL 수집
headless+dialog 처리 포함
"""
import json
import time
from playwright.sync_api import sync_playwright

def collect_all():
    all_items = []

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
        
        # dialog 자동 처리
        page.on("dialog", lambda d: d.dismiss())

        def handle_response(response):
            url = response.url
            if "product-ing01-list.json" in url:
                try:
                    body = response.text()
                    data = json.loads(body)
                    lst = data.get('list', []) if isinstance(data, dict) else []
                    for row in lst:
                        if isinstance(row, dict) and (row.get('file1') or row.get('file2') or row.get('file3')):
                            all_items.append(row)
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
            cat_name = cat_names[i]
            page.locator("#step01 dd a").nth(i).click()
            time.sleep(2)

            prods = page.locator("#step02 a").all()
            prod_names = [a.inner_text().strip() for a in prods]
            
            for j in range(len(prod_names)):
                page.locator("#step02 a").nth(j).click()
                time.sleep(2)

                # 현재 기간만 (기간 0 = 가장 최신)
                pers = page.locator("#step03 a").all()
                if pers:
                    pers[0].click()
                    time.sleep(3)

            print(f"  [{i+1}/{len(cat_names)}] {cat_name}: 상품 {len(prod_names)}개 처리", flush=True)

        browser.close()

    # 중복 제거
    seen = set()
    unique = []
    for row in all_items:
        key = (row.get('goodsCode', ''), row.get('goodsName', ''), row.get('path', ''))
        if key not in seen:
            seen.add(key)
            unique.append(row)

    print(f"\n[+] 총 {len(unique)}개 고유 항목 수집", flush=True)
    
    # 현재 판매 중인 것만
    active = [r for r in unique if r.get('isActive') == 1]
    print(f"[+] 현재 판매 중: {len(active)}개", flush=True)
    
    for row in active:
        name = row.get('goodsName', '')
        grp = row.get('goodsGrp', '')
        path = row.get('path', '')
        f1 = row.get('file1', '')
        f2 = row.get('file2', '')
        f3 = row.get('file3', '')
        print(f"\n  {grp} / {name}", flush=True)
        print(f"  기간: {path}", flush=True)
        if f1: print(f"  약관(file1): {f1}", flush=True)
        if f2: print(f"  사업방법서(file2): {f2}", flush=True)
        if f3: print(f"  안내서(file3): {f3}", flush=True)

    with open("hanwha_all_active_products.json", "w", encoding="utf-8") as f:
        json.dump(active, f, ensure_ascii=False, indent=2)
    print(f"\n[DONE] hanwha_all_active_products.json", flush=True)

if __name__ == "__main__":
    collect_all()
