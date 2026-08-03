
import urllib.request
import json

SUPABASE_URL = "https://wfkxwztxpugakusynhpx.supabase.co"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indma3h3enR4cHVnYWt1c3luaHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDU2OTYsImV4cCI6MjA4OTk4MTY5Nn0.B_udlQS12H5hXock5AZK_t6ikqoTvpAb2-ovOH995mg"
headers = {"apikey": ANON_KEY, "Authorization": "Bearer " + ANON_KEY}

def query(table, params):
    url = SUPABASE_URL + "/rest/v1/" + table + "?" + params
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

# 40대 남성, 수술 타입, 비정상값 제외 조건으로 실제 어떤 데이터가 나오는지 확인
print("=== 실제 로더 쿼리와 동일한 조건 ===")
print("gender=M, age=35~45, premium<1000000")
print()

data = query("insurance_surgery_hospital_rates",
    "select=company_name,product_name,gender,age,premium,category_type&gender=eq.M&age=gte.35&age=lte.45&premium=lt.1000000&order=premium.asc&limit=30")

print("결과 %d개:" % len(data))
for d in data:
    print("  [%s] %s | %s타입 | %s원" % (
        d.get('company_name',''), 
        d.get('product_name','')[:40],
        d.get('category_type',''),
        d.get('premium','')))

print()
print("=== category_type 전체 분포 ===")
all_data = query("insurance_surgery_hospital_rates",
    "select=category_type,product_name&gender=eq.M&limit=500")
cats = {}
for d in all_data:
    ct = d.get('category_type','unknown')
    cats[ct] = cats.get(ct, 0) + 1
print("category_type 분포:", cats)

print()
print("=== 실제 product_name 샘플 (surgery 타입) ===")
surgery_data = query("insurance_surgery_hospital_rates",
    "select=company_name,product_name,premium,age&category_type=eq.surgery&gender=eq.M&limit=20")
for d in surgery_data:
    print("  [%s] %s | 나이:%s | %s원" % (
        d.get('company_name',''),
        d.get('product_name','')[:45],
        d.get('age',''),
        d.get('premium','')))

print()
print("=== 연금보험이 나오는 이유 — hospitalization 타입 샘플 ===")
hosp_data = query("insurance_surgery_hospital_rates",
    "select=company_name,product_name,premium,age&category_type=eq.hospitalization&gender=eq.M&limit=20")
for d in hosp_data:
    print("  [%s] %s | 나이:%s | %s원" % (
        d.get('company_name',''),
        d.get('product_name','')[:45],
        d.get('age',''),
        d.get('premium','')))
