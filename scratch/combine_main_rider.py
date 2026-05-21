import pandas as pd
import os

file_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

try:
    df = pd.read_csv(file_path, encoding='utf-8-sig')
    
    # Identify Main (주계약) and Rider (특약)
    # Based on Col_2 (Classification)
    
    def get_premium(val):
        if pd.isna(val) or val == "": return 0
        val = str(val).replace(',', '').replace('원', '').strip()
        try:
            # Handle cases like "837000" (if it's per 10k sub amt) or just raw numbers
            return float(val)
        except:
            return 0

    all_products = df['Col_1'].unique()
    combined_data = []

    for product in all_products:
        p_df = df[df['Col_1'] == product]
        
        # Split into main and riders
        main_rows = p_df[p_df['Col_2'].str.contains('주계약', na=False) | p_df['Col_2'].str.contains('기본', na=False)]
        rider_rows = p_df[p_df['Col_2'].str.contains('특약', na=False)]
        
        if main_rows.empty and rider_rows.empty: continue
        
        # Use first main row if exists, else first rider as base
        base_row = main_rows.iloc[0].copy() if not main_rows.empty else rider_rows.iloc[0].copy()
        
        # Calculate sums
        main_m = get_premium(base_row['Col_7']) if not main_rows.empty else 0
        main_f = get_premium(base_row['Col_8']) if not main_rows.empty else 0
        
        # Add ONE rider premium (the highest one that isn't the base row)
        other_riders = rider_rows
        if main_rows.empty: # if we used a rider as base, don't add it again
            other_riders = rider_rows.iloc[1:]
            
        if not other_riders.empty:
            # Sort by premium to find highest
            other_riders['m_val'] = other_riders['Col_7'].apply(get_premium)
            max_rider = other_riders.sort_values('m_val', ascending=False).iloc[0]
            
            main_m += get_premium(max_rider['Col_7'])
            main_f += get_premium(max_rider['Col_8'])
            
            # Update coverage name to show it's combined
            base_row['Col_3'] = f"{base_row['Col_3']} + {max_rider['Col_3']}"
        
        # Update premiums in base_row
        base_row['Col_7'] = f"{int(main_m):,} 원"
        base_row['Col_8'] = f"{int(main_f):,} 원"
        
        combined_data.append(base_row)

    final_df = pd.DataFrame(combined_data)
    final_df.to_csv(file_path, index=False, encoding='utf-8-sig')
    print(f"Combined {len(combined_data)} products (Main + 1 Rider).")

except Exception as e:
    print(f"Error: {e}")
