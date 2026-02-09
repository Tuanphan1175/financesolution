// lib/supabaseClient.ts
// ⚠️ SINGLE SUPABASE CLIENT – DO NOT DUPLICATE

import { createClient, type Session, type User } from "@supabase/supabase-js";

/* =========================
   ENV
========================= */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Không throw ở build-time (tránh fail build nếu env chưa inject đúng lúc),
  // nhưng sẽ báo rõ ở runtime.
  console.warn(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check Vercel Environment Variables."
  );
}

/* =========================
   CLIENT (SINGLETON)
========================= */
export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    // Giữ phiên đăng nhập trong localStorage
    persistSession: true,
    // Tự refresh token
    autoRefreshToken: true,
    // Hỗ trợ các flow magic link / reset password / email confirm qua URL
    detectSessionInUrl: true,
    // (Tuỳ chọn) đổi key nếu bạn muốn tách khỏi các app Supabase khác dùng chung domain
    // storageKey: "finance_solution_auth",
  },
});

/* =========================
   TYPES
========================= */
export type Plan = "free" | "premium" | "vip_monthly" | "vip_yearly";

export type Profile = {
  id: string;
  email: string | null;
  plan: Plan;
  premium_expires_at: string | null;
  created_at?: string;
  updated_at?: string;
};

/* =========================
   RUNTIME GUARDS
========================= */
function assertSupabaseConfigured() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase env is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel."
    );
  }
}

/* =========================
   AUTH HELPERS
========================= */
export async function getSessionSafe(): Promise<Session | null> {
  // Không throw nếu env thiếu, chỉ trả null để UI xử lý
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session ?? null;
}

export async function getUserSafe(): Promise<User | null> {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

export async function requireUser(): Promise<User> {
  assertSupabaseConfigured();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("User is not authenticated");
  return data.user;
}

/* =========================
   PROFILE / PLAN HELPERS
========================= */
export async function getMyProfile(): Promise<Profile | null> {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const user = await getUserSafe();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,plan,premium_expires_at,created_at,updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return null;
  return (data as Profile) ?? null;
}

export function isPremiumActive(profile: Pick<Profile, "plan" | "premium_expires_at"> | null): boolean {
  if (!profile) return false;

  // Chấp nhận tất cả các plan không phải là 'free' là có tính chất Premium
  const isPremiumPlan = profile.plan === "premium" ||
    profile.plan === "vip_monthly" ||
    profile.plan === "vip_yearly";

  if (!isPremiumPlan) return false;

  // Nếu không set expires -> coi như premium vô thời hạn
  if (!profile.premium_expires_at) return true;

  const t = Date.parse(profile.premium_expires_at);
  if (!Number.isFinite(t)) return false;
  return t > Date.now();
}

/**
 * Helper: load plan và trả về isPremium
 * - Dùng trong AuthGate/App.tsx sau login hoặc khi onAuthStateChange
 */
export async function loadMyPlan(): Promise<{
  profile: Profile | null;
  isPremium: boolean;
}> {
  const profile = await getMyProfile();
  return {
    profile,
    isPremium: isPremiumActive(profile),
  };
}

/* =========================
   AUTH SUBSCRIBE
========================= */
/**
 * Subscribe auth state change để App tự cập nhật isPremium.
 * Returns unsubscribe() để cleanup trong useEffect.
 */
export function subscribeAuth(
  onChange: (event: string, session: Session | null) => void
) {
  // Nếu env thiếu thì vẫn tạo subscribe nhưng thường sẽ không có session.
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    onChange(event, session);
  });
  return () => data.subscription.unsubscribe();
}

/* =========================
   OPTIONAL: SIGN UP / SIGN IN wrappers
========================= */
export async function signInWithPassword(email: string, password: string) {
  assertSupabaseConfigured();
  return supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
}

export async function signUpWithPassword(email: string, password: string) {
  assertSupabaseConfigured();
  return supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  });
}

export async function signOut() {
  // Không throw nếu env thiếu
  if (!supabaseUrl || !supabaseAnonKey) return;
  await supabase.auth.signOut();
}
