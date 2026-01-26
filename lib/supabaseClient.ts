// lib/supabaseClient.ts
// ⚠️ SINGLE SUPABASE CLIENT – DO NOT DUPLICATE
import { createClient } from '@supabase/supabase-js';

// Vite env (Vercel đã set: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Không throw ở build-time (tránh fail build nếu env chưa inject đúng lúc),
  // nhưng sẽ báo rõ ở runtime.
  // Bạn có thể đổi thành throw Error nếu muốn chặt chẽ hơn.
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check Vercel Environment Variables.'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
