from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync
import os
import time

class InsuranceScraper:
    def __init__(self, headless=False):
        self.headless = headless
        self.download_path = os.path.join(os.getcwd(), "downloads")
        if not os.path.exists(self.download_path):
            os.makedirs(self.download_path)

    def scrape_url(self, url):
        """
        보험사 공시실 URL에 접속하여 페이지 소스 및 스크린샷 캡처
        모든 보안 탐지를 피하기 위해 playwright-stealth 사용
        """
        with sync_playwright() as p:
            # 브라우저 실행 (보안 요소가 많은 경우 가급적 유인 모드로 디버깅 권장)
            browser = p.chromium.launch(headless=self.headless)
            
            # 컨텍스트 설정 (다운로드 허용 및 User-Agent 설정 포함)
            context = browser.new_context(
                accept_downloads=True,
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            )
            
            page = context.new_page()

            # Stealth 모드 적용 (봇 탐지 우회 핵심)
            stealth_sync(page)

            print(f"[*] Accessing: {url}")
            page.goto(url, wait_until="networkidle")

            # 보험사 공시실 특유의 '보안 모듈 설치' 팝업이나 지연 시간 대응
            time.sleep(3)

            # 페이지 내 모든 버튼/링크 중 '보험료 요율표' 혹은 '사업방법서' 텍스트를 포함하는 요소 대기
            # (보험사마다 다르므로 공통 로직만 우선 포함)
            try:
                # 예시: 특정 키워드가 포함된 버튼 클릭
                # target_button = page.get_by_text("요율표", exact=False)
                # if target_button.count() > 0:
                #     target_button.first.click()
                
                print("[+] Successfully loaded the page.")
                
                # 결과물 확인용 스크린샷
                page.screenshot(path=os.path.join(self.download_path, "capture.png"))
                
                return page.content()
            except Exception as e:
                print(f"[-] Error during scraping: {e}")
                return None
            finally:
                browser.close()

if __name__ == "__main__":
    # 테스트용: 삼성화재 혹은 현대해상 공시실 URL 예시
    scraper = InsuranceScraper(headless=True)
    # 실제 구현 시 보험사 리스트에서 URL을 가져옵니다.
    # scraper.scrape_url("https://www.samsungfire.com/common/m_p_common_0602.html")
    print("Scraper engine initialized.")
