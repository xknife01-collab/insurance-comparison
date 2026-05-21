import csv
import re

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

try:
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        print("--- Analysis of Products >= 300,000 KRW (Payment Term Check) ---")
        print("-" * 120)
        
        found_any = False
        for row in reader:
            m_str = row.get('Col_7', '0').replace(',', '').replace('원', '').strip()
            try:
                m_val = int(float(m_str)) if m_str else 0
            except: m_val = 0
            
            if m_val >= 300000:
                found_any = True
                p_name = row.get('Col_1', '')
                desc = row.get('Col_3', '')
                
                # Check for payment term keywords
                term_info = "미표기"
                # Look for patterns
                match = re.search(r'(\d+년납|일시납|단기납|5년납|10년납|20년납)', p_name + " " + desc)
                if match:
                    term_info = match.group(1)
                
                print(f"상품명: {p_name[:40]:<40} | 납입: {term_info:<8} | 보험료: {row['Col_7']}")
                print(f"설명요약: {desc[:80]}...")
                print("-" * 120)
        
        if not found_any:
            print("30만원 이상 상품이 없습니다.")
            
except Exception as e:
    print(f"Error: {e}")
