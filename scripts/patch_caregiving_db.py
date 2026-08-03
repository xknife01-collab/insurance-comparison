import os
import psycopg2
from dotenv import load_dotenv

# Load environments
load_dotenv(".env.local")
load_dotenv(".env")

def run():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("[-] DATABASE_URL not found in environment variables.")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # 1. Delete dementia (치매) related rows from caregiving_insurance_plans
        print("[*] Deleting dementia (치매) related rows from caregiving_insurance_plans...")
        cur.execute("""
            DELETE FROM public.caregiving_insurance_plans 
            WHERE product_name LIKE '%치매%' 
               OR care_type = '치매간병'
               OR product_name LIKE '%CDR%';
        """)
        deleted_count = cur.rowcount
        print(f"[+] Deleted {deleted_count} dementia-related rows.")

        # 2. Select remaining pure caregiving rows to patch female premiums and is_increasing flag
        cur.execute("""
            SELECT id, product_name, premium_male_40 
            FROM public.caregiving_insurance_plans;
        """)
        rows = cur.fetchall()
        print(f"[*] Found {len(rows)} remaining pure caregiving rows to patch.")

        for row in rows:
            row_id, prod_name, male_prem = row
            
            # Calculate female premium (1.2x male premium, rounded to 10 won)
            female_prem = int(round((male_prem * 1.2) / 10.0) * 10)
            
            # Determine is_increasing flag based on product name keywords
            is_increasing = False
            if any(kw in prod_name for kw in ['체증', 'RICH', '리치', '프리미엄', 'Rich', 'Premium']):
                is_increasing = True
                
            print(f"  -> Patching [ID {row_id}] {prod_name}: Male={male_prem} -> Female={female_prem}, Increasing={is_increasing}")
            
            # Update database row
            cur.execute("""
                UPDATE public.caregiving_insurance_plans 
                SET premium_female_40 = %s,
                    is_increasing = %s
                WHERE id = %s;
            """, (female_prem, is_increasing, row_id))

        # Commit transaction
        conn.commit()
        print("[+] Transaction committed successfully!")

        # 3. Print final state
        cur.execute("SELECT COUNT(*) FROM public.caregiving_insurance_plans;")
        total_cnt = cur.fetchone()[0]
        print(f"\n[+] Total rows remaining in caregiving_insurance_plans: {total_cnt}")
        
        cur.execute("SELECT id, company_name, product_name, care_type, premium_male_40, premium_female_40, is_increasing FROM public.caregiving_insurance_plans LIMIT 10;")
        colnames = [desc[0] for desc in cur.description]
        final_rows = cur.fetchall()
        print("\n[*] Final Data Samples:")
        for r in final_rows:
            print(dict(zip(colnames, r)))

        cur.close()
        conn.close()
    except Exception as e:
        print(f"[-] Database Error during patch: {e}")

if __name__ == "__main__":
    run()
