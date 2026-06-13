import psycopg2
import os

DATABASE_URL = "postgresql://postgres:rlaghddlf0411*@db.wfkxwztxpugakusynhpx.supabase.co:5432/postgres"

def main():
    print("[*] Connecting directly to PostgreSQL database via db.wfkxwztxpugakusynhpx.supabase.co...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # 1. Create tables
        create_sql = """
        CREATE TABLE IF NOT EXISTS public.chat_rooms (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT,
            type TEXT NOT NULL DEFAULT 'one_to_one',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS public.chat_room_members (
            room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
            user_id UUID NOT NULL,
            joined_at TIMESTAMPTZ DEFAULT NOW(),
            PRIMARY KEY (room_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS public.chat_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
            sender_id UUID NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Disable RLS for ease of prototyping/testing
        ALTER TABLE public.chat_rooms DISABLE ROW LEVEL SECURITY;
        ALTER TABLE public.chat_room_members DISABLE ROW LEVEL SECURITY;
        ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;
        """
        
        print("[*] Creating tables...")
        cur.execute(create_sql)
        conn.commit()
        print("[+] Base tables created successfully!")
        
        # 2. Add to realtime publication
        try:
            print("[*] Enabling Realtime publication...")
            cur.execute("SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime';")
            pub_exists = cur.fetchone()
            if pub_exists:
                try:
                    cur.execute("ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;")
                    conn.commit()
                    print("[+] Added chat_rooms to publication.")
                except Exception as e:
                    conn.rollback()
                    print(f"[-] chat_rooms already in publication or failed: {e}")
                    
                try:
                    cur.execute("ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_room_members;")
                    conn.commit()
                    print("[+] Added chat_room_members to publication.")
                except Exception as e:
                    conn.rollback()
                    print(f"[-] chat_room_members already in publication or failed: {e}")
                    
                try:
                    cur.execute("ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;")
                    conn.commit()
                    print("[+] Added chat_messages to publication.")
                except Exception as e:
                    conn.rollback()
                    print(f"[-] chat_messages already in publication or failed: {e}")
            else:
                print("[-] Publication 'supabase_realtime' not found. Creating it...")
                cur.execute("CREATE PUBLICATION supabase_realtime FOR TABLE public.chat_rooms, public.chat_room_members, public.chat_messages;")
                conn.commit()
                print("[+] Publication 'supabase_realtime' created.")
        except Exception as e:
            conn.rollback()
            print(f"[-] Realtime setup failed: {e}")

        cur.close()
        conn.close()
        print("[+] Chat database setup completed successfully!")
    except Exception as e:
        print(f"[-] Database connection failed: {e}")

if __name__ == "__main__":
    main()
