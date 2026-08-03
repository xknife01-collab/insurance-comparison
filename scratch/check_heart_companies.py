import os
from bs4 import BeautifulSoup

def check_companies():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    if not os.path.exists(path):
        print(f"Error: Path not found: {path}")
        return

    companies = set()
    files = [f for f in os.listdir(path) if f.endswith('.xls')]
    
    print(f"Scanning {len(files)} files in {path}...")
    
    for f in files:
        file_path = os.path.join(path, f)
        try:
            # HTML 파일을 읽어 보험사명 위치(보통 첫 테이블의 첫 행 두 번째 열) 추출
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as html_file:
                soup = BeautifulSoup(html_file, 'html.parser')
                table = soup.find('table')
                if table:
                    rows = table.find_all('tr')
                    if rows:
                        cols = rows[0].find_all('td')
                        if len(cols) > 1:
                            company = cols[1].get_text(strip=True)
                            if company:
                                companies.add(company)
        except Exception as e:
            print(f"Error parsing {f}: {e}")

    print("\n[발견된 보험사 목록]")
    print("-" * 30)
    for c in sorted(list(companies)):
        print(f"- {c}")
    print("-" * 30)
    print(f"총 {len(companies)}개 보험사가 발견되었습니다.")

if __name__ == "__main__":
    check_companies()
