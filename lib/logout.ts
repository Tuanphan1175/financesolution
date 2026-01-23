// lib/logout.ts
import { supabase } from './supabaseClient';

export async function logout() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('[Logout] Supabase signOut failed:', error);
  } finally {
    // Redirect để reset toàn bộ state React
    window.location.href = '/';
    // nếu sau này có trang /login riêng → đổi thành '/login'
  }
}
