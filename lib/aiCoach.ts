import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Transaction, Asset, Liability, JourneyProgress, GoldenRule } from "../types";

// =========================
// TYPES
// =========================
export type AiCoachRole = "user" | "model";

export interface AiCoachMessage {
  role: AiCoachRole;
  text: string;
}

export interface AiCoachContextInput {
  transactions?: Transaction[];
  assets?: Asset[];
  liabilities?: Liability[];
  journeyProgress?: JourneyProgress;
  goldenRules?: GoldenRule[];
}

export interface AiCoachSendOptions {
  apiKey?: string; // default: import.meta.env.VITE_GEMINI_API_KEY
  model?: string; // default: "gemini-1.5-flash"
  maxOutputTokens?: number; // default: 700
  temperature?: number; // default: 0.6
  topP?: number; // default: 0.9
  maxRetries?: number; // default: 4
  initialBackoffMs?: number; // default: 900
  timeoutMs?: number; // default: 20000
  useDemoFallback?: boolean; // default: true
  systemStyle?: "default" | "strict"; // override systemStyle trong input nếu muốn
}

export interface AiCoachSendInput {
  userText: string;
  history?: AiCoachMessage[]; // các message trước đó (user/model)
  context?: AiCoachContextInput; // dữ liệu tài chính
  systemStyle?: "default" | "strict"; // strict: can ngăn tiêu sản mạnh hơn
  userLocale?: "vi-VN" | string; // default vi-VN
}

export interface AiCoachSendResult {
  ok: boolean;
  text: string;
  usedDemo: boolean;
  meta: {
    model: string;
    retries: number;
    reason?: string;
  };
}

// =========================
// SMART MODEL ROUTER (Option B)
// =========================
export type GeminiModel = "gemini-1.5-flash" | "gemini-1.5-pro";

export type ModelRoutingMode = "auto" | "flash" | "pro";

export interface ModelRouterOptions {
  mode?: ModelRoutingMode;              // default: "auto"
  flashModel?: GeminiModel;             // default: "gemini-1.5-flash"
  proModel?: GeminiModel;               // default: "gemini-1.5-pro"
  // ước lượng token theo ký tự (4 chars ~ 1 token là heuristic)
  longPromptTokenThreshold?: number;    // default: 1400
  veryLongPromptTokenThreshold?: number;// default: 2400
  maxModelSwitches?: number;            // default: 1
}

