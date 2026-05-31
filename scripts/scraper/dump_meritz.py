# -*- coding: utf-8 -*-
from playwright.sync_api import sync_playwright

def dump_meritz():
    url = "https://www.meritzfire.com/customer/disclosure/insurance-product-disclosure.do#!/LongtermInsuranceDisclosure"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print(f"[*] Navigating to {url}")
        page.goto(url, wait_until="networkidle", timeout=60000)
        import time
        time.sleep(15)
        with open("meritz_debug_dump.html", "w", encoding="utf-8") as f:
            f.write(page.content())
        page.screenshot(path="meritz_debug.png")
        browser.close()

if __name__ == "__main__":
    dump_meritz()
