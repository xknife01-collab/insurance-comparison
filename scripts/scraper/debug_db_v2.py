# -*- coding: utf-8 -*-
import os
import time
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth

def debug_db_v2():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        Stealth().apply_stealth_sync(page)

        print("[*] Navigating to DB v2 URL...")
        # 사용자 제공 URL: https://www.idbins.com/FWMAIV1534.do
        page.goto("https://www.idbins.com/FWMAIV1534.do", wait_until="networkidle")
        time.sleep(15)

        with open("db_v2_dump.html", "w", encoding="utf-8") as f:
            f.write(page.content())
        print("[*] Saved v2 dump.")

        # 링크 확인 (PDF, 조회 등)
        links = page.locator("a, button").all()
        found = False
        for l in links:
            try:
                t = l.inner_text().strip()
                if not t: t = l.get_attribute("title") or ""
                if "조회" in t or "검색" in t or "상품" in t:
                    print(f"  [BTN] '{t}' ID: {l.get_attribute('id')}")
                    found = True
            except: pass
        
        if not found:
            print("[-] No matching buttons found. Checking iframes...")
            iframes = page.frames
            print(f"[*] Frames: {len(iframes)}")
            for f in iframes:
                print(f"  Frame URL: {f.url}")

        browser.close()

if __name__ == "__main__":
    debug_db_v2()
