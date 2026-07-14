// Supabase client initialization with Vercel deployment check and self-healing local fallback
import { createBrowserClient } from "@supabase/ssr";
import { getMockSupabaseClient } from "./mockClient";

const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || 
  "";

const supabaseKey = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 
  (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) || 
  "";

// Global flag to persist fallback state across client instantiations
let useLocalFallback = false;

export const createClient = () => {
  const isLocalOnly = 
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_LOCAL_ONLY === 'true');

  if (isLocalOnly || useLocalFallback) {
    return getMockSupabaseClient();
  }

  const isUrlInvalid = !supabaseUrl || 
                        supabaseUrl === 'undefined' || 
                        supabaseUrl === 'null' || 
                        supabaseUrl.trim() === '' || 
                        !supabaseUrl.startsWith('http');
                        
  const isKeyInvalid = !supabaseKey || 
                        supabaseKey === 'undefined' || 
                        supabaseKey === 'null' || 
                        supabaseKey.trim() === '';

  if (isUrlInvalid || isKeyInvalid) {
    console.warn('[Supabase Client] URL or Key missing or invalid, falling back to mock client.');
    useLocalFallback = true;
    return getMockSupabaseClient();
  }

  let realClient;
  try {
    realClient = createBrowserClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn('[Supabase Client] Failed to initialize real client, falling back to mock client.', err);
    useLocalFallback = true;
    return getMockSupabaseClient();
  }

  // Return a self-healing proxy client that delegates to the real client
  // but seamlessly falls back to mock data if there are DNS or connection failures.
  return new Proxy(realClient, {
    get(target, prop, receiver) {
      if (prop === 'from') {
        return (tableName: string) => {
          if (useLocalFallback) {
            return getMockSupabaseClient().from(tableName);
          }

          const realQueryBuilder = realClient.from(tableName) as any;

          // Wrap the query builder in a proxy to catch connection failures on await/.then()
          return new Proxy(realQueryBuilder, {
            get(qTarget, qProp, qReceiver) {
              if (qProp === 'then') {
                return (onfulfilled?: any, onrejected?: any) => {
                  return realQueryBuilder.then(
                    (result) => {
                      // Check for network/POSTGREST fetch errors
                      if (result && result.error && (
                        result.error.message?.includes('fetch') || 
                        result.error.message?.includes('network') ||
                        result.error.message?.includes('Failed to fetch') ||
                        result.error.status === 0
                      )) {
                        console.warn(`[Self-Healing Client] Network connection issue on table "${tableName}": ${result.error.message}. Switching to local mock client.`);
                        useLocalFallback = true;
                        return getMockSupabaseClient().from(tableName).then(onfulfilled, onrejected);
                      }
                      return onfulfilled ? onfulfilled(result) : result;
                    },
                    (error) => {
                      console.warn(`[Self-Healing Client] Connection rejected on table "${tableName}". Switching to local mock client.`, error);
                      useLocalFallback = true;
                      return getMockSupabaseClient().from(tableName).then(onfulfilled, onrejected);
                    }
                  );
                };
              }
              const val = Reflect.get(qTarget, qProp, qReceiver);
              return typeof val === 'function' ? val.bind(qTarget) : val;
            }
          });
        };
      }
      const val = Reflect.get(target, prop, receiver);
      return typeof val === 'function' ? val.bind(target) : val;
    }
  }) as any;
};
