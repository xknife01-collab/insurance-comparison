import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) || process.env.VITE_SUPABASE_URL;
const serviceKey = (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_SERVICE_ROLE_KEY) || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseService = createClient(supabaseUrl!, serviceKey!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
