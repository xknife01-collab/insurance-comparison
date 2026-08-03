import os
from bs4 import BeautifulSoup
import pandas as pd

def dump_all_identified_data():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    # 전화번호-보험사 매핑
    phone_map = {
        "1588-5114": "삼성화재", "1588-5644": "현대해상",
        "1588-0100": "DB손보", "1544-0114": "KB손보",
        "1566-7711": "메리츠화재", "1588-3344": "한화손보",
        "1588-3131": "DB생명", "1588-0220": "미래에셋",
        "1588-3366": "삼성생명", "1588-5588": "교보생명"
    }
    
    raw_dump = []
    print(f"Dumping all data from identified files...")

    for f in files:
        file_path = os.path.join(path, f)
        try:
            with open(file_path, 'r', encoding='cp949', errors='ignore') as hf:
                content = hf.read()
            
            company = "기타"
            for phone, name in phone_map.items():
                if phone in content or phone.replace('-', '') in content:
                    company = name
                    break
            
            if company == "기타": continue

            soup = BeautifulSoup(content, 'html.parser')
            for row in soup.find_all('tr'):
                cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                if len(cols) > 3:
                    raw_dump.append({
                        "보험사": company,
                        "데이터": "|".join(cols),
                        "출처": f
                    })
        except:
            pass

    df = pd.DataFrame(raw_dump)
    df.to_csv("raw_insurance_dump.csv", index=False, encoding='utf-8-sig')
    print(f"Dump complete: {len(df)} rows saved to raw_insurance_dump.csv")

if __name__ == "__main__":
    dump_all_identified_data()
