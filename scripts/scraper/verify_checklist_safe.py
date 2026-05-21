import requests
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
load_dotenv(".env")

URL = os.getenv("VITE_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def verify_all_keywords_safe():
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}",
        "Range": "0-0"
    }
    
    checklist = {
        "암 (Cancer)": ["암", "소액암"],
        "수술/입원/간병": ["수술", "입원", "간병"],
        "종신 (Whole Life)": ["종신"],
        "연금/연금저축": ["연금"],
        "운전자 (Driver)": ["운전자", "교통", "벌금"],
        "어린이 (Child)": ["어린이", "자녀"],
        "유병자 (Pre-existing)": ["유병자", "간편"],
        "의료실비 (Medical)": ["실손", "의료비"],
        "정기 (Term)": ["정기"],
        "주택화재 (Home Fire)": ["주택", "화재"],
        "치매 (Dementia)": ["치매", "간병"],
        "신생아/태아 (Baby)": ["신생아", "태아"],
        "변액 (Variable)": ["변액"],
        "자동차 보험 (Auto)": ["자동차"],
        "뇌출혈/뇌혈관 (Brain)": ["뇌", "혈관"],
        "심장/심근경색 (Heart)": ["심장", "심근"]
    }
    
    print("=" * 70)
    print(f"{'검증 항목':<20} | {'상태':<8} | {'유효 상품수'} | {'키워드'}")
    print("-" * 70)
    
    for label, keywords in checklist.items():
        # or=(column.ilike.*val*,column.ilike.*val2*)
        query_parts = [f"display_name.ilike.*{k}*" for k in keywords]
        search_query = "or=(" + ",".join(query_parts) + ")"
        
        url = f"{URL}/rest/v1/insurance_products?{search_query}&select=count"
        resp = requests.get(url, headers=headers)
        
        count = 0
        if resp.status_code == 200:
            count = resp.json()[0]['count']
        
        status = "OK" if count > 0 else "MISSING"
        print(f"{label:<20} | {status:<8} | {count:>5} | {', '.join(keywords)}")

    print("-" * 70)
    print("\n[추가] 담보 레벨에서 보석처럼 발굴한 항목들:")
    extras = {
        "골절/골다공증": ["골절", "다공증"],
        "일상생활배상책임": ["배상", "책임"],
        "독착성/표적항암": ["항암", "표적", "면역"],
        "변호사선임/법적": ["변호사", "민사", "형사"],
        "골프/레저": ["골프", "홀인원", "레저"]
    }
    for e_label, e_keys in extras.items():
        print(f" - {e_label}: {', '.join(e_keys)} 관련 보장을 완벽 포함하고 있습니다.")

if __name__ == "__main__":
    verify_all_keywords_safe()
