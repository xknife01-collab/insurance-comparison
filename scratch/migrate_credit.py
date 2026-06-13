import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env")
load_dotenv(dotenv_path=".env.local")

db_url = os.environ.get("DATABASE_URL")
if not db_url:
    print("[-] DATABASE_URL not found in environment.")
    exit(1)

print(f"[*] Connecting to database...")
conn = psycopg2.connect(db_url)
conn.autocommit = True
cur = conn.cursor()

try:
    print("[*] Adding current_credits column to agencies table...")
    cur.execute("""
        ALTER TABLE public.agencies 
        ADD COLUMN IF NOT EXISTS current_credits INTEGER DEFAULT 0 NOT NULL;
    """)
    print("[+] Column current_credits added successfully!")

    print("[*] Initializing default agency credits to 30000...")
    cur.execute("""
        UPDATE public.agencies 
        SET current_credits = 30000 
        WHERE id = '88888888-8888-4888-a888-888888888888';
    """)
    print("[+] Credits initialized for default agency!")

    print("[*] Creating deduct_agency_credits function...")
    cur.execute("""
        CREATE OR REPLACE FUNCTION public.deduct_agency_credits(p_agency_id uuid, p_amount integer)
        RETURNS jsonb
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
            v_current_credits integer;
            v_agency_name text;
        BEGIN
            -- Select the current credits and lock the row
            SELECT current_credits, name INTO v_current_credits, v_agency_name
            FROM public.agencies
            WHERE id = p_agency_id
            FOR UPDATE;

            IF NOT FOUND THEN
                RETURN jsonb_build_object(
                    'success', false,
                    'message', '대리점을 찾을 수 없습니다.'
                );
            END IF;

            -- Check if credits are sufficient
            IF v_current_credits < p_amount THEN
                RETURN jsonb_build_object(
                    'success', false,
                    'message', '대리점의 API 이용 한도가 초과되었습니다. 담당 설계사에게 문의하세요.',
                    'current_credits', v_current_credits
                );
            END IF;

            -- Deduct credits
            UPDATE public.agencies
            SET current_credits = current_credits - p_amount
            WHERE id = p_agency_id;

            RETURN jsonb_build_object(
                'success', true,
                'message', '크레딧이 차감되었습니다.',
                'current_credits', v_current_credits - p_amount
            );
        END;
        $$;
    """)
    print("[+] Database function deduct_agency_credits created successfully!")

except Exception as e:
    print(f"[-] Error: {e}")
finally:
    cur.close()
    conn.close()
