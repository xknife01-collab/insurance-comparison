import os

file = r'C:\Users\zkfnt\Desktop\insurance-comparison-main\file_12.xls'

print(f"--- Raw Content Peek for {os.path.basename(file)} ---")
try:
    # Try reading as binary and showing a chunk
    with open(file, 'rb') as f:
        chunk = f.read(2000)
        print("HEX PEEK:")
        print(chunk.hex(' ', 16))
        print("\nTEXT PEEK (Latin-1):")
        print(chunk.decode('latin-1', errors='replace'))
except Exception as e:
    print(f"Error: {e}")
