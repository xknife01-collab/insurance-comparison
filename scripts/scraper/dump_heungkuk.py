# -*- coding: utf-8 -*-
from playwright.sync_api import sync_playwright

def dump_heungkuk():
    url = "https://www.heungkuklife.co.kr/front/public/saleProduct.do?searchFlgSale=Y"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="networkidle", timeout=60000)
        import time
        time.sleep(10)
        with open("heungkuk_debug_dump.html", "w", encoding="utf-8") as f:
            f.write(page.content())
        browser.close()

if __name__ == "__main__":
    dump_heungkuk()
