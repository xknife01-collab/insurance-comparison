# -*- coding: utf-8 -*-
import os
import math
from supabase import create_client

def test_simulation():
    env_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\.env.local"
    url = ""
    key = ""
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            if "VITE_SUPABASE_URL" in line:
                url = line.split("=")[1].strip().strip('"').strip("'")
            if "SUPABASE_SERVICE_ROLE_KEY" in line:
                key = line.split("=")[1].strip().strip('"').strip("'")
                
    supabase = create_client(url, key)
    
    # User info
    age = 40
    gender = 'M' # Male
    loan_amount = 100000000 # 1억원
    credit_score = 850
    
    # Discount rate
    discount_rate = 0.0
    if credit_score >= 900: discount_rate = 0.10
    elif credit_score >= 800: discount_rate = 0.08
    elif credit_score >= 700: discount_rate = 0.05
    elif credit_score >= 600: discount_rate = 0.03
    
    # Age factor
    age_factor = 1.0 + max(-0.6, min(2.5, (age - 40) * 0.04))

    print(f"Age: {age} | Age Factor: {age_factor} | Score: {credit_score} | Discount: {discount_rate * 100}%")

    res = supabase.table("credit_insurance_plans").select("*").eq("loan_type", "mortgage").execute()
    data = res.data

    for stype in ['대출안심형', '정기보장형']:
        print(f"\n===== SUBTYPE: {stype} =====")
        # Filter by subtype
        plans = []
        for p in data:
            is_term = "정기보험" in p["product_name"]
            if stype == '정기보장형' and is_term:
                plans.append(p)
            elif stype == '대출안심형' and not is_term:
                plans.append(p)
                
        # Calculate simulated premiums
        options = []
        for p in plans:
            # Determine base amount
            base_amount = 100000000
            if "2형" in p["product_name"] or "신용대출 플랜" in p["product_name"] or "2종" in p["product_name"]:
                base_amount = 10000000
                if "2형" in p["product_name"]: base_amount = 50000000
            elif "1형" in p["product_name"]:
                base_amount = 30000000
                
            db_premium = p["premium_male_40"] if gender == 'M' else p["premium_female_40"]
            amount_ratio = loan_amount / base_amount
            simulated_premium = max(5000, round(db_premium * amount_ratio * age_factor * (1 - discount_rate)))
            
            options.append({
                "company": p["company_name"],
                "product": p["product_name"],
                "coverage_type": p["coverage_type"],
                "premium": simulated_premium
            })
            
        options = sorted(options, key=lambda x: x["premium"])
        
        # Recommendations
        death_plans = [o for o in options if o["coverage_type"] == '사망단독형']
        comp_plans = [o for o in options if o["coverage_type"] == '종합안심형']
        
        diet = death_plans[0] if death_plans else (options[0] if options else None)
        upgrade = comp_plans[0] if comp_plans else (options[1] if len(options) > 1 else (options[0] if options else None))
        hybrid = comp_plans[-1] if comp_plans else (options[-1] if options else None)
        
        if diet:
            print(f"Diet Plan -> Co: {diet['company']} | Prod: {diet['product']} | Prem: {diet['premium']:,} 원")
        if upgrade:
            print(f"Upgrade Plan -> Co: {upgrade['company']} | Prod: {upgrade['product']} | Prem: {upgrade['premium']:,} 원")
        if hybrid:
            print(f"Hybrid Plan -> Co: {hybrid['company']} | Prod: {hybrid['product']} | Prem: {hybrid['premium']:,} 원")

if __name__ == "__main__":
    test_simulation()