function estimateTokensFromText(s: string): number {
  const text = (s ?? "").trim();
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

function looksComplexUserQuery(userText: string): boolean {
  const t = (userText ?? "").toLowerCase();
  const keywords = [
    "chiến lược", "kế hoạch", "phân tích", "tối ưu", "đầu tư", "danh mục",
    "dòng tiền", "tài sản", "nợ", "thuế", "lãi suất", "kịch bản", "mô phỏng",
    "so sánh", "tổng hợp", "lộ trình", "90 ngày", "30 ngày", "hệ thống",
    "tự động", "mục tiêu", "cân bằng", "tối ưu hoá", "xây dựng"
  ];
  return keywords.some(k => t.includes(k));
}

function pickModelsByRouter(
  input: { financialContextText: string; userText: string },
  router?: ModelRouterOptions
): GeminiModel[] {
  const mode = router?.mode ?? "auto";
  const flash = router?.flashModel ?? "gemini-1.5-flash";
  const pro = router?.proModel ?? "gemini-1.5-pro";

  if (mode === "flash") return [flash, pro];
  if (mode === "pro") return [pro, flash];

  const ctxTok = estimateTokensFromText(input.financialContextText);
  const userTok = estimateTokensFromText(input.userText);
  const totalTok = ctxTok + userTok;

  const longTh = router?.longPromptTokenThreshold ?? 1400;
  const veryLongTh = router?.veryLongPromptTokenThreshold ?? 2400;

  const complex = looksComplexUserQuery(input.userText);

  // Heuristic:
  // - Rất dài => ưu tiên Pro
  // - Dài + câu hỏi “nặng” => Pro
  // - Còn lại => Flash
  if (totalTok >= veryLongTh) return [pro, flash];
  if (totalTok >= longTh && complex) return [pro, flash];

  return [flash, pro];
}

// =========================
// MONEY + DATE HELPERS
// =========================
const fmtMoney = (v: number, locale = "vi-VN") =>
  (Number.isFinite(v) ? Math.round(v) : 0).toLocaleString(locale);

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

// =========================
// CONTEXT BUILDER
// =========================
export function buildFinancialContextText(
  input: AiCoachContextInput,
  locale: string = "vi-VN"
) {
  const transactions = input.transactions ?? [];
  const assets = input.assets ?? [];
  const liabilities = input.liabilities ?? [];
  const goldenRules = input.goldenRules ?? [];

  const { start, end } = monthRangeISO(new Date());

  const txThisMonth = transactions.filter((t) => {
    const d = String((t as any).date || "");
    return d && isWithinISO(d, start, end);
  });

  const incomeThisMonth = safeSum(
    txThisMonth.filter((t) => t.type === "income").map((t) => t.amount)
  );
  const expenseThisMonth = safeSum(
    txThisMonth.filter((t) => t.type === "expense").map((t) => t.amount)
  );
  const cashflowThisMonth = incomeThisMonth - expenseThisMonth;

  const totalAssets = safeSum(assets.map((a) => a.value));
  const totalLiabilities = safeSum(liabilities.map((l) => l.amount));
  const netWorth = totalAssets - totalLiabilities;

  const ccDebt = safeSum(
    liabilities.filter((l) => (l as any).type === "credit_card").map((l) => l.amount)
  );
  const loanDebt = safeSum(
    liabilities
      .filter((l) => {
        const t = (l as any).type;
        return t === "loan" || t === "mortgage";
      })
      .map((l) => l.amount)
  );

  const rulesTotal = goldenRules.length;
  const rulesOk = goldenRules.filter((r) => (r as any).isCompliant).length;
  const rulesRate = rulesTotal > 0 ? Math.round((rulesOk / rulesTotal) * 100) : null;

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

  const lines: string[] = [];
  lines.push(`DỮ LIỆU TÀI CHÍNH (tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}):`);
  lines.push(`- Thu nhập tháng: ${fmtMoney(incomeThisMonth, locale)} đ`);
  lines.push(`- Chi tiêu tháng: ${fmtMoney(expenseThisMonth, locale)} đ`);
  lines.push(`- Dòng tiền ròng (cashflow): ${fmtMoney(cashflowThisMonth, locale)} đ`);
  lines.push("");
  lines.push("TÀI SẢN & NỢ:");
  lines.push(`- Tổng tài sản: ${fmtMoney(totalAssets, locale)} đ`);
  lines.push(`- Tổng nợ: ${fmtMoney(totalLiabilities, locale)} đ`);
  lines.push(`- Tài sản ròng: ${fmtMoney(netWorth, locale)} đ`);
  lines.push(`- Nợ thẻ tín dụng: ${fmtMoney(ccDebt, locale)} đ`);
  lines.push(`- Nợ vay/ thế chấp: ${fmtMoney(loanDebt, locale)} đ`);
  lines.push("");
  lines.push(
    `KỶ LUẬT (Golden Rules): ${rulesTotal > 0 ? `${rulesOk}/${rulesTotal} (${rulesRate}%)` : "chưa có dữ liệu"}`
  );

  if (jars) {
    lines.push("");
    lines.push("GỢI Ý PHÂN BỔ 6 CHIẾC LỌ (theo thu nhập tháng hiện tại):");
    lines.push(`- 45% Nhu cầu: ${fmtMoney(jars.needs55, locale)} đ`);
    lines.push(`- 20% Tự do tài chính: ${fmtMoney(jars.freedom10, locale)} đ`);
    lines.push(`- 10% Giáo dục: ${fmtMoney(jars.edu10, locale)} đ`);
    lines.push(`- 10% Hưởng thụ: ${fmtMoney(jars.play10, locale)} đ`);
    lines.push(`- 10% Khẩn cấp: ${fmtMoney(jars.emergency10, locale)} đ`);
    lines.push(`- 5% Cho đi: ${fmtMoney(jars.give5, locale)} đ`);
  }

  return lines.join("\n");
}

// =========================
// PROMPT BUILDER
// =========================
export function buildSystemPrompt(
  financialContextText: string,
  style: "default" | "strict" = "default"
) {
  const strictAddon =
    style === "strict"
      ? `
BỔ SUNG PHONG CÁCH "STRICT":
- Nếu người dùng muốn mua TIÊU SẢN khi cashflow âm/ yếu hoặc đang nợ thẻ: phản biện mạnh, đưa giới hạn cụ thể (VD: hoãn 30-90 ngày), kèm 2 phương án thay thế rẻ hơn.
`
      : "";

  return `
const AI_COACH_SYSTEM_PROMPT = `
Bạn là AI Financial Coach – trợ lý tài chính cá nhân trong ứng dụng Tài Chính Thông Minh.

NGUYÊN TẮC TƯ VẤN (bắt buộc):
1) Ưu tiên DÒNG TIỀN DƯƠNG (+). Nếu cashflow âm → ưu tiên giảm chi + tăng thu + chặn nợ xấu.
2) Phân biệt TÀI SẢN vs TIÊU SẢN:
   - Tài sản: tạo dòng tiền/ tăng giá trị dài hạn.
   - Tiêu sản: tiêu tiền, hao mòn, rủi ro nợ tiêu dùng.
   → Nếu người dùng muốn mua tiêu sản khi dòng tiền yếu: CAN NGĂN QUYẾT LIỆT và đưa phương án thay thế.
