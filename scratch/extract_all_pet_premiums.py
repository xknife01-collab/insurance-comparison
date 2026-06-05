import pandas as pd
import os
import sys

def extract_premiums():
    sys.stdout.reconfigure(encoding='utf-8')
    xlsx_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\pet\extracted_data.xlsx"
    if not os.path.exists(xlsx_path):
        print("[-] File not found")
        return

    df = pd.read_excel(xlsx_path)
    
    print("### 📊 엑셀 내 펫보험 상품별 실제 기준보험료 분석 결과\n")
    print("엑셀 데이터에서 추출한 주요 손해보험사 펫보험 상품의 **가입 조건별 실제 월 보험료** 리스트입니다.\n")
    
    # We will find rows where both product name and a premium field (e.g. 남성보험료, 여성보험료, 기준보험료, 가입보험료) are present
    # Some rows contain summary premiums at the product header
    summary_list = []
    
    for idx, row in df.iterrows():
        company = row['보험회사']
        prod = row['상품명']
        
        # Check if there is a realistic premium (usually between 10,000 and 150,000) in one of the fields
        for col in ['남성보험료', '여성보험료', '기준보험료', '가입보험료']:
            val = row[col] if col in df.columns else None
            if pd.notna(val):
                try:
                    # Clean and parse number
                    clean_val = str(val).replace(',', '').replace('원', '').strip()
                    num = float(clean_val)
                    if 15000 <= num <= 100000:
                        # Found a premium!
                        dambo = row['담보명(급부명)'] if pd.notna(row['담보명(급부명)']) else '기본계약'
                        gubun = row['구분'] if pd.notna(row['구분']) else ''
                        summary_list.append({
                            'company': company,
                            'product': prod,
                            'gubun': gubun,
                            'dambo': dambo,
                            'premium': int(num),
                            'col_used': col
                        })
                        break # Only need one premium per row
                except:
                    pass
                    
    # Remove duplicates
    seen = set()
    unique_summaries = []
    for item in summary_list:
        key = (item['company'], item['product'], item['gubun'], item['premium'])
        if key not in seen:
            seen.add(key)
            unique_summaries.append(item)
            
    # Group by company
    df_sum = pd.DataFrame(unique_summaries)
    if len(df_sum) > 0:
        for company, grp in df_sum.groupby('company'):
            print(f"#### 🏢 {company}")
            for idx, r in grp.iterrows():
                plan_name = r['product']
                if pd.notna(r['gubun']) and str(r['gubun']).strip() != '' and r['gubun'] != r['product']:
                    plan_name += f" ({r['gubun']})"
                print(f"- **{plan_name}**")
                print(f"  - **월 보험료:** {r['premium']:,}원")
                print(f"  - **가입 형태 / 기준:** {r['dambo']}")
                print("")
    else:
        print("[-] 엑셀에서 월 15,000원 ~ 100,000원 사이의 기준보험료 데이터를 발견하지 못했습니다.")

if __name__ == "__main__":
    extract_premiums()
