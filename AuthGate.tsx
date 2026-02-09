// AuthGate.tsx
import { useEffect, useMemo, useState } from "react";
import App from "./App";
import { supabase } from "./lib/supabaseClient";
import { LoginCard } from "./components/LoginCard";

function viAuthError(message?: string) {
  const m = (message || "").toLowerCase();

  if (m.includes("invalid login credentials")) return "Email hoặc mật khẩu không đúng.";
  if (m.includes("email not confirmed"))
    return "Email chưa được xác minh. Vui lòng kiểm tra hộp thư để xác nhận.";
  if (m.includes("user not found")) return "Không tìm thấy tài khoản. Vui lòng kiểm tra lại email.";
  if (m.includes("too many requests")) return "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.";
  if (m.includes("password")) return "Mật khẩu không hợp lệ. Vui lòng kiểm tra lại.";
  if (m.includes("already registered")) return "Email này đã được đăng ký. Vui lòng đăng nhập.";
  if (m.includes("user already registered")) return "Email này đã được đăng ký. Vui lòng đăng nhập.";
  return message || "Thao tác thất bại. Vui lòng thử lại.";
}

type Mode = "login" | "signup" | "recovery";

const inputClass =
  "mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 " +
  "text-[15px] font-medium text-white placeholder:text-white/60 " +
  "outline-none transition " +
  "focus:border-sky-400 focus:bg-white/12 focus:ring-4 focus:ring-sky-400/25";

function hasRecoveryInUrl() {
  const h = (window.location.hash || "").toLowerCase();
  const s = window.location.search || "";
  return (
    h.includes("type=recovery") ||
    h.includes("recovery") ||
    s.toLowerCase().includes("type=recovery")
  );
}

/**
 * ✅ Detect confirm-email / magic-link callback
 * - Hash flow: #access_token=...&type=signup (hoặc magiclink)
 * - PKCE flow: ?code=...
 */
function hasAuthCallbackInUrl() {
  const h = (window.location.hash || "").toLowerCase();
  const s = (window.location.search || "").toLowerCase();
  return (
    h.includes("access_token=") ||
    h.includes("refresh_token=") ||
    h.includes("type=signup") ||
    h.includes("type=magiclink") ||
    s.includes("code=") ||
    s.includes("type=signup") ||
    s.includes("type=magiclink")
  );
}

