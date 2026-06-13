import pandas as pd

df = pd.read_csv(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\dementia\extracted_data.csv")

unique_prods = df[['보험회사', '상품명', '구분', '담보명(급부명)', '가입금액', '지급금액']].drop_duplicates(subset=['보험회사', '상품명', '담보명(급부명)'])

print("=== INSPECTING FACE AMOUNTS (가입금액) ===")
# Write unique face amounts and benefit amounts to a text file for review
out_lines = []
for idx, row in unique_prods.iterrows():
    out_lines.append(f"Company: {row['보험회사']}")
    out_lines.append(f"Product: {row['상품명']}")
    out_lines.append(f"Rider Type: {row['구분']}")
    out_lines.append(f"Coverage: {row['담보명(급부명)']}")
    out_lines.append(f"Face Amt (가입금액): {row['가입금액']}")
    out_lines.append(f"Benefit Amt (지급금액): {row['지급금액']}")
    out_lines.append("-" * 50)

with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\face_amounts_report.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print("Face amounts report saved successfully in UTF-8!")
