# -*- coding: utf-8 -*-
"""
한화손보 file1, file2, file3 다운로드 후 내용 확인
어느 파일이 '요율표' 또는 '보험료 및 해약환급금표'를 포함하는지 확인
"""
import json
import os
import requests
import urllib3
import pdfplumber

urllib3.disable_warnings()

BASE = "https://www.hwgeneralins.com"
SAVE_DIR = "downloads/hanwha_test"
os.makedirs(SAVE_DIR, exist_ok=True)

# 확인된 파일 목록
files = {
    "file1_약관": "/upload/hmpag_upload/product/PRODUCT_01_251224.pdf",
    "file2_사업방법서": "/upload/hmpag_upload/product/PRODUCT_02_kongdong_260301.pdf",
    "file3_요약서": "/upload/hmpag_upload/product/gain_260301.pdf",
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.hwgeneralins.com/notice/ir/product-ing01.do",
}

def peek_pdf(path, label):
    """PDF에서 요율표 관련 페이지 찾기"""
    print(f"\n[{label}] 분석 중: {os.path.basename(path)}", flush=True)
    keywords = ["보험료", "요율", "해약환급금", "나이", "연령", "남자", "여자", "남성", "여성", "원"]
    rate_keywords = ["보험료 및 해약환급금표", "요율표", "기준보험료"]
    
    try:
        with pdfplumber.open(path) as pdf:
            total = len(pdf.pages)
            print(f"  총 {total} 페이지", flush=True)
            
            found_rate_page = False
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                # 요율표 키워드 확인
                if any(kw in text for kw in rate_keywords):
                    print(f"  ✅ [Page {i+1}] 요율표 관련 키워드 발견!", flush=True)
                    print(f"     내용(앞 300자): {text[:300]}", flush=True)
                    tables = page.extract_tables()
                    if tables:
                        print(f"     테이블 {len(tables)}개 발견", flush=True)
                        for t in tables[:1]:
                            print(f"     첫 테이블 샘플:", flush=True)
                            for row in t[:5]:
                                print(f"       {row}", flush=True)
                    found_rate_page = True
                    if i > 5:  # 처음 몇 장 이후에 발견되면 충분
                        break
                elif i < 5:  # 처음 5페이지 내용 확인
                    if any(kw in text for kw in keywords):
                        print(f"  [Page {i+1}] 일반 키워드 발견: {text[:200]}", flush=True)
            
            if not found_rate_page:
                print(f"  ❌ 요율표 키워드 없음. 일반 키워드 포함 페이지 검색...", flush=True)
                for i, page in enumerate(pdf.pages[:30]):
                    text = page.extract_text() or ""
                    if any(kw in text for kw in keywords):
                        print(f"  [Page {i+1}] 키워드 포함: {text[:200]}", flush=True)
                        break
                        
    except Exception as e:
        print(f"  오류: {e}", flush=True)

# 다운로드 및 확인
sess = requests.Session()
sess.headers.update(headers)

for label, path in files.items():
    url = BASE + path
    fname = os.path.join(SAVE_DIR, label + "_" + os.path.basename(path))
    
    print(f"\n다운로드: {url}", flush=True)
    try:
        r = sess.get(url, verify=False, timeout=60)
        if r.status_code == 200 and len(r.content) > 1000:
            with open(fname, 'wb') as f:
                f.write(r.content)
            print(f"  저장: {fname} ({len(r.content):,} bytes)", flush=True)
            peek_pdf(fname, label)
        else:
            print(f"  실패: status={r.status_code}, size={len(r.content)}", flush=True)
    except Exception as e:
        print(f"  오류: {e}", flush=True)

print("\n[DONE]", flush=True)
