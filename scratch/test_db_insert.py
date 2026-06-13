import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')
url = os.environ.get('VITE_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
supabase = create_client(url, key)

base_row = {
    "company_name": "Test",
    "product_name": "Test Product",
    "division": "Test Div",
    "benefit_name": "Test Benefit",
    "benefit_reason": "Test Reason",
    "benefit_amount": "Test Amount",
    "insured_amount": "1000",
    "premium_male": 100,
    "premium_female": 100,
    "applied_rate": "Test Rate",
    "source_file": "test.xls"
}

# Test 1: Try inserting with a long benefit_reason (100 chars)
row = base_row.copy()
row["benefit_reason"] = "A" * 100
try:
    supabase.table('insurance_dementia_rates').insert(row).execute()
    print("Success with long benefit_reason!")
except Exception as e:
    print("Failed with long benefit_reason:", e)

# Test 2: Try inserting with a long benefit_amount (100 chars)
row = base_row.copy()
row["benefit_amount"] = "A" * 100
try:
    supabase.table('insurance_dementia_rates').insert(row).execute()
    print("Success with long benefit_amount!")
except Exception as e:
    print("Failed with long benefit_amount:", e)

# Test 3: Try inserting with a long division (100 chars)
row = base_row.copy()
row["division"] = "A" * 100
try:
    supabase.table('insurance_dementia_rates').insert(row).execute()
    print("Success with long division!")
except Exception as e:
    print("Failed with long division:", e)

# Test 4: Try inserting with a long benefit_name (100 chars)
row = base_row.copy()
row["benefit_name"] = "A" * 100
try:
    supabase.table('insurance_dementia_rates').insert(row).execute()
    print("Success with long benefit_name!")
except Exception as e:
    print("Failed with long benefit_name:", e)

# Test 5: Try inserting with a long product_name (100 chars)
row = base_row.copy()
row["product_name"] = "A" * 100
try:
    supabase.table('insurance_dementia_rates').insert(row).execute()
    print("Success with long product_name!")
except Exception as e:
    print("Failed with long product_name:", e)

# Test 6: Try inserting with a long applied_rate (100 chars)
row = base_row.copy()
row["applied_rate"] = "A" * 100
try:
    supabase.table('insurance_dementia_rates').insert(row).execute()
    print("Success with long applied_rate!")
except Exception as e:
    print("Failed with long applied_rate:", e)