3) “6 chiếc lọ” là khung kỷ luật: hướng dẫn áp dụng theo thu nhập thực tế.
4) Không hứa hẹn làm giàu nhanh. Không khuyến nghị lĩnh vực người dùng không hiểu.
5) Kết thúc câu trả lời luôn có:
   - 1 câu chốt (kết luận)
   - 3 việc làm ngay trong 7 ngày
   - 1 câu hỏi ngược để chẩn đoán tiếp.
6) Phong cách:
- Chuyên nghiệp, trung lập, đáng tin cậy
- Giống một Financial Coach cá nhân, không giống bác sĩ hay người quen
`;
${strictAddon}

DỮ LIỆU NGƯỜI DÙNG:
${financialContextText}
`.trim();
}

// =========================
// DEMO FALLBACK
// =========================
export function buildDemoReply(financialContextText: string, userText: string) {
  return [
    `Tôi đã đọc câu hỏi: "${userText}"`,
    "",
    "Chốt 1 câu:",
    "- Ưu tiên đưa dòng tiền về dương và khóa các khoản “tiêu sản” trước khi nghĩ đến tối ưu đầu tư.",
    "",
    "3 việc làm ngay trong 7 ngày:",
    "1) Ghi lại 10 khoản chi nhỏ lẻ gần nhất → cắt 2 khoản không tạo giá trị (Latte factor).",
    "2) Áp quy tắc 6 chiếc lọ tối thiểu: trích 10% “Pay yourself first” ngay khi có thu nhập.",
    "3) Nếu đang có nợ tiêu dùng/lãi cao: lập kế hoạch trả nợ theo thứ tự lãi suất (cao → thấp).",
    "",
    "Câu hỏi ngược để chốt hướng đi:",
    "- Mục tiêu 90 ngày tới của bạn là: “tăng thu nhập” hay “giảm chi + trả nợ”?",
    "",
    "Dữ liệu tôi đang dựa vào:",
    financialContextText,
  ].join("\n");
}

// =========================
// ERROR + RETRY HELPERS
// =========================
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isQuota429(err: unknown) {
  const msg = (err instanceof Error ? err.message : String(err ?? "")).toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("resource_exhausted") ||
    msg.includes("too many requests")
  );
}

function isAuthError(err: unknown) {
  const msg = (err instanceof Error ? err.message : String(err ?? "")).toLowerCase();
  return msg.includes("api key") || msg.includes("permission") || msg.includes("unauthorized");
}

