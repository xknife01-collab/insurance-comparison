import pandas as pd
import io

filepath = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\장기보장성 비교 공시 (5).xls"

df = pd.read_excel(filepath, engine='xlrd', header=None)

print(f"Shape: {df.shape}")
print(f"\n첫 10행:")
for i in range(min(10, len(df))):
    row = [str(v) if str(v) != 'nan' else '' for v in df.iloc[i].tolist()]
    print(f"  행{i}: {row}")
