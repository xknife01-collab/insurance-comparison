# -*- coding: utf-8 -*-
import json
import os

json_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\unified_products_final.json"

with open(json_path, "r", encoding="utf-8") as f:
    all_data = json.load(f)

print(f"Total products in JSON: {len(all_data)}")

count = 0
for item in all_data:
    prod = item.get('product_name', '')
    comp = item.get('company', '')
    
    # 알수없음 제외
    if comp == '알수없음' or not comp:
        continue
        
    is_ubj = any(kw in prod for kw in ['간편', '유병', '보험료', '심사', '3.5.5', '3.1', '3.0.5'])
    is_health = any(kw in prod for kw in ['건강', '종합', '맞춤', '종합보험', '통합', '팩트', '골라담는'])
    is_bad = any(kw in prod for kw in ['연금', '저축', '사망', '정기', '종신', '암보험', '실손', '실비', '치아', '가족', '치매', '간병'])
    
    if is_ubj and is_health and not is_bad:
        rates = item.get('rates', {})
        coverages = item.get('coverages', [])
        
        # 40세 기준 요율이 있는 것만
        m40 = rates.get('premium_M_40', 0)
        if not m40 or m40 == 0:
            continue
            
        count += 1
        
        # 주계약 rates와 개별 coverage의 premium 합산 분석
        sum_of_coverages_m = 0
        sum_of_coverages_f = 0
        for cov in coverages:
            cov_rates = cov.get('premiums', {})
            sum_of_coverages_m += cov_rates.get('premium_M_40', 0)
            sum_of_coverages_f += cov_rates.get('premium_F_40', 0)
            
        print(f"\n[{comp}] {prod[:50]}...")
        print(f"  - Rates (premium_M_40): {m40:,}원")
        print(f"  - Sum of Coverages M_40: {sum_of_coverages_m:,}원")
        print(f"  - Coverages Count: {len(coverages)}")
        if len(coverages) > 0:
            print("  - Coverage details (first 5):")
            for c in coverages[:5]:
                print(f"    * {c['name'][:25]}: {c.get('premiums', {}).get('premium_M_40', 0):,}원")
                
        if count >= 10:
            break
