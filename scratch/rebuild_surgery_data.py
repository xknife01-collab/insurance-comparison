import os
import pandas as pd
import glob
import warnings

# Suppress warnings
warnings.filterwarnings('ignore')

input_dir = r'C:\Users\zkfnt\Desktop\insurance-comparison-main'
output_file = r'c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\0_popular\surgery_hospital\extracted_data.csv'

# Keywords for filtering
include_keywords = ['수술', '입원', '일당']
exclude_keywords = ['연금', '종신', '유병자', '간편', '암', '뇌', '심장', '치아']

all_files = glob.glob(os.path.join(input_dir, "*.xls"))
print(f"Found {len(all_files)} .xls files.")

all_data = []

for file in all_files:
    file_name = os.path.basename(file)
    print(f"Processing: {file_name}...")
    
    try:
        # Try reading as HTML first (since most are HTML formatted as .xls)
        df_list = pd.read_html(file)
        df = df_list[0]
    except Exception:
        try:
            # Fallback to standard excel
            df = pd.read_excel(file)
        except Exception as e:
            print(f"  Failed to read {file_name}: {e}")
            continue

    # Identify relevant rows
    # Col_1 is Product Name, Col_3 is Coverage Name (based on indices)
    # We use positional indexing to be safe
    
    # Clean up dataframe (remove empty rows/cols)
    df = df.dropna(how='all').dropna(axis=1, how='all')
    
    for _, row in df.iterrows():
        row_list = row.tolist()
        if len(row_list) < 5: continue
        
        product_name = str(row_list[1]) if len(row_list) > 1 else ""
        coverage_name = str(row_list[3]) if len(row_list) > 3 else ""
        
        # Filtering logic
        # 1. Product must NOT contain exclude keywords
        is_excluded = any(k in product_name for k in exclude_keywords)
        if is_excluded: continue
        
        # 2. Coverage must contain include keywords
        is_included = any(k in coverage_name for k in include_keywords)
        if not is_included: continue
        
        # Map to the target 31 columns
        # Col_0 to Col_25, source_file, Col_26 to Col_29
        new_row = [None] * 31
        
        # Copy as many columns as available from source
        # Note: source_file is at index 26
        limit = min(len(row_list), 26)
        for i in range(limit):
            new_row[i] = row_list[i]
            
        new_row[26] = file_name # source_file
        
        # If there are more columns in source, put them after source_file
        if len(row_list) > 26:
            for i in range(26, min(len(row_list), 30)):
                new_row[i+1] = row_list[i]
        
        all_data.append(new_row)

print(f"\nExtracted {len(all_data)} rows.")

# Create final dataframe
columns = [f"Col_{i}" for i in range(26)] + ["source_file"] + [f"Col_{i}" for i in range(26, 30)]
final_df = pd.DataFrame(all_data, columns=columns)

# Save to CSV
os.makedirs(os.path.dirname(output_file), exist_ok=True)
final_df.to_csv(output_file, index=False, encoding='utf-8-sig')
print(f"Saved to {output_file}")
