import { useEffect, useMemo, useState } from "react";
import App from "./App";
import { supabase } from "./lib/supabase";
import { LoginCard } from "./components/LoginCard";

function viAuthError(message?: string) {
  const m = (message || "").toLowerCase();

  // Các case phổ biến của Supabase Auth
  if (m.includes("invalid login credentials")) return "Email hoặc mật khẩu không đúng.";
  if (m.includes("email not confirmed")) return "Email chưa được xác minh. Vui lòng kiểm tra hộp thư để xác nhận.";
  if (m.includes("user not found")) return "Không tìm thấy tài khoản. Vui lòng kiểm tra lại email.";
  if (m.includes("too many requests")) return "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.";
  if (m.includes("password")) return "Mật khẩu không hợp lệ. Vui lòng kiểm tra lại.";

  // fallback
  return message || "Đăng nhập thất bại. Vui lòng thử lại.";
}

export default function AuthGate() {
  const [session, setSession] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    // load remember choice
    try {
      const v = localStorage.getItem("remember_login");
      if (v !== null) setRemember(v === "1");
    } catch {}

    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));

    return () => subscription.unsubscribe();
  }, []);

  const canSubmit = useMemo(() => {
    const e = email.trim();
    return e.length > 3 && e.includes("@") && password.length >= 6 && !loading;
  }, [email, password, loading]);

  const onSubmit = async () => {
    setInfo("");
    setError("");

    if (!canSubmit) {
      setError("Vui lòng nhập email hợp lệ và mật khẩu (tối thiểu 6 ký tự).");
      return;
    }

    setLoading(true);

    // remember choice persists
    try {
      localStorage.setItem("remember_login", remember ? "1" : "0");
    } catch {}

    // nếu không muốn nhớ đăng nhập: set session "ngắn"
    // Supabase JS mặc định đã persist session theo storage.
    // Ở đây, ta xử lý đơn giản: nếu remember=false, sẽ signOut khi đóng tab bằng beforeunload.
    // (Cách “chuẩn” hơn là dùng custom storage; ta giữ an toàn, ít đụng sâu.)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) setError(viAuthError(error.message));
    setLoading(false);
  };

  // Nếu remember=false: signOut khi rời trang (mô phỏng session-only)
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

  const onForgotPassword = async () => {
    setError("");
    setInfo("");

    const e = email.trim();
    if (!e || !e.includes("@")) {
      setError("Vui lòng nhập email trước, sau đó bấm “Quên mật khẩu?”.");
      return;
    }

    setLoading(true);

    // Lưu ý: URL này phải là route hợp lệ trong app của Bác Sĩ để người dùng đặt lại mật khẩu.
    // Nếu chưa có route, vẫn gửi mail được nhưng link cần đúng để UX tốt.
    const redirectTo = `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(e, { redirectTo });

    if (error) {
      setError(viAuthError(error.message));
    } else {
      setInfo("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (kể cả Spam).");
    }

    setLoading(false);
  };

  if (session) return <App />;

  return (
    <div className="min-h-screen w-full font-sans text-slate-100">
      {/* Background premium dễ nhìn */}
      <div className="fixed inset-0 -z-10 bg-slate-950" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(900px_circle_at_50%_35%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(700px_circle_at_20%_80%,rgba(34,197,94,0.10),transparent_55%)]" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
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
          onSubmit={onSubmit}
          onForgotPassword={onForgotPassword}
        />
      </div>
    </div>
  );
}
