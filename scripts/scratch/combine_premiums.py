# -*- coding: utf-8 -*-
import pandas as pd
import re

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\credit\extracted_data.csv"
REPORT_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\combined_summary_report.md"

def clean_and_parse_premium(val_str):
    if pd.isna(val_str) or not val_str:
        return 0
    val_str = str(val_str).replace(",", "").replace("원", "").replace(" ", "").strip()
    digits = "".join(c for c in val_str if c.isdigit())
    if digits:
        return int(digits)
    return 0

def generate_combined():
    df = pd.read_csv(CSV_PATH)
    
    # We will group by (보험회사, 상품명)
    products = df["상품명"].unique()
    
    lines = []
    lines.append("# 주계약 + 특약 합산 신용보험 보험료 요약 (40세 기준)\n")
    lines.append("| 보험회사 | 상품명 | 주계약 남/여 | 특약 합계 남/여 | 총합산 남성 보험료 | 총합산 여성 보험료 | 납입형태 |")
    lines.append("| --- | --- | --- | --- | --- | --- | --- |")
    
    for prod in sorted(products):
        prod_df = df[df["상품명"] == prod]
        co = prod_df.iloc[0]["보험회사"]
        desc = str(prod_df.iloc[0]["상세안내"])
        
        cycle = "월납"
        if "일시납" in desc or "하나생명" in co:
            cycle = "일시납"
            
        # Sum main contract premiums
        main_df = prod_df[prod_df["구분"] == "주계약"].drop_duplicates(subset=["담보명(급부명)"])
        main_m = sum(clean_and_parse_premium(r["기준보험료"]) for _, r in main_df.iterrows())
        main_f = sum(clean_and_parse_premium(r["가입보험료"]) for _, r in main_df.iterrows())
        
        # Sum rider contract premiums
        rider_df = prod_df[prod_df["구분"] == "특약"].drop_duplicates(subset=["담보명(급부명)"])
        rider_m = sum(clean_and_parse_premium(r["기준보험료"]) for _, r in rider_df.iterrows())
        rider_f = sum(clean_and_parse_premium(r["가입보험료"]) for _, r in rider_df.iterrows())
        
        # Since some products duplicate rows due to multiple coverage lines, 
        # let's be careful. Let's see: for Hana Life:
        # main_df has: 
        # - 사망보험금 (남 24,730, 여 15,370)
        # - 고도장해보험금 (남 24,730, 여 15,370)
        # Wait, the main contract package premium is 24,730/15,370 (these are not separate premiums, they are the same main contract premium!).
        # Ah! In the raw files, the premium printed for the main contract is the package premium for the entire main contract.
        # So we should take the MAX premium or the premium of the FIRST main contract row, rather than summing duplicate main contract premiums.
        # Let's inspect the actual premium values.
        # For MetLife: 
        # - e수술보장 대출상환 신용보험II has multiple main contract lines (사망보험금, 수술보험금 등), all listing 60,000/45,000.
        # The actual main premium is 60,000/45,000, NOT the sum of all 6 rows!
        # So for main contract: we take the premium of the first row (or max).
        # For riders: do we sum them? Yes, riders are optional additions and have individual premiums.
        
        # Let's verify:
        # For Hana Life, the rider premiums are:
        # - 교통재해 장해 1,400 / 890
        # - 재해장해 6,620 / 4,950
        # - 교통재해장해 2,010 / 1,300
        # - 5대골절수술 810 / 300
        # These are indeed separate, and we sum them.
        
        # Let's write the logic:
        # Main contract premium = premium of the first "주계약" row found.
        # Rider contract premium = sum of premiums of unique "특약" rows.
        
        m_main_m = clean_and_parse_premium(main_df.iloc[0]["기준보험료"]) if len(main_df) > 0 else 0
        m_main_f = clean_and_parse_premium(main_df.iloc[0]["가입보험료"]) if len(main_df) > 0 else 0
        
        # For riders, since we drop duplicates on "담보명", let's sum them
        m_rider_m = sum(clean_and_parse_premium(r["기준보험료"]) for _, r in rider_df.iterrows())
        m_rider_f = sum(clean_and_parse_premium(r["가입보험료"]) for _, r in rider_df.iterrows())
        
        total_m = m_main_m + m_rider_m
        total_f = m_main_f + m_rider_f
        
        main_str = f"{m_main_m:,}원 / {m_main_f:,}원"
        rider_str = f"{m_rider_m:,}원 / {m_rider_f:,}원" if m_rider_m > 0 else "특약 없음"
        
        lines.append(f"| {co} | {prod} | {main_str} | {rider_str} | **{total_m:,} 원** | **{total_f:,} 원** | {cycle} |")
        
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
    print("Combined report written.")

if __name__ == "__main__":
    generate_combined()
