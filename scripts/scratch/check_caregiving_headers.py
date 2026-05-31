import pandas as pd
import os

csv_path = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv'

def run():
    if not os.path.exists(csv_path):
        print("File does not exist")
        return
        
    try:
        df = pd.read_csv(csv_path, nrows=1)
        print("Caregiving headers:")
        print(df.columns.tolist())
        print("Total columns:", len(df.columns))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run()
