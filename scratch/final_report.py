import csv

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

try:
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
        # 1. Check for '종신' (Whole Life)
        jongsin_rows = [row for row in rows if '종신' in row.get('Col_1', '') or '종신' in row.get('Col_3', '')]
        
        # 2. Check for high premium count
        high_rows = []
        for row in rows:
            m_str = row.get('Col_7', '0').replace(',', '').replace('원', '').strip()
            try:
                if m_str and float(m_str) >= 300000:
                    high_rows.append(row)
            except: pass
            
        print("=== FINAL REBUILD REPORT ===")
        print(f"Total Products Extracted: {len(rows)}")
        print(f"Remaining '종신' (Whole Life) products: {len(jongsin_rows)}")
        print(f"Products with premium >= 300,000 KRW: {len(high_rows)}")
        print("\n--- Samples of High Premium Surgery Insurance (Correctly Included) ---")
        for i, row in enumerate(high_rows[:10]):
            print(f"{i+1}. {row['Col_0']} | {row['Col_1']} | {row['Col_7']}")
            
except Exception as e:
    print(f"Error: {e}")
