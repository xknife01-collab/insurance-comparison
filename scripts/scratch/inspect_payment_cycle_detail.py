import os
import io
import pandas as pd
import warnings
import re

warnings.filterwarnings('ignore')

SOURCE_DIR = r"C:\Users\zkfnt\Desktop\insurance-comparison-main"
OUTPUT_FILE = r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\inspect_payment_cycle_detail.txt"

def inspect_cycle():
    files = sorted([f for f in os.listdir(SOURCE_DIR) if f.endswith(".xls")])
    
    results = []
    
    for filename in files:
        filepath = os.path.join(SOURCE_DIR, filename)
        is_html = False
        try:
            with open(filepath, 'rb') as f:
                content = f.read(2000)
            if b'<table' in content.lower() or b'<html' in content.lower():
                is_html = True
        except Exception:
            pass
            
        if not is_html:
            continue
            
        # This is an HTML file
        df = None
        used_enc = ""
        try:
            with open(filepath, 'rb') as f:
                raw_bytes = f.read()
            for enc in ['cp949', 'euc-kr', 'utf-8']:
                try:
                    raw_text = raw_bytes.decode(enc)
                    if '<table' in raw_text.lower():
                        frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                        if frames:
                            df = frames[0]
                            used_enc = enc
                            break
                except Exception:
                    continue
        except Exception:
            pass
            
        if df is None:
            continue
            
        # Clean df
        cleaned_df = df.map(lambda v: str(v).strip() if pd.notna(v) else "")
        
        # Search for columns or cells mentioning cycle
        cycle_mentions = []
        for idx, row in cleaned_df.iterrows():
            row_str = " | ".join(row.tolist())
            if any(k in row_str for k in ["납입주기", "납입방법", "월납", "연납", "1년납", "일시납"]):
                # Extract surrounding text
                matches = re.findall(r'[^|]*(?:납입주기|납입방법|월납|연납|1년납|일시납)[^|]*', row_str)
                for m in matches:
                    clean_m = m.strip()
                    if len(clean_m) > 10 and clean_m not in cycle_mentions:
                        cycle_mentions.append(clean_m)
                        
        results.append({
            "file": filename,
            "encoding": used_enc,
            "shape": df.shape,
            "cycle_mentions": cycle_mentions[:10]
        })
        
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write(f"Analyzed {len(results)} HTML xls files for payment cycles:\n\n")
        for item in results:
            out.write(f"File: {item['file']} ({item['encoding']}) | Shape: {item['shape']}\n")
            if item['cycle_mentions']:
                for mention in item['cycle_mentions']:
                    out.write(f"  - Mention: {mention}\n")
            else:
                out.write("  - No cycle mentions found in row texts\n")
            out.write("-" * 80 + "\n")
            
    print(f"Detail inspection saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    inspect_cycle()
