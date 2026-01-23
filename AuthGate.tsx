import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = { children: React.ReactNode };

export function AuthGate({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Đang tải...</div>;

  // Chưa đăng nhập => hiện màn login
  if (!session) return <LoginScreen />;

  return <>{children}</>;
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const signIn = async () => {
    setBusy(true);
    setErr(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) setErr(error.message);
    setBusy(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16 }}>
      <div style={{ width: 360, maxWidth: "100%", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 16 }}>
        <h2>Đăng nhập</h2>

        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, margin: "6px 0 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
          placeholder="email"
        />

        <label>Mật khẩu</label>
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, margin: "6px 0 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.2)" }}
          placeholder="password"
        />

        {err && <div style={{ background: "#ffe8e8", padding: 10, borderRadius: 8, marginBottom: 12 }}>Lỗi: {err}</div>}

        <button
          onClick={signIn}
          disabled={busy}
          style={{ width: "100%", padding: 12, borderRadius: 10, fontWeight: 700 }}
        >
          {busy ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div style={{ marginTop: 12, opacity: 0.7, fontSize: 13 }}>
          (Tài khoản được tạo trong Supabase Authentication → Users)
        </div>
      </div>
    </div>
  );
}
