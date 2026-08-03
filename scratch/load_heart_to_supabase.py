import os
import pandas as pd
from supabase import create_client, Client
import dotenv

# Load environment variables
dotenv.load_dotenv(".env.local")

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase credentials not found in .env.local")
    exit(1)

supabase: Client = create_client(url, key)

# Path to the data
csv_path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\insurance_data\1_guaranteed\heart\extracted_data.csv"

if not os.path.exists(csv_path):
    print(f"Error: CSV file not found at {csv_path}")
    exit(1)

# Read CSV
df = pd.read_csv(csv_path)
df = df.fillna("")

print(f"Preparing to upload {len(df)} rows to 'heart_insurance_plans'...")

# Mapping CSV columns to DB columns
records = []
for _, row in df.iterrows():
    record = {
        "company": str(row["보험회사"]),
        "product_name": str(row["상품명"]),
        "category": str(row["구분"]),
        "coverage_name": str(row["담보명(급부명)"]),
        "payout_reason": str(row["지급사유"]),
        "payout_amount": str(row["지급금액"]),
        "subscription_amount": str(row["가입금액"]),
        "male_premium": int(row["기준보험료"]) if str(row["기준보험료"]).isdigit() else 0,
        "female_premium": int(row["가입보험료"]) if str(row["가입보험료"]).isdigit() else 0,
        "interest_rate": str(row["적용이율"]),
        "renewal_type": str(row["갱신구분"]),
        "channel": str(row["판매채널"]),
        "base_date": "2026-01-01",
        "details": str(row["상세안내"]),
        "contact": str(row["연락처"]),
        "source_file": str(row["source_file"]),
    }
    
    # Map raw columns
    for i in range(30):
        col_name = f"원본_열_{i}"
        if col_name in df.columns:
            record[f"raw_col_{i}"] = str(row[col_name])
        else:
            record[f"raw_col_{i}"] = ""
            
    records.append(record)

# Batch upload (100 rows at a time)
batch_size = 100
total_success = 0

for i in range(0, len(records), batch_size):
    batch = records[i:i+batch_size]
    try:
        response = supabase.table("heart_insurance_plans").insert(batch).execute()
        total_success += len(batch)
        print(f"Uploaded {total_success}/{len(records)} rows...")
    except Exception as e:
        print(f"Error uploading batch at {i}: {e}")

print(f"Final Status: Successfully uploaded {total_success} rows to Supabase.")
