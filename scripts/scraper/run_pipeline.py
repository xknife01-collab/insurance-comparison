import os
import json
import subprocess
import glob
from config import STORAGE_CONFIG

def run_scraper(script_name):
    """
    개별 스크래퍼 스크립트를 실행합니다.
    """
    print(f"\n[>>>] Running Scraper: {script_name}")
    try:
        # py -3 명령어를 사용하여 실행
        result = subprocess.run(["py", "-3", script_name], check=True, capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"[-] Error running {script_name}: {e.stderr}")
        return False

def run_pipeline():
    """
    이미 구현된 개별 스크래퍼들을 순차적으로 실행하고 결과를 통합 관리합니다.
    """
    scrapers = [
        "samsung_fire_all.py",
        "hyundai_marine_all.py",
        "kb_insurance_all.py",
        "db_insurance_all.py",
        "meritz_fire_all.py",
        "shinhan_life_all.py",
        "hanwha_life_all.py",
        "hanwha_nonlife_all.py",
        "heungkuk_fire_all.py",
        "heungkuk_life_all.py",
        "hana_nonlife_all.py",
        "lina_life_all.py"
    ]
    
    # 1. 모든 스크래퍼 실행
    for s in scrapers:
        if os.path.exists(s):
            run_scraper(s)
        else:
            print(f"[-] Scraper script not found: {s}")

    print("\n[✔] All scrapers finished execution.")
    
    # 2. PDF 파싱 및 DB 적재 단계 (추후 구현)
    print("\n[*] Checking downloaded PDFs:")
    companies = [
        "samsung_fire", "hyundai_marine", "kb_insurance", "db_insurance", "meritz_fire",
        "shinhan_life", "hanwha_life", "hanwha_nonlife", "heungkuk_fire", "heungkuk_life", "hana_nonlife", "lina_life"
    ]
    for company in companies:
        path = os.path.join(STORAGE_CONFIG["DOWNLOAD_DIR"], company)
        if os.path.exists(path):
            files = glob.glob(os.path.join(path, "*.pdf"))
            print(f"  - {company}: {len(files)} files found.")

if __name__ == "__main__":
    # 실행 전 필요한 폴더 생성
    if not os.path.exists(STORAGE_CONFIG["DOWNLOAD_DIR"]):
        os.makedirs(STORAGE_CONFIG["DOWNLOAD_DIR"])
        
    run_pipeline()

