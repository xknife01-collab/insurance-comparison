# -*- coding: utf-8 -*-
from playwright.sync_api import sync_playwright

def dump_hanwha():
    url = "https://www.hwgeneralins.com/notice/ir/product-ing01.do"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        page.on("console", lambda msg: print(f"[CONSOLE] {msg.text}"))
        page.on("pageerror", lambda err: print(f"[ERR] {err}"))
        
        print(f"[*] Navigating to {url}")
        page.goto(url, wait_until="load", timeout=60000)
        import time
        for i in range(15):
            print(f"[*] Sleeping {i+1}s... Step1 count: {page.locator('#uiFormField1 a').count()}")
            time.sleep(1)
        
        with open("hanwha_debug_dump_v2.html", "w", encoding="utf-8") as f:
            f.write(page.content())
        page.screenshot(path="hanwha_debug_v2.png")
        browser.close()

if __name__ == "__main__":
    dump_hanwha()
