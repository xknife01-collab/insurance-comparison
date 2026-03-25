import os
import json
from base_scraper import InsuranceScraper
from pdf_parser import InsurancePDFParser
from config import INSURANCE_COMPANIES, STORAGE_CONFIG

def run_pipeline():
    """
    1. 스크래핑 -> 2. PDF 파싱 -> 3. JSON 저장 과정 통합 실행
    """
    scraper = InsuranceScraper(headless=False) # 디버깅을 위해 브라우저 노출 모드
    parser = InsurancePDFParser()
    
    # 출력 경로 생성
    if not os.path.exists(STORAGE_CONFIG["OUTPUT_DIR"]):
        os.makedirs(STORAGE_CONFIG["OUTPUT_DIR"])

    for company_key, info in INSURANCE_COMPANIES.items():
        print(f"\n[>>>] Starting collection for: {info['name']}")
        
        # 1. 페이지 접속 및 파일 다운로드 시도 (구현 예시)
        raw_content = scraper.scrape_url(info["disclosure_url"])
        
        if not raw_content:
            print(f"[-] Failed to scrape {info['name']}")
            continue
            
        # 2. 다운로드된 PDF 리스트를 가져와 파싱 (현 단계에서는 시뮬레이션 샘플 파일 활용 권장)
        # 실제 환경에서는 scraper가 다운로드 완료 후 파일명을 반환하도록 확장 필요
        downloaded_files = [f for f in os.listdir(STORAGE_CONFIG["DOWNLOAD_DIR"]) if f.endswith(".pdf")]
        
        for pdf_file in downloaded_files:
            pdf_path = os.path.join(STORAGE_CONFIG["DOWNLOAD_DIR"], pdf_file)
            
            # 파싱 수행
            try:
                raw_table_text = parser.extract_table_data(pdf_path)
                json_result = parser.convert_to_json(raw_table_text)
                
                # 결과물 저장
                output_filename = f"{company_key}_{pdf_file.replace('.pdf', '')}.json"
                output_path = os.path.join(STORAGE_CONFIG["OUTPUT_DIR"], output_filename)
                
                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(json_result)
                    
                print(f"[+] Saved structured data to: {output_path}")
                
                # 중복 파싱 방지를 위해 파일 이동/삭제 (선택 사항)
                # os.rename(pdf_path, os.path.join(STORAGE_CONFIG["DOWNLOAD_DIR"], "processed", pdf_file))
                
            except Exception as e:
                print(f"[-] Error parsing {pdf_file}: {e}")

if __name__ == "__main__":
    run_pipeline()
    print("\n[✔] Scraper & Parser Pipeline finished.")
