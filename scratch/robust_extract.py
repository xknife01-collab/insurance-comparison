import os
import re
from bs4 import BeautifulSoup

def robust_extract():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    all_companies = set()
    # 인코딩 목록
    encodings = ['cp949', 'euc-kr', 'utf-8', 'utf-16']

    print(f"Robust scanning {len(files)} files...")

    for f in files:
        file_path = os.path.join(path, f)
        for enc in encodings:
            try:
                with open(file_path, 'r', encoding=enc, errors='ignore') as hf:
                    content = hf.read()
                
                if "<table" not in content.lower(): continue
                
                # 정규표현식으로 'XX생명', 'XX화재', 'XX손해', 'XX해상', 'XX보험' 찾기
                # 한글 범위를 유니코드로 지정 (\uac00-\ud7af)
                matches = re.findall(r'[\uac00-\ud7af]{2,10}(?:생명|화재|손해|해상|보험)', content)
                for m in matches:
                    all_companies.add(m)
                
                # 영어 조합 (DB, KB 등)
                matches_en = re.findall(r'(?:DB|KB|AIA|KDB|DGB|MG)[\uac00-\ud7af]{2,10}', content)
                for m in matches_en:
                    all_companies.add(m)
                    
            except:
                continue

    # 결과 저장
    with open("scratch/robust_company_list.txt", "w", encoding="utf-8") as out:
        out.write("Robust Extraction Results\n")
        out.write("-" * 50 + "\n")
        for c in sorted(list(all_companies)):
            out.write(f"- {c}\n")
        out.write("-" * 50 + "\n")
        out.write(f"Total: {len(all_companies)}\n")
        
    print(f"Extraction complete. Total {len(all_companies)} companies found.")

if __name__ == "__main__":
    robust_extract()
