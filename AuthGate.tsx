import { useEffect, useMemo, useState } from "react";
import App from "./App";
import { supabase } from "./lib/supabase";
import { LoginCard } from "./components/LoginCard";

function viAuthError(message?: string) {
  const m = (message || "").toLowerCase();

  if (m.includes("invalid login credentials")) return "Email hoặc mật khẩu không đúng.";
  if (m.includes("email not confirmed")) return "Email chưa được xác minh. Vui lòng kiểm tra hộp thư để xác nhận.";
  if (m.includes("user not found")) return "Không tìm thấy tài khoản. Vui lòng kiểm tra lại email.";
  if (m.includes("too many requests")) return "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.";
  if (m.includes("password")) return "Mật khẩu không hợp lệ. Vui lòng kiểm tra lại.";
  return message || "Thao tác thất bại. Vui lòng thử lại.";
}

type Mode = "login" | "recovery";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 " +
  "text-[15px] font-medium text-white placeholder:text-white/60 " +
  "outline-none transition " +
  "focus:border-sky-400 focus:bg-white/12 focus:ring-4 focus:ring-sky-400/25";

function hasRecoveryInUrl() {
  const h = (window.location.hash || "").toLowerCase();
  const s = window.location.search || "";
  return h.includes("type=recovery") || h.includes("recovery") || s.toLowerCase().includes("type=recovery");
}

function clearUrlHashAndQuery() {
  try {
    const clean = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, clean);
  } catch {
    // ignore
  }
}

