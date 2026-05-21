# -*- coding: utf-8 -*-
from pdfminer.high_level import extract_text
import os

def check_pdfminer_decoding(pdf_dir):
    files = [f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")]
    target = None
    for f in files:
        if "2025" in f or "2026" in f:
            target = os.path.join(pdf_dir, f)
            break
            
    if not target:
        print("[-] No target PDF found.")
        return

    print(f"[*] Testing pdfminer.six on: {os.path.basename(target)}")
    try:
        # 10, 20, 30, 40, 50 페이지에서 텍스트 수집
        text = extract_text(target, page_numbers=[10, 20, 30, 40, 50])
        print("\n=== Extracted Text Preview (pdfminer.six) ===")
        print(text[:2000])
        
        if "보험료" in text or "나이" in text or "성별" in text:
            print("\n[✔] SUCCESS: Korean text correctly decoded for free!")
        else:
            print("\n[-] FAIL: Text is still garbled or keywords not found.")
            
    except Exception as e:
        print(f"[-] Parsing error: {e}")

if __name__ == "__main__":
    dl_dir = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scraper\downloads\hanwha_nonlife"
    check_pdfminer_decoding(dl_dir)
