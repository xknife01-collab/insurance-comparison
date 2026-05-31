# -*- coding: utf-8 -*-
import os
import sys
import time
from playwright.sync_api import sync_playwright

def debug_hana_more():
    url = "https://www.hanainsure.co.kr/w/disclosure/product/saleProduct"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print(f"[*] Accessing {url}...")
        page.goto(url, wait_until="networkidle", timeout=60000)
        time.sleep(5)
        
        # Click 자동차보험
        print("[*] Clicking Cat 0 (자동차보험)...")
        page.click("#divStep01 a[data-ins_type='0']")
        time.sleep(3)
        page.screenshot(path="hana_debug_2_cat0.png")
        
        print(f"[*] divStep01_1 Text: {page.locator('#divStep01_1').inner_text().strip()}")
        
        # Click first subcat in Step 01_1 if any
        subcat = page.locator("#divStep01_1 a").first
        if subcat.count() > 0:
            print(f"[*] Clicking SubCat: {subcat.inner_text()}")
            subcat.click()
            time.sleep(3)
            page.screenshot(path="hana_debug_2_subcat.png")
            
            print(f"[*] divStep02 Text: {page.locator('#divStep02').inner_text().strip()}")
            
            # Click first prod in Step 02 if any
            prod = page.locator("#divStep02 a").first
            if prod.count() > 0:
                print(f"[*] Clicking Product: {prod.inner_text()}")
                prod.click()
                time.sleep(3)
                page.screenshot(path="hana_debug_3_prod.png")
                
                print(f"[*] divStep03 Text: {page.locator('#divStep03').inner_text().strip()}")
                
                # Click first period in Step 03
                period = page.locator("#divStep03 a").first
                if period.count() > 0:
                    print(f"[*] Clicking Period: {period.inner_text()}")
                    period.click()
                    time.sleep(3)
                    page.screenshot(path="hana_debug_4_step4.png")
                    
                    print(f"[*] divStep04 Text: {page.locator('#divStep04').inner_text().strip()}")
        
        browser.close()

if __name__ == "__main__":
    debug_hana_more()