export default function AuthGate() {
  const [session, setSession] = useState<any>(null);
  const [mode, setMode] = useState<Mode>("login");

  // login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // remember
  const [remember, setRemember] = useState(true);

  // recovery states
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    // load remember choice
    try {
      const v = localStorage.getItem("remember_login");
      if (v !== null) setRemember(v === "1");
    } catch {}

    // If URL already indicates recovery, switch mode immediately
    if (hasRecoveryInUrl()) setMode("recovery");

    // Get initial session (Supabase can parse recovery tokens from URL)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);

      // Supabase emits PASSWORD_RECOVERY when user arrives from recovery link
      if (event === "PASSWORD_RECOVERY") {
        setMode("recovery");
        setError("");
        setInfo("Vui lòng đặt mật khẩu mới để hoàn tất khôi phục.");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Optional: simulate session-only when remember = false
  useEffect(() => {
    const handler = async () => {
      try {
        const v = localStorage.getItem("remember_login");
        if (v === "0") await supabase.auth.signOut();
      } catch {}
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const canSubmitLogin = useMemo(() => {
    const e = email.trim();
    return e.length > 3 && e.includes("@") && password.length >= 6 && !loading;
  }, [email, password, loading]);

  const onSubmitLogin = async () => {
    setInfo("");
    setError("");

    if (!canSubmitLogin) {
      setError("Vui lòng nhập email hợp lệ và mật khẩu (tối thiểu 6 ký tự).");
      return;
    }

    setLoading(true);

    try {
      localStorage.setItem("remember_login", remember ? "1" : "0");
    } catch {}

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) setError(viAuthError(error.message));
    setLoading(false);
  };

  const onForgotPassword = async () => {
    setError("");
    setInfo("");

    const e = email.trim();
    if (!e || !e.includes("@")) {
      setError("Vui lòng nhập email trước, sau đó bấm “Quên mật khẩu?”.");
      return;
    }

    setLoading(true);

    // Không cần router: đưa về đúng origin, AuthGate sẽ tự detect recovery
    const redirectTo = window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(e, { redirectTo });

    if (error) setError(viAuthError(error.message));
    else setInfo("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (kể cả Spam).");

    setLoading(false);
  };

  const canSubmitRecovery = useMemo(() => {
    return (
      newPw.length >= 8 &&
      newPw === newPw2 &&
      !loading
    );
  }, [newPw, newPw2, loading]);

  const onSubmitRecovery = async () => {
    setError("");
    setInfo("");

    if (newPw.length < 8) {
      setError("Mật khẩu mới cần tối thiểu 8 ký tự.");
      return;
    }
    if (newPw !== newPw2) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);

    // Update password for the currently authenticated recovery session
    const { error } = await supabase.auth.updateUser({ password: newPw });

    if (error) {
      setError(viAuthError(error.message));
      setLoading(false);
      return;
    }

    // Clean URL + sign out to force fresh login (ổn định nhất cho sản phẩm thương mại)
    clearUrlHashAndQuery();
    await supabase.auth.signOut();

    setNewPw("");
    setNewPw2("");
    setMode("login");
    setInfo("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
    setLoading(false);
  };

  // Nếu đang ở mode login và đã có session bình thường thì vào App
  // (Nếu Bác Sĩ muốn vẫn cho vào App luôn sau đăng nhập)
  if (session && mode !== "recovery") return <App />;

  return (
    <div className="min-h-screen w-full font-sans text-slate-100">
      {/* Background premium dễ nhìn */}
      <div className="fixed inset-0 -z-10 bg-slate-950" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(900px_circle_at_50%_35%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(700px_circle_at_20%_80%,rgba(34,197,94,0.10),transparent_55%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        {mode === "login" ? (
          <LoginCard
            brandTitle="Tài Chính Thông Minh | Premium"
            brandSubtitle="Đăng nhập để quản lý dòng tiền, kỷ luật chi tiêu và chiến lược tài sản"
            email={email}
            password={password}
            remember={remember}
            loading={loading}
            error={error}
            info={info}
            onEmailChange={(v) => {
              setEmail(v);
              if (error) setError("");
              if (info) setInfo("");
            }}
            onPasswordChange={(v) => {
              setPassword(v);
              if (error) setError("");
              if (info) setInfo("");
            }}
            onRememberChange={(v) => setRemember(v)}
            onSubmit={onSubmitLogin}
            onForgotPassword={onForgotPassword}
          />
        ) : (
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/10 grid place-items-center border border-white/10">
                <span className="text-lg font-bold">🔒</span>
              </div>
              <h1 className="text-2xl font-bold">Đặt mật khẩu mới</h1>
              <p className="mt-1 text-sm text-white/70">
                Vui lòng đặt mật khẩu mới để hoàn tất khôi phục.
              </p>
            </div>

            <label className="block text-sm font-semibold text-white/90">Mật khẩu mới</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Tối thiểu 8 ký tự"
              value={newPw}
              onChange={(e) => {
                setNewPw(e.target.value);
                if (error) setError("");
                if (info) setInfo("");
              }}
              autoComplete="new-password"
            />

            <label className="mt-5 block text-sm font-semibold text-white/90">Nhập lại mật khẩu</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Nhập lại để xác nhận"
              value={newPw2}
              onChange={(e) => {
                setNewPw2(e.target.value);
                if (error) setError("");
                if (info) setInfo("");
              }}
              autoComplete="new-password"
            />

            {!!info && (
              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {info}
              </div>
            )}

            {!!error && (
              <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={onSubmitRecovery}
              disabled={!canSubmitRecovery}
              className="mt-6 w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white
                         shadow-[0_10px_30px_rgba(56,189,248,0.25)]
                         hover:bg-sky-400 active:bg-sky-600
                         focus:outline-none focus:ring-4 focus:ring-sky-400/30
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </button>

            <button
              type="button"
              onClick={() => {
                clearUrlHashAndQuery();
                setMode("login");
                setError("");
                // Không xoá info để user thấy hướng dẫn nếu cần
              }}
              className="mt-3 w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white/85 hover:bg-white/10"
            >
              Quay lại đăng nhập
            </button>

            <p className="mt-4 text-center text-xs text-white/60">
              Lưu ý: Sau khi đổi mật khẩu, hệ thống sẽ yêu cầu đăng nhập lại.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
