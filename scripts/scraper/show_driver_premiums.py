import pandas as pd

df = pd.read_csv(
    r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\driver\extracted_data.csv',
    encoding='utf-8-sig'
)

df['보험료_숫자'] = pd.to_numeric(df['가입보험료'], errors='coerce')
valid = df[(df['보험료_숫자'] >= 1000) & (df['보험료_숫자'] <= 100000)].copy()
valid = valid.sort_values('보험료_숫자')

lines = []
lines.append(f"총 {len(df)}행 중 유효 보험료 있는 행: {len(valid)}개\n")
lines.append(f"{'순위':<4} {'보험회사':<12} {'월 보험료':>10}  {'가입금액':<18}  {'담보명'}")
lines.append('-'*90)
for i, (_, row) in enumerate(valid.iterrows(), 1):
    comp = str(row['보험회사'])[:12]
    prem = int(row['보험료_숫자'])
    amt = str(row['가입금액'])[:18]
    cov = str(row['담보명(급부명)'])[:35]
    lines.append(f"{i:<4} {comp:<12} {prem:>10,}원  {amt:<18}  {cov}")

out = "\n".join(lines)
with open(r'C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\driver_premiums_output.txt', 'w', encoding='utf-8-sig') as f:
    f.write(out)
print("저장 완료: driver_premiums_output.txt")
