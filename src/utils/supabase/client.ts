// Supabase client initialization with Vercel deployment check
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || 
  "";

const supabaseKey = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) || 
  "";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
