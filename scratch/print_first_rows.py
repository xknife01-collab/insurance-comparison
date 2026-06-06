import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')
PROPERTY_CSV = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\4_life\property\extracted_data.csv"

def main():
    df = pd.read_csv(PROPERTY_CSV)
    # print columns 0 to 8
    print(df.head(15).iloc[:, [0, 1, 2, 3, 4, 5, 7, 8]])

if __name__ == "__main__":
    main()
