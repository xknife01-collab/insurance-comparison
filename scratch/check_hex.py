import csv

file_path = r'insurance_data/0_popular/surgery_hospital/extracted_data.csv'

try:
    with open(file_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        print("--- Checking High Premium Products (>= 1,000,000 KRW) ---")
        
        for row in reader:
            m_str = row.get('Col_7', '0').replace(',', '').replace('원', '').strip()
            try:
                m_val = int(float(m_str)) if m_str else 0
            except: m_val = 0
            
            if m_val >= 1000000:
                # Print hex values of the product name to see what it really is
                pname = row.get('Col_1', '')
                pname_hex = pname.encode('utf-8').hex()
                print(f"Product: {pname} (Hex: {pname_hex}) | Premium: {row['Col_7']}")
                
except Exception as e:
    print(f"Error: {e}")
