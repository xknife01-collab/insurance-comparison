import os
import sys
from supabase import create_client
from dotenv import load_dotenv
import pandas as pd

sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('.env')
load_dotenv('.env.local')

url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')

supabase = create_client(url, key)

products = [
    "(무) let:care 치매간병보험(2605)_3종(간편심사(325), 연만기, 보험기간연장형)",
    "(무)참좋은더보장치매요양간편건강보험2604(41종)",
    "(무)참좋은더보장치매요양간편건강보험2604(40종)",
    "(무)엔젤안심보험(치매보장형, 해약환급금 일부지급형Ⅲ)",
    "(무)참좋은더보장치매요양간편건강보험2604(20종)",
    "(무)엔젤안심보험(치매보장형, 표준형)",
    "KB 골든라이프 안심보험 무배당(치매보장형)",
    "한화생명 치매담은간병플러스보험 무배당 [일반가입형]",
    "(무)참좋은더보장치매요양간편건강보험2604(11종)",
    "(무)참좋은더보장치매요양간편건강보험2604(10종)",
    "든든한인생치매보험 무배당 2601 (해약환급금 일부지급형)",
    "한화생명 치매담은간병플러스보험 무배당 [간편가입형]",
    "(무)참좋은더보장치매요양간편건강보험2604(31종)",
    "(무)참좋은더보장치매요양간편건강보험2604(21종)",
    "(무)백년친구 안심보험(2602)(치매보장형)"
]

print("Database values for the reported products:")
for prod in products:
    res = supabase.table('insurance_dementia_rates').select('*').eq('product_name', prod).execute()
    df = pd.DataFrame(res.data)
    if not df.empty:
        print(f"\n==========================================")
        print(f"Product: {prod}")
        print(df[['benefit_name', 'premium_male', 'premium_female', 'applied_rate']])
    else:
        # Try a partial match
        res_partial = supabase.table('insurance_dementia_rates').select('*').like('product_name', f"%{prod[:20]}%").execute()
        df_p = pd.DataFrame(res_partial.data)
        if not df_p.empty:
            actual_name = df_p['product_name'].iloc[0]
            print(f"\n==========================================")
            print(f"Product (Matched: {actual_name}): {prod}")
            print(df_p[['benefit_name', 'premium_male', 'premium_female', 'applied_rate']])
        else:
            print(f"\n[-] Product not found: {prod}")
