import os
import pdfplumber

pdf_path = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\downloads\hana_nonlife\Hana_하나_국내여행보험_사업방법서.pdf"

if os.path.exists(pdf_path):
    print("Reading PDF...")
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Total pages: {len(pdf.pages)}")
        # Print text from the first 10 pages
        for i in range(min(15, len(pdf.pages))):
            print(f"--- PAGE {i+1} ---")
            text = pdf.pages[i].extract_text()
            if text:
                print(text[:1000])  # first 1000 chars of each page
            else:
                print("[No text found]")
else:
    print(f"File not found: {pdf_path}")
