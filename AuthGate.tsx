import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import App from "./App";

export default function AuthGate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session) return <App />;

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 " +
    "text-[15px] font-medium text-white placeholder:text-white/60 " +
    "outline-none transition " +
    "focus:border-sky-400 focus:ring-4 focus:ring-sky-400/25";

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-slate-950" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(900px_circle_at_50%_35%,rgba(56,189,248,0.18),transparent_55%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

      {/* Card */}
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-center mb-6">
          Đăng nhập hệ thống
        </h1>

        <label className="text-sm font-semibold text-white/90">Email</label>
        <input
          type="email"
          className={inputClass}
          placeholder="vd: phananhtuanbs@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mt-5 block text-sm font-semibold text-white/90">
          Mật khẩu
        </label>
        <input
          type="password"
          className={inputClass}
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="mt-4 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold
                     hover:bg-sky-400 active:bg-sky-600
                     focus:ring-4 focus:ring-sky-400/30
                     disabled:opacity-60"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="mt-4 text-center text-xs text-white/60">
          Tài khoản được tạo trong Supabase Authentication → Users
        </p>
      </div>
    </div>
  );
}
