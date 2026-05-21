import os
from bs4 import BeautifulSoup

def scan_html_files():
    path = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
    files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
    
    html_data = []
    
    print(f"Total files in folder: {len(files)}")
    
    for f in files:
        file_path = os.path.join(path, f)
        try:
            # HTML 여부 확인을 위해 앞부분만 읽기
            with open(file_path, 'rb') as rb:
                prefix = rb.read(2048).lower()
                if b'<table' not in prefix and b'<html' not in prefix:
                    continue
            
            # HTML 파일인 경우 읽기
            with open(file_path, 'r', encoding='cp949', errors='ignore') as hf:
                content = hf.read()
                
            soup = BeautifulSoup(content, 'html.parser')
            table = soup.find('table')
            if not table: continue
            
            rows = table.find_all('tr')
            if not rows: continue
            
            # 첫 번째 또는 두 번째 줄에서 정보 추출
            # 보험사명 위치는 보통 첫 번째 줄의 2번째 칸 등에 있음
            row_text = rows[0].get_text(separator='|', strip=True)
            if not row_text:
                row_text = rows[1].get_text(separator='|', strip=True)
            
            html_data.append(f"[{f}] {row_text[:120]}")
            
        except Exception as e:
            pass

    print(f"\n[HTML 형식으로 확인된 {len(html_data)}개 파일의 상단 정보]")
    print("-" * 70)
    for data in html_data:
        print(data)
    print("-" * 70)

if __name__ == "__main__":
    scan_html_files()
