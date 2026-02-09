import React, { useMemo, useState } from "react";

type LoginCardProps = {
  brandTitle?: string;
  brandSubtitle?: string;

  email: string;
  password: string;

  loading?: boolean;
  error?: string;
  info?: string;

  remember?: boolean;

  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;

  onRememberChange: (v: boolean) => void;

  onSubmit: () => void;
  onForgotPassword: () => void;
};

export const LoginCard: React.FC<LoginCardProps> = ({
  brandTitle = "Tài Chính Thông Minh | Premium",
  brandSubtitle = "Đăng nhập để quản lý dòng tiền và chiến lược tài sản",
  email,
  password,
  loading = false,
  error = "",
  info = "",
  remember = true,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  onForgotPassword,
}) => {
  const [showPw, setShowPw] = useState(false);

  const inputClass = useMemo(
    () =>
      "mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 " +
      "text-[15px] font-medium text-white placeholder:text-white/60 " +
      "outline-none transition " +
      "focus:border-sky-400 focus:bg-white/12 focus:ring-4 focus:ring-sky-400/25",
    []
  );

  const primaryBtn =
    "mt-8 w-full rounded-2xl bg-white text-black py-4 text-xs font-black uppercase tracking-[0.3em] " +
    "shadow-luxury transition-all duration-500 " +
    "hover:bg-luxury-gold active:scale-95 " +
    "focus:outline-none focus:ring-4 focus:ring-luxury-gold/30 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const ghostBtn =
    "rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all";

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div
      className="w-full max-w-md rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      onKeyDown={onKeyDown}
    >
      {/* Header / Branding */}
      <div className="mb-10 text-center group">
        <div className="mx-auto mb-6 h-16 w-16 rounded-[1.5rem] bg-luxury-gold grid place-items-center shadow-luxury border-2 border-black transition-transform duration-700 group-hover:rotate-[360deg]">
          <span className="text-2xl font-black text-black">$</span>
        </div>
        <h1 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-luxury-gold transition-colors">{brandTitle}</h1>
        <p className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{brandSubtitle}</p>
      </div>

      <div className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
          <input
            type="email"
            className={inputClass}
            placeholder="vd: phananhtuanbs@gmail.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            autoComplete="email"
            inputMode="email"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2 ml-1">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[10px] font-black text-luxury-gold uppercase tracking-widest hover:text-white transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>

          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              className={inputClass + " pr-16"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className={"absolute right-2 top-[10px] " + ghostBtn}
              aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPw ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-3 text-[11px] font-bold text-slate-400 select-none cursor-pointer group">
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${remember ? 'bg-luxury-gold border-luxury-gold' : 'border-slate-800 bg-black/20 group-hover:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => onRememberChange(e.target.checked)}
                className="hidden"
              />
              {remember && <div className="w-2 h-2 bg-black rounded-sm" />}
            </div>
            Nhớ tôi
          </label>

          <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
            Press Enter
          </div>
        </div>
      </div>

      {/* Info / Error */}
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

      {/* Submit */}
      <button type="button" onClick={onSubmit} disabled={loading} className={primaryBtn}>
        {loading ? "Đang xử lý..." : "Bắt đầu hành trình"}
      </button>

      <p className="mt-8 text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
        Verified by Supabase Security
      </p>
    </div>
  );
};
