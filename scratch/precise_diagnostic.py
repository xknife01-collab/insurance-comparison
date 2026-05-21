import os
from bs4 import BeautifulSoup

file = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_12.xls'

try:
    with open(file, 'r', encoding='cp949', errors='ignore') as f:
        content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        
        print(f"--- Diagnostic for {os.path.basename(file)} ---")
        found = False
        for tr in soup.find_all('tr'):
            cells = [c.get_text().strip() for c in tr.find_all(['td', 'th'])]
            for i, c in enumerate(cells):
                # Using a very loose match for '납입' or '기간'
                if '납' in c and '기' in c:
                    val = cells[i+1] if i+1 < len(cells) else "N/A"
                    print(f"Found Label: '{c}' | Value: '{val}'")
                    found = True
        if not found:
            print("No labels containing '납' and '기' found.")

except Exception as e:
    print(f"Error: {e}")
