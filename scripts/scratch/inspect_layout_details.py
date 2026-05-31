import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

def inspect_file(filepath, out_f):
    out_f.write(f"=== Inspecting {filepath} ===\n")
    
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
        
    try:
        raw_text = raw_bytes.decode('utf-8', errors='replace')
        tables = pd.read_html(io.StringIO(raw_text), flavor='bs4')
        if tables:
            df = tables[0]
            out_f.write(f"Shape: {df.shape}\n")
            for r in range(min(15, len(df))):
                out_f.write(f"Row {r}: {[str(x) for x in df.iloc[r].tolist()][:15]}\n")
    except Exception as e:
        out_f.write(f"Failed to read: {e}\n")
    out_f.write("-" * 80 + "\n")

if __name__ == "__main__":
    with open(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\layout_details.txt", 'w', encoding='utf-8') as out_f:
        inspect_file(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_36.xls", out_f)
        inspect_file(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_52.xls", out_f)
        inspect_file(r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_6.xls", out_f)
