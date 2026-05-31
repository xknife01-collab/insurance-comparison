import pandas as pd
import io
import warnings

warnings.filterwarnings('ignore')

def inspect_file(filepath, out_path):
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.write(f"=== Inspecting {filepath} ===\n")
        
        # Try decoding with errors='replace' for different encodings
        for enc in ['utf-8', 'cp949', 'euc-kr']:
            try:
                # Use errors='replace' to avoid decode errors
                raw_text = raw_bytes.decode(enc, errors='replace')
                if '<table' in raw_text.lower():
                    frames = pd.read_html(io.StringIO(raw_text), flavor='bs4')
                    if frames:
                        out_f.write(f"\n--- Loaded as HTML with encoding {enc} (errors='replace') ---\n")
                        df = frames[0]
                        for idx, row in df.head(5).iterrows():
                            row_clean = [str(x) for x in row.tolist()]
                            out_f.write(f"Row {idx}: {row_clean}\n")
            except Exception as e:
                out_f.write(f"HTML parsing with {enc} failed: {e}\n")

if __name__ == "__main__":
    inspect_file(
        r"C:\Users\zkfnt\Desktop\insurance-comparison-main\file_36.xls",
        r"C:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scripts\scratch\file_36_inspect_out.txt"
    )
