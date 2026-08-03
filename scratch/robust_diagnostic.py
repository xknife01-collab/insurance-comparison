import os
import re
from bs4 import BeautifulSoup

file = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_12.xls'

# Try multiple encodings for the source file
for enc in ['cp949', 'utf-8-sig', 'euc-kr']:
    try:
        with open(file, 'r', encoding=enc, errors='ignore') as f:
            content = f.read()
            if '보험' not in content and '상품' not in content: continue
            
            soup = BeautifulSoup(content, 'html.parser')
            print(f"--- Diagnostic for {os.path.basename(file)} (Enc: {enc}) ---")
            
            # Find any cell that might be "Payment Term"
            # We look for keywords "납입", "기간", "년납"
            found = False
            for tr in soup.find_all('tr'):
                cells = [c.get_text().strip() for c in tr.find_all(['td', 'th'])]
                for i, c in enumerate(cells):
                    # Check for "납입" or "기간" using regex to be safe
                    if re.search(r'[납기]', c) and len(c) < 15:
                        val = cells[i+1] if i+1 < len(cells) else "N/A"
                        print(f"Found Match: '{c}' -> '{val}'")
                        found = True
            if found: break
    except: continue
