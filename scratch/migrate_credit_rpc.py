import os
from supabase import create_client
from dotenv import load_dotenv

def main():
    load_dotenv('.env')
    load_dotenv('.env.local')
    
    url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if not url or not key:
        print("[-] Supabase URL or Service Role Key missing.")
        return
        
    print(f"[*] Initializing Supabase client with URL: {url}")
    supabase = create_client(url, key)
    
    sql_query = """
    -- Add current_credits to agencies table
    ALTER TABLE public.agencies 
    ADD COLUMN IF NOT EXISTS current_credits INTEGER DEFAULT 0 NOT NULL;

    -- Initialize default agency (Atlas) to 30,000 credits
    UPDATE public.agencies 
    SET current_credits = 30000 
    WHERE id = '88888888-8888-4888-a888-888888888888';

    -- Create or replace deduct_agency_credits RPC
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
    """
    
    try:
        print("[*] Running migration via exec_sql RPC...")
        res = supabase.rpc('exec_sql', {'sql_query': sql_query}).execute()
        print("[+] Migration SQL executed successfully via RPC!")
        print(res)
    except Exception as e:
        print(f"[-] RPC failed: {e}")

if __name__ == "__main__":
    main()
