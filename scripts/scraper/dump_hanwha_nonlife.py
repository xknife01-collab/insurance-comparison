# -*- coding: utf-8 -*-
from playwright.sync_api import sync_playwright

def dump_hanwha():
    url = "https://www.hwgeneralins.com/notice/ir/product-ing01.do"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle", timeout=60000)
        import time
        time.sleep(10)
        with open("hanwha_debug_dump.html", "w", encoding="utf-8") as f:
            f.write(page.content())
        page.screenshot(path="hanwha_debug.png")
        browser.close()

if __name__ == "__main__":
    dump_hanwha()
