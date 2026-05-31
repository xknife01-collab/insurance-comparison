import pandas as pd
import os

caregiving_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\caregiving\extracted_data.csv"
home_facility_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\2_care\home_facility\extracted_data.csv"

def run():
    if not os.path.exists(caregiving_path):
        print(f"Error: caregiving path does not exist: {caregiving_path}")
        return
    if not os.path.exists(home_facility_path):
        print(f"Error: home_facility path does not exist: {home_facility_path}")
        return
        
    try:
        df_care = pd.read_csv(caregiving_path, nrows=2)
        df_home = pd.read_csv(home_facility_path, nrows=2)
        
        care_cols = df_care.columns.tolist()
        home_cols = df_home.columns.tolist()
        
        print(f"Caregiving Columns count: {len(care_cols)}")
        print(f"Home Facility Columns count: {len(home_cols)}")
        
        if len(care_cols) != len(home_cols):
            print("WARNING: Columns counts DO NOT match!")
        
        # Let's compare columns one by one
        mismatch_count = 0
        for i in range(max(len(care_cols), len(home_cols))):
            c_name = care_cols[i] if i < len(care_cols) else "<MISSING>"
            h_name = home_cols[i] if i < len(home_cols) else "<MISSING>"
            if c_name != h_name:
                print(f"Mismatch at index {i}: Care={repr(c_name)}, Home={repr(h_name)}")
                mismatch_count += 1
                
        if mismatch_count == 0:
            print("SUCCESS: Headers match 100% perfectly in names and order!")
        else:
            print(f"FAILURE: Found {mismatch_count} mismatches in headers.")
            
        # Let's load the entire home_facility file to analyze rows
        df_all = pd.read_csv(home_facility_path)
        print(f"Total Rows extracted: {len(df_all)}")
        print(f"Unique Products: {df_all['상품명'].nunique()}")
        print(f"Unique Companies: {df_all['보험회사'].nunique()}")
        print(f"Unique Source Files: {df_all['source_file'].nunique()}")
        
        # Check if there are any pet/fire/liability terms in the extracted data
        bad_keywords = ['배상', '화재', '실손', '의료비', '물적', '대인', '대물', '재물', '낙뢰', '붕괴', '반려견', '반려묘', '펫', '골프']
        has_bad = False
        for idx, row in df_all.iterrows():
            rname = str(row['담보명(급부명)'])
            pname = str(row['상품명'])
            for bad in bad_keywords:
                if bad in rname or bad in pname:
                    print(f"ALERT: Found potential false positive at row {idx}: Product={pname}, Rider={rname}")
                    has_bad = True
                    break
        if not has_bad:
            print("SUCCESS: Checked all rows. No pet/fire/liability false positives found!")
            
    except Exception as e:
        print(f"Error during validation: {e}")

if __name__ == "__main__":
    run()
