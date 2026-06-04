import pandas as pd

CSV_PATH = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\5_savings\savings\extracted_data.csv"

def main():
    df = pd.read_csv(CSV_PATH)
    
    # We want unique company + product name, and display a sample premium paid
    # Let's extract the premium for 1 year or 10 years elapsed
    # Group by Company and Product Name
    summary = []
    grouped = df.groupby(["보험회사", "상품명"])
    for (company, product), group in grouped:
        # Get premiums for durations in the group
        durations = group["구분"].astype(str).tolist()
        premiums = group["담보명(급부명)"].astype(str).tolist()
        
        # Format duration -> premium string
        dur_prem = []
        for d, p in zip(durations, premiums):
            dur_prem.append(f"{d}년:{p}")
            
        dur_prem_str = " | ".join(dur_prem)
        summary.append({
            "Company": company,
            "Product": product,
            "Premiums": dur_prem_str
        })
        
    summary_df = pd.DataFrame(summary).sort_values(by="Company")
    
    with open("savings_summary_output.txt", "w", encoding="utf-8") as out:
        out.write(f"Total Unique Products: {len(summary_df)}\n\n")
        out.write(f"{'회사명':<10} | {'상품명':<55} | {'납입기간별 납입보험료':<50}\n")
        out.write("-" * 130 + "\n")
        for idx, row in summary_df.iterrows():
            out.write(f"{row['Company']:<10} | {row['Product']:<55} | {row['Premiums']:<50}\n")

if __name__ == "__main__":
    main()
