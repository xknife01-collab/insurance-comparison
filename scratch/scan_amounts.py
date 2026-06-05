import pandas as pd

# Load the source CSV data
df = pd.read_csv('insurance_data/5_savings/variable_term/extracted_data.csv')

pure_term = df[df['sub_type'] == 'term_pure']

print("Unique values of '가입금액' in term_pure products:")
print(pure_term['가입금액'].value_counts())

print("\nUnique values of '기준보험료' in term_pure products:")
print(pure_term['기준보험료'].value_counts().head(20))
