# 보험사별 공시실 타켓 정보 설정 (예시 데이터)
INSURANCE_COMPANIES = {
    "SAMSUNG_FIRE": {
        "name": "삼성화재",
        "disclosure_url": "https://www.samsungfire.com/common/m_p_common_0602.html",
        "keywords": ["요율표", "사업방법서"]
    },
    "HYUNDAI_MARINE": {
        "name": "현대해상",
        "disclosure_url": "https://www.hi.co.kr/service.do?m=6600000000",
        "keywords": ["요율표", "사업방법서"]
    },
    "DB_INSURANCE": {
        "name": "DB손해보험",
        "disclosure_url": "https://www.idbim.com/FWDI4010.do",
        "keywords": ["요율표", "사업방법서"]
    },
    "MERITZ_FIRE": {
        "name": "메리츠화재",
        "disclosure_url": "https://www.meritzfire.com/disclosure/product-disclosure-standard.do",
        "keywords": ["요율표", "사업방법서"]
    }
}

# 파싱 결과물 저장 경로
STORAGE_CONFIG = {
    "DOWNLOAD_DIR": "downloads",
    "OUTPUT_DIR": "parsed_results"
}
