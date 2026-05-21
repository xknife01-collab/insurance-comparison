import csv

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

try:
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        print(f"--- Final High Premium Surgery/Hospital Products (>= 300,000 KRW) ---")
        print(f"{'보험사':<10} | {'상품명':<40} | {'남성':<15} | {'여성':<15}")
        print("-" * 100)
        
        found = 0
        for row in reader:
            m_str = row.get('Col_7', '0').replace(',', '').replace('원', '').strip()
            f_str = row.get('Col_8', '0').replace(',', '').replace('원', '').strip()
            
            try:
                m_val = int(float(m_str)) if m_str else 0
                f_val = int(float(f_str)) if f_str else 0
            except:
                m_val, f_val = 0, 0
                
            if m_val >= 300000 or f_val >= 300000:
                print(f"{row['Col_0']:<10} | {row['Col_1']:<40} | {row['Col_7']:<15} | {row['Col_8']:<15}")
                found += 1
        
        if found == 0:
            print("No products over 300,000 KRW found in this refined list.")
        else:
            print(f"\nTotal high premium products: {found}")
            
except Exception as e:
    print(f"Error: {e}")
