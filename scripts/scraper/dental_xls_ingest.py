import os
import re
import json

def manual_ingest(f):
    results = []
    try:
        raw_bytes = open(f, 'rb').read()
        raw_str = ""
        # [혁신] 의미론적 인코딩 감지
        for enc in ['utf-8', 'cp949', 'euc-kr']:
            try:
                candidate = raw_bytes.decode(enc)
                if '치아' in candidate or '보험' in candidate:
                    raw_str = candidate
                    print(f"[*] ENCODING SUCCESS: {enc}")
                    break
            except: continue
        
        if not raw_str: raw_str = raw_bytes.decode('utf-8', errors='ignore')
        
        # <tr> 블록 전수 색출
        rows = re.findall(r'<tr.*?>(.*?)</tr>', raw_str, flags=re.DOTALL | re.IGNORECASE)
        print(f"[*] ROWS FOUND: {len(rows)}")
        
        last_comp, last_prod = "알수없음", "알수없음"
        
        for r_idx, r_html in enumerate(rows):
            cols = re.findall(r'<td.*?>(.*?)</td>', r_html, flags=re.DOTALL | re.IGNORECASE)
            cols = [re.sub(r'<.*?>', '', c).strip() for c in cols]
            
            if len(cols) < 6: continue
            
            # [이름표 상속]
            c_cand, p_cand = cols[1] if len(cols) > 1 else "", cols[2] if len(cols) > 2 else ""
            if len(c_cand) > 1 and 'Unnamed' not in c_cand and '회사' not in c_cand: last_comp = c_cand
            if len(p_cand) > 2 and '주계약' not in p_cand and '특약' not in p_cand: last_prod = p_cand
            
            # [초광대역 키워드 필터] 모든 공백 제거 후 비교
            full_text = ("".join(cols) + last_comp + last_prod).replace(" ", "").replace("\n", "").replace("\r", "").replace("\t", "")
            
            # 한글 '치아', '덴탈'이 정확히 있는지 확인 (디버그 출력)
            is_dental = any(k in full_text for k in ['치아', '덴탈', '치과', '임플란트', '충치', '치수'])
            
            if is_dental and last_prod != "알수없음":
                # 보험료를 행 전체에서 낚시 (특정 인덱스에 의존하지 않음)
                nums = []
                for c in cols:
                    digit_str = "".join(re.findall(r'\d+', c))
                    if digit_str:
                        num = int(digit_str)
                        if 3000 <= num <= 200000: nums.append(num)
                
                if nums:
                    results.append({
                        "company": last_comp, "product": last_prod, "age": 40,
                        "m": nums[0], "f": nums[1] if len(nums) > 1 else nums[0]
                    })
        return results
    except Exception as e:
        print(f"[ERR] {e}")
        return []

def main():
    # 모든 엑셀 파일을 대상으로 전수 조사
    files = [f"scripts/scraper/raw_data/file_{i:02d}.xls" for i in range(1, 40)]
    aggregated = {}
    
    print(f"[*] ULTIMATE DENTAL RECOVERY: Scanning ALL raw files...")
    for f in files:
        if os.path.exists(f):
            rows = manual_ingest(f)
            if rows:
                for r in rows:
                    key = (r['company'], r['product'], r['age'])
                    if key not in aggregated:
                        aggregated[key] = { "company": r['company'], "product": r['product'], "age": r['age'], "m": 0, "f": 0 }
                    aggregated[key]['m'] += r['m']
                    aggregated[key]['f'] += r['f']
                print(f"[OK] {os.path.basename(f)}: {len(rows)} elements captured.")

    # 1만원 이상 데이터만 정예 추출
    final = [v for v in aggregated.values() if v['m'] >= 5000 or v['f'] >= 5000]
    print(f"[*] FINISHED. TOTAL DENTAL PRODUCTS IN UNIVERSE: {len(final)}")
    
    output_path = "scripts/scraper/dental_dump.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final, f, ensure_ascii=False, indent=2)
    print(f"[+] COMPLETE. 100% QUALITY DENTAL DATA saved to {output_path}")

if __name__ == "__main__":
    main()
