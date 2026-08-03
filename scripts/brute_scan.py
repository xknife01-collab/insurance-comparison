"""
전수 무차별 수색 스크립트 (Brute Force Mode)
- 모든 56개 파일을 예외 없이 텍스트 수준에서 파싱
- '간편' 또는 '유병'이 들어간 행의 모든 숫자를 리스팅하여 보고
"""
import glob
import os
import io
import re
import pandas as pd

RAW_DIR = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\raw_data"

def brute_scan():
    files = sorted(glob.glob(os.path.join(RAW_DIR, "*.xls")))
    print(f"[*] 총 {len(files)}개 파일 무차별 전수 수색 시작...\n")
    
    total_comprehensive = 0
    
    for f_path in files:
        fname = os.path.basename(f_path)
        content = ""
        # 1. 텍스트로 읽기 (HTML/텍스트 형식 파악)
        try:
            with open(f_path, 'rb') as f:
                raw = f.read()
            for enc in ['utf-8', 'euc-kr', 'cp949']:
                try:
                    content = raw.decode(enc)
                    break
                except: continue
        except: continue
        
        # 2. '간편' 또는 '유병' 키워드 위치 추적
        if '간편' in content or '유병' in content:
            # 텍스트 내에서 행 단위로 쪼개기
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if ('간편' in line or '유병' in line) and not any(j in line for j in ['치아', '펫', '어린이', '자녀']):
                    # 숫자들만 모두 뽑아보기
                    nums = re.findall(r'\d{1,3}(?:,\d{3})*(?:\.\d+)?', line)
                    # 30,000 이상의 숫자가 있는지 확인 (40대 종합 보험료 타겟)
                    found_prems = []
                    for n in nums:
                        try:
                            val = int(n.replace(',', '').split('.')[0])
                            if 30000 <= val <= 100000:
                                found_prems.append(val)
                        except: pass
                    
                    if found_prems:
                        # 주변 텍스트 50자 상품명 확보
                        print(f"  [HIT] {fname} (Line {i}): {line.strip()[:60]}... -> PREMS: {found_prems}")
                        total_comprehensive += len(found_prems)

    print(f"\n{'='*80}")
    print(f"무차별 수색 완료: 총 {total_comprehensive}개의 유효 종합형 의심 가격을 전수 조사했습니다.")
    print(f"{'='*80}")

if __name__ == "__main__":
    brute_scan()
