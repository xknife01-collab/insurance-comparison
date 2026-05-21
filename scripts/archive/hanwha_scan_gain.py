# -*- coding: utf-8 -*-
"""
gain_260301.pdf (98페이지) 전체 스캔 - 보험료 및 해약환급금표 확인
"""
import pdfplumber
import os

pdf_path = r"downloads\hanwha_test\file3_요약서_gain_260301.pdf"
# 인코딩 이슈로 파일명이 다를 수 있음
if not os.path.exists(pdf_path):
    # 다른 이름으로 찾기
    for f in os.listdir("downloads/hanwha_test"):
        if "gain" in f:
            pdf_path = f"downloads/hanwha_test/{f}"
            break

print(f"[*] 분석: {pdf_path}", flush=True)

rate_keywords = ["보험료 및 해약환급금표", "요율표", "기준보험료", "환급금표", "보험료표"]
col_keywords = ["남자", "여자", "남성", "여성", "나이", "연령", "피보험자"]
num_keywords = ["원", ",000", "천원"]

found_rate_pages = []

try:
    with pdfplumber.open(pdf_path) as pdf:
        total = len(pdf.pages)
        print(f"[*] 총 {total}페이지", flush=True)
        
        for i, pg in enumerate(pdf.pages):
            text = pg.extract_text() or ""
            
            # 요율표 키워드 체크
            has_rate = any(kw in text for kw in rate_keywords)
            has_col = any(kw in text for kw in col_keywords)
            has_num = any(kw in text for kw in num_keywords)
            
            if has_rate:
                print(f"\n[OK] [Page {i+1}] Rate table keyword found!", flush=True)
                print(f"   텍스트 앞 500자: {text[:500]}", flush=True)
                tables = pg.extract_tables()
                if tables:
                    print(f"   테이블 {len(tables)}개:", flush=True)
                    for t in tables[:2]:
                        for row in t[:5]:
                            print(f"     {row}", flush=True)
                found_rate_pages.append(i+1)
            elif has_col and has_num:
                print(f"\n[MAYBE] [Page {i+1}] Gender+Amount keyword found", flush=True)
                print(f"   텍스트: {text[:300]}", flush=True)
                tables = pg.extract_tables()
                if tables:
                    print(f"   테이블 {len(tables)}개:", flush=True)
                    for t in tables[:1]:
                        for row in t[:5]:
                            print(f"     {row}", flush=True)
                found_rate_pages.append(i+1)
            
        if not found_rate_pages:
            print("\n[NONE] No rate table pages found", flush=True)
            print("   처음 5페이지 텍스트:", flush=True)
            for i in range(min(5, total)):
                text = pdf.pages[i].extract_text() or ""
                if text.strip():
                    print(f"   [Page {i+1}]: {text[:200]}", flush=True)
        else:
            print(f"\n[+] 요율표 관련 페이지: {found_rate_pages}", flush=True)

except Exception as e:
    print(f"오류: {e}")
    import traceback; traceback.print_exc()
