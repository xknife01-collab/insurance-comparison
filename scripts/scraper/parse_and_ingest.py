# -*- coding: utf-8 -*-
import os
import re
import json
import pdfplumber
from supabase import create_client, Client
from dotenv import load_dotenv

# 1. .env.local 로드
load_dotenv(os.path.join(os.getcwd(), "../../.env.local"))

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def get_supabase():
    return create_client(SUPABASE_URL, SUPABASE_KEY)

# 🚀 16가지 카테고리 판별 키워드 대폭 확장 (심장, 변액 등 누락 방지)
CATEGORY_KEYWORDS = {
    "cancer": ["암보험", "암진단", "소액암", "고액암", "표적", "항암"],
    "surgery": ["수술비", "입원비", "첫날부터", "응급실", "조혈모세포", "질병수술"],
    "life": ["종신", "사망보험", "평생보장", "무배당종합"],
    "baby": ["신생아", "태아", "출산", "임신", "선천"],
    "child": ["어린이", "자녀", "꿈나무", "키즈", "주니어"],
    "pre-existing": ["유병자", "간편심사", "325", "335", "355", "누구나가입"],
    "medical": ["의료실비", "실손", "실비", "도수치료", "비급여"],
    "term": ["정기보험", "경과기간", "기간한정", "연만기"],
    "pension": ["연금", "노후생활", "저축", "노후자금"],
    "driver": ["운전자", "법률비용", "교통사고", "민사", "피해자"],
    "home": ["주택화재", "화재보험", "일상생활배상", "급배수"],
    "dementia": ["치매", "간병", "LTC", "재가급여", "시설급여", "욕구"],
    "variable": ["변액", "펀드", "변액연금", "변액유니버셜", "전환보험"],
    "auto": ["자동차보험", "대인배상", "대물배상", "자손", "자차"],
    "brain": ["뇌출혈", "뇌혈관", "뇌경색", "중풍", "뇌졸중"],
    "heart": ["심장", "심근경색", "허혈성", "협심증", "순환기", "심장질환"]
}

def categorize_product(text_sample, file_name):
    combined = (text_sample + file_name).lower()
    for cat_id, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in combined for kw in keywords):
            return cat_id
    return "unknown"

def run_ingestion():
    print("[*] RE-ANALYSIS: Refining Ingestion (Advanced Keywords Mode)...")
    try:
        supabase: Client = get_supabase()
    except Exception as e:
        print(f"[-] Supabase Error: {e}")
        return

    download_root = os.path.join(os.getcwd(), "..", "..", "downloads")
    
    for company_dir in os.listdir(download_root):
        company_path = os.path.join(download_root, company_dir)
        if not os.path.isdir(company_path): continue
        
        files = [f for f in os.listdir(company_path) if f.lower().endswith(".pdf")]
        print(f"\n[>>>] Scanning {company_dir} ({len(files)} files)...")

        for idx, filename in enumerate(files):
            file_path = os.path.join(company_path, filename)
            
            text_sample = ""
            try:
                # 6페이지만 읽어 카테고리 판별 정확도 향상
                with pdfplumber.open(file_path) as pdf:
                    for page in pdf.pages[:6]:
                        text_sample += page.extract_text() or ""
            except: pass
            
            category = categorize_product(text_sample, filename)
            clean_name = re.sub(r'[^\w\s-]', '', filename.replace(".pdf", ""))
            product_code = f"{company_dir.upper()}_{clean_name[:40].replace(' ', '_')}"
            
            if idx % 100 == 0: print(f"    - Ingesting: {idx}/{len(files)} ({category})")
            
            try:
                supabase.table("insurance_products").upsert({
                    "product_code": product_code,
                    "company_name": company_dir,
                    "display_name": clean_name,
                    "category": category,
                    "standard_code": "INGEST_FINAL_V1"
                }, on_conflict="product_code").execute()
            except Exception as e:
                pass

    print("\n[*] ADVANCED RE-INGESTION COMPLETE.")

if __name__ == "__main__":
    run_ingestion()
