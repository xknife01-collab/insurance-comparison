-- 1. Create chat_rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    type TEXT NOT NULL DEFAULT 'one_to_one',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create chat_room_members table
CREATE TABLE IF NOT EXISTS public.chat_room_members (
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (room_id, user_id)
);

-- 3. Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Disable RLS for testing and ease of prototyping
ALTER TABLE public.chat_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;

-- 5. Enable Realtime replication for the tables
-- Note: If these are already in publication, this will fail or skip safely.
-- You can run these commands in the Supabase SQL editor:
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
        EXCEPTION WHEN duplicate_object THEN
            RAISE NOTICE 'chat_rooms already in publication';
        END;
        
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_room_members;
        EXCEPTION WHEN duplicate_object THEN
            RAISE NOTICE 'chat_room_members already in publication';
        END;
        
        BEGIN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
        EXCEPTION WHEN duplicate_object THEN
            RAISE NOTICE 'chat_messages already in publication';
        END;
    END IF;
END $$;
