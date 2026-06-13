with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv", "rb") as f:
    data = f.read(1000)
    
print("First 1000 bytes:")
print(data)

for enc in ['utf-8', 'utf-8-sig', 'cp949', 'euc-kr']:
    try:
        text = data.decode(enc)
        print(f"\n--- Decoded with {enc} ---")
        print(text[:300])
    except Exception as e:
        print(f"\n--- {enc} failed: {e}")
