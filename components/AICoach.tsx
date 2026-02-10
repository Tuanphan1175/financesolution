// components/AICoach.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  Transaction,
  Asset,
  Liability,
  JourneyProgress,
  GoldenRule,
} from "../types";
import { SparklesIcon, ArrowUpIcon } from "./Icons";
import { aiCoachSend, buildFinancialContextText } from "../lib/aiCoach";

/* =========================
   TYPES
========================= */
type Role = "user" | "model";

interface Message {
  id: string;
  role: Role;
  text: string;
  ts: number;
}

export interface AICoachProps {
  transactions?: Transaction[];
  assets?: Asset[];
  liabilities?: Liability[];
  journeyProgress?: JourneyProgress;
  goldenRules?: GoldenRule[];

  // Optional gating (nếu App có Premium)
  isPremium?: boolean;
  setIsPricingModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

/* =========================
   HELPERS
========================= */
function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/* =========================
   COMPONENT
========================= */
export const AICoach: React.FC<AICoachProps> = ({
  transactions = [],
  assets = [],
  liabilities = [],
  journeyProgress = { completedDays: [], lastUpdate: new Date().toISOString() },
  goldenRules = [],
  isPremium = false,
  setIsPricingModalOpen = () => { },
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const didInit = useRef<boolean>(false);

  const financialContext = useMemo(
    () => buildFinancialContextText({
      transactions,
      assets,
      liabilities,
      journeyProgress,
      goldenRules
    }),
    [transactions, assets, liabilities, journeyProgress, goldenRules]
  );

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const hasKey = Boolean(apiKey && apiKey.trim().length > 10);

  const locked = isPremium === false;

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const hello: Message = {
      id: makeId("m"),
      role: "model",
      ts: Date.now(),
      text:
        "Chào bạn. Tôi là AI Financial Coach.\n\n" +
        "Bạn có thể hỏi về: dòng tiền, kỷ luật chi tiêu, trả nợ, tích lũy, hoặc chiến lược tài sản.\n" +
        "Tôi sẽ trả lời theo hướng thực chiến và kèm bước hành động.",
    };
    setMessages([hello]);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  async function handleSend() {
    const userText = input.trim();
    if (!userText || isLoading) return;

    // Premium gating
    if (locked) {
      const userMsg: Message = {
        id: makeId("u"),
        role: "user",
        text: userText,
        ts: Date.now(),
      };
      const modelMsg: Message = {
        id: makeId("a"),
        role: "model",
        ts: Date.now(),
        text:
          "Tính năng AI Coach đang thuộc gói Premium.\n" +
          "Bạn bấm “Nâng cấp” để mở khóa (hoặc bật Dev Toggle VIP nếu đang dev).",
      };

      setMessages((prev) => [...prev, userMsg, modelMsg]);
      setInput("");
      if (setIsPricingModalOpen) setIsPricingModalOpen(true);
      return;
    }

    const userMsg: Message = {
      id: makeId("u"),
      role: "user",
      text: userText,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));

      const result = await aiCoachSend({
        userText,
        history,
        context: {
          transactions,
          assets,
          liabilities,
          journeyProgress,
          goldenRules
        }
      });

      const modelMsg: Message = {
        id: makeId("a"),
        role: "model",
        text: result.text,
        ts: Date.now(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      const modelMsg: Message = {
        id: makeId("e"),
        role: "model",
        ts: Date.now(),
        text: `Lỗi kết nối AI: ${err instanceof Error ? err.message : String(err)}`,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  const headerSub = locked
    ? "Premium đang khóa"
    : hasKey
      ? "Gemini đang hoạt động"
      : "Demo mode (chưa có API key)";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] min-h-[600px] rounded-3xl border border-slate-800 bg-slate-950/40 overflow-hidden shadow-premium">
      {/* HEADER */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-luxury-gold/90 flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-black" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-black tracking-tight text-lg truncate">
              AI Financial Coach
            </div>
            <div className="text-slate-400 text-xs">{headerSub}</div>
          </div>

          {locked && (
            <button
              type="button"
              onClick={() => setIsPricingModalOpen?.(true)}
              className="ml-auto text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/25 hover:bg-luxury-gold/25 transition"
            >
              Nâng cấp
            </button>
          )}
        </div>
      </div>

      {/* BODY */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {/* Context card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-slate-200 text-sm whitespace-pre-wrap">
          <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.25em] mb-2">
            Context (tự động)
          </div>
          {financialContext}
          {journeyProgress ? (
            <div className="mt-3 text-slate-500 text-xs">
              Ghi chú: Có dữ liệu hành trình; nếu bạn muốn, tôi sẽ gợi ý “việc nhỏ mỗi ngày”.
            </div>
          ) : null}
        </div>

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={[
                "max-w-[88%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed",
                m.role === "user"
                  ? "bg-luxury-gold text-black font-semibold"
                  : "bg-slate-900/70 border border-slate-800 text-slate-100",
              ].join(" ")}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="text-slate-400 text-sm animate-pulse">
            Đang phân tích dữ liệu và lập khuyến nghị...
          </div>
        ) : null}
      </div>

      {/* INPUT */}
      <div className="shrink-0 px-5 py-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder='Ví dụ: "Tháng này chi vượt, nên cắt gì trước?"'
            className="flex-1 rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-luxury-gold/40"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 rounded-2xl bg-luxury-gold text-black flex items-center justify-center disabled:opacity-40"
            aria-label="Gửi"
          >
            <ArrowUpIcon className="h-6 w-6 rotate-90" />
          </button>
        </div>

        {!locked && !hasKey ? (
          <div className="mt-3 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-luxury-gold/20">
            <p className="font-bold text-luxury-gold mb-1">AI Coach đang ở chế độ Demo</p>
            <p className="mb-2">Để dùng AI thật, hãy đảm bảo bạn đã:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Đặt <b>VITE_GEMINI_API_KEY</b> trong file <b>.env.local</b></li>
              <li><b>KHỞI ĐỘNG LẠI</b> server (chạy lại lệnh npm run dev)</li>
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  );
};
