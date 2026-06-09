# -*- coding: utf-8 -*-
import json
import os

json_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\unified_products_final.json"

with open(json_path, "r", encoding="utf-8") as f:
    all_data = json.load(f)

print(f"Total products in JSON: {len(all_data)}")

to_load = []
for item in all_data:
    comp = item.get('company', '')
    prod = item.get('product_name', '')
    raw_rates = item.get('rates', {})
    
    is_ubj = any(kw in prod for kw in ['간편', '유병', '보험료', '심사', '3.5.5', '3.1', '3.0.5'])
    is_health = any(kw in prod for kw in ['건강', '종합', '맞춤', '종합보험', '통합', '팩트', '골라담는'])
    is_bad = any(kw in prod for kw in ['연금', '저축', '사망', '정기', '종신', '암보험', '실손', '실비', '치아', '가족', '치매', '간병'])
    
    if is_ubj and is_health and not is_bad:
        p_m_40 = raw_rates.get('premium_M_40', 0)
        p_f_40 = raw_rates.get('premium_F_40', 0)
        
        if isinstance(p_m_40, (int, float)) and 15000 < p_m_40 < 150000:
            to_load.append({
                "company": comp,
                "product_name": prod,
                "premium_M_40": p_m_40,
                "premium_F_40": p_f_40
            })

# 가격 기준 오름차순 정렬하여 상위 30개 출력
to_load.sort(key=lambda x: x['premium_M_40'])

out_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\json_ubj_analysis.txt"
with open(out_path, "w", encoding="utf-8") as out:
    out.write(f"Matched preexisting health products (15k - 150k): {len(to_load)}\n\n")
    out.write("--- Premium M 40 Ascending (Cheapest 40) ---\n")
    for item in to_load[:40]:
        out.write(f"[{item['company']}] {item['product_name']} | 남: {item['premium_M_40']:,}원, 여: {item['premium_F_40']:,}원\n")
        
    out.write("\n\n--- Premium M 40 Descending (Most Expensive 10) ---\n")
    for item in to_load[-10:]:
        out.write(f"[{item['company']}] {item['product_name']} | 남: {item['premium_M_40']:,}원, 여: {item['premium_F_40']:,}원\n")

print(f"Analysis saved to {out_path}")
