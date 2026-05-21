import pandas as pd
df = pd.read_csv(r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\brain\brain_extracted_data.csv', encoding='utf-8-sig')
m = df[df.iloc[:, 1].astype(str).str.contains('메리츠화재')]
with open('meritz_test.txt', 'w', encoding='utf-8') as f:
    for i in range(5):
        f.write(str(m.iloc[i, 1]) + '\n')
        f.write(str(m.iloc[i, 2]) + '\n')
        f.write(str(m.iloc[i, 3]) + '\n')
        f.write(str(m.iloc[i, 5]) + '\n')
        f.write(str(m.iloc[i, 6]) + '\n')
        f.write('---\n')