function clearUrlHashAndQuery() {
  try {
    const clean = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, clean);
  } catch {
    // ignore
  }
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [mode, setMode] = useState<Mode>("login");

  // login/signup states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // confirm password (for signup)
  const [password2, setPassword2] = useState("");

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
    } catch { }

    // If URL already indicates recovery, switch mode immediately
    if (hasRecoveryInUrl()) setMode("recovery");

    // ✅ 1) Handle confirm email / magic link callback (hash or PKCE)
    const runAuthCallback = async () => {
      if (!hasAuthCallbackInUrl()) return;

      try {
        setLoading(true);
        setError("");
        setInfo("Đang xác nhận phiên đăng nhập...");

        // PKCE flow uses ?code=
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // Hash flow: Supabase will parse tokens; getSession() will reflect it
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (data?.session) {
          setSession(data.session);
          setInfo("Xác nhận email thành công. Bạn đã được đăng nhập.");
          setMode("login");
        } else {
          setInfo("Đã xác nhận. Vui lòng đăng nhập để tiếp tục.");
          setMode("login");
        }
      } catch (e: any) {
        setError(viAuthError(e?.message || "Xác nhận email thất bại."));
      } finally {
        clearUrlHashAndQuery();
        setLoading(false);
      }
    };

    runAuthCallback();

    // ✅ 2) Get initial session (Supabase can parse tokens from URL as well)
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
      } catch { }
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
    } catch { }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) setError(viAuthError(error.message));
    setLoading(false);
  };

  // ====== SIGNUP (NEW) ======
  const canSubmitSignup = useMemo(() => {
    const e = email.trim();
    const okEmail = e.length > 3 && e.includes("@");
    const okPw = password.length >= 6;
    const okMatch = password === password2 && password2.length >= 6;
    return okEmail && okPw && okMatch && !loading;
  }, [email, password, password2, loading]);

  const onSubmitSignup = async () => {
    setInfo("");
    setError("");

    const e = email.trim().toLowerCase();
    if (!e || !e.includes("@")) {
      setError("Vui lòng nhập email hợp lệ.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu cần tối thiểu 6 ký tự.");
      return;
    }
    if (password !== password2) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);

    // ✅ redirectTo: quay lại đúng domain hiện tại (Vercel/Local đều đúng)
    // Dùng / để AuthGate bắt callback theo hash/code ở cùng trang.
    const redirectTo = window.location.origin;

    const { data, error } = await supabase.auth.signUp({
      email: e,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setError(viAuthError(error.message));
      setLoading(false);
      return;
    }

    /**
     * Nếu project đang bật Confirm Email:
     * - data.session sẽ null -> user phải xác minh email
     * Nếu tắt Confirm Email:
     * - data.session có ngay -> vào App luôn
     */
    if (data?.session) {
      setInfo("Tạo tài khoản thành công. Đang đăng nhập...");
      setMode("login");
      setPassword2("");
    } else {
      setInfo("Đã tạo tài khoản. Vui lòng kiểm tra email để xác minh, sau đó quay lại đăng nhập.");
      setMode("login");
      setPassword("");
      setPassword2("");
    }

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
    return newPw.length >= 8 && newPw === newPw2 && !loading;
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

  // Nếu đang ở mode login/signup và đã có session bình thường thì vào App
  if (session && mode !== "recovery") return <App />;

  return (
    <div className="min-h-screen w-full font-sans text-slate-100 overflow-x-hidden">
      {/* Background premium cao cấp */}
      <div className="fixed inset-0 -z-10 bg-slate-950" />
      <div className="fixed inset-0 -z-10 opacity-30 bg-[radial-gradient(1000px_circle_at_50%_40%,rgba(197,160,89,0.15),transparent_60%),radial-gradient(800px_circle_at_10%_80%,rgba(56,189,248,0.1),transparent_50%)]" />
      <div className="fixed inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 md:py-20 lg:py-24">
        {mode === "login" ? (
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
            <LoginCard
              brandTitle="Smart Finance Pro"
              brandSubtitle="Hệ thống quản trị dòng tiền & Kỷ luật tài chính"
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

            {/* CTA tạo tài khoản */}
            <div className="mt-6 rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl shadow-premium group hover:border-luxury-gold/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.3em] mb-1">New Member?</div>
                  <div className="text-[13px] text-slate-400 font-bold">Bắt đầu miễn phí ngay hôm nay</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setInfo("");
                    setPassword2("");
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-luxury-gold hover:text-black transition-all group-hover:shadow-luxury"
                >
                  <span className="text-xl font-black">+</span>
                </button>
              </div>
            </div>
          </div>
        ) : mode === "signup" ? (
          <div className="w-full max-w-md rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="mb-10 text-center group">
              <div className="mx-auto mb-6 h-16 w-16 rounded-[1.5rem] bg-luxury-gold grid place-items-center shadow-luxury border-2 border-black transition-transform duration-700 group-hover:rotate-[360deg]">
                <span className="text-2xl font-black text-black">+</span>
              </div>
              <h1 className="text-2xl font-black text-white italic tracking-tighter">Gia nhập Hệ thống</h1>
              <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Khởi tạo tài khoản quản trị</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                    if (info) setInfo("");
                  }}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Mật khẩu tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                    if (info) setInfo("");
                  }}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Confirm Password</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Xác nhận lại mật khẩu"
                  value={password2}
                  onChange={(e) => {
                    setPassword2(e.target.value);
                    if (error) setError("");
                    if (info) setInfo("");
                  }}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {!!info && (
              <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-xs font-bold text-emerald-400">
                {info}
              </div>
            )}

            {!!error && (
              <div className="mt-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-xs font-bold text-rose-400">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={onSubmitSignup}
              disabled={!canSubmitSignup}
              className="mt-10 w-full rounded-2xl bg-white text-black py-4 text-xs font-black uppercase tracking-[0.3em] shadow-luxury hover:bg-luxury-gold transition-all duration-500 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Tạo tài khoản"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setInfo("");
                setPassword2("");
              }}
              className="mt-4 w-full text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors py-2"
            >
              Quay lại Đăng nhập
            </button>

            <p className="mt-6 text-center text-[9px] font-medium text-slate-600 leading-relaxed italic">
              Lưu ý: Bạn có thể cần xác minh email để kích hoạt tài khoản hoàn toàn.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 h-16 w-16 rounded-[1.5rem] bg-luxury-gold grid place-items-center shadow-luxury border-2 border-black">
                <span className="text-2xl font-black text-black">PW</span>
              </div>
              <h1 className="text-2xl font-black text-white italic tracking-tighter">Đặt mật khẩu mới</h1>
              <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Hardware-level security update</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">New Password</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Mật khẩu mới (min 8 ký tự)"
                  value={newPw}
                  onChange={(e) => {
                    setNewPw(e.target.value);
                    if (error) setError("");
                    if (info) setInfo("");
                  }}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="Nhập lại mật khẩu mới"
                  value={newPw2}
                  onChange={(e) => {
                    setNewPw2(e.target.value);
                    if (error) setError("");
                    if (info) setInfo("");
                  }}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {!!info && (
              <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-xs font-bold text-emerald-400">
                {info}
              </div>
            )}

            {!!error && (
              <div className="mt-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-xs font-bold text-rose-400">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={onSubmitRecovery}
              disabled={!canSubmitRecovery}
              className="mt-10 w-full rounded-2xl bg-white text-black py-4 text-xs font-black uppercase tracking-[0.3em] shadow-luxury hover:bg-luxury-gold transition-all duration-500 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Đang cập nhật..." : "Xác nhận mật khẩu"}
            </button>

            <button
              type="button"
              onClick={() => {
                clearUrlHashAndQuery();
                setMode("login");
                setError("");
              }}
              className="mt-4 w-full text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors py-2"
            >
              Hủy và Quay lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
