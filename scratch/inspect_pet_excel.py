import pandas as pd
import os
import sys

def inspect_pet_data():
    sys.stdout.reconfigure(encoding='utf-8')
    
    xlsx_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\pet\extracted_data.xlsx"
    if not os.path.exists(xlsx_path):
        print(f"[-] File not found at {xlsx_path}")
        return

    # Load Excel
    df = pd.read_excel(xlsx_path)
    
    print(f"=== 펫보험 엑셀 데이터 분석 결과 ===")
    print(f"전체 데이터 행 수: {len(df)}개")
    
    # Target columns
    company_col = '보험회사'
    product_col = '상품명'
    detail_cols = ['구분', '담보명(급부명)', '지급사유', '지급금액', '가입금액', '남성보험료', '여성보험료', '기준보험료', '가입보험료']
    
    # Value counts of Companies
    print("\n* [보험회사별 수록 레코드 수]:")
    print(df[company_col].value_counts())
    
    print("\n* [실제 엑셀에 수록된 보험사별 대표 보험료/담보 정보]:")
    
    for company in df[company_col].unique():
        comp_df = df[df[company_col] == company]
        print(f"\n★ {company} ★")
        
        # Get some representative rows that have premiums or coverages
        # Let's filter out rows where key fields are missing to show high quality data
        sample = comp_df.dropna(subset=['가입금액', '지급금액'], how='all').head(5)
        if len(sample) == 0:
            sample = comp_df.head(5)
            
        for idx, row in sample.iterrows():
            prod = row[product_col]
            gubun = row['구분'] if pd.notna(row['구분']) else ''
            dambo = row['담보명(급부명)'] if pd.notna(row['담보명(급부명)']) else ''
            pay_reason = row['지급사유'] if pd.notna(row['지급사유']) else ''
            amt = row['가입금액'] if pd.notna(row['가입금액']) else (row['지급금액'] if pd.notna(row['지급금액']) else '')
            
            # Collect premium values if present
            prems = []
            for col in ['남성보험료', '여성보험료', '기준보험료', '가입보험료']:
                if col in df.columns and pd.notna(row[col]) and str(row[col]).strip() != '':
                    prems.append(f"{col}: {row[col]}")
            prems_str = " | ".join(prems) if prems else "보험료 정보 없음"
            
            print(f"  - 상품: {prod} ({gubun})")
            if dambo or pay_reason:
                print(f"    └ 담보: {dambo} | 보장내용: {pay_reason} | 가입/지급한도: {amt}")
            print(f"    └ {prems_str}")

if __name__ == "__main__":
    inspect_pet_data()
