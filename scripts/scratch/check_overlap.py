import pandas as pd
import os

dementia_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv"
home_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv"

suspicious_products = [
    'NH리치간병보험', 'NH베스트간병보험',
    '차곡차곡 마음편한 장기간병보험', '퍼펙트케어간병보험',
    '하나더넥스트 치매간병보험', 'NEW RICH 간병보험',
    '치매간병보험', '프리미엄 RICH 간병보험',
    '버팀목 New케어보험', '흥Good 플러스',
    '골든라이프케어'
]

def check():
    # Load dementia data
    df_dem = pd.read_csv(dementia_path)
    dem_products = set(df_dem['상품명'].unique())
    
    # Load home_facility data
    df_home = pd.read_csv(home_path)
    home_products = set(df_home['상품명'].unique())
    
    print(f"Dementia products: {len(dem_products)}")
    print(f"Home/Facility products: {len(home_products)}")
    
    # Check overlap
    overlap = dem_products & home_products
    print(f"\nExact product name overlap: {len(overlap)}")
    for p in sorted(overlap):
        print(f"  OVERLAP: {p}")
    
    # Check partial matches for suspicious products
    print("\n\n===== SUSPICIOUS PRODUCTS IN HOME/FACILITY =====")
    for kw in suspicious_products:
        home_matches = [p for p in home_products if kw in p]
        dem_matches = [p for p in dem_products if kw in p]
        if home_matches:
            print(f"\nKeyword: '{kw}'")
            print(f"  IN HOME/FACILITY ({len(home_matches)}):")
            for m in sorted(home_matches):
                print(f"    - {m}")
            if dem_matches:
                print(f"  ALSO IN DEMENTIA ({len(dem_matches)}):")
                for m in sorted(dem_matches):
                    print(f"    - {m}")
            else:
                print(f"  NOT in Dementia CSV")
    
    # Check what riders the NH리치간병보험 has in home_facility
    print("\n\n===== NH리치 riders in HOME/FACILITY =====")
    nh_rows = df_home[df_home['상품명'].str.contains('NH리치|NH베스트', na=False)]
    if len(nh_rows) > 0:
        for prod in nh_rows['상품명'].unique():
            print(f"\nProduct: {prod}")
            riders = nh_rows[nh_rows['상품명'] == prod]['담보명(급부명)'].unique()
            for r in sorted(riders):
                print(f"  - {r}")
    else:
        print("None found")

if __name__ == "__main__":
    check()
