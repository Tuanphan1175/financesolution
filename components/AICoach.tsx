import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Transaction, Asset, Liability, JourneyProgress, GoldenRule } from "../types";
import { SparklesIcon, ArrowUpIcon } from "./Icons";

// =========================
// TYPES
// =========================
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
}

// =========================
// HELPERS
// =========================
const fmtMoney = (v: number) => (Number.isFinite(v) ? Math.round(v) : 0).toLocaleString("vi-VN");

function safeSum(nums: number[]) {
  return nums.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
}

function toShortDateISO(d: Date) {
  return d.toISOString().split("T")[0];
}

function monthRangeISO(now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start: toShortDateISO(start), end: toShortDateISO(end) };
}

function isWithinISO(dateISO: string, startISO: string, endISO: string) {
  return dateISO >= startISO && dateISO < endISO;
}

function buildFinancialContext(
  transactions: Transaction[],
  assets: Asset[],
  liabilities: Liability[],
  goldenRules: GoldenRule[]
) {
  const { start, end } = monthRangeISO(new Date());

  const txThisMonth = transactions.filter((t) => {
    const d = String(t.date || "");
    return d && isWithinISO(d, start, end);
  });

  const incomeThisMonth = safeSum(txThisMonth.filter((t) => t.type === "income").map((t) => t.amount));
  const expenseThisMonth = safeSum(txThisMonth.filter((t) => t.type === "expense").map((t) => t.amount));
  const cashflowThisMonth = incomeThisMonth - expenseThisMonth;

  const totalAssets = safeSum(assets.map((a) => a.value));
  const totalLiabilities = safeSum(liabilities.map((l) => l.amount));
  const netWorth = totalAssets - totalLiabilities;

  const ccDebt = safeSum(liabilities.filter((l) => l.type === "credit_card").map((l) => l.amount));
  const loanDebt = safeSum(liabilities.filter((l) => l.type === "loan" || l.type === "mortgage").map((l) => l.amount));

  const rulesTotal = goldenRules.length;
  const rulesOk = goldenRules.filter((r) => r.isCompliant).length;
  const rulesRate = rulesTotal > 0 ? Math.round((rulesOk / rulesTotal) * 100) : null;

  // “6 chiếc lọ” gợi ý theo thu nhập tháng này (nếu có)
  const jars =
    incomeThisMonth > 0
      ? {
          needs55: Math.round(incomeThisMonth * 0.55),
          freedom10: Math.round(incomeThisMonth * 0.1),
          edu10: Math.round(incomeThisMonth * 0.1),
          play10: Math.round(incomeThisMonth * 0.1),
          emergency10: Math.round(incomeThisMonth * 0.1),
          give5: Math.round(incomeThisMonth * 0.05),
        }
      : null;

  const context = [
    `DỮ LIỆU TÀI CHÍNH (tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}):`,
    `- Thu nhập tháng: ${fmtMoney(incomeThisMonth)} đ`,
    `- Chi tiêu tháng: ${fmtMoney(expenseThisMonth)} đ`,
    `- Dòng tiền ròng (cashflow): ${fmtMoney(cashflowThisMonth)} đ`,
    ``,
    `TÀI SẢN & NỢ:`,
    `- Tổng tài sản: ${fmtMoney(totalAssets)} đ`,
    `- Tổng nợ: ${fmtMoney(totalLiabilities)} đ`,
    `- Tài sản ròng: ${fmtMoney(netWorth)} đ`,
    `- Nợ thẻ tín dụng: ${fmtMoney(ccDebt)} đ`,
    `- Nợ vay/ thế chấp: ${fmtMoney(loanDebt)} đ`,
    ``,
    `KỶ LUẬT (Golden Rules): ${rulesTotal > 0 ? `${rulesOk}/${rulesTotal} (${rulesRate}%)` : "chưa có dữ liệu"}`,
    jars
      ? [
          ``,
          `GỢI Ý PHÂN BỔ 6 CHIẾC LỌ (theo thu nhập tháng hiện tại):`,
          `- 45% Nhu cầu: ${fmtMoney(jars.needs55)} đ`,
          `- 20% Tự do tài chính: ${fmtMoney(jars.freedom10)} đ`,
          `- 10% Giáo dục: ${fmtMoney(jars.edu10)} đ`,
          `- 10% Hưởng thụ: ${fmtMoney(jars.play10)} đ`,
          `- 10% Khẩn cấp: ${fmtMoney(jars.emergency10)} đ`,
          `- 5% Cho đi: ${fmtMoney(jars.give5)} đ`,
        ].join("\n")
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return context;
}

function buildSystemPrompt(financialContext: string) {
  return `
Bạn là AI Financial Coach – trợ lý tài chính cá nhân trong ứng dụng Tài Chính Thông Minh.

Cách xưng hô:
- Gọi người dùng là “bạn”
- Xưng là “tôi”

NGUYÊN TẮC TƯ VẤN (bắt buộc):
1) Ưu tiên DÒNG TIỀN DƯƠNG (+). Nếu cashflow âm → ưu tiên giảm chi + tăng thu + chặn nợ xấu.
2) Phân biệt TÀI SẢN vs TIÊU SẢN:
   - Tài sản: tạo dòng tiền/ tăng giá trị dài hạn.
   - Tiêu sản: tiêu tiền, hao mòn, rủi ro nợ tiêu dùng.
   → Nếu người dùng muốn mua tiêu sản khi cashflow yếu: CAN NGĂN QUYẾT LIỆT và đưa phương án thay thế.
3) “6 chiếc lọ” là khung kỷ luật: hướng dẫn áp dụng theo thu nhập thực tế.
4) Không hứa hẹn làm giàu nhanh. Không khuyến nghị lĩnh vực người dùng không hiểu.
5) Kết thúc câu trả lời luôn có:
   - 1 câu chốt (kết luận)
   - 3 việc làm ngay trong 7 ngày
   - 1 câu hỏi ngược để chẩn đoán tiếp.
6) Phong cách:
- Chuyên nghiệp, trung lập, đáng tin cậy
- Giống một Financial Coach cá nhân, không giống bác sĩ hay người quen.

DỮ LIỆU NGƯỜI DÙNG:
${financialContext}
`.trim();
}

function buildDemoReply(financialContext: string, userText: string) {
  // Demo mode: trả lời logic, không cần gọi API
  const lines: string[] = [];

  lines.push(`Em đã đọc câu hỏi: "${userText}"`);
  lines.push("");
  lines.push("Chốt 1 câu:");
  lines.push("- Ưu tiên đưa dòng tiền về dương và khóa các khoản “tiêu sản” trước khi nghĩ đến tối ưu đầu tư.");
  lines.push("");
  lines.push("3 việc làm ngay trong 7 ngày:");
  lines.push("1) Ghi lại 10 khoản chi nhỏ lẻ gần nhất → cắt 2 khoản không tạo giá trị (Latte factor).");
  lines.push("2) Áp quy tắc 6 chiếc lọ tối thiểu: trích 10% “Pay yourself first” ngay khi có thu nhập.");
  lines.push("3) Nếu đang có nợ tiêu dùng/lãi cao: lập kế hoạch trả nợ theo thứ tự lãi suất (cao → thấp).");
  lines.push("");
  lines.push("Câu hỏi ngược để chốt hướng đi:");
  lines.push("- Mục tiêu 90 ngày tới của bạn là: “tăng thu nhập” hay “giảm chi + trả nợ”?");
  lines.push("");
  lines.push("Dữ liệu em đang dựa vào:");
  lines.push(financialContext);

  return lines.join("\n");
}

function friendlyErrorMessage(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err ?? "Unknown error");
  const lower = msg.toLowerCase();

  if (lower.includes("429") || lower.includes("quota") || lower.includes("resource_exhausted")) {
    return "Hiện đang bị giới hạn quota (429). Bác Sĩ thử lại sau hoặc nâng hạn mức API. Tạm thời em chuyển sang chế độ Demo để vẫn tư vấn được.";
  }
  if (lower.includes("api key") || lower.includes("key") || lower.includes("permission")) {
    return "Em không gọi được AI vì API key/ quyền truy cập chưa đúng. Bác Sĩ kiểm tra VITE_GEMINI_API_KEY trong .env.local nhé.";
  }
  return `Lỗi kết nối AI: ${msg}`;
}

