# -*- coding: utf-8 -*-
import os
import time
from playwright.sync_api import sync_playwright
from playwright_stealth import Stealth
from pdf_parser import InsurancePDFParser
from dotenv import load_dotenv

# .env 로드
load_dotenv()

def scrape_samsung_fire():
    """
    속성(ID, Title) 기반으로 삼성화재 보험 요율표(사업방법서)를 수집합니다.
    """
    download_dir = os.path.join(os.getcwd(), "downloads")
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    print("[*] Starting Attribute-Based Samsung Fire Scraper...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()
        Stealth().apply_stealth_sync(page)

        # 1. 삼성화재 상품공시 전용 페이지 접속
        url = "https://www.samsungfire.com/vh/page/VH.HPIF0103.do"
        print(f"[*] Accessing: {url}")
        page.goto(url, wait_until="networkidle")
        time.sleep(5)

        try:
            # Step 1: 상품 카테고리 선택 (Title 속성 활용)
            print("[*] Selecting Category: Long-term (Title='장기')")
            page.locator("a[title='\uc7a5\uae30']").click()
            time.sleep(2)

            # 세부 카테고리 '건강' 클릭 (질병 상품이 포함된 카테고리)
            print("[*] Selecting Sub-category: Health (Title='건강')")
            page.locator("a[title='\uac74\uac15']").click() 
            time.sleep(2)

            # Step 2: 상품 목록에서 첫 번째 상품 클릭
            print("[*] Selecting the first product from list...")
            page.locator("ul#product_list li a").first.click()
            time.sleep(2)

            # Step 3: 첫 번째 판매 기간 클릭
            print("[*] Selecting the latest sales period...")
            page.locator("ul#date_list li a").first.click()
            time.sleep(3)

            # 2. 사업방법서 다운로드 (Title 속성에 '사업방법서'가 포함된 버튼)
            print("[*] Downloading Business Manual (사업방법서)...")
            # Selector: button[title*='사업방법서']
            download_btn = page.locator("button[title*='\uc0ac\uc5c5\ubc29\ubc95\uc11c']").first
            
            if download_btn.count() == 0:
                # 보조 수단: ID로 직접 접근
                download_btn = page.locator("#pdfCnt_0")

            with page.expect_download() as download_info:
                download_btn.click()
            
            download = download_info.value
            path = os.path.join(download_dir, "samsung_fire_business.pdf")
            download.save_as(path)
            print(f"[+] Downloaded: {path}")

            # 3. Gemini AI 분석 가동
            print("[*] Starting AI analysis with Gemini...")
            parser = InsurancePDFParser(api_key=os.environ.get("GOOGLE_API_KEY"))
            raw_table_text = parser.extract_table_data(path)
            structured_json = parser.convert_to_json(raw_table_text)
            
            print("\n[OK] AI Parsing Result (JSON):")
            print(structured_json)
            
            with open("samsung_fire_rate.json", "w", encoding="utf-8") as f:
                f.write(structured_json)
                
        except Exception as e:
            print(f"[-] Error: {e}")
            page.screenshot(path="error_capture.png")
            print("[!] Screenshot saved as error_capture.png")
        finally:
            browser.close()

if __name__ == "__main__":
    scrape_samsung_fire()
