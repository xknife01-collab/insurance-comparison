import pandas as pd
import sys

filepath = r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\raw_insurance_dump.csv"

print("Searching for travel-related terms in raw_insurance_dump.csv...")

chunk_size = 50000
keywords = ["여행", "해외", "국내여행", "해외여행"]
matches = []

try:
    # Read chunk by chunk to avoid memory issues
    chunk_count = 0
    for chunk in pd.read_csv(filepath, chunksize=chunk_size, encoding='utf-8-sig'):
        chunk_count += 1
        # Convert 데이터 column to string and fillna
        chunk['데이터'] = chunk['데이터'].astype(str)
        # Search for keywords
        for kw in keywords:
            mask = chunk['데이터'].str.contains(kw, na=False)
            if mask.any():
                matched_rows = chunk[mask]
                for idx, row in matched_rows.iterrows():
                    matches.append({
                        '보험사': row['보험사'],
                        '데이터_preview': row['데이터'][:150],
                        '출처': row['출처'],
                        'keyword': kw
                    })
        if chunk_count % 10 == 0:
            print(f"Processed {chunk_count * chunk_size} rows... Found {len(matches)} matches so far.")
            # Let's cap search to avoid infinite output if there are millions
            if len(matches) > 1000:
                print("Found more than 1000 matches, stopping search.")
                break
                
    print(f"\nSearch complete. Total matches: {len(matches)}")
    if matches:
        print("\nFirst 10 matches:")
        for idx, m in enumerate(matches[:10]):
            print(f"[{idx}] Co: {m['보험사']}, Source: {m['출처']}, Keyword: {m['keyword']}")
            print(f"    Data: {m['데이터_preview']}\n")
            
        # Group matches by source file to see where they are
        df_matches = pd.DataFrame(matches)
        print("\nMatches by source file:")
        print(df_matches['출처'].value_counts().head(20))
        
        # Save matches to a text file for further review
        df_matches.to_csv(r"c:\Users\zkfnt\Desktop\insurance-comparison-main\insurance-comparison-main\scratch\travel_dump_matches.csv", index=False, encoding='utf-8-sig')
        print("Matches saved to scratch/travel_dump_matches.csv")
    else:
        print("No travel insurance matches found in raw_insurance_dump.csv.")
except Exception as e:
    print("Error:", e)