// =========================
// COMPONENT
// =========================
export const AICoach: React.FC<AICoachProps> = ({
  transactions = [],
  assets = [],
  liabilities = [],
  journeyProgress = {},
  goldenRules = [],
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [booted, setBooted] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const hasInitialized = useRef(false);

  const financialContext = useMemo(
    () => buildFinancialContext(transactions, assets, liabilities, goldenRules),
    [transactions, assets, liabilities, goldenRules]
  );

  const SYSTEM_PROMPT = useMemo(() => buildSystemPrompt(financialContext), [financialContext]);

  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  const hasKey = Boolean(apiKey && String(apiKey).trim().length > 10);

  useEffect(() => {
    // Auto “welcome” 1 lần
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const hello: Message = {
      id: `m_${Date.now()}`,
      role: "model",
      ts: Date.now(),
      text:
        "Chào Bác Sĩ. Em là AI Financial Coach.\n\nBác Sĩ cứ hỏi về: dòng tiền, kỷ luật chi tiêu, trả nợ, tích lũy, hoặc chiến lược tài sản.\nEm sẽ trả lời theo nguyên tắc thực chiến và có bước hành động.",
    };
    setMessages([hello]);
    setBooted(true);
  }, []);

  useEffect(() => {
    // autoscroll
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  async function callGemini(userText: string, history: Message[]) {
    if (!hasKey) {
      return buildDemoReply(financialContext, userText);
    }

    const genAI = new GoogleGenerativeAI(String(apiKey));
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Gemini chat history format
    const geminiHistory = [
      { role: "user" as const, parts: [{ text: SYSTEM_PROMPT }] },
      ...history
        .filter((m) => m.role === "user" || m.role === "model")
        .map((m) => ({
          role: (m.role === "user" ? "user" : "model") as const,
          parts: [{ text: m.text }],
        })),
    ];

    const chat = model.startChat({ history: geminiHistory });

    const result = await chat.sendMessage(userText);
    const text = result.response.text();
    return text?.trim() || "Em chưa nhận được nội dung trả lời. Bác Sĩ hỏi lại giúp em 1 câu ngắn hơn.";
  }

  async function handleSend() {
    const userText = input.trim();
    if (!userText || isLoading) return;

    const userMsg: Message = { id: `u_${Date.now()}`, role: "user", text: userText, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await callGemini(userText, [...messages, userMsg]);

      const modelMsg: Message = { id: `a_${Date.now()}`, role: "model", text: reply, ts: Date.now() };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      const note = friendlyErrorMessage(err);
      const fallback = buildDemoReply(financialContext, userText);

      const modelMsg: Message = {
        id: `e_${Date.now()}`,
        role: "model",
        ts: Date.now(),
        text: `${note}\n\n-----\nDEMO COACH (fallback):\n${fallback}`,
      };
      setMessages((prev) => [...prev, modelMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  const headerSub = hasKey ? "Gemini đang hoạt động" : "Demo mode (chưa có API key)";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] min-h-[600px] rounded-3xl border border-slate-800 bg-slate-950/40 overflow-hidden shadow-premium">
      {/* HEADER */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-luxury-gold/90 flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-black" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-black tracking-tight text-lg truncate">AI Financial Coach</div>
            <div className="text-slate-400 text-xs">{headerSub}</div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {!booted ? null : (
          <>
            {/* quick context card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-slate-200 text-sm whitespace-pre-wrap">
              <div className="text-slate-400 text-[11px] font-black uppercase tracking-[0.25em] mb-2">
                Context (tự động)
              </div>
              {financialContext}
              {Object.keys(journeyProgress || {}).length > 0 ? (
                <div className="mt-3 text-slate-400 text-xs">
                  Ghi chú: JourneyProgress đang có dữ liệu, em có thể dùng để nhắc “thói quen tài chính hằng ngày” nếu Bác Sĩ muốn.
                </div>
              ) : null}
            </div>

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
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
              <div className="text-slate-400 text-sm animate-pulse">Đang phân tích dữ liệu và lập khuyến nghị...</div>
            ) : null}
          </>
        )}
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

        {!hasKey ? (
          <div className="mt-3 text-xs text-slate-500">
            Bác Sĩ tạo file <b>.env.local</b> ở root và thêm: <b>VITE_GEMINI_API_KEY=xxxxx</b> rồi restart dev server.
          </div>
        ) : null}
      </div>
    </div>
  );
};
