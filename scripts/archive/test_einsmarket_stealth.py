# -*- coding: utf-8 -*-
import asyncio
from playwright.async_api import async_playwright
from playwright_stealth import stealth

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        # Use simple stealth() for sync/async if available, or just ignore for now if error.
        try:
            await stealth(page)
        except:
            pass
        
        print("[*] Accessing e-insmarket with Stealth...")
        try:
            # Go directly to Cancer Insurance page
            await page.goto("https://e-insmarket.or.kr/cancerIns/cancerInsList.knia", wait_until="load", timeout=60000)
            await page.wait_for_timeout(5000)
            
            # Take screenshot to verify if it's blocked or not
            await page.screenshot(path="e_insmarket_check.png")
            print("[+] Screenshot saved: e_insmarket_check.png")
            
            content = await page.content()
            if "차단" in content or "Mbuster" in content or "security" in content.lower():
                print("[-] Browser Blocked by Mbuster.")
            else:
                print("[!] Access maybe successful!")
                # Get all table data
                rows = await page.query_selector_all("table tbody tr")
                print(f"[!] Found {len(rows)} table rows.")
                if len(rows) > 0:
                    first_row = await rows[0].inner_text()
                    print(f"    Sample Row: {first_row.strip()[:100]}")
        except Exception as e:
            print(f"[-] Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
