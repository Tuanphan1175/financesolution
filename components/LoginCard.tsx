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
    "mt-6 w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white " +
    "shadow-[0_10px_30px_rgba(56,189,248,0.25)] " +
    "hover:bg-sky-400 active:bg-sky-600 " +
    "focus:outline-none focus:ring-4 focus:ring-sky-400/30 " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const ghostBtn =
    "rounded-lg px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10";

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div
      className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
      onKeyDown={onKeyDown}
    >
      {/* Header / Branding */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/10 grid place-items-center border border-white/10">
          <span className="text-lg font-bold">$</span>
        </div>
        <h1 className="text-2xl font-bold">{brandTitle}</h1>
        <p className="mt-1 text-sm text-white/70">{brandSubtitle}</p>
      </div>

      {/* Email */}
      <label className="block text-sm font-semibold text-white/90">Email</label>
      <input
        type="email"
        className={inputClass}
        placeholder="vd: phananhtuanbs@gmail.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        autoComplete="email"
        inputMode="email"
      />

      {/* Password */}
      <div className="mt-5 flex items-center justify-between">
        <label className="block text-sm font-semibold text-white/90">Mật khẩu</label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs font-semibold text-sky-300 hover:text-sky-200"
        >
          Quên mật khẩu?
        </button>
      </div>

      <div className="relative">
        <input
          type={showPw ? "text" : "password"}
          className={inputClass + " pr-14"}
          placeholder="Nhập mật khẩu"
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

      {/* Remember */}
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-white/80 select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => onRememberChange(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/10"
          />
          Nhớ đăng nhập
        </label>

        <div className="text-xs text-white/55">
          Enter để đăng nhập
        </div>
      </div>

      {/* Info / Error */}
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

      {/* Submit */}
      <button type="button" onClick={onSubmit} disabled={loading} className={primaryBtn}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <p className="mt-4 text-center text-xs text-white/60">
        Tài khoản được tạo trong Supabase Authentication → Users
      </p>
    </div>
  );
};
