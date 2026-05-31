# -*- coding: utf-8 -*-
import os
import sys
import time
from playwright.sync_api import sync_playwright

def dump_html():
    url = "https://www.hanainsure.co.kr/w/disclosure/product/saleProduct"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print(f"[*] Accessing {url}...")
        try:
            page.goto(url, wait_until="networkidle", timeout=60000)
            time.sleep(5)
            # Take a screenshot to see the state
            page.screenshot(path="hana_debug_dump.png")
            html = page.content()
            with open("hana_debug_dump.html", "w", encoding="utf-8") as f:
                f.write(html)
            print("[+] HTML dumped to hana_debug_dump.html")
            print("[+] Screenshot saved to hana_debug_dump.png")
        except Exception as e:
            print(f"[-] Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    dump_html()
