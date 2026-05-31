import os
import json

files = [
    "shinhan_life_full_data.json",
    "lina_life_full_data.json",
    "hana_nonlife_full_data.json",
    "hanwha_life_full_data.json",
    "hanwha_nonlife_full_data.json",
    "heungkuk_fire_full_data.json",
    "heungkuk_life_full_data.json",
    "db_insurance_full_data.json",
    "meritz_fire_full_data.json",
    "samsung_fire_full_data.json",
    "hyundai_marine_full_data.json",
    "kb_insurance_full_data.json"
]

print("=== Final Combined Scraper Status ===")
for f in files:
    path = os.path.join(os.getcwd(), "scripts", "scraper", f)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as j:
                data = json.load(j)
                if isinstance(data, list):
                    status = f"SUCCESS ({len(data)} items)" if len(data) > 0 else "FAIL (0 items)"
                else:
                    status = "CORRUPT"
                print(f"{f:30} : {status}")
        except:
            print(f"{f:30} : READ ERROR")
    else:
        print(f"{f:30} : NOT STARTED")