function withTimeout<T>(p: Promise<T>, timeoutMs: number) {
  if (!timeoutMs || timeoutMs <= 0) return p;
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Request timeout")), timeoutMs);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

// =========================
// MAIN API
// =========================
export async function aiCoachSend(
  input: AiCoachSendInput,
  opts: AiCoachSendOptions = {}
): Promise<AiCoachSendResult> {
  const {
    userText,
    history = [],
    context = {},
    systemStyle = opts.systemStyle ?? "default",
    userLocale = "vi-VN",
  } = input;

  const apiKey = opts.apiKey ?? (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const modelName = opts.model ?? "gemini-1.5-flash";

  const maxOutputTokens = Number.isFinite(opts.maxOutputTokens) ? (opts.maxOutputTokens as number) : 700;
  const temperature = Number.isFinite(opts.temperature) ? (opts.temperature as number) : 0.6;
  const topP = Number.isFinite(opts.topP) ? (opts.topP as number) : 0.9;

  const maxRetries = Number.isFinite(opts.maxRetries) ? (opts.maxRetries as number) : 4;
  const initialBackoffMs = Number.isFinite(opts.initialBackoffMs) ? (opts.initialBackoffMs as number) : 900;
  const timeoutMs = Number.isFinite(opts.timeoutMs) ? (opts.timeoutMs as number) : 20000;

  const useDemoFallback = opts.useDemoFallback !== false;

  const financialContextText = buildFinancialContextText(context, userLocale);
  const systemPrompt = buildSystemPrompt(financialContextText, systemStyle);

  // thiếu key → demo
  const hasKey = Boolean(apiKey && String(apiKey).trim().length > 10);
  if (!hasKey) {
    return {
      ok: true,
      text: buildDemoReply(financialContextText, userText),
      usedDemo: true,
      meta: { model: modelName, retries: 0, reason: "missing_api_key" },
    };
  }

  // chuẩn hoá history cho Gemini
  const safeHistory = Array.isArray(history) ? history : [];

const geminiHistory = [
  { role: "user" as const, parts: [{ text: systemPrompt }] },

  ...safeHistory
    .filter((m): m is AiCoachMessage => {
      return (
        !!m &&
        (m.role === "user" || m.role === "model") &&
        typeof m.text === "string" &&
        m.text.trim().length > 0
      );
    })
    .map((m) => ({
      role: m.role as "user" | "model",
      parts: [{ text: m.text }],
    })),
];


  let attempt = 0;
  let backoff = initialBackoffMs;

  while (attempt <= maxRetries) {
    try {
      const genAI = new GoogleGenerativeAI(String(apiKey));
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { maxOutputTokens, temperature, topP },
      });

      const chat = model.startChat({ history: geminiHistory });

      const result = await withTimeout(chat.sendMessage(userText), timeoutMs);
      const text = result.response.text()?.trim();

      if (!text) {
        return {
          ok: true,
          text: "Em chưa nhận được nội dung trả lời. Bác Sĩ hỏi lại giúp em 1 câu ngắn hơn.",
          usedDemo: false,
          meta: { model: modelName, retries: attempt },
        };
      }

      return {
        ok: true,
        text,
        usedDemo: false,
        meta: { model: modelName, retries: attempt },
      };
    } catch (err) {
      const quota = isQuota429(err);

      // lỗi auth → không retry nhiều
      if (isAuthError(err)) {
        if (useDemoFallback) {
          return {
            ok: true,
            text:
              "Em không gọi được AI do API key/ quyền truy cập chưa đúng. Tạm thời em trả lời theo chế độ Demo.\n\n" +
              buildDemoReply(financialContextText, userText),
            usedDemo: true,
            meta: { model: modelName, retries: attempt, reason: "auth_error" },
          };
        }
        return {
          ok: false,
          text: "API key/ quyền truy cập chưa đúng. Kiểm tra VITE_GEMINI_API_KEY.",
          usedDemo: false,
          meta: { model: modelName, retries: attempt, reason: "auth_error" },
        };
      }

      // retry khi 429/quota
      if (quota && attempt < maxRetries) {
        await sleep(backoff);
        backoff = Math.min(backoff * 2, 8000);
        attempt += 1;
        continue;
      }

      // hết retry hoặc lỗi khác → fallback
      if (useDemoFallback) {
        const reason = quota ? "quota_429" : "runtime_error";
        return {
          ok: true,
          text:
            (quota
              ? "Hiện đang bị giới hạn quota (429). Em chuyển sang chế độ Demo để vẫn tư vấn được.\n\n"
              : "Em gặp lỗi khi gọi AI. Em chuyển sang chế độ Demo để vẫn tư vấn được.\n\n") +
            buildDemoReply(financialContextText, userText),
          usedDemo: true,
          meta: { model: modelName, retries: attempt, reason },
        };
      }

      return {
        ok: false,
        text: err instanceof Error ? err.message : String(err),
        usedDemo: false,
        meta: { model: modelName, retries: attempt, reason: quota ? "quota_429" : "runtime_error" },
      };
    }
  }

  return {
    ok: false,
    text: "Unknown error",
    usedDemo: false,
    meta: { model: modelName, retries: maxRetries, reason: "unknown" },
  };
}
