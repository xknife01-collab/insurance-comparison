import pandas as pd
import codecs

file_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\whole_life\extracted_data.csv"
output_txt = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\clean_prices.txt"

def summarize():
    df = pd.read_csv(file_path)
    
    # Let's collect unique products and some representative premiums
    lines = []
    lines.append("=== 종신보험 상품별 가격대 (보험료) 요약 ===")
    
    # Group by company and product name
    grouped = df.groupby(['보험회사', '상품명'])
    
    for (company, product), group in grouped:
        # Find rows corresponding to main contract (구분 == '주계약' or contains '주계약')
        main_group = group[group['구분'].astype(str).str.contains('주계약', na=False)]
        if main_group.empty:
            main_group = group # fallback to group
            
        # Get unique premiums
        std_prems = main_group['기준보험료'].dropna().unique()
        act_prems = main_group['가입보험료'].dropna().unique()
        
        # Clean premium values (remove extra spaces)
        std_list = [str(p).strip().replace("  ", " ") for p in std_prems if str(p).strip()]
        act_list = [str(p).strip().replace("  ", " ") for p in act_prems if str(p).strip()]
        
        lines.append(f"\n[{company}] {product}")
        if std_list:
            lines.append(f"  * 기준보험료: {', '.join(std_list[:3])}")
        if act_list:
            lines.append(f"  * 가입보험료: {', '.join(act_list[:3])}")
            
    with codecs.open(output_txt, 'w', 'utf-8') as f:
        f.write('\n'.join(lines))
        
    print(f"Summary written to {output_txt}")

if __name__ == "__main__":
    summarize()
